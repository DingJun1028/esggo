'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dna, Zap, BookOpen, Target, CheckCircle2, ChevronRight, Loader2, Sparkles, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import Link from 'next/link';

interface IGeneticGap {
    id: string;
    indicator: { zh: string; en: string }; // bilingual indicator name
    domain: 'E' | 'S' | 'G';
    severity: 'critical' | 'moderate' | 'low';
    score: number;
    targetScore: number;
    learningModule: {
        title: string;
        path: string;
        type: 'Berkeley' | 'JunAiKey' | 'DrThoth';
        estimatedTime: string;
    };
}

const GENETIC_GAPS: IGeneticGap[] = [
    {
        id: 'scope3-data',
        indicator: { zh: 'Scope 3 供應鏈追蹤', en: 'Scope 3 Supply Chain Tracking' },
        domain: 'E',
        severity: 'critical',
        score: 42,
        targetScore: 90,
        learningModule: { title: 'Carbon Inventory Mastery', path: '/excellence/carbon-inventory', type: 'Berkeley', estimatedTime: '45 min' }
    },
    {
        id: 'board-diversity',
        indicator: { zh: '董事會多元化指數', en: 'Board Diversity Index' },
        domain: 'G',
        severity: 'moderate',
        score: 68,
        targetScore: 85,
        learningModule: { title: 'Governance Excellence', path: '/governance/board', type: 'Berkeley', estimatedTime: '30 min' }
    },
    {
        id: 'community-impact',
        indicator: { zh: '社區影響力評分', en: 'Community Impact Score' },
        domain: 'S',
        severity: 'moderate',
        score: 71,
        targetScore: 88,
        learningModule: { title: 'Social Resonance', path: '/agency/resonance', type: 'JunAiKey', estimatedTime: '20 min' }
    },
    {
        id: 'water-intensity',
        indicator: { zh: '水資源強度指標', en: 'Water Intensity Indicator' },
        domain: 'E',
        severity: 'low',
        score: 79,
        targetScore: 93,
        learningModule: { title: 'Environmental Sentinel', path: '/excellence/impact-repair', type: 'DrThoth', estimatedTime: '25 min' }
    },
    {
        id: 'whistleblower',
        indicator: { zh: '吹哨人保護機制', en: 'Whistleblower Protection' },
        domain: 'G',
        severity: 'critical',
        score: 38,
        targetScore: 95,
        learningModule: { title: 'Ethics & Compliance', path: '/governance/compliance', type: 'Berkeley', estimatedTime: '60 min' }
    },
];

const DOMAIN_COLOR: Record<string, string> = {
    E: 'emerald',
    S: 'blue',
    G: 'purple',
};

