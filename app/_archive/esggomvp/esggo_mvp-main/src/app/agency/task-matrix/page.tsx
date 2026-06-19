'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion } from 'framer-motion';
import {
    Clock,
    Zap,
    Cpu,
    Target,
    Activity,
    ShieldCheck,
    Layers,
    ListTodo,
    ChevronRight,
    Search
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';
import GanttChart from '@/components/charts/GanttChart';
import ServiceJourney from '@/components/ServiceJourney';
import { OmniBase } from '@/core/OmniBase';

/**
 * ⚡ Agency 4.2: Task Matrix (v2 — Sentient Orchestration Edition)
 * 
 * 功能亮點：
 * - 智能任務調度：整合 GanttChart 展示代理 (Sentient Agents) 的協作時間軸。
 * - 優先級矩陣：展示「時、地、人、物、由、如何」的 5W1H 任務分配。
 * - 液態玻璃動效：極致流暢的 UI 反饋與 5T 誠信鎖定。
 */
export default function TaskMatrixPage() {
    const { t, locale } = useLanguage();
    const [taskCount, setTaskCount] = useState(0);
    const [agentEfficiency, setAgentEfficiency] = useState(0);
    const [auditLog, setAuditLog] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const matrixTasks = [
        { id: 'T1', name: 'GRI-305 Emissions Audit', start: 0, duration: 25, status: 'Completed', element: 'Gold' },
        { id: 'T2', name: 'Sentinel AI Patrol (Zone A)', start: 10, duration: 45, status: 'Active', element: 'Water' },
        { id: 'T3', name: 'Gnosis Heatmap Generation', start: 30, duration: 20, status: 'Completed', element: 'Wood' },
        { id: 'T4', name: 'Blockchain Evidence Sealing', start: 55, duration: 35, status: 'Active', element: 'Fire' },
        { id: 'T5', name: 'OmniOne Asset Manifestation', start: 70, duration: 25, status: 'Planned', element: 'Earth' },
    ] as const;

    useEffect(() => {
        const fetchTaskMatrixData = async () => {
            setIsLoading(true);
            try {
                // 🔬 Simulate Agency Domain Scan
                const mockAtom = {
                    uuid: 'AGENCY-ATOM-TASK-001',
                    type: 'Agency',
                    payload: { tasks: 5, efficiency: 94 },
                    evidence: { trackable: true, transparent: true }
                } as any;

                const scanResult = await OmniBase.scanDeep(mockAtom);
                setTaskCount(5);
                setAgentEfficiency(94);
                setAuditLog(scanResult.auditLog);
            } catch (error) {
                console.error('Task Matrix scan failed:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTaskMatrixData();
    }, []);

    const agencyVitals = [
        { label: t.vitals.collab, val: 94, icon: <Zap size={16} />, color: 'text-amber-400', bg: 'bg-amber-500/10' },
        { label: t.vitals.activity, val: 88, icon: <Activity size={16} />, color: 'text-blue-400', bg: 'bg-blue-500/10' },
        { label: t.vitals.sync, val: 100, icon: <Cpu size={16} />, color: 'text-aqua', bg: 'bg-aqua/10' },
        { label: t.vitals.lock, val: 100, icon: <ShieldCheck size={16} />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-24">
            <PageHeader
                title={t.pages.task_matrix.title}
                subtitle={t.pages.task_matrix.subtitle}
                category={t.nav.agency}
            />

            <ServiceJourney currentStepId="trackable" />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* 💓 Agency Core Control */}
                <div className="xl:col-span-1 p-8 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass relative overflow-hidden flex flex-col items-center justify-center min-h-[500px] shadow-2xl">
                    <div className="absolute top-0 left-0 p-8 opacity-[0.03]">
                        <Layers size={250} className="text-aqua" />
                    </div>

                    <div className="relative z-10 flex flex-col items-center w-full">
                        <motion.div
                            animate={{ rotate: [0, 90, 180, 270, 360] }}
                            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                            className="size-52 rounded-full border border-aqua/20 flex items-center justify-center relative bg-black/40 backdrop-blur-3xl"
                        >
                            <div className="absolute inset-2 rounded-full border border-aqua/40 flex items-center justify-center">
                                <div className="text-center">
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-aqua mb-2">Sync Status</p>
                                    <h2 className="text-5xl font-black text-white italic tracking-tighter">
                                        {isLoading ? '...' : '94'}
                                        <span className="text-sm font-normal not-italic opacity-50 ml-1">%</span>
                                    </h2>
                                    <p className="text-[8px] font-bold text-gray-500 mt-2 uppercase tracking-widest">Efficiency Matrix v12.0</p>
                                </div>
                            </div>

                            {/* Scanning Line */}
                            <motion.div
                                animate={{ top: ['0%', '100%', '0%'] }}
                                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                className="absolute left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-aqua/50 to-transparent z-20"
                            />
                        </motion.div>

                        <div className="mt-12 w-full space-y-4">
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-aqua/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-aqua/20 text-aqua">
                                        <Target size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Active Agents</span>
                                        <span className="text-[8px] font-bold text-gray-400">Patrolling 4 Quadrants</span>
                                    </div>
                                </div>
                                <div className="flex -space-x-3">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="size-8 rounded-full bg-gray-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-aqua">
                                            A{i}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="p-5 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between group hover:bg-[#ffd700]/5 transition-colors cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="p-2.5 rounded-xl bg-[#ffd700]/20 text-[#ffd700]">
                                        <ListTodo size={18} />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-white">Queue Status</span>
                                        <span className="text-[8px] font-bold text-gray-400">2 Critical, 3 Standard</span>
                                    </div>
                                </div>
                                <ChevronRight size={14} className="text-gray-600 group-hover:text-[#ffd700]" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* 📊 Vitals + Gantt */}
                <div className="xl:col-span-2 flex flex-col gap-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {agencyVitals.map((v, i) => (
                            <motion.div key={v.label}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 rounded-[2rem] bg-[var(--card-bg)] border border-[var(--card-border)] relative overflow-hidden group hover:border-aqua/30 transition-all flex flex-col justify-between shadow-md"
                            >
                                <div className={`size-8 rounded-xl ${v.bg} ${v.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner`}>
                                    {v.icon}
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-white italic mb-1">
                                        {v.val}<span className="text-sm opacity-50">%</span>
                                    </p>
                                    <p className="text-[9px] font-black uppercase tracking-widest text-[var(--sidebar-text)]">{v.label}</p>
                                </div>
                                <div className="mt-3 h-1 w-full rounded-full bg-white/5 overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${v.val}%` }}
                                        transition={{ delay: 0.5 + i * 0.15, duration: 0.8 }}
                                        className={`h-full rounded-full ${v.color.replace('text-', 'bg-')}`}
                                    />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex-1 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-[3rem] p-4 shadow-lg overflow-hidden flex flex-col">
                        <GanttChart
                            tasks={matrixTasks as any}
                            title={t.charts.gantt_title}
                        />
                    </div>
                </div>
            </div>

            {/* 📋 System Diagnostics */}
            <div className="p-10 rounded-[3rem] bg-[var(--card-bg)] border border-[var(--card-border)] liquid-glass shadow-xl">
                <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-aqua/10 text-aqua">
                            <Clock size={20} />
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.3em] text-white">Agency Orchestration Log</h4>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Sentient state transitions captured by OmniNexus</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-colors flex items-center gap-2">
                            <Search size={12} /> Search Matrix
                        </button>
                    </div>
                </div>

                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                    {auditLog.map((log, idx) => (
                        <div key={idx} className="p-4 bg-black/20 border border-white/5 rounded-2xl flex items-center gap-6 group hover:border-aqua/20 transition-all">
                            <span className="text-[9px] font-mono text-aqua opacity-50 shrink-0">[{new Date().toLocaleTimeString()}]</span>
                            <div className="size-1.5 rounded-full bg-[#ffd700] shadow-[0_0_8px_#ffd700] shrink-0" />
                            <p className="text-[10px] font-medium text-gray-300 font-mono tracking-wide">{log}</p>
                            <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[8px] font-bold text-gray-600 uppercase tracking-tighter">Verified</span>
                                <ShieldCheck size={12} className="text-emerald-500" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
