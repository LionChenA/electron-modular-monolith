import { RPCHandler } from '@orpc/server/message-port';
import { ipcMain } from 'electron';
import { runtimeContext } from './context';
import { router } from './router';

const handler = new RPCHandler(router);

/**
 * Sets up the ORPC IPC handshake listener.
 * This should be called when the app is ready.
 */
export function setupIPC() {
  ipcMain.on('orpc-handshake', (event) => {
    const [port] = event.ports;

    if (!port) {
      console.error('[ORPC] Handshake failed: No port received');
      return;
    }

    // Upgrade the MessagePort to an ORPC handler
    handler.upgrade(port, {
      context: runtimeContext,
    });

    port.start();
    console.log('[ORPC] Handshake successful, MessagePort established.');
  });
}
