'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Command, Cpu, Zap, Activity, Shield, Terminal, Play, Power, Network, Share2, Layers, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HermesOrchestratorPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="⚡">
              VII. 算力與 AI 中控
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Command className="text-cyan-core" /> Hermes 調度器
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              全域任務分配系統。管理跨節點的 Agent 指令流轉，確保複雜 ESG 任務在多代理環境下的高可用性與原子性。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Play size={16} /> 啟動全域掃描
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Visual Topology Map placeholder */}
           <div className="lg:col-span-3 space-y-8">
              <UniversalCard variant="glow" className="aspect-video relative overflow-hidden bg-black/40 border-cyan-500/20 p-0 flex items-center justify-center group">
                 <div className="absolute inset-0 cyber-grid opacity-20" />
                 
                 {/* Simulated Nodes */}
                 <div className="relative w-full h-full flex items-center justify-center">
                    <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity }} className="w-32 h-32 rounded-full bg-cyan-500/10 border-2 border-cyan-500/50 flex flex-col items-center justify-center text-cyan-400">
                       <Zap size={32} />
                       <span className="text-[10px] font-black mt-2">CORE</span>
                    </motion.div>
                    
                    {[0, 120, 240].map((deg, i) => (
                      <motion.div 
                        key={i}
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                        className="absolute w-full h-full"
                        style={{ transform: `rotate(${deg}deg)` }}
                      >
                         <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/30 backdrop-blur-xl">
                            <Activity size={24} />
                         </div>
                      </motion.div>
                    ))}

                    {/* Connecting Lines (Simulated) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
                       <line x1="50%" y1="50%" x2="50%" y2="25%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="50%" y1="50%" x2="30%" y2="70%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                       <line x1="50%" y1="50%" x2="70%" y2="70%" stroke="cyan" strokeWidth="1" strokeDasharray="5,5" />
                    </svg>
                 </div>

                 <div className="absolute top-6 left-6 flex flex-col gap-2">
                    <UniversalBadge variant="success">System: Synchronized</UniversalBadge>
                    <p className="text-[10px] font-mono text-white/30">L_GATE: 0x82...f9e2</p>
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <UniversalCard title="活動任務監控" variant="bordered">
                    <div className="space-y-4">
                       {[
                         { task: 'GRI 302-1 Data Fetching', node: 'Node-A', progress: 85 },
                         { task: 'ZKP Seal Generation', node: 'Node-C', progress: 42 },
                       ].map((t, i) => (
                         <div key={i} className="space-y-2 p-3 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex justify-between text-xs">
                               <span className="font-bold">{t.task}</span>
                               <span className="text-cyan-core font-mono">{t.progress}%</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div animate={{ width: `${t.progress}%` }} className="h-full bg-cyan-core" />
                            </div>
                         </div>
                       ))}
                    </div>
                 </UniversalCard>
                 <UniversalCard title="算力調度策略" variant="bordered">
                    <div className="space-y-3">
                       <button className="w-full py-2 px-4 rounded-xl bg-cyan-core text-void-stark font-bold text-xs">效能優先 (Performance Mode)</button>
                       <button className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs">節能模式 (Eco Mode)</button>
                       <button className="w-full py-2 px-4 rounded-xl bg-white/5 border border-white/10 text-white/60 font-bold text-xs">冗餘模式 (Reliability Mode)</button>
                    </div>
                 </UniversalCard>
              </div>
           </div>

           {/* Metrics */}
           <div className="space-y-8">
              <UniversalCard title="Hermes 實時指標" variant="glass">
                 <div className="space-y-6">
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">Queue Depth</p>
                       <p className="text-2xl font-black">12 Tasks</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">Avg Latency</p>
                       <p className="text-2xl font-black text-cyan-core">42ms</p>
                    </div>
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 mb-1">Active Clusters</p>
                       <p className="text-2xl font-black text-emerald-400">3 Nodes</p>
                    </div>
                    <UniversalButton variant="secondary" className="w-full text-xs mt-4">重置調度隊列</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 rounded-[2rem] border border-purple-500/30">
                 <Layers size={32} className="text-purple-400 mb-4" />
                 <h4 className="font-bold">架構冗餘狀態</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed mt-2">目前部署於 3 個獨立區域，確保任一節點失效時，治理任務自動切換至備援環境。</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
