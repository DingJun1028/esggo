'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Shield, Zap, Bot, Database, Hash, 
  Activity, Globe, Lock, ArrowUpRight, Sparkles, 
  Trophy, CheckCircle, AlertTriangle, Cpu, Network,
  Eye, RefreshCw, ChevronRight, Server
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { BrandStatusDot } from '../../components/brand';
import StandardPage from '../../components/brand/StandardPage';
import { fadeIn, staggerContainer } from '../../lib/animations';
import { UniversalPageConfig } from '../../lib/page-config';

const ARCH_NODES = [
  { id: 'alchemy', label: 'OmniAgent Alchemy', sub: 'Vision Extraction', icon: <Sparkles size={20}/>, color: '#FDB515' },
  { id: 'practice', label: 'Best Practice Hub', sub: 'Grounding Engine', icon: <Trophy size={20}/>, color: '#3B7EA1' },
  { id: 'orchestrator', label: 'Swarm Orchestrator', sub: 'Task Delegation', icon: <Bot size={20}/>, color: '#8B5CF6' },
  { id: 'omnicore', label: 'OmniCore Engine', sub: 'Semantic Memory', icon: <Cpu size={20}/>, color: '#003262' },
  { id: 't5seal', label: '5T Integrity Seal', sub: 'Immutable Proof', icon: <Lock size={20}/>, color: '#10B981' },
];

