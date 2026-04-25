import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  getRuntimeContext,
  initializeContext,
  type MainContext,
  setRuntimeContext,
} from './context';

const mocks = vi.hoisted(() => {
  const mockBus = {
    publish: vi.fn(),
    subscribe: vi.fn(),
  };

  const mockPrefs = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    keys: [] as string[],
    values: {} as Record<string, unknown>,
    path: '/mock/path',
    clear: vi.fn(),
    reset: vi.fn(),
  };

  const mockSecrets = {
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn(),
    has: vi.fn(),
    keys: [] as string[],
    isEncryptionAvailable: true,
    clear: vi.fn(),
  };

  const mockDb = {
    insert: vi.fn(),
    query: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    close: vi.fn(),
    transaction: vi.fn(),
    prepare: vi.fn(),
    getDatabase: vi.fn(),
  };

  const mockAi = {
    insert: vi.fn(),
    insertMany: vi.fn(),
    update: vi.fn(),
    remove: vi.fn(),
    search: vi.fn(),
    searchVector: vi.fn(),
    searchHybrid: vi.fn(),
    save: vi.fn(),
    close: vi.fn(),
    getInternalDb: vi.fn(),
  };

  return {
    mockBus,
    mockPrefs,
    mockSecrets,
    mockDb,
    mockAi,
  };
});

vi.mock('electron', () => ({
  app: {
    getPath: vi.fn().mockReturnValue('/mock/user/data'),
  },
}));

vi.mock('./infra/storage', () => ({
  preferences: mocks.mockPrefs,
  secrets: mocks.mockSecrets,
  createSqlite: vi.fn().mockResolvedValue(mocks.mockDb),
  createOrama: vi.fn().mockResolvedValue(mocks.mockAi),
  db: mocks.mockDb,
  ai: mocks.mockAi,
}));

vi.mock('./infra/bus', () => ({
  bus: mocks.mockBus,
}));

describe('Context', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getRuntimeContext', () => {
    it('throws error when context not initialized', () => {
      expect(() => getRuntimeContext()).toThrow(
        'Runtime context not initialized. Call setRuntimeContext() first.',
      );
    });

    it('returns context after it has been set', () => {
      const mockContext = {
        bus: mocks.mockBus,
        prefs: mocks.mockPrefs,
        secrets: mocks.mockSecrets,
        db: mocks.mockDb,
        ai: mocks.mockAi,
      } as unknown as MainContext;

      setRuntimeContext(mockContext);
      const result = getRuntimeContext();
      expect(result).toBe(mockContext);
    });
  });

  describe('setRuntimeContext', () => {
    it('sets the runtime context', () => {
      const mockContext = {
        bus: mocks.mockBus,
        prefs: mocks.mockPrefs,
        secrets: mocks.mockSecrets,
        db: mocks.mockDb,
        ai: mocks.mockAi,
      } as unknown as MainContext;

      setRuntimeContext(mockContext);
      expect(getRuntimeContext()).toBe(mockContext);
    });

    it('overwrites previous context', () => {
      const mockContext1 = {
        bus: mocks.mockBus,
        prefs: mocks.mockPrefs,
        secrets: mocks.mockSecrets,
        db: mocks.mockDb,
        ai: mocks.mockAi,
      } as unknown as MainContext;

      const mockContext2 = {
        bus: mocks.mockBus,
        prefs: mocks.mockPrefs,
        secrets: mocks.mockSecrets,
        db: mocks.mockDb,
        ai: mocks.mockAi,
      } as unknown as MainContext;

      setRuntimeContext(mockContext1);
      expect(getRuntimeContext()).toBe(mockContext1);

      setRuntimeContext(mockContext2);
      expect(getRuntimeContext()).toBe(mockContext2);
    });
  });

  describe('initializeContext', () => {
    it('initializes context with all dependencies', async () => {
      const context = await initializeContext();
      expect(context).toBeDefined();
      expect(context.bus).toBeDefined();
      expect(context.prefs).toBeDefined();
      expect(context.secrets).toBeDefined();
      expect(context.db).toBeDefined();
      expect(context.ai).toBeDefined();
    });
  });
});
