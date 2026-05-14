---
name: dev-workflow
description: Development workflow for the Electron modular monolith project. Load this skill during any implementation task. Enforces the correct feedback loop: smoke test → visual verification → final checks.
---

# Dev Workflow

This project uses a layered feedback pipeline:

```
修改代码 → pnpm test:smoke → agent-browser 视觉验证 → 最终检查
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

## Quick Reference

| Command | What | When |
|---------|------|------|
| `pnpm test:smoke` | Fast app start + render check | Every change |
| `agent-browser connect 9222` | Visual debug | UI changes |
| `pnpm test:e2e` | Full E2E | Before finish |
| `pnpm typecheck` | TS types | Before finish |
| `pnpm check` | Format/Lint | Before finish |
| `pnpm build` | Production build | Before finish |
