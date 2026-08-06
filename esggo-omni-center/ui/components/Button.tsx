// ESG GO UI Button Component
// Generated from Google Stitch Design System

import React from 'react';

interface ButtonProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline';
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  label,
  variant = 'primary',
  onClick,
  disabled = false
}) => {
  const baseClasses = "px-4 py-2 rounded font-medium transition-colors";
  const variantClasses = {
    primary: "bg-[#0066CC] text-white hover:bg-[#0052a3]",
    secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
    outline: "border border-[#0066CC] text-[#0066CC] hover:bg-blue-50"
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
};