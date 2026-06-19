"use client";

import React, { useState, useEffect } from "react";
import { Timer, Calendar, Zap, Waves, TrendingUp } from "lucide-react";

/**
 * 🔮 ChronoMatrix - Temporal Progress Visualization
 * 
 * Features a "Liquid Progress Sphere" that represents data completeness.
 * Includes a "Sentient Reminder" row with regulatory awareness.
 */
export const ChronoMatrix: React.FC<{ progress: number }> = ({ progress }) => {
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => setPulse((p) => !p), 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="bg-white/40 backdrop-blur-xl border border-white/40 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            {/* Background Liquid Glass Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#63a6b0]/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-blue-300/20 rounded-full blur-3xl" />

            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                {/* Progress Sphere */}
                <div className="relative w-32 h-32 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-4 border-[#63a6b0]/20 scale-110" />
                    <div
                        className="absolute inset-0 rounded-full overflow-hidden border-2 border-[#63a6b0] shadow-[0_0_20px_rgba(99,166,176,0.5)]"
                        style={{ isolation: "isolate" }}
                    >
                        {/* Waves */}
                        <div
                            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#63a6b0] to-[#88c5d1] transition-all duration-1000 ease-in-out"
                            style={{ height: `${progress}%` }}
                        >
                            <div className="absolute -top-4 left-0 w-[200%] h-8 bg-white/20 animate-wave-slow rounded-[40%]" />
                            <div className="absolute -top-4 left-0 w-[200%] h-8 bg-white/30 animate-wave-fast rounded-[43%] translate-x-1/2" />
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-2xl font-black text-white mix-blend-difference drop-shadow-sm">{progress}%</span>
                        </div>
                    </div>
                </div>

                {/* Info & Alerts */}
                <div className="flex-1 space-y-4">
                    <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold text-gray-800">萬能時空曆 Chrono-Matrix</h3>
                        <span className="bg-[#63a6b0]/10 text-[#63a6b0] px-2 py-0.5 rounded text-[10px] font-bold uppercase">Ready</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white/60 p-3 rounded-xl border border-white/40 flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[#63a6b0]" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400">離截止還剩</p>
                                <p className="text-sm font-bold text-gray-700">14 天</p>
                            </div>
                        </div>
                        <div className="bg-white/60 p-3 rounded-xl border border-white/40 flex items-center gap-3">
                            <Timer className="w-5 h-5 text-[#63a6b0]" />
                            <div>
                                <p className="text-[10px] font-bold text-gray-400">系統建議進度</p>
                                <p className="text-sm font-bold text-gray-700">85%</p>
                            </div>
                        </div>
                    </div>

                    <div className={`p-3 rounded-xl transition-all duration-300 flex items-center gap-3
            ${pulse ? "bg-amber-50 border-amber-200" : "bg-white/60 border-white/40"}`}>
                        <Zap className={`w-5 h-5 text-amber-500 ${pulse ? "scale-110" : ""}`} />
                        <p className="text-xs text-amber-700 font-medium">
                            法規感知：FSC 97 申報窗口將於 24 小時後進入「預檢模式」，請加快證據鏈封印。
                        </p>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes wave-slow {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        @keyframes wave-fast {
          from { transform: translateX(0) }
          to { transform: translateX(-50%) }
        }
        .animate-wave-slow { animation: wave-slow 8s linear infinite; }
        .animate-wave-fast { animation: wave-fast 4s linear infinite; }
      `}</style>
        </div>
    );
};
