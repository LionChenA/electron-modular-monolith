import { safeStorage } from 'electron';
import Store from 'electron-store';

export interface EncryptionStatus {
  mode: 'encryption' | 'fallback';
  available: boolean;
  platform?: 'linux' | 'darwin' | 'win32' | 'other';
}

export interface SecretsOptions {
  name?: string;
}

export interface Secrets {
  get(key: string): string | undefined;
  set(key: string, value: string): void;
  delete(key: string): void;
  has(key: string): boolean;
  get isEncryptionAvailable(): boolean;
  get encryptionStatus(): EncryptionStatus;
  get keys(): string[];
  clear(): void;
}

export function createSecrets(options: SecretsOptions = {}): Secrets {
  const { name = 'secrets' } = options;

  let store: Store<Record<string, string>> | undefined;
  let encryptionStatus: EncryptionStatus = {
    mode: 'fallback',
    available: false,
  };
  let initialized = false;

  function getStore(): Store<Record<string, string>> {
    if (!store) {
      store = new Store<Record<string, string>>({ name });
    }
    return store;
  }

  function initialize(): void {
    if (initialized) return;
    initialized = true;

    try {
      const available = safeStorage.isEncryptionAvailable();
      encryptionStatus = {
        mode: available ? 'encryption' : 'fallback',
        available,
        platform: getPlatform(),
      };
    } catch {
      encryptionStatus = {
        mode: 'fallback',
        available: false,
        platform: getPlatform(),
      };
    }
  }

  function getPlatform(): EncryptionStatus['platform'] {
    if (process.platform === 'linux') return 'linux';
    if (process.platform === 'darwin') return 'darwin';
    if (process.platform === 'win32') return 'win32';
    return 'other';
  }

  function encryptString(plainText: string): string {
    initialize();
    if (encryptionStatus.mode === 'encryption') {
      try {
        const encrypted = safeStorage.encryptString(plainText);
        return encrypted.toString('base64');
      } catch {
        throw new Error('Encryption failed');
      }
    }

    return Buffer.from(plainText, 'utf-8').toString('base64');
  }

  function decryptString(encryptedText: string): string {
    initialize();
    if (encryptionStatus.mode === 'encryption') {
      const buffer = Buffer.from(encryptedText, 'base64');
      return safeStorage.decryptString(buffer);
    }

    return Buffer.from(encryptedText, 'base64').toString('utf-8');
  }

  const secrets: Secrets = {
    get(key: string): string | undefined {
      const encryptedValue = getStore().get(key);
      if (encryptedValue === undefined) {
        return undefined;
      }

      try {
        return decryptString(encryptedValue);
      } catch {
        return undefined;
      }
    },

    set(key: string, value: string): void {
      const encryptedValue = encryptString(value);
      getStore().set(key, encryptedValue);
    },

    delete(key: string): void {
      getStore().delete(key);
    },

    has(key: string): boolean {
      return getStore().has(key);
    },

    get isEncryptionAvailable(): boolean {
      initialize();
      return encryptionStatus.available;
    },

    get encryptionStatus(): EncryptionStatus {
      initialize();
      return { ...encryptionStatus };
    },

    get keys(): string[] {
      return Object.keys(getStore().store ?? {});
    },

    clear(): void {
      getStore().clear();
    },
  };

  return secrets;
}

export const secrets = createSecrets();
