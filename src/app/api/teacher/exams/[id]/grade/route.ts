import {teacher,audit,HttpError} from '@/server/auth';import {transaction} from '@/server/db';import {respond,body,str} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const u=await teacher(req),examId=(await params).id,d=await body(req,5000);
 const itemId=str(d.itemId,60),points=Number(d.points);
 if(!Number.isFinite(points)||points<0||!Number.isInteger(points*2))throw new HttpError(400,'Marks must be a non-negative multiple of 0.5');
 return transaction(async client=>{
  const {rows}=await client.query(`SELECT q.id,q.marks,q.attempt_id FROM attempt_items q JOIN attempts a ON a.id=q.attempt_id
  WHERE q.id=$1 AND a.assessment_id=$2 AND a.status='submitted' FOR UPDATE OF q`,[itemId,examId]);
  if(!rows[0]||points>rows[0].marks)throw new HttpError(400,'Invalid mark');
  await client.query('UPDATE attempt_items SET teacher_points=$2 WHERE id=$1',[itemId,points]);
  const {rows:score}=await client.query(`SELECT COALESCE(sum(COALESCE(teacher_points,points)),0) AS score FROM attempt_items WHERE attempt_id=$1`,[rows[0].attempt_id]);
  await client.query('UPDATE attempts SET score=$2 WHERE id=$1',[rows[0].attempt_id,score[0].score]);
  await audit(client,u.id,'exam_grade',rows[0].attempt_id,{itemId,points});return {graded:true};
 });});}
