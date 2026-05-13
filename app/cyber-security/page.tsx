'use client';
import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Cpu, 
  AlertCircle, 
  Zap, 
  Eye, 
  Database, 
  Activity,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { mockIncidents, innovationStats } from '@/lib/tech-data';

export default function CybersecurityPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg">
              <ShieldCheck size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">資安與創新中心 Tech Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 418 | 資訊安全、客戶隱私保護與綠色創新研發</p>
        </div>
        <button className="btn-premium flex items-center gap-2">
          <Plus size={16} /> 登錄資安演練
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
           <Lock className="text-indigo-600" size={32} />
           <h3 className="text-xl font-black text-slate-900">資安合規性</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">ISO 27001 認證狀態</span>
                 <span className="text-emerald-600 font-black">ACTIVE</span>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                 <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                   系統已自動串接防火牆日誌，過去 30 天攔截 1,420 次潛在攻擊。
                 </p>
              </div>
           </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm space-y-6">
           <Cpu className="text-emerald-600" size={32} />
           <h3 className="text-xl font-black text-slate-900">綠色創新研發</h3>
           <div className="space-y-4">
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">研發費用佔營收比</span>
                 <span className="text-slate-900 font-black">6.2%</span>
              </div>
              <div className="flex justify-between text-xs font-bold">
                 <span className="text-slate-400 uppercase tracking-widest">綠色專利取得數</span>
                 <span className="text-emerald-600 font-black">{innovationStats.greenPatents} 件</span>
              </div>
           </div>
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
           <Zap size={120} className="absolute -right-10 -bottom-10 text-white/5" />
           <div className="relative z-10">
              <h3 className="text-xl font-black mb-2">5T 隱私驗證</h3>
              <p className="text-xs text-slate-400 font-medium opacity-80">使用 ZKP 確保客戶數據隱私不外洩的情況下完成合規證明</p>
           </div>
           <div className="space-y-4 relative z-10 mt-10">
              <div className="flex items-center gap-3 text-emerald-400">
                 <ShieldCheck size={16} />
                 <span className="text-[10px] font-black uppercase tracking-widest">Privacy Proof Active</span>
              </div>
              <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all">
                 生成資安聲明
              </button>
           </div>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
           <h3 className="font-black text-slate-800 flex items-center gap-2">
             <AlertCircle size={20} className="text-rose-500" /> 資安與隱私事件日誌
           </h3>
           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">GRI 418-1 Disclosure</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">事件 ID</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">類型</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">嚴重程度</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">日期</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">狀態</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {mockIncidents.map((incident) => (
                <tr key={incident.id} className="hover:bg-slate-50 transition-all">
                  <td className="px-8 py-6 font-bold text-slate-900 text-sm">{incident.id}</td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-600">{incident.type}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase ${
                      incident.severity === 'High' ? 'bg-rose-50 text-rose-600' : 'bg-slate-100 text-slate-500'
                    }`}>{incident.severity}</span>
                  </td>
                  <td className="px-8 py-6 text-xs font-bold text-slate-500">{incident.date}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      <span className="text-[10px] font-black uppercase text-emerald-600">{incident.status}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}