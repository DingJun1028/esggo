"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { ShieldCheck, Target, Activity, Link, Layers, Sparkles } from "lucide-react";
import { IOmniHeart, getTrinityContext, TRINITY_MANIFEST } from "@/lib/omni-heart";

interface OmniTrinityShieldProps {
    heart: IOmniHeart;
    className?: string;
    size?: "sm" | "md" | "lg";
}

export function OmniTrinityShield({ heart, className, size = "md" }: OmniTrinityShieldProps) {
    const trinity = getTrinityContext(heart);

    const sizeMap = {
        sm: { container: "w-32 h-32", icon: "w-3.5 h-3.5", text: "text-[8px]" },
        md: { container: "w-48 h-48", icon: "w-5 h-5", text: "text-[10px]" },
        lg: { container: "w-64 h-64", icon: "w-6 h-6", text: "text-[12px]" },
    };

    const s = sizeMap[size];

    return (
        <div className={cn("relative flex items-center justify-center", s.container, className)}>
            {/* Background Sacred Geometry Rings */}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute w-full h-full border-[0.5px] border-stitch-teal-start/10 rounded-full"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                    className="absolute w-[80%] h-[80%] border-[0.5px] border-stitch-teal-start/5 rounded-full border-dashed"
                />
            </div>

            {/* Core Divinity Center */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="relative z-20 flex flex-col items-center justify-center text-center"
            >
                <div className="relative">
                    <div className="absolute inset-0 bg-stitch-teal-start/20 blur-xl rounded-full" />
                    <div className="relative w-16 h-16 bg-white rounded-full shadow-[0_8px_24px_rgba(0,158,157,0.1)] border border-stitch-teal-start/20 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-stitch-teal-start tracking-tighter">{trinity.divinity}</span>
                        <span className="text-[7px] font-black text-stitch-muted uppercase tracking-widest leading-none">Integrity</span>
                    </div>
                </div>
            </motion.div>

            {/* Trinity Axis 1: TRUTHFUL (Father) - Top */}
            <TrinityNode
                label="Truthful"
                status={trinity.truth.status}
                subLabel="Traceable"
                icon={ShieldCheck}
                angle={-90}
                radius={size === "sm" ? 45 : 70}
                color="text-stitch-teal-start"
                active={trinity.truth.status === "VALID"}
            />

            {/* Trinity Axis 2: THANKFUL (Son) - Bottom Right */}
            <TrinityNode
                label="Thankful"
                status={trinity.order.status}
                subLabel="Transparent"
                icon={Target}
                angle={30}
                radius={size === "sm" ? 45 : 70}
                color="text-optimal"
                active={trinity.order.status === "ALIGNED"}
            />

            {/* Trinity Axis 3: TRANSFERFUL (Spirit) - Bottom Left */}
            <TrinityNode
                label="Transferful"
                status={trinity.flow.status}
                subLabel="Trackable"
                icon={Activity}
                angle={150}
                radius={size === "sm" ? 45 : 70}
                color="text-indigo-500"
                active={trinity.flow.status === "ACTIVE"}
            />
        </div>
    );
}

function TrinityNode({ label, status, subLabel, icon: Icon, angle, radius, color, active }: any) {
    const x = Math.cos((angle * Math.PI) / 180) * radius;
    const y = Math.sin((angle * Math.PI) / 180) * radius;

    return (
        <motion.div
            initial={{ x: 0, y: 0, opacity: 0 }}
            animate={{ x, y, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            className="absolute flex flex-col items-center group cursor-help"
        >
            <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500",
                active
                    ? "bg-white shadow-lg border border-black/5"
                    : "bg-white/50 border border-black/5 grayscale opacity-40"
            )}>
                <Icon className={cn("w-5 h-5", active ? color : "text-stitch-muted")} />
            </div>

            <div className="mt-2 text-center">
                <p className={cn("text-[9px] font-black uppercase tracking-widest", active ? "text-stitch-text" : "text-stitch-muted")}>
                    {label}
                </p>
                <p className="text-[7px] font-bold text-stitch-muted uppercase tracking-tighter">
                    {subLabel}
                </p>
            </div>

            {/* Tooltip-like popup on hover */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 w-32 p-2 bg-white rounded-xl shadow-2xl border border-black/5 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                <p className="text-[8px] font-black uppercase text-stitch-muted mb-1">{status}</p>
                <p className="text-[7px] text-stitch-text font-medium leading-tight">
                    {label === "Truthful" && "Traceable: Clear origin and ownership."}
                    {label === "Thankful" && "Transparent: ISO aligned & hallucination-free."}
                    {label === "Transferful" && "Trackable: Full lifecycle flow history."}
                </p>
            </div>
        </motion.div>
    );
}
