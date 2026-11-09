/** Phase 1: final-form gate followed by mathematical equivalence. No eval(),
 * substring matching, arbitrary function calls, or broad default tolerance. */
export type AnswerSpec = {
 kind:'integer'|'decimal'|'fraction'|'standard-form'|'single-power'|'simplified-expression'|'expanded-expression'|'factorised-expression'|'prime-factorisation'|'ratio'|'surd'|'equation'|'set';
 decimalPlaces?:number; significantFigures?:number; tolerance?:number;
};
export type MarkResult={verdict:'correct'|'incorrect'|'invalid-form';message:string};
const compact=(s:string)=>s.trim().replace(/−/g,'-').replace(/×/g,'*').replace(/÷/g,'/').replace(/√\s*\(/g,'sqrt(').replace(/√\s*(\d+(?:\.\d+)?)/g,'sqrt($1)').replace(/\s+/g,'');
const intPattern=/^[+-]?\d+$/;
const numPattern=/^[+-]?(?:\d+(?:\.\d+)?|\.\d+)(?:[eE][+-]?\d+)?$/;
const ratioPattern=/^\d+:\d+$/;
function asRational(value:string):[bigint,bigint]|null {
 if(!/^[+-]?\d+(?:\/\d+)?$/.test(value))return null;
 const [num,den='1']=value.split('/');const a=BigInt(num),b=BigInt(den);
 return b===0n?null:[a,b];
}
function fractionEqual(a:string,b:string):boolean{
 const left=asRational(a),right=asRational(b);
 return !!left&&!!right&&left[0]*right[1]===right[0]*left[1];
}
function standardRational(value:string):[bigint,bigint]|null {
 const m=stdPattern.exec(value);if(!m)return null;
 const power=Number(m[2]);if(!Number.isSafeInteger(power)||Math.abs(power)>308)return null;
 const coefficient=m[1],parts=coefficient.replace(/^\+/, '').split('.');
 const digits=parts.join(''),decimalCount=(parts[1]||'').length;
 let num=BigInt(digits),den=10n**BigInt(decimalCount);
 if(power>=0)num*=10n**BigInt(power);else den*=10n**BigInt(-power);
 return [num,den];
}
function standardEqual(a:string,b:string):boolean{
 const x=standardRational(a),y=standardRational(b);
 return !!x&&!!y&&x[0]*y[1]===y[0]*x[1];
}
function powerToFraction(input:string):[bigint,bigint]|null{
 const s=input.replace(/\s+/g,'');const reciprocal=/^1\/\(?(\d+)\^(\d+)\)?$/.exec(s);
 if(reciprocal){const base=BigInt(reciprocal[1]),exponent=Number(reciprocal[2]);if(exponent>128)return null;return [1n,base**BigInt(exponent)];}
 const bare=/^(\d+)\^\(?(-?\d+)\)?$/.exec(s);
 if(bare){const base=BigInt(bare[1]),exp=Number(bare[2]);if(Math.abs(exp)>128)return null;return exp<0?[1n,base**BigInt(-exp)]:[base**BigInt(exp),1n];}
 return null;
}
const fracPattern=/^[+-]?\d+\/\d+$/;
const stdPattern=/^([+-]?(?:\d+(?:\.\d+)?|\.\d+))\*10\^([+-]?\d+)$/;
const powerPattern=/^(?:[a-z]|[1-9]\d*)\^\(?[+-]?\d+\)?$/i;
function gcd(a:bigint,b:bigint):bigint {a=a<0n?-a:a;b=b<0n?-b:b;while(b){[a,b]=[b,a%b]}return a;}
function isReducedFraction(s:string){if(!fracPattern.test(s))return false;const [n,d]=s.split('/').map(BigInt);return d!==0n&&gcd(n,d)===1n;}
function decimalSignificantFigures(value:string):number{
 const unsigned=value.replace(/^[+-]/,'');
 const mantissa=unsigned.split(/[eE]/)[0];
 const stripped=mantissa.replace('.','').replace(/^0+/,'');
 if(!stripped)return 0;
 // Without a decimal point, trailing zeros have ambiguous precision.
 return !mantissa.includes('.') ? stripped.replace(/0+$/,'').length : stripped.length;
}
/** Deliberately limited arithmetic parser: only + - * / ^, parentheses, sqrt and x/y.
    This rejects arbitrary JavaScript and never executes input as code. */
export function evaluateExpression(input:string,scope:{x:number;y:number}={x:2,y:3}):number{
 const str=compact(input).replace(/\)(?=[\dxys])/g,')*').replace(/(\d)(?=[xy])/g,'$1*').replace(/([xy])(?=\()/g,'$1*');
 const tokens=str.match(/sqrt|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?|[xy]|[()+*/^\-]/g)||[];
 if(!tokens.length||tokens.join('')!==str)throw Error('unsupported mathematical syntax');
 let pos=0;
 const peek=()=>tokens[pos];const accept=(s:string)=>peek()===s?(pos++,true):false;
 const primary=():number=>{if(accept('(')){const v=add();if(!accept(')'))throw Error('missing )');return v;}if(accept('sqrt')){if(!accept('('))throw Error('sqrt needs parentheses');const x=add();if(!accept(')')||x<0)throw Error('invalid sqrt');return Math.sqrt(x);}const t=tokens[pos++];if(t==='x'||t==='y')return scope[t];if(!t||!/^\d|^\./.test(t))throw Error('invalid operand');return Number(t);};
 const pow=():number=>{let x=primary();if(accept('^'))x=Math.pow(x,unary());return x;};
 const unary=():number=>{if(accept('+'))return unary();if(accept('-'))return -unary();return pow();};
 const mul=():number=>{let v=unary();while(true){if(accept('*'))v*=unary();else if(accept('/'))v/=unary();else break;}return v;};
 const add=():number=>{let v=mul();while(true){if(accept('+'))v+=mul();else if(accept('-'))v-=mul();else break;}return v;};
 const value=add();if(pos!==tokens.length||!Number.isFinite(value))throw Error('invalid evaluation');return value;
}
export function numericallyEquivalent(input:string,reference:string,tolerance=0):boolean{
 try{return [{x:2,y:3},{x:5,y:7},{x:11,y:13},{x:17,y:19}].every(scope=>{
 const a=evaluateExpression(input,scope),b=evaluateExpression(reference,scope);
 return tolerance ? Math.abs(a-b)<=tolerance : Math.abs(a-b)<=1e-12*Math.max(1e-100,Math.abs(b));
 });}catch{return false;}
}
function validSet(value:string):boolean{return /^\{(?:[A-Za-z0-9]+(?:,[A-Za-z0-9]+)*)?\}$/.test(value)}

function isExpandedPolynomial(value:string):boolean {
 // Accepted grammar: a sum of distinct, non-zero monomials or constants.
 // No brackets, unfinished products or repeated like terms.
 if(value.includes('(')||value.includes(')')||value.includes('/'))return false;
 const terms=value.replace(/-/g,'+-').split('+').filter(Boolean);
 if(!terms.length)return false;
 const seen=new Set<string>();
 for(const term of terms){
  const m=/^(-?(?:\d+(?:\.\d+)?\*?)?)([xy])(?:\^(\d+))?$/.exec(term);
  let key='constant',coef=0;
  if(m){
   if(m[3]==='0'||m[3]==='1')return false;
   key=`${m[2]}^${m[3]||1}`;
   const prefix=m[1].replace(/\*$/,'');coef=prefix===''?1:prefix==='-'?-1:Number(prefix);
  }else if(/^-?\d+(?:\.\d+)?$/.test(term)){coef=Number(term);}else return false;
  if(!Number.isFinite(coef)||coef===0||seen.has(key))return false;
  seen.add(key);
 }
 return true;
}
function validFinalForm(value:string,spec:AnswerSpec):boolean{
 switch(spec.kind){
 case 'integer':return intPattern.test(value);
 case 'decimal':{
  if(!numPattern.test(value))return false;
  if(spec.decimalPlaces!==undefined&&!new RegExp(`^[+-]?\\d+\\.\\d{${spec.decimalPlaces}}$`).test(value))return false;
  if(spec.significantFigures!==undefined&&decimalSignificantFigures(value)!==spec.significantFigures)return false;
  return true;
 }
 case 'fraction':return intPattern.test(value)||isReducedFraction(value);
 case 'ratio':if(!ratioPattern.test(value))return false;{
  const [a,b]=value.split(':').map(BigInt);return b>0n&&gcd(a,b)===1n;
 }
 case 'standard-form':{
  const m=stdPattern.exec(value);return !!m&&Math.abs(Number(m[1]))>=1&&Math.abs(Number(m[1]))<10&&Number.isInteger(Number(m[2]));
 }
 case 'single-power':return powerPattern.test(value)||/^1\/\(?(?:[1-9]\d*\^[1-9]\d*)\)?$/.test(value);
 case 'prime-factorisation':{
  const factors=value.split('*');let last=1;
  if(factors.length<2)return false;
  for(const term of factors){const match=/^(\d+)(?:\^(\d+))?$/.exec(term);if(!match)return false;
   const base=Number(match[1]),exp=Number(match[2]||1);if(base<=last||exp<1||!Number.isSafeInteger(exp)||!Number.isSafeInteger(base))return false;
   for(let i=2;i*i<=base;i++)if(base%i===0)return false;last=base;
  }return true;
 }
 case 'factorised-expression':return /[a-z]/i.test(value)&&value.includes('(')&&value.includes(')')&&/^[\dxy()+*^/-]+$/i.test(value)&&!value.includes('sqrt')&&!/(?:^|\*)1\*|\*1(?:\*|$)/.test(value);
 case 'surd':{
  if(!/sqrt\(\d+\)/.test(value)||!/^[\d()+*\/-]|^sqrt/.test(value))return false;
  if(!/^[\d()+*\/-]|sqrt/.test(value))return false;
  if(!/^[\d()+*/\-.sqrt]+$/.test(value))return false;
  if(/\/\(?sqrt\(/.test(value))return false; // denominator not rationalised
  for(const m of value.matchAll(/sqrt\((\d+)\)/g)){
   const n=Number(m[1]);if(n<2)return false;
   for(let k=2;k*k<=n;k++)if(n%(k*k)===0)return false; // radical not simplified
  }return true;
 }
 case 'expanded-expression':return isExpandedPolynomial(value);
 case 'simplified-expression':{
  if(!/[a-z]|sqrt/i.test(value))return false; // numeric calculations belong in numeric formats
  if(!/^[\dxy()+*^/\-.sqrt]+$/i.test(value))return false;
  if(/\)\s*\+\s*\(/.test(value)||/[a-z]\^\d+\*[a-z]\^\d+/i.test(value)||/[+\-]0(?:$|[+\-])/.test(value))return false;
  if((value.match(/(?:^|[+-])(?:\d+\*)?x(?=[+-]|$)/g)||[]).length>1||(value.match(/(?:^|[+-])(?:\d+\*)?y(?=[+-]|$)/g)||[]).length>1)return false;
  if(/\/\(?sqrt\(/.test(value))return false;
  return true;
 }
 case 'equation':return /^[\dxy()+*^/\-.]+=[\dxy()+*^/\-.]+$/i.test(value);
 case 'set':return validSet(value);
 }
}
export function markFinalAnswer(input:string,reference:string,spec:AnswerSpec,acceptedForms:string[]=[reference]):MarkResult{
 const value=compact(input);
 if(!value||!validFinalForm(value,spec))return {verdict:'invalid-form',message:'Not in final form: finish simplifying (or use the required notation).'};
 if(spec.kind==='set'){
  const normalize=(v:string)=>v.slice(1,-1).split(',').sort().join(',');
  return {verdict:normalize(value)===normalize(compact(reference))?'correct':'incorrect',message:normalize(value)===normalize(compact(reference))?'Correct.':'Not quite. Check the rule and try again.'};
 }
 if(spec.kind==='ratio'){
  const pass=acceptedForms.some(f=>compact(f)===value);
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check the ratio and try again.'};
 }
 if(spec.kind==='equation'){
  const parts=value.split('='),target=compact(reference).split('=');
  let pass=parts.length===2&&target.length===2;
  let scale:number|null=null;
  if(pass)try{
   for(const scope of [{x:2,y:3},{x:5,y:7},{x:11,y:13},{x:17,y:19}]){
    const left=evaluateExpression(`(${parts[0]})-(${parts[1]})`,scope);
    const right=evaluateExpression(`(${target[0]})-(${target[1]})`,scope);
    if(Math.abs(right)<1e-12){if(Math.abs(left)>1e-12){pass=false;break;}continue;}
    const ratio=left/right;if(!Number.isFinite(ratio)||Math.abs(ratio)<1e-12){pass=false;break;}
    if(scale===null)scale=ratio;
    else if(Math.abs(ratio-scale)>1e-12*Math.max(1,Math.abs(scale))){pass=false;break;}
   }
  }catch{pass=false;}
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check the equation.'};
 }
 if(spec.kind==='integer'){
  const pass=acceptedForms.some(f=>intPattern.test(compact(f))&&BigInt(value)===BigInt(compact(f)));
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your calculation.'};
 }
 if(spec.kind==='fraction'){
  const pass=acceptedForms.some(f=>fractionEqual(value,compact(f)));
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your fraction.'};
 }
 if(spec.kind==='standard-form'&&spec.tolerance===undefined){
  const pass=acceptedForms.some(f=>standardEqual(value,compact(f)));
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your standard form.'};
 }
 if(spec.kind==='single-power'){
  const target=compact(reference);const symbolic=/^[a-z]\^\(?([+-]?\d+)\)?$/i;
  if(symbolic.test(target)){
   const pass=acceptedForms.some(f=>compact(f)===value);
   return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your index law.'};
  }
  const testPower=powerToFraction(value),expectedPower=powerToFraction(target);
  const pass=!!testPower&&!!expectedPower&&testPower[0]*expectedPower[1]===expectedPower[0]*testPower[1];
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your index law.'};
 }
 if(spec.kind==='decimal'&&spec.tolerance===undefined){
  const pass=acceptedForms.some(f=>Number(value)===Number(compact(f)));
  return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your decimal.'};
 }
 const pass=acceptedForms.some(f=>numericallyEquivalent(value,f,spec.tolerance));
 return {verdict:pass?'correct':'incorrect',message:pass?'Correct.':'Not quite. Check your working.'};
}
export function recogniseMistake(input:string,wrongAnswers:{value:string;reason:string}[]):string|null{
 const val=compact(input);
 for(const item of wrongAnswers){if(val===compact(item.value))return item.reason;}
 return null;
}
