'use client';
import {useCallback,useEffect,useRef,useState} from 'react';import Link from 'next/link';
import {api} from '@/client/auth';import type {ItemPublic,ItemSecret} from '@/assessment/items';
type ItemView={id:string;position:number;topic:string;subtopic:string;itemType:'objective'|'theory';marks:number;question:ItemPublic;response:Record<string,string>;grade?:{points:number;maxPoints:number;parts:Array<{key:string;correct:boolean;studentInput:string;correctAnswer:string;points:number;marks:number;criterion:string}>};answer?:string;workedSolution?:string[];markingScheme?:ItemSecret['markingScheme'];commonWrongAnswers?:ItemSecret['commonWrongAnswers']};
type Snapshot={serverTime:string;attempt:{id:string;kind:'test'|'exam';title:string;status:string;startedAt:string;deadlineAt:string;submittedAt:string|null;resultsAvailable:boolean;score?:number;maxScore?:number};items:ItemView[]};
function clock(ms:number){const sec=Math.max(0,Math.ceil(ms/1000));return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}:${String(sec%60).padStart(2,'0')}`;}
export default function AssessmentRunner({attemptId}:{attemptId:string}){
 const [data,setData]=useState<Snapshot|null>(null),[error,setError]=useState(''),[active,setActive]=useState(0),[tick,setTick]=useState(Date.now()),[offset,setOffset]=useState(0),[saving,setSaving]=useState(false),[submitting,setSubmitting]=useState(false);
 const serverClock=useRef({at:0,mono:0});
 const pending=useRef<Record<string,Record<string,string>>>({});const timer=useRef<ReturnType<typeof setTimeout>|null>(null);const flushPromise=useRef<Promise<void>|null>(null);
 const reload=useCallback(async()=>{const result=await api(`/api/attempts/${attemptId}`) as Snapshot;serverClock.current={at:new Date(result.serverTime).getTime(),mono:performance.now()};setOffset(0);setData(result);return result;},[attemptId]);
 useEffect(()=>{reload().catch(e=>setError(e instanceof Error?e.message:String(e)));const id=setInterval(()=>setTick(Date.now()),500);return()=>clearInterval(id);},[reload]);
 useEffect(()=>{const onHide=()=>{
  const queued=pending.current;
  for(const [itemId,response] of Object.entries(queued)){
   const token=sessionStorage.getItem('northstar-tab-session-v1');
   try{const access=token?JSON.parse(token).accessToken:null;if(!access)continue;
    void fetch(`/api/attempts/${attemptId}/answer`,{method:'POST',keepalive:true,headers:{'Content-Type':'application/json',Authorization:`Bearer ${access}`},body:JSON.stringify({itemId,response})});
   }catch{}
  }
 };window.addEventListener('pagehide',onHide);return()=>window.removeEventListener('pagehide',onHide);},[attemptId]);
 // Exam events are informative logs only. There is no blocking or punitive action.
 useEffect(()=>{if(data?.attempt.kind!=='exam'||data.attempt.status!=='in_progress')return;
  const report=(event:string)=>{void api(`/api/attempts/${attemptId}/events`,{method:'POST',body:JSON.stringify({event})}).catch(()=>{});};
  const visibility=()=>report(document.hidden?'tab_hidden':'tab_visible');const blur=()=>report('window_blur');const focus=()=>report('window_focus');
  document.addEventListener('visibilitychange',visibility);window.addEventListener('blur',blur);window.addEventListener('focus',focus);
  return()=>{document.removeEventListener('visibilitychange',visibility);window.removeEventListener('blur',blur);window.removeEventListener('focus',focus);};
 },[attemptId,data?.attempt.kind,data?.attempt.status]);
 const flush=useCallback(async()=>{
  if(flushPromise.current)return flushPromise.current;
  const running=(async()=>{
   setSaving(true);try{
    while(Object.keys(pending.current).length){const batch=pending.current;pending.current={};
     for(const [id,response] of Object.entries(batch)){
      try{await api(`/api/attempts/${attemptId}/answer`,{method:'POST',body:JSON.stringify({itemId:id,response})});}
      catch(e){pending.current[id]=response;throw e;}
     }
    }
   }catch(e){setError('Autosave failed: '+(e instanceof Error?e.message:String(e)));throw e;}
   finally{setSaving(false);}
  })();flushPromise.current=running;
  try{await running;}finally{flushPromise.current=null;}
 },[attemptId]);
 function edit(itemId:string,key:string,value:string){
  setData(old=>old?{...old,items:old.items.map(it=>it.id===itemId?{...it,response:{...it.response,[key]:value}}:it)}:old);
  const current=pending.current[itemId]||data?.items.find(it=>it.id===itemId)?.response||{};
  pending.current[itemId]={...current,[key]:value};
  if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>{void flush();},500);
 }
 const expire=useRef(false);
 useEffect(()=>{if(!data||data.attempt.status!=='in_progress')return;
  if(serverClock.current.at+(performance.now()-serverClock.current.mono)>=new Date(data.attempt.deadlineAt).getTime()&&!expire.current){expire.current=true;
   void (async()=>{if(timer.current)clearTimeout(timer.current);try{await flush();}catch{}try{await api(`/api/attempts/${attemptId}/submit`,{method:'POST'});}catch{}await reload().catch(()=>{});})();}
 },[tick,offset,data,flush,reload,attemptId]);
 async function submit(){if(!confirm('Submit your answers now? You will not be able to change them afterward.'))return;
  setSubmitting(true);setError('');if(timer.current)clearTimeout(timer.current);try{await flush();}catch{setSubmitting(false);return;}
  try{await api(`/api/attempts/${attemptId}/submit`,{method:'POST'});await reload();}
  catch(e){setError(e instanceof Error?e.message:String(e));}finally{setSubmitting(false);}
 }
 if(!data)return <main className="assessment-shell"><h1>Loading assessment</h1>{error?<p role="alert" className="assessment-error">{error}</p>:<p>Restoring your saved questions and answers.</p>}<Link href="/exams">Back to exams</Link></main>;
 const attempt=data.attempt,finished=attempt.status==='submitted',remaining=new Date(attempt.deadlineAt).getTime()-(serverClock.current.at+(performance.now()-serverClock.current.mono)),item=data.items[active];
 const durationMs=new Date(attempt.submittedAt||new Date().toISOString()).getTime()-new Date(attempt.startedAt).getTime();
 const firstTry=data.items.filter(it=>it.grade?.points===it.marks).length;
 const totals=data.items.reduce((o,it)=>{o[it.subtopic]??={total:0,points:0};o[it.subtopic].total+=it.marks;o[it.subtopic].points+=(it.grade?.points||0);return o;},{} as Record<string,{total:number;points:number}>);
 const scoreKnown=finished&&attempt.resultsAvailable;
 return <main className="assessment-shell"><div className="assessment-sticky"><div><p className="eyebrow">{attempt.kind==='exam'?'SUPERVISED EXAM':'TIMED TEST'}</p><strong>{attempt.title}</strong></div><div aria-live="polite" className={`assessment-clock ${remaining<60000?'urgent':''}`}>{finished?'SUBMITTED':clock(remaining)}</div><div className="assessment-save-status">{saving?'Saving…':error?'Save error':'Autosave on'}</div></div>
 {error&&<p role="alert" className="assessment-error">{error}</p>}
 {finished?<section className="assessment-panel"><h1>{scoreKnown?'Your results':'Submitted'}</h1>{scoreKnown?<><div className="assessment-score"><strong>{attempt.score}/{attempt.maxScore}</strong><span>marks earned</span></div><p>Questions right on submission: <strong>{firstTry}/{data.items.length}</strong> · Time taken: <strong>{Math.floor(Math.max(0,durationMs)/60000)}m {Math.floor((Math.max(0,durationMs)%60000)/1000)}s</strong></p><h2>Review by skill</h2><div className="assessment-review-skills">{Object.entries(totals).map(([k,v]:[string,{total:number;points:number}])=><p key={k}><strong>{k.replaceAll('-',' ')}</strong>: {v.points}/{v.total} marks</p>)}</div></>:<p>Your answers were submitted. Your teacher has not released the exam results yet. Return here after the scheduled release time.</p>}
 <div className="assessment-review">{data.items.map((it,i)=><section className="assessment-question" key={it.id}><h3>Question {i+1} · {it.subtopic.replaceAll('-',' ')}</h3><p>{it.question.itemType==='theory'?it.question.fields?.map(f=>f.prompt).join(' · '):it.question.prompt}</p><p><strong>Your exact input:</strong> {Object.entries(it.response||{}).map(([k,v]:[string,string])=><span key={k}><code>{k}: {v||'Blank'}</code>{' '}</span>)}</p>
 {scoreKnown&&<><p className={it.grade?.points===it.marks?'assessment-correct':'assessment-incorrect'}><strong>Verdict:</strong> {it.grade?.points===it.marks?'Full marks':it.grade?.points===0?'No marks':'Partially correct'} · {it.grade?.points}/{it.marks} marks</p>{it.grade?.parts.map((part,j)=><p key={j}><strong>{part.criterion}</strong> — Your answer: <code>{part.studentInput||'Blank'}</code> · Correct: <code>{part.correctAnswer}</code> ({part.points}/{part.marks})</p>)}
 {it.grade?.parts.some(p=>!p.correct)&&<p><strong>Likely mistake:</strong> {it.commonWrongAnswers?.find(m=>it.grade?.parts.some(p=>p.studentInput.trim()===m.value.trim()))?.reason||'Check the method used. See the worked solution below.'}</p>}
 <details><summary>Worked solution</summary><ol>{it.workedSolution?.map((x,j)=><li key={j}>{x}</li>)}</ol></details></>}
 </section>)}</div>{attempt.kind==='exam'?<Link href="/exams" className="primary assessment-link">Exam list</Link>:<Link href="/tests" className="primary assessment-link">New practice test</Link>}</section>:<>
 <div className="assessment-steps" aria-label="Questions">{data.items.map((it,i)=><button type="button" className={i===active?'active':''} key={it.id} onClick={()=>{if(timer.current)clearTimeout(timer.current);void flush();setActive(i);}} aria-current={i===active?'step':undefined}>{i+1}{Object.values(it.response||{}).some((v:unknown)=>typeof v==='string'&&v.trim().length>0)?' •':''}</button>)}</div>
 {item&&<section className="assessment-panel assessment-paper"><p className="eyebrow">QUESTION {active+1} OF {data.items.length} · {item.marks} MARKS</p><p className="assessment-topic">{item.topic.replaceAll('-',' ')} / {item.subtopic.replaceAll('-',' ')}</p>
 <h1 className="assessment-prompt">{item.question.prompt}</h1>{item.itemType==='objective'?<fieldset className="assessment-options"><legend>Choose one answer</legend>{item.question.options?.map(opt=><label key={opt.id}><input type="radio" name={`choice-${item.id}`} checked={item.response?.choice===opt.id} onChange={()=>edit(item.id,'choice',opt.id)}/><span>{opt.text}</span></label>)}</fieldset>:<>{item.question.fields?.map(field=><div className="assessment-field" key={field.key}><label htmlFor={`${item.id}-${field.key}`}><strong>{field.label}</strong><p>{field.prompt}</p></label><input id={`${item.id}-${field.key}`} inputMode="text" autoComplete="off" value={item.response?.[field.key]||''} onChange={e=>edit(item.id,field.key,e.target.value)} placeholder="Write your final answer"/><div className="assessment-mini-keypad">{['−','×','÷','^','√','(',')','/'].map(k=><button key={k} type="button" onClick={()=>edit(item.id,field.key,(item.response?.[field.key]||'')+k)}>{k}</button>)}</div></div>)}</>}
 <div className="assessment-actions"><button className="secondary" disabled={active===0} onClick={()=>{if(timer.current)clearTimeout(timer.current);void flush();setActive(i=>i-1);}}>Previous</button><button className="secondary" disabled={active===data.items.length-1} onClick={()=>{if(timer.current)clearTimeout(timer.current);void flush();setActive(i=>i+1);}}>Next</button></div></section>}
 <div className="assessment-submit"><p>No answers or solutions are shown until the assessment is submitted{attempt.kind==='exam'?' and your teacher releases the results':''}.</p><button className="primary" disabled={submitting} onClick={submit}>{submitting?'Submitting…':'Submit test / exam'}</button></div></>}
 </main>;
}
