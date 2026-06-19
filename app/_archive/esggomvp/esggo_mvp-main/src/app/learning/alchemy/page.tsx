'use client';

import React, { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FlaskConical,
    Award,
    ChevronRight,
    Flame,
    ShieldCheck,
    Zap,
    Star,
    Dna,
    Sparkles,
    Lock,
    Compass
} from 'lucide-react';
import { useLanguage } from '@/components/LanguageProvider';

/**
 * 🧪 Learning Alchemy Dashboard
 * 10-Level Sentient Evolution System with real persistence.
 */
export default function LearningAlchemyPage() {
    const { locale } = useLanguage();
    const [level, setLevel] = useState(1);
    const [activeXp, setActiveXp] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const totalXp = 1000;
    const userId = "demo_user_001"; // In a real app, this would come from auth

    useEffect(() => {
        async function fetchProgress() {
            try {
                const res = await fetch(`/api/alchemy?userId=${userId}`);
                const json = await res.json();
                if (json.success && json.data) {
                    setLevel(json.data.level || 1);
                    setActiveXp(json.data.points || 0);
                }
            } catch (error) {
                console.error("Failed to fetch alchemy:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchProgress();
    }, [userId]);

    const handleLevelUp = async () => {
        const nextXp = activeXp + 200;
        let nextLevel = level;
        let finalXp = nextXp;

        if (nextXp >= totalXp) {
            nextLevel = Math.min(level + 1, 10);
            finalXp = 0;
        }

        const res = await fetch('/api/alchemy', {
            method: 'POST',
            body: JSON.stringify({
                user_id: userId,
                level: nextLevel,
                points: finalXp,
                rank: levelTitles[nextLevel - 1].title
            })
        });

        const json = await res.json();
        if (json.success) {
            setLevel(nextLevel);
            setActiveXp(finalXp);
        }
    };

    const levelTitles = [
        { title: "Initial Resonance", zh: "初次共鳴", icon: <Flame size={14} /> },
        { title: "Knowledge Seeker", zh: "知識追尋者", icon: <Compass size={14} /> },
        { title: "Gnosis Explorer", zh: "智慧探索者", icon: <Sparkles size={14} /> },
        { title: "5T Practitioner", zh: "5T 實踐者", icon: <ShieldCheck size={14} /> },
        { title: "Sustainability Catalyst", zh: "永續催化劑", icon: <Zap size={14} /> },
        { title: "Ethical Architect", zh: "倫理架構師", icon: <Dna size={14} /> },
        { title: "Sentient Leader", zh: "覺醒領袖", icon: <Star size={14} /> },
        { title: "Universal Steward", zh: "寰宇維護者", icon: <FlaskConical size={14} /> },
        { title: "Eternal Guardian", zh: "永恆守護者", icon: <ShieldCheck size={14} /> },
        { title: "NIRVANA Transcended", zh: "涅槃超脫 - OMEGA", icon: <Sparkles size={14} /> },
    ];

    const achievements = [
        { id: 1, title: "First Note Engraved", zh: "初次無作刻印", date: "2026-02-20", unlocked: true },
        { id: 2, title: "5T Proof Verified", zh: "5T 誠信認證", date: "2026-02-21", unlocked: true },
        { id: 3, title: "Knowledge Transcended", zh: "知識超脫者", date: "2026-02-22", unlocked: true },
        { id: 4, title: "Carbon Master", zh: "碳盤存大師", date: "2026-02-23", unlocked: true },
        { id: 5, title: "ESG Architect", zh: "ESG 架構師", date: null, unlocked: false },
        { id: 6, title: "Omni-Sprite Summoner", zh: "星光召喚師", date: null, unlocked: false },
    ];

    if (isLoading) {
        return <div className="p-20 text-center animate-pulse text-gold uppercase font-black tracking-widest">Crystalizing Alchemy Matrix...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto space-y-12">
            <PageHeader
                title={locale === 'zh-TW' ? "學習鍊金術 (Learning Alchemy)" : "Learning Alchemy"}
                subtitle={locale === 'zh-TW' ? "將碎片化的 ESG 知識結晶化。在這裡，您的學習歷程將轉化為可證明的等階與資產。" : "Crystalize fragmented ESG knowledge into sentient assets and evolution levels."}
                category="學習鍊金"
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* 🧬 Evolution Core */}
                <div className="lg:col-span-2 space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="p-10 rounded-[3rem] bg-gradient-to-br from-gold/20 via-black to-gold/5 border border-gold/30 liquid-glass relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <FlaskConical size={200} className="text-gold" />
                        </div>

                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                            <div className="relative w-48 h-48 flex items-center justify-center">
                                <svg className="w-full h-full -rotate-90">
                                    <circle cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                    <motion.circle
                                        cx="96" cy="96" r="88" fill="none" stroke="currentColor" strokeWidth="8"
                                        strokeDasharray={552}
                                        initial={{ strokeDashoffset: 552 }}
                                        animate={{ strokeDashoffset: 552 - (552 * activeXp) / totalXp }}
                                        className="text-gold shadow-gold/50"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-4xl font-black text-white italic">LV.{level}</span>
                                    <span className="text-[10px] uppercase font-bold text-gold tracking-widest mt-1">Evolution Rank</span>
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 text-center md:text-left">
                                <div className="flex items-center justify-center md:justify-start gap-2 text-gold">
                                    {levelTitles[level - 1].icon}
                                    <h3 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">
                                        {locale === 'zh-TW' ? levelTitles[level - 1].zh : levelTitles[level - 1].title}
                                    </h3>
                                </div>
                                <p className="text-xs text-gray-400 max-w-md uppercase tracking-widest leading-loose">
                                    Current Essence: {activeXp} / {totalXp} XP<br />
                                    Next Level: {levelTitles[Math.min(level, 9)].title}
                                </p>
                                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${(activeXp / totalXp) * 100}%` }}
                                        className="h-full bg-gold primary-glow"
                                    />
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* 🏔️ Evolution Path */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {levelTitles.map((lt, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-2xl border transition-all ${i + 1 <= level ? 'bg-gold/10 border-gold/40 text-gold shadow-[0_0_10px_rgba(255,215,0,0.1)]' : 'bg-white/5 border-white/5 text-gray-600 opacity-50'}`}
                            >
                                <div className="text-[10px] font-black mb-1">LV.{i + 1}</div>
                                <div className="text-[9px] font-bold uppercase leading-tight line-clamp-1">{locale === 'zh-TW' ? lt.zh : lt.title}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 🏆 Achievement Vault */}
                <div className="space-y-6">
                    <h4 className="text-sm font-black uppercase tracking-widest text-gold flex items-center gap-2">
                        <Award size={16} /> Achievement Vault
                    </h4>
                    <div className="space-y-4">
                        {achievements.map((ach) => (
                            <motion.div
                                key={ach.id}
                                whileHover={{ x: 5 }}
                                className={`p-4 rounded-3xl border transition-all flex items-center gap-4 ${ach.unlocked ? 'bg-white/5 border-white/10' : 'bg-black/40 border-white/5 opacity-40 grayscale'}`}
                            >
                                <div className={`size-12 rounded-2xl flex items-center justify-center ${ach.unlocked ? 'bg-gold/20 text-gold shadow-[0_0_15px_rgba(255,215,0,0.2)]' : 'bg-white/5 text-gray-600'}`}>
                                    {ach.unlocked ? <ShieldCheck size={24} /> : <Lock size={20} />}
                                </div>
                                <div className="flex-1 overflow-hidden">
                                    <h5 className="text-xs font-bold text-white truncate">{locale === 'zh-TW' ? ach.zh : ach.title}</h5>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{ach.date || 'TBD (To Be Determined)'}</p>
                                </div>
                                {ach.unlocked && <ChevronRight size={14} className="text-gold" />}
                            </motion.div>
                        ))}
                    </div>

                    <div className="p-6 rounded-3xl bg-blue-500/10 border border-blue-500/20 liquid-glass text-center">
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Knowledge Assets</p>
                        <p className="text-2xl font-black text-white italic">{((level - 1) * 1000 + activeXp).toLocaleString()} <span className="text-xs font-medium text-gray-500">K-ATOM</span></p>
                    </div>
                </div>

            </div>

            {/* 🔮 Deep Alchemy Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-10 rounded-[3rem] bg-white/5 border border-white/10 liquid-glass group">
                    <h4 className="text-lg font-bold mb-4 flex items-center gap-3">
                        <Zap size={20} className="text-gold" /> Component Mastery
                    </h4>
                    <div className="space-y-6">
                        {[
                            { label: 'UCC Integration', val: 85 },
                            { label: '5T Verification Rate', val: 99 },
                            { label: 'Atomic Composition', val: level * 10 },
                        ].map(stat => (
                            <div key={stat.label} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                    <span>{stat.label}</span>
                                    <span className="text-gold">{stat.val}%</span>
                                </div>
                                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${stat.val}%` }}
                                        className="h-full bg-white/20 group-hover:bg-gold transition-colors"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="p-10 rounded-[3rem] bg-aqua/5 border border-aqua/20 liquid-glass flex flex-col items-center justify-center text-center space-y-4">
                    <div className="w-16 h-16 bg-aqua/20 rounded-full flex items-center justify-center text-aqua">
                        <FlaskConical size={32} />
                    </div>
                    <h4 className="text-xl font-bold uppercase tracking-tighter italic">Alchemist's Crucible</h4>
                    <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
                        Every 5T note you engrave adds to your evolution. Gain 200 XP per distillation.
                    </p>
                    <button
                        onClick={handleLevelUp}
                        className="px-8 py-3 bg-aqua/20 border border-aqua/50 text-aqua rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-aqua hover:text-black transition-all"
                    >
                        Begin Distillation (+200 XP)
                    </button>
                </div>
            </div>
        </div>
    );
}

