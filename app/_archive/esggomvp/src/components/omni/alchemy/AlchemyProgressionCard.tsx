'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { AlchemyLevelBadge } from './AlchemyLevelBadge';
import { ALCHEMY_LEVELS, IAlchemyState, AlchemyLevel } from '@/core/dtos/AlchemyState.dto';

interface Props {
    state: IAlchemyState;
}

/**
 * 📊 Alchemy Progression Card
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
            glowColor="aqua"
            className="w-full"
            coreContext={{
                uuid: 'alchemy-progression-main',
                version: '1.0.0',
                timestamp: Date.now(),
                evidence: []
            }}
        >
            <div className="flex flex-col md:flex-row items-center gap-8 p-4">
                <AlchemyLevelBadge level={state.currentLevel} size="lg" />

                <div className="flex-1 space-y-4 w-full">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <h3 className="text-2xl font-black italic tracking-tighter">
                                {currentDef.title_zh} <span className="text-sm opacity-50 font-mono tracking-normal not-italic ml-2">{currentDef.title}</span>
                            </h3>
                            <div className="text-[10px] text-white/40 uppercase tracking-widest">Growth Progress</div>
                        </div>
                        <div className="text-right font-mono text-xs">
                            <span className="text-omni-primary">{state.totalExp}</span>
                            <span className="mx-1 text-white/20">/</span>
                            <span>{nextDef ? nextDef.minExp : 'MAX'}</span>
                            <span className="ml-2 opacity-30 text-[10px]">EXP</span>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="h-2 bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className="absolute left-0 top-0 h-full bg-gradient-to-r from-omni-primary via-omni-accent to-omni-primary shadow-[0_0_20px_var(--theme-primary)]"
                        />
                    </div>

                    {/* Perks Section */}
                    <div className="flex flex-wrap gap-2">
                        {currentDef.perks.map((perk, i) => (
                            <span key={i} className="text-[9px] px-2 py-0.5 rounded-full bg-omni-primary/10 border border-omni-primary/20 text-omni-primary uppercase font-bold">
                                ✓ {perk}
                            </span>
                        ))}
                        {nextDef && (
                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-white/40 uppercase font-bold">
                                🔒 Next: {nextDef.perks[0]}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </LiquidGlassContainer>
    );
}
