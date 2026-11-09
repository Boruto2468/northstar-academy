# Northstar Academy – B1+B2+B3 integrated release

This project extends the **existing** Next.js 15/TypeScript Northstar lessons and Phase 1 review with authenticated Maths tests and scheduled examinations. Maths and Biology lesson pages and local progress remain.

## Deploy architecture change

**GitHub Pages cannot run dynamic Next.js route handlers.** It must not be used for authenticated tests/exams. This release uses `next build` / `next start` on a Node-capable host such as Vercel, with a hosted PostgreSQL database such as Supabase. The old Pages workflow is disabled. The PWA service worker no longer caches `/api`, `/login`, `/tests`, `/exams`, `/attempts` or `/teacher`.

## Setup

1. Create a private hosted Postgres project (Supabase → project → Database). Use Supabase's actual **Connect** URL, preferably a transaction-pooler URL on serverless Vercel. SSL must be enabled. **Do not place the Postgres URI in `NEXT_PUBLIC_*`**. All DB access stays server-side.
2. Run `db/001_initial.sql` once in the database SQL editor. This defines 10 tables, constraints, indexes and disabled public browser access.
3. Create `.env.local` using `.env.example`. Set `DATABASE_URL` and a random, private `CRON_SECRET`. Don't commit `.env.local`.
4. `npm install` then `npm test` and `npm run build`. `npm run dev` starts local Next.js including the API.
5. Create your first teacher: set `INITIAL_TEACHER_USERNAME`, `INITIAL_TEACHER_NAME`, and `INITIAL_TEACHER_PASSWORD` in your terminal, then `node --env-file=.env.local scripts/create-teacher.mjs`. The teacher must be created *after* the migration.
6. Sign in at `/login` as teacher, create students at `/teacher`, and share the passwords privately.
7. Students sign in and launch practice tests at `/tests` or scheduled exams at `/exams`.
8. Deploy to a Node runtime (Vercel is a simple choice). Configure `DATABASE_URL` and `CRON_SECRET` in your provider's server-side environment variables and deploy the repository. The included `vercel.json` cron calls `/api/internal/expire` once per minute to submit abandoned timed-out attempts. Some hosting plans limit cron frequency; for such hosts use a supported scheduler invoking the protected endpoint with `Authorization: Bearer <CRON_SECRET>`. Direct API reads also expire overdue attempts.

**Privacy:** Student accounts require only a pseudonymous username and a display name. No email, phone, DOB or address is collected. Passwords are hashed with scrypt using unique salts; tokens are random opaque values whose hashes are stored in Postgres. Access tokens expire after 10 minutes and are automatically rotated from a tab-scoped refresh token for up to 12 hours. Closing the tab normally clears `sessionStorage`. Browsers that restore a previous session may restore sessionStorage as well; for high-assurance deployments, a server-enforced short session lifetime and device-management policy still matter. Passwords should be distributed through a secure private channel. The teacher can revoke a session by removing it from the `sessions` table; add a GUI control before broad classroom rollout.

**Time zone:** Teacher date/time inputs are interpreted as `Africa/Lagos` (WAT, fixed UTC+1). Times are converted to UTC for persistence. The server/database clock enforces opens/closes, start and deadlines. The front-end countdown is display-only and recalculated from the stored server deadline.

## Assessment data and logic

- Every attempt stores private marking snapshots separately from public question text and choice options. Private answers are not included in any student-facing API result before release.
- **B1** `/tests`: choose topics, 2–50 questions and 1–240 minutes; presets; objective (2 marks) and theory (6 marks), with optional subparts; server autosave, question navigation, no feedback until submission; immediate A1-style review after submission.
- **B2** `/login`, `/teacher`: teacher-created child accounts, teacher/student roles, database sessions, protected route handlers and rate-limited login.
- **B3** `/teacher`: create exam schedules, choose topics or bank questions, random question/choice order per student, enforce one attempt per student, save answers, auto-submit at the earlier deadline, log tab departures without blocking, release results at the scheduled WAT time (never before closing), teacher grade overrides and a per-student breakdown.
- **No repeats**: `used_questions(user_id, signature)` rejects reuse of the same generated parameter signature across assessment attempts. Teacher-selected bank questions previously used by the student are rejected instead of silently repeated. A student may run out of unique questions for a narrow set of skills; widen selected topics when necessary.
- **Answer checking:** uses the Phase 1 required-form validator and immutable snapshots. Mathematical theory parts with final answers are automatically marked using an exact spec; lengthy free-text proofs are not automatically graded. Teacher mark overrides support moderation after submission. This release does not claim a comprehensive hand-marked WAEC paper bank.

## Scripts and checks

```sh
npm install
npm run test:maths
npm run test:assessment
npm test
npm run build
npm run dev
```

The `tests/assessment-*.test.mjs` scripts check objective answer isolation and grading, theory marking, uniqueness, deadline policies, and scheduled release rules. A real database-connected end-to-end test is still required before handling actual children's assessments.

## Production requirements before broad rollout

- Confirm database migrations and SSL connectivity against your own hosted database.
- Confirm one attempt under racing start calls; autosave while a deadline is reached; expiry scheduler invocation; and reloading an open exam on two devices.
- Review original exam question wording, varied answer forms and marking schemes with a teacher before use in graded examinations.
- Configure HTTPS, database backups, student-account revocation, minimum data-retention schedules and access logs that exclude passwords, tokens and answer contents.
- Do not place any secrets or student database backups in GitHub or browser code.

## Teacher administration

The teacher can reset a student password (which revokes existing sessions) or deactivate a student account. Tests may be resumed from `/tests` after signing in again. For data-retention maintenance, see `scripts/maintenance.sql`, and agree on a school retention policy before deleting assessment records.

## Release boundaries

**B4 (chat) and B5 (Biology video links) have not been implemented**, as requested by the approved B1–B3 bundle scope. A private database and live deployment have not been provisioned automatically; you must connect your own accounts and environment variables.
