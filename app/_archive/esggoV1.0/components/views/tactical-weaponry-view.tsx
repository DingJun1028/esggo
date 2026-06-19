"use client";

import { motion } from "motion/react";
import { ShieldCheck, Crosshair, Database, Cpu, Activity, Wrench, Lock, Network, Zap } from "lucide-react";
import { TACTICAL_WEAPONRY, TacticalWeapon } from "@/lib/weaponry-registry";
import { cn } from "@/lib/utils";
import { useEvolutionStore } from "@/lib/stores/evolution-store";

export const TacticalWeaponryView = () => {
    const { skills } = useEvolutionStore();

    const getIcon = (type: TacticalWeapon["type"]) => {
        switch (type) {
            case "Calculation": return <Activity className="w-5 h-5 text-blue-500" />;
            case "Verification": return <ShieldCheck className="w-5 h-5 text-emerald-500" />;
            case "Retrieval": return <Database className="w-5 h-5 text-indigo-500" />;
            case "Action": return <Zap className="w-5 h-5 text-amber-500" />;
            default: return <Wrench className="w-5 h-5" />;
        }
    };

    const getStatusStyle = (status: TacticalWeapon["status"]) => {
        switch (status) {
            case "ACTIVE": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "IN_DEVELOPMENT": return "bg-amber-50 text-amber-600 border-amber-100";
            case "OFFLINE": return "bg-stone-50 text-stone-400 border-stone-200";
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto space-y-8 min-h-[80vh] flex flex-col">
            <header className="mb-10 border-b border-stone-100 pb-10 px-4 pt-4">
                <h2 className="text-4xl font-black text-stone-900 tracking-tighter flex items-center gap-4 uppercase font-headline">
                    <Crosshair className="w-10 h-10 text-stone-900" />
                    Tactical_Arsenal <span className="text-stone-300">/</span> 武裝庫
                </h2>
                <p className="text-[11px] text-stone-400 font-bold mt-4 uppercase tracking-[0.3em]">
                    AGENT_CONFIGURATION_REGISTRY • GENKIT_INTEGRATIONS
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                {TACTICAL_WEAPONRY.map((weapon, idx) => {
                    // Check if weapon is unlocked based on skill level
                    const ownerAgent = weapon.agentOwner === "System-Wide" ? "Collective" : weapon.agentOwner;
                    const relevantSkill = skills.find(s => s.agent === ownerAgent || (weapon.agentOwner === "System-Wide" && s.category === "collective"));
                    const isLevelUnlocked = !weapon.minSkillLevel || (relevantSkill && relevantSkill.level >= weapon.minSkillLevel);
                    const isUnlocked = isLevelUnlocked && weapon.status !== "OFFLINE";

                    return (
                        <motion.div
                            key={weapon.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className={cn(
                                "bg-white border border-stone-200 rounded-[32px] p-8 shadow-sm group hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-500 relative overflow-hidden",
                                !isUnlocked && "opacity-60 saturate-50 pointer-events-none"
                            )}
                        >
                            {!isUnlocked && (
                                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-20 flex flex-col items-center justify-center gap-4">
                                    <div className="p-4 bg-white rounded-full shadow-minimal border border-stitch-border">
                                        <Lock className="w-8 h-8 text-stitch-muted" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs font-black text-stitch-text uppercase tracking-widest">Insufficient Evolution</p>
                                        <p className="text-[10px] text-stitch-muted font-bold mt-1">Required: {weapon.agentOwner} Lv.{weapon.minSkillLevel}</p>
                                    </div>
                                </div>
                            )}

                            {/* Background Glow */}
                            <div className="absolute -right-20 -top-20 w-40 h-40 bg-stitch-shallow-gray rounded-full blur-3xl opacity-50 group-hover:bg-stitch-teal-start/10 transition-colors" />

                            <div className="flex justify-between items-start mb-6 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 shadow-inner group-hover:bg-white transition-colors">
                                        {getIcon(weapon.type)}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-lg text-stone-900 font-headline uppercase tracking-tight">
                                            {weapon.name}
                                        </h3>
                                        <p className="text-[10px] text-stone-400 font-black uppercase tracking-widest mt-2 flex items-center gap-2">
                                            Assigned to: <span className="px-2 py-0.5 bg-stone-100 rounded text-stone-600 font-black">{weapon.agentOwner}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className={cn("px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-colors", getStatusStyle(weapon.status))}>
                                    {weapon.status}
                                </div>
                            </div>

                            {weapon.alignmentRequirement && (
                                <div className="mb-4 flex items-center gap-2">
                                    <div className="h-1 flex-1 bg-stitch-border rounded-full overflow-hidden">
                                        <div className="h-full bg-stitch-teal-start w-[15%]" />
                                    </div>
                                    <span className="text-[9px] font-black text-stitch-teal-start uppercase tracking-widest">
                                        Alignment Req: {(weapon.alignmentRequirement * 100).toFixed(0)}%
                                    </span>
                                </div>
                            )}

                            <p className="text-xs text-stone-500 font-medium leading-relaxed mb-10 relative z-10 border-l-4 border-stone-100 pl-6 italic font-serif">
                                {weapon.description}
                            </p>

                            <div className="bg-stone-900 rounded-[24px] p-6 relative z-10 shadow-2xl border border-white/5">
                                <div className="flex items-center gap-3 mb-4">
                                    <Cpu className="w-4 h-4 text-stone-500" />
                                    <span className="text-[10px] text-stone-500 font-black uppercase tracking-widest">
                                        Neural_Schema / Genkit_Native
                                    </span>
                                </div>
                                <div className="bg-black/50 rounded-xl p-4 overflow-x-auto">
                                    <pre className="text-[11px] font-mono text-emerald-400 whitespace-pre-wrap leading-relaxed font-bold">
                                        {weapon.schema}
                                    </pre>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
};