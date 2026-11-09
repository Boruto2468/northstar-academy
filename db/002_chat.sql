-- B4 increment only; run AFTER db/001_initial.sql (existing data is preserved).
CREATE TABLE IF NOT EXISTS chat_teacher_presence (
 teacher_id uuid PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 override_status text NOT NULL DEFAULT 'auto' CHECK (override_status IN ('auto','available','away')),
 last_activity_at timestamptz NOT NULL DEFAULT to_timestamp(0),
 updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS chat_threads (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
 student_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 category text NOT NULL CHECK (category IN ('subject_question','site_problem')),
 title text NOT NULL CHECK (length(title) BETWEEN 3 AND 100),
 status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','resolved')),
 topic_id text,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 teacher_last_read_at timestamptz, student_last_read_at timestamptz
);
CREATE INDEX IF NOT EXISTS chat_threads_student_updated_idx ON chat_threads(student_id,updated_at DESC);
CREATE INDEX IF NOT EXISTS chat_threads_teacher_updated_idx ON chat_threads(updated_at DESC);
CREATE TABLE IF NOT EXISTS chat_messages (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), thread_id uuid NOT NULL REFERENCES chat_threads(id) ON DELETE CASCADE,
 author_id uuid REFERENCES users(id) ON DELETE SET NULL,
 sender_type text NOT NULL CHECK (sender_type IN ('student','teacher','ai')),
 body text NOT NULL CHECK (length(body) BETWEEN 1 AND 1500),
 corrects_message_id uuid REFERENCES chat_messages(id) ON DELETE SET NULL,
 model_id text, created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT ai_message_metadata CHECK ((sender_type = 'ai') = (model_id IS NOT NULL))
);
CREATE INDEX IF NOT EXISTS chat_messages_thread_created_idx ON chat_messages(thread_id,created_at,id);
CREATE INDEX IF NOT EXISTS chat_messages_author_created_idx ON chat_messages(author_id,created_at DESC);
CREATE TABLE IF NOT EXISTS chat_site_problems (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), thread_id uuid NOT NULL UNIQUE REFERENCES chat_threads(id) ON DELETE CASCADE,
 page_path text NOT NULL DEFAULT '/', topic_id text, browser_info text,
 last_actions jsonb NOT NULL DEFAULT '[]'::jsonb CHECK (jsonb_typeof(last_actions)='array'),
 reported_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE chat_teacher_presence ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_site_problems ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON chat_teacher_presence,chat_threads,chat_messages,chat_site_problems FROM anon,authenticated;
-- Permissions are enforced in Next.js server routes using the existing authenticated session.
