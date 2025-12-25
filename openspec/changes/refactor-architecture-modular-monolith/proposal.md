# Change: Refactor Architecture to Modular Monolith

## Why
To support the "AI-Friendly" and "DX First" vision, we are transitioning from a technical-layer architecture (Main/Renderer) to a domain-driven **Modular Monolith**. This change establishes the physical directory structure required to support future capabilities like ORPC, tiered storage, and vertical slices.

## What Changes
- **Directory Structure**:
  - `src/main` -> `src/app/main`
  - `src/renderer` -> `src/app/renderer`
  - `src/preload` -> `src/app/preload`
  - New directories: `src/features`, `src/shared`
- **Configuration**:
  - Update `electron.vite.config.ts` with new aliases (`@app`, `@features`, `@shared`).
  - Update `tsconfig.json` paths and include patterns.

## Non-Goals (Phase 2)
- Adding ORPC, Orama, or Shadcn (these will follow in separate changes).
- Changing the build system logic (beyond path updates).

## Strategic Roadmap
This change is **Step 1** of a 3-step modernization plan:
1.  **Phase 1 (This Proposal)**: Establish Modular Monolith directory structure (`app`, `features`, `shared`) and migrate existing code.
2.  **Phase 2 (Next)**: Introduce **ORPC** infrastructure and implement the "Dual Context" Dependency Injection strategy.
3.  **Phase 3**: Integrate **Orama** (Search), **Shadcn** (UI), and migrate the first feature (`ping`) to the new Vertical Slice pattern.

## Impact
- **Affected Specs**: `architecture`
- **Affected Code**: `src/` (extensive file moves).
- **Breaking Change**: Yes, internal structure overhaul.
