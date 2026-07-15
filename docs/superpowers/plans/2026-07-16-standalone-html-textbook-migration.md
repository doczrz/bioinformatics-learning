# Standalone HTML Textbook Migration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the embedded ChatGPT/Codex textbook plugin with a hosted-ready standalone React/Vite textbook that preserves the approved UI, updates public course content safely, and reserves—but does not implement—the Biolearning Runner.

**Architecture:** Move reusable React components and visual styles into a new `web/` application. Replace the MCP host bridge with a browser content provider, localStorage reader state, an IndexedDB-backed verified content cache, and normal browser links. Keep GitHub content releases separate from UI releases; remove the complete old plugin directory only after the standalone build and browser tests pass.

**Tech Stack:** React 19, TypeScript 5.9, Vite 7, Zod 3, React Markdown, IndexedDB, Web Crypto, Vitest 3, Testing Library, jsdom, fake-indexeddb, Python 3.11+ release tooling.

## Global Constraints

- Preserve the approved textbook visual language and whole-page Chinese/English switching.
- The production page must fill the browser viewport and must not depend on ChatGPT Apps, MCP, `window.openai`, `sendMessage`, or `callServerTool`.
- Remove the current `plugin/codex-bilingual-textbook/` directory only after the standalone page passes build and acceptance checks.
- Do not run, probe, or connect to R, Python, Shell, SSH, Cell Ranger, schedulers, localhost services, or remote servers.
- Define Biolearning Runner contracts only; the default implementation must return `unavailable` and must perform no I/O.
- Public content updates require an explicit learner confirmation, immutable HTTPS GitHub assets, byte-size checks, SHA-256 checks, schema validation, and atomic IndexedDB activation.
- When no public manifest URL is configured, bundled development content remains readable and the UI says updates are not configured.
- Do not invent a GitHub repository URL, deployment account, custom domain, or production credential.
- Production builds must not emit source maps.
- Keep root Python content validation and release tooling, but rename plugin compatibility terminology to UI compatibility terminology.
- Do not reorganize or rewrite course subject matter.
- Put all tests, fixtures, logs, screenshots, and temporary build verification artifacts under `D:\codextest\codex-bilingual-textbook-html`.

---

## File Map

### Standalone application

- `web/package.json` — standalone dependencies and build/test scripts.
- `web/pnpm-workspace.yaml` — isolated pnpm workspace boundary.
- `web/vite.config.ts` — hashed static assets, no source maps.
- `web/tsconfig.json` — strict browser TypeScript configuration.
- `web/index.html` — hosted HTML entry.
- `web/src/contracts.ts` — course, update, cache, and site configuration contracts.
- `web/src/schemas.ts` — Zod validation for course files, release manifests, and site configuration.
- `web/src/content/markdown.ts` — deterministic Markdown heading IDs.
- `web/src/content/content-provider.ts` — host-independent reading interface.
- `web/src/content/static-content-provider.ts` — bundled fallback content.
- `web/src/content/cached-content-provider.ts` — active verified content with static fallback.
- `web/src/updates/content-cache.ts` — cached-release interface.
- `web/src/updates/indexeddb-content-cache.ts` — atomic browser persistence.
- `web/src/updates/update-service.ts` — GitHub manifest check, download, validation, and activation.
- `web/src/state/browser-state-store.ts` — robust localStorage persistence.
- `web/src/runtime/execution-runner.ts` — future Runner request/result contract.
- `web/src/runtime/null-execution-runner.ts` — no-I/O unavailable implementation.
- `web/src/components/*.tsx` — migrated visual components without host messaging.
- `web/src/styles/*.css` — approved visual tokens and responsive layout.
- `web/src/App.tsx` — standalone reader orchestration.
- `web/src/main.tsx` — browser service construction and rendering.
- `web/public/content/site-config.json` — UI version plus nullable public content manifest URL.
- `web/public/content/dev/*` — bundled content-neutral fallback fixture.
- `web/README.md` — local preview, build, hosting, update, and Runner boundaries.

### Authoring/release files

- `src/codex_textbook/release.py` — emit `minimumUiVersion` in public release manifests.
- `src/codex_textbook/cli.py` — expose `--minimum-ui-version`.
- `content-release.example.yml` — use `minimum_ui_version`.
- `pyproject.toml` — describe standalone textbook authoring tools.
- `OPEN_COURSE.md` — point maintainers to the standalone web commands.

### External tests

