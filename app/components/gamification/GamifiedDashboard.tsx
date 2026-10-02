"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Target, CheckCircle, Flame, Star, Shield, Sparkles, Users } from "lucide-react";
import { useOmniGamification } from "@/app/hooks/useOmniGamification";
import { getLeaderboard } from "@/app/actions/gamification";

// Map icon strings back to actual Lucide components
const IconMap = {
  Target: <Target className="w-6 h-6 text-emerald-400" />,
  Flame: <Flame className="w-6 h-6 text-cyan-400" />,
  Shield: <Shield className="w-6 h-6 text-purple-400" />,
  Star: <Star className="w-6 h-6 text-yellow-400" />,
};

type LeaderboardEntry = {
  id: string;
  name: string;
  level: number;
  xp: number;
  avatar: string;
};

export function GamifiedDashboard() {
  const { 
    level, xp, xpNeeded, quests, badges, 
    showLevelUp, lastGainedXp, completeQuest, dismissLevelUp 
  } = useOmniGamification();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    // Fetch real/mock data from Supabase Server Action
    getLeaderboard().then(setLeaderboard);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 p-8 font-sans selection:bg-cyan-500/30 relative overflow-hidden">
      
      {/* ---------------- LEVEL UP OVERLAY ---------------- */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#020617]/80 backdrop-blur-sm"
            onClick={dismissLevelUp}
          >
            <motion.div 
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 12, stiffness: 100 }}
              className="relative flex flex-col items-center justify-center p-12 rounded-3xl bg-gradient-to-b from-cyan-500/20 to-emerald-500/10 border border-cyan-400/30 shadow-[0_0_100px_rgba(6,182,212,0.3)]"
            >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20 pointer-events-none" />
              <motion.div 
                animate={{ rotate: 360 }} 
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none"
              />
              <Sparkles className="w-16 h-16 text-yellow-400 mb-4 animate-pulse relative z-10" />
              <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-300 relative z-10 drop-shadow-lg">
                LEVEL UP!
              </h2>
              <p className="text-xl text-cyan-100 mt-4 font-mono relative z-10">
                您的靈魂等級已躍升至 {level} 級
              </p>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-emerald-400 font-bold mt-2 relative z-10"
              >
                + 已同步至 Supabase 資料庫 (Hash Locked)
              </motion.p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* -------------------------------------------------- */}

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Header Section */}
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-emerald-400 tracking-tight">
              ESG Omni-Core
            </h1>
            <p className="text-slate-400 mt-2">您的永續發展遊戲化控制中心</p>
          </div>
          <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-5 py-3 rounded-2xl shadow-lg shadow-cyan-500/10">
            <Zap className="w-6 h-6 text-cyan-400 animate-pulse" />
            <div className="flex flex-col">
              <span className="text-xl font-bold font-mono text-cyan-50">{xp} <span className="text-sm text-cyan-400">/ {xpNeeded} XP</span></span>
              <AnimatePresence>
                {lastGainedXp > 0 && (
                  <motion.span 
                    initial={{ opacity: 1, y: 0 }}
                    animate={{ opacity: 0, y: -20 }}
                    transition={{ duration: 1.5 }}
                    className="absolute -top-6 right-8 text-emerald-400 font-bold text-sm"
                  >
                    +{lastGainedXp}
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Energy & Quests */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Omni-Energy Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-[inset_0_0_20px_rgba(255,255,255,0.02)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              <div className="flex justify-between items-end mb-4 relative z-10">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-400" />
                    等級 {level}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">萬能能量 (Omni-Energy) 充能中...</p>
                </div>
                <div className="text-sm font-mono text-cyan-400">{(xp / xpNeeded * 100).toFixed(1)}%</div>
              </div>
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5 relative z-10">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / xpNeeded) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/50" />
                </motion.div>
              </div>
            </motion.div>

            {/* Quest Board */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold">每日委託 (Quest Board)</h2>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {quests.map((quest) => (
                    <motion.div 
                      key={quest.id}
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-colors ${
                        quest.completed 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => !quest.completed && completeQuest(quest.id, quest.xpReward)}
                          disabled={quest.completed}
                          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            quest.completed 
                              ? "border-emerald-400 bg-emerald-400 text-[#020617] scale-110" 
                              : "border-slate-500 hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(6,182,212,0.4)] text-transparent hover:text-cyan-400"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className={`font-medium transition-colors ${quest.completed ? "text-slate-400 line-through" : "text-slate-100"}`}>
                            {quest.title}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-slate-800 text-slate-400 mt-2 inline-block">
                            {quest.type.toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className={`font-mono font-bold ${quest.completed ? "text-emerald-400" : "text-cyan-400"}`}>
                        +{quest.xpReward} XP
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Badges & Leaderboard */}
          <div className="space-y-8">
            
            {/* Badges */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <h2 className="text-2xl font-bold">聖所徽章牆</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {badges.map((badge) => (
                  <motion.div
                    key={badge.id}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 border transition-all cursor-default ${
                      badge.unlocked 
                        ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-lg shadow-cyan-500/10" 
                        : "bg-slate-900/50 border-white/5 opacity-50 grayscale"
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-transform group-hover:scale-110 ${
                      badge.unlocked ? "bg-[#020617] shadow-inner border border-white/10" : "bg-slate-800"
                    }`}>
                      {IconMap[badge.iconName]}
                    </div>
                    <h3 className="text-sm font-bold text-center leading-tight">{badge.name}</h3>
                    <div className="absolute inset-0 bg-[#020617]/95 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center z-10 border border-white/10 pointer-events-none">
                      <p className="text-xs text-slate-300 font-medium">{badge.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Leaderboard */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <Users className="w-6 h-6 text-cyan-400" />
                <h2 className="text-2xl font-bold">ESG 永續戰力榜</h2>
              </div>
              <div className="space-y-3">
                {leaderboard.map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-lg shadow-inner">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-slate-200 flex items-center gap-2">
                          {user.name}
                          {index === 0 && <span className="text-xs text-yellow-400 font-mono">TOP 1</span>}
                        </div>
                        <div className="text-xs text-emerald-400">Lv. {user.level}</div>
                      </div>
                    </div>
                    <div className="text-sm font-mono text-cyan-400">{user.xp} XP</div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
