'use client';
export type Viewer={id:string;username:string;displayName:string;role:'student'|'teacher'};
type Credentials={accessToken:string;refreshToken:string;accessExpiresAt:string;user:Viewer};
const key='northstar-tab-session-v1';
function read():Credentials|null {try{return JSON.parse(sessionStorage.getItem(key)||'null') as Credentials|null;}catch{return null;}}
export function sessionUser():Viewer|null {return read()?.user||null;}
export function remember(c:Credentials){sessionStorage.setItem(key,JSON.stringify(c));window.dispatchEvent(new Event('northstar-auth-changed'));}
export function clearSession(){sessionStorage.removeItem(key);window.dispatchEvent(new Event('northstar-auth-changed'));}
let renewing:Promise<boolean>|null=null;
async function refresh():Promise<boolean>{
 if(renewing)return renewing;
 renewing=(async()=>{
  const c=read();if(!c?.refreshToken)return false;
  try{const res=await fetch('/api/auth/refresh',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({refreshToken:c.refreshToken}),cache:'no-store'});
   if(!res.ok){clearSession();return false;}remember(await res.json() as Credentials);return true;
  }catch{return false;}
 })();try{return await renewing;}finally{renewing=null;}
}
export async function api(path:string,options:RequestInit={}):Promise<unknown>{
 if(!path.startsWith('/api/'))throw Error('Invalid API route');
 let c=read();if(!c)throw Error('Please log in to continue');
 if(Date.now()+20000>=new Date(c.accessExpiresAt).getTime()){if(!(await refresh()))throw Error('Session expired. Please sign in again');c=read();}
 const call=()=>fetch(path,{...options,cache:'no-store',headers:{'Content-Type':'application/json',...(options.headers||{}),Authorization:`Bearer ${read()?.accessToken||''}`}});
 let response=await call();if(response.status===401&&await refresh())response=await call();
 let data:Record<string,unknown>={};try{data=await response.json() as Record<string,unknown>;}catch{}
 if(!response.ok)throw Error(typeof data.error==='string'?data.error:`Request failed (${response.status})`);
 return data;
}
export async function signIn(username:string,password:string):Promise<Viewer>{
 const response=await fetch('/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password}),cache:'no-store'});
 const data=await response.json();if(!response.ok)throw Error(data.error||'Sign-in failed');remember(data);return data.user;
}
export async function signOut(){try{if(read())await api('/api/auth/logout',{method:'POST'});}catch{}clearSession();}
