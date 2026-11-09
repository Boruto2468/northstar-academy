import {rotate} from '@/server/auth';import {body,respond,str} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request){return respond(async()=>{const d=await body(req,4000);return rotate(str(d.refreshToken,200));});}
