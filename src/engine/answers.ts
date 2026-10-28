import {evaluate,parse} from 'mathjs';
import type {Question} from '@/types/topic';
export function checkAnswer(input:string,q:Question):boolean{
 let raw=input.trim().replace(/,/g,'').replace(/×/g,'*').replace(/÷/g,'/').replace(/−/g,'-').replace(/√\s*\(?([0-9.]+)\)?/g,'sqrt($1)').replace(/(\d)([a-zA-Z])/g,'$1*$2');
 if(!raw)return false;
 if(q.kind==='choice')return raw.toLowerCase()===q.answer.toLowerCase();
 if(q.requiredForm==='fraction'&&!/^[-+]?\d+\s*\/\s*\d+$/.test(raw))return false;
 if(q.requiredForm==='percent'&&!/%$/.test(raw))return false;
 if(q.requiredForm==='standard'&&!/^[+-]?\d+(?:\.\d+)?\s*(?:\*|×|x)\s*10\s*\^\s*[-+]?\d+$/.test(raw))return false;
 try{const normal=(s:string)=>s.replace(/%/g,'/100').replace(/(\d)([a-zA-Z])/g,'$1*$2');const x=parse(normal(raw));const y=parse(normal(q.answer));const vars=['x','y','z'];for(const v of [0,1,2]){const scope={x:2+v,y:3+v,z:4+v};const n=Number(x.evaluate(scope)),m=Number(y.evaluate(scope));if(!Number.isFinite(n)||!Number.isFinite(m)||Math.abs(n-m)>1e-8*Math.max(1,Math.abs(m)))return false}return true}catch{return raw.toLowerCase()===q.answer.toLowerCase()}
}
