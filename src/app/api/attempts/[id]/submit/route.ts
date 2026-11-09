import {currentUser} from '@/server/auth';import {respond} from '@/server/http';import {submitAttempt} from '@/server/assessments';
export const runtime='nodejs';export async function POST(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>submitAttempt(await currentUser(req),(await params).id));}
