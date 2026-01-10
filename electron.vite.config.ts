import { resolve } from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

export default defineConfig({
  main: {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/app/main/index.ts'),
        formats: ['cjs'],
      },
    },
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
    build: {
      lib: {
        entry: resolve(__dirname, 'src/app/preload/index.ts'),
        formats: ['cjs'],
      },
    },
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
    root: resolve(__dirname, 'src/app/renderer'),
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/app/renderer/index.html'),
        },
      },
    },
    resolve: {
      alias: {
        '@app/main': resolve('src/app/main'),
        '@app/preload': resolve('src/app/preload'),
        '@app/renderer': resolve('src/app/renderer'),
        '@src': resolve('src'),
        '@features': resolve('src/features'),
        '@shared': resolve('src/shared'),
      },
    },
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'html-csp-transform',
        transformIndexHtml(html): string {
          const devCSP =
            "default-src 'self'; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data:";
          const prodCSP =
            "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:";
          const csp = process.env.NODE_ENV === 'development' ? devCSP : prodCSP;
          return html.replace(
            '<!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->',
            `<!-- https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP -->\n    <meta http-equiv="Content-Security-Policy" content="${csp}" />`,
          );
        },
      },
    ],
  },
});
