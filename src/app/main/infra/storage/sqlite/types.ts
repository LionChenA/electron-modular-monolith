export interface QueryResult {
  rows: Record<string, unknown>[];
  changes: number;
  lastInsertRowid: number | bigint;
}

export interface WhereClause {
  [column: string]: unknown;
}

export interface IDatabase {
  query<T = Record<string, unknown>>(sql: string, params?: unknown[]): T[];
  insert<T = Record<string, unknown>>(table: string, data: T): number | bigint;
  update<T = Record<string, unknown>>(table: string, data: T, where: WhereClause): number;
  delete(table: string, where: WhereClause): number;
  transaction<T>(fn: () => T): T;
  prepare(sql: string): PreparedStatement;
  close(): void;
  getDatabase(): unknown;
}

export interface PreparedStatement {
  run(...params: unknown[]): QueryResult;
  get(...params: unknown[]): Record<string, unknown> | undefined;
  all(...params: unknown[]): Record<string, unknown>[];
}

export interface IDatabaseConstructor {
  new (dbPath: string): IDatabase;
}
