"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Activity, Share2, Layers } from "lucide-react";

interface CelestialArtifactProps {
    artifact: {
        _core: {
            uuid: string;
            version: string;
            evidence: any[];
        };
        hash_lock: string;
        [key: string]: any;
    };
}

/**
 * 🥛 CelestialArtifactCell: Liquid Glass Component.
 * Visualizes the 5T state with premium animations.
 */
export const CelestialArtifactCell: React.FC<CelestialArtifactProps> = ({ artifact }) => {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        // Trigger "Crystallization" effect when version changes
        setPulse(true);
        const timer = setTimeout(() => setPulse(false), 1500);
        return () => clearTimeout(timer);
    }, [artifact._core.version]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`relative p-6 rounded-4xl overflow-hidden transition-all duration-700
        bg-white/10 backdrop-blur-2xl border border-white/20 shadow-[0_8px_32px_0_rgba(31,38,135,0.1)]
        ${pulse ? "ring-2 ring-[#63a6b0]/50 shadow-[0_0_40px_rgba(99,166,176,0.2)]" : ""}
      `}
        >
            {/* Liquid Ripple Background */}
            {pulse && (
                <motion.div
                    initial={{ scale: 0, opacity: 0.5 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ duration: 1.5 }}
                    className="absolute inset-0 bg-gradient-to-br from-[#63a6b0]/20 to-transparent rounded-full"
                />
            )}

            <div className="relative z-10 space-y-6 text-slate-800">
                <div className="flex justify-between items-center">
                    <div className="bg-[#63a6b0]/10 p-2 rounded-xl">
                        <Layers className="w-5 h-5 text-[#63a6b0]" />
                    </div>
                    <span className="text-[10px] font-black bg-slate-800 text-white px-3 py-1 rounded-full tracking-widest uppercase">
                        v{artifact._core.version}
                    </span>
                </div>

                <div className="space-y-4">
                    <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Digital Agency ID</p>
                        <p className="text-xs font-mono font-bold truncate opacity-80">{artifact._core.uuid}</p>
                    </div>

                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <Shield className="w-3 h-3 text-emerald-500" />
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Hash Lock (Trustworthy)</p>
                        </div>
                        <p className="text-xs font-mono font-bold text-emerald-600 truncate">{artifact.hash_lock.substring(0, 32)}...</p>
                    </div>
                </div>

                {/* Evidence Chain */}
                <div className="pt-4 border-t border-slate-100 space-y-3">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Chain (Traceable)</p>
                        <Activity className="w-3 h-3 text-[#63a6b0] animate-pulse" />
                    </div>
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                        {artifact._core.evidence.map((ev, i) => (
                            <div key={i} className="min-w-[120px] bg-slate-50 border border-slate-100 p-2 rounded-xl space-y-1 hover:bg-white hover:shadow-sm transition-all">
                                <p className="text-[8px] font-black text-[#63a6b0] truncate">{ev.hook_event}</p>
                                <p className="text-[10px] font-bold text-slate-400 truncate">@{ev.source_origin}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="w-full bg-slate-800 text-white py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-[#63a6b0] transition-colors flex items-center justify-center gap-3 group">
                    <Share2 className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> 執行跨平台流轉 (Transfer)
                </button>
            </div>
        </motion.div>
    );
};
