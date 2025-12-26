## 1. Dependencies
- [ ] 1.1 Install `@orpc/server`, `@orpc/client`, `@orpc/react`, `@tanstack/react-query`.
- [ ] 1.2 Install peer deps (`zod`).

## 2. ORPC Core (The SDK)
- [ ] 2.1 Create `src/app/orpc/server.ts`: Define `publicProcedure` and `MainContext` type.
- [ ] 2.2 Create `src/app/orpc/client.ts`: Implement `createClient` with MessagePort logic.
- [ ] 2.3 Create `src/app/orpc/react.ts`: Export `useOrpc` and providers.

## 3. Infrastructure Implementation
- [ ] 3.1 Update `src/app/main/context.ts`: Create the runtime context object (initially minimal).
- [ ] 3.2 Update `src/app/main/router.ts`: Create root router.
- [ ] 3.3 Create `src/app/main/ipc.ts`: Implement `RPCHandler` and `ipcMain` handshake.
- [ ] 3.4 Update `src/app/main/index.ts`: Initialize IPC handler on launch.
- [ ] 3.5 Rewrite `src/app/preload/index.ts`: Replace legacy bridge with MessagePort forwarding.

## 4. Feature Migration (Ping)
- [ ] 4.1 Create `src/features/ping/main/router.ts`: Implement `ping` procedure.
- [ ] 4.2 Register `ping` router in `src/app/main/router.ts`.
- [ ] 4.3 Update `src/app/renderer/App.tsx`: Use `useOrpc` to call ping.
- [ ] 4.4 Remove legacy `ipcMain.on('ping')` from `src/app/main/index.ts`.

## 5. Cleanup
- [ ] 5.1 Remove unused types in `env.d.ts` related to legacy `window.electron`.
