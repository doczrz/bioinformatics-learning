# 0.3｜You do not have to write it by hand, but you must understand it: R basics and code reading

Suppose you give Codex a cell quality-control table and ask it to select cells that might be retained. It returns the following R code:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

Even if you do not plan to write this code yourself from a blank page, you must still be able to answer:

- Which file does the code read?
- What do `cells`, `keep`, and `filtered_cells` each contain?
- Which cells will be retained?
- How are missing values handled?
- What does the last line calculate?
- Where do `500` and `10` come from, and are they suitable for your data?

If you cannot answer these questions, you cannot tell whether the code is processing the correct data or silently removing cells that should have been retained.

The goal of this lesson is not to make you memorize R syntax, and certainly not to make you reproduce programs from memory without documentation. What you need to develop is the ability to read code: when you see a piece of R code, you should be able to identify where data enter, how they change, where the results go, and which analytical decisions remain the researcher's responsibility.

This lesson assumes that you already know R is an environment for statistical computing and data analysis, and that packages and project environments affect whether code can run. You do not need to install any software in advance, and no programming experience is required.

The code blocks in this lesson are mainly for reading; you do not need to run them now. If you want to follow along, run the R code in the R console or an R script. A filename without a full path, such as `"cell_metadata.csv"`, is looked up relative to the current working directory. You can run `getwd()` first to see where that directory is.

On your first reading, you can divide the material into two levels:

- **You must understand:** objects, assignment, functions, data frames, indexing, logical conditions, `NA`, and filtering;
- **For now, you only need to recognize:** vector recycling, sparse matrices, `[[]]`, different pipes, namespaces, loops, and custom functions. When you encounter these structures, it is enough to know that you should ask AI for an explanation or consult the official documentation.

## "Vibe coding" does not mean code no longer needs to be understood

"Vibe coding" is an informal term. It usually refers to describing a task in natural language and letting AI generate, modify, and run the code, without the user having to type every instruction character by character.

This way of working genuinely lowers the burden of memorizing syntax. You can ask Codex to:

- generate R code for a task;
- explain an error;
- organize repeated steps into a script;
- find where an object was created or modified;
- check function arguments against the documentation;
- run code and show intermediate results.

As a result, the ability to write everything from scratch is no longer the only measure of analytical ability.

However, a natural-language request must still be converted into precise computational operations. A computer cannot understand a vague intention such as "remove low-quality cells." It can only execute an explicit condition such as "remove rows where `n_genes < 500`." If AI misunderstands a column name, data unit, missing value, or comparison direction, the code may still run without an error.

Therefore, this course asks beginners to meet the following standard:

> You do not have to write code from memory, but you must be able to translate the key code into ordinary language and check whether that translation matches the research question.

This does not mean that you must understand every internal mechanism of R. Just as reading an English-language paper does not require you to become a linguist first, reading analysis code can begin with the most common structures, while you consult documentation when needed.

## First, recognize the parts of one line of R code

Consider this line:

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

You can read it from right to left:

1. `cells$n_genes`: take the column named `n_genes` from `cells`;
2. `mean(...)`: call the function that calculates the mean;
3. `na.rm = TRUE`: remove missing values before the calculation;
4. `<-`: give the result produced on the right to the name on the left;
5. `average_genes`: the name of the object that stores the result.

In ordinary language:

> Take the column containing the number of detected genes from the cell table, calculate its mean after ignoring missing values, and store the result as `average_genes`.

This kind of translation is at the heart of reading code. You can look up a function name and ask Codex about an argument, but you must be able to explain the input, action, conditions, and result.

## Objects: R uses names to store data and results

The things R creates and processes are usually called objects. Numbers, text, tables, matrices, functions, and complex single-cell data containers can all be objects.

```r
gene_name <- "MS4A1"
cell_count <- 1200
analysis_ready <- TRUE
```

This code creates three objects:

| Object | Stored value | Common meaning |
| --- | --- | --- |
| `gene_name` | `"MS4A1"` | Text |
| `cell_count` | `1200` | Number |
| `analysis_ready` | `TRUE` | Logical value |

