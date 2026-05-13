'use client';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Flame, 
  Leaf, 
  TrendingDown, 
  FileCheck,
  Plus,
  ArrowUpRight,
  Activity
} from 'lucide-react';

export default function EnergyManagementPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
              <Zap size={24} />
            </div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">能源管理終端 Energy Hub</h1>
          </div>
          <p className="text-slate-500 font-medium text-sm">GRI 302-1 | 範疇一、二、三能源消耗監測與綠電配比</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-amber-600 transition-all shadow-xl shadow-slate-900/10">
          <Plus size={16} /> 錄入能耗數據
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: '總用電量 (MWh)', value: '142.5', trend: '-2.4%', icon: Zap, color: 'amber' },
          { label: '化石燃料 (GJ)', value: '890.2', trend: '+0.8%', icon: Flame, color: 'orange' },
          { label: '再生能源佔比', value: '24.8%', trend: 'Target: 30%', icon: Leaf, color: 'emerald' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600 group-hover:scale-110 transition-transform`}>
                <stat.icon size={24} />
              </div>
              <ArrowUpRight size={16} className="text-slate-300" />
            </div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900 mt-1 tabular-nums">{stat.value}</h3>
            <p className={`text-[10px] font-bold mt-2 ${stat.trend.startsWith('-') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {stat.trend} <span className="text-slate-400">vs Last Month</span>
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-white rounded-[3rem] border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Activity size={18} className="text-amber-500" /> 能耗趨勢與預測
            </h3>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-[10px] font-black text-slate-400 uppercase">Monthly</span>
            </div>
          </div>
          <div className="h-[400px] p-8 flex items-center justify-center text-slate-300 italic font-medium">
             [能源消耗折線圖：顯示電、氣、油之月度變化]
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
            <h3 className="font-bold flex items-center gap-2 text-lg mb-6">
              <FileCheck className="text-emerald-400" /> 5T 實證狀態
            </h3>
            <div className="space-y-6">
              {[
                { label: '台電電子帳單 (API)', status: 'Connected', date: '2025-04-20' },
                { label: '綠電採購憑證 (T-REC)', status: 'Verified', date: '2025-03-15' },
                { label: '鍋爐燃料採購單', status: 'Pending', date: 'Waiting...' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full ${item.status === 'Verified' ? 'bg-emerald-500' : item.status === 'Connected' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                  <div className="flex-1">
                    <p className="text-sm font-bold">{item.label}</p>
                    <p className="text-[10px] text-white/40 font-black uppercase tracking-tighter">{item.status} | {item.date}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500 transition-all">
              執行年度碳盤查校正
            </button>
          </div>

          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100">
             <TrendingDown className="text-amber-600 mb-4" size={32} />
             <h4 className="font-black text-sm text-amber-900 uppercase tracking-widest mb-2">節能建議 AI Insight</h4>
             <p className="text-xs text-amber-700 leading-relaxed font-medium">
               偵測到空調系統在非營業時間能耗異常，建議檢查第 4 區定時設定。預計可降低 12% 離峰用電。
             </p>
          </div>
        </div>
      </div>
    </div>
  );
}