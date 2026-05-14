# Specification: E2E Testing

## Overview

This specification defines the minimal requirements for end-to-end tests in the Electron Modular Monolith application.

## Related Specs

- `specs/e2e_electron_testing/spec.md`

## ADDED Requirements

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
