import { describe, expect, it } from 'vitest';
import { formatDate } from './format';

describe('formatDate', () => {
  it('formats date correctly', () => {
    expect(formatDate(new Date('2024-01-01'))).toBe('2024-01-01');
  });

  it('pads single-digit month with zero', () => {
    expect(formatDate(new Date('2024-01-15'))).toBe('2024-01-15');
    expect(formatDate(new Date('2024-06-01'))).toBe('2024-06-01');
  });

  it('pads single-digit day with zero', () => {
    expect(formatDate(new Date('2024-03-05'))).toBe('2024-03-05');
    expect(formatDate(new Date('2024-03-09'))).toBe('2024-03-09');
  });

  it('handles end of year', () => {
    expect(formatDate(new Date('2024-12-31'))).toBe('2024-12-31');
  });

  it('handles leap year date', () => {
    expect(formatDate(new Date('2024-02-29'))).toBe('2024-02-29');
  });

  it('handles beginning of year', () => {
    expect(formatDate(new Date('2024-01-01'))).toBe('2024-01-01');
  });
});
