# Review, media, and release checklist

## Beginner audit

Audit the Chinese draft without editing it. Review from the perspective of a learner with high-school biology and no bioinformatics or programming background.

Use this exact table structure:

| ID | Priority | Beginner problem | Proposed improvement | Author decision required |
| --- | --- | --- | --- | --- |
| B01 | Required | ... | ... | Approve or reject |

Keep IDs stable across discussion. Continue with `B02`, `B03`, and so on; never renumber an existing issue after the author has responded.

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

## Domain-expert completeness audit

Audit the same frozen Chinese draft independently and without editing it. Review as a senior specialist in transcriptomics, single-cell and single-cell multiomics, and spatial omics. Evaluate the lesson against its declared goal and position in the course; do not demand that every lesson become a comprehensive review article.

Use this exact table structure:

| ID | Priority | Expert gap | Why it matters | Proposed addition or deferral | Author decision required |
| --- | --- | --- | --- | --- | --- |
| E01 | Required | ... | ... | ... | Approve or reject |

Keep `Exx` IDs stable and separate from beginner-audit IDs. Check whether:

- the scientific and historical claims are accurate, current enough for the lesson, and supported by primary or official sources;
- the stated scope omits any prerequisite concept needed to understand the biological question, assay, data, or interpretation;
- the causal chain from sample collection and preparation through assay chemistry, sequencing files, preprocessing, and analysis outputs is complete;
- platform or method comparisons state the relevant sample types, assay versions, tradeoffs, and evidence limits;
- important sources of bias are covered or explicitly deferred, including dissociation effects, cell versus nucleus assays, ambient RNA, doublets, low-RNA cells, batch effects, and cell-calling choices when relevant;
- experimental design, biological replication, sample metadata, multiplexing, controls, and independent biological validation are covered or signposted when the lesson relies on them;
- multiomic or spatial claims distinguish measured modalities, resolution, capture efficiency, and what cannot be inferred;
- the lesson clearly hands off to later computational steps without implying that one software package completes the entire analysis;
- an omission belongs in the current lesson, needs only a one-sentence signpost, or should be assigned to a named later lesson.

After both audit tables, ask the author to approve or reject `Bxx` and `Exx` IDs. Do not edit until the response arrives. If the author rejects an issue, preserve that decision and do not reintroduce the same change under a new ID.

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

Project-created diagrams may be drawn manually or generated with an image-generation model. For a generated diagram:

- write a scientifically constrained prompt rather than asking the model to imitate a vendor's proprietary figure;
- avoid vendor logos, copied layouts, screenshots, watermarks, and trademark-like branding;
- manually verify every depicted step, label, molecule, direction, and platform-specific claim against primary literature or official documentation;
- reject and regenerate any image with unreadable text, invented components, incorrect geometry, or misleading biological scale;
- record the generation tool, generation date, final prompt, scientific references, and any manual edits in the figure credit or media record.

Do not copy a vendor's website figure into the repository unless its licence explicitly permits redistribution or written permission has been obtained. When permission is absent, link to the official page for reference and create an independently designed project diagram from verified scientific facts.

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
