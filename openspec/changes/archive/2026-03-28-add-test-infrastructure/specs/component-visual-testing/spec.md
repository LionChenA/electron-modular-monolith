# Component Visual Testing Specification

## Overview

This specification defines the requirements for component visual testing using Storybook in the Electron Modular Monolith application.

## ADDED Requirements

### Requirement: Storybook Installation and Configuration
The project SHALL have Storybook installed and configured to work with React and Vite.

#### Scenario: Storybook dependencies are installed
- **WHEN** Storybook packages are installed via `pnpm add -D storybook @storybook/react-vite @storybook/addon-vitest @storybook/addon-essentials @storybook/addon-a11y`
- **THEN** Storybook and related packages appear in package.json devDependencies

#### Scenario: Storybook can start in development mode
- **WHEN** `pnpm storybook` command is executed
- **THEN** Storybook starts on port 6006 with the configured stories

### Requirement: Storybook Configuration for Electron
Storybook SHALL be configured to work with the Modular Monolith renderer structure.

#### Scenario: .storybook/main.ts defines stories patterns
- **WHEN** Storybook configuration specifies story file patterns
- **THEN** Storybook discovers all `*.stories.tsx` files in src/

#### Scenario: .storybook/preview.tsx configures React preview
- **WHEN** Storybook preview imports necessary providers
- **THEN** Stories render with proper React context and routing

### Requirement: Storybook-Vitest Integration
Storybook SHALL be integrated with Vitest for component testing.

#### Scenario: @storybook/addon-vitest is configured
- **WHEN** Vitest workspace includes the storybook project
- **THEN** Stories can be tested using Vitest with browser mode

#### Scenario: Stories can run as Vitest tests
- **WHEN** `pnpm test:component` is executed
- **THEN** Storybook stories are executed as Vitest tests in browser

### Requirement: Component Testing Scope
Component tests SHALL focus on custom and customized shadcn components.

#### Scenario: Custom components have stories
- **WHEN** A component is created in src/app/renderer/components/ or src/features/*/
- **THEN** A corresponding `*.stories.tsx` file SHOULD be created

#### Scenario: Raw shadcn components are not tested by default
- **WHEN** Testing resources are limited
- **THEN** Raw shadcn components (Button, Input, etc.) without customization MAY be skipped

### Requirement: Accessibility Testing
Storybook SHALL have accessibility addon configured.

#### Scenario: @storybook/addon-a11y is enabled
- **WHEN** Storybook runs with a11y addon
- **THEN** Each story shows accessibility violations in the addon panel
