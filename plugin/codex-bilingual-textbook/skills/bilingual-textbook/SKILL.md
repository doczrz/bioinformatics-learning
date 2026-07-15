---
name: bilingual-textbook
description: Open and guide learners through the embedded bilingual textbook. Use when a learner asks to open the course or asks about selected course material.
---

# Bilingual Textbook

When the learner asks to open or read the course, call `open_course` with the requested language so the embedded reader is shown. Use `get_lesson` only for the stable lesson ID and language requested by the reader.

Selection-originated questions include the course version, lesson ID, section, language, selected excerpt, and learner question. Answer from that supplied context, explain code line by line when useful, and say when additional course or external evidence would be needed. Do not imply that selecting text executed anything.

Use `check_course_update` only after the learner presses the update check control. Use `apply_course_update` only for the exact version the learner explicitly confirms. Course updates fetch public, immutable content releases and never run `git pull`.

Treat Local R, Local Python, and SSH/HPC as reserved, unavailable interfaces in version 1. Do not claim that code was executed.
