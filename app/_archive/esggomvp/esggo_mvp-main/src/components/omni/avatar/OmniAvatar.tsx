"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap, User } from 'lucide-react';
import { IAvatarCore } from '@/core/omni-types';
import { OmniBase } from '@/core/OmniBase';
import { LiquidGlassContainer } from '../liquid-glass/LiquidGlassContainer';
import { VirtueHexChart } from './VirtueHexChart';


interface OmniAvatarProps {
    avatar: IAvatarCore;
    onAction?: () => void;
}

/**
 * 👤 OmniAvatar (數位分身組件)
 * 
 * 整合「等級系統」、「六德導圖」與「LiquidGlass」效果。
 * 這是用戶在 OmniUniverse 中的數位主體 (Digital Agency) 顯化。
 */
export const OmniAvatar: React.FC<OmniAvatarProps> = ({ avatar, onAction }) => {
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Pane: Avatar Appearance & Rank */}
            <LiquidGlassContainer
                className="w-full lg:w-72 p-6 flex flex-col items-center gap-6"
                variant="default"
                glowColor="#63a6b0"
                intensity="high"
            >
                <div className="relative group">
                    <div className="w-40 h-40 rounded-full border-4 border-[#63a6b0] p-1 shadow-2xl shadow-[#63a6b0]/30 overflow-hidden bg-slate-50">
                        <div className="w-full h-full rounded-full flex items-center justify-center bg-gradient-to-br from-slate-100 to-white">
                            <User className="w-20 h-20 text-slate-300" />
                        </div>
                    </div>

                    {/* Level Badge */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.2, rotate: 15 }}
                        className="absolute -bottom-2 -right-2 bg-[#ffd700] text-slate-900 px-3 py-1 rounded-full text-xs font-black shadow-lg flex items-center gap-1 border-2 border-white cursor-help"
                        title={`Current Level: ${avatar.level}`}
                    >
                        <Zap className="w-3 h-3 fill-current" />
                        LV.{avatar.level}
                    </motion.div>
                </div>

                <div className="text-center space-y-1">
                    <h3 className="text-xl font-black text-slate-800 tracking-tight">{avatar.nickname}</h3>
                    <p className="text-[10px] font-black text-[#63a6b0] uppercase tracking-[0.2em]">
                        {OmniBase.getRank(avatar.level)}
                    </p>
                </div>

                {/* EXP Bar */}
                <div className="w-full space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 px-1">
                        <span>EXP</span>
                        <span>{avatar.exp} / 1000</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(avatar.exp / 1000) * 100}%` }}
                            className="h-full bg-gradient-to-r from-[#63a6b0] to-[#ffd700]"
                        />
                    </div>
                </div>

                {/* Laws */}
                <div className="w-full space-y-3 pt-4 border-t border-[#63a6b0]/10">
                    <div className="p-3 bg-white/40 rounded-xl space-y-1 border border-white/20">
                        <p className="text-[9px] font-black text-[#63a6b0] uppercase tracking-widest">自然共鳴律</p>
                        <p className="text-[10px] font-medium text-slate-600 italic">"{avatar.natureLaw}"</p>
                    </div>
                    <div className="p-3 bg-white/40 rounded-xl space-y-1 border border-white/20">
                        <p className="text-[9px] font-black text-[#63a6b0] uppercase tracking-widest">誠信閉環律</p>
                        <p className="text-[10px] font-medium text-slate-600 italic">"{avatar.closingLaw}"</p>
                    </div>
                </div>
            </LiquidGlassContainer>

            {/* Right Pane: Virtue Fingerprint Hex Chart */}
            <div className="flex-grow flex flex-col gap-4">
                <div className="bg-white/80 backdrop-blur-xl border border-slate-100 p-6 rounded-[2rem] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-[#63a6b0]/10 rounded-xl text-[#63a6b0]">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 uppercase tracking-tight">全人職能導圖</h4>
                        </div>
                        <div className="text-[10px] font-black px-3 py-1 bg-emerald-100 text-emerald-600 rounded-full flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            5T PROTOCOL VERIFIED
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <VirtueHexChart virtues={avatar.virtues} />
                    </div>

                    <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {Object.entries(avatar.virtues).map(([key, val]) => (
                            <div key={key} className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-center space-y-1 group hover:border-[#63a6b0] transition-colors">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key}</p>
                                <p className="text-base font-black text-slate-800 group-hover:text-[#63a6b0] transition-colors">{val}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    onClick={onAction}
                    className="w-full py-4 bg-[#63a6b0] text-white font-black rounded-2xl shadow-xl shadow-[#63a6b0]/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 group"
                >
                    <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                    進入技能修煉場 (Omni-Forge)
                </button>
            </div>
        </div>
    );
};
