# Storage Layer Architecture

## Overview

The storage layer provides a unified abstraction over 4 different storage backends:

| Storage Type | Backend | Use Case |
|-------------|---------|----------|
| **Preferences** | electron-store | User configuration, app settings |
| **Secrets** | Electron SafeStorage | Encrypted API keys, tokens |
| **Database** | better-sqlite3 / sql.js | Structured relational data |
| **Search** | Orama | Full-text search, AI-powered queries |

## Architecture

```
Feature (ORPC Handler)
         │
         ▼
MainContext
  ├─ preferences
  ├─ secrets
  ├─ database
  └─ search
         │
         ▼
Backend: electron-store │ SafeStorage │ SQLite │ Orama
```

## Storage Modules

### 1. Preferences (`preferences.ts`)

Key-value store for user preferences.

```typescript
import { preferences } from '@app/main/context';

const theme = preferences.get('theme');
preferences.set('theme', 'dark');
preferences.delete('theme');
```

### 2. Secrets (`secrets.ts`)

Encrypted storage using Electron's SafeStorage API.

```typescript
import { secrets } from '@app/main/context';

secrets.set('api-key', 'sk-...');
const apiKey = secrets.get('api-key');
```

### 3. Database (`sqlite/`)

SQLite with native + WASM adapter support.

```typescript
import { database } from '@app/main/context';

database.insert('pings', { message: 'ping' });
database.query('SELECT * FROM pings');
```

### 4. Search (`orama/`)

Full-text search engine.

```typescript
import { search } from '@app/main/context';

await search.insert('doc-1', { title: 'Hello' });
const results = await search.search({ term: 'hello' });
```

## Dependency Injection

All storage modules are injected via MainContext.

## Security Considerations

### SafeStorage

- Uses OS-level encryption (Keychain on macOS, Credential Manager on Windows)
- Falls back to base64 encoding on Linux if unavailable
- Always check `isEncryptionAvailable` before storing sensitive data

### Best Practices

1. **Never store plaintext secrets** - Use SafeStorage for API keys
2. **Validate data** - Use schemas for preferences
3. **Handle fallback** - Check encryption availability
4. **Log warnings** - Alert when fallback mode is used
