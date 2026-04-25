import * as fs from 'node:fs';
import * as path from 'node:path';
import initSqlJs, { type Database as SqlJsDatabase } from 'sql.js';
import type { IDatabase, PreparedStatement, QueryResult, WhereClause } from './types';

export class WasmAdapter implements IDatabase {
  private db: SqlJsDatabase | null = null;
  private dbPath: string;
  private initialized: boolean = false;

  constructor(dbPath: string) {
    this.dbPath = dbPath;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    const SQL = await initSqlJs();

    if (fs.existsSync(this.dbPath)) {
      const fileBuffer = fs.readFileSync(this.dbPath);
      this.db = new SQL.Database(fileBuffer);
    } else {
      this.db = new SQL.Database();
    }

    this.initialized = true;
  }

  private ensureInitialized(): void {
    if (!this.db) {
      throw new Error('Database not initialized. Call initialize() first.');
    }
  }

  private saveToFile(): void {
    if (!this.db) return;
    const data = this.db.export();
    const buffer = Buffer.from(data);
    const dir = path.dirname(this.dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.dbPath, buffer);
  }

  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[] {
    this.ensureInitialized();
    const stmt = this.db?.prepare(sql);
    if (params) {
      stmt.bind(params);
    }

    const results: T[] = [];
    while (stmt.step()) {
      const row = stmt.getAsObject();
      results.push(row as T);
    }
    stmt.free();
    return results;
  }

  insert<T = Record<string, unknown>>(table: string, data: T): number | bigint {
    this.ensureInitialized();
    const columns = Object.keys(data as object);
    const placeholders = columns.map(() => '?').join(', ');
    const values = Object.values(data as object);

    const sql = `INSERT INTO ${table} (${columns.join(', ')}) VALUES (${placeholders})`;
    this.db?.run(sql, values);

    const lastIdResult = this.db?.exec('SELECT last_insert_rowid() as id');
    const lastId = lastIdResult[0]?.values[0]?.[0] ?? 0;

    this.saveToFile();
    return typeof lastId === 'number' ? BigInt(lastId) : lastId;
  }

  update<T = Record<string, unknown>>(table: string, data: T, where: WhereClause): number {
    this.ensureInitialized();
    const setColumns = Object.keys(data as object);
    const setClause = setColumns.map((col) => `${col} = ?`).join(', ');
    const whereColumns = Object.keys(where);
    const whereClause = whereColumns.map((col) => `${col} = ?`).join(' AND ');

    const setValues = Object.values(data as object);
    const whereValues = Object.values(where);

    const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
    this.db?.run(sql, [...setValues, ...whereValues]);

    const changes = this.db?.getRowsModified();
    this.saveToFile();
    return changes;
  }

  delete(table: string, where: WhereClause): number {
    this.ensureInitialized();
    const whereColumns = Object.keys(where);
    const whereClause = whereColumns.map((col) => `${col} = ?`).join(' AND ');
    const whereValues = Object.values(where);

    const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
    this.db?.run(sql, whereValues);

    const changes = this.db?.getRowsModified();
    this.saveToFile();
    return changes;
  }

  transaction<T>(fn: () => T): T {
    this.ensureInitialized();
    this.db?.run('BEGIN TRANSACTION');
    try {
      const result = fn();
      this.db?.run('COMMIT');
      this.saveToFile();
      return result;
    } catch (error) {
      this.db?.run('ROLLBACK');
      throw error;
    }
  }

  prepare(sql: string): PreparedStatement {
    this.ensureInitialized();
    const stmt = this.db?.prepare(sql);
    return {
      run: (...params: unknown[]): QueryResult => {
        stmt.bind(params);
        stmt.step();
        stmt.free();
        const changes = this.db?.getRowsModified() ?? 0;
        const lastIdResult = this.db?.exec('SELECT last_insert_rowid() as id');
        const lastId = lastIdResult?.[0]?.values?.[0]?.[0] ?? 0;
        this.saveToFile();
        return {
          rows: [],
          changes,
          lastInsertRowid: typeof lastId === 'number' ? BigInt(lastId) : lastId,
        };
      },
      get: (...params: unknown[]): Record<string, unknown> | undefined => {
        stmt.bind(params);
        if (stmt.step()) {
          const row = stmt.getAsObject();
          stmt.free();
          return row as Record<string, unknown>;
        }
        stmt.free();
        return undefined;
      },
      all: (...params: unknown[]): Record<string, unknown>[] => {
        stmt.bind(params);
        const results: Record<string, unknown>[] = [];
        while (stmt.step()) {
          results.push(stmt.getAsObject() as Record<string, unknown>);
        }
        stmt.free();
        return results;
      },
    };
  }

  close(): void {
    if (this.db) {
      this.saveToFile();
      this.db.close();
      this.db = null;
    }
  }

  getDatabase(): SqlJsDatabase | null {
    return this.db;
  }
}
