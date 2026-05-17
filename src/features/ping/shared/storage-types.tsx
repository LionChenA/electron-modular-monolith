import type { DatabaseIcon, KeyIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import type { ReactNode } from 'react';

export type TabId = 'preferences' | 'secrets' | 'sqlite' | 'search';

export interface TabMeta {
  label: string;
  icon: ReactNode;
  desc: string;
}

export const TAB_META: Record<TabId, TabMeta> = {
  preferences: { label: 'Preferences', icon: <Settings2Icon />, desc: 'electron-store key-value' },
  secrets: { label: 'Secrets', icon: <KeyIcon />, desc: 'OS-level encrypted secrets' },
  sqlite: { label: 'SQLite', icon: <DatabaseIcon />, desc: 'Structured data with SQL' },
  search: { label: 'Search', icon: <SearchIcon />, desc: 'Orama full-text search' },
};
