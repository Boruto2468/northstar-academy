import {body,respond} from '@/server/http';
import {postThreadMessage} from '@/server/chat';
export const runtime='nodejs';
type Ctx={params:Promise<{id:string}>};
export async function POST(req:Request,{params}:Ctx){const {id}=await params;return respond(async()=>postThreadMessage(req,id,await body(req,7000)),201);}
