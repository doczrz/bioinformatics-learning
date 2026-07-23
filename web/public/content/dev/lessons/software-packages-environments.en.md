# 0.2 | Why Can Code Still Fail After R or Python Is Installed? Packages, Environments, Dependencies, and Versions

You find a single-cell analysis script online. Its author says that it “requires Python and Scanpy.” You confirm that Python is installed on your computer, copy the code, and see:

```text
ModuleNotFoundError: No module named 'scanpy'
```

Another learner has already used Scanpy, but the same code gives them a version conflict. A third learner installs Seurat in R without seeing an error, yet after opening a different project the next day, the original analysis no longer runs.

All of these situations may look like “the software is broken,” but they can originate from different layers:

- the computer cannot find R or Python;
- the package was installed into a different environment;
- two packages require incompatible versions of the same dependency;
- the code uses a feature that existed in an older version but changed in a newer one;
- a system component required by the package is missing; or
- the R or Python that runs the code is not the one you think it is.

This lesson does not ask you to memorize every installation tool. Its goal is to build a clear map of the computing environment. When you see a script or an error, you should know which layer to inspect first instead of immediately reinstalling everything.

![Layered structure of a computing environment: hardware, operating system, R or Python, project environment, packages, and analysis scripts](figures/computational-environment-layers.en.png)

*Figure 1 | Whether an analysis script can run depends on several connected layers. The operating system provides the foundation, R or Python interprets the code, project environments separate software used by different projects, packages and their dependencies provide specific functions, and the analysis script and data sit at the top. This project-original, AI-assisted diagram was created with the OpenAI image-generation tool on July 23, 2026. It uses no vendor logos, software screenshots, or third-party layouts. The figure presents the conceptual relationships that beginners need; it does not imply that every tool uses exactly the same installation structure.*

## First Separate Five Terms That Are Often Mixed Together

### 1. R and Python: Languages and Interpreters That Run Code

R and Python are both programming languages. The code you write must be read and executed by the corresponding software.

At this stage, you can think of that software as an **interpreter**. The R interpreter executes R code, and the Python interpreter executes Python code. Installing Python on a computer only gives it the basic ability to execute Python code. It does not mean that Scanpy, pandas, or any other third-party package is already available.

The same computer may contain several Python installations at once, such as:

- Python installed directly in Windows;
- Python inside WSL;
- Python inside a Conda environment; and
- Python inside a virtual environment for a particular project.

They may all appear under the name `python`, but their actual file locations and available packages may be different. R can present similar situations because of system installations, project libraries, or modules provided by a server.

### 2. Packages: Collections of Functions Written by Other People

A **package** is a collection of reusable code, documentation, and related files.

For example:

- Seurat is a commonly used R package for single-cell analysis;
- Scanpy is a commonly used Python package for single-cell analysis;
- ggplot2 provides plotting functions for R; and
- pandas provides table-processing functions for Python.

Installing R or Python is like obtaining a basic laboratory. Installing packages is like bringing microscopes, centrifuges, and pipettes into that laboratory.

The analogy has a limit: software packages are not completely independent instruments. One package often calls other packages or system programs, and they may have strict version requirements.

### 3. Dependencies: The Components a Package Still Needs

If package A must use package B to work, we say that B is a **dependency** of A.

Dependencies can continue through several levels:

```text
Analysis script
  → Package A
    → Package B
      → Lower-level computing library
```

Installation tools usually try to locate these dependencies automatically, but “automatic” does not mean that they can always find a compatible combination.

Suppose package A requires a dependency at version 2.0 or newer, while package C requires the same dependency to remain below version 2.0. There may be no version that satisfies both packages in one environment. Python’s pip may report this situation as `ResolutionImpossible`. R or Bioconductor may similarly report that some packages are too old, too new, or unavailable for the current version.

### 4. Computing Environments: Sets of Conditions That Work Together

Here, an **environment** is not a room. It is the set of conditions actually used when a project runs. It commonly includes:

- the operating system and hardware type;
- the version and location of R or Python;
- installed packages and their versions;
- lower-level libraries required by those packages; and
- some paths, locale settings, or other configuration.

Different environment tools do not manage exactly the same range of components.

- Python’s built-in `venv` can create an isolated Python package directory for a project.
- A Conda environment can manage Python, R, and some lower-level dependencies that are not Python packages.
- R’s renv can give each R project its own package library and record package information in `renv.lock`.

Their shared purpose is to reduce interference between projects.

### 5. Versions: The Same Software Changes Over Time

The same software name does not mean that its behavior stays unchanged forever. Developers fix errors and add features, but they may also change default parameters, function names, file formats, or dependency requirements.

