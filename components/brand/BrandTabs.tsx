'use client';
import React, { useState } from 'react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: number | string;
  disabled?: boolean;
}

interface BrandTabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'line' | 'pill' | 'box';
  children?: (activeTab: string) => React.ReactNode;
}

export default function BrandTabs({
  tabs,
  defaultTab,
  activeTab: controlledActive,
  onTabChange,
  variant = 'line',
  children,
}: BrandTabsProps) {
  const [internalActive, setInternalActive] = useState(defaultTab || tabs[0]?.id);
  const active = controlledActive ?? internalActive;

  const handleChange = (id: string) => {
    setInternalActive(id);
    onTabChange?.(id);
  };

  const containerStyles = {
    line: 'border-b border-slate-200',
    pill: 'bg-slate-100 p-1 rounded-xl inline-flex',
    box: 'border-b border-slate-200',
  };

  const tabStyles = {
    line: (isActive: boolean) =>
      `px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
        isActive
          ? 'border-[#003262] text-[#003262]'
          : 'border-transparent text-slate-500 hover:text-[#003262] hover:border-slate-300'
      }`,
    pill: (isActive: boolean) =>
      `px-4 py-1.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${
        isActive
          ? 'bg-white text-[#003262] shadow-sm border border-slate-200'
          : 'text-slate-500 hover:text-[#003262]'
      }`,
    box: (isActive: boolean) =>
      `px-4 py-2.5 text-sm font-medium border-b-2 transition-all -mb-px whitespace-nowrap ${
        isActive
          ? 'border-[#FDB515] text-[#003262] bg-yellow-50/50'
          : 'border-transparent text-slate-500 hover:text-[#003262]'
      }`,
  };

  return (
    <div>
      <div className={`flex gap-1 overflow-x-auto scrollbar-hide ${containerStyles[variant]}`}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => !tab.disabled && handleChange(tab.id)}
            disabled={tab.disabled}
            className={`flex items-center gap-2 ${tabStyles[variant](active === tab.id)} ${tab.disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
          >
            {tab.icon}
            {tab.label}
            {tab.badge !== undefined && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                active === tab.id ? 'bg-[#003262] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
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