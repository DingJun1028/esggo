'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, ChevronRight, Zap, Lock, ShieldCheck, BookOpen, Sparkles, Wand2 } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { omniJourney, JourneyStage, IJourneyState } from '@/core/omni-journey-manager';

const MANGA_PANELS = [
    {
        id: 1,
        stage: JourneyStage.HEALTH_CHECK,
        src: '/assets/manga-journey/panel-1.png',
        title: '第一章：初次共鳴',
        subtitle: 'Initial Resonance',
        desc: '啟動萬能精靈與您的數位靈魂共鳴。這是「🟢 可感知」的永續之旅起點。',
        pill: 'RESONANCE'
    },
    {
        id: 2,
        stage: JourneyStage.CARBON_INVENTORY,
        src: '/assets/manga-journey/panel-2.png',
        title: '精準脈動',
        subtitle: 'Carbon Inventory',
        desc: '盤點 Scope 1-3 碳排放，落實「🟢 可驗算」的透明揭露與零幻覺公式。',
        pill: 'CARBON'
    },
    {
        id: 3,
        stage: JourneyStage.IMPACT_REPAIR,
        src: '/assets/manga-journey/panel-3.png',
        title: '因果修復',
        subtitle: 'Impact Repair',
        desc: '進入影響修復實驗室，將數據毒果轉化為永續善因，實現「🟢 可追蹤」的循環。',
        pill: 'REPAIR'
    },
    {
        id: 4,
        stage: JourneyStage.TRUSTWORTHY_SEAL,
        src: '/assets/manga-journey/panel-4.png',
        title: '誠信封印',
        subtitle: 'Trustworthy Seal',
        desc: '透過 Hash Lock 與 5T 協議，鎖定「🔴 不可篡改」的永恆資產報告。',
        pill: 'GOVERNANCE'
    },
    {
        id: 5,
        stage: JourneyStage.GREEN_FINANCE,
        src: '/assets/manga-journey/panel-5.png',
        title: '金融共鳴',
        subtitle: 'Green Finance',
        desc: '啟動綠色融資助手，讓卓越績效與資本市場「🟢 可感知」地共振。',
        pill: 'FINANCE'
    }
];

