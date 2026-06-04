import { jsx as _jsx } from "react/jsx-runtime";
export const Tag = ({ children, variant = 'default', size = 'md', className = '', }) => {
    const variantClasses = {
        default: 'bg-gray-100 text-gray-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
    };
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1 text-sm',
        lg: 'px-4 py-2 text-base',
    };
    const classes = `inline-flex items-center rounded-full ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
    return _jsx("div", { className: classes, children: children });
};
//# sourceMappingURL=Tag.js.map