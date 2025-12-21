import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig, swcPlugin } from 'electron-vite';

/**
 * --------------------------------------------------------------------------------
 * ELECTRON-VITE CONFIGURATION
 * --------------------------------------------------------------------------------
 * This configuration file controls the build process for the Main, Preload, and
 * Renderer processes of the Electron application.
 *
 * Documentation: https://electron-vite.org/config/
 * --------------------------------------------------------------------------------
 */

/**
 * Common configuration shared across Main, Preload, and Renderer processes.
 */
const commonConfig = {
  // Path resolution and aliases
  resolve: {
    alias: {
      '@renderer': resolve('src/renderer/src'),
      '@main': resolve('src/main'),
      '@preload': resolve('src/preload'),
    },
    // Extensions to omit when importing (Default shown below)
    // extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json'],
  },

  // Directory for static assets (Default: 'public')
  // publicDir: 'public',

  // Environment variable prefix (Default: 'VITE_')
  // envPrefix: 'VITE_',

  // Global constants replacement (Like webpack DefinePlugin)
  // define: {
  //   __APP_VERSION__: JSON.stringify('v1.0.0'),
  // },

  // Cache directory (Default: 'node_modules/.vite')
  // Note: Stores pre-bundled dependencies.
  // cacheDir: 'node_modules/.vite',
};

/**
 * Shared build configuration for Node.js environments (Main & Preload).
 * NOTE: This is a custom object to avoid repetition, not a built-in API.
 */
const sharedNodeBuildOptions = {
  // [Recommended] Automatically externalize dependencies
  // Option: true | false | ExternalOptions { exclude?: string[], include?: string[] }
  // If true: All dependencies in package.json are treated as external.
  //   - Consequence: Dependencies are NOT bundled. Required at runtime via node_modules.
  //   - Note: Essential for native modules (e.g., sqlite3) to work correctly.
  externalizeDeps: true,

  // [Optional] V8 Bytecode protection (electron-vite v5+)
  // Option: true | false | BytecodeOptions
  // If true: Compiles source code to V8 bytecode in production.
  //   - Consequence: Source code is hidden; startup time is faster.
  //   - Note: Only works in production builds. Debugging becomes harder.
  // bytecode: false,
  //
  // BytecodeOptions: {
  //   chunkAlias?: string | string[],      // Target specific chunks for bytecode
  //   transformArrowFunctions?: boolean,   // Transform arrow functions for compatibility
  //   removeBundleJS?: boolean,            // Remove original JS after bytecode generation
  //   protectedStrings?: string[],         // Strings to encrypt/protect
  // }

  // Minification
  // Option: 'esbuild' | 'terser' | false
  // Default: 'esbuild' (Fastest)
  // minify: 'esbuild',

  // Source Maps
  // Option: true | false | 'inline' | 'hidden'
  // If true: Generates .map files.
  //   - Consequence: Easier debugging but larger build output.
  //   - Note: Usually enabled in dev, disabled in prod.
  // sourcemap: false,

  // Rollup Options
  rollupOptions: {
    // Explicitly externalize modules (If externalizeDeps is not sufficient)
    // external: ['fsevents'],
    output: {
      // Manual chunk splitting (Rarely needed for Node environment)
      // manualChunks: {},
    },
  },
};

