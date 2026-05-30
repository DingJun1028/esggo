'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { BarChart3, Newspaper, Bell, ExternalLink, TrendingUp, TrendingDown, Target, Info, Search } from 'lucide-react';
import { motion } from 'framer-motion';

const NEWS = [
  { id: 1, title: '歐盟 CBAM 申報過渡期結束，企業應對指南發佈', source: 'Reuters', time: '1 hr ago', impact: 'High' },
  { id: 2, title: '台灣證交所宣佈上市櫃公司 2026 起須揭露範疇三', source: 'TWSE', time: '3 hrs ago', impact: 'Extreme' },
  { id: 3, title: '全球供應鏈 ESG 評級標準統一化趨勢分析', source: 'Bloomberg', time: '5 hrs ago', impact: 'Medium' },
];

const BENCHMARKS = [
  { company: 'My Company', score: 72, color: 'bg-cyan-core' },
  { company: 'Competitor A', score: 85, color: 'bg-white/10' },
  { company: 'Competitor B', score: 64, color: 'bg-white/10' },
  { company: 'Industry Avg', score: 68, color: 'bg-white/5' },
];

export default function IntelligencePage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 IV. AI 賦能與撰寫
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <BarChart3 className="text-cyan-core" /> 商情中心 Intelligence
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              洞察 ESG 趨勢與同業表現。實時監控法規變動，並透過 AI 進行競爭力基準測試 (Benchmarking)。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Bell size={16} /> 訂閱提醒
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              生成商情週報
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Intelligence Area */}
          <div className="lg:col-span-2 space-y-8">
            <UniversalCard title="同業標竿對照 Benchmarking" variant="glow">
              <div className="space-y-6 py-4">
                {BENCHMARKS.map((b, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-white/40">
                      <span className={b.company === 'My Company' ? 'text-cyan-core' : ''}>{b.company}</span>
                      <span className="font-mono">{b.score} / 100</span>
                    </div>
                    <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${b.score}%` }}
                        transition={{ duration: 1.5, delay: i * 0.1 }}
                        className={`h-full ${b.color} ${b.company === 'My Company' ? 'shadow-[0_0_15px_#06b6d4]' : ''}`}
                      />
                    </div>
                  </div>
                ))}
                <div className="pt-4 flex items-center gap-2 text-xs text-white/30">
                  <Info size={14} />
                  <p>基準數據來源：Refinitiv, MSCI ESG 揭露資料庫</p>
                </div>
              </div>
            </UniversalCard>

            <UniversalCard title="實時監控新聞 News Monitor" variant="bordered">
              <div className="divide-y divide-white/5">
                {NEWS.map((item) => (
                  <div key={item.id} className="py-4 flex items-center justify-between group hover:bg-white/5 transition-all px-2 rounded-xl">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <UniversalBadge variant={item.impact === 'Extreme' ? 'error' : item.impact === 'High' ? 'warning' : 'secondary'} className="text-[8px]">
                          {item.impact} Impact
                        </UniversalBadge>
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.source} • {item.time}</span>
                      </div>
                      <h4 className="font-bold text-sm text-white/80 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                    </div>
                    <button className="p-2 text-white/20 hover:text-white transition-colors"><ExternalLink size={16} /></button>
                  </div>
                ))}
              </div>
            </UniversalCard>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <UniversalCard title="法規變動提醒 Legal Alerts" variant="glass">
              <div className="space-y-4">
                 {[
                   { title: '台灣永續報告書新制', date: '2026-01-01', status: 'Pending' },
                   { title: '歐盟供應鏈指令 (CSDDD)', date: '2025-12-31', status: 'Upcoming' },
                 ].map((alert, i) => (
                   <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-2">
                      <h5 className="text-xs font-bold text-white/90">{alert.title}</h5>
                      <div className="flex justify-between items-center">
                         <span className="text-[10px] font-mono text-white/40">Deadline: {alert.date}</span>
                         <UniversalBadge variant="secondary" className="text-[8px]">{alert.status}</UniversalBadge>
                      </div>
                   </div>
                 ))}
                 <UniversalButton variant="secondary" className="w-full text-xs">查看所有法規清單</UniversalButton>
              </div>
            </UniversalCard>

            <div className="p-8 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[2rem] border border-amber-500/30">
               <Target size={32} className="text-amber-400 mb-4" />
               <h3 className="font-bold mb-2 uppercase tracking-tighter text-xl text-amber-400">競爭力落差分析</h3>
               <p className="text-sm text-white/70 mb-6 leading-relaxed">
                 與同業平均相比，您的「範疇三披露」完整度低於 15%。建議優先盤點運輸數據。
               </p>
               <UniversalButton variant="primary" className="w-full bg-amber-500 hover:bg-amber-600 text-void-stark">生成差距報告</UniversalButton>
            </div>

            <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex flex-col items-center text-center space-y-4">
               <TrendingUp size={24} className="text-emerald-400" />
               <div>
                  <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Industry Trend</p>
                  <h4 className="text-xl font-bold">加強 ZKP 確信</h4>
               </div>
               <p className="text-xs text-white/50 italic">
                 市場上 60% 的標竿企業已導入 ZKP 數據保護技術，建議儘速啟用。
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
