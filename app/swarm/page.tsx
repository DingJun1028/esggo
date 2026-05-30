'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Share2, Bot, Cpu, Zap, Activity, Shield, Terminal, Play, Power, Network, Users, Search, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const WORKERS = [
  { id: 'W-01', type: 'Crawler', status: 'Active', load: '12%', task: 'Monitoring EU Regulations' },
  { id: 'W-02', type: 'Writer', status: 'Active', load: '85%', task: 'Drafting Social Chapter' },
  { id: 'W-03', type: 'Auditor', status: 'Standby', load: '0%', task: 'Idle' },
  { id: 'W-04', type: 'Vision', status: 'Active', load: '42%', task: 'OCR Invoice Processing' },
];

export default function SwarmPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🐝">
              VII. 算力與 AI 中控
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Share2 className="text-cyan-core" /> 代理蜂群 Swarm
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              分散式智能網絡。觀察代理人之間的協作拓樸，監控任務接力狀態，並手動干預蜂群決策。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Plus size={16} /> 增加算力單元
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Worker Grid */}
           <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {WORKERS.map((w) => (
                   <motion.div key={w.id} whileHover={{ y: -5 }}>
                      <UniversalCard variant="hologram" className="p-6 space-y-4 border-white/10 hover:border-cyan-500/40 transition-all">
                         <div className="flex justify-between items-start">
                            <div className="p-3 bg-white/5 rounded-xl text-cyan-core">
                               <Bot size={20} />
                            </div>
                            <UniversalBadge variant={w.status === 'Active' ? 'success' : 'secondary'}>{w.status}</UniversalBadge>
                         </div>
                         <div>
                            <h4 className="font-bold text-lg">{w.id}</h4>
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Type: {w.type}</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-mono">
                               <span className="text-white/30">CPU LOAD</span>
                               <span className="text-cyan-core">{w.load}</span>
                            </div>
                            <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                               <motion.div animate={{ width: w.load }} className="h-full bg-cyan-core" />
                            </div>
                         </div>
                         <div className="pt-2">
                            <p className="text-[10px] text-white/40 font-bold uppercase truncate">Current: {w.task}</p>
                         </div>
                         <div className="flex gap-2 pt-2">
                            <button className="flex-1 py-2 bg-white/5 rounded-lg text-[10px] font-bold hover:bg-white/10 transition-all">TERMINATE</button>
                            <button className="flex-1 py-2 bg-cyan-core/10 text-cyan-400 rounded-lg text-[10px] font-bold hover:bg-cyan-core/20 transition-all border border-cyan-500/20">REBOOT</button>
                         </div>
                      </UniversalCard>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Swarm Intelligence */}
           <div className="space-y-8">
              <UniversalCard title="蜂群意識指標" variant="glass">
                 <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/30">Resonance</p>
                          <h4 className="text-xl font-black text-cyan-core">92.4%</h4>
                       </div>
                       <Activity size={20} className="text-cyan-core animate-pulse" />
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-white/60">協作熵值 (Entropy)</p>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '15%' }} className="h-full bg-emerald-400" />
                       </div>
                       <p className="text-[9px] text-white/30 italic">熵值愈低，代理人之間的溝通效能愈高。</p>
                    </div>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-indigo-900/40 to-cyan-900/40 rounded-[2.5rem] border border-cyan-500/20 text-center">
                 <Network size={32} className="text-cyan-400 mx-auto mb-4" />
                 <h4 className="font-bold">切換全自動治理模式</h4>
                 <p className="text-[10px] text-white/50 leading-relaxed mt-2 mb-6">
                    允許蜂群自主修復損毀的 WIKI 文檔與代碼邏輯斷層。
                 </p>
                 <UniversalButton variant="primary" className="w-full">啟動 AUTONOMOUS</UniversalButton>
              </div>

              <div className="bg-black/40 p-6 rounded-[2rem] border border-white/5">
                 <h5 className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-4">實時指令串流</h5>
                 <div className="space-y-3 font-mono text-[9px] text-cyan-400/60">
                    <p>{'>'} [W-01] Handed over EU-CBAM-2024 to [W-02]</p>
                    <p>{'>'} [W-04] Verification hash 0x82... match [Pass]</p>
                    <p className="animate-pulse">{'>'} Waiting for new task cluster...</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
