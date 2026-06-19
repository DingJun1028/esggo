import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../Badge';

const meta = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'verified', 'draft', 'warning', 'error', 'primary', 'secondary', 
        'info', 'success', 'default', 'gold', 'neutral'
      ],
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Verified: Story = {
  args: {
    variant: 'verified',
    children: 'Verified',
  },
};

export const Draft: Story = {
  args: {
    variant: 'draft',
    children: 'Draft',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Needs Attention',
  },
};

export const ErrorState: Story = {
  args: {
    variant: 'error',
    children: 'Validation Failed',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Information',
  },
};

export const Gold: Story = {
  args: {
    variant: 'gold',
    children: 'Premium',
  },
};
