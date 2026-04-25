import { RPCHandler } from '@orpc/server/message-port';
import { ipcMain } from 'electron';
import { router } from './router';

const handler = new RPCHandler(router);

export function setupIPC() {
  ipcMain.on('orpc-handshake', (event) => {
    const [port] = event.ports;

    if (!port) {
      console.error('[ORPC] Handshake failed: No port received');
      return;
    }

    handler.upgrade(port, {
      context: {} as never,
    });

    port.start();
    console.log('[ORPC] Handshake successful, MessagePort established.');
  });
}
