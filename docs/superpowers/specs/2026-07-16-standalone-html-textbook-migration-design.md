# 独立 HTML 双语教材迁移设计

**日期：** 2026-07-16  
**状态：** 已按用户指令确定范围，等待书面规格复核  
**项目目录：** `D:\bioinformatics\.worktrees\textbook-ui`

## 1. 目标

把当前嵌入 ChatGPT/Codex 的 React 教材界面迁移为独立浏览器网页。迁移后页面占满浏览器视口，保留当前已经确认的视觉设计、整页中英文切换、章节导航、代码块、外部数据卡片和更新入口，不再依赖 ChatGPT Apps/MCP 宿主才能显示或操作。

本轮只完成网页迁移。教材内容仍使用现有示例占位内容，不重新编排生物信息学课程。

## 2. 已确定的产品边界

### 本轮包含

- 独立 React/Vite HTML 页面，可在 Chrome 中打开和预览。
- 页面背景、顶部栏、章节导航、阅读区、代码块、数据卡片、环境区和中英文切换沿用当前 UI。
- 页面使用完整浏览器视口，不受 ChatGPT 对话内嵌卡片宽度限制。
- 代码复制、外部链接、章节切换和语言切换在网页内正常工作。
- 教材内容访问从 MCP 工具调用改为浏览器内容提供器。
- 为以后接入 Biolearning Runner 预留稳定的 TypeScript 接口。
- 本地 R、本地 Python、SSH/HPC 继续显示为未连接或后续开放，不执行任何探测和命令。

### 本轮不包含

- 不从网页调用 ChatGPT、Codex、Gemini 或其他模型。
- 不保留当前插件内的 `sendMessage`、`ui/message` 或选中内容后自动发到宿主对话的生产路径。
- 不启动 R、Python、Shell、SSH、Cell Ranger 或任务调度器。
- 不开发 Biolearning Runner。
- 不请求、保存或传递服务器账号、密码、令牌和 SSH 密钥。
- 不部署公开网站；本轮交付可构建、可本地预览的静态网页。
- 不重新编排教材内容。

用户已经安装的 Chrome AI 侧栏插件可独立用于阅读时提问，但它不属于教材网页代码，也不作为本轮验收依赖。

## 3. 方案比较与选择

### 选择：复用 React UI，替换宿主桥

保留现有 React 组件和 CSS，将 `TextbookBridge` 拆成与宿主无关的内容接口；新增独立网页实现，从静态内容读取课程、章节和数据目录。这样可以最大限度保持当前视觉效果，也避免维护两套页面。

### 未选择：重写为原生 HTML/CSS/JavaScript

文件表面更简单，但会重复实现语言切换、状态、Markdown 渲染、对话框和组件样式，视觉容易漂移，后续维护成本更高。

### 未选择：继续以 MCP 插件作为网页外壳

可以复用现有工具调用，但仍受到宿主内嵌宽度和对话布局限制，不符合此次改为独立全屏 HTML 的目标。

## 4. 目标架构

```text
浏览器静态网页
├── React 教材 UI
├── WebContentProvider
│   ├── 读取课程索引
│   ├── 读取中英文课程章节
│   └── 读取外部数据目录
├── BrowserStateStore
│   └── 保存语言、章节和侧栏状态
└── NullExecutionRunner
    ├── Local R：未连接
    ├── Local Python：未连接
    └── SSH/HPC：未连接

未来阶段
Biolearning Runner
├── 本地 R
├── 本地 Python
└── SSH / 调度系统
```

页面和执行层通过接口隔离。未来接入 Runner 时只替换 `NullExecutionRunner`，不改教材阅读组件。

## 5. 目录与代码边界

迁移后使用一个独立网页目录承载正式入口：

```text
web/
├── index.html
├── package.json
├── vite.config.ts
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   ├── styles/
│   ├── content/
│   │   ├── content-provider.ts
│   │   └── static-content-provider.ts
│   ├── runtime/
│   │   ├── execution-runner.ts
│   │   └── null-execution-runner.ts
│   └── state/
└── content/
    └── development fixtures
```

