import { describe, expect, it } from 'vitest';
import { cn } from './utils';

describe('Utils', () => {
  describe('cn', () => {
    it('merges class names with clsx', () => {
      const result = cn('foo', 'bar');
      expect(result).toBe('foo bar');
    });

    it('handles empty inputs', () => {
      const result = cn();
      expect(result).toBe('');
    });

    it('merges tailwind classes with twMerge', () => {
      const result = cn('px-2 px-4');
      expect(result).toBe('px-4');
    });

    it('handles multiple class values', () => {
      const result = cn('foo', 'bar', 'baz');
      expect(result).toContain('foo');
      expect(result).toContain('bar');
      expect(result).toContain('baz');
    });

    it('handles conditional classes', () => {
      const isActive = true;
      const result = cn('base', isActive && 'active');
      expect(result).toContain('base');
      expect(result).toContain('active');
    });

    it('handles object classes', () => {
      const result = cn({ foo: true, bar: false });
      expect(result).toContain('foo');
      expect(result).not.toContain('bar');
    });

    it('handles array classes', () => {
      const result = cn(['foo', 'bar']);
      expect(result).toContain('foo');
      expect(result).toContain('bar');
    });

    it('resolves conflicts with tailwind-merge', () => {
      const result = cn('text-red text-blue', 'text-green');
      expect(result).toContain('text-green');
      expect(result).not.toContain('text-red');
      expect(result).not.toContain('text-blue');
    });
  });
});
