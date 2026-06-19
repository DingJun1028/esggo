'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from "@/components/omni/liquid-glass/LiquidGlassContainer";
import { Activity, Shield } from 'lucide-react';

interface ServiceNode {
    id: string;
    name: string;
    status: 'ACTIVE' | 'DEVELOPMENT' | 'PLANNED';
    health: number; // 0-100
    category: 'E' | 'S' | 'G';
}

interface ResonanceHeatmapProps {
    services: ServiceNode[];
}

/**
 * 🌀 ResonanceHeatmap: 24-Service Matrix v12.0
 * Visualizes the entire ESG service ecosystem with health indicators.
 */
export const ResonanceHeatmap: React.FC<ResonanceHeatmapProps> = ({ services }) => {
    const categories = [
        { key: 'E', label: 'Environmental', color: '#10B981' },
        { key: 'S', label: 'Social', color: '#3B82F6' },
        { key: 'G', label: 'Governance', color: '#F59E0B' }
    ];

    return (
        <LiquidGlassContainer glowColor="aqua" intensity="low" className="p-8 relative">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-sm font-black tracking-[0.4em] text-white uppercase flex items-center gap-3">
                    <Activity size={16} className="text-[#63a6b0]" />
                    Resonance Matrix (24 MECE)
                </h3>
                <div className="flex gap-4">
                    {categories.map(cat => (
                        <div key={cat.key} className="flex items-center gap-1.5">
                            <div className="size-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest">{cat.label}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                {services.map((service, idx) => {
                    const catColor = categories.find(c => c.key === service.category)?.color || '#63a6b0';
                    const opacity = 0.2 + (service.health / 100) * 0.8;

                    return (
                        <motion.div
                            key={service.id}
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: idx * 0.02 }}
                            className="group relative"
                        >
                            <div
                                className="aspect-square rounded-lg border border-white/10 flex flex-col items-center justify-center gap-1 transition-all duration-500 cursor-help"
                                style={{
                                    backgroundColor: `${catColor}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                                    boxShadow: service.status === 'ACTIVE' ? `0 0 15px ${catColor}33` : 'none'
                                }}
                            >
                                <span className="text-[10px] font-black text-white/90">{service.category}{idx % 8 + 1}</span>
                                {service.health > 90 && (
                                    <Shield size={8} className="text-white animate-pulse" />
                                )}
                            </div>

                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 opacity-0 group-hover:opacity-100 transition-all pointer-events-none bg-black/90 backdrop-blur-xl border border-white/20 p-3 rounded-xl z-50 shadow-2xl">
                                <p className="text-[10px] font-black text-white uppercase tracking-tighter mb-1">{service.name}</p>
                                <div className="flex justify-between items-center">
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">{service.status}</span>
                                    <span className="text-[10px] font-black" style={{ color: catColor }}>{service.health}%</span>
                                </div>
                                <div className="mt-2 w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full"
                                        style={{ width: `${service.health}%`, backgroundColor: catColor }}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex flex-col">
                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em]">Global Coverage</span>
                    <span className="text-xl font-black text-white italic tracking-tighter">71.4% <span className="text-[10px] text-[#63a6b0] not-italic font-bold">ALPHA-PHASE</span></span>
                </div>
                <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-gray-500 uppercase tracking-[0.3em]">
                    Sentient Grid v12.0
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
