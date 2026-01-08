/**
 * A generic EventBus interface for decoupled communication.
 * This is a shared primitive that Features can rely on.
 */
export interface EventBus {
  publish<T>(event: string, data: T): void;
  subscribe<T>(event: string, signal?: AbortSignal): AsyncIterableIterator<T>;
}
