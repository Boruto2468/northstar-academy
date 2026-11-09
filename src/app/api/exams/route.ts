import {currentUser} from '@/server/auth';import {db} from '@/server/db';import {respond} from '@/server/http';
export const runtime='nodejs';
export async function GET(req:Request){return respond(async()=>{const u=await currentUser(req);const {rows}=await db().query(`SELECT e.id,e.title,e.opens_at,e.closes_at,e.duration_seconds,e.results_release_at,e.release_now,
 a.id AS attempt_id,a.status FROM assessments e LEFT JOIN attempts a ON a.assessment_id=e.id AND a.user_id=$1
 WHERE e.kind='exam' ORDER BY e.opens_at DESC LIMIT 100`,[u.id]);return {serverTime:new Date().toISOString(),exams:rows.map(r=>({id:r.id,title:r.title,opensAt:r.opens_at,closesAt:r.closes_at,durationSeconds:r.duration_seconds,resultsReleaseAt:r.results_release_at,
 attemptId:r.attempt_id,status:r.status}))};});}