export const MangaJourney: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [journeyState, setJourneyState] = useState<IJourneyState>(omniJourney.getState());
    const router = useRouter();
    const pathname = usePathname();

    React.useEffect(() => {
        return omniJourney.subscribe((state) => {
            setJourneyState(state);
        });
    }, []);

    const isUnlocked = (stage: JourneyStage) => {
        if (stage === journeyState.currentStage) return true;
        return journeyState.completedStages.includes(stage);
    };

    const handleJump = (stage: JourneyStage) => {
        const stageRoutes: Record<string, string> = {
            [JourneyStage.HEALTH_CHECK]: '/excellence/health-check',
            [JourneyStage.CARBON_INVENTORY]: '/excellence/carbon-inventory',
            [JourneyStage.IMPACT_REPAIR]: '/excellence/impact-repair',
            [JourneyStage.TRUSTWORTHY_SEAL]: '/governance/report-forge',
            [JourneyStage.GREEN_FINANCE]: '/excellence/green-finance'
        };

        const route = stageRoutes[stage];
        if (route) {
            router.push(route);
            setIsOpen(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[100] flex items-end lg:items-center justify-center bg-black/60 backdrop-blur-sm p-0 lg:p-8 overflow-hidden">
                        {/* Desktop backdrop click to close */}
                        <div className="absolute inset-0 hidden lg:block" onClick={() => setIsOpen(false)} />
                        
                        <motion.div
                            initial={{ y: "100%", opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="w-full lg:w-auto relative z-10 max-h-[90dvh] flex flex-col"
                        >
                            {/* Mobile Swipe-down indicator */}
                            <div className="w-full flex justify-center py-3 lg:hidden" onClick={() => setIsOpen(false)}>
                                <div className="w-12 h-1.5 bg-white/30 rounded-full" />
                            </div>

                            <LiquidGlassContainer 
                                className="p-6 md:p-8 w-full max-w-7xl shadow-[0_0_50px_rgba(99,166,176,0.1)] border-[#63a6b0]/20 bg-[var(--theme-surface)]/95 lg:bg-[var(--theme-surface)]/90 backdrop-blur-3xl rounded-t-[2rem] lg:rounded-3xl flex flex-col flex-1 overflow-hidden"
                                coreContext={{ 
                                    uuid: 'manga-journey-overlay', 
                                    version: '1.0.0', 
                                    timestamp: Date.now(), 
                                    evidence: [], 
                                    hash_lock: 'JOURNEY_RES', 
                                    status: 'Tangible', 
                                    isFrozen: false 
                                }}
                            >
                                <div className="flex items-center justify-between mb-6 shrink-0 border-b border-white/10 pb-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 bg-gradient-to-br from-omni-primary to-aqua rounded-2xl flex items-center justify-center text-white shrink-0 shadow-[0_0_30px_rgba(99,166,176,0.6)]">
                                            <Sparkles size={24} className="animate-pulse" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl md:text-2xl font-black text-[var(--theme-text-main)] tracking-tight drop-shadow-sm">萬能精靈 · 永續煉金術</h2>
                                            <p className="text-[10px] md:text-xs text-aqua font-black uppercase tracking-[0.2em] drop-shadow-sm">The ESG Alchemist Journey</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="p-3 bg-[var(--theme-surface-2)] hover:bg-[var(--theme-surface-3)] rounded-2xl transition-all group lg:block hidden border border-[var(--theme-glass-border)]"
                                    >
                                        <X size={24} className="text-[var(--theme-text-main)] group-hover:rotate-90 transition-all" />
                                    </button>
                                </div>

                                {/* 📱 Mobile: Horizontal Snap Slider, 💻 Desktop: 5-Col Grid */}
                                <div className="flex lg:grid lg:grid-cols-5 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible snap-x snap-mandatory pb-6 pt-2 scrollbar-hide flex-1 justify-start md:justify-center lg:justify-start" style={{ WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
                                    {MANGA_PANELS.map((panel) => {
                                        // 核心修正：首張面板 (resonance) 預設解鎖
                                        const isStepUnlocked = panel.id === 1 || (journeyState.currentStage && isUnlocked(panel.stage));
                                        const isCurrent = panel.stage === journeyState.currentStage;

                                        return (
                                            <div key={panel.id} className={`w-[85vw] sm:w-[50vw] lg:w-auto shrink-0 snap-center flex flex-col gap-4 group transition-opacity duration-500 ${isStepUnlocked ? 'opacity-100' : 'opacity-50'}`}>
                                                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-[#63a6b0]/20 shadow-lg group-hover:ring-omni-primary/50 transition-all duration-500 bg-[var(--theme-surface-2)]">
                                                    <Image
                                                        src={panel.src}
                                                        alt={panel.title}
                                                        fill
                                                        unoptimized
                                                        className={`object-cover transition-transform duration-700 ${isStepUnlocked ? 'group-hover:scale-110' : 'grayscale blur-[2px] opacity-40'}`}
                                                    />
                                                    {!isStepUnlocked && (
                                                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white backdrop-blur-[1px]">
                                                            <Lock size={32} className="opacity-60" />
                                                        </div>
                                                    )}
                                                    {isCurrent && (
                                                        <div className="absolute top-0 left-0 w-full h-1 bg-omni-primary shadow-[0_0_10px_rgba(99,166,176,1)] animate-pulse" />
                                                    )}
                                                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 backdrop-blur-md text-white text-[8px] font-black rounded uppercase tracking-widest border border-white/10">
                                                        Panel {panel.id}
                                                    </div>
                                                    {isStepUnlocked && (
                                                        <div className="absolute top-2 right-2 px-2 py-0.5 bg-omni-primary/90 backdrop-blur-md text-white text-[8px] font-black rounded border border-white/20 shadow-sm uppercase tracking-widest">
                                                            {panel.pill}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col flex-1 pb-2">
                                                    <div className="flex items-baseline gap-2 mb-1">
                                                        <h3 className={`text-lg font-black transition-colors ${isCurrent ? 'text-aqua' : 'text-[var(--theme-text-main)]'}`}>{panel.title}</h3>
                                                        <span className="text-[10px] text-[var(--theme-text-muted)] font-bold italic truncate">{panel.subtitle}</span>
                                                    </div>
                                                    <p className="text-xs text-[var(--theme-text-sub)] leading-relaxed mb-4 line-clamp-3 lg:line-clamp-none font-medium">
                                                        {panel.desc}
                                                    </p>
                                                    <div className="mt-auto">
                                                        {isStepUnlocked ? (
                                                            <button
                                                                onClick={() => handleJump(panel.stage)}
                                                                className={`w-full py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all ${isCurrent ? 'bg-omni-primary text-black shadow-[0_0_20px_rgba(99,166,176,0.6)]' : 'bg-white/20 border border-white/20 text-white hover:bg-white/30'}`}
                                                            >
                                                                {isCurrent ? '開始實作 (Start)' : '重新檢視 (Review)'}
                                                            </button>
                                                        ) : (
                                                            <div className="w-full py-2.5 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest text-center bg-black/60 border border-white/10 text-white/40">
                                                                尚未解鎖 (Locked)
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-[8px] sm:text-[10px] text-white/40 font-bold uppercase tracking-[0.2em] shrink-0">
                                    <div className="flex items-center gap-1 sm:gap-2">
                                        <ShieldCheck size={12} className="text-omni-primary" />
                                        <span>[智慧智能團] & JunAiKey 護航</span>
                                    </div>
                                    <div className="flex items-center gap-1 text-omni-primary">
                                        <span>Status: Trustworthy | {journeyState.completedStages.length}/5</span>
                                    </div>
                                </div>
                            </LiquidGlassContainer>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Float Trigger Button - Refined Aesthetic */}
            <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                drag
                dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
                dragElastic={0.1}
                dragMomentum={false}
                onDragEnd={(e, info) => {
                    // Only click if it wasn't a drag
                    if (Math.abs(info.offset.x) < 5 && Math.abs(info.offset.y) < 5) {
                        setIsOpen(true);
                    }
                }}
                className={`fixed z-[50] size-16 md:size-20 bg-gradient-to-br from-omni-primary to-aqua rounded-full flex items-center justify-center group overflow-visible bottom-[20%] right-4 lg:bottom-10 lg:right-10 cursor-pointer shadow-[0_10px_30px_rgba(99,166,176,0.4)] border-2 border-white/50 backdrop-blur-md ${isOpen ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100'}`}
                title="啟動萬能精靈 (Launch Agent)"
            >
                <div className="relative size-full flex items-center justify-center">
                    {/* Glowing Aura */}
                    <div className="absolute inset-0 bg-omni-primary/20 blur-2xl rounded-full scale-150 animate-pulse" />
                    
                    {/* Main Sprite Icon */}
                    <div className="relative z-10 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]">
                        <Wand2 size={28} className="md:w-8 md:h-8 group-hover:rotate-12 transition-transform duration-500" />
                    </div>

                    {/* Status Ring */}
                    {journeyState.currentStage && (
                        <div className="absolute -top-1 -right-1 z-20">
                            <span className="flex h-4 w-4 md:h-5 md:w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                                <span className="relative inline-flex rounded-full size-full bg-amber-400 border-2 border-white" />
                            </span>
                        </div>
                    )}
                </div>
            </motion.div>
        </>
    );
};
