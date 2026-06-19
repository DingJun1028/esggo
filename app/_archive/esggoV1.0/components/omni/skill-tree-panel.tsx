"use client";

/**
 * SkillTreePanel — 技能樹面板
 * Renders the full skill tree for the active OmniRole.
 * Shows Passives, Combos, Combinations, Special (絕招), Ultimate (奧義).
 */

import { useState } from "react";
import { Zap, Star, Layers, Shield, Crown, Brain, ChevronDown, ChevronUp, Lock, CheckCircle2 } from "lucide-react";
import { useOmniSkills } from "@/hooks/use-omni-skills";
import type { OmniSkill, OmniRole, SkillType } from "@/lib/omni-skill-engine";
import { OMNI_SKILL_TREES } from "@/lib/omni-skill-engine";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";

// ─────────────────────────────────────────────
// Skill type visual config
// ─────────────────────────────────────────────

const SKILL_TYPE_CONFIG: Record<SkillType, {
    icon: React.ElementType;
    label: string;
    color: string;
    glow: string;
    bg: string;
}> = {
    passive: {
        icon: Shield,
        label: "被動天賦",
        color: "text-emerald-600",
        glow: "shadow-emerald-100",
        bg: "bg-emerald-50 border-emerald-200",
    },
    combo: {
        icon: Zap,
        label: "連續技",
        color: "text-amber-600",
        glow: "shadow-amber-100",
        bg: "bg-amber-50 border-amber-200",
    },
    combination: {
        icon: Layers,
        label: "組合技",
        color: "text-violet-600",
        glow: "shadow-violet-100",
        bg: "bg-violet-50 border-violet-200",
    },
    special: {
        icon: Star,
        label: "絕招",
        color: "text-rose-600",
        glow: "shadow-rose-200",
        bg: "bg-rose-50 border-rose-200",
    },
    ultimate: {
        icon: Crown,
        label: "奧義",
        color: "text-stone-900",
        glow: "shadow-stone-300",
        bg: "bg-gradient-to-br from-stone-900 to-stone-700 border-stone-600",
    },
};

const ROLE_OPTIONS: { id: OmniRole; emoji: string; label: string }[] = [
    { id: "ReportScribe", emoji: "📜", label: "報告聖典撰寫者" },
    { id: "DataAlchemist", emoji: "⚗️", label: "數據鍊金術士" },
    { id: "ComplianceOracle", emoji: "⚖️", label: "合規神諭" },
    { id: "StrategyMaestro", emoji: "♟️", label: "戰略大師" },
    { id: "AuditSentinel", emoji: "🔒", label: "稽核守衛" },
];

// ─────────────────────────────────────────────
// Single Skill Card
// ─────────────────────────────────────────────

