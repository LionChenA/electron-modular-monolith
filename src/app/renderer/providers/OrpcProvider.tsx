import { OrpcProvider as BaseOrpcProvider } from '@orpc/react';
import { orpc as orpcUtils } from '@renderer/infra/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type ReactNode, useState } from 'react';

export interface OrpcProviderProps {
  children: ReactNode;
}

export function OrpcProvider({ children }: OrpcProviderProps) {
  // Create a stable QueryClient instance
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <BaseOrpcProvider utils={orpcUtils}>{children}</BaseOrpcProvider>
    </QueryClientProvider>
  );
}
