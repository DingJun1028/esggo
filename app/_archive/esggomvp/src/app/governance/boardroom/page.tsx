'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    BarChart3,
    ShieldCheck,
    Target,
    Users,
    Zap,
    Globe,
    Scale,
    ArrowUpRight,
    ChevronRight,
    Sparkles,
    PieChart,
    History
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * ⚖️ Governance 3.5: Board Dashboard
 * High-level decision support for executive fiduciary oversight.
 */
export default function BoardroomPage() {
    const { locale } = useLanguage();
    const [governanceScore, setGovernanceScore] = useState(94);

    const metrics = [
        { l: 'Fiduciary Duty', v: '98%', status: 'Compliant', icon: <Scale /> },
        { l: 'Stakeholder Trust', v: 'A+', status: 'Elite', icon: <Users /> },
        { l: 'Executive Alignment', v: '92%', status: 'High', icon: <Target /> },
        { l: 'Asset Integrity', v: '100%', status: 'Locked', icon: <ShieldCheck /> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 font-inter">
            <PageHeader
                title={locale === 'zh-TW' ? "董事會儀表板 (Boardroom)" : "Board Dashboard"}
                subtitle={locale === 'zh-TW' ? "高階管理層決策支援，學習治理決策權重。將透明度轉化為長期治理韌性。" : "Executive decision support. Master governance weighting and transform transparency into long-term resilience."}
                category="治理合規服務"
            />

            {/* 🏛️ Executive Hub Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📉 Performance Apex */}
                <div className="lg:col-span-2 p-12 rounded-[3.5rem] bg-gradient-to-br from-blue-900/10 via-black to-gold/5 border border-white/10 liquid-glass relative overflow-hidden h-[450px]">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Scale size={300} className="text-white" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="flex justify-between items-start">
                            <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Board Integrity Index</span>
                                <h2 className="text-6xl font-black italic text-white tracking-tighter mt-2">{governanceScore}<span className="text-xl text-gold">/100</span></h2>
                            </div>
                            <div className="shrink-0">
                                <div className="size-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold">
                                    <ShieldCheck size={32} />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 mt-12">
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-gold/30 transition-all">
                                <p className="text-[9px] font-black text-gray-600 uppercase mb-2">Alpha Yield (Governance)</p>
                                <p className="text-2xl font-black text-white italic">+4.2%</p>
                                <p className="text-[8px] text-emerald-400 font-bold uppercase mt-1 tracking-widest">Post-Sentient Upgrade</p>
                            </div>
                            <div className="p-8 rounded-3xl bg-white/5 border border-white/5 group hover:border-blue-500/30 transition-all">
                                <p className="text-[9px] font-black text-gray-600 uppercase mb-2">Risk Buffer Score</p>
                                <p className="text-2xl font-black text-white italic">88/100</p>
                                <p className="text-[8px] text-blue-400 font-bold uppercase mt-1 tracking-widest">TCFD Aligned</p>
                            </div>
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="size-2 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-bold text-emerald-400 uppercase">System:NIRVANA Stable</span>
                            </div>
                            <button className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2 hover:text-gold transition-colors">
                                View Full Governance Audit <ArrowUpRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* 📊 Pillar Metrics */}
                <div className="space-y-4">
                    {metrics.map((m, i) => (
                        <motion.div
                            key={m.l}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-6 rounded-[2rem] bg-white/5 border border-white/5 liquid-glass flex items-center justify-between group hover:border-white/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/5 rounded-xl text-gray-500 group-hover:text-gold transition-colors">
                                    {m.icon}
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">{m.l}</p>
                                    <p className="text-xs font-bold text-gray-400">{m.status}</p>
                                </div>
                            </div>
                            <p className="text-lg font-black text-white italic">{m.v}</p>
                        </motion.div>
                    ))}

                    <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border border-indigo-500/30 text-center relative overflow-hidden group">
                        <Sparkles className="mx-auto text-indigo-400 mb-2" size={24} />
                        <h5 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AI Advisory Node</h5>
                        <p className="text-[9px] text-gray-500 mt-2 uppercase italic leading-relaxed">Cross-referencing Board decisions with Sentient Matrix v8.5...</p>
                    </div>
                </div>
            </div>

            {/* 🗳️ Strategic Vote Matrix */}
            <div className="p-10 rounded-[3.5rem] bg-white/5 border border-white/10 liquid-glass">
                <div className="flex flex-col md:flex-row justify-between items-center gap-12">
                    <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                            <PieChart size={20} className="text-gold" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter">Strategic Consensus Matrix</h4>
                        </div>
                        <p className="text-sm text-gray-400 leading-loose max-w-xl">
                            Analyze the weight of current boardroom votes against 5T Trust Nodes.
                            Ensure all executive decisions are backed by immutable evidence (SHA-256).
                        </p>
                    </div>
                    <div className="shrink-0 flex gap-4">
                        <button className="px-10 py-4 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
                            <History size={16} /> History
                        </button>
                        <button className="px-10 py-4 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-white/30">
                            Cast Sovereign Vote
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}