R is case-sensitive, so `cell_count`, `Cell_Count`, and `CELL_COUNT` are three different names.

An object name should help the reader understand its contents. `cell_metadata` is usually easier to review than `x`, and `filtered_cells` is usually easier to follow than `result2`. Short names can be reasonable in a formula or a very short temporary calculation, but they increase the risk of misreading a long analysis workflow.

## Assignment: `<-` means saving a result under a name

```r
cell_count <- 1200
```

You can read the assignment operator `<-` as "save the value on the right under the name on the left." It consists of `<` immediately followed by `-`.

R also allows `=` for assignment in many places, but a common convention is:

- use `<-` to create or update an object;
- use `=` to specify an argument inside a function call.

```r
average_genes <- mean(cells$n_genes, na.rm = TRUE)
```

This convention makes it easier to distinguish "save the result" from "set a function argument."

Assignment can overwrite an existing object, usually without asking again:

```r
threshold <- 500
threshold <- 1000
```

After the second line runs, `threshold` contains `1000`. When reading AI-generated code, pay particular attention to whether the same object is assigned a new value later.

## Comments, quotation marks, and parentheses

### Everything after `#` is a comment

```r
# This is explanatory text and will not be executed as a calculation
threshold <- 500  # A provisional threshold, not a universal biological standard
```

Everything from `#` to the end of that line is a comment. A good comment explains why something is being done or where a decision came from, rather than simply reading the code aloud.

Comments can become outdated. When code changes, an old comment is not updated automatically. You therefore need to inspect the expression that actually runs instead of trusting the comment alone.

### Quotation marks enclose text

```r
cell_type <- "CD4 T cell"
```

`"CD4 T cell"` is a string, meaning a text value. Without quotation marks, `cell_type` would usually refer to the name of an object.

```r
cell_type == "CD4 T cell"
```

This line compares the object `cell_type` with the specified text to see whether they are equal.

### Parentheses indicate a function call or control the order of calculation

```r
mean(c(10, 20, 30))
```

The outer `mean(...)` calls the function that calculates a mean. The inner `c(...)` first combines the three numbers into a vector.

Parentheses can also make the order of operations explicit:

```r
1 + 2 * 3
(1 + 2) * 3
```

These two lines produce different results. When you see a complex condition, do not guess its precedence by sight. Asking AI to add parentheses often makes the code easier to review.

## Functions: receive input, perform an action, and return a result

A function can be understood as an operation that has been given a name.

```r
mean(c(10, 20, 30))
```

This line contains:

- the function name: `mean`;
- the input passed to the function: `c(10, 20, 30)`;
- the returned value: `20`.

Many functions have optional arguments:

```r
mean(c(10, NA, 30), na.rm = TRUE)
```

`na.rm = TRUE` means to remove missing values before calculating the mean, so the result is `20`. Without this argument, the result would usually be `NA`.

Here, `na.rm` is the argument name, and `TRUE` is the value supplied for that argument in this function call.

Named arguments are easier to read than values supplied only by position:

```r
read.csv(file = "cell_metadata.csv", check.names = FALSE)
```

You do not have to guess what the second value means. When reading an unfamiliar function, you can view its help in R:

```r
?mean
args(mean)
```

`?mean` opens the function documentation, while `args(mean)` shows the usual argument form. For a package function, also consult the official documentation for the version currently installed, because arguments and default behavior can change between versions.

## Vectors: one sequence of values of the same type

A vector is one of R's most basic data structures. For now, you can think of it as an ordered sequence of values.

```r
n_genes <- c(820, 410, 1250, 670)
cell_types <- c("T cell", "B cell", "T cell", "Monocyte")
passed_qc <- c(TRUE, FALSE, TRUE, TRUE)
```

In `c()`, the `c` stands for combine or concatenate: the function joins multiple values into a vector.

Values in an atomic vector are converted to the same basic type. The following code places numbers and text in one vector:

```r
mixed <- c(1, "2", 3)
```

To keep every element the same type, R converts these values to text. Calculating the mean of `mixed` directly will then fail. If AI-generated code accidentally introduces text into a numeric column, later calculations can encounter type-conversion problems.

