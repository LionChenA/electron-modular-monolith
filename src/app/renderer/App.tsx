import { useMutation, useQuery } from '@tanstack/react-query';
import electronLogo from './assets/electron.svg';
import Versions from './components/Versions';
import { orpc } from './infra/client';

function App(): React.JSX.Element {
  const { mutate: ping } = useMutation(orpc.ping.sendPing.mutationOptions());
  const { data: lastPing } = useQuery(orpc.ping.onPing.experimental_liveOptions());

  const ipcHandle = (): void => {
    ping();
  };

  return (
    <>
      <img alt='logo' className='logo' src={electronLogo} />
      <div className='creator'>Powered by electron-vite</div>
      <div className='text'>
        Build an Electron app with <span className='react'>React</span>
        &nbsp;and <span className='ts'>TypeScript</span>
      </div>
      <p className='tip'>
        Please try pressing <code>F12</code> to open the devTool
      </p>

      {lastPing && (
        <p className='tip'>
          Last Event: <code>{String(lastPing)}</code>
        </p>
      )}

      <div className='actions'>
        <div className='action'>
          <a href='https://electron-vite.org/' target='_blank' rel='noreferrer'>
            Documentation
          </a>
        </div>
        <div className='action'>
          <button type='button' onClick={ipcHandle}>
            Send ORPC Ping
          </button>
        </div>
      </div>
      <Versions />
    </>
  );
}

export default App;
