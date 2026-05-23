'use client';
import React from 'react';
import { UniversalPageConfig } from '../../lib/page-config';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandKpiCard, BrandT5Strip, BrandStatusDot 
} from './index';
import { motion } from 'framer-motion';

interface StandardPageProps {
  config: UniversalPageConfig;
}

export default function StandardPage({ config }: StandardPageProps) {
  return (
    <div className="page-container space-y-6 lg:space-y-10 min-h-screen slide-up">
      
      {/* 1. Compact Universal Page Header */}
      <header className="flex flex-col xl:flex-row xl:items-end justify-between gap-6 lg:gap-10">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.2em] px-3 py-1 rounded-full uppercase">
               {config.griReference || 'Governance'} OS
             </BrandBadge>
             <div className="flex items-center gap-2 bg-emerald-50/50 backdrop-blur-sm px-3 py-1 rounded-full border border-emerald-100/50">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest">Sovereign State Active</span>
             </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-4">
               {config.icon && <div className="text-[#003262] opacity-80">{config.icon}</div>}
               <h1 className="text-3xl lg:text-5xl font-black text-[#003262] tracking-tighter leading-none uppercase">{config.title}</h1>
            </div>
            <p className="text-slate-400 text-base lg:text-lg max-w-3xl font-medium leading-relaxed">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Primary Actions Area */}
        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          {config.primaryActions?.map(action => (
            <BrandButton 
              key={action.id}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
              className="flex-1 xl:flex-none h-14 px-8 rounded-2xl shadow-xl shadow-[#003262]/5 hover:scale-[1.02] transition-all"
            >
              {action.icon}
              <span className={action.icon ? 'ml-3' : ''}>{action.label}</span>
            </BrandButton>
          ))}
        </div>
      </header>

      {/* 2. 5T Integrity Protocol Strip */}
      <BrandCard padding="none" className="overflow-hidden border-white/40 bg-white/20 backdrop-blur-sm shadow-xl shadow-blue-900/5">
        <BrandT5Strip 
          items={['T1','T2','T3','T4','T5'].map(code => ({ 
            code: code as any, 
            active: config.activeT5Tags.includes(code as any) 
          }))}
          className="bg-gradient-to-r from-white/40 via-white/80 to-white/40"
        />
      </BrandCard>

      {/* 3. High-Density KPI Grid */}
      {config.kpis && config.kpis.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {config.kpis.map((k) => (
            <BrandKpiCard
              key={k.key}
              label={k.label}
              value={k.value}
              unit={k.unit}
              trend={k.trend}
              trendUp={k.trendUp}
              icon={k.icon}
              color={k.color}
              verified={k.verified}
              className="p-5 lg:p-7 rounded-[1.5rem] lg:rounded-[2rem] border-none shadow-premium bg-white/80 backdrop-blur-md"
            />
          ))}
        </div>
      )}

      {/* 4. Main Section Bento Grid */}
      <div className="bento pb-24">
        {config.sections.filter(section => !section.hidden).map(section => (
          <div 
            key={section.id} 
            className={`col-span-12 lg:col-span-${section.columns}`}
          >
            <BrandCard padding="none" className="h-full glass-panel border-none shadow-premium overflow-hidden group">
              <div className="p-6 lg:p-10 border-b border-slate-50 flex items-center justify-between">
                <BrandCardHeader 
                  title={section.title} 
                  subtitle={section.subtitle} 
                  icon={section.icon}
                />
                <div className="flex gap-2">
                  {section.actions?.map(a => (
                    <BrandButton key={a.id} variant={a.variant || 'ghost'} size="xs" className="w-9 h-9 p-0 rounded-xl" onClick={a.onClick}>
                      {a.icon}
                    </BrandButton>
                  ))}
                </div>
              </div>
              <div className="p-6 lg:p-10">
                {section.component}
              </div>
            </BrandCard>
          </div>
        ))}
      </div>

    </div>
  );
}