### Vector operations usually work element by element

```r
n_genes >= 500
```

If `n_genes` contains four values, the result also contains four logical values:

```text
TRUE FALSE TRUE TRUE
```

This does not answer whether the entire column is greater than or equal to 500. It tests each position separately.

When two vectors have different lengths, some R operations repeat the values in the shorter vector. This is called recycling. Sometimes it is intentional; at other times, it creates errors that are difficult to notice. When objects of different lengths take part in the same operation, check `length()` or the data dimensions first. Do not assume R will match them according to your biological groups.

## Data frames: organize different types of data into rows and columns

A data frame is a common tabular structure in R. Each column can have a different type, but all columns must correspond to the same number of rows.

The following code creates an entirely fictional cell table:

```r
cells <- data.frame(
  cell_id = c("cell_1", "cell_2", "cell_3", "cell_4"),
  sample = c("control", "control", "disease", "disease"),
  n_genes = c(820, 410, 1250, NA),
  percent_mito = c(4.2, 12.8, 6.1, 3.5)
)
```

You can read it as:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_2 | control | 410 | 12.8 |
| cell_3 | disease | 1250 | 6.1 |
| cell_4 | disease |  missing | 3.5 |

These numbers are used only to explain syntax. They are not recommended quality-control thresholds for any single-cell experiment. Real thresholds must be chosen with the tissue, experimental protocol, sequencing depth, cell or nucleus type, distribution shape, and downstream goal in mind.

Common checks when reading an unfamiliar data frame include:

```r
dim(cells)
names(cells)
head(cells)
str(cells)
```

They help you confirm, respectively:

- how many rows and columns there are;
- what the column names are;
- what the first few rows look like;
- the type of each column and the structure of the whole object.

These checks do not prove that the data are biologically correct, but they can reveal an empty table, a misspelled column name, numbers imported as text, or rows and columns oriented differently from what you expected.

## Matrices, lists, and specialized objects: first know what you are reading

In addition to vectors and data frames, bioinformatics code often uses:

| Structure | Intuitive description | Common use |
| --- | --- | --- |
| Matrix | Rows and columns, usually with every element of the same basic type | Gene-expression matrices, dimension-reduction coordinates |
| List | A container that can hold objects of different types | Storing multiple results, parameters, or nested objects |
| Specialized object | An object with a package-defined structure and methods | Analysis objects such as Seurat and SingleCellExperiment |

Even when the same expression, such as `object[1]`, is used, different object types can return different kinds of results. Before reading the code, use `class(object)` and `str(object)` to confirm the object type instead of guessing from its name.

Large single-cell objects may also use a sparse matrix. A sparse matrix mainly records nonzero values, reducing the storage required when most entries are zero. Do not ask AI to convert one casually into an ordinary dense matrix simply to make it "look like a normal table": this conversion can greatly increase memory use.

## Indexing: `[]`, `[[]]`, and `$` all select part of an object

Indexing means selecting part of an object.

### Positions in R usually start at 1

```r
genes <- c("MS4A1", "CD3D", "LYZ")
genes[1]
```

The result is:

```text
"MS4A1"
```

In R, the first position is usually written as `1`, not `0` as in many other programming languages.

### Data frames use "row, column"

```r
cells[1, 3]
```

This means row 1, column 3.

```r
cells[1, ]
```

This means row 1 and all columns. Leaving the position after the comma empty means "keep everything in this dimension."

```r
cells[, "n_genes"]
```

This means all rows from the column named `n_genes`.

### `$` selects a data-frame column by name

```r
cells$n_genes
```

The result is the `n_genes` column. The object is on the left of `$`, and the name inside that object is on the right.

### `[]` and `[[]]` do not always return the same kind of structure

For lists and some data-frame operations:

- `x[i]` usually retains a subset container;
- `x[[i]]` usually extracts one element itself;
- `x$name` extracts one element or column by name.

