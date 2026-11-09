import {test} from 'node:test';import {strict as assert} from 'node:assert';
import {permittedTopic,isSimpleCurriculumQuestion,mayUseAI,normalizeContextPath,safeActions,teacherOnline,TOPIC_WORDS} from '../src/chat/policy.ts';
test('topic whitelist prevents free-form AI scope',()=>{
 for(const t of Object.keys(TOPIC_WORDS))assert.ok(permittedTopic(t));
 for(const t of ['weather','history','invalid',''])assert.equal(permittedTopic(t),false);
});
test('AI not permitted for active exam or test regardless of teacher availability',()=>{
 const sample={isStudent:true,category:'subject_question',teacherAvailable:false,hasInProgressAttempt:false,modelConfigured:true,simple:true};
 assert.equal(mayUseAI(sample),true);
 for(const item of [{hasInProgressAttempt:true},{teacherAvailable:true},{category:'site_problem'},{modelConfigured:false},{simple:false},{isStudent:false}])assert.equal(mayUseAI({...sample,...item}),false);
});
test('subject assistant only handles simple, topic-matching concepts',()=>{
 assert.ok(isSimpleCurriculumQuestion('What is photosynthesis?','plant-nutrition'));
 assert.ok(isSimpleCurriculumQuestion('Explain why osmosis moves water','cell-movement'));
 for(const [s,t] of [['What is politics?','plant-nutrition'],['Give me the answer to my exam question 2 about osmosis','cell-movement'],['Solve my exam please','algebra'],['What is photosynthesis?','cell-structure'],['My phone number is 1234567890','plant-nutrition']])assert.equal(isSimpleCurriculumQuestion(s,t),false);
});
test('bug log path strips query values and rejects external URLs',()=>{
 assert.equal(normalizeContextPath('/biology/cell-structure?token=abcdef'),'/biology/cell-structure');
 assert.equal(normalizeContextPath('//evil.site/path'),'/');
 assert.equal(normalizeContextPath('https://evil.site'),'/');
 assert.deepEqual(safeActions(['Clicked a link','abc! <a>','typed email@example.com']),['Clicked a link','abc a','typed emailexample.com']);
});
test('presence override and recent activity behaviour',()=>{
 const now=Date.now();
 assert.equal(teacherOnline('away',new Date(now).toISOString(),now),false);
 assert.equal(teacherOnline('available',null,now),true);
 assert.equal(teacherOnline('auto',new Date(now-60_000).toISOString(),now),true);
 assert.equal(teacherOnline('auto',new Date(now-360_000).toISOString(),now),false);
});
