'use client';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Users, 
  Heart, 
  MapPin, 
  TrendingUp,
  MessageSquare,
  ShieldCheck,
  Plus,
  Activity
} from 'lucide-react';

export default function CommunityImpactPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg">
              <Globe size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">社區共榮中心 Community</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 413 | 在地參與、社會影響力與回饋機制</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 transition-all shadow-xl shadow-slate-900/10">
          <Plus size={16} /> 登錄社區專案
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: '社區參與計畫覆蓋率', value: '100%', trend: 'Target Met', icon: Users, color: 'emerald' },
          { label: '在地採購比例', value: '64.2%', trend: '+8.5%', icon: MapPin, color: 'blue' },
          { label: '公益投入總額 (TWD)', value: '1.2M', trend: 'Budget: 1.5M', icon: Heart, color: 'rose' },
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
         <div className="lg:col-span-7 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-10">
               <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800">
                  <MessageSquare className="text-emerald-500" size={24} /> 社區聲量與意見監測
               </h3>
               <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">Sentiment: POSITIVE</span>
            </div>
            <div className="h-[300px] w-full flex items-center justify-center border-2 border-dashed border-slate-100 rounded-[2rem] text-slate-300 font-bold italic">
               [Word Cloud / Sentiment Chart: 顯示社區關鍵字與情緒分析]
            </div>
         </div>

         <div className="lg:col-span-5 bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl overflow-hidden relative">
            <div className="absolute -left-10 -top-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl" />
            <h3 className="font-bold flex items-center gap-3 text-lg relative z-10">
              <ShieldCheck className="text-emerald-400" size={22} /> 5T 社會影響力實證
            </h3>
            <div className="space-y-4 relative z-10">
               {[
                 { title: '大安區弱勢關懷計畫', status: 'Sealed', date: '2025-04-20' },
                 { title: '在地人才保證就業協議', status: 'Verified', date: '2025-03-15' },
                 { title: '環境友善社區回饋金', status: 'Sealed', date: '2025-04-28' },
               ].map((item, i) => (
                 <div key={i} className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold">{item.title}</span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase">{item.status}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1 uppercase tracking-tighter">Evidence Linked | {item.date}</p>
                 </div>
               ))}
            </div>
            <button className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg relative z-10">
               生成年度社區影響力報告
            </button>
         </div>
      </div>
    </div>
  );
}