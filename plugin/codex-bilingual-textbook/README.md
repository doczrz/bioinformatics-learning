# Codex Bilingual Textbook plugin

Private plugin bundle for an embedded Chinese-English textbook reader. The UI source can remain private while course releases are published from a separate public repository.

## Current prototype

- Opens as an MCP App resource inside a supported Codex/ChatGPT host.
- Switches the complete interface and lesson between Chinese and English.
- Lets learners select prose or code, add a question, and explicitly send it to the current Codex conversation.
- Shows Local R and SSH/HPC as disabled future interfaces; version 1 does not execute code.
- Checks and installs user-confirmed public content releases with size and SHA-256 verification.
- Keeps dataset binaries outside the plugin and course-content release.

The plugin intentionally has no `.app.json`. A real `plugin_asdk_app...` ID must come from ChatGPT Developer Mode; no placeholder ID is valid.

## Build and start

```powershell
cd plugin/codex-bilingual-textbook/app
pnpm install
pnpm run build
pnpm start
```

The local MCP endpoint is `http://localhost:8000/mcp`; the health endpoint is `http://localhost:8000/health`.

See [app/README.md](app/README.md) for update configuration and local verification.

## Developer Mode handoff

After local UI approval:

1. Expose the MCP endpoint through an HTTPS tunnel.
2. Enable ChatGPT Developer Mode.
3. Create the app using the HTTPS `/mcp` URL.
4. Record the real app ID and only then generate `.app.json`.
5. Reload the plugin and run a real Plus-account selection-to-Codex smoke test.

Do not publish this private plugin repository or create the public content repository without the owner's explicit instruction.
