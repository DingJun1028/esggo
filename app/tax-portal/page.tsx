'use client';

import { 
  BarChart3, 
  Globe, 
  FileText, 
  ShieldCheck,
  TrendingDown,
  ArrowRight,
  Activity,
  Plus,
  Coins
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const taxData = [
  { region: 'Taiwan', amount: 1420, color: '#10b981' },
  { region: 'USA', amount: 890, color: '#3b82f6' },
  { region: 'EU', amount: 650, color: '#6366f1' },
  { region: 'ASEAN', amount: 420, color: '#f59e0b' },
];

export default function TaxTransparencyPage() {
  return (
    <div className="page-container animate-fade-in">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <Coins size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">稅務透明度 Portal Tax Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 207 | 逐國報告 (CbCR)、稅務治理策略與經濟貢獻</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all">
          <FileText size={16} /> 導出 CbCR 報告
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-10">
          <div className="flex justify-between items-center">
            <h3 className="font-bold flex items-center gap-2 text-xl text-slate-800">
              <BarChart3 className="text-blue-500" size={24} /> 各國納稅金額分佈 (GRI 207-4)
            </h3>
            <span className="text-[10px] font-black text-slate-400 uppercase bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 tracking-widest">Currency: Million TWD</span>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={taxData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: '800'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 10, fontWeight: '800'}} />
                <Tooltip contentStyle={{borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="amount" radius={[15, 15, 0, 0]} barSize={50}>
                  {taxData.map((entry, index) => <Cell key={index} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden">
              <Globe size={120} className="absolute -right-10 -bottom-10 text-white/5" />
              <h3 className="text-xl font-black mb-6 relative z-10">稅務治理策略</h3>
              <div className="space-y-4 relative z-10">
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">稅務透明方針</p>
                    <p className="text-xs font-medium text-slate-300">公開揭露全球稅務政策，嚴禁於避稅天堂轉移利潤。</p>
                 </div>
                 <div className="p-4 bg-white/5 border border-white/10 rounded-2xl">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">合規審查狀態</p>
                    <p className="text-xs font-bold">2024 年度審計完成 - 無重大缺失</p>
                 </div>
              </div>
           </div>

           <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
              <Activity className="text-blue-600 mb-4" size={32} />
              <h4 className="font-black text-xs text-blue-900 uppercase tracking-widest mb-2">經濟貢獻統計</h4>
              <div className="space-y-2">
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-blue-700/60">總經濟產值貢獻</span>
                    <span className="text-blue-900 font-black">$4.2B</span>
                 </div>
                 <div className="flex justify-between text-xs font-bold">
                    <span className="text-blue-700/60">政府補助佔比</span>
                    <span className="text-blue-900 font-black">2.4%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}