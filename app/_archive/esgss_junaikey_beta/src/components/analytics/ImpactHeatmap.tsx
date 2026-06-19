import React from 'react';
import { motion } from 'framer-motion';
import { Grid, Target, Activity, ShieldCheck } from 'lucide-react';
import { IComponentCore } from '@/services/ceremony/core/IComponentCore';

interface HeatmapCell {
    x: number;
    y: number;
    value: number; // 0-1
    label: string;
}

interface ImpactHeatmapProps {
    data: HeatmapCell[];
    xAxisLabel: string;
    yAxisLabel: string;
    core: IComponentCore;
}

export const ImpactHeatmap: React.FC<ImpactHeatmapProps> = ({ data, xAxisLabel, yAxisLabel, core }) => {
    return (
        <div
            className="w-full h-full flex flex-col p-6 liquid-glass relative overflow-hidden"
            data-uuid={core.uuid}
            data-timestamp={core.timestamp}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#D4AF37]/10 rounded-lg text-[#D4AF37]">
                        <Grid size={18} />
                    </div>
                    <div>
                        <h3 className="text-sm font-black uppercase tracking-widest text-white">Global Impact Matrix</h3>
                        <p className="text-[10px] text-zinc-500 font-mono tracking-tighter uppercase">REAL-TIME RISK VS. OPPORTUNITY</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/10">
                        <Activity size={12} className="text-[#63a6b0]" />
                        <span className="text-[9px] font-black text-slate-400 uppercase">Live Feed</span>
                    </div>
                </div>
            </div>

            {/* Heatmap Grid */}
            <div className="flex-1 relative flex">
                {/* Y Axis Label */}
                <div className="absolute -left-4 top-1/2 -rotate-90 origin-center text-[8px] font-black text-zinc-600 uppercase tracking-widest whitespace-nowrap">
                    {yAxisLabel}
                </div>

                <div className="ml-6 flex-1 grid grid-cols-10 grid-rows-10 gap-1 relative">
                    {/* Legend helper */}
                    <div className="absolute inset-0 border border-white/5 pointer-events-none" />

                    {data.map((cell, i) => (
                        <motion.div
                            key={i}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: i * 0.005 }}
                            whileHover={{
                                scale: 1.1,
                                zIndex: 20,
                                outline: '2px solid rgba(255,255,255,0.2)'
                            }}
                            className="relative aspect-square group rounded-sm cursor-pointer"
                            style={{
                                backgroundColor: cell.value > 0.7
                                    ? `rgba(212, 175, 55, ${cell.value * 0.8})` // Gold for high opportunity/risk
                                    : `rgba(99, 166, 176, ${cell.value * 1.0})`, // Cyan for standard
                                boxShadow: cell.value > 0.8 ? `0 0 15px rgba(212, 175, 55, ${cell.value * 0.3})` : 'none'
                            }}
                        >
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 p-2 bg-black border border-white/20 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap min-w-[120px]">
                                <p className="text-[9px] font-black text-[#63a6b0] uppercase tracking-widest">{cell.label}</p>
                                <div className="flex justify-between items-end mt-1">
                                    <span className="text-xl font-light text-white leading-none">{(cell.value * 100).toFixed(0)}</span>
                                    <span className="text-[8px] text-zinc-500 uppercase font-mono">Intensity</span>
                                </div>
                            </div>

                            {cell.value > 0.9 && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <Target size={10} className="text-white/40 animate-pulse" />
                                </div>
                            )}
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* X Axis Label */}
            <div className="mt-4 text-center text-[8px] font-black text-zinc-600 uppercase tracking-widest">
                {xAxisLabel}
            </div>

            {/* Footer / 5T Seal */}
            <div className="mt-8 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-[#D4AF37]" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                        TRACED_BY_JAIKY_CORE_{core.uuid.substring(0, 4)}
                    </span>
                </div>
            </div>
        </div>
    );
};
