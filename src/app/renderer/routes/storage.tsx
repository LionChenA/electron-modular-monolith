import { createFileRoute } from '@tanstack/react-router';
import { PingPage } from '../../../features/ping/renderer/page';

export const Route = createFileRoute('/storage')({
  component: PingPage,
});
