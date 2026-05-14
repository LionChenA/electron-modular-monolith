import { EventEmitter } from 'node:events';
import type { EventBus as IEventBus } from '../../../shared/interfaces/bus';

function createEventBus(): IEventBus {
  const emitter = new EventEmitter();

  return {
    publish<T>(event: string, data: T): void {
      emitter.emit(event, data);
    },

    subscribe<T>(event: string, signal?: AbortSignal): AsyncIterableIterator<T> {
      return {
        [Symbol.asyncIterator]() {
          return this;
        },
        next: () => {
          if (signal?.aborted) {
            return Promise.resolve({ value: undefined, done: true });
          }
          return new Promise<IteratorResult<T>>((resolve) => {
            // biome-ignore lint/suspicious/noExplicitAny: EventEmitter.emit passes dynamic args
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
}

export const bus: IEventBus = createEventBus();
export type EventBus = IEventBus;
