'use client';
import { forwardRef } from 'react';
import { cn } from '@/lib/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftAddon, rightAddon, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-[12px] font-semibold text-[#374151]">{label}</label>}
        <div className="relative flex items-center">
          {leftAddon && <span className="absolute left-3 text-[#9ca3af]">{leftAddon}</span>}
          <input
            ref={ref}
            className={cn(
              'w-full px-3 py-2.5 rounded-[9px] border text-[13px] outline-none transition-all',
              'border-[#e5e7eb] bg-white text-[#1a1a2e] placeholder-[#9ca3af]',
              'focus:border-[#003262] focus:ring-3 focus:ring-[#00326215]',
              error && 'border-red-400 focus:border-red-500 focus:ring-red-100',
              leftAddon && 'pl-9',
              rightAddon && 'pr-9',
              className
            )}
            {...props}
          />
          {rightAddon && <span className="absolute right-3 text-[#9ca3af]">{rightAddon}</span>}
        </div>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-[12px] font-semibold text-[#374151]">{label}</label>}
        <textarea
          ref={ref}
          className={cn(
            'w-full px-3 py-2.5 rounded-[9px] border text-[13px] outline-none transition-all resize-vertical',
            'border-[#e5e7eb] bg-white text-[#1a1a2e] placeholder-[#9ca3af] font-inherit',
            'focus:border-[#003262] focus:ring-3 focus:ring-[#00326215]',
            error && 'border-red-400',
            className
          )}
          {...props}
        />
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
        {hint && !error && <p className="text-[11px] text-[#9ca3af]">{hint}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && <label className="text-[12px] font-semibold text-[#374151]">{label}</label>}
        <select
          ref={ref}
          className={cn(
            'w-full px-3 py-2.5 rounded-[9px] border text-[13px] outline-none transition-all bg-white',
            'border-[#e5e7eb] text-[#1a1a2e]',
            'focus:border-[#003262] focus:ring-3 focus:ring-[#00326215]',
            error && 'border-red-400',
            className
          )}
          {...props}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {error && <p className="text-[11px] text-red-500 font-medium">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';

export function FormField({ label, required, children, hint }: { label: string; required?: boolean; children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12px] font-semibold text-[#374151]">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-[#9ca3af]">{hint}</p>}
    </div>
  );
}