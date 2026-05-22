'use client';
import React from 'react';

interface BrandInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  icon?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
}

interface BrandTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  hint?: string;
  error?: string;
  fullWidth?: boolean;
}

interface BrandSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options: { value: string; label: string }[];
  fullWidth?: boolean;
}

export function BrandInput({
  label,
  hint,
  error,
  icon,
  iconRight,
  fullWidth = true,
  className = '',
  ...props
}: BrandInputProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{label}</label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full h-9 rounded-lg border text-sm transition-all duration-150
            bg-white text-[#0F172A] placeholder:text-slate-400
            focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262]
            disabled:bg-slate-50 disabled:cursor-not-allowed
            ${error ? 'border-red-400 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 hover:border-slate-300'}
            ${icon ? 'pl-9' : 'pl-3'}
            ${iconRight ? 'pr-9' : 'pr-3'}
            ${className}
          `}
          {...props}
        />
        {iconRight && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
            {iconRight}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function BrandTextarea({
  label,
  hint,
  error,
  fullWidth = true,
  className = '',
  ...props
}: BrandTextareaProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{label}</label>
      )}
      <textarea
        className={`
          w-full rounded-lg border text-sm p-3 transition-all duration-150
          bg-white text-[#0F172A] placeholder:text-slate-400 resize-y min-h-[80px]
          focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262]
          disabled:bg-slate-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
          ${className}
        `}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function BrandSelect({
  label,
  hint,
  error,
  options,
  fullWidth = true,
  className = '',
  ...props
}: BrandSelectProps) {
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label className="block text-sm font-medium text-[#0F172A] mb-1.5">{label}</label>
      )}
      <select
        className={`
          w-full h-9 rounded-lg border text-sm px-3 transition-all duration-150
          bg-white text-[#0F172A]
          focus:outline-none focus:ring-2 focus:ring-[#003262]/20 focus:border-[#003262]
          disabled:bg-slate-50 disabled:cursor-not-allowed
          ${error ? 'border-red-400' : 'border-slate-200 hover:border-slate-300'}
          ${className}
        `}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export default BrandInput;