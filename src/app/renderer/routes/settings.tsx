import { cn } from '@src/app/renderer/lib/utils';
import { createFileRoute } from '@tanstack/react-router';
import { useTheme } from 'next-themes';

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
});

const THEMES = ['light', 'dark', 'system'] as const;

function SettingsPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className='p-6 max-w-lg'>
      <h2 className='text-sm font-medium text-foreground mb-4'>Appearance</h2>
      <div className='flex items-center justify-between p-3 rounded-lg border border-border bg-muted/20'>
        <span className='text-xs text-foreground'>Theme</span>
        <div className='flex gap-1'>
          {THEMES.map((t) => (
            <button
              key={t}
              type='button'
              onClick={() => setTheme(t)}
              className={cn(
                'px-2.5 py-1 rounded text-[11px] font-medium transition-all capitalize',
                theme === t
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
      <p className='text-[11px] text-muted-foreground mt-2'>
        Change the appearance of the application. System follows your OS setting.
      </p>
    </div>
  );
}
