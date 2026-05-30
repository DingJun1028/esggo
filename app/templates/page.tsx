'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { LayoutTemplate, FileText, Search, Filter, ArrowRight, Check, Star, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const TEMPLATES = [
  { 
    id: 'gri-2021-full', 
    name: 'GRI 2021 全面披露模板', 
    desc: '符合最新 GRI Universal Standards 2021，涵蓋所有一般披露與重大議題章節。',
    category: 'GRI',
    standard: 'GRI 2021',
    complexity: 'High',
    isHot: true
  },
  { 
    id: 'issb-s1-s2', 
    name: 'ISSB S1 & S2 氣候風險模板', 
    desc: '聚焦氣候相關財務揭露 (TCFD 升級版)，強化風險治理與指標量化。',
    category: 'ISSB',
    standard: 'IFRS S1/S2',
    complexity: 'Extreme',
    isHot: true
  },
  { 
    id: 'zero-compute-start', 
    name: '零算力啟動模板 (Lite)', 
    desc: '專為初次填報企業設計，僅包含 20 個核心關鍵指標，快速建立 ESG 感知。',
    category: 'Starter',
    standard: 'Custom',
    complexity: 'Low',
    isHot: false
  },
  { 
    id: 'taiwan-twse-esg', 
    name: '台股證交所合規模板', 
    desc: '依據台灣證交所最新「上市櫃公司永續報告書編製作業辦法」優化。',
    category: 'Local',
    standard: 'TWSE',
    complexity: 'Medium',
    isHot: false
  },
  { 
    id: 'supply-chain-survey', 
    name: '供應鏈 ESG 盡職調查問卷', 
    desc: '針對二級供應商設計的數據採集模板，包含環境合規與人權風險。',
    category: 'Supply Chain',
    standard: 'OECD/GRI',
    complexity: 'Medium',
    isHot: false
  },
  { 
    id: 'materiality-assessment', 
    name: '重大性分析工作表', 
    desc: '引導式雙重重大性 (Double Materiality) 評估框架與利害關係人權重計算。',
    category: 'Governance',
    standard: 'ESRS/GRI',
    complexity: 'Medium',
    isHot: false
  },
];

export default function TemplatesPage() {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredTemplates = TEMPLATES.filter(t => 
    (filter === 'All' || t.category === filter) &&
    (t.name.toLowerCase().includes(search.toLowerCase()) || t.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4 text-left">
            <UniversalBadge variant="success" icon="✨">
              旅程 I. 初始導入與配置
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <LayoutTemplate className="text-cyan-core" /> 專家模板 Templates
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              無需從零開始。套用國際標竿模板，一鍵生成標準 ESG 報告結構與數據欄位映射。
            </p>
          </div>
        </header>

        {/* Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
            <input 
              type="text" 
              placeholder="搜尋模板名稱或關鍵字..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 outline-none transition-all"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            {['All', 'GRI', 'ISSB', 'Starter', 'Local', 'Supply Chain'].map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                  filter === cat 
                  ? 'bg-cyan-core text-void-stark shadow-[0_0_15px_rgba(6,182,212,0.4)]' 
                  : 'bg-white/5 text-white/60 hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Template Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <motion.div
              layout
              key={template.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="group h-full"
            >
              <UniversalCard 
                variant="glow" 
                className="h-full flex flex-col p-0 overflow-hidden hover:border-cyan-500/40 transition-all border-white/10"
              >
                <div className="p-6 space-y-4 flex-1">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core group-hover:scale-110 transition-transform">
                      <FileText size={24} />
                    </div>
                    <div className="flex gap-2">
                      {template.isHot && (
                        <UniversalBadge variant="warning" className="animate-pulse">HOT</UniversalBadge>
                      )}
                      <UniversalBadge variant="secondary">{template.complexity}</UniversalBadge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-black tracking-tight group-hover:text-cyan-400 transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-white/50 leading-relaxed line-clamp-3">
                      {template.desc}
                    </p>
                  </div>

                  <div className="pt-4 flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                      Standard: {template.standard}
                    </span>
                    <span className="px-2 py-1 bg-white/5 rounded text-[10px] font-black uppercase tracking-widest text-white/40 border border-white/5">
                      Category: {template.category}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 border-t border-white/10 mt-auto">
                  <UniversalButton variant="primary" className="w-full flex items-center justify-center gap-2 group/btn">
                    立即套用模板 <Zap size={14} className="group-hover/btn:animate-bounce" />
                  </UniversalButton>
                </div>
              </UniversalCard>
            </motion.div>
          ))}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="py-20 text-center space-y-4">
            <Search size={48} className="mx-auto text-white/10" />
            <h3 className="text-xl font-bold text-white/40">找不到符合條件的模板</h3>
            <UniversalButton variant="secondary" onClick={() => { setFilter('All'); setSearch(''); }}>
              清除過濾條件
            </UniversalButton>
          </div>
        )}

        {/* CTA Footer */}
        <div className="mt-12 p-8 bg-gradient-to-r from-cyan-900/40 to-indigo-900/40 rounded-[2.5rem] border border-cyan-500/20 text-center space-y-6">
          <h2 className="text-2xl font-bold">需要客製化模板嗎？</h2>
          <p className="text-white/60 max-w-xl mx-auto">
            ESGGO 支持企業自定義私有模板，並透過 AI 自動將舊有 Excel 資料映射至新結構。
          </p>
          <div className="flex justify-center gap-4">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Star size={16} /> 收藏目前設定
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              聯絡顧問協助 <ArrowRight size={16} />
            </UniversalButton>
          </div>
        </div>
      </div>
    </div>
  );
}
