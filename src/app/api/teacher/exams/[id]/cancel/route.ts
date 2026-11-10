import {teacher,audit,HttpError} from '@/server/auth';
import {transaction} from '@/server/db';
import {respond} from '@/server/http';

export const runtime='nodejs';

export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const user=await teacher(req),id=(await params).id;
 return transaction(async client=>{
  const {rows}=await client.query("SELECT id,title,cancelled_at,closes_at>now() AS cancellable FROM assessments WHERE id=$1 AND kind='exam' FOR UPDATE",[id]);
  const exam=rows[0];
  if(!exam)throw new HttpError(404,'Exam not found');
  if(exam.cancelled_at)return {cancelled:true};
  if(!exam.cancellable)throw new HttpError(409,'A closed exam cannot be cancelled');
  await client.query('UPDATE assessments SET cancelled_at=now() WHERE id=$1',[id]);
  await audit(client,user.id,'exam_cancel',id,{title:exam.title});
  return {cancelled:true};
 });
});}