现有 `plugin/codex-bilingual-textbook/app/src/web` 中可复用的组件和样式迁入 `web/src`。ChatGPT Apps/MCP 专用桥、MCP server、插件内消息发送组件和插件启动代码不进入独立网页的运行依赖。与独立网页无关的旧原型文件在迁移验证通过后再做最小清理。

## 6. 内容与状态数据流

### 打开教材

1. 浏览器加载静态 HTML、JavaScript 和 CSS。
2. `WebContentProvider` 读取课程索引和默认语言章节。
3. 页面恢复浏览器本地保存的语言和上次章节；无有效状态时使用课程默认值。
4. 阅读区、数据卡片和环境状态同时渲染。

### 切换语言或章节

1. 用户点击语言或章节控件。
2. 内容提供器按稳定章节 ID 读取对应语言内容。
3. 页面保持当前章节位置规则，并把选择写入浏览器本地状态。
4. 找不到对应翻译时显示明确错误，不静默混入另一种语言。

### 内容更新

本轮保留更新 UI 和内容提供器边界，但不实现新的远程发布流程。开发内容从静态资源读取。以后可以新增 GitHub 内容提供器，而不修改阅读组件。

## 7. Biolearning Runner 预留接口

只定义契约，不建立网络连接：

```ts
type EnvironmentKind = "local-r" | "local-python" | "remote";

interface ExecutionRunner {
  getStatus(): Promise<RunnerStatus>;
  run(request: RunRequest): Promise<RunResult>;
  cancel(runId: string): Promise<void>;
}
```

契约为未来结果预留以下类别：

- 标准输出和标准错误；
- 退出状态与耗时；
- 表格结果；
- 图片或文件结果；
- 远程任务 ID 和排队状态。

本轮的 `NullExecutionRunner` 只返回 `unavailable`。页面不显示可误点的运行按钮，也不向 `localhost`、服务器或 MCP 地址发送请求。

以后真正实现 Runner 时，必须另行设计配对、来源白名单、逐次执行确认、工作目录、资源限制、凭据保存和审计，不在本规格中提前决定。

## 8. Codex 交互边界

独立 HTML 不再内建“选中后发送到 Codex”的宿主消息能力。用户当前可以通过已安装的 Chrome AI 侧栏手动框选或引用页面内容提问。

未来若需要网页按钮直接把代码交给 Codex，再单独实现 `AssistantHandoff` 适配器，并以当时公开、受支持的 Codex 接口为准。未有受支持的接口前，不用伪造链接协议或自动化本地应用点击。

## 9. 错误处理

- 静态课程索引加载失败：显示独立错误页和重试按钮。
- 章节加载失败：保留导航和上一份已成功内容，显示章节级错误。
- 翻译缺失：显示“该语言版本尚未发布”，不自动回退为另一种语言。
- 本地状态损坏：忽略损坏值并恢复默认值，不阻止阅读。
- Runner 未连接：保持环境项禁用，不弹出凭据或安装提示。
- 外部链接不可用：浏览器正常显示打开失败，不自动替换来源。

## 10. 验收标准

- `pnpm build` 和 TypeScript 类型检查通过。
- 独立页面无需 ChatGPT Apps/MCP 宿主即可加载。
- Chrome 中页面填满视口；宽屏、普通笔记本宽度和手机宽度不出现横向溢出。
- 当前确认的颜色、字体层级、卡片、导航和代码块视觉保持一致。
- 中文和 English 原地切换，刷新后保留选择。
- 章节导航、复制代码和外部链接正常。
- 生产入口中不存在对 `window.openai`、`sendMessage` 或 MCP `callServerTool` 的依赖。
- 本地 R、本地 Python、SSH/HPC 均显示未连接且不可执行。
- 网络检查确认页面不会尝试连接 Runner、本地端口或服务器。
- 所有测试、截图和临时构建验证产物放在 `D:\codextest\codex-bilingual-textbook-html`。

## 11. 实施顺序

1. 建立独立网页入口并迁移视觉组件。
2. 用 `WebContentProvider` 替换 MCP 内容调用。
3. 用浏览器状态存储替换宿主 widget state。
4. 移除生产路径中的插件内 Ask Codex 交互。
5. 增加 `ExecutionRunner` 契约和不可用实现。
6. 完成响应式、语言切换、构建和浏览器验收。
7. 仅在确认独立页面完整后清理不再需要的宿主专用文件。

