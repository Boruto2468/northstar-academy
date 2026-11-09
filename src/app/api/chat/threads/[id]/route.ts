import {body,respond} from '@/server/http';
import {readThread,updateThread} from '@/server/chat';
export const runtime='nodejs';
type Ctx={params:Promise<{id:string}>};
export async function GET(req:Request,{params}:Ctx){const {id}=await params;return respond(()=>readThread(req,id));}
export async function PATCH(req:Request,{params}:Ctx){const {id}=await params;return respond(async()=>updateThread(req,id,await body(req,1024)));}
