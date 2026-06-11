// src/components/AtomicLibrary/atoms/Input.tsx
import React from 'react';

interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number';
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  className?: string;
}

export const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  className = '',
}) => {
  const baseClasses = `
    px-3 py-2 border border-gray-300 rounded-md 
    focus:outline-none focus:ring-2 focus:ring-blue-500
    transition-colors duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`${baseClasses} ${className}`}
    />
  );
};