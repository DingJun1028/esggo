'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Rocket, FileText, Download, Share2, Eye, ShieldCheck, History, ExternalLink, Globe, Layout, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

const VERSIONS = [
  { id: 'v2.0', name: '2025 永續報告 - 最終封印版', date: '2026-05-30', status: 'Published', size: '24.5 MB' },
  { id: 'v1.8', name: '2025 永續報告 - 外部確信修正版', date: '2026-05-15', status: 'Archived', size: '24.1 MB' },
  { id: 'v1.0', name: '2025 永續報告 - 初稿', date: '2026-04-01', status: 'Archived', size: '18.2 MB' },
];

export default function PublishPage() {
  const [selectedVersion, setSelectedVersion] = useState(VERSIONS[0]);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🚀">
              旅程 V. 確信審計與發佈
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Rocket className="text-cyan-core" /> 報告發佈 Publish
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              將治理成果轉化為全球影響力。執行最終數位封印，匯出合規報告，並透過微網站進行數位揭露。
            </p>
          </div>
          <div className="flex gap-3">
            <UniversalButton variant="secondary" className="flex items-center gap-2">
               <History size={16} /> 版本歷史
            </UniversalButton>
            <UniversalButton variant="primary" className="flex items-center gap-2">
               <Download size={16} /> 下載全本 PDF
            </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Version List */}
          <div className="lg:col-span-1 space-y-6">
            <UniversalCard title="版本管理 Versions" variant="bordered">
               <div className="space-y-3">
                  {VERSIONS.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVersion(v)}
                      className={`w-full text-left p-4 rounded-xl border transition-all ${
                        selectedVersion.id === v.id ? 'bg-cyan-core/10 border-cyan-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'
                      }`}
                    >
                       <div className="flex justify-between items-start mb-1">
                          <span className={`text-[10px] font-black uppercase tracking-widest ${selectedVersion.id === v.id ? 'text-cyan-400' : 'text-white/30'}`}>{v.id}</span>
                          <UniversalBadge variant={v.status === 'Published' ? 'success' : 'secondary'} className="text-[8px]">{v.status}</UniversalBadge>
                       </div>
                       <p className="text-sm font-bold text-white/90 truncate">{v.name}</p>
                       <p className="text-[10px] text-white/40 mt-1">{v.date} • {v.size}</p>
                    </button>
                  ))}
               </div>
            </UniversalCard>

            <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-400">
                     <ShieldCheck size={24} />
                  </div>
                  <div>
                     <h4 className="font-bold text-sm">數位封印已就緒</h4>
                     <p className="text-[10px] text-white/40 uppercase tracking-widest">Signed by OmniCore v8.5</p>
                  </div>
               </div>
               <p className="text-xs text-white/60 leading-relaxed">
                 發佈後，報告將自動生成對應的 VerifyLink™。任何對報告內容的篡改都將導致驗證失效。
               </p>
               <UniversalButton variant="primary" className="w-full">
                  更新揭露微網站
               </UniversalButton>
            </div>
          </div>

          {/* Preview Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between px-2">
               <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30">報告預覽 Preview: {selectedVersion.id}</h3>
               <div className="flex gap-2">
                  <button className="p-2 text-white/40 hover:text-white transition-colors"><Layout size={16} /></button>
                  <button className="p-2 text-white/40 hover:text-white transition-colors"><Eye size={16} /></button>
               </div>
            </div>

            <div className="aspect-[1/1.414] bg-white rounded-lg shadow-2xl relative overflow-hidden flex flex-col items-center p-12 text-void-stark group">
               <div className="absolute inset-0 bg-void-stark/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                  <UniversalButton variant="primary" className="shadow-2xl">進入互動式預覽</UniversalButton>
               </div>

               {/* Mock A4 Content */}
               <div className="w-full h-full border border-void-stark/10 p-8 space-y-12">
                  <div className="flex justify-between items-start">
                     <div className="w-16 h-16 bg-cyan-core rounded-lg" />
                     <div className="text-right">
                        <h2 className="text-3xl font-black uppercase">2025</h2>
                        <p className="text-sm font-bold text-void-stark/40 uppercase tracking-widest">Sustainability Report</p>
                     </div>
                  </div>

                  <div className="space-y-4">
                     <h1 className="text-5xl font-black tracking-tighter leading-[0.9]">ESG GO <br/> SUSTAINABILITY</h1>
                     <div className="h-2 w-32 bg-cyan-core" />
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-12">
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-void-stark/40">GRI Index Coverage</p>
                        <p className="text-3xl font-black">94.5%</p>
                     </div>
                     <div className="space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-void-stark/40">ZKP Integrity</p>
                        <div className="flex items-center gap-2">
                           <CheckCircle2 size={24} className="text-emerald-500" />
                           <p className="text-3xl font-black">100%</p>
                        </div>
                     </div>
                  </div>

                  <div className="mt-auto pt-24 border-t border-void-stark/10 flex justify-between items-end">
                     <div>
                        <p className="text-xs font-bold">ESGGO 善向永續 系統</p>
                        <p className="text-[8px] text-void-stark/40 uppercase tracking-widest">Powered by OmniAgent Core</p>
                     </div>
                     <div className="p-2 border border-void-stark/20 rounded">
                        <Globe size={32} className="text-void-stark/10" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="flex gap-4">
               <UniversalCard variant="glass" className="flex-1 p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core">
                        <Share2 size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">社群揭露包</h4>
                        <p className="text-xs text-white/40">自動生成 LinkedIn / X 宣傳圖卡</p>
                     </div>
                  </div>
                  <ExternalLink size={16} className="text-white/20" />
               </UniversalCard>
               <UniversalCard variant="glass" className="flex-1 p-6 flex items-center justify-between hover:bg-white/5 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core">
                        <FileText size={20} />
                     </div>
                     <div>
                        <h4 className="font-bold text-sm">GRI 目錄表</h4>
                        <p className="text-xs text-white/40">自動生成的指標對照表</p>
                     </div>
                  </div>
                  <ExternalLink size={16} className="text-white/20" />
               </UniversalCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
