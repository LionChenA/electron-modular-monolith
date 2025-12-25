# electron-modular-monolith

An Electron application with React and TypeScript

## Project Structure

The project follows a **Modular Monolith** architecture:

- `src/app`: Infrastructure layer (Main process, Preload, Renderer shell).
- `src/features`: Business logic organized by vertical slices.
- `src/shared`: Shared utilities, types, and constants (no dependencies on app or features).

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [Biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)

## Project Setup

### Install

```bash
$ pnpm install
```

### Development

```bash
$ pnpm dev
```

### Build

```bash
# For windows
$ pnpm build:win

# For macOS
$ pnpm build:mac

# For Linux
$ pnpm build:linux
```
