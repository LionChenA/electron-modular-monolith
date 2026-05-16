import { cn } from '@src/app/renderer/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { DatabaseIcon, HomeIcon, SettingsIcon } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

const NAV_ITEMS = [
  { to: '/', icon: HomeIcon, label: 'Home' },
  { to: '/storage', icon: DatabaseIcon, label: 'Storage' },
] as const;

export function ActivityBar() {
  const { pathname } = useLocation();

  return (
    <nav className='w-12 shrink-0 border-r border-border bg-muted/30 flex flex-col items-center py-3 gap-1'>
      <div className='flex flex-col items-center gap-1'>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              'p-2 rounded-md transition-all',
              pathname === item.to
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
            )}
            title={item.label}
          >
            <item.icon className='size-4' />
          </Link>
        ))}
      </div>

      <div className='mt-auto flex flex-col items-center gap-1'>
        <ThemeToggle />
        <div className='w-full px-3 py-1'>
          <div className='h-px bg-border' />
        </div>
        <Link
          to='/settings'
          className={cn(
            'p-2 rounded-md transition-all',
            pathname === '/settings'
              ? 'bg-accent text-accent-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
          )}
          title='Settings'
        >
          <SettingsIcon className='size-4' />
        </Link>
      </div>
    </nav>
  );
}
