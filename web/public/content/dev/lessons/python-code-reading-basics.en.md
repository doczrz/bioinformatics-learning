# 0.4｜You do not have to write it by hand, but you must understand it: Python basics and code reading

Suppose you give Codex a cell quality-control table and ask it to select the cells that might be retained. It returns the following Python code:

Here, `cell_metadata.csv` is a fictional cell metadata table. In this example, each row represents a candidate cell awaiting quality control; `cell_id` is the cell identifier; `sample_id` indicates which biological sample the cell came from; `n_genes` is the number of genes detected in that cell; and `percent_mito` is the percentage of total counts assigned to mitochondrial genes, so the value `10` means 10%, not 0.10. These field names and thresholds are conventions used only in this lesson. For real data, you must check them again against the object documentation, experimental protocol, and units.

```python
from pathlib import Path

import pandas as pd

metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)

required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")

keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)

filtered_cells = cells.loc[keep].copy()
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

This code will serve as the running example for the lesson. We will work through the following reading clues in order:

- Data enter from `cell_metadata.csv`.
- `cells`, `missing_columns`, `keep`, and `filtered_cells` refer to objects at different stages.
- Indentation determines whether `raise` belongs to the `if` block.
- The filtering conditions jointly determine which rows are retained and how missing values are handled.
- The outer parentheses let a long condition span several lines, while the parentheses around the comparison expressions ensure that `&` combines the row-by-row results as intended.
- `.loc`, `.copy()`, and `.mean()` perform selection, copying, and calculation, respectively.
- `500` and `10` are thresholds that a researcher must still judge against the current data.

Only when you can explain these clues in ordinary language can you judge whether the code reads the correct file, uses the correct columns, or might remove reasonable biological signal as though it were low-quality data.

The goal of this lesson is not to make you memorize Python syntax or reproduce a program from memory without documentation. You need to develop code-reading ability: when you see Python code, you should be able to identify where data enter, how they change, where the output goes, and which computational decisions remain the researcher's responsibility.

This lesson assumes that you already know Python is a programming language commonly used for data processing, automation, and bioinformatics analysis, and that packages and project environments affect whether code can run. You do not need to install any software in advance, and no programming experience is required.

The code blocks in this lesson are mainly for reading; you do not need to run them now. If you want to follow along, first confirm where the code will run: a Python interactive interpreter, a script with the `.py` extension, or a Jupyter notebook. A filename without a full path, such as `"cell_metadata.csv"`, is looked up relative to the current working directory. In Python, you can use `Path.cwd()` to see that location.

On your first reading, you can divide the material into two levels:

- **You must understand:** indentation, names and assignment, common data types, lists and dictionaries, indexing and slicing, functions and methods, comparisons and logical conditions, missing values, imports, and table filtering.
- **For now, you only need to recognize:** list comprehensions, generators, context managers, decorators, classes, type annotations, NumPy arrays, sparse matrices, and AnnData. When you encounter these structures, it is enough to know that you should ask AI for an explanation or consult the official documentation.

If this is your first reading, follow four short paths through the lesson. First understand execution locations, the parts of one line of code, and indentation. Next, understand names, objects, basic types, lists, dictionaries, and sets. Then move to functions, methods, imports, ordinary logic, and row-by-row pandas logic. Finally, read the sections on missing values and DataFrame filtering, followed by the complete example at the end. On a first pass, you only need to recognize tuples, `while`, list comprehensions, and the detailed list of risky operations; you do not need to memorize or write them.

Except for the section that reads the opening example in full, the shorter code blocks in this lesson are mainly reading fragments that depend on objects introduced earlier. Do not assume that each fragment is a complete script that can run by itself.

## "Vibe coding" does not mean you no longer need to understand Python

"Vibe coding" is an informal term. It usually means describing a task in natural language and letting AI generate, modify, and run the code, without the user having to type every instruction character by character.

This way of working genuinely lowers the burden of memorizing syntax. You can ask Codex to:

- generate Python code for a task;
- explain a traceback, which is the call path shown when an error occurs;
- organize repeated steps into a script;
- find where a name was assigned or modified;
- check function arguments against the official documentation;
- run code and show important intermediate results.

Therefore, the ability to write everything from scratch is no longer the only measure of analytical skill.

However, natural-language requests are still converted into exact operations. A computer does not automatically understand the experimental design behind "remove low-quality cells." It only executes a condition such as "retain rows where `n_genes >= 500` and `percent_mito < 10`." If AI misunderstands a column name, percentage unit, missing value, or comparison direction, the code may still run successfully.

For that reason, this course asks beginners to meet the following standard:

> You do not have to write Python from memory, but you must be able to translate important code into ordinary language and check whether that translation matches the research question.

This does not mean that you must understand every internal mechanism in Python. You can begin by learning the most common structures in analysis code and consult the documentation when needed.

## First confirm where the Python code runs

The same Python code can appear in different places. Its execution location affects how you enter it, the working directory, which objects already exist, and how results are displayed.

### Interactive interpreter

Entering `python`, or `python3` on some systems, in a terminal may start the Python interactive interpreter. A common prompt is:

```text
>>>
```

In a tutorial, `>>>` means "input begins here"; it is not part of the code. Do not copy the prompt when copying an example.

In the interactive interpreter, entering an expression directly will usually display its result:

```python
2 + 3
```

```text
5
```

If the same line appears in a `.py` script, however, the script will not reliably display a result merely because it contains an expression. When output must be visible, use `print()`, logging, or write the result to a file explicitly.

### Python script

A text file with the `.py` extension is commonly called a Python script. For example:

```text
filter_cells.py
```

A script is suitable for saving a sequence of steps that can be run repeatedly. The terminal command might be:

```text
python filter_cells.py
```

This is a terminal command and should not be placed inside a Python code block. Whether the script can run also depends on which Python the terminal actually invokes, whether the required packages are installed in the current environment, and whether the current working directory is correct.

### Jupyter notebook

A Jupyter notebook divides code into multiple cells. It is useful for step-by-step exploration, but cells are not necessarily executed in the order in which they appear from top to bottom.

If a name exists only in the current kernel's memory, it disappears when the kernel restarts. If you run a lower cell and then return to change an upper cell, the code order visible on the page may also differ from the actual execution order.

When reviewing a notebook, therefore, check:

- whether it can run in order from a fresh kernel;
- which cell first creates each name;
- whether downstream results are recalculated after an upstream cell changes;
- whether important results exist only in memory.

### Check the version and working directory

The following is a terminal command:

```text
python --version
```

The following is Python code:

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

Do not assume that a code window uses the version and environment you expect merely because its title says "Python." The version, interpreter path, project environment, and working directory can all affect the result.

## First recognize the parts of one line of Python

Consider this line:

```python
average_genes = filtered_cells["n_genes"].mean()
```

You can read it from right to left:

1. `filtered_cells["n_genes"]`: take the column named `n_genes` from the table;
2. `.mean()`: call the method provided by that column to calculate the mean;
3. `=`: bind the result on the right to the name on the left;
4. `average_genes`: use this name to refer to the calculated result later.

In ordinary language:

> Take the `n_genes` column from the filtered cell table, calculate its mean, and make the name `average_genes` refer to that result.

You can look up function names and method parameters in the documentation, but you must still be able to explain the input, action, and result.

## Indentation: Python uses spaces to show which level code belongs to

Many languages use braces to mark a group of code. Python mainly uses indentation.

```python
if cell_count == 0:
    print("No cells are available for analysis")

