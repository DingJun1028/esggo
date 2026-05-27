'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

/**
 * DetailTemplate: Standard Object Detail View following Governance v1.0
 */
export interface DetailTemplateProps {
  title: string;
  subtitle?: string;
  breadcrumbs?: { label: string; href: string }[];
  statusBadge?: React.ReactNode;
  actions?: React.ReactNode;
  summaryItems: { label: string; value: string | React.ReactNode; icon?: React.ReactNode }[];
  sections: { id: string; title: string; content: React.ReactNode }[];
  sidebar?: React.ReactNode;
}

export function DetailTemplate({
  title,
  subtitle,
  breadcrumbs,
  statusBadge,
  actions,
  summaryItems,
  sections,
  sidebar
}: DetailTemplateProps) {
  return (
    <div className="flex flex-col gap-8 w-full fade-in pb-20">
      {/* Header & Breadcrumbs */}
      <header className="space-y-4">
        {breadcrumbs && (
          <nav className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-text-secondary/50">
            {breadcrumbs.map((b, i) => (
              <React.Fragment key={i}>
                <a href={b.href} className="hover:text-text-brand transition-colors">{b.label}</a>
                {i < breadcrumbs.length - 1 && <span className="text-[8px]">/</span>}
              </React.Fragment>
            ))}
          </nav>
        )}
        
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-black tracking-tight text-text-brand">{title}</h1>
              {statusBadge}
            </div>
            {subtitle && <p className="text-sm font-medium text-text-secondary">{subtitle}</p>}
          </div>
          <div className="flex gap-3">
            {actions}
          </div>
        </div>
      </header>

      {/* Summary HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {summaryItems.map((item, i) => (
          <Card key={i} className="p-5 border-border-primary/50 bg-white/50 backdrop-blur shadow-sm">
            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-2">{item.label}</p>
            <div className="flex items-center gap-2">
              {item.icon && <span className="text-text-brand/40">{item.icon}</span>}
              <span className="text-lg font-black text-text-brand truncate">{item.value}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Grid: Sections + Sidebar */}
      <div className="grid grid-cols-12 gap-8">
        <div className={cn("space-y-8", sidebar ? "col-span-8" : "col-span-12")}>
          {sections.map(section => (
            <div key={section.id} id={section.id} className="scroll-mt-24">
              <h2 className="text-xs font-black uppercase tracking-[0.3em] text-text-secondary mb-4 flex items-center gap-3">
                <span className="w-6 h-[1px] bg-border-primary" /> {section.title}
              </h2>
              <Card className="border-border-primary bg-surface-primary shadow-sm overflow-hidden p-0">
                {section.content}
              </Card>
            </div>
          ))}
        </div>

        {sidebar && (
          <aside className="col-span-4 space-y-6">
            {sidebar}
          </aside>
        )}
      </div>
    </div>
  );
}
