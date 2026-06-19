'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Skull, HeartPulse, RefreshCw } from 'lucide-react';

export function BattleEngine() {
    const [battleState, setBattleState] = useState<'idle' | 'intro' | 'playing' | 'end'>('idle');
    const [playerHp, setPlayerHp] = useState(100);
    const [bossHp, setBossHp] = useState(250);
    const [turn, setTurn] = useState<number>(1);
    const [actionLog, setActionLog] = useState<string[]>([]);
    const [activeCard, setActiveCard] = useState<number | null>(null);

    // Mock Hand
    const hand = [
        { id: 1, name: "太陽能微電網", type: "E", power: 45, energy: 3, desc: "造成大量環境傷害，破壞碳排放護盾" },
        { id: 2, name: "永續供應鏈審查", type: "G", power: 30, energy: 2, desc: "提升自身治理防禦力" },
        { id: 3, name: "多元培力計畫", type: "S", power: 25, energy: 2, desc: "恢復自身 HP" },
    ];

    const startBattle = () => {
        setBattleState('intro');
        setPlayerHp(100);
        setBossHp(250);
        setTurn(1);
        setActionLog(["[SYS] 環境危機：『超級碳排放怪獸』已降臨！"]);

        setTimeout(() => setBattleState('playing'), 2500);
    };

    const playCard = (cardIndex: number) => {
        if (battleState !== 'playing') return;

        const card = hand[cardIndex];
        setActiveCard(cardIndex);

        // Log action
        setActionLog(prev => [`[Player] 打出了 <${card.name}>！`, ...prev]);

        setTimeout(() => {
            // Apply Effects
            if (card.type === 'E') {
                setBossHp(prev => Math.max(0, prev - card.power));
                setActionLog(prev => [`[Effect] 對 Boss 造成 ${card.power} 點環境淨化傷害！`, ...prev]);
            } else if (card.type === 'S') {
                setPlayerHp(prev => Math.min(100, prev + card.power));
                setActionLog(prev => [`[Effect] 恢復了 ${card.power} 點社會健康度！`, ...prev]);
            } else {
                setActionLog(prev => [`[Effect] 獲得了 ${card.power} 點治理防禦護盾！`, ...prev]);
            }
            setActiveCard(null);

            // Boss turn logic placeholder
            setTimeout(() => {
                if (bossHp - card.power <= 0) {
                    setBattleState('end');
                    setActionLog(prev => [`[SYS] 戰鬥勝利！危機已解除！`, ...prev]);
                } else {
                    bossTurn();
                }
            }, 1500);

        }, 800);
    };

    const bossTurn = () => {
        setActionLog(prev => [`[Boss] 碳排放怪獸發動了『法規豁免重擊』！`, ...prev]);
        setTimeout(() => {
            setPlayerHp(prev => Math.max(0, prev - 35));
            setTurn(t => t + 1);
            if (playerHp - 35 <= 0) {
                setBattleState('end');
                setActionLog(prev => [`[SYS] 戰鬥失敗...全球平均氣溫上升。`, ...prev]);
            }
        }, 800);
    };

    return (
        <div className="w-full h-full min-h-[600px] bg-black/80 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col font-mono">

            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
            <div className={`absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 ${bossHp < 100 ? 'bg-red-500/20' : 'bg-fuchsia-500/10'}`} />

            {battleState === 'idle' && (
                <div className="absolute inset-0 flex items-center justify-center z-50">
                    <button
                        onClick={startBattle}
                        className="px-8 py-4 bg-white text-black font-bold uppercase tracking-widest rounded-full hover:scale-105 transition-transform flex items-center gap-3"
                    >
                        <Zap className="w-5 h-5" /> Initialize Battle Engine
                    </button>
                </div>
            )}

            <AnimatePresence>
                {battleState === 'intro' && (
                    <motion.div
                        initial={{ opacity: 0, scale: 1.2 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="absolute inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    >
                        <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500 italic tracking-widest text-center">
                            WARNING: <br /><span className="text-3xl">EXTREME CARBON EMISSION DETECTED</span>
                        </h2>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Battle Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center relative z-10 bg-black/40">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/50">
                        <HeartPulse className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <div className="text-xs text-white/50 uppercase tracking-widest">Player HP</div>
                        <div className="text-2xl font-bold text-white flex items-center gap-2">
                            {playerHp} <span className="text-sm text-white/30">/ 100</span>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Turn {turn}</div>
                    <div className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-emerald-400">
                        PLAYER PHASE
                    </div>
                </div>

                <div className="flex items-center gap-4 text-right">
                    <div>
                        <div className="text-xs text-red-400/70 uppercase tracking-widest">Boss HP</div>
                        <div className="text-2xl font-bold text-red-400 flex items-center gap-2 justify-end">
                            {bossHp} <span className="text-sm text-red-400/30">/ 250</span>
                        </div>
                    </div>
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
                        <Skull className="w-6 h-6 text-red-500" />
                    </div>
                </div>
            </div>

            {/* Battle Arena */}
            <div className="flex-1 relative z-10 flex flex-col items-center justify-center p-8">
                {/* Boss Entity Placeholder */}
                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="w-48 h-48 rounded-full bg-gradient-to-br from-red-900/50 to-black border-2 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] flex items-center justify-center relative mb-12"
                >
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay rounded-full" />
                    <Skull className="w-20 h-20 text-red-500 opacity-80" />
                    <div className="absolute -bottom-6 bg-black/80 px-4 py-1 rounded-full border border-red-500/30 text-xs font-bold tracking-widest text-red-400 uppercase">
                        Carbon Behemoth
                    </div>
                </motion.div>

                {/* Hand Cards */}
                <div className="flex gap-4 items-end justify-center w-full mt-auto relative h-48">
                    {hand.map((card, idx) => (
                        <motion.div
                            key={card.id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{
                                y: activeCard === idx ? -50 : 0,
                                opacity: battleState === 'playing' ? 1 : 0.5,
                                scale: activeCard === idx ? 1.1 : 1,
                                zIndex: activeCard === idx ? 50 : 10
                            }}
                            whileHover={battleState === 'playing' && activeCard === null ? { y: -20, scale: 1.05 } : {}}
                            onClick={() => playCard(idx)}
                            className={`w-36 h-48 rounded-xl bg-black border ${card.type === 'E' ? 'border-emerald-500/50' :
                                    card.type === 'S' ? 'border-blue-500/50' : 'border-amber-500/50'
                                } shadow-xl relative overflow-hidden cursor-pointer flex flex-col transition-shadow hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]`}
                        >
                            <div className={`absolute inset-0 opacity-20 bg-gradient-to-b ${card.type === 'E' ? 'from-emerald-500' :
                                    card.type === 'S' ? 'from-blue-500' : 'from-amber-500'
                                } to-transparent`} />

                            <div className="p-3 relative z-10 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-2">
                                    <div className={`text-xs font-bold px-1.5 py-0.5 rounded border ${card.type === 'E' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                                            card.type === 'S' ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-amber-500/20 border-amber-500/50 text-amber-400'
                                        }`}>
                                        {card.type}
                                    </div>
                                    <div className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] text-white">
                                        {card.energy}
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-white leading-tight mb-2">{card.name}</h4>
                                <div className="mt-auto">
                                    <div className="w-full bg-white/5 rounded p-1.5 text-[10px] leading-tight text-white/60">
                                        {card.desc}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Action Log Overlay */}
            <div className="absolute right-6 top-24 w-64 max-h-[300px] overflow-y-auto v-scrollbar-hidden flex flex-col gap-2 z-40 pointer-events-none">
                <AnimatePresence>
                    {actionLog.map((log, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`text-xs px-3 py-2 rounded-lg bg-black/60 backdrop-blur-md border ${log.includes('系統') || log.includes('SYS') ? 'border-fuchsia-500/30 text-fuchsia-300' :
                                    log.includes('Effect') ? 'border-emerald-500/30 text-emerald-300' :
                                        log.includes('Boss') ? 'border-red-500/30 text-red-300' :
                                            'border-white/10 text-white/70'
                                }`}
                        >
                            {log}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* End Screen */}
            <AnimatePresence>
                {battleState === 'end' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md"
                    >
                        <h2 className={`text-4xl font-black italic tracking-widest mb-4 ${playerHp > 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                            {playerHp > 0 ? 'VICTORY ACHIEVED' : 'MISSION FAILED'}
                        </h2>
                        <p className="text-white/50 mb-8 max-w-sm text-center">
                            {playerHp > 0 ? '成功擊退碳排放怪獸，獲得 50 KP 與 1 枚影響力寶石。' : '系統失守，建議回到 Knowledge Forge 強化卡牌庫後再戰。'}
                        </p>
                        <button
                            onClick={startBattle}
                            className="px-6 py-2 border border-white/20 text-white rounded-full hover:bg-white/10 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest"
                        >
                            <RefreshCw className="w-4 h-4" /> RESTART SIMULATION
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
