'use client';
import { motion } from 'framer-motion';
import { 
  ShieldAlert, 
  TrendingUp, 
  Zap, 
  Wind, 
  Activity,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  PlayCircle
} from 'lucide-react';
import { mockScenarios, getRiskLevel } from '@/lib/risk-data';

export default function RiskResiliencePage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-2xl shadow-lg shadow-rose-600/20">
              <ShieldAlert size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">風險韌性中心 Resilience Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 201-2, TCFD | 氣候與轉型風險情境模擬</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-rose-600 transition-all shadow-xl shadow-slate-900/10">
          <PlayCircle size={16} /> 啟動 AI 壓力測試
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
           <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
             <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                   <Activity size={18} className="text-rose-500" /> 風險矩陣與情境清單
                </h3>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">3 Active Scenarios</span>
             </div>
             <div className="divide-y divide-slate-50">
                {mockScenarios.map((s) => {
                  const level = getRiskLevel(s.impact);
                  return (
                    <div key={s.id} className="p-8 hover:bg-slate-50/80 transition-all group cursor-pointer">
                       <div className="flex justify-between items-start mb-4">
                          <div className="space-y-1">
                             <h4 className="font-black text-slate-900 text-lg">{s.name}</h4>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{s.category} Risk | ID: {s.id}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${level.color}`}>
                             {level.label}
                          </span>
                       </div>
                       
                       <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">發生機率 Probability</p>
                             <div className="flex items-end gap-2">
                                <span className="text-xl font-black text-slate-800">{(s.probability * 100).toFixed(0)}%</span>
                                <div className="flex-1 h-1 bg-slate-100 rounded-full mb-1.5">
                                   <div className="h-full bg-slate-900" style={{ width: `${s.probability * 100}%` }} />
                                </div>
                             </div>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">財務影響估算</p>
                             <p className="text-xl font-black text-rose-600">${s.financialRisk}M</p>
                          </div>
                          <div className="space-y-2">
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">緩解措施進度</p>
                             <div className="flex items-center gap-2">
                                <span className="text-sm font-bold text-emerald-600">{s.mitigationStatus}%</span>
                                <ShieldCheck size={14} className="text-emerald-500" />
                             </div>
                          </div>
                       </div>
                    </div>
                  );
                })}
             </div>
           </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
              <Zap size={120} className="absolute -right-10 -bottom-10 text-white/5" />
              <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                 <ShieldCheck className="text-emerald-400" size={22} /> 韌性證明與緩解
              </h3>
              <div className="space-y-6 relative z-10">
                 <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">已建立之韌性策略</p>
                    <p className="text-xs font-bold leading-relaxed">再生能源替代方案 A - 實施中</p>
                    <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-500">
                       <ShieldCheck size={12} /> Hash: 0x4a92...e92a
                    </div>
                 </div>
                 <button className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">
                    提交緩解實證封印
                 </button>
              </div>
           </div>

           <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100">
              <AlertTriangle className="text-rose-600 mb-4" size={32} />
              <h4 className="font-black text-xs text-rose-900 uppercase tracking-widest mb-2">AI 風險警示</h4>
              <p className="text-xs text-rose-700 leading-relaxed font-medium">
                偵測到歐盟近期修訂之碳邊境機制規章，預計將使您的「轉型風險」財務影響增加 15%。建議立即更新減碳目標路線圖。
              </p>
              <button className="mt-6 flex items-center gap-2 text-[10px] font-black text-rose-600 uppercase hover:underline">
                 重新計算財務衝擊 <ArrowRight size={12} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}