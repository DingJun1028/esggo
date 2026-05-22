'use client';
import React, { useRef, useState } from 'react';
import { Search, X } from 'lucide-react';

interface BrandSearchBarProps {
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  placeholder?: string;
  fullWidth?: boolean;
  className?: string;
}

export default function BrandSearchBar({ value, onChange, onSearch, placeholder = '搜尋...', fullWidth = false, className = '' }: BrandSearchBarProps) {
  const ref = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState('');

  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (val: string) => {
    if (onChange) onChange(val);
    if (value === undefined) setInternalValue(val);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch(displayValue);
    }
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full' : ''} ${className}`}>
      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        type="text"
        value={displayValue}
        onChange={e => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="w-full h-9 pl-8 pr-8 rounded-lg border border-slate-200 text-sm bg-white text-[#0F172A] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262] transition-all"
      />
      {displayValue && (
        <button
          onClick={() => { handleChange(''); ref.current?.focus(); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center hover:bg-slate-300"
        >
          <X size={10} />
        </button>
      )}
    </div>
  );
}