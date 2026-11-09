import {teacher} from '@/server/auth';import {db} from '@/server/db';import {respond} from '@/server/http';
export const runtime='nodejs';
export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{await teacher(req);const id=(await params).id;
 const {rows:exams}=await db().query("SELECT id,title,results_release_at,release_now FROM assessments WHERE id=$1 AND kind='exam'",[id]);
 if(!exams[0])return {exam:null,attempts:[]};
 const {rows}=await db().query(`SELECT a.id,a.status,a.started_at,a.submitted_at,a.score,a.max_score,u.username,u.display_name,
 (SELECT jsonb_agg(jsonb_build_object('id',q.id,'position',q.position,'prompt',q.public_data,'response',q.response,'grade',q.grade,'points',q.points,'teacherPoints',q.teacher_points,'workedSolution',q.secret_data->'workedSolution') ORDER BY q.position)
  FROM attempt_items q WHERE q.attempt_id=a.id) AS questions,
 (SELECT count(*)::int FROM exam_events e WHERE e.attempt_id=a.id AND e.event_type='tab_hidden') AS tab_leaves
 FROM attempts a JOIN users u ON u.id=a.user_id WHERE a.assessment_id=$1 ORDER BY u.username`,[id]);
 return {exam:exams[0],attempts:rows};});}
