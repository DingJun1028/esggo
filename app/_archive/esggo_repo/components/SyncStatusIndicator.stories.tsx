import type { Meta, StoryObj } from '@storybook/react';
import { SyncStatusIndicator } from './SyncStatusIndicator';

const meta: Meta<typeof SyncStatusIndicator> = {
    title: 'Components/SyncStatusIndicator',
    component: SyncStatusIndicator,
    parameters: {
        layout: 'centered', // 將元件置中顯示以便於預覽
    },
    tags: ['autodocs'], // 自動產生文件
    argTypes: {
        syncError: { control: 'boolean' },
        loading: { control: 'boolean' },
        saved: { control: 'boolean' },
        lastSaved: { control: 'date' },
    },
};

export default meta;
type Story = StoryObj<typeof SyncStatusIndicator>;

export const InitialHidden: Story = {
    args: {
        syncError: false,
        loading: false,
        saved: false,
        lastSaved: null,
    },
};

export const Saving: Story = {
    args: {
        syncError: false,
        loading: true,
    },
};

export const SavedSuccessfully: Story = {
    args: {
        syncError: false,
        loading: false,
        saved: true,
        lastSaved: new Date(), // 當前時間
    },
};

export const OfflineOrError: Story = {
    args: {
        syncError: true,
    },
};