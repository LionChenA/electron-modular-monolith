# Tasks: Add Business Tests

## 1. Configure Test Transport (HTTPRPCLink)

- [x] 1.1 Install `@orpc/client/fetch` for HTTPRPCLink
- [x] 1.2 Update `src/app/renderer/infra/client.ts` to use HTTPRPCLink for tests
- [x] 1.3 Verify transport switching works (production: RPCLink, test: HTTPRPCLink)

Reference: `electron-shadcn/src/renderer/ipc/manager.ts`

## 2. Configure MSW Server

- [x] 2.1 Update `test/mocks/server.ts` with handlers from Kubb
- [x] 2.2 Update `test/vitest.setup.ts` to manage MSW lifecycle
- [x] 2.3 Verify MSW server starts and closes properly

Reference: `electron-shadcn/test/mocks/server.ts`

## 3. Generate OpenAPI Spec

- [x] 3.1 Run `pnpm openapi:generate` to create `test/mocks/openapi.json`
- [x] 3.2 Verify OpenAPI spec contains all feature routers (ping, general)
- [x] 3.3 OpenAPI spec post-processing adds tags based on operationId prefix
- [ ] 3.4 Add `openapi:generate` to CI pre-test step

Reference: `electron-shadcn/scripts/generate-openapi.ts`

## 3.5 Enforce Explicit Zod Schemas (Critical Prerequisite)

Before generating OpenAPI spec, all handlers MUST have explicit named Zod schemas.

- [x] 3.5.1 Audit all ORPC handlers in `src/features/*/main/router.ts`
- [x] 3.5.2 Add explicit `.output()` Zod schemas to every handler
- [x] 3.5.3 For handlers with input body, ensure schema is `z.object({})` not inline
- [x] 3.5.4 Verify no "anonymous schema" patterns (e.g., `z.enum()` as direct input)

Reference: `electron-shadcn/tasks.md` Phase 1, Step 2

## 4. Configure Kubb for MSW Generation

- [x] 4.1 Install Kubb packages:
  ```bash
  pnpm add -D @kubb/core @kubb/cli @kubb/plugin-oas @kubb/plugin-ts @kubb/plugin-zod @kubb/plugin-msw @kubb/plugin-faker
  ```
- [x] 4.2 Create `kubb.config.ts` at project root
- [x] 4.3 Run `pnpm kubb` to generate MSW handlers to `test/mocks/gen/`
- [x] 4.4 Verify handlers generated in `test/mocks/gen/msw/`
- [x] 4.5 Configure Biome to ignore `test/mocks/gen/` (add to `ignore` list)
- [x] 4.6 Ensure `test/mocks/gen/` is tracked by Git (NOT in .gitignore)

Reference: `electron-shadcn/kubb.config.ts`

## 5. Unit Tests: Event Bus

- [x] 5.1 Create `src/app/main/infra/bus.test.ts`
- [x] 5.2 Test publish functionality
- [x] 5.3 Test subscribe functionality
- [x] 5.4 Test abort signal handling
- [x] 5.5 Test multiple subscribers

## 6. Unit Tests: Shared Utils

- [x] 6.1 Review existing `src/shared/utils/format.test.ts`
- [x] 6.2 Add additional utility tests if needed

## 7. Unit Tests: Zod Contracts

- [x] 7.1 Create `src/features/general/shared/contract.test.ts`
- [x] 7.2 Test input validation
- [x] 7.3 Test error messages
- [x] 7.4 Test type inference

## 7.5 Unit Tests: Storage Layer

- [x] 7.5.1 Create `src/app/main/infra/storage/preferences.test.ts`
- [x] 7.5.2 Test lazy initialization (store created on first access)
- [x] 7.5.3 Test get/set/delete/has/keys methods
- [x] 7.5.4 Test clear and reset operations
- [x] 7.5.5 Create `src/app/main/infra/storage/secrets.test.ts`
- [x] 7.5.6 Test lazy initialization
- [x] 7.5.7 Test get/set/delete methods
- [x] 7.5.8 Test encryption/decryption behavior

