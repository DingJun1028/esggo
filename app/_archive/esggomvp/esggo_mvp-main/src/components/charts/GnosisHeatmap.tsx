'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Map, Globe } from 'lucide-react';

interface RiskNode {
    id: string;
    name: string;
    intensity: number; // 0-1
    dimension: string; // OMC Dimension (e.g., Omni-Matrix, Omni-Rune)
    status: 'Stable' | 'Drifting' | 'Critical';
}

interface GnosisHeatmapProps {
    data: RiskNode[];
    title?: string;
}

/**
 * 🔥 OmniCharts: Gnosis Heatmap v2.0
 * Implementation: Matrix-grid with CSS Grid & Framer-Motion.
 * Alignment: 12-Dimensional RiskNode Logic & Aqua (#63a6b0).
 */
export default function GnosisHeatmap({ data, title }: GnosisHeatmapProps) {
    return (
        <div className="p-10 rounded-[3.5rem] bg-black/60 border border-white/10 liquid-glass relative group overflow-hidden">
            {/* Ambient Background Pulse */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/5 via-transparent to-transparent pointer-events-none" />

            <div className="flex justify-between items-center mb-10 relative z-10">
                <div className="flex flex-col gap-1">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gray-400 flex items-center gap-3">
                        <Map size={12} className="text-[#63a6b0]" />
                        {title || "Gnosis Impact Matrix"}
                    </h3>
                    <p className="text-[7px] font-bold text-gray-600 uppercase tracking-widest pl-7">Radiant Scripture v4.5 Compliant</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                        Gnosis Node: {data.length}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3 relative z-10">
                {data.map((node, idx) => (
                    <motion.div
                        key={node.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.03, duration: 0.5, ease: "easeOut" }}
                        whileHover={{ scale: 1.15, zIndex: 30 }}
                        className="aspect-square rounded-xl border border-white/10 relative group/item cursor-help overflow-hidden"
                        style={{
                            backgroundColor: node.intensity > 0.8 ? 'rgba(245, 34, 45, 0.2)' : `rgba(99, 166, 176, ${0.1 + (node.intensity * 0.7)})`,
                            borderColor: node.status === 'Critical' ? 'rgba(245, 34, 45, 0.4)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* Glow for high intensity */}
                        {node.intensity > 0.7 && (
                            <div className="absolute inset-0 bg-[#63a6b0]/20 blur-xl animate-pulse" />
                        )}

                        {/* Node Label (Minimal) */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-[7px] font-black text-white/20 group-hover/item:text-white/60 transition-colors uppercase">
                                {node.dimension.split('-')[1]?.substring(0, 1) || 'O'}
                            </span>
                        </div>

                        {/* Tooltip Overlay */}
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 px-4 py-3 bg-black/95 border border-[#63a6b0]/40 rounded-2xl opacity-0 group-hover/item:opacity-100 transition-all pointer-events-none whitespace-nowrap z-50 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.8)]">
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`size-1.5 rounded-full ${node.status === 'Critical' ? 'bg-red-500 shadow-[0_0_8px_#f5222d]' : 'bg-[#63a6b0] shadow-[0_0_8px_#63a6b0]'}`} />
                                <p className="text-[9px] font-black text-white uppercase tracking-widest">{node.name}</p>
                            </div>
                            <div className="flex justify-between items-center gap-6">
                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{node.dimension}</p>
                                <p className="text-[10px] font-black text-[#ffd700] italic">{Math.round(node.intensity * 100)}% Intensity</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="mt-12 flex justify-between items-center relative z-10 pt-8 border-t border-white/5">
                <div className="flex gap-6 items-center">
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-[#63a6b0]/20 border border-[#63a6b0]/40" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Resonance</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="size-2 rounded-full bg-red-500/20 border border-red-500/40" />
                        <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">Drift Factor</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Globe size={12} className="text-gray-700" />
                    <span className="text-[8px] font-black text-gray-700 uppercase tracking-[0.2em]">Omni-Presence Synchronizer</span>
                </div>
            </div>
        </div>
    );
}

