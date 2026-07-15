# Textbook MCP App

React single-file widget plus a TypeScript MCP server for the bilingual textbook.

## Local operation

Requires Node.js 20 or newer.

```powershell
pnpm install
pnpm run test
pnpm run build
pnpm start
```

Defaults:

- MCP: `http://localhost:8000/mcp`
- Health: `http://localhost:8000/health`
- Port override: `PORT`
- Content cache override: `COURSE_CACHE_DIR`

The production build emits one self-contained `dist/index.html`. The MCP resource URI is `ui://codex-bilingual-textbook/reader.html`.

## MCP Inspector and HTTPS

Build and start the server, then point MCP Inspector at `http://localhost:8000/mcp`. It should list one UI resource and five tools:

- `open_course`
- `get_lesson`
- `get_dataset_catalog`
- `check_course_update`
- `apply_course_update`

For Developer Mode, expose the same endpoint through an HTTPS tunnel and use the resulting HTTPS `/mcp` URL. A plain browser can verify layout and HTTP health, but cannot prove host `sendMessage` integration.

## Public content updates

Online updates are optional. Without configuration, bundled fixtures remain usable and the UI says updates are not configured.

After a public content repository and immutable release exist, set:

```powershell
$env:COURSE_LATEST_MANIFEST_URL = "https://github.com/<owner>/<repository>/releases/latest/download/release-manifest.json"
pnpm start
```

Replace the example segments with the real repository. Public releases require no GitHub token. The server accepts only the configured GitHub allowlist, re-fetches the checked release before applying it, validates every byte size and SHA-256, stages all files, then changes the active pointer. It never runs `git pull` and never downloads dataset binaries.

Author-side release artifacts are generated from the repository root with `course-tool build-release`; deployment and repository visibility remain manual owner decisions.

## Explicitly absent in version 1

- OpenAI API key prompts
- GitHub credentials
- R/Python execution tools
- SSH or scheduler tools
- dataset proxying or automatic dataset downloads
- `.app.json` before a real Developer Mode app ID exists
