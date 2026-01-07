import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import { createTanstackQueryUtils } from '@orpc/tanstack-query';
import type { AppContract } from '../../main/contract';

// We create a MessageChannel for the direct communication
const { port1: clientPort, port2: serverPort } = new MessageChannel();

/**
 * Handshake with Preload/Main process.
 * We send port2 to the Preload script, which will forward it to the Main process.
 */
window.postMessage('init-orpc-port', '*', [serverPort]);

// Create ORPC Client Link using port1
const link = new RPCLink({
  port: clientPort,
});

clientPort.start();

/**
 * The raw ORPC client.
 */
export const client = createORPCClient<AppContract>(link);

/**
 * The TanStack Query integration utilities.
 * This is what will be used in React components.
 */
export const orpc = createTanstackQueryUtils(client);
