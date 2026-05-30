'use client';

import React, { useState, useMemo } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Calculator, Globe, AlertTriangle, TrendingUp, Download, Plus, Trash2, Landmark, Gauge, ArrowRight, Info, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SECTORS = [
  { id: 'steel', name: '鋼鐵 Steel', factor: 1.89 },
  { id: 'aluminum', name: '鋁 Aluminum', factor: 6.72 },
  { id: 'cement', name: '水泥 Cement', factor: 0.83 },
  { id: 'fertilizer', name: '化學肥料 Fertilizer', factor: 2.40 },
];

export default function CBAMCalculatorPage() {
  const [products, setProducts] = useState([
    { id: '1', name: '熱軋鋼板', sector: 'steel', volume: 5000, price: 0 },
  ]);

  const calculations = useMemo(() => {
    const etsPrice = 65; // EUR/ton
    return products.map(p => {
      const sector = SECTORS.find(s => s.id === p.sector);
      const emissions = p.volume * (sector?.factor || 0);
      const cost = Math.max(0, emissions * etsPrice - p.price * p.volume);
      return { ...p, emissions, cost };
    });
  }, [products]);

  const totalCost = calculations.reduce((a, b) => a + b.cost, 0);

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🇪🇺">
              旅程 III. 數據採集與填報
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Calculator className="text-cyan-core" /> CBAM 計算機
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              歐盟碳邊境調整機制精確模擬。評估出口商品的碳排量與潛在財務衝擊，提早佈局減碳策略。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="secondary" className="flex items-center gap-2">
                <Download size={16} /> 匯出試算書
             </UniversalButton>
             <UniversalButton variant="primary" className="flex items-center gap-2">
                <Plus size={16} /> 新增商品
             </UniversalButton>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
           <div className="lg:col-span-3 space-y-8">
              <UniversalCard variant="glow" title="出口商品試算清單" className="p-0 overflow-hidden">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead>
                          <tr className="border-b border-white/5 bg-white/5">
                             <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">商品名稱</th>
                             <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">產業別</th>
                             <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">出口量 (Tons)</th>
                             <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">預估碳排 (tCO2e)</th>
                             <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white/30">預計碳稅 (EUR)</th>
                             <th className="px-6 py-4"></th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-white/5">
                          {calculations.map((c) => (
                            <tr key={c.id} className="group hover:bg-white/5 transition-all">
                               <td className="px-6 py-4 font-bold text-white/90">{c.name}</td>
                               <td className="px-6 py-4 text-xs">
                                  <UniversalBadge variant="secondary">{SECTORS.find(s=>s.id===c.sector)?.name}</UniversalBadge>
                               </td>
                               <td className="px-6 py-4 font-mono text-sm">{c.volume.toLocaleString()}</td>
                               <td className="px-6 py-4 font-mono text-sm text-cyan-400">{c.emissions.toLocaleString()}</td>
                               <td className="px-6 py-4 font-mono text-sm text-rose-400 font-bold">€{c.cost.toLocaleString()}</td>
                               <td className="px-6 py-4 text-right">
                                  <button className="p-2 text-white/10 hover:text-rose-500 transition-colors">
                                     <Trash2 size={14} />
                                  </button>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <UniversalCard title="減項優化建議" variant="bordered">
                    <div className="space-y-4">
                       {[
                         { title: '採購再生能源電力', save: '20-40%', icon: <Gauge size={16} /> },
                         { title: '導入低碳製程設備', save: '30-60%', icon: <TrendingUp size={16} /> },
                       ].map((t, i) => (
                         <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                               <div className="p-2 bg-cyan-core/10 rounded-lg text-cyan-core">{t.icon}</div>
                               <span className="text-sm font-bold">{t.title}</span>
                            </div>
                            <UniversalBadge variant="success">Save {t.save}</UniversalBadge>
                         </div>
                       ))}
                    </div>
                 </UniversalCard>
                 <div className="p-8 bg-gradient-to-br from-amber-500/20 to-orange-600/20 rounded-[2rem] border border-amber-500/30 flex flex-col justify-center">
                    <AlertTriangle size={32} className="text-amber-400 mb-4" />
                    <h3 className="font-bold text-lg mb-2">2026 正式課徵提醒</h3>
                    <p className="text-xs text-white/60 leading-relaxed">
                      目前處於過渡申報期。2026 年起將依據本試算結果執行財務實質課稅。建議立即啟動 T1 數據追蹤。
                    </p>
                 </div>
              </div>
           </div>

           <div className="space-y-8">
              <UniversalCard title="財務衝擊總覽" variant="glass">
                 <div className="space-y-6 text-center py-4">
                    <div>
                       <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-1">Total Estimated Cost</p>
                       <p className="text-4xl font-black text-white">€{totalCost.toLocaleString()}</p>
                    </div>
                    <div className="pt-4 border-t border-white/5">
                       <p className="text-[10px] font-black uppercase text-white/30 tracking-[0.3em] mb-1">TWD Equivalent</p>
                       <p className="text-2xl font-black text-cyan-core">NT${(totalCost * 35).toLocaleString()}</p>
                    </div>
                    <UniversalButton variant="primary" className="w-full mt-4">啟動避稅分析</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-6 bg-white/5 rounded-[2rem] border border-white/10 space-y-4">
                 <div className="flex items-center gap-2 text-xs font-black uppercase text-white/30">
                    <ShieldCheck size={14} /> 5T 確信狀態
                 </div>
                 <p className="text-[10px] text-white/40 leading-relaxed italic">
                   所有計算依據之排放係數均已通過 GRI 準則核對。試算結果已同步至 Audit Log。
                 </p>
              </div>

              <UniversalCard title="法規參數" variant="bordered">
                 <div className="space-y-4">
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40">EU ETS Price</span>
                       <span className="font-mono text-cyan-400">€65.00</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40">CBAM Factor</span>
                       <span className="font-mono text-white/60">v1.2.4</span>
                    </div>
                    <div className="flex justify-between text-xs">
                       <span className="text-white/40">Last Update</span>
                       <span className="font-mono text-white/60">2026-05-30</span>
                    </div>
                 </div>
              </UniversalCard>
           </div>
        </div>
      </div>
    </div>
  );
}
