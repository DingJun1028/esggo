import React from 'react';
import { cn } from '@/lib/utils';

// AI 風格選項的介面
interface AiStyleOption {
  key: string;
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface AiStyleSelectorProps {
  options: AiStyleOption[];
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

const AiStyleSelector: React.FC<AiStyleSelectorProps> = ({
  options,
  value,
  onValueChange,
  disabled = false,
}) => {
  return (
    <div className={cn(
      "flex flex-wrap gap-2 p-1 bg-slate-100 rounded-lg",
      disabled && "opacity-50 cursor-not-allowed"
    )}>
      {options.map((option) => (
        <button
          key={option.key}
          onClick={() => !disabled && onValueChange(option.key)}
          disabled={disabled}
          className={cn(
            "flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium rounded-md transition-colors",
            "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
            value === option.key
              ? "bg-indigo-600 text-white shadow"
              : "bg-white text-slate-700 hover:bg-slate-200"
          )}
          title={option.description}
        >
          {option.icon && <span className="text-sm">{option.icon}</span>}
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default AiStyleSelector;