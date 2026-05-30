'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Truck, MapPin, ShieldCheck, AlertCircle, Search, Filter, Plus, ExternalLink, Activity, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const SUPPLIERS = [
  { id: 'S-001', name: '全台鋼鐵股份有限公司', location: 'Kaohsiung, TW', risk: 'Low', status: 'Verified', rating: 'A' },
  { id: 'S-002', name: 'Global Logistics Hub', location: 'Singapore', risk: 'Medium', status: 'Pending', rating: 'B' },
  { id: 'S-003', name: 'Shenzhen Precision Parts', location: 'Shenzhen, CN', risk: 'High', status: 'Audit Req', rating: 'C' },
  { id: 'S-004', name: 'Green Energy Solutions', location: 'Berlin, DE', risk: 'Low', status: 'Verified', rating: 'A+' },
];

export default function SupplyChainPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🚛">
              旅程 III. 數據採集與填報
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Truck className="text-cyan-core" /> 供應鏈透明 Supply Chain
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              建構端對端的可信供應鏈。追蹤一級至三級供應商的 ESG 合規表現，偵測人權與環境風險。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Plus size={16} /> 邀請供應商
             </UniversalButton>
          </div>
        </header>

        {/* Search & Filter */}
        <div className="flex flex-col md:flex-row gap-4 bg-white/5 p-4 rounded-2xl border border-white/10">
           <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
              <input type="text" placeholder="搜尋供應商、ID 或區域..." className="w-full pl-10 pr-4 py-2 bg-black/20 border border-white/10 rounded-xl text-sm focus:border-cyan-500/50 outline-none" />
           </div>
           <UniversalButton variant="secondary" className="flex items-center gap-2">
              <Filter size={16} /> 篩選風險
           </UniversalButton>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Supplier List */}
           <div className="lg:col-span-2 space-y-6">
              <UniversalCard title="關鍵供應商名錄" variant="glow" className="p-0 overflow-hidden">
                 <div className="divide-y divide-white/5">
                    {SUPPLIERS.map((s) => (
                      <div key={s.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl border ${s.risk === 'High' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-white/5 border-white/10 text-white/40'}`}>
                               <MapPin size={20} />
                            </div>
                            <div>
                               <h4 className="font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{s.name}</h4>
                               <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{s.id} • {s.location}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right">
                               <p className="text-[10px] font-black uppercase text-white/20">ESG Rating</p>
                               <p className={`text-sm font-black ${s.rating.startsWith('A') ? 'text-emerald-400' : s.rating === 'B' ? 'text-cyan-400' : 'text-rose-400'}`}>{s.rating}</p>
                            </div>
                            <UniversalBadge variant={s.status === 'Verified' ? 'success' : s.status === 'Pending' ? 'warning' : 'error'} className="text-[8px]">
                               {s.status}
                            </UniversalBadge>
                            <button className="text-white/20 hover:text-white transition-colors"><ExternalLink size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </UniversalCard>
           </div>

           {/* Risk & Analysis */}
           <div className="space-y-8">
              <div className="p-8 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-[2.5rem] border border-rose-500/30">
                 <Activity size={32} className="text-rose-400 mb-4 animate-pulse" />
                 <h3 className="font-bold text-xl mb-2">供應鏈風險預警</h3>
                 <p className="text-sm text-white/70 mb-6 leading-relaxed">
                    偵測到深圳精密零件地區發生極端氣候事件（暴雨），預計影響 Scope 3 交貨期約 5-7 天。
                 </p>
                 <UniversalButton variant="primary" className="w-full bg-rose-500 hover:bg-rose-600 text-white">啟動應變計畫</UniversalButton>
              </div>

              <UniversalCard title="供應商合規統計" variant="bordered">
                 <div className="space-y-6">
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-white/40">
                          <span>數據已確信比例</span>
                          <span className="text-emerald-400">72%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '72%' }} className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-xs font-bold text-white/40">
                          <span>問卷回收率</span>
                          <span className="text-cyan-400">85%</span>
                       </div>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div animate={{ width: '85%' }} className="h-full bg-cyan-core shadow-[0_0_10px_#06b6d4]" />
                       </div>
                    </div>
                    <UniversalButton variant="secondary" className="w-full text-xs">生成供應鏈週報</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 flex items-center gap-4">
                 <Users size={24} className="text-cyan-400 shrink-0" />
                 <div>
                    <h5 className="text-xs font-bold">協作網絡</h5>
                    <p className="text-[10px] text-white/30">目前與 142 家供應商建立 5T 同步</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
