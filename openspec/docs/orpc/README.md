# oRPC Knowledge Base

This directory contains the documentation and integration strategy for **oRPC** within this Electron + React project. oRPC is used as the primary communication layer (Type-Safe IPC) between the Main and Renderer processes.

## 1. Documentation Map

- [**Core Concepts**](concepts.md): The fundamental pillars (Procedure, Router, Middleware, Context, SSE).
- [**Contract-First Development**](contract-first.md): Our recommended workflow for decoupling definitions from implementation.
- [**Client Guide**](client.md): Universal manual for consuming procedures (Internal/External calls, Error handling, Streaming).
- [**Adapters**](adapters/basic.md): 
    - [Basic Adapters](adapters/basic.md) (MessagePort focus).
    - [Electron Integration](adapters/electron.md) (The specific handshake pattern).
- [**Integrations**](integrations/tanstack-query.md):
    - [TanStack Query](integrations/tanstack-query.md) (Managing server state in React).
- [**Troubleshooting**](troubleshooting.md): Common issues and solutions.

*(Note: Documentation for **Plugins** will be added in future updates as we implement specific enhancements.)*

## 2. Documentation Conventions

To ensure clarity and maintainability, all oRPC documentation follows these rules:
- **Metadata Headers**: Every file begins with an explicit list of required **Dependencies** and **Key APIs**.
- **Minimalist Examples**: Code snippets are stripped of boilerplate, focusing strictly on the API structure and logic.
- **Producer-Consumer Model**: Documentation is organized around the relationship between the Server (Producer) and Client (Consumer).

## 3. Project Status

*Project has not yet integrated oRPC. This section will track implementation progress.*

## 3. Scope & Decisions

### Why oRPC?
We chose oRPC to achieve **End-to-End Type Safety** without the overhead of standard string-based Electron IPC. It allows us to treat the Main process as a strongly-typed backend.

### Explicitly Included
- **MessagePort Adapter**: Used for efficient process communication.
- **Contract-First**: To allow parallel development of UI and Backend.
- **TanStack Query**: For caching and real-time syncing via `liveOptions`.
- **SSE (Server-Sent Events)**: For real-time updates (e.g., progress bars, logs).

### Explicitly Ignored (Out of Scope)
- **HTTP/WebSocket Adapters**: Not needed for local Electron IPC.
- **CORS/CSRF Plugins**: Security concerns relevant to web browsers but not internal IPC.
- **Server Actions**: Specific to web frameworks like Next.js; we use standard RPC calls.
- **OpenAPI Generators**: Currently prioritized lower, as our "Client" is internal.
