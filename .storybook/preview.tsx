import type { Preview } from '@storybook/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import '../src/app/renderer/index.css';

const preview: Preview = {
  decorators: [
    (Story) => {
      const [queryClient] = useState(
        () =>
          new QueryClient({
            defaultOptions: { queries: { staleTime: 60 * 1000 } },
          }),
      );

      return (
        <QueryClientProvider client={queryClient}>
          <div className="dark">
            <Story />
          </div>
        </QueryClientProvider>
      );
    },
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
