'use client';
import {useState} from 'react';import Link from 'next/link';import {signIn} from '@/client/auth';
export default function LoginPage(){const [username,setUsername]=useState(''),[password,setPassword]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false);
 return <main className="assessment-shell assessment-login"><p className="eyebrow">NORTHSTAR ACADEMY</p><h1>Sign in</h1><p>Your teacher provides your username and password. This tab keeps your session until it is closed.</p>
 <form onSubmit={async e=>{e.preventDefault();setBusy(true);setError('');try{const user=await signIn(username,password);location.href=user.role==='teacher'?'/teacher':'/tests';}catch(err){setError(err instanceof Error?err.message:String(err));setBusy(false);}}}>
 <label>Username<input required autoComplete="username" maxLength={36} value={username} onChange={e=>setUsername(e.target.value)}/></label>
 <label>Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)}/></label>
 {error&&<p role="alert" className="assessment-error">{error}</p>}
 <button className="primary" disabled={busy}>{busy?'Signing in…':'Sign in'}</button></form><p><Link href="/">Return to lessons</Link></p></main>;
}
