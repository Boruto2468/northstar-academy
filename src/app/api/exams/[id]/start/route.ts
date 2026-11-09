import {currentUser} from '@/server/auth';import {respond} from '@/server/http';import {startExam} from '@/server/assessments';
export const runtime='nodejs';export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>{const u=await currentUser(req);return startExam(u,(await params).id);});}
