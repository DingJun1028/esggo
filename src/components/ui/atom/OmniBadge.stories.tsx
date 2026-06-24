import type { Meta, StoryObj } from '@storybook/react';
import { OmniBadge } from './OmniBadge';
import { OmniThemeProvider } from '../../theme/OmniThemeProvider';

const meta: Meta<typeof OmniBadge> = {
  title: 'OmniUI/Atom/OmniBadge',
  component: OmniBadge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 't1', 't2', 't3', 't4', 't5', 'verified', 'warning', 'error', 'info'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    shape: {
      control: 'select',
      options: ['rounded', 'pill', 'square'],
    },
    dot: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <OmniThemeProvider>
        <div className="p-8 bg-theme-bg-secondary min-h-screen flex flex-wrap gap-4">
          <Story />
        </div>
      </OmniThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OmniBadge>;

export const T1Tangible: Story = {
  args: {
    variant: 't1',
    children: 'T1 Tangible',
  },
};

export const T2Traceable: Story = {
  args: {
    variant: 't2',
    children: 'T2 Traceable',
  },
};

export const T3Trackable: Story = {
  args: {
    variant: 't3',
    children: 'T3 Trackable',
  },
};

export const T4Transparent: Story = {
  args: {
    variant: 't4',
    children: 'T4 Transparent',
  },
};

export const T5Trustworthy: Story = {
  args: {
    variant: 't5',
    children: 'T5 Trustworthy',
  },
};

export const Verified: Story = {
  args: {
    variant: 'verified',
    children: '已驗證',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: '警告',
  },
};

export const Error: Story = {
  args: {
    variant: 'error',
    children: '錯誤',
  },
};

export const AllT5States: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <OmniBadge variant="t1" dot>可感知</OmniBadge>
        <OmniBadge variant="t2" dot>可溯源</OmniBadge>
        <OmniBadge variant="t3" dot>可追蹤</OmniBadge>
        <OmniBadge variant="t4" dot>可透明</OmniBadge>
        <OmniBadge variant="t5" dot>不可篡改</OmniBadge>
      </div>
      <div className="flex items-center gap-2">
        <OmniBadge variant="t1">T1</OmniBadge>
        <OmniBadge variant="t2">T2</OmniBadge>
        <OmniBadge variant="t3">T3</OmniBadge>
        <OmniBadge variant="t4">T4</OmniBadge>
        <OmniBadge variant="t5">T5</OmniBadge>
      </div>
    </div>
  ),
};

export const Shapes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <OmniBadge shape="rounded">圓角</OmniBadge>
      <OmniBadge shape="pill">膠囊</OmniBadge>
      <OmniBadge shape="square">方角</OmniBadge>
    </div>
  ),
};