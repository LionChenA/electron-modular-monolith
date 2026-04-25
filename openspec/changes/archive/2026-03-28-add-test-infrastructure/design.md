## Context

### Background
This is an Electron application using electron-vite with a Modular Monolith architecture. The project currently has zero testing infrastructure. The codebase is organized into three main layers:
- `src/app/main` - Electron main process
- `src/app/preload` - Preload scripts
- `src/app/renderer` - React renderer (Vite-based)
- `src/features` - Business logic in vertical slices
- `src/shared` - Shared utilities

### Current State
- No testing framework installed
- No test files exist
- electron-vite handles build/dev, but no test runner
- Project uses pnpm, Biome for linting/formatting

### Constraints
1. **Namespace Isolation**: Vitest and Playwright cannot share the same test process due to global API conflicts
2. **Electron Environment**: Tests must handle main/preload/renderer isolation
3. **Vite Integration**: Must work with electron-vite configuration
4. **React 19**: Must use compatible testing libraries

## Goals / Non-Goals

### Goals
1. Install and configure Vitest for unit/integration tests
2. Install and configure Storybook for component development
3. Install and configure Playwright for E2E testing
4. Prevent namespace conflicts between test runners
5. Provide npm scripts for all test types
6. Support testing in all three Electron contexts (main, preload, renderer)

### Non-Goals
- Test coverage requirements (deferred to future)
- Visual regression testing setup (Storybook addon, deferred)
- Main process IPC testing infrastructure (deferred)
- Performance benchmarking

## Decisions

### D Configuration Strategy
**Decision**:1: Vitest Use Vitest with React plugin and exclude E2E directory
**Rationale**: Simplest solution per Noroff workflow - one-line exclude prevents Playwright conflicts
**Alternative**: Use Vitest workspaces for unit/integration separation (over-engineered for initial setup)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    exclude: ['**/node_modules/**', '**/tests/e2e/**'],
  },
})
```

### D2: Playwright Configuration Strategy
**Decision**: Separate config with independent execution
**Rationale**: Playwright runs in its own process, no Vitest conflict possible

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

### D3: Storybook Configuration Strategy
**Decision**: Use @storybook/react-vite for Vite-based React
**Rationale**: Native Vite support, faster startup than webpack

```javascript
// .storybook/main.js
module.exports = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-vitest'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
}
```

### D4: Directory Structure
**Decision**: Flat structure with clear separation

```
tests/
  unit/           # Vitest tests (co-located with source)
    src/
  e2e/            # Playwright tests
src/
  features/
    ping/
      ping.test.ts      # Unit tests (co-located)
      Ping.stories.tsx  # Storybook stories
```

**Rationale**: 
- Co-located tests follow "tests near code" principle
- E2E tests in separate directory for clear exclusion
- Stories co-located enable easier discovery

### D5: npm Scripts
**Decision**: Explicit separation with clear naming

```json
{
  "test": "vitest",
  "test:run": "vitest run",
  "test:e2e": "playwright test",
  "test:e2e:ui": "playwright test --ui",
  "storybook": "storybook dev",
  "storybook:build": "storybook build"
}
```

**Rationale**: Clear distinction, easy to run individually

## Risks / Trade-offs

### Risk 1: Electron Main Process Testing
**[Risk]**: Vitest runs in Node.js, but Electron main process has different globals
**[Mitigation]**: Skip main process tests for now. Test business logic in features/ only (pure functions)

### Risk 2: Storybook + Vitest Integration Complexity
**[Risk]**: @storybook/addon-vitest may conflict with existing Vitest config
**[Mitigation]**: Start without addon-vitest. Add later if component testing needed

### Risk 3: Playwright Browser Installation
**[Risk]**: Playwright browsers may not be installed in CI
**[Mitigation]**: Add `npx playwright install` to CI pipeline

### Risk 4: Happy-DOM vs JSDOM
**[Risk]**: Happy-dom may have differences from browser behavior
**[Mitigation]**: Use happy-dom for speed, fallback to jsdom if issues arise

## Migration Plan

### Phase 1: Install Dependencies
```bash
pnpm add -D vitest @vitest/ui @vitest/coverage-v8
pnpm add -D @playwright/test
pnpm add -D storybook @storybook/react @storybook/react-vite @storybook/addon-essentials
```

### Phase 2: Create Configuration Files
1. Create `vitest.config.ts`
2. Create `playwright.config.ts`
3. Create `.storybook/main.js`
4. Create `.storybook/preview.js`

### Phase 3: Add npm Scripts
Update `package.json` with test scripts

### Phase 4: Verify
1. Run `pnpm test` - should pass
2. Run `pnpm test:e2e` - should show no tests (empty)
3. Run `pnpm storybook` - should start

## Open Questions

1. **Q**: Should we use Vitest browser mode for component tests?
   - **A**: Deferred. Start with happy-dom. Add browser mode when needed.

2. **Q**: How to test IPC communication between main and renderer?
   - **A**: Deferred. Requires special setup with Electron runtime.

3. **Q**: Coverage threshold?
   - **A**: Not set initially. Add after test culture is established.
