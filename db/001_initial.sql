-- Northstar Academy: apply once in your hosted Postgres SQL editor.
-- The application connects using DATABASE_URL ONLY from server-side Next.js routes.
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE IF NOT EXISTS users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), username text NOT NULL UNIQUE CHECK(username ~ '^[a-z0-9._-]{3,36}$'),
 display_name text NOT NULL CHECK(length(display_name) BETWEEN 1 AND 70),
 role text NOT NULL CHECK(role IN ('student','teacher')),
 password_hash text NOT NULL, active boolean NOT NULL DEFAULT true,
 created_by uuid REFERENCES users(id), created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS sessions (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 access_hash text NOT NULL UNIQUE, refresh_hash text NOT NULL UNIQUE,
 access_expires_at timestamptz NOT NULL, refresh_expires_at timestamptz NOT NULL,
 revoked_at timestamptz, created_at timestamptz NOT NULL DEFAULT now(), last_seen_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_owner_idx ON sessions(user_id);
CREATE TABLE IF NOT EXISTS login_failures(
 id bigserial PRIMARY KEY, username text NOT NULL, attempted_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS login_failures_user_time ON login_failures(username,attempted_at DESC);
CREATE TABLE IF NOT EXISTS question_bank(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), topic text NOT NULL, subtopic text NOT NULL,
 template_id text NOT NULL, item_type text NOT NULL CHECK(item_type IN ('objective','theory')),
 public_data jsonb NOT NULL, secret_data jsonb NOT NULL, marks integer NOT NULL CHECK(marks BETWEEN 1 AND 20),
 signature text NOT NULL UNIQUE, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS assessments(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), kind text NOT NULL CHECK(kind IN ('test','exam')),
 title text NOT NULL, creator_id uuid NOT NULL REFERENCES users(id),
 blueprint jsonb NOT NULL, opens_at timestamptz, closes_at timestamptz,
 duration_seconds integer NOT NULL CHECK(duration_seconds BETWEEN 60 AND 14400),
 results_release_at timestamptz, release_now boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),
 CONSTRAINT exam_times CHECK (kind='test' OR (opens_at IS NOT NULL AND closes_at IS NOT NULL AND opens_at < closes_at))
);
CREATE TABLE IF NOT EXISTS attempts(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), assessment_id uuid NOT NULL REFERENCES assessments(id),
 user_id uuid NOT NULL REFERENCES users(id), kind text NOT NULL CHECK(kind IN ('test','exam')),
 status text NOT NULL DEFAULT 'in_progress' CHECK(status IN ('in_progress','submitted')),
 started_at timestamptz NOT NULL DEFAULT now(), deadline_at timestamptz NOT NULL,
 submitted_at timestamptz, score numeric(8,2) NOT NULL DEFAULT 0,
 max_score numeric(8,2) NOT NULL DEFAULT 0,
 CONSTRAINT submitted_time_consistency CHECK((status='submitted')=(submitted_at IS NOT NULL))
);
CREATE UNIQUE INDEX IF NOT EXISTS one_exam_attempt ON attempts(assessment_id,user_id) WHERE kind='exam';
CREATE INDEX IF NOT EXISTS attempts_user_idx ON attempts(user_id,started_at DESC);
CREATE TABLE IF NOT EXISTS attempt_items(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), attempt_id uuid NOT NULL REFERENCES attempts(id) ON DELETE CASCADE,
 position integer NOT NULL, topic text NOT NULL, subtopic text NOT NULL, template_id text NOT NULL,
 source_question_id uuid REFERENCES question_bank(id), signature text NOT NULL,
 item_type text NOT NULL CHECK(item_type IN ('objective','theory')),
 public_data jsonb NOT NULL, secret_data jsonb NOT NULL, marks integer NOT NULL,
 response jsonb NOT NULL DEFAULT '{}'::jsonb, grade jsonb,
 points numeric(8,2) NOT NULL DEFAULT 0, teacher_points numeric(8,2),
 UNIQUE(attempt_id,position), UNIQUE(attempt_id,signature)
);
CREATE INDEX IF NOT EXISTS attempt_items_attempt_idx ON attempt_items(attempt_id,position);
CREATE TABLE IF NOT EXISTS used_questions(
 user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 signature text NOT NULL, used_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (user_id,signature)
);
CREATE TABLE IF NOT EXISTS exam_events(
 id bigserial PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id),attempt_id uuid NOT NULL REFERENCES attempts(id),
 event_type text NOT NULL CHECK(event_type IN ('tab_hidden','tab_visible','window_blur','window_focus')),
 at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS audit_events(
 id bigserial PRIMARY KEY, actor_id uuid REFERENCES users(id), action text NOT NULL, target_id uuid,
 details jsonb NOT NULL DEFAULT '{}'::jsonb, at timestamptz NOT NULL DEFAULT now()
);
-- No browser client has table access; the server handles authorisation explicitly.
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_failures ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_bank ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE used_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE exam_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon, authenticated;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon, authenticated;
