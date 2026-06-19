'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LiquidGlassContainer } from '@/components/omni/liquid-glass/LiquidGlassContainer';
import { KnowledgeCard } from '@/components/omni/village/KnowledgeCard';
import { ReportManifestPortal } from '@/components/omni/village/ReportManifestPortal';
import { AvatarEvolutionPortal } from '@/components/omni/village/AvatarEvolutionPortal';
import { AchievementVault } from '@/components/omni/village/AchievementVault';
import {
    VILLAGE_KNOWLEDGE,
    KnowledgeDomain,
    KnowledgeDifficulty,
    searchKnowledge,
} from '@/core/village-knowledge';
import { spriteProactiveEngine } from '@/core/omni-sprite-engine';
import { useAvatarStore } from '@/core/omni-avatar-state';
import {
    Library,
    Search,
    Leaf,
    Users,
    Building2,
    Zap,
    SlidersHorizontal,
    BookOpenCheck,
    GraduationCap,
    Trophy,
    UserPlus,
    ArrowRight,
    Infinity as InfinityIcon,
    Sparkles,
} from 'lucide-react';
import { gnosisEngine } from '@/core/gnosis-vector-engine';
import Link from 'next/link';

const DOMAIN_TABS: { label: string; value: KnowledgeDomain | 'ALL'; icon: React.ReactNode; color: string }[] = [
    { label: '全部', value: 'ALL', icon: <Library size={14} />, color: 'text-white/60' },
    { label: '環境 (E)', value: 'E', icon: <Leaf size={14} />, color: 'text-emerald-400' },
    { label: '社會 (S)', value: 'S', icon: <Users size={14} />, color: 'text-blue-400' },
    { label: '治理 (G)', value: 'G', icon: <Building2 size={14} />, color: 'text-amber-400' },
];

const DIFFICULTY_FILTERS: { label: string; value: KnowledgeDifficulty | 'ALL' }[] = [
    { label: '全部', value: 'ALL' },
    { label: '入門', value: 'beginner' },
    { label: '進階', value: 'intermediate' },
    { label: '大師', value: 'advanced' },
];

const LOCAL_STORAGE_KEY = 'omni_village_learned';

