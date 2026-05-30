'use client';

import React from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { BookOpen, Coffee, Bookmark, Search, ArrowRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReadingRoomPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="📖">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <BookOpen className="text-cyan-core" /> 永續閱覽室 Reading Room
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              沈浸式的永續文獻閱覽空間。提供舒適的閱讀界面、智慧筆記與跨文獻標記功能。
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="md:col-span-2 space-y-6">
              <UniversalCard variant="glow" title="今日推薦閱讀" className="p-8">
                 <div className="flex flex-col md:flex-row gap-8">
                    <div className="w-full md:w-48 aspect-[3/4] bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-4xl">
                       🌿
                    </div>
                    <div className="flex-1 space-y-4">
                       <UniversalBadge variant="warning">MUST READ</UniversalBadge>
                       <h3 className="text-2xl font-bold">2026 全球生物多樣性揭露框架解析</h3>
                       <p className="text-sm text-white/50 leading-relaxed">
                         本文深入分析了 TNFD 最新發佈的生物多樣性揭露要求，以及企業如何透過 5T 協議自動化採集生態影響數據。
                       </p>
                       <div className="pt-4">
                          <UniversalButton variant="primary">進入閱讀模式</UniversalButton>
                       </div>
                    </div>
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {[
                   { title: '循環經濟：從理論到獲利', time: '15 min read' },
                   { title: '供應鏈透明度的密碼學實踐', time: '10 min read' },
                 ].map((item, i) => (
                   <UniversalCard key={i} variant="bordered" className="p-6 hover:border-cyan-500/30 transition-all cursor-pointer group">
                      <h4 className="font-bold mb-2 group-hover:text-cyan-400 transition-colors">{item.title}</h4>
                      <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{item.time}</p>
                   </UniversalCard>
                 ))}
              </div>
           </div>

           <div className="space-y-6">
              <UniversalCard title="我的書籤" variant="bordered">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-sm text-white/60">
                       <Bookmark size={14} className="text-cyan-core" />
                       <span>GRI 305-1 數據定義</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-white/60">
                       <Bookmark size={14} className="text-cyan-core" />
                       <span>歐盟分類法 (EU Taxonomy)</span>
                    </div>
                    <UniversalButton variant="secondary" className="w-full text-xs">查看全部</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center">
                 <Coffee size={32} className="text-white/20 mx-auto mb-4" />
                 <h4 className="font-bold text-white/80">純淨閱讀模式</h4>
                 <p className="text-xs text-white/40 mt-2">已開啟防干擾過濾，AI 將自動隱藏非關聯資訊。</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
