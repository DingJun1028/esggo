'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Activity, Award, ChevronRight, Layers, Target, Coins, TrendingUp, Hexagon, Fingerprint, Flame, Globe, Zap } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 👨‍💼 Cognitive 1.1: Personal ESG Dashboard (Awakened Version)
 * Comprehensive user progress, 5T dimension tracking, and Knowledge Asset vault.
 */
export default function PersonalDashboardPage() {
    const { locale } = useLanguage();
    const [activeTab, setActiveTab] = useState<'overview' | 'assets' | 'history'>('overview');

    const dimensions = [
        { id: 'tangible', label: 'Tangible', val: 92, status: 'Optimal', desc: '物理影響力量化', icon: <Target size={14} /> },
        { id: 'traceable', label: 'Traceable', val: 88, status: 'Verified', desc: '數據溯源完整度', icon: <Fingerprint size={14} /> },
        { id: 'trackable', label: 'Trackable', val: 95, status: 'Live', desc: '生命週期監控', icon: <Activity size={14} /> },
        { id: 'transparent', label: 'Transparent', val: 85, status: 'Clear', desc: '演算法公開度', icon: <Eye size={14} /> },
        { id: 'trustworthy', label: 'Trustworthy', val: 100, status: 'Locked', desc: '不可篡改信任鎖', icon: <ShieldCheck size={14} /> },
    ];

    const assets = [
        { id: 'TKN-001', title: 'Carbon Auditor', xp: 500, time: '2026-02-14', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/30' },
        { id: 'TKN-002', title: 'Supply Chain Tracker', xp: 850, time: '2026-02-21', color: 'from-[var(--primary)]/20 to-transparent', border: 'border-[var(--primary)]/30' },
        { id: 'TKN-003', title: 'Circular Econ Strategist', xp: 1200, time: '2026-02-25', color: 'from-[var(--accent)]/20 to-transparent', border: 'border-[var(--accent)]/30' },
    ];

    const recentActivity = [
        { id: 1, action: 'Forged Asset: Circular Econ Strategist', time: '2 hours ago', type: 'forge' },
        { id: 2, action: 'Completed Training: GRI Reporting Standards', time: '1 day ago', type: 'learn' },
        { id: 3, action: 'Verified 5T Node passing Thoth Validation', time: '3 days ago', type: 'verify' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "個人 ESG 儀表板" : "Personal ESG Dashboard"}
                subtitle={locale === 'zh-TW' ? "學習視覺化自我表現與影響力建模。在此管理您的知識資產與 5T 協議狀態。" : "Visualize personal performance and impact modeling. Manage Knowledge Assets and 5T Protocol status."}
                category="認知智能服務"
            />

            {/* 🏅 Awakening Level & Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 p-8 rounded-[3rem] bg-[var(--background)] border border-[var(--primary)]/30 liquid-glass relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(var(--primary-rgb),0.1)_0%,transparent_60%)] pointer-events-none" />

                    <div className="relative z-10 size-40 md:size-48 shrink-0 rounded-full border-4 border-black shadow-[0_0_0_2px_rgba(var(--primary-rgb),0.5)] bg-gradient-to-br from-[var(--primary)]/20 to-[var(--accent)]/20 flex flex-col items-center justify-center">
                        <Hexagon size={48} className="text-[var(--accent)] opacity-20 absolute" strokeWidth={1} />
                        <span className="text-4xl font-black italic text-[var(--foreground)] tracking-tighter">Lvl. 42</span>
                        <span className="text-[10px] uppercase font-bold text-[var(--primary)] tracking-widest mt-1">Nirvana State</span>

                        {/* Orbiting Elements */}
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute inset-[-10px] border border-dashed border-[var(--primary)]/30 rounded-full" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} className="absolute inset-[-20px] border border-white/5 rounded-full" />
                    </div>

                    <div className="relative z-10 flex-1 w-full text-center md:text-left">
                        <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                            <div className="px-2 py-0.5 rounded text-[9px] font-black uppercase text-black bg-[var(--accent)] tracking-widest flex items-center gap-1">
                                <Flame size={10} /> Omni-Sprite Awakened
                            </div>
                            <span className="text-[10px] text-gray-400 font-mono tracking-widest">USER #001</span>
                        </div>
                        <h3 className="text-3xl font-black text-[var(--foreground)] uppercase tracking-tight mb-4">Architect of Change</h3>

                        <div className="space-y-4 max-w-md mx-auto md:mx-0">
                            <div>
                                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400 mb-1">
                                    <span>Knowledge Asset Index</span>
                                    <span className="text-[var(--primary)]">12,450 XP / 15,000 XP</span>
                                </div>
                                <div className="h-2 bg-black rounded-full overflow-hidden border border-white/10">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '83%' }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)]"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-6 justify-center md:justify-start">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Tokens Forged</span>
                                <span className="text-xl font-black text-[var(--foreground)]">24</span>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest">Global Rank</span>
                                <span className="text-xl font-black text-[var(--accent)]">Top 2%</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-8 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass flex flex-col">
                    <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-[var(--foreground)]">
                        <Activity size={18} className="text-[var(--primary)]" /> Resonant Actions
                    </h4>
                    <div className="flex-1 space-y-4">
                        {recentActivity.map((act) => (
                            <div key={act.id} className="flex gap-3 items-start group">
                                <div className="mt-1">
                                    {act.type === 'forge' ? <Coins size={14} className="text-[var(--accent)] group-hover:scale-110 transition-transform" /> :
                                        act.type === 'learn' ? <Layers size={14} className="text-[var(--primary)] group-hover:scale-110 transition-transform" /> :
                                            <ShieldCheck size={14} className="text-emerald-400 group-hover:scale-110 transition-transform" />}
                                </div>
                                <div>
                                    <p className="text-[11px] font-bold text-[var(--foreground)] leading-tight">{act.action}</p>
                                    <p className="text-[9px] text-gray-400 font-mono mt-0.5">{act.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-4 py-3 rounded-2xl bg-black/5 hover:bg-black/10 text-[var(--foreground)] text-[10px] font-black uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
                        View Full Ledger <ChevronRight size={14} />
                    </button>
                </div>
            </div>

            {/* 🎛️ Navigation Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4 overflow-x-auto custom-scrollbar">
                {[
                    { id: 'overview', label: '5T Dimension Matrix', icon: <Target size={14} /> },
                    { id: 'assets', label: 'Knowledge Assets', icon: <Coins size={14} /> },
                    { id: 'history', label: 'Impact History', icon: <TrendingUp size={14} /> },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-[0.15em] whitespace-nowrap transition-all
                            ${activeTab === tab.id
                                ? 'bg-[var(--primary)] text-black border border-[var(--primary)] shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]'
                                : 'bg-transparent text-gray-500 border border-transparent hover:text-[var(--foreground)] hover:bg-black/5'}`}
                    >
                        {tab.icon} {tab.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {activeTab === 'overview' && (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 lg:grid-cols-5 gap-8"
                    >
                        {/* 🎯 5T Radar (Simulated via Bars for clarity in UI) */}
                        <div className="p-8 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass lg:col-span-2 flex flex-col justify-center">
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-8 text-[var(--foreground)]">
                                <ShieldCheck size={18} className="text-[var(--primary)]" /> 5T Protocol Status
                            </h4>
                            <div className="space-y-6">
                                {dimensions.map((dim, i) => (
                                    <div key={dim.id} className="group">
                                        <div className="flex justify-between items-end mb-2">
                                            <div className="flex items-center gap-2 text-[var(--foreground)]">
                                                {dim.icon}
                                                <span className="text-xs font-black uppercase tracking-widest">{dim.label}</span>
                                                <span className="text-[9px] text-gray-400 font-bold ml-1 hidden sm:inline">({dim.desc})</span>
                                            </div>
                                            <div className="text-right">
                                                <span className="text-[10px] font-black uppercase tracking-widest mr-2 opacity-50">{dim.status}</span>
                                                <span className="text-xs font-black font-mono text-[var(--primary)]">{dim.val}%</span>
                                            </div>
                                        </div>
                                        <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${dim.val}%` }}
                                                transition={{ duration: 1, delay: i * 0.1 }}
                                                className={`h-full rounded-full ${dim.val === 100 ? 'bg-[var(--accent)]' : 'bg-[var(--primary)]'}`}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 🧠 Core Insights */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {[
                                { title: 'Authenticity Matrix', val: 'Fully Aligned', sub: 'Dr. Thoth Verified', icon: <ShieldCheck size={24} className="text-emerald-500" /> },
                                { title: 'Skill Convergence', val: 'High Synergy', sub: '+12% this month', icon: <Layers size={24} className="text-[var(--primary)]" /> },
                                { title: 'Carbon Intuition', val: 'Level A+', sub: 'Equivalent to Lead Auditor', icon: <Globe size={24} className="text-[var(--accent)]" /> },
                                { title: 'Next Milestone', val: 'Omni-Director Phase', sub: 'Requires 2,550 XP', icon: <Target size={24} className="text-purple-500" /> },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.2 + i * 0.1 }}
                                    className="p-8 rounded-[2rem] bg-black border border-white/5 relative overflow-hidden group hover:border-[var(--primary)]/30 transition-all cursor-pointer"
                                >
                                    <div className="mb-4 text-[var(--foreground)]/50 group-hover:scale-110 group-hover:text-[var(--foreground)] transition-all origin-left">
                                        {stat.icon}
                                    </div>
                                    <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.title}</p>
                                    <p className="text-lg font-black text-[var(--foreground)] italic">{stat.val}</p>
                                    <p className="text-[10px] font-mono text-gray-400 mt-2">{stat.sub}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {activeTab === 'assets' && (
                    <motion.div
                        key="assets"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {assets.map((asset, i) => (
                            <motion.div
                                key={asset.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`p-8 rounded-[3rem] bg-gradient-to-br ${asset.color} border ${asset.border} liquid-glass group hover:shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)] transition-all cursor-pointer flex flex-col`}
                            >
                                <div className="flex justify-between items-start mb-6">
                                    <div className="size-12 rounded-2xl bg-black/40 flex items-center justify-center border border-white/10 group-hover:rotate-12 transition-transform">
                                        <Award className="text-[var(--foreground)]" size={24} />
                                    </div>
                                    <span className="px-3 py-1 rounded bg-black/40 border border-white/10 text-[9px] font-mono text-[var(--foreground)] tracking-widest">{asset.id}</span>
                                </div>
                                <h3 className="text-xl font-black text-[var(--foreground)] uppercase leading-tight mb-2">{asset.title}</h3>
                                <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest">Knowledge Asset</p>

                                <div className="mt-8 pt-6 border-t border-black/10 flex justify-between items-center">
                                    <span className="text-lg font-black italic text-[var(--primary)]">+{asset.xp} XP</span>
                                    <span className="text-[9px] font-mono text-gray-400">{asset.time}</span>
                                </div>
                            </motion.div>
                        ))}

                        <div className="p-8 rounded-[3rem] border border-dashed border-gray-300 dark:border-white/20 flex flex-col items-center justify-center text-center hover:bg-black/5 hover:border-[var(--primary)]/50 transition-all cursor-pointer min-h-[250px] group">
                            <div className="size-16 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <Zap className="text-gray-400 group-hover:text-[var(--primary)]" size={24} />
                            </div>
                            <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[var(--foreground)]">Forge New Asset</h4>
                            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase w-2/3">Engage with ESG training modules via JunAiKey</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const Eye = ({ size = 20 }: { size?: number }) => <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>;
