import 'server-only';
import {db,transaction} from './db';
import {HttpError,audit,type CurrentUser} from './auth';
import {makePaperItem,createFreshItem,gradeItem,topicSkills,matchingSkills,canonicalAnswer,type PaperItem,type ItemType,type ItemPublic,type ItemSecret} from '../assessment/items';
import type {PoolClient} from 'pg';
import {canReveal,isExamOpen} from '../assessment/policy';
import {studentItem} from '../assessment/serialization';
import {randomInt,randomUUID} from 'node:crypto';
export type Blueprint={topics:string[];questionCount:number;theoryCount:number;selectedBankIds:string[]};
function random(){return randomInt(0,2**32)/2**32;}
export function validateBlueprint(v:unknown):Blueprint{
 if(!v||typeof v!=='object')throw new HttpError(400,'Missing question selection');
 const x=v as Record<string,unknown>;
 const topics=Array.isArray(x.topics)?x.topics.filter((a):a is string=>typeof a==='string'):[];
 const clean=[...new Set(topics)];
 const selectedBankIds=Array.isArray(x.selectedBankIds)?x.selectedBankIds.filter((a):a is string=>typeof a==='string'&&/^[0-9a-f-]{36}$/.test(a)):[];
 const questionCount=Number(x.questionCount),theoryCount=Number(x.theoryCount);
 if(!Number.isInteger(questionCount)||questionCount<2||questionCount>50||!Number.isInteger(theoryCount)||theoryCount<0||theoryCount>questionCount||
  selectedBankIds.length>questionCount||!matchingSkills(clean).length)throw new HttpError(400,'Select topics, 2–50 questions and a valid theory count');
 if(selectedBankIds.length!==new Set(selectedBankIds).size)throw new HttpError(400,'Duplicate bank questions');
 return {topics:clean,questionCount,theoryCount,selectedBankIds};
}
function shuffle<T>(list:T[]):T[]{const items=[...list];for(let i=items.length-1;i>0;i--){const j=randomInt(i+1);[items[i],items[j]]=[items[j],items[i]]}return items;}
async function allocate(client:PoolClient,userId:string,blueprint:Blueprint):Promise<PaperItem[]>{
 // Serialise generation for this student across simultaneously started attempts.
 await client.query('SELECT id FROM users WHERE id=$1 FOR UPDATE',[userId]);
 const {rows:usedRows}=await client.query('SELECT signature FROM used_questions WHERE user_id=$1',[userId]);
 const used=new Set<string>(usedRows.map(r=>r.signature));const answerSet=new Set<string>();
 const items:PaperItem[]=[];
 if(blueprint.selectedBankIds.length){
  const {rows}=await client.query('SELECT * FROM question_bank WHERE id=ANY($1::uuid[])',[blueprint.selectedBankIds]);
  for(const id of blueprint.selectedBankIds){
   const row=rows.find(r=>r.id===id);if(!row||!blueprint.topics.includes(row.topic))throw new HttpError(400,'Selected question not found in chosen topics');
   // Freeze the bank question. Shuffle only its option order; never regenerate
   // a teacher-selected question from a newer version of its template.
   const newId=randomUUID(),publicData:ItemPublic={...(row.public_data as ItemPublic),id:newId};
   if(publicData.options)publicData.options=shuffle(publicData.options);
   const secretData=row.secret_data as ItemSecret;
   const item:PaperItem={id:newId,sourceQuestionId:row.id,topic:row.topic,subtopic:row.subtopic,
    templateId:row.template_id,signature:row.signature,itemType:row.item_type,marks:row.marks,publicData,secretData};
   if(used.has(item.signature)||answerSet.has(canonicalAnswer(item.secretData.correctAnswer)))throw new HttpError(409,'A selected question was already attempted, or duplicates another answer');
   items.push(item);used.add(item.signature);answerSet.add(canonicalAnswer(item.secretData.correctAnswer));
  }
 }
 const skills=matchingSkills(blueprint.topics);let cursor=0;
 const objectiveCount=blueprint.questionCount-blueprint.theoryCount;
 const existingObjective=items.filter(i=>i.itemType==='objective').length;
 const existingTheory=items.length-existingObjective;
 const types:ItemType[]=[...Array(Math.max(0,objectiveCount-existingObjective)).fill('objective'),...Array(Math.max(0,blueprint.theoryCount-existingTheory)).fill('theory')];
 if(items.length+types.length!==blueprint.questionCount)throw new HttpError(400,'Selected bank question types exceed the configured counts');
 for(const kind of types){
  let found:PaperItem|undefined;
  for(let t=0;t<skills.length*20&&!found;t++){
   const skill=skills[cursor++%skills.length];
   try{found=createFreshItem(skill.templateId,kind,used,answerSet,random);}catch{/* Try other skills */}
  }
  if(!found)throw new HttpError(409,'The available unique question templates are exhausted for this student');
  items.push(found);used.add(found.signature);answerSet.add(canonicalAnswer(found.secretData.correctAnswer));
 }
 for(const item of items)await client.query('INSERT INTO used_questions(user_id,signature) VALUES($1,$2)',[userId,item.signature]);
 return shuffle(items);
}
async function writeItems(client:PoolClient,attemptId:string,items:PaperItem[]):Promise<void>{
 for(let index=0;index<items.length;index++){
  const q=items[index];
  await client.query(`INSERT INTO attempt_items(attempt_id,position,topic,subtopic,template_id,source_question_id,signature,item_type,public_data,secret_data,marks)
   VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9::jsonb,$10::jsonb,$11)`,
   [attemptId,index,q.topic,q.subtopic,q.templateId,q.sourceQuestionId||null,q.signature,q.itemType,JSON.stringify(q.publicData),JSON.stringify(q.secretData),q.marks]);
 }
 await client.query('UPDATE attempts SET max_score=$2 WHERE id=$1',[attemptId,items.reduce((n,i)=>n+i.marks,0)]);
}
export async function startTest(user:CurrentUser,blueprint:Blueprint,durationSeconds:number){
 return transaction(async client=>{
  const {rows:assessments}=await client.query(`INSERT INTO assessments(kind,title,creator_id,blueprint,duration_seconds)
   VALUES('test',$1,$2,$3::jsonb,$4) RETURNING id`,[`${user.displayName}'s practice test`,user.id,JSON.stringify(blueprint),durationSeconds]);
  const {rows:attempts}=await client.query(`INSERT INTO attempts(assessment_id,user_id,kind,deadline_at)
   VALUES($1,$2,'test',now()+($3::int*interval '1 second')) RETURNING id`,[assessments[0].id,user.id,durationSeconds]);
  const items=await allocate(client,user.id,blueprint);
  await writeItems(client,attempts[0].id,items);
  await audit(client,user.id,'test_start',attempts[0].id,{questions:items.length});
  return {attemptId:attempts[0].id};
 });
}
export async function startExam(user:CurrentUser,assessmentId:string){
 return transaction(async client=>{
  const {rows}=await client.query(`SELECT * FROM assessments WHERE id=$1 AND kind='exam' FOR SHARE`,[assessmentId]);const exam=rows[0];
  if(!exam)throw new HttpError(404,'Exam not found');
  if(exam.cancelled_at)throw new HttpError(403,'Exam has been cancelled');
  const {rows:clock}=await client.query('SELECT clock_timestamp() as now');const now=new Date(clock[0].now).getTime();
  if(now<new Date(exam.opens_at).getTime())throw new HttpError(403,'Exam has not opened');
  if(!isExamOpen(exam.opens_at.toISOString(),exam.closes_at.toISOString(),clock[0].now.toISOString()))throw new HttpError(403,'Exam is closed');
  const {rows:old}=await client.query('SELECT id FROM attempts WHERE assessment_id=$1 AND user_id=$2',[exam.id,user.id]);
  if(old[0])return {attemptId:old[0].id,resumed:true};
  // The unique index enforces one exam attempt across racing requests.
  const {rows:created}=await client.query(`INSERT INTO attempts(assessment_id,user_id,kind,deadline_at)
   VALUES($1,$2,'exam',LEAST(now()+($3::int*interval '1 second'),$4::timestamptz)) RETURNING id`,
   [exam.id,user.id,exam.duration_seconds,exam.closes_at]);
  const items=await allocate(client,user.id,validateBlueprint(exam.blueprint));
  await writeItems(client,created[0].id,items);
  await audit(client,user.id,'exam_start',created[0].id,{examId:exam.id});
  return {attemptId:created[0].id,resumed:false};
 });
}
export async function submitLocked(client:PoolClient,attempt:Record<string,unknown>){
 if(attempt.status==='submitted')return;
 const {rows}=await client.query('SELECT * FROM attempt_items WHERE attempt_id=$1 ORDER BY position FOR UPDATE',[attempt.id]);
 let score=0;
 for(const item of rows){
  const graded=gradeItem({itemType:item.item_type,publicData:item.public_data as ItemPublic,secretData:item.secret_data as ItemSecret,marks:item.marks},item.response||{});
  score+=graded.points;
  await client.query('UPDATE attempt_items SET grade=$2::jsonb,points=$3 WHERE id=$1',[item.id,JSON.stringify(graded),graded.points]);
 }
 await client.query("UPDATE attempts SET status='submitted',submitted_at=now(),score=$2 WHERE id=$1",[attempt.id,score]);
}
async function ownedAttempt(client:PoolClient,user:CurrentUser,attemptId:string){
 const {rows}=await client.query(`SELECT a.*,s.results_release_at,s.release_now,s.closes_at,s.kind as assessment_kind,s.title
 FROM attempts a JOIN assessments s ON s.id=a.assessment_id WHERE a.id=$1 AND a.user_id=$2 FOR UPDATE OF a`,[attemptId,user.id]);
 if(!rows[0])throw new HttpError(404,'Attempt not found');return rows[0];
}
export async function attemptSnapshot(user:CurrentUser,attemptId:string){
 return transaction(async client=>{
  const a=await ownedAttempt(client,user,attemptId);
  const {rows:clock}=await client.query('SELECT clock_timestamp() AS now');const now=clock[0].now;
  if(a.status==='in_progress'&&new Date(now).getTime()>=new Date(a.deadline_at).getTime())await submitLocked(client,a);
  const {rows:attemptRows}=await client.query('SELECT status,score,max_score,submitted_at FROM attempts WHERE id=$1',[a.id]);
  const status=attemptRows[0].status;
  const reveal=canReveal(a.kind,status,new Date(now).toISOString(),a.closes_at?new Date(a.closes_at).toISOString():null,a.results_release_at?new Date(a.results_release_at).toISOString():null,Boolean(a.release_now));
  const {rows:items}=await client.query('SELECT id,position,topic,subtopic,item_type,marks,public_data,response,grade,secret_data,teacher_points FROM attempt_items WHERE attempt_id=$1 ORDER BY position',[a.id]);
  return {serverTime:now,attempt:{id:a.id,kind:a.kind,title:a.title,status,startedAt:a.started_at,deadlineAt:a.deadline_at,submittedAt:attemptRows[0].submitted_at,resultsAvailable:Boolean(reveal),
   ...(reveal?{score:Number(attemptRows[0].score),maxScore:Number(attemptRows[0].max_score)}:{})},
   items:items.map(it=>studentItem(it,reveal))};
 });
}
export async function saveAnswer(user:CurrentUser,attemptId:string,itemId:string,response:Record<string,unknown>){
 const clean:Record<string,string>={};
 for(const [key,value] of Object.entries(response)){
  if(!['choice','final','working'].includes(key)||typeof value!=='string'||value.length>1500)throw new HttpError(400,'Invalid answer');
  clean[key]=value;
 }
 return transaction(async client=>{
  const a=await ownedAttempt(client,user,attemptId);
  if(a.status!=='in_progress')throw new HttpError(409,'Attempt has already been submitted');
  const {rows:clock}=await client.query('SELECT clock_timestamp() AS now');
  if(new Date(clock[0].now)>=new Date(a.deadline_at)){await submitLocked(client,a);return {saved:false,expired:true,serverTime:clock[0].now};}
  const {rowCount}=await client.query('UPDATE attempt_items SET response=$3::jsonb WHERE id=$1 AND attempt_id=$2',[itemId,attemptId,JSON.stringify(clean)]);
  if(!rowCount)throw new HttpError(404,'Question not found');return {saved:true,serverTime:clock[0].now};
 });
}
export async function submitAttempt(user:CurrentUser,attemptId:string){
 return transaction(async client=>{const a=await ownedAttempt(client,user,attemptId);await submitLocked(client,a);await audit(client,user.id,'attempt_submitted',attemptId);return {submitted:true};});
}
export async function recordEvent(user:CurrentUser,attemptId:string,event:string){
 if(!['tab_hidden','tab_visible','window_blur','window_focus'].includes(event))throw new HttpError(400,'Invalid event');
 const {rows}=await db().query(`INSERT INTO exam_events(user_id,attempt_id,event_type)
 SELECT $1,a.id,$3 FROM attempts a WHERE a.id=$2 AND a.user_id=$1 AND a.kind='exam' AND a.status='in_progress'
 AND NOT EXISTS (SELECT 1 FROM exam_events e WHERE e.attempt_id=a.id AND e.at > now()-interval '2 seconds')
 RETURNING id`,[user.id,attemptId,event]);return {logged:Boolean(rows[0])};
}

/** Cron safety net: submit abandoned overdue attempts when the browser is closed. */
export async function expireOutstanding(limit=25){return transaction(async client=>{
 const {rows}=await client.query(`SELECT * FROM attempts WHERE status='in_progress' AND deadline_at<=now() ORDER BY deadline_at FOR UPDATE SKIP LOCKED LIMIT $1`,[limit]);
 for(const a of rows)await submitLocked(client,a);
 return {submitted:rows.length};
});}
