import { TAB_META, type TabId } from '../../shared/storage-types';

interface StatusCardsProps {
  activeTab: TabId;
  tabCounts: Record<TabId, number>;
  onTabChange: (tab: TabId) => void;
}

export function StatusCards({ activeTab, tabCounts, onTabChange }: StatusCardsProps) {
  return (
    <div className='flex gap-2 px-4 py-3 border-b border-border'>
      {(Object.entries(TAB_META) as [TabId, (typeof TAB_META)[TabId]][]).map(([id, m]) => (
        <button
          key={id}
          type='button'
          onClick={() => onTabChange(id)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-all flex-1 ${
            activeTab === id
              ? 'bg-accent text-accent-foreground ring-1 ring-border'
              : 'text-muted-foreground hover:bg-accent/30'
          }`}
        >
          <div className='min-w-0'>
            <p className='text-xs font-medium'>{m.label}</p>
            <p className='text-[10px] text-muted-foreground/60'>{tabCounts[id]} items</p>
          </div>
          <div
            className={`ml-auto size-1.5 rounded-full ${
              activeTab === id ? 'bg-primary' : 'bg-muted-foreground/20'
            }`}
          />
        </button>
      ))}
    </div>
  );
}
