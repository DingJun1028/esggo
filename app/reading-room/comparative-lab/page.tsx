'use client';

import React from 'react';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { FlaskConical, Globe, TrendingUp, Search } from 'lucide-react';

export default function ComparativeLabPage() {
  const regions = [
    {
      name: '台灣 (Top 10)',
      coverage: '2020-2024',
      companies: 'TSMC, Foxconn, Fubon...',
      trend: 'Increasing',
    },
    {
      name: '歐美 (Top 5)',
      coverage: '2020-2024',
      companies: 'Apple, Microsoft, Schneider...',
      trend: 'Stable-High',
    },
  ];

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header Area */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center border border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] relative group">
              <FlaskConical className="text-amber-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="warning" size="sm" icon={<TrendingUp size={12} />}>
                  Trend Analysis Active
                </OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">
                  COMPARATIVE-LAB
                </span>
              </div>
              <h1 className="text-4xl font-black text-white tracking-tight">分析比較研究室</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">
                global esg trend analysis
              </p>
            </div>
          </div>
        </header>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {regions.map((region) => (
            <OmniBaseCard
              key={region.name}
              variant="glass"
              title={region.name}
              subtitle={`涵蓋期間: ${region.coverage}`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3">
                    <Globe className="text-cyan-400" size={18} />
                    <span className="text-sm font-medium">企業覆蓋範圍</span>
                  </div>
                  <span className="text-xs text-slate-400">{region.companies}</span>
                </div>
                <div className="p-4 bg-cyan-500/5 rounded-lg border border-cyan-500/20">
                  <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-widest mb-2">
                    趨勢摘要
                  </h4>
                  <p className="text-sm text-slate-300">
                    根據近 5 年永續報告書分析，該區域企業在<strong>範疇三揭露</strong>與
                    <strong>氣候韌性策略</strong>上有顯著的成長趨勢。
                  </p>
                </div>
              </div>
            </OmniBaseCard>
          ))}
        </div>

        <OmniBaseCard variant="glow" title="國際 ESG 情勢深度對比">
          <div className="aspect-video bg-black/40 rounded-xl border border-white/5 p-6 relative overflow-hidden group flex flex-col justify-end">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/5 via-transparent to-transparent opacity-50 pointer-events-none" />

            {/* Mock Chart Area */}
            <div className="w-full h-full flex items-end justify-between gap-2 relative z-10 pt-8 border-b border-white/10 pb-4">
              {[40, 65, 45, 80, 55, 90, 70, 85].map((height, i) => (
                <div
                  key={i}
                  className="w-full flex flex-col justify-end items-center group/bar relative h-full"
                >
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover/bar:opacity-100 absolute -top-8 bg-black/80 text-cyan-300 text-[10px] py-1 px-2 rounded border border-cyan-500/30 transition-opacity whitespace-nowrap font-mono pointer-events-none">
                    Score: {height}
                  </div>
                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-1000 ${
                      i % 2 === 0
                        ? 'bg-gradient-to-t from-cyan-600/40 to-cyan-400/80'
                        : 'bg-gradient-to-t from-emerald-600/40 to-emerald-400/80'
                    }`}
                    style={{ height: `${height}%` }}
                  >
                    <div className="w-full h-full border-t border-white/30 rounded-t-sm opacity-50 mix-blend-overlay"></div>
                  </div>
                </div>
              ))}
            </div>

            {/* X Axis Labels */}
            <div className="w-full flex justify-between mt-4 text-[10px] text-slate-500 font-mono uppercase tracking-widest relative z-10">
              <span>Q1 '23</span>
              <span>Q2 '23</span>
              <span>Q3 '23</span>
              <span>Q4 '23</span>
              <span>Q1 '24</span>
              <span>Q2 '24</span>
              <span>Q3 '24</span>
              <span>Q4 '24</span>
            </div>
          </div>
        </OmniBaseCard>
      </div>
    </div>
  );
}
