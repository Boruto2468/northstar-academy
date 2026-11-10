import {teacher,audit,HttpError} from '@/server/auth';
import {transaction} from '@/server/db';
import {respond} from '@/server/http';

export const runtime='nodejs';

export async function DELETE(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const user=await teacher(req),id=(await params).id;
 return transaction(async client=>{
  const {rows}=await client.query("SELECT id,title FROM assessments WHERE id=$1 AND kind='exam' FOR UPDATE",[id]);
  if(!rows[0])throw new HttpError(404,'Exam not found');
  const {rows:count}=await client.query('SELECT count(*)::int AS attempts FROM attempts WHERE assessment_id=$1',[id]);
  await client.query('DELETE FROM exam_events WHERE attempt_id IN (SELECT id FROM attempts WHERE assessment_id=$1)',[id]);
  await client.query('DELETE FROM attempts WHERE assessment_id=$1',[id]);
  await client.query('DELETE FROM assessments WHERE id=$1',[id]);
  await audit(client,user.id,'exam_delete',id,{title:rows[0].title,deletedAttempts:count[0].attempts});
  return {deleted:true,deletedAttempts:count[0].attempts};
 });
});}
