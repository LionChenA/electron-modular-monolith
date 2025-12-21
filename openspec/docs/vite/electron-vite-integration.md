---
title: "Usage of electron-vite in project"
tags: [electron, vite, build-tool, tooling]
# List of official Context7 documentation IDs used as primary sources.
sources:
  - id: "/websites/electron-vite"
# List of NPM packages from this ecosystem that are USED in our project.
packages:
  - id: "electron-vite"
    description: "Next-generation Electron build tool based on Vite"
---

# Guide: electron-vite

> [!NOTE]
> This document is the project's "compressed cache" of knowledge for **electron-vite**.

<!-- @gemini:summary:start -->

`electron-vite` is a build tool that integrates Vite with Electron, simplifying configuration and optimizing the development and build process for main, preload, and renderer processes.

<!-- @gemini:summary:end -->

## 1. Overview

`electron-vite` acts as a cohesive bridge between **Electron** (the runtime) and **Vite** (the build tool).

- **Vite** is excellent for frontend development (HMR, fast builds) but doesn't natively understand Electron's multi-process architecture (Main vs. Preload vs. Renderer).
- **Electron** requires specific node integration and build steps that standard web bundlers don't handle out-of-the-box.
- **electron-vite** solves this by running Vite instances tailored for each Electron process, managing their communication and build outputs automatically.

## 2. API

`electron-vite` drastically simplifies configuration by using a single file: `electron.vite.config.ts`. Without it, you would typically need separate `vite.config.ts` files for the main, preload, and renderer processes.

**Key Config Structure:**

```typescript
import { defineConfig } from 'electron-vite'

export default defineConfig({
  main: {
    // Config for Main Process (Node.js environment)
  },
  preload: {
    // Config for Preload Scripts (Node.js + Browser sandbox)
  },
  renderer: {
    // Config for Renderer (Web environment, standard Vite config)
    plugins: []
  }
})
```

**Default Entry Points:**

- **Main Process:** Checks `<root>/src/main/{index|main}.{js|ts|mjs|cjs}`
- **Preload Scripts:** Checks `<root>/src/preload/{index|preload}.{js|ts|mjs|cjs}`
- **Renderer:** Checks `<root>/src/renderer/index.html`

**Environment Variables:**

```typescript
// Access in main/preload
process.env.MAIN_VITE_API_URL

// Access in renderer (must use VITE_ prefix)
import.meta.env.VITE_API_URL
```

## 3. Features

### CLI Tools

`electron-vite` provides three primary commands that streamline the workflow:

1.  **`electron-vite dev`**:
    -   Starts the dev server.
    -   Enables HMR for the renderer.
    -   Watches main/preload files and automatically restarts the Electron app (Hot Restart) on changes.
2.  **`electron-vite build`**:
    -   Bundles all processes for production.
    -   Outputs to `out/main`, `out/preload`, and `out/renderer` by default.
    -   Handles tree-shaking and minification.
3.  **`electron-vite preview`**:
    -   Previews the *built* application.
    -   Useful for testing the production build locally before packaging with `electron-builder`.

### Project Structure

`electron-vite` is opinionated but flexible. It automatically scans for entry points in the following default locations. If found, zero configuration is needed; if not, you must manually specify them in `electron.vite.config.ts`.

**Project Layout Example:**

```
src/
├── main/
│   └── index.ts      # Matches default pattern
├── preload/
│   └── index.ts      # Matches default pattern
└── renderer/
    ├── index.html    # Matches default pattern
    └── src/          # React/Vue/etc. source
```

**Customization:**
If your structure differs (e.g., multiple windows or different folder names), you must configure `build.rollupOptions.input` (for renderer) or `build.lib.entry` (for main/preload) in `electron.vite.config.ts`.

### Multi-Window Support

`electron-vite` supports multiple windows by configuring multiple entry points in the **renderer** configuration.

**Implementation:**

1.  Create multiple HTML files (e.g., `index.html`, `settings.html`).
2.  Update `electron.vite.config.ts`:

```typescript
export default defineConfig({
  renderer: {
    build: {
      rollupOptions: {
        input: {
          index: resolve(__dirname, 'src/renderer/index.html'),
          settings: resolve(__dirname, 'src/renderer/settings.html')
        }
      }
    }
  }
})
```

3.  In your Main process, load the specific window:

```typescript
// Dev
mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'] + '/settings.html')
// Production
mainWindow.loadFile(join(__dirname, '../renderer/settings.html'))
```

### Asset Handling

