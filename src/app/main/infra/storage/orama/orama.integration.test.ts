import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createOrama } from './index';
import type { ISearchEngine } from './types';

describe('Orama integration (real file-backed storage)', () => {
  let orama: ISearchEngine;
  let tempDir: string;
  let persistenceFilePath: string;

  const createTestOrama = async (filePath: string): Promise<ISearchEngine> => {
    return createOrama({
      schema: {
        name: 'string',
        age: 'number',
        email: 'string',
      },
      persistence: {
        filePath,
        format: 'json',
      },
    });
  };

  beforeEach(async () => {
    tempDir = await mkdtemp(join(tmpdir(), 'orama-integration-'));
    persistenceFilePath = join(tempDir, 'search-index.json');
    orama = await createTestOrama(persistenceFilePath);
  });

  afterEach(async () => {
    await orama?.close();
    await rm(tempDir, { recursive: true, force: true });
  });

  it('10.6 inserts documents into real file-backed storage', async () => {
    const id = await orama.insert({ name: 'Alice', age: 30, email: 'alice@example.com' });

    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('10.7 searches documents from real file-backed storage', async () => {
    await orama.insert({ name: 'Alice Smith', age: 30, email: 'alice@example.com' });
    await orama.insert({ name: 'Bob Jones', age: 25, email: 'bob@example.com' });

    const result = await orama.search<{ name: string }>({ term: 'Alice' });

    expect(result.count).toBe(1);
    expect(result.hits[0].document.name).toBe('Alice Smith');
  });

  it('10.8 updates persisted documents in real file-backed storage', async () => {
    const id = await orama.insert({ name: 'Alice', age: 30, email: 'alice@example.com' });
    await orama.update(id, { name: 'Alice Updated', age: 31, email: 'alice.updated@example.com' });

    const result = await orama.search<{ name: string; age: number }>({ term: 'Updated' });

    expect(result.count).toBe(1);
    expect(result.hits[0].document).toMatchObject({ name: 'Alice Updated', age: 31 });
  });

  it('10.9 deletes persisted documents from real file-backed storage', async () => {
    const bobId = await orama.insert({ name: 'Bob', age: 25, email: 'bob@example.com' });
    await orama.insert({ name: 'Alice', age: 30, email: 'alice@example.com' });

    await orama.remove(bobId);

    const result = await orama.search({ limit: 10 });

    expect(result.count).toBe(1);
    expect(result.hits[0].document).toMatchObject({ name: 'Alice' });
  });

  it('persists data to disk and can reload it', async () => {
    await orama.insert({ name: 'Persisted User', age: 99, email: 'persisted@example.com' });
    await orama.close();

    orama = await createTestOrama(persistenceFilePath);

    const result = await orama.search({ term: 'Persisted User' });
    expect(result.count).toBe(1);
    expect(result.hits[0].document).toMatchObject({ name: 'Persisted User' });
  });
});
