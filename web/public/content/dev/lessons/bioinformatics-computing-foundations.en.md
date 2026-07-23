# 0.1 | Why Does Bioinformatics Often Run on Linux, and What Do R, Python, and Codex Each Do?

Suppose you receive a single-cell sequencing dataset and want to answer a biological question: “Which cells have changed in the disease group?”

Before reaching an answer, you may need to complete a chain of tasks:

> download data → inspect files → run quality control → align or count → organize an expression matrix → perform statistical analysis → make figures → interpret the result

These steps are not all handled by one piece of software. Some programs run in Linux, some analyses are written in R or Python, and AI tools such as Codex can help generate code, execute commands, and inspect results.

A common beginner misunderstanding is to treat Linux, R, Python, and Codex as four competing analysis programs. In reality, they occupy different layers:

| Name | What is it? | Common role in bioinformatics |
| --- | --- | --- |
| Linux | An operating system | Managing files, running bioinformatics software, connecting to servers, and organizing workflows |
| Bash | A common command-line environment on Linux | Entering commands, connecting programs, and processing files in batches |
| R | A programming language and statistical computing environment | Statistical analysis, data visualization, transcriptomics, and single-cell analysis |
| Python | A general-purpose programming language | Data processing, workflow automation, machine learning, and omics analysis |
| Codex | An AI agent that can work with code, files, and tools | Helping write, explain, run, and inspect analysis code |

For now, you can understand their relationship like this: Linux provides the computing environment; Bash, R, and Python handle different tasks within that environment; Codex helps the researcher organize, execute, and inspect the work, but it does not replace the researcher's judgment about questions and evidence.

![Hierarchy showing the roles of Linux, Bash, R, Python, Codex, and the researcher in bioinformatics](figures/bioinformatics-computing-layers.en.png)

*Figure 1 | Common roles of bioinformatics computing tools. Linux provides the operating-system environment, Bash connects commands and workflows, R and Python handle analysis tasks, Codex can assist across several steps, and the researcher remains responsible for asking questions, reviewing evidence, and interpreting results. This project-original, AI-assisted diagram was created with the OpenAI image-generation tool on July 23, 2026. It uses no vendor logos, screenshots, or third-party layouts. The diagram shows a common relationship, not the only possible workflow.*

The diagram is a guide rather than a rigid rule. R and Python also run on Windows and macOS, and Linux is not limited to command-line use.

## Three Questions for This Lesson

By the end of this lesson, you should be able to explain:

1. Why do many bioinformatics workflows use Linux?
2. What are R and Python each suited to, and how can you choose between them?
3. If Codex can already write code and run analyses, why is it still worth learning these foundations?

You do not need to install Linux or memorize any commands in this lesson.

## Why Is Linux Common in Bioinformatics?

### Reason 1: Many Bioinformatics Tools Target Linux First

Many sequencing-data programs are developed and tested on Linux or similar Unix environments. Some also provide macOS versions but do not directly support Windows.

For example, Bioconda distributes a large collection of biomedical research packages. Its current documentation supports Linux and macOS, but not Windows directly. The official system requirements for 10x Genomics Cell Ranger also specify Linux.