const SEVERITY_DATA = {
    critical: { label: '嚴重缺口', en: 'Critical Gap', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/30', pulse: true },
    moderate: { label: '中度缺口', en: 'Moderate Gap', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', pulse: false },
    low: { label: '輕微缺口', en: 'Minor Gap', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/30', pulse: false },
};

const MODULE_BADGE: Record<string, { color: string; label: string }> = {
    Berkeley: { color: 'text-[var(--accent)] bg-[var(--accent)]/10', label: 'Berkeley' },
    JunAiKey: { color: 'text-[var(--primary)] bg-[var(--primary)]/10', label: 'JunAiKey' },
    DrThoth: { color: 'text-purple-400 bg-purple-500/10', label: 'Dr. Thoth' },
};

interface GeneticOptimizerProps {
    healthScore?: number;
    onOptimizationStart?: () => void;
}

export default function GeneticOptimizer({ healthScore = 0, onOptimizationStart }: GeneticOptimizerProps) {
    const { locale } = useLanguage();
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [gaps, setGaps] = useState<IGeneticGap[]>([]);
    const [selectedGap, setSelectedGap] = useState<IGeneticGap | null>(null);
    const [analysisComplete, setAnalysisComplete] = useState(false);
    const [resolvedIds, setResolvedIds] = useState<Set<string>>(new Set());

    const runGeneticAnalysis = async () => {
        setIsAnalyzing(true);
        setGaps([]);
        setAnalysisComplete(false);
        onOptimizationStart?.();

        // Simulate progressive gap discovery
        await new Promise(r => setTimeout(r, 600));
        for (const gap of GENETIC_GAPS) {
            await new Promise(r => setTimeout(r, 300));
            setGaps(prev => [...prev, gap]);
        }
        setAnalysisComplete(true);
        setIsAnalyzing(false);
        // Auto-select first critical gap
        const firstCritical = GENETIC_GAPS.find(g => g.severity === 'critical');
        if (firstCritical) setSelectedGap(firstCritical);
    };

    const markResolved = (id: string) => {
        setResolvedIds(prev => new Set([...prev, id]));
        setSelectedGap(null);
    };

    const criticalCount = gaps.filter(g => g.severity === 'critical' && !resolvedIds.has(g.id)).length;
    const totalGapScore = gaps.reduce((acc, g) => acc + (g.targetScore - g.score), 0);

    return (
        <div className="p-8 rounded-[3rem] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-purple-500/5 border border-[var(--primary)]/20 liquid-glass relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5" />

            {/* Header */}
            <div className="relative z-10 flex items-center gap-3 mb-6">
                <motion.div
                    animate={isAnalyzing ? { rotate: 360 } : { y: [0, -5, 0] }}
                    transition={isAnalyzing ? { duration: 1, repeat: Infinity, ease: 'linear' } : { duration: 3, repeat: Infinity }}
                >
                    <Dna className="text-[var(--primary)] drop-shadow-[0_0_12px_rgba(99,162,176,0.5)]" size={32} />
                </motion.div>
                <div>
                    <h5 className="text-lg font-black italic tracking-tighter uppercase text-[var(--foreground)]">
                        Genetic Optimizer
                    </h5>
                    <p className="text-[9px] text-[var(--sidebar-text)] uppercase tracking-widest">
                        {locale === 'zh-TW' ? '基因缺口智能修復引擎' : 'AI-Powered Gap Repair Engine'}
                    </p>
                </div>
            </div>

            {/* Genome Health Bar */}
            {!analysisComplete && !isAnalyzing && (
                <div className="relative z-10 mb-6">
                    <p className="text-[10px] text-[var(--sidebar-text)] mb-3 leading-relaxed uppercase tracking-[0.1em]">
                        {locale === 'zh-TW'
                            ? 'Dr. Thoth 透過基因序列掃描，識別組織治理中的結構性缺口，並自動推薦精準學習療程。'
                            : 'Dr. Thoth scans governance genome sequences, identifies structural gaps, and prescribes targeted learning modules.'}
                    </p>

                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-[9px] text-[var(--sidebar-text)] uppercase tracking-widest">Genome Integrity</span>
                        <span className="text-sm font-black text-[var(--foreground)]">{healthScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${healthScore}%` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] rounded-full"
                        />
                    </div>
                </div>
            )}

            {/* Analysis Progress */}
            {isAnalyzing && (
                <div className="relative z-10 flex flex-col items-center gap-3 py-4">
                    <Loader2 className="text-[var(--primary)] animate-spin" size={24} />
                    <p className="text-[10px] text-[var(--sidebar-text)] uppercase tracking-widest">
                        {locale === 'zh-TW' ? '正在掃描基因序列...' : 'Scanning genome sequences...'}
                    </p>
                    <div className="w-full space-y-2">
                        {gaps.map(g => (
                            <motion.div
                                key={g.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-[9px] font-mono text-[var(--primary)] flex items-center gap-2"
                            >
                                <div className="w-1.5 h-1.5 bg-[var(--primary)] rounded-full animate-pulse" />
                                {g.indicator[locale === 'zh-TW' ? 'zh' : 'en']} — GAP {g.targetScore - g.score}pts
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Gap List */}
            <AnimatePresence>
                {analysisComplete && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="relative z-10 space-y-2 mb-4"
                    >
                        {criticalCount > 0 && (
                            <div className="flex items-center gap-2 mb-3 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20">
                                <Sparkles size={12} className="text-red-400" />
                                <span className="text-[10px] text-red-400 font-bold uppercase tracking-widest">
                                    {criticalCount} {locale === 'zh-TW' ? '項嚴重缺口需優先修復' : 'critical gaps require immediate attention'}
                                </span>
                            </div>
                        )}
                        {gaps.map((gap, idx) => {
                            const sev = SEVERITY_DATA[gap.severity];
                            const resolved = resolvedIds.has(gap.id);
                            const indicatorLabel = locale === 'zh-TW' ? gap.indicator.zh : gap.indicator.en;
                            return (
                                <motion.button
                                    key={gap.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    onClick={() => !resolved && setSelectedGap(gap)}
                                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center gap-3 ${resolved
                                        ? 'bg-emerald-500/5 border-emerald-500/20 opacity-50 cursor-default'
                                        : selectedGap?.id === gap.id
                                            ? `${sev.bg} ${sev.border} shadow-lg`
                                            : 'bg-white/3 border-white/5 hover:border-white/15'
                                        }`}
                                >
                                    {resolved ? (
                                        <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
                                    ) : sev.pulse ? (
                                        <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse shrink-0" />
                                    ) : (
                                        <div className={`w-2 h-2 rounded-full ${sev.color.replace('text-', 'bg-')} shrink-0`} />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${MODULE_BADGE[gap.learningModule.type].color}`}>
                                                {gap.domain}
                                            </span>
                                            <span className="text-[10px] font-bold text-[var(--foreground)] truncate">{indicatorLabel}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <div className="flex-1 h-1 rounded-full bg-white/5 overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${resolved ? 'bg-emerald-500' : sev.color.replace('text-', 'bg-')}`}
                                                    style={{ width: `${resolved ? 100 : gap.score}%` }}
                                                />
                                            </div>
                                            <span className={`text-[9px] font-mono ${resolved ? 'text-emerald-400' : sev.color}`}>
                                                {resolved ? '✓' : `${gap.score}→${gap.targetScore}`}
                                            </span>
                                        </div>
                                    </div>
                                    {!resolved && <ChevronRight size={12} className="text-[var(--sidebar-text)] shrink-0" />}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Selected Gap Detail → Learning Prescription */}
            <AnimatePresence>
                {selectedGap && !resolvedIds.has(selectedGap.id) && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="relative z-10 p-4 rounded-2xl bg-[var(--primary)]/10 border border-[var(--primary)]/30 overflow-hidden"
                    >
                        <p className="text-[8px] font-black uppercase text-[var(--primary)] tracking-widest mb-1">
                            🔬 {locale === 'zh-TW' ? 'Thoth 學習處方' : 'Thoth Learning Prescription'}
                        </p>
                        <p className="text-xs font-bold text-[var(--foreground)] mb-2">{selectedGap.learningModule.title}</p>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${MODULE_BADGE[selectedGap.learningModule.type].color}`}>
                                {MODULE_BADGE[selectedGap.learningModule.type].label}
                            </span>
                            <span className="text-[9px] text-[var(--sidebar-text)]">⏱ {selectedGap.learningModule.estimatedTime}</span>
                            <span className="text-[9px] text-emerald-400">+{selectedGap.targetScore - selectedGap.score} pts</span>
                        </div>
                        <div className="flex gap-2">
                            <Link
                                href={selectedGap.learningModule.path}
                                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[var(--primary)] text-[var(--background)] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all"
                            >
                                <BookOpen size={11} />
                                {locale === 'zh-TW' ? '開始學習' : 'Start Learning'}
                                <ArrowRight size={11} />
                            </Link>
                            <button
                                onClick={() => markResolved(selectedGap.id)}
                                className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-[10px] font-black hover:bg-emerald-500/20 transition-all uppercase tracking-widest"
                            >
                                ✓ {locale === 'zh-TW' ? '已完成' : 'Done'}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CTA or Done State */}
            <div className="relative z-10 mt-4">
                {!analysisComplete && !isAnalyzing && (
                    <button
                        onClick={runGeneticAnalysis}
                        className="w-full py-4 bg-[var(--primary)] text-[var(--background)] rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-lg shadow-[var(--primary)]/30 flex items-center justify-center gap-2 active:scale-95"
                    >
                        <Zap size={14} />
                        {locale === 'zh-TW' ? '開始基因優化掃描' : 'Begin Genetic Optimization'}
                    </button>
                )}

                {analysisComplete && resolvedIds.size === gaps.filter(g => g.severity !== 'low').length && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl"
                    >
                        <CheckCircle2 className="text-emerald-400 mx-auto mb-2" size={24} />
                        <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                            {locale === 'zh-TW' ? '基因優化完成！知識即資產 ✨' : 'Genome Optimized! Knowledge is Asset ✨'}
                        </p>
                    </motion.div>
                )}

                {analysisComplete && resolvedIds.size < gaps.filter(g => g.severity !== 'low').length && (
                    <div className="flex items-center justify-between text-[9px] text-[var(--sidebar-text)]">
                        <span className="uppercase tracking-widest">
                            {resolvedIds.size}/{gaps.filter(g => g.severity !== 'low').length} {locale === 'zh-TW' ? '缺口已修復' : 'gaps resolved'}
                        </span>
                        <span className="text-[var(--primary)] font-bold">
                            +{totalGapScore}pts {locale === 'zh-TW' ? '潛在提升' : 'potential'}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
}
