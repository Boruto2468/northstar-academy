# Northstar Academy — Integrated textbook upgrade

This package replaces the previous ZIP; copy its project contents into your existing checkout while preserving `.git` and any local environment files.

## Implemented

- Existing 10 Maths and 6 Biology topics and all 61 subtopics retained.
- Every Maths subtopic has its original worked example and levelled exercises, plus **two additional multi-step worked examples** and **16 additional intermediate/hard synthesis questions** with numerical variants and explicit solutions. Questions are selected with a recent-history guard.
- Every Biology subtopic has expanded mechanism, terminology, misconceptions and learning outcomes, plus evidence-based experimental interpretation questions.
- Six Biology topics each have a scientific structure plate with descriptive labels and a draggable / touch-select / keyboard-select labelling exercise.
- All six Biology topics have an interactive practical-investigation worksheet with numerical datasets, a plotted graph, controlled variables, 6-mark analysis and self-assessment rubric. Regenerate data for new trials.
- Existing detailed cell diagram, original interactive topic diagrams, progress storage, PWA and static GitHub Pages workflow retained.
- Fixed incorrectly escaped KaTeX source strings in topic registry.

## Scientific fidelity

The SVG scientific plates are **detailed educational schematics**, not micrographs or photographic plates; their proportions are not to scale. Do not represent them to students as microscope photographs. The investigation datasets are simulated for teaching purposes, not published experimental results. Student long-form answers use a transparent **self-marking rubric**, not an AI grading system.

## Verification

All TypeScript/TSX source files passed the TypeScript compiler's *syntax transpilation* check. A full `npm install` timed out because package registry access was unavailable; offline installation also failed due to missing cached dependencies. Therefore a production `npm run build` and interactive browser QA **could not be completed here**. Run these on your laptop before publishing. No changes were pushed to GitHub.

## Local installation

1. Back up or commit your current project.
2. Extract this ZIP and copy its `northstar-academy/` contents over your local project (do not overwrite `.git`).
3. `npm install`
4. `npm run dev` and review Maths + Biology topics, labelling, data exercises and navigation.
5. `npm run build` (this is required before deployment).
6. Commit and push after the build succeeds.

## Scope note

This is an integrated expansion across all topics. It is **not** a peer-reviewed, exhaustive published textbook or a substitute for real histology images. Teacher review of mathematical correctness and biological fidelity is recommended before classroom assessment.
