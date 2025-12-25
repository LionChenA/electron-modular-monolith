## Context
We are laying the foundation for a Modular Monolith. While this change is primarily about file movement, it enforces new architectural boundaries.

## Decisions

### 1. The Modular Monolith Structure
- **Decision**: Code is organized by **Domain (Feature)** first, then by **Process (Main/Renderer)**.
- **Pattern**:
  ```text
  src/
  ├── app/          # Infrastructure (Shell, Global Config)
  ├── features/     # Business Logic (Vertical Slices)
  └── shared/       # Primitives, Constants, Schemas (No circular deps)
  ```

### 2. Dependency Injection Strategy (Foundation)
- **Decision**: Although we aren't implementing ORPC yet, the structure supports the future "Dual Context" strategy:
  - `app/main` will host the DI container.
  - `features/*/main` will define dependency interfaces.
  - `shared` will REMAIN free of complex context interfaces to prevent circular dependencies.

### 3. Shared Directory Constraints
- **Decision**: `src/shared` MUST NOT import from `src/app` or `src/features`. It is for leaf-node utilities and types only.

## Risks / Trade-offs
- **Risk**: `git` history might be confusing if moves aren't atomic.
- **Mitigation**: We will perform file moves in a single commit where possible.

## Migration Plan
1. Create new directories.
2. Move files using `git mv` to preserve history.
3. Update imports and configs.
