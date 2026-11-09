import 'server-only';
import {db,transaction} from './db';
import {sha256,token,hashPassword,checkPassword} from './security';
import type {PoolClient} from 'pg';
export type CurrentUser={id:string;username:string;displayName:string;role:'teacher'|'student'};
export class HttpError extends Error{constructor(public status:number,message:string){super(message);}}
function userOf(row:Record<string,unknown>):CurrentUser{return {id:String(row.id),username:String(row.username),displayName:String(row.display_name),role:row.role as 'teacher'|'student'};}
function bearer(req:Request):string{const auth=req.headers.get('authorization')||'';return /^Bearer [A-Za-z0-9_-]{40,100}$/.test(auth)?auth.slice(7):'';}
export async function currentUser(req:Request):Promise<CurrentUser>{
 const access=bearer(req);if(!access)throw new HttpError(401,'Sign in to continue');
 const {rows}=await db().query(`SELECT u.id,u.username,u.display_name,u.role FROM sessions s JOIN users u ON u.id=s.user_id
 WHERE s.access_hash=$1 AND s.access_expires_at>now() AND s.refresh_expires_at>now() AND s.revoked_at IS NULL AND u.active=true`,[sha256(access)]);
 if(!rows[0])throw new HttpError(401,'Session expired');return userOf(rows[0]);
}
export async function teacher(req:Request):Promise<CurrentUser>{const u=await currentUser(req);if(u.role!=='teacher')throw new HttpError(403,'Teacher access only');return u;}
export async function login(usernameInput:string,password:string):Promise<{user:CurrentUser;accessToken:string;refreshToken:string;accessExpiresAt:string}>{
 const username=usernameInput.toLowerCase().trim();if(!/^[a-z0-9._-]{3,36}$/.test(username)||password.length>128)throw new HttpError(401,'Invalid credentials');
 const {rows:failures}=await db().query("SELECT count(*)::int AS count FROM login_failures WHERE username=$1 AND attempted_at>now()-interval '15 minutes'",[username]);
 if(failures[0].count>=8)throw new HttpError(429,'Too many attempts. Try again later');
 const {rows}=await db().query('SELECT * FROM users WHERE username=$1 AND active=true',[username]);
 const valid=rows[0]?await checkPassword(password,rows[0].password_hash):false;
 if(!valid){await db().query('INSERT INTO login_failures(username) VALUES($1)',[username]);throw new HttpError(401,'Invalid credentials');}
 await db().query('DELETE FROM login_failures WHERE username=$1',[username]);
 const accessToken=token(),refreshToken=token();
 const expires=new Date(Date.now()+10*60*1000).toISOString();
 await db().query(`INSERT INTO sessions(user_id,access_hash,refresh_hash,access_expires_at,refresh_expires_at)
 VALUES($1,$2,$3,now()+interval '10 minutes',now()+interval '12 hours')`,[rows[0].id,sha256(accessToken),sha256(refreshToken)]);
 return {user:userOf(rows[0]),accessToken,refreshToken,accessExpiresAt:expires};
}
export async function rotate(refresh:string){
 if(!/^[A-Za-z0-9_-]{40,100}$/.test(refresh))throw new HttpError(401,'Session expired');
 return transaction(async client=>{
  const {rows}=await client.query(`SELECT s.*,u.id AS uid,u.username,u.display_name,u.role FROM sessions s
   JOIN users u ON u.id=s.user_id WHERE s.refresh_hash=$1 AND s.refresh_expires_at>now() AND s.revoked_at IS NULL AND u.active=true FOR UPDATE OF s`,[sha256(refresh)]);
  if(!rows[0])throw new HttpError(401,'Session expired');
  const accessToken=token(),refreshToken=token();
  await client.query(`UPDATE sessions SET access_hash=$2,refresh_hash=$3,access_expires_at=now()+interval '10 minutes',last_seen_at=now() WHERE id=$1`,[rows[0].id,sha256(accessToken),sha256(refreshToken)]);
  return {user:userOf({...rows[0],id:rows[0].uid}),accessToken,refreshToken,accessExpiresAt:new Date(Date.now()+10*60*1000).toISOString()};
 });
}
export async function logout(req:Request){const access=bearer(req);if(access)await db().query('UPDATE sessions SET revoked_at=now() WHERE access_hash=$1',[sha256(access)]);}
export async function createStudent(creatorId:string,usernameInput:string,displayNameInput:string,password:string){
 const username=usernameInput.toLowerCase().trim(),displayName=displayNameInput.trim();
 if(!/^[a-z0-9._-]{3,36}$/.test(username)||displayName.length<1||displayName.length>70)throw new HttpError(400,'Invalid username or display name');
 const passwordHash=await hashPassword(password);
 try{const {rows}=await db().query(`INSERT INTO users(username,display_name,role,password_hash,created_by) VALUES($1,$2,'student',$3,$4)
 RETURNING id,username,display_name,role`,[username,displayName,passwordHash,creatorId]);return userOf(rows[0]);}
 catch(e){if((e as {code?:string}).code==='23505')throw new HttpError(409,'Username already exists');throw e;}
}
export async function audit(client:PoolClient,actorId:string,action:string,targetId:string|null,details:unknown={}){
 await client.query('INSERT INTO audit_events(actor_id,action,target_id,details) VALUES($1,$2,$3,$4::jsonb)',[actorId,action,targetId,JSON.stringify(details)]);
}
