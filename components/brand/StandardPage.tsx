'use client';
import React from 'react';
import { UniversalPageConfig } from '../../lib/page-config';
import { 
  BrandButton, BrandBadge, BrandCard, BrandKpiCard, BrandT5Strip, BrandStatusDot 
} from './index';

interface StandardPageProps {
  config: UniversalPageConfig;
}

export default function StandardPage({ config }: StandardPageProps) {
  const activeKpis = config.kpis?.slice(0, 6) ?? [];

  return (
    <div className="page-container fade-in pb-8">
      
      {/* ─── Compact Header Bar ───────────────────────────────────── */}
      <header className="page-header-bar mb-3">
        <div className="flex items-center gap-3 min-w-0">
          {/* T5 micro indicator */}
          <div className="t5-micro-strip flex-shrink-0">
            {['T1','T2','T3','T4','T5'].map(code => (
              <div
                key={code}
                className="t5-dot"
                style={{
                  backgroundColor: config.activeT5Tags.includes(code as any)
                    ? '#003262' : '#CBD5E1'
                }}
                title={code}
              />
            ))}
          </div>
          
          {/* Icon + Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            {config.icon && (
              <div className="text-[#003262]/70 flex-shrink-0">{config.icon}</div>
            )}
            <h1 className="page-header-title truncate">{config.title}</h1>
          </div>

          {/* Subtitle tag */}
          {config.subtitle && (
            <span className="hidden lg:block text-xs text-slate-400 font-medium truncate max-w-[260px]">
              {config.subtitle}
            </span>
          )}

          {/* Module badge */}
          <BrandBadge variant="gold" size="xs" className="hidden sm:flex flex-shrink-0 font-black tracking-widest">
            {config.griReference || 'ESG-OS'}
          </BrandBadge>
        </div>

        {/* Status + Actions (right side) */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
            <BrandStatusDot status="active" pulse size="xs" />
            <span className="text-[9px] font-black text-emerald-700 uppercase tracking-widest hidden sm:block">Live</span>
          </div>
          {config.primaryActions?.map(action => (
            <BrandButton
              key={action.id}
              variant={action.variant || 'primary'}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
              size="sm"
              className="h-9 px-4 rounded-lg text-xs font-black"
            >
              {action.icon}
              {action.label && <span className={action.icon ? 'ml-1.5 hidden sm:inline' : ''}>{action.label}</span>}
            </BrandButton>
          ))}
        </div>
      </header>

      {/* ─── KPI Bar (inline horizontal strip) ─────────────────────── */}
      {activeKpis.length > 0 && (
        <div className="kpi-bar mb-3">
          {activeKpis.map((k) => (
            <div key={k.key} className="kpi-bar-cell">
              <div className="flex items-center gap-1 mb-0.5">
                {k.icon && (
                  <span style={{ color: k.color || '#003262' }} className="opacity-70 flex-shrink-0">
                    {React.cloneElement(k.icon as React.ReactElement, { size: 10 })}
                  </span>
                )}
                <span className="kpi-bar-label truncate">{k.label}</span>
              </div>
              <div className="flex items-baseline gap-1">
                <span className="kpi-bar-value" style={{ color: k.color || '#003262' }}>{k.value}</span>
                {k.unit && <span className="text-[9px] text-slate-400 font-bold">{k.unit}</span>}
              </div>
              {k.trend && (
                <span className={`text-[9px] font-black ${k.trendUp ? 'text-emerald-500' : 'text-red-400'}`}>
                  {k.trend}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ─── Bento Grid Sections ─────────────────────────────────────── */}
      <div className="bento">
        {config.sections.filter(s => !s.hidden).map(section => (
          <div
            key={section.id}
            className={`col-span-12 lg:col-span-${section.columns}`}
          >
            <div className="section-card h-full">
              {/* Section header – ultra compact */}
              <div className="section-card-header">
                <div className="flex items-center gap-2 min-w-0">
                  {section.icon && (
                    <span className="text-[#003262]/60 flex-shrink-0">
                      {React.cloneElement(section.icon as React.ReactElement, { size: 13 })}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-black text-[#003262] leading-none truncate">{section.title}</p>
                    {section.subtitle && (
                      <p className="section-label mt-0.5 truncate">{section.subtitle}</p>
                    )}
                  </div>
                </div>
                {/* Section actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  {section.actions?.map(a => (
                    <BrandButton key={a.id} variant={a.variant || 'ghost'} size="xs" className="w-7 h-7 p-0 rounded-lg" onClick={a.onClick}>
                      {a.icon && React.cloneElement(a.icon as React.ReactElement, { size: 12 })}
                    </BrandButton>
                  ))}
                </div>
              </div>

              {/* Section body */}
              <div className="section-card-body">
                {section.component}
              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
