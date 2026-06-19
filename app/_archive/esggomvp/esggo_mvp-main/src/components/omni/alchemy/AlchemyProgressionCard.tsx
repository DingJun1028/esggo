'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { AlchemyLevelBadge } from './AlchemyLevelBadge';
import { ALCHEMY_LEVELS, IAlchemyState, AlchemyLevel } from '@/core/dtos/AlchemyState.dto';

interface Props {
    state: IAlchemyState;
}

/**
 * 📊 Alchemy Progression Card (v12.0 Masterpiece)
 * 顯示目前等級進度與下一個特權。
 */
export function AlchemyProgressionCard({ state }: Props) {
    const currentDef = ALCHEMY_LEVELS[state.currentLevel];
    const nextLevel = state.currentLevel < 10 ? (state.currentLevel + 1) : null;
    const nextDef = nextLevel ? ALCHEMY_LEVELS[nextLevel as AlchemyLevel] : null;

    const progress = (nextDef && currentDef)
        ? ((state.totalExp - currentDef.minExp) / Math.max(1, nextDef.minExp - currentDef.minExp)) * 100
        : 100;

    return (
        <LiquidGlassContainer
            className="w-full overflow-hidden"
            coreContext={{
                uuid: 'alchemy-progression-main',
                version: '1.0.0',
                status: 'Trustworthy',
                hash_lock: 'LEGACY_SYNC',
                timestamp: Date.now(),
                evidence: [],
                isFrozen: false
            }}
        >
            <div className="relative flex flex-col lg:flex-row items-stretch gap-0 bg-[#0A0C10] min-h-[220px]">
                {/* Visual Masterpiece Side */}
                <div className="relative w-full lg:w-1/3 min-h-[150px] overflow-hidden">
                    <Image 
                        src="/assets/omni/alchemy-lab.png" 
                        alt="Sustainability Alchemy Lab"
                        fill
                        className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-700 scale-110 group-hover:scale-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0A0C10]" />
                    <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)]" />
                    
                    <div className="absolute bottom-4 left-4 flex items-center gap-2">
                        <div className="p-2 bg-omni-primary/20 backdrop-blur-md rounded-lg border border-omni-primary/30">
                            <Sparkles size={20} className="text-omni-primary animate-pulse" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">Active State</span>
                            <span className="text-xs font-black text-white italic tracking-tighter">Sovereign Alchemist</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 p-8 flex flex-col justify-center space-y-6">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        <AlchemyLevelBadge level={state.currentLevel} size="md" />

                        <div className="flex-1 space-y-2 w-full">
                            <div className="flex justify-between items-end">
                                <div className="space-y-0.5">
                                    <h3 className="text-3xl font-black italic tracking-tighter text-white">
                                        {currentDef.title_zh} <span className="text-sm opacity-40 font-mono tracking-normal not-italic ml-2 uppercase">{currentDef.title}</span>
                                    </h3>
                                    <div className="text-[10px] text-omni-primary font-black uppercase tracking-[0.3em]">Evolutionary Progress</div>
                                </div>
                                <div className="text-right font-mono text-xs">
                                    <span className="text-omni-primary font-bold">{state.totalExp}</span>
                                    <span className="mx-1 text-white/20">/</span>
                                    <span className="text-white/60">{nextDef ? nextDef.minExp : 'MAX'}</span>
                                    <span className="ml-2 text-[10px] text-white/30 font-black">EXP</span>
                                </div>
                            </div>

                            {/* Progress Bar */}
                            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10 relative">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ duration: 0.8, ease: "circOut" }}
                                    className="absolute left-0 top-0 h-full bg-gradient-to-r from-omni-primary to-aqua shadow-[0_0_15px_rgba(99,166,176,0.6)]"
                                >
                                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.1)_50%,transparent_75%)] bg-[length:20px_20px] animate-[shimmer_2s_linear_infinite]" />
                                </motion.div>
                            </div>

                            {/* Perks Section */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {currentDef.perks.map((perk, i) => (
                                    <div key={i} className="flex items-center gap-1 text-[9px] px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase font-black tracking-widest">
                                        <ShieldCheck size={10} /> {perk}
                                    </div>
                                ))}
                                {nextDef && (
                                    <div className="flex items-center gap-1 text-[9px] px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-white/30 uppercase font-black tracking-widest">
                                        <Zap size={10} className="text-white/20" /> Next: {nextDef.perks[0]}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
}
