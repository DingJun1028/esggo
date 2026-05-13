'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  Droplets, 
  Trash2, 
  ShieldCheck, 
  TrendingDown, 
  Plus,
  ArrowRight,
  Globe,
  FileText,
  AlertCircle,
  Activity,
  History,
  UploadCloud
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { mockEnvRecords, calculateCarbon } from '@/lib/environmental-data';

const chartData = [
  { name: 'Jan', energy: 4000, water: 60, waste: 100 },
  { name: 'Feb', energy: 3000, water: 70, waste: 120 },
  { name: 'Mar', energy: 5000, water: 55, waste: 90 },
  { name: 'Apr', energy: 4500, water: 80, waste: 110 },
];

export default function EnvironmentalContent() {
  const [showModal, setShowModal] = useState(false);
  const [activeType, setActiveType] = useState<'Energy' | 'Water' | 'Waste'>('Energy');

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
              <Globe size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">環境指揮中心 Environmental</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 302, 303, 306 | 5T 實證數據集成終端</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setShowModal(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10"
          >
            <Plus size={16} /> 新增環境數據
          </button>
        </div>
      </header>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '能源消耗強度', value: '52.4', unit: 'kWh/m2', trend: '-3.2%', icon: Zap, color: 'amber' },
          { label: '取水密度', value: '1.2', unit: 'm3/Unit', trend: '+1.5%', icon: Droplets, color: 'blue' },
          { label: '廢棄物轉化率', value: '84%', unit: 'Rate', trend: '+12%', icon: Trash2, color: 'emerald' },
        ].map((stat, i) => (
          <motion.div 
            key={i} 
            whileHover={{ y: -5 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group transition-all hover:border-emerald-200"
          >
            <div className={`absolute top-4 right-4 text-${stat.color}-100 group-hover:text-${stat.color}-500/20 transition-colors`}>
              <stat.icon size={48} strokeWidth={1.5} />
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <span className="text-[10px] font-bold text-slate-400 uppercase">{stat.unit}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span className={`text-[10px] font-black ${stat.trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>
                  {stat.trend} vs 去年同期
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Resource Flow Chart */}
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <div className="space-y-1">
              <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800">
                <Activity className="text-emerald-500" size={24} />
                資源流動趨勢分析
              </h3>
              <p className="text-xs text-slate-400 font-medium">能源、水與廢棄物的交互變動監測</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorEnv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}
                />
                <Area type="monotone" dataKey="energy" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorEnv)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 5T Audit Trail Section */}
        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl">
           <div className="flex items-center justify-between">
             <h3 className="font-bold flex items-center gap-3 text-lg">
               <ShieldCheck className="text-emerald-400" size={22} />
               5T 環境實證軌跡
             </h3>
             <History size={18} className="text-slate-600" />
           </div>
           <div className="space-y-6 flex-1 overflow-y-auto max-h-[400px] custom-scrollbar pr-2">
              {mockEnvRecords.map((record, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className={`mt-1.5 w-2 h-2 rounded-full ${record.status === 'Verified' ? 'bg-emerald-500' : 'bg-orange-500'}`} />
                  <div className="space-y-1">
                    <p className="text-xs font-bold">{record.category} - {record.value}{record.unit}</p>
                    <p className="text-[9px] text-slate-500 uppercase tracking-tighter">證據 ID: {record.evidenceId} | {record.date}</p>
                    <div className="flex items-center gap-2 mt-1">
                       <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-emerald-400 font-bold uppercase">{record.status}</span>
                    </div>
                  </div>
                </div>
              ))}
           </div>
           <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
              檢視完整環境佐證庫
           </button>
        </div>
      </div>

      {/* Modals - Simplified for Demo */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-lg rounded-[3rem] p-10 relative z-10 shadow-2xl overflow-hidden"
            >
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-xl">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black text-slate-900">錄入環境實證數據</h3>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-2 bg-slate-100 p-1.5 rounded-2xl mb-6">
                  {['Energy', 'Water', 'Waste'].map((t) => (
                    <button 
                      key={t} 
                      onClick={() => setActiveType(t as any)}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeType === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                    >
                      {t === 'Energy' ? '能源' : t === 'Water' ? '水資源' : '廢棄物'}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">數值與單位</label>
                     <div className="flex gap-2">
                        <input type="number" placeholder="0.00" className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-400 outline-none transition-all" />
                        <select className="bg-slate-50 border border-slate-200 rounded-2xl px-4 text-xs font-black uppercase tracking-tighter outline-none">
                           {activeType === 'Energy' && <><option>kWh</option><option>GJ</option></>}
                           {activeType === 'Water' && <><option>m3</option><option>Unit</option></>}
                           {activeType === 'Waste' && <><option>kg</option><option>Ton</option></>}
                        </select>
                     </div>
                   </div>
                   
                   <div>
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">佐證文件編號 / 5T 封印</label>
                     <div className="flex gap-2">
                        <input type="text" placeholder="輸入發票、帳單或聯單編號..." className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold focus:border-emerald-400 outline-none transition-all" />
                        <button className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition-all">
                           <UploadCloud size={20} />
                        </button>
                     </div>
                   </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-5 bg-slate-900 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-[0.2em] hover:bg-emerald-600 active:scale-95 transition-all shadow-xl shadow-slate-900/10">
                    執行 5T 數據封印
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
