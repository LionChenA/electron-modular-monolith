import Database from 'better-sqlite3';
import type { IDatabase, PreparedStatement, QueryResult, WhereClause } from './types';

export class BetterSqliteAdapter implements IDatabase {
  private db: Database.Database;

  constructor(dbPath: string) {
    this.db = new Database(dbPath);
    this.db.pragma('journal_mode = WAL');
  }

  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[] {
    const stmt = this.db.prepare(sql);
    return (params ? stmt.all(...params) : stmt.all()) as T[];
  }

  insert<T = Record<string, unknown>>(table: string, data: T): number | bigint {
    const columns = Object.keys(data as object);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data as object);

    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...values);

    return result.lastInsertRowid;
  }

  update<T = Record<string, unknown>>(table: string, data: T, where: WhereClause): number {
    const setColumns = Object.keys(data as object);
    const setClause = setColumns.map((col) => `${col} = ?`).join(', ');
    const whereColumns = Object.keys(where);
    const whereClause = whereColumns.map((col) => `${col} = ?`).join(' AND ');

    const setValues = Object.values(data as object);
    const whereValues = Object.values(where);

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...setValues, ...whereValues);

    return result.changes;
  }

  delete(table: string, where: WhereClause): number {
    const whereColumns = Object.keys(where);
    const whereClause = whereColumns.map((col) => `${col} = ?`).join(' AND ');
    const whereValues = Object.values(where);

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    const stmt = this.db.prepare(sql);
    const result = stmt.run(...whereValues);

    return result.changes;
  }

  transaction<T>(fn: () => T): T {
    return this.db.transaction(fn)();
  }

  prepare(sql: string): PreparedStatement {
    const stmt = this.db.prepare(sql);
    return {
      run: (...params: unknown[]): QueryResult => {
        const result = stmt.run(...params);
        return {
          rows: [],
          changes: result.changes,
          lastInsertRowid: result.lastInsertRowid,
        };
      },
      get: (...params: unknown[]): Record<string, unknown> | undefined => {
        return stmt.get(...params) as Record<string, unknown> | undefined;
      },
      all: (...params: unknown[]): Record<string, unknown>[] => {
        return stmt.all(...params) as Record<string, unknown>[];
      },
    };
  }

  close(): void {
    this.db.close();
  }

  getDatabase(): Database.Database {
    return this.db;
  }
}
