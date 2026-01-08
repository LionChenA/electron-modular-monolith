# Specification: Architecture

## Purpose
Define the core architectural principles and structural requirements for the Electron Modular Monolith.
## Requirements

<!-- REQUIREMENTS:START -->
<!-- REQUIREMENTS:END -->

### Requirement: Project Structure
The application code MUST be organized into a Modular Monolith structure.

#### Scenario: Directory Layout
- **WHEN** the project is initialized
- **THEN** it MUST contain `src/app`, `src/features`, and `src/shared`
- **AND** `src/main` and `src/renderer` MUST reside within `src/app`

### Requirement: Shared Layer Constraints
The `shared` directory MUST act as a common dependency layer.

#### Scenario: No Upward Dependencies
- **WHEN** coding in `src/shared`
- **THEN** imports from `src/app` or `src/features` are FORBIDDEN


### Requirement: Dependency Injection (DI) Strategy
The application MUST use a Dual Context strategy to decouple Features from the Environment.

#### Scenario: Main Process Dependencies
- **WHEN** a Feature module needs external capabilities (e.g., Database, System Info)
- **THEN** it MUST define an interface in `main/types.ts` describing the dependency
- **AND** it MUST NOT import concrete implementations from `src/app` directly
- **AND** the dependency MUST be injected via the ORPC Context (`ctx`)

#### Scenario: Renderer Process Dependencies
- **WHEN** a UI component needs global state or capabilities
- **THEN** it MUST access them via React Hooks (e.g., `useOrpc`) provided by the Shell layer

### Requirement: Contract-First Communication
All cross-process communication MUST be defined by a shared contract before implementation.

#### Scenario: Defining a Procedure
- **WHEN** creating a new ORPC procedure
- **THEN** a Zod schema MUST be defined in `shared/contract.ts` first
- **AND** both Main and Renderer implementations MUST rely on this shared schema
