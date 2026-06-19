'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Fingerprint, Activity, Zap, History } from 'lucide-react';

interface Props {
    metrics: {
        traceable: number;    // 0-100
        transparent: number;
        trackable: number;
        timely: number;
        trustworthy: number;
    };
    isSealed?: boolean;
    className?: string;
}

/**
 * ⚡ EnergyAura - 5T 能量感知元件
 * 視覺化呈現 5T 指標達成度，反映知識資產的誠信價值。
 */
export const EnergyAura: React.FC<Props> = ({ metrics, isSealed = false, className = "" }) => {
    const categories = [
        { key: 'traceable', label: 'Traceable', icon: Fingerprint, color: 'emerald' },
        { key: 'transparent', label: 'Transparent', icon: Activity, color: 'blue' },
        { key: 'trackable', label: 'Trackable', icon: Zap, color: 'fuchsia' },
        { key: 'timely', label: 'Timely', icon: History, color: 'amber' },
        { key: 'trustworthy', label: 'Trustworthy', icon: ShieldCheck, color: 'gold' },
    ];

    return (
        <div className={`p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden group ${className}`}>
            {/* 動態背景光暈與脈衝共鳴 */}
            <AnimatePresence>
                {isSealed && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-transparent to-amber-500/10 pointer-events-none"
                        />
                        {/* 5T 能量脈衝環 */}
                        {[1, 2, 3].map((i) => (
                            <motion.div
                                key={`pulse-${i}`}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{
                                    scale: [0.8, 1.5],
                                    opacity: [0.5, 0]
                                }}
                                transition={{
                                    repeat: Infinity,
                                    duration: 3,
                                    delay: i * 1,
                                    ease: "easeOut"
                                }}
                                className="absolute inset-0 m-auto w-32 h-32 rounded-full border border-amber-500/20 pointer-events-none"
                            />
                        ))}
                    </>
                )}
            </AnimatePresence>

            <div className="flex justify-between items-center mb-4 relative z-10">
                <span className="text-[10px] font-black text-white/40 tracking-widest uppercase flex items-center gap-2">
                    <Zap size={10} className={isSealed ? "text-amber-500" : "text-cyan-400"} />
                    5T Energy Aura
                </span>
                {isSealed && (
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            opacity: [0.6, 1, 0.6]
                        }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        className="flex items-center gap-1"
                    >
                        <ShieldCheck size={10} className="text-amber-500" />
                        <span className="text-[8px] font-bold text-amber-500 uppercase tracking-tighter">
                            OMNI_SEALED
                        </span>
                    </motion.div>
                )}
            </div>

            <div className="space-y-4 relative z-10">
                {categories.map((cat) => {
                    const value = (metrics as any)[cat.key] || 0;
                    return (
                        <div key={cat.key} className="space-y-1.5">
                            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-[0.2em]">
                                <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                    <cat.icon size={10} className={isSealed ? "text-amber-400/70" : "text-cyan-400/70"} />
                                    <span>{cat.label}</span>
                                </div>
                                <span className={isSealed ? 'text-amber-400 font-bold' : 'text-cyan-400 font-bold'}>
                                    {value}%
                                </span>
                            </div>
                            <div className="h-[3px] w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${value}%` }}
                                    transition={{ duration: 1, ease: "circOut" }}
                                    className={`h-full relative overflow-hidden ${isSealed
                                        ? 'bg-gradient-to-r from-amber-600 to-amber-400'
                                        : 'bg-gradient-to-r from-cyan-600 to-cyan-400'
                                        }`}
                                >
                                    {/* 掃掠光效 */}
                                    <motion.div
                                        animate={{ x: ['-100%', '200%'] }}
                                        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-1/2"
                                    />
                                </motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {isSealed && (
                <div className="mt-4 pt-4 border-t border-white/5 text-center relative z-10">
                    <p className="text-[8px] font-light text-white/30 italic tracking-wider">
                        "INTEGRITY_LOCKED_IN_ETERNITY"
                    </p>
                </div>
            )}
        </div>
    );
};
