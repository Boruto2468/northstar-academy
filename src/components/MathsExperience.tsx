'use client';
import {useEffect,useMemo,useState} from 'react';
import type {Topic,Question} from '@/types/topic';
import {mathsChapters,type MathsSection} from '@/maths/catalogue';
import {buildQuestion,makeUniqueQuestion,paramsKey,answerKey,type Params,type GeneratedMathQuestion,type UsedRegistry} from '@/maths/generator';
import {checkAnswer} from '@/engine/answers';
import {localProgress} from '@/storage/progress';
import Celebration from './Celebration';
import Diagram from './Diagram';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type SavedQuestion={templateId:string;params:Params};
type Result={attempts:number;done:boolean;correct:boolean;rightFirstTime:boolean;revealed:boolean;input:string};
type SectionState={questions:SavedQuestion[];visible:number;results:Result[];startedAt:number;finishedAt?:number;examples:SavedQuestion[];exampleIndex:number;exampleStep:number};
const emptyResult=():Result=>({attempts:0,done:false,correct:false,rightFirstTime:false,revealed:false,input:''});
const fresh=():SectionState=>({questions:[],visible:0,results:[],startedAt:0,examples:[],exampleIndex:0,exampleStep:0});
const historyKey='northstar-maths-used-v4';
function readUsed():UsedRegistry{try{const x=JSON.parse(localStorage.getItem(historyKey)||'null');return x&&Array.isArray(x.ids)&&Array.isArray(x.parameterKeys)?x:{ids:[],parameterKeys:[]}}catch{return {ids:[],parameterKeys:[]}}}
function saveUsed(h:UsedRegistry){localStorage.setItem(historyKey,JSON.stringify(h));}
function random(){const bytes=new Uint32Array(1);if(typeof crypto!=='undefined'&&crypto.getRandomValues){crypto.getRandomValues(bytes);return bytes[0]/4294967296}return Math.random()}
function claim(template:string,stages:number[],context:'exercise'|'example',uniqueAnswers:boolean):GeneratedMathQuestion[]{
 const used=readUsed();const batch:GeneratedMathQuestion[]=[];const answers=new Set<string>();
 for(const stage of stages){const q=makeUniqueQuestion(template,stage,random,used,answers,context,candidate=>batch.some(previous=>rightAnswer(candidate.correctAnswer,previous)||rightAnswer(previous.correctAnswer,candidate)));if(!q)throw Error('This skill has exhausted its remaining unique questions. No repeated question was issued.');batch.push(q);used.ids.push(q.id);used.parameterKeys.push(paramsKey(q));if(uniqueAnswers)answers.add(answerKey(q.correctAnswer));}
 // Claim the complete batch atomically before presenting any questions.
 saveUsed(used);return batch;
}
function formula(latex:string){try{return katex.renderToString(latex,{throwOnError:false,displayMode:true})}catch{return latex}}
function rightAnswer(input:string,q:GeneratedMathQuestion){
 const candidate:Question={id:q.id,kind:'maths',level:'simple',prompt:q.promptText,answer:q.correctAnswer,hint:q.hint[0],solution:q.workedSolution};
 const trimmed=input.trim();if(q.templateId==='percent.as'&&trimmed.endsWith('%'))return checkAnswer(trimmed.slice(0,-1),candidate);
 return q.acceptedForms.some(form=>checkAnswer(trimmed,{...candidate,answer:form}));
}
function prettyTime(ms:number){const secs=Math.max(0,Math.floor(ms/1000));return `${Math.floor(secs/60)}m ${String(secs%60).padStart(2,'0')}s`}
function SectionView({chapter,section,index,total,topic}:{chapter:string;section:MathsSection;index:number;total:number;topic:Topic}){
 const storeKey=`northstar-maths-section-v4:${topic.id}:${section.id}`;
 const [state,setState]=useState<SectionState>(fresh);
 const [ready,setReady]=useState(false),[error,setError]=useState(''),[celebrate,setCelebrate]=useState(-1);
 const [settings,setSettings]=useState({animation:true,lowData:false});
 useEffect(()=>{try{const saved=localStorage.getItem(storeKey);if(saved){const data=JSON.parse(saved) as SectionState;if(Array.isArray(data.questions)&&Array.isArray(data.results)&&Array.isArray(data.examples))setState(data)}const prefs=JSON.parse(localStorage.getItem('northstar-settings')||'{}');setSettings({animation:prefs.animation!==false&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches,lowData:!!prefs.lowData})}catch{}setReady(true)},[storeKey]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storeKey,JSON.stringify(state))}catch{setError('Browser storage is full or unavailable. Save your work locally before creating another exercise set.')}},[ready,state,storeKey]);
 const all=useMemo(()=>state.questions.map(x=>buildQuestion(x.templateId,x.params)),[state.questions]);
 const ex=useMemo(()=>state.examples[state.exampleIndex]?buildQuestion(state.examples[state.exampleIndex].templateId,state.examples[state.exampleIndex].params,'example'):null,[state.examples,state.exampleIndex]);
 function examplesNext(){setError('');try{let next=state.exampleIndex+1;if(next<state.examples.length){setState(s=>({...s,exampleIndex:next,exampleStep:0}));return}const stage=[0,2,4,5][state.examples.length%4];const q=claim(section.kind,[stage],'example',false)[0];setState(s=>({...s,examples:[...s.examples,{templateId:q.templateId,params:q.params}],exampleIndex:s.examples.length,exampleStep:0}))}catch(e){setError(String(e instanceof Error?e.message:e))}}
 function startSet(){setError('');try{const questions=claim(section.kind,[0,1,2,3,4,5],'exercise',true);setState(s=>({...s,questions:questions.map(q=>({templateId:q.templateId,params:q.params})),visible:1,results:questions.map(emptyResult),startedAt:Date.now(),finishedAt:undefined}));setCelebrate(-1)}catch(e){setError(String(e instanceof Error?e.message:e))}}
 function setInput(i:number,val:string){setState(s=>({...s,results:s.results.map((r,j)=>i===j?{...r,input:val}:r)}))}
 function check(i:number){const q=all[i],result=state.results[i];if(!q||!result||result.done||!result.input.trim())return;const ok=rightAnswer(result.input,q);const attempts=result.attempts+1;const revealed=!ok&&attempts>=4;
 setState(s=>{const results=s.results.map((r,j)=>j===i?{...r,attempts,done:ok||revealed,correct:ok,rightFirstTime:ok&&attempts===1,revealed,}:r);return {...s,results}});
 if(ok){setCelebrate(i)}
 try{const progress=localProgress.read();const prev=progress[topic.id]||{score:0,streak:0,bestLevel:'simple',needsPractice:[],lastPractised:0,attempts:0};const key=q.id;const tier=q.tier==='challenge'?'hard':q.tier==='developing'?'intermediate':'simple';const streak=ok?prev.streak+1:0;progress[topic.id]={...prev,attempts:prev.attempts+1,score:prev.score+(ok?10:0),streak,bestLevel:tier==='hard'||(tier==='intermediate'&&prev.bestLevel==='simple')?tier:prev.bestLevel,needsPractice:ok?prev.needsPractice.filter(x=>x!==key):Array.from(new Set([...prev.needsPractice,key])).slice(-80),lastPractised:Date.now()};localProgress.write(progress)}catch{}
 }
 function showNext(i:number){if(!state.results[i]?.done)return;const next=i+2;setState(s=>({...s,visible:Math.max(s.visible,next),finishedAt:next>all.length?Date.now():undefined}));setCelebrate(-1);if(next<=all.length)requestAnimationFrame(()=>document.getElementById(`${topic.id}-${section.id}-q${i+2}`)?.scrollIntoView({behavior:'smooth',block:'center'}))}
 const complete=state.finishedAt!==undefined&&state.visible>=all.length&&state.results.every(x=>x.done);
 const answered=state.results.filter(r=>r.done).length;
 const rightFirst=state.results.filter(r=>r.rightFirstTime).length;
 return <article className="maths-law" id={`law-${section.id}`}>
 <header className="maths-law-header"><span className="eyebrow">RULE {index+1} OF {total} · {chapter}</span><h2>{section.title}</h2><p>{section.rule}</p><div className="maths-formula" dangerouslySetInnerHTML={{__html:formula(section.latex)}}/><p className="maths-teacher-note">{section.notes}</p></header>
 <div className="maths-worked"><div className="maths-worked-header"><h3>Worked examples</h3><span>Predict each step before revealing it.</span></div>
 {ex?<div className="maths-example"><p className="maths-example-question">{ex.promptText}</p><div className="maths-steps">{ex.workedSolution.slice(0,state.exampleStep).map((step,j)=><p key={j}><strong>{j+1}.</strong> {step}</p>)}</div><div className="actions"><button className="primary" disabled={state.exampleStep>=ex.workedSolution.length} onClick={()=>setState(s=>({...s,exampleStep:Math.min(s.exampleStep+1,ex.workedSolution.length)}))}>Reveal next step →</button><button className="secondary" onClick={examplesNext}>Show me another ↻</button></div><span className="maths-step-count">{state.exampleStep} / {ex.workedSolution.length} steps · Example {state.exampleIndex+1}</span></div>:<button className="primary" disabled={!ready} onClick={examplesNext}>Open the first worked example →</button>}</div>
 <div className="maths-exercises"><div className="maths-exercises-header"><div><span className="eyebrow">GRADED PRACTICE</span><h3>Exercises: {section.title}</h3><p>Six questions, one at a time. The first two establish the rule, the next two combine steps, and the final two require more planning.</p></div>{state.questions.length>0&&<span className="maths-progress-label">{answered}/{all.length} complete</span>}</div>
 {state.questions.length===0?<button className="primary" disabled={!ready} onClick={startSet}>Start the exercise set →</button>:<div className="maths-question-stack">{all.slice(0,state.visible).map((q,i)=>{const result=state.results[i];if(!result)return null;const isLatest=i===state.visible-1;const last=i===all.length-1;return <div id={`${topic.id}-${section.id}-q${i+1}`} className={`maths-question ${result.done?'maths-question-done':''}`} key={q.id}>
 <div className="maths-question-meta"><span>QUESTION {i+1} OF {all.length}</span><span>{q.tier==='foundation'?'Foundations':q.tier==='developing'?'Developing':'Challenge'}</span></div><h4>{q.promptText}</h4>
 {result.done?<div className="maths-previous-answer"><strong>{result.correct?'Correct':'Method revealed'}</strong> · Your response: {result.input||'—'} · Answer: {q.correctAnswer}</div>:<><label className="maths-answer-label" htmlFor={`${topic.id}-${section.id}-answer-${i}`}>Your answer</label><input id={`${topic.id}-${section.id}-answer-${i}`} value={result.input} onChange={e=>setInput(i,e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check(i)}} autoComplete="off" placeholder="Type an equivalent answer"/><div className="actions"><button className="primary" disabled={!result.input.trim()} onClick={()=>check(i)}>Check answer →</button></div></>}
 {result.attempts>0&&!result.done&&<p className="maths-hint" role="status"><strong>{result.attempts===1?'Hint 1':result.attempts===2?'Hint 2':'Check your method'}:</strong> {result.attempts===1?q.hint[0]:result.attempts===2?q.hint[1]:'Revisit the stated rule and verify each operation in order. One more attempt before the walkthrough.'}</p>}
 {result.done&&result.revealed&&<div className="maths-solution"><strong>Worked solution</strong>{q.workedSolution.map((step,j)=><p key={j}>{j+1}. {step}</p>)}</div>}
 {result.done&&!result.revealed&&<button className="maths-show-solution" onClick={()=>setState(s=>({...s,results:s.results.map((r,j)=>j===i?{...r,revealed:true}:r)}))}>Review the worked solution</button>}
 {result.done&&celebrate===i&&settings.animation&&!settings.lowData&&<Celebration subject="maths" variant={i}/>}
 {result.done&&isLatest&&!complete&&<div className="maths-next"><button className="primary" onClick={()=>showNext(i)}>{last?'Finish section and see summary →':'Next question ↓'}</button></div>}
 </div>})}</div>}
 {complete&&<div className="maths-summary" role="status"><h4>Section complete</h4><p><strong>{rightFirst} / {all.length}</strong> correct on the first attempt · <strong>{prettyTime((state.finishedAt||0)-state.startedAt)}</strong> elapsed</p><p>Read back over any worked solutions you needed before moving on.</p>{index+1<total?<a href={`#law-${mathsChapters[topic.id][index+1].id}`} className="primary maths-anchor">Next section: {mathsChapters[topic.id][index+1].title} →</a>:<a href="#maths-top" className="primary maths-anchor">Review this topic ↑</a>}<button className="secondary" onClick={startSet}>Try a fresh set (new questions)</button></div>}
 {error&&<p className="maths-error" role="alert">{error}</p>}</div>
 </article>;
}
export default function MathsExperience({topic}:{topic:Topic}){
 const sections=mathsChapters[topic.id]||[];
 return <div id="maths-top" className="maths-textbook"><section className="lesson-section"><span className="eyebrow">A COURSE OF RULES, EXAMPLES AND EXERCISES</span><h2>Understand the rule. Then prove you can use it.</h2><p className="lead">{topic.intro} Each section begins with the rule and several worked examples. Exercises progress from straightforward calculations to linked problems; there are no difficulty buttons.</p><nav className="maths-section-nav" aria-label="Maths laws and skills">{sections.map((s,i)=><a href={`#law-${s.id}`} key={s.id}>{String(i+1).padStart(2,'0')} · {s.title}</a>)}</nav>{topic.diagram&&<Diagram diagram={topic.diagram}/>}</section>{sections.map((s,i)=><SectionView key={`${topic.id}-${s.id}`} topic={topic} chapter={topic.title} section={s} index={i} total={sections.length}/>)}</div>;
}
