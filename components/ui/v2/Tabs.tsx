// components/ui/v2/Tabs.tsx
'use client';
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'line' | 'pill' | 'box';
  children?: (activeTab: string) => React.ReactNode;
}

export function Tabs({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onTabChange,
  variant = 'line',
  children,
}: TabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
  const active = controlledActive ?? internalActive;

  const handleChange = (id: string) => {
    setInternalActive(id);
    onTabChange?.(id);
  };

  const containerStyles = {
    line: 'border-b border-neutral-200',
    pill: 'bg-neutral-100 p-1 rounded-xl inline-flex',
    box: 'border-b border-neutral-200',
  };

  const tabStyles = {
    line: (isActive: boolean) =>
      cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap',
        isActive
          ? 'border-neutral-900 text-neutral-900'
          : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
      ),
    pill: (isActive: boolean) =>
      cn(
        'px-4 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap',
        isActive
          ? 'bg-white text-neutral-900 shadow-sm border border-neutral-200'
          : 'text-neutral-500 hover:text-neutral-700'
      ),
    box: (isActive: boolean) =>
      cn(
        'px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap',
        isActive
          ? 'border-amber-400 text-neutral-900 bg-amber-50/50'
          : 'border-transparent text-neutral-500 hover:text-neutral-700'
      ),
  };

  return (
    <div>
      <div className={cn('flex gap-1 overflow-x-auto no-scrollbar', containerStyles[variant])}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            disabled={tab.disabled}
            className={cn(
              'flex items-center gap-2',
              tabStyles[variant](active === tab.id),
              tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'
            )}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded-full font-medium',
                  active === tab.id ? 'bg-neutral-900 text-white' : 'bg-neutral-200 text-neutral-600'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>
      {children && <div className="mt-4">{children(active)}</div>}
    </div>
  );
}

export default Tabs;
