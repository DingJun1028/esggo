'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { ShieldCheck, Hash, Link as LinkIcon, FileCheck, Search, ArrowRight, Loader2, Sparkles, Fingerprint } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AuditVerifyPage() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(0);
  const [result, setResult] = useState<any>(null);

  const startVerify = () => {
    setIsVerifying(true);
    setResult(null);
    setVerifyStep(1);
    
    setTimeout(() => setVerifyStep(2), 1000);
    setTimeout(() => setVerifyStep(3), 2000);
    setTimeout(() => {
      setIsVerifying(false);
      setResult({
        status: 'success',
        hash: '8f3e...2a1b',
        timestamp: '2026-05-30 14:20:00',
        auditor: 'OmniAgent Core',
        integrity: '100%'
      });
    }, 3500);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="p-4 bg-cyan-core/10 rounded-[2rem] border border-cyan-500/30">
               <ShieldCheck size={64} className="text-cyan-core animate-pulse" />
            </div>
          </div>
          <div className="space-y-2">
            <UniversalBadge variant="success" icon="💎">VerifyLink™ Immutable Ledger</UniversalBadge>
            <h1 className="text-5xl font-black tracking-tighter">確信中心 Verify</h1>
            <p className="text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
              為審計師與第三方查核者提供「零信任」驗證入口。透過 ZKP 與 5T 協議，瞬間確認報告數據的真實性。
            </p>
          </div>
        </header>

        <UniversalCard variant="hologram" className="p-8 md:p-12 text-center space-y-8 bg-black/40 border-cyan-500/20">
           {!result && !isVerifying && (
             <div className="space-y-8">
                <div className="space-y-4">
                   <h3 className="text-xl font-bold">請輸入 VerifyLink™ 憑證編號或 Hash</h3>
                   <div className="relative max-w-md mx-auto">
                      <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
                      <input 
                        type="text" 
                        placeholder="例如: esggo-vlink-2026-x99..." 
                        className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl focus:border-cyan-500/50 outline-none transition-all text-sm font-mono"
                      />
                   </div>
                </div>
                <UniversalButton variant="primary" size="lg" onClick={startVerify} className="px-16 rounded-2xl shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                   執行密碼學確信 <ArrowRight className="ml-2" />
                </UniversalButton>
             </div>
           )}

           {isVerifying && (
             <div className="py-12 space-y-8">
                <div className="flex justify-center gap-4">
                   {[1, 2, 3].map((step) => (
                     <div key={step} className={`w-3 h-3 rounded-full transition-all duration-500 ${verifyStep >= step ? 'bg-cyan-core scale-125 shadow-[0_0_10px_#06b6d4]' : 'bg-white/10'}`} />
                   ))}
                </div>
                <div className="space-y-2">
                   <p className="text-sm font-black uppercase tracking-[0.3em] text-cyan-core animate-pulse">
                      {verifyStep === 1 ? '擷取數據金庫快照...' : 
                       verifyStep === 2 ? '執行同態加總驗算 (ZKP)...' : 
                       '核對數位封印簽章...'}
                   </p>
                   <p className="text-xs text-white/30 font-mono">NODE_RESONANCE_ID: 0x82...f9e2</p>
                </div>
                <div className="max-w-xs mx-auto">
                   <Loader2 className="mx-auto text-cyan-core animate-spin" size={48} />
                </div>
             </div>
           )}

           {result && (
             <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="space-y-8 py-4">
                <div className="flex flex-col items-center">
                   <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/40 rounded-full flex items-center justify-center text-emerald-400 mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
                      <FileCheck size={40} />
                   </div>
                   <h3 className="text-3xl font-black text-emerald-400 uppercase tracking-tight">確信成功 Verified</h3>
                   <p className="text-sm text-white/40 mt-1">該報告數據與原始封印完全吻合</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-left">
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">Hash Lock</p>
                      <p className="text-xs font-mono text-cyan-core truncate">{result.hash}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">確信時間</p>
                      <p className="text-xs font-mono text-white/70">{result.timestamp}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">負責代理人</p>
                      <p className="text-xs font-bold text-white/70">{result.auditor}</p>
                   </div>
                   <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                      <p className="text-[9px] font-black uppercase text-white/30 tracking-widest">數據完整性</p>
                      <p className="text-xs font-bold text-emerald-400">{result.integrity}</p>
                   </div>
                </div>

                <div className="flex gap-4">
                   <UniversalButton variant="secondary" className="flex-1 rounded-xl py-6" onClick={() => setResult(null)}>
                      驗證另一份報告
                   </UniversalButton>
                   <UniversalButton variant="primary" className="flex-1 rounded-xl py-6">
                      下載確信證明 (PDF)
                   </UniversalButton>
                </div>
             </motion.div>
           )}
        </UniversalCard>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <UniversalCard title="技術背景" variant="bordered">
              <div className="flex items-start gap-4">
                 <Fingerprint className="text-cyan-core shrink-0" size={24} />
                 <p className="text-sm text-white/50 leading-relaxed">
                   VerifyLink™ 採用 **Pedersen Commitment** 同態加密技術，審計師只需驗證最終總和，無需查看每一筆敏感的原始數據細節，即可確認數據的合規性與準確性。
                 </p>
              </div>
           </UniversalCard>
           <UniversalCard title="系統狀態" variant="bordered">
              <div className="flex items-start gap-4">
                 <LinkIcon className="text-cyan-core shrink-0" size={24} />
                 <p className="text-sm text-white/50 leading-relaxed">
                   目前已與 **Supabase Immutable碑** 及 **NCBDB 全域資料庫** 雙向同步。所有驗證行為皆會寫入「審計日誌」以供二次稽核。
                 </p>
              </div>
           </UniversalCard>
        </div>
      </div>
    </div>
  );
}
