import {teacher,HttpError,audit} from '@/server/auth';import {hashPassword} from '@/server/security';import {transaction} from '@/server/db';import {respond,body,str} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const t=await teacher(req),id=(await params).id,data=await body(req,6000),password=await hashPassword(str(data.newPassword,128));
 return transaction(async client=>{
  const {rows}=await client.query("UPDATE users SET password_hash=$2 WHERE id=$1 AND role='student' AND active=true RETURNING id",[id,password]);
  if(!rows[0])throw new HttpError(404,'Active student not found');
  await client.query('UPDATE sessions SET revoked_at=now() WHERE user_id=$1 AND revoked_at IS NULL',[id]);
  await audit(client,t.id,'student_password_reset',id);return {reset:true};
 });
});}
