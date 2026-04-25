# Design: Add Storage Layer

## Context

### Background
The project needs a comprehensive storage layer for persistent data. Based on the proposal, we need to implement:
- Preferences storage (electron-store)
- Secure storage (Electron SafeStorage)
- SQLite database (better-sqlite3 / sql.js)
- AI search (Orama)

### Current State
- No persistent storage layer exists
- `src/app/main/context.ts` only contains `bus` dependency
- All data is in-memory only

### Constraints
1. Must integrate with existing MainContext DI pattern
2. Must support Modular Monolith architecture (features declare dependencies)
3. Must follow existing code patterns (TypeScript, functional style)
4. SQLite should support both native (better-sqlite3) and WASM (sql.js) for flexibility

### Stakeholders
- Features that need data persistence (future AI features, user settings)
- Security requirements for API key storage
- Performance requirements for database operations

---

## Goals / Non-Goals

### Goals
1. **Unified Storage Interface** - All storage accessed through MainContext DI
2. **Type Safety** - Full TypeScript support for all storage operations
3. **Factory Pattern for SQLite** - Allow runtime selection between native/WASM
4. **Orama Integration** - Full-text and vector search for AI features
5. **Secure Secret Storage** - OS-level encryption for API keys

### Non-Goals
- **Cloud Sync** - Not implementing cloud backup/sync (out of scope)
- **Multiple Database Support** - Only SQLite (not PostgreSQL, MySQL)
- **Complex Migration System** - Basic migrations only, not full Alembic-style
- **Full-text Search in SQLite** - Using Orama instead of SQLite FTS5

---

## Decisions

### D1: Storage Architecture - Hybrid Pattern

**Decision**: Use hybrid storage architecture with unified interfaces but separate implementations.

**Rationale**: 
- Preferences and secrets are simple key-value stores (unified interface)
- SQLite is for structured relational data (complex queries, transactions)
- Orama is for search-specific operations (not general storage)
- This follows the tiered storage strategy from the vision document

**Alternative Considered**:
- *Unified Storage Gateway* - Single interface for all storage types
- *Rejected*: Too abstract, loses type safety and specific capabilities

### D2: SQLite Implementation - Factory Pattern with Dual Support

**Decision**: Implement factory pattern supporting both `better-sqlite3` (native) and `sql.js` (WASM).

```typescript
// src/app/main/infra/storage/sqlite/index.ts
export type SQLiteAdapter = 'better-sqlite3' | 'sql.js'

export async function createSqlite(adapter: SQLiteAdapter = 'better-sqlite3') {
  switch (adapter) {
    case 'better-sqlite3':
      return createBetterSqlite()
    case 'sql.js':
      return createWasmSqlite()
  }
}
```

**Rationale**:
- `better-sqlite3`: Better performance, requires native build
- `sql.js`: Easier packaging, works in browsers
- Factory allows runtime selection or environment-based selection

**Alternative Considered**:
- *Only better-sqlite3* - Rejected: complicates Electron packaging
- *Only sql.js* - Rejected: performance penalty for complex queries

### D3: SafeStorage with Fallback

**Decision**: Use Electron SafeStorage with graceful fallback for Linux systems without secret store.

```typescript
// src/app/main/infra/storage/secrets.ts
import { safeStorage } from 'electron'

export function isEncryptionAvailable(): boolean {
  return safeStorage.isEncryptionAvailable()
}

export function encryptSecret(key: string, value: string): string {
  if (!isEncryptionAvailable()) {
    // Fallback: warn and store with basic encoding
    console.warn('SafeStorage not available, using base64 fallback')
    return Buffer.from(value).toString('base64')
  }
  return safeStorage.encryptString(value).toString('base64')
}
```

**Rationale**:
- Signal Desktop uses this pattern for database key encryption
- Linux may not have secret store available (fallback to base64 with warning)
- macOS/Windows have reliable OS keychain support

**Alternative Considered**:
- *Fail on Linux without secret store* - Rejected: breaks on many Linux distros
- *Require user password* - Rejected: too complex for initial implementation

### D4: Orama Persistence Strategy

**Decision**: Implement manual persistence with optional auto-save.

