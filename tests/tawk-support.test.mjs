import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHmac} from 'node:crypto';
import {supportAllowedRoute,tawkEmbedUrl} from '../src/support/policy.ts';
import {tawkSecureHash} from '../src/support/secure.ts';

const root=new URL('../',import.meta.url);
const source=file=>readFileSync(new URL(file,root),'utf8');
const id='645d74e2-7ec4-4e20-a9f9-fac66e1a410c';

test('exam/test/attempt routes are excluded, even direct deep links',()=>{
 for(const p of ['/tests','/tests/start','/exams','/exams/123','/attempts','/attempts/123'])assert.equal(supportAllowedRoute(p),false,p);
});
test('lookalike unrelated routes remain allowed',()=>{
 for(const p of ['/','/biology','/mathematics/indices','/tests-explained','/exam-guidance'])assert.equal(supportAllowedRoute(p),true,p);
});
test('malformed paths and protocol-relative paths cannot bypass policy',()=>{
 for(const p of ['//exams','https://example.com/','/attempts/5','not/a/path'])assert.equal(supportAllowedRoute(p),false,p);
});
test('tawk embed URL generated only from safe public identifiers',()=>{
 assert.equal(tawkEmbedUrl('abcdef1234567890','default'),'https://embed.tawk.to/abcdef1234567890/default');
 for(const p of ['','..','evil/path','https://evil.example','javascript:alert(1)','abc?x=1'])assert.equal(tawkEmbedUrl(p,'default'),null);
 for(const w of ['','../xx','?x=1','evil.example/x'])assert.equal(tawkEmbedUrl('abcdef1234567890',w),null);
});
test('server signature implements tawk.to Secure Mode HMAC SHA256',()=>{
 const key='A-secret-of-reasonable-length';
 assert.equal(tawkSecureHash(id,key),createHmac('sha256',key).update(id).digest('hex'));
 assert.equal(tawkSecureHash(id,key).length,64);
 assert.notEqual(tawkSecureHash(id,key),tawkSecureHash(id,key+'x'));
});
test('authenticated student profile is passed to Tawk without sending email',()=>{
 const server=source('src/app/api/support/identity/route.ts');
 assert.match(server,/name:user\.displayName/);
 assert.match(server,/username:user\.username/);
 assert.doesNotMatch(server,/email\s*:/);
});
test('signing secret remains server-only',()=>{
 const client=source('src/components/support/TawkSupport.tsx');
 assert.ok(!client.includes('TAWK_API_KEY'));
 assert.match(source('src/app/api/support/identity/route.ts'),/currentUser\(req\)/);
 assert.match(source('src/app/api/support/identity/route.ts'),/user\.role!=='student'/);
});
test('in-progress attempts are checked on the server before signature release',()=>{
 const server=source('src/app/api/support/identity/route.ts');
 assert.match(server,/status='in_progress'/);
 assert.match(server,/deadline_at>clock_timestamp\(\)/);
 assert.match(server,/if\(rows\[0\]\?\.blocked\)return \{allowed:false\}/);
});
test('retired custom chat routes and scripts are absent',()=>{
 for(const old of ['src/server/chat.ts','src/server/chatEmail.ts','src/server/curriculumAI.ts','src/components/chat/ChatLauncher.tsx','src/app/teacher/inbox/page.tsx','src/app/api/chat/threads/route.ts','db/002_chat.sql'])assert.equal(existsSync(new URL(old,root)),false,old);
});
test('Biology video component and data remain intact',()=>{
 for(const v of ['src/components/BiologyWatch.tsx','src/data/biologyVideos.ts','tests/biology-videos.test.mjs'])assert.equal(existsSync(new URL(v,root)),true,v);
});
