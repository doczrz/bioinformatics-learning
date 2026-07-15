# Codex Interactive Textbook Plugin Implementation Plan

> **For Codex:** Execute this plan task by task with test-driven development. Use the bundled Node/pnpm/Python runtimes listed below. Put every test file, fixture, screenshot, log, and other temporary test artifact under `D:\codextest\codex-textbook-plugin`; do not add test artifacts to the repository.

**Goal:** Deliver a content-neutral bilingual textbook UI that renders inside the Codex/ChatGPT desktop host, lets a learner select lesson text or code and explicitly send a question to the current Codex conversation, and can later consume validated public GitHub content releases without rebuilding the UI.

**Architecture:** A private Codex plugin bundle contains a React 19 widget and a TypeScript MCP Apps server. The server exposes one UI resource and five narrowly scoped course tools over stateless Streamable HTTP. The widget uses the MCP Apps bridge for tool calls, host context, external links, widget state, and `app.sendMessage()`. Existing Markdown/YAML/Python authoring remains outside the UI bundle and later publishes immutable public content releases.

**Tech Stack:** React 19.1, TypeScript 5.9, Vite 7.1, `@modelcontextprotocol/ext-apps` 1.0, MCP TypeScript SDK 1.12, Express 5, Zod 3.24, React Markdown 10, Vitest 3, Testing Library 16, existing Python 3.11/PyYAML pipeline.

**Approved product boundaries:** No R, Python execution, SSH, schedulers, credentials, dataset proxying, or automatic dataset downloads in version 1. Local R and SSH/HPC appear only as disabled future environment choices. The public content repository and private plugin repository have independent release cycles. No `.app.json` is created until Developer Mode supplies a real app ID.

---

## Design direction to implement exactly

**Subject and audience:** A self-paced single-cell bioinformatics textbook for learners who alternate between reading concepts and inspecting commands. The page's single job is to keep a lesson readable while making “select evidence, ask Codex” immediate and unambiguous.

**Palette:** Porcelain `#F7F9FC`, ink `#172033`, cobalt `#2855C5`, sequencing cyan `#2A9DB0`, graphite `#667085`, warning amber `#B76E00`. Dark mode derives from host context with ink/porcelain reversed and the same cobalt/cyan identity.

**Type:** Chapter titles use a restrained bilingual editorial serif stack (`Iowan Old Style`, `Noto Serif SC`, `Source Han Serif SC`, `STSong`, serif). Body/UI use a neutral system sans stack (`Inter`, `PingFang SC`, `Microsoft YaHei`, sans-serif). Commands and dataset identifiers use (`IBM Plex Mono`, `Cascadia Code`, `SFMono-Regular`, monospace). No remote font request is required.

**Layout:** A quiet textbook canvas, not a dashboard. On wide screens, the chapter rail occupies 264 px, the reading column is capped at 760 px, and a 56 px “sequence rail” marks reading position. On narrow screens, the chapter rail becomes a drawer and the reading measure fills the available width.

```text
┌──────────────────────────────────────────────────────────────┐
│ Course / version       中文 | English     Check for updates │
├───────────────┬─────────┬────────────────────────────────────┤
│ chapters      │ read    │ lesson title                       │
│ stable IDs    │ rail    │ readable bilingual lesson          │
│               │ ┃       │                                    │
│ environments  │ ┣━━     │ selected passage [Ask Codex]       │
│ R       Later │ ┃       │                                    │
│ SSH/HPC Later │ ┃       │ code, figures, datasets, sources   │
└───────────────┴─────────┴────────────────────────────────────┘
```

**Signature:** The sequence rail is the one expressive element. Section ticks resemble aligned sequencing reads, and the active section extends into a cyan/cobalt marker. It encodes actual lesson position rather than serving as decoration. Motion is limited to the rail transition and selection action; both obey `prefers-reduced-motion`.

**Self-critique:** Avoid the generic cream/serif editorial template by using a cool laboratory porcelain surface, a functional sequencing rail, and host-aware compact controls. Avoid the generic SaaS dashboard by removing cards, metrics, gradients, and decorative status widgets. The disabled execution interfaces live in one subdued “Environments” block rather than competing with the lesson.

---

## Runtime paths and working directories

