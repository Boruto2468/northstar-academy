/** Run: npm run videos:check (live) or npm run videos:check:offline (format/coverage only).
 * No URL is inferred. Live mode requires connectivity to YouTube oEmbed. */
import {biologyVideos} from '../src/data/biologyVideos.ts';
const offline=process.argv.includes('--offline');
const ids=new Map(),problems=[],unverified=[];
const topicSubtopicCounts={
 'living-organisms':4,'cell-structure':4,'cell-movement':4,
 'molecules-enzymes':4,'plant-nutrition':3,'plant-transport':3
};
for(const [topic,count] of Object.entries(topicSubtopicCounts)){
 const bundle=biologyVideos[topic];if(!bundle){problems.push(`Missing topic: ${topic}`);continue;}
 if(!Array.isArray(bundle.overview)||bundle.overview.length>3)problems.push(`${topic}: overview must have 0–3 videos`);
 for(let n=1;n<=count;n++){
  const key=`s${n}`;const list=bundle.subtopics[key];
  if(!Array.isArray(list)||list.length>3)problems.push(`${topic}/${key}: expected 0–3 links`);
  if(!list?.length)unverified.push(`${topic}/${key}`);
 }
 for(const [section,list] of [['overview',bundle.overview],...Object.entries(bundle.subtopics)])for(const v of list){
  if(!v.title||!v.channel||!v.length)problems.push(`${topic}/${section}: missing title, channel or length`);
  try{const url=new URL(v.url);const id=url.searchParams.get('v');if(url.hostname!=='www.youtube.com'||url.pathname!=='/watch'||!id||!/^[\w-]{11}$/.test(id))throw Error('Invalid YouTube URL');
   const prior=ids.get(id);if(prior&&(prior.title!==v.title||prior.channel!==v.channel))problems.push(`${id}: inconsistent title/channel across sections`);
   ids.set(id,v);
  }catch{problems.push(`${topic}/${section}: invalid URL ${v.url}`);}
 }
}
function normalize(s){return s.toLowerCase().replace(/\(20\d\d[^)]*\)/g,'').replace(/[^a-z0-9 ]/g,' ').replace(/\b(gcse|biology|ks3|exams|exam)\b/g,' ').replace(/\s+/g,' ').trim();}
function titleMatch(stored,live){const a=normalize(stored).split(' ').filter(w=>w.length>=3);const b=new Set(normalize(live).split(' '));return a.filter(w=>b.has(w)).length>=Math.min(3,Math.ceil(a.length*.5));}
async function verifyOne([id,v]){
 const url=`https://www.youtube.com/oembed?url=${encodeURIComponent(`https://www.youtube.com/watch?v=${id}`)}&format=json`;
 try{
  const res=await fetch(url,{signal:AbortSignal.timeout(9000),headers:{'User-Agent':'NorthstarAcademy-video-check/1.0'}});
  if(!res.ok)return `${id}: unreachable (${res.status})`;
  const data=await res.json();
  if(!titleMatch(v.title,data.title||''))return `${id}: title mismatch | stored: "${v.title}" | live: "${data.title}"`;
  if(normalize(v.channel)!==normalize(data.author_name||''))return `${id}: channel mismatch | stored: ${v.channel} | live: ${data.author_name}`;
  return null;
 }catch(e){return `${id}: link could not be checked (${e instanceof Error?e.message:String(e)})`;}
}
if(!offline){const entries=[...ids.entries()];for(let offset=0;offset<entries.length;offset+=3){
 const checks=await Promise.all(entries.slice(offset,offset+3).map(verifyOne));for(const issue of checks)if(issue)problems.push(issue);
}}
console.log(`Biology video inventory: ${ids.size} unique links; ${Object.values(topicSubtopicCounts).reduce((a,b)=>a+b,0)} subtopics.`);
console.log(`Subtopics intentionally left empty: ${unverified.length}${unverified.length?'\n- '+unverified.join('\n- '):''}`);
console.log(offline?'Offline mode: live availability, channel, duration and title NOT verified.':'Live oEmbed title, channel and availability check attempted. Approximate lengths cannot be validated by oEmbed.');
if(problems.length){console.error(`${problems.length} issue(s):\n- ${problems.join('\n- ')}`);process.exitCode=1;}else console.log('No issues detected for the checks performed.');
