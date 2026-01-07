import { createORPCClient } from '@orpc/client';
import { RPCLink } from '@orpc/client/message-port';
import type { router } from '../../main/router';

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
 * Export the typed ORPC client.
 * Note: The 'router' type will be fully implemented in Task 4.3.
 */
export const orpc = createORPCClient<typeof router>(link);