-   **Renderer Process:** Handled by standard Vite asset pipeline. Import images, CSS, etc., as usual.
-   **Main Process:** `electron-vite` optimizes asset handling for the Node.js environment.
    -   **`?asset`**: Import a file as a path string (automatically copied to output).
    -   **`?modulePath`**: Useful for forking child processes or worker threads. It bundles the target module into a separate file and returns its path.

### TypeScript Support

TypeScript is supported out-of-the-box.
-   **Main/Preload:** Uses `esbuild` for fast transpilation during dev and Rollup for build.
-   **Renderer:** Handled by Vite's standard TS support.
-   **Config:** `electron.vite.config.ts` itself is TS-friendly and provides type hints.

### HMR and Hot Reloading

`electron-vite` provides a superior dev experience:
-   **Renderer:** Lightning-fast HMR (Hot Module Replacement) via Vite. Changes in components reflect instantly without page reload.
-   **Main/Preload:** "Hot Restart". When you change the main process code, `electron-vite` quickly recompiles and restarts the Electron app.

### Dependency Handling

This is a critical feature.
-   **Externalization:** `electron-vite` automatically "externalizes" dependencies for Main and Preload processes.
-   **Why?** Dependencies like `serialport` or `sqlite3` are native Node modules. Bundling them often breaks them. Externalizing ensures `require('sqlite3')` works at runtime by keeping them in `node_modules` (or unpacked `app.asar`).
-   **Renderer:** Dependencies are bundled as usual for the browser, unless specified otherwise.

### Isolated Build (Build Isolation)

This is a key feature in newer versions (v5+).

-   **Concept:** Prevents code leakage between processes.
-   **Mechanism:** `electron-vite` treats Main, Preload, and Renderer as completely separate build targets.
-   **Benefit:** Ensures that a change in the Renderer config doesn't accidentally affect the Main process build, and vice-versa. It enforces the security model where the Renderer shouldn't have direct access to Node.js internals (unless bridged).

### Additional Supported Features

#### Source Code Protection
- **Bytecode Caching**: V8 bytecode optimization for faster startup
- **Architecture-aware**: Platform-specific caching (x64, ARM64)
- **Production Enhancement**: Significant performance improvements

#### Electron Forge Integration
- **Packaging**: Out-of-the-box Electron Forge support
- **Distribution**: Automated app packaging and publishing
- **Configuration**: Simple forge.config.cjs setup

#### WebView Support
- **Embedding**: WebView with preload script attachment
- **Configuration**: `will-attach-webview` event handling
- **Use Case**: Complex UI scenarios with embedded web content

#### Utility Process Support
- **Child Processes**: `?modulePath` for process forking
- **Worker Threads**: Background processing support
- **Performance**: Offload CPU-intensive tasks

#### Advanced Asset Processing
- **WebAssembly**: `?loader` suffix for main process WASM
- **Binary Assets**: Optimized handling of binary files
- **Dynamic Imports**: Runtime asset loading

## 4. Application

### Our Project Configuration

**Minimal Setup - Maximum Benefits:**

```typescript
import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'electron-vite';

export default defineConfig({
  main: {},           // All defaults used
  preload: {},        // All defaults used
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
  },
});
```

### Key Design Decisions

1. **Leverage Defaults**: Main and preload use all default settings
2. **React Integration**: Only renderer needs custom configuration
3. **Path Aliasing**: `@renderer/*` for clean imports
4. **Zero Manual Entry**: Auto-detected entry points

### Development Workflow

```bash
# Start development
npm run dev
# → electron-vite dev
# → Builds main/preload
# → Starts Vite dev server (renderer)
# → Launches Electron app

# Make changes
# → Renderer: HMR (instant)
# → Main/Preload: Hot restart

# Build for production
npm run build
# → Type checking
# → electron-vite build
# → Production-ready output
```

### Build Output Structure

```
out/
├── main/          # Main process bundle
├── preload/       # Preload script bundle
└── renderer/      # Renderer bundle (Vite output)
```

### Integration with Our Stack

- **TypeScript**: Native support with type checking
- **React**: Via `@vitejs/plugin-react`
- **Biome**: Code quality (separate from build)
- **electron-builder**: Packaging (invoked post-build)

### Environment Variables and Modes

-   **Modes:** Supports `.env`, `.env.production`, `.env.development`.
-   **Access in Renderer:** `import.meta.env.VITE_SOME_VAR`. (Variables must be prefixed with `VITE_` to be exposed to renderer).
-   **Access in Main/Preload:** `import.meta.env.MAIN_VITE_SOME_VAR` or standard `process.env`.
-   **HTML:** You can use `%VITE_APP_TITLE%` in `index.html`.

## 5. Common Issues

### Issue: Preload script not found

**Symptoms**: Error loading preload script
**Solution**: Ensure `src/preload/index.ts` exists or configure custom entry

