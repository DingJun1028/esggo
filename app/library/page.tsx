'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Library, BookOpen, Download, Search, Filter, Bookmark, ExternalLink, FileText, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const RESOURCES = [
  { id: 1, title: 'GRI 2021 中文版官方準則', type: 'PDF', cat: 'Standard', size: '4.2 MB', stars: 120 },
  { id: 2, title: '2025 台灣永續報告揭露指南', type: 'PDF', cat: 'Guide', size: '2.8 MB', stars: 85 },
  { id: 3, title: '氣候相關財務揭露 (TCFD) 實務手冊', type: 'PDF', cat: 'Whitepaper', size: '5.1 MB', stars: 210 },
  { id: 4, title: '碳邊境調整機制 (CBAM) 申報範本', type: 'XLSX', cat: 'Template', size: '1.2 MB', stars: 340 },
];

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="📚">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Library className="text-cyan-core" /> 永續智庫 Library
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              企業專屬的 ESG 知識底盤。收錄全球最新準則、產業白皮書與治理範本。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="secondary" className="flex items-center gap-2">
                <Bookmark size={16} /> 我的收藏
             </UniversalButton>
          </div>
        </header>

        {/* Search Bar */}
        <div className="relative">
           <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={20} />
           <input 
             type="text" 
             placeholder="搜尋法規、白皮書或模板關鍵字..." 
             className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-lg focus:border-cyan-500/50 outline-none transition-all"
           />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Sidebar Filter */}
           <div className="lg:col-span-1 space-y-6">
              <UniversalCard title="資源分類" variant="bordered">
                 <div className="space-y-2">
                    {['全部資源', '國際準則', '產業指南', '專家白皮書', '工具模板'].map((cat, i) => (
                      <button key={i} className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all ${i === 0 ? 'bg-cyan-core/10 text-cyan-400 font-bold' : 'text-white/40 hover:bg-white/5'}`}>
                         {cat}
                      </button>
                    ))}
                 </div>
              </UniversalCard>
              
              <div className="p-8 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 rounded-[2rem] border border-cyan-500/30 text-center">
                 <Star size={32} className="text-cyan-400 mb-4 animate-pulse mx-auto" />
                 <h4 className="font-bold mb-2">本週熱門</h4>
                 <p className="text-xs text-white/50 mb-4">CBAM 申報範本已被下載超過 500 次</p>
                 <UniversalButton variant="primary" size="sm" className="w-full">立即下載</UniversalButton>
              </div>
           </div>

           {/* Resource Grid */}
           <div className="lg:col-span-3 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {RESOURCES.map((res) => (
                   <motion.div key={res.id} whileHover={{ scale: 1.02 }}>
                      <UniversalCard variant="glass" className="p-6 flex flex-col justify-between h-full hover:border-cyan-500/30 transition-all">
                         <div className="space-y-4">
                            <div className="flex justify-between items-start">
                               <div className="p-3 bg-white/5 rounded-xl text-white/30">
                                  <FileText size={24} />
                               </div>
                               <UniversalBadge variant="secondary" className="text-[8px]">{res.cat}</UniversalBadge>
                            </div>
                            <h4 className="font-bold text-lg leading-tight group-hover:text-cyan-400 transition-colors">{res.title}</h4>
                            <div className="flex items-center gap-4 text-[10px] text-white/30 font-bold uppercase tracking-widest">
                               <span>{res.type}</span>
                               <span>{res.size}</span>
                               <span className="flex items-center gap-1"><Star size={10} className="text-california-gold" /> {res.stars}</span>
                            </div>
                         </div>
                         <div className="flex gap-2 pt-6">
                            <UniversalButton variant="secondary" className="flex-1 text-[10px] h-9 py-0">線上預覽</UniversalButton>
                            <UniversalButton variant="primary" className="flex-1 text-[10px] h-9 py-0 flex items-center justify-center gap-2">
                               <Download size={14} /> 下載
                            </UniversalButton>
                         </div>
                      </UniversalCard>
                   </motion.div>
                 ))}
              </div>

              <div className="pt-8">
                 <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 px-2 mb-4">合作夥伴連結 Partners</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['GRI Global', 'ISSB Foundation', 'UN Global Compact', 'CDP Worldwide'].map((p, i) => (
                      <button key={i} className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs font-bold text-white/40 hover:text-white/80 hover:border-white/20 transition-all flex items-center justify-between">
                         {p} <ExternalLink size={12} />
                      </button>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
