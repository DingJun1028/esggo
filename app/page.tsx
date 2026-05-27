'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowUpRight, Cpu, Bot, CheckCircle, Database, Leaf, Users, Play, Activity, Sparkles, AlertTriangle, BarChart, Globe, Target, Search, RefreshCw, Lock } from 'lucide-react';
import { BrandButton, BrandCard, BrandBadge, BrandStatusDot, BrandProgress } from '../components/brand';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { AgentStep } from '../lib/agent/v3-shared';

export default function LandingPage() {
  const router = useRouter();
  
  // Swarm V3 Showcase state
  const [v3Steps, setV3Steps] = useState<AgentStep[]>([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const streamEndRef = useRef<HTMLDivElement>(null);

  // Auto-redirect if already logged in
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localUser = localStorage.getItem('omni_user');
      if (localUser) {
        window.location.href = '/dashboard';
      }
    }
  }, []);

  const startDemo = () => {
    setIsExecuting(true);
    setV3Steps([]);
    // Simulate some events
    const demoSteps = [
      { id: '1', status: 'PLANNING' as const, agentName: 'OmniCore', message: 'Initializing 5T Integrity Protocol...', timestamp: new Date().toISOString() },
      { id: '2', status: 'EXECUTING' as const, agentName: 'ESG-Scribe', message: 'Extracting Origin Data & Aligning GRI Standards...', timestamp: new Date(Date.now() + 1000).toISOString() },
      { id: '3', status: 'SUCCESS' as const, agentName: 'Vault-Sentinel', message: 'ZKP Hash Lock applied. Data sealed.', timestamp: new Date(Date.now() + 2500).toISOString() }
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
      case 'PLANNING': return '#0ea5e9'; // blue-500
      case 'EXECUTING': return '#8b5cf6'; // purple-500
      case 'SUCCESS': return '#10b981'; // emerald-500
      default: return '#94a3b8'; // slate-400
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-hidden font-sans selection:bg-cyan-100 selection:text-cyan-900 relative">
      
      {/* Dynamic Background - Liquid Glass Cyan Theme */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-gradient-to-br from-cyan-200/40 to-transparent blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-tr from-emerald-200/40 to-transparent blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#cbd5e1_1px,transparent_1px),linear-gradient(to_bottom,#cbd5e1_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 flex flex-col gap-24">
        
        {/* Navigation / Header Mock */}
        <header className="flex justify-between items-center w-full fade-in">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-gradient-to-br from-cyan-50 to-emerald-50 border border-cyan-200 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.1)]">
                <Leaf size={20} className="text-cyan-600" />
             </div>
             <span className="text-xl font-black tracking-tight text-slate-800">ESG <span className="text-cyan-600">GO</span></span>
          </div>
          <div className="flex gap-4">
            <Link href="/auth/login">
              <Button variant="ghost" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl">登入</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="primary" className="rounded-xl px-6 shadow-lg shadow-cyan-500/20 bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 border-none text-white">進入主控台</Button>
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <section className="flex flex-col items-center text-center space-y-8 mt-12 z-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-cyan-200 text-cyan-700 text-xs font-black uppercase tracking-widest backdrop-blur-xl shadow-sm"
          >
            <Sparkles size={14} className="text-cyan-500" />
            OmniCore P0 & 5T 誠信協議
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-black text-slate-900 tracking-tight leading-[1.1]"
          >
            重塑永續治理的 <br className="hidden md:block"/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-600 to-emerald-600">數位生態協議</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl text-slate-600 max-w-2xl font-medium leading-relaxed"
          >
            ESG GO 結合 5T 誠信協議 (真、善、美、信、通) 與液態玻璃美學，透過全域 OmniAgent 蜂群為企業自動化處理合規驗證與永續報告，實現數據不可篡改的數位主權。
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mt-8"
          >
            <Link href="/dashboard">
               <Button variant="primary" className="rounded-2xl px-8 h-14 text-lg shadow-xl shadow-cyan-600/20 bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 border-none group text-white font-bold tracking-wide">
                 啟動全域共鳴 <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               </Button>
            </Link>
            <Button variant="ghost" className="rounded-2xl px-8 h-14 text-lg border border-slate-300 bg-white/50 backdrop-blur-md text-slate-700 hover:bg-white hover:text-cyan-600 font-bold" onClick={() => document.getElementById('swarm-showcase')?.scrollIntoView({behavior: 'smooth'})}>
              觀看 OmniCore 演示
            </Button>
          </motion.div>
        </section>

        {/* Feature Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10 pt-16">
          {[
            { title: '萬能實證金庫 (Vault)', icon: <Shield size={24} className="text-emerald-500"/>, desc: '透過 ZKP 零知識證明與 SHA-256 Hash Lock 封印您的永續證據，確保資料符合 T4 級別不可篡改性。' },
            { title: '全域協作蜂群 (Swarm)', icon: <Cpu size={24} className="text-cyan-500"/>, desc: 'OmniAgent 自動調度多個專屬 AI 代理，並行處理數據分析、文本生成與自動化修正 (Global Healing)。' },
            { title: '5T 誠信協議合規', icon: <Database size={24} className="text-purple-500"/>, desc: '內建 GRI、CBAM 等法規框架，即時追蹤 T1~T5 合規完成度，實現可溯源、可透明、可感知的數據治理。' }
          ].map((f, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <Card className="h-full bg-white/70 backdrop-blur-2xl border border-slate-200 hover:border-cyan-300 hover:bg-white/90 transition-all duration-300 group shadow-lg shadow-slate-200/50">
                <div className="p-8">
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                    {f.icon}
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-3">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
                </div>
              </Card>
            </motion.div>
          ))}
        </section>

        {/* Swarm V3 Interactive Showcase */}
        <section id="swarm-showcase" className="relative z-10 pt-16">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-slate-900 mb-4">OmniCore <span className="text-cyan-600">全域動態展示</span></h2>
             <p className="text-slate-500 font-medium">體驗 5T 協議的實時任務調度與自主執行過程</p>
           </div>
           
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Agent Status Pane */}
              <Card className="bg-white/80 backdrop-blur-2xl border-slate-200 p-8 flex flex-col justify-center shadow-xl">
                 <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                       <Bot size={22} className="text-cyan-600"/>
                       <h3 className="text-lg font-black text-slate-800">萬能心核 (OmniCore Agents)</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={startDemo} disabled={isExecuting} className="text-cyan-700 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 rounded-xl font-bold">
                       {isExecuting ? <Activity className="animate-pulse" size={16}/> : <Play size={16} className="mr-1.5"/>}
                       {isExecuting ? '共鳴中...' : '啟動全域共鳴'}
                    </Button>
                 </div>
                 
                 <div className="space-y-6">
                    {[
                      { name: 'Aurora (大祭司)', role: 'Orchestrator', health: 100, active: isExecuting },
                      { name: 'SustainWrite', role: 'GRI Builder', health: 98, active: v3Steps.length > 0 && isExecuting },
                      { name: 'Vault Sentinel', role: 'ZKP Validator', health: 100, active: v3Steps.length > 1 && isExecuting },
                    ].map((agent, i) => (
                       <div key={i} className="flex items-center gap-5 p-4 rounded-xl border border-transparent hover:border-slate-100 hover:bg-slate-50 transition-colors">
                          <BrandStatusDot status={agent.active ? 'active' : 'inactive'} pulse={agent.active} size="md" />
                          <div className="flex-1">
                             <div className="flex justify-between items-end mb-1.5">
                                <div>
                                   <p className="text-sm font-black text-slate-800">{agent.name}</p>
                                   <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{agent.role}</p>
                                </div>
                                <span className="text-xs font-black font-mono text-cyan-600">{agent.health}%</span>
                             </div>
                             <BrandProgress value={agent.health} color={agent.active ? 'cyan' : 'slate'} size="xs" />
                          </div>
                       </div>
                    ))}
                 </div>
              </Card>

              {/* Terminal Pane */}
              <Card className="bg-slate-900 border-slate-800 h-[360px] flex flex-col overflow-hidden shadow-2xl rounded-2xl relative">
                 <div className="p-4 border-b border-slate-800 bg-slate-950/50 flex justify-between items-center z-10 relative">
                    <div className="flex items-center gap-3">
                       <Zap size={14} className="text-emerald-400" />
                       <span className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">Omni_Core_Telemetry</span>
                    </div>
                    <Badge variant="outline" className="text-cyan-400 border-cyan-800 bg-cyan-950/30 text-[9px] px-2 py-0.5 font-bold uppercase tracking-wider">Live Connection</Badge>
                 </div>
                 <div className="flex-1 p-6 overflow-y-auto font-mono text-sm scroll-smooth bg-slate-900 z-10 relative scrollbar-thin scrollbar-thumb-slate-700">
                    {v3Steps.length === 0 && !isExecuting && (
                      <div className="h-full flex items-center justify-center text-slate-600 text-xs font-bold uppercase tracking-widest">
                         System Awaiting Resonance...
                      </div>
                    )}
                    {v3Steps.map((step, i) => (
                      <div key={i} className="animate-in fade-in slide-in-from-left-2 flex gap-4 mb-5">
                         <div className="flex flex-col items-center mt-1.5">
                            <div className="w-2 h-2 rounded-full" style={{ background: getStatusColor(step.status), boxShadow: `0 0 8px ${getStatusColor(step.status)}` }} />
                         </div>
                         <div>
                            <div className="flex items-center gap-2 mb-1.5">
                               <span style={{ color: getStatusColor(step.status) }} className="text-[10px] font-black uppercase tracking-widest">{step.status}</span>
                               <span className="text-[10px] font-bold text-cyan-500 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">@{step.agentName}</span>
                            </div>
                            <p className="text-slate-300 text-xs leading-relaxed">{step.message}</p>
                         </div>
                      </div>
                    ))}
                    <div ref={streamEndRef} />
                 </div>
                 <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_90%,rgba(15,23,42,1))] pointer-events-none z-20" />
              </Card>
           </div>
        </section>
        
        {/* Expected Outcomes */}
        <section className="relative z-10 pt-24 pb-12">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-slate-900 mb-4">ESG GO 的 <span className="text-cyan-600">量化實績</span></h2>
             <p className="text-slate-500 font-medium">企業級端到端永續管理的實質效益</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <Card className="bg-transparent border-0 text-center flex flex-col items-center justify-center shadow-none p-0 hover:scale-105 transition-transform duration-300">
               <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-500 to-blue-600 mb-4 tracking-tighter">80%</div>
               <div className="text-lg font-black text-slate-800 mb-2">節省盤查與撰寫時間</div>
               <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto">AI 自動化取代手動彙整，加速報告產出。</p>
             </Card>
             <Card className="bg-transparent border-0 text-center flex flex-col items-center justify-center shadow-none p-0 hover:scale-105 transition-transform duration-300">
               <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 mb-4 tracking-tighter">100%</div>
               <div className="text-lg font-black text-slate-800 mb-2">全域數據不可篡改</div>
               <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto">ZKP 與 Hash Lock 確保 5T 誠信證據溯源。</p>
             </Card>
             <Card className="bg-transparent border-0 text-center flex flex-col items-center justify-center shadow-none p-0 hover:scale-105 transition-transform duration-300">
               <div className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-500 to-pink-500 mb-4 tracking-tighter">0</div>
               <div className="text-lg font-black text-slate-800 mb-2">系統架構孤島</div>
               <p className="text-sm text-slate-500 font-medium max-w-[200px] mx-auto">全端雙向同步，從 UI 到資料庫零誤差。</p>
             </Card>
           </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 border-t border-slate-200 mt-12 text-slate-400 text-sm font-medium">
           <p>© 2026 ESG GO Platform. Powered by OmniCore & Liquid Glass Architecture.</p>
        </footer>

      </div>
    </div>
  );
}
