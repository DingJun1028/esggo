'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Activity, ShieldCheck, Lock, ArrowDown } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

export interface OmniFunnelStep {
    id: string;
    label: string;
    value: number;
    description?: string;
    indicator: 'Tangible' | 'Traceable' | 'Trackable' | 'Transparent' | 'Trustworthy';
}

interface OmniFunnelProps {
    title?: string;
    steps: OmniFunnelStep[];
    totalStability: number;
    isSealed?: boolean;
    className?: string;
}

/**
 * 🌪️ OmniFunnel (5T 轉化路徑視覺化)
 * 視覺化數據從初次感知到最終琥珀封存的升華路徑。
 */
export const OmniFunnel: React.FC<OmniFunnelProps> = ({
    title = "5T 資產轉化路徑 (5T Vortex)",
    steps,
    totalStability,
    isSealed = false,
    className = "",
}) => {
    // 5T 色彩映射
    const indicatorColors = {
        Tangible: 'from-omni-primary/40 to-omni-primary/60',
        Traceable: 'from-omni-primary/50 to-omni-primary/70',
        Trackable: 'from-cyan-500/50 to-cyan-500/70',
        Transparent: 'from-indigo-500/50 to-indigo-500/70',
        Trustworthy: 'from-omni-accent/60 to-omni-accent/80',
    };

    return (
        <LiquidGlassContainer className={`p-8 relative overflow-hidden flex flex-col items-center ${className}`}>
            {/* 🌊 Background Resonance Aura */}
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-omni-primary/5 to-transparent pointer-events-none" />

            <div className="w-full mb-10 text-center space-y-2 relative z-10">
                <h3 className="text-xl font-black text-omni-text-main italic tracking-tighter flex items-center justify-center gap-3">
                    <Zap className="text-omni-primary" size={20} />
                    {title}
                </h3>
                <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-black text-omni-text-muted uppercase tracking-[0.2em]">
                        穩定度 (RESONANCE):
                        <span className={`text-xs ${totalStability > 80 ? 'text-omni-accent' : 'text-omni-primary'}`}>
                            {totalStability}%
                        </span>
                    </div>
                </div>
            </div>

            {/* 🌀 The 5T Vortex (Funnel Layers) */}
            <div className="w-full max-w-md flex flex-col items-center gap-2 relative z-10">
                {steps.map((step, index) => {
                    // Calculate trapezoid shape
                    const startWidth = 100 - (index * 12);
                    const endWidth = 100 - ((index + 1) * 12);

                    return (
                        <div key={step.id} className="w-full flex flex-col items-center group">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`relative h-16 flex items-center justify-center cursor-pointer transition-all duration-500 hover:brightness-110`}
                                style={{
                                    width: `${startWidth}%`,
                                    background: `linear-gradient(to right, #63a6b020, #63a6b040)`,
                                    clipPath: `polygon(0% 0%, 100% 0%, ${(100 - (endWidth / startWidth * 100)) / 2 + (endWidth / startWidth * 100)}% 100%, ${(100 - (endWidth / startWidth * 100)) / 2}% 100%)`,
                                }}
                            >
                                {/* Active Layer Highlight */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${indicatorColors[step.indicator]} opacity-20 group-hover:opacity-40 transition-opacity`} />

                                <div className="flex flex-col items-center space-y-0.5 relative z-20">
                                    <span className="text-[10px] font-black text-omni-text-main uppercase tracking-widest leading-none">
                                        {step.label}
                                    </span>
                                    <span className="text-[14px] font-mono font-black text-omni-primary">
                                        {step.value}%
                                    </span>
                                </div>

                                {/* Layer Pulse Glow */}
                                {totalStability > 90 && index === steps.length - 1 && (
                                    <div className="absolute inset-0 bg-omni-accent/20 animate-pulse" />
                                )}
                            </motion.div>

                            {/* Connection Arrow */}
                            {index < steps.length - 1 && (
                                <ArrowDown size={14} className="text-omni-text-muted/30 -my-1" />
                            )}
                        </div>
                    );
                })}

                {/* 🧊 Final Sealing Amber */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    className={`mt-4 w-32 h-14 rounded-2xl flex flex-col items-center justify-center border-2 transition-all duration-700 ${isSealed
                            ? 'bg-omni-accent/20 border-omni-accent border-2'
                            : 'bg-white/5 border-omni-glass-border'
                        }`}
                >
                    <div className="flex items-center gap-2">
                        {isSealed ? <Lock size={16} className="text-omni-accent" /> : <ShieldCheck size={16} className="text-omni-text-muted" />}
                        <span className={`text-[10px] font-black uppercase tracking-widest ${isSealed ? 'text-omni-accent' : 'text-omni-text-muted'}`}>
                            {isSealed ? 'Sealed Asset' : 'Ready to Seal'}
                        </span>
                    </div>
                </motion.div>
            </div>

            {/* 📜 Bottom Philosophy Footer */}
            <div className="mt-12 text-center relative z-10 w-full">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-omni-glass-border to-transparent mb-4" />
                <p className="text-[10px] text-omni-text-muted font-bold italic opacity-60">
                    「以終為始，始終如一。數據經過 5T 渦流，凝結為永恆知識資產。」
                </p>
                <div className="mt-4 flex justify-center gap-4">
                    <div className="flex items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                        <Activity size={12} className="text-omni-primary" />
                        <span className="text-[8px] font-black uppercase tracking-tighter text-omni-text-main">Sentient_Monitor</span>
                    </div>
                    <div className="flex items-center gap-1.5 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all cursor-help">
                        <ShieldCheck size={12} className="text-omni-accent" />
                        <span className="text-[8px] font-black uppercase tracking-tighter text-omni-text-main">5T_Verified</span>
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
};
