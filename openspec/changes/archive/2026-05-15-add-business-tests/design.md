## Context

This design adopts the **electron-shadcn approach** for unified ORPC + OpenAPI + MSW testing. Reference: `/Users/lion/Developer/MyProjects/electron-shadcn/openspec/changes/archive/2025-12-07-integrate-msw-for-ipc-mocking/design.md`

### Core Architecture: From IPC to HTTP

The key insight is to re-configure the ORPC client's transport layer based on the environment:

| Environment | Transport | Communication |
|-------------|-----------|---------------|
| **Production** | `RPCLink` (MessagePort) | Electron IPC |
| **Test** (`NODE_ENV === 'test'`) | `HTTPRPCLink` | HTTP POST to localhost |

This enables MSW to intercept ORPC calls without changing component code.

### Current Project State

The project has:
- Vitest configured with workspace isolation
- MSW configured (server.ts)
- OpenAPI generation script (`scripts/generate-openapi.ts`)
- Example tests using manual mocking

### Missing Components

- **Kubb** for MSW handler generation
- **HTTPRPCLink** test transport configuration
- **OpenAPI spec** generation to `test/mocks/openapi.json`
- **MSW handlers** for feature routers (ping, general)

## Goals / Non-Goals

**Goals:**
- Unified ORPC + OpenAPI + MSW testing pipeline
- Automated MSW handler generation from OpenAPI spec
- Integration test coverage for ORPC Handlers
- Unit test coverage for Event Bus, Shared Utils, Zod Contracts
- Minimal E2E coverage

**Non-Goals:**
- MSW integration with Playwright E2E (E2E tests use real app)
- Visual regression testing (deferred)
- Performance benchmarking

## Decisions

### 1. Test Transport Strategy

**Decision**: Use conditional transport switching between production and test.

```typescript
// src/app/renderer/infra/client.ts

import { createORPCClient } from '@orpc/client';
import { RPCLink as HTTPRPCLink } from '@orpc/client/fetch';
import { RPCLink } from '@orpc/client/message-port';

const link = process.env.NODE_ENV === 'test'
  ? new HTTPRPCLink({ url: 'http://localhost/rpc' })
  : new RPCLink({ port: clientPort });

export const client = createORPCClient(link);
```

**Reference**: electron-shadcn `src/renderer/ipc/manager.ts`

**Rationale**:
- Production: Fast IPC via MessagePort
- Test: HTTP calls intercepted by MSW

### 2. OpenAPI Generation Pipeline

**Decision**: Use existing `scripts/generate-openapi.ts` + Kubb for MSW handler generation.

```bash
# 1. Generate OpenAPI spec
pnpm openapi:generate  # → test/mocks/openapi.json

# 2. Generate MSW handlers (via Kubb)
pnpm kubb
```

**Files**:
- `scripts/generate-openapi.ts` - Already exists
- `test/mocks/openapi.json` - Generate via `pnpm openapi:generate`
- `test/mocks/gen/msw/` - Generated MSW handlers

**Reference**: electron-shadcn `scripts/generate-openapi.ts`, `test/mocks/`

### 2.1 Zod Schema Constraints (Critical)

> **IMPORTANT**: A critical prerequisite for this pipeline is that all oRPC handlers must have explicit and **named** Zod schemas (i.e., `z.object({})`, not raw enums) for their inputs. This prevents "anonymous inline schema" issues that cause naming conflicts between Kubb plugins.

**Required Pattern**:

```typescript
// ❌ FORBIDDEN: Anonymous inline schemas
.input(z.enum(['a', 'b']))
.output(z.string())

// ✅ REQUIRED: Explicit named schemas
const MyInputSchema = z.object({
  status: z.enum(['active', 'inactive']),
});

.input(MyInputSchema)
.output(z.string())
```

**Why This Matters**:
- Kubb generates MSW handlers from OpenAPI spec
- Anonymous schemas produce conflicting names in generated code
- Named schemas ensure stable, predictable output

**Enforcement**: This is a coding convention that must be followed.

### 2.2 Kubb Configuration Philosophy: "Ugly but Robust"

**Decision**: Follow electron-shadcn's proven Kubb configuration.

```typescript
// kubb.config.ts
export default defineConfig({
  root: '.',
  input: { path: './test/mocks/openapi.json' },
  output: {
    path: './test/mocks/gen',
    clean: true,
    barrelType: 'named',
    extension: { '.ts': '' },  // Critical: removes .ts extension
  },
  plugins: [
    pluginOas({ validate: true }),
    pluginTs({ output: { path: 'types.ts', barrelType: false } }),
    pluginZod({ output: { path: 'zod' }, group: { type: 'tag' } }),
    pluginFaker({ output: { path: 'faker' }, group: { type: 'tag' } }),
    pluginMsw({ output: { path: 'msw' }, group: { type: 'tag' } }),
  ],
});
```