Version numbers often look like `1.4.2`, but do not infer compatibility only from the position of each number. Many projects use a major, minor, and patch version convention, but the exact meaning still depends on that software’s official documentation and release notes.

For a bioinformatics project, it is not enough to write “we used Scanpy” or “we used Seurat.” At minimum, record the version, the installation source, and the R or Python and operating system in which it ran.

## Why Should Each Project Usually Have Its Own Environment?

Imagine that you are working on two projects:

- Project A reproduces a two-year-old single-cell study and needs older package versions.
- Project B is a new spatial transcriptomics analysis and needs newer package versions.

If every package is installed into one shared environment, updating packages for Project B may suddenly break Project A. In the other direction, refusing every update to preserve Project A may prevent Project B from being installed.

A safer arrangement is:

```text
Project A → Environment A → Versions validated for Project A
Project B → Environment B → Versions validated for Project B
```

Environment isolation does not automatically make an analysis correct. It only reduces the computing risk that changing one project will also break another. Biological questions, sample design, parameter choices, and result interpretation still require their own validation.

## Common Ways to Record R and Python Environments

| Project type | Common isolation approach | Common record file or information | What it mainly records |
| --- | --- | --- | --- |
| R project | renv | `renv.lock`, `sessionInfo()` | R, the operating system, and package sources and versions |
| Small Python project | `venv` | `requirements.txt`, Python and pip versions | Packages needed in the current Python environment |
| Python or mixed bioinformatics project | Conda | `environment.yml` or another export file | Python/R, packages, channels, and some lower-level dependencies |

These files are not magical backups.

- `requirements.txt` usually records Python package requirements, but it may not include every lower-level program installed in the operating system.
- `environment.yml` can help another person rebuild a Conda environment, but the available packages and builds may differ between operating systems.
- `renv.lock` can record the package state of an R project, but a suitable R version, operating system, and compilation setup may still be required.

Being able to rebuild an environment is much more reliable than trying to remember what you installed. It still does not mean that every computer will necessarily produce a completely identical environment.

## First Confirm Which R or Python Is Actually Running the Code

The commands below are not an installation tutorial. They are inspection tools for locating a problem.

### Inspect Python in a Terminal

```bash
python --version
python -m pip --version
python -c "import sys; print(sys.executable)"
```

They answer three different questions:

1. What version is the current `python`?
2. Where is the pip called by this Python?
3. What is the actual file path of the current Python interpreter?

The second command deliberately uses `python -m pip` so that pip is called by this particular Python. If you enter `pip` by itself, the system may find a pip that belongs to a different Python installation.

Some Linux systems name the command `python3`. If the official instructions for the software or server use `python3`, follow the actual naming in that environment rather than blindly replacing every command with `python`.

### Inspect R in a Terminal and an R Session

First run this in a terminal:

```bash
R --version
```

After entering R, run:

```r
R.version.string
.libPaths()
sessionInfo()
```

These commands show the R version, the directories where R currently looks for packages, and information about the current R session, operating system, and loaded packages.

Pay attention to where each command runs. `R --version` is a terminal command. `R.version.string`, `.libPaths()`, and `sessionInfo()` are R code that runs after you enter R. Putting them in the wrong place will itself produce an error.

### If You Use Conda

```bash
conda env list
```

An asterisk in the output usually marks the active environment. Confirming the environment name before installing a package helps prevent you from putting software into `base` or another project’s environment.

## What Do Five Common Types of Error Tell You?

| Error or symptom | Most likely layer | First thing to inspect |
| --- | --- | --- |
| `command not found` or “is not recognized as an internal or external command” | The system cannot find the program | Whether the program is installed and whether the terminal can locate its path |
| `ModuleNotFoundError` | The current Python does not contain the module | The current Python path and whether the package was installed into the same environment |
| `there is no package called ...` | The current R package library does not contain the package | `.libPaths()` and whether the package was installed into the library used by this R |
| `ResolutionImpossible` or another dependency conflict | Package version requirements cannot be satisfied together | Which two packages request conflicting versions of the same dependency |
| `cannot open shared object file` or `DLL load failed` | A lower-level system library or compiled component | The operating system, processor type, missing library name, and official requirements |

The table only tells you where to look first. A single line of text cannot always identify one unique cause. When asking for help, preserve the complete command and the output beginning with the first error.

## Diagnose Installation or Runtime Errors in This Order

### Step 1: Do Not Immediately Reinstall Repeatedly

First save the original error. Running many different installation commands in succession may change the environment and make the original problem harder to reproduce.

### Step 2: Confirm Where the Command Runs

Record whether you are using:

