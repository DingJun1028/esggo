'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlchemyProgressionCard } from '@/components/omni/alchemy/AlchemyProgressionCard';
import { AlchemyEngine } from '@/core/alchemy-engine';
import { ALCHEMY_ACHIEVEMENTS } from '@/core/dtos/AlchemyState.dto';
import { Sparkles, Trophy, Lock, Unlock, Zap, Search, ShieldCheck } from 'lucide-react';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { IComponentCore } from '@/core/IComponentCore';
import { OmniMangaTutorial } from "@/components/omni/UI/OmniMangaTutorial";

const ALCHEMY_MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga/alchemy-panel-1.png',
        title: '知識攝入',
        description: '透過與系統的每一次互動，將零散的動向轉化為個人的學習種子。',
        pill: 'INGEST'
    },
    {
        id: 2,
        src: '/assets/manga/alchemy-panel-2.png',
        title: '技能進階',
        description: '在煉金爐中淬鍊知識，提升您的共鳴等級（Resonance Rank）與專業維度。',
        pill: 'LEVEL UP'
    },
    {
        id: 3,
        src: '/assets/manga/alchemy-panel-3.png',
        title: '成就解鎖',
        description: '達成特定的 5T 實踐里程碑，解鎖具備不可篡改特性的數位榮譽勳章。',
        pill: 'UNLOCK'
    },
    {
        id: 4,
        src: '/assets/manga/alchemy-panel-4.png',
        title: '資產轉化',
        description: '將學會的技能封印為可交易、可證明的數位資產，實現知識價值的「圓滿」。',
        pill: 'CONVERT'
    }
];

/**
 * 🏛️ 學習 Alchemy Dashboard
 * 以使用者為中心的成長展示頁面。
 */
export default function AlchemyDashboard() {
    const [state, setState] = useState(AlchemyEngine.getState());

    useEffect(() => {
        // Initial load
        const currentState = AlchemyEngine.getState();
        setState(currentState);
    }, []);

    const handleAchievementUnlock = async (id: string) => {
        const { success } = await AlchemyEngine.unlockAchievement(id);
        if (success) {
            setState(AlchemyEngine.getState());
        }
    };

    const iconMap: any = {
        Zap: <Zap className="w-5 h-5" />,
        Search: <Search className="w-5 h-5" />,
        ShieldCheck: <ShieldCheck className="w-5 h-5" />
    };

    return (
        <main className="space-y-12 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl font-black italic tracking-tighter flex items-center gap-3">
                        <Sparkles className="text-omni-primary w-8 h-8" />
                        學習 <span className="text-omni-primary primary-glow">Alchemy</span>
                    </h1>
                    <p className="text-sm text-white/40 font-mono tracking-widest uppercase">
                        Service is Teaching · Knowledge is Asset
                    </p>
                </div>

                <div className="flex items-center gap-4 bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-xl">
                    <div className="text-right">
                        <div className="text-[10px] text-white/30 uppercase font-black">Resonance Rank</div>
                        <div className="text-xl font-black italic text-omni-primary">TOP 12%</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <Trophy className="text-omni-accent w-6 h-6" />
                </div>
            </div>

            {/* 📖 漫畫教學導引 - Global Manifestation */}
            <div className="relative z-10">
                <OmniMangaTutorial 
                    title="Learning Alchemy：進化路徑導引" 
                    subtitle="Service is Teaching · Knowledge is Asset" 
                    panels={ALCHEMY_MANGA_PANELS} 
                />
            </div>

            {/* Progression Visualization */}
            <AlchemyProgressionCard state={state} />

            {/* Achievement Matrix */}
            <section className="space-y-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black italic tracking-tight">成就矩陣 (Achievement Matrix)</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALCHEMY_ACHIEVEMENTS.map((ach) => {
                        const isUnlocked = state.unlockedAchievements.includes(ach.id);
                        return (
                            <div
                                key={ach.id}
                                onClick={() => !isUnlocked && handleAchievementUnlock(ach.id)}
                                className="cursor-pointer"
                            >
                                <LiquidGlassContainer
                                    intensity="low"
                                    className={`group transition-all duration-500 ${isUnlocked ? 'border-omni-primary/30' : 'opacity-60 saturate-50 hover:opacity-100'}`}
                                    coreContext={{
                                        uuid: ach.id,
                                        version: '1.0.0',
                                        timestamp: Date.now(),
                                        evidence: [] as any,
                                        hash_lock: '',
                                        status: 'Tangible',
                                        isFrozen: false
                                    }}
                                >
                                    <div className="flex gap-4 p-2 relative overflow-hidden">
                                        {/* Locked Overlay */}
                                        {!isUnlocked && (
                                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-10 flex items-center justify-center">
                                                <Lock className="text-white/20 w-8 h-8" />
                                            </div>
                                        )}

                                        <div className={`size-14 rounded-xl flex items-center justify-center border transition-transform duration-700 group-hover:scale-110 group-hover:rotate-3 ${isUnlocked ? 'bg-omni-primary/20 border-omni-primary/40 text-omni-primary shadow-[0_0_20px_var(--theme-primary-muted)]' : 'bg-white/5 border-white/10 text-white/20'}`}>
                                            {iconMap[ach.icon] || <Trophy className="w-6 h-6" />}
                                        </div>

                                        <div className="flex-1 space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h4 className={`font-bold italic ${isUnlocked ? 'text-white' : 'text-white/40'}`}>{ach.name_zh}</h4>
                                                <span className="text-[9px] font-mono text-omni-primary">+{ach.expReward} EXP</span>
                                            </div>
                                            <p className="text-[11px] leading-tight text-white/30 group-hover:text-white/50 transition-colors uppercase font-mono">
                                                {ach.description}
                                            </p>
                                            {isUnlocked && (
                                                <div className="flex items-center gap-1 mt-2 text-[8px] font-black text-omni-primary uppercase tracking-widest">
                                                    <Unlock size={10} /> Unlocked
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </LiquidGlassContainer>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* Path to Transcendance (Hint for future levels) */}
            <LiquidGlassContainer
                glowColor="indigo"
                intensity="medium"
                className="bg-indigo-500/5 border-indigo-500/20"
                coreContext={{ uuid: 'alchemy-footer-hint', version: '1.0.0', timestamp: Date.now(), evidence: [], hash_lock: '', status: 'Tangible', isFrozen: false }}
            >
                <div className="text-center py-6 space-y-3">
                    <p className="text-sm italic text-indigo-200/60 font-medium">
                        「上善若水，善向永續。您的每一分知識積累，都將化為永恆不滅的數位資產。」
                    </p>
                    <div className="text-[10px] text-white/20 uppercase tracking-[0.4em]">
                        Connected to Gnosis Engine Matrix
                    </div>
                </div>
            </LiquidGlassContainer>
        </main>
    );
}
