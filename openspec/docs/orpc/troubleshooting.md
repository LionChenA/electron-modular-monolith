# Troubleshooting

Common issues and solutions when working with ORPC.

## Type Errors

### `NestedClient` Constraint Validation Failed

**Error Message:**
```text
Type '...' does not satisfy the constraint 'NestedClient<any>'.
Property '...' is incompatible with index signature.
Type 'ContractProcedureBuilderWithOutput<...>' is not assignable to type 'NestedClient<any>'.
```

**Cause:**
You are creating an ORPC client using a Contract object (Contract-First mode), but `createORPCClient` expects a Router structure. The Contract object contains `ContractProcedureBuilder` instances, which TypeScript doesn't automatically map to client functions in the generic constraint check.

**Solution:**
Use the `ContractRouterClient` utility type to explicitly define the expected client structure.

```typescript
import type { ContractRouterClient } from '@orpc/contract';

// ❌ Incorrect: Generic inference fails on Contract objects
const client = createORPCClient<typeof contract>(link);

// ✅ Correct: Explicitly define the client type
const client: ContractRouterClient<typeof contract> = createORPCClient(link);
```

### Argument of type 'void' is not assignable to parameter of type '...'

**Cause:**
Your procedure has no input defined (or implicit `unknown`), but the client call expects an argument.

**Solution:**
In Contract-First mode, explicit is better than implicit. If a procedure takes no arguments, define the input as `z.void()`.

```typescript
// contract.ts
export const contract = oc.router({
  ping: oc.input(z.void()).output(z.string())
});

// client usage
await client.ping(); // Now valid without arguments
```
