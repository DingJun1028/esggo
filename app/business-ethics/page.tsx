'use client';
import { motion } from 'framer-motion';
import { 
  Gavel, 
  ShieldCheck, 
  Lock, 
  Eye, 
  FileCheck,
  Plus,
  ArrowRight,
  Activity,
  AlertTriangle,
  Scale
} from 'lucide-react';

export default function BusinessEthicsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
              <Gavel size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">商業道德門戶 Ethics Center</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 205, 206 | 反貪腐、公平競爭與 5T 誠信聲明</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 active:scale-95 transition-all">
          <Plus size={16} /> 簽署誠信承諾
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
           <Scale className="text-indigo-600" size={32} />
           <h3 className="text-xl font-black text-slate-900">反貪腐治理</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">已受訓員工比例</span>
                 <span className="text-slate-900 font-black">100%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-indigo-500 w-full" />
              </div>
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">貪腐事件數 (GRI 205-3)</span>
                 <span className="text-emerald-600 font-black">0</span>
              </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
           <ShieldCheck className="text-emerald-600" size={32} />
           <h3 className="text-xl font-black text-slate-900">公平競爭審核</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">反競爭行為訴訟</span>
                 <span className="text-emerald-600 font-black">NONE</span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                 <p className="text-[10px] text-emerald-800 font-medium leading-relaxed">
                   系統已自動掃描 2024 年度所有標案合約，未發現異常採購與圍標風險。
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-indigo-900 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
           <Lock size={120} className="absolute -right-10 -bottom-10 text-white/5" />
           <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">5T 誠信聲明封印</h3>
              <p className="text-xs text-indigo-200 font-medium opacity-80">使用 ZKP 技術確保道德治理數據不可篡改</p>
           </div>
           <div className="space-y-4 relative z-10 mt-10">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 bg-emerald-400 rounded-full" />
                 <span className="text-[10px] font-black uppercase tracking-widest">Hash: 0x8a72...F421</span>
              </div>
              <button className="w-full py-4 bg-white text-indigo-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-50 transition-all">
                 校驗歷史治理聲明
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
         <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800 mb-8">
            <AlertTriangle className="text-indigo-500" size={24} /> 申訴機制與吹哨者保護 (GRI 2-25)
         </h3>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { label: '匿名舉報件數', value: '12', status: 'All Resolved' },
              { label: '平均處理時效', value: '3.5 Days', status: 'Target: <5 Days' },
              { label: '舉報人保護滿意度', value: '98%', status: 'Annual Survey' },
            ].map((box, i) => (
              <div key={i} className="p-8 rounded-[2rem] bg-slate-50 border border-slate-100 space-y-3">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{box.label}</p>
                 <h4 className="text-2xl font-black text-slate-900">{box.value}</h4>
                 <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-tighter">{box.status}</p>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
}