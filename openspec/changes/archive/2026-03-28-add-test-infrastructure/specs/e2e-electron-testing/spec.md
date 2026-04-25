# End-to-End Testing Specification

## Overview

This specification defines the requirements for end-to-end testing using Playwright in the Electron Modular Monolith application.

## ADDED Requirements

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
E2E tests SHALL be executable via npm scripts.

#### Scenario: pnpm test:e2e runs Playwright tests
- **WHEN** `pnpm test:e2e` command is executed
- **THEN** Playwright discovers and runs E2E tests

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

#### Scenario: E2E tests do not test every UI component
- **WHEN** Planning E2E test coverage
- **THEN** UI showcase and demo components are lower priority

### Requirement: Namespace Isolation Between Test Runners
Vitest and Playwright SHALL NOT interfere with each other's global APIs.

#### Scenario: Vitest excludes E2E directory
- **WHEN** Vitest configuration excludes `**/test/e2e/**`
- **THEN** Playwright test files are not executed by Vitest

#### Scenario: Playwright runs in separate process
- **WHEN** `pnpm test:e2e` is executed
- **THEN** Playwright runs in its own Node.js process with isolated globals
