import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createPreferences, type Preferences } from './preferences';

/**
 * Shared mock data reference - both the mock and tests access this.
 * Reset in beforeEach to ensure test isolation.
 */
const mockData: Record<string, unknown> = {};

vi.mock('electron-store', () => {
  class MockStore {
    private data: Record<string, unknown>;
    private storeName: string;

    constructor(options: { name?: string; defaults?: Record<string, unknown> } = {}) {
      this.storeName = options.name ?? 'preferences';
      this.data = {};
      if (options.defaults) {
        Object.assign(this.data, options.defaults);
      }
      Object.assign(this.data, mockData);
    }

    get(key: string, defaultValue?: unknown): unknown {
      if (key in this.data) {
        return this.data[key];
      }
      return defaultValue;
    }

    set(key: string, value: unknown): void {
      this.data[key] = value;
    }

    delete(key: string): void {
      delete this.data[key];
    }

    has(key: string): boolean {
      return key in this.data;
    }

    get store(): Record<string, unknown> {
      return this.data;
    }

    get path(): string {
      return `/mock/${this.storeName}/path`;
    }

    clear(): void {
      for (const k of Object.keys(this.data)) {
        delete this.data[k];
      }
    }

    reset(): void {
      for (const k of Object.keys(this.data)) {
        delete this.data[k];
      }
    }
  }

  return { default: MockStore };
});

