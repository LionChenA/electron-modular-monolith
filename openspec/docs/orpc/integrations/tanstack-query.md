# TanStack Query Integration

**Dependencies:** `@orpc/tanstack-query`, `@tanstack/react-query`
**Key APIs:** `createTanstackQueryUtils`, `queryOptions`, `mutationOptions`, `liveOptions`

oRPC provides a seamless integration with **TanStack Query** (React Query), acting as a bridge that generates type-safe query options and keys. This allows you to manage server state (Main Process data) with caching, deduplication, and background updates.

## 1. Setup

Create the integration utilities by wrapping your oRPC client.

```ts
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { orpcClient } from './client'; // Your standard oRPC client

export const orpc = createTanstackQueryUtils(orpcClient);
```

*Tip: You can pass `{ path: ['baseKey'] }` as a second argument to prefix all query keys, preventing conflicts if you have multiple clients.*

## 2. Core Hooks

The integration generates options objects compatible with standard TanStack Query hooks.

### Queries (`useQuery`)
Use `.queryOptions` to generate the query key and fetcher.

```ts
import { useQuery } from '@tanstack/react-query';

const { data } = useQuery(
  orpc.planet.find.queryOptions({
    input: { id: 123 },
    // You can also pass initial context here
    context: { cache: true }, 
    // Standard TanStack Query options (staleTime, etc.)
    staleTime: 1000 * 60, 
  })
);
```

### Mutations (`useMutation`)
Use `.mutationOptions`.

```ts
import { useMutation } from '@tanstack/react-query';

const mutation = useMutation(
  orpc.planet.create.mutationOptions({
    onSuccess: () => {
      console.log('Planet created!');
    },
  })
);

// Call with input
mutation.mutate({ name: 'Mars' });
```

### Infinite Queries (`useInfiniteQuery`)
Use `.infiniteOptions` for pagination.

```ts
import { useInfiniteQuery } from '@tanstack/react-query';

const query = useInfiniteQuery(
  orpc.planet.list.infiniteOptions({
    input: (pageParam) => ({ limit: 10, cursor: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })
);
```

## 3. Cache Management (Keys)

oRPC provides helpers to generate standard query keys for invalidation or manual updates.

| Method | Purpose |
| :--- | :--- |
| `.key()` | The base key for the procedure (e.g., `['planet', 'find']`). |
| `.queryKey(input)` | The specific key including input (e.g., `['planet', 'find', { input: { id: 1 } }]`). |

```ts
const queryClient = useQueryClient();

// Invalidate ALL 'planet.find' queries
queryClient.invalidateQueries({ 
  queryKey: orpc.planet.find.key() 
});

// Update specific data manually
queryClient.setQueryData(
  orpc.planet.find.queryKey({ input: { id: 123 } }),
  (old) => ({ ...old, name: 'New Name' })
);
```

## 4. Streaming (SSE)

For procedures that use **Event Iterators** (SSE), oRPC provides specialized options.

*   **`liveOptions`**: Returns the **latest** event (useful for real-time status).
*   **`streamedOptions`**: Returns an **array** of all events (useful for logs).

```ts
// Real-time status update
const { data: status } = useQuery(
  orpc.tasks.progress.liveOptions({ input: { taskId: 'abc' } })
);
```

## 5. Advanced Features

### Conditional Queries (`skipToken`)
Use `skipToken` to strictly type-check disabled queries (instead of `enabled: false`).

```ts
import { skipToken } from '@tanstack/react-query';

const { data } = useQuery(
  orpc.user.find.queryOptions({ 
    input: userId ? { id: userId } : skipToken 
  })
);
```

### Error Handling
Use `isDefinedError` to check for type-safe contract errors in callbacks.

```ts
import { isDefinedError } from '@orpc/client';

const mutation = useMutation(orpc.user.create.mutationOptions({
  onError: (error) => {
    if (isDefinedError(error)) {
      // TypeScript knows the shape of 'error' from your contract
      toast.error(error.message);
    }
  }
}));
```

### Hydration (SSR/Persistence)
To persist complex types (Date, Map, Set) during hydration (e.g., saving to localStorage or sending from SSR), you must configure the `QueryClient` with `StandardRPCJsonSerializer`.

```ts
import { StandardRPCJsonSerializer } from '@orpc/client/standard';

const serializer = new StandardRPCJsonSerializer();
// Configure 'queryKeyHashFn', 'dehydrate', and 'hydrate' in QueryClient options
// to use 'serializer.serialize' and 'serializer.deserialize'.
```
