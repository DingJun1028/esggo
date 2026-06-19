"use client";

import React from "react";
import { motion } from "framer-motion";
import { Cloud, Sun, Trees, Wind, Droplets, Info } from "lucide-react";
import { IVillageState } from "@/core/rpg-engine";

interface SustainabilityVillageProps {
    state: IVillageState;
    scenario: { title: string; content: string };
}

/**
 * 🏘️ SustainabilityVillage (善向永續村)
 * 
 * A dynamic landscape reflecting the user's ESG impact and village status.
 */
export const SustainabilityVillage: React.FC<SustainabilityVillageProps> = ({ state, scenario }) => {
    return (
        <div className="bg-gradient-to-b from-sky-50 to-emerald-50 border border-slate-100 rounded-4xl p-8 relative overflow-hidden min-h-[300px]">
            {/* Dynamic Sky and Clouds */}
            <motion.div
                animate={{ x: [-20, 20, -20] }}
                transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-10 left-20 opacity-40 text-[#63a6b0]/40"
            >
                <Cloud className="w-16 h-16" />
            </motion.div>
            <motion.div
                animate={{ x: [100, -100, 100] }}
                transition={{ duration: 25, repeat: Infinity }}
                className="absolute top-24 right-40 opacity-20 text-[#63a6b0]/40"
            >
                <Cloud className="w-24 h-24" />
            </motion.div>

            {/* Sun/Glow (Prosperity Indicator) */}
            <motion.div
                animate={{ scale: [1, 1.1, 1], opacity: [0.6, 0.8, 0.6] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute top-0 right-0 w-80 h-80 bg-[#ffd700]/10 rounded-full blur-3xl -mr-40 -mt-40"
            />
            <Sun className="absolute top-10 right-10 w-12 h-12 text-amber-300 opacity-60" />

            {/* Village Stats Overlay */}
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[
                    { label: "Village Prosperity", val: `${state.prosperity}%`, icon: <Sun className="w-4 h-4" /> },
                    { label: "Ecosystem Health", val: `${state.ecosystemHealth}%`, icon: <Droplets className="w-4 h-4" /> },
                    { label: "Social Cohesion", val: `${state.socialCohesion}%`, icon: <Users className="w-4 h-4 hover:scale-100" /> }, // Standardizing icon
                    { label: "Transparency", val: `${state.transparencyLevel}%`, icon: <Wind className="w-4 h-4" /> },
                ].map((stat, i) => (
                    <div key={i} className="glass border-white/50 p-4 rounded-3xl space-y-1 backdrop-blur-md">
                        <div className="flex items-center gap-2 text-[#63a6b0]">
                            {stat.icon}
                            <span className="text-[9px] font-black uppercase tracking-widest">{stat.label}</span>
                        </div>
                        <p className="text-xl font-black text-slate-800">{stat.val}</p>
                    </div>
                ))}
            </div>

            {/* Scenario Dialogue Box */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="relative z-10 bg-white shadow-2xl shadow-[#63a6b0]/10 border border-slate-100 rounded-3xl p-6 flex gap-4 max-w-2xl mx-auto items-start"
            >
                <div className="p-3 bg-[#63a6b0]/10 rounded-2xl text-[#63a6b0]">
                    <Info className="w-6 h-6" />
                </div>
                <div className="space-y-2">
                    <h5 className="text-sm font-black text-slate-800 tracking-tight flex items-center gap-2">
                        永續劇情報告: <span className="text-[#63a6b0]">{scenario.title}</span>
                    </h5>
                    <p className="text-xs leading-relaxed text-slate-500 font-bold">
                        {scenario.content}
                    </p>
                    <div className="flex gap-2 mt-4">
                        <button className="px-4 py-2 bg-[#63a6b0] text-white text-[10px] font-black rounded-full shadow-lg shadow-[#63a6b0]/20">探索修復任務</button>
                        <button className="px-4 py-2 bg-slate-100 text-slate-400 text-[10px] font-black rounded-full">稍後處理</button>
                    </div>
                </div>
            </motion.div>

            {/* Scenery Icons */}
            <div className="absolute bottom-4 left-10 flex gap-4 text-emerald-600/30">
                <Trees className="w-12 h-12" />
                <Trees className="w-8 h-8 mt-4" />
            </div>
            <div className="absolute bottom-10 right-20 text-emerald-600/20">
                <Trees className="w-20 h-20" />
            </div>
        </div>
    );
};

// Internal icon fix for the loop
const Users = ({ className }: { className: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
);
