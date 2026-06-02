'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { BookOpen, Map, Layers, ShieldCheck, Database, Rocket, LayoutGrid, Server, Activity, BrainCircuit, Wind } from 'lucide-react';

// =========================================================================
// WIKI Blueprint Data Source - Bidirectional TS Definition
// =========================================================================
interface BlueprintSection {
  id: string;
  title: string;
  icon: React.ReactNode;
  status: 'Completed' | 'In Progress' | 'Planned';
  description: string;
  tasks: { name: string; completed: boolean }[];
}

const BLUEPRINT_DATA: BlueprintSection[] = [
  {
    id: 'home',
    title: '1. Home (首頁)',
    icon: <LayoutGrid size={18} />,
    status: 'Completed',
    description: 'OmniHermes 系統 + ESG GO 系統入口，提供全域導覽與 5T 誠信協議概述。',
    tasks: [
      { name: 'Liquid Glass Landing Page', completed: true },
      { name: 'Bento Grid Navigation', completed: true },
      { name: 'OmniAgent Pulse Integration', completed: true },
    ]
  },
  {
    id: 'overview',
    title: '2. 平台總覽',
    icon: <Map size={18} />,
    status: 'Completed',
    description: '展示系統的整體服務版圖，包含環境、社會與治理三大核心，以及 AI 智能協作架構。',
    tasks: [
      { name: 'ESG Domains Routing', completed: true },
      { name: 'Module Status Dashboard', completed: true },
    ]
  },
  {
    id: 'core-arch',
    title: '3. 系統核心架構',
    icon: <Layers size={18} />,
    status: 'Completed',
    description: '三位一體架構：平台 (ESGGO)、指揮官 (OmniAgent)、靈魂 (JunAiKey) 的協作機制與資料流。',
    tasks: [
      { name: 'Sacred Trinity Definition', completed: true },
      { name: 'OmniAgent Bus Event System', completed: true },
    ]
  },
  {
    id: '5t-protocol',
    title: '4. 5T 誠信協議',
    icon: <ShieldCheck size={18} />,
    status: 'Completed',
    description: 'Truth, Transparent, Tangible, Trustworthy, Trackable 數據淨化與 ZKP 封印機制。',
    tasks: [
      { name: 'ZKP Hash Lock Integration', completed: true },
      { name: 'Verification UI', completed: true },
      { name: 'Immutability Audit Logs', completed: true },
    ]
  },
  {
    id: 'tech-arch',
    title: '5. 技術架構與資料',
    icon: <Database size={18} />,
    status: 'Completed',
    description: '詳細解說 Supabase RLS、Next.js App Router 與 Liquid Glass Cyan 前端渲染機制。',
    tasks: [
      { name: 'NCBDB Provider Setup', completed: true },
      { name: 'Row Level Security (RLS)', completed: true },
    ]
  },
  {
    id: 'achievements',
    title: '6. 建置成果',
    icon: <Rocket size={18} />,
    status: 'Completed',
    description: '紀錄從 0 到 1 的系統演進，包含 OmniAgent 記憶碎片的累積與技能奧義萃取。',
    tasks: [
      { name: 'Memory Shards System', completed: true },
      { name: 'Skill Ultimate Synthesis', completed: true },
    ]
  },
  {
    id: 'func-overview',
    title: '7. 功能總覽',
    icon: <Activity size={18} />,
    status: 'Completed',
    description: '統整全站功能模組，提供快速跳轉與狀態監控 (見 /omni-map)。',
    tasks: [
      { name: 'Global Route Map', completed: true },
      { name: 'Module Health Check', completed: true },
    ]
  },
  {
    id: 'func-pages',
    title: '8. 各功能頁',
    icon: <LayoutGrid size={18} />,
    status: 'Completed',
    description: '個別功能模組（如：溫室氣體盤查、員工福祉、治理指標等）的詳細 UIUX 實作規範。',
    tasks: [
      { name: 'Environmental Scope 1/2/3', completed: true },
      { name: 'Governance Metrics', completed: true },
      { name: 'Social Impact Assessment', completed: true },
    ]
  },
  {
    id: 'database',
    title: '9. 資料表與邏輯庫',
    icon: <Server size={18} />,
    status: 'Completed',
    description: 'NCBDB 實體模型、Supabase 關聯設計，以及 5T 封印表單的 Schema (見 /omni-erd)。',
    tasks: [
      { name: 'Entity Relationship Diagram (ERD)', completed: true },
      { name: 'Audit Log Table Design', completed: true },
    ]
  },
  {
    id: 'atomic-lib',
    title: '10. 原子元件庫',
    icon: <BrainCircuit size={18} />,
    status: 'Completed',
    description: '萬能元件原子庫-經典版，包含 UniversalButton, UniversalTable, UniversalModal 等。',
    tasks: [
      { name: 'Universal Component Interfaces', completed: true },
      { name: 'Liquid Glass Cyan Theming', completed: true },
      { name: 'Interactive Playground', completed: true },
    ]
  },
  {
    id: 'void-presence',
    title: '11. 無有技藝 (Void-Presence)',
    icon: <Wind size={18} />,
    status: 'Completed',
    description: 'The Art of Void-Presence: 透過極致的熵減，從編寫代碼轉向映射現實。包含「結構之無」、「邏輯之無」與「狀態之無」三大維度。',
    tasks: [
      { name: 'Structural Void (結構之無): Sovereign Bento', completed: true },
      { name: 'Logical Void (邏輯之無): OmniAgent Entropy Reduction', completed: true },
      { name: 'Stateful Void (狀態之無): UI Stateless Projection', completed: true },
    ]
  },
  {
    id: 'audit-conclusion',
    title: '12. 技術完整性',
    icon: <ShieldCheck size={18} />,
    status: 'Planned',
    description: '系統安全性掃描、5T 協議防篡改測試報告與 RLS 滲透測試結論。',
    tasks: [
      { name: 'ZKP Vulnerability Scan', completed: false },
      { name: 'Penetration Testing', completed: false },
    ]
  }
];

