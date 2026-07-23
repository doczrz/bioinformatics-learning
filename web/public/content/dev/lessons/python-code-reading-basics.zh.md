# 0.4｜可以不手写，但必须看得懂：Python 基本语法与代码阅读

假设你把一份细胞质量控制表交给 Codex，并要求它筛选可能保留的细胞。它返回了下面这段 Python 代码：

这里的 `cell_metadata.csv` 是一张虚构的细胞元数据表。在本示例中，每一行代表一个等待质量检查的候选细胞；`cell_id` 是细胞标识符；`sample_id` 表示该细胞来自哪个生物学样本；`n_genes` 表示该细胞中检测到的基因数；`percent_mito` 表示线粒体基因计数占总计数的百分比，因此数值 `10` 表示 10%，不是 0.10。这些字段名称和阈值只是本节约定，真实数据必须根据对象说明、实验方案和单位重新核对。

```python
from pathlib import Path

import pandas as pd

metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)

required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"缺少必要列：{sorted(missing_columns)}")

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

这段代码将作为本节的贯穿示例。本节会依次拆解以下阅读线索：

- 数据从 `cell_metadata.csv` 进入；
- `cells`、`missing_columns`、`keep` 和 `filtered_cells` 分别指向不同阶段的对象；
- 缩进决定 `raise` 是否属于 `if`；
- 筛选条件共同决定哪些行被保留，以及缺失值怎样处理；
- 外层圆括号让较长条件可以分行书写，比较表达式两侧的圆括号则保证 `&` 按预期组合逐行结果；
- `.loc`、`.copy()` 和 `.mean()` 分别负责选择、复制和计算；
- `500` 和 `10` 是仍需研究者根据当前数据判断的阈值。

只有能够用普通语言说明这些线索，才能判断代码是否读对了文件、是否使用了正确的列，以及是否可能把合理的生物学信号当成低质量数据删除。

本节的目标不是让你背诵 Python 语法，也不是要求你脱离文档默写程序。你需要建立的是代码阅读能力：看到一段 Python 代码时，能够识别数据从哪里进入、经过哪些变化、输出到哪里，以及哪些计算决定仍需要由研究者负责。

本节假定你已经知道 Python 是一种常用于数据处理、自动化和生物信息学分析的编程语言，也知道软件包和项目环境会影响代码能否运行。你不需要提前安装任何软件，也不需要有编程经验。

本节代码块主要用于阅读，无须现在运行。如果希望跟着尝试，应先确认代码准备在哪里运行：Python 交互式解释器、扩展名为 `.py` 的脚本，或 Jupyter notebook。像 `"cell_metadata.csv"` 这样不带完整路径的文件名，会相对于当前工作目录查找；在 Python 中可以用 `Path.cwd()` 查看这个位置。

第一次阅读时，可以把内容分成两层：

- **必须读懂：**缩进、名称与赋值、常见数据类型、列表和字典、索引与切片、函数与方法、比较与逻辑条件、缺失值、导入和表格筛选；
- **目前先能辨认：**列表推导式、生成器、上下文管理器、装饰器、类、类型注解、NumPy 数组、稀疏矩阵和 AnnData。遇到这些结构时，知道应该要求 AI 解释或查官方文档即可。

如果是第一次阅读，可以沿着四段最短主线前进：先理解运行位置、一行代码和缩进；再理解名称、对象、基础类型以及列表、字典和集合；随后理解函数、方法、导入、普通逻辑与 pandas 逐行逻辑；最后阅读缺失值、DataFrame 筛选和末尾的完整示例。元组、`while`、列表推导式以及危险操作明细在第一次阅读时只需能够辨认，不要求记忆或手写。

除“完整读懂开头的示例”外，本节较短的代码块主要是依赖前文对象的阅读片段，不应默认视为可以单独运行的完整脚本。

## “Vibe coding” 不等于不再需要理解 Python

“Vibe coding”是一个非正式说法，通常指使用自然语言描述需求，让 AI 生成、修改并运行代码，而使用者不必逐字输入每条指令。

这种方式确实降低了语法记忆的门槛。你可以让 Codex：

- 根据任务生成 Python 代码；
- 解释 traceback，也就是报错时显示的调用路径；
- 把重复步骤整理成脚本；
- 查找名称在何处被赋值或修改；
- 对照官方文档检查函数参数；
- 运行代码并展示关键中间结果。

因此，“能否从头手写”已经不再是衡量分析能力的唯一标准。

但自然语言需求最终仍会被转换成精确操作。计算机不会自动理解“去掉质量不好的细胞”背后的实验设计，它只会执行类似“保留 `n_genes >= 500` 且 `percent_mito < 10` 的行”这样的条件。如果 AI 误解了列名、百分比单位、缺失值或比较方向，代码仍可能顺利运行。

所以，本课程对初学者的要求是：

> 可以不靠记忆手写 Python，但必须能把关键代码翻译成普通语言，并检查这种翻译是否符合研究问题。

这不表示你必须理解 Python 的所有内部机制。阅读分析代码可以先掌握最常见的结构，再在需要时查文档。

## 先确认 Python 代码在哪里运行

同一段 Python 代码可以出现在不同位置。运行位置会影响输入方式、工作目录、已经存在的对象和结果显示方式。

### 交互式解释器

在终端输入 `python` 或某些系统中的 `python3`，可能进入 Python 交互式解释器。常见提示符是：

```text
>>>
```

教程中的 `>>>` 表示“这里是输入”，不是代码的一部分。复制示例时，不要把提示符一起复制。

在交互式解释器中，直接输入一个表达式通常会显示结果：

```python
2 + 3
```

```text
5
```

但把同一行放进 `.py` 脚本后，脚本不会因为出现了表达式就可靠地把结果展示出来。需要明确输出时，应使用 `print()`、日志或写入结果文件。

### Python 脚本

扩展名为 `.py` 的文本文件通常称为 Python 脚本。例如：

```text
filter_cells.py
```

脚本适合保存可重复运行的步骤。终端中的运行命令可能是：

```text
python filter_cells.py
```

这是一条终端命令，不应写进 Python 代码块中。脚本是否能够运行，还取决于终端实际调用的是哪个 Python、当前环境中是否安装了所需软件包，以及当前工作目录是否正确。

### Jupyter notebook

Jupyter notebook 把代码分成多个单元格。它适合逐步探索，但单元格不一定按照页面从上到下的顺序执行。

如果一个名称只存在于当前内核的内存中，重启内核后它会消失。如果先运行下方单元格、再回头修改上方单元格，页面上看到的代码顺序也可能与实际执行顺序不同。

因此，审核 notebook 时应检查：

- 是否能够从空白内核按顺序运行；
- 每个名称在哪个单元格中第一次创建；
- 上游单元格改变后，下游结果是否重新计算；
- 关键结果是否只存在于内存中。

### 查看版本和工作目录

下面是终端命令：

```text
python --version
```

下面是 Python 代码：

```python
import sys
from pathlib import Path

