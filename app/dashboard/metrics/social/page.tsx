'use client';

import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { Users, Heart, GraduationCap, TrendingUp, Briefcase } from 'lucide-react';

export default function SocialMetricsPage() {
  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30">
      <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] relative">
              <Users className="text-purple-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <UniversalBadge variant="default" size="sm" icon={<Heart size={12}/>} className="bg-purple-500/20 text-purple-300 border-purple-500/30">S-Metrics</UniversalBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">SOC-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">社會指標 (Social)</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Labor Practices & Community Impact</p>
            </div>
          </div>
        </header>

        {/* Social Dashboard Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UniversalCard variant="glass" className="p-6">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Heart size={18} className="text-pink-400" /> 員工留任率
            </h3>
            <div className="text-3xl font-black text-white mb-2">92.4%</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2 flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-500" /> 較上季提升 1.2%
            </p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <GraduationCap size={18} className="text-purple-400" /> 培訓總時數
            </h3>
            <div className="text-3xl font-black text-white mb-2">4,520 小時</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">達標: 平均每人 24 小時</p>
          </UniversalCard>

          <UniversalCard variant="glass" className="p-6">
            <h3 className="font-bold text-slate-300 flex items-center gap-2 mb-4">
              <Briefcase size={18} className="text-blue-400" /> 職安衛事件
            </h3>
            <div className="text-3xl font-black text-white mb-2">0 件</div>
            <p className="text-sm text-slate-400 border-t border-white/5 pt-2">狀態: 零失能傷害</p>
          </UniversalCard>
        </div>

      </div>
    </div>
  );
}
