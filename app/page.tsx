'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowRight, Cpu, Bot, CheckCircle, Database, Leaf, Users, Play, Activity, Sparkles } from 'lucide-react';
import { BrandButton, BrandCard, BrandBadge, BrandStatusDot, BrandProgress } from '../components/brand';
import { AgentStep } from '../lib/agent/v3-shared';

export default function LandingPage() {
  // Swarm V3 Showcase state
  const [v3Steps, setV3Steps] = useState<AgentStep[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const streamEndRef = useRef<HTMLDivElement>(null);

  const startDemo = () => {
    setIsExecuting(true);
    setV3Steps([]);
    // Simulate some events
    const demoSteps = [
      { id: '1', status: 'PLANNING', agentName: 'Aurora', message: 'Analyzing ESG GO deployment status...', timestamp: Date.now() },
      { id: '2', status: 'EXECUTING', agentName: 'ESG-Scribe', message: 'Generating GRI 305 draft...', timestamp: Date.now() + 1000 },
      { id: '3', status: 'SUCCESS', agentName: 'CBAM-Sentinel', message: 'Validated Q3 emission data.', timestamp: Date.now() + 2500 }
    ];

    demoSteps.forEach((step, idx) => {
      setTimeout(() => {
        setV3Steps(prev => [...prev, step as AgentStep]);
        if (idx === demoSteps.length - 1) {
          setTimeout(() => setIsExecuting(false), 1000);
        }
      }, idx * 1500);
    });
  };

  useEffect(() => {
    streamEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [v3Steps]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNING': return 'var(--blue-700)';
      case 'EXECUTING': return 'var(--purple-600)';
      case 'SUCCESS': return 'var(--green-600)';
      default: return 'var(--slate-400)';
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden font-sans selection:bg-blue-500/30 selection:text-blue-200">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[30%] w-[40%] h-[40%] bg-emerald-900/10 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col gap-24">
        
        {/* Navigation / Header Mock */}
        <header className="flex justify-between items-center w-full fade-in">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-800 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
                <Leaf size={20} className="text-white" />
             </div>
             <span className="text-xl font-black tracking-tight text-white">ESG <span className="text-blue-400">GO</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/dashboard">
              <BrandButton variant="ghost">登入</BrandButton>
            </Link>
            <Link href="/dashboard">
              <BrandButton variant="primary" className="rounded-full px-6 shadow-lg shadow-blue-500/20">進入主控台</BrandButton>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 mt-12 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-950/50 border border-blue-800/50 text-blue-300 text-xs font-bold uppercase tracking-widest backdrop-blur-md"
          >
            <Sparkles size={14} className="text-blue-400" />
            Introducing OmniHermes Swarm V3
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 tracking-tight leading-[1.1]"
          >
            永續治理的 <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">次世代 AI 代理引擎</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl font-light leading-relaxed"
          >
            ESG GO 結合零知識證明與多重 AI 代理蜂群技術，為企業自動化處理合規驗證、碳盤查與永續報告，釋放無限潛能。
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/dashboard">
               <BrandButton variant="primary" className="rounded-2xl px-8 h-14 text-lg shadow-xl shadow-blue-600/20 group">
                 開始體驗 <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </BrandButton>
            </Link>
            <BrandButton variant="outline" className="rounded-2xl px-8 h-14 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => document.getElementById('swarm-showcase')?.scrollIntoView({behavior: 'smooth'})}>
              觀看 Swarm V3 演示
            </BrandButton>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-16">
          {[
            { title: 'Evidence Vault', icon: <Shield size={24} className="text-emerald-400"/>, desc: '透過 ZKP 技術封印您的永續證據，確保資料不可篡改且隱私安全無虞。' },
            { title: 'Agent Orchestration', icon: <Cpu size={24} className="text-blue-400"/>, desc: 'OmniHermes 自動調度多個專屬 AI 代理，並行處理數據分析與報告生成。' },
            { title: 'GRI/CBAM Compliance', icon: <Database size={24} className="text-purple-400"/>, desc: '內建最新法規框架，即時追蹤合規完成度並自動預警異常數據。' }
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <BrandCard padding="lg" className="h-full bg-slate-900/40 backdrop-blur-md border border-slate-800 hover:border-slate-600 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </BrandCard>
            </motion.div>
          ))}
        </section>

        {/* Swarm V3 Interactive Showcase */}
        <section id="swarm-showcase" className="relative z-10 pt-16 border-t border-slate-800/50">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">Swarm V3 <span className="text-blue-400">Live Demo</span></h2>
             <p className="text-slate-400">體驗代理蜂群的實時任務調度與自主執行過程</p>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Agent Status Pane */}
              <BrandCard className="bg-slate-900/50 border-slate-800 p-6 flex flex-col justify-center">
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2">
                       <Bot size={20} className="text-blue-400"/>
                       <h3 className="text-lg font-bold text-white">活躍代理 (Active Agents)</h3>
                    </div>
                    <BrandButton variant="ghost" size="sm" onClick={startDemo} disabled={isExecuting} className="text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 rounded-lg">
                       {isExecuting ? <Activity className="animate-pulse" size={16}/> : <Play size={16} className="mr-1"/>}
                       {isExecuting ? '執行中...' : '啟動展示'}
                    </BrandButton>
                 </div>
                 
                 <div className="space-y-6">
                    {[
                      { name: 'Aurora', role: 'Orchestrator', health: 100, active: isExecuting },
                      { name: 'ESG-Scribe', role: 'Builder', health: 98, active: v3Steps.length > 0 && isExecuting },
                      { name: 'CBAM-Sentinel', role: 'Validator', health: 100, active: v3Steps.length > 1 && isExecuting },
                    ].map((agent, i) => (
                       <div key={i} className="flex items-center gap-4">
                          <BrandStatusDot status={agent.active ? 'active' : 'inactive'} pulse={agent.active} size="sm" />
                          <div className="flex-1">
                             <div className="flex justify-between items-end mb-1">
                                <div>
                                   <p className="text-sm font-bold text-slate-200">{agent.name}</p>
                                   <p className="text-[10px] text-slate-500 uppercase">{agent.role}</p>
                                </div>
                                <span className="text-xs text-slate-400">{agent.health}%</span>
                             </div>
                             <BrandProgress value={agent.health} color={agent.active ? 'blue' : 'gray'} size="xs" />
                          </div>
                       </div>
                    ))}
                 </div>
              </BrandCard>

              {/* Terminal Pane */}
              <BrandCard padding="none" className="bg-[#050B14] border-slate-800 h-[320px] flex flex-col overflow-hidden shadow-2xl shadow-blue-900/20">
                 <div className="p-3 border-b border-slate-800 bg-slate-900 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                       <Zap size={14} className="text-amber-400" />
                       <span className="text-xs font-mono font-bold text-slate-300">OMNI_V3_TELEMETRY</span>
                    </div>
                    <BrandBadge variant="outline" size="xs" className="text-blue-400 border-blue-900/50 bg-blue-900/20">Live Connection</BrandBadge>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto font-mono text-sm scroll-smooth">
                    {v3Steps.length === 0 && !isExecuting && (
                      <div className="h-full flex items-center justify-center text-slate-600 text-xs">
                         等待調度指令...
                      </div>
                    )}
                    {v3Steps.map((step, i) => (
                      <div key={i} className="animate-in fade-in slide-in-from-left-2 flex gap-4 mb-4">
                         <div className="flex flex-col items-center mt-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(step.status), boxShadow: `0 0 6px ${getStatusColor(step.status)}` }} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1">
                               <span style={{ color: getStatusColor(step.status) }} className="text-[10px] font-black uppercase tracking-widest">{step.status}</span>
                               <span className="text-[10px] text-blue-500">@{step.agentName}</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{step.message}</p>
                         </div>
                      </div>
                    ))}
                    <div ref={streamEndRef} />
                 </div>
              </BrandCard>
           </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-800/50 text-slate-500 text-sm">
           <p>© 2026 ESG GO Platform. Powered by OmniHermes Swarm V3.</p>
        </footer>

      </div>
    </div>
  );
}
