import type { Meta, StoryObj } from '@storybook/react';
import { OmniAssistant } from './OmniAssistant';
import { OmniThemeProvider } from '../theme/OmniThemeProvider';

const meta: Meta<typeof OmniAssistant> = {
  title: 'OmniUI/OmniAssistant',
  component: OmniAssistant,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
  argTypes: {
    color: {
      control: 'select',
      options: ['berkeley-blue', 'california-gold', 'glow-cyan', 'glow-emerald'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    initialState: {
      control: 'select',
      options: ['idle', 'listening', 'processing', 'speaking'],
    },
  },
  decorators: [
    (Story) => (
      <OmniThemeProvider>
        <div className="relative h-screen w-full bg-theme-bg-secondary">
          <Story />
        </div>
      </OmniThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OmniAssistant>;

export const Default: Story = {
  args: {
    initialState: 'idle',
    color: 'berkeley-blue',
  },
};

export const CaliforniaGold: Story = {
  args: {
    initialState: 'idle',
    color: 'california-gold',
  },
};

export const Expanded: Story = {
  args: {
    variant: 'expanded',
    initialState: 'idle',
    color: 'berkeley-blue',
  },
};

export const Listening: Story = {
  args: {
    initialState: 'listening',
    color: 'glow-cyan',
  },
};

export const Processing: Story = {
  args: {
    initialState: 'processing',
    color: 'glow-emerald',
  },
};

export const AllColors: Story = {
  render: () => (
    <div className="relative h-screen w-full bg-theme-bg-secondary flex items-center justify-center gap-8">
      <OmniAssistant color="berkeley-blue" />
      <OmniAssistant color="california-gold" />
      <OmniAssistant color="glow-cyan" />
      <OmniAssistant color="glow-emerald" />
    </div>
  ),
};