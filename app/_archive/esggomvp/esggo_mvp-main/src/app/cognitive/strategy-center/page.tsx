'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Zap,
    Brain,
    Target,
    Lightbulb,
    Sparkles,
    BarChart4,
    ShieldCheck,
    TrendingUp,
    Cpu,
    History,
    RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import { OmniBase } from '@/core/OmniBase';
import ServiceJourney from '@/components/ServiceJourney';

/**
 * 🧠 Cognitive 1.2: AI Strategy Center (Reinforced)
 * Strategic ESG decision matrix powered by AI.
 * Incorporates OmniBase v2 (Succession, Sustainability, Bridging).
 */
export default function AIStrategyCenterPage() {
    const { locale, t } = useLanguage();
    const [activeStrategy, setActiveStrategy] = useState(0);
    const [sustainabilityData, setSustainabilityData] = useState<any>(null);

    const strategies = [
        {
            id: 'S-001',
            title: locale === 'zh-TW' ? '去碳化 Alpha' : 'Decarbonization Alpha',
            impact: 'High',
            effort: 'Medium',
            status: 'Optimal',
            icon: <Zap />,
            payload: { type: 'Environmental', target: 'NetZero' }
        },
        {
            id: 'S-002',
            title: locale === 'zh-TW' ? '循環轉型' : 'Circular Transition',
            impact: 'Medium',
            effort: 'Low',
            status: 'Ready',
            icon: <Cpu />,
            payload: { type: 'Economy', target: 'Circular' }
        },
        {
            id: 'S-003',
            title: locale === 'zh-TW' ? '共融共振' : 'DEI Resonance',
            impact: 'Medium',
            effort: 'Low',
            status: 'Active',
            icon: <Brain />,
            payload: { type: 'Social', target: 'Equity' }
        },
        {
            id: 'S-004',
            title: locale === 'zh-TW' ? '治理誠信' : 'Governance Integrity',
            impact: 'Critical',
            effort: 'Medium',
            status: 'Locked',
            icon: <ShieldCheck />,
            payload: { type: 'Governance', target: 'Transparency' }
        },
    ];

    useEffect(() => {
        // Mocking an OmniAtom for sustainability calculation
        const strategyAtom: any = {
            uuid: strategies[activeStrategy].id,
            evidence: { transparent: true, traceable: true },
            payload: strategies[activeStrategy].payload,
            heritage: { version: 5 }
        };
        const sustainability = OmniBase.calculateSustainability(90, 85, 95);
        setSustainabilityData(sustainability.longevityScore);
    }, [activeStrategy]);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 text-[var(--foreground)]">
            <PageHeader
                title={locale === 'zh-TW' ? "AI 策略中心" : "AI Strategy Center"}
                subtitle={locale === 'zh-TW' ? "執行 AI 驅動的數據洞察與決策邏輯。透過「承上啟下」與「深貫廣通」優化永續路徑。" : "Execute AI-driven data insights. Optimize sustainability roadmaps with Deep-Breadth scanning and Causal Bridging."}
                category={locale === 'zh-TW' ? "認知智能服務" : "Cognitive Intel Service"}
            />

            {/* 🗺️ User Journey Alignment: Trackable Phase */}
            <ServiceJourney currentStepId="trackable" />

            {/* 🚀 Strategy Matrix Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <div className="lg:col-span-3 p-6 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-[var(--primary)]/10 via-[var(--background)] to-[var(--accent)]/5 border border-[var(--primary)]/20 liquid-glass relative overflow-hidden min-h-[400px] md:h-[500px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <Target size={300} className="text-[var(--primary)]" />
                    </div>

                    <div className="relative z-10 grid grid-cols-2 grid-rows-2 h-full gap-4">
                        <div className="border-r border-b border-[var(--card-border)] flex flex-col items-center justify-center relative group">
                            <span className="absolute top-2 left-2 text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-wider">High Impact / High Effort</span>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="size-16 bg-[var(--primary)]/20 border border-[var(--primary)]/50 rounded-full flex items-center justify-center text-[var(--primary)] shadow-[var(--primary)]/20 shadow-lg group-hover:shadow-[var(--primary)]/40 transition-shadow">
                                <Target size={24} />
                            </motion.div>
                            <span className="mt-4 text-[10px] font-bold text-[var(--sidebar-text)] uppercase">{locale === 'zh-TW' ? '戰略高地' : 'Strategic Peak'}</span>
                        </div>

                        <div className="border-b border-[var(--card-border)] flex flex-col items-center justify-center relative group">
                            <span className="absolute top-2 left-2 text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-wider">High Impact / Low Effort</span>
                            <div className="size-24 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center text-emerald-400 relative shadow-emerald-500/20 shadow-xl group-hover:scale-105 transition-transform">
                                <Zap size={32} />
                                <span className="absolute -bottom-8 text-[10px] font-black text-emerald-400 uppercase tracking-widest whitespace-nowrap animate-pulse">Alpha Opportunity</span>
                            </div>
                        </div>

                        <div className="border-r border-[var(--card-border)] flex items-center justify-center relative">
                            <span className="absolute top-2 left-2 text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-wider">Low Impact / High Effort</span>
                            <div className="text-[10px] text-[var(--sidebar-text)] font-bold uppercase tracking-widest italic opacity-40">Avoid Phase</div>
                        </div>

                        <div className="flex flex-col items-center justify-center relative group">
                            <span className="absolute top-2 left-2 text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-wider">Low Impact / Low Effort</span>
                            <div className="size-12 bg-blue-500/10 border border-blue-500/30 rounded-full flex items-center justify-center text-blue-400/50 group-hover:bg-blue-500/20 transition-colors">
                                <BarChart4 size={18} />
                            </div>
                            <span className="mt-2 text-[9px] font-bold text-[var(--sidebar-text)] uppercase">Incremental</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                        <Lightbulb size={16} className="text-amber-400" /> AI Advice Hub
                    </h4>
                    <div className="space-y-4">
                        {strategies.map((s, i) => (
                            <motion.div
                                key={s.title}
                                whileHover={{ x: 5 }}
                                onClick={() => setActiveStrategy(i)}
                                className={`p-6 rounded-3xl border transition-all cursor-pointer relative overflow-hidden ${activeStrategy === i ? 'bg-[var(--primary)]/10 border-[var(--primary)]/40 shadow-xl' : 'bg-[var(--card-bg)] border-[var(--card-border)] opacity-60 hover:opacity-100'}`}
                            >
                                {activeStrategy === i && (
                                    <div className="absolute top-0 right-0 w-2 h-full bg-[var(--primary)]" />
                                )}
                                <div className="flex justify-between items-center mb-4">
                                    <div className={`p-2 rounded-lg ${activeStrategy === i ? 'bg-[var(--primary)] text-[var(--background)] shadow-[var(--primary)]/50 shadow-md' : 'bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-text)]'}`}>
                                        {s.icon}
                                    </div>
                                    <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${activeStrategy === i ? 'bg-[var(--primary)]/20 text-[var(--primary)]' : 'bg-[var(--sidebar-hover-bg)] text-[var(--sidebar-text)]'}`}>
                                        {s.status}
                                    </span>
                                </div>
                                <h5 className="text-xs font-black text-[var(--foreground)] uppercase tracking-tight mb-1">{s.title}</h5>
                                <p className="text-[9px] text-[var(--sidebar-text)] font-bold uppercase tracking-widest">Impact: {s.impact} | Effort: {s.effort}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 🔮 Predictive Insights & OmniBase Integration */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                <div className="xl:col-span-2 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass group shadow-lg">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div className="flex-1 space-y-4">
                            <div className="flex items-center justify-center md:justify-start gap-3">
                                <Sparkles size={20} className="text-amber-400" />
                                <h4 className="text-xl font-black italic uppercase tracking-tighter">Predictive Pathfinding</h4>
                            </div>

                            {/* 🌐 5W1H Grand Unification Context Row */}
                            <div className="flex flex-wrap gap-2 py-2">
                                {[
                                    { k: 'Who', v: 'Identity#000', l: '人' },
                                    { k: 'What', v: 'Strategy_Peak', l: '物' },
                                    { k: 'When', v: '2026-Q4', l: '時' },
                                    { k: 'Where', v: 'Decarbon_Hub', l: '地' },
                                    { k: 'Why', v: 'Resilience_Alpha', l: '由' },
                                    { k: 'How', v: 'OmniLogic_v12', l: '如何' }
                                ].map(it => (
                                    <div key={it.k} className="px-2 py-0.5 rounded-md bg-[var(--background)] border border-[var(--primary)]/20 flex gap-2 items-center">
                                        <span className="text-[7px] font-black text-[var(--primary)]">{locale === 'zh-TW' ? it.l : it.k}</span>
                                        <span className="text-[8px] font-bold text-[var(--foreground)]">{it.v}</span>
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-[var(--sidebar-text)] leading-loose max-w-xl">
                                {locale === 'zh-TW'
                                    ? `Omni-Sprite 識別出：若在 Q4 將 Scope 2 排放重定向至可再生資產，效率將提升 **15%**。此策略已通過 5T 協議驗證，具備「深貫廣通」特性。`
                                    : `Dr. Thoth's AI has identified a **15% efficiency gain** if Scope 2 emissions are redirected to renewable assets by Q4. Synchronized with 5T verified local laws.`}
                            </p>
                            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-[var(--primary)] rounded-full animate-ping" />
                                    <span className="text-[10px] font-bold text-[var(--primary)]">Live AI Synthesis</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="text-emerald-400" size={14} />
                                    <span className="text-[10px] font-bold text-emerald-400 uppercase">GRI Alignment: 98%</span>
                                </div>
                            </div>
                        </div>
                        <div className="shrink-0 flex flex-col sm:flex-row flex-wrap justify-center gap-4 w-full md:w-auto">
                            <button className="px-8 py-3 bg-[var(--primary)] text-[var(--background)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-lg shadow-[var(--primary)]/30">
                                {locale === 'zh-TW' ? '執行模擬' : 'Execute Simulation'}
                            </button>
                            <button className="px-8 py-3 bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-[var(--sidebar-hover-bg)] transition-all">
                                {locale === 'zh-TW' ? '查看藍圖' : 'View Roadmap'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* OmniBase Sustainability Live Card */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--background)] border border-[var(--primary)]/30 liquid-glass shadow-xl relative overflow-hidden">
                    <div className="absolute top-2 right-2 flex gap-1">
                        <div className="size-1 bg-[var(--primary)] rounded-full animate-pulse" />
                        <div className="size-1 bg-[var(--primary)] rounded-full animate-pulse opacity-50" />
                    </div>
                    <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--primary)] mb-6 flex items-center gap-2">
                        <RefreshCw size={14} className="animate-spin-slow" /> Sustainability Meta
                    </h4>

                    {sustainabilityData ? (
                        <div className="space-y-6">
                            <div className="flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-[var(--sidebar-text)] uppercase mb-1">Longevity Score</p>
                                    <p className="text-4xl font-black text-[var(--foreground)] italic">{sustainabilityData.longevityScore.toFixed(1)}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${sustainabilityData.status === 'Everlasting' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-[var(--primary)]/20 text-[var(--primary)]'}`}>
                                        {sustainabilityData.status}
                                    </div>
                                </div>
                            </div>

                            <div className="w-full h-1 bg-[var(--sidebar-hover-bg)] rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${sustainabilityData.longevityScore}%` }}
                                    className="h-full bg-[var(--primary)]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <p className="text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-widest">Impact Horizon</p>
                                    <p className="text-sm font-bold text-[var(--foreground)]">{sustainabilityData.impactHorizon}</p>
                                </div>
                                <div>
                                    <p className="text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-widest">Resilience</p>
                                    <p className="text-sm font-bold text-[var(--primary)]">{sustainabilityData.resilienceRatio}%</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-48 opacity-20">
                            <Cpu size={40} className="animate-pulse" />
                        </div>
                    )}
                </div>
            </div>

            {/* 📊 Strategic Metrics - Succession Logic */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Decision Speed', v: '0.42s', i: <Zap />, c: 'text-[var(--primary)]' },
                    { l: 'Alignment Score', v: '92/100', i: <Target />, c: 'text-emerald-400' },
                    { l: 'Resonance Iteration', v: 'v10.5', i: <History />, c: 'text-blue-400' },
                    { l: 'Uncertainty Hedge', v: '-14%', i: <TrendingUp />, c: 'text-amber-400' }
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.l}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="p-8 rounded-[2.5rem] bg-[var(--card-bg)] border border-[var(--card-border)] text-center group hover:border-[var(--primary)]/30 transition-all shadow-md hover:shadow-xl"
                    >
                        <div className={`mb-4 text-[var(--sidebar-text)] group-hover:${stat.c} transition-colors flex justify-center`}>
                            {stat.i}
                        </div>
                        <p className="text-[9px] font-bold text-[var(--sidebar-text)] uppercase tracking-widest mb-1">{stat.l}</p>
                        <p className="text-2xl font-black text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors italic leading-none">{stat.v}</p>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
