import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActivityBar } from './ActivityBar';

vi.mock('@tanstack/react-router', () => ({
  useLocation: () => ({ pathname: '/storage' }),
  Link: ({ children, to, title }: { children: React.ReactNode; to: string; title?: string }) => (
    <a href={to} title={title}>
      {children}
    </a>
  ),
}));

vi.mock('./ThemeToggle', () => ({
  ThemeToggle: () => <button type='button'>Toggle Theme</button>,
}));

describe('ActivityBar', () => {
  it('renders navigation links', () => {
    render(<ActivityBar />);
    expect(screen.getByTitle('Home')).toBeDefined();
    expect(screen.getByTitle('Storage')).toBeDefined();
    expect(screen.getByTitle('Settings')).toBeDefined();
  });

  it('renders theme toggle', () => {
    render(<ActivityBar />);
    expect(screen.getByText('Toggle Theme')).toBeDefined();
  });
});
