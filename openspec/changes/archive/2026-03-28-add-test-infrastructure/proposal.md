## Why

The project currently has zero testing infrastructure. As the Modular Monolith application grows in complexity, maintaining reliability requires a comprehensive testing strategy. The three testing tools (Vitest, Storybook, Playwright) each serve distinct purposes, but they must be configured with careful attention to namespace isolation to avoid critical runtime conflicts that are extremely difficult to debug.

## Scope

### In Scope (This Proposal)
- Test infrastructure setup (dependencies, configs, scripts)
- One example test per type to verify the pipeline works
- Focus on core infrastructure: storage layer, IPC handlers, business logic, shared utilities

### Out of Scope
- Detailed business test coverage (deferred to next proposal)
- Visual regression testing setup
- Performance benchmarking

## What Changes

- Install and configure **Vitest** with workspace isolation for unit and integration tests
- Install and configure **Storybook** for component development and visual testing
- Install and configure **Playwright** for end-to-end testing
- Configure **MSW** for IPC mocking in integration tests
- Set up **ORPC → OpenAPI → MSW** mock generation pipeline (referenced from electron-shadcn)
- Configure Vitest workspaces to separate renderer/main/storybook environments
- Configure Vitest to exclude E2E test directory to prevent namespace collision
- Add npm scripts for running each test type independently
- Establish testing conventions and directory structure

## Capabilities

### New Capabilities

- `unit-integration-testing`: Vitest-based unit and integration testing for business logic, utilities, and React components
- `component-visual-testing`: Storybook-based isolated component development and visual regression testing
- `e2e-electron-testing`: Playwright-based end-to-end testing for the Electron application

### Modified Capabilities

- None - this is a net-new capability addition

## Impact

### Dependencies

**Testing Framework:**
- `vitest`
- `@vitest/ui`
- `@vitest/coverage-v8`
- `@vitest/browser`
- `@vitest/browser-playwright`

**E2E:**
- `@playwright/test`
- `playwright`

**Storybook:**
- `storybook`
- `@storybook/react-vite`
- `@storybook/addon-vitest`
- `@storybook/addon-essentials`
- `@storybook/addon-a11y`

**Testing Library:**
- `@testing-library/react`
- `@testing-library/jest-dom`
- `@testing-library/user-event`

**MSW + ORPC:**
- `msw` (v2)
- `@orpc/openapi`
- `@orpc/zod`

**Others:**
- `vite-tsconfig-paths`
- `happy-dom`
- `tsx`

### Directory Structure

```
src/
├── app/
│   ├── main/
│   │   └── infra/
│   │       └── storage/
│   │           └── sqlite/
│   │               └── sqlite.test.ts      # Unit test (main process)
├── renderer/
│   └── components/
│       └── *.test.tsx                      # Unit test (renderer)
├── features/
│   └── ping/
│       ├── ping.test.ts                    # Unit test
│       ├── ping.integration.test.ts        # Integration test
│       └── Ping.stories.tsx               # Storybook
└── shared/
    └── utils/
        └── format.test.ts                  # Unit test

test/
├── mocks/
│   ├── server.ts                          # MSW server
│   ├── openapi.json                       # Generated OpenAPI spec
│   └── gen/
│       └── msw/                          # Generated MSW handlers
└── e2e/
    └── app.e2e.test.ts                    # E2E test
```

### Configuration Files

- `vitest.config.ts` - Main Vitest configuration with workspace isolation
- `vitest.workspace.ts` - Vitest workspace configuration (renderer/main/storybook)
- `test/vitest.setup.ts` - Global Vitest setup (MSW server)
- `test/mocks/server.ts` - MSW server configuration
- `scripts/generate-openapi.ts` - ORPC → OpenAPI generation script
- `playwright.config.ts` - Playwright configuration
- `.storybook/main.ts` - Storybook configuration
- `.storybook/preview.tsx` - Storybook preview configuration
- `.storybook/vitest.setup.ts` - Storybook Vitest setup
- `tsconfig.vitest.json` - Vitest TypeScript configuration

### Testing Conventions (File Naming)

| Test Type | Pattern | Example |
|-----------|---------|---------|
| Unit | `{name}.test.ts` | `ping.test.ts` |
| Integration | `{name}.integration.test.ts` | `ping.integration.test.ts` |
| E2E | `{name}.e2e.test.ts` | `app.e2e.test.ts` |
| Storybook | `{Component}.stories.tsx` | `Ping.stories.tsx` |

### Component Testing Scope

- **Test**: Custom components + customized shadcn components
- **Do NOT test**: Raw shadcn components (Button, Input, etc.)

### Namespace Isolation Strategy

The key solution is to use Vitest workspaces with proper environment separation:

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    projects: [
      defineProject({
        name: 'renderer',
        test: { 
          environment: 'jsdom',
          include: ['src/app/renderer/**/*.{test,spec}.{ts,tsx}'],
        }
      }),
      defineProject({
        name: 'main',
        test: { 
          environment: 'node',
          include: ['src/app/main/**/*.{test,spec}.{ts,tsx}', 'src/shared/**/*.{test,spec}.{ts,tsx}'],
        }
      }),
      defineProject({
        name: 'storybook',
        test: { browser: { enabled: true, provider: playwright({}) } }
      }),
    ],
    exclude: ['**/node_modules/**', '**/test/e2e/**'],
  },
});
```

This approach:
1. Separates renderer/main environments via Vitest workspaces
2. Excludes E2E tests from Vitest (preventing namespace collision)
3. Playwright E2E tests run in a completely separate process

### ORPC → OpenAPI → MSW Pipeline

Reference: electron-shadcn implementation

1. **Generate OpenAPI spec** from ORPC router:
```typescript
// scripts/generate-openapi.ts
import { router } from '../src/app/main/orpc';
import { OpenAPIGenerator } from '@orpc/openapi';
import { ZodToJsonSchemaConverter } from '@orpc/zod/zod4';

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
});
const openApiSpec = await generator.generate(router, { info: { title: 'App API', version: '1.0.0' } });
```

2. **Use MSW** to mock IPC calls in integration tests:
```typescript
// test/vitest.setup.ts
import { setupServer } from 'msw/node';
const server = setupServer(...handlers);
beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

3. **Mock IPC in tests**:
```typescript
vi.mock('../../src/renderer/ipc/manager', () => ({
  ipc: { client: { ... } }
}));
```

### npm Scripts

```json
{
  "test": "vitest run",
  "test:watch": "vitest watch",
  "test:main": "vitest --project main",
  "test:renderer": "vitest --project renderer",
  "test:component": "vitest --project storybook",
  "test:e2e": "playwright test",
  "test:all": "pnpm test && pnpm test:e2e",
  "storybook": "storybook dev -p 6006",
  "storybook:build": "storybook build",
  "openapi:generate": "tsx scripts/generate-openapi.ts"
}
```

### Soft Guidance: What to Test

**Priority: Core Infrastructure**
- ✅ Storage layer (SQLite, preferences, secrets)
- ✅ IPC handlers (ORPC routers)
- ✅ Business logic in features
- ✅ Shared utilities and types

**Lower Priority: UI Examples**
- ❌ Demo components
- ❌ Example pages
- ❌ Showcase features
