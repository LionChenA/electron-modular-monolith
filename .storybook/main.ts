import type { StorybookConfig } from '@storybook/react-vite';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(js|jsx|ts|tsx)', '../src/**/*.mdx'],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    return {
      ...config,
      resolve: {
        ...config.resolve,
        alias: {
          ...(config.resolve?.alias || {}),
          '@src': resolve(__dirname, '../src'),
          '@app/renderer': resolve(__dirname, '../src/app/renderer'),
          '@app/main': resolve(__dirname, '../src/app/main'),
          '@app/preload': resolve(__dirname, '../src/app/preload'),
          '@features': resolve(__dirname, '../src/features'),
          '@shared': resolve(__dirname, '../src/shared'),
        },
      },
    };
  },
};

export default config;
