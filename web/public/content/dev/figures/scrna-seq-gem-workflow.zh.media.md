# Media record: scrna-seq-gem-workflow.zh.png

- Asset type: project-created, AI-assisted scientific diagram
- Generation tool: OpenAI image generation tool
- Generation date: 2026-07-16
- Language: Simplified Chinese
- Third-party image assets: none
- Vendor logos or proprietary layouts: none
- Manual edits after generation: none
- Targeted AI edit after approval: B09 only; panel 6 was revised on 2026-07-16 and copied unchanged into the project

## Approved targeted edit B09

- Source asset SHA-256: `F9B1525A6FAD8C2A2CF54C624EDB763A31F94CCCECF2A7479EAE2B3128605B08`
- Final asset SHA-256: `4DFBD054BC8689169FD699B1E28BF2154A8E6FD0030D6E58D7AF2AE2BC872EB7`
- Edit tool: OpenAI image generation tool
- Edit date: 2026-07-16
- Scope: panel 6 only; panels 1–5, the overall composition, palette, legend, and footer were to remain unchanged
- Requested correction: remove the clustering/UMAP-like graphic from the sequencer display and show the output sequence as `测序读段 / FASTQ` → `软件处理` → `表达矩阵（基因 × 细胞）`
- Review result: panel 6 now shows sequencing reads on the instrument display, explicitly inserts software processing before the expression matrix, and no longer implies that a sequencer directly produces a clustering plot
- Broader molecular-mechanism revisions proposed under E09 were not applied

### Targeted edit prompt

```text
Edit only stage 6, “测序与表达矩阵”, in the supplied approved Chinese infographic. Preserve stages 1–5 and every other visual element, label, color, position, legend, and footer unchanged.

Inside stage 6, remove the clustering/UMAP-like scatter plot from the sequencing instrument screen. Replace it with a clear visual of raw sequencing reads using short rows of A/C/G/T letters. Then make the output flow explicit and left-to-right: “测序读段 / FASTQ” → “软件处理” → the existing “表达矩阵（基因 × 细胞）”. Keep the Chinese typography crisp and exact. Do not add any logo, watermark, new scientific mechanism, or other text.
```

## Scientific references

- 10x Genomics. Getting Started: Single Cell 3′ Gene Expression. https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression
- 10x Genomics. Cell Ranger glossary. https://www.10xgenomics.com/support/software/cell-ranger/latest/resources/cr-glossary
- Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. https://doi.org/10.1038/ncomms14049

## Scientific and visual review

Reviewed on 2026-07-16 for the following points:

- six steps proceed from sample dissociation to a gene-by-cell expression matrix;
- the microfluidic stage shows cell suspension, barcoded gel beads, reagent, oil, empty droplets, and a doublet;
- the enlarged GEM is a water-in-oil partition containing one cell and one gel bead;
- poly(A) mRNA capture, poly(dT) primers, cell barcodes, and distinct UMI sequences are shown in the correct workflow position;
- cDNA is pooled and converted into a DNA sequencing library before sequencing;
- the figure contains no 10x Genomics logo and does not reproduce a 10x website figure or layout;
- supplied Chinese headings and legend text are legible;
- the figure is explicitly marked as a conceptual, not-to-scale illustration.

## Final generation prompt

```text
Use case: scientific-educational
Asset type: a high-resolution landscape infographic for a beginner Chinese bioinformatics web tutorial
Primary request: Create a polished, scientifically accurate, visually rich workflow explaining how a biological tissue sample becomes a traceable single-cell gene-expression matrix in a droplet-based 3′ single-cell RNA-seq experiment. The design must be independently composed and must not imitate any vendor's proprietary workflow figure.
Style/medium: premium modern biomedical editorial illustration, clean semi-isometric vector-like raster art, subtle depth, precise laboratory objects, elegant and approachable rather than childish
Composition/framing: 16:9 wide horizontal continuous story with six clearly separated but visually connected stages, large left-to-right arrows, generous spacing, readable at web-page width
Color palette: warm off-white background, deep navy text, teal and cobalt microfluidic elements, coral cells, amber gel beads, violet molecular tags; colorblind-friendly and high contrast

Show these six stages, with these exact Chinese headings and no other prose:
1 “样本解离” — a small tissue fragment becoming a clean single-cell suspension, several visually distinct intact cells
2 “计数与质控” — a counting chamber or automated cell counter assessing concentration, viability, debris and cell clumps
3 “微流控分隔” — a clear cross-junction chip receiving cell suspension, barcoded gel beads, reagent and oil, producing water-in-oil droplets; also show one empty droplet and one doublet off to the side as exceptions
4 “GEM 与分子标记” — a large magnified water droplet in oil containing exactly one intact cell and one gel bead; cell lyses, poly(A) mRNA is captured by bead-bound poly(dT) primers; show cell barcode shared within the partition and different random UMI tags on separate captured molecules
5 “逆转录与建库” — mRNA copied to labeled cDNA, emulsion broken, labeled cDNA pooled, amplified and turned into a sequencing library
6 “测序与表达矩阵” — sequencing instrument leading to a clear gene-by-cell heatmap matrix, with rows as genes and columns as cells

Include a small, clean legend using only these exact labels:
“细胞条形码：追踪分区”
“UMI：区分捕获分子”
“样本索引：区分文库”

Scientific constraints: barcode labels the GEM/partition, not a physical cell; UMI tags are random rather than sequential; the droplet is water-in-oil; do not imply every droplet contains a cell; do not show RNA entering a sequencer directly; sequencing reads a DNA library; do not imply the matrix measures all RNA without loss.
Text constraints: render all supplied Chinese text verbatim, with correct Chinese characters, large sans-serif typography; no extra pseudo-text, no garbled glyphs, no tiny captions.
Avoid: any 10x Genomics logo or trademark, vendor-branded instrument, copied proprietary layout, watermark, decorative DNA double helices, photorealistic humans, excessive gradients, black background, clutter, misleading scale.
Add only one small footer: “概念示意，非按比例”
```
