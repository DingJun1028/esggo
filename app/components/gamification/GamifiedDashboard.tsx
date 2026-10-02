"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trophy, Target, CheckCircle, Flame, Star, Shield } from "lucide-react";

// ==========================================
// Types & Mock Data
// ==========================================
type Quest = {
  id: string;
  title: string;
  xpReward: number;
  completed: boolean;
  type: "daily" | "weekly" | "epic";
};

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
};

const INITIAL_QUESTS: Quest[] = [
  { id: "q1", title: "完成 Scope 1 碳排數據初審", xpReward: 50, completed: false, type: "daily" },
  { id: "q2", title: "清理 3 個系統熵增警告 (Entropy)", xpReward: 100, completed: false, type: "daily" },
  { id: "q3", title: "連續 5 天登入 ESG 儀表板", xpReward: 300, completed: false, type: "weekly" },
];

const BADGES: Badge[] = [
  { id: "b1", name: "淨零先鋒", description: "完成首次碳中和目標設定", icon: <Target className="w-6 h-6 text-emerald-400" />, unlocked: true },
  { id: "b2", name: "熵減煉金術士", description: "解決超過 50 個代碼/系統警告", icon: <Flame className="w-6 h-6 text-cyan-400" />, unlocked: true },
  { id: "b3", name: "守密者", description: "成功觸發 10 次 Hash Lock 驗證", icon: <Shield className="w-6 h-6 text-purple-400" />, unlocked: false },
  { id: "b4", name: "萬能共鳴", description: "與全通之心達成 100% 同步率", icon: <Star className="w-6 h-6 text-yellow-400" />, unlocked: false },
];

// ==========================================
// Components
// ==========================================

export function GamifiedDashboard() {
  const [level, setLevel] = useState(12);
  const [xp, setXp] = useState(850);
  const xpNeeded = 1000;
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);

  const handleCompleteQuest = (id: string, reward: number) => {
    setQuests((prev) =>
      prev.map((q) => (q.id === id ? { ...q, completed: true } : q))
    );
    
    // Add XP and handle level up
    setXp((prev) => {
      const newXp = prev + reward;
      if (newXp >= xpNeeded) {
        setLevel((l) => l + 1);
        return newXp - xpNeeded;
      }
      return newXp;
    });
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 p-8 font-sans selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto space-y-8">
        
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
            <span className="text-xl font-bold font-mono text-cyan-50">{xp} <span className="text-sm text-cyan-400">/ {xpNeeded} XP</span></span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Column: Energy & Quests */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Omni-Energy Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
              
              <div className="flex justify-between items-end mb-4">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-5 h-5 text-emerald-400" />
                    等級 {level}
                  </h2>
                  <p className="text-slate-400 text-sm mt-1">萬能能量 (Omni-Energy) 充能中...</p>
                </div>
                <div className="text-sm font-mono text-cyan-400">{(xp / xpNeeded * 100).toFixed(1)}%</div>
              </div>
              
              <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <motion.div 
                  className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 relative"
                  initial={{ width: 0 }}
                  animate={{ width: `${(xp / xpNeeded) * 100}%` }}
                  transition={{ type: "spring", stiffness: 50, damping: 15 }}
                >
                  {/* Glare effect */}
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
                      whileHover={{ scale: 1.01, backgroundColor: "rgba(255,255,255,0.08)" }}
                      className={`flex items-center justify-between p-5 rounded-2xl border transition-colors ${
                        quest.completed 
                          ? "bg-emerald-500/10 border-emerald-500/30" 
                          : "bg-white/5 border-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => !quest.completed && handleCompleteQuest(quest.id, quest.xpReward)}
                          disabled={quest.completed}
                          className={`flex-shrink-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                            quest.completed 
                              ? "border-emerald-400 bg-emerald-400 text-[#020617]" 
                              : "border-slate-500 hover:border-cyan-400 text-transparent hover:text-cyan-400"
                          }`}
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                        <div>
                          <h3 className={`font-medium ${quest.completed ? "text-slate-400 line-through" : "text-slate-100"}`}>
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

          {/* Right Column: Badges */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 h-fit"
          >
            <div className="flex items-center gap-3 mb-6">
              <Trophy className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold">聖所徽章牆</h2>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {BADGES.map((badge) => (
                <motion.div
                  key={badge.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={`group relative aspect-square rounded-2xl flex flex-col items-center justify-center p-4 border transition-all cursor-default ${
                    badge.unlocked 
                      ? "bg-gradient-to-br from-white/10 to-white/5 border-white/20 shadow-lg shadow-cyan-500/10" 
                      : "bg-slate-900/50 border-white/5 opacity-50 grayscale"
                  }`}
                >
                  {/* Icon Container */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
                    badge.unlocked ? "bg-[#020617] shadow-inner border border-white/10" : "bg-slate-800"
                  }`}>
                    {badge.icon}
                  </div>
                  <h3 className="text-sm font-bold text-center leading-tight">{badge.name}</h3>
                  
                  {/* Tooltip */}
                  <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4 text-center z-10 border border-white/10 pointer-events-none">
                    <p className="text-xs text-slate-300">{badge.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          
        </div>
      </div>
    </div>
  );
}
