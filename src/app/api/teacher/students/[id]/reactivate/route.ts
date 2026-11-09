import {teacher,HttpError,audit,DELETED_ACCOUNT_PASSWORD_HASH} from '@/server/auth';
import {transaction} from '@/server/db';
import {respond} from '@/server/http';

export const runtime='nodejs';

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}) {
 return respond(async()=>{
  const t=await teacher(req),id=(await params).id;
  return transaction(async client=>{
   const {rows}=await client.query("UPDATE users SET active=true WHERE id=$1 AND role='student' AND active=false AND password_hash<>$2 RETURNING id",[id,DELETED_ACCOUNT_PASSWORD_HASH]);
   if(!rows[0])throw new HttpError(404,'Deactivated student not found');
   await audit(client,t.id,'student_reactivated',id);
   return {reactivated:true};
  });
 });
}
