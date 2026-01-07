## 1. Dependencies
- [ ] 1.1 Install `@orpc/server`, `@orpc/client`, `@orpc/contract`, `@orpc/react`, `@orpc/tanstack-query`, `@tanstack/react-query`, `zod`.

## 2. ORPC SDK & Infrastructure (The Backbone)
- [ ] 2.1 Create `src/app/orpc/server.ts`: Define `publicProcedure` and `MainContext`.
    - Configure native error handling (e.g., `ORPCError`).
- [ ] 2.2 Create `src/app/orpc/client.ts`: Implement `createClient` with MessagePort `RPCLink`.
- [ ] 2.3 Create `src/app/orpc/react.ts`: Export `useOrpc` and providers.
- [ ] 2.4 Create `src/app/main/bus.ts`: Implement a typed `EventBus` (native EventEmitter) for Main process.

## 3. Communication Channel (The Plumbing)
- [ ] 3.1 Update `src/app/main/context.ts`: Define `MainContext` type (inject `db`, `bus`, `window`).
- [ ] 3.2 Create `src/app/main/ipc.ts`: Implement `RPCHandler` logic:
    - Handle MessagePort handshake.
    - Inject `MainContext` (with `EventBus` instance) into the handler.
- [ ] 3.3 Update `src/app/main/index.ts`: Initialize IPC handler and EventBus on app launch.
- [ ] 3.4 Rewrite `src/app/preload/index.ts`: Implement the MessagePort handshake bridge (replace legacy contextBridge).

## 4. Feature Implementation (Contract-First)
- [ ] 4.1 **General Feature (System Info)**:
    - Create `src/features/general/contract.ts`: Define `getVersions`, `getPlatform`.
    - Create `src/features/general/main/router.ts`: Implement procedures.
- [ ] 4.2 **Ping Feature (Verification)**:
    - Create `src/features/ping/contract.ts`: Define `ping` (query) and `onPing` (subscription).
    - Create `src/features/ping/main/router.ts`: Implement logic. 
        - `ping`: Returns "pong" and publishes to EventBus.
        - `onPing`: Subscribes to EventBus and yields events to Renderer.
- [ ] 4.3 Update `src/app/main/router.ts`: Register `general` and `ping` routers.

## 5. Frontend Integration & Migration
- [ ] 5.1 Refactor `src/app/renderer/components/Versions.tsx`: Use `orpc.general.getVersions` (via `useQuery`).
- [ ] 5.2 Refactor `src/app/renderer/App.tsx`: 
    - Use `orpc.ping.ping` (mutation/query).
    - Use `orpc.ping.onPing` (subscription) to demonstrate Pub/Sub.
- [ ] 5.3 Remove legacy `ipcMain.on('ping')` from `src/app/main/index.ts`.

## 6. Cleanup
- [ ] 6.1 Update `src/app/preload/index.d.ts`: Remove `window.electron` and `window.api`.
- [ ] 6.2 Uninstall `@electron-toolkit/preload` (keep `@electron-toolkit/utils`).
