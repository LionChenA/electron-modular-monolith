import type { Meta, StoryObj } from '@storybook/react';
import { EmptyState } from './EmptyState';

const meta: Meta<typeof EmptyState> = {
  title: 'Ping/EmptyState',
  component: EmptyState,
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {};

export const CustomMessage: Story = {
  args: {
    message: 'No secrets stored yet',
  },
};

export const WithAction: Story = {
  args: {
    message: 'No items found',
    actionLabel: 'Add New',
    onAction: () => alert('Add clicked'),
  },
};

export const WithCustomAction: Story = {
  args: {
    message: 'Your search returned no results',
    actionLabel: 'Clear Search',
    onAction: () => alert('Cleared'),
  },
};
