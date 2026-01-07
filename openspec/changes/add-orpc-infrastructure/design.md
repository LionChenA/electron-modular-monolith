## Context
We are implementing the communication layer defined in `ARCHITECTURE_BLUEPRINT.md`.

## Decisions

### 1. ORPC Infrastructure Placement
- **Decision**: ORPC infrastructure is split by process context, adhering to the Modular Monolith blueprint.
  - **Backend**: `src/app/main/orpc.ts` defines `publicProcedure` and `os` configuration.
  - **Frontend**: `src/app/renderer/infra/client.ts` handles the `MessageChannel` handshake and exports the client instance.
  - **Contracts**: `src/features/<name>/shared/contract.ts` defines pure Zod schemas (no runtime deps).
- **Why**: Prevents leakage of backend logic into frontend bundles and maintains strict layer boundaries.

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

### 5. Dependency Injection Pattern
- **Decision**: Features MUST define their dependencies explicitly in `src/features/<name>/main/types.ts`.
- **Mechanism**: 
  - **Interface**: Feature defines `interface FeatureDeps { bus: IEventBus }`.
  - **Injection**: Router uses `os.context<FeatureDeps>()`.
  - **Satisfaction**: `src/app/main/context.ts` constructs the runtime object that satisfies these interfaces.
- **Why**: Decouples domain logic from concrete infrastructure, facilitating testing and future replacements.

## Risks / Trade-offs
- **Risk**: `electron-toolkit` utilities might rely on the default preload exposure.
- **Mitigation**: We will inspect usages. If needed, we can keep a minimal bridge, but for `ping`, we switch entirely.

## Migration Plan
1. Install dependencies.
2. Build the `src/app/orpc` layer.
3. Update Main and Preload to support the handshake.
4. Refactor `ping` feature.
