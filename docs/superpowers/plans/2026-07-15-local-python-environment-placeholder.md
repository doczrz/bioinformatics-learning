# Local Python Environment Placeholder Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual, disabled Local Python entry to the textbook Environments section and expose it as a reserved course environment.

**Architecture:** Extend the existing `CourseIndex.environments` identifier union and `FileContentStore` payload, then add one matching disabled control beside Local R and SSH/HPC. No execution behavior or MCP tool is introduced.

**Tech Stack:** React 19, TypeScript 5.9, Vitest 3, Testing Library 16, existing Markdown documentation.

## Global Constraints

- Environment order is exactly Local R, Local Python, SSH/HPC.
- English copy is `Local Python — Later`; Chinese copy is `本地 Python — 后续开放`.
- `local-python` always has `status: "reserved"`.
- Do not add interpreter discovery, execution, filesystem access, credentials, package installation, connection dialogs, or MCP execution tools.
- All temporary tests remain under `D:\codextest\codex-textbook-plugin`.

---

### Task 1: Add the reserved Local Python environment

**Files:**

- Modify: `D:\codextest\codex-textbook-plugin\task-02\content-store.test.ts`
- Modify: `D:\codextest\codex-textbook-plugin\task-04\reader-ui.test.tsx`
- Modify: `plugin/codex-bilingual-textbook/app/src/shared/contracts.ts`
- Modify: `plugin/codex-bilingual-textbook/app/src/server/content-store.ts`
- Modify: `plugin/codex-bilingual-textbook/app/src/web/components/EnvironmentStatus.tsx`
- Modify: `plugin/codex-bilingual-textbook/skills/bilingual-textbook/SKILL.md`
- Modify: `plugin/codex-bilingual-textbook/README.md`
- Modify: `plugin/codex-bilingual-textbook/app/README.md`
- Modify: `OPEN_COURSE.md`

**Interfaces:**

- Consumes: `CourseIndex.environments` and the existing disabled environment-button visual treatment.
- Produces: environment identifier `local-python` with `status: "reserved"`, plus localized disabled UI labels.

- [ ] **Step 1: Add failing data-contract and UI tests**

Change the expected course environments to:

```ts
expect(result.environments).toEqual([
  { id: "local-r", status: "reserved" },
  { id: "local-python", status: "reserved" },
  { id: "ssh-hpc", status: "reserved" },
]);
```

In the environment UI test, assert both localized controls are disabled:

```ts
const localPythonZh = screen.getByRole("button", {
  name: "本地 Python — 后续开放",
}) as HTMLButtonElement;
expect(localPythonZh.disabled).toBe(true);

await user.click(screen.getByRole("button", { name: "English" }));
const localPythonEn = screen.getByRole("button", {
  name: "Local Python — Later",
}) as HTMLButtonElement;
expect(localPythonEn.disabled).toBe(true);
```

- [ ] **Step 2: Run the targeted tests and verify RED**

Run from `plugin/codex-bilingual-textbook/app`:

```powershell
pnpm exec vitest run --config D:/codextest/codex-textbook-plugin/vitest.config.ts D:/codextest/codex-textbook-plugin/task-02/content-store.test.ts D:/codextest/codex-textbook-plugin/task-04/reader-ui.test.tsx
```

Expected: the content-store assertion lacks `local-python`, and the Local Python button cannot be found.

- [ ] **Step 3: Implement the minimal contract, store, and component changes**

Extend the identifier union:

```ts
id: "local-r" | "local-python" | "ssh-hpc";
```

Return the new reserved environment between R and SSH/HPC:

```ts
environments: [
  { id: "local-r", status: "reserved" },
  { id: "local-python", status: "reserved" },
  { id: "ssh-hpc", status: "reserved" },
],
```

Add the disabled localized control in `EnvironmentStatus`:

```tsx
const localPython = isChinese ? "本地 Python" : "Local Python";

<button type="button" disabled aria-label={`${localPython} — ${later}`}>
  <span>{localPython}</span>
  <small>{later}</small>
</button>
```

- [ ] **Step 4: Update version-1 documentation**

Replace references that list only Local R and SSH/HPC with `Local R, Local Python, and SSH/HPC`, preserving the statement that all three are reserved and execute nothing.

- [ ] **Step 5: Run targeted and full verification**

Run:

```powershell
pnpm run test
pnpm run build
python -m pytest D:/codextest/codex-bilingual-textbook-ui D:/codextest/codex-textbook-plugin/task-07 -q
python C:/Users/aaa/.codex/skills/.system/plugin-creator/scripts/validate_plugin.py D:/bioinformatics/.worktrees/textbook-ui/plugin/codex-bilingual-textbook
```

Expected: all suites exit 0; production build and plugin validation succeed.

- [ ] **Step 6: Commit the verified change**

```powershell
git add plugin/codex-bilingual-textbook OPEN_COURSE.md
git commit -m "feat: reserve local Python environment"
```
