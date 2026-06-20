// components/ui/v2/OmniHeader.tsx
'use client';
import React from 'react';

interface OmniHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
}

export function OmniHeader({ title, subtitle, icon, actions }: OmniHeaderProps) {
  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-neutral-200">
      <div className="flex items-center gap-4">
        {icon && (
          <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black text-neutral-900 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-neutral-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </header>
  );
}

export default OmniHeader;
