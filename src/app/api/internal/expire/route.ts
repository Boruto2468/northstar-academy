import {expireOutstanding} from '@/server/assessments';import {respond} from '@/server/http';import {HttpError} from '@/server/auth';
export const runtime='nodejs';
export async function GET(req:Request){return respond(async()=>{
 const secret=process.env.CRON_SECRET;if(!secret||req.headers.get('authorization')!==`Bearer ${secret}`)throw new HttpError(401,'Unauthorised');
 return expireOutstanding(25);
});}
