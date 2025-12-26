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

### 3. Legacy IPC Removal
- **Decision**: We will NOT expose `ipcRenderer` globally. The Preload script's ONLY job is to forward the `MessagePort` for ORPC.
- **Impact**: `window.electron` object will be removed.

## Risks / Trade-offs
- **Risk**: `electron-toolkit` utilities might rely on the default preload exposure.
- **Mitigation**: We will inspect usages. If needed, we can keep a minimal bridge, but for `ping`, we switch entirely.

## Migration Plan
1. Install dependencies.
2. Build the `src/app/orpc` layer.
3. Update Main and Preload to support the handshake.
4. Refactor `ping` feature.
