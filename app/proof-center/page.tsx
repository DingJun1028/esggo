'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { BadgeCheck, ShieldCheck, Hash, Lock, Globe, Share2, Download, ExternalLink, Zap, CheckCircle2, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const PROOFS = [
  { id: 'PF-2026-001', type: 'Emissions Seal', scope: 'Scope 1 & 2', status: 'Active', hash: '0x8f2e...c4d1', date: '2026-05-12' },
  { id: 'PF-2026-002', type: 'HR Integrity', scope: 'DEI Metrics', status: 'Active', hash: '0x7a1b...e9f2', date: '2026-05-15' },
  { id: 'PF-2026-003', type: 'Supply Chain Proof', scope: 'Tier 1 Suppliers', status: 'Pending', hash: 'Pending', date: '2026-05-30' },
];

export default function ProofCenterPage() {
  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🛡️">
              旅程 V. 確信審計與發佈
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <BadgeCheck className="text-cyan-core" /> 誠信證明 Proof Center
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              企業誠信的數位獎章。管理所有已封印的 5T 證明，並生成可供外部嵌入的「誠信標章」與驗證連結。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <QrCode size={16} /> 生成驗證碼
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Active Proofs */}
           <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {PROOFS.map((p) => (
                   <motion.div key={p.id} whileHover={{ scale: 1.02 }}>
                      <UniversalCard variant="glow" className="p-6 space-y-6 border-white/10 hover:border-cyan-500/40 transition-all">
                         <div className="flex justify-between items-start">
                            <div className="p-3 bg-cyan-core/10 rounded-xl text-cyan-core">
                               <ShieldCheck size={24} />
                            </div>
                            <UniversalBadge variant={p.status === 'Active' ? 'success' : 'warning'}>{p.status}</UniversalBadge>
                         </div>
                         <div>
                            <h4 className="font-bold text-lg">{p.type}</h4>
                            <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{p.scope}</p>
                         </div>
                         <div className="p-3 bg-black/40 rounded-xl border border-white/5 font-mono text-[10px] text-cyan-core/70 break-all">
                            Hash: {p.hash}
                         </div>
                         <div className="flex items-center justify-between pt-2">
                            <span className="text-[10px] text-white/20 font-bold uppercase">{p.date}</span>
                            <div className="flex gap-2">
                               <button className="p-2 text-white/20 hover:text-white transition-colors"><Download size={14} /></button>
                               <button className="p-2 text-white/20 hover:text-white transition-colors"><Share2 size={14} /></button>
                            </div>
                         </div>
                      </UniversalCard>
                   </motion.div>
                 ))}
              </div>
           </div>

           {/* Badge Preview */}
           <div className="space-y-8">
              <UniversalCard title="數位誠信標章 Preview" variant="glow" className="flex flex-col items-center py-10 text-center">
                 <div className="w-32 h-32 relative mb-6">
                    <div className="absolute inset-0 bg-cyan-core/20 rounded-full blur-2xl animate-pulse" />
                    <div className="relative w-full h-full rounded-full border-4 border-cyan-500/30 flex items-center justify-center bg-black/60 shadow-[0_0_30px_rgba(6,182,212,0.2)]">
                       <BadgeCheck size={64} className="text-cyan-core" />
                    </div>
                 </div>
                 <h3 className="text-xl font-black tracking-tighter uppercase italic">Verified by ESGGO</h3>
                 <p className="text-[10px] font-black text-white/30 mt-2 tracking-[0.2em]">100% 5T COMPLIANT</p>
                 <div className="mt-8 w-full space-y-3 px-4">
                    <UniversalButton variant="primary" className="w-full text-xs">嵌入此標章到官網</UniversalButton>
                    <p className="text-[9px] text-white/20 italic">支援 iframe 與動態 React 組件嵌入</p>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10">
                 <div className="flex items-center gap-3 mb-4">
                    <Globe size={20} className="text-cyan-core" />
                    <h4 className="font-bold text-sm">公開驗證網址</h4>
                 </div>
                 <code className="block p-3 bg-black/40 rounded-xl text-[10px] font-mono text-white/40 mb-4 truncate">
                    https://v.esggo.com/proof/0x8f2e...
                 </code>
                 <UniversalButton variant="secondary" className="w-full text-[10px] h-9 py-0">複製連結</UniversalButton>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
