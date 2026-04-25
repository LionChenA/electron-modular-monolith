## 1. Installation
- [x] 1.1 Install dependencies:
    - `pnpm add @tanstack/react-router`
    - `pnpm add -D @tanstack/router-plugin @tanstack/virtual-file-routes`

## 2. Infrastructure Setup
- [x] 2.1 Create `tsr.config.json`: Configure virtual route entry and output.
- [x] 2.2 Add script `"generate": "tsr generate"` to `package.json`.
- [x] 2.3 Create `src/app/renderer/root.tsx`: The Root Layout component.
- [x] 2.4 Create `src/app/renderer/routes.ts`: The Virtual Route Configuration file.
- [x] 2.5 Update `electron.vite.config.ts`: Add `TanStackRouterVite` plugin (auto-detects config).

## 3. Runtime Integration
- [x] 3.1 Run `pnpm run generate` to create `routeTree.gen.ts`.
- [x] 3.2 Create `src/app/renderer/router.tsx`: Initialize `createRouter` with the generated tree.
- [x] 3.3 Update `src/app/renderer/App.tsx`: Provide `RouterProvider`.

## 4. Feature Integration (PoC)
- [x] 4.1 Create `src/features/ping/renderer/page.tsx`: A simple feature page.
- [x] 4.2 Add `/ping` route to `src/app/renderer/routes.ts`.
- [x] 4.3 Verify navigation to `/ping`.
