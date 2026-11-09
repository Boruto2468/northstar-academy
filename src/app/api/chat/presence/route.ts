import {body,respond} from '@/server/http';
import {presence} from '@/server/chat';
export const runtime='nodejs';
export async function GET(req:Request){return respond(()=>presence(req,false));}
export async function POST(req:Request){return respond(async()=>{const payload=await body(req,1024);return presence(req,true,payload.override);});}
