"use client";

import React from "react";
import { motion } from "framer-motion";
import { Scroll, CheckCircle2, Circle, AlertCircle } from "lucide-react";

interface Quest {
    id: string;
    title: string;
    description: string;
    reward: number;
    status: 'available' | 'in_progress' | 'completed';
}

interface QuestBoardProps {
    quests: Quest[];
}

/**
 * 📜 QuestBoard (任務布告欄)
 * 
 * Displays active and available quests for the user's ESG journey.
 */
export const QuestBoard: React.FC<QuestBoardProps> = ({ quests }) => {
    return (
        <div className="bg-white border border-slate-100 rounded-4xl p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center">
                <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
                    <Scroll className="w-4 h-4 text-[#63a6b0]" /> 善向永續任務
                </h4>
                <span className="text-[10px] font-bold text-slate-400">{quests.length} Active</span>
            </div>

            <div className="space-y-4">
                {quests.map((quest) => (
                    <motion.div
                        key={quest.id}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className={`p-4 rounded-3xl border ${quest.status === 'completed' ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100'} flex gap-4 items-start group hover:border-[#63a6b0]/30 transition-all cursor-pointer`}
                    >
                        <div className={`mt-1 ${quest.status === 'completed' ? 'text-emerald-500' : 'text-slate-300'}`}>
                            {quest.status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                        </div>
                        <div className="flex-grow space-y-1">
                            <h5 className="text-xs font-black text-slate-800">{quest.title}</h5>
                            <p className="text-[10px] font-bold text-slate-500 leading-relaxed">{quest.description}</p>
                            <div className="flex items-center gap-4 mt-2">
                                <span className="text-[9px] font-black text-[#63a6b0] uppercase tracking-widest"> Reward: {quest.reward} XP</span>
                                {quest.status === 'available' && (
                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Urgent
                                    </span>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
