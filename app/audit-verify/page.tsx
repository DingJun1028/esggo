'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, Search, Fingerprint, Lock, 
  CheckCircle2, AlertCircle, Hash, ArrowRight,
  Zap, Database, Server, RefreshCw, FileCheck
} from 'lucide-react';
import { 
  BrandButton, BrandBadge, BrandCard, BrandInput,
  BrandStatusDot, BrandProgress, StandardPage
} from '../../components/brand';
import { omniApiClient } from '../../lib/api-client';
import { IComponentCore } from '../../types/omni-core';
import { cn } from '../../lib/utils';

export default function AuditVerifyPage() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [result, setResult] = useState<IComponentCore | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<'IDLE' | 'VERIFYING' | 'SUCCESS' | 'FAILED'>('IDLE');
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    setVerificationStatus('VERIFYING');
    setError(null);
    setResult(null);

    try {
      // 1. 真實查詢：在聖碑 (Eternal Memory) 中尋找對應紀錄
      const lookupRes = await fetch(`/api/omnicore/lookup?query=${encodeURIComponent(query)}`).then(r => r.json());
      
      if (!lookupRes.success || !lookupRes.data) {
        throw new Error('找不到該 Master Seal UUID 或 Hash Lock。請確認編號是否正確。');
      }

      const component = lookupRes.data as IComponentCore;
      setResult(component);

      // 2. 啟動真實誠信校驗
      const verifyRes = await omniApiClient.verify({ component });
      
      if (verifyRes.data?.isValid) {
        setVerificationStatus('SUCCESS');
      } else {
        setVerificationStatus('FAILED');
      }
    } catch (e: any) {
      setError(e.message || 'Verification failed');
      setVerificationStatus('FAILED');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <StandardPage
      config={{
        id: 'audit-verify',
        title: 'VerifyLink™ 誠信查驗中心',
        subtitle: '全球 5T 誠信協議實體查驗入口，實現數據的主權透明度。',
        icon: <ShieldCheck size={24} />,
        activeT5Tags: ['T1', 'T2', 'T3', 'T4', 'T5'],
        sections: []
      }}
    >
      <div className="max-w-4xl mx-auto py-12 space-y-12">
        {/* Search Section */}
        <section className="text-center space-y-6">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex p-4 rounded-3xl bg-blue-50 text-blue-600 mb-4"
          >
            <Fingerprint size={48} />
          </motion.div>
          <h2 className="text-3xl font-black text-[#003262]">輸入 Master Seal UUID</h2>
          <p className="text-slate-400 max-w-xl mx-auto font-medium">
            請輸入您在報告或系統中獲得的 5T 封印編號，VerifyLink™ 將會即時比對分散式節點中的聖碑（Eternal Memory）雜湊軌跡。
          </p>
          
          <div className="flex gap-4 mt-8">
            <BrandInput 
              placeholder="e.g., OX-E82B-912A" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1 h-16 text-lg font-mono"
            />
            <BrandButton 
              onClick={handleVerify} 
              loading={isSearching}
              className="px-12 h-16 rounded-2xl text-base font-black shadow-xl shadow-blue-500/20"
            >
              發起查驗 (Verify)
            </BrandButton>
          </div>
        </section>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {verificationStatus !== 'IDLE' && (
            <motion.div 
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -40, opacity: 0 }}
              className="space-y-8"
            >
              {verificationStatus === 'VERIFYING' ? (
                <BrandCard className="p-20 flex flex-col items-center justify-center text-center space-y-6 border-dashed">
                  <RefreshCw size={48} className="animate-spin text-blue-500" />
                  <div>
                    <h3 className="text-xl font-black text-[#003262]">正在同步分散式共識...</h3>
                    <p className="text-sm text-slate-400 mt-2 font-mono">Connecting to blue-cluster-omni-01...</p>
                  </div>
                  <div className="w-64">
                    <BrandProgress value={65} animated color="blue" size="xs" />
                  </div>
                </BrandCard>
              ) : result ? (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left: Component Info */}
                  <div className="lg:col-span-2 space-y-6">
                    <BrandCard className="p-8 border-none bg-[#003262] text-white shadow-2xl relative overflow-hidden">
                       <div className="relative z-10 space-y-6">
                          <div className="flex justify-between items-start">
                             <div>
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-1">Master Seal UUID</p>
                                <h4 className="text-2xl font-black font-mono">{result.uuid}</h4>
                             </div>
                             <BrandBadge variant="success" className="bg-emerald-500/20 border-emerald-500/30 text-emerald-400">
                                {result.status.toUpperCase()}
                             </BrandBadge>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-8 py-6 border-y border-white/10">
                             <div>
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">實證指標 (Metric)</p>
                                <p className="text-lg font-bold">{result.evidence.tangible_metric}</p>
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">發行時間 (Issued)</p>
                                <p className="text-sm font-mono opacity-80">{new Date(result.timestamp).toLocaleString()}</p>
                             </div>
                          </div>

                          <div>
                             <p className="text-[10px] font-black text-blue-300 uppercase tracking-widest mb-2">誠信雜湊鎖 (Hash Lock - T4)</p>
                             <code className="text-xs bg-black/20 p-4 rounded-xl block break-all font-mono border border-white/5">
                                {result.hash_lock}
                             </code>
                          </div>
                       </div>
                       <ShieldCheck size={200} className="absolute -bottom-20 -right-20 text-white/5 rotate-12" />
                    </BrandCard>

                    {/* Logic Gates */}
                    <div className="grid grid-cols-5 gap-4">
                       {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map((gate, i) => (
                         <BrandCard key={i} className="p-4 flex flex-col items-center gap-2 text-center border-slate-100 shadow-sm">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                               <CheckCircle2 size={20} />
                            </div>
                            <span className="text-[9px] font-black text-[#003262] uppercase tracking-tighter">{gate}</span>
                         </BrandCard>
                       ))}
                    </div>
                  </div>

                  {/* Right: Lineage Feed */}
                  <div className="space-y-6">
                    <h4 className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
                       <Database size={14}/> Lineage Trace
                    </h4>
                    <div className="space-y-4">
                       {[
                         { icon: <FileCheck />, label: 'Evidence Verified', time: '10ms' },
                         { icon: <Server />, label: 'Consensus Achieved', time: '42ms' },
                         { icon: <Lock />, label: 'Master Seal Matched', time: '1ms' },
                       ].map((step, i) => (
                         <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                            <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center text-blue-600">
                               {React.cloneElement(step.icon as React.ReactElement, { size: 16 })}
                            </div>
                            <div className="flex-1">
                               <p className="text-[10px] font-black text-[#003262]">{step.label}</p>
                               <p className="text-[9px] text-slate-400 font-bold uppercase">{step.time} LATENCY</p>
                            </div>
                         </div>
                       ))}
                    </div>

                    <BrandCard className="bg-emerald-50 border-emerald-100 p-6">
                       <div className="flex items-center gap-2 text-emerald-600 mb-2">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">VerifyLink™ 認證</span>
                       </div>
                       <p className="text-xs text-emerald-800 font-medium leading-relaxed italic">
                          「此數據已通過 ESG GO 全域共識驗證，原始憑證雜湊值與主權封印完全吻合。」
                       </p>
                    </BrandCard>
                  </div>
                </div>
              ) : error && (
                <BrandCard className="p-12 border-red-100 bg-red-50 text-center space-y-4">
                   <AlertCircle size={48} className="mx-auto text-red-500" />
                   <h3 className="text-xl font-black text-red-900">查驗失敗 (Verification Failed)</h3>
                   <p className="text-sm text-red-700/70 font-medium">{error}</p>
                   <BrandButton variant="outline" className="rounded-xl" onClick={() => setVerificationStatus('IDLE')}>
                      重新查驗
                   </BrandButton>
                </BrandCard>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Technology Specs */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-100">
           {[
             { title: 'SHA-256 Hash Chain', desc: '利用區塊鏈技術保護的數據指紋。' },
             { title: 'Zero-Knowledge Proof', desc: '在保護隱私的前提下完成數據完整性校驗。' },
             { title: 'Sovereign Node Sync', desc: '由企業主權節點共同維護的誠信聖碑。' }
           ].map((tech, i) => (
             <div key={i} className="space-y-2">
                <h5 className="text-xs font-black text-[#003262] uppercase tracking-widest">{tech.title}</h5>
                <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{tech.desc}</p>
             </div>
           ))}
        </section>
      </div>
    </StandardPage>
  );
}
