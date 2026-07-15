---
name: bilingual-textbook
description: Use when a user opens, studies, navigates, validates, or updates this Codex-native bilingual textbook; switches the whole course between Chinese and English; asks about a lesson, code block, figure, source, or external dataset; or records local learning progress.
---

# Bilingual Textbook

Use the repository as the textbook UI. Use Codex native conversation for every question; do not create a custom chat surface.

## Open and navigate

1. Read `course-manifest.yml` and `OPEN_COURSE.md`.
2. Use an available Python runtime. If `codex_textbook` cannot be imported, run `<python> -m pip install -e <project-root> --no-deps` once.
3. Invoke UI commands as `<python> -m codex_textbook.cli --root <project-root> <command>`; use `course-tool` only when it is already on `PATH`.
4. If `START_HERE.md` or `COURSE_STATUS.md` is missing, run the `init` command.
5. Open `START_HERE.md`. Follow `.course-state/preferences.json` when it contains a saved whole-page language preference.

Run `set-language zh|en` only when the user asks to switch the whole textbook. Run `set-progress <lesson-id> not_started|in_progress|completed` only when the user explicitly asks to record progress; opening a page never means completion.

## Answer questions

Read the cited lesson and the minimum adjacent code, figure caption, dataset entry, and linked-source context needed to answer. Let the user quote or paste any text and ask freely.

## Handle datasets and updates

Read `datasets/CATALOG.md` and `datasets/catalog.yml`. Explain the source, sizes, license, checksum, and shown download command. Version 1 never downloads a dataset.

Run `course-tool --root <project-root> check-update` to inspect changes. Run `apply-update --confirm-version <exact-version>` only after the user explicitly approves that exact version.

## Version 1 safety boundary

- Do not run R, Python analysis, Linux analysis commands, Cell Ranger, or schedulers.
- Do not connect to SSH or request server credentials.
- Do not overwrite `.course-state/`, `my-notes/`, or downloaded data.
