'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Bot, Cpu, Zap, Settings, Shield, Terminal, Play, Power, Plus, Search, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const AGENTS = [
  { id: 'omni-core', name: 'OmniAgent Core', role: 'System Orchestrator', status: 'Active', load: '12%', memory: '2.4GB', icon: <Bot className="text-cyan-core" /> },
  { id: 'carbon-bot', name: 'CarbonBot', role: 'Environmental Analysis', status: 'Active', load: '45%', memory: '1.8GB', icon: <Cpu className="text-emerald-400" /> },
  { id: 'legal-guard', name: 'LegalGuard', role: 'Compliance Checking', status: 'Standby', load: '0%', memory: '512MB', icon: <Shield className="text-amber-400" /> },
  { id: 'writer-pro', name: 'WriterPro', role: 'Report Generation', status: 'Busy', load: '88%', memory: '4.2GB', icon: <Terminal className="text-rose-400" /> },
];

export default function AgentsPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🤖">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Bot className="text-cyan-core" /> 代理專區 Agents
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              調度您的 AI 蜂群。管理專屬代理人的部署狀態、技能組合與算力分配。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
               <Settings size={16} /> 蜂群設定
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
               <Plus size={16} /> 訓練新代理
            </UniversalButton>
          </div>
        </header>

        {/* Global Agent Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-core/10 flex items-center justify-center text-cyan-core">
                 <Zap size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Total Compute</p>
                 <h4 className="text-2xl font-black">42.8 TFLOPS</h4>
              </div>
           </div>
           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                 <Bot size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Active Agents</p>
                 <h4 className="text-2xl font-black">8 Nodes</h4>
              </div>
           </div>
           <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400">
                 <Shield size={32} />
              </div>
              <div>
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Security Level</p>
                 <h4 className="text-2xl font-black">Hardened</h4>
              </div>
           </div>
        </div>

        {/* Agent Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {AGENTS.map((agent) => (
             <motion.div key={agent.id} whileHover={{ scale: 1.02 }}>
                <UniversalCard variant="hologram" className="p-6 space-y-6 hover:border-cyan-500/40 transition-all border-white/10">
                   <div className="flex justify-between items-start">
                      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-cyan-core">
                         {agent.icon}
                      </div>
                      <UniversalBadge variant={agent.status === 'Active' ? 'success' : agent.status === 'Busy' ? 'warning' : 'secondary'} className="text-[8px]">
                         {agent.status}
                      </UniversalBadge>
                   </div>
                   
                   <div className="space-y-1">
                      <h4 className="font-bold text-lg">{agent.name}</h4>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{agent.role}</p>
                   </div>

                   <div className="space-y-3 pt-2">
                      <div className="flex justify-between text-[10px] font-mono">
                         <span className="text-white/30">LOAD</span>
                         <span className="text-cyan-core">{agent.load}</span>
                      </div>
                      <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                         <motion.div initial={{ width: 0 }} animate={{ width: agent.load }} className="h-full bg-cyan-core" />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono">
                         <span className="text-white/30">MEMORY</span>
                         <span className="text-white/60">{agent.memory}</span>
                      </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 pt-2">
                      <UniversalButton variant="secondary" className="text-[10px] h-9 py-0">Skillset</UniversalButton>
                      <UniversalButton variant="primary" className="text-[10px] h-9 py-0 flex items-center justify-center gap-1">
                         <Play size={10} /> Invoke
                      </UniversalButton>
                   </div>
                </UniversalCard>
             </motion.div>
           ))}

           <button className="h-full min-h-[300px] border-2 border-dashed border-white/10 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-white/20 hover:border-cyan-500/30 hover:text-cyan-400/50 transition-all group">
              <div className="p-4 bg-white/5 rounded-full group-hover:bg-cyan-500/10 transition-colors">
                 <Plus size={32} />
              </div>
              <span className="font-bold uppercase tracking-widest text-sm">部署新節點</span>
           </button>
        </div>

        {/* Deployment Log */}
        <UniversalCard title="代理調度日誌 Deployment Log" variant="bordered">
           <div className="space-y-4 font-mono text-[11px] text-white/40">
              <div className="flex gap-4">
                 <span className="text-cyan-core">[14:20:05]</span>
                 <span>OmniAgent Core initiated swarm sync... <span className="text-emerald-400">OK</span></span>
              </div>
              <div className="flex gap-4">
                 <span className="text-cyan-core">[14:20:12]</span>
                 <span>CarbonBot loaded ISO-14064-1 weights.</span>
              </div>
              <div className="flex gap-4">
                 <span className="text-cyan-core">[14:21:30]</span>
                 <span className="text-amber-400">[WARN] LegalGuard memory usage exceeding 90%. Scaling...</span>
              </div>
           </div>
        </UniversalCard>
      </div>
    </div>
  );
}
