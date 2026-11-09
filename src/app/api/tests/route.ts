import {currentUser} from '@/server/auth';import {db} from '@/server/db';import {respond} from '@/server/http';
export const runtime='nodejs';
export async function GET(req:Request){return respond(async()=>{const user=await currentUser(req);
 const {rows}=await db().query(`SELECT a.id,a.status,a.started_at,a.deadline_at,a.submitted_at,a.score,a.max_score,s.title
 FROM attempts a JOIN assessments s ON s.id=a.assessment_id WHERE a.user_id=$1 AND a.kind='test'
 ORDER BY a.started_at DESC LIMIT 40`,[user.id]);
 return {tests:rows};
});}
