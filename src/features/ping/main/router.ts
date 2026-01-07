import { implement } from '@orpc/server';
import { pingContract } from '../shared/contract';
import type { PingDeps } from './types';

const os = implement(pingContract).$context<PingDeps>();

export const pingRouter = os.router({
  sendPing: os.sendPing.handler(async ({ context }) => {
    context.bus.publish('ping', 'pong');
    return 'pong';
  }),
  onPing: os.onPing.handler(async function* ({ context, signal }) {
    for await (const data of context.bus.subscribe('ping', signal)) {
      yield String(data);
    }
  }),
});
