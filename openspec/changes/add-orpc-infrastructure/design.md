## Context
We are implementing the communication layer defined in `ARCHITECTURE_BLUEPRINT.md`.

## Decisions

### 1. Centralized ORPC SDK (`src/app/orpc`)
- **Decision**: All ORPC configuration resides in `src/app/orpc/`.
  - `server.ts`: Defines `baseProcedure` with MainContext bindings.
  - `client.ts`: Handles the `MessageChannel` handshake logic.
  - `react.ts`: Exports `useOrpc` and `OrpcProvider`.
- **Why**: Keeps business logic (Features) clean from framework setup code.

### 2. Communication & DI Matrix
We strictly enforce the following patterns:
| Scope | Mechanism | DI Strategy |
| :--- | :--- | :--- |
| **Main -> Main** | Direct Function Call | TS Parameter Injection (`fn(ctx, ...)`) |
| **Renderer -> Renderer** | React | React Context / Hooks (`useService`) |
| **Renderer <-> Main** | ORPC | ORPC Context (`os.context<Deps>`) |

### 3. Legacy IPC Removal & Migration
- **Decision**: We will NOT expose `ipcRenderer` globally. The Preload script's ONLY job is to forward the `MessagePort` for ORPC.
- **Migration Strategy**: 
  - Essential legacy data (e.g., `process.versions`, `platform`) will be migrated to a new `general` feature accessed via RPC queries.
  - This ensures `src/app/renderer/components/Versions.tsx` and similar components remain functional without `window.electron`.
- **Impact**: `window.electron` object will be removed.

### 4. Event Bus (Pub/Sub)
- **Decision**: We implement a typed `EventBus` (EventEmitter) in the Main process and expose it to the Renderer via ORPC Subscriptions (`eventIterator`).
- **Why**: To support "Server-Push" scenarios (e.g., progress updates) without reverting to `ipcRenderer.on`.
- **Implementation**: Injected into `MainContext` as `ctx.bus`.

## Risks / Trade-offs
- **Risk**: `electron-toolkit` utilities might rely on the default preload exposure.
- **Mitigation**: We will inspect usages. If needed, we can keep a minimal bridge, but for `ping`, we switch entirely.

## Migration Plan
1. Install dependencies.
2. Build the `src/app/orpc` layer.
3. Update Main and Preload to support the handshake.
4. Refactor `ping` feature.
