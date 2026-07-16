# Bioinformatics Interactive Learning

> An open-source bilingual interactive textbook for beginners in bioinformatics.

[中文](README.md) | [English](README.en.md)

Bioinformatics Interactive Learning aims to turn a bioinformatics course into an open project that can be continuously updated, freely accessed, and studied at each learner's own pace. It is not a collection of slides to watch passively. It is an interactive textbook that supports browser-based reading, whole-page language switching, code copying, and links to original data sources.

## Project status

This project is still at an early stage. The standalone bilingual textbook reader can already run locally, while the bundled content currently focuses on validating the reading and update workflows. The complete course is being written progressively.

During active development, I will aim to publish tutorial updates approximately every two to five days. The actual pace may vary with content review, experimental validation, and development work. The curriculum roadmap describes the intended scope; it does not mean that every chapter is already available.

Current boundaries:

- Whole-page Chinese/English switching, lesson navigation, Markdown, code blocks, images, and external data links are supported.
- The online course-content repository has not yet been configured, so “Check for updates” reports that status explicitly.
- Local R, Local Python, and SSH/HPC are reserved interfaces only. They cannot currently execute code or connect to a server.
- Reading the textbook does not require ChatGPT, a Codex plugin, or Biolearning Runner.

## Quick start

### Requirements

- Git
- Node.js 20 or later
- pnpm

### Run locally

```bash
git clone https://github.com/doczrz/bioinformatics-learning.git
cd bioinformatics-learning
pnpm --dir web install
pnpm --dir web dev
```

Vite will print a local address, usually similar to `http://localhost:5173/`. Open that address in a browser to start reading.

### Using the textbook

- Use the “中文 / English” controls at the top of the page to switch the whole page.
- Use the sidebar to move between lessons.
- Read Markdown content, figures, and code examples, and copy code when needed.
- Follow textbook links to the original sources of external datasets.
- Use “Check for updates” to look for newly verified course content.

The textbook does not automatically download datasets, run analysis commands, or upload selected text. When you have an analysis question, you can quote the relevant lesson, code, and error message when asking GPT or another AI assistant.

## Why I started this project

I first encountered single-cell sequencing and transcriptomics in March 2020. At the time, much of the online discussion focused on mining public data from TCGA or GEO, rapidly constructing groups and classifications, and turning the results into a so-called “pure bioinformatics” paper.

I followed that path while learning and tried many online analysis tools. In the hope of learning faster, I also ran into paid tools whose pricing and limitations were not transparent and whose value did not match their cost. Those experiences kept bringing me back to one question: could we build an interactive tutorial that goes beyond a traditional textbook, helps beginners avoid common traps, and makes the foundations of bioinformatics smoother and more systematic to learn?

That question became this project.

## The learning model I hope to support

Future textbooks and university courses do not have to depend entirely on large lectures and polished but static slide decks. A course can also be an open-source project that captures an educator's accumulated understanding, judgment, and practical experience, allowing more people to learn from that foundation and explore further.

Students can read, practise, and record questions at their own pace before meeting the instructor for a focused weekly question-and-answer session. Classroom time can then be used for discussion, correction, and genuinely difficult concepts instead of repeating one-way instruction.

My long-term goal is for this project to grow into a body of material substantial enough to support a university-level course. I also hope it gives other educators and course designers a useful example: teaching materials can be continuously maintained, knowledge can be corrected collectively, and learning can become more open and active.

## Curriculum roadmap

The planned curriculum progresses from foundational tools to spatial and multi-omics analysis:

1. **Computing foundations:** R, Python, Linux, and common bioinformatics data formats.
2. **Transcriptomics fundamentals:** the development of RNA-seq and single-cell RNA-seq; workflows from SRA/FASTQ to expression matrices; quality control, normalisation, and other essential steps.
3. **Single-cell downstream analysis:** cell clustering, grouping and annotation, cell-cell communication, functional enrichment, deconvolution, and other common analyses.
4. **Bulk and metabolomics workflows:** bulk RNA-seq, GO/KEGG enrichment analysis, and metabolomics workflows.
5. **Spatial and multi-omics:** spatial transcriptomics, spatial proteomics, spatial metabolomics, and their integrated analysis.

This roadmap will evolve with course development and community feedback. Each complete lesson should explain why a method works, when it is appropriate, and which mistakes are common—not merely provide code that can be copied and run.

## Contributing

No project maintainer can be an expert in every analysis method. If you have deep experience in 3D genomics, spatial omics, computational methods, or another area of bioinformatics, and you are willing to turn that experience into a reusable tutorial, you are welcome to help maintain this project.

You can contribute by:

- Reporting errors, outdated material, or unclear explanations through a GitHub Issue.
- Submitting a Pull Request that improves lessons, code examples, figures, or data sources.
- Proposing a new lesson or course collaboration in an Issue, including the topic, intended learners, and the material you would like to contribute.
- Sharing an interesting research or teaching project that may be suitable for collaboration.

Direct criticism and corrections are welcome when the textbook is wrong. For troubleshooting an individual analysis, please consult the textbook and the tool's official documentation first, and use an AI assistant such as GPT to help structure the question. The maintainer is not currently able to provide one-to-one analysis support through private messages.

## Build and deployment

Create and preview a production build:

```bash
pnpm --dir web typecheck
pnpm --dir web build
pnpm --dir web preview
```

The production files are written to `web/dist/` and can be deployed to any static host that supports HTTPS. For technical details about content releases, caching, and the future Runner boundary, see [`web/README.md`](web/README.md).

## Repository structure

```text
web/                         Standalone Vite/React textbook reader
web/public/content/dev/      Bilingual course content bundled with the webpage
src/codex_textbook/          Course validation and content-release tooling
datasets/                    Dataset catalogue and source metadata
```

## Feedback

If you have suggestions about the curriculum, learning experience, or project direction, please open a GitHub Issue. A good textbook should not be written once by one person; it should keep improving through use, questions, and shared correction.
