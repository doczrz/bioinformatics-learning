# Local Python Environment Placeholder Design

## Goal

Add a reserved Local Python entry to the lower-left Environments section of the bilingual textbook UI without enabling code execution.

## User interface

The environment entries appear in this order:

1. Local R / 本地 R
2. Local Python / 本地 Python
3. SSH/HPC

The new entry uses the same subdued disabled-button treatment as the existing entries. Its status is `Later` in English and `后续开放` in Chinese. It must remain keyboard-readable but non-interactive.

## Data contract

Extend the environment identifier union with `local-python`. `FileContentStore.getCourse()` returns all three environments with `status: "reserved"`.

No MCP execution tool, Python interpreter discovery, filesystem access, package installation, credential handling, or connection dialog is added.

## Testing

Component tests must verify that Local Python is visible, correctly translated, and disabled in both languages. Content-store tests must verify that the course payload exposes `local-python` as reserved. Existing full test, build, and plugin-validation suites must continue to pass.

## Documentation

Update operator and learner-facing descriptions so version 1 consistently states that Local R, Local Python, and SSH/HPC are reserved interfaces only.
