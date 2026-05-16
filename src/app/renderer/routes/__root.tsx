import { ActivityBar } from '@app/renderer/components/ActivityBar';
import { TopBar } from '@app/renderer/components/TopBar';
import { Toaster } from '@app/renderer/components/ui/sonner';
import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider attribute='class' defaultTheme='dark' enableSystem>
      <div className='flex h-screen bg-background text-foreground overflow-hidden'>
        <ActivityBar />
        <div className='flex-1 flex flex-col min-w-0'>
          <TopBar />
          <main className='flex-1 overflow-auto'>
            <Outlet />
          </main>
        </div>
      </div>
      <Toaster />
    </ThemeProvider>
  ),
});
