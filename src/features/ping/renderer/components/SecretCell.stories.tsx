import type { Meta, StoryObj } from '@storybook/react';
import { SecretCell } from './SecretCell';

const meta: Meta<typeof SecretCell> = {
  title: 'Ping/SecretCell',
  component: SecretCell,
};

export default meta;
type Story = StoryObj<typeof SecretCell>;

export const Default: Story = {
  args: {
    value: 'sk-abc123def456',
  },
};

export const ShortValue: Story = {
  args: {
    value: 'p@ss',
  },
};

export const LongValue: Story = {
  args: {
    value: 'very-long-secret-key-that-should-be-truncated-in-the-display',
  },
};
