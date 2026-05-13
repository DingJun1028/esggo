'use client';
import { motion } from 'framer-motion';
import { 
  Recycle, 
  RotateCcw, 
  Package, 
  ShieldCheck, 
  History,
  TrendingUp,
  ArrowUpRight,
  Database,
  Layers,
  Activity
} from 'lucide-react';
import { mockMaterials } from '@/lib/nature-data';

export default function CircularEconomyPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg">
              <Recycle size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">循環經濟門戶 Circular Economy</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 301 | 物料使用、再生材料佔比與循環性追蹤</p>
        </div>
        <div className="flex gap-3">
           <div className="px-5 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-2xl flex items-center gap-3">
              <Layers size={16} />
              <span className="text-[10px] font-black uppercase tracking-widest">Circularity Rate: 64.2%</span>
           </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
            <div className="flex justify-between items-center">
               <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800">
                  <Database className="text-blue-500" size={24} /> 物料生命週期追蹤
               </h3>
               <span className="text-[9px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Unit: KG</span>
            </div>
            
            <div className="space-y-6">
               {mockMaterials.map((m) => (
                 <div key={m.id} className="p-6 rounded-[2rem] border border-slate-100 hover:bg-slate-50 transition-all group">
                    <div className="flex justify-between items-center mb-6">
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-xl ${m.category === 'Packaging' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                             <Package size={20} />
                          </div>
                          <div>
                             <h4 className="font-black text-slate-900">{m.materialName}</h4>
                             <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{m.category} Material | ID: {m.id}</p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-xl font-black text-slate-900 tabular-nums">{m.totalWeight.toLocaleString()}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Total Weight (KG)</p>
                       </div>
                    </div>
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                          <span>再生材料佔比 Recycled Content</span>
                          <span className="text-blue-600">{m.recycledPercentage}%</span>
                       </div>
                       <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${m.recycledPercentage}%` }}
                            className={`h-full ${m.recycledPercentage > 80 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                          />
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
               <RotateCcw size={120} className="absolute -right-10 -top-10 text-white/5" />
               <h3 className="font-bold flex items-center gap-3 text-lg relative z-10">
                  <ShieldCheck className="text-emerald-400" size={22} /> 5T 循環實證
               </h3>
               <div className="space-y-4 relative z-10">
                  <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">再生比例聲明</p>
                     <p className="text-xs font-bold leading-relaxed">2025 年度原物料盤點 - 經由 5T 協議驗證</p>
                  </div>
                  <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">
                     生成循環經濟報告
                  </button>
               </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
               <Activity className="text-blue-600 mb-4" size={32} />
               <h4 className="font-black text-xs text-blue-900 uppercase tracking-widest mb-2">循環路徑優化</h4>
               <p className="text-xs text-blue-700 leading-relaxed font-medium">
                 偵測到「回收鋁材」供應商之再生比例提升空間。預計透過 Tier-2 協作，可將產品整機循環率提升至 70%。
               </p>
               <button className="mt-6 flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase hover:underline">
                  檢視供應鏈循環力 <ArrowUpRight size={12} />
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}