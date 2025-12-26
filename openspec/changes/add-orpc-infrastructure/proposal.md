# Change: Add ORPC Infrastructure

## Why
To achieve "Type-Safe IPC" and "AI-Friendly Context", we need to replace the loose string-based IPC mechanism with **ORPC**. This change implements the "Nervous System" of our Modular Monolith, establishing a unified communication pattern and Dependency Injection strategy.

## What Changes
- **Infrastructure**:
  - Install `@orpc/server`, `@orpc/client`, `@orpc/react`, `@tanstack/react-query`.
  - Create `src/app/orpc` as the centralized ORPC SDK definition.
  - Implement Electron `MessagePort` handshake in Main and Preload.
- **Legacy Removal**:
  - Remove `electron-toolkit` default `contextBridge` exposure (`window.electron`) in favor of ORPC.
- **Pilot Feature**:
  - Refactor `ping` from `src/app/main/index.ts` to `src/features/ping` using ORPC.

## Impact
- **Affected Specs**: `communication`
- **Affected Code**: `src/app/main`, `src/app/preload`, `src/app/renderer`, `src/features`.
- **Breaking Change**: Yes. Any existing code relying on `window.electron.ipcRenderer` will stop working (though we will migrate `ping`).
