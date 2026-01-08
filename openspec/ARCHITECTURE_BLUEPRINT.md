# Architecture Blueprint & Technical Details
> **NOTE**: This document captures the high-fidelity technical consensus for the Modular Monolith architecture. It serves as the authoritative reference for implementation and future feature development.

## 1. Final Directory Structure

```text
src/
├── app/                      # 🟢 Infrastructure Layer (Shell)
│   ├── main/
│   │   ├── infra/            # Concrete Implementations (Platform/Services)
│   │   │   ├── electron.ts   # IPlatform implementation
│   │   │   ├── orama.ts      # IDatabase implementation
│   │   │   └── secrets.ts    # ISecrets implementation
│   │   │
│   │   ├── context.ts        # 🔴 Context Assembly (Runtime Object)
│   │   ├── router.ts         # ORPC Root Router (Implementation Aggregator)
│   │   ├── ipc.ts            # Main Entry: setup RPCHandler(ctx)
│   │   └── index.ts          # App Lifecycle (createWindow)
│   │
│   ├── preload/              # Preload Scripts
│   │   └── index.ts          # Expose MessagePort
│   │
│   └── renderer/             # 🔵 Renderer Shell
│       ├── infra/            # Frontend Infra
│       │   └── client.ts     # ORPC Client Instance
│       ├── providers/        # React Providers (Theme, ORPC)
│       ├── router.ts         # TanStack Root Router
│       ├── App.tsx           # Root Layout
│       └── main.tsx          # React Entry
│
├── features/                 # 🟡 Vertical Slices (Domain)
│   ├── <feature-name>/       # e.g., 'auth', 'chat'
│   │   ├── main/             # Backend Fracture
│   │   │   ├── types.ts      # Dependency Interfaces (Needs)
│   │   │   ├── service.ts    # Pure Logic (fn(ctx, ...))
│   │   │   └── router.ts     # ORPC Router (os.context<Deps>)
│   │   ├── renderer/         # Frontend Fracture
│   │   │   ├── components/   # Feature UI
│   │   │   ├── hooks/        # Feature Hooks
│   │   │   └── routes.ts     # Route Definitions
│   │   └── shared/           # Contracts (No Runtime Deps)
│   │       └── schema.ts     # Zod Schemas
│   │
│   └── ...
│
└── shared/                   # ⚪ Primitives (No Circular Deps)
    ├── constants/            # Global Constants
    ├── schemas/              # Shared Zod Schemas
    ├── types/                # Utility Types
    ├── utils/                # Pure Functions
    └── components/           # UI Kit (Shadcn/ui)
```

## 2. Dependency Injection (DI) Strategy

We use a **Dual Context** strategy to decouple features from the environment.

### A. Main Process (Backend)
- **Mechanism**: TypeScript Function Parameters & ORPC Context.
- **Rule**: Features MUST NOT import from `src/app`. They define what they need in `types.ts`.

**Example: Feature Definition**
```typescript
// features/chat/main/types.ts
import type { Results } from '@orama/orama' // Direct npm import OK
export interface ChatDeps {
  db: { search(term: string): Promise<Results<any>> }
}

// features/chat/main/router.ts
export const chatRouter = os.context<ChatDeps>().router({
  search: os.procedure.handler(async ({ ctx, input }) => {
    return ctx.db.search(input)
  })
})
```

**Example: App Assembly**
```typescript
// app/main/context.ts
import { oramaService } from '@/app/infra/orama'
export const runtimeContext = { db: oramaService }

// app/main/ipc.ts
new RPCHandler(router, {
  context: async () => runtimeContext // Injection happens here
})
```

### B. Renderer Process (Frontend)
- **Mechanism**: React Context & Hooks.
- **Rule**: UI components access global capabilities via Hooks (`useOrpc`, `useTheme`).

## 3. Communication Strategy (ORPC-First)

- **Renderer -> Main**: STRICTLY via ORPC Mutations/Queries. No direct `ipcRenderer` calls in features.
- **Main -> Renderer**: STRICTLY via **ORPC Subscriptions** (backed by `EventPublisher`).
- **Main -> Main**: Direct function calls (passing `ctx` manually if needed).

## 4. Storage Strategy (Tiered)

- **Tier 1 (Preferences)**: `electron-store` / `localStorage`.
- **Tier 2 (Secrets)**: `safeStorage` (via ORPC).
- **Tier 3 (AI Data)**: `Orama` (Search Index + Persistence Plugin).

## 5. Developer Workflow (How to Add a Feature)

When adding a new capability, follow this **Dependency Inversion** workflow:

1.  **Define Needs (Feature Layer)**:
    - Go to `src/features/<your-feature>/main/types.ts`.
    - Define an interface describing exactly what you need (e.g., `interface MyDeps { saveFile(path: string): Promise<void> }`).
2.  **Implement Logic (Feature Layer)**:
    - Write your Router/Service using ONLY `ctx` (which matches your interface).
    - Do NOT import `electron` or `fs` directly.
3.  **Check & Connect (App Layer)**:
    - Check `src/app/infra/`. Is there an implementation that satisfies `MyDeps`?
    - **YES**: Register your router in `src/app/main/router.ts`. 
    - **NO**: Create a new implementation in `src/app/infra/` and add it to `runtimeContext`.

## 6. Constraints & Safety Checklist
- [ ] `src/shared` MUST NOT import `src/app` or `src/features`.
- [ ] `src/features` MUST NOT import `src/app` (Runtime code).
- [ ] UI Components MUST NOT import `electron` directly.
- [ ] **TSConfig Safety**: `tsconfig.web.json` should rely on `shared` types or ORPC clients.

## 7. Design Guidelines

### AI-Friendly Context Density
- **Rule**: Keep it Local. Avoid extracting logic to `src/shared` unless it is used by 3+ features.
- **Why**: AI Agents work best when all relevant code (UI, Logic, Types) is in one folder.

### Pragmatic Abstraction & Infrastructure
- **Rule**: Define interfaces for *Testability* first, *Portability* second.
- **Cross-Cutting Concerns**: Global systems (Shortcuts, Auto-Updater, Notifications) should reside in `src/app/infra` as centralized services and be injected into Features via Context. This prevents feature-level conflicts and simplifies cleanup.

## 8. Decentralized Contracts Pattern
Unlike traditional architectures that enforce a monolithic `AppRouter` shared with the frontend, we use a **Decentralized Contract** pattern:

1.  **Definition**: Each feature defines its own Contract in `src/features/<feature>/shared/contract.ts`.
2.  **Implementation**: The Main process imports these contracts to implement routers.
3.  **Consumption**: The Renderer process (`client.ts`) imports **only the contracts it needs** and composes them into a client-side definition.

**Why?**
- Decouples Frontend from Backend implementation structure.
- Allows flexibility (e.g., different windows can have different API clients).
- Prevents `src/app/renderer` from importing types from `src/app/main`.
