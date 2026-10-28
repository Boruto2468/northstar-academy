import type {Question} from '@/types/topic';
export function rng(seed:number){let s=seed>>>0;return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296}}
export const pick=(r:()=>number,min:number,max:number)=>min+Math.floor(r()*(max-min+1));
export function instantiate(q:Question,r:()=>number):Question{
 if(q.generator==='curriculum'||(!q.generator && q.subtopicId)) return q;
 const a=pick(r,2,12),b=pick(r,2,9),p=pick(r,1,9)*10; let prompt=q.prompt,answer=q.answer,solution=q.solution;
 switch(q.generator){
 case 'percentage-of':prompt=`Find ${p}% of ${a*10}.`;answer=String(p*a/10);solution=[`${p}% = ${p}/100`,`(${p}/100) × ${a*10} = ${answer}`];break;
 case 'percentage-change':prompt=`Increase £${a*20} by ${p}%.`;answer=String(a*20*(100+p)/100);solution=[`Multiplier = 1 + ${p}/100`,`£${a*20} × ${(100+p)/100} = £${answer}`];break;
 case 'reverse-percent':prompt=`After a ${p}% increase, a price is £${a*(100+p)}. What was it originally?`;answer=String(a*100);solution=[`New price is ${100+p}% of original`,`£${a*(100+p)} ÷ ${(100+p)/100} = £${answer}`];break;
 case 'venn-union':prompt=`A has ${a+b} members, B has ${a+2} and ${b} are in both. Find n(A ∪ B).`;answer=String(2*a+2);solution=[`n(A ∪ B) = n(A) + n(B) − n(A ∩ B)`,`${a+b} + ${a+2} − ${b} = ${answer}`];break;
 case 'venn-intersection':prompt=`n(A)=${a+b}, n(B)=${a+2}, n(A ∪ B)=${2*a+2}. Find n(A ∩ B).`;answer=String(b);solution=[`Intersection = n(A) + n(B) − n(A ∪ B)`,`${a+b} + ${a+2} − ${2*a+2} = ${b}`];break;
 case 'venn-complement':prompt=`There are ${a*5} students and ${a*3} belong to set A. Find n(A′).`;answer=String(a*2);solution=[`Complement means not in A`,`${a*5} − ${a*3} = ${answer}`];break;
 case 'decimal-fraction':prompt=`Write 0.${a%8+1} as a fraction in its simplest form.`;answer=String((a%8+1)/10);solution=[`Put ${a%8+1} over 10`,`Simplify if possible`];break;
 case 'hcf':prompt=`Find the HCF of ${a*6} and ${a*9}.`;answer=String(a*3);solution=[`Find the prime factors of each number`,`Common factors give HCF = ${answer}`];break;
 case 'lcm':prompt=`Find the LCM of ${a*2} and ${a*3}.`;answer=String(a*6);solution=[`List multiples or use prime factors`,`First common multiple = ${answer}`];break;
 case 'ratio':prompt=`Share £${a*10} in the ratio 2:3. How much is the larger share?`;answer=String(a*6);solution=[`Total parts = 2 + 3 = 5`,`One part = £${a*2}`,`Three parts = £${a*6}`];break;
 case 'indices':prompt=`Evaluate ${a}³ ÷ ${a}².`;answer=String(a);solution=[`Subtract powers with the same base: 3 − 2 = 1`,`${a}¹ = ${a}`];break;
 case 'fractions':prompt=`Find 1/${a} of ${a*b}.`;answer=String(b);solution=[`Divide ${a*b} by ${a}`,`Answer = ${b}`];break;
 case 'bounds':prompt=`A length is ${a} cm to the nearest cm. What is its upper bound?`;answer=String(a+.5);solution=[`Half of 1 cm = 0.5 cm`,`Upper bound = ${a} + 0.5 = ${answer}`];break;
 case 'algebra':prompt=`Simplify ${a}x + ${b}x.`;answer=`${a+b}x`;solution=[`Add coefficients of like terms`,`${a}x + ${b}x = ${a+b}x`];break;
 case 'surds':prompt=`Simplify √${a*a*2}. Give the coefficient of √2.`;answer=String(a);solution=[`√(${a*a} × 2) = √${a*a} × √2`,`= ${a}√2`];break;
 }
 return {...q,prompt,answer,solution,id:`${q.id}:${a}:${b}:${p}`};
}
export function nextQuestion(bank:Question[],level:Question['level'],r:()=>number,seen:Set<string>):Question | null{
 const candidates=bank.filter(q=>q.level===level);if(!candidates.length)return null;
 for(let i=0;i<180;i++){const q=instantiate(candidates[pick(r,0,candidates.length-1)],r);if(!seen.has(q.id))return q}return null;
}
