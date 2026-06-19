'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Zap,
    RefreshCcw,
    ArrowRight,
    ShieldCheck,
    TrendingUp,
    Sparkles,
    Cpu,
    Layers,
    ChevronRight,
    Database,
    Globe
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 💎 Excellence 2.4: Sustainability Transformation
 * Guiding the transition from legacy to sentient business models.
 */
export default function TransformationPage() {
    const { locale } = useLanguage();
    const [activePhase, setActivePhase] = useState(0);

    const phases = [
        {
            t: 'Phase 01: Discovery',
            zh: '階段一：發現與稽核',
            desc: 'Identifying toxic legacies and impact debts across the value chain.',
            icon: <Database />
        },
        {
            t: 'Phase 02: Integration',
            zh: '階段二：核心整合',
            desc: 'Embedding 5T protocols into core operational nodes.',
            icon: <Layers />
        },
        {
            t: 'Phase 03: Sovereignty',
            zh: '階段三：主權與資產化',
            desc: 'Manifesting knowledge as immutable assets in the Eternal Palace.',
            icon: <ShieldCheck />
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "永續轉型顧問 (Transformation)" : "Sustainability Transformation"}
                subtitle={locale === 'zh-TW' ? "商業模式重構教學，將 ESG 嵌入核心獲利。引導企業從線性邁向開發性永續循環。" : "Business model reconstruction. Embedding ESG into core profitability. Guiding linear to sentient circularity."}
                category="卓越永續服務"
            />

            {/* 🌪️ Alchemical Transition Roadmap */}
            <div className="p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-r from-emerald-500/10 via-black to-blue-500/10 border border-white/10 liquid-glass relative overflow-hidden min-h-[400px] md:h-[500px]">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />

                <div className="relative z-10 flex flex-col md:flex-row h-full gap-8 md:gap-0">
                    <div className="flex-1 space-y-8 flex flex-col justify-center">
                        <motion.div
                            key={activePhase}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-4"
                        >
                            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl w-fit">
                                {phases[activePhase].icon}
                            </div>
                            <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white">
                                {locale === 'zh-TW' ? phases[activePhase].zh : phases[activePhase].t}
                            </h3>
                            <p className="text-sm text-gray-500 max-w-sm uppercase tracking-widest leading-loose">
                                {phases[activePhase].desc}
                            </p>
                        </motion.div>

                        <div className="flex gap-4">
                            {phases.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActivePhase(i)}
                                    className={`h-1.5 w-16 rounded-full transition-all ${activePhase === i ? 'bg-emerald-400 primary-glow w-24' : 'bg-white/10 hover:bg-white/20'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="flex-1 flex items-center justify-center relative">
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
                            className="size-80 rounded-full border border-dashed border-white/20 flex items-center justify-center"
                        >
                            <div className="size-60 rounded-full border border-dashed border-white/40 flex items-center justify-center">
                                <div className="size-40 rounded-full border border-emerald-500/50 flex items-center justify-center bg-emerald-500/5">
                                    <RefreshCcw size={48} className="text-emerald-400 animate-spin-slow" />
                                </div>
                            </div>
                        </motion.div>
                        {/* Connecting Arrows */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="size-[450px] border border-white/5 rounded-full" />
                            <motion.div
                                animate={{ rotate: -360 }}
                                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                                className="absolute size-full flex items-center justify-center"
                            >
                                <Zap className="text-gold absolute -top-4 left-1/2 -translate-x-1/2" size={24} />
                                <Globe className="text-blue-400 absolute -bottom-4 left-1/2 -translate-x-1/2" size={24} />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 📊 Transformation Matrix Nodes */}
            <h3 className="text-sm font-black uppercase tracking-[0.5em] text-gray-600 mt-12 mb-8">Evolution Vectors</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    { l: 'Revenue Resonance', v: '+22%', d: 'Direct impact on bottom line via 5T optimization.', c: 'text-emerald-400' },
                    { l: 'Supply Elasticity', v: '91/100', d: 'Resilience index across diverse geographical nodes.', c: 'text-blue-400' },
                    { l: 'Knowledge Asset Value', v: '1.4M', d: 'Tokenized valuation of verified ESG expertise.', c: 'text-gold' }
                ].map((node, i) => (
                    <motion.div
                        key={node.l}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[2.5rem] bg-white/5 border border-white/5 group hover:border-emerald-500/20 transition-all flex flex-col justify-between h-64"
                    >
                        <div>
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 group-hover:text-white transition-colors">{node.l}</p>
                            <h4 className={`text-4xl font-black italic tracking-tighter ${node.c}`}>{node.v}</h4>
                        </div>
                        <p className="text-[10px] text-gray-600 leading-loose uppercase italic">{node.d}</p>
                    </motion.div>
                ))}
            </div>

            {/* 🔮 Strategic Sync */}
            <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-white/5 border border-white/10 liquid-glass flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6 md:gap-8">
                <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
                    <div className="p-4 bg-aqua/20 text-aqua rounded-2xl">
                        <Cpu size={32} />
                    </div>
                    <div>
                        <h4 className="text-xl font-bold uppercase tracking-tighter">Sentient Strategy Alignment</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Cross-analyzing current transformation with AI Strategy Center v4.2</p>
                    </div>
                </div>
                <button className="px-10 py-4 bg-aqua text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-aqua/30">
                    Apply Vectors
                </button>
            </div>

        </div>
    );
}
