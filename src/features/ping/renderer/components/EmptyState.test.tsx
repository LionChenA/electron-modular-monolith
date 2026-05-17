import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  it('renders default message', () => {
    render(<EmptyState />);
    expect(screen.getByText('No data yet')).toBeDefined();
  });

  it('renders custom message', () => {
    render(<EmptyState message='Nothing here' />);
    expect(screen.getByText('Nothing here')).toBeDefined();
  });

  it('renders action button when label and handler provided', () => {
    const onAction = () => {};
    render(<EmptyState message='Empty' actionLabel='Add Item' onAction={onAction} />);
    expect(screen.getByText('Add Item')).toBeDefined();
  });

  it('does not render action button without handler', () => {
    render(<EmptyState message='Empty' actionLabel='Add Item' />);
    expect(screen.queryByText('Add Item')).toBeNull();
  });
});
