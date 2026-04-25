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

### Requirement: Virtual File-Based Routing
The application MUST use a virtual file-based routing system to decouple URL structure from the physical file structure.

> **See**: [TanStack Router Virtual Routes Guide](../../docs/tanstack-router/virtual-routes.md)

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

### Requirement: Virtual Route Definition API
The virtual route configuration MUST use the DSL functions from `@tanstack/virtual-file-routes` to define routes.

#### Scenario: Available Route Types
- **WHEN** defining routes in `routes.ts`
- **THEN** use the appropriate function:
  - `rootRoute(file, children?)` - Root route wrapper
  - `index(file)` - Index route (matched exactly at parent path)
  - `route(path, file, children?)` - Regular route with URL path
  - `layout(file, children?)` - Pathless layout route for grouping
  - `physical(path, directory)` - Mount a directory of physical file routes

#### Scenario: Index Route Path Convention
- **GIVEN** a route component file
- **WHEN** the route is an index (renders at parent path exactly)
- **THEN** use trailing slash in `createFileRoute`: `createFileRoute('/posts/')`
- **AND** use `index('posts-index.tsx')` in virtual config

#### Scenario: Dynamic Route Segments
- **GIVEN** a route with dynamic parameters (e.g., `/posts/$postId`)
- **WHEN** defining the route
- **THEN** prefix the parameter with `$`: `route('/posts/$postId', 'posts-detail.tsx')`
- **AND** access params via `Route.useParams()` in component

#### Example: Complete Virtual Route Configuration
```typescript
// src/app/renderer/routes.ts
import { rootRoute, index, route, layout, physical } from '@tanstack/virtual-file-routes'

export const routes = rootRoute('root.tsx', [
  // Index route - renders at '/'
  index('routes/index.tsx'),
  
  // Regular route - renders at '/ping'
  route('/ping', '../../features/ping/renderer/page.tsx'),
  
  // Layout route - pathless container for child routes
  layout('pathless-layout.tsx', [
    route('/dashboard', 'dashboard.tsx', [
      // Nested index at '/dashboard'
      index('dashboard-index.tsx'),
      // Dynamic segment at '/dashboard/$id'
      route('$id', 'dashboard-detail.tsx'),
    ]),
  ]),
  
  // Physical route - mount a directory of file routes
  physical('/settings', 'features/settings/renderer/routes'),
])
```

### Requirement: TanStack Router Vite Plugin Configuration
The Vite plugin MUST be properly configured to enable virtual file routes and ensure type-safe routing.

#### Scenario: Virtual Route Config in Vite Plugin
- **WHEN** the TanStack Router Vite plugin is configured in `electron.vite.config.ts`
- **THEN** it MUST include the `virtualRouteConfig` option pointing to the virtual routes definition file
- **AND** the `routesDirectory` MUST be set to `'.'` (project root relative to the renderer root)
- **AND** the `generatedRouteTree` path MUST match the path in `tsr.config.json`

#### Scenario: Synchronized Route Generation
- **GIVEN** the virtual route configuration (`src/app/renderer/routes.ts`) is modified
- **WHEN** the application is built or developed
- **THEN** the generated route tree (`routeTree.gen.ts`) MUST include all routes defined in the virtual configuration
- **AND** all `Link` components and `createFileRoute` calls MUST have correct type inference for these routes

#### Example: Correct Vite Plugin Configuration
```typescript
// electron.vite.config.ts
tanstackRouter({
  target: 'react',
  routesDirectory: '.',                                    // Root relative to renderer/
  generatedRouteTree: './routeTree.gen.ts',               // Output path
  virtualRouteConfig: './routes.ts',                      // Virtual routes definition
})
```

#### Example: Synchronized tsr.config.json
```json
// tsr.config.json
{
  "routesDirectory": "./src/app/renderer",
  "generatedRouteTree": "./src/app/renderer/routeTree.gen.ts",
  "virtualRouteConfig": "./src/app/renderer/routes.ts"
}
```

