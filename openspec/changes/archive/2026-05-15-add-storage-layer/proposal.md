# Proposal: Add Storage Layer

## Why

The project currently lacks a comprehensive storage layer for persistent data. As an Electron modular monolith targeting AI-enhanced desktop applications, we need:

1. **User preferences storage** - Theme, settings, window state
2. **Secure secret storage** - API keys, tokens (encrypted via OS keychain)
3. **Structured data storage** - Business data, chat history, user records
4. **AI search capability** - Full-text and vector search for AI features

Without these, the application cannot function as a real desktop app. The vision document explicitly calls for a tiered storage strategy (electron-store, SafeStorage, Orama), but none of these are implemented yet.

## What Changes

### New Dependencies
- Install `electron-store` for preferences
- Install `@orama/orama` for AI search
- Add SQLite support: `better-sqlite3` (native) and/or `sql.js` (WASM)
- Add type definitions for all storage libraries

### New Infrastructure
- Create `src/app/main/infra/storage/` directory
- Implement preferences storage with electron-store
- Implement secure storage with Electron SafeStorage API
- Implement SQLite database layer with factory pattern
- Implement Orama search engine with persistence
- Integrate all storage into MainContext DI system

### Architecture Updates
- Update `src/app/main/context.ts` to include storage dependencies
- Create storage interface types for each storage type
- Update Feature types to declare storage dependencies

## Capabilities

### New Capabilities

- `preferences-storage`: User configuration and preferences persistence
  - electron-store based
  - JSON Schema validation support
  - Default values, type safety
  - File location: `src/app/main/infra/storage/preferences.ts`

- `secure-storage`: Encrypted secret storage using OS keychain
  - Electron SafeStorage API
  - Cross-platform: macOS Keychain, Windows DPAPI, Linux libsecret
  - Fallback handling for Linux without secret store
  - File location: `src/app/main/infra/storage/secrets.ts`

- `sqlite-database`: Structured data storage with SQLite
  - Factory pattern supporting both `better-sqlite3` (native) and `sql.js` (WASM)
  - WAL mode enabled for performance
  - Type-safe query helpers
  - File location: `src/app/main/infra/storage/sqlite/`

- `ai-search`: Full-text and vector search capability
  - Orama-based search engine
  - BM25/QPS/PT15 algorithm selection
  - Vector embedding support for semantic search
  - Persistence plugin for index backup
  - File location: `src/app/main/infra/storage/orama/`

### Modified Capabilities

- `architecture`: Add storage layer infrastructure to DI system
  - MainContext now includes storage dependencies
  - Feature dependency injection includes storage types

## Impact

### Code Changes
- **New files**: ~10-15 files in `src/app/main/infra/storage/`
- **Modified files**: `src/app/main/context.ts`, Feature router files
- **Dependencies**: 3-4 new packages

### Breaking Changes
- **None** - This is additive functionality

### Integration Points
- All storage accessed through MainContext DI
- Features declare storage dependencies in their `types.ts`
- ORPC procedures access storage via injected context

### Testing Considerations
- Storage interfaces should be mockable for unit tests
- Consider integration tests for SQLite/Orama persistence
