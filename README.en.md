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
- Reading the textbook does not require ChatGPT or a Codex plugin; the webpage itself does not execute R, Python, or SSH commands.

## Quick start

The steps below use Windows 10/11 and are written for readers who have never used a command line. Enter each command separately in Command Prompt and press `Enter`. If a tool is already installed, you can skip its installation step.

### Requirements

- [Git](https://git-scm.com/install/windows), used to download the project from GitHub.
- [Node.js](https://nodejs.org/en/download) 20.19.0–20.x, or 22.12.0 and later, used to run the web development tools. For a new installation, choose the current LTS (Long-Term Support) release.
- [pnpm 10.24.0](https://pnpm.io/10.x/installation), used to install dependencies and start the website. This project pins that version.

### Windows: first-time setup

#### 1. Open Command Prompt

1. Press the `Win` and `R` keys together.
2. Enter `cmd` in the Run window.
3. Press `Enter` to open the black Command Prompt window.

Run all commands below in that window, not in a browser address bar. Do not copy the prompt before a command, such as `C:\Users\your-name>`. After installing a new tool, close the old Command Prompt window and open it again so that Windows can find the new command.

#### 2. Install and check Git

1. Open the official [Git for Windows download page](https://git-scm.com/install/windows). Most Windows computers use the x64 installer; Windows on Arm devices use ARM64.
2. Run the downloaded installer. The default options are suitable for this project.
3. Open a new Command Prompt window and run:

```bat
git --version
```

Git is ready if the output begins with something similar to `git version 2.x.x`.

#### 3. Install and check Node.js

1. Open the official [Node.js download page](https://nodejs.org/en/download).
2. Select the current LTS release and the Windows Installer (`.msi`). This project supports Node.js 20.19.0–20.x, or 22.12.0 and later.
3. Run the installer with its default options. npm is installed together with Node.js; when installation finishes, open a new Command Prompt window.
4. Run these commands one at a time:

```bat
node --version
npm --version
```

The first result should show a supported version, such as `v24.18.0`. If you use Node.js 20, it must be at least `v20.19.0`; if you use Node.js 22 or later, it must be at least `v22.12.0`. The second command should show the npm version.

#### 4. Install and check pnpm

After Node.js is installed, run:

```bat
npm install --global pnpm@10.24.0
pnpm --version
```

The first command downloads pnpm and may take a little time. The second should print `10.24.0`. If Windows still reports that `pnpm` is not recognized, close Command Prompt, open it again, and rerun `pnpm --version`.

### Run locally

The following example downloads the project to the current user's folder (usually similar to `C:\Users\your-name`). Run one line at a time in Command Prompt:

```bat
cd /d "%USERPROFILE%"
git clone https://github.com/doczrz/bioinformatics-learning.git
cd bioinformatics-learning
pnpm --dir web install
pnpm --dir web dev
```

You only need to run `git clone` when downloading the project for the first time. You normally need `pnpm --dir web install` only on the first run or after the dependencies change. After `pnpm --dir web dev` starts, Command Prompt remains occupied and Vite prints a local address, usually `http://localhost:5173/`. Copy that address into Chrome, Edge, or another browser to start reading. Keep Command Prompt open while reading; press `Ctrl+C` in that window when you want to stop the website. If Windows asks whether to terminate the batch job, enter `Y` and press `Enter`.

If the project is already in a different folder, skip `git clone` and replace the example path below with the actual project location:

```bat
cd /d "C:\path\to\bioinformatics-learning"
pnpm --dir web dev
```

If `git`, `node`, or `pnpm` is reported as an unrecognized command, open a new Command Prompt window and rerun the corresponding version check. If Vite uses a port other than `5173`, open the address that Command Prompt actually displays.

### Open the textbook again later

After the first installation, Git, Node.js, pnpm, and the downloaded project remain on your computer. You do not need to install them again or rerun `git clone`. Each time you want to read the textbook:

1. Press `Win+R`, enter `cmd`, and press `Enter`.
2. Run these commands one line at a time:

```bat
cd /d "%USERPROFILE%\bioinformatics-learning"
pnpm --dir web dev
```

3. Wait for Command Prompt to display the `Local:` address, then copy that address into your browser.
4. Keep Command Prompt open while reading and press `Ctrl+C` when you want to stop the server.

If the project is not stored in the default location, replace the path in the first command with its actual location. You do not need to rerun `pnpm --dir web install` merely to continue reading.

To download the latest program and textbook content published on GitHub before starting the website, run:

```bat
cd /d "%USERPROFILE%\bioinformatics-learning"
git pull
pnpm --dir web install
pnpm --dir web dev
```

If `git pull` prints `Already up to date.`, the local copy is already current. Running `pnpm --dir web install` after an update ensures that any added or changed project dependencies are installed.

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

The production files are written to `web/dist/` and can be deployed to any static host that supports HTTPS. For technical details about content releases, caching, and the webpage execution boundary, see [`web/README.md`](web/README.md).

## Repository structure

```text
web/                         Standalone Vite/React textbook reader
web/public/content/dev/      Bilingual course content bundled with the webpage
src/codex_textbook/          Course validation and content-release tooling
datasets/                    Dataset catalogue and source metadata
```

## Licenses

This repository licenses software and original educational material separately:

- Source code, build configuration, release tooling, authoring templates, and
  technical documentation are licensed under the [MIT License](LICENSE). This
  includes software and tooling under `src/`, `web/src/`, `ui/`, and
  `.codex/skills/`.
- Project-original lesson text, course metadata, and educational figures are
  licensed under [CC BY-SA 4.0](LICENSE-CC-BY-SA-4.0). This primarily covers
  `web/public/content/dev/lessons/`, `web/public/content/dev/figures/`, and
  project-original course catalogue information.
- Project-authored executable code blocks in lessons are additionally
  available under the MIT License unless stated otherwise beside the code.

These licenses cover only material that project contributors have the right to
license. Third-party software, cited publications, external websites, external
datasets, trademarks, logos, and third-party material identified in a file,
caption, or media record remain subject to their own terms. Linking to or
citing a resource does not relicense it. A more specific notice in a file,
caption, or media record takes precedence.

When sharing or adapting material covered by CC BY-SA 4.0, a suggested credit
is:

> Bioinformatics Interactive Learning, doczrz and contributors,
> https://github.com/doczrz/bioinformatics-learning, CC BY-SA 4.0.

Include a link to the license and indicate whether changes were made. Adapted
course material must remain under CC BY-SA 4.0 or a compatible license.

## Feedback

If you have suggestions about the curriculum, learning experience, or project direction, please open a GitHub Issue. A good textbook should not be written once by one person; it should keep improving through use, questions, and shared correction.
