import {login} from '@/server/auth';import {body,respond,str} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request){return respond(async()=>{const d=await body(req,4000);return login(str(d.username,36),str(d.password,128));});}
