import {currentUser,HttpError} from '@/server/auth';
import {db} from '@/server/db';
import {respond} from '@/server/http';
import {tawkSecureHash} from '@/support/secure';

export const runtime='nodejs';

/** Authenticated, uncached tawk.to Secure Mode identity. Never return the property API key. */
export async function GET(req:Request){return respond(async()=>{
 const user=await currentUser(req);
 if(user.role!=='student')throw new HttpError(403,'Student support only');
 const key=process.env.TAWK_API_KEY;
 if(!key||key.length<16)throw new HttpError(503,'Student support is not configured');
 // Prevent third-party support while an active test/exam is underway anywhere in the app.
 const {rows}=await db().query(`SELECT EXISTS (
  SELECT 1 FROM attempts WHERE user_id=$1 AND status='in_progress' AND deadline_at>clock_timestamp()
 ) AS blocked`,[user.id]);
 if(rows[0]?.blocked)return {allowed:false};
 return {allowed:true,identity:{
  userId:user.id,
  hash:tawkSecureHash(user.id,key),
  name:user.displayName,
  username:user.username
 }};
});}