- `D:\codextest\codex-bilingual-textbook-html\vitest.config.ts`
- `D:\codextest\codex-bilingual-textbook-html\scaffold.test.mjs`
- `D:\codextest\codex-bilingual-textbook-html\static-content-provider.test.ts`
- `D:\codextest\codex-bilingual-textbook-html\browser-state.test.ts`
- `D:\codextest\codex-bilingual-textbook-html\reader-ui.test.tsx`
- `D:\codextest\codex-bilingual-textbook-html\update-service.test.ts`
- `D:\codextest\codex-bilingual-textbook-html\update-ui.test.tsx`
- `D:\codextest\codex-bilingual-textbook-html\runner-contract.test.ts`
- `D:\codextest\codex-bilingual-textbook-html\static-safety.test.mjs`
- `D:\codextest\codex-bilingual-textbook-html\test_release_ui_compatibility.py`

---

### Task 1: Standalone Package and Static Content Provider

**Files:**
- Create: `web/package.json`
- Create: `web/pnpm-workspace.yaml`
- Create: `web/vite.config.ts`
- Create: `web/tsconfig.json`
- Create: `web/index.html`
- Create: `web/src/contracts.ts`
- Create: `web/src/schemas.ts`
- Create: `web/src/content/markdown.ts`
- Create: `web/src/content/content-provider.ts`
- Create: `web/src/content/static-content-provider.ts`
- Create: `web/public/content/site-config.json`
- Create: `web/public/content/dev/course.json`
- Create: `web/public/content/dev/lessons/welcome.zh.md`
- Create: `web/public/content/dev/lessons/welcome.en.md`
- Test: `D:\codextest\codex-bilingual-textbook-html\scaffold.test.mjs`
- Test: `D:\codextest\codex-bilingual-textbook-html\static-content-provider.test.ts`
- Test config: `D:\codextest\codex-bilingual-textbook-html\vitest.config.ts`

**Interfaces:**
- Produces: `ContentProvider.getCourse()`, `getLesson(lessonId, language)`, `getDatasets(language)`, and `resolveAssetUrl(path)`.
- Produces: `StaticContentProvider(baseUrl, fetcher?)`.
- Produces: `parseSections(markdown)`.

- [ ] **Step 1: Write failing standalone scaffold and provider tests**

Create external tests that assert:

```ts
const provider = new StaticContentProvider("https://textbook.test/content/dev/", fetcher);
expect((await provider.getCourse()).environments.map((item) => item.id)).toEqual([
  "local-r",
  "local-python",
  "ssh-hpc",
]);
expect((await provider.getLesson("welcome", "zh")).sections[0]).toEqual({
  id: "section-1",
  heading: "开始阅读",
});
expect(provider.resolveAssetUrl("figures/example.png")).toBe(
  "https://textbook.test/content/dev/figures/example.png",
);
```

The scaffold test must assert that `web/package.json`, `web/index.html`, and `web/public/content/site-config.json` exist, that `contentManifestUrl` is `null`, and that `vite.config.ts` contains `sourcemap: false` without `viteSingleFile`.

- [ ] **Step 2: Run the tests and verify the red state**

Run:

```powershell
New-Item -ItemType Directory -Force D:\codextest\codex-bilingual-textbook-html | Out-Null
pnpm --dir web exec vitest run --config D:/codextest/codex-bilingual-textbook-html/vitest.config.ts D:/codextest/codex-bilingual-textbook-html/static-content-provider.test.ts
node D:\codextest\codex-bilingual-textbook-html\scaffold.test.mjs
```

Expected: the commands fail because `web/` and `StaticContentProvider` do not exist.

- [ ] **Step 3: Create the minimal standalone package**

Use these production dependencies only:

```json
{
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-markdown": "^10.1.0",
  "rehype-sanitize": "^6.0.0",
  "remark-gfm": "^4.0.1",
  "zod": "^3.24.4"
}
```

Use Vite with `build.outDir = "dist"`, `emptyOutDir = true`, `sourcemap = false`, and no single-file plugin. Add scripts `build`, `typecheck`, and `test`, where `test` points to the external Vitest configuration.

- [ ] **Step 4: Define contracts and schemas**

Define the content boundary exactly as:

```ts
export interface ContentProvider {
  getCourse(): Promise<CourseIndex>;
  getLesson(lessonId: string, language: Language): Promise<LessonPayload>;
  getDatasets(language: Language): Promise<DatasetEntry[]>;
  resolveAssetUrl(path: string): string;
  refresh(): Promise<void>;
}
```

