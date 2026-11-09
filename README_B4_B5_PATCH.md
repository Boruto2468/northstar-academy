# Northstar Academy — B4 Chat + B5 Biology Videos (incremental patch)

**Base:** B1–B3 Northstar Academy replacement, as checked against `Boruto2468/northstar-academy` on 9 November 2026. This is **not a replacement/rebuild** of the Maths, Biology, test, exam or student-account engines.

## Contents

- `db/002_chat.sql` — additive migration: chat teacher presence, threads, messages, bug logs and indexes. **Run after** `db/001_initial.sql`. Do **not** re-run the original migration on a live school database unless you have reviewed its consequences.
- `src/app/api/chat/**` and `src/server/chat*.ts`, `src/server/curriculumAI.ts`, `src/chat/policy.ts` — authenticated backend, authorisation, rate limits, conditional Sonnet-class AI and email notifications.
- `src/components/chat/**`, `src/app/teacher/inbox/page.tsx` — floating student chat and teacher inbox (replies, unread counts, resolved status, AI corrections and automatic/manual availability).
- `src/data/biologyVideos.ts`, `src/components/BiologyWatch.tsx` — Biology video lists, topic/subtopic Watch UI.
- `scripts/check-biology-videos.mjs` — live YouTube oEmbed verification, with offline format/coverage mode.
- `tests/chat-policy.test.mjs`, `tests/biology-videos.test.mjs` — automated regression tests.
- Small integrations in `src/app/layout.tsx`, `src/components/TopicExperience.tsx`, `src/components/assessments/AccountNav.tsx`, `src/app/globals.css`, `package.json`, `.env.example`.

## Installation onto existing repository

1. Back up/commit your current work and make sure your branch is clean: `git status`.
2. **Recommended:** download `northstar-b4-b5-incremental.patch` from this delivery and in the **root of your existing project**, run:

   ```sh
   git apply --check northstar-b4-b5-incremental.patch
   git apply northstar-b4-b5-incremental.patch
   ```

   If you have modified an existing integrated file since the B1–B3 baseline, Git may report a conflict. **Do not blindly overwrite it**; manually merge the overlapping changes. Alternatively, unzip `northstar-b4-b5-changed-files.zip` into your project, preserving the folder structure, after reviewing the six existing files that will be updated.
