import * as path from 'node:path';
import { app } from 'electron';
import { bus } from './infra/bus';
import {
  type CreateSqliteOptions,
  createOrama,
  createSqlite,
  DEFAULT_SEARCH_SCHEMA,
  getPreferences,
  getSecrets,
  type IDatabase,
  type ISearchEngine,
  type Preferences,
  type Secrets,
} from './infra/storage';

/**
 * MainContext represents the dependencies available to ORPC procedures.
 */
export interface MainContext {
  bus: typeof bus;
  prefs: Preferences;
  secrets: Secrets;
  db: IDatabase;
  ai: ISearchEngine;
}

/**
 * Get the user data path for storage files.
 */
function getUserDataPath(): string {
  return app.getPath('userData');
}

/**
 * Create the database instance.
 */
async function createDatabase(): Promise<IDatabase> {
  const options: CreateSqliteOptions = {
    adapter: 'better-sqlite3',
    dbPath: path.join(getUserDataPath(), 'data.db'),
  };
  return createSqlite(options);
}

/**
 * Create the search engine instance.
 */
async function createSearchEngine(): Promise<ISearchEngine> {
  return createOrama({
    schema: DEFAULT_SEARCH_SCHEMA,
    persistence: {
      filePath: path.join(getUserDataPath(), 'search-index.json'),
      autoSaveInterval: 30000,
    },
  });
}

/**
 * Initialize the runtime context.
 * This must be called after app is ready.
 */
export async function initializeContext(): Promise<MainContext> {
  const prefs = getPreferences();
  const secrets = getSecrets();

  let db: IDatabase;
  let ai: ISearchEngine;

  try {
    db = await createDatabase();
  } catch (error) {
    console.error('[context] Failed to initialize database:', error);
    throw new Error('Database initialization failed');
  }

  try {
    ai = await createSearchEngine();
  } catch (error) {
    console.error('[context] Failed to initialize search engine:', error);
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Search engine initialization failed: ${message}`);
  }

  return {
    bus,
    prefs,
    secrets,
    db,
    ai,
  };
}

/**
 * The runtime context object - must be initialized before use.
 * Use setRuntimeContext() to populate this.
 */
let _runtimeContext: MainContext | undefined;

export function getRuntimeContext(): MainContext {
  if (!_runtimeContext) {
    throw new Error('Runtime context not initialized. Call setRuntimeContext() first.');
  }
  return _runtimeContext;
}

export function setRuntimeContext(context: MainContext): void {
  _runtimeContext = context;
}

export async function closeContext(): Promise<void> {
  if (!_runtimeContext) return;

  const { db, ai } = _runtimeContext;

  if (ai && typeof ai.close === 'function') {
    await ai.close();
  }

  if (db) {
    await db.close?.();
  }

  _runtimeContext = undefined;
}
