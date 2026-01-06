# Contract-First Development

**Dependencies:** `@orpc/contract`, `@orpc/server`
**Key APIs:** `oc`, `implement`, `InferContractRouterInputs`

*Decoupling definition from implementation.*

Contract-first development allows you to define your API rules (the Contract) before writing any implementation code. This enables frontend and backend teams to work in parallel based on a shared agreement.

## 1. Philosophy
The workflow follows a clear 3-step process:
1.  **Define**: Agree on a contract (Input/Output/Errors) using `@orpc/contract`.
2.  **Implement**: The backend fulfills the contract using `@orpc/server`.
3.  **Consume**: The frontend uses the contract for type-safe calls immediately.

## 2. Defining the Contract (`@orpc/contract`)
Use the `oc` builder (similar to `os`) to define contracts without implementation handlers.

```ts
import { oc } from '@orpc/contract';
import * as z from 'zod';

// 1. Define Procedure Contract
const findUserContract = oc
  .input(z.object({ id: z.string() }))
  .output(z.object({ name: z.string() }));

// 2. Define Contract Router
export const userContract = {
  find: findUserContract,
};
```

### Type Inference Utilities
These utilities are critical for the frontend to start development **before** the backend is ready.

*   **`InferContractRouterInputs<T>`**: Extract input types.
*   **`InferContractRouterOutputs<T>`**: Extract output types.

```ts
import type { InferContractRouterInputs } from '@orpc/contract';
type Inputs = InferContractRouterInputs<typeof userContract>;
```

## 3. Implementing the Contract (`@orpc/server`)
Implementation is nearly identical to standard procedure definition. The only difference is that you start by **implementing** a contract node instead of defining inputs/outputs from scratch.

```ts
import { implement } from '@orpc/server';
import { userContract } from './contract';

// Create an implementer instance from the contract
const os = implement(userContract);

// 1. Implement individual procedures
// Note: Input/Output validation is inherited from the contract
export const findUser = os.find.handler(async ({ input }) => {
  return { name: 'John Doe' };
});

// 2. Assemble the Router (Crucial Step)
// This verifies that ALL procedures in the contract are implemented.
// Missing procedures will cause a type error here.
export const router = os.router({
  find: findUser,
});
```

### Lazy Router Compatibility
You can implement contracts using Lazy Routers for code-splitting optimizations. However, if you need to inspect the full router structure at runtime (e.g., for generating an OpenAPI spec from the router), you must resolve it first.

```ts
import { unlazyRouter } from '@orpc/server';
// Resolves all lazy routes to get the full structure
const resolvedRouter = await unlazyRouter(router);
```

## 4. Refactoring: Router to Contract
If you have already implemented procedures using the standard approach (`os.handler`), you can refactor them into a contract-first structure.

This involves extracting the schemas into a separate contract file (`@orpc/contract`) and then using `.implement()` in your existing server code. This is useful for improving decoupling or sharing types with a client that doesn't have access to your server implementation.

*For detailed refactoring steps, refer to: [Router to Contract Guide](https://orpc.dev/docs/contract-first/router-to-contract)*
