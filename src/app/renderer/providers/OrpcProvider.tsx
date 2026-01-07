import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export interface OrpcProviderProps {
  children: ReactNode;
}

/**
 * Provides the TanStack Query context required by oRPC hooks.
 */
export function OrpcProvider({ children }: OrpcProviderProps) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
