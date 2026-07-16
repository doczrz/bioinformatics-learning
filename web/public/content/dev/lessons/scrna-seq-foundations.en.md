# Chapter 1 | How Does Single-Cell RNA Sequencing Work?

Imagine a glass of juice made by blending several kinds of fruit. A test can tell you how sweet the juice is, but it cannot easily tell you whether most of that sweetness came from apples or from a small number of very sweet grapes.

A tissue sample presents a similar problem. A tumor, a drop of blood, or a small piece of brain tissue often contains many kinds of cells. If we measure all their RNA together, we can see changes in the sample as a whole. However, we may miss rare cells, and we cannot easily tell which type of cell produced a particular change.

Single-cell RNA sequencing (scRNA-seq) addresses this problem with one central idea: **before RNA from different cells is pooled for sequencing, give each cellular source a traceable label.**

We will not run any software in this chapter. For now, we will build one clear line of reasoning:

> biological sample → individual cells → label each RNA source → sequencing → gene-by-cell expression matrix


## Before You Begin, Remember Just Four Things

- A **cell** is a basic unit of life. Cells in the same tissue are not necessarily identical.
- **DNA** stores relatively stable genetic information. The RNA produced from a gene can provide a clue as to whether that gene is being used.
- For now, you can think of **RNA** as a temporary “working copy” made from DNA. When RNA from a gene is easier to detect, that gene is usually more active in the cell, but this is not a perfectly exact one-to-one relationship.
- The **transcriptome** is the complete set of RNA that can be observed in a sample at a particular moment. It is more like a snapshot of current activity than a permanent identity card for a cell.

If these four statements make sense, you know enough to continue.

The routine single-cell gene-expression workflows discussed in this chapter mainly measure poly(A)-tailed mRNA molecules that the experiment successfully captures. They do not count every kind of RNA in a cell equally. The final counts are shaped by RNA production, RNA degradation, and experimental capture efficiency. They therefore estimate how many mRNA molecules were still present and captured at a particular moment; they cannot be read directly as a gene's transcription rate.

## 1. Why Not Measure One Tube of Mixed RNA?

Suppose a sample contains 90 type A cells and 10 type B cells. An inflammation-related gene is highly expressed only in type B cells. If all 100 cells are measured together, that signal is averaged across the sample. A researcher may see that “the sample contains some inflammatory RNA” without knowing which type of cell produced it.

Single-cell RNA sequencing lets us ask different questions:

- What kinds of cells might be present in this sample?
- Which genes tend to be active in the same group of cells?
- Do a small number of cells have an unusual state?
- Which cell type is affected by disease, treatment, or change over time?

The result is commonly stored in a gene-by-cell table. For example:

| Gene | Cell 1 | Cell 2 | Cell 3 |
| --- | ---: | ---: | ---: |
| Gene A | 8 | 0 | 1 |
| Gene B | 0 | 6 | 5 |
| Gene C | 2 | 1 | 0 |

Each column represents a candidate cell, and each row represents a gene. Here, a **candidate cell** is a barcode that software judges likely to have come from a partition containing a cell. It does not guarantee that the partition contained exactly one intact cell.

The meaning of the numbers in the matrix depends on the experimental method. In 10x and other UMI-based workflows, a value is usually the UMI count for one gene under one barcode—a technical estimate of the number of captured molecules. Smart-seq2 does not use UMIs, so its matrix may instead contain the number of sequencing reads (a read count) or abundance values calculated from reads. A later lesson on data preprocessing will explain the differences among read counts, UMI counts, and normalized values.

One idea is essential from the beginning: **these numbers are technical measurements, not a lossless inventory of all RNA inside a cell.** RNA may degrade during sample handling or fail to be captured, and low-abundance RNA may be missed through sampling. A zero can therefore mean that a gene was not expressed, but it can also mean that its RNA was simply not detected in this experiment.

Dissociation-based scRNA-seq has another boundary: when tissue is separated into individual cells, the cells usually lose their original spatial coordinates. A clustering plot shown later represents similarity in expression patterns, not the cells' true positions in the tissue. Spatial information must be measured separately through tissue imaging or spatial omics.