## 7.6 Unit Tests: OramaService

- [x] 7.6.1 Create `src/app/main/infra/storage/orama/orama.test.ts`
- [x] 7.6.2 Test insert/update/remove methods
- [x] 7.6.3 Test search methods (search, searchVector, searchHybrid)
- [x] 7.6.4 Test ensureNotClosed error handling
- [x] 7.6.5 Test save and close operations

## 7.7 Unit Tests: ORPC Client

- [x] 7.7.1 Create `src/app/renderer/infra/client.test.ts`
- [x] 7.7.2 Test HTTPRPCLink is used when NODE_ENV=test
- [x] 7.7.3 Test RPCLink is used when NODE_ENV!=test

## 7.8 Unit Tests: Context

- [x] 7.8.1 Create `src/app/main/context.test.ts`
- [x] 7.8.2 Test getRuntimeContext throws when not initialized
- [x] 7.8.3 Test setRuntimeContext sets context correctly
- [x] 7.8.4 Test initializeContext error handling

## 7.9 Unit Tests: Renderer Utils

- [x] 7.9.1 Create `src/app/renderer/lib/utils.test.ts`
- [x] 7.9.2 Test cn() function (clsx + tailwind-merge)

## 7.10 Unit Tests: Ping Contract

- [x] 7.10.1 Skip - ORPC contracts are schema definitions, not runnable code
- [x] 7.10.2 Skip - Schema structure is determined by ORPC library
- [x] 7.10.3 Skip - Integration tests cover actual RPC behavior
- [x] 7.10.4 Skip - Type inference tested via TypeScript compilation

## 8. Integration Tests: ORPC Handlers (ping feature)

- [x] 8.1 Create `src/features/ping/ping.integration.test.ts`
- [x] 8.2 Test sendPing handler directly with mocked context
- [x] 8.3 Test getPreferences handler with mocked context
- [x] 8.4 Test setPreferences handler with mocked context
- [x] 8.5 Test storeApiKey handler with mocked context
- [x] 8.6 Test savePingToDb handler with mocked context
- [x] 8.7 Test getPingHistory handler with mocked context
- [x] 8.8 Test indexPing handler with mocked context
- [x] 8.9 Test searchPings handler with mocked context

## 9. Integration Tests: ORPC Handlers (general feature)

- [x] 9.1 Create `src/features/general/general.integration.test.ts`
- [x] 9.2 Test getVersions handler directly with mocked context
- [x] 9.3 Test getPlatform handler directly with mocked context

## 10. Integration Tests: Storage

- [x] 10.1 Create `src/app/main/infra/storage/sqlite/sqlite.integration.test.ts`
- [x] 10.2 Test SQLite insert and query operations
- [x] 10.3 Test SQLite update operation
- [x] 10.4 Test SQLite delete operation
- [x] 10.5 Create `src/app/main/infra/storage/orama/orama.integration.test.ts`
- [x] 10.6 Test Orama insert operation
- [x] 10.7 Test Orama search operation
- [x] 10.8 Test Orama update operation
- [x] 10.9 Test Orama delete operation

## 11. Component Tests

**Components are tested via Storybook stories (visual testing), NOT Vitest unit tests.**

- [x] 11.1 Components should be extracted as custom components first
- [x] 11.2 Create Storybook stories for visual testing
- [x] 11.3 Use `server.use()` for ORPC HTTP mocking in stories

**Note**: `src/app/renderer/components/Versions.test.tsx` exists but is deprecated.
Component tests should use Storybook stories, not Vitest.

## 12. E2E Tests

