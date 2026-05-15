import { buttonVariants } from '@app/renderer/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/renderer/components/ui/tabs';
import { Link } from '@tanstack/react-router';
import { DatabaseIcon, KeyIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import wavyLines from '../../../app/renderer/assets/wavy-lines.svg';
import { ActionPanel } from './components/ActionPanel';
import { type DataItem, DataList } from './components/DataList';
import { SecretCell } from './components/SecretCell';

type TabId = 'preferences' | 'secrets' | 'sqlite' | 'search';

const TAB_META: Record<TabId, { label: string; icon: React.ReactNode }> = {
  preferences: { label: 'Preferences', icon: <Settings2Icon /> },
  secrets: { label: 'Secrets', icon: <KeyIcon /> },
  sqlite: { label: 'SQLite', icon: <DatabaseIcon /> },
  search: { label: 'Search', icon: <SearchIcon /> },
};

// Phase 2: Static demo data — will be replaced by TanStack Query in Phase 3
const DEMO_DATA: Record<TabId, DataItem[]> = {
  preferences: [
    { id: '1', key: 'theme', value: 'dark' },
    { id: '2', key: 'language', value: 'en-US' },
    { id: '3', key: 'notifications', value: 'true' },
  ],
  secrets: [
    { id: '1', key: 'apiKey', value: 'sk-xxx...' },
    { id: '2', key: 'dbPassword', value: 'p@ssw0rd' },
    { id: '3', key: 'sessionToken', value: 'jwt-xxx...' },
  ],
  sqlite: [
    { id: '1', key: 'ping-001', value: 'Hello at 1710000000' },
    { id: '2', key: 'ping-002', value: 'Hello at 1710000001' },
  ],
  search: [],
};

export function PingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('preferences');
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);

  const handleAdd = useCallback(
    (_key: string, _value: string) => {
      // Phase 3: wire up ORPC mutation
      console.log('add', activeTab, _key, _value);
    },
    [activeTab],
  );

  const handleDelete = useCallback(
    (_key: string) => {
      // Phase 3: wire up ORPC mutation
      console.log('delete', activeTab, _key);
    },
    [activeTab],
  );

  const handleEdit = useCallback((item: DataItem) => {
    setEditingItem(item);
  }, []);

  const items = DEMO_DATA[activeTab];

  return (
    <div className='dark relative flex flex-col items-center min-h-screen bg-background font-sans text-foreground selection:bg-primary/20'>
      <img
        src={wavyLines}
        className='absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none'
        alt='Background Pattern'
      />

      <div className='relative z-10 w-full max-w-5xl p-6 flex flex-col gap-4'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#087ea4] to-[#7c93ee]'>
              Storage Explorer
            </h1>
            <p className='text-muted-foreground mt-1'>
              Interactive storage demo — CRUD operations on all backends
            </p>
          </div>
          <Link to='/' className={buttonVariants({ variant: 'outline' })}>
            Go Home
          </Link>
        </div>

        {/* Tabs + Split Panel */}
        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as TabId)}
          className='flex flex-col gap-4'
        >
          <TabsList className='w-fit'>
            {Object.entries(TAB_META).map(([id, meta]) => (
              <TabsTrigger key={id} value={id}>
                {meta.icon}
                {meta.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {Object.keys(TAB_META).map((tabId) => (
            <TabsContent key={tabId} value={tabId} className='flex gap-4'>
              {/* Left Panel — Action / Search */}
              <div className='w-[35%] shrink-0'>
                {tabId === 'search' ? (
                  <ActionPanel
                    title='Search Orama'
                    onAdd={() => {}}
                    onDelete={() => {}}
                    showKeyField={false}
                    valuePlaceholder='Search indexed data...'
                  />
                ) : (
                  <ActionPanel
                    title={
                      tabId === 'preferences'
                        ? 'Add Preference'
                        : tabId === 'secrets'
                          ? 'Add Secret'
                          : 'Add Ping Record'
                    }
                    onAdd={handleAdd}
                    onDelete={handleDelete}
                    showKeyField={tabId !== 'sqlite'}
                    valuePlaceholder={
                      tabId === 'preferences'
                        ? 'Value'
                        : tabId === 'secrets'
                          ? 'Secret value'
                          : 'Message'
                    }
                  />
                )}
              </div>

              {/* Right Panel — Data List */}
              <div className='flex-1 min-w-0'>
                <DataList
                  title={
                    tabId === 'preferences'
                      ? 'Preferences'
                      : tabId === 'secrets'
                        ? 'Secrets'
                        : tabId === 'sqlite'
                          ? 'Ping History'
                          : 'Search Results'
                  }
                  items={items}
                  onEdit={handleEdit}
                  onDelete={(item) => handleDelete(item.key)}
                  renderValue={
                    tabId === 'secrets' ? (item) => <SecretCell value={item.value} /> : undefined
                  }
                  emptyMessage={
                    tabId === 'search'
                      ? 'Enter a search term above'
                      : 'No data — use the panel to add some'
                  }
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Footer */}
        <div className='text-center text-xs text-muted-foreground pt-2'>
          Powered by electron-store • SafeStorage • SQLite • Orama
        </div>
      </div>
    </div>
  );
}
