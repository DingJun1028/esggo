import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from '@/lib/utils';
const AiStyleSelector = ({ options, value, onValueChange, disabled = false, }) => {
    return (_jsx("div", { className: cn("flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg", disabled && "opacity-50 cursor-not-allowed"), children: options.map((option) => (_jsxs("button", { onClick: () => !disabled && onValueChange(option.key), disabled: disabled, className: cn("flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors", "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2", value === option.key
                ? "bg-indigo-600 text-white shadow"
                : "bg-white text-slate-700 hover:bg-slate-200"), title: option.description, children: [option.icon && _jsx("span", { className: "text-sm", children: option.icon }), option.label] }, option.key))) }));
};
export default AiStyleSelector;
//# sourceMappingURL=AiStyleSelector.js.map