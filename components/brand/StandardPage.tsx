'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { UniversalPageConfig } from '../../lib/page-config';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { BrandT5Strip, BrandStatusDot } from './index';
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
      {/* ─── Compact Header Bar ───────────────────────────────────── */}
      <motion.header 
        variants={fadeIn}
        className="flex items-center justify-between mb-6 bg-white/40 backdrop-blur-md p-3 rounded-2xl border border-white/60 shadow-sm"
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* T5 micro indicator */}
          <div className="flex gap-1.5 px-3 py-2 bg-[#003262]/5 rounded-xl border border-[#003262]/10">
            {['T1','T2','T3','T4','T5'].map(code => (
              <div
                key={code}
                className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-500",
                  config.activeT5Tags.includes(code as any) ? "bg-[#003262] shadow-[0_0_8px_rgba(0,50,98,0.4)]" : "bg-slate-300"
                )}
                title={code}
              />
            ))}
          </div>
          
          {/* Icon + Title */}
          <div className="flex items-center gap-3 min-w-0">
            {config.icon && (
              <div className="w-10 h-10 rounded-xl bg-[#003262] text-white flex items-center justify-center shadow-lg shadow-[#003262]/20">
                {React.cloneElement(config.icon as React.ReactElement, { size: 20 })}
              </div>
            )}
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-[#003262] tracking-tight truncate">{config.title}</h1>
              {config.subtitle && (
                <p className="hidden lg:block text-[10px] text-slate-500 font-bold uppercase tracking-wider truncate max-w-[300px]">
                  {config.subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Module badge */}
          <div className="flex items-center gap-2">
            <Badge variant="draft" className="bg-[#FDB515]/10 text-[#003262] border-[#FDB515]/20 font-black tracking-widest text-[9px]">
              {config.griReference || 'ESG-OS'}
            </Badge>
            {config.isOXModule && (
              <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 bg-[#003262] rounded-full border border-[#FDB515]/30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FDB515] animate-pulse" />
                <span className="text-[8px] font-black text-[#FDB515] uppercase tracking-[0.2em]">oX_INTEGRATED</span>
              </div>
            )}
          </div>
        </div>

        {/* Status + Actions (right side) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50/60 rounded-xl border border-emerald-100/60 backdrop-blur-sm">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest hidden sm:block">Engine Live</span>
          </div>
          {config.primaryActions?.map(action => (
            <Button
              key={action.id}
              variant={action.variant === 'primary' ? 'primary' : 'glass'}
              onClick={action.onClick}
              isLoading={action.loading}
              disabled={action.disabled}
              size="sm"
              className="h-10 px-5 rounded-xl font-bold text-xs"
            >
              {action.icon && <span className="mr-2">{action.icon}</span>}
              {action.label}
            </Button>
          ))}
        </div>
      </motion.header>

      {/* ─── KPI Bar (inline horizontal strip) ─────────────────────── */}
      {activeKpis.length > 0 && (
        <motion.div 
          variants={fadeIn}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8"
        >
          {activeKpis.map((k, idx) => (
            <motion.div key={k.key} variants={slideIn} custom={idx}>
              <Card className="p-4 bg-white/60 backdrop-blur-md border-white/60 shadow-sm hover:shadow-md transition-all">
                <div className="flex items-center justify-between mb-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center bg-slate-50",
                    k.verified ? "text-[#009E9D]" : "text-slate-400"
                  )}>
                    {k.icon && React.cloneElement(k.icon as React.ReactElement, { size: 16 })}
                  </div>
                  {k.trend && (
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      k.trendUp ? "text-emerald-600 bg-emerald-50" : "text-red-500 bg-red-50"
                    )}>
                      {k.trend}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{k.label}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-[#003262]" style={{ color: k.color }}>{k.value}</span>
                    {k.unit && <span className="text-[10px] text-slate-400 font-bold uppercase">{k.unit}</span>}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ─── Custom Children ───────────────────────────────────────── */}
      {children && (
        <motion.div variants={fadeIn} className="mb-8">
          {children}
        </motion.div>
      )}

      {/* ─── Bento Grid Sections ─────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-6">
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
            <Card hoverEffect className="h-full flex flex-col bg-white/60 backdrop-blur-md border-white/60 shadow-sm overflow-hidden">
              {/* Section header */}
              <div className="flex items-center justify-between p-5 border-b border-slate-100/60">
                <div className="flex items-center gap-3 min-w-0">
                  {section.icon && (
                    <div className="w-8 h-8 rounded-lg bg-[#003262]/5 text-[#003262] flex items-center justify-center">
                      {React.cloneElement(section.icon as React.ReactElement, { size: 16 })}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#003262] leading-tight truncate uppercase tracking-tight">{section.title}</p>
                    {section.subtitle && (
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5 truncate">{section.subtitle}</p>
                    )}
                  </div>
                </div>
                {/* Section actions */}
                <div className="flex items-center gap-2">
                  {section.actions?.map(a => (
                    <Button key={a.id} variant="glass" size="sm" className="w-8 h-8 p-0 rounded-lg bg-white/40" onClick={a.onClick}>
                      {a.icon && React.cloneElement(a.icon as React.ReactElement, { size: 14 })}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Section body */}
              <div className="flex-1 p-5 overflow-auto">
                {section.component}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

    </motion.div>
  );
}