- Worktree: `D:\bioinformatics\.worktrees\textbook-ui`
- Plugin root: `D:\bioinformatics\.worktrees\textbook-ui\plugin\codex-bilingual-textbook`
- App root: `D:\bioinformatics\.worktrees\textbook-ui\plugin\codex-bilingual-textbook\app`
- External tests: `D:\codextest\codex-textbook-plugin`
- Node: `C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe`
- pnpm: `C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd`
- Python: `C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe`
- Plugin creator: `C:\Users\aaa\.codex\skills\.system\plugin-creator\scripts\create_basic_plugin.py`
- Plugin validator: `C:\Users\aaa\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py`

The plugin-creator scaffold must first be generated under `D:\codextest\codex-textbook-plugin\scaffold` for inspection. Repository files are then created with `apply_patch`, preserving the workspace editing rule while following the canonical scaffold shape.

---

### Task 1: Scaffold the private plugin and minimal TypeScript app

**Files:**

- Create: `plugin/codex-bilingual-textbook/.codex-plugin/plugin.json`
- Create: `plugin/codex-bilingual-textbook/skills/bilingual-textbook/SKILL.md`
- Create: `plugin/codex-bilingual-textbook/app/package.json`
- Create: `plugin/codex-bilingual-textbook/app/tsconfig.json`
- Create: `plugin/codex-bilingual-textbook/app/vite.config.ts`
- Create: `plugin/codex-bilingual-textbook/app/index.html`
- Create: `plugin/codex-bilingual-textbook/app/src/web/main.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/App.tsx`
- Test: `D:\codextest\codex-textbook-plugin\task-01\scaffold.test.mjs`

**Step 1: Generate and inspect the canonical scaffold outside the repository**

Run:

```powershell
New-Item -ItemType Directory -Force -Path 'D:\codextest\codex-textbook-plugin\scaffold' | Out-Null
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\aaa\.codex\skills\.system\plugin-creator\scripts\create_basic_plugin.py' codex-bilingual-textbook --path 'D:\codextest\codex-textbook-plugin\scaffold' --with-skills
```

Expected: scaffold contains `codex-bilingual-textbook/.codex-plugin/plugin.json` and `skills/`, without a marketplace entry, `.app.json`, or fake app ID.

**Step 2: Write the failing scaffold contract test**

The test imports `node:fs`, resolves the repository plugin root, and asserts:

```js
assert.equal(manifest.name, "codex-bilingual-textbook");
assert.equal(manifest.version, "0.1.0");
assert.equal(manifest.description.length > 0, true);
assert.equal(fs.existsSync(path.join(pluginRoot, ".app.json")), false);
assert.equal(pkg.scripts.build, "vite build && tsc --noEmit");
assert.equal(pkg.scripts.start, "tsx src/server/index.ts");
```

