'use client';

import React from 'react';

interface OmniHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function OmniHeader({ title, subtitle, icon }: OmniHeaderProps) {
  return (
    <header className="w-full border-b border-white/10 bg-slate-950/40 backdrop-blur-md px-6 py-5 flex items-center justify-between relative z-20">
      <div className="flex items-center gap-3">
        {icon && (
          <div className="p-2.5 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400 shrink-0">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-black text-white tracking-wide">{title}</h1>
          {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 bg-black/40 border border-white/5 px-3 py-1.5 rounded-lg">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono text-slate-400">OMNINEXUS_SECURE</span>
        </div>
      </div>
    </header>
  );
}
