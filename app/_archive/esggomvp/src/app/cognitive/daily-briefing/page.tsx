'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Zap,
    Newspaper,
    Calendar,
    Clock,
    Share2,
    Bookmark,
    Flame,
    Leaf,
    ShieldCheck,
    ChevronRight,
    TrendingUp,
    Globe,
    Sparkles,
    Link as LinkIcon
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import ServiceJourney from '@/components/ServiceJourney';
import { OmniBase } from '@/core/OmniBase';

/**
 * 🧠 Cognitive 1.3: Daily ESG Briefing (Reinforced)
 * Sentient Paper interface for elite trend intelligence.
 * Incorporates User Journey Alignment & OmniBase Causal Bridging.
 */
export default function DailyBriefingPage() {
    const { locale } = useLanguage();
    const today = new Date().toLocaleDateString(locale === 'zh-TW' ? 'zh-TW' : 'en-US', {
        year: 'numeric', month: 'long', day: 'numeric', weekday: 'long'
    });

    const briefings = [
        {
            id: 'B-101',
            category: 'Environment',
            title: 'Global Carbon Market Peaks at $1T Valuation',
            zh: '全球碳市場估值首度突破 1 兆美元',
            summary: 'Renewable credits surge as EU-CSRD enforcement begins. Dr. Thoth predicts a 15% volatility in the next quarter.',
            zh_summary: '隨著歐盟 CSRD 法規開始執行，再生能源憑證需求激增。Dr. Thoth 預測下季度波動將達 15%。',
            impact: 'Critical',
            icon: <Leaf className="text-emerald-400" />
        },
        {
            id: 'B-102',
            category: 'Governance',
            title: 'AI Ethics Boards Become Mandatory for SaaS',
            zh: 'SaaS 企業強制設立 AI 倫理委員會',
            summary: 'New regulatory framework requires SHA-256 evidence locking for all algorithm decisions.',
            zh_summary: '最新監管框架要求所有演算法決策必須進行 SHA-256 證據鎖定。',
            impact: 'High',
            icon: <ShieldCheck className="text-purple-400" />
        },
        {
            id: 'B-103',
            category: 'Intelligence',
            title: 'Sentient Learning Adoption Hits 40% in ESG Labs',
            zh: 'ESG 實驗室之覺醒學習採用率達 40%',
            summary: 'The shift from passive reporting to active sentient growth is accelerating global net-zero targets.',
            zh_summary: '從被動報告轉向主動覺醒成長的趨勢，正加速全球淨零目標的達成。',
            impact: 'Medium',
            icon: <Zap className="text-amber-400" />
        }
    ];

    // Causal Bridging Logic Example
    const bridge = OmniBase.createBridge('PAST_TREND_2025', 'FUTURE_NETZERO_2030');

    return (
        <div className="max-w-5xl mx-auto space-y-12 pb-24 text-[var(--foreground)]">
            <PageHeader
                title={locale === 'zh-TW' ? "每日 ESG 簡報" : "Daily ESG Briefing"}
                subtitle={locale === 'zh-TW' ? "每日為您精選全球永續發展動態，培養對環境與社會趨勢的直覺能力。" : "Daily curated intelligence for elite sustainability leaders. Sharpen your sentient intuition."}
                category={locale === 'zh-TW' ? "認知智能服務" : "Cognitive Intel Service"}
            />

            {/* 🗺️ User Journey Alignment: Transparent Phase */}
            <ServiceJourney currentStepId="transparent" />

            {/* 📅 Date & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-center text-center md:text-left bg-[var(--card-bg)] border border-[var(--card-border)] p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] liquid-glass gap-6 md:gap-0 shadow-lg">
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <Calendar className="text-amber-400" size={24} />
                    <div>
                        <h3 className="text-lg font-bold text-[var(--foreground)] tracking-widest uppercase italic">{today}</h3>
                        <p className="text-[10px] text-[var(--sidebar-text)] font-bold uppercase tracking-widest">Issue #1,242 | 5T Verified Edition</p>
                    </div>
                </div>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <div className="text-center">
                        <p className="text-[10px] font-black text-emerald-400 uppercase">Trend Score</p>
                        <p className="text-xl font-black text-[var(--foreground)] italic">+14.2%</p>
                    </div>
                    <div className="text-center border-l border-[var(--card-border)] pl-8">
                        <p className="text-[10px] font-black text-amber-400 uppercase">Causal Bridge</p>
                        <p className="text-sm font-black text-[var(--primary)] uppercase tracking-tighter mt-1">{bridge.bridgeId.split('_')[1]}</p>
                    </div>
                </div>
            </div>

            {/* 🌐 5W1H Grand Unification Context Bar */}
            <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
                {[
                    { k: 'Who', v: 'Thoth_Agent', label: '人' },
                    { k: 'What', v: 'Daily_Intel', label: '物' },
                    { k: 'When', v: today, label: '時' },
                    { k: 'Where', v: 'Global_Lattice', label: '地' },
                    { k: 'Why', v: 'Market_Alpha', label: '由' },
                    { k: 'How', v: 'Causal_Bridge', label: '如何' }
                ].map(item => (
                    <div key={item.k} className="flex-1 min-w-[120px] p-3 rounded-2xl bg-[var(--card-bg)] border border-[var(--card-border)] shadow-sm text-center">
                        <p className="text-[8px] font-black uppercase text-[var(--primary)] mb-1">{locale === 'zh-TW' ? item.label : item.k}</p>
                        <p className="text-[10px] font-bold text-[var(--sidebar-text)]">{item.v}</p>
                    </div>
                ))}
            </div>

            {/* 📰 Sentient Paper Feed */}
            <div className="space-y-8">
                {briefings.map((b, i) => (
                    <motion.div
                        key={b.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group relative p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-[var(--card-bg)] border border-[var(--card-border)] hover:border-[var(--primary)]/30 transition-all cursor-pointer overflow-hidden liquid-glass shadow-md hover:shadow-xl"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Newspaper size={150} className="text-[var(--foreground)]" />
                        </div>

                        <div className="flex flex-col md:flex-row gap-6 md:gap-8 relative z-10 text-center md:text-left">
                            <div className="shrink-0 flex justify-center md:justify-start">
                                <div className="size-16 rounded-2xl md:rounded-3xl bg-[var(--sidebar-hover-bg)] border border-[var(--card-border)] flex items-center justify-center text-current group-hover:scale-110 transition-transform">
                                    {b.icon}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--sidebar-text)]">
                                        <span className="text-[var(--primary)] mr-2">#</span>{b.category}
                                    </span>
                                    <div className="flex gap-3">
                                        <Bookmark size={14} className="text-[var(--sidebar-text)] hover:text-amber-400 transition-colors" />
                                        <Share2 size={14} className="text-[var(--sidebar-text)] hover:text-amber-400 transition-colors" />
                                    </div>
                                </div>

                                <h3 className="text-xl md:text-2xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
                                    {locale === 'zh-TW' ? b.zh : b.title}
                                </h3>

                                <p className="text-[var(--sidebar-text)] text-sm leading-relaxed max-w-3xl">
                                    {locale === 'zh-TW' ? b.zh_summary : b.summary}
                                </p>

                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 md:gap-6 pt-4">
                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-amber-400">
                                        <Flame size={12} />
                                        <span>Impact: {b.impact}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[var(--primary)]">
                                        <Clock size={12} />
                                        <span>3 min read</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-[var(--sidebar-text)]">
                                        <LinkIcon size={12} />
                                        <span>{b.id}</span>
                                    </div>
                                    <button className="ml-auto text-xs font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-2 group/btn hover:text-[var(--primary)] transition-colors">
                                        {locale === 'zh-TW' ? '深貫探索' : 'Explore Depth'}
                                        <ChevronRight size={14} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* 🔮 Daily Affirmation - Bridging System */}
            <div className="p-10 rounded-[3rem] bg-gradient-to-br from-amber-400/10 via-[var(--background)] to-[var(--primary)]/10 border border-[var(--card-border)] text-center shadow-xl relative overflow-hidden group">
                <div className="absolute inset-0 bg-grid-pattern opacity-5" />
                <Sparkles className="mx-auto text-amber-400 mb-4 group-hover:scale-110 transition-transform" size={32} />
                <h4 className="text-lg font-bold uppercase tracking-widest mb-2 italic text-[var(--foreground)]">Daily Sentient Resonance</h4>
                <p className="text-[10px] text-[var(--sidebar-text)] max-w-lg mx-auto leading-loose uppercase tracking-[0.2em] font-medium">
                    "Knowledge is only asset when verified. Act with 5T integrity today to expand your global impact lattice."
                </p>
                <div className="mt-6 flex justify-center items-center gap-4">
                    <div className="h-[1px] w-8 bg-[var(--card-border)]" />
                    <p className="text-[8px] font-mono text-[var(--sidebar-text)] opacity-60">
                        Omni-Sprite Intelligence v10.5 / Temporal Anchor: {bridge.anchor.timestamp.split('T')[0]}
                    </p>
                    <div className="h-[1px] w-8 bg-[var(--card-border)]" />
                </div>
            </div>
        </div>
    );
}
