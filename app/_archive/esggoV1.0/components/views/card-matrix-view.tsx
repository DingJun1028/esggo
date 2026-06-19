"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRPGStore } from '@/lib/stores/rpg-store';
import { Hexagon, Sparkles, Trophy, Leaf, Heart, Shield, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CardMatrixView() {
    const { esgCards, unlockedCards, sovereigntyScore } = useRPGStore();

    const suites = [
        { id: 'Spades', label: '環境 (Environment)', color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: Leaf },
        { id: 'Hearts', label: '社會 (Social)', color: 'text-rose-500', bg: 'bg-rose-500/10', icon: Heart },
        { id: 'Clubs', label: '治理 (Governance)', color: 'text-amber-500', bg: 'bg-amber-500/10', icon: Shield },
        { id: 'Diamonds', label: '技術 (Tech)', color: 'text-purple-500', bg: 'bg-purple-500/10', icon: Zap },
    ];

    const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

    return (
        <div className="flex flex-col gap-10 p-4">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-black tracking-tighter uppercase font-headline">52_Card_Matrix <span className="text-stone-300">/</span> 主權卡陣</h2>
                    <p className="text-[11px] text-stone-400 font-bold uppercase tracking-widest mt-1">主權值 / Sovereignty Score: {sovereigntyScore}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="px-6 py-3 bg-black text-white rounded-full flex items-center gap-3">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            已收集 / Collected: {unlockedCards.length} / 52
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                {suites.map((suite) => (
                    <div key={suite.id} className="flex flex-col gap-6">
                        <div className="flex items-center gap-4">
                            <div className={cn("px-4 py-1.5 rounded-full border border-current font-black text-[10px] uppercase tracking-[0.2em]", suite.color)}>
                                {suite.label}
                            </div>
                            <div className="h-px flex-1 bg-stone-200" />
                        </div>

                        <div className="grid grid-cols-4 md:grid-cols-7 lg:grid-cols-13 gap-4">
                            {ranks.map((rank) => {
                                const cardId = `${suite.id}-${rank}`;
                                const isUnlocked = unlockedCards.includes(cardId);
                                const Icon = suite.icon;

                                return (
                                    <motion.div
                                        key={rank}
                                        whileHover={isUnlocked ? { scale: 1.1, rotate: 2, y: -5 } : {}}
                                        className={cn(
                                            "aspect-[2/3] rounded-2xl border transition-all relative overflow-hidden group flex flex-col items-center justify-between p-4",
                                            isUnlocked
                                                ? cn("bg-white shadow-xl border-stone-200", suite.color.replace('text-', 'hover:border-'))
                                                : "bg-stone-50 border-stone-100 opacity-20 grayscale cursor-not-allowed"
                                        )}
                                    >
                                        {/* Rank Indicators */}
                                        <div className={cn("w-full flex justify-between items-start", isUnlocked ? suite.color : "text-stone-300")}>
                                            <span className="text-sm font-black tracking-tighter leading-none">{rank}</span>
                                            <Icon className="w-3 h-3" />
                                        </div>

                                        {/* Center Icon */}
                                        <div className="relative">
                                            <Icon className={cn("w-8 h-8 transition-transform group-hover:scale-125", isUnlocked ? suite.color : "text-stone-200")} />
                                            {isUnlocked && (
                                                <motion.div
                                                    animate={{ opacity: [0.2, 0.5, 0.2], scale: [1, 1.2, 1] }}
                                                    transition={{ duration: 3, repeat: Infinity }}
                                                    className={cn("absolute inset-0 blur-xl -z-10", suite.bg.replace('bg-', 'text-'))}
                                                >
                                                    <Icon className="w-full h-full" />
                                                </motion.div>
                                            )}
                                        </div>

                                        {/* Bot Rank Indicator (inverted) */}
                                        <div className={cn("w-full flex justify-between items-end rotate-180", isUnlocked ? suite.color : "text-stone-300")}>
                                            <span className="text-sm font-black tracking-tighter leading-none">{rank}</span>
                                            <Icon className="w-3 h-3" />
                                        </div>

                                        {isUnlocked && (
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/40 to-white/0 -translate-x-[200%] group-hover:translate-x-[200%] transition-transform duration-1000 pointer-events-none" />
                                        )}
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
