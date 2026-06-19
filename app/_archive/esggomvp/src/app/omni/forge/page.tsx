"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Flame, Award, BookOpen, Layers, ShieldCheck, ArrowRight } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { OmniAchievementCard } from '@/components/omni/cards/OmniAchievementCard';
import { OmniComicStrip, ComicPanel } from '@/components/omni/cards/OmniComicStrip';
import { OmniAchievement, IAchievementPayload } from '@/core/OmniAchievementAtom';
import { IOmniAtom } from '@/core/omni-types';
import { toast } from 'sonner';

/**
 * 🛠️ Omni-Forge Page (技能修煉場)
 * 
 * 核心機制：透過「修煉」引導教學，讓每一項服務都成為一個知識點。
 * 貫徹「服務即教學，知識即資產」的本質。
 */
export default function OmniForgePage() {
    const [forging, setForging] = useState<string | null>(null);
    const [progress, setProgress] = useState(0);
    const [achievements, setAchievements] = useState<IOmniAtom<IAchievementPayload>[]>([]);

    const skills = [
        { id: 'S1', title: '環境永續基礎', icon: <BookOpen />, level: 'Basic', exp: 100, desc: '掌握 Scope 1-3 計算方法學。' },
        { id: 'S2', title: '社會責任實踐', icon: <Layers />, level: 'Intermediate', exp: 250, desc: '建立多元包容的韌性組織。' },
        { id: 'S3', title: '關鍵治理指標', icon: <ShieldCheck />, level: 'Advanced', exp: 500, desc: '董事會決策權重與合規監控。' },
    ];

    const startForge = (skill: any) => {
        if (forging) return;
        setForging(skill.id);
        setProgress(0);

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    completeForge(skill);
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
    };

    const completeForge = (skill: any) => {
        setForging(null);
        toast.success(`修煉完成：${skill.title}!`, {
            description: `獲得 ${skill.exp} EXP 及 5T 認證勳章。`,
        });

        // Manifest Achievement Atom
        const achievement = OmniAchievement.forge({
            achievementId: `ACH-F-${skill.id}`,
            title: `${skill.title} 大師`,
            rarity: skill.level === 'Advanced' ? 'Legendary' : 'Rare',
            earnedAt: Date.now()
        });

        setAchievements(prev => [achievement, ...prev]);
    };

    const comicPanels: [ComicPanel, ComicPanel, ComicPanel, ComicPanel] = [
        {
            id: '1',
            title: '1. 知識碎片化',
            description: '企業內部充滿四散的 ESG 知識與法規要求，員工難以有系統地吸收與應用。',
            color: 'danger'
        },
        {
            id: '2',
            title: '2. 收斂與提純',
            description: '將日常 ESG 任務轉化為微型課程，員工在操作系統的同時，不知不覺完成專業學習。',
            color: 'accent'
        },
        {
            id: '3',
            title: '3. 萬能驗算',
            description: '透過嚴謹的 5T 協議（可追溯、可驗證等），確保每一次學習軌跡都是被信任的。',
            color: 'success'
        },
        {
            id: '4',
            title: '4. 資產顯化',
            description: '學習成果自動轉化為「永恆徽章」與實質影響力資產，成就個人與企業的雙贏。',
            color: 'primary'
        }
    ];

    return (
        <div className="min-h-screen bg-omni-surface p-8 relative overflow-hidden">
            {/* Background Glows */}
            <div className="fixed inset-0 pointer-events-none opacity-20">
                <div className="absolute top-[20%] left-[10%] w-[30%] h-[30%] bg-omni-primary blur-[100px] rounded-full animate-pulse" />
                <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[30%] bg-omni-accent blur-[100px] rounded-full animate-pulse [animation-delay:2s]" />
            </div>

            <PageHeader
                title="技能修煉場 (Omni-Forge)"
                subtitle="將知識熔煉為資產，開啟靈知進化之路。"
            />

            <div className="max-w-7xl mx-auto mb-16">
                <OmniComicStrip panels={comicPanels} className="mb-8" />
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">
                {/* Left: Skill list */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Flame className="text-omni-primary" />
                        <h2 className="text-xl font-black uppercase tracking-widest text-slate-800">可修煉技術節點 (Logic Nodes)</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {skills.map(skill => (
                            <LiquidGlassContainer
                                key={skill.id}
                                className={`p-6 space-y-4 transition-all ${forging === skill.id ? 'border-omni-primary ring-2 ring-omni-primary/20 scale-[1.02]' : 'hover:scale-[1.01]'}`}
                                glowColor="#63a6b0"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="size-10 rounded-xl bg-omni-primary/10 flex items-center justify-center text-omni-primary">
                                        {skill.icon}
                                    </div>
                                    <span className="text-[10px] font-black px-2 py-1 bg-omni-surface-2 rounded-full border border-omni-glass-border">
                                        {skill.level}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className="text-lg font-black text-slate-800">{skill.title}</h3>
                                    <p className="text-xs text-slate-500 line-clamp-2">{skill.desc}</p>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-omni-glass-border">
                                    <div className="flex items-center gap-1">
                                        <Zap size={14} className="text-[#ffd700] fill-current" />
                                        <span className="text-xs font-black text-omni-accent">+{skill.exp} EXP</span>
                                    </div>
                                    <button
                                        disabled={!!forging}
                                        onClick={() => startForge(skill)}
                                        className="size-8 rounded-full bg-omni-primary text-white flex items-center justify-center shadow-lg shadow-omni-primary/20 disabled:opacity-50 disabled:cursor-not-allowed group"
                                    >
                                        <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
                                    </button>
                                </div>
                            </LiquidGlassContainer>
                        ))}
                    </div>
                    {/* Forge Reactor Visualization */}
                    <AnimatePresence>
                        {forging && (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="mt-12"
                            >
                                <LiquidGlassContainer className="p-10 border-dashed bg-omni-primary/5 border-omni-primary/40 relative overflow-hidden text-center">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-omni-surface-2">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            className="h-full bg-omni-primary shadow-[0_0_15px_rgba(99,166,176,1)]"
                                        />
                                    </div>

                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                                        className="size-20 mx-auto mb-6 text-omni-primary opacity-40"
                                    >
                                        <Sparkles size={80} strokeWidth={1} />
                                    </motion.div>

                                    <h2 className="text-2xl font-black text-omni-primary animate-pulse tracking-widest">萬能熔爐：鑄造中 (FORGING)</h2>
                                    <p className="text-sm text-omni-text-muted mt-2 uppercase font-bold">5T 證據鏈與真理結晶熔解中... {progress}%</p>
                                </LiquidGlassContainer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right: Achievements Sidebar */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <Award className="text-omni-accent" />
                        <h2 className="text-xl font-black uppercase tracking-widest text-slate-800">修煉成就 (Gnosis Proof)</h2>
                    </div>

                    <div className="flex flex-col gap-4">
                        <AnimatePresence>
                            {achievements.length === 0 ? (
                                <div className="p-8 text-center bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 text-slate-400">
                                    <p className="text-xs font-bold uppercase">尚無已鑄造成就</p>
                                    <p className="text-[10px] mt-2 italic">完成技能修煉以解鎖資產</p>
                                </div>
                            ) : (
                                achievements.map((ach, i) => (
                                    <motion.div
                                        key={ach.uuid}
                                        initial={{ x: 50, opacity: 0 }}
                                        animate={{ x: 0, opacity: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <OmniAchievementCard achievement={ach} />
                                    </motion.div>
                                ))
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div >
    );
}