### Issue: Main process not restarting on changes

**Symptoms**: Code changes don't reflect
**Solution**: `electron-vite dev` watches by default. If it fails, check if `build.watch` is overridden in config or ensure you are not editing files outside the watched scope (src/main, src/preload)

### Issue: Native module (sqlite3, serialport) not working

**Symptoms**: Runtime errors with native dependencies
**Solution**: Ensure `externalizeDeps` is enabled (default in v5.0+)

### Issue: Multiple windows showing same content

**Symptoms**: Different windows load identical HTML
**Solution**: Configure multiple `rollupOptions.input` entries for each window

### Issue: Environment variables not accessible

**Symptoms**: `process.env` undefined in renderer
**Solution**: Use `VITE_*` prefix for renderer, `MAIN_VITE_*` for main process

### Issue: Bytecode cache errors

**Symptoms**: `Error: Invalid or incompatible cached data`
**Solution**: Compile bytecode cache for target platform architecture

### Issue: TypeScript decorators not working

**Symptoms**: `emitDecoratorMetadata` errors
**Solution**: Configure `swcPlugin` for decorator support

## 6. Advanced Topics

### Debugging Support

**Main Process:**
Use VSCode's "Attach to Process".
```json
// .vscode/launch.json
{
  "name": "Debug Main Process",
  "type": "node",
  "request": "attach",
  "port": 9229 // Default inspection port
}
```
Run `electron-vite dev -- --inspect` or ensure your start script passes `--inspect`.

**Renderer Process:**
Use standard Chrome DevTools in the Electron window (Ctrl+Shift+I).

### Isolated Build Deep Dive

**What it does:**
- Prevents code leakage between processes
- Automatic multi-entry isolation
- Improved performance and security
- Enhanced developer productivity

**When to enable explicitly:**
- Multiple preload scripts with shared dependencies
- Complex multi-window applications
- Electron sandbox support
- Performance-critical scenarios

### Performance Optimization

**Source Maps:**
```bash
--sourcemap  # Enable for debugging
```

**Bytecode Caching:**
```typescript
build: {
  bytecode: true  # Production performance
}
```

**Build Watching:**
```typescript
build: {
  watch: {}  # Continuous rebuild
}
```

### Custom Configuration

**Manual Entry Points:**
```typescript
main: {
  build: {
    entry: 'custom/main.ts',
    outDir: 'dist/custom-main'
  }
}
```

**Custom Rollup Options:**
```typescript
preload: {
  build: {
    rollupOptions: {
      external: ['native-module'],
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom']
        }
      }
    }
  }
}
```

### Security Considerations

**Context Isolation:**
- Enabled by default in modern Electron
- Requires proper preload script API exposure
- Enforces security boundaries

**Node Integration:**
- Disabled by default (best practice)
- Use contextBridge for safe API access
- Prevents renderer access to Node.js

### Conditional Configuration

**Environment-based:**
```typescript
export default defineConfig(({ command, mode }) => {
  if (command === 'serve') {
    return {
      // dev specific config
    }
  } else {
    return {
      // build specific config
    }
  }
})
```

## Configuration Reference

See `electron.vite.config.ts` in the project root for our specific implementation.

**Common Options:**
-   `main.build.outDir`: Output for main process.
-   `renderer.server.port`: Custom dev server port.
-   `renderer.resolve.alias`: Path aliases (e.g., `@renderer/`).
-   `build.isolatedEntries`: Enable isolated build for multi-entry apps.
-   `build.bytecode`: Enable V8 bytecode caching.
-   `build.externalizeDeps`: Externalize Node.js dependencies.

## Project-Specific Usage

Our project uses the minimal configuration:

```typescript
export default defineConfig({
  main: {},              // All defaults
  preload: {},           // All defaults
  renderer: {
    plugins: [react()],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
      },
    },
  },
})
```

**Key Points:**
- Leverages electron-vite's pre-configured defaults
- Minimal custom configuration
- Follows recommended three-process architecture
- Zero maintenance overhead

Our electron-vite usage is intentionally **minimal and conservative**:

- ✅ **What we use**: Default configurations, React integration, path aliases
- ✅ **What we ignore**: Advanced multi-window, custom entry points, bytecode caching, source code protection
- ✅ **Philosophy**: Let electron-vite handle complexity, focus on app logic

This approach provides:
- Minimal maintenance burden
- Automatic updates and improvements
- Best practices by default
- Fast development experience

## Related Resources

- [electron-vite Documentation](https://electron-vite.org/)
- [Vite Guide](https://vitejs.dev/)
- [Electron Documentation](https://electronjs.org/)
- Our Project Config: `electron.vite.config.ts`
