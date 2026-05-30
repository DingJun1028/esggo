'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { UniversalProgress } from '@/components/ui/universal/UniversalProgress';
import { Wallet, Landmark, TrendingUp, DollarSign, Calculator, ArrowRight, ShieldCheck, Zap, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FinancePage() {
  const [loanAmount, setLoanAmount] = useState(50000000);
  const [esgScore, setEsgScore] = useState(72);

  const calculateInterestRate = () => {
    // Basic simulation: Higher ESG score = lower interest rate
    const baseRate = 2.5;
    const reduction = (esgScore - 40) * 0.02; // Max reduction around 1.2%
    return Math.max(1.1, baseRate - reduction).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="💰">
              旅程 VI. 知識沉澱與加值
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Wallet className="text-cyan-core" /> 永續財務 Finance
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              將 ESG 表現轉化為融資紅利。與銀行合作夥伴連動，提供綠色貸款試算與永續績效掛鉤 (SLL) 融資評估。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Calculator size={16} /> 融資媒合
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Simulator */}
           <div className="lg:col-span-2 space-y-8">
              <UniversalCard title="綠色融資試算器 Simulator" variant="glow">
                 <div className="space-y-10 py-6 px-4">
                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-white/60 uppercase tracking-widest">預計融資金額 (TWD)</label>
                          <span className="text-2xl font-black text-cyan-core">${(loanAmount / 1000000).toFixed(1)}M</span>
                       </div>
                       <input 
                         type="range" 
                         min="10000000" 
                         max="500000000" 
                         step="1000000" 
                         value={loanAmount} 
                         onChange={(e) => setLoanAmount(parseInt(e.target.value))}
                         className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyan-core"
                       />
                    </div>

                    <div className="space-y-6">
                       <div className="flex justify-between items-center">
                          <label className="text-sm font-bold text-white/60 uppercase tracking-widest">ESG 預估分數</label>
                          <span className="text-2xl font-black text-emerald-400">{esgScore} / 100</span>
                       </div>
                       <input 
                         type="range" 
                         min="0" 
                         max="100" 
                         step="1" 
                         value={esgScore} 
                         onChange={(e) => setEsgScore(parseInt(e.target.value))}
                         className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-emerald-400"
                       />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-white/5">
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">預估年利率 (Interest Rate)</p>
                          <p className="text-4xl font-black text-white">{calculateInterestRate()}%</p>
                          <p className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                             <TrendingUp size={14} /> 低於市場平均 0.45%
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">年節省利息支出</p>
                          <p className="text-4xl font-black text-cyan-core">${((loanAmount * (2.5 - parseFloat(calculateInterestRate())) / 100) / 10000).toFixed(0)} 萬</p>
                          <p className="text-xs text-white/40 italic">計算基礎: 市場基準利率 2.5%</p>
                       </div>
                    </div>
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <UniversalCard title="符合之綠色金融產品" variant="bordered">
                    <div className="space-y-4">
                       {[
                         { bank: '玉山銀行', name: '永續連結貸款 (SLL)', rate: '1.58%~' },
                         { bank: '第一銀行', name: '再生能源專案融資', rate: '1.42%~' },
                       ].map((p, i) => (
                         <div key={i} className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5 group hover:border-cyan-500/30 transition-all">
                            <div>
                               <p className="text-[10px] font-black text-white/30">{p.bank}</p>
                               <p className="text-sm font-bold text-white/90">{p.name}</p>
                            </div>
                            <span className="text-cyan-core font-mono font-bold">{p.rate}</span>
                         </div>
                       ))}
                    </div>
                 </UniversalCard>
                 <UniversalCard title="5T 確信溢價分析" variant="bordered">
                    <p className="text-sm text-white/60 leading-relaxed mb-4">
                       具備 5T 數位封印的數據可降低銀行風險評估成本，預計可額外爭取 2-3 bps 的利率減讓。
                    </p>
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                       <ShieldCheck size={16} /> 數據已封印，具備融資資質
                    </div>
                 </UniversalCard>
              </div>
           </div>

           {/* Sidebar Info */}
           <div className="space-y-8">
              <UniversalCard title="財務儀表板 Financials" variant="glass">
                 <div className="space-y-6">
                    <div className="flex justify-between items-end border-b border-white/5 pb-4">
                       <div>
                          <p className="text-[10px] font-black uppercase text-white/30">Total Savings</p>
                          <h4 className="text-xl font-black text-white">$120,000</h4>
                       </div>
                       <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg"><TrendingUp size={16} /></div>
                    </div>
                    <div className="space-y-2">
                       <p className="text-xs font-bold text-white/60">碳權資產預估 (TWD)</p>
                       <p className="text-lg font-black text-cyan-core">$2,450,000</p>
                       <p className="text-[10px] text-white/30 italic">以目前市價 800 TWD/ton 計算</p>
                    </div>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-gradient-to-br from-cyan-900/40 to-blue-900/40 rounded-[2.5rem] border border-cyan-500/20">
                 <Landmark size={32} className="text-cyan-core mb-4" />
                 <h3 className="font-bold text-lg mb-2">啟動綠色存款</h3>
                 <p className="text-xs text-white/60 mb-6 leading-relaxed">將企業閒置資金投入指定的環境改善專案，獲取社會影響力證明與稅務減免。</p>
                 <UniversalButton variant="primary" className="w-full">聯絡金融顧問</UniversalButton>
              </div>

              <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 flex items-center gap-4">
                 <Info size={24} className="text-white/20 shrink-0" />
                 <p className="text-[10px] text-white/40 leading-tight">
                    試算結果僅供參考。最終利率與額度以合作銀行核貸結果為準。所有數據傳輸皆受 5T 協議保護。
                 </p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
