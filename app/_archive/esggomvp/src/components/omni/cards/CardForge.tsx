'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Sparkles, Database, Layers, CheckCircle2 } from 'lucide-react';

export function CardForge() {
    const [kp, setKp] = useState(1250); // Mock ESG Knowledge Points
    const [isForging, setIsForging] = useState(false);
    const [forgedCard, setForgedCard] = useState<{ name: string; rarity: string; color: string } | null>(null);

    const handleForge = () => {
        if (kp < 100) return;
        setKp(k => k - 100);
        setIsForging(true);
        setForgedCard(null);

        // Simulate forge delay
        setTimeout(() => {
            const rarities = [
                { r: 'Common', c: 'text-stone-300', n: '資料盤查者' },
                { r: 'Rare', c: 'text-blue-400', n: '碳中和先鋒' },
                { r: 'Epic', c: 'text-purple-500', n: '5T 協議守護者' },
                { r: 'Legendary', c: 'text-amber-400', n: '黃金絲線溯源巨龍' }
            ];

            // Random drop logic
            const rand = Math.random();
            let drop = rarities[0];
            if (rand > 0.6) drop = rarities[1];
            if (rand > 0.85) drop = rarities[2];
            if (rand > 0.98) drop = rarities[3];

            setForgedCard({ name: drop.n, rarity: drop.r, color: drop.c });
            setIsForging(false);
        }, 3000);
    };

    return (
        <div className="w-full flex flex-col md:flex-row gap-8">
            {/* Forge Panel */}
            <div className="w-full md:w-1/3 bg-black/40 border border-amber-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col">
                <div className="absolute top-0 left-[-20%] w-[150%] h-[150%] bg-gradient-radial from-amber-500/10 to-transparent blur-[60px] pointer-events-none" />

                <div className="relative z-10 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <Flame className="w-8 h-8 text-amber-500" />
                        <div>
                            <h2 className="text-2xl font-black italic tracking-wide text-white">KNOWLEDGE FORGE</h2>
                            <p className="text-[10px] text-amber-500/70 tracking-widest uppercase font-mono">ESG 知識熔爐</p>
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 mb-8 flex justify-between items-center border border-white/5">
                        <span className="text-sm text-white/50 font-mono">Accumulated ESG KP</span>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-emerald-400" />
                            <span className="font-mono text-xl text-white font-bold">{kp}</span>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center py-10">
                        <div className="mb-8 text-center">
                            <p className="text-sm text-white/40 mb-2">消耗 100 KP 進行一次隨機卡牌鑄造。</p>
                            <p className="text-xs text-amber-500/50">有機率獲得 Legendary 黃金絲線卡牌。</p>
                        </div>

                        <button
                            onClick={handleForge}
                            disabled={isForging || kp < 100}
                            className={`relative px-8 py-4 rounded-full font-bold uppercase tracking-widest transition-all ${isForging || kp < 100
                                    ? 'bg-white/5 text-white/30 cursor-not-allowed'
                                    : 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_30px_rgba(245,158,11,0.3)] hover:scale-105'
                                }`}
                        >
                            {isForging ? 'Forging in Core...' : 'Forge Standard Card'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Display Area */}
            <div className="w-full md:w-2/3 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-8 flex items-center justify-center relative min-h-[500px]">
                <AnimatePresence mode="wait">
                    {isForging ? (
                        <motion.div
                            key="forging"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.2, filter: 'blur(10px)' }}
                            className="flex flex-col items-center gap-6"
                        >
                            <div className="relative w-32 h-44 bg-black/80 border-2 border-amber-500/50 rounded-xl flex items-center justify-center overflow-hidden">
                                <div className="absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-amber-500/40 to-transparent animate-pulse" />
                                <Flame className="w-12 h-12 text-amber-500 animate-bounce" />
                            </div>
                            <div className="text-amber-500 font-mono text-sm tracking-widest animate-pulse flex items-center gap-2">
                                <Database className="w-4 h-4 animate-spin-slow" />
                                EXTRACTING ESG RESONANCE...
                            </div>
                        </motion.div>
                    ) : forgedCard ? (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 50, scale: 0.5, rotateY: 90 }}
                            animate={{ opacity: 1, y: 0, scale: 1, rotateY: 0 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                            className="flex flex-col items-center gap-8"
                        >
                            <div className={`relative w-48 h-64 bg-black border border-white/20 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center p-4`}>
                                {/* Rarity Glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-current opacity-20 pointer-events-none ${forgedCard.color}`} />
                                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />

                                <Layers className={`w-16 h-16 mb-4 ${forgedCard.color}`} />

                                <div className="text-center z-10 w-full">
                                    <div className={`text-[10px] uppercase tracking-[0.3em] mb-1 font-bold ${forgedCard.color}`}>
                                        {forgedCard.rarity}
                                    </div>
                                    <h3 className="text-lg font-black text-white px-2 leading-tight">
                                        {forgedCard.name}
                                    </h3>
                                </div>

                                <div className="absolute bottom-4 left-0 w-full flex justify-center">
                                    <div className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-[8px] text-white/50 font-mono uppercase border border-white/5">
                                        UUID-GEN-OK
                                    </div>
                                </div>
                            </div>

                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex items-center gap-2 text-emerald-400 bg-emerald-400/10 px-4 py-2 rounded-full border border-emerald-400/20 text-sm font-bold"
                            >
                                <CheckCircle2 className="w-4 h-4" />
                                卡牌已加入 Collection
                            </motion.div>
                        </motion.div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-white/20">
                            <Layers className="w-16 h-16 mb-4 opacity-50" />
                            <p className="font-mono text-sm tracking-widest uppercase">Awaiting Forge Command</p>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
