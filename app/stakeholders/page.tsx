'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { HeartHandshake, Users, MessageCircle, BarChart, ArrowUpRight, Search, Plus, Filter, Info, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const STAKEHOLDERS = [
  { id: 'SH-01', name: '全體員工 Employees', impact: 'Extreme', concern: 'High', engagement: '92%', lastContact: '2 days ago' },
  { id: 'SH-02', name: '主要投資人 Investors', impact: 'Extreme', concern: 'Extreme', engagement: '85%', lastContact: '1 week ago' },
  { id: 'SH-03', name: '在地社區 Local Community', impact: 'Medium', concern: 'High', engagement: '64%', lastContact: '1 month ago' },
  { id: 'SH-04', name: '供應商合作夥伴 Suppliers', impact: 'High', concern: 'Medium', engagement: '78%', lastContact: '3 days ago' },
  { id: 'SH-05', name: '政府監管機構 Regulators', impact: 'High', concern: 'Extreme', engagement: '100%', lastContact: 'Today' },
];

export default function StakeholdersPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🤝">
              旅程 III. 數據採集與填報
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <HeartHandshake className="text-cyan-core" /> 利害關係人 Stakeholders
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              管理核心利害關係人期待。透過多元參與機制採集意見，並將其關注議題自動映射至重大性矩陣。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="secondary" className="flex items-center gap-2">
                <MessageCircle size={16} /> 啟動問卷
             </UniversalButton>
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Plus size={16} /> 新增分類
             </UniversalButton>
          </div>
        </header>

        {/* Matrix Preview Small */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <UniversalCard variant="glass" className="p-6 flex flex-col items-center text-center space-y-2">
              <p className="text-3xl font-black text-cyan-core">5</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">核心類別</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 flex flex-col items-center text-center space-y-2">
              <p className="text-3xl font-black text-emerald-400">84%</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">平均參與度</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 flex flex-col items-center text-center space-y-2">
              <p className="text-3xl font-black text-amber-400">12</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">待處理議題</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 flex flex-col items-center text-center space-y-2">
              <p className="text-3xl font-black text-rose-400">Low</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">溝通風險等級</p>
           </UniversalCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* List */}
           <div className="lg:col-span-2 space-y-6">
              <UniversalCard title="利害關係人動態矩陣" variant="glow" className="p-0 overflow-hidden">
                 <div className="divide-y divide-white/5">
                    {STAKEHOLDERS.map((s) => (
                      <div key={s.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-white/20">
                               <Users size={24} />
                            </div>
                            <div>
                               <h4 className="font-bold text-lg text-white/90 group-hover:text-cyan-400 transition-colors">{s.name}</h4>
                               <div className="flex gap-4 mt-1">
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase">
                                     <Star size={10} className="text-california-gold" /> Impact: {s.impact}
                                  </div>
                                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase">
                                     <MessageCircle size={10} className="text-cyan-core" /> Concern: {s.concern}
                                  </div>
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-8">
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase text-white/20">Engagement</p>
                               <p className="text-sm font-black text-emerald-400 font-mono">{s.engagement}</p>
                            </div>
                            <button className="p-2 bg-white/5 rounded-xl text-white/20 hover:text-white hover:bg-cyan-500/20 transition-all border border-white/5">
                               <ArrowUpRight size={18} />
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
              </UniversalCard>
           </div>

           {/* Insights */}
           <div className="space-y-8">
              <UniversalCard title="關鍵關注趨勢 Top 3" variant="bordered">
                 <div className="space-y-6 py-2">
                    {[
                      { topic: '職業安全與健康', trend: 'Rising', count: 42 },
                      { topic: '氣候變遷因應', trend: 'Stable', count: 38 },
                      { topic: '員工多元與平等', trend: 'Emerging', count: 12 },
                    ].map((t, i) => (
                      <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                         <div>
                            <p className="text-sm font-bold text-white/80">{t.topic}</p>
                            <p className="text-[10px] font-black uppercase text-cyan-core mt-1">{t.trend}</p>
                         </div>
                         <span className="text-xs font-mono text-white/30">{t.count} 則反饋</span>
                      </div>
                    ))}
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[2.5rem] border border-indigo-500/30 text-center">
                 <BarChart size={32} className="text-indigo-400 mb-4 mx-auto" />
                 <h3 className="font-bold text-lg mb-2">生成重大性初報</h3>
                 <p className="text-xs text-white/60 mb-6">已收集足夠樣本數，可自動生成 2025 年度利害關係人參與總結。</p>
                 <UniversalButton variant="primary" className="w-full">執行 AI 解析</UniversalButton>
              </div>

              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-start gap-4">
                 <Info size={20} className="text-cyan-core shrink-0 mt-1" />
                 <p className="text-[10px] text-white/40 leading-relaxed italic">
                    利害關係人數據已通過 5T T1 Traceable 驗證。每一則留言皆具備匿名化的 Hash ID 以供後續追蹤而不侵犯隱私。
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