export default function VillageLibraryPage() {
    const { learnKnowledge } = useAvatarStore();
    const [activeDomain, setActiveDomain] = useState<KnowledgeDomain | 'ALL'>('ALL');
    const [activeDifficulty, setActiveDifficulty] = useState<KnowledgeDifficulty | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [learnedUuids, setLearnedUuids] = useState<Set<string>>(new Set());
    const [totalExp, setTotalExp] = useState(0);
    const [activeView, setActiveView] = useState<'MAP' | 'EVOLUTION' | 'VAULT'>('MAP');
    const [isAISearch, setIsAISearch] = useState(false);
    const [aiResults, setAiResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        try {
            const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
            if (saved) {
                const parsed: string[] = JSON.parse(saved);
                setLearnedUuids(new Set(parsed));
                const exp = VILLAGE_KNOWLEDGE
                    .filter(k => parsed.includes(k.uuid))
                    .reduce((sum, k) => sum + k.expReward, 0);
                setTotalExp(exp);
            }
        } catch { }
    }, []);

    const handleLearn = (uuid: string) => {
        setLearnedUuids(prev => {
            const next = new Set(prev);
            const knowledge = VILLAGE_KNOWLEDGE.find(k => k.uuid === uuid);
            if (!knowledge) return prev;

            const isUnlearning = next.has(uuid);
            if (isUnlearning) {
                next.delete(uuid);
                setTotalExp(e => e - knowledge.expReward);
            } else {
                next.add(uuid);
                setTotalExp(e => e + knowledge.expReward);
            }

            // 同步至數位分身進化引擎
            learnKnowledge(knowledge.domain, knowledge.expReward, isUnlearning);

            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...next]));
            return next;
        });
    };

    const filtered = useMemo(() => {
        let base = searchQuery ? searchKnowledge(searchQuery) : VILLAGE_KNOWLEDGE;
        if (activeDomain !== 'ALL') base = base.filter(k => k.domain === activeDomain);
        if (activeDifficulty !== 'ALL') base = base.filter(k => k.difficulty === activeDifficulty);
        return base;
    }, [activeDomain, activeDifficulty, searchQuery]);

    const learnedCount = learnedUuids.size;
    const progressPct = Math.round((learnedCount / VILLAGE_KNOWLEDGE.length) * 100);

    return (
        <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-24 text-slate-900 dark:text-white">

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-[10px] font-black tracking-[0.3em] uppercase text-cyan-600 dark:text-cyan-400 w-fit">
                        <GraduationCap size={10} className="animate-pulse" />
                        Village Nexus · ESG Knowledge Library
                    </div>
                    <h1 className="text-5xl font-black tracking-tighter italic text-slate-900 dark:text-white uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                        永續<span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-emerald-600 dark:from-cyan-400 dark:to-emerald-400">智識庫</span>
                    </h1>
                    <p className="text-slate-500 dark:text-white/40 text-sm font-medium max-w-2xl font-['Outfit']">
                        24 項 MECE ESG 知識點 · E8 環境 + S8 社會 + G8 治理 · 服務即教學，知識即資產
                    </p>
                </div>

                {/* Dashboard Stats */}
                <div className="flex flex-col md:flex-row items-stretch gap-6">
                    <LiquidGlassContainer glowColor="cyan" intensity="low" className="flex items-center gap-6 p-4 shrink-0 bg-white/50 dark:bg-white/5">
                        <div className="flex flex-col items-center gap-1">
                            <div className="text-3xl font-black text-slate-900 dark:text-white font-['Outfit']">{learnedCount}</div>
                            <div className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest">已學習</div>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                            <div className="text-3xl font-black text-amber-600 dark:text-amber-400 font-['Outfit']">{totalExp.toLocaleString()}</div>
                            <div className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest flex items-center gap-1">
                                <Zap size={8} /> Alchemy EXP
                            </div>
                        </div>
                        <div className="w-px h-10 bg-slate-200 dark:bg-white/10" />
                        <div className="flex flex-col items-center gap-1">
                            <div className="text-3xl font-black text-cyan-600 dark:text-cyan-400 font-['Outfit']">{progressPct}%</div>
                            <div className="text-[9px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest flex items-center gap-1">
                                <BookOpenCheck size={8} /> 完成率
                            </div>
                        </div>
                    </LiquidGlassContainer>

                    {/* V9 Transcendence Preview Entry */}
                    <Link href="/omni/v9-preview" className="flex-1">
                        <LiquidGlassContainer glowColor="purple" intensity="medium" className="h-full flex items-center justify-between p-4 group cursor-pointer border-purple-500/20 hover:border-purple-500/50 transition-all overflow-hidden relative">
                            <div className="flex items-center gap-4 relative z-10">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-500 group-hover:scale-110 transition-transform">
                                    <InfinityIcon size={20} className="animate-spin-slow" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-black uppercase tracking-widest text-purple-400/60 leading-tight">Future Expansion</span>
                                    <span className="text-sm font-black italic uppercase text-slate-900 dark:text-white group-hover:text-purple-400 transition-colors">v9.0 Transcendence Guide</span>
                                </div>
                            </div>
                            <ArrowRight size={16} className="text-purple-500 group-hover:translate-x-1 transition-transform relative z-10" />
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                        </LiquidGlassContainer>
                    </Link>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </div>

            {/* View Switcher Tabs */}
            <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/10 pb-4 mt-4">
                {[
                    { id: 'MAP', label: '知識地圖', icon: <Library size={16} /> },
                    { id: 'EVOLUTION', label: '身分進化', icon: <UserPlus size={16} /> },
                    { id: 'VAULT', label: '成就資產', icon: <Trophy size={16} /> }
                ].map(view => (
                    <button
                        key={view.id}
                        onClick={() => setActiveView(view.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black transition-all ${activeView === view.id
                            ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
                            : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60'
                            }`}
                    >
                        {view.icon}
                        {view.label}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeView}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    {activeView === 'MAP' && (
                        <div className="flex flex-col gap-8">
                            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                                <div className="relative flex-1 max-w-sm">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        {isAISearch ? (
                                            <Sparkles size={14} className="text-purple-500 animate-pulse" />
                                        ) : (
                                            <Search size={14} className="text-slate-400 dark:text-white/30" />
                                        )}
                                    </div>
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={e => {
                                            setSearchQuery(e.target.value);
                                            if (isAISearch && e.target.value.length > 3) {
                                                setIsSearching(true);
                                                gnosisEngine.seek(e.target.value).then(res => {
                                                    setAiResults(res);
                                                    setIsSearching(false);
                                                });
                                            }
                                        }}
                                        placeholder={isAISearch ? "詢問 AI 關於 ESG 的知識..." : "搜尋知識點、標準、標籤..."}
                                        className={`w-full pl-12 pr-4 py-2.5 bg-white/80 dark:bg-white/5 border rounded-xl text-sm text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-white/20 focus:outline-none font-['Outfit'] transition-all ${isAISearch ? 'border-purple-500/50 shadow-lg shadow-purple-500/10' : 'border-slate-200 dark:border-white/10 focus:border-cyan-500/50'}`}
                                    />
                                    {isSearching && (
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            <div className="w-4 h-4 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => setIsAISearch(!isAISearch)}
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${isAISearch
                                        ? 'bg-purple-500 text-white border-purple-400 shadow-lg shadow-purple-500/20'
                                        : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:border-purple-500/30'}`}
                                >
                                    <Sparkles size={12} />
                                    {isAISearch ? 'AI Gnosis Mode' : 'Switch to AI Search'}
                                </button>

                                <div className="flex items-center gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-xl border border-slate-200 dark:border-white/5">
                                    {DOMAIN_TABS.map(tab => (
                                        <button
                                            key={tab.value}
                                            onClick={() => setActiveDomain(tab.value)}
                                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all ${activeDomain === tab.value
                                                ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                                                : 'text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60'
                                                } ${tab.color}`}
                                        >
                                            {tab.icon}
                                            <span className="hidden md:inline">{tab.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <SlidersHorizontal size={12} className="text-slate-400 dark:text-white/30 shrink-0" />
                                    {DIFFICULTY_FILTERS.map(f => (
                                        <button
                                            key={f.value}
                                            onClick={() => setActiveDifficulty(f.value)}
                                            className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wide transition-all border ${activeDifficulty === f.value
                                                ? 'bg-white dark:bg-white/10 border-slate-300 dark:border-white/20 text-slate-900 dark:text-white shadow-sm'
                                                : 'border-transparent text-slate-400 dark:text-white/30 hover:text-slate-600 dark:hover:text-white/60'
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="text-[10px] font-mono text-slate-400 dark:text-white/20 uppercase tracking-widest pl-1">
                                顯示 {filtered.length} / {VILLAGE_KNOWLEDGE.length} 項知識點
                            </div>

                            {isAISearch && aiResults.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-purple-500/5 border border-purple-500/20 rounded-2xl mb-4"
                                >
                                    <div className="flex items-center gap-2 mb-3 text-purple-400">
                                        <Sparkles size={12} />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-purple-400">Gnosis Semantic Results (RAG)</span>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {aiResults.map((res: any, idx: number) => (
                                            <div key={idx} className="p-3 bg-white/50 dark:bg-black/20 rounded-xl border border-purple-500/10 hover:border-purple-500/30 transition-all group overflow-hidden relative">
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-[10px] text-purple-400/80 font-mono">Rank #{idx + 1}</span>
                                                    <span className="text-[10px] font-black text-purple-500 bg-purple-500/10 px-1.5 rounded">Score: {(res.score * 100).toFixed(1)}%</span>
                                                </div>
                                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed">
                                                    {res.content}
                                                </p>
                                                <div className="mt-2 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <div className="w-1 h-1 rounded-full bg-purple-400" />
                                                    <span className="text-[9px] text-purple-400/60 uppercase">Source: {res.source}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}

                            <AnimatePresence mode="popLayout">
                                {filtered.length > 0 ? (
                                    <div className="flex flex-col gap-12">
                                        <motion.div
                                            layout
                                            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                                        >
                                            {filtered.map(k => (
                                                <KnowledgeCard
                                                    key={k.uuid}
                                                    knowledge={k}
                                                    isLearned={learnedUuids.has(k.uuid)}
                                                    onLearn={handleLearn}
                                                />
                                            ))}
                                        </motion.div>
                                        <ReportManifestPortal learnedUuids={[...learnedUuids]} />
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-24 gap-4 text-slate-300 dark:text-white/20">
                                        <Search size={48} />
                                        <p className="text-sm font-['Outfit']">找不到符合的知識點，嘗試其他關鍵字</p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    )}

                    {activeView === 'EVOLUTION' && <AvatarEvolutionPortal />}
                    {activeView === 'VAULT' && <AchievementVault learnedUuids={[...learnedUuids]} />}
                </motion.div>
            </AnimatePresence>

            <SpriteContextTracker learnedCount={learnedCount} learnedUuids={[...learnedUuids]} />

            {/* Bottom Philosophy */}
            <LiquidGlassContainer glowColor="indigo" intensity="low" className="mt-4 bg-indigo-50/30 dark:bg-indigo-500/5">
                <div className="text-center py-4">
                    <p className="text-sm italic text-indigo-700 dark:text-indigo-200/50 font-medium font-['Outfit']">
                        「服務即教學，知識即資產。道法自然，系統毅然，上善若水，善向永續。」
                    </p>
                    <div className="text-[10px] text-slate-400 dark:text-white/15 uppercase tracking-[0.4em] mt-2">
                        Omni Village · Knowledge Nexus · 5T Verified
                    </div>
                </div>
            </LiquidGlassContainer>
        </div>
    );
}

function SpriteContextTracker({ learnedCount, learnedUuids }: { learnedCount: number; learnedUuids: string[] }) {
    useEffect(() => {
        const eCount = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'E' && learnedUuids.includes(k.uuid)).length;
        const sCount = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'S' && learnedUuids.includes(k.uuid)).length;
        const gCount = VILLAGE_KNOWLEDGE.filter(k => k.domain === 'G' && learnedUuids.includes(k.uuid)).length;

        spriteProactiveEngine.checkContext(learnedCount, { E: eCount, S: sCount, G: gCount });
    }, [learnedCount, learnedUuids]);

    return null;
}
