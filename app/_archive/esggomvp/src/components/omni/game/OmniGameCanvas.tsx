"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniCard, OmniCardData } from '../cards/OmniCard';
import { GameMode, OmniGameEngine, GameState } from '@/core/omni-game-engine';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import {
    Zap,
    ShieldAlert,
    Trophy,
    ChevronLeft,
    RefreshCw,
    Activity
} from 'lucide-react';

interface OmniGameCanvasProps {
    mode: GameMode;
    initialCards: OmniCardData[];
    onExit: () => void;
}

export function OmniGameCanvas({ mode, initialCards, onExit }: OmniGameCanvasProps) {
    const [engine] = useState(() => OmniGameEngine.getInstance());
    const [gameState, setGameState] = useState<GameState>(() => engine.startSession(mode, initialCards));
    const [isEnding, setIsEnding] = useState(false);

    const handlePlayCard = async (cardId: string) => {
        try {
            const newState = await engine.playCard(cardId);
            setGameState({ ...newState });
        } catch (e) {
            console.error("Game error:", e);
        }
    };

    const handleEndGame = async () => {
        setIsEnding(true);
        const atom = await engine.endSession();
        console.log("Game result manifested:", atom);
        // Delay for animation
        setTimeout(onExit, 2000);
    };

    // Auto-save logic could go here

    return (
        <div className="fixed inset-0 z-50 bg-[#071520]/95 backdrop-blur-3xl overflow-hidden flex flex-col animate-in fade-in duration-500">
            {/* Header: Status Bar */}
            <div className="h-16 flex items-center justify-between px-8 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-6">
                    <button onClick={onExit} className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-widest uppercase">{mode} TRIAL</h2>
                        <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-aqua animate-pulse" />
                            <span className="text-[10px] font-bold text-aqua tracking-widest uppercase">System Online</span>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-8">
                    {/* Score */}
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Score</span>
                        <span className="text-2xl font-black text-white tabular-nums">{gameState.score}</span>
                    </div>

                    {/* Energy Bar */}
                    <div className="flex flex-col w-48">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Energy</span>
                            <span className="text-[10px] font-black text-aqua tabular-nums">{gameState.energy}%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${gameState.energy}%` }}
                                className="h-full bg-aqua shadow-[0_0_10px_#63a6b0]"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main World Board */}
            <main className="flex-1 relative p-12 overflow-hidden flex flex-col justify-center gap-12">
                {/* Visual Aura based on mode */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,#63a6b033_0%,transparent_70%)]" />

                {/* Challenges / Scenarios Area */}
                <div className="relative z-10 flex-none h-48 flex items-center justify-center">
                    <AnimatePresence mode="wait">
                        {!isEnding ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="liquid-glass p-8 rounded-[2rem] border-white/10 max-w-2xl text-center"
                            >
                                <ShieldAlert size={48} className="mx-auto text-orange-500/50 mb-4 animate-pulse" />
                                <h4 className="text-white font-black text-lg mb-2">當前情境：ESG 數據孤島 (Data Silos)</h4>
                                <p className="text-gray-400 text-sm">各維度數據無法聯動。請選擇具備「智」屬性的卡牌以打破僵局。</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center"
                            >
                                <Trophy size={80} className="mx-auto text-gold mb-6 animate-bounce" />
                                <h3 className="text-4xl font-black text-white mb-2">對局圓滿結束</h3>
                                <p className="text-aqua font-bold tracking-widest">5T 協議正在寫入三方帳本...</p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Hand Area */}
                <div className="relative z-10 flex flex-col gap-6 items-center">
                    <div className="flex gap-4 items-end perspective-1000">
                        {gameState.hand.map((card, i) => (
                            <motion.div
                                key={`${card.card_id}-${i}`}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ y: -40, z: 50 }}
                                className="transition-all"
                                onClick={() => handlePlayCard(card.card_id)}
                            >
                                <OmniCard card={card} size="sm" />
                            </motion.div>
                        ))}
                    </div>

                    <div className="flex items-center gap-4 mt-8">
                        <button
                            onClick={handleEndGame}
                            className="px-12 py-4 bg-aqua text-black font-black uppercase tracking-[0.2em] rounded-full shadow-[0_20px_40px_rgba(99,166,176,0.2)] hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                            disabled={isEnding}
                        >
                            Manifest Result
                        </button>
                        <button className="p-4 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                            <RefreshCw size={20} />
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer: Knowledge Context */}
            <div className="h-20 bg-black/40 border-t border-white/5 flex items-center px-12 gap-12 text-[10px] font-mono tracking-widest text-gray-500 uppercase overflow-x-auto">
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <Activity size={14} className="text-aqua" />
                    <span>Alpha Omega Matrix: Stable</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap">
                    <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                    <span>5T Protocol Sync: 100%</span>
                </div>
                <div className="flex items-center gap-2 whitespace-nowrap ml-auto opacity-50">
                    <span>Ref: {mode}_PROTOCOL_V1</span>
                </div>
            </div>
        </div>
    );
}
