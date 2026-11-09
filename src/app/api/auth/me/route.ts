import {currentUser} from '@/server/auth';import {respond} from '@/server/http';
export const runtime='nodejs';export async function GET(req:Request){return respond(async()=>({user:await currentUser(req)}));}
