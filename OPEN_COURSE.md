# 打开双语交互教材 / Open the bilingual textbook

当前版本是 Codex 内嵌教材的本地原型。构建并启动 MCP 服务后，让 Codex 使用插件中的 `bilingual-textbook` Skill，并调用 `open_course` 打开阅读器。

This is the local prototype of the embedded Codex textbook. After building and starting the MCP server, ask Codex to use the bundled `bilingual-textbook` Skill and call `open_course`.

```powershell
cd plugin/codex-bilingual-textbook/app
pnpm install
pnpm run build
pnpm start
```

本地 MCP 地址 / Local MCP endpoint: `http://localhost:8000/mcp`

当前可以切换整页中英文、复制代码、下载外部数据，并在框选正文或代码后点击“问 Codex”。本地 R 与 SSH/HPC 仅保留禁用接口，第一版不会运行代码。

The reader supports whole-page language switching, code copy, authoritative external dataset links, and an explicit “Ask Codex” flow after selecting lesson text or code. Local R and SSH/HPC remain disabled placeholders and execute nothing in version 1.

公开教材仓库尚未配置时，阅读器继续使用内置占位内容，并明确显示“尚未配置在线内容仓库”。创建公开内容仓库属于后续单独步骤，不会自动发生。
