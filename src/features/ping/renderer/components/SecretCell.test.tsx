import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SecretCell } from './SecretCell';

describe('SecretCell', () => {
  it('renders masked value by default', () => {
    render(<SecretCell value='my-secret' />);
    expect(screen.getByText('••••••••')).toBeDefined();
  });

  it('renders reveal and copy buttons', () => {
    render(<SecretCell value='my-secret' />);
    expect(screen.getByLabelText('Reveal secret')).toBeDefined();
    expect(screen.getByLabelText('Copy secret')).toBeDefined();
  });
});
