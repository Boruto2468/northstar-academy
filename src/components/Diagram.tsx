'use client';
import {useEffect,useState} from 'react';
import DiagramHighlight from './DiagramHighlight';import type {Diagram as D} from '@/types/topic';
const region=(type:string,id:string,index:number,total:number)=>{
 if(type==='venn'){
  const n=id.toLowerCase();
  if(n.includes('middle')||n.includes('intersect')||n.includes('both'))return {x:220,y:119,rx:42,ry:70};
  if(n.includes('left')||n.includes('only-a')||n==='a')return {x:147,y:119,rx:36,ry:63};
  if(n.includes('right')||n.includes('only-b')||n==='b')return {x:293,y:119,rx:36,ry:63};
  if(n.includes('outside')||n.includes('complement'))return {x:48,y:46,rx:25,ry:22};
  return [{x:147,y:119,rx:36,ry:63},{x:220,y:119,rx:42,ry:70},{x:293,y:119,rx:36,ry:63}][index%3];
 }
 if(type==='diffusion')return index%2?{x:320,y:118,rx:82,ry:88}:{x:115,y:118,rx:82,ry:88};
 if(type==='plant'){
  const k=id.toLowerCase();
  if(k.includes('leaf'))return {x:110,y:65,rx:55,ry:22};
  if(k.includes('stoma'))return {x:330,y:64,rx:30,ry:20};
  if(k.includes('root'))return {x:220,y:207,rx:48,ry:23};
 }
 if(type==='transport'){
  if(id.toLowerCase().includes('xylem'))return {x:210,y:151,rx:12,ry:56};
  if(id.toLowerCase().includes('phloem'))return {x:235,y:151,rx:12,ry:56};
 }
 if(type==='cell')return [{x:220,y:115,rx:55,ry:49},{x:130,y:75,rx:22,ry:15},{x:220,y:120,rx:160,ry:90}][index%3];
 return {x:75+index*(290/Math.max(1,total-1)),y:120,rx:28,ry:26};
};
export default function Diagram({diagram}: {diagram:D}){const [active,setActive]=useState<string|null>(null),[playing,setPlaying]=useState(true),[step,setStep]=useState(0);const selected=diagram.labels.find(x=>x.id===active);useEffect(()=>{if(!playing)return;const timer=setInterval(()=>setStep(s=>s+1),750);return ()=>clearInterval(timer)},[playing]);return <div className="diagram"><div className="diagram-top"><strong>Explore the diagram</strong><div className="control-row"><button onClick={()=>setPlaying(!playing)}>{playing?'Pause':'Play'}</button><button onClick={()=>{setPlaying(false);setStep(s=>s+1)}}>Step →</button></div></div><svg viewBox="0 0 440 240" role="img" aria-label={`${diagram.type} interactive diagram`} className="diagram-svg">{diagram.type==='venn'?<><rect x="12" y="12" width="416" height="216" rx="12" fill="#e8f1f7" stroke="#6684a3"/><circle cx="175" cy="119" r="90" fill="#7e9ce3" fillOpacity=".4" stroke="#4264b2" strokeWidth="3"/><circle cx="265" cy="119" r="90" fill="#f6b973" fillOpacity=".4" stroke="#b97836" strokeWidth="3"/><text x="125" y="125" fontSize="18">A</text><text x="303" y="125" fontSize="18">B</text></>:diagram.type==='cell'?<><ellipse cx="220" cy="120" rx="172" ry="100" fill="#b7dfd1" stroke="#287f74" strokeWidth="5"/><ellipse cx="220" cy="115" rx="55" ry="49" fill="#a7a0d7" stroke="#64559e" strokeWidth="3"/><circle cx="220" cy="115" r="17" fill="#6d5ca6"/>{[0,1,2,3].map(i=><ellipse key={i} cx={115+i*66} cy={i%2?173:67} rx="20" ry="9" fill="#e2a36c" stroke="#a76537" strokeWidth="2"/>)}</>:diagram.type==='diffusion'?<><rect x="18" y="18" width="404" height="204" rx="12" fill="#e4f3f3"/><path d="M220 20 V220" stroke="#398b98" strokeWidth="8" strokeDasharray="12 8"/>{Array.from({length:24},(_,i)=><circle key={i} cx={(i<18?25+(i*37)%170:235+(i*29)%170)+(playing?Math.sin(i*3+step)*7:0)} cy={30+(i*43)%175} r="7" fill="#ea9370"/>)}</>:<><path d="M220 194 V63 M220 130 Q125 130 110 70 M220 130 Q315 130 330 70" stroke="#538f65" strokeWidth="16" strokeLinecap="round" fill="none"/><ellipse cx="110" cy="65" rx="65" ry="26" transform="rotate(-25 110 65)" fill="#86bb83"/><ellipse cx="330" cy="65" rx="65" ry="26" transform="rotate(25 330 65)" fill="#86bb83"/>{diagram.type==='plant'?<><path d="M220 192 Q192 211 165 220 M220 192 Q243 213 278 225 M220 194V230" fill="none" stroke="#a17d54" strokeWidth="7" strokeLinecap="round"/><g transform="translate(330 64)"><ellipse cx="-12" cy="0" rx="9" ry="14" fill="#367f52"/><ellipse cx="12" cy="0" rx="9" ry="14" fill="#367f52"/><rect x="-2" y="-10" width="4" height="20" rx="2" fill="#e6f6e8"/></g><text x="286" y="103" fontSize="10" fill="#355b42">Stoma inset</text></>:<><path d="M210 189V90" stroke="#5ba9d6" strokeWidth="7" strokeDasharray="7 5"/><path d="M235 92v96" stroke="#e6b45f" strokeWidth="7" strokeDasharray="7 5"/><text x="18" y="222" fontSize="11" fill="#377da5">Blue: water ↑</text><text x="308" y="222" fontSize="11" fill="#986a2f">Gold: sugars ↕</text>{[0,1,2].map(i=><circle key={i} cx="210" cy={182-i*38-(playing?step%3*4:0)} r="5" fill="#e4f6ff"/>)}</>}</>}<DiagramHighlight shape={selected?region(diagram.type,selected.id,diagram.labels.findIndex(l=>l.id===selected.id),diagram.labels.length):null} label={selected?.name||''} viewWidth={440} viewHeight={240}/></svg><div className="diagram-labels">{diagram.labels.map(l=><button className={active===l.id?'selected':''} aria-pressed={active===l.id} key={l.id} onClick={()=>setActive(l.id)}>{l.name}</button>)}</div><div className="diagram-detail" aria-live="polite">{selected?<><strong>{selected.name}</strong> — {selected.description}</>:'Tap a label to discover what it does.'}</div></div>}
