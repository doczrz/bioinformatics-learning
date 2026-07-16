# Media record: scrna-seq-gem-workflow.en.png

- Asset type: project-created, AI-assisted scientific diagram; English-localized counterpart of the approved Chinese project diagram
- Edit tool: OpenAI image generation tool
- Edit date: 2026-07-16
- Language: English
- Source asset: `scrna-seq-gem-workflow.zh.png`
- Source asset SHA-256: `4DFBD054BC8689169FD699B1E28BF2154A8E6FD0030D6E58D7AF2AE2BC872EB7`
- Final asset SHA-256: `6A773819E56EDC701D135212F2324C0624029BB3716C2641D22962B0EF3F4CEB`
- Third-party image assets: none
- Vendor logos or proprietary layouts: none
- Manual edits after generation: none; the approved generated PNG was copied unchanged into the project
- Edit scope: text localization only; the six-panel scientific composition and the approved panel-6 output flow were preserved
- Rejected scope preserved: no broader molecular-mechanism changes proposed under E09 were introduced

## Scientific references

- 10x Genomics. Getting Started: Single Cell 3′ Gene Expression. https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression
- 10x Genomics. Cell Ranger glossary. https://www.10xgenomics.com/support/software/cell-ranger/latest/resources/cr-glossary
- Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. https://doi.org/10.1038/ncomms14049

## Scientific and visual review

Reviewed on 2026-07-16 for the following points:

- all visible instructional text is in English, with no residual Chinese or invented glyphs;
- the six panels, arrows, scientific objects, colors, and legend symbols preserve the approved Chinese diagram's teaching sequence;
- panel 6 shows raw nucleotide reads and the explicit sequence `Sequencing reads / FASTQ` → `Software processing` → `Expression matrix (genes × cells)`;
- the sequencer does not display a clustering or UMAP plot;
- panels 1–5 retain the approved diagram's scientific meaning and do not introduce the rejected E09 changes;
- the figure contains no 10x Genomics logo and does not reproduce a 10x website figure or layout;
- the footer explicitly marks the figure as a conceptual, not-to-scale illustration.

## Final localization prompt

```text
Use case: text-localization
Asset type: bilingual bioinformatics tutorial scientific-educational infographic, English-language counterpart
Input image: Image 1 is the edit target.

PRIMARY REQUEST
Translate and replace ONLY the visible Chinese text in Image 1 with clear, accurately spelled English. This is a pure text-localization edit. Preserve the source image's six-panel layout, exact scientific illustrations, all objects, shapes, positions, arrows, panel borders, spacing, colors, proportions, visual hierarchy, and the panel-6 data relationship exactly. Do not redraw, reinterpret, add, delete, or move any scientific mechanism, object, icon, arrow, panel, or legend symbol.

RENDER THESE STRINGS VERBATIM
Panel headings:
1 "Sample dissociation"
2 "Counting & QC"
3 "Microfluidic partitioning"
4 "GEM & molecular labels"
5 "Reverse transcription & library preparation"
6 "Sequencing & expression matrix"

Panel 2 instrument labels:
"Concentration"
"1.23 × 10⁶ cells/mL"
"Viability"
"94.1%"
"Debris"
"2.3%"
"Cell clumps"
"0.6%"

Panel 3 inlet labels, left to right:
"Cell suspension"
"Barcoded gel beads"
"Reagents"
"Oil"
Exception inset:
"Exceptions"
"Empty droplet"
"Doublet"

Panel 4 labels:
"Oil phase"
"poly(A) mRNA"
"Gel bead"
"(with poly(dT) primers)"
"Cell barcode"
"UMI"
Keep the three existing example UMI nucleotide strings exactly as sequence examples, with no fake letters.

Panel 5 process labels:
"Reverse transcription: mRNA → barcoded cDNA"
"Break emulsion: recover barcoded cDNA"
"Pool cDNA from all partitions"
"Amplify"
"Build sequencing library"

Panel 6 process flow:
"Sequencing reads / FASTQ"
↓
"Software processing"
↓
"Expression matrix (genes × cells)"
Matrix column labels:
"Cell 1"  "Cell 2"  "Cell 3"  "…"  "Cell M"
Matrix row labels:
"Gene 1"
"Gene 2"
"Gene 3"
"Gene 4"
"⋮"
"Gene N"
Keep the sequencer screen showing raw nucleotide sequencing reads, not a clustering plot.

Bottom legend, left to right:
"Cell barcode: tracks partitions"
"UMI: distinguishes captured molecules"
"Sample index: distinguishes libraries"

Footer:
"Conceptual illustration, not to scale"

TYPOGRAPHY
Use clean, highly legible English sans-serif typography matching the original navy headings and label hierarchy. Resize only the English text within its existing label area when necessary for fit. Every English word must be readable and correctly spelled; render no pseudo-text, stray characters, duplicated letters, or leftover Chinese.

STRICT INVARIANTS
Change text only. Preserve panels 1–6, all scientific drawings, exact object count, exact relative position and scale, arrows, palette, backgrounds, borders, legend icons, GEM illustration, droplet exception inset, and panel-6 reads/FASTQ → software processing → expression matrix flow. Do not implement any broader scientific/mechanism correction. Do not alter the emulsion, gel bead, molecular labels, reverse-transcription, pooling, amplification, or library-preparation imagery. No logo, no brand mark, no watermark, no citation, no decorative additions, and no clustering/UMAP plot.
```
