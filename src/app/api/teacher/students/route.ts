import {teacher,createStudent,DELETED_ACCOUNT_PASSWORD_HASH} from '@/server/auth';import {db} from '@/server/db';import {body,respond,str} from '@/server/http';
export const runtime='nodejs';
export async function GET(req:Request){return respond(async()=>{await teacher(req);const {rows}=await db().query("SELECT id,username,display_name AS \"displayName\",active,created_at AS \"createdAt\" FROM users WHERE role='student' AND password_hash<>$1 ORDER BY created_at DESC LIMIT 200",[DELETED_ACCOUNT_PASSWORD_HASH]);return {students:rows};});}
export async function POST(req:Request){return respond(async()=>{const u=await teacher(req),d=await body(req,6000);return {student:await createStudent(u.id,str(d.username,36),str(d.displayName,70),str(d.password,128))};},201);}
