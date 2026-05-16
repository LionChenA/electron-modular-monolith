import { useLocation } from '@tanstack/react-router';
import { ThemeToggle } from './ThemeToggle';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Home',
  '/storage': 'Storage Explorer',
  '/settings': 'Settings',
};

export function TopBar() {
  const { pathname } = useLocation();
  const title = PAGE_TITLES[pathname] ?? 'Electron App';

  return (
    <header className='flex items-center justify-between h-12 px-4 border-b border-border shrink-0 bg-background'>
      <h1 className='text-sm font-semibold text-foreground'>{title}</h1>
      <ThemeToggle />
    </header>
  );
}
