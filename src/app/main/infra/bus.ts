import { EventEmitter } from 'node:events';

// Create a singleton instance internally
const emitter = new EventEmitter();

export const bus = {
  publish: <T>(event: string, data: T): void => {
    emitter.emit(event, data);
  },

  subscribe: <T>(event: string, signal?: AbortSignal): AsyncIterableIterator<T> => {
    return {
      [Symbol.asyncIterator]() {
        return this;
      },
      next: () => {
        if (signal?.aborted) {
          return Promise.resolve({ value: undefined, done: true });
        }
        return new Promise<IteratorResult<T>>((resolve) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const listener = (...args: any[]) => {
            resolve({ value: args[0] as T, done: false });
          };
          emitter.once(event, listener);

          if (signal) {
            signal.addEventListener(
              'abort',
              () => {
                emitter.off(event, listener);
                resolve({ value: undefined, done: true });
              },
              { once: true },
            );
          }
        });
      },
    };
  },
};

export type EventBus = typeof bus;
