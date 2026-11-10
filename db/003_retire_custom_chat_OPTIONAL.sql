-- OPTIONAL AND DESTRUCTIVE: Run ONLY after exporting or deliberately discarding
-- old Northstar B4 chat messages and problem reports. This is NOT required
-- to use tawk.to and must NOT run as part of routine deployment.
-- It never touches users, tests, exams, scores or Biology videos.
BEGIN;
DROP TABLE IF EXISTS public.chat_site_problems;
DROP TABLE IF EXISTS public.chat_messages;
DROP TABLE IF EXISTS public.chat_threads;
DROP TABLE IF EXISTS public.chat_teacher_presence;
COMMIT;
