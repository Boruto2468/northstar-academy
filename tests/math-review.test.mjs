import {test} from 'node:test';
import assert from 'node:assert/strict';
import {buildQuestion} from '../src/maths/generator.ts';
import {emptyResult,registerSubmission,summarise,missedStages} from '../src/maths/review.ts';
const sample=(stage=0)=>({snapshot:buildQuestion('index.value',{a:5,b:4,c:3,d:2,n:4,stage}),seed:`s-${stage}`,createdAt:1000});
test('invalid final form does not consume an attempt and retains exact input',()=>{
 let r=registerSubmission(emptyResult(),'5^4','invalid-form',1010);
 assert.equal(r.attempts,0);assert.equal(r.wrongCount,0);assert.equal(r.submissions[0].input,'5^4');
 r=registerSubmission(r,'625','correct',1020);
 assert.equal(r.rightFirstTime,true);assert.equal(r.correct,true);assert.equal(r.attempts,1);
});
test('wrong attempts, fourth-attempt solution, no fifth attempt counted',()=>{
 let r=emptyResult();for(let i=1;i<=4;i++)r=registerSubmission(r,String(i),'incorrect',1000+i);
 assert.equal(r.done,true);assert.equal(r.revealed,true);assert.equal(r.attempts,4);assert.equal(r.correct,false);
 assert.deepEqual(r.submissions.map(x=>x.input),['1','2','3','4']);
});
test('stepped answer keeps step input distinct and awards first-try after final',()=>{
 let r=registerSubmission(emptyResult(),'1200.00','correct',1000,0);
 assert.deepEqual(r.stepVerified,[true]);assert.equal(r.done,false);assert.equal(r.attempts,0);
 r=registerSubmission(r,'300','correct',1001,1);
 r=registerSubmission(r,'900.00','correct',1002);
 assert.equal(r.rightFirstTime,true);assert.equal(r.submissions[1].stepIndex,1);
});
test('review reports exact first-time score and same-skill fresh retry stages',()=>{
 const q0=sample(0),q1=sample(3),q2=sample(5);
 const r0=registerSubmission(emptyResult(),'625','correct',1010);
 const r1=registerSubmission(registerSubmission(emptyResult(),'56','incorrect',1015),'1256','correct',1020);
 const r2=Array.from({length:4}).reduce((prev,_,i)=>registerSubmission(prev,String(i+1),'incorrect',1030+i),emptyResult());
 const snapshot={questions:[q0,q1,q2],results:[r0,r1,r2],startedAt:1000,finishedAt:106500};
 const totals=summarise(snapshot);
 assert.equal(totals.score,67);assert.equal(totals.correct,2);assert.equal(totals.firstTry,1);assert.equal(totals.bySkill[0].total,3);
 assert.deepEqual(missedStages(snapshot),[3,5]);assert.equal(snapshot.results[1].submissions[0].input,'56');
});

test('a persisted snapshot does not recompute answers after its params are edited',()=>{
 const record=sample(2);
 const persisted=JSON.parse(JSON.stringify(record));
 const original={promptText:persisted.snapshot.promptText,correctAnswer:persisted.snapshot.correctAnswer};
 persisted.snapshot.params.a=1000;
 assert.deepEqual({promptText:persisted.snapshot.promptText,correctAnswer:persisted.snapshot.correctAnswer},original);
 assert.notEqual(buildQuestion(persisted.snapshot.templateId,persisted.snapshot.params).correctAnswer,original.correctAnswer);
});
