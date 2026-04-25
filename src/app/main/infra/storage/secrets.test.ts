import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createSecrets, type Secrets } from './secrets';

let mockData: Record<string, string> = {};

const mocks = vi.hoisted(() => {
  return {
    isEncryptionAvailable: vi.fn().mockReturnValue(true),
    encryptString: vi
      .fn()
      .mockImplementation((plain: string) => Buffer.from(`encrypted:${plain}`, 'utf-8')),
    decryptString: vi
      .fn()
      .mockImplementation((buffer: Buffer) => buffer.toString('utf-8').replace('encrypted:', '')),
  };
});

vi.mock('electron-store', () => {
  class MockStore {
    private data: Record<string, string>;

    constructor() {
      this.data = mockData;
    }

    get(key: string): string | undefined {
      return this.data[key];
    }

    set(key: string, value: string): void {
      this.data[key] = value;
    }

    delete(key: string): void {
      delete this.data[key];
    }

    has(key: string): boolean {
      return key in this.data;
    }

    get store(): Record<string, string> {
      return this.data;
    }

    clear(): void {
      for (const k of Object.keys(this.data)) {
        delete this.data[k];
      }
    }
  }

  return { default: MockStore };
});

vi.mock('electron', () => ({
  safeStorage: {
    isEncryptionAvailable: mocks.isEncryptionAvailable,
    encryptString: mocks.encryptString,
    decryptString: mocks.decryptString,
  },
}));

const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

describe('Secrets', () => {
  let secrets: Secrets;

  beforeEach(() => {
    mockData = {};
    vi.clearAllMocks();
    consoleSpy.mockClear();
    errorSpy.mockClear();
    mocks.isEncryptionAvailable.mockReturnValue(true);
    mocks.encryptString.mockImplementation((plain: string) =>
      Buffer.from(`encrypted:${plain}`, 'utf-8'),
    );
    mocks.decryptString.mockImplementation((buffer: Buffer) =>
      buffer.toString('utf-8').replace('encrypted:', ''),
    );
    secrets = createSecrets();
  });

  describe('lazy initialization', () => {
    it('does not create store until first access', () => {
      createSecrets();
      expect(mockData).toEqual({});
    });

    it('creates store on first set access', () => {
      secrets.set('key', 'value');
      expect(mockData).toHaveProperty('key');
    });
  });

  describe('get', () => {
    it('returns undefined for non-existent key', () => {
      expect(secrets.get('nonexistent')).toBeUndefined();
    });

    it('returns decrypted value for existing key', () => {
      const encrypted = Buffer.from('encrypted:secret-value', 'utf-8').toString('base64');
      mockData['api-key'] = encrypted;
      expect(secrets.get('api-key')).toBe('secret-value');
    });

    it('returns undefined if decryption fails', () => {
      mocks.decryptString.mockImplementationOnce(() => {
        throw new Error('Decryption failed');
      });
      mockData['bad-key'] = 'invalid';
      expect(secrets.get('bad-key')).toBeUndefined();
    });

    it('does not log errors when decryption fails silently', () => {
      mocks.decryptString.mockImplementationOnce(() => {
        throw new Error('Decryption failed');
      });
      mockData['bad-key'] = 'invalid';
      secrets.get('bad-key');
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('set', () => {
    it('encrypts and stores value', () => {
      secrets.set('api-key', 'my-secret');
      expect(mocks.encryptString).toHaveBeenCalledWith('my-secret');
      expect(mockData['api-key']).toBeDefined();
    });

    it('overwrites existing value', () => {
      secrets.set('key', 'value1');
      secrets.set('key', 'value2');
      expect(mockData.key).toBeDefined();
    });

    it('throws if encryption fails', () => {
      mocks.encryptString.mockImplementationOnce(() => {
        throw new Error('Encryption failed');
      });
      expect(() => secrets.set('key', 'value')).toThrow('Encryption failed');
    });
  });

  describe('delete', () => {
    it('deletes an existing key', () => {
      secrets.set('api-key', 'secret');
      secrets.delete('api-key');
      expect(secrets.has('api-key')).toBe(false);
    });

    it('does nothing for non-existent key', () => {
      secrets.delete('nonexistent');
      expect(secrets.keys).toEqual([]);
    });
  });

  describe('has', () => {
    it('returns true for existing key', () => {
      secrets.set('api-key', 'secret');
      expect(secrets.has('api-key')).toBe(true);
    });

    it('returns false for non-existent key', () => {
      expect(secrets.has('nonexistent')).toBe(false);
    });
  });

  describe('isEncryptionAvailable', () => {
    it('returns true when encryption is available', () => {
      expect(secrets.isEncryptionAvailable).toBe(true);
    });

    it('returns false when encryption is not available', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();
      expect(secrets.isEncryptionAvailable).toBe(false);
    });

    it('caches encryption availability result', () => {
      secrets.isEncryptionAvailable;
      secrets.isEncryptionAvailable;
      expect(mocks.isEncryptionAvailable).toHaveBeenCalledTimes(1);
    });
  });

  describe('encryptionStatus', () => {
    it('returns encryption mode when available', () => {
      const status = secrets.encryptionStatus;
      expect(status.mode).toBe('encryption');
      expect(status.available).toBe(true);
    });

    it('returns fallback mode when encryption unavailable', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();
      const status = secrets.encryptionStatus;
      expect(status.mode).toBe('fallback');
      expect(status.available).toBe(false);
    });

    it('returns a copy of status (immutable)', () => {
      const status1 = secrets.encryptionStatus;
      const status2 = secrets.encryptionStatus;
      expect(status1).not.toBe(status2);
    });

    it('does not produce console output during normal operation', () => {
      secrets.set('key', 'value');
      secrets.get('key');
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('keys', () => {
    it('returns empty array when no keys', () => {
      expect(secrets.keys).toEqual([]);
    });

    it('returns all keys', () => {
      secrets.set('a', '1');
      secrets.set('b', '2');
      expect(secrets.keys).toContain('a');
      expect(secrets.keys).toContain('b');
    });
  });

  describe('clear', () => {
    it('removes all keys', () => {
      secrets.set('a', '1');
      secrets.set('b', '2');
      secrets.clear();
      expect(secrets.keys).toEqual([]);
    });
  });

  describe('fallback mode (encryption unavailable)', () => {
    it('uses base64 encoding when encryption is not available', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();

      secrets.set('api-key', 'my-secret');

      const stored = mockData['api-key'];
      expect(stored).toBeDefined();
      const decoded = Buffer.from(stored ?? '', 'base64').toString('utf-8');
      expect(decoded).toBe('my-secret');
    });

    it('decodes base64 when encryption was unavailable', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();

      secrets.set('api-key', 'my-secret');

      const result = secrets.get('api-key');
      expect(result).toBe('my-secret');
    });

    it('sets isEncryptionAvailable to false in fallback mode', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();
      expect(secrets.isEncryptionAvailable).toBe(false);
    });

    it('does not produce console warnings in fallback mode', () => {
      mocks.isEncryptionAvailable.mockReturnValueOnce(false);
      secrets = createSecrets();
      secrets.set('api-key', 'my-secret');
      secrets.get('api-key');
      expect(consoleSpy).not.toHaveBeenCalled();
      expect(errorSpy).not.toHaveBeenCalled();
    });
  });

  describe('createSecrets with options', () => {
    it('respects custom store name', () => {
      const customSecrets = createSecrets({ name: 'custom-secrets' });
      customSecrets.set('key', 'value');
      expect(customSecrets.keys).toContain('key');
    });
  });
});
