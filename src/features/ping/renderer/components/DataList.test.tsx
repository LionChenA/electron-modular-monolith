import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { type DataItem, DataList } from './DataList';

const sampleItems: DataItem[] = [
  { id: '1', key: 'theme', value: 'dark' },
  { id: '2', key: 'language', value: 'en-US' },
];

describe('DataList', () => {
  it('renders title and items', () => {
    render(
      <DataList title='Preferences' items={sampleItems} onEdit={vi.fn()} onDelete={vi.fn()} />,
    );
    expect(screen.getByText('Preferences')).toBeDefined();
    expect(screen.getByText('theme')).toBeDefined();
    expect(screen.getByText('dark')).toBeDefined();
    expect(screen.getByText('en-US')).toBeDefined();
  });

  it('shows empty state when no items', () => {
    render(<DataList title='Empty' items={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('No data yet')).toBeDefined();
  });

  it('shows custom empty message', () => {
    render(
      <DataList
        title='Empty'
        items={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        emptyMessage='Nothing here'
      />,
    );
    expect(screen.getByText('Nothing here')).toBeDefined();
  });

  it('renders custom renderValue for each item', () => {
    render(
      <DataList
        title='Secrets'
        items={[{ id: '1', key: 'apiKey', value: '' }]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        renderValue={() => <span>MASKED</span>}
      />,
    );
    expect(screen.getByText('MASKED')).toBeDefined();
  });
});
