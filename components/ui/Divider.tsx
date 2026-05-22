'use client';
import { cn } from '@/lib/cn';

interface DividerProps {
  label?: string;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export function Divider({ label, orientation = 'horizontal', className }: DividerProps) {
  if (orientation === 'vertical') {
    return <div className={cn('w-px bg-[#e5e7eb] self-stretch', className)} />;
  }
  if (label) {
    return (
      <div className={cn('flex items-center gap-3 my-4', className)}>
        <div className="flex-1 h-px bg-[#e5e7eb]" />
        <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-wide px-2">{label}</span>
        <div className="flex-1 h-px bg-[#e5e7eb]" />
      </div>
    );
  }
  return <hr className={cn('border-none h-px bg-[#e5e7eb] my-4', className)} />;
}