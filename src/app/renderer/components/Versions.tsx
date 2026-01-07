import { orpc } from '@app/renderer/infra/client';
import { useQuery } from '@tanstack/react-query';

function Versions(): React.JSX.Element {
  const { data: versions } = useQuery(orpc.general.getVersions.queryOptions());

  if (!versions) {
    return <ul className='versions' />;
  }

  return (
    <ul className='versions'>
      <li className='electron-version'>Electron v{versions.electron}</li>
      <li className='chrome-version'>Chromium v{versions.chrome}</li>
      <li className='node-version'>Node v{versions.node}</li>
    </ul>
  );
}

export default Versions;
