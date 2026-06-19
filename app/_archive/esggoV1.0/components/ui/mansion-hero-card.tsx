"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { TMansion, PalaceEnum } from "@/lib/schemas/mansions-schema";
import { Shield, Zap, Wind, Waves } from "lucide-react";

interface MansionHeroCardProps {
    mansion: TMansion;
    resonance: number; // 0-1 靈魂共鳴度
    isAce?: boolean;   // 是否為負碳 A 牌
    onClick?: () => void;
    className?: string;
}

/**
 * MansionHeroCard
 * 實作 v4.5 液態玻璃 (Liquid Glass) UI
 * 具備折射 (Refraction)、倒角 (Bevel) 與漫射 (Frost) 特性
 */
export function MansionHeroCard({
    mansion,
    resonance,
    isAce = false,
    onClick,
    className
}: MansionHeroCardProps) {
    const palaceTheme = useMemo(() => {
        switch (mansion.palace) {
            case "Azure_Dragon": return { color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/30", icon: Wind };
            case "Black_Tortoise": return { color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/30", icon: Shield };
            case "White_Tiger": return { color: "text-slate-400", bg: "bg-slate-500/10", border: "border-slate-500/30", icon: Zap };
            case "Vermilion_Bird": return { color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30", icon: Waves };
            default: return { color: "text-white", bg: "bg-white/10", border: "border-white/30", icon: Shield };
        }
    }, [mansion.palace]);

    const Icon = palaceTheme.icon;

    // 液態玻璃參數映射 (CSS Variables)
    const glassStyle = {
        "--refraction": `${mansion.liquidGlassConfig?.refraction || 0.5}`,
        "--bevel": `${mansion.liquidGlassConfig?.bevel || 0.5}`,
        "--frost": `${mansion.liquidGlassConfig?.frost || 5}px`,
    } as any;

    return (
        <motion.div
            layoutId={mansion.id}
            onClick={onClick}
            style={glassStyle}
            whileHover={{ scale: 1.02, y: -5 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                "relative w-72 h-96 rounded-2xl cursor-pointer transition-shadow duration-500",
                "border-[var(--bevel)] border-white/20 backdrop-blur-[var(--frost)]",
                "bg-gradient-to-br from-white/10 to-black/30",
                "shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]",
                palaceTheme.border,
                className
            )}
        >
            {/* 折射光暈效果 */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
                <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,255,255,0.1)_0%,transparent_50%)] opacity-[var(--refraction)]" />
            </div>

            <div className="relative z-10 p-6 flex flex-col h-full justify-between">
                {/* Header: Palace & Resonance */}
                <div className="flex justify-between items-center">
                    <span className={cn("text-[10px] uppercase tracking-tighter font-bold opacity-70", palaceTheme.color)}>
                        {mansion.palace.replace("_", " ")}
                    </span>
                    <div className="flex items-center gap-1">
                        <div className="h-1 w-12 bg-white/20 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${resonance * 100}%` }}
                                className={cn("h-full", palaceTheme.bg.replace("bg-", "bg-opacity-100 bg-"))}
                            />
                        </div>
                        <span className="text-[8px] font-mono">{Math.round(resonance * 100)}%</span>
                    </div>
                </div>

                {/* Body: Mansion Icon & Code */}
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <div className={cn("p-4 rounded-full border border-white/10 bg-white/5 shadow-inner", palaceTheme.color)}>
                        <Icon size={48} strokeWidth={1} />
                    </div>
                    <div className="text-center">
                        <h2 className="text-3xl font-black tracking-tight text-white/90">{mansion.name}</h2>
                        <p className="text-[10px] font-mono tracking-widest opacity-50">{mansion.code} - UNIT {mansion.palace.charAt(0)}</p>
                    </div>
                </div>

                {/* Footer: Specialty & Action */}
                <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                        {mansion.specialty.map(s => (
                            <span key={s} className="px-2 py-0.5 rounded text-[8px] bg-white/5 border border-white/10 text-white/70 uppercase">
                                {s}
                            </span>
                        ))}
                    </div>

                    <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                        <div className="flex flex-col">
                            <span className="text-[8px] opacity-40 uppercase">Sovereign Domain</span>
                            <span className="text-[12px] font-bold">{mansion.domain}</span>
                        </div>
                        {isAce && (
                            <span className="text-xs font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]">
                                ACE NEGATIVE CARBON
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* 精裝邊位效果 (Bevel Highlight) */}
            <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
        </motion.div>
    );
}
