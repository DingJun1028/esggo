'use client';
import { cn } from '@/lib/cn';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  accent?: boolean;
  className?: string;
}

export function SectionHeader({ title, subtitle, actions, accent = false, className }: SectionHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      <div className={cn('flex items-center gap-2', accent && 'border-l-[3px] border-[#003262] pl-3')}>
        <div>
          <h2 className="text-[15px] font-bold text-[#1f2937]">{title}</h2>
          {subtitle && <p className="text-[12px] text-[#9ca3af] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}