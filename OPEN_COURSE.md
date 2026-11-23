# 打开双语交互教材 / Open the bilingual textbook

[在线阅读教材 / Read the textbook online](https://doczrz.github.io/bioinformatics-learning/)

用浏览器打开上面的链接，选择左侧章节即可开始。新版本发布后，刷新网页即可。Open the link in your browser and choose a lesson from the sidebar. Refresh the page after a release to get the new edition.

## 可选：本地预览 / Optional local preview

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

在本地版，使用“检查更新”下载已发布的新教材。代码示例可以复制到你自己的分析环境中运行。

In the local reader, use “Check for updates” to download newly released lessons. Copy examples to your own analysis environment to run them.

See `web/README.md` for hosting, public GitHub content-release, cache, and webpage execution boundaries.
