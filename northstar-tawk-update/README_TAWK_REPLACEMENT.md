# Northstar Academy: tawk.to replacement for B4

**Verified code baseline:** `Boruto2468/northstar-academy`, `main` commit `e241a336d655a6679fec3f8893addbe6dfdf04b5` (9 November 2026). This is an incremental change: B1/B2/B3 and B5 are retained, not rebuilt.

## What the patch does

- Removes the previous in-app chat, teacher-inbox UI, chat API routes, Anthropic integration, Resend integration, and legacy chat tests/styles.
- Adds tawk.to's floating widget **only for signed-in students**. Teachers answer in [tawk.to Dashboard](https://dashboard.tawk.to/) (linked from the teacher navigation).
- Uses the Next.js server to sign tawk.to Secure Mode identity using the existing account UUID. The key never leaves the server. With school approval, the teacher-registered display name and username are shared with tawk.to; email, phone number, questions, and exam answers are not sent automatically.
- Disables and disconnects the widget on all `/tests`, `/exams` and `/attempts` pages. The server also blocks widget authorisation while any unexpired, unfinished assessment belongs to that student, even on other pages. After a test finishes, chat becomes available again (provided the student leaves the assessment route).
- Keeps existing `src/data/biologyVideos.ts`, `src/components/BiologyWatch.tsx` and all Maths / assessment code intact.
- Adds an **optional destructive** cleanup SQL file to retire the old chat tables after exporting or deliberately discarding old messages.

## Apply this incremental update to your current project

1. Back up/commit your existing changes and update your local checkout of `main`.
2. Extract `northstar-academy-tawk-update-2026-11-10.zip` **inside** the root of your repository (next to `package.json`), creating the `northstar-tawk-update/` folder.
3. Open a terminal at the repository root and run:

```sh
node northstar-tawk-update/apply-update.mjs
npm test
npm run build
```

The installer checks `git apply --check` before making changes, and will refuse to overwrite a conflicting update. It deletes the old B4 code and installs the new files; it never changes your database automatically. After testing, you may remove the temporary `northstar-tawk-update/` folder from the project, commit the resulting source changes and push to Vercel.

On Windows PowerShell, `Expand-Archive` can extract the ZIP, or use your file explorer's Extract All action. **Do not copy the entire older replacement project over the repository.** This is a patch for the latest `main` code.

## 1. Create a tawk.to property and get the identifiers

1. Sign in at https://dashboard.tawk.to/.
2. Create/select a property for Northstar Academy and add yourself as an agent.
3. Under **Administration → Overview**, copy the **Property ID**.
4. Under **Administration → Chat Widget**, copy the **Widget ID** (often `default`).
5. Under **Administration → Property Settings**, find the **API key** used for Secure Mode. Treat it as a secret.

See https://help.tawk.to/article/where-can-i-find-the-property-and-widget-id and https://developer.tawk.to/jsapi/.

## 2. Configure environment variables

Add these to `.env.local` for local development and to **Vercel → Project → Settings → Environment Variables** for the deployed site:

```dotenv
NEXT_PUBLIC_TAWK_PROPERTY_ID=YOUR_PROPERTY_ID
NEXT_PUBLIC_TAWK_WIDGET_ID=YOUR_WIDGET_ID
TAWK_API_KEY=YOUR_TAWK_PROPERTY_API_KEY
```

The ID values are public, but the **API key is secret and must not use `NEXT_PUBLIC_`**. Secure Mode is required; without the key, the widget stays disabled. Restart local development and redeploy after changing variables.

Remove the old `ANTHROPIC_API_KEY`, `ANTHROPIC_MODEL`, `RESEND_API_KEY`, `CHAT_EMAIL_TO`, `CHAT_EMAIL_FROM` and any other old B4 variables from Vercel and `.env.local` when not used elsewhere. **Keep `DATABASE_URL` and `CRON_SECRET`**, which belong to the test/exam backend.

**Important:** The setting above signs students in using their teacher-registered display name and shares their username as a Tawk attribute, alongside the stable account ID required for Secure Mode. No email address or phone number is sent. If you had set up tawk.to Secure Mode with a different API key or property, update the matching tawk.to configuration.

## 3. Keep email ticket replies and notifications

The application DOES NOT send emails via Resend any more. tawk.to does it.

