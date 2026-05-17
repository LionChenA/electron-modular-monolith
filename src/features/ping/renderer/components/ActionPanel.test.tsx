import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActionPanel } from './ActionPanel';

describe('ActionPanel', () => {
  it('renders title and input fields', () => {
    render(<ActionPanel title='Add Item' onAdd={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Add Item')).toBeDefined();
    expect(screen.getByPlaceholderText('Key')).toBeDefined();
    expect(screen.getByPlaceholderText('Value')).toBeDefined();
  });

  it('hides key field when showKeyField is false', () => {
    render(<ActionPanel title='Search' onAdd={vi.fn()} onDelete={vi.fn()} showKeyField={false} />);
    expect(screen.queryByPlaceholderText('Key')).toBeNull();
  });

  it('disables Add button when value is empty', () => {
    render(<ActionPanel title='Test' onAdd={vi.fn()} onDelete={vi.fn()} />);
    const addButton = screen.getByText('Add').closest('button');
    expect(addButton).toBeDisabled();
  });

  it('renders custom placeholder', () => {
    render(
      <ActionPanel
        title='Test'
        onAdd={vi.fn()}
        onDelete={vi.fn()}
        valuePlaceholder='Enter value...'
      />,
    );
    expect(screen.getByPlaceholderText('Enter value...')).toBeDefined();
  });
});
