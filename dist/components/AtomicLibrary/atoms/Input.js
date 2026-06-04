"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Input = void 0;
// src/components/AtomicLibrary/atoms/Input.tsx
const react_1 = __importDefault(require("react"));
const Input = ({ type = 'text', placeholder, value, onChange, disabled = false, className = '', }) => {
    const baseClasses = `
    px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;
    return (<input type={type} placeholder={placeholder} value={value} onChange={onChange} disabled={disabled} className={`${baseClasses} ${className}`}/>);
};
exports.Input = Input;
//# sourceMappingURL=Input.js.map