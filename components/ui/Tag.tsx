'use client';
import { X } from 'lucide-react';
import { cn } from '@/lib/cn';

interface TagProps {
  label: string;
  color?: string;
  onRemove?: () => void;
  size?: 'sm' | 'md';
  className?: string;
}

export function Tag({ label, color = '#003262', onRemove, size = 'sm', className }: TagProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-[6px] font-semibold',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-[12px]',
        className
      )}
      style={{ background: `${color}15`, color }}
    >
      {label}
      {onRemove && (
        <button onClick={onRemove} className="hover:opacity-60 transition-opacity ml-0.5">
          <X size={10} />
        </button>
      )}
    </span>
  );
}