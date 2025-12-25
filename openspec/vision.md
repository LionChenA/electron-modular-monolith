# Product Vision: Electron Modular Monolith Template

## Core Purpose
To provide a **state-of-the-art Electron application template** that bridges the gap between rapid prototyping and scalable, enterprise-grade architecture. This project prioritizes **Developer Experience (DX)** and **AI-Friendly** capabilities, enabling developers to build modern, feature-rich desktop applications without the architectural debt typically associated with scaling Electron apps.

## Strategic Pillars

### 1. Architecture: Vertical Slices + Modular Monolith
We reject the traditional "Layered Architecture" in favor of **Vertical Slices**.
- **Feature Encapsulation**: Each feature (e.g., `features/user`) is a self-contained module containing its own Backend (Main Process), Frontend (Renderer UI), and Shared Contracts.
- **Unified Dependency Injection (DI)**: We employ a pragmatic, environment-agnostic DI strategy:
    - **Main Process**: Uses **TypeScript Function Parameters (Context)** for service injection.
    - **Renderer Process**: Uses **React Context** for UI-level dependency management.
    - **Cross-Process**: Uses **ORPC Context** to bridge the process gap.

### 2. AI-Friendly Foundation
- **Orama Integration**: Leveraged for full-text and vector search with persistence support. 
- **Tiered Storage**: We follow a specialized storage strategy:
    - **Secrets**: Encrypted storage (Electron SafeStorage) for AI API keys.
    - **Configuration**: Simple JSON/Local storage for user preferences.
    - **AI Data**: Orama-backed storage for chat history and vector indices.
- **MCP Ecosystem**: Pre-configured `mcp.json` to empower AI coding tools with contextual project knowledge.

### 3. Next-Gen Toolchain (DX & Performance)
- **Rust-Powered**: Utilizing Rolldown and OXC (transitioning) for near-instant build and lint feedback loops.
- **pnpm**: Fast, disk-efficient package management for complex modular structures.

### 4. Developer Experience (DX) First
- **Type-Safe IPC (ORPC)**: Replacing string-based IPC with **ORPC** for end-to-end type safety.
- **Native Event Bus**: Using ORPC **Subscriptions** (AsyncGenerators) to synchronize state and broadcast events across all windows, eliminating the need for custom IPC event logic.
- **Modern Routing**: **TanStack Router** for type-safe, declarative routing.

## Technology Stack

| Domain | Choice | Rationale |
| :--- | :--- | :--- |
| **Package Manager** | pnpm | Performance & efficiency |
| **Bundler** | Vite + Rolldown | The fastest build engine available |
| **Linting/Formatting**| Biome -> OXC | Moving towards the fastest Rust toolchain |
| **Architecture** | Vertical Slices | Context density for AI & Scalability |
| **Communication** | ORPC (tRPC-like) | Type-safe IPC and Subscriptions |
| **Database** | Orama | Search & Vector data storage |
| **Routing** | TanStack Router | Type-safe, file-based routing |
| **UI System** | shadcn/ui + Tailwind | Modern, accessible, customizable design |
| **State Management** | Zustand | Federated stores for modularity |
