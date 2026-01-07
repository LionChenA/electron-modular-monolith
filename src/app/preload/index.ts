import { ipcRenderer } from 'electron';

/**
 * oRPC MessagePort Handshake Bridge
 *
 * This listens for the 'init-orpc-port' message from the Renderer process,
 * extracts the MessagePort, and forwards it to the Main process via ipcRenderer.postMessage.
 * This establishes the direct type-safe communication channel.
 */
window.addEventListener('message', (event) => {
  if (event.data === 'init-orpc-port') {
    const [serverPort] = event.ports;
    if (serverPort) {
      ipcRenderer.postMessage('orpc-handshake', null, [serverPort]);
    }
  }
});
