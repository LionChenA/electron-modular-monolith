# Common Testing Pitfalls

> [!NOTE]
> This document catalogs problems we have actually encountered during implementation, serving as a reference for future developers.

## Pitfalls

### 1. HTTPLink + MSW Cannot Intercept TanStack Query Component Tests

**Symptoms**:
```
Cannot destructure property 'signal' of 'undefined'
```

**Root Cause**:
- TanStack Query's `queryFn` requires a `QueryClient` execution context
- When Vitest runs component tests without a real `QueryClient`, the `queryFn` fails
- MSW intercepts HTTP at the network level, but the `queryFn` never reaches the HTTP layer

**Solution**:
- For component tests, use `vi.mock('@app/renderer/infra/client')` to mock the ORPC client
- Mock the `queryFn` return value directly
- Do NOT attempt to use MSW for component tests

**Incorrect**:
```typescript
// ❌ This does NOT work for TanStack Query components
import { server } from '../mocks/server';
import { http, HttpResponse } from 'msw';

test('Versions component', async () => {
  server.use(
    http.post('http://localhost/rpc', () => {
      return HttpResponse.json({ jsonrpc: '2.0', result: {...}, id: '1' });
    })
  );
  render(<Versions />);
});
```

**Correct**:
```typescript
// ✅ Use vi.mock for component tests
vi.mock('@app/renderer/infra/client', () => ({
  orpc: {
    general: {
      getVersions: {
        queryOptions: () => ({
          queryFn: () => Promise.resolve(mockVersions),
        }),
      },
    },
  },
}));
```

---

### 2. OpenAPI Tags Missing Causes `undefinedController` in Kubb

**Symptoms**:
- Kubb generates MSW handlers under `test/mocks/gen/msw/undefinedController/`
- Handler path looks like `/undefinedController/ping/sendPing`

**Root Cause**:
- OpenAPI spec has no `tags` field on operations
- Kubb groups by tags, defaults to `undefinedController` when missing

**Solution**:
- Use `os.tag('featureName')` in router definition
- Post-process OpenAPI spec to add tags based on operationId prefix

**Required Router Pattern**:
```typescript
// ✅ Correct
export const router = os.router({
  general: os.tag('general').router(generalRouter),
  ping: os.tag('ping').router(pingRouter),
});

// ❌ Wrong
export const router = { general: generalRouter, ping: pingRouter };
```

**OpenAPI Post-Processing (if os.tag unavailable)**:
```typescript
// scripts/generate-openapi.ts
spec.paths[path].post.tags = [operationId.split('.')[0]];
```

---

### 3. Native Module Version Mismatch (better-sqlite3)

**Symptoms**:
- `better-sqlite3` fails to load in Vitest
- Error: `NODE_MODULE_VERSION mismatch`

**Root Cause**:
- Electron uses a different Node.js version (NODE_MODULE_VERSION 140)
- Vitest runs in standard Node.js (NODE_MODULE_VERSION 115)
- Native modules are compiled for specific versions

**Solution**:
- Use `vi.mock('better-sqlite3')` in tests
- For real SQLite testing, use `:memory:` mode in local dev
- Accept that CI cannot run real SQLite integration tests

**Example**:
```typescript
// sqlite.integration.test.ts
vi.mock('better-sqlite3', () => {
  return {
    default: MockBetterSQLite3,
  };
});
```

---

### 4. Missing Context Initialization in Integration Tests

**Symptoms**:
```
Error: Context not initialized. Call setRuntimeContext() first.
```

**Root Cause**:
- ORPC handlers require context (bus, prefs, secrets, db, ai)
- Integration tests must set up context before calling handlers

**Solution**:
- Always call `setRuntimeContext(mockContext)` in `beforeEach`
- Clear mocks in `afterEach`

**Correct Pattern**:
```typescript
describe('pingRouter', () => {
  let mockContext: MockContext;

  beforeEach(() => {
    mockContext = createMockContext();
    setRuntimeContext(mockContext as any); // ⚠️ Required!
  });

  afterEach(() => {
    vi.clearAllMocks();
  });
});
```

---

### 5. Anonymous Zod Schemas Cause Kubb Naming Conflicts

**Symptoms**:
- Kubb generates TypeScript with duplicate identifiers
- Compilation errors in generated files

**Root Cause**:
- Anonymous inline schemas (e.g., `.input(z.enum(['a', 'b']))`) produce unnamed types
- Kubb generates code with conflicting names

**Solution**:
- Always use named schemas
- Define schemas at module level with descriptive names

**Correct Pattern**:
```typescript
// ✅ Named schema
const SendPingInputSchema = z.object({
  message: z.string(),
  timestamp: z.number(),
});

const SendPingOutputSchema = z.object({
  id: z.number(),
});

.handler(
  os.handler()
    .input(SendPingInputSchema)
    .output(SendPingOutputSchema)
    .resolve(async ({ input }) => { ... })
);

// ❌ Anonymous schema
.handler(
  os.handler()
    .input(z.object({ message: z.string(), timestamp: z.number() }))
    .output(z.object({ id: z.number() }))
    .resolve(async ({ input }) => { ... })
);
```

---

### 6. Debug Files Left in Codebase

**Symptoms**:
- Files like `fetch-debug.test.ts` remain after exploration
- Clutters the repository

**Root Cause**:
- No clear boundary between exploration and implementation
- Temporary test files not tracked

**Solution**:
- Delete debug files before committing
- Use `*.debug.test.ts` naming convention if needed temporarily
- Never commit exploration files

**Prevention**:
- Review git status before committing
- Use `.gitignore` for test artifacts (`test-results/`, etc.)