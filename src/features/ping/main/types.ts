export interface EventBus {
  publish<T>(event: string, data: T): void;
  subscribe<T>(event: string, signal?: AbortSignal): AsyncIterableIterator<T>;
}

export interface PingDeps {
  bus: EventBus;
}
