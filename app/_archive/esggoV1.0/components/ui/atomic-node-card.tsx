"use client";

import { motion } from "motion/react";
import { ShieldCheck, Info, Link2, AlertTriangle, Hash } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RedundancyValidator } from "@/lib/services/redundancy-validator";

interface AtomicNodeCardProps {
    nodeId: string;
    title: string;
    value: string;
    unit: string;
    integrity: number;
    isSelected?: boolean;
    isConsumed?: boolean;
    onClick?: () => void;
    chapterId: string;
}

export function AtomicNodeCard({
    nodeId,
    title,
    value,
    unit,
    integrity,
    isSelected,
    isConsumed,
    onClick,
    chapterId
}: AtomicNodeCardProps) {
    const usage = RedundancyValidator.getUsage(nodeId);
    const isRepeat = usage.length > 0 && !usage.some(u => u.chapterId === chapterId);

    return (
        <motion.div
            whileHover={{ y: -4, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={cn(
                "group relative p-5 rounded-[24px] border transition-all cursor-pointer overflow-hidden",
                isSelected
                    ? "bg-white border-primary-teal-start shadow-xl shadow-primary-teal-start/10 ring-2 ring-primary-teal-start/5"
                    : "bg-surface-container/30 border-outline-variant hover:bg-white hover:border-stone-200",
                isRepeat && "opacity-60 border-amber-500/20 bg-amber-50/10"
            )}
        >
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <div className={cn(
                        "w-8 h-8 rounded-xl flex items-center justify-center transition-colors",
                        isSelected ? "bg-primary-teal-start text-white" : "bg-stone-100 text-stone-400 group-hover:bg-primary-teal-start/10 group-hover:text-primary-teal-start"
                    )}>
                        <Hash size={14} />
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-on-surface-variant/60">
                        {nodeId}
                    </span>
                </div>
                {isRepeat ? (
                    <Badge variant="lethal" styleType="soft" className="bg-amber-100 text-amber-600 text-[8px] font-black border-none px-2 py-0.5 animate-pulse">
                        <AlertTriangle className="w-2.5 h-2.5 mr-1" /> REPEAT_GUARD
                    </Badge>
                ) : (
                    <Badge variant="optimal" styleType="soft" className="bg-emerald-50 text-emerald-600 text-[8px] font-black border-none px-2 py-0.5">
                        <ShieldCheck className="w-2.5 h-2.5 mr-1" /> VERIFIED
                    </Badge>
                )}
            </div>

            <h4 className="text-xs font-black text-stitch-text mb-1 uppercase tracking-tight line-clamp-1">{title}</h4>
            <div className="flex items-baseline gap-1">
                <span className="text-xl font-black text-stitch-text tracking-tighter">{value}</span>
                <span className="text-[10px] font-bold text-on-surface-variant/40">{unit}</span>
            </div>

            <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-widest">
                        Integrity: {integrity}%
                    </span>
                </div>
                {isSelected && <Link2 className="w-3.5 h-3.5 text-primary-teal-start animate-bounce" />}
            </div>

            {/* Redundancy Details Tooltip-ish UI */}
            {isRepeat && (
                <div className="mt-3 pt-3 border-t border-amber-500/10">
                    <div className="flex items-center gap-2 text-[8px] font-bold text-amber-600 uppercase">
                        <Info size={10} /> 已使用於: {usage[0]?.chapterId}
                    </div>
                </div>
            )}

            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-primary-teal-start/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </motion.div>
    );
}