Define `SiteConfig` with `uiVersion: string` and `contentManifestUrl: string | null`. Preserve stable course and lesson IDs, add the three reserved environment IDs to `CourseIndex`, and validate all fetched JSON with Zod before returning it.

- [ ] **Step 5: Implement static content loading and section parsing**

`StaticContentProvider` must use an injected `fetch`-compatible function, reject unsafe lesson IDs with `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`, fetch `course.json` and `lessons/<id>.<language>.md`, report a missing translation without substituting the other language, and derive duplicate-safe heading IDs.

- [ ] **Step 6: Install, test, build, and commit**

Run:

```powershell
pnpm --dir web install
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/static-content-provider.test.ts
node D:\codextest\codex-bilingual-textbook-html\scaffold.test.mjs
pnpm --dir web build
```

Expected: provider and scaffold tests pass; Vite emits `web/dist/index.html` plus hashed assets; no `.map` file exists.

Commit:

```powershell
git add web
git commit -m "feat: scaffold standalone textbook web app"
```

---

### Task 2: Browser Reader and Preserved UI

**Files:**
- Create: `web/src/state/browser-state-store.ts`
- Create: `web/src/components/CodeBlock.tsx`
- Create: `web/src/components/CourseHeader.tsx`
- Create: `web/src/components/DatasetPanel.tsx`
- Create: `web/src/components/EnvironmentStatus.tsx`
- Create: `web/src/components/LessonReader.tsx`
- Create: `web/src/components/LessonSidebar.tsx`
- Create: `web/src/components/UpdateDialog.tsx`
- Create: `web/src/styles/tokens.css`
- Create: `web/src/styles/textbook.css`
- Create: `web/src/App.tsx`
- Create: `web/src/main.tsx`
- Test: `D:\codextest\codex-bilingual-textbook-html\browser-state.test.ts`
- Test: `D:\codextest\codex-bilingual-textbook-html\reader-ui.test.tsx`

**Interfaces:**
- Consumes: `ContentProvider` from Task 1.
- Produces: `BrowserStateStore.read()`, `write(state)`, and `clear()`.
- Produces: `<TextbookApp contentProvider updateService runner stateStore />`.

- [ ] **Step 1: Write failing browser state and reader tests**

Cover these exact behaviors:

```ts
expect(store.read()).toEqual(defaultReaderState);
store.write({ ...defaultReaderState, language: "en", lessonId: "welcome" });
expect(store.read().language).toBe("en");
storage.setItem(KEY, "not-json");
expect(store.read()).toEqual(defaultReaderState);
```

Render the reader with a fake provider and assert Chinese-to-English whole-page switching, lesson navigation, code-copy controls, normal `target="_blank"` external links, and disabled Local R/Local Python/SSH-HPC items. Assert that selecting text does not render an Ask Codex button or composer.

- [ ] **Step 2: Run tests and verify they fail**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/browser-state.test.ts D:/codextest/codex-bilingual-textbook-html/reader-ui.test.tsx
```

Expected: imports fail because the browser state and standalone React tree do not exist.

- [ ] **Step 3: Migrate the visual components and remove host actions**

Mechanically copy the approved component and CSS sources from `plugin/codex-bilingual-textbook/app/src/web` to `web/src`, then make only these behavioral changes:

- remove `AskComposer`, `SelectionAction`, selection extraction, and question formatting from the production tree;
- remove all `TextbookBridge` props;
- use normal anchors with `target="_blank"` and `rel="noopener noreferrer"`;
- resolve Markdown images through `contentProvider.resolveAssetUrl(src)`;
- rename update compatibility copy from “plugin version” to “UI version”;
- change the environment badge to `待接入 / Reserved`;
- delete Ask Codex-only CSS selectors while preserving all other approved layout tokens.

- [ ] **Step 4: Implement robust browser state and theme**

Store only validated `ReaderState` JSON under `biolearning.reader-state.v1`. Invalid JSON, unknown language values, invalid lesson IDs, and non-boolean sidebar values must fall back field-by-field to `defaultReaderState`. Set `data-theme="dark"` from `matchMedia("(prefers-color-scheme: dark)")` and listen for changes without writing theme preference.

- [ ] **Step 5: Replace the MCP App lifecycle**

`App.tsx` must receive dependencies as props, load the course directly from `ContentProvider`, restore local browser state, keep request sequence protection for rapid language/lesson changes, and retain the current lesson when a paired translation exists. `main.tsx` must load `content/site-config.json`, construct the static provider and state store, and render without checking host connection state.

- [ ] **Step 6: Test, typecheck, build, and commit**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/browser-state.test.ts D:/codextest/codex-bilingual-textbook-html/reader-ui.test.tsx
pnpm --dir web typecheck
pnpm --dir web build
```

