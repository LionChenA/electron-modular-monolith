# Specification: Unit and Integration Testing

## Purpose

Define requirements for unit and integration testing infrastructure using Vitest.

## ADDED Requirements

### Requirement: Vitest Installation and Configuration
The project SHALL have Vitest installed as a dev dependency and properly configured to work with the electron-vite project structure.

#### Scenario: Vitest dependencies are installed
- **WHEN** `pnpm add -D vitest @vitest/ui @vitest/coverage-v8 @vitest/browser @vitest/browser-playwright` is executed
- **THEN** Vitest and related packages appear in package.json devDependencies

#### Scenario: Vitest can run unit tests
- **WHEN** `pnpm test` command is executed
- **THEN** Vitest discovers and runs tests matching the configured patterns

### Requirement: Vitest Workspace Isolation
Vitest SHALL be configured with workspaces to separate different test environments (renderer, main, storybook).

#### Scenario: Renderer workspace runs in jsdom
- **WHEN** Vitest runs with the renderer project configuration
- **THEN** tests execute in jsdom environment with React testing support

#### Scenario: Main workspace runs in Node.js
- **WHEN** Vitest runs with the main project configuration
- **THEN** tests execute in node environment for main process and shared code

#### Scenario: Storybook workspace runs in browser
- **WHEN** Vitest runs with the storybook project configuration
- **THEN** tests execute in a real Chromium browser via Playwright

### Requirement: Test File Organization
Test files SHALL follow the Modular Monolith architecture with proper naming conventions.

#### Scenario: Unit tests are co-located with source
- **WHEN** a test file named `{name}.test.ts` exists next to its source file
- **THEN** Vitest discovers and runs the test

#### Scenario: Integration tests use .integration.test.ts suffix
- **WHEN** a test file named `{name}.integration.test.ts` exists
- **THEN** Vitest discovers and runs the test as an integration test

#### Scenario: E2E tests are excluded from Vitest
- **WHEN** Vitest configuration excludes `**/test/e2e/**`
- **THEN** Playwright E2E tests do not run with Vitest

### Requirement: MSW Integration for IPC Mocking
The project SHALL have MSW configured to mock ORPC/IPC calls in integration tests.

#### Scenario: MSW server can be started in tests
- **WHEN** `test/vitest.setup.ts` imports and starts the MSW server
- **THEN** HTTP requests can be intercepted by MSW handlers

#### Scenario: ORPC IPC calls can be mocked
- **WHEN** integration tests need to mock IPC responses
- **THEN** vi.mock() can intercept the IPC manager calls

### Requirement: Test Coverage Infrastructure
The project SHALL have coverage reporting configured but not enforced.

#### Scenario: Coverage can be generated
- **WHEN** `pnpm vitest --coverage` is executed
- **THEN** a coverage report is generated in text/HTML format

### Requirement: Testing Library Support
The project SHALL have React Testing Library and related utilities installed.

#### Scenario: @testing-library/react is available
- **WHEN** Component tests use `render()` from testing-library
- **THEN** React components can be tested in jsdom environment

#### Scenario: @testing-library/jest-dom is configured
- **WHEN** Vitest setup imports jest-dom matchers
- **THEN** tests can use DOM matchers like `toBeInTheDocument()`

#### Scenario: @testing-library/user-event is available
- **WHEN** Tests simulate user interactions
- **THEN** userEvent.setup() provides realistic user behavior simulation