3. In your existing **Supabase** project, open **SQL Editor**, paste and run **`db/002_chat.sql`**. It only creates B4 tables. The original B2 accounts and B3 examination records stay in place.
4. Append the B4 variables from `.env.example` to your existing `.env.local`, without deleting `DATABASE_URL` or `CRON_SECRET`. Use real values only on your server:

   ```dotenv
   ANTHROPIC_API_KEY=
   ANTHROPIC_MODEL=claude-sonnet-5-5
   RESEND_API_KEY=
   CHAT_EMAIL_TO=
   CHAT_EMAIL_FROM=
   APP_BASE_URL=https://YOUR-APP.vercel.app
   ```

   `ANTHROPIC_API_KEY` is obtained from the Anthropic console. `ANTHROPIC_MODEL` is **server configurable**: check [Anthropic's current model list](https://platform.claude.com/docs/en/models/overview) when deploying. The shown Sonnet 5.5 ID was active in November 2026. **The AI feature costs money per API usage** and needs an account with valid billing.

   For email, you can use [Resend](https://resend.com). Configure and verify a sender domain, set `CHAT_EMAIL_FROM` to an authorised sender, and set `CHAT_EMAIL_TO` to the teacher's address. If not configured, chat and teacher inbox still work, but no emails are sent. Emails contain thread notification and a teacher-inbox link **not** children's message content.

   To run without AI or email initially, leave the respective keys blank. No secrets belong in `NEXT_PUBLIC_*`, the source code, or GitHub.
5. Run:

   ```sh
   npm install
   npm test
   npm run videos:check
   npm run build
   npm run dev
   ```

6. Sign in as a student and check the floating **Messages** button on a Biology or Maths page. Start a Subject question and a Site problem; open each thread. Check that a Site problem logs current path, topic when selected, browser and a limited, text-free history of page-control actions. Sign in as teacher and open `/teacher/inbox`. Test unread counts, replies, AI correction targeting, resolved status and availability override.
7. Start a timed test or exam. The floating button should vanish, and **the server will refuse AI requests while any attempt is recorded in progress**, including one with an expired timer pending server submission. AI should not give answers to currently tested questions.
8. Add B4 environment variables to **Vercel Project → Settings → Environment Variables** and redeploy. The earlier B1–B3 Node/Next.js hosting arrangement stays the same. GitHub Pages is still unsuitable for this server-backed app.

## B4 security and privacy notes

- Every API call checks the existing bearer token and student/teacher role. Teachers can read all threads; students can read their own only.
- Student messages are limited to 1,400 characters; server database controls rate-limit threads and messages, with additional AI-message limits. Phone/email-like inputs are rejected; discourage children from entering any other identifying details.
- AI responds only to conservatively filtered simple questions within one chosen curriculum topic, when a teacher is away, the API is configured, and no test or exam is in progress. The model receives the student text, **but not names, database records, exam questions or answers**. The server prompt tells the model to refuse personal-data requests and direct complex/off-topic questions to the teacher. All AI messages are stored and visibly labelled, and teachers can attach a correction.
- AI safety is policy plus model compliance, not a guarantee: confirm safeguards and school policy for external AI processing involving minors before enabling it. Leave the Anthropic key unset until approved.
- `scripts/chat-retention.sql` is an **optional**, deliberate maintenance script to delete resolved conversations older than 180 days. Apply only according to your school policy; nothing deletes records automatically.
- Authentication is still tab-scoped by the original B2 session implementation. No change to exam timing, marking, answer data, or release rules.

## B5 Biology video list

The video list is stored at `src/data/biologyVideos.ts`, keyed by all six Biology topics and 22 subtopics. 14 distinct YouTube video pages were identified through publicly indexed YouTube listings and descriptions on 9 Nov 2026. Some videos are reused where they directly cover multiple related subtopics. They **open on YouTube** and are never embedded.

**Exactly six subtopics have an explicit empty placeholder** because a subject-specific YouTube page could not be independently confirmed:

- Living organisms / Vertebrates and invertebrates
- Living organisms / Biodiversity and sampling
- Cell structure and organisation / Microscopy and magnification
- Movement in and out of cells / Diffusion and concentration gradients
- Movement in and out of cells / Factors affecting exchange rates
- Biological molecules and enzymes / Temperature and pH effects

Topic overview videos remain available for these topics. Do not add an unverified URL just to fill a placeholder. Lengths marked `~` are **approximate**, inferred from indexed video chapter timings; the script checks video title/channel/availability, but YouTube oEmbed **does not provide precise duration**. Exact duration can be updated manually or by a separate video metadata API.

- `npm run videos:check` — live YouTube oEmbed title/channel/link check. Requires normal Internet access and may fail due to network filtering or YouTube throttling.
- `npm run videos:check:offline` — URL format, coverage and metadata checks **only**. This does **not** establish live video availability.

## Verification performed during patch creation

- `npm test`: **167 tests passed** (149 existing Maths + 10 existing assessment + 8 new chat/video tests).
- `npm run videos:check:offline`: **passed** (14 unique URLs, 22 subtopics, 6 deliberate placeholders).
- 17 touched TypeScript/TSX files parsed with TypeScript `transpileModule` and **0 syntax diagnostics**.
- **Not verified here:** full Next.js build (npm dependency install timed out), actual Supabase migration/runtime, browser end-to-end chat UI, live Resend/Anthropic responses and live YouTube oEmbed checks. Run those locally before releasing to children.
