'use client';
import React from 'react';
import { UniversalPageConfig, T5_LABELS } from '../../lib/page-config';
import { 
  BrandButton, BrandBadge, BrandCard, BrandCardHeader, BrandKpiCard, BrandT5Strip, BrandStatusDot, BrandPageHeader 
} from './index';
import { ChevronRight, Zap } from 'lucide-react';

interface StandardPageProps {
  config: UniversalPageConfig;
}

export default function StandardPage({ config }: StandardPageProps) {
  return (
    <div className="fade-in max-w-[1600px] mx-auto p-6 space-y-8 min-h-screen">
      
      {/* 1. Universal Page Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200/60">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <BrandBadge variant="gold" size="sm" className="font-black tracking-widest px-3 uppercase">
               {config.griReference || 'Governance'} OS
             </BrandBadge>
             <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                <BrandStatusDot status="active" pulse size="sm" />
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Verified State</span>
             </div>
          </div>
          <div className="flex items-center gap-4">
             {config.icon && <div className="text-[#003262]">{config.icon}</div>}
             <h1 className="text-4xl font-black text-[#003262] tracking-tight leading-none">{config.title}</h1>
          </div>
          <p className="text-slate-500 text-sm max-w-2xl font-medium leading-relaxed">
            {config.subtitle}
          </p>
        </div>

        {/* Primary Actions Slot */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {config.primaryActions?.map(action => (
            <BrandButton 
              key={action.id}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
              className="h-12 px-6 rounded-xl shadow-lg hover:scale-105 transition-all"
            >
              {action.icon}
              <span className={action.icon ? 'ml-2' : ''}>{action.label}</span>
            </BrandButton>
          ))}
        </div>
      </header>

      {/* 2. 5T Protocol Integrity Strip */}
      <BrandCard padding="none" className="overflow-hidden border-blue-100/50 shadow-md">
        <BrandT5Strip 
          items={['T1','T2','T3','T4','T5'].map(code => ({ 
            code: code as any, 
            active: config.activeT5Tags.includes(code as any) 
          }))}
          className="bg-gradient-to-r from-blue-50/20 via-white to-blue-50/20"
        />
      </BrandCard>

      {/* 3. KPI Bento Grid */}
      {config.kpis && config.kpis.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {config.kpis.map((k, idx) => (
            <BrandKpiCard
              key={k.key}
              label={k.label}
              value={k.value}
              unit={k.unit}
              trend={k.trend}
              trendUp={k.trendUp}
              icon={k.icon}
              verified={k.verified}
              className={`border-t-4 ${idx % 2 === 0 ? 'border-[#003262]' : 'border-[#FDB515]'}`}
            />
          ))}
        </div>
      )}

      {/* 4. Main Content Bento Grid */}
      <div className="grid grid-cols-12 gap-6 pb-20">
        {config.sections.map(section => (
          <div 
            key={section.id} 
            className={`col-span-12 lg:col-span-${section.columns}`}
          >
            <BrandCard padding="none" className="h-full glass-panel overflow-hidden border-slate-200/60">
              <BrandCardHeader 
                title={section.title} 
                subtitle={section.subtitle} 
                icon={section.icon}
                action={
                   <div className="flex gap-2">
                      {section.actions?.map(a => (
                        <BrandButton key={a.id} variant={a.variant || 'ghost'} size="xs" onClick={a.onClick}>
                          {a.icon}
                        </BrandButton>
                      ))}
                   </div>
                }
              />
              <div className="p-6">
                {section.component}
              </div>
            </BrandCard>
          </div>
        ))}
      </div>

    </div>
  );
}
