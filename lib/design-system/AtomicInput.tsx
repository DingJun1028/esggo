import React, { forwardRef } from 'react';

export interface AtomicInputProps extends React.InputHTMLAttributes<HTMLInputElement> { }

export const AtomicInput = forwardRef<HTMLInputElement, AtomicInputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-10 w-full rounded-md border border-white/10 bg-black/20 px-3 py-2 text-sm text-slate-200 
        placeholder:text-slate-500 transition-colors duration-200
        focus:outline-none focus:ring-1 focus:ring-[#06b6d4]/50 focus:border-[#06b6d4]/50 focus:bg-white/5
        disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      />
    );
  }
);
AtomicInput.displayName = 'AtomicInput';