At this stage, you do not need to memorize every edge case, but you must know that single and double square brackets are not interchangeable. If AI changes the bracket form, check whether the returned object's `class()`, `length()`, or `dim()` still meets the requirements of the next step.

## Comparisons and logical conditions: filtering rules are hidden in these symbols

Common comparison operators include:

| Expression | Meaning |
| --- | --- |
| `x == y` | Is x equal to y? |
| `x != y` | Is x not equal to y? |
| `x > y` | Is x greater than y? |
| `x >= y` | Is x greater than or equal to y? |
| `x < y` | Is x less than y? |
| `x <= y` | Is x less than or equal to y? |

Remember: `==` compares two values for equality, whereas `<-` performs assignment. They are not the same operation.

Logical conditions can be combined:

| Expression | Meaning |
| --- | --- |
| `!x` | Not x |
| `x & y` | Both x and y are satisfied, tested element by element |
| `x \| y` | At least one of x or y is satisfied, tested element by element |

For example:

```r
cells$n_genes >= 500 & cells$percent_mito < 10
```

This can be translated as:

> For each cell, the number of detected genes is at least 500 and the mitochondrial percentage is below 10.

Changing the direction of one symbol can change which cells are retained. When reviewing filtering code, read every condition as a complete sentence and compare it with the analysis plan.

You may also see `&&` and `||` inside an `if` condition. They are used to form a single control-flow decision, whereas `&` and `|` are commonly used for element-by-element vector comparisons. This lesson does not require you to master all their evaluation rules, but do not allow AI to exchange them without explaining the length of the resulting value.

## Missing values: `NA` is neither 0 nor the text `"NA"`

`NA` indicates that the value at a position is unavailable or missing. It is not equal to 0:

- 0 can mean that the measured result was zero;
- `NA` means there is no usable value at that position.

`NA` is also different from the string `"NA"`, which is simply text made from two letters.

Use the following code to check for missing values:

```r
is.na(cells$n_genes)
```

Do not use:

```r
cells$n_genes == NA
```

When a missing value is used in a comparison, the result is usually still `NA`, because R cannot determine whether the comparison is true or false.

This directly affects filtering:

```r
keep <- cells$n_genes >= 500 &
  cells$percent_mito < 10
```

If `n_genes` or `percent_mito` is missing, the corresponding position in `keep` may also be `NA`. A more explicit approach states how missing values should be handled:

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10
```

This code explicitly requires both `n_genes` and `percent_mito` to be non-missing, so `keep` contains only `TRUE` or `FALSE`.

This is still only a computational rule; it is not automatically the correct scientific decision. Missing values may result from an import failure, an incorrect column type, an upstream program that did not produce a metric, or a genuinely unmeasurable state. Before deleting them, find out why they are missing.

## Filtering rows with a logical vector

Continue with the fictional `cells` data frame:

```r
keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
```

The first block creates a logical vector with the same length as the number of data rows. The second block uses that vector to retain rows corresponding to `TRUE`.

The expected result is:

| cell_id | sample | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| cell_1 | control | 820 | 4.2 |
| cell_3 | disease | 1250 | 6.1 |

This result contains only the candidate metadata rows and their corresponding cell IDs. It does not mean that the expression matrix, other omics modalities, dimension-reduction results, or spatial coordinates have been filtered at the same time. In a real project, every related object must be filtered using verified, stable identifiers. You must then confirm that the identifiers, counts, and order still match after filtering. Package-specific operations are deferred to the relevant analysis lessons.

You can review this code in the following order:

1. Does the length of `keep` equal `nrow(cells)`?
2. Does `keep` still contain any `NA` values?
3. How many rows are there before and after filtering?
4. Which rows were removed?
5. Did the thresholds come from predefined rules or inspection of the data distributions?

Useful checking code includes:

```r
length(keep)
table(keep, useNA = "ifany")
nrow(cells)
nrow(filtered_cells)
```

An expected number of output rows only shows that the filter ran according to the code. It does not prove that the thresholds are biologically appropriate.

## The `|>` pipe: pass the previous result to the next step

Pipes often appear in R code:

```r
cells |>
  head(2)
