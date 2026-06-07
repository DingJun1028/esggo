'use client';

import React, { useState } from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { LayoutTemplate, Search, FileText, Brain, ShieldCheck, Zap, Download, Eye, Layers } from 'lucide-react';
import { motion } from 'framer-motion';

const EXPERT_TEMPLATES = [
  {
    id: 'tpl_gri_2026',
    title: 'GRI 永續報告書標準模板 (2026 最新版)',
    category: 'Reporting',
    description: '符合全球報告倡議組織最新標準的完整 ESG 報告框架，內含 5T 協議資料綁定。',
    icon: <FileText size={24} className="text-cyan-400" />,
    metrics: ['GRI-2', 'GRI-3', 'GRI-305'],
    computeCost: 'Zero Compute',
    status: 'Ready'
  },
  {
    id: 'tpl_tcfd_climate',
    title: 'TCFD 氣候風險財務揭露矩陣',
    category: 'Risk Management',
    description: '預先配置的實體與轉型風險評估矩陣，支援情境分析(RCP 2.6/8.5)與財務衝擊估算。',
    icon: <ShieldCheck size={24} className="text-emerald-400" />,
    metrics: ['Governance', 'Strategy', 'Risk'],
    computeCost: 'Zero Compute',
    status: 'Ready'
  },
  {
    id: 'tpl_carbon_scope_123',
    title: '溫室氣體盤查模組 (Scope 1-3)',
    category: 'Environment',
    description: '內建 EPA/IPCC 碳排係數資料庫，支援一鍵導入活動數據與自動換算。',
    icon: <Zap size={24} className="text-amber-400" />,
    metrics: ['Scope 1', 'Scope 2', 'Scope 3'],
    computeCost: 'Zero Compute',
    status: 'Ready'
  },
  {
    id: 'tpl_supply_chain_dd',
    title: '供應鏈人權盡職調查 (CSDDD)',
    category: 'Social',
    description: '符合歐盟 CSDDD 標準的供應商問卷模板與高風險地圖視覺化配置。',
    icon: <Layers size={24} className="text-purple-400" />,
    metrics: ['Human Rights', 'Labor', 'Ethics'],
    computeCost: 'Zero Compute',
    status: 'Ready'
  }
];

export default function ExpertTemplatesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const categories = ['All', ...Array.from(new Set(EXPERT_TEMPLATES.map(t => t.category)))];

  const filteredTemplates = EXPERT_TEMPLATES.filter(tpl => 
    (activeCategory === 'All' || tpl.category === activeCategory) &&
    (tpl.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
     tpl.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <LayoutTemplate className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Brain size={12}/>}>Zero Compute</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">ESG-TPL</span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">零算力專家模板</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Zero-Compute Expert Templates</p>
            </div>
          </div>
          <div className="flex gap-3 w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="搜尋模板..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-800/50 border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-cyan-500 w-full md:w-64"
            />
          </div>
        </header>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase transition-all duration-300 ${
                activeCategory === category 
                  ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredTemplates.map((tpl, index) => (
            <motion.div
              key={tpl.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <OmniBaseCard variant="glass" className="p-6 flex flex-col h-full group hover:border-cyan-500/50 transition-colors">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 group-hover:bg-cyan-500/10 transition-colors">
                    {tpl.icon}
                  </div>
                  <OmniBadge variant="success" size="sm" icon={<Zap size={12}/>}>
                    {tpl.computeCost}
                  </OmniBadge>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">{tpl.title}</h3>
                <p className="text-sm text-slate-400 flex-grow mb-6 leading-relaxed">
                  {tpl.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-6">
                  {tpl.metrics.map(metric => (
                    <span key={metric} className="px-2 py-1 bg-white/5 rounded text-xs text-slate-300 border border-white/5">
                      {metric}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
                  <OmniButton variant="primary" className="flex-1" icon={<Download size={16}/>}>
                    套用模板
                  </OmniButton>
                  <OmniButton variant="outline" className="flex-1" icon={<Eye size={16}/>}>
                    預覽
                  </OmniButton>
                </div>
              </OmniBaseCard>
            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
}
