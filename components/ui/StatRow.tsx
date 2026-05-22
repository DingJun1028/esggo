'use client';
import { cn } from '@/lib/cn';

interface Stat {
  label: string;
  value: string | number;
  color?: string;
}

interface StatRowProps {
  stats: Stat[];
  className?: string;
}

export function StatRow({ stats, className }: StatRowProps) {
  return (
    <div className={cn('flex items-center gap-6 flex-wrap', className)}>
      {stats.map((stat, i) => (
        <div key={i} className="flex flex-col gap-0.5">
          <span className="text-[22px] font-extrabold leading-none" style={{ color: stat.color || '#003262' }}>
            {stat.value}
          </span>
          <span className="text-[11px] text-[#9ca3af] font-medium">{stat.label}</span>
        </div>
      ))}
    </div>
  );
}