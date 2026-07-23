# computational-environment-layers.zh.png

- Status: Approved Chinese course media.
- Type: Project-original AI-assisted educational diagram.
- Generation tool: OpenAI built-in image generation tool.
- Generation date: 2026-07-23.
- Manual edits: None. The generated PNG was copied without alteration.
- Third-party images, screenshots, logos, or proprietary layouts: None.

## Final prompt

```text
Use case: scientific-educational
Asset type: landscape lesson figure for a beginner bioinformatics textbook
Primary request: Create a clean Chinese educational diagram explaining the layered structure of a computational environment and why installing R or Python alone is not enough.
Scene/backdrop: light warm-cream classroom handout background, no border texture.
Subject: A centered vertical stack of six wide rounded layers connected by clear upward arrows. From bottom to top, render these exact labels verbatim: "计算机硬件", "Linux / Windows / macOS", "R / Python", "项目环境", "软件包与依赖", "分析脚本与数据". Add the exact title at the top: "一段代码要运行，需要这些层彼此匹配". From the "项目环境" layer, branch to two small separate rounded boxes labeled exactly "项目 A" and "项目 B", with a short label between or below them exactly "互不干扰". Use small generic icons only: computer chip, operating-system window/terminal, R/Python code brackets without logos, folder, package blocks, document plus data table. Show that each upper layer depends on the layer beneath it; arrows must be unambiguous.
Style/medium: polished flat vector-like scientific infographic, consistent line weight, simple geometric icons, high-school learner friendly.
Composition/framing: 3:2 landscape, generous whitespace, large readable Chinese typography, clear visual hierarchy, no tiny footnotes.
Color palette: deep navy text, teal and muted blue main layers, one restrained coral accent, warm cream background; accessible contrast.
Text (verbatim): "一段代码要运行，需要这些层彼此匹配", "计算机硬件", "Linux / Windows / macOS", "R / Python", "项目环境", "软件包与依赖", "分析脚本与数据", "项目 A", "项目 B", "互不干扰".
Constraints: render every label exactly once and legibly; scientifically and technically plausible; independent original composition; no vendor logos, no copied software interfaces, no screenshots, no trademarks, no DNA helix decoration, no invented labels, no watermark.
```

## Technical references used to constrain the diagram

- https://docs.python.org/3/library/venv.html
- https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html
- https://rstudio.github.io/renv/articles/renv.html
- https://bioconductor.org/install/

## Manual verification

- All requested labels are present exactly once and are legible.
- The six layers are ordered from hardware and operating system through language runtime, project environment, packages, and analysis.
- Dependency arrows point from lower supporting layers toward upper consuming layers.
- Project A and Project B visibly branch from the project-environment layer and are labeled as non-interfering.
- No vendor logo, screenshot, watermark, invented component, or misleading biological element is present.
