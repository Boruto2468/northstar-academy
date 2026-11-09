# Northstar Academy — Year 10 Maths and Biology

Interactive Next.js/TypeScript lessons, Phase 1 Maths practice/review, **timed tests (B1)**, **student/teacher accounts (B2)** and **teacher-scheduled exams (B3)**.

**Important:** This version requires a Next.js **server** and hosted Postgres. It **cannot run on GitHub Pages**. The old Pages deployment workflow has been disabled. Use a Node-compatible host such as Vercel for this version.

See **[README_B1_B2_B3.md](README_B1_B2_B3.md)** for database migration, initial teacher creation, environment variables, login/session security, deployment and quality-assurance steps.

```bash
npm install
npm test
npm run build
npm run dev
```

Routes: `/` (lessons), `/tests` (student timed practice), `/exams` (teacher-scheduled exams), `/login`, `/teacher` (teacher administration).

**Privacy:** The database stores child accounts using only usernames/display names; credentials and private marking data stay on the server. Teachers can permanently remove a student from `/teacher`: sign-in is disabled, identifying account details and chat history are erased, and assessment records remain anonymized. The username is freed for reuse. Keep `.env.local` out of version control.
