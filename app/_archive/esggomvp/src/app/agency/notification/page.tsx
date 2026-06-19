'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell,
    Zap,
    ShieldCheck,
    Activity,
    Globe,
    Radio,
    CheckCircle2,
    ChevronRight,
    Sparkles,
    Search,
    History,
    AlertCircle,
    Clock,
    Settings
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 🤖 Agency 4.4: Notification System
 * Personalized resonance capture and resonance feedback.
 */
export default function NotificationPage() {
    const { locale } = useLanguage();
    const [filter, setFilter] = useState('all');

    const notifications = [
        { id: 'N-101', t: '5T Integrity Alert', msg: 'New GRI report hash mismatch detected in Evidence Vault.', time: '2m ago', type: 'critical', icon: <AlertCircle /> },
        { id: 'N-102', t: 'Energy Optimization', msg: 'Workflow engine achieved -14% energy reduction.', time: '1h ago', type: 'success', icon: <Zap /> },
        { id: 'N-103', t: 'Adan Forge Complete', msg: "Sentient agent 'The Auditor' is now online.", time: '4h ago', type: 'info', icon: <CheckCircle2 /> },
        { id: 'N-104', t: 'Consensus Achieved', msg: 'Gnosis node synchronization successful (99.9%).', time: '12h ago', type: 'info', icon: <ShieldCheck /> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 font-inter">
            <PageHeader
                title={locale === 'zh-TW' ? "智能通知系統 (Resonance)" : "Intelligent Notification"}
                subtitle={locale === 'zh-TW' ? "個人化訊息推送，學習行為分析與反饋機制。確保 5T 永續動態在全域共鳴中不被遺漏。" : "Personalized resonance capture. Behavior analysis and feedback loops to ensure no 5T dynamic is missed."}
                category="智能代理服務"
            />

            {/* 📡 Resonance Hub */}
            <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/10 via-black to-blue-500/5 border border-white/10 liquid-glass relative overflow-hidden h-[450px] flex items-center justify-center">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-10" />

                <div className="relative z-10 text-center">
                    <div className="flex justify-center mb-8 relative">
                        <motion.div
                            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                            transition={{ repeat: Infinity, duration: 3 }}
                            className="absolute inset-0 size-40 bg-indigo-500/20 rounded-full primary-glow mx-auto -top-4"
                        />
                        <div className="size-32 bg-indigo-500/10 border border-indigo-500/50 rounded-full flex items-center justify-center text-indigo-400 backdrop-blur-3xl relative">
                            <Radio size={48} className="animate-pulse" />
                        </div>
                    </div>

                    <h3 className="text-4xl font-black italic uppercase tracking-tighter text-white mb-4">Capturing Resonance</h3>
                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.5em] mb-12">Dynamic Feedback Loop: SYNCHRONIZED</p>

                    <div className="flex gap-4 justify-center">
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <div className="size-2 bg-emerald-400 rounded-full primary-glow" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Active Links: 14</span>
                        </div>
                        <div className="px-6 py-3 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-2">
                            <div className="size-2 bg-indigo-500 rounded-full primary-glow" />
                            <span className="text-[9px] font-black text-white uppercase tracking-widest">Signal: Stable</span>
                        </div>
                    </div>
                </div>

                {/* Wave Background */}
                <div className="absolute inset-x-0 bottom-0 h-32 flex items-end justify-center pointer-events-none gap-2 opacity-20">
                    {[...Array(40)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{ height: [`${20 + Math.random() * 40}%`, `${60 + Math.random() * 40}%`, `${20 + Math.random() * 40}%`] }}
                            transition={{ repeat: Infinity, duration: 1.5 + Math.random(), delay: i * 0.05 }}
                            className="flex-1 bg-indigo-400 rounded-t-full"
                        />
                    ))}
                </div>
            </div>

            {/* 📬 Resonance Ledger */}
            <div className="space-y-8">
                <div className="flex justify-between items-center px-4">
                    <div className="flex gap-8">
                        {['all', 'critical', 'system'].map(t => (
                            <button
                                key={t}
                                onClick={() => setFilter(t)}
                                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all ${filter === t ? 'text-white border-b-2 border-indigo-500 pb-1' : 'text-gray-600 hover:text-gray-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </div>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-indigo-400 hover:bg-white/10 transition-all">
                        <Settings size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {notifications.map((n, idx) => (
                        <motion.div
                            key={n.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-8 rounded-[3rem] bg-white/5 border border-white/5 liquid-glass flex flex-col md:flex-row justify-between items-center group hover:border-indigo-500/20 transition-all cursor-pointer"
                        >
                            <div className="flex items-center gap-8 flex-1">
                                <div className={`size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center transition-all ${n.type === 'critical' ? 'text-red-400 group-hover:bg-red-500' : 'text-indigo-400 group-hover:bg-indigo-500'} group-hover:text-black`}>
                                    {n.icon}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="text-[9px] font-black text-indigo-500 uppercase tracking-[0.2em]">{n.id}</span>
                                        <span className="text-[10px] font-bold text-white uppercase italic">{n.t}</span>
                                    </div>
                                    <p className="text-[11px] text-gray-400 mt-1 uppercase leading-relaxed max-w-xl">{n.msg}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-8 mt-6 md:mt-0">
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-gray-600 uppercase mb-1">Captured</p>
                                    <p className="text-xs font-bold text-white uppercase italic">{n.time}</p>
                                </div>
                                <button className="p-3 rounded-xl hover:bg-white/5 text-gray-700 hover:text-white transition-all">
                                    <ChevronRight size={18} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* 📊 Resonance Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Pulse Integrity', v: '99.9%', i: <ShieldCheck /> },
                    { l: 'Response Speed', v: '0.4s', i: <Zap /> },
                    { l: 'User Alignment', v: 'Very High', i: <Activity /> },
                    { l: 'Signal Purity', v: 'Crystal', i: <Sparkles /> }
                ].map(n => (
                    <div key={n.l} className="p-8 rounded-[2rem] bg-white/5 border border-white/5 group hover:border-indigo-500/20 transition-all text-center">
                        <div className="mb-4 text-gray-600 group-hover:text-indigo-400 transition-colors flex justify-center">
                            {n.i}
                        </div>
                        <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mb-1">{n.l}</p>
                        <p className="text-lg font-black text-white italic uppercase">{n.v}</p>
                    </div>
                ))}
            </div>

        </div>
    );
}