print("Check complete")
```

This code means:

- if `cell_count == 0` is `True`, run the indented `print()`;
- the final line runs whether or not the condition is met because it has returned to the outermost level.

The colon `:` at the end of the `if` line indicates that a code block follows. Every line in the block must use a consistent indentation level. A common style is four spaces for each level.

The following two pieces of code may both be valid Python, but they mean different things.

```python
if cell_count == 0:
    print("No cells are available for analysis")
    raise ValueError("The filtering result is empty")
```

```python
if cell_count == 0:
    print("No cells are available for analysis")

raise ValueError("The filtering result is empty")
```

The first stops only when the cell count is 0. The second stops regardless of the cell count. When AI changes indentation, it may change program logic even if it does not create a syntax error.

Do not mix tabs and spaces to express indentation in the same file. Some mixtures trigger a `TabError`; more dangerously, code may look aligned in an editor while its actual levels do not match your intention.

## Names, objects, and assignment

Numbers, text, lists, functions, and tables in Python can all be treated as objects. A name lets code refer to an object again.

```python
gene_name = "MS4A1"
cell_count = 1200
```

Here:

- `"MS4A1"` is a string object;
- `1200` is an integer object;
- `gene_name` and `cell_count` are names;
- `=` performs assignment, making the name on the left refer to the object on the right.

Python does not require you to declare that "this name can only hold an integer from now on." The same name can be reassigned:

```python
cell_count = 1200
cell_count = "1200"
```

After the second line runs, `cell_count` refers to the text `"1200"`, not the number `1200`. This code may be valid, but later mathematical operations will produce a different result or an error.

### `=` assigns; `==` compares

```python
cell_count = 1200
cell_count == 1200
```

The first line gives a value to a name. The second asks whether the two values are equal, producing `True` or `False`.

When reviewing a condition, check especially carefully whether AI has confused `=` with `==`.

### Reassignment is not copying

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

At this point, `genes` and `selected_genes` refer to the same list. Modifying the list through either name changes what the other name sees.

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

If you need a separate outer list, make the copy explicit:

```python
selected_genes = genes.copy()
```

The elements in this example are immutable strings, so appending a new gene to `selected_genes` will not change `genes`. However, `list.copy()` copies only the outer list. If the list contains other mutable objects, those inner objects may still be shared.

"Assignment simply gives an object another name" is a useful introductory model, but it is not a complete model of Python memory management. At this stage, you only need to remember that when an object is mutable, you must not automatically interpret `a = b` as "make a separate copy that cannot affect the original."

## Comments, strings, and formatted text

### Text after `#` is usually a comment

