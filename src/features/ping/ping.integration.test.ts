import { call } from '@orpc/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setRuntimeContext } from '../../app/main/context';
import { pingRouter } from './main/router';

type MockContext = {
  bus: {
    publish: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
  };
  prefs: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    has: ReturnType<typeof vi.fn>;
    values: Record<string, unknown>;
  };
  secrets: {
    get: ReturnType<typeof vi.fn>;
    set: ReturnType<typeof vi.fn>;
    has: ReturnType<typeof vi.fn>;
    keys: string[];
  };
  db: {
    insert: ReturnType<typeof vi.fn>;
    query: ReturnType<typeof vi.fn>;
  };
  ai: {
    insert: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };
};

function createMockContext(): MockContext {
  return {
    bus: {
      publish: vi.fn().mockReturnValue(undefined),
      subscribe: vi.fn(),
    },
    prefs: {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
      has: vi.fn().mockReturnValue(false),
      values: {},
    },
    secrets: {
      get: vi.fn().mockReturnValue(undefined),
      set: vi.fn(),
      has: vi.fn().mockReturnValue(false),
      keys: [],
    },
    db: {
      insert: vi.fn().mockReturnValue(1),
      query: vi.fn().mockReturnValue([]),
    },
    ai: {
      insert: vi.fn().mockResolvedValue('doc-1'),
      search: vi.fn().mockResolvedValue({ hits: [], count: 0 }),
    },
  };
}

describe('Ping Integration (ORPC call)', () => {
  let mockContext: MockContext;

  beforeEach(() => {
    mockContext = createMockContext();
    setRuntimeContext(mockContext as any);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('8.2 sendPing', () => {
    it('returns pong and publishes to bus', async () => {
      const result = await call(pingRouter.sendPing, undefined, {
        context: mockContext as any,
      });
      expect(result).toBe('pong');
      expect(mockContext.bus.publish).toHaveBeenCalledWith('ping', 'pong');
    });

    it('can be called multiple times', async () => {
      await call(pingRouter.sendPing, undefined, { context: mockContext as any });
      await call(pingRouter.sendPing, undefined, { context: mockContext as any });
      await call(pingRouter.sendPing, undefined, { context: mockContext as any });
      const result = await call(pingRouter.sendPing, undefined, {
        context: mockContext as any,
      });
      expect(result).toBe('pong');
      expect(mockContext.bus.publish).toHaveBeenCalledTimes(4);
    });
  });

  describe('8.3 getPreferences', () => {
    it('returns value for known key', async () => {
      mockContext.prefs.get.mockReturnValue('dark');
      const result = await call(
        pingRouter.getPreferences,
        { key: 'theme' },
        { context: mockContext as any },
      );
      expect(result).toBe('dark');
      expect(mockContext.prefs.get).toHaveBeenCalledWith('theme');
    });

    it('returns undefined for unknown key', async () => {
      mockContext.prefs.get.mockReturnValue(undefined);
      const result = await call(
        pingRouter.getPreferences,
        { key: 'nonexistent' },
        { context: mockContext as any },
      );
      expect(result).toBeUndefined();
    });
  });

  describe('8.4 setPreferences', () => {
    it('sets value', async () => {
      await call(
        pingRouter.setPreferences,
        { key: 'theme', value: 'light' },
        { context: mockContext as any },
      );
      expect(mockContext.prefs.set).toHaveBeenCalledWith('theme', 'light');
    });
  });

  describe('8.5 storeApiKey', () => {
    it('stores API key', async () => {
      await call(
        pingRouter.storeApiKey,
        { key: 'openai', value: 'sk-xxx' },
        { context: mockContext as any },
      );
      expect(mockContext.secrets.set).toHaveBeenCalledWith('openai', 'sk-xxx');
    });
  });

  describe('8.6 savePingToDb', () => {
    it('saves ping and returns id', async () => {
      mockContext.db.insert.mockReturnValue(42);
      const result = await call(
        pingRouter.savePingToDb,
        { message: 'test', timestamp: Date.now() },
        { context: mockContext as any },
      );
      expect(result).toEqual({ id: 42 });
      expect(mockContext.db.insert).toHaveBeenCalledWith(
        'pings',
        expect.objectContaining({
          message: 'test',
          timestamp: expect.any(Number),
        }),
      );
    });
  });

  describe('8.7 getPingHistory', () => {
    it('returns ping records', async () => {
      const mockRows = [
        { id: 1, message: 'pong', timestamp: 1000, count: 1 },
        { id: 2, message: 'pong', timestamp: 2000, count: 2 },
      ];
      mockContext.db.query.mockReturnValue(mockRows);
      const result = await call(pingRouter.getPingHistory, undefined, {
        context: mockContext as any,
      });
      expect(result).toEqual([
        { id: '1', message: 'pong', timestamp: 1000, count: 1 },
        { id: '2', message: 'pong', timestamp: 2000, count: 2 },
      ]);
    });

    it('returns empty array when no history', async () => {
      mockContext.db.query.mockReturnValue([]);
      const result = await call(pingRouter.getPingHistory, undefined, {
        context: mockContext as any,
      });
      expect(result).toEqual([]);
    });
  });

  describe('8.8 indexPing', () => {
    it('indexes ping record', async () => {
      const pingRecord = { id: '1', message: 'test', timestamp: 1000 };
      await call(pingRouter.indexPing, pingRecord, {
        context: mockContext as any,
      });
      expect(mockContext.ai.insert).toHaveBeenCalledWith(pingRecord);
    });
  });

  describe('8.9 searchPings', () => {
    it('returns matching records', async () => {
      const mockHits = [
        { id: '1', message: 'test', timestamp: 1000 },
        { id: '2', message: 'test', timestamp: 2000 },
      ];
      mockContext.ai.search.mockResolvedValue({
        hits: mockHits.map((d) => ({ document: d })),
        count: 2,
      });
      const result = await call(
        pingRouter.searchPings,
        { term: 'test' },
        { context: mockContext as any },
      );
      expect(result).toEqual(mockHits);
      expect(mockContext.ai.search).toHaveBeenCalledWith({
        term: 'test',
        limit: 10,
      });
    });

    it('respects limit parameter', async () => {
      const mockHits = [{ id: '1', message: 'test', timestamp: 1000 }];
      mockContext.ai.search.mockResolvedValue({
        hits: mockHits.map((d) => ({ document: d })),
        count: 1,
      });
      const result = await call(
        pingRouter.searchPings,
        { term: 'test', limit: 5 },
        { context: mockContext as any },
      );
      expect(result).toEqual(mockHits);
      expect(mockContext.ai.search).toHaveBeenCalledWith({
        term: 'test',
        limit: 5,
      });
    });
  });
});
