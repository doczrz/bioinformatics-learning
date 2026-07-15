# Codex Embedded Interactive Textbook Plugin Design

**Date:** 2026-07-15  
**Status:** Ready for user review  
**Primary archetype:** Interactive, decoupled MCP app packaged as a Codex plugin

## 1. Goal

Build a bilingual textbook that opens as an HTML/JavaScript-style embedded interface in the Codex area of the ChatGPT desktop app. A learner can navigate lessons, switch the entire interface between Chinese and English, select text or code, click a floating **问 Codex / Ask Codex** action, add a question, and send the selection plus lesson context into the current host conversation.

The plugin must use the host conversation through the MCP Apps bridge. It must not ask Plus users for a separate OpenAI API key or create a second model conversation owned by the textbook.

## 2. Product Boundary

### Version 1 includes

- Embedded React textbook reader with a full-page layout.
- Whole-interface Chinese/English switching without navigating to another file.
- Lesson navigation, images, captions, code blocks, copy actions, sources, and external dataset entries.
- Text and code selection followed by a floating Ask Codex action.
- A compact question composer that shows the selected excerpt before submission.
- Submission to the host conversation through `ui/message` or its documented compatibility API.
- Current lesson context supplied through the MCP Apps bridge.
- Content-neutral authoring structure so subject matter can be rearranged later.
- A user-confirmed update button backed by a public GitHub content repository.
- Versioned content manifests and frequent content-only updates without republishing the plugin.
- Existing `bilingual-textbook` Skill packaged with the app.

### Version 1 excludes

- Running R, Python analysis, Linux analysis commands, Cell Ranger, schedulers, or SSH.
- Requesting or storing server credentials.
- Automatically downloading datasets.
- A separate chatbot panel backed by the OpenAI API.
- Public marketplace submission before the developer-mode prototype is accepted.
- Guaranteed cross-device progress synchronization without a later identity/storage decision.

## 3. Recommended Architecture

```text
Private Codex plugin source repository
├── .codex-plugin/plugin.json
├── .app.json                         # added after a developer-mode app ID exists
├── skills/bilingual-textbook/
│   └── SKILL.md
└── app/
    ├── server/                       # TypeScript MCP server
    ├── web/                          # React + TypeScript widget
    └── content/                      # development fixtures only

Public GitHub course-content repository
├── course-manifest.yml
├── chapters/zh/*.md
├── chapters/en/*.md
├── datasets/catalog.yml
├── figures/
├── releases/<version>/
├── latest.yml
└── Python validation/release tooling

GitHub Releases content channel
├── immutable lesson and image assets by tag
├── bilingual change summary
├── SHA-256 file manifest
└── minimum compatible plugin version
```

### Technology choices

- **Widget:** React, TypeScript, and Vite.
- **MCP runtime:** Node.js and TypeScript, starting from the smallest matching official Apps SDK example.
- **Authoring pipeline:** Keep Markdown, YAML, and the existing Python validators.
- **Content delivery:** The MCP server reads public GitHub Release manifests and immutable assets; changing lessons does not require rebuilding the UI plugin.
- **Dataset delivery:** Store only metadata and authoritative external download links. Never proxy large datasets through the textbook service.
- **Source visibility:** Course content is public. Plugin source remains private until the author chooses to publish it.

This separation keeps UI code stable while allowing the author to update lessons every two to five days.

## 4. User Experience

### Open the textbook

1. The user installs the plugin and starts a new Codex task.
2. The user invokes the plugin or asks Codex to open the textbook.
3. Codex calls `open_course`.
4. The tool returns structured course metadata and the textbook UI resource.
5. The widget opens in an embedded or fullscreen presentation.

### Switch language

The header contains a two-state `中文 | English` control. Switching language updates the full interface immediately, requests the paired lesson by the same stable lesson ID, and stores the preference in widget state. A missing translation is shown explicitly; the UI does not silently mix languages.

### Select and ask Codex

1. The learner selects text inside lesson prose or a code block.
2. A small floating **问 Codex / Ask Codex** action appears next to the selection.
3. Clicking it opens a compact composer containing:
   - the selected excerpt;
   - an editable question input;
   - Send and Cancel actions.
