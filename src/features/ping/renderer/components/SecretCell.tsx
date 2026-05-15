import { Button } from '@app/renderer/components/ui/button';
import { CheckIcon, CopyIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useCallback, useState } from 'react';

interface SecretCellProps {
  value: string;
}

export function SecretCell({ value }: SecretCellProps) {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleReveal = useCallback(() => {
    setRevealed((prev) => !prev);
  }, []);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API not available
    }
  }, [value]);

  return (
    <span className='font-mono text-xs flex items-center gap-2'>
      <span className='min-w-[6ch]'>{revealed ? value : '••••••••'}</span>
      <Button
        variant='ghost'
        size='icon-xs'
        onClick={handleReveal}
        aria-label={revealed ? 'Hide secret' : 'Reveal secret'}
      >
        {revealed ? <EyeOffIcon className='size-3' /> : <EyeIcon className='size-3' />}
      </Button>
      <Button variant='ghost' size='icon-xs' onClick={handleCopy} aria-label='Copy secret'>
        {copied ? <CheckIcon className='size-3 text-green-500' /> : <CopyIcon className='size-3' />}
      </Button>
    </span>
  );
}
