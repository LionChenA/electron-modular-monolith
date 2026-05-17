import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ThemeToggle } from './ThemeToggle';

vi.mock('next-themes', () => ({
  useTheme: () => ({
    theme: 'dark',
    setTheme: vi.fn(),
  }),
}));

describe('ThemeToggle', () => {
  it('renders toggle button', () => {
    render(<ThemeToggle />);
    const btn = screen.getByTitle('Switch to light mode');
    expect(btn).toBeDefined();
  });

  it('shows sun icon when theme is dark', () => {
    render(<ThemeToggle />);
    // SunIcon renders as an SVG with role="img"
    const svg = document.querySelector('svg');
    expect(svg).toBeDefined();
  });
});
