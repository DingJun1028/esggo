"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    LayoutDashboard,
    Shield,
    Trophy,
    BookOpen,
    Sparkles,
    Hexagon,
    Map as MapIcon,
    Flame,
    Zap,
    Leaf,
    Award,
    Search,
    Coins,
    Terminal,
    HardDrive,
    CheckCircle2,
    ArrowRight,
    X,
    Gamepad2,
    ChevronRight,
    ArrowUpRight,
    Lock,
    Brain,
    User,
    Heart
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ForensicConsole } from "@/components/ui/forensic-console";
import { AIMasterView } from './ai-master-view';
import { useRPGStore } from "@/lib/stores/rpg-store";
import { useEvolutionStore } from "@/lib/stores/evolution-store";
import { QuizEngine, QuizQuestion } from "@/lib/services/quiz-engine";
import { SkillTreeView } from "./skill-tree-view";
import { AISkillTreeView } from "./ai-skill-tree-view";
import { CardMatrixView } from "./card-matrix-view";
import { ZKPSnarksEngine } from "@/lib/services/zkp-snarks-engine";
import { CHAPTERS } from "@/lib/services/story-service";
import { Moon, Sun } from "lucide-react";

export function ZenVillageView() {
    const [selectedModule, setSelectedModule] = useState<"AVATAR" | "MAP" | "TCG" | "TRAINING" | "MISSIONS" | "EVOLUTION" | "COLLECTION" | "master">("AVATAR");
    const {
        villageLevel = 1,
        influence = 100,
        villageXP = 0,
        stats = { environment: 100, social: 100, governance: 100 },
        inventory = [],
        buildings = [],
        energy = 100,
        maxEnergy = 100,
        streak = 0,
        checkIn,
        consumeEnergy,
        knowledgeXP = 0,
        fragments = {},
        FRAGMENTS_NEEDED = 20,
        exchangeHero,
        quests,
        syncExternalEvents,
        goodnessCoins,
        claimIdleCoins,
        proofLogs,
        addProofLog,
        currentChapter,
        storyProgress,
        isConsoleOpen,
        setIsConsoleOpen,
        nextStoryStep,
        zenZeroMode,
        toggleZenZero,
        sovereigntyScore,
        entropy,
        networkDensity
    } = useRPGStore();
    const { skills: legacySkills } = useEvolutionStore();
    const [mounted, setMounted] = useState(false);

    const chapters = CHAPTERS;

    useEffect(() => {
        setMounted(true);
        if (checkIn) checkIn();
        if (claimIdleCoins) claimIdleCoins();
    }, [checkIn, claimIdleCoins]);

    const [isSyncing, setIsSyncing] = useState(false);
    const [consoleVisible, setConsoleVisible] = useState(false);

    const handleSync = async () => {
        setIsSyncing(true);
        setIsConsoleOpen(true);

        // Generate real ZKP proof log stream
        const logs = ZKPSnarksEngine.generateVestedProofLog("SHA256:audit-vault-v1");

        // Simulated streaming effect
        for (const log of logs) {
            addProofLog(log);
            await new Promise(r => setTimeout(r, 400));
        }

        syncExternalEvents();
        setTimeout(() => {
            setIsSyncing(false);
            setTimeout(() => setConsoleVisible(false), 2000);
        }, 1000);
    };

    const [showChapterOverlay, setShowChapterOverlay] = useState(false);
    const prevChapterRef = React.useRef(currentChapter);

    useEffect(() => {
        if (currentChapter !== prevChapterRef.current) {
            setShowChapterOverlay(true);
            const timer = setTimeout(() => setShowChapterOverlay(false), 5000);
            prevChapterRef.current = currentChapter;
            return () => clearTimeout(timer);
        }
    }, [currentChapter]);

    if (!mounted) return null;

    const displayStats = [
        { label: "Environment (E)", value: stats.environment, max: 1000, color: "text-emerald-500", icon: Leaf },
        { label: "Social (S)", value: stats.social, max: 1000, color: "text-blue-500", icon: Shield },
        { label: "Governance (G)", value: stats.governance, max: 1000, color: "text-amber-500", icon: Brain },
        { label: "Knowledge XP", value: knowledgeXP, max: 5000, color: "text-purple-500", icon: BookOpen },
        { label: "Entropy (SATD)", value: entropy || 0, max: 100, color: "text-rose-500", icon: Terminal },
        { label: "Network Density (SNA)", value: networkDensity || 0, max: 100, color: "text-cyan-500", icon: HardDrive },
    ];

    return (
        <div className={cn(
            "flex flex-col gap-10 min-h-screen transition-all duration-1000 relative",
            zenZeroMode ? "grayscale contrast-125 brightness-90 saturate-0 bg-stone-950 text-white" : "bg-white text-stone-900"
        )}>
            {/* Chapter Intro Overlay */}
            <AnimatePresence>
                {showChapterOverlay && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[500] flex flex-col items-center justify-center bg-black/95 backdrop-blur-3xl"
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 30, opacity: 0 }}
                            animate={{ scale: 1, y: 0, opacity: 1 }}
                            exit={{ scale: 1.1, y: -30, opacity: 0 }}
                            className="p-12 bg-white/5 border border-white/10 rounded-[60px] text-center max-w-2xl backdrop-blur-md"
                        >
                            <span className="text-[12px] font-black uppercase tracking-[0.4em] text-emerald-500 mb-6 block">Chapter {currentChapter} Unlocked</span>
                            <h2 className="text-6xl font-black text-white tracking-tighter italic mb-8 uppercase font-headline">
                                {chapters[currentChapter - 1]?.title}
                            </h2>
                            <p className="text-xl text-stone-400 font-serif leading-relaxed italic mb-10">
                                「 {chapters[currentChapter - 1]?.narrative} 」
                            </p>
                            <div className="h-[2px] w-full bg-white/10 relative overflow-hidden">
                                <motion.div
                                    initial={{ x: "-100%" }}
                                    animate={{ x: "100%" }}
                                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                    className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-emerald-500 to-transparent"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
            {/* Header Area */}
            <div className="flex flex-col gap-10">
                <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-stone-200/60">
                    <div className="flex items-center gap-6">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: -2 }}
                            className="w-20 h-20 bg-stone-900 rounded-[28px] flex items-center justify-center text-primary-container shadow-2xl ring-1 ring-white/5"
                        >
                            <Gamepad2 className="w-12 h-12" />
                        </motion.div>
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <Badge variant="primary" styleType="sovereign" className="px-5 py-2 font-black">
                                    版本 V4.5 (ESTATE)
                                </Badge>
                                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-[0.2em]">村莊登記處 / Village Registry</span>
                            </div>
                            <h1 className="text-6xl font-black tracking-tighter text-stone-900 uppercase font-headline mb-0">
                                善向永續村 <span className="text-stone-300 font-light">/</span> <span className="text-emerald-700">Zen</span> Village
                            </h1>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 editorial-glass p-3 rounded-[32px] self-start lg:self-center">
                        <div className="flex flex-col gap-1 px-4 border-r border-stone-200">
                            <span className="text-[9px] font-black uppercase tracking-widest text-purple-600 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5" /> Epic Story
                            </span>
                            <span className="text-[12px] font-black text-stone-900 leading-none truncate max-w-[180px]">
                                第 {currentChapter} 章: {chapters[currentChapter - 1]?.title}
                            </span>
                            <div className="w-24 h-1.5 bg-stone-200/50 rounded-full mt-1.5 overflow-hidden">
                                <motion.div animate={{ width: `${storyProgress}%` }} className="h-full bg-purple-500" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 px-4 border-r border-stone-200">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">精通等級 / Mastery</span>
                            <span className="text-[14px] font-black text-stone-900 leading-none">RANK_{villageLevel}</span>
                            <div className="w-20 h-1.5 bg-stone-200/50 rounded-full mt-1.5 overflow-hidden">
                                <motion.div animate={{ width: `${(villageXP / (villageLevel * 1000)) * 100}%` }} className="h-full bg-emerald-600" />
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 px-4 border-r border-stone-200">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                                <Zap className="w-3.5 h-3.5 text-amber-500" /> 活力 / Vigor
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="w-24 h-2.5 bg-stone-200/50 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all" style={{ width: `${(energy / maxEnergy) * 100}%` }} />
                                </div>
                                <span className="text-[12px] font-black text-stone-900">{energy}</span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 px-4 border-r border-stone-200">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-500 flex items-center gap-1.5">
                                <Coins className="w-3.5 h-3.5 text-amber-500" /> 善向幣 / Goodness Coins
                            </span>
                            <div className="flex items-center gap-3">
                                <div className="flex flex-col">
                                    <span className="text-2xl font-black text-stone-900 leading-none tabular-nums">{goodnessCoins.toLocaleString()}</span>
                                    {(() => {
                                        const diff = Date.now() - (useRPGStore.getState() as any).lastClaimTimestamp;
                                        const pending = Math.max(0, Math.floor((diff / 60000) * 0.5 * villageLevel));
                                        return pending > 0 ? (
                                            <span className="text-[10px] font-bold text-amber-500 animate-pulse">待領取: +{pending}</span>
                                        ) : null;
                                    })()}
                                </div>
                                {(Date.now() - (useRPGStore.getState() as any).lastClaimTimestamp) > 60000 && (
                                    <button
                                        onClick={() => (useRPGStore.getState() as any).claimIdleCoins()}
                                        className="bg-emerald-500 text-white text-[8px] font-black px-2 py-1 rounded-full animate-bounce hover:bg-emerald-600 transition-colors"
                                    >
                                        CLAIM
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1 px-4 pr-6">
                            <span className="text-[9px] font-black uppercase tracking-widest text-stone-500">連續 / Streak</span>
                            <span className="text-2xl font-black text-emerald-700 leading-none tabular-nums">{streak}d</span>
                        </div>

                        <button
                            onClick={toggleZenZero}
                            className={cn(
                                "flex items-center justify-center w-14 h-14 rounded-full transition-all border shadow-sm",
                                zenZeroMode ? "bg-white text-black border-stone-200" : "bg-stone-900 text-white border-transparent hover:scale-105 active:scale-95"
                            )}
                        >
                            {zenZeroMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-1 pb-1 overflow-x-auto hide-scrollbar">
                    {[
                        { id: "AVATAR", label: "數位分身", icon: Shield },
                        { id: "MISSIONS", label: "偵察任務", icon: Trophy },
                        { id: "TRAINING", label: "永續修煉", icon: BookOpen },
                        { id: 'EVOLUTION', label: '星宿進化', icon: Sparkles },
                        { id: 'master', label: '博導指引', icon: Brain },
                        { id: "COLLECTION", label: "卡牌收藏", icon: Hexagon },
                        { id: "MAP", label: "村莊地圖", icon: MapIcon },
                    ].map((btn) => (
                        <button
                            key={btn.id}
                            onClick={() => {
                                setSelectedModule(btn.id as any);
                                if (btn.id === 'master') {
                                    const nextChapter = currentChapter + 1;
                                    if (nextChapter <= 12) {
                                        nextStoryStep();
                                        addProofLog(`[EPIC] Chapter ${nextChapter} Unlocked: Sovereign Insight Grew.`);
                                    }

                                    // Check for Zen Zero Hidden Mode
                                    if (currentChapter === 9) {
                                        (useRPGStore.getState() as any).unlockMode?.("Zen Zero");
                                    }
                                }
                            }}
                            className={cn(
                                "group relative flex items-center gap-3 px-8 py-5 transition-all font-black text-[11px] uppercase tracking-[0.2em] whitespace-nowrap",
                                selectedModule === btn.id
                                    ? "text-stone-900"
                                    : "text-stone-400 hover:text-stone-600"
                            )}
                        >
                            <btn.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", selectedModule === btn.id ? "text-emerald-700" : "text-stone-300")} />
                            {btn.label}
                            {selectedModule === btn.id && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute bottom-0 left-0 right-0 h-1 bg-stone-900 rounded-full"
                                />
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {selectedModule === "AVATAR" && (
                    <motion.div
                        key="avatar"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-10"
                    >
                        {/* Avatar & Progress */}
                        <div className="lg:col-span-4 flex flex-col gap-8">
                            <div className="aspect-[4/5] bg-stone-50 rounded-[40px] relative overflow-hidden group border border-stone-200 shadow-2xl ring-1 ring-white/5">
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/40 via-transparent to-transparent opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <motion.div
                                        animate={{
                                            y: [0, -10, 0],
                                            scale: [1, 1.02, 1]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                        className="relative"
                                    >
                                        <div className="w-56 h-56 bg-stone-900 rounded-full flex items-center justify-center text-primary-container shadow-[0_0_80px_rgba(4,47,46,0.3)] border-4 border-white/10">
                                            <User className="w-32 h-32" />
                                        </div>
                                        <div className={cn("p-2 rounded-xl", zenZeroMode ? "bg-emerald-500/20" : "bg-stone-900 text-white")}>
                                            <div className="absolute -inset-8 border border-emerald-500/20 rounded-full animate-spin-slow opacity-50" />
                                            <div className="absolute -inset-4 border border-blue-500/20 rounded-full animate-reverse-spin-slow opacity-30" />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="absolute bottom-8 left-8 right-8">
                                    <div className="editorial-glass p-6 rounded-[28px] border-white/20">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <h3 className="text-[10px] font-black text-stone-500 uppercase tracking-widest mb-1">莊園持有人 / Estate Holder</h3>
                                                <div className="text-2xl font-black text-stone-900 uppercase tracking-tighter">ZEN_CITIZEN_01</div>
                                            </div>
                                            <Badge variant="primary" styleType="sovereign" className="px-4 py-1.5 h-fit font-black">
                                                LVL_{villageLevel}
                                            </Badge>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                                <span className="text-stone-500">成長進度 / Growth</span>
                                                <span className="text-stone-900">{Math.round((villageXP % 1000) / 10)}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-stone-200/50 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(villageXP % 1000) / 10}%` }}
                                                    className="h-full bg-emerald-600"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {displayStats.map((stat, idx) => (
                                    <div key={idx} className="bg-white border border-stone-200 p-6 rounded-[32px] shadow-sm hover:shadow-md transition-all group">
                                        <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-colors", stat.color.replace('text-', 'bg-') + '/10')}>
                                            <stat.icon className={cn("w-6 h-6", stat.color)} />
                                        </div>
                                        <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{stat.label}</div>
                                        <div className="text-2xl font-black text-stone-900 tabular-nums">{stat.value}</div>
                                        <div className="w-full h-1.5 bg-stone-100 rounded-full mt-4 overflow-hidden">
                                            <motion.div
                                                animate={{ width: `${(stat.value / stat.max) * 100}%` }}
                                                className={cn("h-full", stat.color.replace('text-', 'bg-'))}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Inventory & Actions */}
                        <div className="lg:col-span-8 flex flex-col gap-10">
                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-stone-900 rounded-full" />
                                        <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">Action Deck <span className="text-stone-300">/</span> 行動指令</h2>
                                    </div>
                                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-[0.3em]">Direct Intervention</div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {[
                                        { title: "每日冥想", desc: "提升 Governance 與心靈平靜", cost: 20, reward: "G+50, XP+100", icon: Sparkles, color: "text-amber-500" },
                                        { title: "能源巡檢", desc: "優化村莊能源配置效率", cost: 40, reward: "E+100, XP+150", icon: Zap, color: "text-emerald-500" },
                                        { title: "社區關懷", desc: "拜訪村民並提供實質協助", cost: 30, reward: "S+80, XP+120", icon: Heart, color: "text-rose-500" },
                                        { title: "永續提案", desc: "提交新的村莊發展方案", cost: 50, reward: "ALL+30, XP+200", icon: Shield, color: "text-blue-500" },
                                    ].map((action, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => {
                                                if (energy >= action.cost) {
                                                    consumeEnergy(action.cost);
                                                    addProofLog(`Executed action: ${action.title}.`);
                                                }
                                            }}
                                            className={cn(
                                                "group flex flex-col p-8 rounded-[40px] border transition-all text-left relative overflow-hidden",
                                                energy >= action.cost
                                                    ? "bg-white border-stone-200 hover:border-stone-900 hover:shadow-2xl"
                                                    : "bg-stone-50 border-stone-100 opacity-60 cursor-not-allowed"
                                            )}
                                        >
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", action.color.replace('text-', 'bg-') + '/10')}>
                                                    <action.icon className={cn("w-7 h-7", action.color)} />
                                                </div>
                                                <Badge variant="primary" styleType="soft" className="px-3 py-1 font-black">
                                                    -{action.cost} VIGOR
                                                </Badge>
                                            </div>
                                            <h3 className="text-xl font-black text-stone-900 uppercase mb-2">{action.title}</h3>
                                            <p className="text-sm text-stone-500 font-medium leading-relaxed mb-6">{action.desc}</p>
                                            <div className="flex items-center gap-2 mt-auto">
                                                <div className="px-4 py-2 bg-stone-100 rounded-full text-[10px] font-black text-stone-600 uppercase tracking-widest group-hover:bg-stone-900 group-hover:text-white transition-colors">
                                                    Reward: {action.reward}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>

                            <section>
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-8 bg-emerald-700 rounded-full" />
                                        <h2 className="text-3xl font-black text-stone-900 uppercase tracking-tighter">近期成就 / Recent Achievements</h2>
                                    </div>
                                </div>
                                <div className="editorial-glass rounded-[40px] p-10 border-stone-200 shadow-xl overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-8">
                                        <Search className="w-64 h-64 text-stone-100 absolute -top-10 -right-10 pointer-events-none rotate-12" />
                                    </div>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-10">
                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-stone-50 transition-colors">
                                                <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600">
                                                    <Trophy className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Master of Flow</div>
                                                    <div className="text-sm font-bold text-stone-900">Reach Chapter 12 in Story Mode</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4 p-4 rounded-3xl hover:bg-stone-50 transition-colors opacity-40 grayscale">
                                                <div className="w-12 h-12 bg-stone-200 rounded-2xl flex items-center justify-center text-stone-400">
                                                    <Search className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black text-stone-400 uppercase tracking-widest">ESG Voyager</div>
                                                    <div className="text-sm font-bold text-stone-900">Complete 50 Scouting Missions</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="editorial-glass p-8 rounded-[32px] border-emerald-100/50 bg-emerald-50/30">
                                            <div className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4">Total Integrity</div>
                                            <div className="text-5xl font-black text-stone-900 tracking-tighter mb-4">{(stats.environment + stats.social + stats.governance).toLocaleString()}</div>
                                            <div className="flex items-center gap-2 text-emerald-700">
                                                <Sparkles className="w-4 h-4" />
                                                <span className="text-sm font-bold">Top 5% of all residents</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </div>
                    </motion.div>
                )}

                {selectedModule === "MISSIONS" && (
                    <motion.div
                        key="missions"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col gap-8"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tighter uppercase font-headline">偵察任務集 / Recon_Missions</h2>
                            <button
                                onClick={handleSync}
                                disabled={isSyncing}
                                className={cn(
                                    "flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-black uppercase tracking-widest transition-all",
                                    isSyncing ? "bg-stone-200 text-stone-400 cursor-not-allowed" : "bg-black text-white hover:bg-primary-teal-start shadow-xl"
                                )}
                            >
                                <Zap className={cn("w-4 h-4 text-amber-500", isSyncing && "animate-pulse")} />
                                {isSyncing ? "正在驗證主權... / Verifying..." : "同步外部事件 / Sync External"}
                            </button>
                        </div>

                        {consoleVisible && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-stone-900 text-emerald-500/90 p-8 rounded-[40px] font-mono text-[10px] leading-relaxed border border-white/5 shadow-2xl relative overflow-hidden"
                            >
                                <div className="absolute top-4 right-8 flex items-center gap-2 opacity-50">
                                    <Terminal className="w-3 h-3" />
                                    <span className="uppercase tracking-widest font-black">zk-Forensic Console v4.5</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {proofLogs.slice(0, 10).map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -5 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className={cn(i === 0 ? "text-emerald-400 font-bold" : "text-emerald-900/60")}
                                        >
                                            {log}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {quests.map((quest) => (
                                <div key={quest.id} className="group relative p-10 bg-white border border-stone-200 rounded-[40px] hover:border-black transition-all hover:shadow-2xl overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <Shield className="w-40 h-40 -mr-10 -mt-10" />
                                    </div>
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className="w-14 h-14 bg-stone-900 rounded-2xl flex items-center justify-center text-primary-container">
                                                <Search className="w-7 h-7" />
                                            </div>
                                            <Badge variant="primary" styleType="soft" className="px-4 py-1 font-black">
                                                +{Math.round(quest.target * 1.5)} XP
                                            </Badge>
                                        </div>
                                        <h3 className="text-2xl font-black text-stone-900 uppercase tracking-tighter mb-2">{quest.title}</h3>
                                        <p className="text-sm text-stone-500 font-medium leading-relaxed mb-8">{quest.description}</p>

                                        <div className="space-y-4">
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-stone-400">
                                                <span>任務進度 / Progress</span>
                                                <span className="text-stone-900">{quest.progress} / {quest.target}</span>
                                            </div>
                                            <div className="h-2.5 bg-stone-100 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${(quest.progress / quest.target) * 100}%` }}
                                                    className="h-full bg-stone-900"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {selectedModule === "TRAINING" && (
                    <TrainingTab onComplete={() => setSelectedModule('AVATAR')} />
                )}

                {selectedModule === "MAP" && (
                    <motion.div
                        key="map"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="flex flex-col gap-10"
                    >
                        <div className="flex items-center justify-between">
                            <h2 className="text-3xl font-black tracking-tighter uppercase font-headline">領土神經連結 / Territory_Neural_Link</h2>
                            <Badge variant="primary" styleType="sovereign" className="px-5 py-2 font-black">
                                主權值： / SOVEREIGNTY: {sovereigntyScore}%
                            </Badge>
                        </div>

                        <div className="bg-stone-950 rounded-[64px] aspect-[16/9] relative overflow-hidden border-[8px] border-stone-900 shadow-2xl p-1">
                            {/* Grid Patterns */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                            <div className="relative w-full h-full p-20 grid grid-cols-4 grid-rows-3 gap-8">
                                {buildings.map((b) => (
                                    <motion.div
                                        key={b.id}
                                        whileHover={!b.isLocked ? { scale: 1.05, y: -5 } : {}}
                                        className={cn(
                                            "relative rounded-[32px] border transition-all flex flex-col items-center justify-center gap-6 p-6 overflow-hidden group",
                                            b.isLocked
                                                ? "bg-stone-900/50 border-stone-800 opacity-40 grayscale"
                                                : "bg-black/80 border-white/10 hover:border-emerald-500/50 shadow-[0_0_40px_rgba(0,0,0,0.5)]"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
                                            b.isLocked ? "bg-stone-800 text-stone-600" : "bg-emerald-500/10 text-emerald-500 group-hover:scale-110"
                                        )}>
                                            {b.isLocked ? <Lock className="w-8 h-8" /> : <Shield className="w-8 h-8" />}
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-1">{b.isLocked ? "拒絕訪問 / ACCESS_DENIED" : "莊園節點 / ESTATE_NODE"}</p>
                                            <p className="text-sm font-black text-white uppercase tracking-wider">{b.name}</p>
                                        </div>

                                        {!b.isLocked && (
                                            <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        )}
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {selectedModule === 'master' && (
                    <motion.div
                        key="master"
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="min-h-[800px] relative"
                    >
                        {/* Celestial Background Effect */}
                        <div className="absolute inset-0 bg-stone-900 rounded-[60px] overflow-hidden pointer-events-none mb-12">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]" />
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 100, repeat: Infinity, ease: "linear" }}
                                className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(circle_at_30%_30%,rgba(245,158,11,0.05),transparent_50%)]"
                            />
                        </div>

                        <div className="relative z-10 p-12 flex flex-col gap-12">
                            <div className="flex items-center justify-between pb-8 border-b border-white/10">
                                <div>
                                    <h2 className="text-5xl font-black tracking-tighter uppercase font-headline text-white mb-2">博導指引 / MASTER GUIDANCE</h2>
                                    <p className="text-stone-400 font-serif italic text-lg">量子態精通與主權之火的最終覺醒 / Final Awakening of Quantum Mastery</p>
                                </div>
                                <div className="p-6 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-xl text-right">
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-1">Current Mastery</span>
                                    <span className="text-3xl font-black text-white italic">LV 42.50</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                                <div className="lg:col-span-2 flex flex-col gap-10">
                                    <AIMasterView inline />
                                    <div className="p-1 gap-1 bg-white/5 rounded-2xl border border-white/10 mt-10">
                                        <AISkillTreeView />
                                    </div>
                                </div>
                                <div className="space-y-8">
                                    <div className="p-10 bg-white/5 border border-white/10 rounded-[48px] backdrop-blur-sm relative overflow-hidden group">
                                        <div className="relative z-10">
                                            <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest block mb-4">Evolution Node</span>
                                            <h4 className="text-2xl font-black text-white tracking-tighter mb-4">主權節點同步 / Sovereign Sync</h4>
                                            <p className="text-stone-400 text-sm leading-relaxed mb-8 italic">正在同步全球供應鏈數據與主權鑑識流...</p>
                                            <div className="flex flex-col gap-6">
                                                {[1, 2, 3].map(i => (
                                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                                                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                                                        <span className="text-[11px] font-bold text-white uppercase tracking-wider">Node System 0{i} - Active</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 blur-3xl rounded-full group-hover:scale-150 transition-transform" />
                                    </div>

                                    <div className="p-10 bg-emerald-500 text-black rounded-[48px] shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-all cursor-pointer">
                                        <div className="relative z-10">
                                            <h4 className="text-3xl font-black tracking-tighter mb-2">零號協議 / Protocol Zero</h4>
                                            <p className="font-bold text-sm mb-6">開始最終鑑識同步</p>
                                            <ArrowRight className="w-10 h-10 transition-transform group-hover:translate-x-4" />
                                        </div>
                                        <Sparkles className="absolute -bottom-10 -right-10 w-48 h-48 opacity-20 rotate-12" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {selectedModule === "EVOLUTION" && (
                    <motion.div key="evolution" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
                        <SkillTreeView />
                    </motion.div>
                )}

                {selectedModule === "COLLECTION" && (
                    <motion.div key="collection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                        <CardMatrixView />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function TrainingTab({ onComplete }: { onComplete: () => void }) {
    const [quizzes, setQuizzes] = useState<QuizQuestion[]>([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(0);
    const [finished, setFinished] = useState(false);
    const { consumeEnergy, isConsoleOpen, proofLogs, setIsConsoleOpen } = useRPGStore();

    useEffect(() => {
        const load = async () => {
            const data = await QuizEngine.generateQuizzes();
            setQuizzes(data);
            setLoading(false);
        };
        load();
    }, []);

    const handleAnswer = (isCorrect: boolean) => {
        if (isCorrect) setScore(s => s + (100 / (quizzes.length || 1)));
        if (currentStep < (quizzes.length || 0) - 1) {
            setCurrentStep(s => s + 1);
        } else {
            const finalScore = isCorrect ? score + (100 / (quizzes.length || 1)) : score;
            QuizEngine.handleQuizCompletion(finalScore, "ESG Standards");
            setFinished(true);
        }
    };

    if (loading || quizzes.length === 0 || !quizzes[currentStep]) return <div className="p-20 text-center font-black animate-pulse">Loading...</div>;

    if (finished) return (
        <div className="flex flex-col items-center justify-center p-20 bg-emerald-50 rounded-[40px] text-center">
            <Sparkles className="w-20 h-20 text-emerald-500 mb-6" />
            <h2 className="text-4xl font-black text-stone-900 uppercase mb-10">Complete! Score: {Math.round(score)}%</h2>
            <button onClick={onComplete} className="px-10 py-4 bg-black text-white rounded-full font-black">Collect Rewards</button>
        </div>
    );

    const q = quizzes[currentStep];
    return (
        <div className="max-w-4xl mx-auto py-10">
            <div className="editorial-glass rounded-[48px] p-16 border-stone-200 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-stone-100">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / quizzes.length) * 100}%` }}
                        className="h-full bg-stone-900"
                    />
                </div>

                <div className="flex items-center gap-4 mb-12">
                    <div className="px-4 py-1.5 bg-stone-900 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                        Step {currentStep + 1} / {quizzes.length}
                    </div>
                    <div className="h-px flex-1 bg-stone-200" />
                </div>

                <h3 className="text-4xl font-black text-stone-900 uppercase tracking-tighter mb-12 leading-[1.1]">
                    {q.question}
                </h3>

                <div className="grid grid-cols-1 gap-4">
                    {q.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(opt === q.answer)}
                            className="group flex items-center justify-between p-8 bg-white border border-stone-200 rounded-[32px] text-left hover:border-stone-900 hover:shadow-xl transition-all"
                        >
                            <span className="text-lg font-bold text-stone-700 group-hover:text-stone-900">{opt}</span>
                            <div className="w-8 h-8 rounded-full border-2 border-stone-200 group-hover:border-stone-900 group-hover:bg-stone-900 flex items-center justify-center transition-colors">
                                <ArrowRight className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </button>
                    ))}
                </div>

                {/* AI Master Observer Overlay */}
                <div className="mt-16 pt-16 border-t border-stone-100">
                    <AIMasterView />
                </div>
            </div>

            {/* Forensic Console Overlay */}
            <AnimatePresence>
                {isConsoleOpen && (
                    <ForensicConsole
                        logs={proofLogs}
                        onClose={() => setIsConsoleOpen(false)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
