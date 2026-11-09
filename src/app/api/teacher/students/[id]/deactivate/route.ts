import {teacher,HttpError,audit} from '@/server/auth';import {transaction} from '@/server/db';import {respond} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const t=await teacher(req),id=(await params).id;
 return transaction(async client=>{
  const {rows}=await client.query("UPDATE users SET active=false WHERE id=$1 AND role='student' AND active=true RETURNING id",[id]);
  if(!rows[0])throw new HttpError(404,'Active student not found');
  await client.query('UPDATE sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',[id]);
  await audit(client,t.id,'student_deactivated',id);return {deactivated:true};
 });
});}
