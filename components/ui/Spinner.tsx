'use client';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/cn';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
  label?: string;
  className?: string;
}

const spinnerSizes: Record<string, number> = { sm: 16, md: 24, lg: 40 };

export function Spinner({ size = 'md', color = '#003262', label, className }: SpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-2', className)}>
      <Loader2 size={spinnerSizes[size]} color={color} className="animate-spin" />
      {label && <p className="text-[13px] text-[#6b7280]">{label}</p>}
    </div>
  );
}