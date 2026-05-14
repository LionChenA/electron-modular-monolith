# Specification: E2E Electron Testing

## Purpose

Define requirements for end-to-end testing using Playwright.

## Requirements

### Requirement: App Startup Test

The application SHALL have a basic E2E test that verifies successful startup.

#### Scenario: App window opens successfully
- **WHEN** The Electron app is launched
- **THEN** A window is created and visible
- **AND** No JavaScript errors occur in the main process

#### Scenario: App renders without errors
- **WHEN** The Electron app is launched
- **THEN** The renderer process loads without console errors
- **AND** The page content is visible

### Requirement: Routing Test

The application SHALL have E2E tests that verify basic routing works.

#### Scenario: Default route loads
- **WHEN** The app opens the default route
- **THEN** The correct page component is rendered

#### Scenario: Route navigation works
- **WHEN** Navigation to a different route occurs
- **THEN** The URL changes to the expected route
- **AND** The correct page component is rendered

### Requirement: Minimal Coverage

E2E tests SHALL focus on critical paths only.

#### Scenario: E2E tests are limited in scope
- **WHEN** Planning E2E test coverage
- **THEN** Focus on: app startup, window creation, initial render
- **AND** Do NOT test every user interaction or workflow
- **AND** Leave detailed interaction tests to integration tests

### Requirement: Playwright Installation and Configuration
The project SHALL have Playwright installed and configured for E2E testing.

#### Scenario: Playwright dependencies are installed
- **WHEN** `pnpm add -D @playwright/test playwright` is executed
- **THEN** Playwright packages appear in package.json devDependencies

#### Scenario: Playwright browsers are available
- **WHEN** `npx playwright install` is executed
- **THEN** Chromium, Firefox, and WebKit browsers are downloaded

### Requirement: Playwright Configuration
Playwright SHALL be configured to work with the Electron application.

#### Scenario: playwright.config.ts exists
- **WHEN** Playwright configuration file is created
- **THEN** It defines test directory, projects, and options

#### Scenario: E2E tests are in separate directory
- **WHEN** Test files matching `*.e2e.test.ts` exist in test/e2e/
- **THEN** These tests are excluded from Vitest via configuration

### Requirement: E2E Test Execution

E2E tests SHALL be executable via npm scripts and CI/CD pipelines.

#### Scenario: pnpm test:e2e runs Playwright tests
- **WHEN** `pnpm test:e2e` is executed
- **THEN** Playwright discovers and runs E2E tests
- **AND** Tests run against the built application

#### Scenario: E2E tests work in CI
- **WHEN** E2E tests run in a CI environment
- **THEN** They use headless browser mode
- **AND** They handle environment-specific configurations

#### Scenario: pnpm test:all runs all tests
- **WHEN** `pnpm test:all` command is executed
- **THEN** First Vitest runs, then Playwright E2E tests run sequentially

### Requirement: E2E Test Naming Convention
E2E tests SHALL follow the naming pattern `{name}.e2e.test.ts`.

#### Scenario: E2E test files are discoverable
- **WHEN** Test files match the pattern `**/*.e2e.test.ts`
- **THEN** Playwright discovers and runs these tests

### Requirement: E2E Testing Scope

E2E tests SHALL focus on critical user workflows and interactions.

#### Scenario: E2E tests cover core infrastructure
- **WHEN** E2E tests are written
- **THEN** They SHOULD focus on core features: storage, IPC, routing

#### Scenario: E2E tests are limited in scope
- **WHEN** Planning E2E test coverage
- **THEN** Focus on: app startup, window creation, initial render
- **AND** Do NOT test every user interaction or workflow
- **AND** Leave detailed interaction tests to integration tests

### Requirement: Namespace Isolation Between Test Runners
Vitest and Playwright SHALL NOT interfere with each other's global APIs.

#### Scenario: Vitest excludes E2E directory
- **WHEN** Vitest configuration excludes `**/test/e2e/**`
- **THEN** Playwright test files are not executed by Vitest

#### Scenario: Playwright runs in separate process
- **WHEN** `pnpm test:e2e` is executed
- **THEN** Playwright runs in its own Node.js process with isolated globals