print(sys.version)
print(Path.cwd())
```

不要因为代码窗口标题写着“Python”，就假定它使用了你预期的版本和环境。版本、解释器路径、项目环境和工作目录都可能影响结果。

## 先认识一行 Python 代码的组成

看下面这行：

```python
average_genes = filtered_cells["n_genes"].mean()
```

它可以从右向左阅读：

1. `filtered_cells["n_genes"]`：从表格中取出名为 `n_genes` 的一列；
2. `.mean()`：调用这一列提供的求平均值方法；
3. `=`：把右侧结果绑定到左侧名称；
4. `average_genes`：以后可以用这个名称引用计算结果。

翻译成普通语言就是：

> 从筛选后的细胞表中取出 `n_genes` 列，计算平均值，并让名称 `average_genes` 指向这个结果。

函数名和方法参数可以查文档，但输入、动作和结果必须能说清楚。

## 缩进：Python 用空格表示代码属于哪一层

许多语言使用大括号标出一组代码，Python 主要使用缩进。

```python
if cell_count == 0:
    print("没有可分析的细胞")

print("检查完成")
```

这段代码表示：

- 如果 `cell_count == 0` 为 `True`，执行缩进的 `print()`；
- 无论条件是否满足，最后一行都会执行，因为它已经回到最外层。

`if` 这一行末尾的冒号 `:` 表示接下来会出现一个代码块。代码块中的每一行必须保持一致的缩进层级。常见风格是每层使用 4 个空格。

下面两段代码都可能是合法的 Python，但含义不同。

```python
if cell_count == 0:
    print("没有可分析的细胞")
    raise ValueError("筛选结果为空")
```

```python
if cell_count == 0:
    print("没有可分析的细胞")

raise ValueError("筛选结果为空")
```

第一段只在细胞数为 0 时停止。第二段无论细胞数是多少都会停止。AI 改变缩进时，即使没有语法错误，也可能改变程序逻辑。

同一个文件中不要混用制表符和空格来表达缩进。某些混用会触发 `TabError`；更危险的是，编辑器显示看似对齐，而实际层级并不符合预期。

## 名称、对象和赋值

Python 中的数字、文字、列表、函数和表格都可以看作对象（object）。名称（name）让代码能够再次引用这些对象。

```python
gene_name = "MS4A1"
cell_count = 1200
```

这里：

- `"MS4A1"` 是字符串对象；
- `1200` 是整数对象；
- `gene_name` 和 `cell_count` 是名称；
- `=` 执行赋值，使左侧名称指向右侧对象。

Python 不要求先声明“这个名称以后只能保存整数”。同一个名称可以被重新赋值：

```python
cell_count = 1200
cell_count = "1200"
```

第二行运行后，`cell_count` 指向文字 `"1200"`，不再是数字 `1200`。这种代码可能合法，但后续数学运算会产生不同结果或报错。

### `=` 是赋值，`==` 是比较

```python
cell_count = 1200
cell_count == 1200
```

第一行把值交给名称。第二行询问两边的值是否相等，结果是 `True` 或 `False`。

审核条件语句时，要特别检查 AI 是否把 `=` 和 `==` 混淆。

### 重新赋值不等于复制

```python
genes = ["MS4A1", "CD3D"]
selected_genes = genes
selected_genes.append("NKG7")
```

这时 `genes` 和 `selected_genes` 指向同一个列表。通过其中一个名称修改列表，另一个名称看到的内容也会改变。

```python
print(genes)
```

```text
['MS4A1', 'CD3D', 'NKG7']
```

如果需要一个与原列表分开的外层列表，可以明确复制：

```python
selected_genes = genes.copy()
```

本例的元素都是不可修改的字符串，因此向 `selected_genes` 追加新基因不会改变 `genes`。但 `list.copy()` 只复制列表外层；如果列表中还包含其他可修改对象，内层对象仍可能共享。

“赋值只是给对象增加另一个名称”是很有用的入门理解，但它不是 Python 内存管理的完整模型。当前阶段只需要知道：遇到可修改对象时，不要把 `a = b` 自动理解成“复制一份互不影响的数据”。

## 注释、字符串和格式化文字

### `#` 后面通常是注释

