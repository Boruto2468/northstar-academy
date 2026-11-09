import test from 'node:test';import assert from 'node:assert/strict';
import {topicSkills,makePaperItem,createFreshItem,canonicalAnswer,gradeItem} from '../src/assessment/items.ts';
import {randomParams} from '../src/maths/generator.ts';
const prng=(seed)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
test('bank covers every Maths rule without copying any textbook exercise',()=>{
 assert.equal(topicSkills.length,46);
 assert.equal(new Set(topicSkills.map(s=>s.templateId)).size,topicSkills.length);
});
test('each template yields a unique four-option objective, with hidden key',()=>{
 for(const [i,skill] of topicSkills.entries())for(let j=0;j<20;j++){
  const rand=prng(28000+i*100+j),params=randomParams(rand,3);
  const q=makePaperItem(skill.templateId,params,'objective',rand);
  assert.equal(q.publicData.options.length,4,skill.templateId);
  assert.equal(new Set(q.publicData.options.map(x=>x.text)).size,4);
  const visible=JSON.stringify(q.publicData);
  assert(!visible.includes('workedSolution'));
  assert(!visible.includes('correctOptionId'));
  assert(!visible.includes('correctAnswer'));
  assert.equal(gradeItem(q,{choice:q.secretData.correctOptionId}).points,2,skill.templateId);
  for(const opt of q.publicData.options.filter(x=>x.id!==q.secretData.correctOptionId))assert.equal(gradeItem(q,{choice:opt.id}).points,0);
 }
});
test('theory items keep each marking criterion tied to a generated answer',()=>{
 for(const [i,skill] of topicSkills.entries())for(let j=0;j<16;j++){
  const rand=prng(230+i*100+j);
  const q=makePaperItem(skill.templateId,randomParams(rand,5),'theory',rand);
  const answers=Object.fromEntries(q.secretData.markingScheme.map(s=>[s.key,s.correctAnswer]));
  const graded=gradeItem(q,answers);
  assert.equal(graded.points,6,skill.templateId+' '+JSON.stringify(graded));
  assert.equal(gradeItem(q,{}).points,0);
 }
});
test('no-repeat registry rejects question parameter reuse',()=>{
 for(const skill of topicSkills){const used=new Set(),answers=new Set();for(let i=0;i<5;i++){
  const q=createFreshItem(skill.templateId,'objective',used,answers,prng(300+i*57));
  assert(!used.has(q.signature));assert(!answers.has(canonicalAnswer(q.secretData.correctAnswer)));
  used.add(q.signature);answers.add(canonicalAnswer(q.secretData.correctAnswer));
 }}
});

test('equivalent numeric answers have the same no-repeat key',()=>{
 assert.equal(canonicalAnswer('2/4'),canonicalAnswer('0.5'));
 assert.equal(canonicalAnswer('5*10^2'),canonicalAnswer('500'));
 assert.notEqual(canonicalAnswer('x^2'),canonicalAnswer('x^3'));
});
