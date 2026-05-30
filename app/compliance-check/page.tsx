'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalProgress } from '@/components/ui/universal/UniversalProgress';
import { ShieldCheck, Search, AlertTriangle, CheckCircle2, XCircle, Info, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CHECKS = [
  { id: 1, name: 'GRI 2-1 組織詳細資料', status: 'pass', msg: '已偵測到企業基本資料與股權結構。' },
  { id: 2, name: 'GRI 305-1 直接排放 (Scope 1)', status: 'warning', msg: '數據已填寫，但缺乏第三方單據佐證。' },
  { id: 3, name: 'GRI 401-1 員工聘僱與離職率', status: 'fail', msg: '數據缺漏：未區分性別與年齡層統計。' },
  { id: 4, name: 'ISSB S2 氣候物理風險分析', status: 'pass', msg: '已包含洪水與乾旱情境模擬數據。' },
  { id: 5, name: '5T 數據一致性校驗', status: 'pass', msg: '所有引用數據與 Evidence Vault Hash 吻合。' },
];

export default function ComplianceCheckPage() {
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const startScan = () => {
    setIsScanning(true);
    setShowResults(false);
    setScanProgress(0);
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setShowResults(true);
          return 100;
        }
        return prev + 5;
      });
    }, 100);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="✨">
              旅程 IV. AI 賦能與撰寫
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <ShieldCheck className="text-cyan-core" /> 合規檢查 Compliance Check
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              發佈前的終極防線。AI 自動對標國際準則，偵測數據缺漏、語意幻覺與 5T 誠信偏差。
            </p>
          </div>
          <UniversalButton 
            variant="primary" 
            size="lg" 
            onClick={startScan} 
            disabled={isScanning}
            className="rounded-2xl px-12 relative overflow-hidden group"
          >
            {isScanning ? (
              <span className="flex items-center gap-2"><Loader2 size={18} className="animate-spin" /> 掃描中...</span>
            ) : (
              <span className="flex items-center gap-2"><Search size={18} /> 開始全盤檢查</span>
            )}
            {!isScanning && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
            )}
          </UniversalButton>
        </header>

        {isScanning && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
             <div className="flex justify-between text-xs font-black uppercase tracking-widest text-cyan-core">
                <span>正在分析報告草稿與 GRI 知識庫...</span>
                <span>{scanProgress}%</span>
             </div>
             <UniversalProgress value={scanProgress} size="md" />
          </motion.div>
        )}

        <AnimatePresence>
          {showResults && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <UniversalCard variant="glow" className="flex flex-col items-center justify-center py-8">
                    <CheckCircle2 size={32} className="text-emerald-400 mb-2" />
                    <p className="text-2xl font-black">12</p>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Pass</p>
                 </UniversalCard>
                 <UniversalCard variant="glow" className="flex flex-col items-center justify-center py-8">
                    <AlertTriangle size={32} className="text-amber-400 mb-2" />
                    <p className="text-2xl font-black">3</p>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Warning</p>
                 </UniversalCard>
                 <UniversalCard variant="glow" className="flex flex-col items-center justify-center py-8 border-rose-500/30">
                    <XCircle size={32} className="text-rose-400 mb-2" />
                    <p className="text-2xl font-black">1</p>
                    <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">Critical Fail</p>
                 </UniversalCard>
              </div>

              <UniversalCard title="詳細檢查報告" variant="bordered">
                 <div className="divide-y divide-white/5">
                    {CHECKS.map((check) => (
                      <div key={check.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group">
                         <div className="flex items-start gap-4">
                            <div className="mt-1">
                               {check.status === 'pass' ? <CheckCircle2 size={18} className="text-emerald-400" /> :
                                check.status === 'warning' ? <AlertTriangle size={18} className="text-amber-400" /> :
                                <XCircle size={18} className="text-rose-400" />}
                            </div>
                            <div>
                               <h4 className="text-sm font-bold text-white/90">{check.name}</h4>
                               <p className="text-xs text-white/50">{check.msg}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-3">
                            {check.status !== 'pass' && (
                              <UniversalButton variant="secondary" size="sm" className="text-[10px] py-1 h-auto flex items-center gap-2">
                                <Sparkles size={12} /> AI 修正建議
                              </UniversalButton>
                            )}
                            <button className="p-2 text-white/20 hover:text-white transition-colors"><Info size={16} /></button>
                         </div>
                      </div>
                    ))}
                 </div>
              </UniversalCard>

              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 flex flex-col md:flex-row items-center gap-8">
                 <div className="w-20 h-20 rounded-full bg-cyan-core/10 flex items-center justify-center shrink-0 border border-cyan-500/20">
                    <ShieldCheck size={40} className="text-cyan-core" />
                 </div>
                 <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl font-bold mb-2">準備好進入確信流程嗎？</h3>
                    <p className="text-sm text-white/60">修正上述 Fail 項目後，系統將允許將報告提交至「確信審計」旅程進行 ZKP 封印。</p>
                 </div>
                 <UniversalButton variant="primary" size="lg" className="rounded-2xl px-10">
                    前往確信中心 <ArrowRight size={18} className="ml-2" />
                 </UniversalButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isScanning && !showResults && (
          <div className="py-20 text-center space-y-6">
             <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto border border-white/10">
                <Search size={40} className="text-white/20" />
             </div>
             <div className="space-y-2">
                <h3 className="text-xl font-bold text-white/40">尚未啟動掃描</h3>
                <p className="text-sm text-white/20">點擊上方按鈕，對目前所有的 ESG 數據與草稿進行全盤合規性檢查。</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
}
