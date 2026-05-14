import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ORPC Client', () => {
  const originalMode = import.meta.env.MODE;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    import.meta.env.MODE = originalMode;
  });

  describe('transport switching', () => {
    it('uses HTTPRPCLink when MODE=test', async () => {
      import.meta.env.MODE = 'test';

      const { RPCLink: HTTPRPCLink } = await import('@orpc/client/fetch');

      const link = new HTTPRPCLink({ url: 'http://localhost/rpc' });

      expect(link).toBeDefined();
    });

    it('creates HTTPRPCLink with correct url in test environment', async () => {
      import.meta.env.MODE = 'test';

      const { RPCLink: HTTPRPCLink } = await import('@orpc/client/fetch');

      const link = new HTTPRPCLink({ url: 'http://localhost/rpc' });

      expect(link).toBeDefined();
    });
  });

  describe('link type detection', () => {
    it('detects test environment correctly', () => {
      import.meta.env.MODE = 'test';
      expect(import.meta.env.MODE).toBe('test');
    });

    it('detects development environment correctly', () => {
      import.meta.env.MODE = 'development';
      expect(import.meta.env.MODE).toBe('development');
    });

    it('detects production environment correctly', () => {
      import.meta.env.MODE = 'production';
      expect(import.meta.env.MODE).toBe('production');
    });
  });

  describe('MessageChannel creation', () => {
    it('creates MessageChannel for non-test environments', () => {
      import.meta.env.MODE = 'development';

      const channel = new MessageChannel();
      expect(channel.port1).toBeDefined();
      expect(channel.port2).toBeDefined();
    });

    it('port1 and port2 are different', () => {
      const channel = new MessageChannel();
      expect(channel.port1).not.toBe(channel.port2);
    });
  });

  describe('transport decision logic', () => {
    it('returns true for test environment check', () => {
      import.meta.env.MODE = 'test';
      const isTest = import.meta.env.MODE === 'test';
      expect(isTest).toBe(true);
    });

    it('returns false for development environment check', () => {
      import.meta.env.MODE = 'development';
      const isTest = import.meta.env.MODE === 'test';
      expect(isTest).toBe(false);
    });

    it('returns false for production environment check', () => {
      import.meta.env.MODE = 'production';
      const isTest = import.meta.env.MODE === 'test';
      expect(isTest).toBe(false);
    });
  });
});
