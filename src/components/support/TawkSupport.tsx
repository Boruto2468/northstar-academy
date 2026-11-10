'use client';

import {useEffect,useState} from 'react';
import {usePathname} from 'next/navigation';
import {api,sessionUser,type Viewer} from '@/client/auth';
import {supportAllowedRoute,tawkEmbedUrl} from '@/support/policy';

type TawkIdentity={userId:string;hash:string;name:string;username:string};
type TawkAPI={
 autoStart?:boolean;
 onLoad?:()=>void;
 login?:(details:TawkIdentity,callback?:(error?:unknown)=>void)=>void;
 logout?:(callback?:(error?:unknown)=>void)=>void;
 start?:(options?:{showWidget?:boolean})=>void;
 hideWidget?:()=>void;
 showWidget?:()=>void;
 shutdown?:()=>void;
};
declare global {interface Window {Tawk_API?:TawkAPI}}

const SCRIPT_ID='northstar-tawk-widget';
const url=tawkEmbedUrl(process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID||'',process.env.NEXT_PUBLIC_TAWK_WIDGET_ID||'');
let generation=0;
let signedInStudent:string|null=null;
let connected=false;

function disconnect(){
 connected=false;
 const tawk=window.Tawk_API;
 try{tawk?.hideWidget?.();tawk?.shutdown?.();}catch{/* Third-party script may be blocked. */}
}
function authenticate(identity:TawkIdentity,expected:number){
 const tawk=window.Tawk_API;
 if(!tawk?.login||expected!==generation)return;
 const run=()=>{
  if(expected!==generation)return;
  tawk.login?.(identity,error=>{
   if(expected!==generation){disconnect();return;}
   if(error){console.warn('tawk.to Secure Mode sign-in failed');disconnect();return;}
   signedInStudent=identity.userId;
   try{tawk.start?.({showWidget:true});tawk.showWidget?.();connected=true;}catch{disconnect();}
  });
 };
 if(signedInStudent&&signedInStudent!==identity.userId&&tawk.logout){
  disconnect();tawk.logout(()=>{signedInStudent=null;run();});
 }else run();
}
function connect(identity:TawkIdentity,expected:number){
 if(!url||expected!==generation)return;
 const tawk=window.Tawk_API=window.Tawk_API||{};
 tawk.autoStart=false; // Prevent a guest chat from flashing before signed identity is verified.
 tawk.onLoad=()=>authenticate(identity,expected);
 if(typeof tawk.login==='function'){
  authenticate(identity,expected);
  return;
 }
 if(document.getElementById(SCRIPT_ID))return;
 const script=document.createElement('script');
 script.id=SCRIPT_ID;script.async=true;script.src=url;
 script.referrerPolicy='strict-origin-when-cross-origin';
 script.onerror=()=>{script.remove();disconnect();};
 document.head.appendChild(script);
}

/** One widget for the authenticated student's tab; no widget on assessment pages. */
export default function TawkSupport(){
 const pathname=usePathname();
 const [viewer,setViewer]=useState<Viewer|null>(null);
 useEffect(()=>{
  const refresh=()=>setViewer(sessionUser());
  refresh();window.addEventListener('northstar-auth-changed',refresh);
  return()=>window.removeEventListener('northstar-auth-changed',refresh);
 },[]);
 useEffect(()=>{
  const current=++generation;
  let stopped=false;
  if(!url||!viewer||viewer.role!=='student'||!supportAllowedRoute(pathname)){
   disconnect();
   if(!viewer||viewer.role!=='student'){
    try{window.Tawk_API?.logout?.(()=>{signedInStudent=null;disconnect();});}catch{signedInStudent=null;}
   }
   return;
  }
  const check=async()=>{
   try{
    const response=await api('/api/support/identity') as {allowed:boolean;identity?:TawkIdentity};
    if(stopped||generation!==current)return;
    if(!response.allowed||!response.identity){disconnect();return;}
    // Recheck entitlement regularly; an attempt could start in another tab.
    if(connected&&signedInStudent===response.identity.userId){
     return;
    }
    connect(response.identity,current);
   }catch{if(!stopped&&generation===current)disconnect();}
  };
  void check();
  const interval=window.setInterval(()=>{void check();},15000);
  return()=>{stopped=true;window.clearInterval(interval);++generation;disconnect();};
 },[pathname,viewer?.id,viewer?.role]);
 return null;
}
