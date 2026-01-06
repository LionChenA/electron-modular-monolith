# Electron Adapter

**Dependencies:** `@orpc/server`, `@orpc/client`, `electron`
**Key APIs:** `RPCHandler`, `RPCLink`, `ipcMain`, `ipcRenderer`

Establish type-safe communication between processes in Electron using the **Message Port Adapter**.

## Architecture (The Handshake)

oRPC in Electron works by establishing a direct `MessagePort` channel between the Renderer and Main processes. This bypasses the standard Electron IPC (string-based) for procedure execution while using it once for the initial "handshake."

### 1. Main Process (The Server)
The Main process acts as the producer. It listens for a port via IPC and upgrades it to handle RPC requests.

```ts
import { RPCHandler } from '@orpc/server/message-port';
import { ipcMain, app } from 'electron';

const handler = new RPCHandler(router);

app.whenReady().then(() => {
  // Listen for the port sent from the Renderer via Preload
  ipcMain.on('orpc-handshake', (event) => {
    const [serverPort] = event.ports;
    
    // Upgrade the port to oRPC
    handler.upgrade(serverPort, {
      context: { /* initial context like windows or stores */ }
    });
    
    serverPort.start();
  });
});
```

### 2. Preload Script (The Bridge)
The Preload script acts as a secure forwarder. It receives the port from the Renderer and passes it to the Main process.

```ts
import { ipcRenderer } from 'electron';

// Receive port from Renderer
window.addEventListener('message', (event) => {
  if (event.data === 'init-orpc-port') {
    const [serverPort] = event.ports;
    // Forward to Main Process
    ipcRenderer.postMessage('orpc-handshake', null, [serverPort]);
  }
});
```

### 3. Renderer Process (The Client)
The Renderer initializes the channel and the oRPC client.

```ts
import { RPCLink } from '@orpc/client/message-port';
import { createORPCClient } from '@orpc/client';

const { port1: clientPort, port2: serverPort } = new MessageChannel();

// Send serverPort to Preload script
window.postMessage('init-orpc-port', '*', [serverPort]);

// Create Client Link using clientPort
const link = new RPCLink({
  port: clientPort,
});

clientPort.start();

export const orpc = createORPCClient<typeof router>(link);
```

---

## Benefits
-   **Type Safety**: Full E2E types across processes.
-   **Performance**: Direct `MessagePort` communication is efficient.
-   **Native Experience**: Procedure calls feel like local function calls.