- [x] 12.1 Review existing `test/e2e/app.e2e.test.ts`
- [x] 12.2 Verify minimal coverage (app startup + routing)
- [x] 12.3 E2E tests do NOT use MSW (per design decision)
- [x] 12.4 E2E tests cover actual ORPC bridge transport layer
- [ ] 12.5 Run `pnpm test:e2e` - requires full app stack (dev server + Electron)

## 13. Verification

- [x] 13.1 Run `pnpm openapi:generate` - verify OpenAPI spec generated
- [x] 13.2 Run `pnpm kubb` - verify MSW handlers generated
- [x] 13.3 Run `pnpm test` - verify all unit/integration tests pass
- [x] 13.4 Run `pnpm test:component` - verify Storybook stories work
- [ ] 13.5 Run `pnpm test:e2e` - verify E2E tests pass
- [ ] 13.6 Generate coverage report
- [ ] 13.7 Verify coverage meets targets

## 14. Issues Resolved

### `undefinedController/` Prefix (FIXED)

**Solution**: Modified `scripts/generate-openapi.ts` to post-process the OpenAPI spec and add `tags` based on `operationId` prefix (e.g., `general.getVersions` → `tags: ["general"]`).

This avoids needing to change the ORPC router structure (which had TypeScript context compatibility issues).

### Debug Test Files (FIXED)

**Deleted**:
- `src/fetch-debug.test.ts`
- `src/app/main/fetch-debug.test.ts`
- `src/app/renderer/client-debug.test.tsx`

### Wrong Storybook File (FIXED)

**Deleted** `src/features/ping/Ping.stories.tsx` - it tested raw shadcn Card, not a custom component.

### Kubb MSW Handlers (ACKNOWLEDGED)

Kubb-generated MSW handlers intercept `/ping/sendPing` style URLs, not ORPC's `http://localhost/rpc`. Handlers are still useful for:
- Zod schema generation (`test/mocks/gen/zod/`)
- Faker data generation (`test/mocks/gen/faker/`)
- API documentation

For component tests needing HTTP mocking, use inline `server.use()`.

## 15. Component Extraction (Completed)

Components extracted from page.tsx and stories created:

- [x] Extract `PreferencesCard` from `page.tsx`
- [x] Extract `SecretsCard` from `page.tsx`
- [x] Extract `SQLiteCard` from `page.tsx`
- [x] Extract `OramaCard` from `page.tsx`
- [x] Create stories for each extracted component

### Notes on Storybook Testing

Stories are built successfully via `pnpm storybook:build`:
- `PreferencesCard.stories.tsx` ✅
- `SecretsCard.stories.tsx` ✅
- `SQLiteCard.stories.tsx` ✅
- `OramaSearchCard.stories.tsx` ✅

**`test:component` (Vitest addon)** has configuration issues due to:
- Browser mode setup complexity
- Vite/Rollup bundling conflicts
- Storybook Vitest addon version compatibility

Stories work via `pnpm storybook` (manual visual testing).

## 16. Fix test:component Vitest Integration (RESOLVED)

Fixed the following issues:

1. **Setup file import**: Changed from `@storybook/addon-vitest/vitest-plugin` to correct path in `.storybook/vitest.setup.ts`:
   ```typescript
   import { setProjectAnnotations } from '@storybook/react-vite';
   import * as previewAnnotations from './preview';
   setProjectAnnotations([previewAnnotations]);
   ```

2. **Vitest config plugin**: Changed from `react()` to `storybookTest()` in `vitest.config.ts`:
   ```typescript
   import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
   plugins: [storybookTest(), tsconfigPaths()],
   ```

3. **Preview providers**: Added `QueryClientProvider` decorator in `.storybook/preview.tsx`:
   ```typescript
   decorators: [
     (Story) => {
       const [queryClient] = useState(() => new QueryClient({...}));
       return <QueryClientProvider client={queryClient}><Story /></QueryClientProvider>;
     },
   ],
   ```

All 8 storybook component tests now pass via `pnpm test:component`.
