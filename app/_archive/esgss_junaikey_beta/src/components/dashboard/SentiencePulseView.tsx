import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Zap, ShieldAlert, Cpu, Database, ChevronRight } from 'lucide-react';

interface PulseMetric {
    id: string;
    label: string;
    value: number;
    status: 'OPTIMAL' | 'STABLE' | 'DRIFTING' | 'CRITICAL';
    icon: React.ReactNode;
}

export const SentiencePulseView: React.FC = () => {
    const [metrics, setMetrics] = useState<PulseMetric[]>([
        { id: '1', label: 'Swarm Resonance', value: 98, status: 'OPTIMAL', icon: <Cpu size={14} /> },
        { id: '2', label: 'Analysis Stability', value: 92, status: 'STABLE', icon: <Activity size={14} /> },
        { id: '3', label: '5T Alignment', value: 95, status: 'OPTIMAL', icon: <Zap size={14} /> },
        { id: '4', label: 'Drift Threshold', value: 12, status: 'STABLE', icon: <ShieldAlert size={14} /> },
    ]);

    const [logs, setLogs] = useState<{ id: string; msg: string; time: string; type: string }[]>([
        { id: 'l1', msg: 'SearchAgent: 正在穿梭於 ESG 歷史數據庫...', time: '12:45:01', type: 'info' },
        { id: 'l2', msg: 'AuditorAgent: 已識別 3 處邏輯不一致。', time: '12:45:10', type: 'warn' },
        { id: 'l3', msg: 'Coordinator: 執行共識合成並觸發 5T 校準。', time: '12:45:15', type: 'success' },
    ]);

    // 模擬實時跳動
    useEffect(() => {
        const interval = setInterval(() => {
            setMetrics(prev => prev.map(m => ({
                ...m,
                value: Math.max(0, Math.min(100, m.value + (Math.random() - 0.5) * 5))
            })));
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-slate-900/40 border border-slate-700/30 rounded-2xl p-5 backdrop-blur-2xl shadow-2xl overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00FFF0]/10 blur-3xl -z-10 group-hover:bg-[#00FFF0]/20 transition-all duration-1000" />

            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#00FFF0]/20 rounded-xl text-[#00FFF0] border border-[#00FFF0]/20 animate-pulse">
                        <Activity size={20} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-white tracking-widest uppercase">感知脈動 (Sentience Pulse)</h3>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter opacity-70">ADK Swarm Real-time Visualization</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                        System Optimal
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
                {metrics.map(metric => (
                    <motion.div
                        key={metric.id}
                        layout
                        className="bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-all cursor-default"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-slate-400">
                                {metric.icon}
                                <span className="text-[9px] font-black uppercase tracking-wider">{metric.label}</span>
                            </div>
                            <span className="text-[14px] font-black text-[#00FFF0] tabular-nums">{Math.round(metric.value)}%</span>
                        </div>
                        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.value}%` }}
                                className={`h-full ${metric.value > 90 ? 'bg-[#00FFF0]' : 'bg-amber-500'}`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="space-y-2">
                <div className="flex items-center justify-between px-1 mb-2">
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Swarm Analysis Logs</span>
                    <Database size={12} className="text-slate-600" />
                </div>
                <div className="bg-black/40 rounded-xl border border-white/5 p-3 h-32 overflow-y-auto scrollbar-hide flex flex-col gap-2">
                    <AnimatePresence>
                        {logs.map(log => (
                            <motion.div
                                key={log.id}
                                initial={{ opacity: 0, x: -5 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-start gap-3 border-l-2 border-[#00FFF0]/30 pl-3 py-1"
                            >
                                <span className="text-[8px] font-mono text-slate-500 shrink-0">{log.time}</span>
                                <p className="text-[9px] font-bold text-slate-300 leading-relaxed">{log.msg}</p>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    <div className="flex items-center gap-1 text-[#00FFF0] mt-1">
                        <motion.div
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-1.5 h-1.5 bg-[#00FFF0] rounded-full"
                        />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em]">Monitoring...</span>
                    </div>
                </div>
            </div>

            <button className="w-full mt-5 py-2 bg-[#00FFF0]/10 hover:bg-[#00FFF0]/20 border border-[#00FFF0]/20 rounded-xl text-[9px] font-black text-[#00FFF0] uppercase tracking-widest transition-all flex items-center justify-center gap-2 group/btn">
                進入 ADK 群蜂實驗室 (Enter ADK Lab)
                <ChevronRight size={12} className="group-hover/btn:translate-x-1 transition-transform" />
            </button>
        </div>
    );
};