```python
# Read the cell metadata
cells = pd.read_csv("cell_metadata.csv")
```

A comment is not executed as part of the calculation, but comments can become outdated. If code and a comment disagree, judge from the code that actually runs, the object structure, and the result rather than trusting the comment alone.

If `#` appears inside quotation marks, it is simply part of a string:

```python
color = "#2855c5"
```

### Quotation marks enclose strings

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

Both single and double quotation marks can represent ordinary strings. Adding quotation marks around digits turns them into text:

```python
threshold_number = 500
threshold_text = "500"
```

`threshold_number` can take part directly in a numerical comparison; `threshold_text` is a string. After code reads data from a CSV file, you should also check whether each column was recognized as the expected data type.

### An f-string places object values inside text

```python
cell_count = 1200
message = f"Retained {cell_count} cells"
print(message)
```

The `f` prefix means that `{cell_count}` inside the string is replaced by its current value.

```text
Retained 1200 cells
```

An f-string is useful for logs and error messages. The content inside braces is still executed, so do not treat it as static text.

## Common basic types: first distinguish numbers, text, truth values, and no value

| Type | Example | Introductory interpretation |
| --- | --- | --- |
| `int` | `1200` | An integer |
| `float` | `7.5` | A numerical value with a decimal part |
| `str` | `"MS4A1"` | A string, meaning text |
| `bool` | `True`, `False` | Logical truth values |
| `NoneType` | `None` | The special Python value meaning "no object" |

You can use `type()` to inspect an object's type:

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

In real analyses, you will also encounter types supplied by NumPy and pandas, such as `int64`, `float64`, `category`, and nullable string types. They are not necessarily identical to Python's built-in types. For now, first confirm whether an object is numerical, textual, logical, or missing, and whether that type is appropriate for the current calculation.

### Type conversion is not data validation

```python
cell_count = int("1200")
```

This converts the text `"1200"` to an integer. However:

```python
cell_count = int("twelve hundred")
```

raises a `ValueError`.

Even a successful conversion does not prove that the original value is biologically reasonable. Converting `"999999"` to an integer does not automatically prove that the sample really contains that many cells.

## Containers: organize multiple values together

### List `list`

A list uses square brackets, preserves element order, and can be modified.

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

