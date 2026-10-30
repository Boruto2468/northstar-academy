# Maths topic completion checklist

**All 10 topics are implemented in the replacement.** Each rule/skill has a KaTeX rule, teacher-written notes, parameter-generated worked examples with revealable steps, and a six-question exercise with increasing complexity.

| Topic | Sections | Skills covered | Status |
|---|---:|---|---|
| Indices and standard form | 10 | Section 1.2: laws, negative/fractional indices and calculator use; Section 1.3: standard form | Implemented |
| Decimals | 4 | Recurring decimals, significant figures, decimal places, estimation | Implemented |
| Special numbers | 3 | Prime factor form, HCF, LCM | Implemented |
| Surds | 3 | Exact surds, simplification, rationalising denominators | Implemented |
| Fractions | 5 | Compare/order, fraction of a quantity, addition/subtraction, multiplication/division, mixed forms | Implemented |
| Percentages | 6 | Percentage of, percentage as, changes, reverse changes, successive changes, interest/depreciation | Implemented |
| Ratio and proportion | 4 | Simplifying, sharing, direct proportion, unit/time/rate problems | Implemented |
| Degree of accuracy | 2 | Interval bounds, calculation bounds | Implemented |
| Sets and Venn diagrams | 4 | Notation, complements/subsets, two-set problems, probabilities | Implemented |
| Algebraic manipulation | 5 | Collecting, one bracket, common factor, two brackets, quadratics | Implemented |

**Verification:** 46 rule templates × 500 random questions = **23,000 oracle comparisons**, plus 46 unique-set tests and one cross-topic semantic-duplicate test (93 tests total). The independent oracle is implemented in `tests/math-generator.test.mjs`. The tests validate question answers and parameter determinism; they are not a substitute for a full Next.js production build or manual classroom review.

**Important limitation:** browser `localStorage` does not synchronise between browsers/devices and can be cleared. The uniqueness guarantee holds within a single browser profile while that data remains available.

**Book basis:** *Year 10 Mathematics Book One*, §1.2 and §1.3. Other Northstar Maths objectives supply skills beyond the attached textbook.
