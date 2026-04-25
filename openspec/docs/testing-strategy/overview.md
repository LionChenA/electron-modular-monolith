# Testing Strategy Overview

> [!NOTE]
> This document is the project's "compressed cache" of knowledge for **Testing Strategy in the Modular Monolith Electron Application**.

## 1. Overview

This project uses a **layered testing strategy** with four distinct test types, each serving a specific purpose and using appropriate tooling.

## 2. Test Layers

### 2.1 Unit Tests

**Purpose**: Test pure functions and isolated modules in complete isolation.

**Tool**: Vitest with `vi.mock()` for dependencies

**Target**:
- Event Bus logic
- Utility functions (format, cn)
- Zod schema validation
- Storage service logic (preferences, secrets, OramaService)
- Context initialization
- ORPC client transport switching

**Characteristics**:
- No external dependencies (database, file system)
- Fast execution
- Mock all side effects

### 2.2 Integration Tests

**Purpose**: Test how components work together, specifically ORPC handlers with real infrastructure.

**Tool**: Vitest with direct `call()` to handlers

**Target**:
- ORPC handlers (ping, general features)
- Storage operations (SQLite, Orama)
- Context-dependent logic

**Characteristics**:
- Uses `call()` from `@orpc/server` to invoke handlers directly
- Mocks context dependencies (bus, prefs, secrets, db, ai)
- Does NOT go through HTTP stack
- Requires `setRuntimeContext()` before each test

### 2.3 Component Tests

**Purpose**: Test React component rendering and user interactions.

**Tool**: Vitest + Storybook + `vi.mock()` for ORPC client

**Target**:
- Custom React components (Versions, PreferencesCard, etc.)
- Component logic with TanStack Query integration

**Characteristics**:
- Mock `orpc` client with `vi.mock()`
- TanStack Query `queryFn` returns are mocked
- Visual testing via Storybook stories

### 2.4 E2E Tests

**Purpose**: Verify the complete application works in a real environment.

**Tool**: Playwright

**Target**:
- App startup
- Window creation
- Routing
- Critical user flows

**Characteristics**:
- No mocking - real application
- Full Electron + React stack
- Slowest execution

## 3. Tool-to-Target Mapping

| Test Target | Tool | Why |
|-------------|------|-----|
| Handler logic (cross-process) | `call()` + vi.mock context | Direct invocation, no HTTP |
| Handler HTTP transport | HTTPLink + MSW | Mock client HTTP requests |
| TanStack Query components | vi.mock ORPC client | Mock queryFn returns |
| Pure utility functions | Vitest + vi.mock | Complete isolation |
| Storage operations | `call()` with mocked infra | Test real behavior |
| E2E (full stack) | Real app + Playwright | Verify everything works |

## 4. Architecture Diagram

```
Renderer                    Main Process
   │                          │
   │─ TanStack Query ───────►│─ Business Handlers
   │    │                        │
   │    │ vi.mock queryFn       │
   │                          │
   │─ HTTPLink + MSW ───────►│─ ORPC HTTP Adapter
   │    │ (HTTP mock)          │
   │                          │
   │─ RPCLink ───────────────►│─ ORPC MessagePort Adapter
   │    │ (production)         │
```

## 5. MSW Role

**MSW (Mock Service Worker)** intercepts HTTP requests at the network layer. It is used for:

- Mocking ORPC HTTP responses in integration tests
- Testing the HTTP transport layer of ORPC

**MSW is NOT for**:
- TanStack Query component tests (use `vi.mock()` instead)
- Unit tests (use `vi.mock()` instead)
- Direct handler logic tests (use `call()` instead)

## 6. Key Principles

1. **Test at the lowest appropriate layer** - Don't test handler logic through HTTP when you can use `call()` directly.

2. **Mock at the boundary** - Mock external dependencies (database, file system, network) but test real business logic.

3. **Context initialization** - Integration tests MUST call `setRuntimeContext()` in `beforeEach`.

4. **Native modules** - Native Node.js modules (like `better-sqlite3`) may not work across environments. Use `vi.mock()` when needed.

5. **Debug files** - Delete temporary exploration files before committing. Never leave `*.debug.test.ts` files in the codebase.