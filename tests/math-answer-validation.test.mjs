import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mathsChapters} from '../src/maths/catalogue.ts';
import {buildQuestion,randomParams} from '../src/maths/generator.ts';
import {markFinalAnswer,evaluateExpression,numericallyEquivalent} from '../src/maths/answerValidation.ts';
const all=[...new Set(Object.values(mathsChapters).flat().map(section=>section.kind))];
function rng(start){let seed=start;return ()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296}}
const invalid=q=>{
 const candidates=new Set(['', ' ', '0', '1', '2+2', '1+1', '3*4', '0.00000001']);
 // Test the exact arithmetic expression from the prompt when it can be extracted.
 for(const m of q.promptText.matchAll(/(?:\d+\^\d+(?:\s*[+\-*÷×/]\s*\d+\^\d+)?)/g))candidates.add(m[0]);
 return [...candidates].filter(x=>!numericallyEquivalent(x,q.correctAnswer));
};
for(const template of all){
 test(`required forms + submitted answers: ${template} × 500`,()=>{
  const random=rng(0x92baffa);
  for(let i=0;i<500;i++){
   const q=buildQuestion(template,randomParams(random,i%6));
   assert.ok(q.seed&&q.params&&q.promptText&&q.correctAnswer&&q.answerSpec&&q.commonWrongAnswers,JSON.stringify(q));
   for(const valid of q.acceptedForms){const result=markFinalAnswer(valid,q.correctAnswer,q.answerSpec,q.acceptedForms);
    assert.equal(result.verdict,'correct',`${template}: generated correct answer ${valid} failed ${JSON.stringify(q.answerSpec)}`);
   }
   const randomDigits=Array.from({length:8},()=>String(Math.floor(random()*99999999)));
   for(const candidate of [...invalid(q),...randomDigits.filter(d=>!numericallyEquivalent(d,q.correctAnswer))]){
    const marked=markFinalAnswer(candidate,q.correctAnswer,q.answerSpec,q.acceptedForms);
    assert.notEqual(marked.verdict,'correct',`${template}: accepted shortcut ${candidate}; expected ${q.correctAnswer} ${JSON.stringify(q.answerSpec)}`);
   }
   if(!q.promptText.includes(q.correctAnswer)){
    const wrong=markFinalAnswer('999999999',q.correctAnswer,q.answerSpec,q.acceptedForms);
    assert.notEqual(wrong.verdict,'correct');
   }
  }
 });
}
test('wrong final form is not counted as incorrect',()=>{
 const cases=[['7+5','12',{kind:'integer'}],['0.4','0.40',{kind:'decimal',decimalPlaces:2}],['0.400','0.40',{kind:'decimal',decimalPlaces:2}],['4/8','1/2',{kind:'fraction'}],['12*10^3','1.2*10^4',{kind:'standard-form'}],['x^3*x^4','x^7',{kind:'single-power'}],['x^3+x^4','x^7',{kind:'single-power'}],['7','2*sqrt(2)',{kind:'surd'}],['2*x+4','2*(x+2)',{kind:'factorised-expression'}],['3*(2*x+4)','6*x+12',{kind:'expanded-expression'}]];
 for(const [input,answer,spec] of cases)assert.equal(markFinalAnswer(input,answer,spec).verdict,'invalid-form',input);
});
test('valid equivalents and strict number marking',()=>{
 const cases=[['+007','7',{kind:'integer'}],['2/4','1/2',{kind:'fraction'}],['5/10','1/2',{kind:'fraction'}],['2*10^3','2*10^3',{kind:'standard-form'}],['2*x+3*x','5*x',{kind:'expanded-expression'}]];
 for(const [input,answer,spec] of cases){const mark=markFinalAnswer(input,answer,spec);if(['2/4','5/10'].includes(input)||input==='2*x+3*x')assert.notEqual(mark.verdict,'correct',input);else assert.equal(mark.verdict,'correct',input);}
 assert.equal(markFinalAnswer('1.01','1.00',{kind:'decimal',decimalPlaces:2}).verdict,'incorrect');
 assert.equal(markFinalAnswer('10.01','10.00',{kind:'decimal',decimalPlaces:2}).verdict,'incorrect');
 assert.equal(markFinalAnswer('120.0','120',{kind:'decimal',significantFigures:2}).verdict,'invalid-form');
 assert.equal(markFinalAnswer('120','120',{kind:'decimal',significantFigures:2}).verdict,'correct');
});

test('the original question is not an acceptable final answer',()=>{
 const params={a:7,b:4,c:3,d:2,n:4,stage:0};
 for(const kind of ['index.value','index.product','index.standard','algebra.expand','algebra.factor','percent.of','fraction.add']){
  const q=buildQuestion(kind,params);
  const own={'index.value':'7^4','index.product':'x^7*x^4','index.standard':'70000','algebra.expand':'7*(4*x+3)','algebra.factor':'28*x+21','percent.of':'7/100*400','fraction.add':'7/4+3/2'}[kind];
  assert.notEqual(markFinalAnswer(own,q.correctAnswer,q.answerSpec,q.acceptedForms).verdict,'correct',`${kind}: ${own}`);
 }
});
test('stepped inputs use the same parameters as the question, and validate each step',()=>{
 const p={a:12,b:7,c:5,d:3,n:4,stage:4};
 for(const kind of ['percent.compound','bounds.area','algebra.factor']){
  const q=buildQuestion(kind,p);
  assert.equal(q.validatedSteps.length,2,kind);
  for(const step of q.validatedSteps){
   assert.equal(markFinalAnswer(step.correctAnswer,step.correctAnswer,step.answerSpec).verdict,'correct',kind);
   assert.notEqual(markFinalAnswer('2+2',step.correctAnswer,step.answerSpec).verdict,'correct',kind);
  }
 }
});

test('equivalent equations, sets and factorisation restrictions',()=>{
 assert.equal(markFinalAnswer('2*x=6','x=3',{kind:'equation'}).verdict,'correct');
 assert.equal(markFinalAnswer('x=4','x=3',{kind:'equation'}).verdict,'incorrect');
 assert.equal(markFinalAnswer('{3,2,1}','{1,2,3}',{kind:'set'}).verdict,'correct');
 assert.equal(markFinalAnswer('1*(x+2)','x+2',{kind:'factorised-expression'}).verdict,'invalid-form');
});
