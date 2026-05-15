import { Button } from '@app/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/renderer/components/ui/card';
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
    <Card size='sm' className='flex-1'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        {items.length === 0 ? (
          <EmptyState message={emptyMessage} />
        ) : (
          <ScrollArea className='max-h-[400px]'>
            <div className='flex flex-col gap-1 px-4 pb-4'>
              {items.map((item) => (
                <div
                  key={item.id}
                  className='flex items-center justify-between rounded-md border border-border bg-input/10 px-3 py-2 text-xs'
                >
                  <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                    <span className='font-mono text-foreground truncate'>{item.key}</span>
                    {renderValue ? (
                      renderValue(item)
                    ) : (
                      <span className='text-muted-foreground truncate'>{item.value}</span>
                    )}
                  </div>
                  <div className='flex gap-1 ml-2 shrink-0'>
                    <Button
                      variant='ghost'
                      size='icon-xs'
                      onClick={() => onEdit(item)}
                      aria-label={`Edit ${item.key}`}
                    >
                      <PencilIcon className='size-3' />
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon-xs'
                      onClick={() => onDelete(item)}
                      aria-label={`Delete ${item.key}`}
                    >
                      <Trash2Icon className='size-3' />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
