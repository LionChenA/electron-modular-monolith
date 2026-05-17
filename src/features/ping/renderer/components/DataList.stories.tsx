import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { type DataItem, DataList } from './DataList';

const sampleData: DataItem[] = [
  { id: '1', key: 'theme', value: 'dark' },
  { id: '2', key: 'language', value: 'en-US' },
  { id: '3', key: 'notifications', value: 'true' },
];

const meta: Meta<typeof DataList> = {
  title: 'Ping/DataList',
  component: DataList,
};

export default meta;
type Story = StoryObj<typeof DataList>;

export const Default: Story = {
  args: {
    title: 'Preferences',
    items: sampleData,
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const Empty: Story = {
  args: {
    title: 'Preferences',
    items: [],
    onEdit: fn(),
    onDelete: fn(),
  },
};

export const CustomEmptyMessage: Story = {
  args: {
    title: 'Search Results',
    items: [],
    onEdit: fn(),
    onDelete: fn(),
    emptyMessage: 'No matches found',
  },
};

export const SingleItem: Story = {
  args: {
    title: 'Secret',
    items: [{ id: '1', key: 'apiKey', value: '' }],
    onEdit: fn(),
    onDelete: fn(),
  },
};
