"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { doomsdayClock } from "@/lib/services/doomsday-clock";
import { AlertTriangle, Clock } from "lucide-react";

/**
 * DoomsdayClockTimer (末日時鐘計時器)
 * 轉化 ESG 風險為 85 秒倒數視覺機制。
 */
export const DoomsdayClockTimer: React.FC = () => {
    const [status, setStatus] = useState(doomsdayClock.getStatus());

    useEffect(() => {
        const interval = setInterval(() => {
            // 模擬指針自然走動
            doomsdayClock.tick(0.1);
            setStatus(doomsdayClock.getStatus());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const isCritical = status.secondsToMidnight < 20;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-4 p-4 rounded-xl border ${isCritical
                    ? "bg-red-950/40 border-red-500/50 text-red-100"
                    : "bg-slate-900/60 border-slate-700/50 text-slate-100"
                } backdrop-blur-xl shadow-2xl`}
        >
            <div className="relative">
                <Clock className={`w-8 h-8 ${isCritical ? "animate-pulse text-red-500" : "text-amber-500"}`} />
                {isCritical && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -top-1 -right-1"
                    >
                        <AlertTriangle className="w-4 h-4 text-red-500 fill-red-500/20" />
                    </motion.div>
                )}
            </div>

            <div className="flex flex-col">
                <span className="text-xs font-mono uppercase tracking-widest opacity-60">Doomsday Clock</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-black font-mono tracking-tight ${isCritical ? "text-red-500" : "text-amber-500"}`}>
                        {status.secondsToMidnight.toFixed(1)}
                    </span>
                    <span className="text-sm font-semibold opacity-40">SECONDS</span>
                </div>
            </div>

            <div className="ml-auto flex flex-col items-end">
                <span className="text-[10px] font-mono opacity-40">COORDINATION FAILURES</span>
                <span className={`text-lg font-bold ${status.coordinationFailures > 5 ? "text-red-400" : "text-slate-400"}`}>
                    {status.coordinationFailures}
                </span>
            </div>

            {/* 底部進度條 (時鐘指針視覺化) */}
            <div className="absolute bottom-0 left-0 h-1 bg-slate-800 w-full overflow-hidden rounded-b-xl">
                <motion.div
                    className={`h-full ${isCritical ? "bg-red-600" : "bg-amber-600"}`}
                    initial={{ width: "100%" }}
                    animate={{ width: `${(status.secondsToMidnight / 85) * 100}%` }}
                    transition={{ ease: "linear" }}
                />
            </div>
        </motion.div>
    );
};
