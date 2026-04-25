import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { bus } from './bus';

describe('EventBus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('publish', () => {
    it('publishes event with data', async () => {
      vi.spyOn(global, 'setTimeout');
      const iterator = bus.subscribe<{ message: string }>('test-event');

      const pendingNext = iterator.next();
      bus.publish('test-event', { message: 'hello' });

      const result = await pendingNext;
      expect(result.value).toEqual({ message: 'hello' });
      expect(result.done).toBe(false);
    });
  });

  describe('subscribe', () => {
    it('subscribes to event and receives published data', async () => {
      const iterator = bus.subscribe<string>('ping');

      const pendingNext = iterator.next();
      bus.publish('ping', 'pong');

      const result = await pendingNext;
      expect(result.value).toBe('pong');
      expect(result.done).toBe(false);
    });

    it('receives multiple events in sequence', async () => {
      const iterator = bus.subscribe<number>('counter');

      const next1 = iterator.next();
      bus.publish('counter', 1);
      const result1 = await next1;
      expect(result1.value).toBe(1);

      const next2 = iterator.next();
      bus.publish('counter', 2);
      const result2 = await next2;
      expect(result2.value).toBe(2);
    });
  });

  describe('abort signal handling', () => {
    it('stops iteration when abort signal is triggered', async () => {
      const controller = new AbortController();
      const iterator = bus.subscribe<string>('abort-test', controller.signal);

      const pendingNext = iterator.next();
      controller.abort();

      const result = await pendingNext;
      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('immediately returns done if signal already aborted', async () => {
      const controller = new AbortController();
      controller.abort();

      const iterator = bus.subscribe<string>('already-aborted', controller.signal);
      const result = await iterator.next();

      expect(result.done).toBe(true);
      expect(result.value).toBeUndefined();
    });

    it('can subscribe after abort and still receive events', async () => {
      const controller = new AbortController();
      controller.abort();

      const iterator = bus.subscribe<string>('after-abort');

      const pendingNext = iterator.next();
      bus.publish('after-abort', 'event after abort');

      const result = await pendingNext;
      expect(result.value).toBe('event after abort');
      expect(result.done).toBe(false);
    });
  });

  describe('multiple subscribers', () => {
    it('allows multiple subscribers to receive the same event', async () => {
      const iterator1 = bus.subscribe<{ id: number }>('multi');
      const iterator2 = bus.subscribe<{ id: number }>('multi');

      const pending1 = iterator1.next();
      const pending2 = iterator2.next();

      bus.publish('multi', { id: 42 });

      const [result1, result2] = await Promise.all([pending1, pending2]);
      expect(result1.value).toEqual({ id: 42 });
      expect(result2.value).toEqual({ id: 42 });
    });

    it('each subscriber maintains independent event stream', async () => {
      const iterator1 = bus.subscribe<number>('independent');
      const iterator2 = bus.subscribe<number>('independent');

      const next1 = iterator1.next();
      bus.publish('independent', 100);
      const result1 = await next1;
      expect(result1.value).toBe(100);

      const next2 = iterator2.next();
      bus.publish('independent', 200);
      const result2 = await next2;
      expect(result2.value).toBe(200);
    });
  });
});
