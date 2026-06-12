import type { Meta, StoryObj } from '@storybook/react';
import { OmniInput } from './OmniInput';
import { OmniThemeProvider } from '../../theme/OmniThemeProvider';

const meta: Meta<typeof OmniInput> = {
  title: 'OmniUI/Atom/OmniInput',
  component: OmniInput,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'filled', 'outlined'],
    },
    size: {
      control: 'select',
      options: ['lg', 'md', 'sm'],
    },
    disabled: {
      control: 'boolean',
    },
    showClearButton: {
      control: 'boolean',
    },
    showPasswordToggle: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story) => (
      <OmniThemeProvider>
        <div className="p-8 bg-theme-bg-secondary min-h-screen w-80">
          <Story />
        </div>
      </OmniThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof OmniInput>;

export const Default: Story = {
  args: {
    label: '標籤',
    placeholder: '請輸入內容...',
  },
};

export const Filled: Story = {
  args: {
    variant: 'filled',
    label: '標籤',
    placeholder: '填滿樣式...',
  },
};

export const Outlined: Story = {
  args: {
    variant: 'outlined',
    label: '標籤',
    placeholder: '外框樣式...',
  },
};

export const WithError: Story = {
  args: {
    label: '電子郵件',
    placeholder: '請輸入有效的郵件地址',
    errorText: '請輸入有效的電子郵件格式',
    value: 'invalid-email',
  },
};

export const WithHelperText: Story = {
  args: {
    label: '公司名稱',
    placeholder: '請輸入完整公司名稱',
    helperText: '將用於 ESG 報告書的抬頭',
  },
};

export const Password: Story = {
  args: {
    label: '密碼',
    type: 'password',
    placeholder: '請輸入密碼',
    showPasswordToggle: true,
  },
};

export const Disabled: Story = {
  args: {
    label: '禁用輸入',
    placeholder: '無法編輯',
    disabled: true,
    value: '固定值',
  },
};

export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <OmniInput size="lg" label="大尺寸" placeholder="48px高度" />
      <OmniInput size="md" label="中尺寸" placeholder="44px高度" />
      <OmniInput size="sm" label="小尺寸" placeholder="36px高度" />
    </div>
  ),
};