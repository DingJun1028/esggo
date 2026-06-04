import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card, CardHeader, CardContent } from '../Card';
const meta = {
    title: 'UI/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};
export default meta;
export const Default = {
    render: (args) => (_jsxs(Card, { ...args, className: "w-[350px]", children: [_jsx(CardHeader, { title: "Sustainability Report", subtitle: "Environmental" }), _jsx(CardContent, { children: _jsx("p", { className: "text-sm text-slate-500", children: "This is a sample liquid glass card used for the ESG GO platform." }) })] })),
};
export const HoverableAndGlow = {
    render: (args) => (_jsxs(Card, { ...args, hover: true, glow: true, className: "w-[350px]", children: [_jsx(CardHeader, { title: "Important Metric" }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-3xl font-black text-berkeley-blue", children: "85.4%" }), _jsx("p", { className: "text-sm text-slate-500 mt-2", children: "Significant improvement over last quarter." })] })] })),
};
//# sourceMappingURL=Card.stories.js.map