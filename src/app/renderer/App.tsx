import { useMutation, useQuery } from '@tanstack/react-query';
import electronLogo from './assets/electron.svg';
import wavyLines from './assets/wavy-lines.svg';
import { Button, buttonVariants } from './components/ui/button';
import Versions from './components/Versions';
import { orpc } from './infra/client';

function App(): React.JSX.Element {
  const { mutate: ping } = useMutation(orpc.ping.sendPing.mutationOptions());
  const { data: lastPing } = useQuery(orpc.ping.onPing.experimental_liveOptions());

  const ipcHandle = (): void => {
    ping();
  };

  return (
    <div className='dark relative flex flex-col items-center justify-center min-h-screen bg-background font-sans text-foreground selection:bg-primary/20 pb-20'>
      <img
        src={wavyLines}
        className='absolute inset-0 w-full h-full object-cover opacity-100 pointer-events-none'
        alt='Background Pattern'
      />

      <div className='relative z-10 flex flex-col items-center justify-center w-full min-h-screen pb-20'>
        <img
          alt='logo'
          className='h-32 w-32 mb-5 transition-[filter] duration-300 hover:drop-shadow-[0_0_1.2em_var(--color-primary)]'
          src={electronLogo}
        />

        <div className='text-sm font-semibold text-muted-foreground mb-2.5'>
          Powered by electron-vite
        </div>

        <div className='text-3xl font-bold text-center mb-4 leading-tight'>
          Build an Electron app with{' '}
          <span className='text-transparent bg-clip-text bg-linear-to-br from-[#087ea4] to-[#7c93ee]'>
            React
          </span>
          &nbsp;and{' '}
          <span className='text-transparent bg-clip-text bg-linear-to-br from-[#3178c6] to-[#f0dc4e]'>
            TypeScript
          </span>
        </div>

        <p className='text-base font-medium text-muted-foreground mb-6'>
          Please try pressing{' '}
          <code className='px-1.5 py-0.5 rounded bg-muted font-mono text-[0.85em]'>F12</code> to
          open the devTool
        </p>

        {lastPing && (
          <p className='text-base font-medium text-muted-foreground mb-6'>
            Last Event:{' '}
            <code className='px-1.5 py-0.5 rounded bg-muted font-mono text-[0.85em]'>
              {String(lastPing)}
            </code>
          </p>
        )}

        <div className='flex flex-wrap justify-center gap-4 mt-2'>
          <a
            href='https://electron-vite.org/'
            target='_blank'
            rel='noreferrer'
            className={buttonVariants({ variant: 'outline' })}
          >
            Documentation
          </a>

          <Button onClick={ipcHandle}>Send ORPC Ping</Button>
        </div>

        <Versions />
      </div>
    </div>
  );
}

export default App;
