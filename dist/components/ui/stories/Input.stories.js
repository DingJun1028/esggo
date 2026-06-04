import { jsx as _jsx } from "react/jsx-runtime";
import { Input } from '../Input';
import { Search } from 'lucide-react';
const meta = {
    title: 'UI/Input',
    component: Input,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    args: {
        placeholder: 'Enter text here...',
    },
};
export const WithLabel = {
    args: {
        label: 'Email Address',
        placeholder: 'john@example.com',
        type: 'email',
    },
};
export const WithIcon = {
    args: {
        label: 'Search ESG Metrics',
        placeholder: 'Search...',
        icon: _jsx(Search, { className: "w-4 h-4" }),
    },
};
export const WithError = {
    args: {
        label: 'Email Address',
        placeholder: 'john@example.com',
        type: 'email',
        error: 'Invalid email address format',
        defaultValue: 'john@invalid',
    },
};
//# sourceMappingURL=Input.stories.js.map