Run:

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test 'D:\codextest\codex-textbook-plugin\task-01\scaffold.test.mjs'
```

Expected: FAIL because the repository plugin does not exist.

**Step 3: Create the minimal production scaffold**

Use the canonical scaffold field names and add only the plugin metadata supported by the validator. `package.json` must use `type: module`, `private: true`, Node `>=20`, and these direct dependencies:

```json
{
  "@modelcontextprotocol/ext-apps": "^1.0.1",
  "@modelcontextprotocol/sdk": "^1.12.1",
  "@openai/apps-sdk-ui": "^0.2.1",
  "cors": "^2.8.5",
  "express": "^5.1.0",
  "react": "^19.1.1",
  "react-dom": "^19.1.1",
  "react-markdown": "^10.1.0",
  "rehype-sanitize": "^6.0.0",
  "remark-gfm": "^4.0.1",
  "zod": "^3.24.4"
}
```

Dev dependencies: TypeScript `^5.9.2`, Vite `^7.1.1`, React plugin `^4.5.2`, tsx `^4.19.2`, Vitest `^3.2.4`, jsdom `^26.1.0`, Testing Library React `^16.3.0`, Testing Library user-event `^14.6.1`, and relevant `@types/*` packages.

The initial `App.tsx` returns a semantic `<main aria-label="Bilingual interactive textbook" />`. Do not style or populate content yet.

**Step 4: Install, retest, typecheck, and validate**

Run from `plugin/codex-bilingual-textbook/app`:

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' install
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe' --test 'D:\codextest\codex-textbook-plugin\task-01\scaffold.test.mjs'
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' exec tsc --noEmit
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\aaa\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py' 'D:\bioinformatics\.worktrees\textbook-ui\plugin\codex-bilingual-textbook'
```

Expected: test passes, TypeScript exits 0, plugin validation reports success.

**Step 5: Commit**

```powershell
git add plugin/codex-bilingual-textbook
git commit -m "feat: scaffold interactive textbook plugin"
```

Do not stage `datasets/CATALOG.md`.

---

### Task 2: Define stable content contracts and fixture-backed server store

**Files:**

- Create: `plugin/codex-bilingual-textbook/app/src/shared/contracts.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/shared/schemas.ts`
- Create: `plugin/codex-bilingual-textbook/app/content/dev/course.json`
- Create: `plugin/codex-bilingual-textbook/app/content/dev/lessons/welcome.zh.md`
- Create: `plugin/codex-bilingual-textbook/app/content/dev/lessons/welcome.en.md`
- Create: `plugin/codex-bilingual-textbook/app/src/server/content-store.ts`
- Test: `D:\codextest\codex-textbook-plugin\task-02\content-store.test.ts`

**Step 1: Write failing tests for bilingual stable IDs**

Tests must assert that `FileContentStore`:

- returns course `codex-bilingual-textbook` version `0.1.0`;
- returns `welcome` independently for `zh` and `en` under the same lesson ID;
- returns `translationAvailable: false` rather than falling back when a paired file is absent;
- rejects `../` traversal and unknown lesson IDs;
- includes a monotonic integer `revision` in every payload.

Run:

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' exec vitest run --config 'D:\codextest\codex-textbook-plugin\vitest.config.ts' 'D:\codextest\codex-textbook-plugin\task-02\content-store.test.ts'
```

Expected: FAIL because contracts and store are missing.

**Step 2: Implement the contracts**

Define and export these exact public shapes:

```ts
export type Language = "zh" | "en";

export interface CourseIndex {
  schemaVersion: 1;
  courseId: string;
  contentVersion: string;
  revision: number;
  defaultLanguage: Language;
  title: Record<Language, string>;
  lessons: LessonSummary[];
  environments: Array<{ id: "local-r" | "ssh-hpc"; status: "reserved" }>;
}

export interface LessonPayload {
  courseId: string;
  contentVersion: string;
  revision: number;
  lessonId: string;
  language: Language;
  translationAvailable: boolean;
  title: string;
  markdown: string;
  sections: Array<{ id: string; heading: string }>;
}

export interface DatasetEntry {
  id: string;
  title: Record<Language, string>;
  sourceUrl: string;
  sizeBytes?: number;
  license?: string;
  sha256?: string;
}
```

Use Zod at every disk/network boundary and inferred TypeScript types internally. Fixture lesson prose remains intentionally generic and short; it exists only to exercise headings, a figure placeholder, a code block, and a dataset link.

**Step 3: Implement `FileContentStore`**

Public API:

```ts
export class FileContentStore {
  constructor(private readonly root: string) {}
  getCourse(): Promise<CourseIndex>;
  getLesson(lessonId: string, language: Language): Promise<LessonPayload>;
  getDatasets(language: Language): Promise<DatasetEntry[]>;
}
```

Reject lesson IDs unless they match `/^[a-z0-9]+(?:-[a-z0-9]+)*$/`. Parse headings without executing Markdown HTML. Never silently substitute the other language.

**Step 4: Run tests and typecheck**

Expected: all Task 2 tests pass and `pnpm exec tsc --noEmit` exits 0.

**Step 5: Commit**

```powershell
git add plugin/codex-bilingual-textbook/app
git commit -m "feat: add bilingual content contracts"
```

---

### Task 3: Register the MCP Apps resource and read-only course tools

**Files:**

- Create: `plugin/codex-bilingual-textbook/app/src/server/create-course-server.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/server/read-widget-html.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/server/index.ts`
- Test: `D:\codextest\codex-textbook-plugin\task-03\mcp-contract.test.ts`

**Step 1: Write failing MCP contract tests**

Start the server on an ephemeral port and use an MCP client over Streamable HTTP. Assert:

- resource URI is exactly `ui://codex-bilingual-textbook/reader.html`;
- resource MIME is `RESOURCE_MIME_TYPE` from `@modelcontextprotocol/ext-apps/server`;
- `open_course`, `get_lesson`, and `get_dataset_catalog` are registered;
- each tool uses `_meta.ui.resourceUri` for the same reader resource;
- annotations are read-only/non-destructive; dataset links set `openWorldHint: true`;
- `open_course` returns concise `content` plus validated `structuredContent`;
- unsupported paths return 404 and `/health` returns `{ "status": "ok" }`.

Expected: FAIL because the server does not exist.

**Step 2: Implement one reusable app resource**

Follow the official `mcp_app_basics_node` structure:

```ts
registerAppResource(server, "Interactive textbook reader", READER_URI, {
  mimeType: RESOURCE_MIME_TYPE,
  description: "Bilingual interactive textbook reader",
}, async () => ({
  contents: [{
    uri: READER_URI,
    mimeType: RESOURCE_MIME_TYPE,
    text: readWidgetHtml(),
    _meta: {
      ui: {
        csp: {
          connectDomains: [],
          resourceDomains: [],
        },
      },
    },
  }],
}));
```

Start with empty CSP domain lists because fixtures are local. GitHub and image domains are added only in Task 7.

**Step 3: Implement the three read-only tools**

Schemas:

```ts
open_course: z.object({ language: z.enum(["zh", "en"]).default("zh") })
get_lesson: z.object({ lessonId: z.string(), language: z.enum(["zh", "en"]), knownRevision: z.number().int().optional() })
get_dataset_catalog: z.object({ language: z.enum(["zh", "en"]) })
```

The server factory receives a `ContentStore` interface so tests never need production files or network access. Use stateless `StreamableHTTPServerTransport({ sessionIdGenerator: undefined })` and create/close one `McpServer` per `/mcp` request, as in the current official example.

**Step 4: Pass the contract suite and typecheck**

Expected: MCP calls validate, `/health` and 404 behavior pass, and no deprecated SSE transport is used.

**Step 5: Commit**

```powershell
git add plugin/codex-bilingual-textbook/app
git commit -m "feat: expose textbook MCP app tools"
```

---

### Task 4: Build the bilingual textbook shell and reader visual system

**Files:**

- Create: `plugin/codex-bilingual-textbook/app/src/web/bridge/app-bridge.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/web/state/reader-state.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/CourseHeader.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/LessonSidebar.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/LessonReader.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/CodeBlock.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/DatasetPanel.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/EnvironmentStatus.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/styles/tokens.css`
- Create: `plugin/codex-bilingual-textbook/app/src/web/styles/textbook.css`
- Modify: `plugin/codex-bilingual-textbook/app/src/web/App.tsx`
- Test: `D:\codextest\codex-textbook-plugin\task-04\reader-ui.test.tsx`

**Step 1: Write failing component tests**

Use a fake bridge and assert:

- the entire interface changes from Chinese to English without navigation/reload;
- the same stable lesson ID is requested with the new language;
- the preference is written to widget state;
- missing translation shows a clear empty state and does not render Chinese under English;
- code copy uses the Clipboard API and has a keyboard-visible button;
- Local R and SSH/HPC are present, disabled, and labelled “Later / 后续开放”;
- desktop and drawer navigation preserve current lesson;
- Markdown raw HTML such as `<script>` is absent from rendered output.

Expected: FAIL because components are missing.

**Step 2: Implement a testable bridge boundary**

```ts
export interface TextbookBridge {
  callTool<T>(name: string, args: Record<string, unknown>): Promise<T>;
  sendMessage(text: string): Promise<void>;
  openLink(url: string): Promise<void>;
  readWidgetState(): ReaderState | null;
  writeWidgetState(state: ReaderState): Promise<void>;
  getHostTheme(): "light" | "dark";
}
```

The production adapter uses `useApp()` from `@modelcontextprotocol/ext-apps/react`; components receive the interface through context. No component reads `window.openai` directly.

**Step 3: Implement state and rendering**

`ReaderState` contains only `language`, `lessonId`, `sidebarOpen`, `activeSectionId`, and `progressByLesson`. Selection and question draft remain local to the current widget instance. Render Markdown with `remark-gfm` and `rehype-sanitize`; map code blocks and links to controlled components. External links call `bridge.openLink()`.

Implement the exact design tokens and sequence rail described above. Include `:focus-visible`, 44 px minimum pointer targets on touch layouts, host light/dark support, and reduced-motion rules.

**Step 4: Run component tests, typecheck, and build**

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' exec vitest run --config 'D:\codextest\codex-textbook-plugin\vitest.config.ts' 'D:\codextest\codex-textbook-plugin\task-04\reader-ui.test.tsx'
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' run build
```

Expected: tests pass, `dist/reader.html` is generated as a self-contained widget entry, and the build contains no remote font dependency.

**Step 5: Commit**

```powershell
git add plugin/codex-bilingual-textbook/app
git commit -m "feat: build bilingual textbook reader"
```

---

### Task 5: Add selection-aware “Ask Codex” interaction

**Files:**

- Create: `plugin/codex-bilingual-textbook/app/src/web/selection/extract-selection.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/web/selection/format-question.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/SelectionAction.tsx`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/AskComposer.tsx`
- Modify: `plugin/codex-bilingual-textbook/app/src/web/components/LessonReader.tsx`
- Test: `D:\codextest\codex-textbook-plugin\task-05\selection.test.ts`
- Test: `D:\codextest\codex-textbook-plugin\task-05\ask-codex.test.tsx`

**Step 1: Write failing selection and message tests**

Cover prose and `<code>` selections, selection outside the lesson root, collapsed selections, multiline normalization, section-heading lookup, 4,000 Unicode-character boundary, over-limit warning, cancel, successful send, failed send, and retry.

Exact message assertion:

```text
Course: codex-bilingual-textbook 0.1.0
Lesson: welcome
Section: Example section
Language: en

Selected material:
selected material

Learner question:
Why is this step necessary?
```

Expected: FAIL because selection helpers and UI are missing.

**Step 2: Implement pure extraction and formatting functions**

```ts
export interface LessonSelection {
  text: string;
  sectionHeading: string;
  rect: Pick<DOMRect, "top" | "right" | "bottom" | "left" | "width" | "height">;
  truncated: boolean;
  originalLength: number;
}

export function extractLessonSelection(root: HTMLElement, selection: Selection, maxChars = 4000): LessonSelection | null;
export function formatCodexQuestion(context: QuestionContext): string;
```

Count Unicode code points with `Array.from(text)`, not UTF-16 code units. The visible warning states the original and sent character counts. Highlighting alone never calls the bridge.

**Step 3: Implement the explicit-send interaction**

On `selectionchange`/pointer completion, show `SelectionAction` anchored within viewport bounds. Clicking it freezes the excerpt and opens `AskComposer`. Send is disabled until a non-whitespace question exists. On send, call `bridge.sendMessage(formattedText)`, which maps to official `app.sendMessage({ role: "user", content: [{ type: "text", text }] })`. Preserve draft and excerpt after failure; clear them only after success or Cancel.

**Step 4: Run tests, typecheck, and keyboard audit**

Expected: the bridge is called exactly once only after Send, failed sends are retryable, Escape cancels, focus returns predictably, and no selection text leaks before explicit send.

**Step 5: Commit**

```powershell
git add plugin/codex-bilingual-textbook/app
git commit -m "feat: ask Codex from lesson selections"
```

---

### Task 6: Add user-confirmed GitHub content update contracts

**Files:**

- Modify: `plugin/codex-bilingual-textbook/app/src/shared/contracts.ts`
- Modify: `plugin/codex-bilingual-textbook/app/src/shared/schemas.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/server/update/http-client.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/server/update/update-service.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/server/update/cache-store.ts`
- Modify: `plugin/codex-bilingual-textbook/app/src/server/create-course-server.ts`
- Create: `plugin/codex-bilingual-textbook/app/src/web/components/UpdateDialog.tsx`
- Modify: `plugin/codex-bilingual-textbook/app/src/web/components/CourseHeader.tsx`
- Test: `D:\codextest\codex-textbook-plugin\task-06\update-service.test.ts`
- Test: `D:\codextest\codex-textbook-plugin\task-06\update-ui.test.tsx`

**Step 1: Write failing update tests**

Use an injected fake HTTP client and temporary cache under `D:\codextest`. Test:

- `check_course_update` never activates content;
- update UI displays exact target version, bilingual summary, bytes, and compatibility;
- `apply_course_update` requires the exact checked version;
- incompatible `minimumPluginVersion` is rejected;
- every asset size and SHA-256 is checked;
- a checksum failure removes staging and retains the active pointer;
- successful activation uses rename/replace after complete staging;
- previous version remains as known-good rollback;
- interrupted fetch leaves the current version readable;
- identical version is idempotent.

Expected: FAIL because update service is missing.

**Step 2: Define the immutable release contract**

```ts
export interface ContentReleaseManifest {
  schemaVersion: 1;
  courseId: string;
  contentVersion: string;
  releaseTag: string;
  commitSha: string;
  minimumPluginVersion: string;
  summary: Record<Language, string>;
  assets: Array<{
    path: string;
    url: string;
    sizeBytes: number;
    sha256: string;
  }>;
}
```

Only `https://github.com`, `https://api.github.com`, and `https://objects.githubusercontent.com` asset URLs are accepted in version 1. Reject redirects outside the allowlist. No GitHub token, `git pull`, working-tree mutation, or dataset download is allowed.

**Step 3: Implement check and apply tools**

`check_course_update` input is `{ currentVersion: string, language: Language }`. `apply_course_update` input is `{ expectedCurrentVersion: string, targetVersion: string }`. The server re-fetches the immutable target manifest and verifies it; it does not trust UI-returned checksums.

Use cache layout:

```text
cache/
├── active.json
├── versions/<version>/...
└── staging/<random-id>/...
```

`active.json` is replaced atomically only after validation. Keep exactly the active and previous known-good content versions; cleanup only versions created by this service.

**Step 4: Implement confirmation UI and reload**

“Check for updates” calls only the check tool. The second button must include the exact version: “更新到 0.2.0 / Update to 0.2.0”. After success, reload the same stable lesson ID in the active language and accept the result only if `revision` is newer.

**Step 5: Run all update tests and commit**

```powershell
git add plugin/codex-bilingual-textbook/app
git commit -m "feat: add verified course content updates"
```

---

### Task 7: Add author release tooling and public-repository configuration

**Files:**

- Create: `content-release.example.yml`
- Create: `src/codex_textbook/release.py`
- Modify: `src/codex_textbook/cli.py`
- Modify: `src/codex_textbook/validation.py`
- Modify: `pyproject.toml`
- Test: `D:\codextest\codex-textbook-plugin\task-07\test_release.py`

**Step 1: Write failing release-builder tests**

Assert that `course-tool build-release`:

- validates paired lesson IDs before packaging;
- emits deterministic sorted asset entries;
- computes byte sizes and lowercase SHA-256 digests;
- includes bilingual summaries, release tag, commit SHA, schema version, and minimum plugin version;
- rejects mutable branch URLs and missing checksums;
- never bundles dataset files, only dataset metadata and authoritative URLs.

Expected: FAIL because the command does not exist.

**Step 2: Implement a deterministic release builder**

Public Python API:

```py
def build_release_manifest(
    source_root: Path,
    output_root: Path,
    *,
    version: str,
    release_tag: str,
    commit_sha: str,
    minimum_plugin_version: str,
    summary_zh: str,
    summary_en: str,
    asset_base_url: str,
) -> dict[str, object]: ...
```

Copy only validated manifests, lesson Markdown, figure assets, and dataset metadata into the output release directory. This command prepares artifacts; it does not push to GitHub or alter repository visibility.

**Step 3: Add configuration without inventing a repository URL**

`content-release.example.yml` documents `owner`, `repository`, and `latest_manifest_url` as user-supplied deployment fields. Production MCP configuration reads `COURSE_LATEST_MANIFEST_URL`; when absent, the UI runs entirely from bundled fixtures and explains that online updates are not configured.

After the user supplies the public repository URL, add its exact GitHub/API/object domains to resource CSP and run update smoke tests. Do not commit a placeholder URL as if it were live.

**Step 4: Run Python tests and existing validation suite**

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pytest 'D:\codextest\codex-textbook-plugin\task-07' -q
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pytest 'D:\codextest\codex-bilingual-textbook-ui' -q
```

Expected: new release tests and all existing external Python tests pass.

**Step 5: Commit**

```powershell
git add content-release.example.yml src/codex_textbook pyproject.toml
git commit -m "feat: build immutable course releases"
```

---

### Task 8: Package, visually verify, and prepare Developer Mode handoff

**Files:**

- Modify: `plugin/codex-bilingual-textbook/skills/bilingual-textbook/SKILL.md`
- Create: `plugin/codex-bilingual-textbook/README.md`
- Create: `plugin/codex-bilingual-textbook/app/README.md`
- Modify: `OPEN_COURSE.md`
- Test output only: `D:\codextest\codex-textbook-plugin\task-08\screenshots\*.png`
- Test output only: `D:\codextest\codex-textbook-plugin\task-08\verification.log`

**Step 1: Write the final acceptance checklist before polishing**

The checklist must fail until all conditions are observed:

- plugin validator succeeds;
- TypeScript typecheck and production build succeed;
- all external Vitest and pytest suites pass;
- MCP Inspector can list the one resource and five tools;
- UI renders at 1440×900, 1024×768, and 390×844;
- Chinese/English switch, dark mode, keyboard focus, reduced motion, missing translation, network failure, and long selection states are visually inspected;
- selected text reaches the current host conversation only after Send;
- no `.app.json`, OpenAI key request, GitHub token, R tool, SSH tool, or dataset binary exists.

**Step 2: Finish the bundled Skill**

The Skill instructs Codex to use `open_course` for opening the reader and to answer selection-originated messages with the supplied course version, lesson ID, section, language, and excerpt. It must not claim it executed code. Future execution is described only as reserved.

**Step 3: Add concise operator documentation**

Document:

- install/build/start commands;
- local endpoint `http://localhost:8000/mcp`;
- HTTPS tunnel and MCP Inspector verification;
- how to set `COURSE_LATEST_MANIFEST_URL` after the public content repo exists;
- why `.app.json` is intentionally absent;
- the exact next action: enable ChatGPT Developer Mode, create the app from the HTTPS MCP URL, then record the real `plugin_asdk_app...` ID.

**Step 4: Run full automated verification**

```powershell
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' run test
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\bin\fallback\pnpm.cmd' run build
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' -m pytest 'D:\codextest\codex-bilingual-textbook-ui' 'D:\codextest\codex-textbook-plugin\task-07' -q
& 'C:\Users\aaa\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe' 'C:\Users\aaa\.codex\skills\.system\plugin-creator\scripts\validate_plugin.py' 'D:\bioinformatics\.worktrees\textbook-ui\plugin\codex-bilingual-textbook'
```

Expected: all commands exit 0. Capture output in the external verification log without writing logs into the project.

**Step 5: Run visual verification**

Start the local app, open it in the in-app browser, capture the three viewport screenshots under `D:\codextest`, inspect them, and make only UI-specific corrections. Repeat screenshots after corrections. Do not claim Codex host messaging is verified from a plain browser mock.

**Step 6: Commit the verified prototype**

```powershell
git add plugin/codex-bilingual-textbook OPEN_COURSE.md
git commit -m "docs: prepare textbook plugin prototype"
```

**Step 7: Pause at the real external boundary**

Ask the user to enable Developer Mode and create the app only after the local prototype is approved. When the user provides the real app ID:

1. generate `.app.json` using the plugin-creator-supported shape;
2. validate the plugin again;
3. create/update the personal marketplace entry only with user approval because it writes outside the repository;
4. install/reload and run a real Plus-account Codex desktop smoke test;
5. only then state that Plus users can use the embedded reader and selection-to-Codex flow.

Do not fabricate the app ID, publish the private plugin source, make the content repository public, or push a release without explicit user direction.

---

## Completion criteria

The implementation is complete for local prototype review when Tasks 1–8 pass except the explicitly external Developer Mode/App ID/Plus-account smoke test. The user can then review a real browser-rendered UI and the MCP contract locally. Distribution readiness is a later milestone and must not be conflated with local prototype completion.