1. In tawk.to, go to **Administration → Settings → Mail Notifications**.
2. Turn ON **New Tickets**, selecting yourself as a **Specific member** or **Admins**. Your tawk.to agent account must use the email address at which you want alerts.
3. Turn ON **Offline Form** notifications and **Missed Chats** notifications. Add yourself as a recipient. Optional: enable **Chat Transcripts**.
4. Click **Save**, then test each notification type from a separate student browser session.
5. In **Inbox → Tickets**, open a ticket, reply, and have the recipient reply to the email. The reply should return to the same ticket thread.

**For email ticket replies to a student or guardian, tawk.to requires a valid recipient email address.** The offline form includes required Name, Email and Message fields. In this children-facing application, use only a school-approved student or parent/guardian contact address, with appropriate school/guardian consent; do not require or transmit an address in the Northstar account database. A classroom alias can be used for the visitor name. No automated email is sent to students without an address supplied in the tawk.to form.

If you want two types of requests, create tawk.to Departments named **Subject Question** and **Site Problem**, and enable the Department field on both the Pre-Chat and Offline forms. This replaces the old in-app categories and bug log. Browser/page metadata available in tawk.to may be different from the old custom bug log; you can add a simple 'Which page has the problem?' field to the offline form.

Sources:
- https://help.tawk.to/article/adjusting-mail-notifications
- https://help.tawk.to/article/responding-to-offline-messages-via-ticketing
- https://help.tawk.to/article/how-to-respond-to-a-ticket
- https://help.tawk.to/article/using-the-offline-form

## 4. Security and AI policy

- Leave **AI Assist, Smart Reply and auto-reply agents disabled** for this initial integration. tawk.to's independent AI capabilities aren't guarded by our exam question/answer checker.
- Keep the widget enabled only for accounts authorised by your school's privacy policy. Review tawk.to's privacy terms and your school's consent/retention obligations before releasing it to students who are children.
- Northstar automatically shares the student account ID, teacher-registered display name, and username with tawk.to for secure session continuity and teacher identification. Students may enter additional information in tawk.to's own forms; minimise collection.
- Removing a student account from Northstar **does not automatically delete chat data in tawk.to**. Handle access/removal requests in the tawk.to Dashboard as well.
- The old `/teacher/inbox` UI is removed. Instead, use the **Support inbox** link for teachers, which opens the tawk.to dashboard.

## 5. What to do with old PostgreSQL chat tables

You do NOT need a new database schema for tawk.to. The old `db/002_chat.sql` migration is removed from the source because it isn't needed anymore. If you ran it earlier, its tables will still exist in Supabase; they will not be used by the new code.

**Optional, only when you've saved any old messages you need:** Run `db/003_retire_custom_chat_OPTIONAL.sql` in Supabase SQL Editor. It drops only the old `chat_*` tables; **this permanently deletes old custom messages, teacher presence and site-problem records**. Do not run it automatically. B1–B3 account, test, exam and results tables are untouched.

## 6. Test and deploy

On the latest repository:

```sh
npm test
npm run videos:check:offline
npm run build
npm run dev
```

Manual verification:

1. With no login, open the homepage: no tawk widget.
2. Sign in as a student, navigate to a Maths or Biology lesson: the tawk widget appears at bottom right, identified with the teacher-registered display name and username.
3. Sign in as teacher: the student widget is absent; the top navigation links to tawk.to's support dashboard.
4. Start a timed test: no widget on the question page. While it is running, return to the homepage in the same account: support remains unavailable until the deadline/submission.
5. Finish the test and navigate to a lesson: the widget is available again.
6. Test direct URL access to `/tests`, `/exams`, `/attempts/<id>`: the widget does not initialise there.
7. Send an offline form and a test ticket, verify you get email notifications, send an email ticket response and verify the recipient receives it. Check replies stay threaded.
8. Test two different student accounts in the same browser. Their tawk.to identity must be correctly isolated via Secure Mode.
9. Confirm Biology Watch videos still appear and that Maths/exam pages behave as before.

**Build limitations:** Node tests can run without deployment. Full Next.js build requires dependencies installed. Live Supabase, tawk.to sessions, email delivery and browser testing must be performed with your own configured accounts; this patch cannot confirm them remotely.
