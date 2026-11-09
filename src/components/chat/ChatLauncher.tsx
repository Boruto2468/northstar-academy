'use client';
import {useEffect,useState} from 'react';
import Link from 'next/link';
import {usePathname} from 'next/navigation';
import {MessageCircle,X,Send,ArrowLeft} from 'lucide-react';
import {api,sessionUser,type Viewer} from '@/client/auth';
import {TOPIC_WORDS,type ChatCategory} from '@/chat/policy';

type Thread={id:string;title:string;category:ChatCategory;status:string;unread:number;latest_message:string;updated_at:string};
type Message={id:string;sender_type:'student'|'teacher'|'ai';body:string;created_at:string;corrects_message_id:string|null};
const topicEntries=Object.keys(TOPIC_WORDS);
const titleCase=(s:string)=>s.replaceAll('-',' ').replace(/\b\w/g,c=>c.toUpperCase());
function browserActions():string[]{return [];} // Actual click history is collected by the effect, never typed input.
export default function ChatLauncher(){
 const path=usePathname();const [viewer,setViewer]=useState<Viewer|null>(null),[open,setOpen]=useState(false);
 const [threads,setThreads]=useState<Thread[]>([]),[selected,setSelected]=useState<string|null>(null),[messages,setMessages]=useState<Message[]>([]);
 const [category,setCategory]=useState<ChatCategory>('subject_question'),[topicId,setTopicId]=useState(''),[title,setTitle]=useState(''),[text,setText]=useState('');
 const [teacherAvailable,setTeacherAvailable]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState('');
 const [actions,setActions]=useState<string[]>(browserActions);
 useEffect(()=>{const sync=()=>{setViewer(sessionUser());setOpen(false);};sync();window.addEventListener('northstar-auth-changed',sync);return()=>window.removeEventListener('northstar-auth-changed',sync);},[]);
 useEffect(()=>{const onClick=(event:MouseEvent)=>{
  const el=event.target instanceof Element?event.target.closest('button,a'):null;
  if(!el||el.closest('.northstar-chat-panel'))return;
  const action=el.tagName==='A'?'Opened a page link':'Selected a page control';
  setActions(prev=>[...prev,`${action} on ${location.pathname}`].slice(-8));
 };document.addEventListener('click',onClick,true);return()=>document.removeEventListener('click',onClick,true);},[]);
 async function refreshList(){const data=await api('/api/chat/threads') as {threads:Thread[];teacherAvailable:boolean};setThreads(data.threads);setTeacherAvailable(data.teacherAvailable);}
 async function viewThread(id:string){const data=await api(`/api/chat/threads/${id}`) as {messages:Message[]};setSelected(id);setMessages(data.messages);}
 useEffect(()=>{if(!open||!viewer||viewer.role!=='student')return;void refreshList().catch(e=>setError(String(e)));},[open,viewer]);
 // Keep chat out of active attempts and their result review, but available on the assessment landing pages.
 if(/^\/attempts(\/|$)/.test(path))return null;
 const submitNew=async()=>{
  setBusy(true);setError('');setNotice('');try{
   const info=await api('/api/chat/threads',{method:'POST',body:JSON.stringify({category,title,message:text,topicId:topicId||undefined,pagePath:location.pathname,browser:navigator.userAgent.slice(0,160),lastActions:actions})}) as {id:string;aiReplied:boolean};
   setTitle('');setText('');setActions([]);await refreshList();await viewThread(info.id);
   if(!info.aiReplied&&category==='subject_question'&&!teacherAvailable)setNotice('Your message is logged for the teacher. AI is used only for simple curriculum questions when available.');
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 };
 const send=async()=>{
  if(!selected)return;setBusy(true);setError('');setNotice('');try{
   const result=await api(`/api/chat/threads/${selected}/messages`,{method:'POST',body:JSON.stringify({message:text})}) as {aiReplied:boolean};
   setText('');await viewThread(selected);await refreshList();if(!result.aiReplied&&!teacherAvailable)setNotice('Your message is saved for the teacher.');
  }catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}
 };
 return <>
  <button type="button" className="northstar-chat-trigger" aria-label={open?'Close messages':'Open messages'} aria-expanded={open} onClick={()=>setOpen(!open)}>{open?<X size={23}/>:<MessageCircle size={24}/>}</button>
  {open&&<section className="northstar-chat-panel" role="dialog" aria-modal="false" aria-label="Student and teacher messages">
    <header><strong>Messages</strong><button className="northstar-chat-icon" onClick={()=>setOpen(false)} aria-label="Close messages"><X size={18}/></button></header>
    {!viewer?<div className="northstar-chat-body"><p>Sign in to send a subject question or report a site problem.</p><Link className="primary northstar-chat-link" href="/login">Sign in</Link></div>:
     viewer.role==='teacher'?<div className="northstar-chat-body"><p>Manage student threads, availability and AI corrections from the teacher inbox.</p><Link className="primary northstar-chat-link" href="/teacher/inbox">Open teacher inbox</Link></div>:
     <>
      <div className="northstar-chat-presence" aria-live="polite">Teacher: {teacherAvailable?'Available':'Away'} · Messages are saved for your teacher</div>
      {selected?<><div className="northstar-chat-toolbar"><button onClick={()=>{setSelected(null);setMessages([]);setText('');setNotice('');}}><ArrowLeft size={16}/> Back to threads</button></div><div className="northstar-chat-messages">{messages.map(m=><article key={m.id} className={`northstar-chat-bubble ${m.sender_type}`}><span>{m.sender_type==='ai'?'AI assistant · may be corrected by teacher':m.sender_type==='teacher'?'Teacher':'You'}{m.corrects_message_id?' · Correction to AI reply':''}</span><p>{m.body}</p></article>)}</div></>:<div className="northstar-chat-body"><h3>New message</h3><label>Type<select value={category} onChange={e=>setCategory(e.target.value as ChatCategory)}><option value="subject_question">Subject question</option><option value="site_problem">Site problem</option></select></label><label>Topic {category==='subject_question'?'(required)':'(optional)'}<select value={topicId} onChange={e=>setTopicId(e.target.value)}><option value="">Choose a topic</option>{topicEntries.map(x=><option key={x} value={x}>{titleCase(x)}</option>)}</select></label><label>Subject<input value={title} maxLength={100} onChange={e=>setTitle(e.target.value)} placeholder={category==='site_problem'?'Example: Diagram not responding':'Example: Understanding osmosis'}/></label><p className="northstar-chat-small">Don't share phone numbers, addresses, passwords or other personal details. Site problems include your current page and basic browser info.</p><h3>Previous messages</h3>{threads.length?threads.map(t=><button className="northstar-chat-thread" key={t.id} onClick={()=>{setText('');void viewThread(t.id).catch(e=>setError(String(e)));}}><span>{t.title}</span><small>{t.status} {Number(t.unread)>0?`· ${t.unread} unread`:''}</small></button>):<p className="northstar-chat-small">No conversations yet.</p>}</div>}
      <div className="northstar-chat-compose"><label className="sr-only" htmlFor="northstar-chat-input">Your message</label><textarea id="northstar-chat-input" rows={3} maxLength={1400} value={text} onChange={e=>setText(e.target.value)} placeholder={selected?'Write a reply…':'Write your question or problem…'}/><div className="northstar-chat-send"><small>{text.length}/1400</small><button type="button" className="primary" disabled={busy||text.trim().length<2||(!selected&&(title.trim().length<3||(category==='subject_question'&&!topicId)))} onClick={()=>void (selected?send():submitNew())}><Send size={16}/> Send</button></div>{error&&<p role="alert" className="assessment-error">{error}</p>}{notice&&<p role="status" className="northstar-chat-small">{notice}</p>}</div>
     </>}
   </section>}
 </>;
}
