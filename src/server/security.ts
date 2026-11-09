import 'server-only';
import {randomBytes,scrypt,timingSafeEqual,createHash} from 'node:crypto';
const N=32768, R=8, P=1;
function derive(password:string,salt:string,keyLength:number):Promise<Buffer>{
 return new Promise((resolve,reject)=>{
  scrypt(password,salt,keyLength,{N,r:R,p:P,maxmem:64*1024*1024},(error,key)=>{
   if(error)reject(error);
   else resolve(key);
  });
 });
}
export function token():string{return randomBytes(40).toString('base64url');}
export function sha256(value:string):string{return createHash('sha256').update(value).digest('hex');}
export async function hashPassword(password:string):Promise<string>{
 if(password.length<12||password.length>128)throw new Error('Password must have 12–128 characters');
 const salt=randomBytes(24).toString('hex');const key=await derive(password,salt,64);
 return `scrypt$${N}$${R}$${P}$${salt}$${key.toString('hex')}`;
}
export async function checkPassword(password:string,encoded:string):Promise<boolean>{
 const parts=encoded.split('$');if(parts.length!==6||parts[0]!=='scrypt')return false;
 const [,Nstr,Rstr,Pstr,saltValue,hexValue]=parts;
 const nValue=Number(Nstr),rValue=Number(Rstr),pValue=Number(Pstr);
 if(nValue!==N||rValue!==R||pValue!==P||!/^([0-9a-f]{48})$/.test(saltValue)||!/^[0-9a-f]{128}$/.test(hexValue))return false;
 const expected=Buffer.from(hexValue,'hex');const value=await derive(password,saltValue,64);
 return timingSafeEqual(expected,value);
}
