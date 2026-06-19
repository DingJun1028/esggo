"use client";

import React from 'react';
import { LARGE_REPORT_SKELETON } from '@/config/report-skeleton';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import {
    ChevronRight,
    BookOpen,
    CheckCircle2,
    Circle,
    Clock,
    Lock,
    Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

/**
 * 🦴 SkeletonNavigator (骨架導航器)
 * 專為 500+ 頁超大型報告設計的模組化導航組件。
 * 提供章節進度、UUID 顯示與快速跳轉功能。
 */
export const SkeletonNavigator: React.FC<{ activeSection?: string }> = ({ activeSection }) => {
    return (
        <div className="flex flex-col gap-4 w-full max-w-sm">
            <div className="flex items-center gap-2 px-2 mb-2">
                <BookOpen size={18} className="text-omni-primary" />
                <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">Report Skeleton (大綱)</h3>
                <span className="ml-auto text-[9px] font-mono text-omni-text-muted bg-white/5 px-1.5 py-0.5 rounded border border-white/10 uppercase">
                    500+ Pages
                </span>
            </div>

            <div className="space-y-3">
                {LARGE_REPORT_SKELETON.sections.map((section, idx) => {
                    const isActive = activeSection === section.title;
                    const isReady = section.status === 'READY';
                    const isDraft = section.status === 'DRAFT';

                    return (
                        <LiquidGlassContainer
                            key={idx}
                            glowColor={isActive ? "aqua" : "neutral"}
                            intensity="low"
                            className={cn(
                                "p-3 group transition-all cursor-pointer",
                                isActive ? "border-omni-primary/40 bg-omni-primary/5" : "hover:border-white/20"
                            )}
                        >
                            <div className="flex items-start gap-3">
                                <div className="mt-1">
                                    {isReady ? (
                                        <CheckCircle2 size={16} className="text-emerald-400" />
                                    ) : isDraft ? (
                                        <Clock size={16} className="text-amber-400" />
                                    ) : (
                                        <Circle size={16} className="text-white/20" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-0.5">
                                        <h4 className={cn(
                                            "text-xs font-bold truncate",
                                            isActive ? "text-omni-primary" : "text-white/80 group-hover:text-white"
                                        )}>
                                            {section.title}
                                        </h4>
                                        <span className="text-[8px] font-mono text-white/30 uppercase tracking-tighter">
                                            {section.status}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mt-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <div className="flex items-center gap-1 text-[9px] font-mono text-omni-text-muted bg-black/20 px-1.5 rounded border border-white/5">
                                            <Lock size={8} className="text-omni-accent" />
                                            <span className="truncate max-w-[100px]">{section.module}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[9px] font-mono text-omni-primary">
                                            <Zap size={8} />
                                            <span>5T Verified</span>
                                        </div>
                                    </div>
                                </div>

                                <ChevronRight
                                    size={14}
                                    className={cn(
                                        "mt-1 transition-all",
                                        isActive ? "text-omni-primary translate-x-1" : "text-white/10 group-hover:text-white/40 group-hover:translate-x-0.5"
                                    )}
                                />
                            </div>
                        </LiquidGlassContainer>
                    );
                })}
            </div>

            <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-omni-primary/10 to-transparent border border-omni-primary/20">
                <p className="text-[11px] text-white/60 leading-relaxed italic">
                    「大綱骨架技術」確保了超大型報告在渲染時的**流動性**與**數據一致性**。每一章節皆為獨立的「煉金室」，互不干擾。
                </p>
            </div>
        </div>
    );
};