## 2. How Did This Technology Develop?

The history of a technology is more than a list of dates. Each advance answered a new question.

### 2.1 2009: Can We Measure RNA from a Single Cell?

In 2009, Tang Fuchou and colleagues at Peking University published a study in *Nature Methods* showing that whole-transcriptome mRNA sequencing was feasible in individual mouse blastomeres and oocytes. The study's data tables list 6 independent single-cell samples. It showed that even with very little starting RNA, RNA could be converted into cDNA and large numbers of genes could then be observed using high-throughput sequencing.

This work is commonly regarded as one of the important starting points of single-cell RNA sequencing. It first answered the question “Can it be measured?” At that time, however, researchers could not yet process thousands of cells at once with ease.

[Read the original paper by Tang and colleagues](https://doi.org/10.1038/nmeth.1315)

### 2.2 Smart-seq: Can We See More of Each Transcript?

RNA is unstable, and a single cell contains only a small amount of it. Experiments therefore usually begin with **reverse transcription**, which copies RNA into more stable complementary DNA (cDNA), before amplification and sequencing.

Smart-seq, introduced in 2012, improved coverage of transcripts from individual cells. Smart-seq2 increased sensitivity, accuracy, and the evenness of coverage in 2013. In 2020, Smart-seq3 added UMIs at the 5′ end, allowing molecule counting to be combined with transcript and allele analysis.

Smart-seq commonly places cells into separate reaction wells. It is useful for examining splice isoforms or sequence differences in greater detail, but each cell requires more independent handling and sequencing resources. It therefore does not usually measure as many cells at once as droplet-based methods.

The term “full length” is easy to misunderstand. It means that sequencing reads can be distributed across a broad portion of a transcript. **It does not mean that every RNA molecule is necessarily read continuously by one read from its 5′ end to its 3′ end.**

[Original Smart-seq paper](https://doi.org/10.1038/nbt.2282) · [Original Smart-seq2 paper](https://doi.org/10.1038/nmeth.2639) · [Original Smart-seq3 paper](https://doi.org/10.1038/s41587-020-0497-0)

### 2.3 Droplet Technology: Can We Measure More Cells at Once?

As the goal shifted from “study a few cells in depth” to “map the cells in a complex tissue,” researchers needed to process thousands of cells in parallel. In 2015, the inDrop and Drop-seq studies demonstrated approaches that use tiny droplets to label RNA from many cells in parallel. In 2017, Zheng and colleagues reported a high-throughput system that later became an important foundation of the 10x Genomics Chromium workflow and demonstrated data from tens of thousands of human peripheral blood mononuclear cells.

10x was therefore not the first droplet-based single-cell RNA-sequencing study. Its important contribution was to integrate droplet partitioning, barcoded gel beads, UMIs, and a supporting data-processing workflow into a system that could be used at large scale.

[Original inDrop paper](https://doi.org/10.1016/j.cell.2015.04.044) · [Original Drop-seq paper](https://doi.org/10.1016/j.cell.2015.05.002) · [Original paper by Zheng and colleagues](https://doi.org/10.1038/ncomms14049)

## 3. Remember One Central Action: Add an “Address” Before Mixing

If one thousand cells are lysed directly, all their RNA enters the same tube. Once that happens, the RNA sequence alone cannot tell us which cell a molecule originally came from.

The solution is similar to mailing parcels: each parcel receives an address before it enters a large sorting center. In a single-cell experiment, a readable short DNA sequence is likewise added before cDNA from different cellular sources is mixed. After sequencing, software uses those sequences to “sort” the data back to different sources.

The three labels most easily confused in 10x data are:

| Label | What does it distinguish? | A beginner-friendly way to think about it |
| --- | --- | --- |
| Cell barcode | Different GEMs, or reaction partitions | “Which small compartment did this batch of cDNA come from?” |
| UMI (unique molecular identifier) | Different original RNA molecules captured in the same partition | “Which captured RNA molecule is this?” |
| Sample index | Different libraries pooled in the same sequencing run | “Which library does this piece of data belong to?” |

A sample index labels a library. It does not automatically identify a donor, treatment group, or biological replicate. A sample from one independent donor or animal may be split across several libraries, and a single library may contain multiple samples when an additional multiplexing method is used. Even if thousands of cells are measured from one sample, those cells are not thousands of independent biological replicates. The experimental unit is usually the independent donor, animal, or sample. Experimental design, pseudoreplication, and statistical comparisons between groups will be covered in a later lesson.

This analogy has three boundaries:

1. Strictly speaking, a cell barcode labels a **GEM partition**; it is not an identity card engraved on a living cell. If two cells enter the same GEM, they share a barcode and produce a doublet or multiplet event.
2. A UMI helps reduce duplicate counting caused by PCR amplification, but UMI collisions, sequencing errors, and molecule loss can still affect it. The result is therefore a technical estimate of the number of original molecules.
3. Ambient RNA released from broken cells into the suspension can also enter a GEM that contains a cell and receive that partition's barcode. A barcode can therefore trace a reaction partition, but it cannot prove that every RNA molecule in the partition came from the intact cell inside it. A later quality-control lesson will cover how to identify and remove ambient RNA contamination.

## 4. A Six-Step Workflow Using 10x 3′ Gene Expression as an Example

The key to 10x is not “putting intact cells into a sequencer.” A sequencer ultimately reads a prepared DNA library. Long before sequencing begins, the cells have been lysed and their RNA converted into labeled cDNA.

The common 10x 3′ Gene Expression workflow below provides an overall picture. The 10x 5′ workflow also uses GEMs, cell barcodes, and UMIs, but the chemistry that incorporates the labels into cDNA is different. Do not treat this simplified diagram as an operating manual for every reagent version.

The real workflow begins when the sample is collected. The length of time a tissue remains without a blood supply (often called ischemic time), the preservation method, the delay between collection and processing, the operator, and the reagent batch can all change cell states or the proportion of cells eventually recovered before tissue dissociation even begins. Experimental conditions should not line up completely with processing dates or batches. A later experimental-design lesson will explain randomization, balanced batching, controls, and metadata recording in detail.

### Step 1: Turn the Tissue into a Single-Cell Suspension

Researchers use mechanical processing or enzymatic digestion to separate a tissue into individual cells as far as possible. The resulting liquid is called a **single-cell suspension**. Ideally, the cells remain intact and highly viable, with as few cell clumps, fragments, and free RNA molecules as possible.

This step affects which cells will eventually be observed. If one cell type breaks more easily during digestion, it may be underrepresented in the expression matrix. Digestion that continues for too long can also trigger a stress response and alter the cells' original RNA state.

Intact cells are not the only possible starting point. For frozen samples, tissues that are difficult to dissociate, or cells easily damaged during dissociation, researchers may instead isolate nuclei and perform single-nucleus RNA sequencing (snRNA-seq). It shares many barcode principles with single-cell workflows, but the observable range of RNA, the proportion of intronic reads, and cell-type biases differ. A later lesson will compare these approaches directly.

### Step 2: Count the Cells and Check Sample Quality

Before the cell suspension is added to the microfluidic chip and GEM generation begins, researchers need to estimate cell concentration, viability, and clumping. If the concentration is too low, many partitions are wasted. If it is too high, the chance that two cells enter the same partition increases. The aim is not to put a cell in every droplet, but to recover enough cells while controlling the doublet rate.

### Step 3: Generate GEMs—Tiny Reaction Chambers

The cell suspension, reaction mixture, Gel Beads carrying barcoded primers, and oil phase enter separate channels of a microfluidic chip. When these streams meet, they form large numbers of nanoliter-scale GEMs (Gel Beads-in-emulsion).

A GEM can be understood as a tiny water droplet dispersed in oil: a water-in-oil structure. An ideal productive GEM contains one cell and one gel bead. In practice, there are also empty GEMs and a small number of GEMs containing two or more cells.

![Diagram of the GEM workflow for 10x Chromium single-cell RNA sequencing](figures/scrna-seq-gem-workflow.en.png)

*Figure 1 | A conceptual workflow centered on 10x Chromium 3′ Gene Expression. This project-original, AI-assisted diagram was created with the OpenAI image generation tool on July 16, 2026. It does not use or copy third-party images, vendor logos, or proprietary layouts. The diagram shows principles only; actual reagent structures and procedures should be checked against the official manual for the relevant product version. Scientific basis: the [10x Genomics 3′ Gene Expression workflow](https://www.10xgenomics.com/support/universal-three-prime-gene-expression/documentation/steps/experimental-design-and-planning/getting-started-single-cell-3-gene-expression) and the [original paper by Zheng and colleagues](https://doi.org/10.1038/ncomms14049).*

### Step 4: Lyse the Cell and Add Labels Inside the GEM

The cell is lysed inside the GEM, releasing its mRNA. Primers on the gel bead carry the cell barcode and UMI assigned to that GEM. During reverse transcription, the information in the mRNA is copied into cDNA, and the labels are incorporated into the newly synthesized cDNA.

As a result, cDNA molecules from the same GEM share the same cell barcode, whereas different original RNA molecules usually carry different UMIs. **Barcodes are added during library preparation; they are not attached by software after sequencing is complete.**

### Step 5: Break the Emulsion, Amplify the cDNA, and Prepare the Library

After reverse transcription, researchers break the water-in-oil emulsion and pool all the labeled cDNA. Products from different cells are now mixed, but their source information remains encoded in the barcodes.

A single cell produces too little cDNA to be sequenced directly, so PCR amplification is still required. The cDNA is then fragmented, sequencing adapters and sample indexes are added, and the material becomes a library that a sequencer can read.

### Step 6: Sequence the Library and Sort Reads Back to Their Sources

Some positions in a sequencing read contain the cell barcode and UMI, while other positions come from the transcript. Software reads this information and then:

1. determines which partition a read belongs to;
2. determines which gene the transcript sequence came from;
3. uses UMIs to reduce duplicate counting caused by PCR copies;
4. identifies which barcodes look more like real cells than background RNA from empty droplets; and
5. generates a gene-by-cell expression matrix.

Only at this point have we moved from a tube of tissue to a numerical table that can be analyzed.

## 5. What Do 3′, 5′, and “Full Length” Actually Mean?

An RNA chain has a direction, and its two ends are called the 5′ end and the 3′ end. At this stage, you do not need to remember the numbering of the carbon atoms. You only need to know that **these are two different directions along the same RNA molecule.**

| Method | What does a routine expression library mainly read? | Common research purpose |
| --- | --- | --- |
| 10x 3′ Gene Expression | A tag near the transcript's 3′ end | Gene-expression counting, clustering, and cell-type identification across many cells |
| 10x 5′ Gene Expression | A tag near the transcript's 5′ end | Gene-expression counting; TCR/BCR V(D)J libraries can also be built from the same batch of cDNA |
| Smart-seq2 / Smart-seq3 | Reads can cover a broader portion of each transcript | Splice isoforms, alleles, or deeper transcript analysis |

The main goal of both 3′ and 5′ methods is to use a sequence tag from one end of a transcript to identify its gene and count it—not to reconstruct every complete RNA molecule. These methods may produce long or even full-length cDNA intermediates during reverse transcription, but routine Gene Expression libraries still mainly read one end. “Producing full-length cDNA” must not be confused with “obtaining full-length transcript sequencing data.”

The 5′ assay is common in immunology because researchers can build an additional V(D)J library for T-cell receptors (TCRs) or B-cell receptors (BCRs) and track immune-cell clones. It is not automatically “more advanced” than a 3′ assay in every situation. The choice depends on the research question.

[Official 10x 3′ information](https://www.10xgenomics.com/support/universal-three-prime-gene-expression) · [Official 10x 5′ information](https://www.10xgenomics.com/support/universal-five-prime-gene-expression)

## 6. What Are the Main Differences Among 10x, BD, and Singleron?

There are many platform names, but begin with one shared question: **How does each platform separate cells and give the RNA in every partition a traceable label?**

Before comparing platforms, at minimum align the input type (intact cells or nuclei), the specific assay (for example, targeted or whole-transcriptome), reagent version, sequencing depth, and data-processing workflow. Differences observed under unmatched conditions cannot simply be attributed to the platform name.

### 10x Chromium: Droplet-Based Partitioning

10x uses GEM droplets as reaction partitions. It can process large numbers of cells in parallel and commonly produces UMI-based gene-expression counts. Classic 10x 3′/5′ data are usually processed with a Cell Ranger workflow matched to the reagent version.

### BD Rhapsody: Microwell-Based Partitioning

BD Rhapsody uses a microwell array rather than 10x-style GEMs. Cells first settle into microwells by gravity, followed by magnetic capture beads carrying cell labels and UMIs. After cell lysis, a nearby bead captures poly(A)-tailed RNA. The beads are then recovered, and reverse transcription and library preparation take place in a reaction tube. The system also allows imaging-based quality control of cells and multicell events in the wells.

[Official BD Rhapsody technical information](https://www.bdbiosciences.com/en-us/products/instruments/single-cell-multiomics-systems/rhapsody)

### Singleron SCOPE-chip: Another Microwell-Based Approach

The SCOPE-chip from Singleron also uses microwells. Cells settle into the wells by gravity, after which barcoded capture beads are added. Following cell lysis, mRNA is captured by the beads. Researchers then collect the magnetic beads and perform reverse transcription, amplification, and library preparation in a standard reaction tube.

Raw Singleron data are usually processed with CeleScope, or another independent workflow, matched to the specific reagent chemistry. Its read structure and barcode design differ from those of 10x. A FASTQ file should therefore not be passed into Cell Ranger without first checking its origin and structure.

[Official SCOPE-chip technical information](https://singleron.bio/scope-chip/) · [Official CeleScope information](https://singleron.bio/products/celescope/)

No platform is universally better outside the context of a research question. Tissue type, dissociation method, reagent version, sequencing depth, and software parameters can all change the number and proportions of detected cells and the number of detected genes.

## 7. Why Are Neutrophils Often Used as an Example of Platform Bias?

Neutrophils are white blood cells involved in innate immunity. They contain relatively little mRNA, contain many enzymes that can degrade RNA, and are easily damaged during handling. A chain of problems can therefore occur:

> cells rupture during sample preparation → RNA is lost or enters the ambient solution → intact cells receive fewer UMIs → software classifies low-signal barcodes as empty droplets or low-quality cells

Some direct comparisons performed with particular tissues, reagent versions, and analysis workflows have found that BD Rhapsody performs better at recovering some low-RNA cells or granulocytes and at counting their molecules. The same studies also found that 10x performed differently in productive cell capture, in the number of genes detected per cell, and across other cell types. Changing the cell-calling method—the decision about which barcodes belong to real cells—may also recover more neutrophils from 10x data.

The correct conclusion is therefore not “BD can measure neutrophils, but 10x cannot.” Instead: **neutrophil results can be strongly affected by sample preparation, platform chemistry, and data processing at the same time.** If neutrophils are central to a study, these biases should be evaluated during experimental design, and their proportions should be validated with an independent method such as flow cytometry or tissue imaging.

[Platform comparison in human prostate tissue](https://doi.org/10.1016/j.heliyon.2024.e28358) · [Platform comparison in mouse tumor tissue](https://doi.org/10.1016/j.heliyon.2024.e37185) · [Study of neutrophil identification in 10x data](https://doi.org/10.4049/jimmunol.2200154)

## 8. Next Step: From Public Data to an Expression Matrix

A sequencer first produces base sequences and their associated quality information. FASTQ is a common delivery format. Public studies may also deposit raw sequencing data in the NCBI Sequence Read Archive (SRA). The conceptual chain is then:

```text
SRA data from a public study
  → convert or download the data into the correct FASTQ format
  → confirm the experimental platform, reagent version, and read structure
  → use a matching processing workflow
      10x data: Cell Ranger
      Singleron data: CeleScope/an independent workflow matched to the chemistry
  → gene-by-cell expression matrix and quality report
```

Cell Ranger is not “the whole of single-cell downstream analysis.” For classic 10x 3′/5′ data, it mainly begins with FASTQ files and performs barcode processing, sequence alignment, UMI counting, candidate-cell identification, and expression-matrix generation. It also reports initial quality metrics, dimensionality reduction, clustering, and, in some current workflows, preliminary cell-type annotation. These automated results are useful for a quick check, but rigorous cell filtering, integration across samples, cell annotation, statistical inference, and biological validation usually still require R or Python together with the study design.

Cell Ranger usually provides both a raw matrix and a filtered matrix. The raw matrix retains more barcodes, whereas the filtered matrix retains only barcodes classified as cells by the software's cell-calling rules. Low-RNA cells may be absent from the filtered matrix. The practical lessons will therefore inspect both matrices, the quality report, the reference genome and annotation versions, the reagent chemistry, the software version, and the cell-calling parameters.

An arbitrary SRA file also cannot be passed directly into Cell Ranger. Before processing, you must confirm that the data truly came from a compatible 10x experiment and determine the read structure, reference genome, reagent version, and relationships among samples. **A later practical lesson will begin with a public dataset and work through SRA → FASTQ → Cell Ranger step by step. You do not need to memorize any commands in this chapter.**

[Official introduction to NCBI SRA](https://www.ncbi.nlm.nih.gov/sra) · [Official Cell Ranger documentation](https://www.10xgenomics.com/support/software/cell-ranger/latest)

## Chapter Summary

- Single-cell RNA sequencing does not photograph a cell. It captures RNA as cells are lysed and adds labels before cDNA from different sources is mixed.
- A cell barcode traces a reaction partition, a UMI helps estimate the number of original RNA molecules captured, and a sample index distinguishes different libraries.
- 10x separates cells using GEM droplets, while BD Rhapsody and the Singleron SCOPE-chip use microwells. Each approach can introduce its own capture biases.
- 3′, 5′, and Smart-seq assays provide different ranges of information. Choose a method by starting with the research question, not by comparing platform names alone.
- Sequencing is not the end of the analysis. Raw data must still be processed by software matched to the experimental system before a gene-by-cell expression matrix can be produced.

## Check Whether You Really Understand

1. If RNA from all cells has already been mixed and no source label was added beforehand, why is it difficult to determine which cell an RNA molecule came from after sequencing?
2. If two cells accidentally enter one GEM, why can the cell barcode not separate them automatically? Why can a UMI not solve this problem either?
3. After receiving a public FASTQ file, why should you not immediately assume that Cell Ranger can process it? What information must you confirm before beginning the analysis?

If you can answer these questions without reciting terms—by following the sequence “partition → label → mix → sequence → sort”—you have the conceptual foundation needed to begin practical data processing.

## References and Further Reading

1. Tang F, et al. mRNA-Seq whole-transcriptome analysis of a single cell. *Nature Methods*. 2009. [doi:10.1038/nmeth.1315](https://doi.org/10.1038/nmeth.1315)
2. Ramsköld D, et al. Full-length mRNA-Seq from single-cell levels of RNA and individual circulating tumor cells. *Nature Biotechnology*. 2012. [doi:10.1038/nbt.2282](https://doi.org/10.1038/nbt.2282)
3. Picelli S, et al. Smart-seq2 for sensitive full-length transcriptome profiling in single cells. *Nature Methods*. 2013. [doi:10.1038/nmeth.2639](https://doi.org/10.1038/nmeth.2639)
4. Hagemann-Jensen M, et al. Single-cell RNA counting at allele and isoform resolution using Smart-seq3. *Nature Biotechnology*. 2020. [doi:10.1038/s41587-020-0497-0](https://doi.org/10.1038/s41587-020-0497-0)
5. Klein AM, et al. Droplet barcoding for single-cell transcriptomics applied to embryonic stem cells. *Cell*. 2015. [doi:10.1016/j.cell.2015.04.044](https://doi.org/10.1016/j.cell.2015.04.044)
6. Macosko EZ, et al. Highly parallel genome-wide expression profiling of individual cells using nanoliter droplets. *Cell*. 2015. [doi:10.1016/j.cell.2015.05.002](https://doi.org/10.1016/j.cell.2015.05.002)
7. Zheng GXY, et al. Massively parallel digital transcriptional profiling of single cells. *Nature Communications*. 2017. [doi:10.1038/ncomms14049](https://doi.org/10.1038/ncomms14049)
