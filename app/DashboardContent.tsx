'use client';

import { Activity, ArrowUpRight, FileCheck, ShieldCheck, Target } from 'lucide-react';

const stats = [
  { label: 'GRI 覆蓋率', value: '84%', detail: '較上月 +6%', icon: Target, accent: 'text-emerald-600 bg-emerald-50' },
  { label: '待驗證證據', value: '18', detail: '5 份優先處理', icon: FileCheck, accent: 'text-amber-600 bg-amber-50' },
  { label: '5T 審計記錄', value: '156', detail: '本月新增 24 筆', icon: ShieldCheck, accent: 'text-slate-900 bg-slate-100' },
  { label: '改善任務', value: '12', detail: '3 項即將到期', icon: Activity, accent: 'text-indigo-600 bg-indigo-50' },
];

const priorities = [
  '補齊 GRI 302 能源密度揭露與佐證文件',
  '確認供應商 ESG 問卷回收與稽核覆蓋率',
  '完成董事會治理與反貪腐年度更新',
];

export default function DashboardContent() {
  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-900 p-2.5 text-white shadow-lg">
              <Activity size={24} />
            </div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900">ESG GO 控制台</h1>
          </div>
          <p className="text-sm font-medium text-slate-500">
            中小企業永續治理總覽與 5T 實證追蹤中心
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-slate-900/10 transition-all hover:bg-emerald-600">
          進入本月改善計畫
          <ArrowUpRight size={16} />
        </button>
      </header>

      <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${stat.accent}`}>
              <stat.icon size={22} />
            </div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">{stat.value}</h2>
            <p className="mt-3 text-xs font-bold text-slate-500">{stat.detail}</p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 rounded-[3rem] border border-slate-200 bg-white p-10 shadow-sm">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Monthly Focus</p>
              <h3 className="mt-2 text-xl font-black text-slate-900">重大改善優先順序</h3>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-600">
              5T Active
            </span>
          </div>
          <div className="space-y-4">
            {priorities.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-slate-50 px-5 py-4"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-xs font-black text-slate-900 shadow-sm">
                  0{index + 1}
                </div>
                <p className="text-sm font-bold text-slate-700">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 rounded-[3rem] bg-slate-900 p-10 text-white shadow-2xl">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Integrity Snapshot</p>
          <h3 className="mt-2 text-2xl font-black">本週系統狀態穩定</h3>
          <p className="mt-4 text-sm font-medium leading-relaxed text-slate-300">
            目前核心頁面已解壓完成，重點資料流與前端模組可持續驗證；後續可依需求再補齊更多實際資料串接。
          </p>
          <div className="mt-8 rounded-[2rem] border border-white/10 bg-white/5 p-6">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Next Step</p>
            <p className="mt-2 text-sm font-bold text-white">繼續修正建置期間發現的其餘型別與模組問題。</p>
          </div>
        </div>
      </section>
    </div>
  );
}
