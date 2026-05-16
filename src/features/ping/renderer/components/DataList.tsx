import { Button } from '@app/renderer/components/ui/button';
import { ScrollArea } from '@app/renderer/components/ui/scroll-area';
import { PencilIcon, Trash2Icon } from 'lucide-react';
import { EmptyState } from './EmptyState';

export interface DataItem {
  id: string;
  key: string;
  value: string;
}

interface DataListProps {
  title: string;
  items: DataItem[];
  onEdit: (item: DataItem) => void;
  onDelete: (item: DataItem) => void;
  renderValue?: (item: DataItem) => React.ReactNode;
  emptyMessage?: string;
}

export function DataList({
  title,
  items,
  onEdit,
  onDelete,
  renderValue,
  emptyMessage,
}: DataListProps) {
  return (
    <div className='flex flex-col gap-2'>
      <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
        {title}
      </p>
      {items.length === 0 ? (
        <EmptyState message={emptyMessage} />
      ) : (
        <ScrollArea className='max-h-[400px]'>
          <div className='flex flex-col gap-1'>
            {items.map((item, i) => (
              <div
                key={item.id}
                className='group flex items-center justify-between px-4 py-2.5 border-b border-border/40 last:border-b-0 transition-colors'
              >
                <div className='flex items-center gap-4 min-w-0 flex-1'>
                  <span className='text-xs text-muted-foreground/30 w-5 text-right tabular-nums shrink-0'>
                    {i + 1}
                  </span>
                  <div className='flex items-center gap-4 min-w-0 flex-1'>
                    <span className='text-sm font-mono text-foreground/90 w-[10ch] shrink-0 truncate'>
                      {item.key}
                    </span>
                    {renderValue ? (
                      renderValue(item)
                    ) : (
                      <span className='text-xs text-muted-foreground/70 font-mono truncate'>
                        {item.value}
                      </span>
                    )}
                  </div>
                </div>
                <div className='flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity'>
                  <Button variant='ghost' size='icon-xs' onClick={() => onEdit(item)}>
                    <PencilIcon className='size-3' />
                  </Button>
                  <Button variant='ghost' size='icon-xs' onClick={() => onDelete(item)}>
                    <Trash2Icon className='size-3' />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