export default defineConfig({
  // ==================================================================================================
  // 1. MAIN PROCESS (Node.js Environment)
  // ==================================================================================================
  main: {
    ...commonConfig,

    plugins: [
      // [Optional] SWC Compiler
      // Note: Alternative to esbuild. May offer better performance or decorator support.
      // swcPlugin(),
    ],

    build: {
      ...sharedNodeBuildOptions,

      // Library Mode Configuration
      lib: {
        // Entry point (Default: Auto-detects src/main/{index|main}.{ts|js...})
        entry: 'src/main/index.ts',

        // Output format
        // Note: Electron Main process MUST be CommonJS (CJS).
        formats: ['cjs'],

        // Output filename (Default: 'index.js')
        // fileName: 'index.js',
      },

      // Output directory
      outDir: 'out/main',

      // Empty output directory before build
      emptyOutDir: true,

      // Watcher Options (Only effective when running `electron-vite build --watch`)
      // If set: Rebuilds main process on file changes without restarting dev server.
      // watch: {},
    },
  },

  // ==================================================================================================
  // 2. PRELOAD SCRIPTS (Node.js + Browser Sandbox Environment)
  // ==================================================================================================
  preload: {
    ...commonConfig,

    build: {
      ...sharedNodeBuildOptions,

      // [Experimental] Isolated Entries - Required for multi-entry preload with sandbox
      // Option: true | false (Default: false)
      // If true: Each entry built as standalone bundle (no code splitting).
      //   - Use case: Multi-entry preload scripts (e.g., browser.js, webview.js)
      //   - Prerequisite: For Electron sandbox support with multiple preload entries.
      //   - Note: MUST set externalizeDeps: false when enabled for sandbox to work.
      // See: https://electron-vite.org/guide/isolated-build
      // isolatedEntries: false,
      // externalizeDeps: false, // Required when isolatedEntries is true

      lib: {
        // Entry point (Default: Auto-detects src/preload/{index|preload}.{ts|js...})
        entry: 'src/preload/index.ts',
        // Note: Preload scripts are typically CommonJS.
        formats: ['cjs'],
      },

      outDir: 'out/preload',
      emptyOutDir: true,
    },
  },

  // ==================================================================================================
  // 3. RENDERER PROCESS (Browser/Chromium Environment)
  // ==================================================================================================
  renderer: {
    ...commonConfig,

    // Root directory for renderer source
    root: 'src/renderer',

    // Base public path
    // Note: Must be './' (relative) to support file:// protocol in Electron.
    base: './',

    plugins: [
      react(),
      // [Optional] Legacy browser support
      // legacyPlugin(),
    ],

    build: {
      // Output directory
      outDir: 'out/renderer',

      // Directory for nested assets (Relative to outDir)
      assetsDir: 'assets',

      // Asset inlining threshold (Default: 4096 bytes)
      // If file size < limit: Inlined as base64.
      // If file size > limit: Copied as file.
      // assetsInlineLimit: 4096,

      // CSS Code Splitting (Default: true)
      // If true: CSS is extracted to separate files.
      // If false: CSS is injected via JS strings.
      // cssCodeSplit: true,

      // [Experimental] Isolated Entries - Performance optimization for multi-page apps
      // Option: true | false (Default: false)
      // If true: Each entry built as standalone bundle (no code splitting).
      //   - Benefit: Reduces chunk count, improves loading performance.
      //   - Use case: Multi-window apps with separate HTML entries.
      // See: https://electron-vite.org/guide/isolated-build
      // isolatedEntries: false,

      // Rollup Options
      rollupOptions: {
        input: {
          // Default SPA entry point
          index: resolve('src/renderer/index.html'),
          // [Optional] Multi-window / Multi-page entries
          // settings: resolve('src/renderer/settings.html'),
        },
      },

      // Source Maps (Default: false in prod)
      sourcemap: false,

      // Minification (Default: 'esbuild')
      minify: 'esbuild',

      // Chunk Size Warning Limit (Default: 500 kbs)
      // chunkSizeWarningLimit: 500,
    },

    // Development Server (HMR)
    server: {
      // Port (Default: Auto-assigned)
      // port: 5173,
      // HTTPS (Default: false)
      // If true: Enables TLS for dev server.
      // https: false,
      // Strict Port (Default: false)
      // If true: Fails if port is busy.
      // If false: Tries next available port.
      // strictPort: false,
      // Proxy configuration for API requests
      // proxy: {
      //   '/api': {
      //     target: 'http://localhost:3000',
      //     changeOrigin: true,
      //   }
      // },
      // File System Watcher options
      // watch: {
      //   ignored: ['!**/node_modules/your-package/**']
      // }
    },

    // Dependency Optimization (Pre-bundling)
    // optimizeDeps: {
    //   include: ['lodash'],
    //   exclude: ['some-external-lib'],
    // },
  },
});
