"use client";

import { useAppContext } from "@/lib/context/app-context";
import { SPIRITS } from "@/lib/core/spirits";
import { GlassCard } from "./ui/glass-card";
import { Sparkles, Info, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export function SpiritPersonaCard() {
    const { selectedSpirit, setIsSpiritOpen, language } = useAppContext();
    const spirit = SPIRITS[selectedSpirit];

    return (
        <GlassCard className="p-4 border-slate-100 hover:shadow-md transition-all cursor-pointer group" onClick={() => setIsSpiritOpen(true)}>
            <div className="flex items-center gap-4">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110",
                    selectedSpirit === 'compliance' ? "bg-blue-900 shadow-blue-900/20" :
                        selectedSpirit === 'harmony' ? "bg-emerald-900 shadow-emerald-900/20" :
                            "bg-purple-900 shadow-purple-900/20"
                )}>
                    {spirit.avatar}
                </div>
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-sm font-black text-slate-900 tracking-tight">{spirit.name[language]}</h3>
                        <Sparkles className={cn("w-3.5 h-3.5 animate-pulse",
                            selectedSpirit === 'compliance' ? "text-blue-500" :
                                selectedSpirit === 'harmony' ? "text-emerald-500" :
                                    "text-purple-500"
                        )} />
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">
                        {spirit.title[language]}
                    </p>
                </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100/50 flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-[10px] text-slate-500">
                    <Info className="w-3 h-3" />
                    <span>{language === 'zh' ? '當前特質：' : 'Current Trait: '}{spirit.traits[0][language]}</span>
                </div>
                <ArrowRight className="w-3 h-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
            </div>
        </GlassCard>
    );
}