```typescript
// src/app/main/infra/storage/orama/index.ts
export interface OramaConfig {
  persistencePath?: string
  autoSaveInterval?: number // ms
}

export async function createOrama(config: OramaConfig) {
  const db = await create({ schema: oramaSchema })
  
  // Load from file if exists
  if (config.persistencePath && exists(config.persistencePath)) {
    const data = readFileSync(config.persistencePath)
    await restore('binary', data)
  }
  
  // Optional auto-save
  if (config.autoSaveInterval) {
    setInterval(async () => {
      const data = await persist(db, 'binary')
      writeFileSync(config.persistencePath!, data)
    }, config.autoSaveInterval)
  }
  
  return db
}
```

**Rationale**:
- Orama is in-memory only (no auto-persistence)
- Must manually save/load for durability
- SQLite is "source of truth", Orama is "search cache"

**Alternative Considered**:
- *No persistence* - Rejected: loses search index on restart
- *Auto-persistence on every change* - Rejected: too expensive

### D5: MainContext Integration

**Decision**: Add storage as first-class DI dependencies in MainContext.

```typescript
// src/app/main/context.ts
import { createPreferences } from './infra/storage/preferences'
import { createSecrets } from './infra/storage/secrets'
import { createSqlite } from './infra/storage/sqlite'
import { createOrama } from './infra/storage/orama'
import { bus } from './infra/bus'

export interface MainContext {
  bus: typeof bus
  
  // Storage layer
  prefs: ReturnType<typeof createPreferences>
  secrets: ISecrets
  db: IDatabase
  ai: ISearchEngine
}

// Runtime context initialized at app startup
export const runtimeContext: MainContext = {
  bus,
  prefs: createPreferences(),
  secrets: createSecrets(),
  db: await createSqlite(),
  ai: await createOrama({ persistencePath: './data/orama.idx' })
}
```

**Rationale**:
- Follows existing DI pattern in project
- All features can declare storage dependencies
- Consistent with how ORPC procedures access dependencies

---

## Risks / Trade-offs

### R1: Native Module Build Complexity

**[Risk]** `better-sqlite3` requires native compilation, may cause build issues in Electron.

**Mitigation**: 
- Use `electron-rebuild` (already configured via postinstall)
- Provide `sql.js` as fallback
- Document native module requirements

### R2: Orama Index Rebuild on First Run

**[Risk]** If Orama persistence file is corrupted or missing, need to rebuild index from SQLite.

**Mitigation**:
- Implement `rebuildIndex()` function
- Log warning when rebuilding
- Consider periodic integrity checks

### R3: Linux SafeStorage Fallback Security

**[Risk]** On Linux without secret store, secrets stored as base64 (easily decoded).

**Mitigation**:
- Detect availability at runtime
- Warn users on fallback
- Document limitation in security section

### R4: Memory Usage with Orama

**[Risk]** Orama loads entire index into memory, may be problematic for large datasets.

**Mitigation**:
- Document memory considerations
- Suggest limiting index to searchable fields only
- Consider pagination for large result sets

### R5: Dual SQLite Complexity

**[Risk]** Supporting both adapters increases code complexity and testing surface.

**Mitigation**:
- Common interface for both adapters
- Unit tests mock at interface level
- Default to better-sqlite3, document how to switch

---

## Open Questions

### Q1: Should preferences be sync or async?

**Decision**: ✅ **Synchronous** - Keep as sync (electron-store is sync by default)

**Rationale**: 
- electron-store is designed to be synchronous
- Simple key-value operations don't block significantly
- Matches electron-store's native API
- Simplifies implementation

### Q2: How to handle Orama-SQLite sync?

**Decision**: ✅ **Repository Abstraction Layer** - Automatic sync on every write operation

**Implementation**: Provide a Repository<T> class that automatically syncs to Orama.

```typescript
class Repository<T> {
  constructor(
    private db: IDatabase,
    private orama: ISearchEngine,
    private tableName: string,
    private oramaSchema?: Schema
  ) {}

  async create(data): Promise<T> {
    // 1. Write to SQLite
    const result = await this.db.insert(this.tableName, data)
    // 2. Auto-sync to Orama
    if (this.oramaSchema) {
      await this.orama.insert({ ...result, _table: this.tableName })
    }
    return result
  }
}
```

**Rationale**:
- Developers don't need to remember to sync - automatic
- Every write operation keeps Orama in sync
- Can selectively enable sync per repository
- Maintains simple interface while being reliable

### Q3: Default Orama schema?

**Decision**: ✅ **Distributed Schema** - Each Feature defines its own Orama schema

**Rationale**:
- Different features have different search needs
- Avoids centralized schema bloat
- Each feature owns its search configuration
- Flexible and maintainable
