import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ActionPanel } from './ActionPanel';

const meta: Meta<typeof ActionPanel> = {
  title: 'Ping/ActionPanel',
  component: ActionPanel,
};

export default meta;
type Story = StoryObj<typeof ActionPanel>;

export const Default: Story = {
  args: {
    title: 'Add Preference',
    onAdd: fn(),
    onDelete: fn(),
  },
};

export const Secrets: Story = {
  args: {
    title: 'Add Secret',
    onAdd: fn(),
    onDelete: fn(),
    valuePlaceholder: 'Secret value',
  },
};

export const Sqlite: Story = {
  args: {
    title: 'Add Ping',
    onAdd: fn(),
    onDelete: fn(),
    showKeyField: false,
    valuePlaceholder: 'Message',
  },
};

export const Search: Story = {
  args: {
    title: 'Search',
    onAdd: fn(),
    onDelete: fn(),
    showKeyField: false,
    valuePlaceholder: 'Search indexed data...',
  },
};
