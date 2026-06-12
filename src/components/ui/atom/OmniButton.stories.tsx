import type { Meta, StoryObj } from '@storybook/react';
import { OmniButton } from './OmniButton';
import { action } from '@storybook/addon-actions';
import { OmniThemeProvider } from '../../theme/OmniThemeProvider';

const meta: Meta<typeof OmniButton> = {
  title: 'OmniUI/Atom/OmniButton',
  component: OmniButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'ghost', 'danger', 'success', 'glass'],
    },
    size: {
      control: 'select',
      options: ['xl', 'lg', 'md', 'sm', 'xs', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <OmniThemeProvider>
        <div className="p-8 bg-theme-bg-secondary min-h-screen">
          <Story />
        </div>
      </OmniThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OmniButton>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: '主要按鈕',
    onClick: action('clicked'),
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要按鈕',
    onClick: action('clicked'),
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: '幽靈按鈕',
    onClick: action('clicked'),
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: '警告按鈕',
    onClick: action('clicked'),
  },
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    loadingText: '處理中...',
  },
};

export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: '禁用按鈕',
    disabled: true,
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <OmniButton variant="primary" size="xl">XL</OmniButton>
      <OmniButton variant="primary" size="lg">LG</OmniButton>
      <OmniButton variant="primary" size="md">MD</OmniButton>
      <OmniButton variant="primary" size="sm">SM</OmniButton>
      <OmniButton variant="primary" size="xs">XS</OmniButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-4">
      <OmniButton variant="primary">Primary</OmniButton>
      <OmniButton variant="secondary">Secondary</OmniButton>
      <OmniButton variant="ghost">Ghost</OmniButton>
      <OmniButton variant="danger">Danger</OmniButton>
      <OmniButton variant="success">Success</OmniButton>
      <OmniButton variant="glass">Glass</OmniButton>
    </div>
  ),
};