import {body,respond} from '@/server/http';
import {createThread,listThreads} from '@/server/chat';
export const runtime='nodejs';
export async function GET(req:Request){return respond(()=>listThreads(req));}
export async function POST(req:Request){return respond(async()=>createThread(req,await body(req,7000)),201);}
