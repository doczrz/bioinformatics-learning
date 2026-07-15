# 打开双语交互教材 / Open the bilingual textbook

教材现在是独立的全屏浏览器页面。首次本地预览：

```powershell
pnpm --dir web install
pnpm --dir web dev
```

根据终端显示的本地地址在 Chrome 中打开。生成可部署的静态网站：

```powershell
pnpm --dir web build
pnpm --dir web preview
```

The textbook is now a standalone full-viewport browser page. Open the local URL printed by Vite, or publish `web/dist` through HTTPS.

页面支持整页中英文切换、章节导航、复制代码和外部数据链接。用户安装的 Chrome AI 侧栏可独立用于框选后提问；教材本身不会自动发送所选文本。

The page supports whole-page language switching, lesson navigation, code copying, and authoritative external dataset links. An installed Chrome AI sidebar can be used independently for questions; the textbook does not send selected text itself.

在线内容仓库尚未配置时，页面继续使用内置占位内容，并明确显示“尚未配置在线内容仓库”。本地 R、本地 Python 与 SSH/HPC 目前均为“待接入”的禁用入口，不执行代码或连接服务器。

See `web/README.md` for hosting, public GitHub content-release, cache, and future Biolearning Runner boundaries.
