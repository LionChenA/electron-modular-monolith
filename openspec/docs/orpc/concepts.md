# ORPC Core Concepts

**Dependencies:** `@orpc/server`, `@orpc/client`, `@orpc/shared`
**Key APIs:** `os`, `createORPCClient`, `RPCHandler`, `RPCLink`

## 1. System Overview

oRPC (OpenAPI Remote Procedure Call) is a type-safe, contract-first communication framework. It combines the simplicity of RPC with the power of OpenAPI standards.

### The 6 Pillars
To understand oRPC, you need to understand its six fundamental components and how they interact:

1.  **Procedure**: The atomic unit of logic (an enhanced function).
2.  **Router**: A collection of procedures organized into a tree structure.
3.  **Server (Producer)**: The runtime that executes procedures and manages context.
4.  **Client (Consumer)**: The type-safe interface for invoking remote procedures.
5.  **Middleware**: Reusable logic that intercepts the request lifecycle (the "How").
6.  **Context**: The dependency injection container for state (the "What").

### Architecture & Data Flow

```
┌─────────────────────────────────────────────────────────┐
│                       ORPC System                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐  │
│  │   Client    │───►│ RPCHandler  │───►│  Procedure  │  │
│  │  (RPCLink)  │    │   Server    │    │  (handler)  │  │
│  └─────────────┘    └─────────────┘    └─────────────┘  │
│        │                 ▲   │              ▲           │
│        │                 │   │              │           │
│        │            Context  Middleware     │           │
│        │                 │   │              │           │
│        └─────────────────┴───┴──────────────┘           │
│                  Message / HTTP Request                 │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

**Data Flow:**
`Client` -> `Network` -> `Server (Context/Middleware)` -> `Router` -> `Procedure` -> `Implementation`

### Minimal Example

```typescript
import { os, createORPCClient } from '@orpc/server';
import { RPCLink } from '@orpc/client/fetch';

// 1. Define a Procedure (Logic)
const ping = os.handler(async ({ input }) => `Pong: ${input}`);

// 2. Create a Router (Organization)
const router = { ping };

// 3. Client Usage (Communication)
const link = new RPCLink({ url: 'http://localhost:3000' });
const client = createORPCClient<typeof router>(link);

await client.ping('Hello'); 
```

---

## 2. Procedures & Routers

*Defining and organizing your API logic.*

Procedures and Routers are the core building blocks of ORPC. While a **Procedure** is the atomic unit of logic and a **Router** is a structural collection, they are fundamentally connected: **every procedure is also a minimal router**. This shared identity allows for a consistent API across your entire service definition.

### Procedure: The Building Block

A procedure is an enhanced function wrapper with built-in support for validation, middleware, dependency injection, and extensibility.

#### Anatomy of a Procedure
The builder pattern starting with `os` allows for clear, declarative definitions:

```ts
import { os } from '@orpc/server'
import * as z from 'zod' // Example schema library

const example = os
  .use(loggingMiddleware)                 // 1. Apply middleware
  .input(z.object({ name: z.string() }))  // 2. Define input validation
  .use(authMiddleware)                    // 3. Chain more middleware (can use typed input)
  .output(z.object({ id: z.number() }))   // 4. Define output validation
  .handler(async ({ input, context }) => {
    // 5. Execution logic
    return { id: 1 }
  })
  .callable()   // Make callable like a regular function
  .actionable() // Server Action compatibility
```

*Note: Only `.handler()` is strictly required.*

#### Input/Output Validation
ORPC supports [Zod](https://github.com/colinhacks/zod), [Valibot](https://github.com/fabian-hiller/valibot), [Arktype](https://github.com/arktypeio/arktype), and any [Standard Schema](https://github.com/standard-schema/standard-schema) library.

**Native `type` Utility:**
For simple use cases without external libraries, use ORPC's built-in `type` utility:

```ts
import { os, type } from '@orpc/server'

const simple = os
  .input(type<{ value: number }>())
  .output(type<{ value: number }, number>(({ value }) => value))
  .handler(async ({ input }) => input)
