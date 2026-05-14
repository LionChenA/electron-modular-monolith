# Agent Development Workflow

## Tools

- **agent-browser** — Visual verification of running Electron app (connect via CDP port 9222)
- **Playwright** — E2E and smoke tests
- **Biome** — Formatting and linting

## Development Workflow (do NOT skip steps)

### Iteration Loop (after every code change)

```
Step 1: pnpm test:smoke           (~5s)
  → Verifies app compiles, starts, and renders
  → If fail → fix build/import errors → retry

Step 2: Visual verification (if UI changed)
  → pnpm dev &                     # Start in background
  → Wait for port 9222 (lsof -i :9222)
  → agent-browser connect 9222
  → agent-browser snapshot -i      # Check UI structure
  → agent-browser screenshot       # Visual confirmation
  → agent-browser console          # Check for errors
  → agent-browser eval "..."       # Run custom checks
  → kill $DEV_PID                  # Cleanup

Step 3: When complete
  → pnpm test:e2e                  # Full E2E regression
  → pnpm typecheck                 # Type checking
  → pnpm check                     # Format/Lint
  → pnpm build                     # Production build
```

### Quick Reference

| Command | Purpose | Time |
|---------|---------|------|
| `pnpm test:smoke` | Fast smoke test (app starts + renders) | ~5s |
| `agent-browser connect 9222` | Connect to running Electron app | ~1s |
| `pnpm test:e2e` | Full E2E regression | ~30s |
| `pnpm typecheck` | TypeScript type checking | ~8s |
| `pnpm check` | Biome format + lint | ~3s |
| `pnpm build` | Production build (no typecheck) | ~4s |
