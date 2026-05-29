import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../Input';
import { Search, Mail } from 'lucide-react';
import React from 'react';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    type: 'email',
  },
};

export const WithIcon: Story = {
  args: {
    label: 'Search ESG Metrics',
    placeholder: 'Search...',
    icon: <Search className="w-4 h-4" />,
  },
};

export const WithError: Story = {
  args: {
    label: 'Email Address',
    placeholder: 'john@example.com',
    type: 'email',
    error: 'Invalid email address format',
    defaultValue: 'john@invalid',
  },
};
