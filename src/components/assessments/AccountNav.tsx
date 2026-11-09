'use client';
import Link from 'next/link';import {useEffect,useState} from 'react';
import {sessionUser,signOut,type Viewer} from '@/client/auth';
export default function AccountNav(){const [user,setUser]=useState<Viewer|null>(null);
 useEffect(()=>{const sync=()=>setUser(sessionUser());sync();window.addEventListener('northstar-auth-changed',sync);return()=>window.removeEventListener('northstar-auth-changed',sync);},[]);
 return <nav className="assessment-global-nav" aria-label="Account and assessments"><Link href="/">Northstar</Link><Link href="/tests">Timed tests</Link><Link href="/exams">Exams</Link>{user?.role==='teacher'&&<Link href="/teacher">Teacher</Link>}{user?<><span className="nav-user">{user.displayName}</span><button type="button" onClick={async()=>{await signOut();location.href='/login';}}>Sign out</button></>:<Link href="/login">Sign in</Link>}</nav>;
}