```

#### Initial Configuration (`.$input`)
You can customize or strictly enforce the initial input schema using `.$input`. Unlike `.input`, this allows redefining the schema after initial configuration (e.g., ensuring `void` input).

```ts
const base = os.$input(z.void())
// or
const base = os.$input<Schema<void, unknown>>()
```

#### Reusability (Builder Pattern)
Every modification to a procedure builder creates a **completely new instance**. This immutability allows you to safely create "base procedures" (e.g., `publicProcedure`, `protectedProcedure`) and extend them without side effects on the original definition.

---

### Router: The Organization

Routers are plain JavaScript objects that structure procedures into hierarchies. Because they share the same DNA as procedures, they can be modified using the same builder patterns.

#### Extending Router (Middleware)
You can apply middleware to an entire group of procedures by wrapping the router definition with `os.use()`.

```ts
// All procedures in this router will inherit the authMiddleware
const protectedRouter = os.use(authMiddleware).router({
  getUser: getUserProcedure,
  updateUser: updateUserProcedure,
});
```

*Warning: If middleware is applied at both the router and procedure level, it will execute twice.*

#### Lazy Loading
To optimize startup time and enable code splitting, routers can be lazy-loaded. ORPC provides two primary methods:

**1. `os.lazy()` (Builder-integrated)**
   - **Usage**: `os.lazy(() => import('./module'))`
   - **Pros**: Inherits configuration directly from the builder `os`.
   - **Cons**: Slightly slower inference; requires matching [Initial Context](/docs/context#initial-context).

**2. `lazy()` (Standalone - Recommended)**
   - **Usage**: `import { lazy } from '@orpc/server'; lazy(() => import('./module'))`
   - **Pros**: Faster type inference; decouples from specific builder context.
   - **Cons**: Does not inherit builder-specific context requirements automatically.

```ts
import { lazy } from '@orpc/server';

const router = {
  // 'planet' routes are loaded only when accessed
  planet: lazy(() => import('./planet')),
};
```

---

### Shared Capabilities (Type Utilities)

**Every procedure is also a router.**
This means oRPC treats a single Procedure as a minimal, single-node Router. Consequently, you do not need separate utilities for procedures; the "Router" utilities work universally but adapt their output:

*   **On a Router**: Returns a nested object matching the router structure (e.g., `{ user: { create: InputType } }`).
*   **On a Procedure**: Returns the direct type for that procedure (e.g., `InputType`).

**Available Utilities:**
*   `InferRouterInputs<T>`: Infers expected input types.
*   `InferRouterOutputs<T>`: Infers expected output types.
*   `InferRouterInitialContexts<T>`: Infers required initial context.
*   `InferRouterCurrentContexts<T>`: Infers the full execution context passed to handlers.

```ts
import type { InferRouterInputs } from '@orpc/server';

type Inputs = InferRouterInputs<typeof router>;
type FindPlanetInput = Inputs['planet']['find'];
```

## 3. Server & Client (The Communication)

*The flow of data.*

At its heart, RPC is a simple conversation between a **Producer** (Server) and a **Consumer** (Client). The **Procedure** serves as the contract for this conversation, defining exactly what can be asked and what will be answered.

### The Essence of RPC
1.  **Server (Producer)**: Defines and implements the logic (Procedures).
2.  **Client (Consumer)**: Invokes the logic remotely.
3.  **Contract**: The shared type definitions (Inputs/Outputs) that ensure both sides speak the same language.

### Server (The Producer)
The Server exposes your Router via the **RPCHandler**, acting as the global entry point.

*   **RPCHandler**: The engine for routing and execution.
*   **Interceptors**: Global hooks (e.g., `onError`) for all requests.
*   **Adapters**: Bridges for specific runtimes (Node, MessagePort).

```ts
import { RPCHandler, onError } from '@orpc/server';

const handler = new RPCHandler(router, {
  // Global Interceptors: Run for ALL requests
  interceptors: [
    onError(({ error }) => console.error('Global Error:', error))
  ],
});