```

The base R pipe `|>` passes the result on its left to the function on its right, so the code above can usually be read as:

```r
head(cells, 2)
```

A pipe arranges consecutive processing steps in reading order:

```r
cells |>
  subset(!is.na(n_genes)) |>
  subset(n_genes >= 500)
```

Read it from top to bottom:

1. Start with `cells`;
2. retain rows where `n_genes` is not missing;
3. then retain rows where `n_genes` is at least 500.

A pipe does not automatically record every intermediate object, nor does it prove that each step is correct. When a chain becomes too long, ask Codex to split it into named intermediate objects and show the number of rows and columns after important steps.

The base pipe `|>` has been available since R 4.1.0. If an older environment cannot parse it, check the R version first rather than blindly replacing every pipe symbol. You may also encounter `%>%`, which is provided by the `magrittr` package. The two pipes are often used to create similar reading flows, but their details are not completely identical.

## Package code: first identify where a function comes from

Both of the following forms are common:

```r
library(dplyr)
filtered_cells <- filter(cells, n_genes >= 500)
```

```r
filtered_cells <- dplyr::filter(cells, n_genes >= 500)
```

`library(dplyr)` loads and attaches the package, allowing its exported functions to be called directly by name.

`dplyr::filter` explicitly says to use the `filter` function from the `dplyr` package. When reviewing a script, this form helps identify the function's source and reduces ambiguity when different packages contain functions with the same name.

Also pay attention to how missing values behave. When base R uses a logical vector containing `NA` in `cells[keep, ]`, it may produce unknown rows whose contents are missing. `dplyr::filter()` retains only rows for which the condition is `TRUE`. Do not let this difference in defaults decide your missing-value policy for you. First define which metrics may be missing and how those missing values should be handled.

When you see an unfamiliar function, first ask:

- Does it belong to base R or to a package?
- Is that package installed in the current environment?
- Which version of the package is being used?
- Does the function modify its input object, write a file, or only return a new object?
- Are its default arguments suitable for the current data?

Do not guess behavior from a function name alone. For example, `filter` may not describe the same operation in different packages or contexts.

## `if`, loops, and custom functions: recognize control structures first

An AI-generated script may contain control flow. You do not need to write it yourself yet, but you should recognize it.

### `if`: run code only when a condition is satisfied

```r
if (nrow(filtered_cells) == 0) {
  warning("No cells remain after filtering")
}
```

In ordinary language:

> If the filtered data frame has 0 rows, produce a warning.

The braces `{}` enclose the code that runs when the condition is satisfied.

### `for`: repeat an operation for a collection of items

```r
marker_genes <- c("MS4A1", "CD3D", "LYZ")

