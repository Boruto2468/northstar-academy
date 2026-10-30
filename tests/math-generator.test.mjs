import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mathsChapters} from '../src/maths/catalogue.ts';
import {buildQuestion,randomParams,makeUniqueQuestion,paramsKey,answerKey} from '../src/maths/generator.ts';
const gcd=(a,b)=>b?gcd(b,a%b):Math.abs(a);
const frac=(n,d)=>n/gcd(n,d)/ (d/gcd(n,d));

// A second implementation of every advanced problem, using the question parameters
// rather than parsing or reusing the generator's own worked solutions.
function advancedReference(kind,p){
 const {a,b,c,d,n}=p;
 switch(kind){
 case 'index.value':return a**n+b*b;
 case 'index.product':return x=>x**(a+b-c);
 case 'index.quotient':return x=>x**(a+c);
 case 'index.power':return x=>x**(n*c+a-b);
 case 'index.zero':return 3*n;
 case 'index.negative':return 1/(a**(n+b));
 case 'index.fractional':return 1/a;
 case 'index.calculator':return a**n+b**(c%4+2)-d;
 case 'index.standard':return (a/10)*10**(3-n);
 case 'index.standardops':return (a/10)*(b/10)/(c/10)*10**(n+c-d);
 case 'decimal.recurring':return (9*(a%9+1)+(b%9+1))/90;
 case 'decimal.sigfig':{const x=(a*1000+b*10+c/10)/1e5;return Number(x.toPrecision(2))+d/1000;}
 case 'decimal.places':{const x=a+b/10+c/1000+d/1e4;return Math.round(x*100)*n/100;}
 case 'decimal.estimate':return 1000*Math.round((a*10+c)/10)*Math.round((b*10+d)/10)*Math.round((n*10+3)/10);
 case 'prime.factor':return 2**(n%3+2)*3**(a%3+2)*5**(b%2+1)*7;
 case 'prime.hcf':return (6*a/(3*a)+9*a/(3*a))*n;
 case 'prime.lcm':return ((4*a)*(6*a)/gcd(4*a,6*a))*n;
 case 'surd.meaning':return Math.sqrt(2*a*a);
 case 'surd.simplify':return a*Math.sqrt(8)-b*Math.sqrt(18)+c*Math.sqrt(50);
 case 'surd.rational':return a/(Math.sqrt(3)+Math.sqrt(2));
 case 'fraction.order':{let third=n+d+1;while([a/(a+b),c/(c+d)].some(x=>Math.abs(x-n/third)<1e-12))third++;const z=[a/(a+b),c/(c+d),n/third].sort((x,y)=>x-y);return z[1];}
 case 'fraction.quantity':return (a+b)*(c+d)*n*(1-a/(a+b))*(1-c/(c+d));
 case 'fraction.add':return a/b+c/d-1/n;
 case 'fraction.multiply':return (a/b)*(c/d)/n;
 case 'fraction.mixed':return a+b/(b+c)+(n+c)+(n%d||1)/d;
 case 'percent.of':return (b*100)*(1-a/100)*(1-c/100);
 case 'percent.as':return Number((100*a/b).toFixed(2));
 case 'percent.change':return b*100*(1+a/100)*(1-c/100);
 case 'percent.reverse':return b*100;
 case 'percent.repeated':return Number((b*100*(1-(a%15+5)/100)**(n%3+2)).toFixed(2));
 case 'percent.compound':{const start=b*100,r=a%15+5,t=n%3+2;const compound=Number((start*(1+r/100)**t).toFixed(2));const simple=start*(1+t*r/100);return Number((compound-simple).toFixed(2));}
 case 'ratio.simplify':{const A=a*100,B=b*c*10,g=gcd(A,B);return `${A/g}:${B/g}`;}
 case 'ratio.share':return b*c+n;
 case 'ratio.direct':return (a*c/a)*(b+n);
 case 'ratio.units':return 3*a*10*n/60;
 case 'bounds.interval':return a+b/10+0.05;
 case 'bounds.area':return (a+0.5)*(b+0.5)-(a-0.5)*(b-0.5);
 case 'sets.notation':return (a+b+c+d)-((a+b)+(b+c)-b);
 case 'sets.complement':return (a+b+c+d)-((a+b)+(b+c)-b);
 case 'sets.venn':return (a+b+c+d)-(a+b+c);
 case 'sets.probability':return (a+c)/(a+b+c+d);
 case 'algebra.collect':return x=>(a+c)*x+(b-d)*3; // evaluated with y=3
 case 'algebra.expand':return x=>a*(b*x+c)-d*(x+n);
 case 'algebra.factor':return x=>a*x*(b*x+c);
 case 'algebra.foil':return x=>(x+a)*(x+b)-x*x;
 case 'algebra.quadratic':return x=>2*(x+a)*(x+b);
 default:return null;
 }
}

