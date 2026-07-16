# Review, media, and release checklist

## Beginner audit

Audit the Chinese draft without editing it. Review from the perspective of a learner with high-school biology and no bioinformatics or programming background.

Use this exact table structure:

| ID | Priority | Beginner problem | Proposed improvement | Author decision required |
| --- | --- | --- | --- | --- |
| R01 | Required | ... | ... | Approve or reject |

Keep IDs stable across discussion. Continue with `R02`, `R03`, and so on; never renumber an existing issue after the author has responded.

Priority meanings:

- **Required:** A factual error, unsafe or unreproducible instruction, missing prerequisite, broken logical dependency, licensing problem, or ambiguity likely to cause an incorrect analysis.
- **Recommended:** The lesson is usable, but a beginner is likely to become confused, lose the workflow, or miss how to judge success.
- **Optional:** Enrichment, extra examples, or stylistic improvements that are not necessary for the stated learning goal.

Check whether:

- the lesson states a clear learning goal and prerequisite knowledge;
- every essential term is defined before use;
- each major step explains why it exists and where it sits in the workflow;
- inputs, outputs, success criteria, and interpretation are visible;
- analogies include their limits;
- history supports understanding rather than interrupting it;
- commands and code are explained at a beginner level;
- common failures have actionable first checks;
- scientific claims and citations are accurate;
- the learner has a checkpoint before moving on;
- the amount of detail matches the lesson goal.

After the table, ask the author to approve or reject issue IDs. Do not edit until the response arrives.

## Media selection and licence record

Use media in this preference order:

1. an original diagram created for the project;
2. public-domain or CC0 material;
3. CC BY material with attribution;
4. other clearly reusable material only when its terms fit the project.

Avoid NoDerivatives material when cropping, translating, annotating, or otherwise adapting it. Avoid NonCommercial material unless the licence has been reviewed for this project's actual distribution and downstream reuse. A free, non-profit project does not by itself grant permission.

Google Images may be used only to discover candidates. Open the original hosting page and verify the licence there. Never infer permission from a search thumbnail, repost, or missing copyright notice.

Record for every third-party item:

- title or short description;
- creator or organization;
- original source URL;
- licence name and licence URL;
- access date;
- modifications, including cropping, translation, labels, or color changes.

For original project diagrams, record that they are project-created and list the source data or scientific references used to design them.

## Bilingual parity

Before release, compare the Chinese and English files for matching:

- section order and learning goals;
- examples, commands, warnings, and checkpoints;
- links, citations, figures, captions, and credits;
- statements of uncertainty and limitations.

Natural English wording is expected; teaching meaning must remain equivalent.

## Release checks

Run checks appropriate to the repository and record their results:

- front matter or lesson metadata is valid;
- both language files are present and discoverable through the course index;
- local assets exist and render;
- external links and cited sources resolve;
- media records and licence obligations are complete;
- project tests pass;
- type checking passes;
- the production build succeeds;
- the lesson is visually inspected in the application when a browser preview is available.

Before committing:

1. Run `git status` and inspect unstaged and staged diffs.
2. Stage the exact approved paths, not `git add .` or another blanket pattern.
3. List staged filenames and confirm every one belongs to the approved lesson or its required project metadata.
4. Confirm pre-existing user modifications remain unstaged and unchanged.
5. Stop if any unexpected file is staged or any required check failed.
