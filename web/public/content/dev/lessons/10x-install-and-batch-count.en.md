# 1.2 | Installing Cell Ranger and Space Ranger from 10x Genomics

This lesson covers two tools you can install on Linux. Cell Ranger produces a gene expression matrix from single-cell sequencing data. Space Ranger maps expression counts to positions on a tissue section. [Official Cell Ranger installation tutorial](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Official Space Ranger installation guide](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## Part I. Install Cell Ranger

### 1. Download and unpack Cell Ranger 10.1.0

Copy the download command from the 10x website into your Linux terminal. Download the archive and unpack it. [Cell Ranger downloads](https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links)

### 2. Download and unpack the human reference

For human samples, download the **GRCh38 2024-A human reference** (about 11 GB). GRCh38 identifies the human genome assembly, and 2024-A identifies the 10x reference release. Cell Ranger uses the sequences, gene annotations, and indexes in this package to determine which gene a read came from. [Download the GRCh38 2024-A human reference](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

After extraction, set `--transcriptome` to the path of the entire reference directory. For mouse samples, use the mouse reference package.

### 3. Add Cell Ranger to `PATH`

Unpacking the archive installs the program. To run `cellranger` from your sample directory, tell Bash where to find it. `PATH` is a list of directories separated by colons. Bash searches them from left to right. The command below puts the new installation first and keeps the existing search directories with `:$PATH`. [10x instructions for setting PATH](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

The first check should print a path inside your home directory ending in `/10x-tools/cellranger-10.1.0/cellranger`. The second should show `10.1.0`. If Bash reports `command not found`, check that the executable exists at that path. If you see an older version, run `type -a cellranger` to list all matching commands and check which directory comes first.

**Keep the setting for future terminals.** The `export` above applies to this Bash session and its child processes. Open your personal configuration file with a text editor, for example by running `nano ~/.bashrc`, and add the following line at the end. Keep one copy if it is already there.

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

In nano, press `Ctrl+O` and then Enter to save, followed by `Ctrl+X` to exit. Run the commands below to reload the file and check the result. Then open a fresh server terminal as you normally would and run `cellranger --version` again.

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

An interactive, non-login Bash shell reads `~/.bashrc` automatically. When you log in over SSH, your login configuration determines whether Bash reads it. If the command disappears after logging back in, check whether your active login file, often `~/.bash_profile`, loads `~/.bashrc`. On a cluster, you can put the same `export PATH=...` line in the job script so the compute node uses the intended version. [Bash startup files](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. Read the `cellranger` usage information

Run these commands from any directory. The first lists the tasks Cell Ranger can perform. The other two show the options for individual tasks. Each help command prints instructions and exits.

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

The `Usage` line shows how to write a command. In `cellranger testrun --id=check_install`, `cellranger` is the program, `testrun` is the subcommand, `--id` is an option, and `check_install` is the name you give this run. When you see `<ID>`, substitute your own value. `[OPTIONS]` means you can add options there. Leave out the brackets themselves. Use `-h` or `--help` to display help, and `-V` or `--version` to display the version.

| Subcommands in the help text | What they do |
| --- | --- |
| `testrun` | Tests the installation with a small bundled dataset. |
| `count` | Counts gene expression and other supported features for a single sample from one cell capture. A library is the set of molecules prepared from a sample for sequencing. |
| `multi`, `multi-template` | `multi` reads a configuration file for multiplexed samples, Flex experiments, or experiments that combine several library types. `multi-template` generates a template for that file. |
| `vdj`, `mkvdjref` | `vdj` reconstructs T-cell or B-cell receptor sequences from immune repertoire sequencing data. `mkvdjref` builds a reference for that analysis. |
| `aggr`, `reanalyze`, `annotate` | `aggr` aggregates results across runs. `reanalyze` repeats dimensionality reduction and clustering on an existing matrix. `annotate` predicts cell types from existing results. |
| `mkref`, `mkgtf`, `mat2csv` | `mkref` builds a custom reference from sequence and gene annotation files. `mkgtf` filters gene annotations by attribute. `mat2csv` converts a matrix to CSV. A large matrix can produce a very large CSV file. |
| `sitecheck`, `upload`, `telemetry`, `cloud`, `help` | `sitecheck` reports the computer configuration. `upload` sends a specified diagnostic file to 10x support. `telemetry` shows or configures usage data collection. `cloud` works with 10x cloud services. `help` explains a command. |

Older tutorials may mention `mkfastq`, which 10x has deprecated. If your sequencing facility delivers FASTQ files, which contain sequences and base quality scores, you can start with those files. The installation test uses its own sample data. [Cell Ranger commands](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [Cell Ranger 10.1.0 command source code](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

When you read `cellranger count --help`, start with the options below to see how the program connects your input files to a named output directory.

| Option | Default or behavior if omitted in Cell Ranger 10.1.0 | What to enter for your sample |
| --- | --- | --- |
| `--id` | Required. No default. | Choose a name for the run and its output directory, such as `GEX_A`. |
| `--fastqs` | Required for this example. No default path. | Supply the directory containing the sequencing files. |
| `--sample` | Selects the sample automatically if only one filename prefix is present. Omitting this option when multiple prefixes are detected raises an error. | Supply the target sample's filename prefix. For example, `GEX_A_S1_L001_R1_001.fastq.gz` has the prefix `GEX_A`. |
| `--transcriptome` | Required for this example. No default reference. | Supply the entire reference directory you unpacked in step 2. |
| `--localcores` | Local mode uses all available CPU cores. | Enter the number of cores allocated to this job. |
| `--localmem` | Local mode uses 90% of the memory it detects. | Set the memory limit in GB, within your job allocation. |
| `--create-bam` | Required. Explicitly choose `true` or `false`. | Choose `true` if you need a file of individual read alignments. Choose `false` if you only need the expression matrix. |
| `--include-introns` | `true` for standard whole-transcriptome 3′ and 5′ gene expression assays. | The default includes qualifying intronic reads in the counts. Choose `false` to exclude them. |
| `--nosecondary` | Off. The built-in secondary analysis runs. | Add `--nosecondary` to skip this step if you will run your own dimensionality reduction and clustering. |

### 5. Check the installation with `testrun` and handle an operating system error

**If you see this message, check the machine that ran the test.** The error concerns operating system compatibility. Changing the reference or unpacking the same software again will leave that problem in place.

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```

For a project run, ask your administrator for a compute node that meets the current 10x requirements. Check `cellranger --version` on that node and run the installation test again. The login node and the node that executes the job can run different operating systems. [10x operating system support](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [Cell Ranger 10.1 system requirements](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

For the temporary workaround shown in the message, enter `export TENX_IGNORE_DEPRECATED_OS=1`.

### 6. Choose counting options for your version

`testrun` checks whether the software can run. Use `count` to turn your own FASTQ files into an expression matrix. When reading an older script, check these settings because they affect the counts or the files you receive. [Cell Ranger release notes](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [Cell Ranger 10.1 options](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| What changed | What it means for your project |
| --- | --- |
| **From 7.0**, standard whole-transcriptome 3′ and 5′ gene expression analyses default to `--include-introns=true`. Earlier versions excluded introns by default. | Introns are parts of an RNA transcript that are usually removed during splicing. With `true`, qualifying intronic reads that can be assigned to a gene can support its molecule count. This is especially useful for nuclei, which contain more unspliced RNA. With `false`, those reads are excluded. To reproduce older gene counts, check the original setting. |
| **From 8.0**, `count` requires an explicit `--create-bam=true` or `false`, replacing the old `--no-bam` option. | A BAM file records how individual reads aligned. Choose `false` to save disk space and writing time if you only need the matrix and already have a quality-control plan. Choose `true` if you want to examine alignments in a genome browser, a downstream tool needs a BAM, or you have yet to decide. Both settings produce the expression matrix. |
| **In 10.1**, human data receive local cell type annotation with Pan-Human Azimuth by default. Default secondary analysis includes UMAP, with t-SNE switched off. | `--disable-cell-annotation` turns off automatic cell type annotation. To keep built-in secondary analysis and add t-SNE, use `--enable-tsne=true`. UMAP and t-SNE project high-dimensional expression data into fewer dimensions for visualization. |

**When should you use `--nosecondary`?** For a first run, keep the default secondary analysis so you can inspect the built-in projections and clusters. If you already plan to compute your own projections and clusters from the matrix in Seurat or Scanpy, add `--nosecondary` to `cellranger count`. This flag takes no value. It saves the time spent on built-in secondary analysis and omits those results. You can choose the independent BAM setting, `--create-bam=false`, separately.

## Part II. Install Space Ranger

### 1. Download and unpack Space Ranger 4.1.0

Space Ranger maps the RNA measured by Visium to capture positions on the tissue section. [Official Space Ranger installation guide](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [System requirements](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)
Download the archive for your version and unpack it. The 10x download page lists the latest version. [Space Ranger downloads](https://www.10xgenomics.com/support/software/space-ranger/downloads)

**Download and unpack the human reference.** Space Ranger uses the same GRCh38 2024-A reference as Cell Ranger. If you unpacked it earlier, continue to the next step. [Download the GRCh38 2024-A human reference (about 11 GB)](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)

For `spaceranger count`, set `--transcriptome` to the path of the unpacked reference directory.

### 2. Set `PATH` and read the usage information

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

The path should end in `/spaceranger-4.1.0/spaceranger` and the version should be `4.1.0`. Open `nano ~/.bashrc`, add the `export` command on its own line, and run `source ~/.bashrc`. Open a new terminal and run `spaceranger --version` again. If you installed both programs, keep a separate `export` line for each in `.bashrc`.

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

Read the help in the same order as before, starting with the program, then the subcommand and its options. `--help` shows the syntax and `--version` shows the software version. [Space Ranger command reference](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| Subcommands | What they do |
| --- | --- |
| `testrun`, `count` | `testrun` checks the installation with bundled data. `count` processes one capture area and produces expression matrices, spatial coordinates, and tissue image outputs. |
| `segment`, `annotate` | `segment` identifies nuclei in supported Visium HD tissue images. `annotate` predicts cell types from eligible HD cell segmentation results. |
| `aggr` | Aggregates compatible runs from multiple capture areas. Space Ranger 4.1 excludes Visium HD from this workflow. |
| `mkref`, `mkgtf`, `mat2csv` | Build a reference, filter gene annotations, and convert an expression matrix to CSV, respectively. |
| `sitecheck`, `upload`, `telemetry`, `cloud` | Check the computing environment, send diagnostic files to 10x support, manage usage data collection, and work with 10x cloud services, respectively. The `mkfastq` command used in older workflows is deprecated. |

### 3. Test the installation and recognize an offline node

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` names the output directory. When the terminal prints `Pipestance completed successfully!`, the installation has passed the test. If you see an unsupported operating system message, run `cat /etc/os-release` on the compute node where the job ran. Switch to a node that meets the Space Ranger requirements. CentOS 7.5 is unsupported in Space Ranger 4.1. [Space Ranger system requirements](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

`Could not retrieve spot layout data` means the program could not obtain the capture spot layout for the slide. If your compute node has no internet access, rerun the **installation test** in offline mode with a fresh output directory.

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**When analyzing your own slide** on an offline node, use a computer with internet access to download the layout file for the actual slide serial number. Transfer it to the compute node and give `spaceranger count` the `--slidefile`, `--slide`, and `--area` options. After a successful installation test, check that the slide, capture area, and image belong together. [10x instructions for offline tests and slide layout files](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. Apply the options to one Visium capture area

This example uses **original Visium v1 with fresh-frozen human tissue and an H&E brightfield image**. H&E stands for hematoxylin and eosin, two stains that reveal tissue structure. Replace `V10J25-015`, `A1`, `Tissue_A`, and the image filename with the details from your slide and sequencing records. If your goal is to verify installation, the previous step completes that task.

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| Option in the example | Default or behavior if omitted in Space Ranger 4.1.0 | What to supply and what it changes |
| --- | --- | --- |
| `--id` | Required. No default. | Name the output directory. This run writes to `visium_A/`. |
| `--transcriptome` | Required. No default reference. | Supply the unpacked human reference directory. |
| `--fastqs` | Required for this example. No default path. | Supply the directory containing the sequencing files for this capture area. |
| `--sample` | Selects the sample automatically if only one filename prefix is present. Omitting this option when multiple prefixes are detected raises an error. | Supply the FASTQ filename prefix for the capture area, here `Tissue_A`. |
| `--image` | No default image. This example requires the path to the H&E brightfield image. | Supply the microscope image for this capture area. Space Ranger uses it to detect tissue and align the sequencing coordinates with the image. |
| `--slide` | Required for this example. No default serial number. | Enter the serial number from the physical slide. This example uses `V10J25-015`. |
| `--area` | No default capture area. This example requires it together with `--slide`. | Enter the capture area ID from the slide record, here `A1`. Run each capture area separately. |
| `--include-introns=true` | `true` for the Visium v1 assay used here. | This example keeps the default, allowing qualifying intronic reads to contribute to molecule counts. |
| `--create-bam=false` | Required. Explicitly choose `true` or `false`. | This example uses `false` to keep the expression matrix and spatial outputs and skip the per-read BAM. Choose `true` if you need to inspect alignments or have yet to decide how you will use the data. |

After the run, open `visium_A/outs/web_summary.html` for a spatial quality-control overview of this capture area. Images and position coordinates are in `visium_A/outs/spatial/`. Each barcode in an original Visium matrix represents a capture spot. A single spot can cover several cells. [Space Ranger spatial outputs](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**Three version changes to check in older scripts**

| Space Ranger version | Effect on the command or results |
| --- | --- |
| **From 3.0** | `count` requires an explicit `--create-bam=true` or `false`. Choose `false` to reduce disk use and writing time if you only need the matrix and spatial coordinates. |
| **4.0 series** | These releases support Visium HD 3′ and introduce nucleus and cell segmentation from tissue images. Omit `--probe-set` for HD 3′. For probe-based Visium HD, supply the probe set that matches the assay. |
| **From 4.1** | **Visium v1 and Visium HD 3′** include introns by default. Use `--include-introns=false` to reproduce an analysis that excluded them. Probe-based assays identify targets from probe pairs, so check the probe set used in the experiment. |

If you have experience with spatial analysis and plan to cluster the data yourself using the matrix, tissue images, and coordinates, `--nosecondary` saves the time spent on built-in secondary analysis. Keep secondary analysis if you want to inspect the clusters Space Ranger produces. Check the image registration in either case. [Space Ranger release notes](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [Inputs for different Visium HD assays](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
