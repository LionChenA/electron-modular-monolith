import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createSqlite } from './index';
import type { IDatabase } from './types';

const mockDbInstance = {
  prepare: vi.fn(),
  pragma: vi.fn(),
  close: vi.fn(),
  transaction: vi.fn((fn: () => unknown) => fn()),
};

vi.mock('better-sqlite3', () => {
  function MockDatabase(this: unknown, ..._args: unknown[]) {
    return mockDbInstance;
  }
  return { default: MockDatabase };
});

describe('SQLite integration (mocked better-sqlite3)', () => {
  let db: IDatabase;

  beforeEach(async () => {
    vi.clearAllMocks();

    const mockStmt = {
      run: vi.fn(() => ({ changes: 1, lastInsertRowid: BigInt(1) })),
      get: vi.fn(() => ({ id: 1, name: 'Alice', age: 30 })),
      all: vi.fn(() => [{ id: 1, name: 'Alice', age: 30 }]),
    };
    mockDbInstance.prepare.mockReturnValue(mockStmt);

    db = await createSqlite({
      adapter: 'better-sqlite3',
      dbPath: '/tmp/test.db',
    });
  });

  afterEach(() => {
    db?.close();
  });

  it('10.2 inserts rows into SQLite', () => {
    const rowId = db.insert('users', { name: 'Alice', age: 30 });

    expect(Number(rowId)).toBeGreaterThan(0);
    expect(mockDbInstance.prepare).toHaveBeenCalledWith(
      'INSERT INTO users (name, age) VALUES (?, ?)',
    );
  });

  it('10.3 queries rows from SQLite', () => {
    const mockRows = [
      { id: 1, name: 'Alice', age: 30 },
      { id: 2, name: 'Bob', age: 22 },
    ];
    mockDbInstance.prepare.mockReturnValue({
      run: vi.fn(),
      get: vi.fn(),
      all: vi.fn(() => mockRows),
    });

    const rows = db.query<{ name: string; age: number }>('SELECT * FROM users WHERE age > ?', [25]);

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({ name: 'Alice', age: 30 });
  });

  it('10.4 updates rows in SQLite', () => {
    mockDbInstance.prepare.mockImplementation((sql: string) => {
      if (sql.includes('UPDATE')) {
        return {
          run: vi.fn(() => ({ changes: 1, lastInsertRowid: BigInt(0) })),
          get: vi.fn(),
          all: vi.fn(),
        };
      }
      if (sql.includes('SELECT')) {
        return {
          run: vi.fn(),
          get: vi.fn(() => ({ age: 31 })),
          all: vi.fn(() => [{ age: 31 }]),
        };
      }
      return { run: vi.fn(), get: vi.fn(), all: vi.fn() };
    });

    const changes = db.update('users', { age: 31 }, { name: 'Alice' });
    const updated = db.query<{ age: number }>('SELECT age FROM users WHERE name = ?', ['Alice']);

    expect(changes).toBe(1);
    expect(updated[0].age).toBe(31);
  });

  it('10.4 deletes rows from SQLite', () => {
    mockDbInstance.prepare.mockReturnValue({
      run: vi.fn(() => ({ changes: 1, lastInsertRowid: BigInt(0) })),
      get: vi.fn(),
      all: vi.fn(() => [{ name: 'Alice' }]),
    });

    const changes = db.delete('users', { name: 'Bob' });
    const rows = db.query<{ name: string }>('SELECT name FROM users ORDER BY id ASC');

    expect(changes).toBe(1);
    expect(rows).toEqual([{ name: 'Alice' }]);
  });
});
