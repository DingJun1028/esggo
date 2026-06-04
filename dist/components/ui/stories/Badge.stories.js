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
};
export default meta;
export const Verified = {
    args: {
        variant: 'verified',
        children: 'Verified',
    },
};
export const Draft = {
    args: {
        variant: 'draft',
        children: 'Draft',
    },
};
export const Warning = {
    args: {
        variant: 'warning',
        children: 'Needs Attention',
    },
};
export const ErrorState = {
    args: {
        variant: 'error',
        children: 'Validation Failed',
    },
};
export const Info = {
    args: {
        variant: 'info',
        children: 'Information',
    },
};
export const Gold = {
    args: {
        variant: 'gold',
        children: 'Premium',
    },
};
//# sourceMappingURL=Badge.stories.js.map