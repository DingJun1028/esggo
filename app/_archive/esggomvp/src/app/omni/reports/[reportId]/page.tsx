'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getReportById } from '@/core/dtos/report-schema.dto';
import { getReportSchema } from '@/core/utils/report-schemas';
import { SCHEMA_REGISTRY } from '@/core/schemas';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { ArrowLeft, Download, Share2, History, Edit3, CheckCircle2, Circle, Layers } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import MasterReportView from '@/components/omni/reports/MasterReportView';

// 分類色系
const CATEGORY_GLOW: Record<string, string> = {
    ENV: 'rgba(16,185,129,0.15)',
    SOC: 'rgba(56,189,248,0.15)',
    GOV: 'rgba(167,139,250,0.15)',
};

const FRAMEWORK_BADGES: Array<{ key: 'gri' | 'tcfd' | 'sdg' | 'sasb'; label: string; color: string }> = [
    { key: 'gri', label: 'GRI', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    { key: 'tcfd', label: 'TCFD', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    { key: 'sdg', label: 'SDG', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    { key: 'sasb', label: 'SASB', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
];

export default function ReportDetailPage() {
    const params = useParams();
    const router = useRouter();
    const reportId = params.reportId as string;

    // 從 DTO 取得報告定義
    const report = useMemo(() => getReportById(reportId), [reportId]);
    // 從 utils/report-schemas 取得 DynamicFormEngine 可用的 Schema
    const formSchema = useMemo(() => getReportSchema(reportId), [reportId]);
    // 從 core/schemas 取得框架對應資訊
    const frameworkSchema = SCHEMA_REGISTRY[reportId];

    const displayReport = report || {
        id: reportId,
        name: reportId,
        name_en: 'Unknown Report',
        status: 'Draft' as const,
        version: '1.0.0',
        category: 'ALL' as const,
    };

    const coreContext = {
        uuid: displayReport.id,
        version: displayReport.version,
        timestamp: Date.now(),
        evidence: [],
    };

    const glowColor = CATEGORY_GLOW[displayReport.category ?? 'ALL'] ?? CATEGORY_GLOW.ENV;

    return (
        <div className="min-h-screen bg-[#050510] text-white">
            {/* ── 頂部 Header ── */}
            <header className="px-6 sm:px-10 pt-8 pb-6 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 80% 0%, ${glowColor} 0%, transparent 60%)` }} />

                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative z-10"
                >
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-white/40 hover:text-omni-primary transition-colors text-xs font-black tracking-widest uppercase mb-5 group"
                    >
                        <ArrowLeft size={13} className="group-hover:-translate-x-1 transition-transform" />
                        Reports Center
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <p className="text-[10px] font-mono text-white/25 uppercase tracking-[0.3em] mb-2">
                                {displayReport.category} · {displayReport.id}
                            </p>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter italic">
                                {displayReport.name}
                            </h1>
                            <p className="text-white/35 mt-1 font-mono text-xs uppercase tracking-widest">
                                {(displayReport as any).name_en ?? ''} · v{displayReport.version}
                            </p>
                        </div>

                        <div className="flex gap-3">
                            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <Download size={18} className="text-omni-primary" />
                            </button>
                            <button className="p-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                                <Share2 size={18} className="text-omni-primary" />
                            </button>
                            <Link
                                href={`/omni/reports/${reportId}/edit`}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-omni-primary/90 hover:bg-omni-primary text-black font-black text-xs tracking-widest uppercase transition-all"
                            >
                                <Edit3 size={14} />
                                Edit Forge
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </header>

            {/* ── 主體區域 ── */}
            {reportId === 'rep-master-2026' ? (
                <MasterReportView />
            ) : (
                <div className="px-6 sm:px-10 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ── 左側 / 主體：Schema 章節預覽 ── */}
                    <div className="lg:col-span-2 space-y-6">
                        <LiquidGlassContainer coreContext={coreContext} stitchId="report-schema-viewer">
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-white/5">
                                    <div className="p-2 rounded-lg bg-omni-primary/10 border border-omni-primary/20">
                                        <Layers size={20} className="text-omni-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold">報告章節結構</h2>
                                        <p className="text-[10px] text-white/30 font-mono">Schema-Driven · {formSchema?.sections.length ?? 0} 個章節</p>
                                    </div>
                                </div>

                                {formSchema ? (
                                    <div className="space-y-3">
                                        {formSchema.sections.map((section: any, idx: number) => {
                                            const requiredCount = section.fields.filter((f: any) => f.required).length;
                                            return (
                                                <motion.div
                                                    key={section.id}
                                                    initial={{ opacity: 0, x: -10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.07 }}
                                                    className="flex items-start gap-4 p-4 rounded-xl bg-white/3 border border-white/5 hover:bg-white/5 hover:border-white/10 transition-all group"
                                                >
                                                    <div className="mt-0.5 text-white/20 group-hover:text-omni-primary transition-colors">
                                                        <Circle size={16} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold group-hover:text-white transition-colors truncate">
                                                            {section.title}
                                                        </p>
                                                        <p className="text-[10px] text-white/25 font-mono mt-0.5">
                                                            {section.fields.length} 個欄位 · {requiredCount} 個必填
                                                        </p>
                                                    </div>
                                                    <span className="text-[9px] font-mono text-white/20 flex-shrink-0">
                                                        #{String(idx + 1).padStart(2, '0')}
                                                    </span>
                                                </motion.div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="h-40 flex items-center justify-center border border-dashed border-white/10 rounded-2xl">
                                        <p className="text-white/20 font-mono text-xs">[ 此報告尚未定義 Schema ]</p>
                                    </div>
                                )}

                                {/* 前往編輯 CTA */}
                                <div className="mt-6 pt-4 border-t border-white/5">
                                    <Link
                                        href={`/omni/reports/${reportId}/edit`}
                                        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-omni-primary/10 border border-omni-primary/20 hover:bg-omni-primary/20 text-omni-primary text-xs font-black tracking-widest uppercase transition-all"
                                    >
                                        <Edit3 size={13} />
                                        開啟 Report Forge 編輯器
                                    </Link>
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </div>

                    {/* ── 右側 Sidebar ── */}
                    <aside className="space-y-6">
                        {/* Metadata & Trust */}
                        <LiquidGlassContainer coreContext={coreContext} stitchId="report-meta-sidebar">
                            <div className="space-y-5 p-1">
                                <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-omni-primary border-b border-omni-primary/20 pb-3">
                                    Metadata & Trust
                                </h3>
                                <MetaRow label="Status" value={displayReport.status}
                                    color={displayReport.status === 'Active' ? 'text-emerald-400' : displayReport.status === 'Pending' ? 'text-amber-400' : 'text-white/50'} />
                                <MetaRow label="Category" value={displayReport.category ?? 'N/A'} />
                                <MetaRow label="Version" value={`v${displayReport.version}`} />
                                {(displayReport as any).standardRef && (
                                    <MetaRow label="Standard" value={(displayReport as any).standardRef} color="text-omni-primary/80" />
                                )}
                                {(displayReport as any).completionRate !== undefined && (
                                    <div>
                                        <div className="flex justify-between text-[10px] font-mono mb-1.5">
                                            <span className="text-white/30">完成度</span>
                                            <span className="text-white/60">{(displayReport as any).completionRate}%</span>
                                        </div>
                                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-omni-primary rounded-full"
                                                style={{ width: `${(displayReport as any).completionRate}%` }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex items-center gap-2 pt-1">
                                    <CheckCircle2 size={12} className="text-omni-primary" />
                                    <span className="text-[10px] text-white/40 font-mono">Verified by Jules Karma Engine</span>
                                </div>
                            </div>
                        </LiquidGlassContainer>

                        {/* 框架對應 */}
                        {frameworkSchema && (
                            <LiquidGlassContainer coreContext={coreContext} stitchId="report-framework-mapping">
                                <div className="space-y-4 p-1">
                                    <h3 className="text-[10px] font-black tracking-[0.4em] uppercase text-white/30 border-b border-white/5 pb-3">
                                        Framework Mapping
                                    </h3>
                                    {FRAMEWORK_BADGES.map(badge => {
                                        const refs = frameworkSchema.framework_mapping[badge.key];
                                        if (!refs || refs.length === 0) return null;
                                        return (
                                            <div key={badge.key}>
                                                <p className={`text-[9px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border inline-block ${badge.color} mb-2`}>
                                                    {badge.label}
                                                </p>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {refs.map((ref: string) => (
                                                        <span key={ref} className="text-[9px] font-mono text-white/40 bg-white/5 px-2 py-0.5 rounded border border-white/8">
                                                            {ref}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </LiquidGlassContainer>
                        )}

                        {/* Revision History */}
                        <LiquidGlassContainer coreContext={coreContext} stitchId="report-history">
                            <div className="space-y-4 p-1">
                                <div className="flex items-center gap-2 text-white/30 text-[10px] font-black tracking-widest uppercase border-b border-white/5 pb-3">
                                    <History size={13} />
                                    Revision History
                                </div>
                                <div className="space-y-3 font-mono text-[10px]">
                                    <HistoryItem date="2026-02-28" action="Phase 2 Schema Loaded" />
                                    <HistoryItem date="2026-02-27" action="Phase 1 Skeleton Created" />
                                    <HistoryItem date="2026-02-27" action="UUID Registered" />
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </aside>
                </div>
            )}
        </div>
    );
}

function MetaRow({ label, value, color = 'text-white/60' }: { label: string; value: string; color?: string }) {
    return (
        <div className="flex justify-between items-center text-xs">
            <span className="text-white/25 font-mono">{label}</span>
            <span className={`font-bold ${color}`}>{value}</span>
        </div>
    );
}

function HistoryItem({ date, action }: { date: string; action: string }) {
    return (
        <div className="flex justify-between items-center border-l border-white/10 pl-3 py-1">
            <span className="text-white/20">{date}</span>
            <span className="text-white/50">{action}</span>
        </div>
    );
}
