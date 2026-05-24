'use client';

import React, { useState } from 'react';
import { Bot, Network, Globe, Activity, Database, CheckCircle, RefreshCcw } from 'lucide-react';
import { BrandBadge, BrandButton, BrandCard, BrandCardHeader } from '../../components/brand';
import ScraperControl from '../../components/omni/ScraperControl';
import DataVisualizer from '../../components/omni/DataVisualizer';

export default function OmniSkillsPage() {
  const [activeView, setActiveView] = useState<'scraper' | 'visualizer'>('scraper');

  return (
    <div className="page-container space-y-8 pb-24 fade-in">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 lg:gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <BrandBadge variant="gold" size="sm" className="font-black tracking-[0.15em] px-3 py-1 rounded-full shadow-lg shadow-[#FDB515]/5">
              OMNI_AGENT v2.0
            </BrandBadge>
            <div className="flex items-center gap-2 bg-blue-50/50 backdrop-blur-sm px-3 py-1 rounded-full border border-blue-100/50">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span className="text-[9px] font-black text-blue-700 uppercase tracking-widest">Skill Active</span>
            </div>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-5xl font-black text-[#003262] tracking-tight leading-none uppercase flex items-center gap-4">
              <Bot className="text-[#FDB515]" size={42} />
              自主代理技能中心
            </h1>
            <p className="text-slate-400 text-base max-w-2xl font-medium leading-relaxed mt-2">
              透過自動數據收集 (Web Scraping) 與動態資料視覺化 (Data Visualization)，實時掌握全球 ESG 動態與合規法規。
            </p>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="flex gap-4 border-b border-slate-200 pb-2">
        <button 
          onClick={() => setActiveView('scraper')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
            activeView === 'scraper' ? 'bg-[#003262] text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Globe size={18} />
          <span>自動數據採集 (Scraper)</span>
        </button>
        <button 
          onClick={() => setActiveView('visualizer')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-bold transition-all ${
            activeView === 'visualizer' ? 'bg-[#003262] text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
          }`}
        >
          <Activity size={18} />
          <span>資料視覺化分析 (Visualizer)</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="mt-6">
        {activeView === 'scraper' && <ScraperControl />}
        {activeView === 'visualizer' && <DataVisualizer />}
      </div>
    </div>
  );
}
