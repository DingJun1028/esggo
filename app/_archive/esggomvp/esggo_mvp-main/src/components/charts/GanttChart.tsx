'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, CheckCircle2 } from 'lucide-react';

interface GanttTask {
    id: string;
    name: string;
    start: number; // 0-100 (percentage of timeline)
    duration: number; // 0-100
    status: 'Completed' | 'Active' | 'Planned' | 'Critical';
    color?: string; // Manual override
    element?: 'Gold' | 'Wood' | 'Water' | 'Fire' | 'Earth'; // Element Law mapping
}

interface GanttChartProps {
    tasks: GanttTask[];
    title?: string;
}

/**
 * 📅 OmniCharts: Interactive Gantt v2.0
 * Implementation: Pure CSS/Framer-Motion for maximum performance.
 * Alignment: 10-Color Element Laws & Aqua (#63a6b0) palette.
 */
export default function GanttChart({ tasks, title }: GanttChartProps) {
    const ELEMENT_COLORS = {
        Gold: '#FFD700',
        Wood: '#52C41A',
        Water: '#63a6b0',
        Fire: '#F5222D',
        Earth: '#8B4513'
    };

    return (
        <div className="p-10 rounded-[3rem] bg-black/40 border border-white/10 liquid-glass relative overflow-hidden group">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 pointer-events-none" />

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-12">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.6em] text-gray-500 flex items-center gap-3">
                            <Clock size={12} className="text-[#63a6b0]" />
                            {title || "Omni-Timeline Genesis"}
                        </h3>
                        <p className="text-[8px] font-bold text-gray-700 uppercase tracking-widest pl-7">Celestial Schedule Verification</p>
                    </div>
                    <div className="flex gap-6 items-center">
                        <div className="flex flex-col items-end">
                            <span className="text-[8px] font-black text-[#63a6b0] uppercase tracking-widest animate-pulse">Live Resonance</span>
                            <span className="text-[7px] font-bold text-gray-600 uppercase">Synchronized v12.0</span>
                        </div>
                        <Calendar size={18} className="text-white/10 group-hover:text-[#63a6b0] transition-colors" />
                    </div>
                </div>

                <div className="space-y-10">
                    {tasks.map((task, idx) => {
                        const barColor = task.color || (task.element ? ELEMENT_COLORS[task.element] : '#63a6b0');

                        return (
                            <div key={task.id} className="relative group/row">
                                {/* Task Row Label */}
                                <div className="flex justify-between items-end mb-3 px-2">
                                    <div className="flex items-center gap-3">
                                        <div className="size-1 rounded-sm rotate-45" style={{ backgroundColor: barColor }} />
                                        <span className="text-[10px] font-black text-white uppercase tracking-wider group-hover/row:text-[#63a6b0] transition-colors">{task.name}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{task.status}</span>
                                        {task.status === 'Completed' && <CheckCircle2 size={10} className="text-emerald-500" />}
                                    </div>
                                </div>

                                {/* Bar Container */}
                                <div className="h-5 w-full bg-white/5 rounded-full relative border border-white/5 group-hover/row:border-white/20 transition-all">
                                    <motion.div
                                        initial={{ width: 0, x: `${task.start}%` }}
                                        animate={{ width: `${task.duration}%`, x: `${task.start}%` }}
                                        transition={{ delay: idx * 0.15, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                        className="absolute h-full rounded-full"
                                        style={{
                                            backgroundColor: barColor,
                                            boxShadow: `0 0 20px ${barColor}44`
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-50" />
                                        <div className="absolute top-1/2 -translate-y-1/2 left-2 size-1 bg-white/40 rounded-full blur-[1px]" />
                                    </motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Timeline Axis */}
                <div className="mt-12 flex justify-between px-2 pt-6 border-t border-white/5">
                    {['Manifestation', 'Evolution', 'Transcendence', 'Nirvana'].map((phase, pIdx) => (
                        <div key={phase} className="flex flex-col items-center gap-2">
                            <div className="h-1 w-[1px] bg-white/20" />
                            <span className="text-[7px] font-black text-gray-700 uppercase tracking-[0.3em]">{phase}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