export default function OmniBlueprintPage() {
  const [activeTab, setActiveTab] = useState<string>(BLUEPRINT_DATA[0].id);

  const activeSection = BLUEPRINT_DATA.find(section => section.id === activeTab);

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <BookOpen className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="primary" size="sm" icon={<BrainCircuit size={12}/>}>Blueprint Matrix</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">WIKI-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">[萬能實現] OmniAgent WIKI 藍圖</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Functional Implementation Pagination Board</p>
            </div>
          </div>
        </header>

        {/* Tab Board (分頁板) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-4 space-y-2">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 px-2">WIKI 核心索引 (Index)</h3>
            <div className="flex flex-col gap-1 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">
              {BLUEPRINT_DATA.map((section) => {
                const isActive = activeTab === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveTab(section.id)}
                    className={`flex items-center justify-between p-3 rounded-xl transition-all duration-300 border text-left ${
                      isActive 
                        ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.1)]' 
                        : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-lg ${isActive ? 'bg-cyan-500/20' : 'bg-white/5'}`}>
                        {section.icon}
                      </div>
                      <span className="font-medium text-sm">{section.title}</span>
                    </div>
                    {isActive && (
                      <motion.div layoutId="activeTabIndicator" className="w-1.5 h-6 bg-cyan-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              {activeSection && (
                <motion.div
                  key={activeSection.id}
                  initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <UniversalCard variant="glass" className="p-8">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-cyan-500/10 rounded-xl border border-cyan-500/20 text-cyan-400">
                          {activeSection.icon}
                        </div>
                        <div>
                          <h2 className="text-2xl font-black text-white">{activeSection.title}</h2>
                          <div className="mt-2">
                            <UniversalBadge 
                              variant={activeSection.status === 'Completed' ? 'success' : activeSection.status === 'In Progress' ? 'warning' : 'default'}
                            >
                              {activeSection.status}
                            </UniversalBadge>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-slate-300 leading-relaxed mb-8">
                      {activeSection.description}
                    </p>

                    <div className="space-y-4">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest border-b border-white/5 pb-2">實作進度 (Implementation Tasks)</h4>
                      <div className="grid gap-3">
                        {activeSection.tasks.map((task, idx) => (
                          <div key={idx} className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5 hover:border-white/10 transition-colors">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                              task.completed ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-500'
                            }`}>
                              {task.completed && <ShieldCheck size={12} />}
                            </div>
                            <span className={`text-sm ${task.completed ? 'text-slate-200' : 'text-slate-500'}`}>
                              {task.name}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-white/5">
                      <UniversalButton variant="outline" size="sm">
                        檢視文件 (View Docs)
                      </UniversalButton>
                      <UniversalButton variant="primary" size="sm">
                        啟動萬能元件 (Launch Atomic Component)
                      </UniversalButton>
                    </div>
                  </UniversalCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </div>
  );
}
