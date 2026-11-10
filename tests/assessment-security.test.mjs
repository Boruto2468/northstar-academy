import test from 'node:test';import assert from 'node:assert/strict';
import {canReveal,isExamOpen,deadlineAt} from '../src/assessment/policy.ts';
import fs from 'node:fs';
import {studentItem} from '../src/assessment/serialization.ts';
import {makePaperItem} from '../src/assessment/items.ts';
import {randomParams} from '../src/maths/generator.ts';
test('exam cannot start early or after close',()=>{
 const a='2026-11-20T08:00:00.000Z',b='2026-11-20T09:00:00.000Z';
 assert.equal(isExamOpen(a,b,'2026-11-20T07:59:59.000Z'),false);
 assert.equal(isExamOpen(a,b,a),true);assert.equal(isExamOpen(a,b,b),false);
});
test('deadline is earliest of duration and exam closure',()=>{
 assert.equal(deadlineAt('2026-11-20T08:20:00Z',3600,'2026-11-20T09:00:00Z'),'2026-11-20T09:00:00.000Z');
 assert.equal(deadlineAt('2026-11-20T08:20:00Z',600,'2026-11-20T09:00:00Z'),'2026-11-20T08:30:00.000Z');
});
test('exam results stay hidden until submitted, closed and released',()=>{
 const close='2026-11-20T09:00:00Z',release='2026-11-20T10:00:00Z';
 assert(!canReveal('exam','in_progress','2026-11-20T11:00:00Z',close,release,false));
 assert(!canReveal('exam','submitted','2026-11-20T08:59:00Z',close,release,true));
 assert(!canReveal('exam','submitted','2026-11-20T09:30:00Z',close,release,false));
 assert(canReveal('exam','submitted','2026-11-20T10:00:00Z',close,release,false));
 assert(canReveal('exam','submitted','2026-11-20T09:01:00Z',close,release,true));
 assert(canReveal('test','submitted','2026-11-20T08:00:00Z',null,null,false));
});
test('database constrains a student to one exam attempt and blocks browser direct table access',()=>{
 const schema=fs.readFileSync(new URL('../db/001_initial.sql',import.meta.url),'utf8');
 assert.match(schema,/UNIQUE INDEX IF NOT EXISTS one_exam_attempt/);
 assert.match(schema,/cancelled_at timestamptz/);
 assert.match(schema,/WHERE kind='exam'/);
 assert.match(schema,/REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated/);
 const sw=fs.readFileSync(new URL('../public/sw.js',import.meta.url),'utf8');
 assert.match(sw,/api\|login\|tests\|exams\|attempts\|teacher/);
});
test('existing databases can add exam cancellation state idempotently',()=>{
 const migration=fs.readFileSync(new URL('../db/002_exam_cancellation.sql',import.meta.url),'utf8');
 assert.match(migration,/ADD COLUMN IF NOT EXISTS cancelled_at timestamptz/);
});
test('cancelled exams cannot be started and active attempts are not changed by cancellation',()=>{
 const assessments=fs.readFileSync(new URL('../src/server/assessments.ts',import.meta.url),'utf8');
 const cancel=fs.readFileSync(new URL('../src/app/api/teacher/exams/[id]/cancel/route.ts',import.meta.url),'utf8');
 assert.match(assessments,/if\(exam\.cancelled_at\)throw new HttpError\(403,'Exam has been cancelled'\)/);
 assert.match(cancel,/UPDATE assessments SET cancelled_at=now\(\)/);
 assert.doesNotMatch(cancel,/UPDATE attempts/);
});
test('deleting an exam removes its events and attempt records transactionally',()=>{
 const route=fs.readFileSync(new URL('../src/app/api/teacher/exams/[id]/route.ts',import.meta.url),'utf8');
 assert.match(route,/DELETE FROM exam_events/);
 assert.match(route,/DELETE FROM attempts WHERE assessment_id=\$1/);
 assert.match(route,/DELETE FROM assessments WHERE id=\$1/);
 assert.match(route,/exam_delete/);
});

test('student in-progress attempt payload contains no secret, marking scheme or key',()=>{
 const source=makePaperItem('percent.compound',randomParams(()=>0.34,5),'theory');
 const row={id:source.id,position:0,topic:source.topic,subtopic:source.subtopic,item_type:source.itemType,marks:source.marks,public_data:source.publicData,
  response:{},grade:null,secret_data:source.secretData,teacher_points:null};
 const hidden=studentItem(row,false),visible=studentItem(row,true);
 for(const key of ['secret_data','answer','grade','workedSolution','markingScheme','commonWrongAnswers','correctAnswer','correctOptionId'])assert(!Object.hasOwn(hidden,key),key);
 assert.equal(visible.answer,source.secretData.correctAnswer);
 assert.equal(visible.markingScheme.length,source.secretData.markingScheme.length);
});
