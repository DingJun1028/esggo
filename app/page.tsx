'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Shield, Zap, ArrowUpRight, Cpu, Bot, CheckCircle, Database, Leaf, Users, Play, Activity, Sparkles, AlertTriangle, BarChart, Globe, Target, Search, RefreshCw, Lock } from 'lucide-react';
import { BrandButton, BrandCard, BrandBadge, BrandStatusDot, BrandProgress } from '../components/brand';
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
      { id: '1', status: 'PLANNING' as const, agentName: 'Aurora', message: 'Analyzing ESG GO deployment status...', timestamp: new Date().toISOString() },
      { id: '2', status: 'EXECUTING' as const, agentName: 'ESG-Scribe', message: 'Generating GRI 305 draft...', timestamp: new Date(Date.now() + 1000).toISOString() },
      { id: '3', status: 'SUCCESS' as const, agentName: 'CBAM-Sentinel', message: 'Validated Q3 emission data.', timestamp: new Date(Date.now() + 2500).toISOString() }
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
            <Link href="/auth/login">
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
                 開始體驗 <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
               </BrandButton>
            </Link>
            <BrandButton variant="secondary" className="rounded-2xl px-8 h-14 text-lg border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white" onClick={() => document.getElementById('swarm-showcase')?.scrollIntoView({behavior: 'smooth'})}>
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
              <BrandCard padding="lg" className="h-full bg-slate-900/10 backdrop-blur-2xl border border-slate-800/50 hover:bg-slate-900/20 hover:border-slate-600 transition-all duration-300 group">
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
              <BrandCard className="bg-white/[0.03] backdrop-blur-3xl border-white/[0.08] p-6 flex flex-col justify-center shadow-2xl shadow-black/40">
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
                             <BrandProgress value={agent.health} color={agent.active ? 'blue' : 'auto'} size="xs" />
                          </div>
                       </div>
                    ))}
                 </div>
              </BrandCard>

              {/* Terminal Pane */}
              <BrandCard padding="none" className="bg-white/[0.03] backdrop-blur-3xl border-white/[0.08] h-[320px] flex flex-col overflow-hidden shadow-2xl shadow-blue-900/20">
                 <div className="p-3 border-b border-white/[0.05] bg-white/[0.02] backdrop-blur-md flex justify-between items-center">
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
        {/* Pain Points Solved */}
        <section className="relative z-10 pt-24">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">為什麼選擇 <span className="text-blue-400">ESG GO</span>？</h2>
             <p className="text-slate-400">告別傳統永續管理的繁瑣與風險</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <BrandCard className="bg-red-950/20 backdrop-blur-2xl border-red-900/30 hover:bg-red-950/30 transition-all duration-300">
               <div className="flex items-center gap-3 mb-6">
                 <AlertTriangle className="text-red-400" />
                 <h3 className="text-xl font-bold text-red-200">傳統痛點</h3>
               </div>
               <ul className="space-y-4">
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0"/>數據四散於不同系統，盤查耗時費力。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0"/>報告撰寫高度依賴人力，易出錯且成本高昂。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0"/>法規變動快，難以即時跟進，合規風險極高。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.8)] shrink-0"/>缺乏不可篡改的證據溯源機制，難以取信於稽核。</li>
               </ul>
             </BrandCard>
             <BrandCard className="bg-emerald-950/20 backdrop-blur-2xl border-emerald-900/30 hover:bg-emerald-950/30 transition-all duration-300">
               <div className="flex items-center gap-3 mb-6">
                 <CheckCircle className="text-emerald-400" />
                 <h3 className="text-xl font-bold text-emerald-200">ESG GO 解決方案</h3>
               </div>
               <ul className="space-y-4">
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0"/>API 自動化串接整合，即時匯集各方碳排數據。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0"/>多重 AI 代理自動生成並對齊國際標準的永續報告。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0"/>系統內建最新合規框架，AI 即時預警異常指標。</li>
                 <li className="flex gap-3 text-slate-300"><div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500/80 shadow-[0_0_8px_rgba(16,185,129,0.8)] shrink-0"/>ZKP 零知識證明與區塊鏈技術，確保證據絕對可信。</li>
               </ul>
             </BrandCard>
           </div>
        </section>

        {/* Platform Features */}
        <section className="relative z-10 pt-24">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">核心 <span className="text-blue-400">平台功能</span></h2>
             <p className="text-slate-400">專為企業級需求打造的端到端永續管理系統</p>
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[
               { icon: <Bot />, title: 'AI 代理蜂群', desc: '多智能體協作，自動解析文檔、比對數據、並編寫高質量報告。' },
               { icon: <Lock />, title: 'ZKP 證據金庫', desc: '利用零知識證明技術封裝敏感數據，在不洩露隱私的前提下通過稽核。' },
               { icon: <Globe />, title: '多重框架對齊', desc: '一鍵無縫對應 GRI、CBAM、TCFD 等國際各大永續揭露準則。' },
               { icon: <BarChart />, title: '即時動態儀表板', desc: '可視化碳排熱點與減碳進度，支援多維度的數據下鑽分析。' },
             ].map((feature, idx) => (
               <BrandCard key={idx} className="bg-slate-900/10 backdrop-blur-2xl border-slate-800/50 hover:bg-slate-800/40 transition-colors h-full">
                 <div className="w-12 h-12 rounded-xl bg-blue-900/30 text-blue-400 flex items-center justify-center mb-5 border border-blue-800/30">
                   {feature.icon}
                 </div>
                 <h4 className="text-lg font-bold text-slate-200 mb-3">{feature.title}</h4>
                 <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
               </BrandCard>
             ))}
           </div>
        </section>

        {/* Operation Guide */}
        <section className="relative z-10 pt-24">
           <div className="text-center mb-16">
             <h2 className="text-3xl font-black text-white mb-4">極簡 <span className="text-blue-400">操作指南</span></h2>
             <p className="text-slate-400">四步完成繁雜的永續合規流程</p>
           </div>
           <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-4 relative">
             <div className="hidden md:block absolute top-6 left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-transparent via-blue-900/50 to-transparent z-0"></div>
             {[
               { step: '01', title: '匯入數據', desc: '透過 API 或 Excel 自動匯入能耗數據' },
               { step: '02', title: 'AI 盤查', desc: '系統自動驗算碳足跡並找出異常點' },
               { step: '03', title: 'ZKP 封裝', desc: '將核心證據加密封存至不可篡改金庫' },
               { step: '04', title: '產出報告', desc: '一鍵生成符合特定法規的標準報告' },
             ].map((step, idx) => (
               <div key={idx} className="relative z-10 flex flex-col items-center text-center w-full md:w-1/4">
                 <div className="w-14 h-14 rounded-full bg-[#020617] border-2 border-blue-500/50 flex items-center justify-center text-blue-400 font-black mb-6 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
                   {step.step}
                 </div>
                 <h4 className="text-lg font-bold text-slate-200 mb-2">{step.title}</h4>
                 <p className="text-sm text-slate-400 px-4">{step.desc}</p>
               </div>
             ))}
           </div>
        </section>

        {/* Use Cases */}
        <section className="relative z-10 pt-24">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">適用 <span className="text-blue-400">使用場景</span></h2>
             <p className="text-slate-400">滿足企業內外各角色的不同需求</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             <BrandCard className="bg-slate-900/10 backdrop-blur-2xl border-slate-800/50 text-center hover:-translate-y-1 transition-transform duration-300">
               <Target className="w-12 h-12 mx-auto text-purple-400 mb-5 opacity-80" />
               <h3 className="text-xl font-bold text-slate-200 mb-3">企業永續長 (CSO)</h3>
               <p className="text-sm text-slate-400 leading-relaxed px-2">
                 隨時掌握集團全球碳排總量與減碳目標 (SBTi) 達成率，進行高階風險管控與戰略規劃。
               </p>
             </BrandCard>
             <BrandCard className="bg-slate-900/10 backdrop-blur-2xl border-slate-800/50 text-center hover:-translate-y-1 transition-transform duration-300">
               <Search className="w-12 h-12 mx-auto text-blue-400 mb-5 opacity-80" />
               <h3 className="text-xl font-bold text-slate-200 mb-3">碳排盤查員</h3>
               <p className="text-sm text-slate-400 leading-relaxed px-2">
                 不再手動計算。由系統代勞資料清理、換算，並由 AI 稽核員預先抓出邏輯錯誤。
               </p>
             </BrandCard>
             <BrandCard className="bg-slate-900/10 backdrop-blur-2xl border-slate-800/50 text-center hover:-translate-y-1 transition-transform duration-300">
               <RefreshCw className="w-12 h-12 mx-auto text-emerald-400 mb-5 opacity-80" />
               <h3 className="text-xl font-bold text-slate-200 mb-3">供應鏈管理者</h3>
               <p className="text-sm text-slate-400 leading-relaxed px-2">
                 追蹤上下游範疇三碳排放，發送自動化問卷並快速審核供應商提供的減碳證據。
               </p>
             </BrandCard>
           </div>
        </section>

        {/* Expected Outcomes */}
        <section className="relative z-10 pt-24 pb-12">
           <div className="text-center mb-12">
             <h2 className="text-3xl font-black text-white mb-4">量化 <span className="text-blue-400">預期成果</span></h2>
             <p className="text-slate-400">引入 ESG GO 為企業帶來的實質效益</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             <BrandCard padding="none" className="bg-transparent border-0 text-center flex flex-col items-center justify-center">
               <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 mb-4 tracking-tighter">80%</div>
               <div className="text-lg font-bold text-slate-200 mb-2">節省盤查與報告時間</div>
               <p className="text-sm text-slate-400 max-w-[200px] mx-auto">AI 自動化取代手動彙整，大幅加速合規時程。</p>
             </BrandCard>
             <BrandCard padding="none" className="bg-transparent border-0 text-center flex flex-col items-center justify-center">
               <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-500 mb-4 tracking-tighter">100%</div>
               <div className="text-lg font-bold text-slate-200 mb-2">數據不可篡改性</div>
               <p className="text-sm text-slate-400 max-w-[200px] mx-auto">利用區塊鏈與 ZKP 技術，確保證據絕對可信。</p>
             </BrandCard>
             <BrandCard padding="none" className="bg-transparent border-0 text-center flex flex-col items-center justify-center">
               <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-pink-500 mb-4 tracking-tighter">0</div>
               <div className="text-lg font-bold text-slate-200 mb-2">盲區與合規風險</div>
               <p className="text-sm text-slate-400 max-w-[200px] mx-auto">即時監控各大國際框架落差，避免漂綠疑慮。</p>
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
