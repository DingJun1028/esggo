'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, RefreshCw, AlertTriangle, HeartPulse, Terminal } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

/**
 * 🏥 HealthPortal (系統痊癒門戶)
 * A dedicated interface to monitor system health and trigger "Healing" actions.
 * Part of the [智慧智能團] Smart Intel toolkit.
 */
export const HealthPortal: React.FC = () => {
    const [status, setStatus] = useState<any>(null);
    const [isHealing, setIsHealing] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const fetchStatus = async () => {
        // Simulated health check
        await new Promise(r => setTimeout(r, 800));
        setStatus({
            purity: 99.8,
            latency: '14ms',
            subsystems: [
                { name: 'Redis_Resonance', status: 'Stable', icon: <Zap size={12} /> },
                { name: 'Supabase_Lock', status: 'Trustworthy', icon: <ShieldCheck size={12} /> },
                { name: 'Agent_Collective', status: 'Synchronized', icon: <Activity size={12} /> },
                { name: 'Quantum_Vault', status: 'Sealed', icon: <Terminal size={12} /> },
            ]
        });
    };

    const handleHeal = async () => {
        setIsHealing(true);
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Initiating Global Healing...`]);
        await new Promise(r => setTimeout(r, 1200));
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Prepending nodejs path to resonance session...`]);
        await new Promise(r => setTimeout(r, 800));
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Bypassing PowerShell ExecutionPolicy constraints...`]);
        await new Promise(r => setTimeout(r, 1000));
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] System fully healed. Resonance at 100%.`]);
        setIsHealing(false);
        fetchStatus();
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <LiquidGlassContainer className="p-8 border-cyan-500/20 bg-white/40 max-w-2xl mx-auto shadow-2xl">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                    <div className="size-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-sm shadow-cyan-500/10">
                        <HeartPulse size={24} className={isHealing ? 'animate-pulse' : ''} />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-[#1D1D1F] tracking-tight uppercase">系統痊癒門戶</h2>
                        <p className="text-[10px] text-omni-text-sub font-bold tracking-[0.3em] uppercase opacity-60">Global Healing Portal</p>
                    </div>
                </div>
                <div className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black text-green-600 uppercase tracking-widest">Resonant</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-10">
                <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-omni-text-sub uppercase tracking-widest mb-2">Signal Purity</span>
                    <span className="text-3xl font-black text-[#1D1D1F]">{status?.purity || '--'}%</span>
                </div>
                <div className="p-6 rounded-2xl bg-white/40 border border-black/5 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-omni-text-sub uppercase tracking-widest mb-2">Quantum Latency</span>
                    <span className="text-3xl font-black text-[#1D1D1F]">{status?.latency || '--'}</span>
                </div>
            </div>

            <div className="space-y-3 mb-10">
                <h3 className="text-[10px] font-black text-omni-text-sub uppercase tracking-[0.2em] mb-4">Subsystem Resonance</h3>
                {status?.subsystems.map((sub: any) => (
                    <div key={sub.name} className="flex items-center justify-between p-4 rounded-xl bg-black/5 border border-white/10 group hover:border-cyan-500/30 transition-all">
                        <div className="flex items-center gap-3">
                            <div className="text-cyan-400 opacity-60 group-hover:opacity-100 transition-opacity">
                                {sub.icon}
                            </div>
                            <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wide">{sub.name}</span>
                        </div>
                        <span className="text-[10px] font-black text-cyan-600 uppercase tracking-widest">{sub.status}</span>
                    </div>
                ))}
            </div>

            <div className="bg-black/80 rounded-2xl p-6 font-mono text-[10px] text-green-400 mb-10 h-40 overflow-y-auto custom-scrollbar border border-white/5">
                {logs.length === 0 && <span className="opacity-30">Waiting for resonance pulse...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="mb-1">{log}</div>
                ))}
            </div>

            <button
                onClick={handleHeal}
                disabled={isHealing}
                className="w-full h-14 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl disabled:opacity-50 group overflow-hidden relative"
            >
                <div className={`absolute inset-0 bg-cyan-500 opacity-0 group-hover:opacity-10 transition-opacity ${isHealing ? 'opacity-20' : ''}`} />
                {isHealing ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                <span className="text-xs font-black uppercase tracking-[0.2em]">{isHealing ? 'HEALING SYSTEM...' : 'EXECUTE GLOBAL HEALING'}</span>
            </button>
        </LiquidGlassContainer>
    );
};