- Windows PowerShell;
- a WSL/Linux terminal;
- the R console;
- Python or Jupyter; or
- a remote server.

Saying “I am working on a Windows computer” does not prove that the command runs in Windows. WSL and a remote server can both provide Linux environments.

### Step 3: Confirm the Actual Interpreter and Environment

Record the R or Python version, its actual path, and the Conda or project-environment name. This is especially important when a package was “already installed” but still cannot be found.

### Step 4: Find the First Meaningful Error

Installation logs can be long. The final line may only say that installation failed, while the real cause appeared earlier—for example, a missing system library or a conflict between dependency versions.

Start reading at the first `ERROR`, `Error`, `cannot`, `failed`, or explicit conflict message, and then inspect the lines around it.

### Step 5: Compare the Result with the Software’s Official Requirements

Confirm:

- which operating systems and processor architectures are supported;
- which R or Python versions are supported;
- whether a compiler or system library is required;
- whether installation should use CRAN, Bioconductor, PyPI, a Conda channel, or the software’s official source; and
- whether the tutorial was written for a different software version.

Do not bypass the official requirements simply because an old command from a search result looks shorter.

### Step 6: Change One Condition and Test Again

If you decide to change a package version, create a new environment, or add a system component, change one category at a time and save both the command and the result. This is how you determine which change solved the problem.

## One Single-Cell Project May Use Several Environments

“One project, one environment” is a useful beginner rule, but a real project may call several independent programs.

For example:

```text
Raw 10x data
  → Run Cell Ranger in Linux
  → Produce an expression matrix
  → Use Seurat in an R environment or Scanpy in a Python environment
  → Produce quality-control, clustering, and visualization results
```

Cell Ranger, Seurat, and Scanpy do not necessarily need to be installed in the same environment. What matters is recording each step:

- where it ran;
- what its inputs and outputs were;
- which software version it used;
- which reference genome or annotation version it used; and
- where its logs and environment records were stored.

The same principle applies to single-cell multiomics and spatial omics. An analysis may combine software supplied for a sequencing platform, R or Python packages, image-processing tools, and reference data. The purpose of environment records is not to force all of them into one environment. It is to make the computing conditions of every step traceable.

## Codex Can Help with Installation, but It Cannot Define the “Correct Environment” for You

If you tell Codex only that “Scanpy will not install,” its suggestions will mostly rely on guesses. A more useful request includes:

```text
I am running the command in WSL Ubuntu.
My current Python version is ...
The output of python -m pip --version is ...
My current Conda environment is ...
The complete command I ran is ...
The complete output beginning with the first error is ...
The official installation instructions for this project are ...
First decide whether this is a path, environment, version, dependency,
or system-library problem. Explain the evidence, then propose the
smallest change. Do not upgrade every package.
```

Codex can help you read logs, compare version requirements, and organize diagnostic steps. You still need to confirm:

- whether the documentation it cites matches the current software version;
- whether the command will modify an environment that is already in use;
- whether updating software could affect an analysis that has already been validated; and
- whether the minimal test and important result checks were rerun after the repair.

An important sign of effective AI use is not asking it to try more commands in a row. It is giving it enough evidence about the environment and requiring every change to have a reason that can be tested.

## Keep a Minimum Environment Record for Every Project

When an analysis begins, record at least:

1. the operating system and version;
2. the R or Python version and actual path;
3. the project-environment name;
4. major packages and their versions;
5. the installation source or channel;
6. an environment file such as `renv.lock`, `requirements.txt`, or `environment.yml`;
7. the reference genome, gene annotation, or other reference-data version; and
8. installation and runtime logs.

Code running successfully only shows that the current environment accepted those instructions. Only when the environment, inputs, parameters, software versions, and output checks are also preserved do other people have a chance to understand and rebuild the analysis.

## References and Further Reading

1. [Official Python documentation: creating virtual environments with `venv`](https://docs.python.org/3/library/venv.html)
2. [Python Packaging User Guide: dependencies and requirements files](https://packaging.python.org/en/latest/discussions/install-requires-vs-requirements/)
3. [Official pip documentation: dependency resolution and conflicts](https://pip.pypa.io/en/stable/topics/dependency-resolution/)
4. [Official Conda documentation: managing and sharing environments](https://docs.conda.io/projects/conda/en/stable/user-guide/tasks/manage-environments.html)
5. [Official renv documentation: project-local environments for R](https://rstudio.github.io/renv/articles/renv.html)
6. [Official Bioconductor installation instructions](https://bioconductor.org/install/)
7. [Official R documentation: `sessionInfo()`](https://stat.ethz.ch/R-manual/R-devel/library/utils/html/sessionInfo.html)
