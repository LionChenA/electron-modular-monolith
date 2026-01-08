# Project Context

## Purpose
An Electron desktop application with a modular architecture, featuring a React-based renderer process, TypeScript throughout, and a monorepo-like structure suitable for scaling into multiple modules while maintaining a single deliverable.

## Tech Stack
- **Framework**: Electron 39.x
- **Frontend**: React 19.x with TypeScript
- **Build Tool**: electron-vite 5.x (Vite 7.x)
- **Package Manager**: pnpm
- **Language**: TypeScript 5.x
- **UI Styling**: CSS with custom assets
- **Process Architecture**: Main process (Node.js) + Preload script + Renderer (React)
- **Code Quality**: Biome 2.x (unified formatter + linter)

## Project Conventions

### Code Style
- **Formatter & Linter**: Biome 2.x
  - Unified toolchain replacing ESLint + Prettier
  - High Prettier compatibility for formatting
  - Comprehensive linting rules with recommended defaults
  - Single command for format + lint: `biome check`
- **VS Code Integration**: Biome LSP
  - Automatic formatting on save
  - Import organization on save
  - Code actions and quick fixes
- **Naming Conventions**:
  - PascalCase for React components (e.g., `App.tsx`, `Versions.tsx`)
  - camelCase for functions and variables
  - kebab-case for file and directory names
- **Path Aliases**: `@renderer/*` for renderer source imports
- **Scripts**:
  - `pnpm check` - Format, lint, and apply safe fixes (format + lint + organize imports)
  - `pnpm check:unsafe` - Apply ALL fixes including unsafe ones

### Architecture Patterns
- **Three-Process Architecture**:
  - **Main Process** (`src/main/`): Electron window management, native APIs, app lifecycle
  - **Preload Script** (`src/preload/`): Secure bridge between main and renderer, context isolation enabled
  - **Renderer Process** (`src/renderer/`): React SPA with client-side routing and UI
- **Communication Pattern**:
  - **ORPC**: Type-safe Remote Procedure Call for Renderer -> Main
  - **MessagePort**: Direct high-performance channel (bypassing contextBridge serialization overhead)
  - **Decentralized Contracts**: Features define self-contained contracts; Client composes them on demand
- **Context Isolation**: Enabled with secure IPC communication
- **Module Structure**:
  - Modular organization ready for scaling into multiple features
  - Assets managed in dedicated `assets/` directories per module
  - Type definitions in `.d.ts` files for preload exposure

### Testing Strategy
- **Current State**: No testing framework configured yet
- **Recommendations**:
  - Main/Preload: Vitest or Jest for Node.js testing
  - Renderer: React Testing Library + Vitest/Jest for component testing
  - E2E: Playwright for cross-process testing

### Git Workflow
- **Branch Strategy**: Main branch with feature branches
- **Commit Convention**: Conventional Commits
  - Format: `type(scope): description` (e.g., `feat: add new feature`)
  - Footer: `Co-Authored-By: Minimax M2`
- **Package Manager**: pnpm with lockfile committed

## Domain Context
- Desktop application development using Electron
- Cross-platform compatibility (Windows, macOS, Linux)
- Context isolation security model for renderer process
- Asset management for icons, images, and static resources

## Important Constraints
- **Security**: Context isolation enabled, sandbox disabled (by design for toolkit compatibility)
- **Build Output**: Compiled to `out/` directory structure
- **Platform-Specific**: Conditional code for Linux icon handling
- **Type Safety**: Strict TypeScript configuration with composite projects
- **Resource Management**: Static assets loaded via Vite's asset pipeline

- **External Dependencies**:
  - `@orpc/*`: End-to-end type-safe RPC ecosystem (Server, Client, Contract, React/Query)
  - `@tanstack/react-query`: Data fetching and state management
  - `zod`: Schema validation and contract definition
- **@electron-toolkit**: Utility packages for Electron development
  - `@electron-toolkit/utils`: Core utilities
  - `@electron-toolkit/preload`: Preload script helpers
  - `@electron-toolkit/tsconfig`: TypeScript configurations
- **Electron Ecosystem**:
  - `electron`: Core runtime
  - `electron-builder`: Packaging and distribution
  - `electron-updater`: Auto-update functionality
- **Development Tools**:
  - `electron-vite`: Build tool and development server
  - `@vitejs/plugin-react`: React support for Vite
  - `@biomejs/biome`: Unified formatter, linter, and code quality tool
  - `husky`: Git hooks for pre-commit quality checks
  - `lint-staged`: Run linters on staged files
