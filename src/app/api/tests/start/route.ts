import {currentUser} from '@/server/auth';import {body,numberIn,respond} from '@/server/http';
import {startTest,validateBlueprint} from '@/server/assessments';
export const runtime='nodejs';
export async function POST(req:Request){return respond(async()=>{const user=await currentUser(req),d=await body(req);return startTest(user,validateBlueprint(d.blueprint),numberIn(d.durationSeconds,60,14400));});}
