## ADDED Requirements

### Requirement: Virtual File-Based Routing
The application MUST use a virtual file-based routing system to decouple URL structure from the physical file structure.

#### Scenario: Decoupled Route Mapping
- **GIVEN** a feature component located at `src/features/<feature>/renderer/page.tsx`
- **WHEN** the application is built
- **THEN** the routing system MUST map a URL path (e.g., `/<feature>`) to this component via a virtual configuration file
- **AND** the system MUST NOT require moving the file to a specific `routes/` or `pages/` directory

#### Scenario: Type-Safe Route Generation
- **WHEN** the virtual route configuration is modified
- **THEN** the system MUST automatically generate TypeScript definitions for the route tree
- **AND** these definitions MUST provide compile-time safety for all route paths and parameters

### Requirement: Centralized Virtual Configuration
The application MUST maintain a single source of truth for URL-to-File mappings to ensure global visibility of the application structure.

#### Scenario: Route Registration
- **WHEN** a developer adds a new page to the application
- **THEN** they MUST register the path mapping in the virtual configuration file (`src/app/renderer/routes.ts`)
- **AND** they MUST NOT rely on implicit file-system scanning

### Requirement: Shared Routing Facade
Features MUST use the Shared Facade for all routing definitions to enforce architectural boundaries and ensure consistent configuration.

#### Scenario: Defining Feature Routes
- **GIVEN** a feature needs to expose a route (e.g., in a local route configuration file)
- **WHEN** the developer defines the route
- **THEN** they MUST use the `defineFeatureRoute` utility from `@shared/routing`
- **AND** they MUST NOT directly import routing primitives (e.g., `createRoute`, `createFileRoute`) from the underlying library

### Requirement: Type-Safe Navigation
All navigation between features MUST utilize type-safe constructs to prevent broken links and ensure refactoring safety.

#### Scenario: Cross-Feature Linking
- **GIVEN** a component in one feature needs to link to a page in another feature
- **WHEN** the developer implements the navigation link
- **THEN** they MUST use the type-safe `Link` component or `useNavigate` hook from `@shared/routing`
- **AND** they MUST NOT use hardcoded URL strings (e.g., `<a href="/target">`) or untyped navigation calls

### Requirement: Feature Route Isolation
Feature routes MUST be loaded lazily and defined without leaking internal implementation details to the application shell.

#### Scenario: Lazy Loading Routes
- **WHEN** a feature route is registered in the application
- **THEN** the route's component code MUST be lazy-loaded (code-split)
- **AND** the main application bundle MUST NOT increase significantly in size