**Key Principles**:
1. **Treat `test/mocks/gen` as a black box** - Do not optimize or restructure
2. **Import from barrel exports** - Always import from `test/mocks/gen/index.ts`
3. **Use `barrelType: 'named'`** - Ensures predictable exports
4. **Set `extension: { '.ts': '' }`** - Generates specifier-bare paths

**Generated Files Management**:
- **Git**: Track `test/mocks/gen/` (commit generated files for reproducibility)
- **Biome**: Configure to ignore `test/mocks/gen/` (do NOT format/lint generated files)
- **Regenerate**: Run `pnpm kubb` before tests or in CI pre-test step

**Reference**: electron-shadcn `kubb.config.ts` (lines 38-44)

### 3. MSW Server Configuration

**Decision**: Central MSW server in `test/mocks/server.ts` with lifecycle management.

```typescript
// test/mocks/server.ts
import { setupServer } from 'msw/node';

// Generated handlers from Kubb
import { handlers } from './gen/msw';

export const server = setupServer(...handlers);
```

```typescript
// test/vitest.setup.ts
import { server } from './mocks/server';

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

**Reference**: electron-shadcn `test/mocks/server.ts`

### 4. ORPC Handler Integration Tests

**Decision**: Test handlers directly via `call()` with mocked context (NOT via HTTP + MSW).

```typescript
// src/features/ping/ping.integration.test.ts

import { call } from '@orpc/server';
import { pingRouter } from './main/router';

describe('pingRouter', () => {
  it('should return pong and publish to bus', async () => {
    const mockContext = {
      bus: { publish: vi.fn(), subscribe: vi.fn() },
      prefs: { get: vi.fn(), set: vi.fn(), has: vi.fn(), values: {} },
      secrets: { get: vi.fn(), set: vi.fn(), has: vi.fn(), keys: [] },
      db: { insert: vi.fn(), query: vi.fn() },
      ai: { insert: vi.fn(), search: vi.fn() },
    };

    const result = await call(pingRouter.sendPing, undefined, {
      context: mockContext,
    });

    expect(result).toBe('pong');
    expect(mockContext.bus.publish).toHaveBeenCalledWith('ping', 'pong');
  });
});
```

**Why Not HTTP + MSW**:
- Direct `call()` tests business logic without HTTP overhead
- MSW intercepts HTTP, which is only needed for **component tests** (testing React components making ORPC calls)
- Integration tests focus on handler behavior, not the HTTP transport layer

**MSW Use Case - Component Tests**:
```typescript
// Component tests USE MSW to mock HTTP layer:
import { server } from '@/test/mocks/server';
import { http, HttpResponse } from 'msw';

test('Versions component shows versions', async () => {
  server.use(
    http.post('http://localhost/rpc', () => {
      return HttpResponse.json({
        jsonrpc: '2.0',
        result: { node: '20', chrome: '120', electron: '30' },
        id: '1',
      });
    })
  );

  render(<Versions />);
  await waitFor(() => screen.getByText(/Electron/));
});
```

**Reference**: electron-shadcn `test/integration/theme-integration.spec.tsx`

### 5. Event Bus Unit Tests

**Decision**: Direct unit tests without MSW.

```typescript
// src/app/main/infra/bus.test.ts

import { bus } from './bus';

describe('EventBus', () => {
  it('should publish and subscribe to events', async () => {
    const data = { message: 'test' };
    const subscription = bus.subscribe('test-event');
    bus.publish('test-event', data);
    const result = await subscription.next();
    expect(result.value).toEqual(data);
  });
});
```

### 6. Storage Integration Tests

**Decision**: Use temporary files/in-memory for real storage behavior.

```typescript
// src/app/main/infra/storage/sqlite/sqlite.integration.test.ts

import { tmpdir } from 'os';
import { join } from 'path';
import { createSqlite } from '../index';

const tempDbPath = join(tmpdir(), `test-${Date.now()}.db`);