4. On Send, the widget posts one host message containing the course version, lesson ID, section heading, selected excerpt, and learner question.
5. The current Codex conversation answers using the bundled Skill and model-visible lesson context.

The selection is never sent merely because text was highlighted. Sending always requires an explicit click.

### Message contract

```text
Course: <course-id> <version>
Lesson: <lesson-id>
Section: <heading>
Language: <zh|en>

Selected material:
<selected text or code>

Learner question:
<question>
```

The initial selection limit is 4,000 Unicode characters. Longer selections are truncated only after the UI warns the user.

## 5. UI Components

- `TextbookApp` — top-level host and error boundary.
- `CourseHeader` — title, version, language control, update indicator.
- `LessonSidebar` — ordered chapter navigation and progress indicators.
- `LessonReader` — sanitized Markdown rendering, figures, captions, sources.
- `CodeBlock` — language label and copy action.
- `SelectionAction` — positions the Ask Codex action near the current selection.
- `AskComposer` — selected excerpt preview, question input, send state, retry state.
- `DatasetPanel` — source, size, license, checksum, and external download action.
- `EnvironmentStatus` — shows Local R and SSH/HPC as unavailable in version 1.

The UI uses a restrained textbook visual system rather than a dashboard aesthetic: readable measure, strong hierarchy, generous whitespace, neutral surfaces, and one accent color for navigation and actions.

## 6. MCP Tool Surface

### Version 1 tools

| Tool | Purpose | Safety annotations |
|---|---|---|
| `open_course` | Return course metadata and attach the textbook UI | read-only, idempotent |
| `get_lesson` | Return one lesson by stable ID and language | read-only, idempotent |
| `get_dataset_catalog` | Return external dataset metadata | read-only, idempotent, open-world links |
| `check_course_update` | Compare visible content versions | read-only, idempotent, open-world network |
| `apply_course_update` | Fetch, verify, cache, and activate an explicitly confirmed content version | idempotent, non-destructive, open-world network |

The Ask Codex action uses the UI bridge, not a custom `ask_model` MCP tool. Language and transient reading state use widget state in version 1.

### Reserved future tools

`run_r`, `submit_remote_job`, and credential-related tools are not registered in version 1. Their future UI locations may be visible but disabled. This prevents Codex from discovering or calling execution surfaces before their permission and audit design is complete.

## 7. State Model

- **Widget state:** active language, current lesson ID, sidebar state, current selection, composer draft, and in-conversation progress.
- **Server cache:** content version, ETag, last successful fetch time, and last known good lesson payload.
- **Author state:** Markdown/YAML source, validation results, and release manifest.
- **Future persistent learner state:** requires a separate decision on authentication and storage. It is not implied by the version 1 widget state.

Every component-initiated request includes the current course version and lesson ID. Responses include a monotonic content version so stale results cannot overwrite a newer lesson.

## 8. Content Update Model

The plugin UI and MCP schemas change slowly. Course text changes frequently. The public course-content repository and private plugin-source repository have independent release cycles.

### GitHub release contract

The public content repository exposes a stable `latest.yml` pointer. Each content version is also published as an immutable GitHub Release or commit-addressed release directory. The latest manifest contains:

- content schema version;
- semantic course version;
- immutable Git commit or release tag;
- minimum compatible plugin version;
- bilingual change summary;
- asset URLs;
- expected file sizes and SHA-256 checksums.

No GitHub token is shipped in the widget or required for public content.

### Author release flow

1. The author edits paired Markdown lessons and the YAML manifests.
2. Existing Python validation checks IDs, translation pairs, links, code fences, and image metadata.
3. Release tooling generates checksums and the bilingual change summary.
4. A tagged GitHub content release publishes immutable lesson and image assets.
5. `latest.yml` is advanced only after the release passes validation.

### Learner update flow

1. The learner presses **检查更新 / Check for updates**.
2. The widget calls `check_course_update` and displays the target version, bilingual change summary, download size, and compatibility result.
3. The learner explicitly presses **更新到 <version> / Update to <version>**.
4. The widget calls `apply_course_update` with that exact version.
5. The MCP server fetches assets from the immutable GitHub Release, validates the schema, checks every SHA-256 digest, and writes a staging cache.
6. After all checks pass, the server atomically changes the active content pointer and retains the previous known-good version for rollback.
7. The widget reloads the current lesson by stable lesson ID in the active language and reports the installed content version.

