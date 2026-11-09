# Northstar Academy — Phase 1 (A1 + A2)

## Scope
This replaces the existing Maths exercise/review flow. Biology routes, teacher admin,
backend, tests, exams, chat and video features are **not changed** in this phase.
B1–B5 are deferred until explicit approval.

## New/extended records

`GeneratedMathQuestion` includes:
- `id`, `seed`, `skillId`, `templateId`, `params`;
- `promptText`, `correctAnswer`, `acceptedForms`;
- `answerSpec` (kind, optional decimal places, significant figures and explicit tolerance);
- `commonWrongAnswers: {value, reason}[]`;
- `validatedSteps?: {label,prompt,correctAnswer,answerSpec}[]`;
- `hint`, `workedSolution`, `tier`.

`SavedQuestion` is an **immutable snapshot** with `seed`, `createdAt`, and the entire
question instance in `snapshot`. The snapshot is never reconstructed when a saved
set loads. Existing v4 section records are migrated once into v5 snapshots.

`QuestionResult` stores the exact input, wrong attempt count, completed/revealed flags,
first-attempt result, attempted step inputs and `submissions`.
Every submission stores `{input, verdict, at, attemptNo, stepIndex?}`.

`ReviewSnapshot` stores the exact `questions`, `results`, `startedAt` and `finishedAt`.
The current completed review is shown immediately after the last question is done;
up to three older reviews remain accessible in the section, subject to local-storage
space limitations.

## User experience
1. Students complete questions progressively. The last answer/revealed solution
   shows the review immediately, without another Finish click.
2. The review shows score, first-attempt correct count, elapsed wall-clock time,
   skill summary and every question's original prompt, exact submitted response,
   correct answer and result.
3. Recognised wrong answers show prewritten explanations. Other wrong answers
   link to the saved worked solution. No AI is used.
4. “Redo the ones I missed” generates fresh, globally unused variants of the same
   rule for every question not right on its first valid attempt.
5. A wrong **format** gives “Not in final form: finish simplifying” and does not
   increment the wrong-attempt count.
6. Two distinct hints precede the worked solution on the fourth wrong submission.
7. Steps are validated separately for hard compound-interest, area-bounds and
   factorising questions. Simultaneous equations and change-of-subject topics are not
   in the current 10-topic Maths catalogue; they have not been invented in Phase 1.

## Answer validity and accuracy
- Integer and reduced-fraction comparisons use exact integer arithmetic.
- Standard form uses an exact coefficient × power-of-ten comparison when no
  rounding tolerance is explicitly specified.
- Decimal-place and significant-figure questions enforce their typed precision.
- Algebraic and surd answers must satisfy a structural final-form gate before
  being compared for equivalence at multiple distinct assignments.
- Operations such as `2+2` are rejected as unfinished numeric answers.
- Numeric values 0 or 1 are accepted *only* when correct; they cannot both be
  universally rejected without penalising mathematically correct answers.
- Full question instances are used for all marking and reviews, including after reload.

## Tests
`npm run test:maths` runs:
- 45 templates × 500 independently recomputed questions (original generator suite);
- 45 templates × 500 answer-form/shortcut tests including deliberate random digits;
- uniqueness checks and targeted format / equation / step tests;
- review, exact input, fourth-attempt reveal and snapshot round-trip tests.

**149 automated tests passed** using Node.js 22 and the available source.
TypeScript and TSX syntax parsing was also checked.

### Not yet verified
`npm install` timed out in the build environment. Therefore the full Next.js
production build and browser-driven interaction checks **were not completed here**.
Run `npm install`, `npm run test:maths`, `npm run build`, and `npm run dev` locally.

## Suggested manual acceptance checklist
1. Correct an integer calculation using the raw `5^3` expression: it must show
   an invalid-form message and not count a wrong attempt. `125` must pass.
2. In a 2 d.p. question, `4.5` must be invalid if `4.50` is required.
3. Submit a recognised wrong answer to see the specific mistake, then an
   unrecognised answer to see a link to the worked solution.
4. Reload halfway through an exercise. Previously displayed questions and saved
   student inputs must not change.
5. Finish six questions and confirm the review appears immediately with per-question
   details. Redo missed items and verify new IDs and parameters.
6. For the challenging compound-interest, bounds-area and factorising items,
   complete both steps and the final response; invalid format must not consume
   an attempt.
7. Check past progress and Biology routes are still accessible.

## Upgrade instructions
Back up the existing project. Copy the entire replacement project's contents
into the local repo, keeping your `.git` directory. Then:

```bash
npm install
npm run test:maths
npm run build
npm run dev
```

Push only after your local test and build succeed.
