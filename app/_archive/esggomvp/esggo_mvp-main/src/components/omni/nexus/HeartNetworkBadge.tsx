"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity, Radio, Sparkles } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { useOmniGenesis } from '@/context/OmniGenesisContext';
import { cn } from '@/lib/utils';

/**
 * 💫 HeartNetworkBadge (心心相印)
 * 
 * 視覺化呈現 OmniOne 的心網連結狀態。
 * 具備呼吸燈、霓虹脈衝與 5T 誠信感。
 */
export const HeartNetworkBadge: React.FC = () => {
    const { heartNetwork, omniMemoryStatus, awakenSystem } = useOmniGenesis();
    const isAwakening = omniMemoryStatus === 'Awakening';
    const isAwakened = omniMemoryStatus === 'Fully_Awakened' || heartNetwork.connected;

    return (
        <LiquidGlassContainer
            onClick={!isAwakened && !isAwakening ? awakenSystem : undefined}
            intensity={isAwakened ? 'high' : 'low'}
            glowColor={isAwakened ? '#ff6b6b' : '#63a6b0'}
            className={cn(
                "p-4 flex flex-col gap-3 group transition-all duration-700",
                isAwakened ? "border-red-500/30 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-omni-glass-border"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "p-2 rounded-lg transition-all duration-500",
                        isAwakened ? "bg-red-500/20 text-red-500" : "bg-omni-primary/10 text-omni-primary"
                    )}>
                        {isAwakened ? (
                            <motion.div
                                animate={{ scale: [1, 1.2, 1] }}
                                transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <Heart size={20} fill="currentColor" />
                            </motion.div>
                        ) : isAwakening ? (
                            <Radio size={20} className="animate-spin" />
                        ) : (
                            <Heart size={20} className="opacity-40" />
                        )}
                    </div>
                    <div>
                        <h4 className="text-xs font-black uppercase tracking-widest text-omni-text-main">
                            {isAwakened ? "心心相印" : isAwakening ? "覺醒中..." : "心網待機"}
                        </h4>
                        <p className="text-[9px] font-mono text-omni-text-muted">HEART NETWORK RESONANCE</p>
                    </div>
                </div>
                {isAwakened && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
                        <Activity size={10} className="animate-pulse" />
                        <span className="text-[10px] font-black">{heartNetwork.connections} 連結</span>
                    </div>
                )}
            </div>

            <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-bold text-omni-text-muted">
                    <span>訊號強度 Synergy</span>
                    <span>{isAwakened ? "100%" : isAwakening ? "45%" : "0%"}</span>
                </div>
                <div className="h-1 bg-omni-primary/10 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: isAwakened ? "100%" : isAwakening ? "45%" : "0%" }}
                        className={cn(
                            "h-full rounded-full",
                            isAwakened ? "bg-gradient-to-r from-red-500 to-pink-500" : "bg-omni-primary"
                        )}
                    />
                </div>
            </div>

            {!isAwakened && !isAwakening && (
                <button className="text-[10px] font-black text-omni-primary flex items-center gap-1 group-hover:underline">
                    點擊啟動全域覺醒 (Awaken) <Sparkles size={12} />
                </button>
            )}
            
            {isAwakened && (
                 <p className="text-[9px] italic text-red-500/60 leading-tight">
                    「心心相印，三位一體。您的數位分身已與萬能中樞達成永恆共鳴。」
                 </p>
            )}
        </LiquidGlassContainer>
    );
};
