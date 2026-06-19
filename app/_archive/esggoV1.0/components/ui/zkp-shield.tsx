"use client";

import { motion } from "motion/react";
import { ShieldCheck, ShieldAlert, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ZKPShieldProps {
    status: "unverified" | "verifying" | "verified";
    className?: string;
    size?: "sm" | "md";
}

/**
 * ZKPShield
 * 
 * 零知識證明護盾 - 企業級數據完整性視覺組件。
 */
export function ZKPShield({ status, className, size = "md" }: ZKPShieldProps) {
    const isSm = size === "sm";

    return (
        <div className={cn("relative flex items-center justify-center", className)}>
            {status === "verifying" && (
                <motion.div
                    className="absolute inset-0 rounded-full border border-primary-teal-start/30"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeOut" }}
                />
            )}

            <motion.div
                initial={false}
                animate={{
                    scale: status === "verifying" ? [1, 1.1, 1] : 1,
                    rotate: status === "verifying" ? 360 : 0,
                }}
                transition={{
                    rotate: { repeat: Infinity, duration: 2, ease: "linear" },
                    scale: { repeat: Infinity, duration: 1, ease: "easeInOut" }
                }}
                className={cn(
                    "rounded-full flex items-center justify-center",
                    status === "unverified" && "bg-slate-100 text-slate-400 border border-slate-200",
                    status === "verifying" && "bg-primary-teal-start/10 text-primary-teal-start border border-primary-teal-start/20",
                    status === "verified" && "bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-[0_0_15px_-3px_rgba(16,185,129,0.2)]",
                    isSm ? "w-6 h-6" : "w-10 h-10"
                )}
            >
                {status === "unverified" && <ShieldAlert size={isSm ? 14 : 20} />}
                {status === "verifying" && <Cpu size={isSm ? 14 : 20} className="animate-pulse" />}
                {status === "verified" && <ShieldCheck size={isSm ? 14 : 20} />}
            </motion.div>

            {status === "verified" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute -top-1 -right-1"
                >
                    <div className="w-2 h-2 bg-emerald-500 rounded-full border border-white shadow-sm" />
                </motion.div>
            )}
        </div>
    );
}
