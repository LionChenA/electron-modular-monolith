import { buttonVariants } from '@app/renderer/components/ui/button';
import { Link } from '@tanstack/react-router';
import wavyLines from '../../../app/renderer/assets/wavy-lines.svg';
import { OramaSearchCard, PreferencesCard, SecretsCard, SQLiteCard } from './components';

export function PingPage() {
  return (
    <div className='dark relative flex flex-col items-center justify-center min-h-screen bg-background font-sans text-foreground selection:bg-primary/20'>
      <img
        src={wavyLines}
        className='absolute inset-0 w-full h-full object-cover opacity-50 pointer-events-none'
        alt='Background Pattern'
      />

      <div className='relative z-10 w-full max-w-4xl p-6 space-y-6'>
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold text-transparent bg-clip-text bg-linear-to-br from-[#087ea4] to-[#7c93ee]'>
              Storage Demo
            </h1>
            <p className='text-muted-foreground mt-1'>Explore Electron storage capabilities</p>
          </div>
          <Link to='/' className={buttonVariants({ variant: 'outline' })}>
            Go Home
          </Link>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          <PreferencesCard />
          <SecretsCard />
          <SQLiteCard />
          <OramaSearchCard />
        </div>

        <div className='text-center text-xs text-muted-foreground'>
          Storage Layer Demo • Powered by electron-store • SafeStorage • better-sqlite3 • Orama
        </div>
      </div>
    </div>
  );
}