function SkillCard({
    skill,
    isUnlocked,
    isLearnable,
    onLearn,
}: {
    skill: OmniSkill;
    isUnlocked: boolean;
    isLearnable: boolean;
    onLearn: (skill: OmniSkill) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const cfg = SKILL_TYPE_CONFIG[skill.type];
    const Icon = cfg.icon;
    const isUltimate = skill.type === "ultimate";

    return (
        <motion.div
            layout
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className={cn(
                "rounded-2xl border overflow-hidden transition-all duration-500 relative group",
                isUltimate ? cn(cfg.bg, "shadow-2xl border-white/20") : cn("bg-white/80 backdrop-blur-sm", isUnlocked ? cfg.bg : "border-stone-100/50"),
                isUnlocked && !isUltimate ? "shadow-lg scale-[1.01] " + cfg.glow : "",
                !isUnlocked && !isLearnable ? "opacity-40 grayscale-[0.5]" : "hover:shadow-lg hover:border-stone-200"
            )}
        >
            {/* Neural Glow for Unlocked Skills */}
            {isUnlocked && (
                <motion.div
                    animate={{ opacity: [0.1, 0.3, 0.1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-current to-transparent opacity-10"
                />
            )}

            <div
                className={cn("p-5 cursor-pointer relative z-10")}
                onClick={() => setExpanded((e) => !e)}
            >
                <div className="flex items-start gap-4">
                    {/* Skill icon with high-tech border */}
                    <div className={cn(
                        "w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border relative",
                        isUltimate ? "bg-white/10 border-white/30" : "bg-white border-stone-200 shadow-sm group-hover:border-stone-400 transition-colors"
                    )}>
                        <Icon size={20} className={cn(isUltimate ? "text-white" : cfg.color, "relative z-10")} />
                        {isUnlocked && (
                            <motion.div
                                layoutId={`glow-${skill.id}`}
                                className="absolute inset-0 rounded-2xl blur-md opacity-50"
                                style={{ backgroundColor: isUltimate ? 'white' : 'currentColor' }}
                            />
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1.5">
                            <span className={cn(
                                "text-[10px] font-black rounded-lg px-2.5 py-0.5 tracking-wider uppercase",
                                isUltimate
                                    ? "bg-white/20 text-white"
                                    : `${cfg.color} bg-white/50 border border-current border-opacity-20`
                            )}>
                                {cfg.label} // T{skill.tier}
                            </span>
                            <span className={cn(
                                "text-[10px] font-black tracking-tight",
                                isUltimate ? "text-white/60" : "text-stone-400"
                            )}>
                                {skill.memoryWeight} MEM_UNIT
                            </span>
                            {isUnlocked && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                    <CheckCircle2 size={14} className={isUltimate ? "text-white" : "text-emerald-500"} />
                                </motion.div>
                            )}
                            {!isUnlocked && !isLearnable && (
                                <Lock size={12} className="text-stone-300" />
                            )}
                        </div>
                        <p className={cn("font-black text-sm lg:text-base tracking-tight", isUltimate ? "text-white" : "text-on-surface")}>
                            {skill.name}
                        </p>
                        {skill.nameEn && (
                            <p className={cn("text-[10px] mt-0.5 font-mono opacity-50 uppercase tracking-tighter", isUltimate ? "text-white" : "text-stone-500")}>
                                {skill.nameEn}
                            </p>
                        )}
                    </div>

                    <div className={cn("shrink-0 mt-1 transition-transform duration-300", expanded ? "rotate-180" : "", isUltimate ? "text-white/60" : "text-stone-300")}>
                        <ChevronDown size={16} />
                    </div>
                </div>
            </div>

            {/* Expanded detail */}
            <AnimatePresence>
                {expanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className={cn("px-5 pb-5 space-y-4 relative z-10", isUltimate ? "border-t border-white/10 pt-4" : "border-t border-stone-100 pt-4")}>
                            <p className={cn("text-xs lg:text-sm leading-relaxed font-medium", isUltimate ? "text-white/80" : "text-stone-500")}>
                                {skill.description}
                            </p>

                            <div className={cn("p-4 rounded-2xl text-[11px] lg:text-xs space-y-2.5 border backdrop-blur-md", isUltimate ? "bg-white/5 border-white/10" : "bg-stone-50/50 border-stone-200/50")}>
                                <div className="flex gap-2">
                                    <span className={cn("font-black shrink-0 uppercase tracking-widest text-[9px]", isUltimate ? "text-white/40" : "text-stone-400")}>Trigger_Mode:</span>
                                    <span className={isUltimate ? "text-white/90" : "text-on-surface"}>{skill.trigger}</span>
                                </div>
                                <div className="flex gap-2">
                                    <span className={cn("font-black shrink-0 uppercase tracking-widest text-[9px]", isUltimate ? "text-white/40" : "text-stone-400")}>Effect_Matrix:</span>
                                    <span className={isUltimate ? "text-white/90" : "text-on-surface"}>{skill.effect}</span>
                                </div>
                                {skill.griAnchor && skill.griAnchor.length > 0 && (
                                    <div className="flex gap-2 flex-wrap items-center mt-2">
                                        <span className={cn("font-black shrink-0 uppercase tracking-widest text-[9px]", isUltimate ? "text-white/40" : "text-stone-400")}>GRI_Anchor:</span>
                                        {skill.griAnchor.map((g) => (
                                            <span key={g} className={cn("text-[10px] font-black rounded-lg px-2 py-0.5 border shadow-sm", isUltimate ? "bg-white/10 border-white/20 text-white" : "bg-stone-900 text-white border-stone-800")}>
                                                {g}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {!isUnlocked && isLearnable && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={(e) => { e.stopPropagation(); onLearn(skill); }}
                                    className={cn(
                                        "w-full py-3.5 rounded-2xl text-xs font-black transition-all shadow-xl flex items-center justify-center gap-2 overflow-hidden relative",
                                        isUltimate
                                            ? "bg-white text-stone-900 border-none"
                                            : "bg-stone-900 text-white hover:bg-black"
                                    )}
                                >
                                    <Zap size={14} fill="currentColor" />
                                    <span>習得此技能 // 消耗 {skill.memoryWeight} ⚡</span>
                                    <motion.div
                                        className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12"
                                        whileHover={{ x: '200%' }}
                                        transition={{ duration: 0.8 }}
                                    />
                                </motion.button>
                            )}
                            {isUnlocked && (
                                <div className="flex justify-center">
                                    <Badge variant="optimal" className="px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg">
                                        ✓ Linked_to_Heart
                                    </Badge>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ─────────────────────────────────────────────
// Main Panel
// ─────────────────────────────────────────────

export function SkillTreePanel() {
    const { role, tree, pool, unlockedIds, learnableSkills, skillLogs, memoryUsedPercent, learn, setRole } = useOmniSkills();
    const [activeSection, setActiveSection] = useState<SkillType | "log">("passive");

    const allSkills: OmniSkill[] = [
        ...tree.passives,
        ...tree.combos,
        ...tree.combinations,
        tree.special,
        tree.ultimate,
    ];

    const sectionSkills: Record<string, OmniSkill[]> = {
        passive: tree.passives,
        combo: tree.combos,
        combination: tree.combinations,
        special: [tree.special],
        ultimate: [tree.ultimate],
    };

    const currentSkills = activeSection === "log" ? [] : (sectionSkills[activeSection] || []);

    const SECTIONS: { id: SkillType | "log"; label: string; emoji: string }[] = [
        { id: "passive", label: "被動", emoji: "🛡" },
        { id: "combo", label: "連續技", emoji: "⚡" },
        { id: "combination", label: "組合技", emoji: "💜" },
        { id: "special", label: "絕招", emoji: "🌟" },
        { id: "ultimate", label: "奧義", emoji: "👑" },
        { id: "log", label: "元祖記載", emoji: "📜" },
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Role selector */}
            <div className="px-4 pt-4 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-stone-600" />
                    <h2 className="text-sm font-bold text-stone-800">技能樹 · 從萬能之心升起</h2>
                </div>
                <div className="flex gap-1.5 flex-wrap">
                    {ROLE_OPTIONS.map((r) => (
                        <button
                            key={r.id}
                            onClick={() => setRole(r.id)}
                            className={cn(
                                "text-[10px] font-bold rounded-xl px-2.5 py-1.5 border transition-all",
                                role === r.id
                                    ? "bg-stone-800 text-white border-stone-800"
                                    : "text-stone-500 border-stone-200 hover:border-stone-400"
                            )}
                        >
                            {r.emoji} {r.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Memory bar */}
            <div className="px-4 py-2.5 border-b border-stone-100 bg-stone-50/60">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-black text-stone-500 uppercase tracking-wider">
                        ⚡ 萬能永憶
                    </span>
                    <span className="text-[10px] font-bold text-stone-500">
                        {pool.allocatedMemory} / {pool.totalCapacity}
                    </span>
                </div>
                <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full transition-all",
                            memoryUsedPercent > 80 ? "bg-rose-500" : memoryUsedPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                        )}
                        style={{ width: `${memoryUsedPercent}%` }}
                    />
                </div>
                <div className="mt-1 text-[9px] text-stone-400 font-bold">
                    {tree.roleMotto}
                </div>
            </div>

            {/* Section tabs */}
            <div className="flex border-b border-stone-100 px-2 overflow-x-auto no-scrollbar">
                {SECTIONS.map((sec) => (
                    <button
                        key={sec.id}
                        onClick={() => setActiveSection(sec.id as SkillType | "log")}
                        className={cn(
                            "flex-shrink-0 flex flex-col items-center px-2.5 py-2 text-[10px] font-bold border-b-2 transition-all",
                            activeSection === sec.id
                                ? "border-stone-800 text-stone-800"
                                : "border-transparent text-stone-400 hover:text-stone-600"
                        )}
                    >
                        <span className="text-base">{sec.emoji}</span>
                        <span className="mt-0.5">{sec.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeSection === "log" ? (
                    skillLogs.length === 0 ? (
                        <div className="text-center py-12 text-stone-400">
                            <p className="text-sm font-bold">尚無元祖記載</p>
                            <p className="text-xs mt-1">習得技能後，記錄將在此顯示</p>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {[...skillLogs].reverse().map((log) => (
                                <div key={log.id} className="p-3 bg-stone-50 rounded-xl border border-stone-100 text-xs">
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-black text-stone-700">{log.skillName}</span>
                                        <span className="text-[9px] font-bold text-stone-400">
                                            {new Date(log.timestamp).toLocaleTimeString("zh-TW")}
                                        </span>
                                    </div>
                                    <p className="text-[10px] text-stone-400 font-mono truncate">{log.heartHash.slice(0, 40)}...</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={cn(
                                            "text-[9px] font-black rounded px-1.5 py-0.5",
                                            SKILL_TYPE_CONFIG[log.skillType]?.color,
                                            "bg-white border border-stone-100"
                                        )}>
                                            {SKILL_TYPE_CONFIG[log.skillType]?.label}
                                        </span>
                                        <span className="text-[9px] text-stone-400">
                                            消耗 {log.memoryCost} ⚡
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    currentSkills.map((skill) => (
                        <SkillCard
                            key={skill.id}
                            skill={skill}
                            isUnlocked={unlockedIds.includes(skill.id)}
                            isLearnable={learnableSkills.some((s) => s.id === skill.id)}
                            onLearn={learn}
                        />
                    ))
                )}
            </div>
        </div>
    );
}
