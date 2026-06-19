"use client";

import { motion } from "motion/react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface OmniStatProps {
    label: string;
    value: string | number;
    subValue?: string;
    unit?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        label: string;
        isUp?: boolean;
    };
    status?: string;
    color?: string;
    className?: string;
}

export function OmniStat({
    label,
    value,
    subValue,
    unit,
    icon: Icon,
    trend,
    status,
    color = "var(--color-primary)",
    className,
}: OmniStatProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
                "bg-surface-container border border-outline-variant p-6 rounded-lg flex flex-col justify-between group hover:border-black/10 transition-all duration-300",
                className
            )}
        >
            <div className="flex justify-between items-start mb-8">
                <div className="flex flex-col">
                    <span className="text-[10px] font-headline font-bold uppercase tracking-[0.2em] text-on-surface-variant">
                        {label}
                    </span>
                    <span className="text-[10px] text-on-surface-variant/60 font-medium uppercase tracking-wider mt-0.5">
                        {subValue || "Metric Registry"}
                    </span>
                </div>
                <div className="p-2 rounded-md bg-background border border-outline-variant text-[var(--color-primary)] group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-5 h-5" style={{ color }} />
                </div>
            </div>

            <div className="flex flex-col">
                <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-headline font-bold text-on-surface tracking-tighter">
                        {value}
                    </span>
                    {unit && (
                        <span className="text-sm font-headline font-bold text-on-surface-variant/40 uppercase">
                            {unit}
                        </span>
                    )}
                </div>

                <div className="flex items-center gap-3">
                    {trend && (
                        <span className={cn(
                            "font-bold text-[10px] tracking-tighter flex items-center gap-1 uppercase",
                            trend.isUp ? "text-primary" : "text-error"
                        )}>
                            <span className="material-symbols-outlined text-xs">
                                {trend.isUp ? "trending_up" : "trending_down"}
                            </span>
                            {trend.isUp ? "+" : "-"}{trend.value}% vs LY
                        </span>
                    )}
                    {status && (
                        <span className="text-[9px] font-black text-on-surface-variant/40 uppercase tracking-[0.15em] border-l border-outline-variant pl-3">
                            Status: {status}
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
