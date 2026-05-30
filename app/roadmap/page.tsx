'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Map, Flag, Target, TrendingUp, Calendar, CheckCircle2, Circle, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const MILESTONES = [
  { id: 1, year: '2026', title: '創世基石 Genesis', status: 'completed', tasks: ['完成全廠碳盤查', '建立 5T 數據中樞', '發佈首份 GRI 報告'] },
  { id: 2, year: '2027', title: '低碳轉型 Transition', status: 'current', tasks: ['再生能源佔比達 30%', '供應鏈 ESG 稽核率 100%', '導入 ISSB 財務風險評估'] },
  { id: 3, year: '2028', title: '智能治理 Intelligent', status: 'pending', tasks: ['AI 自動化審計佔比 80%', '達成產品碳足跡標籤全覆蓋'] },
  { id: 4, year: '2030', title: '淨零領航 Net Zero', status: 'pending', tasks: ['範疇一、二達成碳中和', '循環經濟模型完全落地'] },
];

export default function RoadmapPage() {
  const [selectedMilestone, setSelectedMilestone] = useState(MILESTONES[1]);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 II. 策略盤點與分派
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Map className="text-cyan-core" /> 淨零路徑 Roadmap
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              規劃企業永續發展願景。將長期目標分解為具體里程碑，實時追蹤減碳進度與 ESG 績效。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Calendar size={16} /> 歷史紀錄
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
              更新策略目標
            </UniversalButton>
          </div>
        </header>

        {/* Roadmap Timeline */}
        <div className="relative py-12 px-4 md:px-12 bg-white/5 rounded-[2.5rem] border border-white/10 overflow-hidden">
          <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />
          
          {/* Progress Line */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 hidden md:block" />
          <div className="absolute top-1/2 left-0 w-[40%] h-1 bg-gradient-to-r from-cyan-500 to-blue-500 -translate-y-1/2 hidden md:block shadow-[0_0_15px_rgba(6,182,212,0.5)]" />

          <div className="relative flex flex-col md:flex-row justify-between items-center gap-12 md:gap-0">
            {MILESTONES.map((m, i) => (
              <motion.div 
                key={m.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedMilestone(m)}
                className={`relative z-10 flex flex-col items-center group cursor-pointer ${
                  selectedMilestone.id === m.id ? 'scale-110' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${
                  m.status === 'completed' ? 'bg-emerald-500 border-emerald-500/30' :
                  m.status === 'current' ? 'bg-cyan-500 border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.6)] animate-pulse' :
                  'bg-void-stark border-white/20'
                }`}>
                  {m.status === 'completed' ? <CheckCircle2 size={20} /> : <Target size={20} className={m.status === 'current' ? 'text-void-stark' : 'text-white/20'} />}
                </div>
                
                <div className="mt-4 text-center">
                  <p className={`text-lg font-black ${selectedMilestone.id === m.id ? 'text-cyan-400' : 'text-white/40'}`}>{m.year}</p>
                  <p className={`text-sm font-bold truncate max-w-[120px] ${selectedMilestone.id === m.id ? 'text-white' : 'text-white/30'}`}>{m.title}</p>
                </div>

                {selectedMilestone.id === m.id && (
                  <motion.div layoutId="active-indicator" className="absolute -bottom-8 w-2 h-2 bg-cyan-400 rounded-full shadow-[0_0_10px_#06b6d4]" />
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Selected Milestone Detail */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <UniversalCard 
              title={`階段任務 Detail: ${selectedMilestone.year} ${selectedMilestone.title}`} 
              variant="glow"
            >
              <div className="space-y-4">
                {selectedMilestone.tasks.map((task, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                        selectedMilestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'
                      }`}>
                        {i + 1}
                      </div>
                      <span className="font-bold text-white/80 group-hover:text-white transition-colors">{task}</span>
                    </div>
                    <UniversalBadge variant={selectedMilestone.status === 'completed' ? 'success' : 'secondary'}>
                      {selectedMilestone.status === 'completed' ? 'Done' : 'In Progress'}
                    </UniversalBadge>
                  </div>
                ))}
                <UniversalButton variant="secondary" className="w-full mt-4 flex items-center justify-center gap-2">
                  <Flag size={14} /> 管理所有里程碑任務
                </UniversalButton>
              </div>
            </UniversalCard>
          </div>

          <div className="space-y-6">
            <UniversalCard title="核心目標 KPI" variant="bordered">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                    <span>碳排放減量</span>
                    <span className="text-cyan-400">42% / 100%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-core shadow-[0_0_10px_#06b6d4]" style={{ width: '42%' }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest text-white/40">
                    <span>再生能源佔比</span>
                    <span className="text-emerald-400">18% / 30%</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" style={{ width: '60%' }} />
                  </div>
                </div>
                <hr className="border-white/5" />
                <div className="flex items-center gap-3 text-white/60">
                  <TrendingUp size={20} className="text-cyan-core" />
                  <p className="text-sm font-bold">預計 2027 年達成率 92%</p>
                </div>
              </div>
            </UniversalCard>

            <div className="p-8 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[2.5rem] border border-indigo-500/30 flex flex-col justify-center items-center text-center">
              <Activity size={32} className="text-indigo-400 mb-4 animate-pulse" />
              <h3 className="font-bold mb-2 uppercase tracking-tighter text-xl">策略演進分析</h3>
              <p className="text-xs text-white/50 mb-6">AI 已識別 3 個潛在風險可能延誤 2028 里程碑。建議調整供應鏈政策。</p>
              <UniversalButton variant="primary" className="w-full">啟動 AI 模擬</UniversalButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
