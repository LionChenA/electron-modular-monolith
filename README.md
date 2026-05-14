# electron-modular-monolith

An Electron desktop application built with React 19, TypeScript, and Vite. This project follows a **Modular Monolith** architecture designed for scalability while maintaining a single deliverable.

## Tech Stack

- **Framework**: [Electron](https://www.electronjs.org/) 39.x
- **Frontend**: [React](https://react.dev/) 19.x + [TypeScript](https://www.typescriptlang.org/) 6.x
- **Build Tool**: [electron-vite](https://electron-vite.org/) 6.x
- **Package Manager**: [pnpm](https://pnpm.io/)
- **UI Styling**: [Tailwind CSS](https://tailwindcss.com/) 4.x + [Base UI](https://base-ui.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [TanStack Router](https://tanstack.com/router/latest)
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query/latest) + [oRPC](https://orpc.unnoq.com/)
- **Storage**: SQLite ([better-sqlite3](https://github.com/WiseLibs/better-sqlite3)) + [Orama](https://oramasearch.com/) (full-text search) + [electron-store](https://github.com/sindresorhus/electron-store) (preferences & secure storage)
- **Icons**: [Lucide React](https://lucide.dev/)

## Project Structure

The codebase follows a **Modular Monolith** architecture with clear separation of concerns:

```
src/
├── app/                 # Infrastructure layer (no business logic)
│   ├── main/            # Electron main process (window management, native APIs, storage)
│   ├── preload/         # Secure bridge between main and renderer (context isolation)
│   └── renderer/        # React SPA shell (routing, providers, UI components)
├── features/            # Business logic organized by vertical slices
│   ├── general/         # General application features
│   └── ping/            # Ping/diagnostic feature (example implementation)
└── shared/              # Shared utilities, types, constants, interfaces
    ├── interfaces/      # IPC contract definitions
    ├── routing/         # Route definitions and helpers
    └── utils/           # Utility functions
```

### Architecture Principles

- **Vertical Slices**: Each feature is self-contained with its own components, logic, and contracts.
- **No Circular Dependencies**: Enforced by [dependency-cruiser](https://github.com/sverweij/dependency-cruiser).
- **Shared Layer**: Utilities and types only; must not depend on `app` or `features`.
- **Context Isolation**: Enabled for security; all communication goes through the preload bridge.
- **Type-Safe IPC**: Uses [oRPC](https://orpc.unnoq.com/) for end-to-end type-safe communication between renderer and main processes.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [pnpm](https://pnpm.io/installation)
- [VSCode](https://code.visualstudio.com/) + [Biome extension](https://marketplace.visualstudio.com/items?itemName=biomejs.biome) (recommended)

### Install Dependencies

```bash
pnpm install
```

### Development

Start the development server with hot reload:

```bash
pnpm dev
```

### Build

```bash
# macOS
pnpm build:mac

# Windows
pnpm build:win

# Linux
pnpm build:linux

# Unpack (for debugging)
pnpm build:unpack
```

## Available Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Type-check and build for production |
| `pnpm start` | Preview production build |
| `pnpm check` | Format, lint, and apply safe fixes (Biome) |
| `pnpm check:unsafe` | Apply all fixes including unsafe ones |
| `pnpm typecheck` | Run TypeScript type checking (node + web) |
| `pnpm depcruise` | Validate dependency rules |
| `pnpm test` | Run all unit and integration tests (Vitest) |
| `pnpm test:watch` | Run tests in watch mode |
| `pnpm test:main` | Run main process tests |
| `pnpm test:renderer` | Run renderer process tests |
| `pnpm test:component` | Run component tests (Storybook) |
| `pnpm test:e2e` | Run E2E tests (Playwright) |
| `pnpm test:all` | Run all tests (unit + E2E) |
| `pnpm storybook` | Start Storybook dev server |
| `pnpm storybook:build` | Build Storybook for static hosting |
| `pnpm openapi:generate` | Generate OpenAPI specification |
| `pnpm kubb` | Generate types and clients from OpenAPI (Kubb) |

## Testing Strategy

This project uses a multi-layered testing approach:

- **Unit/Integration Tests**: [Vitest](https://vitest.dev/) with [Testing Library](https://testing-library.com/)
- **Component Tests**: [Storybook](https://storybook.js.org/) + [Vitest Browser Mode](https://vitest.dev/guide/browser/)
- **E2E Tests**: [Playwright](https://playwright.dev/) for cross-process automation
- **Coverage**: [Vitest Coverage (v8)](https://vitest.dev/guide/coverage.html)

Run individual test suites:

```bash
pnpm test:main        # Main process logic
pnpm test:renderer    # Renderer utilities
pnpm test:component   # UI components
pnpm test:e2e         # Full application E2E
```

## Code Quality

- **Formatter & Linter**: [Biome](https://biomejs.dev/) 2.x (replaces ESLint + Prettier)
- **Git Hooks**: [Husky](https://typicode.github.io/husky/) + [lint-staged](https://github.com/lint-staged/lint-staged) for pre-commit checks
- **Dependency Validation**: [dependency-cruiser](https://github.com/sverweij/dependency-cruiser) enforces architectural boundaries
- **Conventional Commits**: Required commit message format (`type(scope): description`)

## Specification-Driven Development

This project uses the **OpenSpec** framework for spec-driven development.

All specifications and architectural decisions are documented in the [`openspec/`](./openspec/) directory:

- **`openspec/vision.md`** — Product vision and user experience goals
- **`openspec/architecture.md`** — Architectural blueprint and technical principles
- **`openspec/project.md`** — Current tech stack and development conventions
- **`openspec/roadmap.md`** — Feature roadmap
- **`openspec/specs/`** — Capability specifications for implemented features
- **`openspec/docs/`** — Technology-specific knowledge artifacts
- **`openspec/changes/`** — Active change proposals

## Communication Patterns

The application uses multiple IPC strategies optimized for different use cases:

1. **oRPC (Primary)**: Type-safe remote procedure calls for renderer → main communication
2. **MessagePort**: Direct high-performance channel for large data transfers (bypasses serialization overhead)
3. **Decentralized Contracts**: Each feature defines self-contained contracts; the client composes them on demand

## Storage Layer

The main process provides a unified storage infrastructure:

- **SQLite** (`better-sqlite3`): Structured relational data
- **Orama**: Full-text search and vector search capabilities
- **Secure Storage**: Encrypted key-value store for sensitive data
- **Preferences**: Typed user preferences via `electron-store`

## License

[MIT](LICENSE)

---

_Built with [electron-vite](https://electron-vite.org/)_
