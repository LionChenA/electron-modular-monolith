## Context
We strictly follow the **Virtual File Routes** documentation but adopt a **Mixed Mode** strategy. We use `tsr.config.json` for configuration to decouple routing from the build tool and enable CLI generation.

## Decisions

### 1. Configuration Strategy: `tsr.config.json`
- **Decision**: Use a standalone `tsr.config.json` file.
- **Why**:
    - Enables usage of the TanStack Router CLI (`tsr generate`) without spinning up the heavy Electron build process.
    - Provides better IDE support via the VS Code plugin.
    - Decouples routing configuration from Vite.

### 2. Routing Strategy: Mixed Mode (Virtual + Physical)
- **Decision**: Use `@tanstack/virtual-file-routes` but allow Features to own their internal structure.
- **Pattern**:
    - **App Layer**: Defines the high-level skeleton (Virtual).
    - **Feature Layer**: Can use Physical routing for complex internal pages.
    - **Example**:
      ```typescript
      // src/app/renderer/routes.ts
      import { rootRoute, route, physical } from '@tanstack/virtual-file-routes'

      export const routes = rootRoute('src/app/renderer/root.tsx', [
        // Virtual mapping for simple features
        route('/ping', 'src/features/ping/renderer/page.tsx'),
        
        // Physical mapping for complex features (scans the directory)
        physical('/settings', 'src/features/settings/renderer/routes') 
      ])
      ```

### 3. Artifact Management
- **Decision**: Commit `routeTree.gen.ts` to Git.
- **Why**: Ensures type safety is available immediately after `git pull` without requiring a mandatory generation step.

## Core Principles
1. **Module Augmentation**: Global type safety relies entirely on Module Augmentation. The `Register` interface in `@tanstack/react-router` must be augmented with the specific `router` instance type to enable automatic type inference for `Link`, `useParams`, and `useSearch` across the application.
2. **Route Token Identity**: In Virtual File Routes, `rootRoute` and `route` tokens serve as strict bindings between URL segments and physical files. They act as unique referential identifiers that the compiler uses to construct the flat route tree, rather than just being passive configuration objects.
3. **Vite Root Resolution**: Path resolution for Virtual Routes is sensitive to the Vite `root` context. By using `tsr.config.json`, we explicitly define the `routesDirectory` and `generatedRouteTree` paths relative to the project root, decoupling the router's build-time file scanning from Vite's runtime dev server root (which is often set to `src/renderer` in Electron).
4. **Artifact Synchronization**: The `routeTree.gen.ts` file is the immutable contract between the compiler and the runtime. It acts as the single source of truth for the router instance. Any divergence between the `routes.ts` definition and the generated artifact results in a "stale type" state where runtime navigation might succeed but compile-time checks fail.

## Risks / Trade-offs
- **Risk**: Physical routes might encourage deep nesting structure.
- **Mitigation**: Code review guidelines should encourage flattened route structures where possible.

## Migration Plan
1. Install dependencies.
2. Create `tsr.config.json`.
3. Add `generate` script to package.json.
4. Define the Virtual Route Config (`routes.ts`).
5. Run generation.