for (gene in marker_genes) {
  print(gene)
}
```

This code assigns each gene name in turn to the object `gene` and then prints it. In a real loop, you must also check where each result is saved, whether filenames can overwrite one another, and whether the loop continues after one iteration fails.

### `function`: define a reusable operation

```r
calculate_average <- function(values) {
  mean(values, na.rm = TRUE)
}
```

This code defines a function named `calculate_average`. It receives `values` and returns their mean after ignoring missing values.

When reading a custom function, identify at least:

- its input arguments;
- what the function does to the input;
- its default arguments;
- its return value;
- whether it reads or writes objects and files outside the function.

## Errors, warnings, and messages are not the same

R can produce different types of feedback as it runs:

| Type | Common meaning | Check first |
| --- | --- | --- |
| Error | The current expression cannot be completed | The first error, whether the object exists, and whether the function and arguments are correct |
| Warning | The code usually continues, but R detected a possible problem | Which step produced the warning and whether the output is still usable |
| Message | The software reports status or explanatory information | Whether it mentions a version, method change, or important default behavior |

"No Error" does not mean "no Warning," and neither one means the analysis is correct. AI sometimes uses functions that hide messages or warnings to make the output look cleaner. During review, confirm that it has not hidden important evidence at the same time.

If the R console displays a `+` prompt, a common reason is that the previous expression is incomplete—for example, it is missing a closing parenthesis, quotation mark, or brace. Here, `+` is a prompt waiting for more input, not the result of addition.

## Review AI-generated R code in a fixed order

When faced with dozens of lines of code, you do not need to struggle through every symbol first. Start by reconstructing the data flow.

### 1. Confirm where the code runs and which environment it uses

Record the R version, project environment, and package versions. The `|>` syntax, function arguments, or object structures may depend on versions.

### 2. Find every external input

Search for code that reads files, databases, or network resources, such as:

```r
read.csv("cell_metadata.csv")
readRDS("seurat_object.rds")
```

Confirm the path, file format, sample identity, and reference version.

### 3. List the important objects

List the names on the left side of assignment operators:

```text
cells
keep
filtered_cells
average_genes
```

Then write a one-sentence plain-language description of each object.

### 4. Follow every change to each object

Check where an object is created, filtered, merged, renamed, or overwritten. Do not trust that an object was filtered as intended merely because its name contains `filtered`.

### 5. Translate every filter and comparison into a sentence

Check especially:

- the direction of `>` and `<`;
- `&` compared with `|`;
- whether equality is included;
- how missing values are handled;
- whether a condition applies to cells, samples, genes, or another unit;
- where thresholds and group labels came from.

### 6. Find operations that write files or change system state

Confirm the output path, filename, and whether an existing result could be overwritten. Installing packages, deleting files, and calling system commands also change state.

### 7. Check key intermediate results

After important steps, request output such as:

```r
class(object)
dim(object)
head(object)
summary(object)
```

Choose checking functions that suit the object type. Printing an entire large single-cell object can be slow and difficult to read; inspect its summary, dimensions, and key metadata instead.

### 8. Finally, review the scientific meaning

Syntax only tells you how a calculation is executed. You must also ask:

- Does each row represent a cell, a nucleus, a spatial location, or a biological sample?
- Do the group labels match the sample table?
- What are the independent biological replicates?
- Could the filtering rules systematically remove a particular cell type?
- Do the gene identifiers, reference genome, and annotation version match?
- Which conclusions can the calculation support, and which can it not support?

## When asking Codex to explain code, require evidence that you can verify

You can give Codex the code together with the following request:

```text
Please do not modify or run this R code yet.

1. Explain each section of the code in execution order.
2. List every input file, output file, and object that is created.
3. For each object, state its type, expected dimensions, and biological meaning.
4. Translate every filtering condition into plain language.
5. Mark all missing-value handling, object overwriting, file writing,
   file deletion, package installation, and system commands.
6. Mark every place that depends on a package version or default argument.
7. Distinguish "syntactically runnable" from "scientifically validated."
8. Provide the smallest read-only checking code, but do not change the
   original data or environment.
```

AI's explanation also needs to be checked. The most direct checks include:

- consulting the official function documentation for the version in use;
- inspecting the real object with `class()`, `dim()`, `names()`, and `str()`;
- running one step on a very small example;
- comparing the row counts and removed objects before and after filtering;
- retaining the original script and its execution log.

## AI-generated code patterns that should make you stop and check

The following code is not necessarily wrong, but it should not be run without understanding it:

| Expression | Possible effect | Ask before running |
| --- | --- | --- |
| `rm(list = ls())` | Deletes objects in the current R workspace | Are there unsaved objects or evidence? |
| `setwd("an/absolute/path")` | Changes the base location for later relative paths | Is this a path from the author's own computer? |
| `install.packages(...)` | Changes the current R package environment | Should it be installed in the project environment with its version recorded? |
| `na.omit(data)` | Removes rows containing missing values | How many rows will be removed, and why are values missing? |
| `write.csv(..., "original_input_file.csv")` | May overwrite an input file | Does the output use a new path and preserve the original data? |
| `unlink(...)` | Deletes a file or directory | What exactly is the target path, and can it be recovered? |
| `system(...)` | Calls an operating-system command | Where will the command run, and what will it read or modify? |
| `<<-` | May modify an object outside the function | Why is global state being changed? |

Other operations may look safe but can still change the conclusion:

- selecting data only by column position instead of column name;
- comparing a percentage with a proportion without checking the unit;
- treating every cell as an independent biological replicate;
- changing filtering thresholds after looking at group results;
- hiding every warning;
- overwriting objects with the same name so the original and processed data cannot be distinguished.

The goal of review is not to forbid all shortcuts. It is to know which information each shortcut leaves out.

## Fully understanding the opening example

Now read the code from the beginning of this lesson again:

```r
cells <- read.csv("cell_metadata.csv")

