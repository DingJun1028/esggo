'use client';
import { motion } from 'framer-motion';
import { 
  Droplets, 
  Waves, 
  Recycle, 
  AlertCircle,
  FileText,
  BarChart,
  Plus
} from 'lucide-react';

export default function WaterStewardshipPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Droplets size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">水資源管理 Water Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">GRI 303 | 取水量、排水量與回收率實時監測</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
          <Plus size={16} /> 登錄水錶數據
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '總取水量 (m3)', value: '1,240', trend: '-5%', icon: Droplets, color: 'blue' },
          { label: '水回收率', value: '12.4%', trend: 'Target: 15%', icon: Recycle, color: 'emerald' },
          { label: '水風險壓力', value: 'Low', trend: 'Regional Data', icon: Waves, color: 'indigo' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 w-fit mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10">
        <div className="flex items-center justify-between mb-10">
           <h3 className="font-bold text-xl text-slate-800 flex items-center gap-3">
             <BarChart size={24} className="text-blue-500" /> 水平衡分析 (Water Balance)
           </h3>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Year to Date</span>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
          <div className="lg:col-span-1 space-y-8">
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">市政用水</p>
              <p className="text-2xl font-black text-slate-800">840 m3</p>
              <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-[68%]" />
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">地下水/雨水</p>
              <p className="text-2xl font-black text-slate-800">400 m3</p>
              <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-300 w-[32%]" />
              </div>
            </div>
          </div>
          <div className="lg:col-span-3 h-[300px] flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-bold italic">
            [Sankey Diagram: 顯示水源流入、使用與排水流向]
          </div>
        </div>
      </div>
      
      <div className="bg-rose-50 p-8 rounded-[2.5rem] border border-rose-100 flex items-start gap-6">
        <div className="p-4 bg-rose-100 text-rose-600 rounded-2xl">
          <AlertCircle size={28} />
        </div>
        <div>
          <h4 className="font-black text-lg text-rose-900 tracking-tight">水質監測警示</h4>
          <p className="text-sm text-rose-700 leading-relaxed font-medium mt-1">
            第 2 排水口測得 COD (化學需氧量) 超出正常範圍 15%，請立即檢查廢水處理單元。
          </p>
          <div className="mt-4 flex gap-3">
             <button className="px-4 py-2 bg-rose-600 text-white text-[10px] font-black rounded-lg uppercase tracking-widest">立即排查</button>
             <button className="px-4 py-2 bg-white border border-rose-200 text-rose-600 text-[10px] font-black rounded-lg uppercase tracking-widest">查看歷史日誌</button>
          </div>
        </div>
      </div>
    </div>
  );
}