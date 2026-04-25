# Tool Selection Guide

> [!NOTE]
> This document provides guidance on selecting the right testing tool for each scenario.

## Decision Matrix

Use this matrix to determine which tool to use for your test.

### Question 1: What are you testing?

| If testing... | Use... |
|---------------|--------|
| Pure function with no dependencies | Vitest only |
| Module with external dependencies | Vitest + `vi.mock()` |
| ORPC handler logic | `call()` + mocked context |
| Storage (SQLite, Orama) | `call()` + mocked context or real instance |
| React component with ORPC | `vi.mock('@app/renderer/infra/client')` |
| HTTP transport layer | HTTPLink + MSW |
| Full app (E2E) | Playwright (no mocking) |

### Question 2: Do you need a real database?

| If... | Use... |
|-------|--------|
| Testing storage service logic | `vi.mock()` storage module |
| Testing real SQLite queries | Real SQLite with temp file |
| Testing real Orama search | Real Orama instance |

## Tool Usage Examples

### 1. Unit Test a Pure Function

```typescript
// src/shared/utils/format.test.ts
import { describe, expect, test } from 'vitest';
import { formatBytes } from './format';

test('formats bytes correctly', () => {
  expect(formatBytes(1024)).toBe('1.0 KB');
});
```

### 2. Unit Test with Mocked Dependencies

```typescript
// src/app/main/infra/bus.test.ts
import { describe, expect, test, vi } from 'vitest';
import { EventBus } from './bus';

test('publish sends to subscriber', async () => {
  const bus = new EventBus();
  const mockPublish = vi.fn();
  // ... test with mocked dependencies
});
```

### 3. Integration Test ORPC Handler

```typescript
// src/features/ping/ping.integration.test.ts
import { call } from '@orpc/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setRuntimeContext } from '../../app/main/context';
import { pingRouter } from './main/router';

describe('pingRouter', () => {
  let mockContext: MockContext;

  beforeEach(() => {
    mockContext = createMockContext();
    setRuntimeContext(mockContext as any); // ⚠️ Required!
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns pong', async () => {
    const result = await call(pingRouter.sendPing, undefined, {
      context: mockContext,
    });
    expect(result).toBe('pong');
  });
});
```

### 4. Component Test with TanStack Query

```typescript
// src/app/renderer/components/Versions.test.tsx
import '@testing-library/jest-dom';
import { describe, expect, test } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Versions from './Versions';

// Mock the ORPC client ⚠️ NOT MSW
vi.mock('@app/renderer/infra/client', () => ({
  orpc: {
    general: {
      getVersions: {
        queryOptions: () => ({
          queryKey: ['general', 'getVersions'],
          queryFn: () => Promise.resolve(mockVersions),
        }),
      },
    },
  },
}));

describe('Versions Component', () => {
  test('renders version info', async () => {
    render(<Versions />, { wrapper: createWrapper() });
    await waitFor(() => {
      expect(screen.getByText(/Electron v30.0.0/)).toBeInTheDocument();
    });
  });
});
```

### 5. HTTP Transport Test with MSW

```typescript
// Testing HTTPRPCLink transport layer
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

test('HTTPRPCLink receives correct response', async () => {
  server.use(
    http.post('http://localhost/rpc', () => {
      return HttpResponse.json({
        jsonrpc: '2.0',
        result: { node: '20', chrome: '120', electron: '30' },
        id: '1',
      });
    })
  );

  // Test the HTTP layer directly
  const response = await fetch('http://localhost/rpc', {
    method: 'POST',
    body: JSON.stringify({ jsonrpc: '2.0', method: 'general.getVersions', id: '1' }),
  });

  expect(response.status).toBe(200);
});
```

### 6. E2E Test with Playwright

```typescript
// test/e2e/app.e2e.test.ts
import { test, expect } from '@playwright/test';

test('app loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Electron/);
});
```

## Common Mistakes

| Mistake | Why It's Wrong | Correct Approach |
|---------|---------------|------------------|
| Using MSW for TanStack Query component tests | `queryFn` needs QueryClient context | Use `vi.mock()` |
| Forgetting `setRuntimeContext()` | Context not initialized | Call in `beforeEach` |
| Testing handler through HTTP for unit-like tests | Slow and unnecessary | Use `call()` directly |
| Using real SQLite without mock in CI | Native module version mismatch | Use `vi.mock()` or `:memory:` |
| Leaving debug files | Clutters codebase | Delete before commit |