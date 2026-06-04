import { Button } from '../Button';
const meta = {
    title: 'UI/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['primary', 'secondary', 'ghost', 'danger', 'glass'],
        },
        size: {
            control: 'radio',
            options: ['sm', 'md', 'lg'],
        },
        loading: {
            control: 'boolean',
        },
    },
};
export default meta;
export const Primary = {
    args: {
        variant: 'primary',
        children: 'Primary Button',
    },
};
export const Secondary = {
    args: {
        variant: 'secondary',
        children: 'Secondary Button',
    },
};
export const Glass = {
    parameters: {
        backgrounds: { default: 'dark' },
    },
    args: {
        variant: 'glass',
        children: 'Glass Button',
    },
};
export const Danger = {
    args: {
        variant: 'danger',
        children: 'Danger Button',
    },
};
export const Ghost = {
    args: {
        variant: 'ghost',
        children: 'Ghost Button',
    },
};
export const Loading = {
    args: {
        variant: 'primary',
        loading: true,
        children: 'Saving...',
    },
};
//# sourceMappingURL=Button.stories.js.map