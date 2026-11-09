import {currentUser} from '@/server/auth';import {respond} from '@/server/http';import {attemptSnapshot} from '@/server/assessments';
export const runtime='nodejs';export async function GET(req:Request,{params}:{params:Promise<{id:string}>}){return respond(async()=>attemptSnapshot(await currentUser(req),(await params).id));}
