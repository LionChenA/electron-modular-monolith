/**
 * PROTOTYPE — Variant D "Final" design reference.
 * Kept for comparison with the real /storage implementation.
 * Delete once visual consistency is confirmed.
 */

import { createFileRoute } from '@tanstack/react-router';
import { HomeIcon, SettingsIcon } from 'lucide-react';
import { useState } from 'react';
import { TAB_META, type TabId } from '../../../features/ping/shared/storage-types';

export const Route = createFileRoute('/prototype')({ component: PrototypePage });

const DEMO_KEYS: Record<TabId, { key: string; value: string }[]> = {
  preferences: [
    { key: 'theme', value: 'dark' },
    { key: 'language', value: 'en-US' },
    { key: 'notifications', value: 'true' },
  ],
  secrets: [
    { key: 'apiKey', value: '' },
    { key: 'dbPassword', value: '' },
  ],
  sqlite: [
    { key: 'ping-001', value: 'Hello at 1710000000' },
    { key: 'ping-002', value: 'Hello at 1710000001' },
  ],
  search: [],
};

function PrototypePage() {
  const [tab, setTab] = useState<TabId>('preferences');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const items = DEMO_KEYS[tab];
  const meta = TAB_META[tab];
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  return (
    <div className={theme}>
      <div className='flex h-screen bg-background text-foreground overflow-hidden'>
        {/* Activity Bar */}
        <nav className='w-12 shrink-0 border-r border-border bg-muted/30 flex flex-col items-center py-3 gap-1'>
          <div className='flex flex-col items-center gap-1'>
            <button type='button' className='p-2 rounded-md bg-accent text-accent-foreground'>
              <HomeIcon />
            </button>
            <button
              type='button'
              className='p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50'
            >
              <DatabaseIcon />
            </button>
          </div>
          <div className='mt-auto flex flex-col items-center gap-1'>
            <button
              type='button'
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              className='p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50'
            >
              <SettingsIcon />
            </button>
            <div className='w-full px-3 py-1'>
              <div className='h-px bg-border' />
            </div>
            <button
              type='button'
              className='p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent/50'
            >
              <SettingsIcon />
            </button>
          </div>
        </nav>

        <div className='flex-1 flex flex-col min-w-0'>
          {/* Top Bar */}
          <header className='flex items-center justify-between h-12 px-4 border-b border-border shrink-0 bg-background'>
            <h1 className='text-sm font-semibold text-foreground'>Storage Explorer</h1>
          </header>

          {/* Status cards row */}
          <div className='flex gap-2 px-4 py-3 border-b border-border'>
            {(Object.entries(TAB_META) as [TabId, typeof meta][]).map(([id, m]) => (
              <button
                key={id}
                type='button'
                onClick={() => setTab(id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all flex-1 ${
                  tab === id
                    ? 'bg-accent text-accent-foreground ring-1 ring-border'
                    : 'text-muted-foreground hover:bg-accent/30'
                }`}
              >
                <div className='min-w-0'>
                  <p className='text-xs font-medium'>{m.label}</p>
                  <p className='text-[10px] text-muted-foreground/60'>
                    {DEMO_KEYS[id].length} items
                  </p>
                </div>
                <div
                  className={`ml-auto size-1.5 rounded-full ${tab === id ? 'bg-primary' : 'bg-muted-foreground/20'}`}
                />
              </button>
            ))}
          </div>

          {/* Inspector + Data Browser */}
          <div className='flex-1 flex min-h-0'>
            <div className='w-[240px] shrink-0 border-r border-border p-4 flex flex-col gap-4 overflow-y-auto'>
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1'>
                  ENGINE
                </p>
                <p className='text-sm font-medium text-foreground'>{meta.label}</p>
                <p className='text-xs text-muted-foreground mt-0.5'>{meta.desc}</p>
              </div>
              <div className='h-px bg-border' />
              <div>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1'>
                  ENTRIES
                </p>
                <p className='text-2xl font-light text-foreground tabular-nums'>{items.length}</p>
              </div>
              <div className='h-px bg-border' />
              <div className='flex flex-col gap-1.5'>
                <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5'>
                  NEW ENTRY
                </p>
                <input
                  placeholder='Key'
                  value={newKey}
                  onChange={(e) => setNewKey(e.target.value)}
                  className='h-7 px-2 rounded-md border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30'
                />
                <input
                  placeholder='Value'
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className='h-7 px-2 rounded-md border border-input bg-background text-xs text-foreground placeholder:text-muted-foreground outline-none focus-visible:border-ring focus-visible:ring-1 focus-visible:ring-ring/30'
                />
                <button
                  type='button'
                  disabled={!newValue.trim()}
                  className='h-7 px-3 rounded-md bg-primary text-primary-foreground text-xs font-medium disabled:opacity-50 transition-opacity mt-1'
                >
                  + Add
                </button>
              </div>
            </div>

            <div className='flex-1 p-4 min-w-0 overflow-y-auto'>
              <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3'>
                ENTRIES
              </p>
              {items.length === 0 ? (
                <div className='flex flex-col items-center justify-center py-16 text-muted-foreground'>
                  <p className='text-sm'>No data</p>
                  <p className='text-xs mt-1 text-muted-foreground/60'>
                    Add your first entry using the panel
                  </p>
                </div>
              ) : (
                <div className='flex flex-col'>
                  {items.map((item, i) => (
                    <div
                      key={item.key}
                      className='group flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-b-0 transition-colors'
                    >
                      <div className='flex items-center gap-4 min-w-0 flex-1'>
                        <span className='text-xs text-muted-foreground/30 w-5 text-right tabular-nums shrink-0'>
                          {i + 1}
                        </span>
                        <span className='text-sm font-mono text-foreground/90 w-[10ch] shrink-0 truncate'>
                          {item.key}
                        </span>
                        <span className='text-xs text-muted-foreground/70 font-mono truncate'>
                          {item.value || '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