// Runtime Usage (via Adapter)
handler.handle(request, {
  context: { db: ... } // Inject Initial Context here
});
```

### Client (The Consumer)
The Client provides a type-safe interface to invoke your procedures. oRPC supports two distinct client modes:

1.  **External Client (Client-Side)**: connect to a remote server (e.g., Renderer -> Main). It uses an **RPCLink** (Transport Adapter) to send requests via HTTP, MessagePort, etc.
2.  **Internal Client (Server-Side)**: For calling procedures within the same environment (e.g., Module A -> Module B). It bypasses network serialization for maximum performance.

*For implementation details, see the [Client Guide](client.md).*

```ts
// External Client Example
const client = createORPCClient<typeof router>(new RPCLink({ ... }));
await client.users.find({ id: '1' }); // Fully typed!
```

### The Connection (Type-Safe without Shared Code)
The magic of oRPC lies in how these two connect. The Client imports **only the type definitions** of the Router, not the actual implementation code.

`Client` --(Types Only)--> `Router Definition` <--(Implementation)-- `Server`

This ensures that your client bundle remains small (no server code included) while maintaining 100% type safety. If you change a procedure on the Server, the Client will immediately show a type error if it doesn't match the new contract.

## 4. Middleware & Context

*Separating logic (Middleware) from state (Context).*

While often used together, these are distinct concepts: **Context** is the state available to your procedures (Dependency Injection), while **Middleware** is the logic that intercepts execution (Aspect-Oriented Programming).

### Part A: Context (The State)
Context provides a type-safe way to inject dependencies into your procedures. It comes in two forms:

**1. Initial Context (Environment Contract)**
Dependencies that *must* be provided explicitly when the request starts (e.g., in your server adapter).
*   **Define**: `os.$context<{ dbUrl: string }>()`
*   **Provide**: In `handler.handle(req, { context: ... })`

**2. Execution Context (Runtime State)**
Dependencies derived during the request lifecycle (e.g., `user` derived from `headers`). These are usually injected by middleware.

### Part B: Middleware (The Logic)
Middleware allows you to wrap the execution of a procedure to add reusable logic.

**Definition & Usage**
```ts
// Standard Definition
const loggingMid = os.middleware(async ({ next, path, input }) => {
  console.log(`[${path}] Input:`, input);
  const result = await next();
  return result;
});

// Inline Usage
const procedure = os.use(async ({ next }) => next());
```

**Built-in Lifecycle Hooks**
oRPC includes helpers for common scenarios: `onStart`, `onSuccess`, `onError`, `onFinish`.

**Advanced Capabilities**

1.  **Input Access & Adaptation (`.mapInput`)**
    Middleware can read inputs to perform logic (e.g., permissions). Use `.mapInput` to adapt a middleware to work with different input shapes.
    ```ts
    const canUpdate = os.middleware(async ({ next }, input: number) => {
      // Check if user can update resource ID
      return next();
    });

    // Reuse it on an object input by mapping the field
    const mappedCanUpdate = canUpdate.mapInput((input: { id: number }) => input.id);
    ```

2.  **Output Modification (e.g., Caching)**
    Middleware runs *after* the handler returns, allowing you to modify or cache the result.
    ```ts
    const cacheMiddleware = os.middleware(async ({ next, path }, input, output) => {
      const key = path.join('/') + JSON.stringify(input);
      if (db.has(key)) return output(db.get(key)); // Return cached

      const result = await next();
      db.set(key, result.output); // Cache result
      return result;
    });
    ```

3.  **Concatenation**
    Combine multiple middleware functions into a single reusable unit using `.concat()`.
    *Tip: Use `.mapInput` to align input types if they differ before concatenating.*
    ```ts
    const stack = logMiddleware
      .concat(authMiddleware)
      .concat(mappedCanUpdate);
    ```

### Part C: The Synergy (Context via Middleware)
The most powerful pattern is using Middleware to **transform** Initial Context into Execution Context.

**1. Injection (Transforming State)**
Middleware can consume Initial Context to create and inject new dependencies.
```ts
const dbMiddleware = os.middleware(async ({ context, next }) => {
  // Use Initial Context (env) to create Execution Context (db)
  const db = new Client(context.env.DB_URL);
  
  // Pass to next step. This MERGES with existing context.
  return next({
    context: { db } 
  });
});
```

**2. Guarding (Protecting State)**
Middleware can enforce that specific context exists or is valid.
```ts
const authMiddleware = os.middleware(async ({ context, next }) => {
  if (!context.user) throw new ORPCError('UNAUTHORIZED');
  return next();
});
```

**3. Declaring Dependencies**
Middleware itself can define requirements using `.$context()`, ensuring it's only used where those dependencies exist.
```ts
// This middleware will cause a type error if used without 'db' in context
const userRepoMiddleware = os.$context<{ db: Database }>().middleware(...);
```

## 5. Server-Sent Events (SSE)

*Real-time streaming via standard Async Generators.*

oRPC embraces a "Zero-API" philosophy for streaming. It leverages standard JavaScript **Async Generators**, making remote streams feel just like local loops.

### 1. Overview (The Standard Approach)
You don't need special methods to start streaming. If your handler is an `async function*` (generator), oRPC automatically treats it as an SSE stream.
*   **Server**: `yield` data to send events.
*   **Client**: Use `for await...of` to consume them.

### 2. Type Safety (`eventIterator`)
To validate the streamed data, wrap your output schema with `eventIterator`. This ensures every `yield` matches your contract.
```ts
import { eventIterator } from '@orpc/server';
const procedure = os
  .output(eventIterator(z.object({ status: z.string() }))) // Validate stream items
  .handler(async function* () {
    yield { status: 'loading' };
  });
