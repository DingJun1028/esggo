'use client';
import { motion } from 'framer-motion';
import { 
  PackageCheck, 
  ShieldCheck, 
  Tag, 
  Activity, 
  AlertCircle,
  FileCheck,
  Plus,
  BarChart,
  Search,
  CheckCircle2
} from 'lucide-react';

export default function ProductStewardshipPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20">
              <PackageCheck size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tighter">產品責任中心 Stewardship</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm mt-1">GRI 416, 417 | 產品健康安全、標示合規與全生命週期管理</p>
        </div>
        <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 hover:bg-blue-600 transition-all shadow-xl">
          <Plus size={16} /> 登錄產品合規證書
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: '健康與安全評估覆蓋率', value: '100%', status: 'Target Met', icon: ShieldCheck, color: 'emerald' },
          { label: '產品標示違規件數', value: '0', status: 'Perfect Record', icon: Tag, color: 'blue' },
          { label: '召回事件/客戶投訴', value: 'NONE', status: 'Verified', icon: CheckCircle2, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative group overflow-hidden">
             <div className="relative z-10">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <p className="text-[10px] font-bold text-emerald-600 mt-4 uppercase tracking-tighter">{stat.status}</p>
             </div>
             <stat.icon className={`absolute -right-4 -bottom-4 text-${stat.color}-50`} size={80} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
         <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
               <h3 className="font-bold text-slate-800 flex items-center gap-2 text-xl">
                  <Activity size={24} className="text-blue-500" /> 產品合規矩陣
               </h3>
               <div className="flex items-center gap-4 bg-white border border-slate-200 rounded-xl px-4 py-2 w-64 focus-within:border-blue-400 transition-all">
                  <Search size={14} className="text-slate-400" />
                  <input type="text" placeholder="搜尋產品編號..." className="bg-transparent border-none outline-none text-xs font-bold w-full" />
               </div>
            </div>
            <div className="overflow-x-auto">
               <table className="w-full text-left">
                  <thead>
                     <tr className="border-b border-slate-50">
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">產品名稱 / ID</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">健康安全評估</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">標示合規</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">狀態</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                     {[
                       { name: '精密電子模組 X1', id: 'PRD-001', health: 'Pass', label: 'RoHS, REACH', status: 'Active' },
                       { name: '工業感測器 S5', id: 'PRD-002', health: 'Pass', label: 'CE, FCC', status: 'Active' },
                       { name: '智慧節能控制系統', id: 'PRD-003', health: 'Reviewing', label: 'Pending', status: 'Locked' },
                     ].map((p, i) => (
                       <tr key={i} className="hover:bg-slate-50 transition-all cursor-pointer">
                          <td className="px-8 py-6">
                             <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                             <p className="text-[10px] text-slate-400 font-medium">{p.id}</p>
                          </td>
                          <td className="px-8 py-6">
                             <span className="text-xs font-bold text-emerald-600">{p.health}</span>
                          </td>
                          <td className="px-8 py-6 text-xs font-bold text-slate-600">{p.label}</td>
                          <td className="px-8 py-6">
                             <span className={`text-[10px] font-black px-3 py-1 rounded-lg border ${
                               p.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'
                             }`}>{p.status}</span>
                          </td>
                       </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         </div>

         <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
               <h3 className="font-bold flex items-center gap-3 text-lg mb-8">
                 <ShieldCheck className="text-blue-400" size={22} /> 5T 標籤實證
               </h3>
               <div className="space-y-6 relative z-10">
                  <div className="p-5 rounded-2xl bg-white/5 border border-white/10">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1">合規封印紀錄</p>
                     <p className="text-xs font-bold leading-relaxed">RoHS 2.0 檢驗數據 - 已由 5T 協議完成雜湊鎖定</p>
                     <p className="text-[10px] font-mono text-slate-500 mt-2">ID: 0x7c21...e110</p>
                  </div>
                  <button className="w-full py-4 bg-blue-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-500 transition-all shadow-lg">
                     簽署產品合規聲明
                  </button>
               </div>
            </div>

            <div className="bg-blue-50 p-8 rounded-[2.5rem] border border-blue-100">
               <AlertCircle className="text-blue-600 mb-4" size={32} />
               <h4 className="font-black text-xs text-blue-900 uppercase tracking-widest mb-2">客戶滿意度提示</h4>
               <p className="text-xs text-blue-700 leading-relaxed font-medium">
                 本月有關「產品耐用性」的客戶回饋轉向正向，建議在下份永續報告書中加入「循環產品生命週期」之質性敘述。
               </p>
            </div>
         </div>
      </div>
    </div>
  );
}