Common operations include:

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` modifies the original list; `len()` returns the number of elements.

### Tuple `tuple`

A tuple commonly uses parentheses and does not let you replace its elements in the same way as a list after it has been created.

```python
matrix_shape = (1200, 20000)
```

This might mean that a matrix has 1,200 rows and 20,000 columns. You must use the object documentation and code to determine whether the arrangement is "cells × genes" or "genes × cells"; you cannot infer it from the two numbers alone.

### Dictionary `dict`

A dictionary associates a key with a value.

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

Retrieve a value by key:

```python
group = sample_to_group["sample_A"]
```

If the key does not exist, square-bracket lookup raises a `KeyError`. Some code uses `.get()`:

```python
group = sample_to_group.get("sample_C")
```

When the key is not found, `.get()` returns `None` by default. This may prevent an immediate error, but it may also allow missing information to flow into later steps, so check how the code handles the returned `None`.

### Set `set`

A set stores unique elements and is commonly written with braces.

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

Here, the minus sign means set difference. `missing_columns` contains columns that are required but not observed:

```text
{'percent_mito'}
```

A set is not suitable for expressing a row order that must be preserved. If output order affects a result or record, sort it explicitly.

## Indexing and slicing: Python usually starts counting from 0

### Select one element by position

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

The results are:

```text
MS4A1
NKG7
```

`[0]` selects the first element, and `[-1]` counts from the end to select the last element. Accessing a position that does not exist raises an `IndexError`.

### A slice normally includes the start but excludes the stop

```python
genes[0:2]
```

The result contains the first two elements:

```text
['MS4A1', 'CD3D']
```

You can interpret `0:2` as the positional interval `[0, 2)`: it includes 0 but excludes 2.

```python
genes[:2]
genes[1:]
```

Omitting the start means starting at the beginning, and omitting the stop means continuing to the end.

### Keep pandas label indexing separate from position indexing

For a pandas table:

- `.loc[...]` primarily selects by row labels, column labels, or logical conditions;
- `.iloc[...]` selects by integer position.

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

The first line selects rows using a logical condition and selects two columns by name. The second line selects the first five rows and first two columns by position.

Do not automatically interpret `.loc[0:2]` as an ordinary Python slice. Label slices can follow rules different from "exclude the stop." Check the index labels and the object documentation first.

## Functions: receive inputs and return results

```python
rounded_value = round(7.456, ndigits=2)
```

This line contains:

- function: `round`;
- first input passed to the function: `7.456`;
- parameter name: `ndigits`;
- value supplied for that parameter: `2`;
- returned result: `7.46`;
- name that stores the result: `rounded_value`.

A parameter is an input name in a function definition. The value actually supplied when calling a function is often called an argument. At an introductory level, it is more important to identify "which input controls which behavior" than to memorize the terminology.

### Positional and keyword arguments

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

Both lines may produce the same result. The second writes the parameter name explicitly and is often easier to read.

However, not every parameter can be changed freely into keyword form. Before calling a third-party function, check the function signature and official documentation for the current version.

### Capture a return value or display it explicitly

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

The first line stores the calculated result, and the second displays it.

If you write only:

```python
filtered_cells["n_genes"].mean()
```

the result will usually be displayed in an interactive interpreter or at the end of a notebook cell. A script should not rely on this automatic display. A reliable analysis should explicitly store, print, log, or write important results.

pandas `Series.mean()` uses `skipna=True` by default, meaning that it skips missing values during the calculation. This example already requires `n_genes` to be non-missing in the filtering condition. However, if filtering leaves no rows, the mean will be displayed as `NaN`, which is not an interpretable analytical result. Before interpreting the mean, confirm that `filtered_cells.empty` is `False` and record the actual number of retained rows. The return value is a numerical scalar; whether it is a Python or NumPy/pandas scalar depends on the column type and software version.

### For a custom function, first inspect inputs, return value, and side effects

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

When reading the function, first find:

1. the function name after `def`;
2. the input parameters inside parentheses;
3. what the indented code does;
4. what `return` returns;
5. whether the function also modifies an external object, file, or environment.

A function without `return` may still have effects by writing a file, modifying an object passed to it, or changing global state. Do not inspect only the return value.

## Methods and attributes: a dot means "continue looking from this object"

```python
cells.columns
cells["n_genes"].notna()
```

Both lines use a dot, but they mean different things.

- `.columns` is an attribute containing information carried by the object; here, it contains the column labels.
- `.notna()` is a method, an operation provided by the object and called here.

The most visible difference is that method calls usually have parentheses, whereas attribute access usually does not.

However, you cannot infer scientific meaning from parentheses alone. Use the object type and documentation to confirm exactly what an attribute or method returns.

### Methods with the same name may behave differently for different object types

```python
genes.copy()
cells.copy()
```

If `genes` is a Python list, the first line calls a list method. If `cells` is a pandas DataFrame, the second calls a pandas method. Both are named `.copy()`, but their copying depth and internal behavior are not identical.

Therefore, when reading `object.method()`, first determine the type of the object to the left of the dot.

`DataFrame.copy()` also does not recursively copy every item. For example, Python objects stored in an `object` column are not recursively copied, and shallow-copy forms such as `deep=False` are affected by the pandas version and Copy-on-Write behavior. When you see `.copy()`, identify the type to the left of the dot and consult the documentation for the current version.

## Modules, packages, and `import`

Python organizes reusable code into modules and packages.

```python
from pathlib import Path
import pandas as pd
```

The first line means: import `Path` from the standard-library module `pathlib`.

The second means: import the third-party package `pandas` and use the short name `pd` in the current code.

Therefore:

```python
pd.read_csv("cell_metadata.csv")
```

means calling the `read_csv()` function supplied by pandas.

### Common import forms

```python
import pandas
import pandas as pd
from pathlib import Path
```

They do not create exactly the same names:

- after `import pandas`, you normally write `pandas.read_csv(...)`;
- after `import pandas as pd`, you normally write `pd.read_csv(...)`;
- after `from pathlib import Path`, you can write `Path(...)` directly.

### Installing a package is not the same as importing it

`python -m pip install pandas` is a terminal command that changes a software environment, and this lesson does not require you to run it. You should consider running an installation command only after confirming that this `python` is the interpreter used by the target project environment. By contrast, `import pandas` is Python code that loads an already installed package into the current Python process.

If installation and execution use different Python environments, you may still see the following after a successful installation:

```text
ModuleNotFoundError: No module named 'pandas'
```

In that situation, first confirm the interpreter path and project environment rather than trying a series of different installation commands.

## Comparisons and logical conditions

### Common comparison operators

| Form | Meaning |
| --- | --- |
| `x == y` | Are the values equal? |
| `x != y` | Are the values unequal? |
| `x < y` | Is `x` less than `y`? |
| `x <= y` | Is `x` less than or equal to `y`? |
| `x > y` | Is `x` greater than `y`? |
| `x >= y` | Is `x` greater than or equal to `y`? |

A comparison usually produces `True` or `False`.

```python
n_genes = 800
n_genes >= 500
```

The result is:

```text
True
```

### `and`, `or`, and `not` combine individual logical tests

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

This is appropriate for two individual logical values.

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` is `False`.

