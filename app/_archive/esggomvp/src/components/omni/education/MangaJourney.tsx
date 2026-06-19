'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Info, X, ChevronRight, Zap } from 'lucide-react';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';

const MANGA_PANELS = [
    {
        id: 1,
        src: '/assets/manga-journey/panel-1.png',
        title: '原子覺醒',
        subtitle: 'Atomic Awakening',
        desc: '將混亂數據提純為 5T 永續原子，建立數位真實的起點。',
        pill: 'DATA FORGE'
    },
    {
        id: 2,
        src: '/assets/manga-journey/panel-2.png',
        title: '五室共鳴',
        subtitle: '5 Chambers Resonance',
        desc: '跨域協作，讓 E、S、G 與風險指標在各室中交響共存。',
        pill: 'RESONANCE'
    },
    {
        id: 3,
        src: '/assets/manga-journey/panel-3.png',
        title: '一鍵鑄造',
        subtitle: 'One-Click Foundry',
        desc: '瞬間顯化 500+ 頁永續報告，讓複雜工程化為一指魔法。',
        pill: 'FOUNDRY'
    },
    {
        id: 4,
        src: '/assets/manga-journey/panel-4.png',
        title: '誠信封印',
        subtitle: 'Trust Seal',
        desc: '5T 全域掃描與 Hash Lock 琥珀存封，鎖定永恆資產。',
        pill: 'AGORA'
    }
];

export const MangaJourney: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-8 right-8 z-[60]">
            <AnimatePresence>
                {isOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                        exit={{ opacity: 0, y: 50, scale: 0.9, filter: 'blur(10px)' }}
                        className="mb-4"
                    >
                        <LiquidGlassContainer className="p-8 w-[90vw] max-w-5xl shadow-2xl shadow-omni-primary/20 border-omni-primary/20 border-2">
                            <div className="flex items-center justify-between mb-8">
                                <div className="flex items-center gap-4">
                                    <div className="size-10 bg-omni-primary rounded-xl flex items-center justify-center text-white">
                                        <Zap size={20} className="animate-pulse" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-[#1D1D1F] tracking-tight">客戶旅程：永續煉金術</h2>
                                        <p className="text-xs text-omni-text-sub font-bold uppercase tracking-widest">The ESG Alchemist Journey</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 hover:bg-black/5 rounded-full transition-colors"
                                >
                                    <X size={24} className="text-omni-text-muted" />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {MANGA_PANELS.map((panel) => (
                                    <div key={panel.id} className="flex flex-col gap-4 group">
                                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-lg group-hover:ring-omni-primary/50 transition-all duration-500">
                                            <Image
                                                src={panel.src}
                                                alt={panel.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/80 text-white text-[8px] font-black rounded uppercase tracking-widest">
                                                Panel {panel.id}
                                            </div>
                                            <div className="absolute top-2 right-2 px-2 py-0.5 bg-omni-primary text-white text-[8px] font-black rounded uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                                {panel.pill}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-baseline gap-2 mb-1">
                                                <h3 className="text-lg font-black text-[#1D1D1F]">{panel.title}</h3>
                                                <span className="text-[10px] text-omni-text-muted font-bold italic">{panel.subtitle}</span>
                                            </div>
                                            <p className="text-xs text-omni-text-sub leading-relaxed">
                                                {panel.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 pt-6 border-t border-omni-glass-border flex items-center justify-between text-[10px] text-omni-text-muted font-bold uppercase tracking-[0.2em]">
                                <span>Guided by Dr. Thoth & JunAiKey</span>
                                <div className="flex items-center gap-1 text-omni-primary">
                                    <span>Scroll to explore more</span>
                                    <ChevronRight size={12} />
                                </div>
                            </div>
                        </LiquidGlassContainer>
                    </motion.div>
                ) : (
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsOpen(true)}
                        className="size-14 bg-[#1D1D1F] text-white rounded-2xl flex items-center justify-center shadow-2xl shadow-black/30 border border-white/10 group overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-omni-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Info size={28} className="relative z-10" />
                    </motion.button>
                )}
            </AnimatePresence>
        </div>
    );
};
