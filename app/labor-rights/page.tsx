'use client';
import { motion } from 'framer-motion';
import { 
  Users, 
  Heart, 
  Scale, 
  UserCheck, 
  ShieldAlert,
  ArrowUpRight,
  Target,
  Activity,
  Plus
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';

const diversityData = [
  { name: '管理職女性', value: 38, color: '#10b981' },
  { name: '管理職男性', value: 62, color: '#0f172a' },
];

const ageData = [
  { range: '20-30', count: 45, color: '#34d399' },
  { range: '31-40', count: 82, color: '#10b981' },
  { range: '41-50', count: 34, color: '#059669' },
  { range: '50+', count: 12, color: '#064e3b' },
];

export default function LaborRightsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20">
              <Users size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">勞工人權 Hub Labor Rights</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 401, 404, 405 | 員工福祉、DEI 多元化與人才培育實證</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-600 active:scale-95 transition-all">
          <Plus size={16} /> 錄入人資數據
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: '員工敬業度滿意度', value: '4.8/5', trend: '+0.2', icon: Heart, color: 'rose' },
          { label: '平均受訓時數', value: '32.4h', trend: '+4.5h', icon: Target, color: 'blue' },
          { label: 'DEI 多元化指數', value: '0.82', trend: 'Target: 0.85', icon: Scale, color: 'indigo' },
          { label: '新進與離職率', value: '2.4%', trend: '-0.8%', icon: UserCheck, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="relative z-10">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
              <div className="mt-4 flex items-center gap-2 text-[10px] font-bold text-emerald-600">
                 {stat.trend} <ArrowUpRight size={10} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800">
              <Activity className="text-emerald-500" size={24} /> 多元化與年齡分佈
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={diversityData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                      {diversityData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="text-center mt-4 space-y-1">
                   <p className="text-sm font-black text-slate-700">女性管理職佔比: 38%</p>
                   <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">GRI 405-1 Disclosure</p>
                </div>
             </div>
             <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="range" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} />
                    <YAxis hide />
                    <Bar dataKey="count" radius={[10, 10, 0, 0]}>
                       {ageData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
                <div className="text-center mt-4">
                   <p className="text-sm font-black text-slate-700">全體員工年齡結構</p>
                </div>
             </div>
          </div>
        </div>

        <div className="lg:col-span-4 bg-slate-900 p-10 rounded-[3rem] text-white space-y-8 shadow-2xl relative overflow-hidden">
           <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-[80px]" />
           <h3 className="font-bold flex items-center gap-3 text-lg relative z-10">
             <ShieldAlert className="text-emerald-400" size={22} /> 勞工人權風險地圖
           </h3>
           <div className="space-y-5 relative z-10">
              {[
                { label: '強制勞工風險 (Tier-2)', risk: 'Low', color: 'bg-emerald-500' },
                { label: '職業健康與安全防護', risk: 'Min', color: 'bg-emerald-500' },
                { label: '薪酬差距與公平性', risk: 'Low', color: 'bg-emerald-500' },
                { label: '集體協商與工會權益', risk: 'Low', color: 'bg-emerald-500' },
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all cursor-pointer">
                   <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold">{item.label}</span>
                      <span className="text-[10px] font-black text-emerald-400 uppercase">{item.risk}</span>
                   </div>
                   <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${item.color} w-full`} />
                   </div>
                </div>
              ))}
           </div>
           <button className="w-full py-4 bg-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all mt-4">
              執行年度人權盡職調查 (DD)
           </button>
        </div>
      </div>
    </div>
  );
}