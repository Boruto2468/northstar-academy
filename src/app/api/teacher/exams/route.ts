import {teacher,audit,HttpError} from '@/server/auth';import {transaction,db} from '@/server/db';import {respond,body,str,numberIn} from '@/server/http';import {validateBlueprint} from '@/server/assessments';
export const runtime='nodejs';
function WAT(x:unknown):Date{
 // A datetime-local input is explicitly interpreted as Africa/Lagos (UTC+01:00, no DST).
 const value=str(x,30);
 if(!/^\d{4}-\d\d-\d\dT\d\d:\d\d$/.test(value))throw new HttpError(400,'Use YYYY-MM-DDTHH:mm in WAT');
 const date=new Date(value+':00+01:00');
 if(Number.isNaN(date.getTime())||new Date(date.getTime()+3600000).toISOString().slice(0,16)!==value)throw new HttpError(400,'Invalid WAT date');
 return date;
}
export async function GET(req:Request){return respond(async()=>{await teacher(req);const {rows}=await db().query(`SELECT a.*, (SELECT count(*)::int FROM attempts b WHERE b.assessment_id=a.id) AS attempts FROM assessments a WHERE kind='exam' ORDER BY created_at DESC LIMIT 100`);return {exams:rows};});}
export async function POST(req:Request){return respond(async()=>{
 const user=await teacher(req),d=await body(req);const title=str(d.title,120).trim();if(!title)throw new HttpError(400,'Exam title required');
 const blueprint=validateBlueprint(d.blueprint),durationSeconds=numberIn(d.durationSeconds,60,14400);
 const opens=WAT(d.opensAt),closes=WAT(d.closesAt),release=WAT(d.resultsReleaseAt);
 if(opens>=closes||release<closes)throw new HttpError(400,'Closing must be after opening, and results cannot be released before the exam closes');
 const result=await transaction(async client=>{
  const {rows}=await client.query(`INSERT INTO assessments(kind,title,creator_id,blueprint,opens_at,closes_at,duration_seconds,results_release_at)
 VALUES('exam',$1,$2,$3::jsonb,$4,$5,$6,$7) RETURNING id`,[title,user.id,JSON.stringify(blueprint),opens,closes,durationSeconds,release]);
  await audit(client,user.id,'exam_create',rows[0].id,{title});return rows[0];
 });return {exam:result};
 },201);}
