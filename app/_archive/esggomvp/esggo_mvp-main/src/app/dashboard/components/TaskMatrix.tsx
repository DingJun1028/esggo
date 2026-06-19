"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Activity,
    Box,
    ChevronRight,
    Layers,
    RefreshCcw,
    ShieldCheck,
    Zap,
    Cpu,
    ArrowUpRight
} from "lucide-react";

/**
 * 🕸️ TaskMatrix - Real-time Agent Network Visualization
 * 
 * Aesthetics: Matrix-style grid with Liquid Glass transitions.
 * Features: Live task status, 5T Evidence chain, Agent role icons.
 */
export const TaskMatrix: React.FC = () => {
    const [tasks, setTasks] = useState<any[]>([]);
    const [stateTrigger, setStateTrigger] = useState<Record<string, string>>({});

    useEffect(() => {
        // Mocking live task stream from OmniAgentForge
        const mockTasks = [
            { id: "T1", intent: "環保局排放規章校對", status: "COMPLETED", agent: "AuditBot", progress: 100, timestamp: "2m ago" },
            { id: "T2", intent: "碳邊境調整機制 (CBAM) 模擬", status: "PROCESSING", agent: "Strategist-X", progress: 64, timestamp: "Now" },
            { id: "T3", intent: "供應鏈 5T 數據生成", status: "COMPLETED", agent: "ForgeUnit-4", progress: 100, timestamp: "5m ago" },
            { id: "T4", intent: "Dr. Thoth 知識點本質提純", status: "PENDING", agent: "GnosisAgent", progress: 0, timestamp: "Queue" },
        ];
        setTasks(mockTasks);

        const interval = setInterval(() => {
            setTasks(prev => prev.map(t => {
                if (t.status === 'PROCESSING') {
                    const nextProgress = Math.min(100, t.progress + 10);
                    const nextStatus = nextProgress >= 100 ? 'COMPLETED' : 'PROCESSING';

                    if (nextStatus === 'COMPLETED') {
                        // Trigger Crystallize animation on completion (Trustworthy)
                        setStateTrigger(prev => ({ ...prev, [t.id]: 'state-update-crystallize' }));
                        setTimeout(() => setStateTrigger(prev => ({ ...prev, [t.id]: '' })), 2000);
                    }

                    return { ...t, progress: nextProgress, status: nextStatus };
                }
                return t;
            }));
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    const triggerTransfer = (id: string) => {
        // Trigger Ripple animation on click (Traceable Transfer)
        setStateTrigger(prev => ({ ...prev, [id]: 'state-transfer-ripple' }));
        setTimeout(() => setStateTrigger(prev => ({ ...prev, [id]: '' })), 1500);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#63a6b0] rounded-xl text-white shadow-lg shadow-[#63a6b0]/20">
                        <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="text-sm font-black text-slate-800 tracking-tight">光之羽翼 (Agent Network)</h4>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Task Matrix · Real-time</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100 font-black text-[10px]">
                    <Zap className="w-3 h-3 animate-pulse" /> GRID STATUS: STABLE
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AnimatePresence>
                    {tasks.map((task) => (
                        <motion.div
                            key={task.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => triggerTransfer(task.id)}
                            className={`group relative p-5 rounded-3xl border transition-all cursor-pointer overflow-hidden ${task.status === 'COMPLETED'
                                ? 'bg-white border-slate-100 hover:border-[#63a6b0]/30 shadow-sm'
                                : 'bg-slate-50/50 border-dashed border-slate-200'
                                } ${stateTrigger[task.id] || ''}`}
                        >
                            <div className="flex justify-between items-start mb-4 relative z-10">
                                <div className="space-y-1">
                                    <h5 className="text-xs font-black text-slate-700">{task.intent}</h5>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                        ID: {task.id} · Agent: {task.agent}
                                    </p>
                                </div>
                                <div className={`p-1.5 rounded-lg ${task.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-500' : 'bg-[#63a6b0]/10 text-[#63a6b0]'}`}>
                                    {task.status === 'COMPLETED' ? <ShieldCheck className="w-4 h-4" /> : <RefreshCcw className="w-4 h-4 animate-spin-slow" />}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                    <span className="text-slate-400">Progress</span>
                                    <span className={task.status === 'COMPLETED' ? 'text-emerald-500' : 'text-[#63a6b0]'}>{task.progress}%</span>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${task.progress}%` }}
                                        className={`h-full ${task.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#63a6b0]'}`}
                                    />
                                </div>
                            </div>

                            <div className="mt-4 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[9px] font-bold text-slate-400 italic">{task.timestamp}</span>
                                <div className="flex items-center gap-1 text-[9px] font-black text-[#63a6b0]">
                                    VIEW EVIDENCE <ArrowUpRight className="w-3 h-3" />
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-3xl text-slate-400 font-black text-[10px] uppercase tracking-widest hover:border-[#63a6b0]/40 hover:text-[#63a6b0] transition-all">
                + Dispatch Automated Task Group
            </button>
        </div>
    );
}
