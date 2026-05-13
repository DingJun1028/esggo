'use client';
import { motion } from 'framer-motion';
import { 
  Trash2, 
  Recycle, 
  AlertTriangle, 
  BarChart3,
  FileText,
  Truck,
  Plus,
  ArrowRight
} from 'lucide-react';

export default function WasteManagementPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-slate-100 text-slate-600 rounded-xl">
              <Trash2 size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">廢棄物管理 Waste Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">GRI 306 | 一般/有害廢棄物、回收與處置追蹤</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-600 transition-all">
          <Plus size={16} /> 登錄聯單
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: '總廢棄物 (kg)', value: '4,520', icon: Trash2, color: 'slate' },
          { label: '回收率', value: '42%', icon: Recycle, color: 'emerald' },
          { label: '有害廢棄物', value: '125', icon: AlertTriangle, color: 'rose' },
          { label: '清運次數', value: '12', icon: Truck, color: 'blue' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
            <stat.icon className={`text-${stat.color}-500 mb-4`} size={24} />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white rounded-[3rem] border border-slate-200 shadow-sm p-10">
           <h3 className="font-bold text-xl text-slate-800 mb-8 flex items-center gap-3">
             <BarChart3 size={24} className="text-emerald-500" /> 處置方式分佈
           </h3>
           <div className="space-y-6">
              {[
                { label: '回收再利用 (Recycling)', value: 1898, color: 'bg-emerald-500' },
                { label: '焚化處理 (Incineration)', value: 1540, color: 'bg-amber-500' },
                { label: '掩埋處置 (Landfill)', value: 957, color: 'bg-rose-500' },
                { label: '其它 (Others)', value: 125, color: 'bg-slate-400' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                   <div className="flex justify-between text-xs font-bold text-slate-600">
                      <span>{item.label}</span>
                      <span>{item.value} kg</span>
                   </div>
                   <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 4520) * 100}%` }}
                        className={`h-full ${item.color}`}
                      />
                   </div>
                </div>
              ))}
           </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
           <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
              <h3 className="font-bold text-lg mb-8 flex items-center gap-3">
                <FileText className="text-emerald-400" /> 近期清運紀錄 (Manifests)
              </h3>
              <div className="space-y-6">
                 {[
                   { id: 'M-20250422', type: '一般', weight: '240kg', status: 'Sealed' },
                   { id: 'M-20250418', type: '有害', weight: '12kg', status: 'Verified' },
                   { id: 'M-20250415', type: '資源', weight: '580kg', status: 'Sealed' },
                 ].map((m, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 group cursor-pointer hover:bg-white/10 transition-all">
                      <div className="space-y-1">
                         <p className="text-xs font-bold">{m.id}</p>
                         <div className="flex gap-2">
                            <span className="text-[9px] font-black uppercase text-white/40">{m.type}</span>
                            <span className="text-[9px] font-black uppercase text-emerald-400">{m.status}</span>
                         </div>
                      </div>
                      <div className="flex items-center gap-3">
                         <span className="text-sm font-black tabular-nums">{m.weight}</span>
                         <ArrowRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                      </div>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}