```python
# 读取细胞元数据
cells = pd.read_csv("cell_metadata.csv")
```

注释不会作为计算执行，但注释也可能过时。代码与注释冲突时，应根据实际执行的代码、对象结构和结果判断，而不是只相信注释。

如果 `#` 位于引号内，它只是字符串的一部分：

```python
color = "#2855c5"
```

### 引号包住字符串

```python
gene_name = "MS4A1"
sample_name = 'sample_A'
```

单引号和双引号都可以表示普通字符串。数字加引号后会变成文字：

```python
threshold_number = 500
threshold_text = "500"
```

`threshold_number` 可以直接参与数值比较；`threshold_text` 是字符串。代码从 CSV 文件读取数据后，还应检查列是否被识别为预期的数据类型。

### f-string 把对象的值放进文字

```python
cell_count = 1200
message = f"保留了 {cell_count} 个细胞"
print(message)
```

前缀 `f` 表示字符串中的 `{cell_count}` 会被替换成当前值。

```text
保留了 1200 个细胞
```

f-string 适合生成日志和报错说明。花括号里的内容仍会被执行，因此不能只把它当成静态文字。

## 常见基础类型：先分清数字、文字、真假和空值

| 类型 | 示例 | 初学阶段可以怎样理解 |
| --- | --- | --- |
| `int` | `1200` | 整数 |
| `float` | `7.5` | 带小数的数值 |
| `str` | `"MS4A1"` | 字符串，也就是文字 |
| `bool` | `True`、`False` | 逻辑真假 |
| `NoneType` | `None` | Python 中表示“没有对象”的特殊值 |

可以用 `type()` 查看对象的类型：

```python
print(type(1200))
print(type("1200"))
```

```text
<class 'int'>
<class 'str'>
```

真实分析中还会遇到 NumPy 和 pandas 提供的数据类型，例如 `int64`、`float64`、`category` 和可空字符串类型。它们不一定与 Python 内置类型完全相同。当前只需要先确认：对象是数值、文字、逻辑值还是缺失值，以及这种类型是否符合当前计算。

### 类型转换不是数据验证

```python
cell_count = int("1200")
```

这会把文字 `"1200"` 转成整数。可是：

```python
cell_count = int("twelve hundred")
```

会触发 `ValueError`。

即使转换成功，也不能证明原始值在生物学上合理。把 `"999999"` 转成整数不会自动证明样本真的有这么多细胞。

## 容器：把多个值组织在一起

### 列表 `list`

列表使用方括号，保留元素顺序，并且可以修改。

```python
marker_genes = ["MS4A1", "CD3D", "NKG7"]
```

常见操作：

```python
marker_genes.append("LYZ")
gene_count = len(marker_genes)
```

`.append()` 会修改原列表；`len()` 返回元素数量。

### 元组 `tuple`

元组常使用圆括号，创建后不能像列表那样替换元素。

```python
matrix_shape = (1200, 20000)
```

它可能表示一个矩阵有 1200 行和 20000 列。具体是“细胞 × 基因”还是“基因 × 细胞”，必须根据对象说明和代码确认，不能只看两个数字猜测。

### 字典 `dict`

字典把键（key）与值（value）对应起来。

```python
sample_to_group = {
    "sample_A": "control",
    "sample_B": "treated",
}
```

按键取值：

```python
group = sample_to_group["sample_A"]
```

如果键不存在，方括号取值会触发 `KeyError`。有些代码使用 `.get()`：

```python
group = sample_to_group.get("sample_C")
```

找不到键时，`.get()` 默认返回 `None`。这可能避免立即报错，也可能让缺失信息继续流入后续步骤，因此需要检查代码如何处理返回的 `None`。

### 集合 `set`

