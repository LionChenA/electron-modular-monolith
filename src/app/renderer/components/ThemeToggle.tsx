import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggle = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <button
      type='button'
      onClick={toggle}
      className='p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors'
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <SunIcon className='size-3.5' /> : <MoonIcon className='size-3.5' />}
    </button>
  );
}
