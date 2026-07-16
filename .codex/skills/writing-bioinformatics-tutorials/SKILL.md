---
name: writing-bioinformatics-tutorials
description: Use when writing, rewriting, reviewing, translating, or publishing Bioinformatics Interactive Learning lessons for readers with high-school biology knowledge and no assumed bioinformatics or programming experience, including separate beginner-usability and domain-expert completeness audits.
---

# Writing Bioinformatics Tutorials

Create accurate, approachable, reproducible tutorials without skipping the author's approval gates. Treat high-school biology as the only prerequisite; introduce bioinformatics, statistics, Linux, R, and Python concepts before relying on them.

## Required references

At the start of the task, read both files completely:

- `references/tutorial-writing-standard.md`
- `references/review-and-media-checklist.md`

Use the writing standard while drafting and the checklist while auditing, translating, verifying, and publishing.

## Workflow

Follow these phases in order. Do not combine drafting, auditing, approval, and revision into one step.

### 1. Protect the workspace

1. Run `git status` and `git diff` before editing.
2. Identify pre-existing modified and untracked files.
3. Preserve unrelated user work. Do not overwrite, clean, stage, or commit it.
4. Confirm the requested lesson files and the repository's existing content format before writing.

### 2. Draft the Chinese tutorial

1. Treat the user's source text as teaching intent, not publication-ready wording.
2. Check scientific and historical claims against primary literature or official technical documentation when accuracy could be uncertain or time-sensitive.
3. Write the Chinese lesson using the tutorial standard.
4. Keep this draft local and uncommitted.
5. Do not write the English version yet.

### 3. Perform two separate audits

After the Chinese draft exists, freeze it. Perform both audits without editing the lesson and without letting one audit's conclusions anchor the other.

1. **Beginner audit:** review as a learner with only high-school biology. Identify unexplained prerequisites, logical jumps, misleading analogies, excessive density, and unusable checkpoints.
2. **Domain-expert audit:** review as a senior specialist in transcriptomics, single-cell and single-cell multiomics, and spatial omics. Identify scientific errors, missing concepts required by the declared scope, unsupported comparisons, incomplete experimental-to-computational handoffs, and important omissions that should be taught now or signposted for a later lesson.
3. Use the separate tables and stable `Bxx` and `Exx` issue IDs defined in the checklist.
4. Classify every issue as Required, Recommended, or Optional. Do not expand a lesson merely to display expertise; judge omissions against the lesson goal and the course roadmap.
5. Present both audits to the author and wait for decisions on every issue ID.

### 4. Apply only approved revisions

1. Change only the `Bxx` and `Exx` issue IDs the author approved.
2. Preserve explicitly rejected choices.
3. If revision reveals a new substantive improvement, add a new issue ID and request approval instead of applying it silently.
4. Repeat the audit when the approved changes materially alter the teaching sequence.

### 5. Finalize Chinese, then English

1. Finalize the Chinese lesson first.
2. Produce an English version with equivalent teaching intent, structure, examples, cautions, links, and media credits.
3. Prefer natural instructional English over sentence-by-sentence literal translation.
4. Resolve any parity gaps before release.

### 6. Verify and publish

Use the release checklist. At minimum, verify lesson metadata, bilingual pairing, links, media source and licence records, project tests, type checking, production build, and the rendered lesson when a browser preview is available.

If any required check fails, stop publication and report the failure. After all checks pass:

1. Inspect `git status`, `git diff`, and the exact intended file list again.
2. Stage explicit paths only. Never use blanket staging in a dirty workspace.
3. Confirm the staged diff excludes unrelated work.
4. Commit and push the approved lesson to the private `origin/master` branch without asking for a second confirmation when the author has already authorized direct publication.
5. Never change repository visibility unless the author gives a separate, explicit instruction.

## Hard gates

- “Audit and fix it” still means audit first, present stable IDs, and wait for approval before editing.
- A draft that appears beginner-friendly still requires both the learner audit and the independent domain-expert audit.
- Deadlines do not remove the approval, verification, licensing, or workspace-protection gates.
- Free or educational use does not make an image reusable; verify the original source and licence.
- Do not recreate or publish `docs/superpowers`, unrelated internal planning directories, or ignored development artifacts.

## Completion condition

The task is complete only when the approved Chinese and English lessons pass the release checks and the published commit contains exactly the authorized files. If the current request stops at drafting or auditing, stop at that phase and state what author decision is needed next.