集合用于保存不重复的元素，常用花括号表示。

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
observed_columns = {"cell_id", "n_genes", "sample_id"}
missing_columns = required_columns - observed_columns
```

这里的减号表示集合差集。`missing_columns` 会包含要求存在但实际没有的列：

```text
{'percent_mito'}
```

集合不适合表达必须保留的行顺序。如果输出顺序会影响结果或记录，应明确排序。

## 索引和切片：Python 通常从 0 开始计数

### 按位置取一个元素

```python
genes = ["MS4A1", "CD3D", "NKG7"]
first_gene = genes[0]
last_gene = genes[-1]
```

结果是：

```text
MS4A1
NKG7
```

`[0]` 取第一个元素，`[-1]` 从末尾取最后一个元素。访问不存在的位置会触发 `IndexError`。

### 切片通常包含起点，不包含终点

```python
genes[0:2]
```

结果是前两个元素：

```text
['MS4A1', 'CD3D']
```

可以把 `0:2` 理解为位置区间 `[0, 2)`：包括 0，不包括 2。

```python
genes[:2]
genes[1:]
```

省略起点表示从开头开始，省略终点表示一直到结尾。

### pandas 的标签索引与位置索引要分开

对 pandas 表格：

- `.loc[...]` 主要按行标签、列标签或逻辑条件选择；
- `.iloc[...]` 按整数位置选择。

```python
cells.loc[keep, ["cell_id", "n_genes"]]
cells.iloc[:5, :2]
```

第一行按逻辑条件选择行，并按列名选择两列。第二行按位置选择前 5 行和前 2 列。

不要把 `.loc[0:2]` 自动理解成普通 Python 切片。标签切片的规则可能与“终点不包含”不同；应先确认索引标签及对象文档。

## 函数：接收输入并返回结果

```python
rounded_value = round(7.456, ndigits=2)
```

这行代码包含：

- 函数：`round`
- 传给函数的第一个输入：`7.456`
- 参数名称：`ndigits`
- 为该参数提供的值：`2`
- 返回结果：`7.46`
- 保存结果的名称：`rounded_value`

参数（parameter）是函数定义中的输入名称。调用函数时实际提供的值常称为实参（argument）。初学阶段更重要的是能指出“哪个输入控制哪个行为”，而不是背术语。

### 位置参数与关键字参数

```python
rounded_value = round(7.456, 2)
rounded_value = round(7.456, ndigits=2)
```

两行都可能得到相同结果。第二行显式写出参数名称，通常更容易阅读。

但不是所有参数都可以任意改成关键字形式。调用第三方函数前，应查看当前版本的函数签名和官方文档。

### 返回值必须被接住或明确输出

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

第一行保存计算结果，第二行显示它。

如果只写：

```python
filtered_cells["n_genes"].mean()
```

在交互式解释器或 notebook 的单元格末尾，结果通常会被展示；在脚本中则不应依赖这种自动显示。可靠分析应明确保存、打印、记录或写出关键结果。

pandas 的 `Series.mean()` 默认使用 `skipna=True`，也就是计算时跳过缺失值。本例已经在筛选条件中要求 `n_genes` 非缺失；但如果筛选后没有任何行，均值会显示为 `NaN`，这不是可解释的分析结果。解释均值前应先确认 `filtered_cells.empty` 为 `False`，并记录实际保留行数。返回值是数值标量，具体是 Python 还是 NumPy/pandas 标量取决于列类型和软件版本。

### 自定义函数先看输入、返回值和副作用

```python
def keep_high_gene_cells(table, minimum_genes):
    keep = table["n_genes"].notna() & (table["n_genes"] >= minimum_genes)
    return table.loc[keep].copy()
```

阅读时先找：

1. `def` 后面的函数名称；
2. 圆括号中的输入参数；
3. 缩进代码执行了什么；
4. `return` 返回什么；
5. 是否还修改了外部对象、文件或环境。

没有 `return` 的函数仍可能通过写文件、修改传入对象或改变全局状态产生影响。不能只看返回值。

## 方法和属性：点号表示“从这个对象继续找”

```python
cells.columns
cells["n_genes"].notna()
```

两行都使用点号，但含义不同。

- `.columns` 是属性，表示对象携带的信息；这里是列标签；
- `.notna()` 是方法，表示由这个对象提供并被调用的操作。

最直观的区别是：方法调用通常带圆括号，属性访问通常不带。

不过，不能只凭括号推断科学含义。应结合对象类型和文档确认这个属性或方法到底返回什么。

### 同名方法可能因对象类型不同而行为不同

```python
genes.copy()
cells.copy()
```

如果 `genes` 是 Python 列表，第一行调用列表的方法。如果 `cells` 是 pandas DataFrame，第二行调用 pandas 的方法。它们都叫 `.copy()`，但复制范围和内部行为不完全相同。

所以阅读 `对象.方法()` 时，要先确认点号左侧是什么类型。

`DataFrame.copy()` 也不等于递归复制所有内容。例如，`object` 列中保存的 Python 对象不会被递归复制；`deep=False` 等浅复制写法还会受 pandas 版本和 Copy-on-Write 行为影响。因此，看到 `.copy()` 时应确认点号左侧的对象类型，并核对当前版本文档。

## 模块、软件包和 `import`

Python 把可复用代码组织成模块（module）和软件包（package）。

```python
from pathlib import Path
import pandas as pd
```

第一行表示：从标准库模块 `pathlib` 中导入 `Path`。

第二行表示：导入第三方软件包 `pandas`，并在当前代码中使用简称 `pd`。

因此：

```python
pd.read_csv("cell_metadata.csv")
```

表示调用 pandas 提供的 `read_csv()`。

### 常见导入写法

```python
import pandas
import pandas as pd
from pathlib import Path
```

它们不会产生完全相同的名称：

- `import pandas` 后通常写 `pandas.read_csv(...)`；
- `import pandas as pd` 后通常写 `pd.read_csv(...)`；
- `from pathlib import Path` 后可以直接写 `Path(...)`。

### 安装软件包不等于导入软件包

`python -m pip install pandas` 是一条会修改软件环境的终端命令，本节不要求执行。只有确认这里的 `python` 就是目标项目环境使用的解释器后，才能考虑运行安装命令。`import pandas` 则是 Python 代码，用来在当前 Python 进程中加载已经安装的软件包。

如果安装和运行使用了不同的 Python 环境，安装成功后仍可能出现：

```text
ModuleNotFoundError: No module named 'pandas'
```

此时应先确认解释器路径和项目环境，而不是连续尝试不同的安装命令。

## 比较与逻辑条件

### 常见比较符号

| 写法 | 含义 |
| --- | --- |
| `x == y` | 值是否相等 |
| `x != y` | 值是否不相等 |
| `x < y` | 是否小于 |
| `x <= y` | 是否小于或等于 |
| `x > y` | 是否大于 |
| `x >= y` | 是否大于或等于 |

比较通常产生 `True` 或 `False`。

```python
n_genes = 800
n_genes >= 500
```

结果是：

```text
True
```

### `and`、`or` 和 `not` 组合单个逻辑判断

```python
n_genes = 800
percent_mito = 6.5

