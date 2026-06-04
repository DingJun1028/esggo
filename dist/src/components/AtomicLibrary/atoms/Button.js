import { jsx as _jsx } from "react/jsx-runtime";
import { ThemeContext } from '../../theme';
export const Button = ({ variant = 'primary', size = 'md', children, onClick, disabled = false, }) => {
    const { themes } = ThemeContext;
    const theme = themes[ThemeContext.current];
    const baseClasses = `
    px-4 py-2 rounded-md font-medium transition-colors duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
    const variantClasses = {
        primary: `bg-blue-600 text-white hover:bg-blue-700`,
        secondary: `bg-gray-200 text-gray-800 hover:bg-gray-300`,
        success: `bg-green-500 text-white hover:bg-green-600`,
        danger: `bg-red-500 text-white hover:bg-red-600`,
    };
    const sizeClasses = {
        sm: 'px-3 py-1 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };
    const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`;
    return (_jsx("button", { className: classes, onClick: onClick, disabled: disabled, children: children }));
};
//# sourceMappingURL=Button.js.map