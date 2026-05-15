import { Button } from '@app/renderer/components/ui/button';
import { InboxIcon } from 'lucide-react';

interface EmptyStateProps {
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ message = 'No data yet', actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className='flex flex-col items-center justify-center gap-3 py-12 text-center'>
      <InboxIcon className='size-8 text-muted-foreground/50' />
      <p className='text-xs text-muted-foreground'>{message}</p>
      {actionLabel && onAction && (
        <Button variant='outline' size='sm' onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
