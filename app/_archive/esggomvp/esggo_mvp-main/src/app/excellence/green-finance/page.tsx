'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    CircleDollarSign,
    TrendingUp,
    ShieldCheck,
    Zap,
    Globe,
    BarChart3,
    ArrowUpRight,
    ChevronRight,
    Sparkles,
    Banknote,
    Coins,
    History
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import ServiceJourney from '@/components/ServiceJourney';
import { OmniBase } from '@/core/OmniBase';

/**
 * 💎 Excellence 2.5: Green Finance Assistant (Reinforced)
 * Premium interface for sustainable investment and green capital access.
 * Aligning with User Journey & OmniBase Sustainability Metrics.
 */
export default function GreenFinancePage() {
    const { locale } = useLanguage();
    const [alphaRatio, setAlphaRatio] = useState(1.42);
    const [sustainability, setSustainability] = useState<{
        longevity: number;
        horizon: string;
        potential: number;
    }>({ longevity: 0, horizon: 'N/A', potential: 0 });

    const instruments = [
        { t: locale === 'zh-TW' ? '綠色債券' : 'Green Bonds', v: '$50M Ready', rate: '2.4%', icon: <Banknote /> },
        { t: locale === 'zh-TW' ? '永續貸款' : 'Sustainability Loans', v: '$12M Open', rate: 'LIBOR + 1.2%', icon: <CircleDollarSign /> },
        { t: locale === 'zh-TW' ? '碳信用額度' : 'Carbon Credits', v: '2,400 tCO2e', rate: 'Market: $85/t', icon: <Coins /> },
    ];

    useEffect(() => {
        // Calculate Sustainability using reinforced OmniBase
        const score = OmniBase.calculateSustainability(90, 85, 95);
        setSustainability({
            longevity: score.longevityScore,
            horizon: score.impactHorizon,
            potential: score.evolutionPotential
        });
    }, []);

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 text-[var(--foreground)]">
            <PageHeader
                title={locale === 'zh-TW' ? "綠色融資助手 (Green Finance)" : "Green Finance Assistant"}
                subtitle={locale === 'zh-TW' ? "連結資本市場與綠色金融工具。優化融資結構，實現「永續發展」與 ESG 溢價。" : "Connect with sustainable capital markets. Optimize financing structure and ensure long-term sustainability."}
                category={locale === 'zh-TW' ? "卓越永續服務" : "Excellence S-Service"}
            />

            {/* 🗺️ User Journey Alignment: Tangible Phase */}
            <ServiceJourney currentStepId="tangible" />

            {/* 💰 Capital Flux Hub */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 📉 Finance Performance Wall */}
                <div className="lg:col-span-2 p-8 md:p-12 rounded-[3rem] md:rounded-[3.5rem] bg-gradient-to-br from-amber-500/5 via-[var(--theme-card-bg)] to-emerald-500/10 border border-amber-500/20 liquid-glass relative overflow-hidden min-h-[400px] md:h-[450px] shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <TrendingUp size={300} className="text-amber-500" />
                    </div>

                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-amber-700">Current ESG Alpha Coefficient</p>
                            <motion.h2
                                animate={{ opacity: [1, 0.7, 1] }}
                                transition={{ duration: 3, repeat: Infinity }}
                                className="text-5xl md:text-7xl font-black italic text-[var(--theme-text-main)] tracking-tighter"
                            >
                                {alphaRatio}x
                            </motion.h2>
                            <p className="text-xs text-emerald-700 font-bold mt-2 uppercase">Outperforming Benchmark by 18.2%</p>
                        </div>

                        <div className="flex-1 w-full flex items-end gap-3 mt-12 mb-4">
                            {[30, 45, 60, 40, 90, 75, 100, 85, 95, 110, 80, 120].map((v, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ height: 0 }}
                                    animate={{ height: `${v}%` }}
                                    transition={{ delay: i * 0.05, duration: 1 }}
                                    className="flex-1 bg-gradient-to-t from-amber-400/5 to-amber-400/40 rounded-t-sm shadow-[0_0_10px_rgba(var(--primary-rgb),0.1)]"
                                />
                            ))}
                        </div>

                        <div className="flex justify-between items-center pt-8 border-t border-[var(--card-border)]">
                            <div className="flex gap-8">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-[var(--sidebar-text)] uppercase tracking-widest">Capital Risk</p>
                                    <p className="text-sm font-black text-[var(--foreground)] italic group-hover:text-amber-400">Low (A+)</p>
                                </div>
                                <div className="text-center pl-8 border-l border-[var(--card-border)]">
                                    <p className="text-[9px] font-black text-[var(--sidebar-text)] uppercase tracking-widest">Yield Spread</p>
                                    <p className="text-sm font-black text-[var(--foreground)] italic group-hover:text-amber-400">-42bps</p>
                                </div>
                            </div>
                            <span className="text-[8px] font-black text-[var(--sidebar-text)] uppercase tracking-[0.3em] opacity-40">Omni-Financial Engine v10.5</span>
                        </div>
                    </div>
                </div>

                {/* 🏦 Active Instruments */}
                <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2">
                        <Banknote size={16} className="text-amber-400" /> Market Instruments
                    </h4>
                    <div className="space-y-4">
                        {instruments.map((ins, i) => (
                            <motion.div
                                key={ins.t}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-[2rem] bg-[var(--theme-card-bg)] border border-[var(--theme-glass-border)] group hover:border-amber-500/40 transition-all cursor-pointer shadow-md hover:shadow-lg"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="p-3 bg-amber-500/10 text-amber-600 rounded-2xl group-hover:bg-amber-600 group-hover:text-black transition-all shadow-inner">
                                        {ins.icon}
                                    </div>
                                    <ArrowUpRight size={20} className="text-[var(--theme-text-muted)] group-hover:text-amber-600 transition-colors" />
                                </div>
                                <h5 className="text-[10px] font-black text-[var(--theme-text-muted)] uppercase tracking-widest mb-1">{ins.t}</h5>
                                <p className="text-base font-bold text-[var(--theme-text-main)] uppercase italic">{ins.v}</p>
                                <p className="text-[10px] text-emerald-700 font-bold mt-2">{ins.rate}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

            </div>

            {/* 🔮 Strategic Financing Forecast & Sustainability */}
            <div className="p-10 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />

                {/* 🌐 5W1H Context Header */}
                <div className="flex justify-center gap-4 mb-8 scale-90 md:scale-100">
                    {[
                        { k: 'Who', v: 'Finance_Hub', l: '人' },
                        { k: 'What', v: 'Alpha_Growth', l: '物' },
                        { k: 'When', v: 'Next_Quarter', l: '時' },
                        { k: 'Where', v: 'Capital_Market', l: '地' },
                        { k: 'Why', v: 'Yield_Impact', l: '由' },
                        { k: 'How', v: 'Green_Alpha', l: '如何' }
                    ].map(it => (
                        <div key={it.k} className="px-3 py-1.5 rounded-full bg-[var(--background)] border border-[var(--primary)]/20 flex flex-col items-center min-w-[80px]">
                            <p className="text-[7px] font-black text-[var(--primary)] uppercase">{locale === 'zh-TW' ? it.l : it.k}</p>
                            <p className="text-[9px] font-bold text-[var(--foreground)]">{it.v}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div className="flex items-center gap-3 justify-center md:justify-start">
                            <Sparkles size={20} className="text-amber-400" />
                            <h4 className="text-xl font-black italic uppercase tracking-tighter text-[var(--foreground)]">AI Capital Recommendation</h4>
                        </div>
                        <p className="text-sm text-[var(--sidebar-text)] leading-loose max-w-xl font-medium">
                            {locale === 'zh-TW'
                                ? '完成「供應鏈 5T 審計」後，您可解鎖次期債券發行的 0.5% 利率降幅。正在同步 萬能永續 證據節點...'
                                : 'By completing the Supply Chain 5T Audit in the next 30 days, you can unlock a 0.5% reduction in interest rates for your next sustainable bond issuance.'}
                        </p>
                    </div>
                    <div className="shrink-0 text-center md:text-right border-l border-[var(--card-border)] pl-8">
                        <p className="text-[10px] font-black text-[var(--primary)] uppercase tracking-widest mb-1">Impact Horizon</p>
                        <p className="text-2xl font-black text-[var(--foreground)] italic">{sustainability.horizon}</p>
                        <p className="text-[9px] text-[var(--sidebar-text)] uppercase font-bold mt-1">Sustainability: {sustainability.longevity}/100</p>
                    </div>
                </div>
            </div>

            {/* 📊 Historical Flux */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {[
                    { l: locale === 'zh-TW' ? '已驗證證明' : 'Verified Proofs', v: '94/100', i: <ShieldCheck /> },
                    { l: locale === 'zh-TW' ? '市場同步' : 'Market Sync', v: 'Live', i: <Globe /> },
                    { l: locale === 'zh-TW' ? '資本流速' : 'Capital Velocity', v: 'High', i: <Zap /> },
                    { l: locale === 'zh-TW' ? '資產稀缺性' : 'Asset Scarcity', v: 'Verified', i: <BarChart3 /> }
                ].map(n => (
                    <div key={n.l} className="p-8 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] group hover:border-amber-400/20 transition-all text-center shadow-md hover:shadow-lg">
                        <div className="mb-4 text-[var(--sidebar-text)] group-hover:text-amber-400 transition-colors flex justify-center">
                            {n.i}
                        </div>
                        <p className="text-[9px] font-bold text-[var(--sidebar-text)] uppercase tracking-widest mb-1">{n.l}</p>
                        <p className="text-lg font-black text-[var(--foreground)] italic uppercase">{n.v}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
