# 1.2｜10X下的cellranger和spaceranger的安装

本节将教会你如何在linux系统内安装 Cell Ranger，进一步得到基因表达矩阵。以及如何安装 Space Ranger，把表达计数对应到组织切片上的位置。[Cell Ranger 官方安装教程](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in) · [Space Ranger 官方安装教程](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

## 一、安装 Cell Ranger

### 1. 下载并解压 Cell Ranger 10.1.0
https://www.10xgenomics.com/support/software/cell-ranger/downloads#download-links 在这个网页中复制下载链接到linux中后下载并解压。

### 2. 下载并解压人类参考包

分析人类样本时，下载 **[Human reference (GRCh38) - 2024-A（约 11 GB）](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)**。GRCh38 是人类参考基因组的组装版本，2024-A 是 10x 的参考包版本。Cell Ranger 用包里的序列、基因注释和索引判断读段来自哪个基因。

解压后，`--transcriptome` 填整个参考目录文件夹的位置。处理小鼠样本时，改用小鼠参考包。

### 3. 把 Cell Ranger 加入 `PATH`

解压后程序已经存在。为了能在存放样本的目录中直接输入 `cellranger`，还需要告诉 Bash 去哪里找它。`PATH` 是用冒号分隔的一串目录，Bash 从左向右查找命令。下面把刚安装的目录放在第一位，再用 `:$PATH` 保留原来的搜索目录。[官网安装教程的 PATH 步骤](https://www.10xgenomics.com/support/software/cell-ranger/latest/tutorials/cr-tutorial-in)

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
command -v cellranger
cellranger --version
```

第一项检查应显示你个人目录下以 `/10x-tools/cellranger-10.1.0/cellranger` 结尾的路径，第二项应显示 `10.1.0`。如果显示 `command not found`，先核对上一步的可执行文件是否存在。如果显示旧版本，用 `type -a cellranger` 查看终端能找到的所有同名命令，再核对刚才加入的目录是否在最前。

**让下次打开终端也能使用。** 刚才的 `export` 只对当前 Bash 及其子进程生效。可以用文本编辑器打开个人配置文件，例如执行 `nano ~/.bashrc`，把下面一行放在末尾。已有同一行时保留一份即可。

```bash
export PATH="$HOME/10x-tools/cellranger-10.1.0:$PATH"
```

在 nano 中按 `Ctrl+O`、回车保存，再按 `Ctrl+X` 退出。执行下面的命令重新读取配置，然后新开一个你平时使用的服务器终端，再输入 `cellranger --version` 核对。

```bash
source "$HOME/.bashrc"
command -v cellranger
cellranger --version
```

`~/.bashrc` 是交互式非登录 Bash 自动读取的配置文件。通过 SSH 登录时，是否也读取它取决于个人登录配置。若只有重新登录后才找不到命令，检查现用的登录配置（常见为 `~/.bash_profile`）是否已加载 `~/.bashrc`。提交集群作业时，可把同一条 `export PATH=...` 写在作业脚本中，确保实际计算节点使用指定的版本。[Bash 启动文件说明](https://www.gnu.org/software/bash/manual/html_node/Bash-Startup-Files.html)

### 4. 读懂 `cellranger` 的 usage

在任意目录运行下面三行。第一行看软件能做哪些工作，后两行看某个工作的具体参数。查看帮助只会打印说明。

```bash
cellranger --help
cellranger count --help
cellranger testrun --help
```

帮助里的 `Usage` 是命令的写法。以 `cellranger testrun --id=check_install` 为例，`cellranger` 是程序，`testrun` 是要它执行的子命令，`--id` 是参数名，`check_install` 是你给这次运行取的名字。帮助里的 `<ID>` 要替换成自己的值，`[OPTIONS]` 表示这里可以加选项。尖括号和方括号都不用照抄。`-h` 或 `--help` 查看帮助，`-V` 或 `--version` 显示版本。

| 在帮助里看到的子命令 | 用途 |
| --- | --- |
| `testrun` | 用软件自带的小数据验证安装。 |
| `count` | 对单样本、一次细胞捕获的常规基因表达等文库做计数。文库是从样本制备出来、供测序的一批分子。 |
| `multi`、`multi-template` | `multi` 按配置表处理混样、Flex 或联合多种文库的实验。`multi-template` 生成配置表模板。 |
| `vdj`、`mkvdjref` | `vdj` 从免疫组库测序中重建 T 或 B 细胞的受体序列。`mkvdjref` 构建这类分析专用的参考包。 |
| `aggr`、`reanalyze`、`annotate` | `aggr` 汇总多次分析结果。`reanalyze` 从现有矩阵重做降维和聚类。`annotate` 给已有结果推断细胞类型。 |
| `mkref`、`mkgtf`、`mat2csv` | `mkref` 从序列和基因注释建立自定义参考。`mkgtf` 按属性筛选基因注释。`mat2csv` 把矩阵转换成 CSV 表格，大矩阵展开后可能很大。 |
| `sitecheck`、`upload`、`telemetry`、`cloud`、`help` | `sitecheck` 收集机器配置信息。`upload` 将指定诊断文件交给 10x 支持。`telemetry` 查看或配置软件使用信息的收集。`cloud` 操作 10x 云端服务。`help` 查看指定命令的帮助。 |

旧教程还可能出现 `mkfastq`，它已被标记为弃用。若测序平台已经交付 FASTQ（保存序列和测序质量的文件），可以从 FASTQ 开始，本节自检甚至不需要自己的样本。[Cell Ranger 命令说明](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments) · [10.1.0 命令源码](https://github.com/10XGenomics/cellranger/blob/cellranger-10.1.0/lib/rust/cr_wrap/src/bin/cellranger.rs)

读 `cellranger count --help` 时，可以先找到下面几项，理解一条命令怎样把输入连到输出。

| 设置 | Cell Ranger 10.1.0 默认值或省略行为 | 在一份真实样本中填什么 |
| --- | --- | --- |
| `--id` | 无默认值，必填。 | 给这次运行和输出目录起名，例如 `GEX_A`。 |
| `--fastqs` | 无默认路径，本例必填。 | 填测序文件所在目录。 |
| `--sample` | 只有一个样本前缀时自动选用。检测到多个前缀时，省略会报错。 | 填目标样本的文件名前缀，例如 `GEX_A_S1_L001_R1_001.fastq.gz` 的前缀是 `GEX_A`。 |
| `--transcriptome` | 无默认参考，本例必填。 | 填第 2 步解压出的整个参考目录。 |
| `--localcores` | 本地模式使用全部可用 CPU 核。 | 填分配给这次作业的核数。 |
| `--localmem` | 本地模式使用检测到的内存的 90%。 | 以 GB 为单位填写内存上限，取值应在作业配额内。 |
| `--create-bam` | 无默认值，必须显式选 `true` 或 `false`。 | 需要逐条读段的比对文件时选 `true`，只用表达矩阵时可选 `false`。 |
| `--include-introns` | `true`（常规全转录组 3′/5′ 基因表达）。 | 保留默认值会把符合条件的内含子读段纳入计数，选 `false` 则排除。 |
| `--nosecondary` | 默认关闭此开关，软件会运行内置二级分析。 | 准备自行降维、聚类时，加上 `--nosecondary` 即可跳过这一步。 |

### 5. 用 `testrun` 验证安装，常见报错处理

**如果报错中出现以下文字，先检查运行自检的那台机器。** 这条报错指向操作系统兼容性，更换参考包或重复解压软件都解决不了它。

```text
ERROR: This operating system version is unsupported:
    CentOS Linux release XXX (Core)
...
To continue running this version for now, set TENX_IGNORE_DEPRECATED_OS=1
```
对正式项目，向管理员申请符合当前 10x 要求的计算节点，在新节点确认 `cellranger --version`，再做一次自检。集群登录节点和实际运行作业的节点可能使用不同的系统。[10x 操作系统兼容表](https://www.10xgenomics.com/support/software/cell-ranger/latest/miscellaneous/cr-os-requirements) · [10.1 系统要求](https://www.10xgenomics.com/support/software/cell-ranger/downloads/cr-system-requirements)

处理方法：加入 `export TENX_IGNORE_DEPRECATED_OS=1`。

### 6. 版本变化与正式计数的参数选择

`testrun` 检查软件能否运行。真正把自己的 FASTQ 转成表达矩阵用 `count`。读旧脚本时，优先核对下面几处会改变结果或输出文件的设置。[Cell Ranger 发布说明](https://www.10xgenomics.com/support/software/cell-ranger/latest/release-notes/cr-release-notes) · [10.1 参数说明](https://www.10xgenomics.com/support/software/cell-ranger/latest/getting-started/cr-command-line-arguments)

| 哪个版本改变了什么 | 用在自己的项目上意味着什么 |
| --- | --- |
| **7.0 起**，常规全转录组 3′/5′ 基因表达默认 `--include-introns=true`。早期默认排除内含子。 | 内含子是成熟 RNA 剪接时通常被移除的部分。设为 `true` 后，符合比对条件且能归属到相应基因的内含子读段也能为分子计数提供证据，对含较多未剪接 RNA 的细胞核尤其有用。设为 `false` 则排除这类证据。这个选择可能改变每个基因的计数，复现旧结果要核对原设置。 |
| **8.0 起**，`count` 要求显式写出 `--create-bam=true` 或 `false`，替代旧写法 `--no-bam`。 | BAM 是逐条记录读段如何比对的文件。后续只用矩阵、已有质控方案时，本教程推荐 `false`，可以节省磁盘和写文件的时间。需要用基因组浏览器检查比对、下游工具要求 BAM，或尚未确定用途时，选 `true`。两种选择都会生成表达矩阵。 |
| **10.1** 对人类数据默认启用本地 Pan-Human Azimuth 细胞类型注释。默认二级分析保留 UMAP，t-SNE 默认关闭。 | `--disable-cell-annotation` 单独关闭自动细胞类型注释。若保留内置二级分析并需要 t-SNE，可加 `--enable-tsne=true`。UMAP 和 t-SNE 都是把高维表达数据投影到低维、便于观察的方法。 |

**怎样选 `--nosecondary`？** 第一次练习可以保留默认的二级分析，先看 10x 生成的降维和聚类结果。如果你已有分析经验，打算从表达矩阵出发在 Seurat 或 Scanpy 中自行做降维、聚类，可在 `cellranger count` 中加上 `--nosecondary`。它是一个独立开关，直接写参数名即可。这样会省去内置二级分析的计算时间，同时也会缺少对应结果。`--create-bam=false` 控制比对文件，两者可以独立选择。

## 二、安装 Space Ranger

### 1. 下载并解压 Space Ranger 4.1.0

它把 Visium 测到的 RNA 对应到组织切片上的捕获位置。[Space Ranger 官方安装教程](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation) · [系统要求](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)。
最新版的spaceranger可以在以下链接找到，下载对应压缩包并且解压。<https://www.10xgenomics.com/support/software/space-ranger/downloads>。

**下载并解压人类参考包。** Space Ranger 和 Cell Ranger 使用同一份 **[Human reference (GRCh38) - 2024-A（约 11 GB）](https://cf.10xgenomics.com/supp/cell-exp/refdata-gex-GRCh38-2024-A.tar.gz)**。前面已解压过的读者直接进入下一步。

运行 `spaceranger count` 时，`--transcriptome` 填写解压后参考包的位置。
### 2. 配置 `PATH`，查看 usage

```bash
export PATH="$HOME/10x-tools/spaceranger-4.1.0:$PATH"
command -v spaceranger
spaceranger --version
```

路径应以 `/spaceranger-4.1.0/spaceranger` 结尾，版本应为 `4.1.0`。用 `nano ~/.bashrc` 把上面的 `export` 行另存为一行，再执行 `source ~/.bashrc`。新开终端，用 `spaceranger --version` 再查一次。装了两款软件时，`.bashrc` 里应分别有各自的 `export` 行。

```bash
spaceranger --help
spaceranger testrun --help
spaceranger count --help
```

帮助仍按“程序、子命令、参数”阅读。`--help` 查看命令写法，`--version` 查看软件版本。常见子命令分工如下。[Space Ranger 命令说明](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/command-line-arguments)

| 子命令 | 用途 |
| --- | --- |
| `testrun`、`count` | `testrun` 用自带数据自检。`count` 处理一个真实捕获区，输出表达矩阵、空间坐标和组织图像相关结果。 |
| `segment`、`annotate` | `segment` 在支持的 Visium HD 组织图像上识别细胞核。`annotate` 对符合条件的 HD 细胞分割结果推断细胞类型。 |
| `aggr` | 汇总兼容的多个捕获区分析结果。4.1 的 `aggr` 不支持 Visium HD。 |
| `mkref`、`mkgtf`、`mat2csv` | 分别用于构建参考、筛选基因注释、将表达矩阵转换成 CSV。 |
| `sitecheck`、`upload`、`telemetry`、`cloud` | 分别用于检查计算环境、将诊断文件交给技术支持、管理使用信息收集和操作 10x 云服务。旧流程中的 `mkfastq` 已弃用。 |

### 3. 试跑一次，认出离线节点的报错

```bash
cd "$HOME/10x-work"
spaceranger testrun --id=check_spaceranger
```

`--id` 给本次输出目录命名。等到终端出现 `Pipestance completed successfully!`，即完成安装验证。若提示系统版本不受支持，先在实际计算节点运行 `cat /etc/os-release`，按 Space Ranger 自己的系统要求换节点。CentOS 7.5 也不满足 Space Ranger 4.1 的要求。[Space Ranger 系统要求](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-system-requirements)

若看到 `Could not retrieve spot layout data`，它表示程序没能获取玻片上捕获位置的布局。确认计算节点无法联网后，**自检**可按官网说明启用离线模式，再用新的结果目录重试。

```bash
spaceranger testrun --no-internet --id=check_spaceranger_offline
```

**正式分析自己的玻片**时，应在可联网的机器上按真实玻片序列号下载布局文件，传到计算节点，在 `spaceranger count` 中提供 `--slidefile`、`--slide` 和 `--area`。自检通过之后仍要核对实际玻片、捕获区和图像是否一一对应。[官方离线自检与布局文件说明](https://www.10xgenomics.com/support/software/space-ranger/downloads/space-ranger-installation)

### 4. 把 usage 对应到一个 Visium 捕获区

下例选最容易辨认输入的实验：**原版 Visium v1、新鲜冷冻人类组织、H&E 明场图像**。H&E 是苏木精和伊红染色，用来显示组织结构。`V10J25-015`、`A1`、`Tissue_A` 和图像文件名均为示例，做自己样本时，需根据玻片和测序交付单逐一替换。仅验证安装的读者做到上一步即可。

```bash
cd "$HOME/10x-work"
spaceranger count --id=visium_A \
  --transcriptome="$HOME/10x-work/refs/refdata-gex-GRCh38-2024-A" \
  --fastqs="$HOME/10x-work/fastqs/Tissue_A" --sample=Tissue_A \
  --image="$HOME/10x-work/images/Tissue_A_HE.tif" \
  --slide=V10J25-015 --area=A1 \
  --include-introns=true --create-bam=false
```

| 示例中的设置 | Space Ranger 4.1.0 默认值或省略行为 | 填什么、会改变什么 |
| --- | --- | --- |
| `--id` | 无默认值，必填。 | 给本次结果目录起名。示例输出在 `visium_A/`。 |
| `--transcriptome` | 无默认参考，必填。 | 填解压后的人类参考包目录。 |
| `--fastqs` | 无默认路径，本例必填。 | 填这个捕获区的测序文件所在目录。 |
| `--sample` | 只有一个样本前缀时自动选用。检测到多个前缀时，省略会报错。 | 填目标捕获区的 FASTQ 文件名前缀，本例是 `Tissue_A`。 |
| `--image` | 无默认图像。本例使用 H&E 明场图像，需提供其路径。 | 填这个捕获区的显微镜图像。软件用它识别组织，并将测序坐标与图像对齐。 |
| `--slide` | 无默认序列号，本例必填。 | 填实际玻片上的序列号。示例为 `V10J25-015`。 |
| `--area` | 无默认捕获区，本例须与 `--slide` 一起填写。 | 填玻片记录中的捕获区编号，示例为 `A1`。每个捕获区分别运行。 |
| `--include-introns=true` | `true`（本例为 Visium v1）。 | 示例保留默认值，允许符合条件的内含子读段参与分子计数。 |
| `--create-bam=false` | 无默认值，必须显式选 `true` 或 `false`。 | 示例选 `false`，保留表达矩阵和空间输出，省去逐条读段的 BAM。需要检查比对或尚未确定下游用途时选 `true`。 |

运行后先打开 `visium_A/outs/web_summary.html` 查看该捕获区的空间质控概览。对应的图像与位置坐标保存在 `visium_A/outs/spatial/`。原版 Visium 矩阵中的每个条形码代表一个空间捕获点，一点可覆盖多个细胞。[空间输出示例](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/outputs/spatial-outputs)

**读其他版本的脚本时注意三处变化。**

| Space Ranger 版本 | 对命令或输出的影响 |
| --- | --- |
| **3.0 起** | `count` 需要显式指定 `--create-bam=true` 或 `false`。只用矩阵和空间坐标时可选 `false`，减少写盘和耗时。 |
| **4.0 系列** | 支持 Visium HD 3′，并引入基于组织图像的核与细胞分割。HD 3′ 与探针型 Visium HD 的输入要求不同，前者省略 `--probe-set`，后者需提供与实验匹配的探针表。 |
| **4.1 起** | 对 **Visium v1 和 Visium HD 3′** 默认计入内含子，复现旧的排除策略可显式写 `--include-introns=false`。探针型实验按探针对识别靶标，应核对探针表。 |

熟悉空间分析、准备自己用矩阵、组织图像和位置坐标做聚类的读者，可选择 `--nosecondary` 以省去内置二级分析时间。如果要查看软件生成的聚类结果，保留二级分析。图像是否配准正确，两种情形都要检查。[Space Ranger 版本说明](https://www.10xgenomics.com/support/software/space-ranger/latest/release-notes/release-notes-for-SR) · [HD 实验所需的不同输入](https://www.10xgenomics.com/support/software/space-ranger/latest/analysis/running-pipelines/count-visium-hd)
