import { orpc } from '@app/renderer/infra/client';
import { useQuery } from '@tanstack/react-query';

function Versions(): React.JSX.Element {
  const { data: versions } = useQuery(orpc.general.getVersions.queryOptions());

  if (!versions) {
    return <ul className='hidden' />;
  }

  return (
    <ul className='absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center overflow-hidden rounded-full bg-card/80 backdrop-blur-md border border-border shadow-sm'>
      <li className='block border-r border-border px-5 py-3 text-sm text-muted-foreground/80 font-mono'>
        Electron v{versions.electron}
      </li>
      <li className='block border-r border-border px-5 py-3 text-sm text-muted-foreground/80 font-mono'>
        Chromium v{versions.chrome}
      </li>
      <li className='block px-5 py-3 text-sm text-muted-foreground/80 font-mono'>
        Node v{versions.node}
      </li>
    </ul>
  );
}

export default Versions;