function reference(kind,p){
 if(p.stage>=4){const advanced=advancedReference(kind,p);if(advanced!==null)return advanced;}
 const {a,b,c,d,n}=p;
 switch(kind){
 case 'index.calculator':return a**n+b*b;
 case 'index.value':return Math.pow(a,n);
 case 'index.product':return x=>Math.pow(x,p.stage>=4?a+b-c:a+b);
 case 'index.quotient':return x=>Math.pow(x,p.stage>=4?a+c:a);
 case 'index.power':return x=>Math.pow(x,p.stage>=4?n*c+a-b:n*c);
 case 'index.zero':return p.stage>=4?3:1+b;
 case 'index.negative':return 1/Math.pow(a,p.stage>=4?n+b:n);
 case 'index.fractional':return p.stage>=4?1/Math.pow(Math.pow(a,n),1/n):Math.pow(Math.pow(a,n),1/n);
 case 'index.standard':return a*Math.pow(10,n);
 case 'index.standardops':return (a/10)*(b/10)*Math.pow(10,n+c);
 case 'decimal.recurring':return (a%9+1)/9;
 case 'decimal.sigfig':{const x=a*100+b*10+c/10;return Number(x.toPrecision(n%3+1));}
 case 'decimal.places':{const digits=n%3+1;const millis=a*1000+b*100+c*10+d;const div=10**(3-digits);return Math.round(millis/div)*div/1000;}
 case 'decimal.estimate':return Math.round((a*10+c)/10)*Math.round((b*10+d)/10)*100;
 case 'prime.factor':return Math.pow(2,n%3+1)*Math.pow(3,a%3+1)*Math.pow(5,b%2+1);
 case 'prime.hcf':return gcd(a*6,a*9);
 case 'prime.lcm':return (a*4)*(a*6)/gcd(a*4,a*6);
 case 'surd.meaning':return a*Math.sqrt(2);
 case 'surd.simplify':return a*Math.sqrt(8)+b*Math.sqrt(18);
 case 'surd.rational':return a/Math.sqrt(2);
 case 'fraction.order':return Math.max(a/(a+b),c/(c+d));
 case 'fraction.quantity':return a/(a+b)*(c*(a+b));
 case 'fraction.add':return a/b+c/d;
 case 'fraction.multiply':return a/b/(c/d);
 case 'fraction.mixed':return a+b/(b+c);
 case 'percent.of':return a/100*(b*100);
 case 'percent.as':return Number((100*a/(a+b)).toFixed(2));
 case 'percent.change':return b*100+(b*100*a/100);
 case 'percent.reverse':return (b*100*(1+a/100))/(1+a/100);
 case 'percent.repeated':return b*100*(1+(a%20+5)/100)*(1-(a%20+5)/100);
 case 'percent.compound':return Number((b*100*Math.pow(1+(a%15+5)/100,n%3+2)).toFixed(2));
 case 'ratio.simplify':return `${a/gcd(a,b)}:${b/gcd(a,b)}`;
 case 'ratio.share':return (a/(a+b))*(a+b)*c;
 case 'ratio.direct':return a*c/a*b;
 case 'ratio.units':return a*3/a*b;
 case 'bounds.interval':return a+1/2;
 case 'bounds.area':return (a+1/2)*(b+1/2);
 case 'sets.notation':return (a+b)+(b+c)-b;
 case 'sets.complement':return (a+b+c)-(a+b);
 case 'sets.venn':return a+b-b;
 case 'sets.probability':return a/(a+b+c);
 case 'algebra.collect':return x=>(a+b-c)*x;
 case 'algebra.expand':return x=>a*(b*x+c);
 case 'algebra.factor':return x=>a*(b*x+c);
 case 'algebra.foil':return x=>(x+a)*(x+b);
 case 'algebra.quadratic':return x=>(x+a)*(x+b);
 default:throw Error(`No independent oracle for ${kind}`);
 }
}
function safeValue(value,x){const src=value.replace(/\^/g,'**').replace(/sqrt\(/g,'Math.sqrt(');assert.match(src,/^[\d\sxy()+*./\-Mathsqrt]+$/);return Function('x','y',`return (${src})`)(x,3)}
function close(a,b,ctx){assert.ok(Number.isFinite(a)&&Number.isFinite(b),`${ctx}: non-finite ${a}/${b}`);assert.ok(Math.abs(a-b)<=1e-7*Math.max(1,Math.abs(a),Math.abs(b)),`${ctx}: expected ${b}, got ${a}`)}
function checkGenerated(kind,q){const p=q.params;const base=reference(kind,p);if(kind==='ratio.simplify'){
  assert.equal(q.correctAnswer,base);return;
 }
 for(const x of [2,3,5]){
  let expected=typeof base==='function'?base(x):base;
  const stage=p.stage;
  const symbolic=typeof base==='function'||(kind==='index.fractional'&&stage>=4)||['index.standard','index.standardops','decimal.recurring','prime.factor','surd.meaning','surd.simplify','surd.rational','fraction.order','fraction.add','fraction.multiply','fraction.mixed','sets.probability','index.negative'].includes(kind);
  if(stage>=2&&kind!=='prime.factor'&&!(stage>=4&&advancedReference(kind,p)!==null)){
   if(symbolic){expected+=(stage===2?p.c:stage===3?-p.d:stage===4?p.c*p.d:-(p.c+p.d));}
   else if(stage===2)expected+=p.c;
   else if(stage===3)expected=expected*p.d-p.c;
   else if(stage===4)expected=(expected+p.c)*p.d;
   else expected=expected*p.d+p.c;
  }
  // Rounding to 10 decimal places is used for explicit typed numeric answers.
  close(safeValue(q.correctAnswer,x),expected,`${kind} stage=${stage} params=${JSON.stringify(p)} x=${x}`);
 }
 assert.ok(q.promptText.length>=12);
 assert.ok(q.hint[0]!==q.hint[1]);
 assert.ok(q.workedSolution.at(-1).includes(q.correctAnswer));
 assert.equal(q.id,buildQuestion(kind,p).id);
 assert.equal(q.correctAnswer,buildQuestion(kind,p).correctAnswer);
 assert.equal(q.promptText,buildQuestion(kind,p).promptText);
 const restored=JSON.parse(JSON.stringify({templateId:kind,params:p}));
 assert.equal(buildQuestion(restored.templateId,restored.params).correctAnswer,q.correctAnswer);
 assert.equal(buildQuestion(restored.templateId,restored.params).workedSolution.join('|'),q.workedSolution.join('|'));
}
const all=Object.values(mathsChapters).flat().map(x=>x.kind);
assert.equal(new Set(all).size,all.length,'Each law must have an explicit independently testable template');
for(const kind of all){
 test(`${kind}: 500 generated questions independently recomputed`,()=>{
  let seed=0x824e9bad;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
  for(let i=0;i<500;i++){const p=randomParams(random,i%6);const q=buildQuestion(kind,p);checkGenerated(kind,q);}
 });
 test(`${kind}: six graded questions are unique in ID, params and answer`,()=>{
  let seed=0x2216ace;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
  const registry={ids:[],parameterKeys:[]};const answers=new Set();
  for(let stage=0;stage<6;stage++){
   const q=makeUniqueQuestion(kind,stage,random,registry,answers,'exercise',candidate=>[...answers].some(x=>x===answerKey(candidate.correctAnswer)));
   assert.ok(q,`${kind}: can't generate stage ${stage}`);
   assert.ok(!registry.ids.includes(q.id));assert.ok(!registry.parameterKeys.includes(paramsKey(q)));
   assert.ok(!answers.has(answerKey(q.correctAnswer)));
   registry.ids.push(q.id);registry.parameterKeys.push(paramsKey(q));answers.add(answerKey(q.correctAnswer));
  }
 });
}


function semanticallyEqual(first,second){
 if(first.includes(':')||second.includes(':'))return first===second;
 try{return [2,3,5].every(x=>Math.abs(safeValue(first,x)-safeValue(second,x))<=1e-8*Math.max(1,Math.abs(safeValue(first,x)),Math.abs(safeValue(second,x))))}catch{return first===second;}
}
test('all Maths chapters persist 6-answer sets without mathematically equivalent duplicates',()=>{
 let seed=0x1a2b3c4d;const random=()=>{seed^=seed<<13;seed^=seed>>>17;seed^=seed<<5;return (seed>>>0)/4294967296};
 for(const kind of all){for(let round=0;round<12;round++){
  const used={ids:[],parameterKeys:[]},seenAnswers=new Set(),issued=[];
  for(let stage=0;stage<6;stage++){
   const q=makeUniqueQuestion(kind,stage,random,used,seenAnswers,'exercise',candidate=>issued.some(prev=>semanticallyEqual(prev.correctAnswer,candidate.correctAnswer)));
   assert.ok(q,`${kind} cannot make a full unique set (round ${round}, stage ${stage})`);
   assert.ok(issued.every(prev=>!semanticallyEqual(prev.correctAnswer,q.correctAnswer)),`${kind} repeated an equivalent answer`);
   issued.push(q);used.ids.push(q.id);used.parameterKeys.push(paramsKey(q));seenAnswers.add(answerKey(q.correctAnswer));
  }
 }
 }
});