[Official Bioconda documentation](https://bioconda.github.io/index.html) · [Official Cell Ranger system requirements](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

This does not mean Windows cannot be used for bioinformatics. It means that when a tool is officially supported only on Linux, using a Linux environment usually makes it easier to obtain behavior consistent with its documentation.

### Reason 2: Servers and Large Computing Resources Commonly Provide Linux

An ordinary laptop is useful for reading lessons, inspecting small datasets, and learning analysis methods. Raw sequencing data, however, may require substantial memory, storage, and processor resources.

Laboratory servers, high-performance computing clusters (HPCs), and many cloud-computing instances commonly provide Linux environments. After learning Linux, the same commands and directory structures can often move from a personal computer to a server.

Linux does not make a computer faster by itself. Whether software can run still depends on the processor, memory, free disk space, and data size. Installing a Linux environment on Windows cannot compensate for insufficient memory when a raw-data workflow has large hardware requirements.

### Reason 3: Commands Are Easy to Combine, Record, and Repeat

Graphical interfaces are useful for exploration, but after clicking through many screens, it may be difficult to answer:

- Which input file did you select?
- Which parameters did you use?
- Which software version was installed?
- Which step produced a warning?
- How would you repeat the same procedure for twenty more samples?

In a Linux command-line environment, an analysis can be saved as a script. A script is a list of operations for the computer to execute. It can be inspected, changed, rerun, and shared with another researcher.

Saving a script does not guarantee reproducibility by itself. The reference genome, annotation files, software versions, sample information, and random seeds may also change the result.

### Reason 4: Linux Has Mature File and Permission Management

A bioinformatics analysis may contain many files: FASTQ files, BAM files, expression matrices, sample sheets, logs, and figures. Without a clear directory structure, a program may read the wrong sample or overwrite an earlier result.

Linux provides explicit file paths, user permissions, and logging mechanisms. The aim of learning these ideas is not to memorize commands. It is to know:

- where the data are;
- what the program is reading;
- where the result will be written;
- which files can be changed; and
- which log to inspect after a failure.

## Must a Windows User Reinstall Their Computer?

No.

Windows Subsystem for Linux (WSL) allows a Windows user to run a Linux distribution, Bash, and Linux command-line programs without setting up a dual-boot computer.

[Official Microsoft WSL overview](https://learn.microsoft.com/en-us/windows/wsl/about)

At the beginner level, WSL can be understood as a Linux working environment inside a Windows computer. Many of the same concepts will remain useful if you later use a laboratory server.

However, WSL and a remote server are not the same:

- WSL uses the resources of your current computer;
- a server uses the resources of a remote machine;
- an HPC may use a scheduler to organize jobs submitted by many people; and
- a cloud platform may charge for storage and computing time.

Later practical lessons will therefore state both where a command runs and where the data are stored. They will not present code without identifying its execution environment.

## What Is R?

R is both a programming language and an environment for statistical computing and graphics. The R Project describes it as a language and environment for statistical computing and graphics.

[Official R Project introduction](https://www.r-project.org/about.html)

One important strength of R in bioinformatics is Bioconductor. Bioconductor is an open-source bioinformatics project based on R. It covers genomic, transcriptomic, flow-cytometry, and other data while emphasizing statistical methods, documentation, and reproducible research.

[Official Bioconductor introduction](https://bioconductor.org/about/index.html)

In single-cell analysis, Seurat is a widely used R package for quality control, exploration, clustering, integration, and visualization.

[Official Seurat documentation](https://satijalab.org/seurat/)

Common strengths of R include:

- a mature statistical-analysis ecosystem;
- a large collection of omics packages in Bioconductor;
- the ability to combine analysis, statistical models, and figures in one script or report; and
- direct R code in many biomedical methods sections and tutorials.

R also requires some adjustment:

- packages may require particular versions of R or Bioconductor;
- different packages may use different data objects;
- large datasets require attention to memory use rather than repeated copying of objects; and
- producing a figure does not prove that the statistical design was correct.

## What Is Python?

Python is a general-purpose programming language. In addition to scientific computing, it is widely used for software development, automation, network services, machine learning, and education. The Python Package Index provides a large collection of third-party modules.

[Official Python introduction](https://www.python.org/about/)

In single-cell research, Scanpy is a Python-based toolkit for preprocessing, visualization, clustering, trajectory inference, and differential-expression analysis. It works with the AnnData data object.

[Official Scanpy documentation](https://scanpy.readthedocs.io/)

Common strengths of Python include:

- connecting data download, file processing, analysis, and automation in a complete workflow;
- broad scientific-computing, machine-learning, and deep-learning ecosystems;
- integration with databases, web services, and other programs; and
- developing reusable analysis software and tools.

Python also requires some adjustment:

- many packages may offer different approaches to the same problem;
- versions of Python, packages, and lower-level libraries need to remain compatible;
- an interactive notebook may run once but fail to reproduce after reopening if cells were executed out of order; and
- the freedom of a general-purpose language also requires active management of code structure and data state.

## Which Is Better, R or Python?

There is no single answer without a specific task.

| Perspective | R | Python |
| --- | --- | --- |
| Original core focus | Statistical computing and graphics | General-purpose programming |
| Typical bioinformatics ecosystem | Bioconductor, Seurat | NumPy, pandas, scikit-learn, Scanpy/scverse |
| Commonly strong use cases | Statistical modeling, differential analysis, biostatistics, and publication figures | Automation, machine learning, data engineering, and analysis-tool development |
| Common learning challenges | Package versions, data objects, and statistical concepts | Environment management, software structure, and many library choices |
| Can it analyze single-cell data? | Yes | Yes |
| Can it run on Linux? | Yes | Yes |

All of the following claims are too simple:

- “R can only make figures.”
- “Python is always faster than R.”
- “Python can do everything, so R is unnecessary.”
- “Biomedical papers often use R, so Python is unnecessary.”

Actual performance depends on the algorithm, data structures, lower-level implementation, memory, and parallel computing—not only on the language name. Many R and Python packages call C, C++, Fortran, or other high-performance code for their core calculations.

A more useful choice begins with these questions:

1. Which ecosystem contains a mature method for the research question?
2. Which implementation is provided by the official tutorial and original paper?
3. Which data objects and workflows does the team use?
4. Must the result connect to an existing project?
5. Can you explain and validate each step?

A real project may use both languages. Linux tools may generate an expression matrix, R may perform statistical analysis, and Python may provide additional machine learning or automation.

## If Codex Can Analyze Data Directly, Why Do We Still Need This Course?

Codex can read and modify files, write code, run tasks, and help build automated workflows. OpenAI's current introduction to Codex emphasizes that it can perform real work across files and tools.

[OpenAI introduction to Codex](https://openai.com/academy/what-is-codex/)

This changes how people learn. A beginner no longer has to memorize a large amount of syntax before starting to inspect data or try an analysis workflow.

But it does not remove the need to understand bioinformatics.

### A Successful Run Is Not Necessarily a Correct Analysis

Code may finish without an error and produce an attractive figure while still containing problems such as:

- no independent biological replicates for the disease and control groups;
- treating every cell as an independent sample;
- using an incompatible reference genome;
- filtering out an important low-RNA cell population;
- making the experimental condition identical to the processing batch; or
- interpreting computational similarity between two cell populations as causal evidence.

These are usually not syntax errors. They cannot be detected simply by asking whether the code ran successfully.

### AI Still Needs Someone Who Can Judge the Result

For intuition, Codex can be compared with a fast research assistant that can operate tools. It can organize files, explain an error, write a script, and run checks, but you still need to tell it:

- what the biological question actually is;
- which data may be used;
- which sample is the independent experimental unit;
- what counts as a successful result;
- which unusual observations must not be removed automatically; and
- what evidence is required for the final conclusion.

The analogy has limits. Codex does not have the fixed ability level of a human assistant; its behavior depends on the model, tools, context, and permissions. Regardless of capability, a final analysis still needs validation through sources, parameters, logs, and independent evidence. OpenAI similarly describes Codex as a tool that requires human direction and review rather than a replacement for human judgment.

### The Goal of a Tutorial Must Also Change

Before AI tools, tutorials often devoted much of their space to asking learners to memorize function names and command arguments.

In the Codex era, more important learning goals are:

- understanding why an analysis step exists;
- describing its inputs, outputs, and success criteria;
- checking whether an AI-selected tool matches the data;
- recognizing errors in experimental design, statistics, and biological interpretation;
- requiring the AI to preserve code, versions, logs, and decision records; and
- knowing which evidence to trust when an AI result conflicts with official documentation or an original paper.

This course is therefore not competing with Codex to write code faster. It aims to help learners ask the right questions, supervise analyses, inspect evidence, and take responsibility for scientific judgment.

## References and Further Reading

1. [R Project: What is R?](https://www.r-project.org/about.html)
2. [Python.org: About Python](https://www.python.org/about/)
3. [Bioconductor: About](https://bioconductor.org/about/index.html)
4. [Official Bioconda documentation](https://bioconda.github.io/index.html)
5. [Microsoft: Windows Subsystem for Linux](https://learn.microsoft.com/en-us/windows/wsl/about)
6. [10x Genomics: Cell Ranger System Requirements](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)
7. [Official Seurat documentation](https://satijalab.org/seurat/)
8. [Official Scanpy documentation](https://scanpy.readthedocs.io/)
9. [OpenAI Academy: What is ChatGPT Codex?](https://openai.com/academy/what-is-codex/)