keep <- !is.na(cells$n_genes) &
  !is.na(cells$percent_mito) &
  cells$n_genes >= 500 &
  cells$percent_mito < 10

filtered_cells <- cells[keep, ]
average_genes <- mean(filtered_cells$n_genes, na.rm = TRUE)
```

In ordinary language:

1. Read `cell_metadata.csv` from the current path and store it as the data frame `cells`;
2. for every row, check that neither `n_genes` nor `percent_mito` is missing, that `n_genes` is at least 500, and that `percent_mito` is below 10;
3. only rows that meet all four conditions receive `TRUE` in `keep`;
4. use `keep` to filter `cells` and store the result as `filtered_cells`;
5. calculate the mean of `n_genes` among the filtered cells, removing any remaining missing values during the calculation;
6. store the mean as `average_genes`.

When an unassigned expression is entered by itself in an interactive R console, its result is usually displayed automatically. You should not rely on automatic display when code is run with `source()` or by another script-based method. To record a result reliably, assign it to an object and explicitly run `print(average_genes)` or write it to an output file when needed.

Researchers still need to answer important questions about this code:

- Is the input file really the cell metadata for the current project?
- Are the column names and units correct?
- What is the basis for the thresholds `500` and `10`?
- Should other quality metrics also be checked?
- How many cells from each sample were retained?
- Could these rules systematically bias the results for certain tissues, cell types, or nucleus data?
- Why is the final calculation the mean number of genes per cell, and which question is it meant to answer?

Understanding code does not mean predicting every punctuation mark. It means separating the computational procedure from the scientific decisions and recognizing which evidence is still missing.

## The minimum code literacy to retain from this lesson

When you encounter R code, you do not need to rewrite it from memory, but you should at least be able to:

- recognize objects, assignment, functions, arguments, comments, and strings;
- distinguish vectors, data frames, matrices, lists, and specialized objects;
- understand common indexing, comparisons, logical conditions, and pipes;
- know that `NA` must be handled explicitly;
- trace inputs, object changes, and outputs;
- find operations that may overwrite objects, modify the environment, or delete files;
- check AI's explanation against real object structures and official documentation;
- explain which validations are still needed between successful code execution and a valid biological conclusion.

In an era when AI can generate code quickly, memorizing syntax can become less important, but understanding code becomes even more important. The faster code is generated, the more important it is for someone to see exactly what it does.

## References

1. [R Core Team: An Introduction to R](https://cran.r-project.org/doc/manuals/r-release/R-intro.html)
2. [R Core Team: The R Language Definition](https://cran.r-project.org/doc/manuals/r-release/R-lang.html)
3. [Official R documentation: Assignment operators](https://stat.ethz.ch/R-manual/R-patched/library/base/html/assignOps.html)
4. [Official R documentation: Extract or replace parts of an object](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Extract.html)
5. [Official R documentation: Data frames](https://stat.ethz.ch/R-manual/R-patched/library/base/html/data.frame.html)
6. [Official R documentation: Missing values, `NA`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/NA.html)
7. [Official R documentation: Relational and logical operators](https://stat.ethz.ch/R-manual/R-patched/library/base/html/Comparison.html)
8. [Official R documentation: The base pipe `|>`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/pipeOp.html)
9. [Official R documentation: Loading packages and function namespaces](https://stat.ethz.ch/R-manual/R-patched/library/base/html/library.html)
10. [Official R documentation: Running scripts with `source()`](https://stat.ethz.ch/R-manual/R-patched/library/base/html/source.html)
11. [Official dplyr documentation: Keep rows that match a condition with `filter()`](https://dplyr.tidyverse.org/reference/filter.html)