The update button does not execute `git pull` on the learner's computer. Users do not need Git, a local clone, or a GitHub account.

### Content update versus plugin update

- Lesson text, images, course ordering, citations, and external dataset links use the content update flow and do not require plugin republishing.
- React UI code, MCP tool schemas, permissions, execution interfaces, or the bundled Skill require a plugin release.
- If `minimum compatible plugin version` is newer than the installed plugin, the content update is not applied; the UI explains that a plugin update is required.

If a new manifest or lesson is invalid, the server keeps the last known good version and reports a non-blocking update error.

## 9. Error Handling

- **Host message failure:** keep the question draft and selection, show Retry, and never claim the question was sent.
- **Content network failure:** use the last known good cached lesson and show its version and cache time.
- **Missing translation:** show a clear untranslated-state page with a route back; never render the other language under the selected language label.
- **Invalid content payload:** reject it server-side and retain the previous version.
- **Checksum or compatibility failure:** keep the current version active, delete the staging cache, and show the exact failed validation category.
- **External dataset link failure:** show source metadata and a warning; never substitute an unverified mirror automatically.
- **Unsupported client surface:** return a model-readable Markdown summary when the embedded UI cannot render.

## 10. Security and Privacy

- Sanitize lesson Markdown before rendering; do not execute lesson-provided HTML or scripts.
- Configure the narrowest Apps SDK CSP for content, image, and connection domains.
- Use host-supported external-link APIs for dataset and source links.
- Do not include OpenAI API keys in the widget or request them from Plus users.
- Do not include GitHub credentials in the widget; public content updates use anonymous read-only requests.
- Do not run `git pull` or mutate a learner's source checkout from the update button.
- Do not send selected text until the learner explicitly presses Send.
- Keep `structuredContent` concise and model-readable; keep UI-only payloads in `_meta`.
- Do not register version 1 R or SSH tools.
- Treat every future execution tool as approval-gated and separately audited.

## 11. Validation Strategy

### Automated

- Unit tests for selection extraction, selection-length limits, and message formatting.
- Component tests for language switching, selection action positioning, composer cancellation, retry behavior, and missing translations.
- MCP contract tests for schemas, annotations, structured content, resource metadata, and content-version handling.
- Update tests for exact-version confirmation, checksum failure, plugin compatibility, atomic activation, rollback, and interrupted downloads.
- Content tests using the existing external Python test harness.
- Build, typecheck, lint, and static CSP/resource validation.

### Runtime

- Local MCP health and tool descriptor checks.
- MCP Inspector tests for resource and tool responses.
- ChatGPT Developer Mode tests through an HTTPS tunnel.
- Codex desktop smoke test: open course, switch language, select text, add a question, send it, and confirm the current conversation receives the expected context.
- A real Plus-account installation smoke test before claiming Plus availability.

## 12. Delivery Phases

1. **Interactive prototype:** React widget, local MCP server, fixtures, language switching, and selection composer.
2. **Developer Mode integration:** expose `/mcp` through HTTPS, create the developer-mode app, and verify `ui/message` in the Codex desktop surface.
3. **Plugin packaging:** scaffold `.codex-plugin/plugin.json`, add the app ID in `.app.json`, bundle the Skill, and add a personal marketplace entry.
4. **Content channel:** connect the public GitHub Release manifest, exact-version confirmation, caching, checksum validation, atomic activation, and rollback workflow.
5. **Distribution preparation:** validate permissions, privacy policy, screenshots, support information, test cases, and plugin submission requirements.

The developer-mode app ID is not invented or committed as a placeholder. It is added only after the app has been created in the user's ChatGPT Developer Mode account.

## 13. Source Guidance

- Plugin model and desktop availability: <https://learn.chatgpt.com/docs/plugins>
- Building MCP-backed apps inside plugins: <https://learn.chatgpt.com/docs/build-app>
- Apps SDK bridge, `ui/message`, tool calls, and model-context updates: <https://developers.openai.com/apps-sdk/reference>
- Building the widget UI: <https://developers.openai.com/apps-sdk/build/chatgpt-ui>
