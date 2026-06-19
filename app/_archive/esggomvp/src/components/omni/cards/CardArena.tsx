'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Swords, Sword, Shield, Zap, Sparkles, BookOpen, Crown, Ghost, Globe2, ArrowLeft } from 'lucide-react';
import { BattleEngine } from './BattleEngine';

const GAME_MODES = [
    { id: 'practice', name: '單人特訓', desc: '與 Dr. Thoth 進行模擬對戰', icon: BookOpen, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { id: 'ranked', name: '天梯對戰', desc: '企業影響力非同步 PvP 對決', icon: Crown, color: 'text-amber-400', bg: 'bg-amber-400/10' },
    { id: 'campaign', name: '冒險戰役', desc: '挑戰全球環境危機關卡', icon: Swords, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
    { id: 'raid', name: '合作討伐', desc: '全服對抗「超級碳排放怪獸」', icon: Shield, color: 'text-rose-400', bg: 'bg-rose-400/10' },
    { id: 'sandbox', name: '沙盒構築', desc: '無限資源的虛擬環境測試戰術', icon: Zap, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { id: 'alliance', name: '聯盟挑戰', desc: '供應鏈生態圈團體積分戰', icon: Globe2, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
    { id: 'roguelike', name: '生存肉鴿', desc: '隨機災急事件極限資源生存', icon: Ghost, color: 'text-neutral-400', bg: 'bg-neutral-400/10' },
];

export function CardArena() {
    const [selectedMode, setSelectedMode] = useState<string | null>(null);
    const [inBattle, setInBattle] = useState(false);

    if (inBattle) {
        return (
            <div className="w-full h-full flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-500">
                <button
                    onClick={() => { setInBattle(false); setSelectedMode(null); }}
                    className="self-start flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-sm font-mono tracking-widest text-white/70 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" /> ABORT BATTLE
                </button>
                <BattleEngine />
            </div>
        );
    }

    return (
        <div className="w-full">
            <h2 className="text-2xl font-black italic tracking-widest text-white mb-6 flex items-center gap-3">
                <Swords className="w-8 h-8 text-rose-500" />
                RPG ARENA <span className="text-sm text-omni-primary/50 uppercase tracking-normal font-mono not-italic relative top-1">Select Battle Mode</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {GAME_MODES.map((mode, idx) => (
                    <motion.div
                        key={mode.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedMode(mode.id)}
                        className={`cursor-pointer rounded-2xl border transition-all duration-300 overflow-hidden relative ${selectedMode === mode.id
                                ? 'bg-white/10 border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.1)]'
                                : 'bg-black/40 border-white/5 hover:border-white/20'
                            }`}
                    >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <div className="p-6 relative z-10">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${mode.bg}`}>
                                <mode.icon className={`w-6 h-6 ${mode.color}`} />
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">{mode.name}</h3>
                            <p className="text-xs text-white/50 leading-relaxed font-mono">{mode.desc}</p>
                        </div>

                        {/* Animated background glow on select */}
                        {selectedMode === mode.id && (
                            <motion.div
                                layoutId="arenaSelectGlow"
                                className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"
                                initial={false}
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                    </motion.div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                {selectedMode && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-8 bg-black/60 border border-white/10 rounded-2xl p-8 relative overflow-hidden"
                    >
                        <div className="absolute top-[-50px] right-[-50px] w-64 h-64 bg-omni-primary/10 blur-[80px] rounded-full pointer-events-none" />

                        <div className="relative z-10 flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
                                <Sword className="w-8 h-8 text-rose-400" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">準備進入 {GAME_MODES.find(m => m.id === selectedMode)?.name}</h3>
                            <p className="text-sm text-white/40 mb-6 max-w-md">
                                即將載入戰鬥引擎，請確認您的牌組與資源狀態。
                                本模式將暫時消耗 10 點行動力。
                            </p>
                            <button
                                onClick={() => setInBattle(true)}
                                className="bg-white text-black font-bold uppercase tracking-widest text-sm px-8 py-3 rounded-full hover:bg-rose-500 hover:text-white hover:shadow-[0_0_30px_rgba(244,63,94,0.4)] transition-all flex items-center gap-2"
                            >
                                <Zap className="w-4 h-4" /> Initialize Engine
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
