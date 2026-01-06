# Client Guide

**Dependencies:** `@orpc/client`, `@orpc/server`, `@orpc/contract`
**Key APIs:** `createORPCClient`, `RPCLink`, `safe`, `isDefinedError`, `createSafeClient`, `consumeEventIterator`, `DynamicLink`, `createRouterClient`, `call`, `os.callable`

This guide covers how to consume your procedures from both the Frontend (Client-Side) and the Backend (Server-Side).

## 1. Server-Side Client (Internal)

Server-Side clients are used when you need to call procedures within the same environment (e.g., one Main Process module calling another). This bypasses serialization and transport overhead.

### Calling Mechanisms

oRPC provides three ways to invoke a procedure internally:

**A. Using `.callable()`**
Mark a procedure as callable during definition to use it as a standard async function.
```ts
const getProc = os.handler(async ({ input }) => ...).callable();
const result = await getProc(input);
```

**B. Using the `call` Utility**
Invoke any procedure without marking it as callable.
```ts
import { call } from '@orpc/server';
const result = await call(myProcedure, input, { context: {} });
```

**C. Using `createRouterClient`**
Create a type-safe proxy for an entire router. Ideal for cross-module calls using object paths.
```ts
import { createRouterClient } from '@orpc/server';
const client = createRouterClient(router, {
  context: (clientCtx) => ({ ... }) // Map client call context to procedure context
});
await client.user.find({ id: '1' });
```

### Lifecycle & Middleware Order

By default, middlewares run based on their registration order relative to validation. 
- Middleware before `.input()` -> Runs before validation.
- Middleware after `.input()` -> Runs after validation.

To force **all** middlewares to run after input validation (ensuring middlewares only process valid data), use `$config`:

```ts
const base = os.$config({
  initialInputValidationIndex: Number.NEGATIVE_INFINITY,
  initialOutputValidationIndex: Number.NEGATIVE_INFINITY,
});
```

---

## 2. Client-Side Client (External)

Used when the consumer is in a different process (e.g., Renderer calling Main). It creates a type-safe proxy that feels like calling local functions.

### Initialization

The client requires an **RPCLink** (the transport) and a **Router/Contract definition** (the type source).

```ts
import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/fetch'; // or /message-port
import type { router } from './server';

const link = new RPCLink({
  url: 'http://localhost:3000/rpc',
  headers: () => ({ authorization: '...' }),
});

// Option A: Create from Router (Directly shared types)
const client = createORPCClient<typeof router>(link);

// Option B: Create from Contract (Decoupled definition)
const client = createORPCClient<typeof contract>(link);
```

### Merging Clients
Clients are just objects. You can easily merge multiple clients (e.g., from different microservices) into a single unified object.

```ts
export const orpc = {
  auth: createORPCClient<typeof authRouter>(authLink),
  users: createORPCClient<typeof userRouter>(userLink),
};
```

### Type Inference Utilities
oRPC provides a suite of utilities to extract types directly from your client instance for use in your UI logic.

*   **`InferClientInputs<T>`**: Recursively extracts all input types.
*   **`InferClientOutputs<T>`**: Recursively extracts all output types.
*   **`InferClientErrors<T>`**: Extracts error types per endpoint.
*   **`InferClientErrorUnion<T>`**: Creates a union of all possible errors from the entire client (useful for global error handlers).
*   **`InferClientContext<T>`**: Extracts the required client-side context.

```ts
import type { InferClientInputs, InferClientErrorUnion } from '@orpc/client';

type Inputs = InferClientInputs<typeof client>;
type AllPossibleErrors = InferClientErrorUnion<typeof client>;
```

---

## 3. Error Handling

oRPC enables type-safe error handling on the client, allowing you to catch and inspect errors defined in your Contract/Router.

### The `safe` Helper
The `safe` utility wraps a call and returns a tuple (or object) containing the error and data, avoiding `try/catch` blocks.

```ts
import { safe, isDefinedError } from '@orpc/client';

const [error, data] = await safe(client.user.find({ id: '123' }));

if (error) {
  if (isDefinedError(error)) {
    // 'error' is now typed based on your .errors() definition
    console.error('Known Error:', error.code, error.data);
  } else {
    console.error('Unknown Error:', error);
  }
} else {
  console.log('Success:', data);
}
```

### `createSafeClient`
To avoid wrapping every call manually, you can create a "Safe Client" where every method automatically returns the `[error, data]` pattern.

```ts
import { createSafeClient } from '@orpc/client';

const safeClient = createSafeClient(client);

// All calls now use the safe pattern
const [error, user] = await safeClient.user.find({ id: '123' });
```

---

## 4. Streaming (Event Iterator)

Procedures that return an `eventIterator` (SSE) provide an async generator on the client.

### Basic Iteration
Simply use a `for await...of` loop to consume events as they arrive.

```ts
const iterator = await client.tasks.progress({ taskId: '123' });

for await (const event of iterator) {
  console.log('Progress:', event.percent);
}
```

### Stopping the Stream
You can terminate a stream using an **AbortSignal** or by calling `.return()` on the iterator instance.

```ts
const controller = new AbortController();
const iterator = await client.stream(undefined, { signal: controller.signal });

// Option A: Abort via signal
controller.abort();

// Option B: Manual return
await iterator.return();
```

### Lifecycle Helper (`consumeEventIterator`)
For a more declarative approach (ideal for React `useEffect`), use `consumeEventIterator`.

```ts
import { consumeEventIterator } from '@orpc/client';

const stop = consumeEventIterator(client.stream(), {
  onEvent: (event) => console.log('Event:', event),
  onError: (err) => console.error('Stream Error:', err),
  onFinish: () => console.log('Stream Completed'),
});

// To stop listening:
await stop();
```

---

## 5. RPCLink & DynamicLink

The **Link** is the actual transport mechanism. It determines *how* the data moves from the client to the server.

### RPCLink (Standard Transport)
Most commonly used with HTTP/Fetch or specialized adapters like MessagePort.

**Configuration Example:**
```ts
const link = new RPCLink({
  url: 'http://localhost:3000/rpc',
  headers: () => ({ authorization: 'Bearer ...' }),
  // Custom fetch for browser/node specifics
  fetch: (url, init) => globalThis.fetch(url, init),
  // Global client-side interceptors
  interceptors: [
    onError((error) => console.error('Transport Error:', error))
  ],
});
```

### Passing Client Context
You can define a `ClientContext` type to pass information from the call site directly into the Link logic.

```ts
interface MyContext { apiKey?: string }

const link = new RPCLink<MyContext>({
  headers: ({ context }) => ({ 'x-api-key': context?.apiKey ?? '' })
});

// Pass context during call
await client.ping(input, { context: { apiKey: 'secret' } });
```

### DynamicLink (Multiplexing)
`DynamicLink` allows you to choose different links at runtime based on the context, path, or input.

```ts
import { DynamicLink } from '@orpc/client';

const link = new DynamicLink<MyContext>((options, path) => {
  if (options.context?.useBackup) return backupLink;
  return primaryLink;
});
```

---

*Note: For automatic stream reconnection, refer to the **Client Retry Plugin**.*
