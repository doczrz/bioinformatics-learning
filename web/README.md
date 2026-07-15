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

`public/content/site-config.json` contains the UI version and `contentManifestUrl`. The URL remains `null` until a real public course-content repository is available; bundled development content stays readable and the update dialog reports that online updates are not configured.

A configured manifest must be publicly readable over HTTPS from GitHub. Its content assets must use immutable release-tag or commit URLs, include byte sizes and SHA-256 hashes, and provide paired Chinese and English lesson files. The browser never contains a GitHub token. A learner explicitly confirms an update before any content assets are downloaded; the previous verified IndexedDB release remains active if verification fails.

The webpage source repository may remain private, but every compiled HTML, CSS, and JavaScript asset sent to a browser is visible to that browser. Production source maps are disabled.

## Execution boundary

Biolearning Runner is reserved as a TypeScript interface only. Local R, Local Python, and SSH/HPC remain disabled and the default runner performs no network, process, storage, environment-detection, or credential operation. Installing a Runner is not required to read or update the textbook.

A Chrome AI sidebar, if the learner has installed one, is independent of this page. Selecting text and asking through that sidebar does not give the webpage or the sidebar direct access to R, Python, SSH, or server credentials.