### `in` checks membership

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

For a dictionary, `in` checks keys by default, not values:

```python
"sample_A" in sample_to_group
```

### `is None` checks whether an object is exactly `None`

```python
sample_name = None

if sample_name is None:
    print("Sample name is missing")
```

`is` checks object identity, not ordinary value equality. Use `==` for ordinary numerical and string comparisons; do not replace it with `is` merely because the results happened to match in one run.

Before moving into pandas logical filtering, distinguish two kinds of object. A DataFrame is a two-dimensional table with rows, columns, and labels. A Series is one-dimensional data with an index; selecting one column from a DataFrame usually returns a Series. For an ordinary variable, `n_genes >= 500` usually produces one `bool`, whereas `cells["n_genes"] >= 500` produces a logical Series with one item for each row of the table.

## Why pandas table filters use `&` instead of `and`

When you compare an entire column:

```python
cells["n_genes"] >= 500
```

the result is not one `True` or `False`. It is a column of logical values corresponding to the rows.

```text
0     True
1    False
2     True
dtype: bool
```

To combine two column conditions row by row, pandas commonly uses:

- `&`: element-wise "and"
- `|`: element-wise "or"
- `~`: element-wise "not"

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

Place each comparison condition inside parentheses. This is not merely for appearance; it also prevents operator precedence from interpreting the expression in another way.

Do not copy the following form directly into a pandas column filter:

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` tries to reduce the entire logical column to one truth value and will usually raise an error stating that the truth value of a Series is ambiguous.

However, do not turn "always use `&` in pandas" into a rule. When combining two ordinary individual logical values, you will still normally use `and`. First determine whether each side is a single Boolean value or an entire Boolean column.

## Missing values: `None`, `NaN`, and `pd.NA` are not the same object

Real data may represent missing values in several ways:

- `None`: the special Python value meaning "no object";
- `NaN`: a common missing-value representation in numerical data;
- `pd.NA`: the missing-value marker used by some nullable pandas data types;
- `NaT`: a common missing-value representation in date and time data.

Do not use ordinary equality comparisons as a universal test for all of these missing values.

```python
value = None
value is None
```

For pandas objects, common forms are:

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

Pay particular attention to the following:

- an empty string `""` is not automatically treated as missing by every missing-value check;
- whether the string `"NA"` is read as missing can depend on the reading parameters;
- infinity is not the same as an ordinary missing value;
- whether to remove, fill, or retain a missing value should be decided from the meaning of the data and the analytical goal.

In the quality-control example:

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

explicitly requires both columns to be non-missing. This prevents the missing-value policy from remaining hidden inside later filtering behavior.

## DataFrame: organize a table by rows and columns

A pandas DataFrame is a two-dimensional table. At an introductory level, you can think of it as follows:

- each row usually represents one observation;
- each column represents a variable;
- the row index identifies row positions or labels;
- column names describe what each column means.

For example, a cell metadata table might be:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

However, a DataFrame does not automatically guarantee that "each row represents one cell." A row could instead represent a sample, gene, spatial location, or comparison. You must inspect the data description, identifiers, and object shape.

### Inspect the structure before writing a filtering condition

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

These lines help you inspect, respectively:

- the numbers of rows and columns;
- the column names;
- the first few rows;
- the data type of each column.

`head()` displays only a small number of rows and cannot prove that the rest of the table contains no problems. Depending on the task, you should also inspect missing-value counts, unique identifiers, duplicate rows, numerical ranges, and the distribution within each sample.

### `.loc[keep]` filters rows using a logical condition

```python
filtered_cells = cells.loc[keep].copy()
```

Here:

- `keep` is a logical condition corresponding to the table rows;
- `.loc[keep]` selects rows where the condition is true;
- `.copy()` explicitly creates a new DataFrame object, making it easier to distinguish the filtered result from the original table.

A logical Series aligns with a DataFrame by index labels rather than blindly matching "the row number currently visible." In this example, `keep` is built directly from columns of `cells`, so it corresponds to the current table. When using a mask across tables, identical default indexes such as `0, 1, 2, ...` do not prove that the tables represent the same cells. pandas may raise an error when the indexes cannot be aligned, while labels that happen to match but represent different observations can produce a more subtle mismatch.

## `if`, loops, and comprehensions: first inspect the execution range

### `if`: run code only when a condition is met

```python
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

