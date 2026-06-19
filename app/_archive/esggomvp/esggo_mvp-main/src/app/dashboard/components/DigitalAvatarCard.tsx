"use client";

import React from "react";
import { motion } from "framer-motion";
import { User, Shield, Zap, Sparkles, Brain, Heart, Sword, FastForward, Leaf, Users } from "lucide-react";
import { ISixVirtues } from "@/core/rpg-engine";

interface DigitalAvatarCardProps {
    virtues: ISixVirtues;
    level: number;
    title: string;
}

/**
 * 👤 DigitalAvatarCard (數位分身卡)
 * 
 * Visualizes the user's Digital Agency and Six Virtues.
 */
export const DigitalAvatarCard: React.FC<DigitalAvatarCardProps> = ({ virtues, level, title }) => {
    const virtueStats = [
        { label: "智 (Wis)", val: virtues.wisdom, icon: <Brain className="w-4 h-4" />, color: "text-blue-500" },
        { label: "仁 (Ben)", val: virtues.benevolence, icon: <Heart className="w-4 h-4" />, color: "text-rose-500" },
        { label: "勇 (Cou)", val: virtues.courage, icon: <Sword className="w-4 h-4" />, color: "text-orange-500" },
        { label: "誠 (Int)", val: virtues.integrity, icon: <Shield className="w-4 h-4" />, color: "text-emerald-500" },
        { label: "節 (Mod)", val: virtues.moderation, icon: <Leaf className="w-4 h-4" />, color: "text-cyan-500" },
        { label: "和 (Har)", val: virtues.harmony, icon: <Users className="w-4 h-4" />, color: "text-purple-500" },
    ];

    return (
        <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-sm flex flex-col md:flex-row gap-8 overflow-hidden relative">
            {/* Background Texture */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#63a6b0]/5 rounded-full -mr-32 -mt-32 blur-3xl p-ointer-events-none" />

            {/* Avatar Visual */}
            <div className="flex-shrink-0 flex flex-col items-center gap-4">
                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-4 border-[#63a6b0] p-1 shadow-xl shadow-[#63a6b0]/20">
                        <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                            <User className="w-16 h-16 text-slate-400" />
                        </div>
                    </div>
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute bottom-0 right-0 p-2 bg-[#ffd700] rounded-xl text-white shadow-lg"
                    >
                        <Zap className="w-4 h-4" />
                    </motion.div>
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-[#63a6b0] uppercase tracking-widest">Level {level}</p>
                    <h4 className="text-lg font-black text-slate-800">{title}</h4>
                </div>
            </div>

            {/* Virtues Grid */}
            <div className="flex-grow grid grid-cols-2 sm:grid-cols-3 gap-4">
                {virtueStats.map((stat, i) => (
                    <div key={i} className="bg-slate-50/50 border border-slate-100 p-4 rounded-2xl flex flex-col gap-2 hover:border-[#63a6b0]/30 transition-all cursor-default group">
                        <div className="flex items-center gap-2">
                            <div className={`${stat.color} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{stat.label}</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-slate-800">{(stat.val ?? 0)}</span>
                            <span className="text-[9px] font-bold text-slate-400">PTS</span>
                        </div>
                        <div className="h-1 w-full bg-slate-200 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${Math.min(100, (stat.val ?? 0) / 2)}%` }}
                                className={`h-full ${stat.color.replace('text', 'bg')}`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* AI Agency Status */}
            <div className="md:w-48 flex flex-col justify-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="space-y-1">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AI Agency (JunAiKey)</p>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-black text-slate-700 uppercase">Synchronized</span>
                    </div>
                </div>
                <button className="py-2.5 px-4 bg-[#63a6b0] text-white text-[10px] font-black rounded-xl shadow-lg shadow-[#63a6b0]/20 hover:scale-105 transition-all flex items-center justify-center gap-2">
                    <Sparkles className="w-3 h-3" /> 技能修煉
                </button>
            </div>
        </div>
    );
};
