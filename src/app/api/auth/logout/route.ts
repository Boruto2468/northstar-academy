import {logout} from '@/server/auth';import {respond} from '@/server/http';
export const runtime='nodejs';export async function POST(req:Request){return respond(async()=>{await logout(req);return {signedOut:true};});}
