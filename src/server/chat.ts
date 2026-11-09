import 'server-only';
import {db,transaction} from './db';
import {currentUser,teacher, HttpError, type CurrentUser} from './auth';
import {MESSAGE_LIMIT,permittedTopic,isSimpleCurriculumQuestion,mayUseAI,normalizeContextPath,safeActions,teacherOnline,type ChatCategory} from '@/chat/policy';
import {sendTeacherNotification} from './chatEmail';
import {askCurriculumAssistant} from './curriculumAI';

const uuidPattern=/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const chatCategory=(v:unknown):ChatCategory=>{if(v!=='subject_question'&&v!=='site_problem')throw new HttpError(400,'Select a message category');return v;};
const validId=(id:string)=>{if(!uuidPattern.test(id))throw new HttpError(400,'Invalid thread ID');return id;};
function messageText(v:unknown):string{
 if(typeof v!=='string')throw new HttpError(400,'Write a message');
 const s=v.trim();if(s.length<2||s.length>MESSAGE_LIMIT)throw new HttpError(400,`Message must be 2–${MESSAGE_LIMIT} characters`);
 if(/[\w.+-]+@[\w.-]+\.[A-Za-z]{2,}/.test(s)||/\b(?:\+?\d[\d\s()-]{8,}\d)\b/.test(s))throw new HttpError(400,'Please remove emails or phone numbers before sending');
 return s;
}
function validTitle(v:unknown){if(typeof v!=='string'||v.trim().length<3||v.trim().length>100)throw new HttpError(400,'Title must be 3–100 characters');return v.trim();}
async function recordTeacherActivity(teacherId:string){await db().query(`INSERT INTO chat_teacher_presence(teacher_id,last_activity_at) VALUES($1,now()) ON CONFLICT(teacher_id) DO UPDATE SET last_activity_at=now()`,[teacherId]);}
export async function teacherAvailability(){
 const {rows}=await db().query(`SELECT p.override_status, p.last_activity_at FROM users u LEFT JOIN chat_teacher_presence p ON p.teacher_id=u.id WHERE u.role='teacher' AND u.active=true`);
 return rows.some(r=>teacherOnline(r.override_status,r.last_activity_at?.toISOString?.()??null,Date.now()));
}
export async function presence(req:Request,update:boolean,override?:unknown){
 const u=await teacher(req);
 if(update){if(override!==undefined&& !['auto','available','away'].includes(String(override)))throw new HttpError(400,'Invalid availability');
 await db().query(`INSERT INTO chat_teacher_presence(teacher_id,last_activity_at,override_status) VALUES($1,now(),COALESCE($2,'auto'))
 ON CONFLICT(teacher_id) DO UPDATE SET last_activity_at=now(),override_status=COALESCE($2,chat_teacher_presence.override_status),updated_at=now()`,[u.id,override??null]);}
 const {rows}=await db().query('SELECT override_status,last_activity_at FROM chat_teacher_presence WHERE teacher_id=$1',[u.id]);
 return {override:rows[0]?.override_status||'auto',available:await teacherAvailability()};
}
export async function inProgressAttempt(userId:string):Promise<boolean>{
 const {rows}=await db().query(`SELECT EXISTS(SELECT 1 FROM attempts WHERE user_id=$1 AND status='in_progress') AS ongoing`,[userId]);
 return !!rows[0].ongoing;
}
export async function listThreads(req:Request){
 const u=await currentUser(req);if(u.role==='teacher')await recordTeacherActivity(u.id);
 const isTeacher=u.role==='teacher';
 const {rows}=await db().query(`SELECT t.id,t.student_id,t.category,t.title,t.status,t.topic_id,t.created_at,t.updated_at,
 u.display_name AS student_name,
 (SELECT count(*)::int FROM chat_messages m WHERE m.thread_id=t.id AND m.sender_type=$2 AND m.created_at > COALESCE(${isTeacher?'t.teacher_last_read_at':'t.student_last_read_at'},to_timestamp(0))) AS unread,
 (SELECT body FROM chat_messages m WHERE m.thread_id=t.id ORDER BY m.created_at DESC,m.id DESC LIMIT 1) AS latest_message
 FROM chat_threads t JOIN users u ON u.id=t.student_id
 ${isTeacher?'':'WHERE t.student_id=$1'} ORDER BY (t.status='open') DESC,t.updated_at DESC LIMIT 100`,[u.id,isTeacher?'student':'teacher']);
 return {threads:rows,teacherAvailable:await teacherAvailability(),activeAssessment:u.role==='student'?await inProgressAttempt(u.id):false};
}
export async function assertThread(id:string,u:CurrentUser){
 const {rows}=await db().query(`SELECT t.*,u.display_name AS student_name FROM chat_threads t JOIN users u ON u.id=t.student_id WHERE t.id=$1`,[validId(id)]);
 if(!rows[0]||(u.role==='student'&&rows[0].student_id!==u.id))throw new HttpError(404,'Thread not found');
 return rows[0];
}
export async function readThread(req:Request,id:string){
 const u=await currentUser(req);const t=await assertThread(id,u);
 await db().query(`UPDATE chat_threads SET ${u.role==='teacher'?'teacher_last_read_at':'student_last_read_at'}=now() WHERE id=$1`,[id]);
 if(u.role==='teacher')await recordTeacherActivity(u.id);
 const {rows}=await db().query(`SELECT id,sender_type,body,created_at,corrects_message_id,model_id FROM chat_messages WHERE thread_id=$1 ORDER BY created_at,id LIMIT 500`,[id]);
 const {rows:bug}=t.category==='site_problem'?await db().query('SELECT page_path,topic_id,browser_info,last_actions,reported_at FROM chat_site_problems WHERE thread_id=$1',[id]):{rows:[]};
 return {thread:t,messages:rows,bugReport:bug[0]??null};
}
async function rateGuard(userId:string,kind:'thread'|'message'){
 const q=kind==='thread'?
 `SELECT count(*)::int AS n FROM chat_threads WHERE student_id=$1 AND created_at>now()-interval '1 hour'`:
 `SELECT count(*)::int AS n FROM chat_messages WHERE author_id=$1 AND created_at>now()-interval '1 hour'`;
 const {rows}=await db().query(q,[userId]);
 if(rows[0].n >= (kind==='thread'?5:25))throw new HttpError(429,'Too many messages. Try again later');
}
async function perhapsReplyAI(threadId:string,studentId:string,category:ChatCategory,topicId:string|null,text:string){
 try{
  const available=await teacherAvailability();
  const allowed=mayUseAI({isStudent:true,category,teacherAvailable:available,hasInProgressAttempt:await inProgressAttempt(studentId),modelConfigured:!!(process.env.ANTHROPIC_API_KEY&&process.env.ANTHROPIC_MODEL),simple:!!topicId&&isSimpleCurriculumQuestion(text,topicId)});
  if(!allowed||!topicId)return false;
  // A second check immediately before the external call limits exam-start races.
  if(await inProgressAttempt(studentId))return false;
  const {rows:counts}=await db().query(`SELECT count(*)::int AS n,max(created_at) AS last_at FROM chat_messages m JOIN chat_threads t ON t.id=m.thread_id WHERE t.student_id=$1 AND m.sender_type='ai' AND m.created_at>now()-interval '24 hours'`,[studentId]);
  if(counts[0].n>=10 || (counts[0].last_at&&Date.now()-new Date(counts[0].last_at).getTime()<60_000))return false;
  const response=await askCurriculumAssistant(topicId,text);
  if(!response)return false;
  // Never create an AI message if a test/exam started during the API call.
  if(await inProgressAttempt(studentId)||await teacherAvailability())return false;
  const {rowCount}=await db().query(`INSERT INTO chat_messages(thread_id,sender_type,body,model_id)
   SELECT $1,'ai',$2,$3 WHERE NOT EXISTS
   (SELECT 1 FROM attempts WHERE user_id=$4 AND status='in_progress')`,[threadId,response,process.env.ANTHROPIC_MODEL,studentId]);
  if(!rowCount)return false;
  await db().query('UPDATE chat_threads SET updated_at=now() WHERE id=$1',[threadId]);
  return true;
 }catch(e){console.error('Chat assistant unavailable',e instanceof Error?e.message:'unknown');return false;}
}
export async function createThread(req:Request,data:Record<string,unknown>){
 const u=await currentUser(req);if(u.role!=='student')throw new HttpError(403,'Only students can start threads');
 const category=chatCategory(data.category),title=validTitle(data.title),text=messageText(data.message);
 const topicId=typeof data.topicId==='string'?data.topicId:'';
 if(category==='subject_question'&&!permittedTopic(topicId))throw new HttpError(400,'Choose a curriculum topic');
 if(topicId&& !permittedTopic(topicId))throw new HttpError(400,'Unknown topic');
 await rateGuard(u.id,'thread');await rateGuard(u.id,'message');
 const path=normalizeContextPath(data.pagePath);
 const browser=typeof data.browser==='string'?data.browser.slice(0,160):'';
 const actions=safeActions(data.lastActions);
 const created=await transaction(async c=>{
  const {rows}=await c.query(`INSERT INTO chat_threads(student_id,category,title,topic_id,student_last_read_at) VALUES($1,$2,$3,$4,now()) RETURNING id`,[u.id,category,title,topicId||null]);
  const id=rows[0].id as string;
  await c.query(`INSERT INTO chat_messages(thread_id,author_id,sender_type,body) VALUES($1,$2,'student',$3)`,[id,u.id,text]);
  if(category==='site_problem')await c.query(`INSERT INTO chat_site_problems(thread_id,page_path,topic_id,browser_info,last_actions) VALUES($1,$2,$3,$4,$5::jsonb)`,[id,path,topicId||null,browser,JSON.stringify(actions)]);
  return id;
 });
 await sendTeacherNotification(created,category,'new thread');
 const aiReplied=await perhapsReplyAI(created,u.id,category,topicId||null,text);
 return {id:created,aiReplied};
}
export async function postThreadMessage(req:Request,id:string,data:Record<string,unknown>){
 const u=await currentUser(req);const thread=await assertThread(id,u);
 const text=messageText(data.message);
 let correction:string|null=null;
 if(data.correctsMessageId!==undefined){
  if(u.role!=='teacher'||typeof data.correctsMessageId!=='string'||!uuidPattern.test(data.correctsMessageId))throw new HttpError(400,'Only teachers may correct AI replies');
  const {rows}=await db().query(`SELECT id FROM chat_messages WHERE id=$1 AND thread_id=$2 AND sender_type='ai'`,[data.correctsMessageId,id]);
  if(!rows[0])throw new HttpError(400,'Choose an AI reply in this thread');correction=rows[0].id;
 }
 if(u.role==='student')await rateGuard(u.id,'message');
 await transaction(async c=>{
  await c.query(`INSERT INTO chat_messages(thread_id,author_id,sender_type,body,corrects_message_id) VALUES($1,$2,$3,$4,$5)`,[id,u.id,u.role,text,correction]);
  await c.query(`UPDATE chat_threads SET status='open',updated_at=now(),${u.role==='teacher'?'teacher_last_read_at':'student_last_read_at'}=now() WHERE id=$1`,[id]);
 });
 if(u.role==='teacher')await recordTeacherActivity(u.id);
 if(u.role==='student')await sendTeacherNotification(id,thread.category,'new message');
 const aiReplied=u.role==='student'?await perhapsReplyAI(id,u.id,thread.category,thread.topic_id,text):false;
 return {ok:true,aiReplied};
}
export async function updateThread(req:Request,id:string,data:Record<string,unknown>){
 const u=await teacher(req);await assertThread(id,u);
 if(data.status!=='resolved'&&data.status!=='open')throw new HttpError(400,'Invalid thread status');
 await db().query('UPDATE chat_threads SET status=$2,updated_at=now() WHERE id=$1',[id,data.status]);
 await recordTeacherActivity(u.id);return {ok:true,status:data.status};
}
