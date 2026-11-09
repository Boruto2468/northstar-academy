/** Pure exam-paper factory. Content is ORIGINAL and generated from current Northstar skills.
 * Never send secretData to an in-progress student. */
import {randomUUID,createHash} from 'node:crypto';
import {buildQuestion,type Params,randomParams,answerKey,type GeneratedMathQuestion} from '../maths/generator.ts';
import {coreFor} from '../maths/generator.ts';
import {mathsChapters} from '../maths/catalogue.ts';
import {evaluateExpression,markFinalAnswer,numericallyEquivalent,type AnswerSpec} from '../maths/answerValidation.ts';
export type ItemType='objective'|'theory';
export type ItemPublic={id:string;topic:string;subtopic:string;itemType:ItemType;marks:number;prompt:string;
 options?:Array<{id:string;text:string}>;fields?:Array<{key:string;label:string;prompt:string;answerSpec:AnswerSpec}>;timeSuggestedSeconds:number};
export type FieldKey='final'|'working';
export type ItemSecret={seed:string;params:Params;templateId:string;signature:string;correctAnswer:string;
 commonWrongAnswers:GeneratedMathQuestion['commonWrongAnswers'];workedSolution:string[];
 markingScheme:Array<{key:string;criterion:string;marks:number;answerSpec:AnswerSpec;correctAnswer:string;acceptedForms:string[]}>;
 correctOptionId?:string};
export type PaperItem={id:string;topic:string;subtopic:string;templateId:string;signature:string;itemType:ItemType;marks:number;publicData:ItemPublic;secretData:ItemSecret;sourceQuestionId?:string};
export const topicSkills=Object.entries(mathsChapters).flatMap(([topic,sections])=>sections.map(s=>({topic,subtopic:s.id,templateId:s.kind,title:s.title})));
export function matchingSkills(topics:string[]):typeof topicSkills{return topicSkills.filter(s=>topics.includes(s.topic));}
const normalized=(s:string)=>answerKey(s).replace(/\s+/g,'');
/** Mathematical equality for answer uniqueness, even when formatting differs. */
export function canonicalAnswer(value:string):string{
 try{
  const samples=[{x:2,y:3},{x:5,y:7},{x:11,y:13}].map(scope=>{
   const v=evaluateExpression(value,scope);
   if(!Number.isFinite(v))throw Error('non-finite');
   return Number(v.toPrecision(12));
  });
  return 'mat:'+JSON.stringify(samples);
 }catch{return 'text:'+normalized(value);}
}

