import { Button } from '@app/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@app/renderer/components/ui/card';
import { Input } from '@app/renderer/components/ui/input';
import { Separator } from '@app/renderer/components/ui/separator';
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
    <Card size='sm'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex flex-col gap-3'>
        {showKeyField && (
          <Input placeholder='Key' value={key} onChange={(e) => setKey(e.target.value)} />
        )}
        <Input
          placeholder={valuePlaceholder}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <Separator />
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
      </CardContent>
    </Card>
  );
}