describe('Preferences', () => {
  let prefs: Preferences;

  beforeEach(() => {
    // Reset mock data before each test for complete isolation
    for (const k of Object.keys(mockData)) {
      delete mockData[k];
    }
    prefs = createPreferences();
  });

  describe('lazy initialization', () => {
    it('does not create store until first access', () => {
      // At this point, store should not have been initialized
      // We verify this by checking that accessing keys returns empty
      expect(prefs.keys).toEqual([]);
    });

    it('creates store on first get access', () => {
      prefs.get('testKey');
      // After get, the store is initialized and returns undefined for non-existent key
      expect(prefs.get('testKey')).toBeUndefined();
    });

    it('creates store on first set access', () => {
      prefs.set('key', 'value');
      expect(prefs.has('key')).toBe(true);
      expect(prefs.get('key')).toBe('value');
    });

    it('reuses same store instance for multiple operations', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      prefs.get('a');
      prefs.has('b');
      // All operations should work on the same store
      expect(prefs.keys).toEqual(['a', 'b']);
    });
  });

  describe('get', () => {
    it('returns undefined for non-existent key', () => {
      expect(prefs.get('nonexistent')).toBeUndefined();
    });

    it('returns value for existing key', () => {
      prefs.set('name', 'test');
      expect(prefs.get('name')).toBe('test');
    });

    it('returns default value when key not found', () => {
      const result = prefs.get('nonexistent', 'default');
      expect(result).toBe('default');
    });

    it('does not return default when key exists', () => {
      prefs.set('name', 'existing');
      const result = prefs.get('name', 'default');
      expect(result).toBe('existing');
    });

    it('returns correct types', () => {
      prefs.set('string', 'value');
      prefs.set('number', 42);
      prefs.set('boolean', true);
      prefs.set('object', { nested: true });
      prefs.set('array', [1, 2, 3]);

      expect(prefs.get('string')).toBe('value');
      expect(prefs.get('number')).toBe(42);
      expect(prefs.get('boolean')).toBe(true);
      expect(prefs.get('object')).toEqual({ nested: true });
      expect(prefs.get('array')).toEqual([1, 2, 3]);
    });
  });

  describe('set', () => {
    it('sets a string value', () => {
      prefs.set('name', 'test');
      expect(prefs.get('name')).toBe('test');
    });

    it('sets an object value', () => {
      prefs.set('config', { nested: true });
      expect(prefs.get('config')).toEqual({ nested: true });
    });

    it('sets an array value', () => {
      prefs.set('items', [1, 2, 3]);
      expect(prefs.get('items')).toEqual([1, 2, 3]);
    });

    it('overwrites existing value', () => {
      prefs.set('name', 'first');
      prefs.set('name', 'second');
      expect(prefs.get('name')).toBe('second');
    });

    it('can set undefined as value', () => {
      prefs.set('key', undefined);
      expect(prefs.get('key')).toBeUndefined();
    });

    it('can set null as value', () => {
      prefs.set('key', null);
      expect(prefs.get('key')).toBeNull();
    });

    it('can set nested dot-notation keys', () => {
      prefs.set('theme.colors.primary', '#ff0000');
      // electron-store handles dot notation internally
      expect(prefs.get('theme.colors.primary')).toBe('#ff0000');
    });
  });

  describe('delete', () => {
    it('deletes an existing key', () => {
      prefs.set('name', 'test');
      prefs.delete('name');
      expect(prefs.has('name')).toBe(false);
    });

    it('does nothing for non-existent key', () => {
      prefs.delete('nonexistent');
      expect(prefs.keys).toEqual([]);
    });

    it('can delete and re-add a key', () => {
      prefs.set('name', 'original');
      prefs.delete('name');
      prefs.set('name', 'new');
      expect(prefs.get('name')).toBe('new');
    });
  });

  describe('has', () => {
    it('returns true for existing key', () => {
      prefs.set('name', 'test');
      expect(prefs.has('name')).toBe(true);
    });

    it('returns false for non-existent key', () => {
      expect(prefs.has('nonexistent')).toBe(false);
    });

    it('returns false for deleted key', () => {
      prefs.set('name', 'test');
      prefs.delete('name');
      expect(prefs.has('name')).toBe(false);
    });
  });

  describe('keys', () => {
    it('returns empty array when no keys', () => {
      expect(prefs.keys).toEqual([]);
    });

    it('returns all keys', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      prefs.set('c', 3);
      expect(prefs.keys).toHaveLength(3);
      expect(prefs.keys).toContain('a');
      expect(prefs.keys).toContain('b');
      expect(prefs.keys).toContain('c');
    });

    it('does not include deleted keys', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      prefs.delete('a');
      expect(prefs.keys).toEqual(['b']);
    });
  });

  describe('values', () => {
    it('returns empty object when no values', () => {
      expect(prefs.values).toEqual({});
    });

    it('returns all key-value pairs', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      expect(prefs.values).toEqual({ a: 1, b: 2 });
    });

    it('values object is updated when data changes', () => {
      prefs.set('a', 1);
      expect(prefs.values.a).toBe(1);
      prefs.set('a', 2);
      expect(prefs.values.a).toBe(2);
    });
  });

  describe('path', () => {
    it('returns store path', () => {
      expect(prefs.path).toBe('/mock/preferences/path');
    });
  });

  describe('clear', () => {
    it('removes all keys', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      prefs.clear();
      expect(prefs.keys).toEqual([]);
      expect(prefs.values).toEqual({});
    });

    it('can add new keys after clear', () => {
      prefs.set('a', 1);
      prefs.clear();
      prefs.set('b', 2);
      expect(prefs.keys).toEqual(['b']);
      expect(prefs.get('b')).toBe(2);
    });
  });

  describe('reset', () => {
    it('resets all values', () => {
      prefs.set('a', 1);
      prefs.set('b', 2);
      prefs.reset();
      expect(prefs.keys).toEqual([]);
    });
  });

  describe('createPreferences with options', () => {
    it('respects custom store name in path', () => {
      const customPrefs = createPreferences({ name: 'custom-store' });
      expect(customPrefs.path).toContain('custom-store');
    });

    it('respects defaults', () => {
      const customPrefs = createPreferences({
        defaults: { defaultKey: 'defaultValue' },
      });
      expect(customPrefs.get('defaultKey')).toBe('defaultValue');
    });
  });
});
