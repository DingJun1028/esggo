'use client';
import { motion } from 'framer-motion';
import { 
  Leaf, 
  Map, 
  Bird, 
  ShieldCheck, 
  AlertCircle,
  Plus,
  ArrowRight,
  Activity,
  Trees
} from 'lucide-react';
import { mockBioImpacts } from '@/lib/nature-data';

export default function NaturePositivePage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
              <Trees size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">生態自然中心 Nature Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 304, TNFD | 生物多樣性監測與棲地修復實證</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all">
          <Plus size={16} /> 登錄棲地調查
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: '棲地修復總面積 (m2)', value: '970', trend: 'Target: 1500', icon: Leaf, color: 'emerald' },
          { label: '鄰近保護區據點數', value: '1', trend: 'Monitoring Active', icon: Map, color: 'blue' },
          { label: 'TNFD 披露準備度', value: '72%', trend: 'Phase 2', icon: ShieldCheck, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
             <div className={`absolute -right-4 -bottom-4 text-slate-50 group-hover:text-${stat.color}-50 transition-colors`}>
                <stat.icon size={80} />
             </div>
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <p className="text-[10px] font-bold text-emerald-600 mt-4 uppercase tracking-tighter">{stat.trend}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <Activity size={18} className="text-emerald-500" /> 據點生物多樣性矩陣
               </h3>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">GRI 304-1 Disclosure</span>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">營運據點名稱</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">保護區鄰近性</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">影響等級</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">狀態</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {mockBioImpacts.map((b) => (
                       <tr key={b.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                          <td className="px-8 py-6">
                             <p className="font-bold text-slate-900 text-sm">{b.siteName}</p>
                             <p className="text-[10px] text-slate-400 font-medium">{b.id}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${b.proximityToProtectedArea ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-slate-100 text-slate-500'}`}>
                                {b.proximityToProtectedArea ? 'Adjacent' : 'Clear'}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-bold text-slate-700">{b.impactLevel}</span>
                          </td>
                          <td className="px-8 py-6">
                             <span className={`text-[10px] font-black uppercase ${b.status === 'Completed' ? 'text-emerald-500' : 'text-blue-500'}`}>
                                {b.status}
                             </span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <Bird size={120} className="absolute -right-10 -bottom-10 text-white/5" />
               <h3 className="text-xl font-black mb-6 flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" size={22} /> 5T 生態實證
               </h3>
               <div className="space-y-6">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">已封印之修復日誌</p>
                     <p className="text-xs font-bold leading-relaxed">2024 Q4 桃園棲地原生物種復育紀錄</p>
                     <div className="flex items-center gap-2 mt-3 text-[10px] font-mono text-slate-500">
                        Hash: 0x42b1...e901
                     </div>
                  </div>
                  <button className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg">
                     簽署自然正向承諾
                  </button>
               </div>
            </div>

            <div className="bg-emerald-50 p-8 rounded-[2.5rem] border border-emerald-100">
               <Trees className="text-emerald-600 mb-4" size={32} />
               <h4 className="font-black text-xs text-emerald-900 uppercase tracking-widest mb-2">TNFD 洞察</h4>
               <p className="text-xs text-emerald-700 leading-relaxed font-medium">
                 據點 BIO-002 的水資源依賴度與當地的紅樹林生態系高度相關。建議在乾季增加水質監測頻率，以維持生態平衡。
               </p>
               <button className="mt-6 flex items-center gap-2 text-[10px] font-black text-emerald-600 uppercase hover:underline">
                  檢視自然相關風險 <ArrowRight size={12} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}