Expected: all reader tests pass and the standalone build succeeds.

Commit:

```powershell
git add web
git commit -m "feat: migrate textbook reader to the browser"
```

---

### Task 3: Verified GitHub Content Updates

**Files:**
- Create: `web/src/updates/content-cache.ts`
- Create: `web/src/updates/indexeddb-content-cache.ts`
- Create: `web/src/content/cached-content-provider.ts`
- Create: `web/src/updates/update-service.ts`
- Modify: `web/src/contracts.ts`
- Modify: `web/src/schemas.ts`
- Modify: `web/src/App.tsx`
- Modify: `web/src/main.tsx`
- Modify: `web/src/components/UpdateDialog.tsx`
- Modify: `src/codex_textbook/release.py`
- Modify: `src/codex_textbook/cli.py`
- Modify: `content-release.example.yml`
- Test: `D:\codextest\codex-bilingual-textbook-html\update-service.test.ts`
- Test: `D:\codextest\codex-bilingual-textbook-html\update-ui.test.tsx`
- Test: `D:\codextest\codex-bilingual-textbook-html\test_release_ui_compatibility.py`

**Interfaces:**
- Produces: `ContentCache.readActive()` and `activate(release)`.
- Produces: `IndexedDbContentCache(databaseName?)`.
- Produces: `CachedContentProvider(fallback, cache)` and `refresh()`.
- Produces: `ContentUpdateService.check(currentVersion)` and `apply(expectedVersion, targetVersion)`.
- Produces release manifest field `minimumUiVersion` and CLI option `--minimum-ui-version`.

- [ ] **Step 1: Write failing cache, update, UI, and Python release tests**

Use `fake-indexeddb/auto` and an injected mock fetcher. Cover:

- unconfigured manifest URL;
- current version with no update;
- incompatible minimum UI version;
- exact checked-target requirement;
- manifest changing between check and apply;
- unsafe asset paths and non-GitHub URLs;
- byte-size mismatch;
- SHA-256 mismatch;
- invalid `course.json`;
- successful activation and reload;
- failed activation preserving the prior cached release;
- UpdateDialog copy saying UI rather than plugin;
- Python release manifest emitting `minimumUiVersion` and not `minimumPluginVersion`.

- [ ] **Step 2: Run tests and verify the red state**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/update-service.test.ts D:/codextest/codex-bilingual-textbook-html/update-ui.test.tsx
python -m pytest D:\codextest\codex-bilingual-textbook-html\test_release_ui_compatibility.py -q
```

Expected: imports or assertions fail because browser update services and UI compatibility fields do not exist.

- [ ] **Step 3: Define the cached release transaction**

Use one IndexedDB object store named `content` and one key named `active`. Store this fully verified object with a single `put`, so the previous value remains active until the transaction completes:

```ts
export interface CachedRelease {
  manifest: ContentReleaseManifest;
  assets: Record<string, ArrayBuffer>;
}

export interface ContentCache {
  readActive(): Promise<CachedRelease | null>;
  activate(release: CachedRelease): Promise<void>;
}
```

- [ ] **Step 4: Implement update checking and verified activation**

Allow only `https:` URLs on `github.com`, `raw.githubusercontent.com`, `objects.githubusercontent.com`, or `release-assets.githubusercontent.com`. Fetch the manifest with `{ cache: "no-store" }`; validate semantic versions; re-fetch the manifest on apply; compare `contentVersion` and `commitSha`; fetch every asset; reject duplicate/absolute/traversal paths; verify declared byte length and SHA-256 with `crypto.subtle.digest`; require `course.json`; validate course identity/version and every declared lesson pair; then call `cache.activate()` once.

- [ ] **Step 5: Serve active cached content with safe fallback**

`CachedContentProvider` must decode active `course.json` and lesson Markdown from the verified asset map, create Blob URLs for cached image assets, revoke old Blob URLs on refresh, and delegate to `StaticContentProvider` when no active release exists. A malformed cached record must be ignored for reading without deleting bundled content.

- [ ] **Step 6: Wire the update dialog and rename author tooling**

After successful apply, refresh the cached provider, reopen the course, and retain the current stable lesson ID when present. Rename:

```text
minimumPluginVersion  -> minimumUiVersion
minimum_plugin_version -> minimum_ui_version
--minimum-plugin-version -> --minimum-ui-version
```

Update validation messages and the example YAML consistently. Do not add a compatibility alias because no public plugin content release has been published.

- [ ] **Step 7: Run focused and regression tests, then commit**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/update-service.test.ts D:/codextest/codex-bilingual-textbook-html/update-ui.test.tsx
python -m pytest D:\codextest\codex-bilingual-textbook-html\test_release_ui_compatibility.py D:\codextest\codex-textbook-plugin\task-07\test_release.py D:\codextest\codex-textbook-plugin\final-python\test_release_markdown_assets.py -q
pnpm --dir web typecheck
pnpm --dir web build
```