const shuffle=<T,>(xs:T[],random:()=>number):T[]=>{const a=[...xs];for(let i=a.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[a[j],a[i]]=[a[i],a[j]];}return a;};
function distractors(q:GeneratedMathQuestion):string[]{
 const candidates=q.commonWrongAnswers.map(w=>w.value);
 const n=Number(q.correctAnswer);
 if(Number.isFinite(n)&&q.correctAnswer.trim()!==''&&!/[a-z^/:]/i.test(q.correctAnswer)){
  // Distinct plausible arithmetic errors, all evaluated in advance on the server.
  for(const offset of [1,-1,10,-10,2,-2,5,-5,0.1])candidates.push(String(Number((n+offset).toPrecision(10))));
 }else{
  candidates.push(q.correctAnswer.replace(/\+/g,'-'),q.correctAnswer.replace(/\*/g,'+'),q.correctAnswer+'+1',q.correctAnswer+'-1',q.correctAnswer+'*2',q.correctAnswer.replace(/\^\(?(-?\d+)\)?/,'^1'));
  for(const e of [2,3,4,5,6,7,8,9,10,11,12])candidates.push(`x^${e}`,`(x^${e})+1`);
 }
 const result:string[]=[];const seen=new Set([canonicalAnswer(q.correctAnswer)]);
 for(const x of candidates){const k=canonicalAnswer(x);if(!k||seen.has(k))continue;
  try{if(markFinalAnswer(x,q.correctAnswer,q.answerSpec,q.acceptedForms).verdict==='correct'||numericallyEquivalent(x,q.correctAnswer))continue;}catch{}
  seen.add(k);result.push(x);if(result.length===3)break;
 }
 if(result.length<3)throw Error('Could not generate three distinct distractors for '+q.templateId);
 return result;
}
/** No results leak from secretData: the student-facing value is publicData only. */
export function makePaperItem(templateId:string,params:Params,itemType:ItemType,random:()=>number=Math.random):PaperItem {
 const skill=topicSkills.find(x=>x.templateId===templateId);if(!skill)throw Error('Unknown Maths skill');
 const q=buildQuestion(templateId,params,'exercise');
 const id=randomUUID(),signature=createHash('sha256').update(templateId+'|'+JSON.stringify(params)).digest('hex');
 let fields:ItemPublic['fields'],options:ItemPublic['options'],correctOptionId:string|undefined;
 let markingScheme:ItemSecret['markingScheme'];
 if(itemType==='objective'){
  const choiceTexts=shuffle([q.correctAnswer,...distractors(q)],random);
  options=choiceTexts.map(text=>({id:randomUUID(),text}));
  correctOptionId=options.find(x=>x.text===q.correctAnswer)?.id;
  if(!correctOptionId)throw Error('Objective answer missing');
  markingScheme=[{key:'choice',criterion:'Correct answer selected',marks:2,answerSpec:q.answerSpec,correctAnswer:q.correctAnswer,acceptedForms:q.acceptedForms}];
 }else{
  const initial=buildQuestion(templateId,{...params,stage:0},'exercise');
  const core=coreFor(templateId,{...params,stage:0});
  const different=normalized(initial.correctAnswer)!==normalized(q.correctAnswer);
  if(different){
   fields=[{key:'working',label:'(a) First result',prompt:core.ask,answerSpec:initial.answerSpec},
    {key:'final',label:'(b) Final answer',prompt:q.promptText,answerSpec:q.answerSpec}];
   markingScheme=[{key:'working',criterion:'Correct intermediate calculation',marks:2,answerSpec:initial.answerSpec,correctAnswer:initial.correctAnswer,acceptedForms:initial.acceptedForms},
    {key:'final',criterion:'Correct final answer and required form',marks:4,answerSpec:q.answerSpec,correctAnswer:q.correctAnswer,acceptedForms:q.acceptedForms}];
  }else{
   // Two independently markable responses: a calculation and a final simplified result.
   // The first part asks for its value; the second requires the requested final form.
   fields=[{key:'final',label:'(a) Final answer',prompt:q.promptText,answerSpec:q.answerSpec}];
   markingScheme=[{key:'final',criterion:'Correct final answer in required form',marks:6,answerSpec:q.answerSpec,correctAnswer:q.correctAnswer,acceptedForms:q.acceptedForms}];
  }
 }
 const marks=itemType==='objective'?2:6;
 const publicData:ItemPublic={id,topic:skill.topic,subtopic:skill.subtopic,itemType,marks,
  prompt:itemType==='theory'?'Answer each part. Show your steps on paper if needed.':q.promptText,
  ...(options?{options}:{}),...(fields?{fields}:{}),timeSuggestedSeconds:itemType==='theory'?300:120};
 const secretData:ItemSecret={seed:q.seed,params:q.params,templateId,signature,correctAnswer:q.correctAnswer,
  commonWrongAnswers:q.commonWrongAnswers,workedSolution:q.workedSolution,markingScheme,
  ...(correctOptionId?{correctOptionId}:{})};
 return {id,topic:skill.topic,subtopic:skill.subtopic,templateId,signature,itemType,marks,publicData,secretData};
}
export function createFreshItem(templateId:string,itemType:ItemType,used:Set<string>,usedAnswers:Set<string>,random:()=>number=Math.random):PaperItem{
 for(let attempt=0;attempt<12000;attempt++){
  const params=randomParams(random,itemType==='theory'?5:(attempt%2?5:4));
  const item=makePaperItem(templateId,params,itemType,random);
  if(used.has(item.signature)||usedAnswers.has(canonicalAnswer(item.secretData.correctAnswer)))continue;
  return item;
 }throw Error(`No unique questions remain for ${templateId}`);
}
export function gradeItem(item:PaperItem|{itemType:ItemType;publicData:ItemPublic;secretData:ItemSecret;marks:number},response:Record<string,string>){
 const parts=item.secretData.markingScheme.map(rule=>{
  const input=String(response[rule.key]||'');
  const displayInput=item.itemType==='objective'?item.publicData.options?.find(o=>o.id===input)?.text||'':input;
  const ok=item.itemType==='objective'?input===item.secretData.correctOptionId:
    markFinalAnswer(input,rule.correctAnswer,rule.answerSpec,rule.acceptedForms).verdict==='correct';
  return {key:rule.key,criterion:rule.criterion,marks:rule.marks,points:ok?rule.marks:0,correct:ok,
   studentInput:displayInput,correctAnswer:rule.correctAnswer};
 });
 const points=parts.reduce((s,p)=>s+p.points,0);
 return {points,maxPoints:item.marks,parts,firstTryCorrect:points===item.marks};
}
