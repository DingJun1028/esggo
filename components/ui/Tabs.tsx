'use client';
import { cn } from '@/lib/cn';

interface Tab {
  key: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
}

interface TabsProps {
  tabs: Tab[];
  active: string;
  onChange: (key: string) => void;
  variant?: 'pills' | 'underline' | 'card';
  className?: string;
}

export function Tabs({ tabs, active, onChange, variant = 'pills', className }: TabsProps) {
  if (variant === 'underline') {
    return (
      <div className={cn('flex gap-1 border-b border-[#e5e7eb]', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2.5 text-[13px] font-semibold border-b-2 transition-colors -mb-px',
              active === tab.key
                ? 'border-[#003262] text-[#003262]'
                : 'border-transparent text-[#6b7280] hover:text-[#374151]'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-[#003262] text-white">
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={cn('flex gap-2', className)}>
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            className={cn(
              'flex items-center gap-1.5 px-4 py-2 rounded-[10px] text-[13px] font-semibold transition-all border',
              active === tab.key
                ? 'bg-[#003262] text-white border-[#003262]'
                : 'bg-white text-[#374151] border-[#e5e7eb] hover:border-[#003262]'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  // pills (default)
  return (
    <div className={cn('flex gap-1 bg-[#f3f4f6] rounded-[10px] p-1', className)}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-[13px] transition-all',
            active === tab.key
              ? 'bg-white text-[#003262] font-bold shadow-sm'
              : 'text-[#6b7280] font-medium hover:text-[#374151]'
          )}
        >
          {tab.icon}
          {tab.label}
          {tab.badge !== undefined && (
            <span className={cn('px-1.5 py-0.5 rounded-full text-[10px] font-bold', active === tab.key ? 'bg-[#003262] text-white' : 'bg-[#e5e7eb] text-[#374151]')}>
              {tab.badge}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}