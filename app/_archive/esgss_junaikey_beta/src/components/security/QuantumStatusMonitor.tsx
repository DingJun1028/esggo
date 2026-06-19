import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Activity, Key, Atom } from 'lucide-react';
import { QuantumEncryption } from '@/core/security/QuantumEncryption.js';

/**
 * 🛰️ 量子狀態監測器 (Quantum Status Monitor)
 * --------------------------------------------------
 * [協議] 🔴 Phase 30: 量子糾纏與 PQC 整合
 */

export const QuantumStatusMonitor: React.FC = () => {
    const quantum = QuantumEncryption.getInstance();
    const [status, setStatus] = useState(quantum.getKeyStatus());

    useEffect(() => {
        const interval = setInterval(() => {
            setStatus(quantum.getKeyStatus());
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-5 liquid-glass-minimal rounded-3xl border border-cyan-500/20 bg-cyan-950/10">
            <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-xl text-cyan-400">
                    <ShieldCheck size={20} />
                </div>
                <div>
                    <h4 className="text-sm font-black text-white uppercase tracking-widest">Quantum <span className="text-cyan-400">Security Core</span></h4>
                    <p className="text-[10px] text-cyan-500/60 font-mono tracking-tighter">PQC Lifecycle Integrity</p>
                </div>
            </div>

            <div className="space-y-4">
                {/* Entropy Gauge */}
                <div className="space-y-1.5">
                    <div className="flex justify-between items-end">
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">
                            <Activity size={10} /> System Entropy
                        </span>
                        <span className="text-[10px] font-mono font-bold text-cyan-400">{(status.entropy * 100).toFixed(4)}%</span>
                    </div>
                    <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                        <motion.div
                            className="h-full bg-gradient-to-r from-cyan-600 to-cyan-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${status.entropy * 100}%` }}
                            transition={{ duration: 1 }}
                        />
                    </div>
                </div>

                {/* Algorithm & Version */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Algorithm</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-100">
                            <Atom size={10} className="text-cyan-500" />
                            {status.algo.toUpperCase()}
                        </div>
                    </div>
                    <div className="bg-black/30 p-2.5 rounded-2xl border border-white/5">
                        <span className="text-[8px] text-slate-500 uppercase font-black block mb-1">Key Version</span>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-cyan-100">
                            <Key size={10} className="text-cyan-500" />
                            v{status.version}.0-SOV
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center pt-2">
                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[9px] font-black text-emerald-400 flex items-center gap-1.5 animate-pulse">
                        <div className="w-1 h-1 bg-emerald-400 rounded-full shadow-[0_0_8px_rgba(52,211,153,1)]" />
                        QUANTUM SAFE OPERATIONAL
                    </div>
                </div>
            </div>
        </div>
    );
};
