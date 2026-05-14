# Specification: Unit Testing

## Overview

This specification defines the requirements for unit tests in the Electron Modular Monolith application.

**Core Principle**: "If it can be unit tested, it MUST be unit tested." Unit tests are the foundation of the test pyramid and should cover as much code as possible.

## Related Specs

- `specs/unit_integration_testing/spec.md`
- `specs/communication/spec.md`

## Explicitly Excluded

The following are NOT tested by unit tests:

| Item | Reason |
|------|--------|
| TanStack Router (`routes.ts`, `router.tsx`) | Router configuration, not unit tested |
| Raw shadcn components (`components/ui/*`) | Standard library, not customized |
| query-client.ts | Simple QueryClient creation |
| ORPC glue (`orpc.ts`) | Framework glue code |
| IPC setup (`ipc.ts`) | Electron API dependent |
| Feature page components | Page components are wiring only - no logic to test |
| **Component UI logic** | Components are thin wrappers; logic should be extracted to hooks/services and tested there |

## Component Testing Strategy

Components are tested via **Storybook stories** (visual testing), NOT via Vitest unit tests.

**Why?**
- Storybook stories provide visual documentation
- Stories can be manually verified in browser
- Components should be thin wrappers around hooks/services

**How to test components:**
1. If component has complex logic → extract to custom hook → test hook with Vitest
2. If component needs visual verification → create Storybook story
3. If component uses ORPC/HTTP → use `server.use()` in story to mock

**Example testable component structure:**
```
src/features/ping/renderer/
├── components/
│   └── PreferencesCard.tsx    # Custom component (needs story)
│   └── PreferencesCard.stories.tsx  # Visual test via Storybook
├── hooks/
│   └── usePreferences.ts       # Logic extracted (test with Vitest)
└── page.tsx                   # Wiring only (no test)
```

## Unit Test Coverage Requirements

### Requirement: Unit Test Files

All code that can be comprehensively unit tested SHALL have unit test coverage.

#### Unit Tests to Implement

| File | Test Coverage | Key Test Cases |
|-------|---------------|----------------|
| `src/app/main/infra/bus.ts` | 90% | publish, subscribe, abort, multiple subscribers |
| `src/shared/utils/format.ts` | 80% | date formatting, edge cases |
| `src/features/general/shared/contract.ts` | 80% | schema validation, type inference |
| `src/features/ping/shared/contract.ts` | 80% | 10 endpoint schemas |
| `src/app/main/infra/storage/preferences.ts` | 80% | lazy init, get/set/delete/has/keys/clear/reset |
| `src/app/main/infra/storage/secrets.ts` | 80% | lazy init, get/set/delete, encryption |
| `src/app/main/infra/storage/orama/index.ts` | 70% | OramaService methods, error handling |
| `src/app/main/context.ts` | 70% | getRuntimeContext/setRuntimeContext |
| `src/app/renderer/infra/client.ts` | 80% | transport switching |
| `src/app/renderer/lib/utils.ts` | 80% | cn() function |

### Requirement: Event Bus Unit Tests

The Event Bus module SHALL have comprehensive unit test coverage.

#### Scenario: Publish sends data to subscriber
- **WHEN** `bus.publish('event', data)` is called
- **THEN** A subscriber receives the data via `bus.subscribe('event')`

#### Scenario: Multiple subscribers receive the same event
- **WHEN** Multiple subscribers listen to the same event
- **AND** The event is published
- **THEN** Each subscriber receives the data

#### Scenario: Abort signal terminates subscription
- **WHEN** A subscriber is created with an AbortSignal
- **AND** The signal is aborted
- **THEN** The subscription terminates with `{ done: true }`

#### Scenario: Subscribe to non-existent event
- **WHEN** A subscriber listens to an event that is never published
- **AND** The subscription is cancelled
- **THEN** The subscription terminates gracefully

### Requirement: Shared Utils Unit Tests

All pure utility functions SHALL have unit test coverage.

#### Scenario: Format utility functions
- **WHEN** A format function is called with valid input
- **THEN** It returns the expected formatted output

#### Scenario: Format utility with edge cases
- **WHEN** A format function is called with null/undefined/empty values
- **THEN** It handles gracefully without throwing

### Requirement: Zod Contract Unit Tests

All Zod schemas in feature contracts SHALL have validation test coverage.

#### Scenario: Valid input passes validation
- **WHEN** Valid data is passed to `schema.parse()`
- **THEN** The parse succeeds and returns typed data

#### Scenario: Invalid input fails validation
- **WHEN** Invalid data is passed to `schema.parse()`
- **THEN** A ZodError is thrown with descriptive error message

#### Scenario: Missing required fields
- **WHEN** Required fields are missing from input
- **THEN** The error indicates which field is missing

#### Scenario: Type inference works correctly
- **WHEN** A schema is used to infer a TypeScript type
- **THEN** The inferred type matches the expected shape

### Requirement: Storage Layer Unit Tests

Storage modules with complex logic SHALL have unit test coverage.

#### Scenario: Preferences lazy initialization
- **WHEN** preferences module is first imported
- **THEN** No store is created yet
- **WHEN** preferences.get() is called
- **THEN** Store is created on first access

#### Scenario: Preferences get/set/delete operations
- **WHEN** preferences.set() is called
- **THEN** The value is stored correctly
- **WHEN** preferences.get() is called with the same key
- **THEN** The stored value is returned
- **WHEN** preferences.delete() is called
- **THEN** The value is removed

#### Scenario: Secrets lazy initialization
- **WHEN** secrets module is first imported
- **THEN** No store or encryption is initialized yet
- **WHEN** secrets.get() is called
- **THEN** Store and encryption are initialized on first access

#### Scenario: OramaService methods
- **WHEN** OramaService methods are called after initialization
- **THEN** They correctly delegate to Orama instance

#### Scenario: OramaService error handling
- **WHEN** OramaService method is called after close()
- **THEN** An error is thrown indicating the service is closed

### Requirement: Context Unit Tests

Context initialization and access SHALL have unit test coverage.

#### Scenario: getRuntimeContext throws when not initialized
- **WHEN** getRuntimeContext() is called before initialization
- **THEN** An error is thrown

#### Scenario: setRuntimeContext sets context
- **WHEN** setRuntimeContext() is called with a valid context
- **THEN** getRuntimeContext() returns that context

### Requirement: ORPC Client Unit Tests

ORPC client transport switching SHALL have unit test coverage.

#### Scenario: HTTPRPCLink used in test environment
- **WHEN** NODE_ENV is 'test'
- **THEN** HTTPRPCLink is used for ORPC client

#### Scenario: RPCLink used in production
- **WHEN** NODE_ENV is not 'test'
- **THEN** RPCLink is used for ORPC client

### Requirement: Renderer Utils Unit Tests

Pure utility functions in renderer SHALL have unit test coverage.

#### Scenario: cn() function combines clsx and tailwind-merge
- **WHEN** cn() is called with class names
- **THEN** It returns combined and deduplicated tailwind classes
