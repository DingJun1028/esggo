"use client";

import { motion } from "motion/react";
import { ShieldCheck, Target, Activity, Hash, FileCheck, History } from "lucide-react";
import { IOmniHeart, getTrinityContext } from "@/lib/omni-heart";
import { cn } from "@/lib/utils";

interface TrinityBreakdownProps {
    heart: IOmniHeart;
    className?: string;
}

export function TrinityBreakdown({ heart, className }: TrinityBreakdownProps) {
    const trinity = getTrinityContext(heart);

    const cards = [
        {
            title: "真 (Truthful)",
            subtitle: "Traceable (可溯源)",
            status: trinity.truth.status,
            color: "text-stitch-teal-start",
            bg: "bg-stitch-teal-start/5",
            border: "border-stitch-teal-start/10",
            icon: ShieldCheck,
            details: [
                { label: "Hash Lock", value: trinity.truth.hash.slice(0, 12) + "..." },
                { label: "Chain Status", value: trinity.truth.isChained ? "Linked" : "Root" },
            ],
            active: trinity.truth.status === "VALID",
        },
        {
            title: "善 (Thankful)",
            subtitle: "Transparent (可透明)",
            status: trinity.order.status,
            color: "text-amber-600",
            bg: "bg-amber-600/5",
            border: "border-amber-600/10",
            icon: Target,
            details: [
                { label: "Framework", value: trinity.order.standards[0] || "None" },
                { label: "Alignment", value: trinity.order.standards.length > 0 ? "Complete" : "Pending" },
            ],
            active: trinity.order.status === "ALIGNED",
        },
        {
            title: "通 (Transferful)",
            subtitle: "Trackable (可追蹤)",
            status: trinity.flow.status,
            color: "text-indigo-500",
            bg: "bg-indigo-500/5",
            border: "border-indigo-500/10",
            icon: Activity,
            details: [
                { label: "Trace Depth", value: `${trinity.flow.depth} Nodes` },
                { label: "Activity", value: trinity.flow.status === "ACTIVE" ? "Persistent" : "Stagnant" },
            ],
            active: trinity.flow.status === "ACTIVE",
        },
    ];

    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-3 gap-4", className)}>
            {cards.map((card, i) => (
                <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                        "p-5 rounded-[24px] border transition-all duration-300 relative overflow-hidden",
                        card.bg,
                        card.border,
                        !card.active && "grayscale opacity-60"
                    )}
                >
                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div>
                            <span className={cn("text-[10px] font-black uppercase tracking-widest block mb-1", card.color)}>
                                {card.subtitle}
                            </span>
                            <h4 className="text-lg font-black text-stitch-text tracking-tighter uppercase leading-none">
                                {card.title}
                            </h4>
                        </div>
                        <div className={cn("p-2.5 rounded-xl bg-white shadow-sm", card.color)}>
                            <card.icon className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10">
                        {card.details.map((detail, idx) => (
                            <div key={idx} className="flex justify-between items-center border-b border-black/5 pb-2 last:border-none">
                                <span className="text-[9px] font-bold text-stitch-muted uppercase tracking-tighter">{detail.label}</span>
                                <span className="text-[10px] font-black text-stitch-text font-mono">{detail.value}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-center gap-2 relative z-10">
                        <div className={cn(
                            "w-1.5 h-1.5 rounded-full animate-pulse",
                            card.active ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                        <span className="text-[9px] font-black uppercase tracking-widest text-stitch-text">
                            {card.status}
                        </span>
                    </div>

                    {/* Decorative Mesh Background */}
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(circle_at_center,black_1px,transparent_1px)] [background-size:12px_12px]" />
                </motion.div>
            ))}
        </div>
    );
}
