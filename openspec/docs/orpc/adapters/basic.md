# Basic Adapters

**Dependencies:** `@orpc/server`, `@orpc/client`
**Key APIs:** `RPCHandler`, `RPCLink`, `MessagePort`

oRPC provides built-in adapters for standard communication protocols.

## 1. Message Port (`@orpc/server/message-port`)

Ideal for internal communication between processes (e.g., Electron Main/Renderer, Web Workers, Browser Windows).

### Basic Usage

**Setup Bridge:**
```ts
const channel = new MessageChannel();
const serverPort = channel.port1;
const clientPort = channel.port2;
```

**Server Configuration:**
Use `RPCHandler` from `@orpc/server/message-port` and call `.upgrade(port)`.

```ts
import { RPCHandler } from '@orpc/server/message-port';

const handler = new RPCHandler(router);

// Upgrade the port to handle RPC requests
handler.upgrade(serverPort, {
  context: {}, // Initial context
});

serverPort.start();
```

**Client Configuration:**
Use `RPCLink` from `@orpc/client/message-port`.

```ts
import { RPCLink } from '@orpc/client/message-port';

const link = new RPCLink({
  port: clientPort,
});

clientPort.start();
```

### Advanced: Transferable Objects
You can opt-in to using `postMessage`'s transfer capabilities (e.g., for `OffscreenCanvas`) by providing a `transfer` function.

*   **Warning**: This uses the structured clone algorithm, which may not support all oRPC internal types (like Event Iterator Metadata). Enable only when necessary.

```ts
const handler = new RPCHandler(router, {
  experimental_transfer: (message, port) => {
    // Return array of Transferable objects or null
    return findTransferables(message); 
  }
});
```

---

## 2. HTTP
*Documentation placeholder. See: [HTTP Adapter Guide](https://orpc.dev/docs/adapters/http)*

---

## 3. WebSocket
*Documentation placeholder. See: [WebSocket Adapter Guide](https://orpc.dev/docs/adapters/websocket)*
