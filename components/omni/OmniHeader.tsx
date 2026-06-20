'use client';


import { OmniComponentHeart } from '@esggo/types';
import React from 'react';

export interface OmniHeaderProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;

  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function OmniHeader({ title, subtitle, icon, badge, actions }: OmniHeaderProps) {
  return (
    <header className="w-full border-b border-[rgba(0,50,98,0.08)] px-4 md:px-6 py-4 flex items-center justify-between relative z-20 gap-4">
      <div className="flex items-center gap-3 min-w-0">
        {icon && (
          <div className="p-2 bg-cyan-50 rounded-xl border border-cyan-100 text-cyan-600 shrink-0">
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-lg md:text-xl font-black text-[#003262] tracking-tight truncate">
              {title}
            </h1>
            {badge}
          </div>
          {subtitle && <p className="text-xs text-slate-400 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
    </header>
  );
}
