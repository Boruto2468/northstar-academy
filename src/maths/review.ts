import type {GeneratedMathQuestion} from './generator.ts';
import type {MarkResult} from './answerValidation.ts';
export type SavedQuestion={snapshot:GeneratedMathQuestion;seed:string;createdAt:number};
export type Submission={input:string;verdict:MarkResult['verdict'];at:number;attemptNo:number;stepIndex?:number};
export type QuestionResult={input:string;attempts:number;wrongCount:number;done:boolean;correct:boolean;rightFirstTime:boolean;revealed:boolean;invalidNotice:string;submissions:Submission[];stepInputs:string[];stepVerified:boolean[]};
export type ReviewSnapshot={questions:SavedQuestion[];results:QuestionResult[];startedAt:number;finishedAt:number};
export type SkillScore={skillId:string;total:number;correct:number;firstTry:number};
export type ReviewTotals={score:number;correct:number;firstTry:number;total:number;durationMs:number;bySkill:SkillScore[]};
export function emptyResult():QuestionResult{return {input:'',attempts:0,wrongCount:0,done:false,correct:false,rightFirstTime:false,revealed:false,invalidNotice:'',submissions:[],stepInputs:[],stepVerified:[]};}
export function summarise(review:ReviewSnapshot):ReviewTotals{
 const total=review.questions.length;
 const bySkill=new Map<string,SkillScore>();
 for(let i=0;i<total;i++){
  const skillId=review.questions[i].snapshot.skillId;const result=review.results[i];
  const row=bySkill.get(skillId)||{skillId,total:0,correct:0,firstTry:0};
  row.total++;if(result?.correct)row.correct++;if(result?.rightFirstTime)row.firstTry++;bySkill.set(skillId,row);
 }
 const correct=review.results.filter(r=>r.correct).length;
 return {correct,firstTry:review.results.filter(r=>r.rightFirstTime).length,total,score:total?Math.round(100*correct/total):0,durationMs:Math.max(0,review.finishedAt-review.startedAt),bySkill:[...bySkill.values()]};
}
export function missedStages(review:ReviewSnapshot):number[]{
 return review.results.flatMap((r,i)=>r.rightFirstTime?[]:[review.questions[i].snapshot.params.stage]);
}
/** Returns a new immutable object; all input text and grading verdicts are retained. */
export function registerSubmission(r:QuestionResult,input:string,verdict:MarkResult['verdict'],at:number,stepIndex?:number):QuestionResult{
 const attemptNo=verdict==='invalid-form'?r.attempts:r.attempts+1;
 const submissions=[...r.submissions,{input,verdict,at,attemptNo,...(stepIndex===undefined?{}:{stepIndex})}];
 const next={...r,submissions};
 if(verdict==='invalid-form')return {...next,invalidNotice:'Not in final form: finish simplifying.'};
 if(verdict==='incorrect'){
  const wrongCount=r.wrongCount+1,attempts=r.attempts+1,revealed=wrongCount>=4;
  return {...next,input,attempts,wrongCount,done:revealed,correct:false,revealed,invalidNotice:''};
 }
 if(stepIndex!==undefined){const stepVerified=[...r.stepVerified];stepVerified[stepIndex]=true;
  return {...next,stepVerified,invalidNotice:''};}
 return {...next,input,attempts:r.attempts+1,correct:true,done:true,rightFirstTime:r.wrongCount===0,revealed:false,invalidNotice:''};
}