export default function OmniAgentArchitecturePage() {
  const [activeTab, setActiveTab] = useState<'topology' | 'governance' | 'risks'>('topology');
  const [pulseNode, setPulseNode] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNode = ARCH_NODES[Math.floor(Math.random() * ARCH_NODES.length)].id;
      setPulseNode(randomNode);
      setTimeout(() => setPulseNode(null), 2000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const [lastEvo, setLastEvo] = useState<any>(null);

  useEffect(() => {
    const checkEvo = () => {
      const local = localStorage.getItem('omniagent_ox_evolution');
      if (local) setLastEvo(JSON.parse(local));
    };
    checkEvo();
    window.addEventListener('storage', checkEvo);
    return () => window.removeEventListener('storage', checkEvo);
  }, []);

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'omniagent-architecture',
    title: '動態架構治理中心',
    subtitle: 'Living Architecture · 模組即時拓撲 · 5T 邊界防禦。',
    icon: <Network size={32} className="text-berkeley-blue" />,
    griReference: 'Governance / Systems',
    activeT5Tags: ['T4', 'T5'],
    isOXModule: true,
    features: { useAuditLog: true },

    primaryActions: [
      { id: 'audit', label: '啟動全域審計', icon: <Shield size={16}/>, onClick: () => alert('正在掃描全域 5T 誠信鏈結...') },
      { id: 'topology', label: '拓撲刷新', icon: <RefreshCw size={16}/>, variant: 'secondary', onClick: () => window.location.reload() }
    ],

    kpis: [
      { key: 'layers', label: '架構分層', value: '6', icon: <Layers size={18}/> },
      { key: 'nodes', label: '活躍節點', value: '14', icon: <Server size={18}/>, verified: true },
      { key: 'integrity', label: '系統誠信度', value: '99.9', unit: '%', icon: <Hash size={18}/> },
    ],

    sections: [
      {
        id: 'topology-visual',
        title: 'oX 平台動態拓撲 (Integrated oX Map)',
        columns: 12,
        component: (
          <div className="relative min-h-[500px] bg-slate-50/50 rounded-[3rem] p-12 overflow-hidden border border-white shadow-glass">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #003262 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             {/* Connection Lines (Simulated) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <defs>
                   <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B7EA1" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FDB515" stopOpacity="1" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path d="M 200 250 Q 400 100 600 250" stroke="url(#line-grad)" strokeWidth="2" fill="none" className="animate-pulse" />
                <path d="M 600 250 Q 800 400 1000 250" stroke="url(#line-grad)" strokeWidth="2" fill="none" className="animate-pulse" />
             </svg>

             <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 h-full">
                {ARCH_NODES.map((node, i) => (
                  <motion.div 
                    key={node.id}
                    animate={{ 
                      scale: pulseNode === node.id ? 1.05 : 1,
                      y: [0, -10, 0]
                    }}
                    transition={{ 
                      y: { duration: 4, repeat: Infinity, delay: i * 0.5 },
                      scale: { duration: 0.5 }
                    }}
                    className={cn(
                      "w-48 p-8 rounded-[3rem] border backdrop-blur-xl flex flex-col items-center text-center transition-all duration-500 shadow-glass",
                      pulseNode === node.id ? "bg-white/90 border-berkeley-blue/30 shadow-xl" : "bg-white/60 border-white/80"
                    )}
                  >
                    <div 
                      className="w-16 h-16 rounded-[1.5rem] flex items-center justify-center mb-5 shadow-inner"
                      style={{ backgroundColor: `${node.color}15`, color: node.color, border: `1px solid ${node.color}30` }}
                    >
                      {React.cloneElement(node.icon as React.ReactElement, { size: 28 })}
                    </div>
                    <h4 className="text-berkeley-blue text-sm font-black uppercase tracking-tight">{node.label}</h4>
                    <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em] mt-2">{node.sub}</p>
                    
                    {pulseNode === node.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-5 flex items-center gap-2"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-verified animate-ping" />
                        <span className="text-[9px] font-black text-verified uppercase tracking-widest">Active Pulse</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
             </div>

             {/* Center Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                <h2 className="text-[120px] font-black text-berkeley-blue whitespace-nowrap">OMNIAGENT oX</h2>
             </div>
          </div>
        )
      },
      {
        id: 'governance-details',
        title: '架構分層治理規範',
        columns: 12,
        component: (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <Card className="p-8 bg-white/60 backdrop-blur-md border-white/60 shadow-glass">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
                      <Lock size={20} />
                   </div>
                   <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">5T 誠信邊界 (Trust Boundaries)</h4>
                </div>
                <div className="space-y-4">
                   {[
                     { t: 'T1 Truth', desc: '原始影像像素必須在 Alchemy 層完成 Hash 定義，不可在傳輸中篡改。', status: 'Enforced' },
                     { t: 'T2 Traceable', desc: '每一筆提取的指標必須鏈結至標竿案例中的 GRI 代碼，實現溯源。', status: 'Active' },
                     { t: 'T4 Transparent', desc: 'Genkit 的推理鏈 (Reasoning Chain) 必須完整記錄於調度日誌。', status: 'Monitoring' },
                   ].map((b, i) => (
                     <div key={i} className="p-4 bg-white/40 border border-white/80 rounded-2xl flex items-center justify-between group hover:border-berkeley-blue/30 transition-all">
                        <div className="flex-1">
                           <p className="text-[10px] font-black text-berkeley-blue uppercase mb-1.5">{b.t}</p>
                           <p className="text-[13px] text-slate-500 leading-relaxed font-medium">{b.desc}</p>
                        </div>
                        <Badge variant={b.status === 'Enforced' ? 'verified' : 'primary'} className="ml-4 px-3 py-1">{b.status}</Badge>
                     </div>
                   ))}
                </div>
             </Card>

             <Card className="p-8 bg-white/60 backdrop-blur-md border-white/60 shadow-glass">
                <div className="flex items-center gap-3 mb-8">
                   <div className="w-10 h-10 rounded-xl bg-berkeley-blue/5 text-berkeley-blue flex items-center justify-center">
                      <Shield size={20} />
                   </div>
                   <h4 className="text-sm font-black text-berkeley-blue uppercase tracking-tight">AI 自主權限等級 (Agent Sovereign Levels)</h4>
                </div>
                <div className="space-y-5">
                   <div className="p-8 bg-berkeley-blue rounded-[2.5rem] text-white relative overflow-hidden shadow-xl">
                      <div className="relative z-10 space-y-5">
                         <div className="flex items-center justify-between">
                            <span className="text-[11px] font-black text-california-gold uppercase tracking-[0.2em]">Level 4: Autonomous Governance</span>
                            <BrandStatusDot status="active" pulse />
                         </div>
                         <p className="text-[13px] text-blue-50/80 leading-relaxed font-medium">
                            OmniAgent 目前具備 **L4 自主權**：能在偵測到合規缺口時自動發起 Swarm 委派，無需等待人工介入。
                         </p>
                         <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div 
                              className="h-full bg-california-gold" 
                              initial={{ width: 0 }}
                              animate={{ width: '85%' }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                            />
                         </div>
                      </div>
                      <Bot size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                   </div>
                   
                   {lastEvo && (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-5 bg-berkeley-blue/5 border border-berkeley-blue/10 rounded-2xl flex items-center gap-5 shadow-sm"
                     >
                        <div className="w-10 h-10 rounded-xl bg-berkeley-blue flex items-center justify-center text-california-gold">
                           <Sparkles size={18} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-berkeley-blue uppercase tracking-wider">最新進化提案已同步</p>
                           <p className="text-sm font-bold text-slate-700 mt-0.5">{lastEvo.title}</p>
                        </div>
                     </motion.div>
                   )}

                   <Button variant="glass" className="w-full h-14 rounded-2xl border-slate-200 text-slate-600 hover:text-berkeley-blue">
                      調整系統自主權限制 <ChevronRight size={16} className="ml-2" />
                   </Button>
                </div>
             </Card>
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />
      
      {/* Topology Overlay Legend */}
      <motion.div 
        variants={fadeIn}
        initial="initial"
        animate="animate"
        className="fixed bottom-12 right-12 z-50 p-5 bg-white/80 backdrop-blur-2xl border border-white/60 rounded-[2rem] shadow-glass flex gap-8 items-center"
      >
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-verified animate-pulse shadow-[0_0_8px_#10b981]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">5T Verified</span>
         </div>
         <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-berkeley-blue shadow-[0_0_8px_#003262]" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Active</span>
         </div>
         <div className="h-5 w-px bg-slate-200" />
         <button className="text-[10px] font-black text-berkeley-blue hover:text-berkeley-dark transition-colors uppercase tracking-widest">Export Specs</button>
      </motion.div>
    </div>
  );
}
