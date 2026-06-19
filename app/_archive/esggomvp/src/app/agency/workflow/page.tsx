'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Zap,
    Workflow,
    Settings,
    Play,
    ShieldCheck,
    Activity,
    ChevronRight,
    Sparkles,
    GitBranch,
    Repeat,
    Cpu,
    Clock
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 🤖 Agency 4.3: Intelligent Workflow
 * Autonomous process optimization and energy saving.
 */
export default function WorkflowPage() {
    const { locale } = useLanguage();
    const [isSyncing, setIsSyncing] = useState(false);

    const flows = [
        { t: '5T Data Verification Chain', steps: 4, status: 'Optimized', impact: '-12% Energy', icon: <ShieldCheck /> },
        { t: 'Autonomous Report Forge', steps: 6, status: 'Active', impact: '-40% Latency', icon: <Repeat /> },
        { t: 'Global Risk Notification', steps: 3, status: 'Pending Sync', impact: 'Zero Ops', icon: <Zap /> },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24 font-inter">
            <PageHeader
                title={locale === 'zh-TW' ? "智能工作流 (Workflow)" : "Intelligent Workflow"}
                subtitle={locale === 'zh-TW' ? "學習自動化業務流程優化，排除流程中的「熵」，實現高效、低碳的數據流轉。" : "Autonomous process optimization. Eliminate entropy and manifest high-efficiency, low-carbon data flows."}
                category="智能代理服務"
            />

            {/* 🌊 Flux Flow Hub */}
            <div className="p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-500/10 via-black to-emerald-500/5 border border-white/10 liquid-glass relative overflow-hidden h-[450px]">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <GitBranch size={300} className="text-white" />
                </div>

                <div className="relative z-10 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start">
                        <div>
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-indigo-400">Process Entropy Level</span>
                            <div className="flex items-baseline gap-2 mt-2">
                                <h2 className="text-6xl font-black italic text-white tracking-tighter">0.14</h2>
                                <span className="text-sm font-bold text-emerald-400 text-shadow-glow">OPTIMAL</span>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="p-4 rounded-2xl bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-all">
                                <Settings size={20} />
                            </button>
                            <button
                                onClick={() => setIsSyncing(true)}
                                className="p-4 rounded-2xl bg-indigo-500 text-black hover:scale-105 transition-all shadow-lg shadow-indigo-500/30"
                            >
                                <Play size={20} />
                            </button>
                        </div>
                    </div>

                    {/* Visual Flow Connector */}
                    <div className="flex-1 w-full flex items-center gap-4 relative py-12">
                        {[...Array(5)].map((_, i) => (
                            <React.Fragment key={i}>
                                <motion.div
                                    key={`node-${i}`}
                                    animate={{ scale: [1, 1.1, 1], opacity: [0.6, 1, 0.6] }}
                                    transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
                                    className="size-16 rounded-3xl bg-white/5 border border-indigo-500/30 flex items-center justify-center text-indigo-400 backdrop-blur-3xl relative"
                                >
                                    <Zap size={24} />
                                    {i === 2 && <div className="absolute -top-1 -right-1 size-3 bg-emerald-400 rounded-full primary-glow" />}
                                </motion.div>
                                {i < 4 && (
                                    <div className="flex-1 h-px bg-gradient-to-r from-indigo-500/40 to-transparent relative overflow-hidden">
                                        <motion.div
                                            initial={{ x: '-100%' }}
                                            animate={{ x: '100%' }}
                                            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                            className="absolute inset-y-0 w-20 bg-gradient-to-r from-transparent via-white to-transparent"
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <div className="flex justify-between items-center pt-8 border-t border-white/5">
                        <div className="flex gap-12">
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase">Flow Velocity</p>
                                <p className="text-sm font-black text-white italic">High-Fid (99Hz)</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-gray-600 uppercase">Operational Tax</p>
                                <p className="text-sm font-black text-emerald-400 italic">0.002%</p>
                            </div>
                        </div>
                        <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.3em]">Omni-Flow Engine v8.5</span>
                    </div>
                </div>
            </div>

            {/* 📊 Automation Nodes */}
            <h3 className="text-sm font-black uppercase tracking-[0.4em] text-gray-600 px-4">Autonomous Chains</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {flows.map((f, i) => (
                    <motion.div
                        key={f.t}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 rounded-[3rem] bg-white/5 border border-white/5 group hover:border-indigo-500/30 transition-all cursor-pointer flex flex-col justify-between h-72"
                    >
                        <div>
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 rounded-2xl bg-white/5 text-gray-500 group-hover:text-indigo-400 transition-colors">
                                    {f.icon}
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 bg-emerald-400/10 px-3 py-1 rounded-full uppercase tracking-widest">{f.status}</span>
                            </div>
                            <h4 className="text-lg font-bold text-white uppercase tracking-tighter leading-tight">{f.t}</h4>
                            <p className="text-[9px] text-gray-500 uppercase font-black mt-2 tracking-widest">{f.steps} Nodes Connected</p>
                        </div>
                        <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">{f.impact}</p>
                    </motion.div>
                ))}
            </div>

            {/* 🔮 Workflow Intelligence Delta */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                    { l: 'Auto-Optimized', v: '84%', i: <ShieldCheck /> },
                    { l: 'Sync Latency', v: '< 5ms', i: <Cpu /> },
                    { l: 'Energy Recovery', v: 'Active', i: <Activity /> },
                    { l: 'Alpha Pulse', v: 'High', i: <Sparkles /> }
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
