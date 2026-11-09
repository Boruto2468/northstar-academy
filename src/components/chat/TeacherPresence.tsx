'use client';
import {useEffect} from 'react';
import {api,sessionUser} from '@/client/auth';
/** Auto availability follows genuine recent activity, not merely an open idle tab. */
export default function TeacherPresence(){
 useEffect(()=>{
  let lastSent=0;
  const touch=()=>{if(sessionUser()?.role!=='teacher'||document.visibilityState!=='visible'||Date.now()-lastSent<90_000)return;lastSent=Date.now();void api('/api/chat/presence',{method:'POST',body:'{}'}).catch(()=>{});};
  document.addEventListener('pointerdown',touch);document.addEventListener('keydown',touch);
  window.addEventListener('northstar-auth-changed',touch);
  touch();return()=>{document.removeEventListener('pointerdown',touch);document.removeEventListener('keydown',touch);window.removeEventListener('northstar-auth-changed',touch);};
 },[]);
 return null;
}
