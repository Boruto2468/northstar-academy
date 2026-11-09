-- Optional administrator-run retention tasks. Schedule according to your school's policy.
DELETE FROM sessions WHERE refresh_expires_at < now() - interval '30 days' OR revoked_at < now() - interval '30 days';
DELETE FROM login_failures WHERE attempted_at < now() - interval '30 days';
-- The following preserves historical exam records by default. Decide retention with the school first.
-- DELETE FROM exam_events WHERE at < now() - interval '180 days';
-- DELETE FROM audit_events WHERE at < now() - interval '365 days';
