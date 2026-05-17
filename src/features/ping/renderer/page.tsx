import { orpc } from '@app/renderer/infra/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { TAB_META, type TabId } from '../shared/storage-types';
import { ActionPanel } from './components/ActionPanel';
import { type DataItem, DataList } from './components/DataList';
import { SecretCell } from './components/SecretCell';
import { StatusCards } from './components/StatusCards';

export function PingPage() {
  const [activeTab, setActiveTab] = useState<TabId>('preferences');
  const [searchTerm, setSearchTerm] = useState('');
  const queryClient = useQueryClient();

  // Queries
  const prefsQuery = useQuery(orpc.ping.getAllPreferences.queryOptions());
  const keysQuery = useQuery(orpc.ping.listApiKeys.queryOptions());
  const historyQuery = useQuery(orpc.ping.getPingHistory.queryOptions());
  const searchQuery = useQuery({
    ...orpc.ping.searchPings.queryOptions({ input: { term: searchTerm } }),
    enabled: searchTerm.length > 0,
  });

  // Preferences mutations
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

  // Secrets mutations
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

  // SQLite mutations
  const indexPing = useMutation(orpc.ping.indexPing.mutationOptions());

  const savePing = useMutation({
    ...orpc.ping.savePingToDb.mutationOptions(),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: orpc.ping.getPingHistory.queryOptions().queryKey });
      indexPing.mutate({
        id: String(data.id),
        message: variables.message,
        timestamp: variables.timestamp,
        count: variables.count,
      });
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

  // Handlers
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
        case 'search': {
          const term = value.trim();
          if (term.length > 0) setSearchTerm(term);
          break;
        }
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

  // Data mapping
  const prefItems: DataItem[] = prefsQuery.data
    ? Object.entries(prefsQuery.data).map(([k, v], i) => ({
        id: String(i),
        key: k,
        value: String(v ?? ''),
      }))
    : [];

  const secretItems: DataItem[] = keysQuery.data
    ? keysQuery.data.map((k) => ({ id: k, key: k, value: '' }))
    : [];

  const historyItems: DataItem[] = historyQuery.data
    ? historyQuery.data.map((r) => ({ id: r.id, key: r.id, value: r.message }))
    : [];

  const searchItems: DataItem[] = searchQuery.data
    ? searchQuery.data.map((r) => ({ id: r.id, key: r.id, value: r.message }))
    : [];

  const tabData: Record<TabId, DataItem[]> = {
    preferences: prefItems,
    secrets: secretItems,
    sqlite: historyItems,
    search: searchItems,
  };

  const tabCounts: Record<TabId, number> = {
    preferences: prefItems.length,
    secrets: secretItems.length,
    sqlite: historyItems.length,
    search: searchItems.length,
  };

  const tabLoading: Record<TabId, boolean> = {
    preferences: prefsQuery.isLoading,
    secrets: keysQuery.isLoading,
    sqlite: historyQuery.isLoading,
    search: searchQuery.isFetching,
  };

  const tabError: Record<TabId, string | null> = {
    preferences: prefsQuery.error?.message ?? null,
    secrets: keysQuery.error?.message ?? null,
    sqlite: historyQuery.error?.message ?? null,
    search: searchQuery.error?.message ?? null,
  };

  const meta = TAB_META[activeTab];
  const items = tabData[activeTab];
  const loading = tabLoading[activeTab];
  const error = tabError[activeTab];

  return (
    <div className='flex flex-col min-h-0'>
      <StatusCards activeTab={activeTab} tabCounts={tabCounts} onTabChange={setActiveTab} />

      {/* Inspector + Data Browser */}
      <div className='flex-1 flex min-h-0'>
        {/* Left — Inspector */}
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
          {activeTab === 'search' ? (
            <ActionPanel
              title='SEARCH'
              onAdd={handleAdd}
              onDelete={() => setSearchTerm('')}
              showKeyField={false}
              valuePlaceholder='Search indexed data...'
            />
          ) : (
            <ActionPanel
              title={
                activeTab === 'preferences'
                  ? 'NEW PREFERENCE'
                  : activeTab === 'secrets'
                    ? 'NEW SECRET'
                    : 'NEW PING'
              }
              onAdd={handleAdd}
              onDelete={handleDelete}
              showKeyField={activeTab !== 'sqlite'}
              valuePlaceholder={
                activeTab === 'preferences'
                  ? 'Value'
                  : activeTab === 'secrets'
                    ? 'Secret value'
                    : 'Message'
              }
            />
          )}
        </div>

        {/* Right — Data Browser */}
        <div className='flex-1 p-4 min-w-0 overflow-y-auto'>
          <DataList
            title={
              activeTab === 'preferences'
                ? 'PREFERENCES'
                : activeTab === 'secrets'
                  ? 'SECRETS'
                  : activeTab === 'sqlite'
                    ? 'PING HISTORY'
                    : 'SEARCH RESULTS'
            }
            items={items}
            onEdit={() => {}}
            onDelete={(item) => handleDelete(item.key)}
            renderValue={
              activeTab === 'secrets' ? (item) => <SecretCell value={item.value} /> : undefined
            }
            emptyMessage={
              error
                ? `Error: ${error}`
                : loading
                  ? 'Loading...'
                  : activeTab === 'search'
                    ? searchTerm
                      ? 'No matches found'
                      : 'Enter a search term above'
                    : 'No data — use the panel to add some'
            }
          />
        </div>
      </div>
    </div>
  );
}
