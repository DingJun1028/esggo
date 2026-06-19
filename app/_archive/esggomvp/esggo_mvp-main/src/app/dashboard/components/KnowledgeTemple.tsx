"use client";

import React from "react";
import { motion } from "framer-motion";
import { Award, Lock, Sparkles, Shield } from "lucide-react";
import { IBadgeMetadata, SOVEREIGN_BADGES } from "@/config/badge-metadata";

interface KnowledgeTempleProps {
    ownedBadgeIds: string[];
    userLevel: number;
}

/**
 * 🏛️ KnowledgeTemple (成果聖殿)
 * 
 * Displays Sovereign Badges as high-end glass artifacts.
 */
export const KnowledgeTemple: React.FC<KnowledgeTempleProps> = ({ ownedBadgeIds, userLevel }) => {
    return (
        <div className="space-y-8 bg-white border border-slate-100 rounded-4xl p-8 shadow-sm">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                        成果聖殿 <span className="text-[#63a6b0]">Knowledge Temple</span>
                    </h3>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                        Immutable Sovereign Assets · Permanent Growth
                    </p>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
                    <div className="text-right">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Mastery</p>
                        <p className="text-sm font-black text-[#63a6b0]">LEVEL {userLevel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#63a6b0] to-[#4fd1c5] flex items-center justify-center text-white shadow-lg shadow-[#63a6b0]/20">
                        <Shield className="w-6 h-6" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                {SOVEREIGN_BADGES.map((badge) => {
                    const isOwned = ownedBadgeIds.includes(badge.id);
                    return (
                        <motion.div
                            key={badge.id}
                            whileHover={isOwned ? { y: -5, scale: 1.02 } : {}}
                            className={`relative group flex flex-col items-center p-6 rounded-3xl border transition-all duration-500 ${isOwned
                                    ? 'bg-white border-slate-100 shadow-sm hover:shadow-xl hover:shadow-[#63a6b0]/5 cursor-pointer'
                                    : 'bg-slate-50/50 border-slate-100 grayscale opacity-60'
                                }`}
                        >
                            {/* Liquid Glass Background effect for owned badges */}
                            {isOwned && (
                                <div className="absolute inset-0 bg-gradient-to-tr from-[#63a6b0]/5 to-transparent rounded-3xl" />
                            )}

                            <div className={`relative mb-4 p-4 rounded-2xl ${isOwned
                                    ? 'bg-slate-50 text-[#63a6b0] shadow-inner'
                                    : 'bg-slate-200/50 text-slate-400'
                                }`}>
                                {isOwned ? <Award className="w-8 h-8" /> : <Lock className="w-8 h-8 opacity-40" />}
                                {isOwned && (
                                    <motion.div
                                        animate={{ opacity: [0.5, 1, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                        className="absolute -top-1 -right-1 text-amber-400"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                    </motion.div>
                                )}
                            </div>

                            <div className="text-center space-y-1 relative z-10">
                                <h5 className={`text-xs font-black tracking-tight ${isOwned ? 'text-slate-800' : 'text-slate-400'}`}>
                                    {badge.nameZh}
                                </h5>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                                    {isOwned ? `Tier ${badge.tier}` : `Lock: Lv.${badge.tier}`}
                                </p>
                            </div>

                            {/* Status label for rarity */}
                            {isOwned && (
                                <div className={`mt-3 px-2 py-0.5 rounded-full text-[8px] font-black tracking-widest uppercase border ${badge.rarity === 'DIVINE' ? 'border-amber-200 bg-amber-50 text-amber-600' :
                                        badge.rarity === 'LEGENDARY' ? 'border-purple-200 bg-purple-50 text-purple-600' :
                                            'border-slate-100 bg-slate-50 text-slate-500'
                                    }`}>
                                    {badge.rarity}
                                </div>
                            )}

                            {/* 5T Seal Indicator */}
                            {isOwned && (
                                <div className="absolute bottom-2 right-2">
                                    <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" title="5T Locked" />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <div className="p-4 bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl text-center">
                <p className="text-[10px] font-bold text-slate-400 italic">
                    "Every badge is a 5T-locked component atom, traceable back to your genesis moment."
                </p>
            </div>
        </div>
    );
};
