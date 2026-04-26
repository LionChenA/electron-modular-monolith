import Store, { type Schema } from 'electron-store';

export interface PreferencesOptions {
  schema?: Schema<Record<string, unknown>>;
  defaults?: Record<string, unknown>;
  name?: string;
  clearInvalidConfig?: boolean;
}

export interface Preferences {
  get<T = unknown>(key: string): T | undefined;
  get<T = unknown>(key: string, defaultValue: T): T;
  set<T = unknown>(key: string, value: T): void;
  delete(key: string): void;
  has(key: string): boolean;
  get keys(): string[];
  get values(): Record<string, unknown>;
  get path(): string;
  clear(): void;
  reset(): void;
}

export function createPreferences(options: PreferencesOptions = {}): Preferences {
  const { name = 'preferences', clearInvalidConfig = false, defaults = {}, schema } = options;

  let store: Store<Record<string, unknown>> | undefined;

  function getStore(): Store<Record<string, unknown>> {
    if (!store) {
      store = new Store({ name, clearInvalidConfig, defaults, schema });
    }
    return store;
  }

  const _preferences: Preferences = {
    get<T = unknown>(key: string, defaultValue?: T): T | undefined {
      if (defaultValue !== undefined) {
        return getStore().get(key, defaultValue) as T;
      }
      return getStore().get(key) as T | undefined;
    },

    set<T = unknown>(key: string, value: T): void {
      getStore().set(key, value);
    },

    delete(key: string): void {
      getStore().delete(key);
    },

    has(key: string): boolean {
      return getStore().has(key);
    },

    get keys(): string[] {
      return getStore().store ? Object.keys(getStore().store) : [];
    },

    get values(): Record<string, unknown> {
      return getStore().store as Record<string, unknown>;
    },

    get path(): string {
      return getStore().path;
    },

    clear(): void {
      getStore().clear();
    },

    reset(): void {
      getStore().reset();
    },
  };

  return _preferences;
}

export const preferences = createPreferences();
