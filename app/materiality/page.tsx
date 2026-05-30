'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Hexagon, Plus, Settings2, Info, ArrowUp, ArrowRight, MousePointer2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TOPICS = [
  { id: 1, name: '氣候變遷 Climate Change', impact: 85, concern: 90, cat: 'E' },
  { id: 2, name: '能源管理 Energy', impact: 75, concern: 80, cat: 'E' },
  { id: 3, name: '水資源 Water', impact: 40, concern: 60, cat: 'E' },
  { id: 4, name: '職業安全 Health & Safety', impact: 90, concern: 85, cat: 'S' },
  { id: 5, name: '員工發展 Talent Development', impact: 60, concern: 70, cat: 'S' },
  { id: 6, name: '人權保障 Human Rights', impact: 50, concern: 55, cat: 'S' },
  { id: 7, name: '商業道德 Ethics', impact: 95, concern: 95, cat: 'G' },
  { id: 8, name: '風險管理 Risk Management', impact: 80, concern: 75, cat: 'G' },
  { id: 9, name: '供應鏈管理 Supply Chain', impact: 70, concern: 90, cat: 'G' },
];

export default function MaterialityPage() {
  const [hoveredTopic, setHoveredTopic] = useState<any>(null);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 II. 策略盤點與分派
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Hexagon className="text-cyan-core" /> 重大性矩陣 Materiality
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              識別並排序對企業及利害關係人最重要的 ESG 議題。雙重重大性 (Double Materiality) 評估基石。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Settings2 size={16} /> 評估權仗
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              <Plus size={16} /> 新增議題
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Legend & List */}
          <div className="lg:col-span-1 space-y-6">
            <UniversalCard title="議題清單 Topics" variant="bordered">
              <div className="space-y-2 max-h-[500px] overflow-y-auto no-scrollbar">
                {TOPICS.sort((a, b) => b.impact + b.concern - (a.impact + a.concern)).map((t) => (
                  <div 
                    key={t.id} 
                    onMouseEnter={() => setHoveredTopic(t)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    className={`p-3 rounded-xl border transition-all cursor-default ${
                      hoveredTopic?.id === t.id 
                      ? 'bg-cyan-core/10 border-cyan-500/50' 
                      : 'bg-white/5 border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${
                        t.cat === 'E' ? 'bg-emerald-500/20 text-emerald-400' :
                        t.cat === 'S' ? 'bg-cyan-500/20 text-cyan-400' :
                        'bg-amber-500/20 text-amber-400'
                      }`}>
                        {t.cat}
                      </span>
                      <span className="text-[10px] font-mono text-white/30">ID:{t.id}</span>
                    </div>
                    <p className="text-xs font-bold truncate">{t.name}</p>
                  </div>
                ))}
              </div>
            </UniversalCard>
            
            <div className="p-6 bg-white/5 rounded-[1.5rem] border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white/40">
                <Info size={14} /> 矩陣讀法
              </div>
              <p className="text-[11px] text-white/50 leading-relaxed">
                右上角區域 (Top Right) 為 **「核心重大議題」**，應優先納入永續報告揭露並設定長期 KPI。
              </p>
            </div>
          </div>

          {/* Matrix Chart Area */}
          <div className="lg:col-span-3 space-y-6">
            <UniversalCard variant="glow" className="relative p-0 overflow-hidden bg-black/20">
              <div className="aspect-square md:aspect-video w-full relative p-12 md:p-20">
                {/* Grid Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-px bg-white/10" />
                  <div className="h-full w-px bg-white/10" />
                </div>
                
                {/* Quadrant Labels */}
                <div className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest text-cyan-core/50">Core Materiality</div>
                <div className="absolute bottom-4 left-4 text-[10px] font-black uppercase tracking-widest text-white/20">Emerging Topics</div>

                {/* Axis Labels */}
                <div className="absolute left-4 top-1/2 -translate-y-1/2 -rotate-90 flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                  <ArrowUp size={14} /> Concern by Stakeholders
                </div>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs font-black text-white/40 uppercase tracking-[0.2em]">
                  Impact on Business & Society <ArrowRight size={14} />
                </div>

                {/* Bubbles */}
                {TOPICS.map((t) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ 
                      opacity: 1, 
                      scale: hoveredTopic?.id === t.id ? 1.2 : 1,
                      x: `${t.impact}%`, 
                      y: `${100 - t.concern}%`,
                      left: 0,
                      top: 0
                    }}
                    onMouseEnter={() => setHoveredTopic(t)}
                    onMouseLeave={() => setHoveredTopic(null)}
                    className={`absolute w-4 h-4 md:w-6 md:h-6 -ml-2 -mt-2 rounded-full cursor-pointer shadow-lg transition-colors ${
                      t.cat === 'E' ? 'bg-emerald-500 shadow-emerald-500/50' :
                      t.cat === 'S' ? 'bg-cyan-500 shadow-cyan-500/50' :
                      'bg-amber-500 shadow-amber-500/50'
                    }`}
                  >
                    <div className="absolute inset-0 rounded-full animate-ping opacity-20 bg-inherit" />
                    
                    {/* Tooltip on hover */}
                    {hoveredTopic?.id === t.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-void-stark/95 backdrop-blur-xl border border-white/20 p-3 rounded-xl shadow-2xl z-50 pointer-events-none">
                        <p className="text-[10px] font-black uppercase text-cyan-core mb-1">{t.cat} Topic</p>
                        <p className="text-xs font-bold mb-2">{t.name}</p>
                        <div className="flex justify-between text-[10px] font-mono text-white/60">
                          <span>Impact: {t.impact}</span>
                          <span>Concern: {t.concern}</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </UniversalCard>

            {/* Matrix Insights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <UniversalCard title="核心優先議題" variant="bordered" className="border-cyan-500/30">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <UniversalBadge variant="success">TOP 3</UniversalBadge>
                  </div>
                  <ul className="text-sm text-white/70 space-y-2">
                    <li className="flex items-center gap-2"><Check size={14} className="text-cyan-core" /> 商業道德</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-cyan-core" /> 氣候變遷</li>
                    <li className="flex items-center gap-2"><Check size={14} className="text-cyan-core" /> 供應鏈管理</li>
                  </ul>
                </div>
              </UniversalCard>
              
              <UniversalCard title="建議行動" variant="bordered">
                <p className="text-sm text-white/60 leading-relaxed mb-4">針對 Top 3 議題，系統建議優先啟動 5T 數據自動化採集，並關聯至 Evidence Vault。</p>
                <UniversalButton variant="secondary" className="w-full text-xs">查看 AI 建議</UniversalButton>
              </UniversalCard>

              <div className="p-6 bg-cyan-core/5 rounded-[2rem] border border-cyan-500/20 flex flex-col justify-center items-center text-center">
                <MousePointer2 size={32} className="text-cyan-core mb-4 animate-bounce" />
                <h3 className="font-bold mb-2">點擊氣泡</h3>
                <p className="text-xs text-white/50">查看議題詳細背景與 RAG 法律溯源資料。</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
