'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers, Shield, Zap, Bot, Database, Hash, 
  Activity, Globe, Lock, ArrowUpRight, Sparkles, 
  Trophy, CheckCircle, AlertTriangle, Cpu, Network,
  Eye, RefreshCw, ChevronRight, Server
} from 'lucide-react';
import { 
  BrandCard, BrandButton, BrandBadge, BrandTabs, 
  BrandStatusDot, BrandPageHeader, StandardPage, BrandCardHeader
} from '../../components/brand';
import { cn } from '../../lib/utils';
import { UniversalPageConfig } from '../../lib/page-config';

const ARCH_NODES = [
  { id: 'alchemy', label: 'Hermes Alchemy', sub: 'Vision Extraction', icon: <Sparkles size={20}/>, color: '#FDB515' },
  { id: 'practice', label: 'Best Practice Hub', sub: 'Grounding Engine', icon: <Trophy size={20}/>, color: '#3B7EA1' },
  { id: 'orchestrator', label: 'Swarm Orchestrator', sub: 'Task Delegation', icon: <Bot size={20}/>, color: '#8B5CF6' },
  { id: 'omnicore', label: 'OmniCore Engine', sub: 'Semantic Memory', icon: <Cpu size={20}/>, color: '#003262' },
  { id: 't5seal', label: '5T Integrity Seal', sub: 'Immutable Proof', icon: <Lock size={20}/>, color: '#10B981' },
];

export default function HermesArchitecturePage() {
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
      const local = localStorage.getItem('hermes_ox_evolution');
      if (local) setLastEvo(JSON.parse(local));
    };
    checkEvo();
    window.addEventListener('storage', checkEvo);
    return () => window.removeEventListener('storage', checkEvo);
  }, []);

  // ── Universal Page Configuration ──────────────────────────────────
  const pageConfig: UniversalPageConfig = {
    id: 'hermes-architecture',
    title: '動態架構治理中心',
    subtitle: 'Living Architecture · 模組即時拓撲 · 5T 邊界防禦。',
    icon: <Network size={32} className="text-[#003262]" />,
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
          <div className="relative min-h-[500px] bg-slate-900 rounded-[3rem] p-12 overflow-hidden border border-white/5 shadow-2xl">
             {/* Background Grid */}
             <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
             
             {/* Connection Lines (Simulated) */}
             <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <defs>
                   <linearGradient id="line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#3B7EA1" stopOpacity="0" />
                      <stop offset="50%" stopColor="#FDB515" stopOpacity="1" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                   </linearGradient>
                </defs>
                <path d="M 200 250 Q 400 100 600 250" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-pulse opacity-20" />
                <path d="M 600 250 Q 800 400 1000 250" stroke="url(#line-grad)" strokeWidth="1" fill="none" className="animate-pulse opacity-20" />
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
                      "w-48 p-6 rounded-[2.5rem] border border-white/10 backdrop-blur-xl flex flex-col items-center text-center transition-all",
                      pulseNode === node.id ? "bg-white/20 border-white/30 shadow-[0_0_50px_rgba(255,255,255,0.1)]" : "bg-white/5"
                    )}
                  >
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-2xl"
                      style={{ backgroundColor: `${node.color}20`, color: node.color, border: `1px solid ${node.color}40` }}
                    >
                      {node.icon}
                    </div>
                    <h4 className="text-white text-sm font-black uppercase tracking-tight">{node.label}</h4>
                    <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">{node.sub}</p>
                    
                    {pulseNode === node.id && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-4 flex items-center gap-1.5"
                      >
                        <div className="w-1 h-1 rounded-full bg-emerald-400 animate-ping" />
                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">Active Pulse</span>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
             </div>

             {/* Center Label */}
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 pointer-events-none">
                <h2 className="text-[120px] font-black text-white whitespace-nowrap">OMNIHERMES oX</h2>
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
             <BrandCard padding="lg" className="border-none shadow-premium bg-white/50 backdrop-blur-sm">
                <BrandCardHeader title="5T 誠信邊界 (Trust Boundaries)" icon={<Lock size={18}/>} />
                <div className="space-y-4 mt-6">
                   {[
                     { t: 'T1 Truth', desc: '原始影像像素必須在 Alchemy 層完成 Hash 定義，不可在傳輸中篡改。', status: 'Enforced' },
                     { t: 'T2 Traceable', desc: '每一筆提取的指標必須鏈結至標竿案例中的 GRI 代碼，實現溯源。', status: 'Active' },
                     { t: 'T4 Transparent', desc: 'Genkit 的推理鏈 (Reasoning Chain) 必須完整記錄於調度日誌。', status: 'Monitoring' },
                   ].map((b, i) => (
                     <div key={i} className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-blue-400 transition-all">
                        <div className="flex-1">
                           <p className="text-[10px] font-black text-blue-600 uppercase mb-1">{b.t}</p>
                           <p className="text-xs text-slate-500 leading-relaxed font-medium">{b.desc}</p>
                        </div>
                        <BrandBadge variant={b.status === 'Enforced' ? 'success' : 'info'} size="xs" className="ml-4">{b.status}</BrandBadge>
                     </div>
                   ))}
                </div>
             </BrandCard>

             <BrandCard padding="lg" className="border-none shadow-premium bg-white/50 backdrop-blur-sm">
                <BrandCardHeader title="AI 自主權限等級 (Agent Sovereign Levels)" icon={<Shield size={18}/>} />
                <div className="space-y-4 mt-6">
                   <div className="p-6 bg-slate-900 rounded-3xl text-white relative overflow-hidden">
                      <div className="relative z-10 space-y-4">
                         <div className="flex items-center justify-between">
                            <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Level 4: Autonomous Governance</span>
                            <BrandStatusDot status="active" pulse />
                         </div>
                         <p className="text-xs text-blue-100/70 leading-relaxed">
                            Hermes 目前具備 **L4 自主權**：能在偵測到合規缺口時自動發起 Swarm 委派，無需等待人工介入。
                         </p>
                         <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full w-[85%] bg-blue-500" />
                         </div>
                      </div>
                      <Bot size={80} className="absolute -bottom-4 -right-4 text-white/5" />
                   </div>
                   
                   {lastEvo && (
                     <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center gap-4"
                     >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                           <Sparkles size={16} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-blue-600 uppercase">最新進化提案已同步</p>
                           <p className="text-xs font-bold text-slate-700">{lastEvo.title}</p>
                        </div>
                     </motion.div>
                   )}

                   <BrandButton variant="secondary" fullWidth className="rounded-2xl border-slate-200">
                      調整系統自主權限制 <ChevronRight size={14} className="ml-1" />
                   </BrandButton>
                </div>
             </BrandCard>
          </div>
        )
      }
    ]
  };

  return (
    <div className="relative">
      <StandardPage config={pageConfig} />
      
      {/* Topology Overlay Legend */}
      <div className="fixed bottom-12 right-12 z-50 p-4 bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl shadow-extreme flex gap-6 items-center">
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">5T Verified</span>
         </div>
         <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Active</span>
         </div>
         <div className="h-4 w-px bg-slate-200" />
         <button className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-widest">Export Specs</button>
      </div>
    </div>
  );
}
