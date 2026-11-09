import {teacher,permanentlyRemoveStudent} from '@/server/auth';
import {transaction} from '@/server/db';
import {respond} from '@/server/http';

export const runtime='nodejs';

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}) {
 return respond(async()=>{
  const t=await teacher(req),id=(await params).id;
  return transaction(client=>permanentlyRemoveStudent(client,id,t.id));
 });
}
