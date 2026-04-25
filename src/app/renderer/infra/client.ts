import { createORPCClient } from '@orpc/client';
import { RPCLink as HTTPRPCLink } from '@orpc/client/fetch'; // HTTPRPCLink for test environment
import { RPCLink } from '@orpc/client/message-port';
import type { ContractRouterClient } from '@orpc/contract';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import { generalContract } from '../../../features/general/shared/contract';
import { pingContract } from '../../../features/ping/shared/contract';

/**
 * Transport switching based on environment:
 * - Production: RPCLink over MessageChannel (Electron IPC)
 * - Test: HTTPRPCLink over HTTP (for MSW interception)
 */
const link =
  process.env.NODE_ENV === 'test'
    ? new HTTPRPCLink({
        url: 'http://localhost/rpc',
      })
    : (() => {
        // We create a MessageChannel for the direct communication
        const { port1: clientPort, port2: serverPort } = new MessageChannel();

        /**
         * Handshake with Preload/Main process.
         * We send port2 to the Preload script, which will forward it to the Main process.
         */
        window.postMessage('init-orpc-port', '*', [serverPort]);

        // Create ORPC Client Link using port1
        const rpcLink = new RPCLink({
          port: clientPort,
        });

        clientPort.start();

        return rpcLink;
      })();

const contract = {
  general: generalContract,
  ping: pingContract,
};

/**
 * The raw ORPC client.
 */
export const client: ContractRouterClient<typeof contract> = createORPCClient(link);

/**
 * The TanStack Query integration utilities.
 * This is what will be used in React components.
 */
export const orpc = createTanstackQueryUtils(client);
