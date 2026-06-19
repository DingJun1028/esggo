'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Activity, ShieldCheck, Cpu, Database, Zap, Lock, Key, Globe, Network, Fingerprint, Search } from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 🛡️ Agency 1.4: Resonance Protocol Hub
 * Multi-Agent Synchronization and Trust Handshake Dashboard.
 */
export default function AgencyResonancePage() {
    const { locale } = useLanguage();
    const [isResonating, setIsResonating] = useState(false);
    const [syncLevel, setSyncLevel] = useState(34);
    const [activeLogs, setActiveLogs] = useState<{ id: number; agent: string; msg: string; time: string; type: 'auth' | 'data' | 'verify' }[]>([]);

    const baseLogs = [
        { id: 1, agent: 'Dr. Thoth', msg: 'Initiated 5T Truth Verification Protocol...', time: '09:41:12', type: 'verify' as const },
        { id: 2, agent: 'Data Sentinel', msg: 'Hash Lock acquired on Scope 3 batch #8912', time: '09:42:05', type: 'auth' as const },
        { id: 3, agent: 'Omni-Sprite', msg: 'Routing verified assets to Knowledge Vault', time: '09:42:33', type: 'data' as const },
    ];

    useEffect(() => {
        setActiveLogs(baseLogs);
    }, []);

    const triggerResonance = () => {
        setIsResonating(true);
        let currentSync = 34;

        // Simulate a complex synchronization handshake process
        const interval = setInterval(() => {
            currentSync += Math.floor(Math.random() * 8) + 2;
            if (currentSync >= 100) {
                currentSync = 100;
                clearInterval(interval);
                setTimeout(() => setIsResonating(false), 2000);
            }
            setSyncLevel(currentSync);

            // Add simulated log entries
            if (currentSync === 50) addLog('JunAiKey', 'Forging new skill token for User #401', 'data');
            if (currentSync === 75) addLog('Dr. Thoth', 'Resonance Field stabilized at 1.5C Baseline', 'verify');
            if (currentSync === 95) addLog('System Core', 'Global Entanglement Achieved = TRUE', 'auth');

        }, 400);
    };

    const addLog = (agent: string, msg: string, type: 'auth' | 'data' | 'verify') => {
        setActiveLogs(prev => {
            const newLog = { id: Date.now(), agent, msg, time: new Date().toLocaleTimeString('en-US', { hour12: false }), type };
            return [newLog, ...prev].slice(0, 8);
        });
    };

    const agents = [
        { id: 'thoth', name: 'Dr. Thoth', role: 'Truth Verification', icon: <Cpu />, x: '20%', y: '20%', color: 'var(--primary)' },
        { id: 'sentinel', name: 'Data Sentinel', role: 'Integrity Guardian', icon: <ShieldCheck />, x: '80%', y: '30%', color: 'var(--accent)' },
        { id: 'junaikey', name: 'JunAiKey', role: 'Skill Forge', icon: <Zap />, x: '30%', y: '80%', color: '#10b981' },
        { id: 'omni', name: 'Omni-Sprite', role: 'Global Router', icon: <Network />, x: '70%', y: '75%', color: '#8b5cf6' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 pb-24">
            <PageHeader
                title={locale === 'zh-TW' ? "代理共鳴 (Resonance Protocol)" : "Resonance Protocol Hub"}
                subtitle={locale === 'zh-TW' ? "學習跨系統、跨代理的協作邏輯，將零散的自動化單元融合為全域共鳴的智能系統。" : "Synchronize multi-agent cognitive units into a holistic, zero-trust verified hive mind."}
                category="智能代理服務"
            />

            {/* 🌌 Topology & Sync Controls */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 🕸️ Agent Topology Map */}
                <div className="lg:col-span-2 p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-black border border-[var(--primary)]/30 liquid-glass relative overflow-hidden min-h-[350px] md:min-h-[500px] flex flex-col">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(var(--primary-rgb),0.15)_0%,transparent_70%)]" />

                    <div className="flex justify-between items-center z-10 mb-6">
                        <div>
                            <h3 className="text-xl font-black uppercase tracking-widest text-[var(--foreground)] flex items-center gap-3">
                                <Share2 className="text-[var(--primary)]" />
                                {locale === 'zh-TW' ? '共鳴拓撲圖' : 'Resonance Topology'}
                            </h3>
                            <p className="text-[10px] text-gray-500 uppercase font-bold tracking-[0.2em] mt-1">Live Multi-Agent Mesh</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="px-3 py-1 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-full text-[9px] uppercase font-black text-[var(--primary)] flex items-center gap-2">
                                <span className={`size-2 rounded-full ${isResonating ? 'bg-[var(--accent)] animate-pulse' : 'bg-[var(--primary)]'}`} />
                                {syncLevel}% Synchronized
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full h-full border border-white/5 rounded-[2rem] bg-white/[0.02] overflow-hidden mt-4">
                        {/* Connection Lines (Simulated SVG) */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                            {agents.map((a1, i) =>
                                agents.slice(i + 1).map((a2, j) => (
                                    <motion.line
                                        key={`${a1.id}-${a2.id}`}
                                        x1={a1.x}
                                        y1={a1.y}
                                        x2={a2.x}
                                        y2={a2.y}
                                        stroke={isResonating ? 'var(--accent)' : 'var(--primary)'}
                                        strokeWidth={isResonating ? 2 : 1}
                                        strokeDasharray={isResonating ? "5,5" : "none"}
                                        initial={{ pathLength: 0 }}
                                        animate={{ pathLength: 1 }}
                                        transition={{ duration: 1.5, repeat: isResonating ? Infinity : 0, ease: "linear" }}
                                    />
                                ))
                            )}
                            {/* Central Node Connection */}
                            {agents.map(a => (
                                <motion.line
                                    key={`center-${a.id}`}
                                    x1="50%"
                                    y1="50%"
                                    x2={a.x}
                                    y2={a.y}
                                    stroke="var(--foreground)"
                                    strokeWidth={isResonating ? 3 : 1}
                                    strokeDasharray="4 4"
                                    opacity={0.3}
                                    animate={isResonating ? { strokeDashoffset: [0, -20] } : {}}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                            ))}
                        </svg>

                        {/* Central Core */}
                        <motion.div
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-24 rounded-full bg-black border-2 border-[var(--primary)] shadow-[0_0_50px_rgba(var(--primary-rgb),0.5)] flex items-center justify-center z-20"
                            animate={isResonating ? {
                                scale: [1, 1.2, 1],
                                boxShadow: [
                                    "0 0 50px rgba(var(--primary-rgb),0.5)",
                                    "0 0 100px rgba(var(--accent-rgb),0.8)",
                                    "0 0 50px rgba(var(--primary-rgb),0.5)"
                                ],
                                borderColor: ['var(--primary)', 'var(--accent)', 'var(--primary)']
                            } : {}}
                            transition={{ duration: 2, repeat: Infinity }}
                        >
                            <Globe className={isResonating ? 'text-[var(--accent)] animate-spin-slow' : 'text-[var(--primary)]'} size={40} />
                            <div className="absolute -bottom-8 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.3em] text-[var(--foreground)]">Omni-Core</div>
                        </motion.div>

                        {/* Agent Nodes */}
                        {agents.map((agent, i) => (
                            <motion.div
                                key={agent.id}
                                className="absolute size-16 -ml-8 -mt-8 rounded-2xl bg-black border flex items-center justify-center z-10 cursor-pointer group"
                                style={{
                                    left: agent.x,
                                    top: agent.y,
                                    borderColor: agent.color,
                                    boxShadow: `0 0 20px ${agent.color}40`
                                }}
                                whileHover={{ scale: 1.1, zIndex: 30 }}
                                animate={isResonating ? {
                                    y: [0, -10, 0],
                                    boxShadow: `0 0 40px ${agent.color}80`
                                } : {}}
                                transition={{ duration: 2, delay: i * 0.2, repeat: isResonating ? Infinity : 0 }}
                            >
                                <div className="text-[var(--foreground)] group-hover:text-white transition-colors">
                                    {agent.icon}
                                </div>
                                <div className="absolute top-full mt-3 flex flex-col items-center pointer-events-none">
                                    <span className="text-[10px] font-black uppercase whitespace-nowrap text-[var(--foreground)] bg-black/50 px-2 py-1 rounded backdrop-blur-md">{agent.name}</span>
                                    <span className="text-[8px] font-bold uppercase tracking-widest text-gray-500 mt-1 whitespace-nowrap">{agent.role}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* 🎛️ Control Panel & Status */}
                <div className="space-y-6 flex flex-col">
                    <div className="p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass flex-1 flex flex-col justify-between">
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-widest flex items-center gap-2 mb-6 text-[var(--foreground)]">
                                <Activity size={18} className="text-[var(--primary)]" /> System Resonance
                            </h4>

                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-bold uppercase text-gray-400">
                                    <span>Global Entanglement</span>
                                    <span className="text-[var(--accent)]">{syncLevel}%</span>
                                </div>
                                <div className="h-2 bg-black rounded-full overflow-hidden border border-white/5">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-[var(--primary)] to-[var(--accent)] relative"
                                        animate={{ width: `${syncLevel}%` }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay" />
                                    </motion.div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-8">
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                                        <Lock size={16} className="mx-auto mb-2 text-gray-500" />
                                        <div className="text-[9px] font-black tracking-widest text-gray-500 uppercase mb-1">Hash Lock</div>
                                        <div className="text-sm font-black text-[var(--primary)]">{syncLevel > 50 ? 'SECURE' : 'PENDING'}</div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 text-center">
                                        <Fingerprint size={16} className="mx-auto mb-2 text-gray-500" />
                                        <div className="text-[9px] font-black tracking-widest text-gray-500 uppercase mb-1">5T Verify</div>
                                        <div className="text-sm font-black text-[var(--accent)]">{syncLevel === 100 ? 'PASSED' : 'SCANNING'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={triggerResonance}
                            disabled={isResonating || syncLevel === 100}
                            className={`w-full py-4 mt-8 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all
                                ${isResonating ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)] cursor-wait'
                                    : syncLevel === 100 ? 'bg-[var(--accent)]/10 text-[var(--accent)] border border-[var(--accent)] opacity-50 cursor-not-allowed'
                                        : 'bg-[var(--primary)] text-black border border-transparent shadow-[0_0_30px_rgba(var(--primary-rgb),0.4)] hover:scale-[1.02] active:scale-[0.98]'}`}
                        >
                            {isResonating ? 'Synchronizing Protocol...' : syncLevel === 100 ? 'Resonance Achieved' : 'Initialize Resonance'}
                        </button>
                    </div>
                </div>
            </div>

            {/* 📜 Inter-Agent Data Stream */}
            <div className="p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass">
                <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-6">
                    <h4 className="text-lg font-black uppercase tracking-widest flex items-center gap-3 text-[var(--foreground)]">
                        <Database size={24} className="text-[var(--accent)]" /> Inter-Agent Data Stream
                    </h4>
                    <div className="flex gap-2">
                        <span className="px-3 py-1 rounded bg-black border border-white/10 text-[9px] font-bold text-gray-400 font-mono">Live Feed Active</span>
                        <div className="size-6 rounded bg-black border border-white/10 flex items-center justify-center">
                            <Search size={12} className="text-gray-500" />
                        </div>
                    </div>
                </div>

                <div className="space-y-3 font-mono text-[11px] max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    <AnimatePresence initial={false}>
                        {activeLogs.map((log) => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -20, height: 0 }}
                                animate={{ opacity: 1, x: 0, height: 'auto' }}
                                className="flex items-start gap-4 p-3 rounded-lg bg-black/40 border border-white/5 hover:border-white/10 transition-colors"
                            >
                                <div className="text-gray-500 w-16 shrink-0 pt-0.5">{log.time}</div>
                                <div className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest w-28 text-center shrink-0
                                    ${log.type === 'auth' ? 'bg-[var(--accent)]/20 text-[var(--accent)] border border-[var(--accent)]/30'
                                        : log.type === 'verify' ? 'bg-[var(--primary)]/20 text-[var(--primary)] border border-[var(--primary)]/30'
                                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}
                                `}>
                                    {log.agent}
                                </div>
                                <div className="text-[var(--sidebar-text)] flex-1">{log.msg}</div>
                                <div className="w-8 shrink-0 flex justify-end">
                                    {log.type === 'auth' && <Key size={14} className="text-[var(--accent)] opacity-50" />}
                                    {log.type === 'verify' && <ShieldCheck size={14} className="text-[var(--primary)] opacity-50" />}
                                    {log.type === 'data' && <Network size={14} className="text-emerald-400 opacity-50" />}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255,255,255,0.02);
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.1);
                    border-radius: 4px;
                }
            `}</style>
        </div>
    );
}