A non-empty set is treated as true in a condition, and an empty set is treated as false. The error is therefore raised only when a required column is actually missing.

This form is concise, but a beginner should translate it into a complete condition:

> If `missing_columns` is not an empty set, stop the program and report which columns are missing.

### `for`: process multiple elements in turn

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

`column_name` refers to each element of the list in turn. The indented code belongs to the loop body.

If a loop modifies a list, table, or file, confirm whether those changes accumulate and whether each iteration processes a cell, sample, or gene.

### `while`: repeat while a condition remains true

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

If the loop condition always remains true, the program may never finish. When reviewing an AI-generated `while`, find the operation that will eventually make the condition false.

### Learn to read a list comprehension; you do not need to write one yet

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

You can expand it as:

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

A comprehension can simplify code, but it can also compress several conditions into one line. At an introductory level, if a line is difficult to explain, ask AI to expand it into an ordinary loop before reviewing it.

## Errors, warnings, and logs are not the same thing

| Symptom | Common meaning | First check |
| --- | --- | --- |
| `SyntaxError` | The code structure cannot be parsed | Inspect the indicated line and the preceding line; check parentheses, colons, and quotation marks |
| `IndentationError` or `TabError` | There is a problem with indentation levels | Check spaces, tabs, and code-block boundaries |
| `NameError` | The code uses a name that has not been defined | Find the line or cell where the name should have been created |
| `TypeError` | An operation does not match the object type | Inspect the actual object type and function input |
| `KeyError` | A dictionary key or table column label does not exist | Print the actual keys or column names and check spelling and spaces |
| `FileNotFoundError` | The file was not found at the specified path | Check the working directory, path, and filename |
| `ModuleNotFoundError` | The current interpreter cannot find the module | Check the actual Python interpreter and project environment |

An unhandled exception usually stops the current execution. The last line of a traceback usually gives the exception type and immediate explanation, while the preceding content shows which files, functions, and lines of code were traversed.

Do not give Codex only the last line. The complete traceback, execution command, Python version, working directory, and input-object structure provide more evidence for locating the cause.

A warning normally does not stop a program immediately, but it may indicate that:

- an interface is going to change;
- a data type was converted automatically;
- a calculation has a numerical problem;
- the current operation may produce an ambiguous result.

A log or ordinary output is simply information that the program deliberately displays; it is not automatically an error. Whether it is trustworthy still depends on what the code recorded and whether the important checks actually ran.

## Review AI-generated Python in a fixed order

### 1. Confirm the execution location and environment

Record the Python version, interpreter path, project environment, package versions, script or notebook name, and current working directory.

### 2. Find every external input

Search for operations that may read data, such as:

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

Confirm the path, file format, delimiter, encoding, sample, and reference-data version.

### 3. List important names and their object types

For example:

```text
metadata_path → Path, the input file path
cells → DataFrame, the original cell metadata
keep → Series, one truth value per row
filtered_cells → DataFrame, the filtered result
average_genes → numerical scalar, often displayed as a decimal; the mean number of detected genes across the filtered rows
```

If you cannot explain what a name refers to, first inspect where it is created, its `type()`, shape, column names, and a small number of example values.

### 4. Follow modifications and reassignments through names

Check:

- whether the same name is reassigned later;
- whether a method modifies an object in place;
- whether two names refer to the same mutable object;
- whether a notebook depends on old cell state;
- whether filtering creates a new object or overwrites the original.

### 5. Translate every condition into a sentence

Translate:

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

as:

> For each row, require `n_genes` to be at least 500 and `percent_mito` to be less than 10.

Then continue by asking about the basis for the thresholds, units, missing-value policy, and distributions across samples.

### 6. Find operations that write files, use the network, or change the environment

Search for:

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

Before execution, confirm the target path, overwrite behavior, command content, download source, and credential handling.

### 7. Inspect important intermediate results

At minimum, inspect:

- the input table shape and column names;
- whether identifiers are unique;
- the number of missing values;
- how many rows each condition retains on its own;
- how many rows the combined conditions retain;
- how many cells are retained for each biological sample;
- whether the output index matches associated objects.

