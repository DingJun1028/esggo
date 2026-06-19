"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
    Zap,
    BrainCircuit,
    Network,
    ShieldCheck,
    Sparkles,
    Cpu,
    Lock,
    MessageSquare,
    Mic,
    Search,
    CheckCircle2,
    TrendingUp,
    Workflow,
    Database,
    ArrowRight
} from "lucide-react";
import { useEvolutionStore, SkillNode } from "@/lib/stores/evolution-store";

interface Skill {
    id: string;
    name: string;
    level: number;
    maxLevel: 10;
    description: string;
    category: 'individual' | 'collective' | 'domain';
    agent: string;
    icon: any;
    unlocked: boolean;
}

const SKILL_ICONS = {
    'logic-1': Search,
    'database-1': Database,
    'zkp-1': Lock,
    'genkit-1': Workflow,
    'audit-1': ShieldCheck,
    'voice-1': Mic,
    'module-gri': Database,
    'module-carbon': TrendingUp,
    'module-supply': Network,
};

export function AISkillTreeView() {
    const { skills, totalIntelligence, unlockedCount, awardXP, unlockSkill } = useEvolutionStore();
    const [selectedCategory, setSelectedCategory] = useState<'individual' | 'collective' | 'domain'>('individual');
    const [learningSkill, setLearningSkill] = useState<SkillNode | null>(null);
    const [logs, setLogs] = useState([
        { from: 'OmniSphere', to: 'Audit Agent', skill: 'ISO 14064 認證', action: '教學中 (Teaching)', status: 'Success' },
        { from: 'TCFD Hub', to: 'SBTi Agent', skill: '供應鏈軌跡模擬', action: '模擬中 (Imitating)', status: 'Syncing' },
        { from: 'System-Wide', to: 'User (You)', skill: 'GRI 框架分析', action: '顧問中 (Consulting)', status: 'Active' },
    ]);

    const filteredSkills = skills.filter(s => s.category === selectedCategory);

    const handleSkillClick = (skill: SkillNode) => {
        if (!skill.unlocked) {
            // 嘗試解鎖邏輯
            unlockSkill(skill.id);
        }
        setLearningSkill(skill);
        // ... 發放模擬經驗值以進行動態展示
        awardXP(skill.agent, 50);

        setTimeout(() => {
            setLearningSkill(null);
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-8 p-8 max-w-6xl mx-auto relative">
            {/* Learning Modal */}
            <AnimatePresence>
                {learningSkill && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="w-full max-w-lg bg-zinc-900 border border-white/20 rounded-[40px] p-12 text-center relative overflow-hidden"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-stitch-teal-start " />
                            <div className="mb-8 inline-flex p-6 rounded-[32px] bg-stitch-teal-start/10 text-stitch-teal-start ring-1 ring-stitch-teal-start/20">
                                <Zap className="w-12 h-12 animate-bounce" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-4">系統能力優化中</h2>
                            <p className="text-white/60 mb-10 leading-relaxed">
                                正在透過 <span className="text-stitch-teal-start font-bold">{learningSkill.name}</span> 進行底層邏輯與知識同步流程。
                                5T 協議已連結 <span className="text-white font-bold">8 大 ESG 資料庫</span>，目前同步進度極佳。
                            </p>
                            <div className="flex items-center justify-center gap-3 bg-white/5 p-4 rounded-lg border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-stitch-teal-start animate-ping" />
                                <span className="text-xs font-mono text-stitch-teal-start uppercase tracking-widest">Protocol Syncing: 98.4%</span>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tighter mb-2 flex items-center gap-3">
                        <BrainCircuit className="w-10 h-10 text-stitch-teal-start" />
                        AI 核心能力地圖
                    </h1>
                    <p className="text-stitch-muted font-medium text-lg">
                        即時監控與演化的 AI 引擎能力，驅動數據鏈追蹤與分析。
                    </p>
                </div>
                <div className="flex p-1 bg-stitch-shallow-gray rounded-lg">
                    <button
                        onClick={() => setSelectedCategory('individual')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'individual' ? 'bg-white text-stitch-teal-start shadow-sm' : 'text-stitch-muted hover:text-stitch-text'}`}
                    >
                        個體能力 (Individual)
                    </button>
                    <button
                        onClick={() => setSelectedCategory('collective')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'collective' ? 'bg-white text-stitch-teal-start shadow-sm' : 'text-stitch-muted hover:text-stitch-text'}`}
                    >
                        集體智能 (Collective)
                    </button>
                    <button
                        onClick={() => setSelectedCategory('domain')}
                        className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${selectedCategory === 'domain' ? 'bg-white text-stitch-teal-start shadow-sm' : 'text-stitch-muted hover:text-stitch-text'}`}
                    >
                        領域專家 (Domain)
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-lg bg-white border border-stitch-border shadow-minimal flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-stitch-teal-start/10 flex items-center justify-center">
                        <TrendingUp className="w-6 h-6 text-stitch-teal-start" />
                    </div>
                    <div>
                        <div className="text-2xl font-black">Level 42</div>
                        <div className="text-xs text-stitch-muted font-bold uppercase tracking-widest">Total Intelligence</div>
                    </div>
                </div>
                <div className="p-6 rounded-lg bg-white border border-stitch-border shadow-minimal flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black">{unlockedCount} / {skills.length}</div>
                        <div className="text-xs text-stitch-muted font-bold uppercase tracking-widest">Skills Unlocked</div>
                    </div>
                </div>
                <div className="p-6 rounded-lg bg-white border border-stitch-border shadow-minimal flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <div className="text-2xl font-black">99.8%</div>
                        <div className="text-xs text-stitch-muted font-bold uppercase tracking-widest">Logic Accuracy</div>
                    </div>
                </div>
            </div>

            {/* Skill Transfer & Learning Feed */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-8 rounded-[32px] bg-stitch-teal-start/5 border border-stitch-teal-start/20"
            >
                <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                    <Workflow className="w-5 h-5 text-stitch-teal-start" />
                    即時監控 AI 核心能力學習紀錄 (Skill Imitation Log)
                </h3>
                <div className="space-y-4">
                    {logs.map((log, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white border border-stitch-border">
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-stitch-teal-start px-2 py-1 bg-stitch-teal-start/10 rounded-lg">{log.action}</span>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-bold">{log.from}</span>
                                    <ArrowRightIcon className="w-3 h-3 text-stitch-muted" />
                                    <span className="text-sm font-bold">{log.to}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <span className="text-sm text-stitch-muted">{log.skill}</span>
                                <span className={`text-[10px] font-black uppercase tracking-widest ${log.status === 'Success' ? 'text-stitch-success' : log.status === 'Syncing' ? 'text-blue-500 ' : 'text-orange-500'}`}>
                                    {log.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Tree Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {filteredSkills.map((skill, idx) => {
                        const Icon = (SKILL_ICONS as any)[skill.id] || BrainCircuit;
                        return (
                            <motion.div
                                key={skill.id}
                                layout
                                onClick={() => handleSkillClick(skill)}
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: idx * 0.1 }}
                                className={`group cursor-pointer relative p-8 rounded-[32px] border transition-all duration-500 flex flex-col ${skill.unlocked
                                    ? 'bg-white border-stitch-border hover:border-stitch-teal-start hover:shadow-minimal'
                                    : 'bg-stitch-shallow-gray/50 border-transparent grayscale brightness-90 border-dashed'
                                    }`}
                            >
                                <div className="absolute top-4 right-4 text-[10px] font-mono text-stitch-teal-start opacity-0 group-hover:opacity-100 transition-opacity">
                                    {Math.floor(skill.xp)} / {Math.floor(skill.xpToNextLevel)} XP
                                </div>
                                {!skill.unlocked && (
                                    <div className="absolute inset-0 flex items-center justify-center z-10">
                                        <div className="p-3 bg-white/80 backdrop-blur-md rounded-full shadow-minimal border border-white">
                                            <Lock className="w-6 h-6 text-stitch-muted" />
                                        </div>
                                    </div>
                                )}

                                <div className="mb-6 flex items-start justify-between">
                                    <div className={`w-14 h-14 rounded-lg flex items-center justify-center transition-colors ${skill.unlocked ? 'bg-stitch-teal-start/10 text-stitch-teal-start group-hover:bg-stitch-teal-start group-hover:text-white' : 'bg-stitch-muted/10 text-stitch-muted'
                                        }`}>
                                        <Icon className="w-7 h-7" />
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-bold text-stitch-muted uppercase tracking-[0.2em] block mb-1">
                                            {skill.agent}
                                        </span>
                                        <div className="px-2 py-0.5 rounded-md bg-stitch-shallow-gray text-[9px] font-black">
                                            Lv.{skill.level}/{skill.maxLevel}
                                        </div>
                                    </div>
                                </div>

                                <h3 className={`text-xl font-black mb-3 transition-colors ${skill.unlocked ? 'text-stitch-text group-hover:text-stitch-teal-start' : 'text-stitch-muted'}`}>
                                    {skill.name}
                                </h3>
                                <p className={`text-sm leading-relaxed flex-1 ${skill.unlocked ? 'text-stitch-muted group-hover:text-stitch-text' : 'text-stitch-muted/60'}`}>
                                    {skill.description}
                                </p>

                                <div className="mt-8">
                                    <div className="h-1.5 w-full bg-stitch-shallow-gray rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className={`h-full rounded-full ${skill.unlocked ? 'bg-stitch-teal-start' : 'bg-stitch-muted'}`}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {/* Collective Interaction Map (Hint) */}
            <motion.div
                whileHover={{ scale: 1.01 }}
                className="mt-8 p-10 rounded-[40px] bg-gradient-to-br from-black via-zinc-900 to-black text-white relative overflow-hidden group border border-white/5"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-stitch-teal-start/5 rounded-full -mr-32 -mt-32 transition-all duration-700" />
                <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg">
                            <Network className="w-6 h-6 text-stitch-teal-start" />
                        </div>
                        <h2 className="text-2xl font-black tracking-tight">集體智能工作流 (Collective Flow)</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {['數據採集', '5T 驗證', '隱私保護', '報告生成'].map((step, i) => (
                            <div key={step} className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold border border-white/10 shrink-0">
                                    0{i + 1}
                                </div>
                                <div className="text-sm font-bold text-white/80">{step}</div>
                                {i < 3 && <ArrowRightIcon className="w-4 h-4 text-white/20 hidden md:block" />}
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

function ArrowRightIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    )
}
