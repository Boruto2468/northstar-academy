-- Optional teacher-admin maintenance for minimal child data retention.
-- Execute manually in Supabase SQL Editor after reviewing your school policy.
-- Deletes resolved chat threads older than 180 days, including their messages and bug metadata.
-- Do not run unless your school's retention period permits deletion.
DELETE FROM chat_threads WHERE status='resolved' AND updated_at < now()-interval '180 days';
