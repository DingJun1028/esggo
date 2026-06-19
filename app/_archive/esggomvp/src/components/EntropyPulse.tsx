'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { IEntropyReport } from '@/core/omni-types';
import { Activity, AlertTriangle, Cpu, Zap } from 'lucide-react';

interface EntropyPulseProps {
    report: IEntropyReport;
}

export const EntropyPulse: React.FC<EntropyPulseProps> = ({ report }) => {
    const statusColor = useMemo(() => {
        if (report.score > 70) return '#ef4444'; // Red
        if (report.score > 40) return '#f59e0b'; // Amber
        return '#63a6b0'; // Aqua
    }, [report.score]);

    return (
        <div className="relative p-6 rounded-[2rem] bg-black/40 border border-[#63a6b0]/20 backdrop-blur-xl overflow-hidden group liquid-glass">
            {/* Background Pulse Effect */}
            <motion.div
                className="absolute inset-0 opacity-10"
                animate={{
                    backgroundColor: [statusColor, 'transparent'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            />

            <div className="relative z-10 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Activity className="w-5 h-5 text-[#63a6b0] animate-pulse" />
                        <h3 className="text-fluid-xs font-black tracking-[0.2em] text-white/50 uppercase">Entropy Level</h3>
                    </div>
                    <span className="text-fluid-xl font-black font-mono tracking-tighter" style={{ color: statusColor }}>
                        {report.score.toFixed(1)}%
                    </span>
                </div>

                {/* Breakdown Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#63a6b0]/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Zap className="w-3 h-3 text-yellow-400" />
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Alignment</span>
                        </div>
                        <div className="text-fluid-sm font-black font-mono">{report.breakdown.protocolMisalignment.toFixed(0)}%</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-[#63a6b0]/30 transition-colors">
                        <div className="flex items-center gap-2 mb-1">
                            <Cpu className="w-3 h-3 text-blue-400" />
                            <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">Redundancy</span>
                        </div>
                        <div className="text-fluid-sm font-black font-mono">{report.breakdown.dataRedundancy.toFixed(0)}%</div>
                    </div>
                </div>

                {/* Recommendation Box */}
                <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#63a6b0]/5 border border-[#63a6b0]/10 mt-2 guardian-glow">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: statusColor }} />
                    <p className="text-fluid-xs text-white/70 italic leading-relaxed">
                        {report.recommendation}
                    </p>
                </div>
            </div>
        </div>
    );
};
