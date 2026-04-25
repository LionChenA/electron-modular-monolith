import { QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { queryClient } from '../infra/query-client';

export interface OrpcProviderProps {
  children: ReactNode;
}

/**
 * Provides the TanStack Query context required by oRPC hooks.
 */
export function OrpcProvider({ children }: OrpcProviderProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
