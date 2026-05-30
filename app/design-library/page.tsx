'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { CheckCircle2, Palette, Layers, Box, Grid, Type, Droplets, Image, Zap, Copy, Check, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

const TOKENS = [
  { name: 'cyan-core', hex: '#06b6d4', type: 'Primary' },
  { name: 'emerald-soul', hex: '#10b981', type: 'Success' },
  { name: 'void-stark', hex: '#020617', type: 'Background' },
  { name: 'amber-essence', hex: '#f59e0b', type: 'Warning' },
];

export default function DesignLibraryPage() {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🎨">
              IX. 品牌資源
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Palette className="text-cyan-core" /> 設計圖書館 Design Library
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              「液態玻璃」設計系統指南。提供原子級 UI 組件、動態光影標準與全域色彩權仗。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="secondary" className="flex items-center gap-2">
                <Box size={16} /> 下載 .Pen 原型
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           {/* Color Tokens */}
           <div className="lg:col-span-1 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 px-2">色彩權仗 Tokens</h3>
              <div className="space-y-3">
                 {TOKENS.map((t) => (
                   <div key={t.name} className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-4 group">
                      <div className="w-12 h-12 rounded-xl shadow-lg border border-white/10" style={{ backgroundColor: t.hex }} />
                      <div className="flex-1">
                         <p className="text-[10px] font-black uppercase text-white/30">{t.type}</p>
                         <p className="text-xs font-bold text-white/90">{t.name}</p>
                         <p className="text-[10px] font-mono text-cyan-core/60 mt-1 uppercase">{t.hex}</p>
                      </div>
                      <button onClick={() => copyToClipboard(t.hex)} className="p-2 text-white/20 hover:text-white transition-colors">
                         {copied === t.hex ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                   </div>
                 ))}
              </div>
           </div>

           {/* Component Showcase */}
           <div className="lg:col-span-3 space-y-12">
              <section className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Layers size={18} className="text-cyan-core" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">原子級組件 Atoms</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <UniversalCard title="Buttons" variant="bordered" className="p-8">
                       <div className="flex flex-wrap gap-4">
                          <UniversalButton variant="primary">Primary Action</UniversalButton>
                          <UniversalButton variant="secondary">Secondary</UniversalButton>
                          <UniversalButton variant="outline">Destructive</UniversalButton>
                       </div>
                    </UniversalCard>
                    <UniversalCard title="Badges" variant="bordered" className="p-8">
                       <div className="flex flex-wrap gap-3">
                          <UniversalBadge variant="success">Verified</UniversalBadge>
                          <UniversalBadge variant="warning">Pending</UniversalBadge>
                          <UniversalBadge variant="error">Rejected</UniversalBadge>
                          <UniversalBadge variant="info">Context</UniversalBadge>
                       </div>
                    </UniversalCard>
                 </div>
              </section>

              <section className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Box size={18} className="text-cyan-core" />
                    <h3 className="text-sm font-bold uppercase tracking-widest">液態面板 Glass Panels</h3>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UniversalCard title="Glow Variant" variant="glow" className="h-32 flex items-center justify-center text-xs text-white/40">
                       Cyber Glow Effect
                    </UniversalCard>
                    <UniversalCard title="Glass Variant" variant="glass" className="h-32 flex items-center justify-center text-xs text-white/40">
                       Backdrop Blur 12px
                    </UniversalCard>
                    <UniversalCard title="Hologram Variant" variant="glow" className="h-32 flex items-center justify-center text-xs text-white/40">
                       Cyber Grid Overlay
                    </UniversalCard>
                 </div>
              </section>

              <div className="p-10 bg-gradient-to-r from-cyan-900/40 via-indigo-900/40 to-emerald-900/40 rounded-[3rem] border border-white/10 text-center space-y-6">
                 <div className="w-20 h-20 bg-white/10 rounded-[2rem] flex items-center justify-center mx-auto border border-white/10">
                    <Zap size={40} className="text-cyan-400 animate-pulse" />
                 </div>
                 <h2 className="text-2xl font-black italic uppercase tracking-tighter">Liquid Glass v2.0</h2>
                 <p className="text-sm text-white/60 max-w-xl mx-auto leading-relaxed">
                   這不僅是設計風格，更是一種「透明治理」的視覺隱喻。透過物理性的光影堆疊，讓原本生硬的 ESG 數據轉化為可感知的數位生命力。
                 </p>
                 <div className="flex justify-center gap-4 pt-4">
                    <UniversalButton variant="primary" className="rounded-2xl px-10">閱讀設計白皮書</UniversalButton>
                    <UniversalButton variant="secondary" className="rounded-2xl px-10 flex items-center gap-2">
                       Figma 連結 <ExternalLink size={14} />
                    </UniversalButton>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
