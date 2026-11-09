'use client';
import {useEffect,useMemo,useState} from 'react';
import type {Topic} from '@/types/topic';
import {mathsChapters,type MathsSection} from '@/maths/catalogue';
import {buildQuestion,makeUniqueQuestion,paramsKey,answerKey,type Params,type GeneratedMathQuestion,type UsedRegistry} from '@/maths/generator';
import {markFinalAnswer,numericallyEquivalent,recogniseMistake} from '@/maths/answerValidation';
import {emptyResult,registerSubmission,summarise,missedStages,type QuestionResult,type SavedQuestion,type ReviewSnapshot} from '@/maths/review';
import {localProgress} from '@/storage/progress';
import Celebration from './Celebration';
import Diagram from './Diagram';
import katex from 'katex';
import 'katex/dist/katex.min.css';

type OldSavedQuestion={templateId:string;params:Params};
type SectionState={questions:SavedQuestion[];visible:number;results:QuestionResult[];startedAt:number;finishedAt?:number;examples:SavedQuestion[];exampleIndex:number;exampleStep:number;pastReviews:ReviewSnapshot[]};
const fresh=():SectionState=>({questions:[],visible:0,results:[],startedAt:0,examples:[],exampleIndex:0,exampleStep:0,pastReviews:[]});
const historyKey='northstar-maths-used-v4';
function readUsed():UsedRegistry{try{const x=JSON.parse(localStorage.getItem(historyKey)||'null');return x&&Array.isArray(x.ids)&&Array.isArray(x.parameterKeys)?x:{ids:[],parameterKeys:[]}}catch{return {ids:[],parameterKeys:[]}}}
function saveUsed(h:UsedRegistry){localStorage.setItem(historyKey,JSON.stringify(h));}
function random(){const bytes=new Uint32Array(1);if(typeof crypto!=='undefined'&&crypto.getRandomValues){crypto.getRandomValues(bytes);return bytes[0]/4294967296}return Math.random()}
function questionSnapshot(q:GeneratedMathQuestion):SavedQuestion{return {seed:q.seed,createdAt:Date.now(),snapshot:JSON.parse(JSON.stringify(q)) as GeneratedMathQuestion}}
function claim(template:string,stages:number[],context:'exercise'|'example'):SavedQuestion[]{
 const used=readUsed(),batch:GeneratedMathQuestion[]=[],answers=new Set<string>();
 for(const stage of stages){
  const q=makeUniqueQuestion(template,stage,random,used,answers,context,candidate=>batch.some(previous=>{
   if(candidate.answerSpec.kind==='ratio'||previous.answerSpec.kind==='ratio')return candidate.correctAnswer===previous.correctAnswer;
   return numericallyEquivalent(candidate.correctAnswer,previous.correctAnswer);
  }));
  if(!q)throw Error('This rule has exhausted its unique questions in this browser. Your earlier questions have not been repeated.');
  batch.push(q);used.ids.push(q.id);used.parameterKeys.push(paramsKey(q));answers.add(answerKey(q.correctAnswer));
 }
 // All questions are claimed at once; the question snapshot is then saved independently.
 saveUsed(used);return batch.map(questionSnapshot);
}
function formula(latex:string){try{return katex.renderToString(latex,{throwOnError:false,displayMode:true})}catch{return latex}}
function prettyTime(ms:number){const secs=Math.max(0,Math.floor(ms/1000));return `${Math.floor(secs/60)}m ${String(secs%60).padStart(2,'0')}s`}
function isSnapshot(q:unknown):q is SavedQuestion{return !!q&&typeof q==='object'&&'snapshot' in q&&'createdAt' in q}
function migrateResult(r:Partial<QuestionResult>|undefined):QuestionResult{
 const empty=emptyResult();if(!r)return empty;
 const result={...empty,...r,submissions:Array.isArray(r.submissions)?r.submissions:[],stepVerified:Array.isArray(r.stepVerified)?r.stepVerified:[],stepInputs:Array.isArray(r.stepInputs)?r.stepInputs:[]};
 // Old result data cannot reconstruct past submissions. Preserve its last known answer,
 // but do not invent detailed attempts or classify earlier inputs as actually submitted.
 return result;
}
function loadSection(storeKey:string,legacyKey:string):SectionState|null{
 try{
  const current=localStorage.getItem(storeKey),older=!current?localStorage.getItem(legacyKey):null;
  const raw=current||older;if(!raw)return null;
  const s=JSON.parse(raw) as Partial<SectionState>&{questions?:Array<SavedQuestion|OldSavedQuestion>;examples?:Array<SavedQuestion|OldSavedQuestion>};
  if(!Array.isArray(s.questions)||!Array.isArray(s.results)||!Array.isArray(s.examples))return null;
  const adapt=(entry:SavedQuestion|OldSavedQuestion,context:'exercise'|'example'):SavedQuestion=>{
   if(isSnapshot(entry))return entry;
   return questionSnapshot(buildQuestion(entry.templateId,entry.params,context));
  };
  return {...fresh(),...s,questions:s.questions.map(q=>adapt(q,'exercise')),examples:s.examples.map(q=>adapt(q,'example')),results:s.results.map(migrateResult),pastReviews:Array.isArray(s.pastReviews)?s.pastReviews:[]};
 }catch{return null}
}
function Review({review,sectionTitle,onRedo,canRedo}:{review:ReviewSnapshot;sectionTitle:string;onRedo:()=>void;canRedo:boolean}){
 const summary=summarise(review);
 return <section className="maths-review" aria-label={`Review for ${sectionTitle}`}>
  <span className="eyebrow">EXERCISE REVIEW</span><h4>{sectionTitle} · Your results</h4>
  <div className="maths-review-stats"><div><strong>{summary.score}%</strong><span>Score ({summary.correct}/{summary.total} solved)</span></div><div><strong>{summary.firstTry}/{summary.total}</strong><span>Right first time</span></div><div><strong>{prettyTime(summary.durationMs)}</strong><span>Time taken</span></div></div>
  <h5>Breakdown by skill</h5><div className="maths-review-skills">{summary.bySkill.map(x=><p key={x.skillId}><strong>{x.skillId.replace(/\./g,' · ')}</strong> — {x.correct}/{x.total} solved, {x.firstTry} first time</p>)}</div>
  <h5>Each question</h5>
  <div className="maths-review-questions">{review.questions.map(({snapshot:q},i)=>{
   const r=review.results[i];const submitted=r.submissions.filter(s=>s.verdict!=='invalid-form');
   const last=submitted.at(-1);const wrong=submitted.filter(s=>s.verdict==='incorrect');
   const lastWrong=wrong.at(-1);const mistake=lastWrong?recogniseMistake(lastWrong.input,q.commonWrongAnswers):null;
   return <div className="maths-review-question" key={q.id}><div className="maths-review-question-head"><strong>Question {i+1}</strong><span className={r.rightFirstTime?'maths-result-good':r.correct?'maths-result-warn':'maths-result-bad'}>{r.rightFirstTime?'Correct first time':r.correct?'Correct after retry':'Solution required'}</span></div>
    <p>{q.promptText}</p><p><strong>Your exact input:</strong> <code>{last?.input??(r.input||'No answer')}</code></p>
    {submitted.length>1&&<details><summary>See all {submitted.length} submitted attempts</summary><ol>{submitted.map((s,j)=><li key={j}><code>{s.input}</code> — {s.verdict}{s.stepIndex!==undefined?` (step ${s.stepIndex+1})`:''}</li>)}</ol></details>}
    <p><strong>Correct answer:</strong> <code>{q.correctAnswer}</code></p>
    {lastWrong&&(mistake?<p className="maths-likely"><strong>Likely mistake:</strong> {mistake}</p>:<p className="maths-likely">Your response doesn't match a recognised common mistake. <a href={`#maths-review-solution-${q.id}`}>View the worked solution ↓</a></p>)}
    <details id={`maths-review-solution-${q.id}`}><summary>Worked solution</summary><ol>{q.workedSolution.map((step,j)=><li key={j}>{step}</li>)}</ol></details>
   </div>})}</div>
  {canRedo?<button className="primary" onClick={onRedo}>Redo the ones I missed · fresh questions</button>:<p className="maths-all-correct">All questions were right on the first attempt. No retry is needed.</p>}
 </section>;
}
function SectionView({chapter,section,index,total,topic}:{chapter:string;section:MathsSection;index:number;total:number;topic:Topic}){
 const storeKey=`northstar-maths-section-v5:${topic.id}:${section.id}`;
 const legacyKey=`northstar-maths-section-v4:${topic.id}:${section.id}`;
 const [state,setState]=useState<SectionState>(fresh),[ready,setReady]=useState(false),[error,setError]=useState(''),[celebrate,setCelebrate]=useState(-1);
 const [settings,setSettings]=useState({animation:true,lowData:false});
 useEffect(()=>{const saved=loadSection(storeKey,legacyKey);if(saved)setState(saved);
  try{const prefs=JSON.parse(localStorage.getItem('northstar-settings')||'{}');setSettings({animation:prefs.animation!==false&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches,lowData:!!prefs.lowData})}catch{}
  setReady(true);
 },[storeKey,legacyKey]);
 useEffect(()=>{if(ready)try{localStorage.setItem(storeKey,JSON.stringify(state))}catch{setError('Browser storage is unavailable or full. The latest answers may not survive reload.')}},[ready,state,storeKey]);
 const all=useMemo(()=>state.questions.map(q=>q.snapshot),[state.questions]);
 const example=state.examples[state.exampleIndex]?.snapshot;
 function examplesNext(){setError('');try{const next=state.exampleIndex+1;
  if(next<state.examples.length){setState(s=>({...s,exampleIndex:next,exampleStep:0}));return}
  const stage=[0,2,4,5][state.examples.length%4];const q=claim(section.kind,[stage],'example')[0];
  setState(s=>({...s,examples:[...s.examples,q],exampleIndex:s.examples.length,exampleStep:0}));
 }catch(e){setError(e instanceof Error?e.message:String(e))}}
 function startSet(stages=[0,1,2,3,4,5]){setError('');try{
  const questions=claim(section.kind,stages,'exercise');
  setState(s=>{const review=s.questions.length&&s.finishedAt!==undefined?{
   questions:s.questions,results:s.results,startedAt:s.startedAt,finishedAt:s.finishedAt
  }:null;
   return {...s,questions,visible:1,results:questions.map(emptyResult),startedAt:Date.now(),finishedAt:undefined,pastReviews:review?[...s.pastReviews,review].slice(-3):s.pastReviews};});
  setCelebrate(-1);
 }catch(e){setError(e instanceof Error?e.message:String(e))}}
 function setInput(i:number,value:string){setState(s=>({...s,results:s.results.map((r,j)=>j===i?{...r,input:value,invalidNotice:''}:r)}));}
 // Step edit helper that does not overwrite final response and handles sparse step arrays.
 function setStepInput(i:number,stepIndex:number,value:string){setState(s=>({...s,results:s.results.map((r,j)=>{if(j!==i)return r;const stepInputs=[...r.stepInputs];stepInputs[stepIndex]=value;return {...r,stepInputs,invalidNotice:''}})}));}
 function updateProgress(q:GeneratedMathQuestion,correct:boolean){try{const progress=localProgress.read();
  const prev=progress[topic.id]||{score:0,streak:0,bestLevel:'simple',needsPractice:[],lastPractised:0,attempts:0};
  const tier=q.tier==='challenge'?'hard':q.tier==='developing'?'intermediate':'simple';const streak=correct?prev.streak+1:0;
  progress[topic.id]={...prev,attempts:prev.attempts+1,score:prev.score+(correct?10:0),streak,bestLevel:tier==='hard'||(tier==='intermediate'&&prev.bestLevel==='simple')?tier:prev.bestLevel,needsPractice:correct?prev.needsPractice.filter(x=>x!==q.id):Array.from(new Set([...prev.needsPractice,q.id])).slice(-80),lastPractised:Date.now()};localProgress.write(progress);
 }catch{}}
 function check(i:number,stepIndex?:number){const q=all[i],r=state.results[i];if(!q||!r||r.done)return;
  const step=stepIndex!==undefined?q.validatedSteps?.[stepIndex]:undefined;
  if(stepIndex!==undefined&&!step)return;
  if(stepIndex===undefined&&q.validatedSteps?.some((_,k)=>!r.stepVerified[k]))return;
  const input=stepIndex===undefined?r.input:(r.stepInputs[stepIndex]||'');
  const marked=markFinalAnswer(input,step?.correctAnswer??q.correctAnswer,step?.answerSpec??q.answerSpec,step?[step.correctAnswer]:q.acceptedForms);
  const next=registerSubmission(r,input,marked.verdict,Date.now(),stepIndex);
  if(marked.verdict==='invalid-form')next.invalidNotice=marked.message;
  setState(s=>{const results=s.results.map((old,j)=>j===i?next:old);
   return {...s,results,finishedAt:i===s.questions.length-1&&next.done?Date.now():s.finishedAt};});
  if(marked.verdict==='correct'&&stepIndex===undefined){setCelebrate(i);updateProgress(q,true)}
  if(marked.verdict==='incorrect')updateProgress(q,false);
 }
 function showNext(i:number){if(!state.results[i]?.done)return;
  const next=i+2;setState(s=>({...s,visible:Math.max(s.visible,next)}));setCelebrate(-1);
  if(next<=all.length)requestAnimationFrame(()=>document.getElementById(`${topic.id}-${section.id}-q${i+2}`)?.scrollIntoView({behavior:'smooth',block:'center'}));
 }
 const complete=state.finishedAt!==undefined&&state.results.length>0&&state.results.every(x=>x.done);
 const completedReview:ReviewSnapshot|null=complete?{questions:state.questions,results:state.results,startedAt:state.startedAt,finishedAt:state.finishedAt!}:null;
 const completedCount=state.results.filter(r=>r.done).length;
 return <article className="maths-law" id={`law-${section.id}`}>
 <header className="maths-law-header"><span className="eyebrow">RULE {index+1} OF {total} · {chapter}</span><h2>{section.title}</h2><p>{section.rule}</p><div className="maths-formula" dangerouslySetInnerHTML={{__html:formula(section.latex)}}/><p className="maths-teacher-note">{section.notes}</p></header>
 <div className="maths-worked"><div className="maths-worked-header"><h3>Worked examples</h3><span>Try the step mentally before revealing it.</span></div>
 {example?<div className="maths-example"><p className="maths-example-question">{example.promptText}</p><div className="maths-steps">{example.workedSolution.slice(0,state.exampleStep).map((line,j)=><p key={j}><strong>{j+1}.</strong> {line}</p>)}</div><div className="actions"><button className="primary" disabled={state.exampleStep>=example.workedSolution.length} onClick={()=>setState(s=>({...s,exampleStep:Math.min(s.exampleStep+1,example.workedSolution.length)}))}>Reveal next step →</button><button className="secondary" onClick={examplesNext}>Show me another ↻</button></div><span className="maths-step-count">{state.exampleStep} / {example.workedSolution.length} steps · Example {state.exampleIndex+1}</span></div>:<button className="primary" disabled={!ready} onClick={examplesNext}>Open the first worked example →</button>}</div>
 <div className="maths-exercises"><div className="maths-exercises-header"><div><span className="eyebrow">GRADED PRACTICE</span><h3>Exercises: {section.title}</h3><p>Questions are issued one at a time, saved with their answers, and reviewed together at the end. If the format is unfinished, it will not use an attempt.</p></div>{state.questions.length>0&&<span className="maths-progress-label">{completedCount}/{all.length} complete</span>}</div>
 {state.questions.length===0?<button className="primary" disabled={!ready} onClick={()=>startSet()}>Start the exercise set →</button>:<div className="maths-question-stack">{all.slice(0,state.visible).map((q,i)=>{
  const result=state.results[i];if(!result)return null;
  const isLatest=i===state.visible-1,last=i===all.length-1;
  return <div id={`${topic.id}-${section.id}-q${i+1}`} className={`maths-question ${result.done?'maths-question-done':''}`} key={q.id}>
   <div className="maths-question-meta"><span>QUESTION {i+1} OF {all.length}</span><span>{q.tier==='foundation'?'Foundations':q.tier==='developing'?'Developing':'Challenge'}</span></div><h4>{q.promptText}</h4>
   {q.validatedSteps?.length>0&&!result.done&&<div className="maths-stepped"><h5>Show your method</h5>{q.validatedSteps.map((s,k)=>{
    const earlierReady=q.validatedSteps.slice(0,k).every((_,j)=>result.stepVerified[j]);return <div className="maths-stepped-row" key={k}>
     <label htmlFor={`${q.id}-step-${k}`}>{s.label} — {s.prompt}</label>
     {result.stepVerified[k]?<span className="maths-step-correct">Correct · {result.stepInputs[k]}</span>:<div className="maths-stepped-input"><input id={`${q.id}-step-${k}`} aria-label={s.label} value={result.stepInputs[k]||''} disabled={!earlierReady} onChange={e=>setStepInput(i,k,e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check(i,k)}} placeholder="Enter this step's result"/><button className="secondary" disabled={!earlierReady||!result.stepInputs[k]?.trim()} onClick={()=>check(i,k)}>Check step</button></div>}
    </div>})}</div>}
   {result.done?<div className="maths-previous-answer"><strong>{result.correct?'Correct':'Method revealed'}</strong> · Your response: {result.input||result.submissions.at(-1)?.input||'—'} · Answer: {q.correctAnswer}</div>:<>
    {(!q.validatedSteps?.length||q.validatedSteps.every((_,j)=>result.stepVerified[j]))&&<><label className="maths-answer-label" htmlFor={`${topic.id}-${section.id}-answer-${i}`}>Final answer <span className="maths-format">({q.answerSpec.kind}{q.answerSpec.decimalPlaces!==undefined?`, ${q.answerSpec.decimalPlaces} d.p.`:''}{q.answerSpec.significantFigures!==undefined?`, ${q.answerSpec.significantFigures} s.f.`:''})</span></label><input id={`${topic.id}-${section.id}-answer-${i}`} value={result.input} onChange={e=>setInput(i,e.target.value)} onKeyDown={e=>{if(e.key==='Enter')check(i)}} autoComplete="off" placeholder="Enter a final, simplified answer"/><div className="actions"><button className="primary" disabled={!result.input.trim()} onClick={()=>check(i)}>Check answer →</button></div></>}
   </>}
   {result.invalidNotice&&!result.done&&<p className="maths-format-notice" role="alert">{result.invalidNotice} This doesn't count as a wrong attempt.</p>}
   {result.wrongCount>0&&!result.done&&<p className="maths-hint" role="status"><strong>{result.wrongCount===1?'Hint 1':result.wrongCount===2?'Hint 2':'Check before the walkthrough'}:</strong> {result.wrongCount===1?q.hint[0]:result.wrongCount===2?q.hint[1]:'Check your operations and the form required. The solution will appear after one more unsuccessful attempt.'}</p>}
   {result.done&&result.revealed&&<div className="maths-solution"><strong>Worked solution</strong>{q.workedSolution.map((line,j)=><p key={j}>{j+1}. {line}</p>)}</div>}
   {result.done&&!result.revealed&&<button className="maths-show-solution" onClick={()=>setState(s=>({...s,results:s.results.map((r,j)=>i===j?{...r,revealed:true}:r)}))}>Review the worked solution</button>}
   {result.done&&celebrate===i&&settings.animation&&!settings.lowData&&<Celebration subject="maths" variant={i}/>}
   {result.done&&isLatest&&!last&&!complete&&<div className="maths-next"><button className="primary" onClick={()=>showNext(i)}>Next question ↓</button></div>}
  </div>})}</div>}
 {completedReview&&<><Review review={completedReview} sectionTitle={section.title} canRedo={missedStages(completedReview).length>0} onRedo={()=>startSet(missedStages(completedReview))}/><div className="maths-after-review">{index+1<total?<a href={`#law-${mathsChapters[topic.id][index+1].id}`} className="primary maths-anchor">Next section: {mathsChapters[topic.id][index+1].title} →</a>:<a href="#maths-top" className="primary maths-anchor">Review this topic ↑</a>}<button className="secondary" onClick={()=>startSet()}>Start another complete set</button></div></>}
 {state.pastReviews.length>0&&<details className="maths-review-history"><summary>Earlier completed reviews ({state.pastReviews.length})</summary>{state.pastReviews.map((r,i)=><Review key={i} review={r} sectionTitle={section.title} canRedo={false} onRedo={()=>{}}/>)}</details>}
 {error&&<p className="maths-error" role="alert">{error}</p>}
 </div></article>;
}
export default function MathsExperience({topic}:{topic:Topic}){
 const sections=mathsChapters[topic.id]||[];
 return <div id="maths-top" className="maths-textbook"><section className="lesson-section"><span className="eyebrow">RULES, WORKED EXAMPLES AND GRADED EXERCISES</span><h2>Learn the method. Then put it to work.</h2><p className="lead">{topic.intro} Each section begins with a clear rule. Work through the examples before attempting the questions in order.</p><nav className="maths-section-nav" aria-label="Maths laws and skills">{sections.map((s,i)=><a href={`#law-${s.id}`} key={s.id}>{String(i+1).padStart(2,'0')} · {s.title}</a>)}</nav>{topic.diagram&&<Diagram diagram={topic.diagram}/>}</section>{sections.map((s,i)=><SectionView key={`${topic.id}-${s.id}`} topic={topic} chapter={topic.title} section={s} index={i} total={sections.length}/>)}</div>;
}
