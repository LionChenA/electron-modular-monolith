import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

export default defineConfig({
  main: {
    resolve: {
      alias: {
        '@app/main': resolve('src/app/main'),
        '@app/preload': resolve('src/app/preload'),
        '@features': resolve('src/features'),
        '@shared': resolve('src/shared'),
      },
    },
  },
  preload: {
    resolve: {
      alias: {
        '@app/main': resolve('src/app/main'),
        '@app/preload': resolve('src/app/preload'),
        '@features': resolve('src/features'),
        '@shared': resolve('src/shared'),
      },
    },
  },
  renderer: {
    resolve: {
      alias: {
        '@app/main': resolve('src/app/main'),
        '@app/preload': resolve('src/app/preload'),
        '@app/renderer': resolve('src/app/renderer'),
        '@features': resolve('src/features'),
        '@shared': resolve('src/shared'),
      },
    },
    plugins: [react()],
  },
});
