import {teacher,audit,HttpError} from '@/server/auth';import {transaction} from '@/server/db';import {respond} from '@/server/http';
export const runtime='nodejs';
export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{
 const u=await teacher(req),id=(await params).id;
 return transaction(async client=>{
  const {rows}=await client.query("UPDATE assessments SET release_now=true WHERE id=$1 AND kind='exam' AND closes_at<=now() RETURNING id",[id]);
  if(!rows[0])throw new HttpError(409,'Results can only be released after the exam closes');
  await audit(client,u.id,'exam_release',id);return {released:true};
 });});}
