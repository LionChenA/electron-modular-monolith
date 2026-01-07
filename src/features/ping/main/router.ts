import { implement } from '@orpc/server';
import { pingContract } from '../shared/contract';
import type { PingDeps } from './types';

export const pingRouter = implement(pingContract)
  .$context<PingDeps>()
  .router({
    ping: async ({ ctx }) => {
      ctx.bus.publish('ping', 'pong');
      return 'pong';
    },
    onPing: async function* ({ ctx, signal }) {
      for await (const data of ctx.bus.subscribe<string>('ping', signal)) {
        yield data;
      }
    },
  });
