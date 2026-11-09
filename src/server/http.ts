import {HttpError} from './auth';
export const runtime='nodejs';
export function json(data:unknown,status=200):Response{return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});}
export async function body(req:Request,max=24000):Promise<Record<string,unknown>>{
 const contentLength=Number(req.headers.get('content-length')||0);if(contentLength>max)throw new HttpError(413,'Request too large');
 const txt=await req.text();if(txt.length>max)throw new HttpError(413,'Request too large');
 try{const x=JSON.parse(txt);if(x&&typeof x==='object'&&!Array.isArray(x))return x;}catch{}
 throw new HttpError(400,'Invalid request body');
}
export function str(x:unknown,max=250):string{if(typeof x!=='string'||x.length>max)throw new HttpError(400,'Invalid text');return x;}
export function numberIn(x:unknown,min:number,max:number):number{if(typeof x!=='number'||!Number.isInteger(x)||x<min||x>max)throw new HttpError(400,`Expected whole number ${min}–${max}`);return x;}
export async function respond(fn:()=>Promise<unknown>,status=200):Promise<Response>{try{return json(await fn(),status);}catch(e){if(e instanceof HttpError)return json({error:e.message},e.status);console.error('Request failure:',e);return json({error:'A server error occurred'},500);}}
