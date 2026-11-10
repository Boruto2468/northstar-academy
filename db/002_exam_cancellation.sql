-- Apply once to existing deployments to enable teacher cancellation of scheduled exams.
ALTER TABLE assessments ADD COLUMN IF NOT EXISTS cancelled_at timestamptz;
