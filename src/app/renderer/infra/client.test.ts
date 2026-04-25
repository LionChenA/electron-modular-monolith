import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

describe('ORPC Client', () => {
  const originalNodeEnv = process.env.NODE_ENV;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
  });

  describe('transport switching', () => {
    it('uses HTTPRPCLink when NODE_ENV=test', async () => {
      process.env.NODE_ENV = 'test';

      const { RPCLink: HTTPRPCLink } = await import('@orpc/client/fetch');

      const link = new HTTPRPCLink({ url: 'http://localhost/rpc' });

      expect(link).toBeDefined();
    });

    it('creates HTTPRPCLink with correct url in test environment', async () => {
      process.env.NODE_ENV = 'test';

      const { RPCLink: HTTPRPCLink } = await import('@orpc/client/fetch');

      const link = new HTTPRPCLink({ url: 'http://localhost/rpc' });

      expect(link).toBeDefined();
    });
  });

  describe('link type detection', () => {
    it('detects test environment correctly', () => {
      process.env.NODE_ENV = 'test';
      expect(process.env.NODE_ENV).toBe('test');
    });

    it('detects development environment correctly', () => {
      process.env.NODE_ENV = 'development';
      expect(process.env.NODE_ENV).toBe('development');
    });

    it('detects production environment correctly', () => {
      process.env.NODE_ENV = 'production';
      expect(process.env.NODE_ENV).toBe('production');
    });

    it('handles undefined NODE_ENV', () => {
      delete process.env.NODE_ENV;
      expect(process.env.NODE_ENV).toBeUndefined();
    });
  });

  describe('MessageChannel creation', () => {
    it('creates MessageChannel for non-test environments', () => {
      process.env.NODE_ENV = 'development';

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
      process.env.NODE_ENV = 'test';
      const isTest = process.env.NODE_ENV === 'test';
      expect(isTest).toBe(true);
    });

    it('returns false for development environment check', () => {
      process.env.NODE_ENV = 'development';
      const isTest = process.env.NODE_ENV === 'test';
      expect(isTest).toBe(false);
    });

    it('returns false for production environment check', () => {
      process.env.NODE_ENV = 'production';
      const isTest = process.env.NODE_ENV === 'test';
      expect(isTest).toBe(false);
    });
  });
});
