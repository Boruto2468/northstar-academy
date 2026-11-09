import {teacher} from '@/server/auth';import {db,transaction} from '@/server/db';import {respond,body,numberIn} from '@/server/http';
import {makePaperItem,topicSkills} from '@/assessment/items';import {randomParams} from '@/maths/generator';
export const runtime='nodejs';
export async function GET(req:Request){return respond(async()=>{await teacher(req);const {rows}=await db().query("SELECT id,topic,subtopic,template_id,item_type,marks,public_data,secret_data->>'correctAnswer' AS answer,secret_data->'workedSolution' AS solution FROM question_bank ORDER BY topic,subtopic LIMIT 500");return {items:rows};});}
export async function POST(req:Request){return respond(async()=>{const u=await teacher(req),d=await body(req,3000),perSkill=numberIn(d.perSkill??2,1,6);const created=await transaction(async client=>{
 let n=0;for(const skill of topicSkills)for(let k=0;k<perSkill;k++){
  const item=makePaperItem(skill.templateId,randomParams(Math.random,k%2?5:4),k%2?'theory':'objective');
  const res=await client.query(`INSERT INTO question_bank(topic,subtopic,template_id,item_type,public_data,secret_data,marks,signature)
 VALUES($1,$2,$3,$4,$5::jsonb,$6::jsonb,$7,$8) ON CONFLICT(signature) DO NOTHING RETURNING id`,[item.topic,item.subtopic,item.templateId,item.itemType,JSON.stringify(item.publicData),JSON.stringify(item.secretData),item.marks,item.signature]);
  n+=res.rowCount||0;
 }return n;});return {created,teacher:u.username};});}
