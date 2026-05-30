'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Users, Star, MessageSquare, Calendar, ShieldCheck, MapPin, Award, Search, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const ADVISORS = [
  { id: 1, name: 'Dr. Sarah Chen', role: '碳盤查資深顧問', expert: ['ISO 14064', 'SBTi'], rating: 4.9, cases: 120, image: '👩‍🏫' },
  { id: 2, name: 'James Wilson', role: '供應鏈永續專家', expert: ['RBA', 'Human Rights'], rating: 4.8, cases: 85, image: '👨‍💼' },
  { id: 3, name: '林小明 律師', role: 'ESG 合規法律顧問', expert: ['CSDDD', 'EU Tax'], rating: 5.0, cases: 42, image: '⚖️' },
];

export default function AdvisorsPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🤝">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Users className="text-cyan-core" /> 顧問專區 Advisors
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              真人專家與 AI 的協同治理。媒合全球 ESG 頂尖顧問，提供深度的盤查指導、合規簽證與策略諮詢。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Calendar size={16} /> 預約諮詢
             </UniversalButton>
          </div>
        </header>

        {/* Categories / Search */}
        <div className="flex flex-col md:flex-row gap-4">
           <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input type="text" placeholder="搜尋顧問姓名、專業領域或證照..." className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-cyan-500/50 outline-none" />
           </div>
           <div className="flex gap-2">
              {['全部領域', '碳中和', '社會人權', '法律合規'].map((cat, i) => (
                <button key={i} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${i === 0 ? 'bg-cyan-core text-void-stark' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}>
                   {cat}
                </button>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {ADVISORS.map((adv) => (
             <motion.div key={adv.id} whileHover={{ y: -5 }}>
                <UniversalCard variant="glow" className="p-0 overflow-hidden flex flex-col h-full border-white/10 hover:border-cyan-500/30 transition-all">
                   <div className="p-8 flex flex-col items-center text-center space-y-4">
                      <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-5xl shadow-xl relative">
                         {adv.image}
                         <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-4 border-void-stark flex items-center justify-center">
                            <ShieldCheck size={12} className="text-white" />
                         </div>
                      </div>
                      <div>
                         <h4 className="text-xl font-bold">{adv.name}</h4>
                         <p className="text-xs text-cyan-core font-bold uppercase tracking-widest">{adv.role}</p>
                      </div>
                      <div className="flex gap-1">
                         {[...Array(5)].map((_, i) => (
                           <Star key={i} size={14} className={i < Math.floor(adv.rating) ? 'text-california-gold fill-california-gold' : 'text-white/10'} />
                         ))}
                         <span className="text-xs font-mono text-white/40 ml-2">{adv.rating}</span>
                      </div>
                      <div className="flex flex-wrap justify-center gap-2 pt-2">
                         {adv.expert.map((e, i) => (
                           <span key={i} className="px-2 py-0.5 bg-white/5 border border-white/5 rounded text-[10px] text-white/50">{e}</span>
                         ))}
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 border-t border-white/5 divide-x divide-white/5">
                      <div className="p-4 text-center">
                         <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">指導案例</p>
                         <p className="text-lg font-black">{adv.cases}+</p>
                      </div>
                      <div className="p-4 text-center">
                         <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">服務狀態</p>
                         <p className="text-lg font-black text-emerald-400">可預約</p>
                      </div>
                   </div>

                   <div className="p-4 bg-white/5 flex gap-2">
                      <UniversalButton variant="secondary" className="flex-1 text-[10px] h-9 py-0">查看檔案</UniversalButton>
                      <UniversalButton variant="primary" className="flex-1 text-[10px] h-9 py-0 flex items-center justify-center gap-2">
                         <MessageSquare size={12} /> 即時對話
                      </UniversalButton>
                   </div>
                </UniversalCard>
             </motion.div>
           ))}
        </div>

        {/* Consulting Services */}
        <div className="pt-12 space-y-8">
           <h2 className="text-2xl font-bold flex items-center gap-3">
              <Award size={24} className="text-cyan-core" /> 顧問服務 Consulting Packages
           </h2>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <UniversalCard variant="bordered" title="企業永續報告代編服務" className="p-6">
                 <p className="text-sm text-white/60 mb-6 leading-relaxed">
                   由專業顧問團隊進駐，結合 ESGGO 平台自動化工具，在 60 天內完成高品質永續報告書，並通過外部確信。
                 </p>
                 <div className="space-y-3 mb-8">
                    {['包含 5T 數據中樞導入', 'GRI/ISSB 雙框架對標', '第三方確信媒合', 'AI 賦能撰寫培訓'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-white/80">
                         <ShieldCheck size={14} className="text-cyan-core" /> {f}
                      </div>
                    ))}
                 </div>
                 <UniversalButton variant="secondary" className="w-full">了解詳情</UniversalButton>
              </UniversalCard>

              <UniversalCard variant="bordered" title="淨零路徑規劃與輔導" className="p-6">
                 <p className="text-sm text-white/60 mb-6 leading-relaxed">
                    協助企業定義減碳科學目標 (SBTi)，規劃短中長期淨零里程碑，並協助採購再生能源憑證。
                 </p>
                 <div className="space-y-3 mb-8">
                    {['範疇三價值鏈盤查', 'CBAM 應對策略', '低碳轉型融資諮詢', '年度減碳績效審核'].map((f, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs text-white/80">
                         <ShieldCheck size={14} className="text-cyan-core" /> {f}
                      </div>
                    ))}
                 </div>
                 <UniversalButton variant="secondary" className="w-full">了解詳情</UniversalButton>
              </UniversalCard>
           </div>
        </div>
      </div>
    </div>
  );
}
