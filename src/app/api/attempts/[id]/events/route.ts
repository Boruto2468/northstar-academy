import {currentUser} from '@/server/auth';import {body,respond,str} from '@/server/http';import {recordEvent} from '@/server/assessments';
export const runtime='nodejs';export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{const d=await body(req,1000);return recordEvent(await currentUser(req),(await params).id,str(d.event,40));});}
