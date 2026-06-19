import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Flag, ChevronRight, ShieldCheck } from 'lucide-react';
import { IComponentCore } from '@/services/ceremony/core/IComponentCore';

interface GanttTask {
    id: string;
    label: string;
    start: number; // 0-100 percentage of timeline
    duration: number; // 0-100 percentage of timeline
    status: 'Complete' | 'In Progress' | 'Planned';
    type: string;
}

interface GanttChartProps {
    tasks: GanttTask[];
    title?: string;
    core: IComponentCore;
}

export const GanttChart: React.FC<GanttChartProps> = ({ tasks, title, core }) => {
    return (
        <div
            className="w-full h-full flex flex-col p-6 liquid-glass relative overflow-hidden group"
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
        >
            {/* Glossy Headers */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#63a6b0]/10 rounded-lg text-[#63a6b0]">
                        <Calendar size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Sustainability Roadmap</h3>
                        <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">5T TRACEABLE TIMELINE</p>
                    </div>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-emerald-500" /> COMPLETE</span>
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-sm bg-[#63a6b0]" /> ACTIVE</span>
                </div>
            </div>

            {/* Timeline Grid */}
            <div className="relative flex-1">
                {/* Quarter Dividers */}
                <div className="absolute inset-0 flex justify-between pointer-events-none opacity-20">
                    {[0, 25, 50, 75, 100].map(p => (
                        <div key={p} className="h-full w-px bg-white/10" style={{ left: `${p}%` }} />
                    ))}
                </div>

                {/* Tasks */}
                <div className="space-y-4 relative z-10 pt-4">
                    {tasks.map((task, idx) => (
                        <div key={task.id} className="relative py-1">
                            <div className="flex items-center justify-between mb-1.5 px-1">
                                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">{task.label}</span>
                                <span className="text-[9px] font-mono text-slate-500 uppercase">{task.type}</span>
                            </div>
                            <div className="h-4 w-full bg-white/5 rounded-full relative overflow-hidden">
                                <motion.div
                                    initial={{ width: 0, x: `${task.start}%` }}
                                    animate={{ width: `${task.duration}%` }}
                                    className={`absolute h-full rounded-full cursor-help hover:brightness-125 transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)] ${task.status === 'Complete' ? 'bg-emerald-500/60 border border-emerald-500/30' :
                                            task.status === 'In Progress' ? 'bg-[#63a6b0]/60 border border-[#63a6b0]/30' :
                                                'bg-white/10 border border-white/10'
                                        }`}
                                    whileHover={{ scaleY: 1.2 }}
                                />

                                {/* Milestone Marker */}
                                {task.status === 'Complete' && (
                                    <motion.div
                                        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
                                        style={{ left: `${task.start + task.duration}%` }}
                                        whileHover={{ scale: 1.5 }}
                                    >
                                        <Flag size={12} className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                                    </motion.div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / 5T Seal */}
            <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#63a6b0]" />
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                        Protocol: {core.uuid.substring(0, 12)}
                    </span>
                </div>
                <button className="text-[9px] font-black text-[#63a6b0] uppercase tracking-[0.2em] flex items-center gap-1 group">
                    VIEW DETAILED AUDIT <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </div>
    );
};
