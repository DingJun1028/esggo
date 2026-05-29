'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UniversalPageConfig } from '../../lib/page-config';
import { BrandButton, BrandCard, BrandBadge, BrandStatusDot } from './index';
import { fadeIn, staggerContainer, slideIn } from '../../lib/animations';
import { cn } from '../../lib/utils';

interface StandardPageProps {
  config: UniversalPageConfig;
  children?: React.ReactNode;
}

export default function StandardPage({ config, children }: StandardPageProps) {
  const activeKpis = config.kpis?.slice(0, 6) ?? [];

  return (
    <motion.div 
      className="page-container pb-12 relative z-10"
      initial="initial"
      animate="animate"
      variants={staggerContainer}
    >
      {/* ─── Sovereign Header Bar (Layer 1: Structure) ────────────────── */}
      <motion.header 
        variants={fadeIn}
        className="flex items-center justify-between mb-8 bg-white/40 backdrop-blur-xl p-4 rounded-[2rem] border border-white/80 shadow-premium"
      >
        <div className="flex items-center gap-6 min-w-0">
          {/* 5T Protocol Micro Indicator */}
          <div className="flex gap-2 px-4 py-2.5 bg-[#003262]/5 rounded-2xl border border-[#003262]/10 shadow-inner">
            {['T1','T2','T3','T4','T5'].map(code => (
              <div
                key={code}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-700",
                  config.activeT5Tags.includes(code as any) 
                    ? "bg-[#003262] shadow-[0_0_10px_rgba(0,50,98,0.5)] scale-110" 
                    : "bg-slate-200"
                )}
                title={code}
              />
            ))}
          </div>
          
          {/* Icon + Title Pair */}
          <div className="flex items-center gap-4 min-w-0">
            {config.icon && (
              <div className="w-12 h-12 rounded-2xl bg-[#003262] text-white flex items-center justify-center shadow-xl shadow-[#003262]/20 z-layer-2">
                {React.cloneElement(config.icon as React.ReactElement, { size: 24 })}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-2xl font-black text-[#003262] tracking-tighter truncate uppercase">{config.title}</h1>
              {config.subtitle && (
                <p className="hidden lg:block text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] truncate max-w-[400px] mt-0.5">
                  {config.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Governance Context Badge */}
          <div className="flex items-center gap-2">
            <BrandBadge variant="outline" size="sm" className="bg-[#FDB515]/5 text-[#003262] border-[#FDB515]/20 font-black tracking-widest px-3">
              {config.griReference || 'ESG_OS_CORE'}
            </BrandBadge>
          </div>
        </div>

        {/* Global Action Terminal */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-3 px-4 py-2 bg-emerald-50/40 rounded-2xl border border-emerald-100/60 backdrop-blur-md">
            <BrandStatusDot status="active" pulse size="sm" />
            <span className="text-[10px] font-black text-emerald-800 uppercase tracking-widest hidden sm:block">Protocol_Verified</span>
          </div>
          {config.primaryActions?.map(action => (
            <BrandButton
              key={action.id}
              variant={action.variant === 'primary' ? 'primary' : 'secondary'}
              onClick={action.onClick}
              loading={action.loading}
              disabled={action.disabled}
              size="md"
              className="rounded-2xl shadow-lg"
              icon={action.icon}
            >
              {action.label}
            </BrandButton>
          ))}
        </div>
      </motion.header>

      {/* ─── Liquid KPI Matrix (Layer 2: Hologram) ────────────────────── */}
      {activeKpis.length > 0 && (
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10"
        >
          {activeKpis.map((k, idx) => (
            <motion.div key={k.key} variants={slideIn} custom={idx}>
              <BrandCard variant="glass" hover padding="sm" className="group">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:rotate-12 shadow-inner",
                    k.verified ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400"
                  )}>
                    {k.icon && React.cloneElement(k.icon as React.ReactElement, { size: 20 })}
                  </div>
                  {k.trend && (
                    <span className={cn(
                      "text-[9px] font-black px-2 py-1 rounded-lg uppercase tracking-wider",
                      k.trendUp ? "text-emerald-700 bg-emerald-50 border border-emerald-100" : "text-red-600 bg-red-50 border border-red-100"
                    )}>
                      {k.trend}
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{k.label}</p>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-black text-[#003262] font-mono tracking-tighter" style={{ color: k.color }}>{k.value}</span>
                    {k.unit && <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{k.unit}</span>}
                  </div>
                </div>
              </BrandCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── Dynamic Workspace Layer ─────────────────────────────────── */}
      {children && (
        <motion.div variants={fadeIn} className="mb-10">
          {children}
        </motion.div>
      )}

      {/* ─── Sovereign Bento Sections (Layer 1: Structure) ────────────── */}
      <div className="grid grid-cols-12 gap-8">
        {config.sections.filter(s => !s.hidden).map((section, idx) => (
          <motion.div
            key={section.id}
            variants={slideIn}
            custom={idx + 2}
            className={cn(
              "col-span-12",
              section.columns ? `lg:col-span-${section.columns}` : ""
            )}
          >
            <BrandCard padding="none" variant="liquid" className="h-full flex flex-col overflow-hidden group">
              {/* Refined Section Header */}
              <div className="flex items-center justify-between p-6 border-b border-slate-100/40 bg-white/20">
                <div className="flex items-center gap-4 min-w-0">
                  {section.icon && (
                    <div className="w-10 h-10 rounded-xl bg-[#003262]/5 text-[#003262] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                      {React.cloneElement(section.icon as React.ReactElement, { size: 20 })}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-base font-black text-[#003262] tracking-tight uppercase">{section.title}</p>
                    {section.subtitle && (
                      <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-0.5 truncate">{section.subtitle}</p>
                    )}
                  </div>
                </div>
                {/* Micro Actions */}
                <div className="flex items-center gap-2">
                  {section.actions?.map(a => (
                    <BrandButton key={a.id} variant="secondary" size="xs" className="w-9 h-9 p-0 rounded-xl bg-white/60 hover:bg-white/80" onClick={a.onClick}>
                      {a.icon && React.cloneElement(a.icon as React.ReactElement, { size: 16 })}
                    </BrandButton>
                  ))}
                </div>
              </div>

              {/* Dynamic Content Body */}
              <div className="flex-1 p-8 overflow-auto no-scrollbar">
                {section.component}
              </div>
            </BrandCard>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
