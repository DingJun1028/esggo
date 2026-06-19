"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, ShieldAlert, Target, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AuditConcernsViewProps {
    concerns: string[];
    className?: string;
}

/**
 * AuditConcernsView
 * 
 * Enterprise Sentinel Aesthetic: 
 * - Zero-radius corners
 * - Tonal layering (Zinc/Neutral)
 * - Mono font for technical clarity
 * - Micro-animations for staggered entry
 */
export const AuditConcernsView: React.FC<AuditConcernsViewProps> = ({ concerns, className }) => {
    if (!concerns || concerns.length === 0) {
        return (
            <div className={cn("p-4 border border-zinc-800 bg-zinc-950/50 flex items-center gap-3", className)}>
                <Target className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-mono text-zinc-400 uppercase tracking-widest">
                    No logical concerns detected. Integrity Verified.
                </span>
            </div>
        );
    }

    return (
        <div className={cn("space-y-1", className)}>
            <div className="flex items-center gap-2 mb-2 px-1">
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-500">
                    Audit Observations / Data Concerns
                </h3>
            </div>

            <div className="grid gap-px bg-zinc-800 border border-zinc-800">
                <AnimatePresence mode="popLayout">
                    {concerns.map((concern, index) => {
                        const isCritical = concern.includes("錯誤") || concern.includes("矛盾") || concern.includes("缺失");

                        return (
                            <motion.div
                                key={`${concern}-${index}`}
                                initial={{ opacity: 0, x: -4 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="group relative bg-zinc-950 p-3 flex items-start gap-3 hover:bg-zinc-900 transition-colors"
                            >
                                <div className="mt-0.5">
                                    {isCritical ? (
                                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                                    ) : (
                                        <Info className="w-3.5 h-3.5 text-zinc-500" />
                                    )}
                                </div>

                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-mono text-zinc-600">
                                            [OBS-{String(index + 1).padStart(3, '0')}]
                                        </span>
                                        {isCritical && (
                                            <Badge variant="outline" className="h-4 border-amber-900/50 text-amber-500 bg-amber-500/5 text-[9px] px-1 py-0 rounded-none border-0 ring-1 ring-inset ring-amber-900/30">
                                                HIGH_PRIORITY
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs leading-relaxed text-zinc-300 font-sans">
                                        {concern}
                                    </p>
                                </div>

                                {/* Enterprise Detail: Hover indicator */}
                                <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-amber-500 scale-y-0 group-hover:scale-y-100 transition-transform origin-top" />
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div className="mt-2 px-1 flex justify-between items-center">
                <div className="text-[9px] font-mono text-zinc-600 uppercase">
                    Audit Trail: ZKP_SIMULATED_V1
                </div>
                <div className="text-[9px] font-mono text-zinc-500 group-hover:text-amber-500 transition-colors cursor-help italic">
                    Scanned by Gemini-2.5-Flash
                </div>
            </div>
        </div>
    );
};
