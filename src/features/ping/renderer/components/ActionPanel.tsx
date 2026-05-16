import { Button } from '@app/renderer/components/ui/button';
import { Input } from '@app/renderer/components/ui/input';
import { PlusIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';

interface ActionPanelProps {
  title: string;
  onAdd: (key: string, value: string) => void;
  onDelete: (key: string) => void;
  showKeyField?: boolean;
  valuePlaceholder?: string;
}

export function ActionPanel({
  title,
  onAdd,
  onDelete,
  showKeyField = true,
  valuePlaceholder = 'Value',
}: ActionPanelProps) {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (showKeyField && !key.trim()) return;
    if (!value.trim()) return;
    onAdd(key.trim(), value.trim());
    setKey('');
    setValue('');
  };

  const handleDelete = () => {
    if (showKeyField && !key.trim()) return;
    onDelete(key.trim());
    setKey('');
    setValue('');
  };

  return (
    <div className='flex flex-col gap-3'>
      <p className='text-[10px] font-semibold uppercase tracking-wider text-muted-foreground'>
        {title}
      </p>
      {showKeyField && (
        <Input placeholder='Key' value={key} onChange={(e) => setKey(e.target.value)} />
      )}
      <Input
        placeholder={valuePlaceholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <div className='h-px bg-border' />
      <div className='flex gap-2'>
        <Button size='sm' onClick={handleAdd} disabled={!value.trim()}>
          <PlusIcon data-icon='inline-start' />
          Add
        </Button>
        <Button
          size='sm'
          variant='destructive'
          onClick={handleDelete}
          disabled={showKeyField && !key.trim()}
        >
          <Trash2Icon data-icon='inline-start' />
          Delete
        </Button>
      </div>
    </div>
  );
}
