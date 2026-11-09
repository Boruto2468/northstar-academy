'use client';
import {useEffect,useState} from 'react';import {useRouter} from 'next/navigation';import {api} from '@/client/auth';
type Exam={id:string;title:string;opensAt:string;closesAt:string;durationSeconds:number;attemptId:string|null;status:string|null};
export default function Exams(){const router=useRouter();const [exams,setExams]=useState<Exam[]>([]),[serverClock,setServerClock]=useState({at:0,mono:0}),[now,setNow]=useState(Date.now()),[error,setError]=useState(''),[busy,setBusy]=useState('');
 useEffect(()=>{api('/api/exams').then(x=>{const r=x as {serverTime:string;exams:Exam[]};setExams(r.exams);setServerClock({at:new Date(r.serverTime).getTime(),mono:performance.now()});}).catch(e=>setError(String(e)));const t=setInterval(()=>setNow(Date.now()),1000);return()=>clearInterval(t);},[]);
 const ms=serverClock.at+(performance.now()-serverClock.mono);void now;
 async function start(id:string){setBusy(id);setError('');try{const r=await api(`/api/exams/${id}/start`,{method:'POST'}) as {attemptId:string};router.push(`/attempts/${r.attemptId}`);}catch(e){setError(e instanceof Error?e.message:String(e));setBusy('');}}
 return <main className="assessment-shell"><p className="eyebrow">TEACHER-SET ASSESSMENTS</p><h1>Scheduled exams</h1><p>Times are displayed in West Africa Time (Africa/Lagos). The server controls when an exam starts, closes and releases results.</p>{error&&<p role="alert" className="assessment-error">{error}</p>}
 <div className="assessment-list">{exams.map(e=>{const opens=new Date(e.opensAt).getTime(),closes=new Date(e.closesAt).getTime(),remaining=Math.max(0,Math.ceil((opens-ms)/1000));return <article className="assessment-panel" key={e.id}><h2>{e.title}</h2><p>{new Date(e.opensAt).toLocaleString('en-NG',{timeZone:'Africa/Lagos',dateStyle:'medium',timeStyle:'short'})} – {new Date(e.closesAt).toLocaleString('en-NG',{timeZone:'Africa/Lagos',timeStyle:'short'})} WAT</p><p>Duration: {Math.round(e.durationSeconds/60)} minutes</p>
 {ms<opens?<p><strong>Opens in:</strong> {Math.floor(remaining/3600)}h {Math.floor(remaining%3600/60)}m {remaining%60}s</p>:ms>=closes?<p>Exam closed.</p>:<p>Exam open.</p>}
 {e.attemptId?<button className="primary" onClick={()=>router.push(`/attempts/${e.attemptId}`)}>{e.status==='submitted'?'View results when released':'Resume attempt'}</button>:<button className="primary" disabled={ms<opens||ms>=closes||!!busy} onClick={()=>start(e.id)}>{busy===e.id?'Opening…':'Start exam'}</button>}
 </article>})}{exams.length===0&&!error&&<p>No exams have been scheduled yet.</p>}</div></main>;
}
