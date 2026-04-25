import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createOrama } from './index';
import type { SearchParams } from './types';

const mocks = vi.hoisted(() => ({
  create: vi.fn(),
  insert: vi.fn(),
  insertMultiple: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  search: vi.fn(),
  save: vi.fn(),
  load: vi.fn(),
}));

vi.mock('@orama/orama', () => ({
  create: mocks.create,
  insert: mocks.insert,
  insertMultiple: mocks.insertMultiple,
  update: mocks.update,
  remove: mocks.remove,
  search: mocks.search,
  save: mocks.save,
  load: mocks.load,
}));

vi.mock('fs/promises', () => ({
  access: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
  mkdir: vi.fn(),
}));

describe('OramaService', () => {
  const schema = {
    name: 'string' as const,
    age: 'number' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    mocks.create.mockResolvedValue({ id: 'mock-db' });
    mocks.insert.mockResolvedValue('doc-1');
    mocks.insertMultiple.mockResolvedValue(['doc-1', 'doc-2']);
    mocks.update.mockResolvedValue(undefined);
    mocks.remove.mockResolvedValue(undefined);
    mocks.search.mockResolvedValue({
      elapsed: { raw: 1, formatted: '1ms' },
      hits: [{ id: 'doc-1', score: 1.0, document: { name: 'test' } }],
      count: 1,
    });
    mocks.save.mockResolvedValue(undefined);
  });

  describe('createOrama', () => {
    it('creates database with schema', async () => {
      const service = await createOrama({ schema });
      expect(mocks.create).toHaveBeenCalledWith({ schema });
      expect(service).toBeDefined();
    });
  });

  describe('insert', () => {
    it('inserts a single document', async () => {
      const service = await createOrama({ schema });
      const result = await service.insert({ name: 'test', age: 25 });
      expect(mocks.insert).toHaveBeenCalled();
      expect(result).toBe('doc-1');
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.insert({ name: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('insertMany', () => {
    it('inserts multiple documents', async () => {
      const service = await createOrama({ schema });
      const docs = [
        { name: 'test1', age: 25 },
        { name: 'test2', age: 30 },
      ];
      const result = await service.insertMany(docs);
      expect(mocks.insertMultiple).toHaveBeenCalled();
      expect(result).toEqual(['doc-1', 'doc-2']);
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.insertMany([{ name: 'test' }])).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('update', () => {
    it('updates a document by id', async () => {
      const service = await createOrama({ schema });
      await service.update('doc-1', { name: 'updated', age: 30 });
      expect(mocks.update).toHaveBeenCalled();
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.update('doc-1', { name: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('remove', () => {
    it('removes a document by id', async () => {
      const service = await createOrama({ schema });
      await service.remove('doc-1');
      expect(mocks.remove).toHaveBeenCalled();
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.remove('doc-1')).rejects.toThrow('Orama search engine has been closed');
    });
  });

  describe('search', () => {
    it('searches with term', async () => {
      const service = await createOrama({ schema });
      const params: SearchParams = { term: 'test', limit: 10 };
      const result = await service.search(params);
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ term: 'test', limit: 10, offset: 0 }),
      );
      expect(result.hits).toHaveLength(1);
    });

    it('searches with where clause', async () => {
      const service = await createOrama({ schema });
      const params: SearchParams = { where: { name: 'test' }, limit: 5 };
      await service.search(params);
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ where: { name: 'test' }, limit: 5 }),
      );
    });

    it('searches with vector mode', async () => {
      const service = await createOrama({ schema });
      const params: SearchParams = {
        mode: 'vector',
        vector: { value: [0.1, 0.2], property: 'embedding' },
        limit: 10,
      };
      await service.search(params);
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          mode: 'vector',
          vector: { value: [0.1, 0.2], property: 'embedding' },
        }),
      );
    });

    it('searches with hybrid mode', async () => {
      const service = await createOrama({ schema });
      const params: SearchParams = {
        mode: 'hybrid',
        term: 'test',
        vector: { value: [0.1, 0.2], property: 'embedding' },
      };
      await service.search(params);
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          mode: 'hybrid',
          term: 'test',
          vector: { value: [0.1, 0.2], property: 'embedding' },
        }),
      );
    });

    it('uses default limit and offset', async () => {
      const service = await createOrama({ schema });
      await service.search({});
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({ limit: 10, offset: 0 }),
      );
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.search({ term: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('searchVector', () => {
    it('performs vector search', async () => {
      const service = await createOrama({ schema });
      await service.searchVector([0.1, 0.2], 'embedding', {
        limit: 5,
        similarity: 0.8,
      });
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          mode: 'vector',
          vector: { value: [0.1, 0.2], property: 'embedding' },
          similarity: 0.8,
          limit: 5,
          offset: 0,
        }),
      );
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.searchVector([0.1, 0.2], 'embedding')).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('searchHybrid', () => {
    it('performs hybrid search', async () => {
      const service = await createOrama({ schema });
      await service.searchHybrid('test', [0.1, 0.2], 'embedding', {
        limit: 5,
        similarity: 0.8,
      });
      expect(mocks.search).toHaveBeenCalledWith(
        expect.anything(),
        expect.objectContaining({
          term: 'test',
          mode: 'hybrid',
          vector: { value: [0.1, 0.2], property: 'embedding' },
          similarity: 0.8,
          limit: 5,
          offset: 0,
        }),
      );
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.searchHybrid('test', [0.1, 0.2], 'embedding')).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('save', () => {
    it('saves to file when persistence is configured', async () => {
      const fs = await import('node:fs/promises');
      vi.mocked(fs.access).mockResolvedValue(undefined);
      vi.mocked(fs.readFile).mockResolvedValue('{}');
      vi.mocked(fs.writeFile).mockResolvedValue(undefined);
      vi.mocked(fs.mkdir).mockResolvedValue(undefined);

      const service = await createOrama({
        schema,
        persistence: { filePath: '/tmp/test.json' },
      });
      await service.save();
      expect(mocks.save).toHaveBeenCalled();
    });

    it('throws error when persistence not configured', async () => {
      const service = await createOrama({ schema });
      await expect(service.save()).rejects.toThrow('Persistence file path not configured');
    });

    it('throws error when closed', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.save()).rejects.toThrow('Orama search engine has been closed');
    });
  });

  describe('close', () => {
    it('closes the service', async () => {
      const service = await createOrama({ schema });
      await service.close();
      await expect(service.insert({ name: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
    });
  });

  describe('ensureNotClosed', () => {
    it('throws error on operations after close', async () => {
      const service = await createOrama({ schema });
      await service.close();

      await expect(service.search({ term: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
      await expect(service.update('doc-1', { name: 'test' })).rejects.toThrow(
        'Orama search engine has been closed',
      );
      await expect(service.remove('doc-1')).rejects.toThrow('Orama search engine has been closed');
      await expect(service.save()).rejects.toThrow('Orama search engine has been closed');
    });
  });

  describe('getInternalDb', () => {
    it('returns the internal database', async () => {
      const service = await createOrama({ schema });
      const db = service.getInternalDb();
      expect(db).toBeDefined();
    });
  });
});
