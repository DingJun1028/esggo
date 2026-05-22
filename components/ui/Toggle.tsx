'use client';
import { cn } from '@/lib/cn';

interface ToggleProps {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
  size?: 'sm' | 'md';
  disabled?: boolean;
  className?: string;
}

export function Toggle({ checked, onChange, label, size = 'md', disabled = false, className }: ToggleProps) {
  const isSmall = size === 'sm';
  return (
    <label className={cn('flex items-center gap-2 cursor-pointer select-none', disabled && 'opacity-50 cursor-not-allowed', className)}>
      <div
        className={cn('relative rounded-full transition-colors duration-200', isSmall ? 'w-8 h-4' : 'w-11 h-6')}
        style={{ background: checked ? '#003262' : '#d1d5db' }}
        onClick={() => !disabled && onChange(!checked)}
      >
        <span
          className={cn('absolute top-0.5 rounded-full bg-white shadow transition-transform duration-200', isSmall ? 'w-3 h-3' : 'w-5 h-5')}
          style={{ transform: checked ? `translateX(${isSmall ? '16px' : '20px'})` : 'translateX(2px)' }}
        />
      </div>
      {label && <span className="text-[13px] text-[#374151]">{label}</span>}
    </label>
  );
}