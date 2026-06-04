import { jsx as _jsx } from "react/jsx-runtime";
export const Input = ({ type = 'text', placeholder, value, onChange, disabled = false, className = '', }) => {
    const baseClasses = `
    px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
    return (_jsx("input", { type: type, placeholder: placeholder, value: value, onChange: onChange, disabled: disabled, className: `${baseClasses} ${className}` }));
};
//# sourceMappingURL=Input.js.map