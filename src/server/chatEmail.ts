import 'server-only';
/** No student message body or personal identifiers are sent by email. */
export async function sendTeacherNotification(threadId:string,category:string,reason:'new thread'|'new message'){
 const {RESEND_API_KEY,CHAT_EMAIL_TO,CHAT_EMAIL_FROM,APP_BASE_URL}=process.env;
 if(!RESEND_API_KEY||!CHAT_EMAIL_TO||!CHAT_EMAIL_FROM)return false;
 const base=APP_BASE_URL?.replace(/\/$/,'')||'';
 const link=base&&/^https:\/\//.test(base)?`\nOpen inbox: ${base}/teacher/inbox`:'';
 const subject=`Northstar Academy: ${reason} (${category==='site_problem'?'site problem':'subject question'})`;
 try{
  const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':`Bearer ${RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`northstar-${reason.replace(' ','-')}-${threadId}-${Date.now()}`},body:JSON.stringify({from:CHAT_EMAIL_FROM,to:[CHAT_EMAIL_TO],subject,text:`There is a ${reason} in the teacher inbox.${link}\n\nNo student message contents are included in this email.`}),signal:AbortSignal.timeout(7000)});
  if(!response.ok){console.error('Chat email notification failed:',response.status);return false;}return true;
 }catch(e){console.error('Chat email notification unavailable:',e instanceof Error?e.message:'unknown');return false;}
}