describe('SQLite', () => {
  it('should insert and query', async () => {
    const db = await createSqlite({ dbPath: tempDbPath });
    const id = db.insert('test', { name: 'test' });
    const rows = db.query('SELECT * FROM test');
    expect(rows).toHaveLength(1);
  });
});
```

## Test Layer Strategy

| Layer | Target | Mock Strategy | MSW Used? |
|-------|--------|---------------|-----------|
| **Unit** | Pure functions, Event Bus, Schemas, Storage (lazy init), ORPC Client, Context, Utils | Mock dependencies where needed | No |
| **Integration** | ORPC Handlers (not TanStack Router), Storage operations | Direct `call()` with mocked context | No |
| **Component** | Customized React components (in `src/app/renderer/components/`) | MSW HTTP interception at `http://localhost/rpc` | **Yes** |
| **E2E** | App startup, routing | Real environment | No |

## Test Coverage Principle

**"If it can be unit tested, it MUST be unit tested."**

All code that can be comprehensively tested via unit tests SHALL have unit test coverage. Integration tests, component tests, and E2E tests are reserved for what unit tests cannot cover:

- Unit tests cannot test: Electron APIs, file system operations, real storage
- Integration tests: Real ORPC handler behavior via MSW, real storage operations
- Component tests: React component rendering and user interactions
- E2E tests: Complete application flow (startup, routing, critical paths)

## Explicitly Excluded Items

The following are explicitly NOT tested:

| Item | Reason |
|------|--------|
| **TanStack Router** (`routes.ts`, `router.tsx`) | Router configuration, not unit tested |
| **Raw shadcn components** (`components/ui/*`) | Standard library components, not customized |
| **query-client.ts** | Simple QueryClient creation, no logic to test |
| **ORPC glue** (`orpc.ts`) | Framework glue code |
| **IPC setup** (`ipc.ts`) | Electron API dependent |
| **Preload scripts** | Thin wrappers |
| **Feature page components** (`ping/renderer/page.tsx`) | Will be refactored later |

## Kubb Configuration

Reference: electron-shadcn `kubb.config.ts`

```typescript
// kubb.config.ts
import { defineConfig } from '@kubb/core';

export default defineConfig({
  input: { path: './test/mocks/openapi.json' },
  output: { path: './test/mocks/gen' },
  plugins: [
    ['@kubb/plugin-oas', {}],
    ['@kubb/plugin-ts', {}],
    ['@kubb/plugin-zod', {}],
    ['@kubb/plugin-msw', {}],
    ['@kubb/plugin-faker', {}],
  ],
});
```

## E2E Testing Note

Per electron-shadcn design: E2E tests do NOT use MSW. They verify the complete integrated application with real communication.

```typescript
// test/e2e/app.e2e.test.ts
test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Electron/);
});
```

## MSW Handler Imports

Import generated MSW handlers from the barrel export:

```typescript
// test/mocks/server.ts
import { handlers } from './gen/msw';

// Integration tests use MSW handlers directly via client
import { client } from '@app/renderer/infra/client';
```

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Kubb setup complexity | Use electron-shadcn as reference |
| OpenAPI generation failures | Run `pnpm openapi:generate` before tests |
| HTTPRPCLink routing | Ensure correct URL structure for MSW |

## Test Coverage Targets

### Unit Tests (Must Have)

| Module | Target | Notes |
|--------|--------|-------|
| `src/app/main/infra/bus.ts` | 90% | EventBus publish/subscribe/abort |
| `src/shared/utils/format.ts` | 80% | Date formatting |
| `src/features/general/shared/contract.ts` | 80% | ✅ Done |
| `src/features/ping/shared/contract.ts` | 80% | 10 endpoints |
| `src/app/main/infra/preferences.ts` | 80% | Lazy initialization |
| `src/app/main/infra/secrets.ts` | 80% | Lazy initialization |
| `src/app/main/infra/storage/orama/index.ts` | 70% | OramaService methods |
| `src/app/main/context.ts` | 70% | getRuntimeContext/setRuntimeContext |
| `src/app/renderer/infra/client.ts` | 80% | Transport switching |
| `src/app/renderer/lib/utils.ts` | 80% | cn() function |

### Integration Tests

| Module | Target | Notes |
|--------|--------|-------|
| `src/features/*/main/router.ts` | 70% | Via MSW |
| `src/app/main/infra/storage/sqlite/` | 60% | :memory: mode |
| `src/app/main/infra/storage/orama/` | 60% | Real instance |

### Component Tests

| Module | Target | Notes |
|--------|--------|-------|
| `src/app/renderer/components/Versions.tsx` | 80% | Render + data display |

### E2E Tests

| Module | Target | Notes |
|--------|--------|-------|
| `test/e2e/*.ts` | Core paths | App startup, routing |
