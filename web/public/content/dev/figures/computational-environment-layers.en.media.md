# computational-environment-layers.en.png

- Status: Approved English course media.
- Type: Project-original AI-assisted text-localized educational diagram.
- Generation tool: OpenAI built-in image generation tool.
- Generation date: 2026-07-23.
- Input image: `computational-environment-layers.zh.png`, used as the edit target.
- Manual edits: None. The generated English PNG was copied without alteration.
- Third-party images, screenshots, logos, or proprietary layouts: None.

## Final localization prompt

```text
Use case: text-localization
Asset type: English edition of a beginner bioinformatics textbook figure
Input images: Image 1 is the edit target and approved Chinese infographic.
Primary request: Replace only the Chinese text in Image 1 with the exact English text below. Preserve the entire composition, geometry, hierarchy, arrows, icons, colors, borders, spacing, background, and aspect ratio.
Text replacements (verbatim):
"一段代码要运行，需要这些层彼此匹配" -> "A Script Runs Only When These Layers Match"
"分析脚本与数据" -> "Analysis Scripts and Data"
"软件包与依赖" -> "Packages and Dependencies"
"项目环境" -> "Project Environment"
"计算机硬件" -> "Computer Hardware"
"项目 A" -> "Project A"
"项目 B" -> "Project B"
"互不干扰" -> "Isolated"
Keep these existing labels unchanged and verbatim: "R / Python" and "Linux / Windows / macOS".
Typography: use the same bold, highly legible dark-navy sans-serif style and visual hierarchy as the source; resize text only as necessary to fit cleanly inside the existing boxes.
Constraints: change only the text; keep every shape, connector, icon, arrow direction, position, color, and proportion unchanged; render every English label exactly once; no extra words, no logos, no watermark, no new elements.
```

## Technical references

- https://docs.python.org/3/library/venv.html
- https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html
- https://rstudio.github.io/renv/articles/renv.html
- https://bioconductor.org/install/

## Manual verification

- All requested English labels are present exactly once and are legible.
- The source layout, layer order, arrows, icons, colors, and project branches are preserved.
- Project A and Project B remain visibly separated from the project-environment layer and are labeled as isolated.
- No vendor logo, screenshot, watermark, invented component, or extra label is present.