```

### 3. Reconnection & Metadata
To support robust reconnection (e.g., resuming after network loss), use `lastEventId` and `withEventMeta`.
*   **Server**: Attach an ID to events using `withEventMeta`.
*   **Client**: When reconnecting, the client automatically sends the `lastEventId` it received.

```ts
import { withEventMeta } from '@orpc/server';

const stream = os.handler(async function* ({ lastEventId }) {
  // Logic to resume from 'lastEventId' if present...
  
  yield withEventMeta(
    { data: 'hello' }, 
    { id: 'msg-1', retry: 5000 } // Client will retry in 5s if disconnected
  );
});
```

### 4. Resource Management (Cleanup)
Since streams are long-lived, it's critical to clean up resources (like DB listeners) when the client disconnects. Use standard `try...finally` blocks.
```ts
const liveUpdates = os.handler(async function* ({ signal }) {
  const listener = db.subscribe();
  try {
    while (!signal.aborted) {
      const data = await listener.next();
      yield data;
    }
  } finally {
    // Executed when client disconnects or stream ends
    listener.unsubscribe();
  }
});
```

### 5. Broadcasting (`EventPublisher`)
For "one-to-many" scenarios (like chat rooms or global notifications), use the `EventPublisher` helper.
```ts
import { EventPublisher } from '@orpc/server';
const chatRoom = new EventPublisher<{ message: string }>();

// Publisher: Broadcast to all listeners
chatRoom.publish('general', { message: 'Hello All' });

// Subscriber: Yield events to the specific client
const joinChat = os.handler(async function* ({ signal }) {
  for await (const msg of chatRoom.subscribe('general', { signal })) {
    yield msg;
  }
});
```

## 6. Advanced Features

*Capabilities for production-grade APIs.*

### Error Handling
oRPC provides a robust error system using the `ORPCError` class.

*   **Normal Approach**: Throw `ORPCError` anywhere in your middleware or handler. Standard errors are automatically converted to `INTERNAL_SERVER_ERROR`.
*   **Type-Safe Approach**: Predefine allowed errors using `.errors()`. This allows clients to handle specific error codes with full type safety and auto-completion.
    *   *Security Note*: Data in `ORPCError.data` is sent to the client; avoid sensitive information.

### File Operations
oRPC natively supports standard **File** and **Blob** objects. You can include files directly in your input or output schemas, even nested within complex objects or arrays.

```ts
const upload = os
  .input(z.object({ file: z.instanceof(File), description: z.string() }))
  .handler(async ({ input }) => {
    // Process input.file
    return { status: 'ok' };
  });
```
*Tip: For massive files (>100MB), consider specialized streaming solutions as oRPC doesn't handle chunked uploads natively.*

### Metadata
Procedures support metadata (key-value pairs) that can be used to customize behavior without changing the procedure's logic.
*   **Definition**: Use `.$meta<T>()` on the builder to define the metadata type.
*   **Usage**: Middleware can access `procedure['~orpc'].meta']` to toggle features. For example, a middleware can check for a `{ cache: true }` flag to decide whether to cache a result.
```ts
const base = os.$meta<{ cache?: boolean }>();
const cachedProc = base.meta({ cache: true }).handler(...);
```