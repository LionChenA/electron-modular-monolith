import { resolve } from 'node:path';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import react from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'renderer',
          environment: 'jsdom',
          include: [
            'src/app/renderer/**/*.{test,spec}.{ts,tsx}',
            'src/features/**/renderer/**/*.{test,spec}.{ts,tsx}',
          ],
          exclude: ['**/node_modules/**', '**/test/e2e/**', 'src/**/*.stories.tsx'],
          globals: true,
          setupFiles: ['test/vitest.setup.ts'],
        },
        plugins: [react(), tsconfigPaths()],
        resolve: {
          alias: {
            '@app/renderer': resolve(__dirname, 'src/app/renderer'),
            '@app/main': resolve(__dirname, 'src/app/main'),
            '@app/preload': resolve(__dirname, 'src/app/preload'),
            '@features': resolve(__dirname, 'src/features'),
            '@shared': resolve(__dirname, 'src/shared'),
            '@src': resolve(__dirname, 'src'),
          },
        },
      },
      {
        test: {
          name: 'main',
          environment: 'node',
          include: [
            'src/app/main/**/*.{test,spec}.{ts,tsx}',
            'src/shared/**/*.{test,spec}.{ts,tsx}',
            'src/features/**/*.{test,spec}.{ts,tsx}',
            'src/features/**/*integration.test.{ts,tsx}',
          ],
          exclude: ['**/node_modules/**', '**/test/e2e/**', 'src/**/*.stories.tsx'],
          globals: true,
          setupFiles: ['test/vitest.setup.ts'],
        },
        plugins: [tsconfigPaths()],
        resolve: {
          alias: {
            '@app/main': resolve(__dirname, 'src/app/main'),
            '@app/preload': resolve(__dirname, 'src/app/preload'),
            '@features': resolve(__dirname, 'src/features'),
            '@shared': resolve(__dirname, 'src/shared'),
            '@src': resolve(__dirname, 'src'),
          },
        },
      },
      {
        test: {
          name: 'storybook',
          browser: {
            provider: playwright(),
            enabled: true,
            instances: [{ browser: 'chromium' }],
          },
          exclude: ['**/node_modules/**', '**/test/e2e/**'],
          globals: true,
          setupFiles: ['.storybook/vitest.setup.ts'],
        },
        plugins: [storybookTest(), tsconfigPaths()],
        resolve: {
          alias: {
            '@app/renderer': resolve(__dirname, 'src/app/renderer'),
            '@app/main': resolve(__dirname, 'src/app/main'),
            '@app/preload': resolve(__dirname, 'src/app/preload'),
            '@features': resolve(__dirname, 'src/features'),
            '@shared': resolve(__dirname, 'src/shared'),
            '@src': resolve(__dirname, 'src'),
          },
        },
      },
    ],
  },
});
