---
name: dev-workflow
description: Development workflow for the Electron modular monolith project. Load this skill during any implementation task. Enforces the correct feedback loop: smoke test → visual verification → final checks.
---

# Dev Workflow

This project uses a layered feedback pipeline:

```
修改代码 → pnpm test:smoke → agent-browser 视觉验证 → 最终检查
```

## Shadcn Component Management

This project has `shadcn` as a local dependency (currently ^4.7.0). When adding or updating shadcn/ui components:

- **ALWAYS use `pnpm shadcn add`** (project-local CLI), **NOT `pnpm dlx shadcn@latest add`**
- Using `pnpm shadcn` ensures the CLI version matches the project's lockfile
- `pnpm dlx` bypasses lockfile and caused the structural mismatch issue previously

```bash
# ✅ CORRECT: uses project-local version
pnpm shadcn add tabs input button

# ❌ WRONG: bypasses project dependency management
pnpm dlx shadcn@latest add tabs input button
```

## Step 1: Smoke Test

After every code change:

```bash
pnpm test:smoke
```

This starts `electron-vite dev`, opens the app, verifies it renders, and shuts down.

**If fail** → read the error output, fix the issue, retry.

## Step 2: Visual Verification (if UI changed)

Start dev mode and connect agent-browser:

```bash
pnpm dev &
DEV_PID=$!
# Wait for port 9222
while ! lsof -i :9222 > /dev/null 2>&1; do sleep 0.5; done
# Connect and inspect
agent-browser connect 9222
agent-browser snapshot -i
agent-browser screenshot
agent-browser console
# Cleanup
kill $DEV_PID 2>/dev/null
```

## Step 3: Final Checks (before completion)

```bash
pnpm test:e2e       # Full E2E regression
pnpm typecheck      # TypeScript types
pnpm check          # Biome format + lint
pnpm build          # Production build
```

## Lessons Learned

### 1. Prototype → Implementation Visual Consistency

When working with a UI prototype as a design reference:

1. **Prototype confirmed** → extract key visual parameters into `design.md` *before* deleting the prototype
   - Spacing values (padding, gap, margin)
   - Border treatment (border-r vs rounded-lg, border colors)
   - Background treatment (bg-accent vs bg-muted vs none)
2. **Implementation complete** → take agent-browser screenshot of the real implementation
3. **Compare side-by-side** with the prototype before deleting it
4. **Fix discrepancies** found in comparison, then delete prototype

**Root cause of this lesson**: In the redesign-storage-explorer change, the prototype was deleted immediately after confirmation. Implementation relied on memory, leading to visual drift. The fix required recreating the prototype from memory and iterating with screenshots.

### 2. Test Strategy Alignment

Follow the project's test layer strategy from `openspec/specs/`:

| Layer | Method | Tool |
|-------|--------|------|
| **Unit** | Direct function calls with mocks | Vitest |
| **Integration** | `call()` to ORPC handlers with mocked context | Vitest |
| **Component** | Storybook stories (visual testing) | Storybook |
| **E2E** | Real app (no mocking) | Playwright |

**Components are tested via Storybook stories, NOT Vitest `.test.tsx` files.** Writing Vitest component tests violates the spec and creates maintenance burden. Extract logic into hooks/testable functions instead.

### 3. Shadcn CLI Version Consistency

Use `pnpm shadcn add` (project-local) rather than `pnpm dlx shadcn@latest add`. See the Shadcn Component Management section above for details.

### 4. Verification Before Completion

Every implementation phase must complete the full verification loop before the next phase starts:

1. `pnpm test:smoke` — app compiles and renders
2. `pnpm test` — existing tests not broken (+ new tests if applicable)
3. Agent-browser visual check — UI matches design (for UI changes)
4. Final: `pnpm typecheck && pnpm check && pnpm build` — before merge/archive

## Quick Reference

| Command | What | When |
|---------|------|------|
| `pnpm test:smoke` | Fast app start + render check | Every change |
| `agent-browser connect 9222` | Visual debug | UI changes |
| `pnpm test:e2e` | Full E2E | Before finish |
| `pnpm typecheck` | TS types | Before finish |
| `pnpm check` | Format/Lint | Before finish |
| `pnpm build` | Production build | Before finish |
