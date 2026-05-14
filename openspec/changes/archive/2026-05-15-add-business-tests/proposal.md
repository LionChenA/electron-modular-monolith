## Why

The project has a testing infrastructure (`add-test-infrastructure`) but lacks comprehensive business code coverage. As the Modular Monolith grows, maintaining reliability requires:

- **Regression protection** - Prevent breaking existing functionality
- **Documentation through tests** - Make code intent clear
- **TDD enablement** - Define behavior through tests
- **CI quality gates** - Require tests to pass before merging

## What Changes

- **Unit tests**: Event Bus, Shared Utils, Zod Contracts, Storage (preferences, secrets, orama), ORPC Client, Context, Renderer Utils
- **Integration tests**: ORPC Handlers via direct `call()` with mocked context (NOT HTTP)
- **Component tests**: React components (Versions) with MSW HTTP interception
- **E2E tests**: Minimal coverage (app startup + routing)
- **MSW infrastructure**: OpenAPI spec generation + Kubb MSW handler generation

## MSW Usage Clarification

**Important**: MSW is used for **component tests** (intercepting HTTP calls from React components), NOT for integration tests of ORPC handlers.

| Test Type | Testing Method | MSW Used? |
|-----------|---------------|-----------|
| **Unit** | Direct function calls with mocks | No |
| **Integration** | Direct `call()` to handlers with mocked context | No |
| **Component** | React component + MSW HTTP interception | **Yes** |
| **E2E** | Real app (no mocking) | No |

MSW intercepts HTTP requests at `http://localhost/rpc` when components use `HTTPRPCLink` in test environment.

## Capabilities

### New Capabilities

- `unit-testing`: Vitest-based unit tests for pure functions and modules
- `integration-testing`: Vitest-based integration tests with MSW-mocked ORPC
- `e2e-testing`: Playwright-based minimal end-to-end tests
- `openapi-generation`: Generate OpenAPI spec from ORPC routers
- `kubb-msw`: Generate MSW handlers from OpenAPI spec

### Modified Capabilities

- `communication`: Add ORPC handler test coverage via MSW
- `preferences-storage`: Add integration test coverage
- `secure-storage`: Add integration test coverage
- `sqlite-database`: Add integration test coverage
- `ai-search`: Add integration test coverage

## Impact

### Code Changes

- New test files in `src/app/main/infra/`, `src/features/*/`
- `test/mocks/gen/` - Kubb-generated MSW handlers (git tracked, biome ignored)
- `scripts/generate-openapi.ts` - Already exists
- `kubb.config.ts` - New Kubb configuration

### Dependencies

New dependencies:
- `@kubb/core`, `@kubb/cli`
- `@kubb/plugin-oas`, `@kubb/plugin-ts`, `@kubb/plugin-zod`
- `@kubb/plugin-msw`, `@kubb/plugin-faker`

Existing dependencies:
- `vitest`, `@vitest/ui`, `@vitest/coverage-v8`
- `@testing-library/react`, `@testing-library/jest-dom`
- `@playwright/test`, `msw`

### Related Proposals

| Proposal | Relationship |
|----------|--------------|
| `add-test-infrastructure` | Foundation - testing framework already set up |
| `add-storage-layer` | Storage modules are test targets |
| `add-orpc-infrastructure` | ORPC handlers are test targets |
| `specs/communication` | Defines ORPC + Event Bus patterns to test |
| `specs/architecture` | Defines Modular Monolith structure |
| `electron-shadcn/msw-integration` | Reference design for Kubb + MSW approach |

## ORPC Router Requirement

**Critical**: To generate proper OpenAPI tags for Kubb grouping, ORPC routers MUST use `os.tag()`:

```typescript
// ❌ FORBIDDEN: Plain object (no OpenAPI tags)
export const router = { general: generalRouter, ping: pingRouter };

// ✅ REQUIRED: os.tag() for OpenAPI tag generation
export const router = os.router({
  general: os.tag('general').router(generalRouter),
  ping: os.tag('ping').router(pingRouter),
});
```

Without `os.tag()`, OpenAPI generation produces no `tags` field, causing Kubb to use `"undefinedController"` as the group name.

Reference: `electron-shadcn/src/main/ipc/router.ts`
