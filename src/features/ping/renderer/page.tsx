import { buttonVariants } from '@app/renderer/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@app/renderer/components/ui/tabs';
import { orpc } from '@app/renderer/infra/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { DatabaseIcon, KeyIcon, SearchIcon, Settings2Icon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
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

export function PingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('preferences');
  const queryClient = useQueryClient();

  // --- Queries ---
  const prefsQuery = useQuery(orpc.ping.getAllPreferences.queryOptions());
  const keysQuery = useQuery(orpc.ping.listApiKeys.queryOptions());
  const historyQuery = useQuery(orpc.ping.getPingHistory.queryOptions());

  // --- Mutations: Preferences ---
  const setPref = useMutation({
    ...orpc.ping.setPreferences.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.ping.getAllPreferences.queryOptions().queryKey,
      });
      toast.success('Preference saved');
    },
    onError: () => toast.error('Failed to save preference'),
  });

  const delPref = useMutation({
    ...orpc.ping.deletePreference.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpc.ping.getAllPreferences.queryOptions().queryKey,
      });
      toast.success('Preference deleted');
    },
    onError: () => toast.error('Failed to delete preference'),
  });

  // --- Mutations: Secrets ---
  const storeKey = useMutation({
    ...orpc.ping.storeApiKey.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.ping.listApiKeys.queryOptions().queryKey });
      toast.success('Secret saved');
    },
    onError: () => toast.error('Failed to save secret'),
  });

  const delKey = useMutation({
    ...orpc.ping.deleteApiKey.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.ping.listApiKeys.queryOptions().queryKey });
      toast.success('Secret deleted');
    },
    onError: () => toast.error('Failed to delete secret'),
  });

  // --- Mutations: SQLite ---
  const savePing = useMutation({
    ...orpc.ping.savePingToDb.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.ping.getPingHistory.queryOptions().queryKey });
      toast.success('Ping saved');
    },
    onError: () => toast.error('Failed to save ping'),
  });

  const delPing = useMutation({
    ...orpc.ping.deletePing.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orpc.ping.getPingHistory.queryOptions().queryKey });
      toast.success('Ping deleted');
    },
    onError: () => toast.error('Failed to delete ping'),
  });

  // --- Handlers ---
  const handleAdd = useCallback(
    (key: string, value: string) => {
      switch (activeTab) {
        case 'preferences':
          setPref.mutate({ key, value });
          break;
        case 'secrets':
          storeKey.mutate({ key, value });
          break;
        case 'sqlite':
          savePing.mutate({ message: value, timestamp: Date.now() });
          break;
      }
    },
    [activeTab, setPref, storeKey, savePing],
  );

  const handleDelete = useCallback(
    (key: string) => {
      switch (activeTab) {
        case 'preferences':
          delPref.mutate({ key });
          break;
        case 'secrets':
          delKey.mutate({ key });
          break;
        case 'sqlite':
          delPing.mutate({ id: key });
          break;
      }
    },
    [activeTab, delPref, delKey, delPing],
  );

  // --- Data mapping per tab ---
  const prefItems: DataItem[] = prefsQuery.data
    ? Object.entries(prefsQuery.data).map(([k, v], i) => ({
        id: String(i),
        key: k,
        value: String(v ?? ''),
      }))
    : [];

  const secretItems: DataItem[] = keysQuery.data
    ? keysQuery.data.map((k) => ({
        id: k,
        key: k,
        value: '',
      }))
    : [];

  const historyItems: DataItem[] = historyQuery.data
    ? historyQuery.data.map((r) => ({
        id: r.id,
        key: r.id,
        value: r.message,
      }))
    : [];

  const tabData: Record<TabId, DataItem[]> = {
    preferences: prefItems,
    secrets: secretItems,
    sqlite: historyItems,
    search: [],
  };

  const tabLoading: Record<TabId, boolean> = {
    preferences: prefsQuery.isLoading,
    secrets: keysQuery.isLoading,
    sqlite: historyQuery.isLoading,
    search: false,
  };

  return (
    <div className='dark relative flex flex-col items-center min-h-screen bg-background font-sans text-foreground selection:bg-primary/20'>
      <img
        src={wavyLines}
        className='absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none'
        alt='Background Pattern'
      />

      <div className='relative z-10 w-full max-w-5xl p-6 flex flex-col gap-4'>
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
                  items={tabData[tabId]}
                  onEdit={() => {}}
                  onDelete={(item) => handleDelete(item.key)}
                  renderValue={
                    tabId === 'secrets' ? (item) => <SecretCell value={item.value} /> : undefined
                  }
                  emptyMessage={
                    tabId === 'search'
                      ? 'Enter a search term above'
                      : tabLoading[tabId]
                        ? 'Loading...'
                        : 'No data — use the panel to add some'
                  }
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className='text-center text-xs text-muted-foreground pt-2'>
          Powered by electron-store • SafeStorage • SQLite • Orama
        </div>
      </div>
    </div>
  );
}
