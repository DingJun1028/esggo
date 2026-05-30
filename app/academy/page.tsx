'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalProgress } from '@/components/ui/universal/UniversalProgress';
import { GraduationCap, BookOpen, PlayCircle, Trophy, Star, Clock, ArrowRight, Search, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const COURSES = [
  { id: 1, title: 'ESG 基礎概論與 GRI 準則導讀', level: 'Beginner', duration: '4h', progress: 100, isNew: false, image: '📚' },
  { id: 2, title: '溫室氣體盤查實務 (ISO 14064-1)', level: 'Intermediate', duration: '6h', progress: 45, isNew: true, image: '🌱' },
  { id: 3, title: '供應鏈人權盡職調查深度解析', level: 'Advanced', duration: '3h', progress: 0, isNew: false, image: '🤝' },
  { id: 4, title: 'ISSB S1/S2 氣候風險揭露實戰', level: 'Advanced', duration: '5h', progress: 0, isNew: true, image: '⚡' },
];

export default function AcademyPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🎓">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <GraduationCap className="text-cyan-core" /> 永續學院 Academy
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              提升組織 ESG 核心素養。從基礎法規到進階確信實務，系統化建立企業內部的永續治理人才庫。
            </p>
          </div>
          <div className="flex gap-3">
            <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/10 flex items-center gap-3">
               <Trophy className="text-california-gold" size={18} />
               <div>
                  <p className="text-[10px] font-black uppercase text-white/30">Total Points</p>
                  <p className="text-sm font-bold">1,250 XP</p>
               </div>
            </div>
          </div>
        </header>

        {/* Learning Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           <UniversalCard variant="glass" className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-cyan-core">12</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">已完成課程</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-emerald-400">4</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">獲得認證</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-amber-400">18h</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">學習總時數</p>
           </UniversalCard>
           <UniversalCard variant="glass" className="p-6 text-center space-y-2">
              <p className="text-3xl font-black text-rose-400">#3</p>
              <p className="text-[10px] font-black uppercase tracking-widest text-white/30">部門排行榜</p>
           </UniversalCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Filter */}
           <div className="lg:col-span-1 space-y-6">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={16} />
                 <input type="text" placeholder="搜尋課程..." className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:border-cyan-500/50 outline-none" />
              </div>

              <UniversalCard title="課程分類" variant="bordered">
                 <div className="space-y-2">
                    {['全部課程', '法規與準則', '碳中和實務', '社會影響力', '公司治理'].map((cat, i) => (
                      <button key={i} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${i === 0 ? 'bg-cyan-core/10 text-cyan-400 font-bold' : 'text-white/40 hover:bg-white/5'}`}>
                         {cat}
                      </button>
                    ))}
                 </div>
              </UniversalCard>

              <div className="p-6 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-[2rem] border border-indigo-500/30">
                 <Star size={24} className="text-indigo-400 mb-2" />
                 <h4 className="font-bold text-white/90">推薦學習路徑</h4>
                 <p className="text-[11px] text-white/50 mt-1 mb-4">根據您的企業規模與產業，建議優先完成 ISO 14064 課程。</p>
                 <UniversalButton variant="primary"  className="w-full text-xs">開始路徑</UniversalButton>
              </div>
           </div>

           {/* Course Grid */}
           <div className="lg:col-span-3 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 px-2">課程清單 Courses</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {COURSES.map((course) => (
                   <motion.div key={course.id} whileHover={{ y: -5 }}>
                      <UniversalCard variant="glow" className="p-0 overflow-hidden flex flex-col h-full hover:border-cyan-500/40 transition-all">
                         <div className="h-40 bg-black/40 flex items-center justify-center text-6xl">
                            {course.image}
                         </div>
                         <div className="p-6 space-y-4 flex-1">
                            <div className="flex justify-between items-start">
                               <UniversalBadge variant="secondary" className="text-[8px]">{course.level}</UniversalBadge>
                               {course.isNew && <UniversalBadge variant="warning" className="text-[8px]">NEW</UniversalBadge>}
                            </div>
                            <h4 className="font-bold text-lg text-white/90 group-hover:text-cyan-400 transition-colors leading-tight">
                               {course.title}
                            </h4>
                            <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                               <div className="flex items-center gap-1"><Clock size={12} /> {course.duration}</div>
                               <div className="flex items-center gap-1"><BookOpen size={12} /> 12 Modules</div>
                            </div>
                            
                            <div className="space-y-2 pt-2">
                               <div className="flex justify-between text-[10px] font-mono text-white/40">
                                  <span>Progress</span>
                                  <span>{course.progress}%</span>
                               </div>
                               <UniversalProgress value={course.progress}  color={course.progress === 100 ? 'success' : 'primary'} />
                            </div>
                         </div>
                         <div className="p-4 bg-white/5 border-t border-white/5 mt-auto">
                            <UniversalButton variant={course.progress === 100 ? 'secondary' : 'primary'} className="w-full flex items-center justify-center gap-2">
                               {course.progress === 100 ? <><CheckCircle2 size={14} /> 重新複習</> : 
                                course.progress > 0 ? <><PlayCircle size={14} /> 繼續學習</> : 
                                <><PlayCircle size={14} /> 立即開始</>}
                            </UniversalButton>
                         </div>
                      </UniversalCard>
                   </motion.div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
