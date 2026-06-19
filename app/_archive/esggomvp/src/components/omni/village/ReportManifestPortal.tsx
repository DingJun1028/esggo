'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Sparkles,
    Zap,
    ArrowRight,
    BookOpen,
    ShieldCheck,
    Lock,
    Loader2,
    ScrollText,
    History,
    ExternalLink
} from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { reportManifestEngine } from '@/core/manifest_report';
import { IReportManifest } from '@/core/omni-types';
import { VILLAGE_KNOWLEDGE } from '@/core/village-knowledge';
import { toast } from 'sonner';

interface Props {
    learnedUuids: string[];
}

/**
 * 🏛️ ReportManifestPortal - 報告顯化門戶
 * 實現「三重封印：顯化 (Manifestation)」的聚合入口。
 */
export const ReportManifestPortal: React.FC<Props> = ({ learnedUuids }) => {
    const [isManifesting, setIsManifesting] = useState(false);
    const [manifestedReport, setManifestedReport] = useState<IReportManifest | null>(null);
    const [showHistory, setShowHistory] = useState(false);

    // 1. 分析高度學習領域
    const eLearned = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'E' && learnedUuids.includes(k.uuid));
    const sLearned = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'S' && learnedUuids.includes(k.uuid));
    const gLearned = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'G' && learnedUuids.includes(k.uuid));

    const domains = [
        { id: 'E', label: '環境 (E)', count: eLearned.length, total: 8, color: 'emerald' },
        { id: 'S', label: '社會 (S)', count: sLearned.length, total: 8, color: 'blue' },
        { id: 'G', label: '治理 (G)', count: gLearned.length, total: 8, color: 'amber' },
    ];

    // 2. 執行顯化程序
    const handleManifest = async (domain: 'E' | 'S' | 'G') => {
        const atomIds = (domain === 'E' ? eLearned : domain === 'S' ? sLearned : gLearned).map(k => k.uuid);

        if (atomIds.length < 3) {
            toast.error('能量不足', { description: `該領域需至少解鎖 3 項知識點才能進行顯化 (目前: ${atomIds.length})。` });
            return;
        }

        setIsManifesting(true);
        try {
            const report = await reportManifestEngine.manifest({
                domain,
                atomUuids: atomIds,
                standards: ['GRI', 'SASB']
            });
            setManifestedReport(report);
            toast.success('三重封印：顯化完成', {
                description: `${domain} 領域典範報告已生成並鎖定為永恆資產。`,
                icon: <ScrollText className="text-amber-400" />
            });
        } catch (error) {
            toast.error('顯化程序中斷', { description: '系統熵值過高，請稍後重試。' });
        } finally {
            setIsManifesting(false);
        }
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                    <Sparkles className="text-amber-400" size={18} />
                    <h2 className="text-xl font-black italic text-white tracking-tighter">顯化聖殿</h2>
                    <span className="text-[10px] font-black uppercase text-amber-500/50 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">Seal 3: Manifestation</span>
                </div>
                <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/80 transition-all"
                >
                    <History size={18} />
                </button>
            </div>

            {/* 顯化卡片陣列 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {domains.map(d => (
                    <LiquidGlassContainer
                        key={d.id}
                        glowColor={d.color as any}
                        className={`transition-all duration-500 ${d.count >= 3 ? 'opacity-100' : 'opacity-40 grayscale-[0.5]'}`}
                    >
                        <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-2xl bg-${d.color}-500/10 text-${d.color}-400 border border-${d.color}-500/20`}>
                                    <FileText size={20} />
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">{d.label}</p>
                                    <div className="text-xl font-black italic text-white">{Math.round((d.count / d.total) * 100)}%</div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold text-sm text-white/90">典範報告顯化</h3>
                                <p className="text-[10px] text-white/40 mt-1 leading-relaxed">
                                    將 ${d.count} 項核心 ${d.id} 知識聚合，生成符合國際標準的永續對策書。
                                </p>
                            </div>

                            {/* Progress bar */}
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${(d.count / 3) * 100}%` }}
                                    className={`h-full max-w-full bg-${d.color}-400 shadow-[0_0_10px_rgba(255,255,255,0.2)]`}
                                />
                            </div>

                            <button
                                onClick={() => handleManifest(d.id as any)}
                                disabled={isManifesting || d.count < 3}
                                className={`w-full py-3 rounded-xl font-black italic text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${d.count >= 3
                                        ? `bg-white text-slate-900 shadow-xl shadow-${d.color}-500/10 hover:scale-[1.02]`
                                        : 'bg-white/5 text-white/20 cursor-not-allowed'
                                    }`}
                            >
                                {isManifesting ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                                {d.count >= 3 ? '啟動顯化程序' : `能量不足 (需 3 點)`}
                            </button>
                        </div>
                    </LiquidGlassContainer>
                ))}
            </div>

            {/* 報告預覽/結果區 */}
            <AnimatePresence>
                {manifestedReport && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-full mt-4"
                    >
                        <LiquidGlassContainer glowColor="amber" intensity="high" className="border-amber-500/30 overflow-hidden bg-slate-950/80">
                            <div className="flex flex-col gap-6 p-6">
                                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                                            <ShieldCheck size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-white italic">永恆資產：${manifestedReport.reportId}</h3>
                                            <p className="text-[10px] text-amber-500/60 font-mono">MANIFESTED ON ${new Date(manifestedReport.manifestDate).toLocaleString()}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {manifestedReport.standards.map(idx => (
                                            <span key={idx} className="text-[9px] px-2 py-1 rounded bg-white/10 text-white/60 font-mono">{idx}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/5 border border-white/5">
                                    <div className="flex items-center gap-2 mb-3">
                                        <ScrollText size={14} className="text-amber-400/60" />
                                        <span className="text-[9px] font-black uppercase tracking-widest text-white/30">報告提要草稿 (Jules Draft)</span>
                                    </div>
                                    <div className="text-sm text-slate-300 leading-relaxed font-['Outfit'] whitespace-pre-wrap italic">
                                        {manifestedReport.generatedDraft}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4 text-[10px] text-white/30">
                                        <span className="flex items-center gap-1"><Lock size={10} /> Hash Lock Active</span>
                                        <span className="flex items-center gap-1"><Zap size={10} /> 職能屬性已增強</span>
                                    </div>
                                    <button
                                        onClick={() => setManifestedReport(null)}
                                        className="text-[10px] font-black text-white px-4 py-2 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 transition-all flex items-center gap-2"
                                    >
                                        存入永恆宮殿 <ArrowRight size={14} />
                                    </button>
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