Looking only at the final plot or final mean cannot reveal whether an entire sample was lost during an intermediate step.

### 8. Review the scientific meaning last

Successful execution tells you only that Python accepted the instructions. It does not automatically prove that:

- the thresholds suit the current tissue and experimental protocol;
- the percentage unit was understood correctly;
- each row really represents a cell rather than a nucleus or spatial location;
- there are enough biological replicates to support inference;
- filtering did not systematically exclude a cell type;
- the reference genome, annotation, and feature identifiers are correct;
- the statistical conclusion answers the original biological question.

## When asking Codex to explain Python, require evidence you can check

A weak request:

```text
Explain this Python code.
```

A request that is easier to verify:

```text
Treat this Python as bioinformatics code that needs to be reviewed, rather than merely translating it line by line.

1. First explain whether it should run in a terminal, a Python script, or a notebook.
2. List every external input, output path, and operation that changes the environment.
3. For every important name, state its object type, shape, index, and column names.
4. Translate every filtering condition into ordinary language and explain the roles of parentheses, missing values, and operators.
5. Distinguish ordinary Python Boolean values from pandas/NumPy element-wise logical operations.
6. Identify which lines modify existing objects and which create new objects.
7. Provide the minimum read-only inspection code, without overwriting the original data or files.
8. Check important behavior against the official documentation for the current versions of Python, pandas, and the relevant packages.
9. Finally, list the biological assumptions that still require researcher judgment.
```

The AI explanation also requires verification. Object types, function signatures, package versions, default parameters, and missing-value behavior should be checked against the actual environment and official documentation.

## AI-generated operations that require you to stop and inspect them

| Form | Possible effect | Question to ask before execution |
| --- | --- | --- |
| `data = transformed_data` | Rebinds a name to another object | Can the old object still be traced? |
| `list_a = list_b` | Both names may refer to the same mutable list | Will a later change affect both? |
| `df.drop(..., inplace=True)` | Modifies the DataFrame directly | Must the original table be preserved? What does the current pandas version do? |
| `df.to_csv(path)` | Writes or overwrites a file | Are the path, index column, and overwrite policy correct? |
| `Path(path).unlink()` | Deletes a file | Has the path been checked explicitly? Is there a backup? |
| `shutil.rmtree(path)` | Recursively deletes a directory | Is the target strictly limited to the intended directory? |
| `subprocess.run(..., shell=True)` | Executes a command through a shell | Does the command contain unverified input? |
| `pip install ...` | Changes the software environment | Should it be installed in the project environment and have its version recorded? |
| `requests.get(url)` | Reads content from the network | What are the source, licence, size, and verification method? |
| `os.environ["TOKEN"]` | Reads a credential | Could it be printed, logged, or written to a file? |

Not every one of these forms is wrong. They require stronger evidence before execution because they may modify data, files, environments, or external systems.

## Read the opening example in full

Suppose `cell_metadata.csv` contains exactly the following:

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

The consecutive commas in the last two rows represent genuinely empty fields. Do not write a word such as "missing" into the CSV. With the default reading behavior in this example, pandas recognizes these two empty fields as missing values.

The values `500` and `10` in this example are fictional thresholds chosen to teach syntax; they are not universal single-cell quality-control standards. Real thresholds depend on the tissue, experimental protocol, sequencing depth, cell or nucleus type, metric distributions, and downstream goal.

### Step 1: Import the required names

```python
from pathlib import Path

import pandas as pd
```

- `Path` represents and inspects paths.
- `pd` is the short name that this code uses for pandas.

### Step 2: Construct the path and read the table

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` refers to a relative path.
- `pd.read_csv()` reads the CSV file.
- `cells` refers to the resulting DataFrame.

Before running the code, confirm `Path.cwd()`, the filename, delimiter, and encoding. Successful reading still does not guarantee that the column types, missing-value markers, or units are correct.

### Step 3: Check the required columns

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"Missing required columns: {sorted(missing_columns)}")
```

- `set(cells.columns)` converts the observed column names to a set.
- Set difference finds required columns that are missing.
- If the set is non-empty, the program stops and reports the column names explicitly.
- `sorted()` is used only to keep the column order in the error message stable and easy to read.

Confirming that columns exist still does not validate their data types, units, unique identifiers, or numerical ranges.

### Step 4: Build the row-by-row filtering condition

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

For every row, require:

1. `n_genes` is not missing;
2. `percent_mito` is not missing;
3. `n_genes` is at least 500;
4. `percent_mito` is less than 10.

The corresponding item in `keep` is `True` only when all four conditions are true.

