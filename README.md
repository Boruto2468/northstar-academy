# Northstar Academy — Year 10 (2026/27, Term 1)

Next.js 15, TypeScript, Tailwind. Mathematics uses rule-by-rule textbook chapters; the Biology experience is retained.

## Develop
```bash
npm install
npm run dev
```

## Validate before deployment
```bash
npm run test:maths
npm run build
```
The Maths test suite independently recomputes **500 questions for each of 46 templates** (23,000 random mathematical cases), checks that the question fields consistently derive from one parameter object, and tests six-question non-repeating sets.
The test runner requires **Node.js 22+** because it reads TypeScript using Node's built-in type stripping.

## Maths lesson pattern
Every one of the ten Maths topics has its own sections for each rule or skill. Each section includes a KaTeX formula, teacher notes, tap-to-reveal generated worked examples, and a six-question set progressing from foundation to two-stage and contextual problems. Each question is generated once as `{id, params, promptText, correctAnswer, acceptedForms, hint, workedSolution}`. All components come from the same parameters. Reloading restores existing questions rather than reshuffling them.

The first recommended section to review against the attached textbook is **Maths → Indices and standard form**. Its sequence follows Section 1.2 (evaluate powers, product law, quotient law, power of a power, zero, negative and fractional indices) and Section 1.3 (standard form). Exercises and language are newly authored rather than transcribed.

## No-repeat policy
New question IDs, parameter signatures and worked-example IDs are stored in `localStorage` under `northstar-maths-used-v4`. A fresh exercise set rejects repeated parameters and equivalent answers within that set. If storage fails or unique questions are exhausted, the app displays an error instead of silently repeating a question. Saved in-progress sets are restored after refresh. Guarantees apply **within the same browser profile and persistent site storage**; cleared storage, private windows or another device cannot share that history without a backend/account.

## Feedback and progress
Only one new exercise is revealed at a time. On a correct answer the building-block animation appears, followed by a Next question button. Attempts one and two show different hints, attempt three asks the learner to review their method, and the fourth incorrect attempt reveals the solution. First-try accuracy and time taken are summarised after the last question. Existing topic-level progress storage is preserved. The Maths keypad and Simple / Intermediate / Hard selector are removed.

## GitHub Pages
Push to `main`; under Settings → Pages select GitHub Actions. The deploy workflow runs Maths generator tests before the static Next.js build. The workflow accepts either a checked-in `package-lock.json` or a project without one.

## Source reference
*Mathematics Year 10 Book One*, Ministry of Education, Sports and Culture (Sāmoa), Section 1.2 “Applying the Laws of Exponents” (printed pp. 6–16), and 1.3 “Writing in Standard Form” (pp. 17–20). This textbook models the chapter sequence; other Maths topics follow Northstar's existing curriculum objectives.
