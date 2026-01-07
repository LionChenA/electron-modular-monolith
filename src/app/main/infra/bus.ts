import { EventEmitter } from 'node:events';

/**
 * A simple typed EventBus for internal communication.
 * This will be injected into the ORPC context.
 */
export class EventBus extends EventEmitter {
  /**
   * Typed emit
   */
  publish<T>(event: string, data: T): void {
    this.emit(event, data);
  }

  /**
   * Typed subscription for ORPC SSE
   */
  async *subscribe<T>(event: string, signal?: AbortSignal): AsyncIterableIterator<T> {
    const onEvent = (data: T) => {
      // Internal handler
    };

    try {
      while (!signal?.aborted) {
        const [data] = (await new Promise((resolve) => {
          this.once(event, (...args) => resolve(args));
        })) as [T];
        yield data;
      }
    } finally {
      // Cleanup happens via the AsyncGenerator lifecycle
    }
  }
}

export const bus = new EventBus();
