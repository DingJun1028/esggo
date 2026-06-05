'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Bot, Cpu, Zap, Activity, Brain, Share2, Layers, Network, Loader2, PlayCircle, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OmniAgentOrchestratorPage() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [taskInput, setTaskInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);

  const triggerAwakeningSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      alert('【萬能智庫·神經共享】已成功將新技能擴散至全域神經網絡！');
    }, 2000);
  };

  const runCommand = async () => {
    if (!taskInput) return;
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setTaskInput('');
      alert('【Swarm Routing】任務已委派至最佳 OmniAgent 節點處理。');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-cyan-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(139,92,246,0.15)] relative group">
              <div className="absolute inset-0 bg-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Bot className="text-purple-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="success" size="sm" icon={<Brain size={12}/>}>Awakening Talent</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">oX-CORE</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">OmniAgent 萬能智庫</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Global Swarm Orchestrator</p>
            </div>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="outline" icon={<Share2 size={16} />} onClick={triggerAwakeningSync} isLoading={isSyncing}>
                強制神經同步
             </UniversalButton>
             <UniversalButton variant="primary" className="bg-gradient-to-r from-purple-600 to-cyan-600 border-none" icon={<Activity size={16} />}>
                啟動全域掃描
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Visual Topology Map */}
           <div className="lg:col-span-3 space-y-8">
              <UniversalCard variant="glow" className="aspect-video relative overflow-hidden bg-black/40 border-cyan-500/20 p-0 flex items-center justify-center group">
                 <div className="absolute inset-0 cyber-grid opacity-20" />
                 
                 {/* Simulated Nodes */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-32 h-32 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex flex-col items-center justify-center text-cyan-400 z-10">
                       <Zap size={32} />
                       <span className="text-[10px] font-black mt-2">OMNI-CORE</span>
                    </motion.div>
                    
                    {[
                      { deg: 0, label: 'Jules (Root Cause)' }, 
                      { deg: 120, label: 'Antigravity (Full-Stack)' }, 
                      { deg: 240, label: 'Pencil (UI/UX)' }
                    ].map((node, i) => (
                      <motion.div 
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-full h-full"
                        style={{ transform: `rotate(${node.deg}deg)` }}
                      >
                         <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-20 h-20 rounded-2xl bg-white/5 border border-purple-500/30 flex flex-col items-center justify-center text-purple-300 backdrop-blur-xl hover:bg-purple-500/20 transition-colors cursor-pointer group/node">
                            <Network size={24} className="group-hover/node:scale-110 transition-transform" />
                            <span className="text-[8px] font-black mt-1 opacity-50 group-hover/node:opacity-100 text-center px-1 leading-tight">{node.label}</span>
                         </div>
                      </motion.div>
                    ))}

                    {/* Connecting Lines (Simulated) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
                       <circle cx="50%" cy="50%" r="35%" fill="none" stroke="url(#gradient)" strokeWidth="1" strokeDasharray="4,4" className="animate-[spin_30s_linear_infinite]" />
                       <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="#06b6d4" />
                             <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                       </defs>
                    </svg>
                 </div>

                 <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <UniversalBadge variant="success" icon={<ShieldCheck size={12}/>}>5T Protocol: Active</UniversalBadge>
                    <p className="text-[10px] font-mono text-white/30">OmniAgentBus_ID: 0x82...f9e2</p>
                 </div>
              </UniversalCard>

              {/* Task Dispatcher */}
              <UniversalCard title="任務指派與 Swarm Routing" variant="bordered">
                 <div className="space-y-6">
                    <div className="flex gap-4">
                      <input 
                        type="text" 
                        value={taskInput}
                        onChange={e => setTaskInput(e.target.value)}
                        placeholder="請輸入欲委派之任務，如：'自動抓取公開網頁'、'生成永續藍圖'..."
                        className="flex-1 px-4 py-2 border border-slate-700/50 rounded-xl bg-black/40 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                      />
                      <UniversalButton variant="primary" onClick={runCommand} disabled={!taskInput || isRunning}>
                        {isRunning ? <Loader2 size={16} className="animate-spin" /> : '執行 (Execute)'}
                      </UniversalButton>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                       <button onClick={() => setTaskInput('執行自主報告生成 (SustainWrite)')} className="p-3 text-xs font-bold bg-white/5 hover:bg-cyan-500/20 border border-white/5 hover:border-cyan-500/30 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <PlayCircle size={14}/> SustainWrite
                       </button>
                       <button onClick={() => setTaskInput('深度同步至 NCBDB')} className="p-3 text-xs font-bold bg-white/5 hover:bg-purple-500/20 border border-white/5 hover:border-purple-500/30 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Activity size={14}/> NCBDB Sync
                       </button>
                       <button onClick={() => setTaskInput('執行蜂群實證稽核')} className="p-3 text-xs font-bold bg-white/5 hover:bg-emerald-500/20 border border-white/5 hover:border-emerald-500/30 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <ShieldCheck size={14}/> Swarm Audit
                       </button>
                       <button onClick={() => setTaskInput('自動熵減與防綠漂檢查')} className="p-3 text-xs font-bold bg-white/5 hover:bg-amber-500/20 border border-white/5 hover:border-amber-500/30 rounded-xl transition-colors flex items-center justify-center gap-2">
                          <Brain size={14}/> Entropy Check
                       </button>
                    </div>
                 </div>
              </UniversalCard>
           </div>

           {/* Metrics */}
           <div className="space-y-8">
              <UniversalCard title="全域神經狀態" variant="glass">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">已掛載技能 (Skills Loaded)</p>
                       <p className="text-2xl font-black text-cyan-400">24 / 24</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">神經同步延遲 (Sync Latency)</p>
                       <p className="text-2xl font-black text-emerald-400">12ms</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">活躍代理 (Active Swarm Nodes)</p>
                       <p className="text-2xl font-black text-purple-400">3 Nodes</p>
                    </div>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-[2rem] border border-purple-500/30">
                 <Layers size={32} className="text-purple-400 mb-4" />
                 <h4 className="font-bold">萬能智庫 (Awakening Talent)</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed mt-2">
                    「一點習得，全網賦能」。系統中任何代理習得新技術，將觸發數據廣播，實現知識零延遲擴散，完全消除重複學習與計算冗餘。
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
