# Biolearning bilingual textbook web app

This directory is the standalone, hosted-ready textbook reader. It does not require a ChatGPT or Codex host to render.

## Local preview

From the repository root:

```powershell
pnpm --dir web install
pnpm --dir web dev
```

Open the local URL printed by Vite. Build the deployable static files with:

```powershell
pnpm --dir web build
pnpm --dir web preview
```

The production artifact is `web/dist/`. Publish that directory through HTTPS. Configure `index.html` for revalidation or a short cache lifetime; the hashed JavaScript and CSS assets may use long immutable caching. This project intentionally has no service worker, so refreshing the page loads a newly deployed UI.

## Course content updates

`public/content/site-config.json` contains the UI version and `contentManifestUrl`. The current URL points to the stable release manifest in this public repository. Bundled content remains readable when GitHub is unavailable.

A configured manifest must be publicly readable over HTTPS from GitHub. Its content assets must use immutable release-tag or commit URLs, include byte sizes and SHA-256 hashes, and provide paired Chinese and English lesson files. The browser never contains a GitHub token. A learner explicitly confirms an update before any content assets are downloaded; the previous verified IndexedDB release remains active if verification fails.

The current project uses this public repository as its content source. Publishing a content update is a two-commit process so that every downloaded asset can be pinned to an immutable Git commit:

1. Update `public/content/dev/course.json` and the paired lesson and figure files, increment `contentVersion`, verify the application, and commit those changes.
2. Copy the full 40-character content commit SHA printed by `git rev-parse HEAD`.
3. Generate the stable manifest from the committed Git blobs, not from Windows working-tree bytes:

   ```powershell
   node web/scripts/generate-content-manifest.mjs <content-commit-sha> "中文更新摘要" "English release summary"
   ```

4. Inspect `public/content/release-manifest.json`, commit it, and push both commits. The stable manifest follows `master`, while every asset URL inside it remains pinned to the earlier content commit SHA.

Every published course version must be greater than the previous version. Do not run the legacy root `course-manifest.yml` release flow for current Web content; it is not yet synchronized with `public/content/dev`.

The webpage source repository may remain private, but every compiled HTML, CSS, and JavaScript asset sent to a browser is visible to that browser. Production source maps are disabled.

## Execution boundary

The reader exposes no Local R, Local Python, or SSH/HPC execution controls. It does not run code, start processes, inspect environments, connect to remote servers, or handle credentials. Reading and updating the textbook require no separate execution service.

A Chrome AI sidebar, if the learner has installed one, is independent of this page. Selecting text and asking through that sidebar does not give the webpage or the sidebar direct access to R, Python, SSH, or server credentials.