keep = n_genes >= 500 and percent_mito < 10
```

这适用于两个单独的逻辑值。

```python
has_cells = True
has_required_columns = False

ready = has_cells and has_required_columns
```

`ready` 为 `False`。

### `in` 检查成员关系

```python
gene_name = "MS4A1"
marker_genes = ["MS4A1", "CD3D", "NKG7"]

is_marker = gene_name in marker_genes
```

对于字典，`in` 默认检查键，而不是值：

```python
"sample_A" in sample_to_group
```

### `is None` 检查是否就是 `None`

```python
sample_name = None

if sample_name is None:
    print("缺少样本名称")
```

`is` 检查对象身份，不是普通的值比较。对于一般数值和字符串比较，应使用 `==`，不要因为某次运行结果相同就用 `is` 替代。

进入 pandas 的逻辑筛选前，需要先区分两类对象。DataFrame 是带有行、列和标签的二维表格；Series 是带索引的一维数据，从 DataFrame 取出单独一列时通常会得到 Series。普通变量 `n_genes >= 500` 通常得到一个 `bool`，而 `cells["n_genes"] >= 500` 会得到一个逻辑 Series，其中每一项对应表格的一行。

## pandas 表格筛选为什么使用 `&`，而不是 `and`

当比较整列数据时：

```python
cells["n_genes"] >= 500
```

结果不是单个 `True` 或 `False`，而是一列与每一行对应的逻辑值。

```text
0     True
1    False
2     True
dtype: bool
```

要逐行组合两列条件，pandas 常使用：

- `&`：逐元素“并且”
- `|`：逐元素“或者”
- `~`：逐元素“取反”

```python
keep = (
    (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

每个比较条件都应放进圆括号。这不仅为了好看，也避免运算优先级把表达式解释成其他含义。

下面这种写法不应直接照搬到 pandas 列筛选中：

```python
keep = cells["n_genes"] >= 500 and cells["percent_mito"] < 10
```

`and` 试图把整列逻辑值压缩成一个真假判断，通常会触发“Series 的真值不明确”一类错误。

但不要把“pandas 中永远用 `&`”当成规则。组合两个普通的单个逻辑值时，仍然通常使用 `and`。关键是先确认两边是单个布尔值，还是一整列布尔值。

## 缺失值：`None`、`NaN` 和 `pd.NA` 不是同一个对象

真实数据中可能使用不同方式表示缺失：

- `None`：Python 中表示“没有对象”的特殊值；
- `NaN`：数值数据中常见的缺失表示；
- `pd.NA`：pandas 某些可空数据类型使用的缺失标记；
- `NaT`：日期和时间数据中常见的缺失表示。

不要用普通等号比较来统一判断这些缺失值。

```python
value = None
value is None
```

对于 pandas 对象，常使用：

```python
cells["n_genes"].isna()
cells["n_genes"].notna()
```

需要特别注意：

- 空字符串 `""` 通常不会自动被所有缺失检查当成缺失；
- 字符串 `"NA"` 是否被读成缺失，可能受读取参数影响；
- 无穷大也不等于普通缺失值；
- 删除、填补还是保留缺失值，应由数据含义和分析目标决定。

在质量控制示例中：

```python
cells["n_genes"].notna() & cells["percent_mito"].notna()
```

明确要求两列都不是缺失值。这样可以避免缺失值政策隐藏在后续筛选行为中。

## DataFrame：按行和列组织表格

pandas 的 DataFrame 是二维表格。初学阶段可以把它理解为：

- 每一行通常代表一个观察单位；
- 每一列代表一个变量；
- 行索引用于标识行的位置或标签；
- 列名说明每列的含义。

例如细胞元数据表可能是：

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |
| AAAT-1 | sample_B | 350 | 3.2 |

但“每行代表一个细胞”不是 DataFrame 自动保证的。每行也可能代表样本、基因、空间位置或一次比较。必须查看数据说明、标识符和对象形状。

### 先检查结构，再写筛选条件

```python
print(cells.shape)
print(cells.columns.tolist())
print(cells.head())
print(cells.dtypes)
```

这些代码分别帮助检查：

- 行数和列数；
- 列名；
- 前几行内容；
- 每列的数据类型。

`head()` 只展示少量行，不能证明整张表没有异常。还应根据任务检查缺失数量、唯一标识符、重复行、数值范围和每个样本的分布。

### `.loc[keep]` 使用逻辑条件筛选行

```python
filtered_cells = cells.loc[keep].copy()
```

这里：

- `keep` 是与表格行对应的逻辑条件；
- `.loc[keep]` 选择条件为真的行；
- `.copy()` 明确创建一个新的 DataFrame 对象，便于把筛选结果与原表区分。

逻辑 Series 会按索引标签与 DataFrame 对齐，而不是只按“当前看到的第几行”盲目匹配。本例的 `keep` 直接由 `cells` 的列构建，因此与当前表格对应。跨表格使用掩码时，即使两个表都有相同的 `0, 1, 2, ...` 默认索引，也不能据此认定它们代表同一批细胞；如果索引无法对齐，pandas 可能报错，而标签碰巧相同却对应不同观察单位时，还可能产生更隐蔽的错配。

## `if`、循环和推导式：先看执行范围

### `if`：条件满足时才执行

```python
if missing_columns:
    raise ValueError(f"缺少必要列：{sorted(missing_columns)}")
```

非空集合在条件中被视为真，空集合被视为假。因此只有确实缺列时才会触发报错。

这一写法简洁，但初学者应把它翻译成完整条件：

> 如果 `missing_columns` 不是空集合，就停止程序并报告缺少哪些列。

### `for`：依次处理多个元素

```python
for column_name in ["n_genes", "percent_mito"]:
    print(column_name)
```

`column_name` 会依次指向列表中的每个元素。缩进代码属于循环体。

如果循环中修改了列表、表格或文件，必须确认修改是否会累积，以及每次迭代处理的是细胞、样本还是基因。

### `while`：条件为真时持续重复

```python
attempt = 0

while attempt < 3:
    print(attempt)
    attempt = attempt + 1
```

如果循环条件始终为真，程序可能无法结束。审核 AI 生成的 `while` 时，应找到哪个操作会让条件最终变为假。

### 列表推导式先会读，不要求现在手写

```python
uppercase_genes = [gene.upper() for gene in marker_genes]
```

它可以展开理解为：

```python
uppercase_genes = []

for gene in marker_genes:
    uppercase_genes.append(gene.upper())
```

推导式可以简化代码，也可能把多个条件塞进一行。初学阶段如果一行难以解释，应要求 AI 展开成普通循环再审核。

## 报错、警告和日志不是同一回事

| 现象 | 常见含义 | 第一检查点 |
| --- | --- | --- |
| `SyntaxError` | 代码结构无法解析 | 查看指出的行及其前一行，检查括号、冒号和引号 |
| `IndentationError` 或 `TabError` | 缩进层级有问题 | 检查空格、制表符和代码块边界 |
| `NameError` | 使用了尚未定义的名称 | 查找名称应在哪一行或哪个单元格创建 |
| `TypeError` | 操作与对象类型不匹配 | 查看对象实际类型和函数输入 |
| `KeyError` | 字典键或表格列标签不存在 | 打印实际键或列名，检查拼写和空格 |
| `FileNotFoundError` | 指定路径没有找到文件 | 检查工作目录、路径和文件名 |
| `ModuleNotFoundError` | 当前解释器找不到模块 | 检查实际 Python 与项目环境 |

未处理的异常通常会停止当前执行。traceback 的最后一行通常给出异常类型和直接说明，上面的内容显示调用经过了哪些文件、函数和代码行。

不要只截取最后一行给 Codex。完整 traceback、运行命令、Python 版本、工作目录和输入对象结构更有助于定位根因。

警告通常不会立即停止程序，但可能提示：

- 某个接口即将改变；
- 数据类型被自动转换；
- 某个计算存在数值问题；
- 当前操作可能产生模糊结果。

日志或普通输出只是程序主动显示的信息，不自动等于错误。是否可信仍要看代码记录了什么，以及关键检查是否真的执行。

## 读一段 AI 生成的 Python 代码，按固定顺序检查

### 1. 确认运行位置和环境

记录 Python 版本、解释器路径、项目环境、软件包版本、脚本或 notebook 名称，以及当前工作目录。

### 2. 找到所有外部输入

搜索可能读取数据的操作，例如：

```python
pd.read_csv(...)
pd.read_excel(...)
Path(...).read_text(...)
open(...)
```

确认路径、文件格式、分隔符、编码、样本和参考数据版本。

### 3. 列出重要名称及其对象类型

例如：

```text
metadata_path → Path，输入文件路径
cells → DataFrame，原始细胞元数据
keep → Series，每行一个真假值
filtered_cells → DataFrame，筛选结果
average_genes → 数值标量，常显示为小数；表示筛选后各行的平均检测基因数
```

如果不能说明一个名称指向什么，就先查看它的创建位置、`type()`、形状、列名和少量示例值。

### 4. 沿着名称追踪修改和重新赋值

检查：

- 同一个名称是否在后面被重新赋值；
- 方法是否原地修改对象；
- 两个名称是否指向同一个可修改对象；
- notebook 是否依赖旧单元格状态；
- 筛选后是否创建新对象，还是覆盖原对象。

### 5. 把所有条件翻译成句子

把：

```python
(cells["n_genes"] >= 500) & (cells["percent_mito"] < 10)
```

翻译为：

> 对每一行，要求 `n_genes` 至少为 500，并且 `percent_mito` 小于 10。

然后继续追问阈值依据、单位、缺失值政策和不同样本的分布。

### 6. 找到写文件、联网或改变环境的操作

搜索：

```python
to_csv(...)
write_text(...)
unlink(...)
shutil.rmtree(...)
subprocess.run(...)
os.environ[...]
```

在执行前确认目标路径、覆盖行为、命令内容、下载来源和凭据处理方式。

### 7. 检查关键中间结果

至少检查：

- 输入表形状和列名；
- 标识符是否唯一；
- 缺失值数量；
- 每个条件单独保留多少行；
- 组合条件后保留多少行；
- 每个生物学样本分别保留多少细胞；
- 输出索引是否与关联对象一致。

只看最后一张图或最后一个平均值，无法发现中间步骤是否已丢失整个样本。

### 8. 最后审核科学含义

代码运行成功只说明 Python 接受了这些指令。它不能自动证明：

- 阈值适合当前组织和实验方案；
- 百分比单位被正确理解；
- 每一行确实代表一个细胞而不是细胞核或空间位置；
- 生物学重复足以支持推断；
- 过滤没有系统性排除某类细胞；
- 参考基因组、注释和特征标识符正确；
- 统计结论能够回答原始生物学问题。

## 让 Codex 解释 Python 时，要求它提供可核对的证据

弱问题：

```text
解释这段 Python。
```

更可核对的提问：

```text
请把这段 Python 当作需要审核的生物信息学代码，而不是只做逐行翻译。

1. 先说明它应在终端、Python 脚本还是 notebook 中运行。
2. 列出所有外部输入、输出路径和会改变环境的操作。
3. 为每个重要名称说明对象类型、形状、索引和列名。
4. 把每个筛选条件翻译成普通语言，说明括号、缺失值和运算符的作用。
5. 区分普通 Python 布尔值与 pandas/NumPy 逐元素逻辑运算。
6. 指出哪些行会修改已有对象，哪些行创建新对象。
7. 给出最小的只读检查代码，但不要覆盖原始数据或文件。
8. 对照当前版本的 Python、pandas 和相关软件包官方文档说明关键行为。
9. 最后列出仍需研究者判断的生物学假设。
```

AI 的解释也需要核对。特别是对象类型、函数签名、软件包版本、默认参数和缺失值行为，应以实际环境和官方文档为准。

## AI 生成代码中需要停下来检查的写法

| 写法 | 可能影响 | 执行前要问 |
| --- | --- | --- |
| `data = transformed_data` | 名称改为指向另一个对象 | 旧对象还能否追踪？ |
| `list_a = list_b` | 两个名称可能指向同一可修改列表 | 后续修改会不会同时影响两者？ |
| `df.drop(..., inplace=True)` | 直接修改 DataFrame | 是否需要保留原表？当前 pandas 版本行为是什么？ |
| `df.to_csv(path)` | 写出或覆盖文件 | 路径、索引列和覆盖策略是否正确？ |
| `Path(path).unlink()` | 删除文件 | 路径是否经过明确核对？是否有备份？ |
| `shutil.rmtree(path)` | 递归删除目录 | 目标是否严格限制在预期目录？ |
| `subprocess.run(..., shell=True)` | 通过 shell 执行命令 | 命令是否包含未经验证的输入？ |
| `pip install ...` | 修改软件环境 | 是否应在项目环境中安装并记录版本？ |
| `requests.get(url)` | 从网络读取内容 | 来源、许可证、大小和校验方式是什么？ |
| `os.environ["TOKEN"]` | 读取凭据 | 是否可能被打印、记录或写入文件？ |

不是所有这些写法都错误。风险来自它们可能修改数据、文件、环境或外部系统，所以执行前需要更严格的证据。

## 完整读懂开头的示例

假设 `cell_metadata.csv` 保存的是下面这些精确内容：

```csv
cell_id,sample_id,n_genes,percent_mito
AAAC-1,sample_A,900,4.1
AAAG-1,sample_A,650,8.2
AAAT-1,sample_B,350,3.2
AACG-1,sample_B,1200,12.5
AACT-1,sample_B,,2.1
AAGA-1,sample_B,800,
```

最后两行中的连续逗号表示真正的空字段，不要把中文“缺失”写入 CSV。按本示例的默认读取方式，这两个空字段会被 pandas 识别为缺失值。

示例中的 `500` 和 `10` 只是为了学习语法而设置的虚构阈值，不是通用的单细胞质量控制标准。真实阈值取决于组织、实验方案、测序深度、细胞或细胞核类型、指标分布和下游目标。

### 第一步：导入所需名称

```python
from pathlib import Path

import pandas as pd
```

- `Path` 用于表示和检查路径；
- `pd` 是当前代码给 pandas 使用的简称。

### 第二步：建立路径并读取表格

```python
metadata_path = Path("cell_metadata.csv")
cells = pd.read_csv(metadata_path)
```

- `metadata_path` 指向一个相对路径；
- `pd.read_csv()` 读取 CSV 文件；
- `cells` 指向得到的 DataFrame。

运行前应确认 `Path.cwd()`、文件名、分隔符和编码。读取成功也不保证列类型、缺失值标记或单位正确。

### 第三步：检查必要列

```python
required_columns = {"cell_id", "sample_id", "n_genes", "percent_mito"}
missing_columns = required_columns - set(cells.columns)
if missing_columns:
    raise ValueError(f"缺少必要列：{sorted(missing_columns)}")
```

- `set(cells.columns)` 把实际列名转成集合；
- 集合差集找出缺少的必要列；
- 如果集合非空，就停止并明确报告列名；
- `sorted()` 只用于让报错中的列名顺序稳定、容易阅读。

检查列是否存在，仍不等于检查了数据类型、单位、唯一标识符和数值范围。

### 第四步：构建逐行筛选条件

```python
keep = (
    cells["n_genes"].notna()
    & cells["percent_mito"].notna()
    & (cells["n_genes"] >= 500)
    & (cells["percent_mito"] < 10)
)
```

对每一行，要求：

1. `n_genes` 不是缺失值；
2. `percent_mito` 不是缺失值；
3. `n_genes` 至少为 500；
4. `percent_mito` 小于 10。

四个条件都为真时，对应位置的 `keep` 才为 `True`。

### 第五步：筛选并明确复制结果

```python
filtered_cells = cells.loc[keep].copy()
```

`.loc[keep]` 选择条件为真的行，`.copy()` 创建一个新的 DataFrame 对象用于后续操作；对当前数值型示例，普通的后续表格修改不再直接作用于原表，但复制层级仍以上文说明为准。

预期筛选结果：

| cell_id | sample_id | n_genes | percent_mito |
| --- | --- | ---: | ---: |
| AAAC-1 | sample_A | 900 | 4.1 |
| AAAG-1 | sample_A | 650 | 8.2 |

预期保留 2 行，而且两行都来自 `sample_A`；`sample_B` 保留 0 行。即使总行数和均值看起来正常，整个样本消失也必须暂停，并检查阈值、输入数据、指标单位和该样本的质量。正式多样本分析还应把样本或文库标识纳入输入结构验证，并分别记录每个样本在每个条件后保留的细胞数。

### 第六步：计算并明确显示平均值

```python
average_genes = filtered_cells["n_genes"].mean()
print(average_genes)
```

平均值是：

```text
775.0
```

这个值只是两个保留行的 `n_genes` 算术平均数。它不能证明筛选规则合理，也不能代表独立生物学样本之间的差异。

本例已经排除了 `n_genes` 缺失的行。pandas 的均值默认跳过缺失值；如果筛选结果为空，均值可能显示为 `NaN`，而不是自动报错。因此必须先检查保留行数或 `filtered_cells.empty`，不能把空结果当作有效均值。

### 这段代码仍然没有完成真实单细胞对象的同步筛选

这里得到的只是筛选后的元数据表。它不会自动同步过滤：

- 基因表达矩阵；
- AnnData 中的其他层、嵌入和图结构；
- 单细胞多组学对象中的其他模态；
- 空间组学中的坐标、图像和位置特征；
- 其他按细胞或位置关联的结果。

如果数据已经组织在 AnnData 中，通常应沿观察轴筛选整个对象，而不是只导出并过滤 `.obs`；这样与观察轴对齐的 `X`、`layers`、`obsm` 和 `obsp` 会一起被子集化。AnnData 切片通常返回视图，后续需要修改时再根据对象语义决定是否调用 `.copy()`。

这只是对象边界提示。多模态或空间对象并不保证所有内容都逐行对应细胞或位置；图像、坐标系和坐标变换等共享信息不能机械地套用同一布尔掩码。具体对象操作留到后续课程。

真实项目中应使用经过核对、并且在当前项目范围内全局唯一的观察标识符同步选择关联对象。多样本或多文库数据中的细胞条形码可能重复，通常需要把样本或文库标识与条形码组合起来；随后验证一对一关系、标识符集合、数量和顺序。不能只假定“两个表的第 10 行代表同一个细胞”。

## 本节需要保留的最低代码素养

面对一段 Python 代码，你不必依靠记忆重写它，但至少应该能够：

- 区分终端命令、交互式输入、脚本和 notebook 单元格；
- 认出缩进、名称、赋值、函数、方法、属性、注释和字符串；
- 区分常见数字、字符串、布尔值、`None` 和容器；
- 知道赋值不一定复制可修改对象；
- 看懂从 0 开始的索引、半开切片、`.loc` 和 `.iloc` 的基本区别；
- 区分 `=`、`==`、`is None`、`and` 与 pandas 的 `&`；
- 知道 `None`、`NaN`、`pd.NA` 和空字符串需要明确处理；
- 追踪输入、名称变化、筛选条件和输出；
- 找到可能覆盖文件、修改环境、运行 shell 或读取凭据的操作；
- 用真实对象结构、软件版本和官方文档核对 AI 的解释；
- 说明代码执行成功与生物学结论成立之间仍缺少哪些验证。

在 AI 可以快速生成代码的今天，语法记忆的重要性可以下降，但代码理解的重要性反而更高。生成速度越快，越需要有人确认代码处理的是正确对象、执行的是正确条件，并且没有把计算成功误当成科学结论成立。

## 参考资料

1. [Python 官方教程：Python 的非正式介绍、注释、赋值、字符串、列表与切片](https://docs.python.org/3/tutorial/introduction.html)
2. [Python 官方教程：`if`、`for` 与函数](https://docs.python.org/3/tutorial/controlflow.html)
3. [Python 官方教程：列表、元组、集合和字典](https://docs.python.org/3/tutorial/datastructures.html)
4. [Python 官方教程：模块和软件包](https://docs.python.org/3/tutorial/modules.html)
5. [Python 官方教程：错误与异常](https://docs.python.org/3/tutorial/errors.html)
6. [Python 语言参考：缩进规则](https://docs.python.org/3/reference/lexical_analysis.html#indentation)
7. [Python 标准库：`pathlib`](https://docs.python.org/3/library/pathlib.html)
8. [pandas 官方指南：索引与逻辑筛选](https://pandas.pydata.org/docs/user_guide/indexing.html#boolean-indexing)
9. [pandas 官方文档：`DataFrame.loc`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.loc.html)
10. [pandas 官方文档：缺失值检测](https://pandas.pydata.org/docs/reference/api/pandas.notna.html)
11. [pandas 官方文档：`DataFrame.copy`](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.copy.html)
12. [Python 标准库：浅复制与深复制](https://docs.python.org/3/library/copy.html)
13. [pandas 官方文档：`Series.mean`](https://pandas.pydata.org/docs/reference/api/pandas.Series.mean.html)
14. [pandas 官方指南：Copy-on-Write](https://pandas.pydata.org/docs/user_guide/copy_on_write.html)
15. [AnnData 官方文档：`AnnData`](https://anndata.readthedocs.io/en/stable/generated/anndata.AnnData.html)