Expected: all update tests pass. Adjust the two legacy external Python tests only where their expected compatibility field and argument names intentionally changed; keep all other security assertions unchanged.

Commit:

```powershell
git add web src/codex_textbook/release.py src/codex_textbook/cli.py content-release.example.yml
git commit -m "feat: add verified browser content updates"
```

---

### Task 4: Reserved Biolearning Runner Contract

**Files:**
- Create: `web/src/runtime/execution-runner.ts`
- Create: `web/src/runtime/null-execution-runner.ts`
- Modify: `web/src/components/EnvironmentStatus.tsx`
- Modify: `web/src/App.tsx`
- Test: `D:\codextest\codex-bilingual-textbook-html\runner-contract.test.ts`

**Interfaces:**
- Produces: `ExecutionRunner.getStatus()`, `run(request)`, and `cancel(runId)`.
- Produces: `NullExecutionRunner`, which performs no network, process, or storage I/O.

- [ ] **Step 1: Write the failing Runner contract test**

Assert that `getStatus()` returns unavailable states for all three environments and that `run()` and `cancel()` reject with `Biolearning Runner is not connected.`. Spy on `globalThis.fetch` and assert it is never called.

- [ ] **Step 2: Run the test and verify failure**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/runner-contract.test.ts
```

Expected: imports fail because the runtime contract does not exist.

- [ ] **Step 3: Implement only the reserved contract**

Use these environment IDs and statuses:

```ts
export type EnvironmentKind = "local-r" | "local-python" | "remote";
export type EnvironmentAvailability = "unavailable" | "available";
```

`RunRequest` reserves language, code, working directory, and optional remote profile ID. `RunResult` reserves run ID, status, stdout, stderr, exit code, elapsed milliseconds, table artifacts, image/file artifacts, and optional remote job ID. Do not implement transport URLs, pairing, credentials, environment detection, or buttons that imply execution works.

- [ ] **Step 4: Integrate disabled environment presentation**

Pass status from the Runner contract into `EnvironmentStatus`. Display Local R, Local Python, and SSH/HPC as `待接入 / Reserved`; all controls remain disabled and have explicit accessible labels.

- [ ] **Step 5: Test and commit**

Run:

```powershell
pnpm --dir web test -- D:/codextest/codex-bilingual-textbook-html/runner-contract.test.ts D:/codextest/codex-bilingual-textbook-html/reader-ui.test.tsx
pnpm --dir web typecheck
```

Expected: Runner and reader tests pass with zero fetch calls from Runner code.

Commit:

```powershell
git add web/src/runtime web/src/components/EnvironmentStatus.tsx web/src/App.tsx
git commit -m "feat: reserve standalone Runner interface"
```

---

### Task 5: Documentation, Plugin Removal, and Full Acceptance

**Files:**
- Create: `web/README.md`
- Modify: `OPEN_COURSE.md`
- Modify: `pyproject.toml`
- Delete: `plugin/codex-bilingual-textbook/**`
- Test: `D:\codextest\codex-bilingual-textbook-html\static-safety.test.mjs`
- Test output: `D:\codextest\codex-bilingual-textbook-html\acceptance.log`
- Screenshots: `D:\codextest\codex-bilingual-textbook-html\screenshots\*.png`

**Interfaces:**
- Consumes: all standalone web interfaces from Tasks 1–4.
- Produces: one hosted-ready `web/dist/` artifact and no remaining textbook plugin code.

- [ ] **Step 1: Write the failing static safety test**

The external Node test must assert:

```js
assert.equal(existsSync("plugin/codex-bilingual-textbook"), false);
assert.equal(source.includes("window.openai"), false);
assert.equal(source.includes("sendMessage"), false);
assert.equal(source.includes("callServerTool"), false);
assert.equal(packageJson.dependencies?.["@modelcontextprotocol/sdk"], undefined);
assert.equal(packageJson.dependencies?.["@modelcontextprotocol/ext-apps"], undefined);
assert.equal([...walk("web/dist")].some((path) => path.endsWith(".map")), false);
```

Also assert `OPEN_COURSE.md` points to `pnpm --dir web` and contains no MCP endpoint.

- [ ] **Step 2: Run the safety test and verify failure**

Run:

```powershell
node D:\codextest\codex-bilingual-textbook-html\static-safety.test.mjs
```

Expected: failure because the old plugin directory and old opening instructions still exist.

- [ ] **Step 3: Write standalone operation documentation**

Document exactly:

- `pnpm --dir web install`, `pnpm --dir web dev`, and `pnpm --dir web build`;
- static hosting of `web/dist` over HTTPS;
- UI refresh behavior;
- nullable `contentManifestUrl` and immutable public GitHub release requirements;
- no GitHub token in the browser;
- Runner not required and not implemented;
- Chrome AI sidebar being independent of the textbook;
- source repository may be private while compiled browser assets remain visible.

Update `OPEN_COURSE.md` to use the standalone commands and update `pyproject.toml` to remove Codex-native/plugin wording from the authoring package description.

- [ ] **Step 4: Verify the deletion target and remove the old plugin**

Before deletion, run:

```powershell
$target = (Resolve-Path 'plugin\codex-bilingual-textbook').Path
$root = (Resolve-Path '.').Path
if (-not $target.StartsWith($root + [IO.Path]::DirectorySeparatorChar)) { throw 'Unsafe plugin deletion target' }
git status --short -- plugin/codex-bilingual-textbook
```

Expected: the target is exactly `D:\bioinformatics\.worktrees\textbook-ui\plugin\codex-bilingual-textbook`. The previously modified MCP route is inside this explicitly cancelled directory and is deleted with it. Remove every tracked file under that directory; do not delete root Python authoring tools or `web/`.

- [ ] **Step 5: Run full automated verification**

Run:

```powershell
pnpm --dir web test
pnpm --dir web typecheck
pnpm --dir web build
python -m pytest D:\codextest\codex-bilingual-textbook-html\test_release_ui_compatibility.py D:\codextest\codex-textbook-plugin\final-python -q
node D:\codextest\codex-bilingual-textbook-html\static-safety.test.mjs
git diff --check
```

Capture the combined output in `D:\codextest\codex-bilingual-textbook-html\acceptance.log`. Expected: all tests pass, production build succeeds, no source maps exist, no host APIs remain, and the plugin directory is absent.

- [ ] **Step 6: Perform browser visual acceptance**

Serve `web/dist` from a local HTTP server whose temporary files and logs live under `D:\codextest\codex-bilingual-textbook-html`. Verify in Chrome at 1920×1080, 1440×900, 1024×768, and 390×844:

- the application fills the viewport;
- the reading measure stays legible on wide screens;
- Chinese/English switching stays on the same lesson;
- sidebar, section rail, code copy, dataset link, and update dialog work;
- no Ask Codex overlay appears on text selection;
- environments remain disabled;
- no horizontal overflow occurs.

Save screenshots only under `D:\codextest\codex-bilingual-textbook-html\screenshots`.

- [ ] **Step 7: Commit the completed migration**

Run:

```powershell
git add web OPEN_COURSE.md pyproject.toml plugin/codex-bilingual-textbook
git commit -m "feat: replace textbook plugin with standalone HTML"
git status --short
```

Expected: commit succeeds. The only remaining status entries, if any, must be unrelated user-owned changes; the cancelled plugin route modification must not remain because its directory has been deleted.

---

## Plan Self-Review

- Spec coverage: standalone full-viewport UI, bilingual switching, browser state, normal links, public GitHub updates, SHA-256, atomic cache activation, offline fallback, Runner reservation, source-map exclusion, and plugin deletion each map to a task.
- Placeholder scan: the only null value is the intentional unconfigured `contentManifestUrl`; no fabricated repository or credential is required.
- Type consistency: `minimumUiVersion`, `ContentProvider`, `CachedRelease`, `ContentCache`, `ContentUpdateService`, and `ExecutionRunner` use the same names throughout.
- Scope check: hosting publication and the real Biolearning Runner remain separate future projects; this plan produces a locally verified deployable static artifact without making external account changes.