### Step 5: Filter and explicitly copy the result

```python
filtered_cells = cells.loc[keep].copy()
```

`.loc[keep]` selects rows where the condition is true, and `.copy()` creates a new DataFrame object for later operations. For the numerical example here, ordinary subsequent table modifications no longer act directly on the original table, but the copying depth remains subject to the explanation above.

Expected filtering result:

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

The expected result retains 2 rows, both from `sample_A`; `sample_B` retains 0 rows. Even if the total row count and mean appear reasonable, the disappearance of an entire sample requires you to stop and inspect the thresholds, input data, metric units, and quality of that sample. A formal multi-sample analysis should also include sample or library identifiers in input-structure validation and record the number of cells retained from each sample after every condition.

### Step 6: Calculate and explicitly display the mean

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

The mean is:

```text
775.0
```

This value is only the arithmetic mean of `n_genes` across the two retained rows. It does not prove that the filtering rule is reasonable, and it cannot represent differences between independent biological samples.

This example has already excluded rows where `n_genes` is missing. pandas means skip missing values by default. If the filtering result is empty, the mean may be displayed as `NaN` rather than automatically raising an error. You must therefore check the number of retained rows or `filtered_cells.empty` first and must not treat an empty result as a valid mean.

### This code still has not synchronized filtering across a real single-cell object

The result here is only a filtered metadata table. It does not automatically filter:

- the gene-expression matrix;
- other layers, embeddings, and graph structures in AnnData;
- other modalities in a single-cell multi-omics object;
- coordinates, images, and location features in spatial omics;
- other results associated by cell or location.

If data are already organized in AnnData, you will normally filter the whole object along its observation axis rather than exporting and filtering only `.obs`. This subsets `X`, `layers`, `obsm`, and `obsp` that are aligned with the observation axis at the same time. AnnData slicing normally returns a view; when later modification is needed, decide whether to call `.copy()` according to the object's semantics.

This is only a reminder about object boundaries. A multimodal or spatial object does not guarantee that all of its contents correspond row by row to cells or locations. Shared information such as images, coordinate systems, and coordinate transformations cannot be given the same Boolean mask mechanically. The specific object operations are left to later lessons.

In a real project, use verified observation identifiers that are globally unique within the project to select associated objects consistently. Cell barcodes may repeat across samples or libraries, so you will usually need to combine the sample or library identifier with the barcode. Then verify one-to-one relationships, identifier sets, counts, and order. Do not merely assume that "row 10 in two tables represents the same cell."

## The minimum code literacy to retain from this lesson

When you encounter Python code, you do not need to rewrite it from memory, but you should at least be able to:

- distinguish terminal commands, interactive input, scripts, and notebook cells;
- recognize indentation, names, assignment, functions, methods, attributes, comments, and strings;
- distinguish common numbers, strings, Boolean values, `None`, and containers;
- know that assignment does not necessarily copy a mutable object;
- understand the basic difference between zero-based indexing, half-open slices, `.loc`, and `.iloc`;
- distinguish `=`, `==`, `is None`, `and`, and pandas `&`;
- know that `None`, `NaN`, `pd.NA`, and empty strings need explicit handling;
- trace inputs, changes in names, filtering conditions, and outputs;
- find operations that may overwrite files, change an environment, run a shell, or read credentials;
- check AI explanations against real object structures, software versions, and official documentation;
- explain which validation steps are still missing between successful execution and a supported biological conclusion.

Now that AI can generate code quickly, memorizing syntax can become less important, but understanding code becomes more important. The faster code is generated, the more important it is for someone to confirm that the code handles the right objects, applies the right conditions, and does not mistake computational success for scientific support.

## References

1. [Official Python tutorial: an informal introduction to Python, comments, assignment, strings, lists, and slicing](https://docs.python.org/3/tutorial/introduction.html)
2. [Official Python tutorial: `if`, `for`, and functions](https://docs.python.org/3/tutorial/controlflow.html)
3. [Official Python tutorial: lists, tuples, sets, and dictionaries](https://docs.python.org/3/tutorial/datastructures.html)
4. [Official Python tutorial: modules and packages](https://docs.python.org/3/tutorial/modules.html)
5. [Official Python tutorial: errors and exceptions](https://docs.python.org/3/tutorial/errors.html)
6. [Python language reference: indentation rules](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Python standard library: `pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [Official pandas guide: indexing and logical filtering](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [Official pandas documentation: `DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [Official pandas documentation: detecting missing values](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [Official pandas documentation: `DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Python standard library: shallow and deep copying](https://docs.python.org/3/library/copy.html)
13. [Official pandas documentation: `Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [Official pandas guide: Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [Official AnnData documentation: `AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
