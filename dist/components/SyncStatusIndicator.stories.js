import { SyncStatusIndicator } from './SyncStatusIndicator';
const meta = {
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
export const InitialHidden = {
    args: {
        syncError: false,
        loading: false,
        saved: false,
        lastSaved: null,
    },
};
export const Saving = {
    args: {
        syncError: false,
        loading: true,
    },
};
export const SavedSuccessfully = {
    args: {
        syncError: false,
        loading: false,
        saved: true,
        lastSaved: new Date(), // 當前時間
    },
};
export const OfflineOrError = {
    args: {
        syncError: true,
    },
};
//# sourceMappingURL=SyncStatusIndicator.stories.js.map