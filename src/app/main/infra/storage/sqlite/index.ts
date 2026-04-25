import { BetterSqliteAdapter } from './better-adapter';
import type { IDatabase } from './types';
import { WasmAdapter } from './wasm-adapter';

export type SQLiteAdapter = 'better-sqlite3' | 'sql.js';

export interface CreateSqliteOptions {
  adapter?: SQLiteAdapter;
  dbPath: string;
}

export async function createSqlite(options: CreateSqliteOptions): Promise<IDatabase> {
  const adapter = options.adapter ?? 'better-sqlite3';

  switch (adapter) {
    case 'better-sqlite3':
      return new BetterSqliteAdapter(options.dbPath);
    case 'sql.js': {
      const wasmAdapter = new WasmAdapter(options.dbPath);
      await wasmAdapter.initialize();
      return wasmAdapter;
    }
    default:
      throw new Error(`Unknown adapter: ${adapter}`);
  }
}

export { BetterSqliteAdapter } from './better-adapter';
export type { IDatabase } from './types';
export { WasmAdapter } from './wasm-adapter';
