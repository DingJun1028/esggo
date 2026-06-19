import React from 'react';
import {
  Factory as FactoryIcon,
  Zap as ZapIcon,
  Truck,
  Database as DbIcon,
  Wand2,
  BarChart3,
  Flag as FlagIcon,
  Award,
  ShieldCheck,
  Link2,
  ExternalLink,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LayoutGrid,
  CheckCircle2,
  Leaf,
  Shield,
  Search,
  CloudDone,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 👣 Carbon Management Dashboard (2.2)
 * --------------------------------------------------
 * Education-oriented carbon inventory management.
 * Tracks Scope 1, 2, 3 and SBTi targets with 5T Traceability.
 */
export const CarbonInventory = () => {
  return (
    <div className="bg-[#050d0d] text-white min-h-screen font-display selection:bg-[#0ABAB5]/30">
      <main className="flex-1 flex flex-col overflow-y-auto relative">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-[#050d0d]/60 backdrop-blur-md border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <DbIcon className="text-[#0ABAB5] w-6 h-6" />
              2.2 碳盤存管理 (教學型服務導向) Carbon Management
            </h2>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <nav className="hidden lg:flex gap-6">
              <a
                className="text-sm font-medium text-[#0ABAB5] border-b-2 border-[#0ABAB5] pb-1"
                href="#"
              >
                範疇 1
              </a>
              <a
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                href="#"
              >
                範疇 2
              </a>
              <a
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                href="#"
              >
                範疇 3
              </a>
              <a
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors"
                href="#"
              >
                SBTi 狀態
              </a>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative group hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input
                className="bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#0ABAB5]/50 w-64 placeholder:text-slate-600"
                placeholder="搜尋參數..."
                type="text"
              />
            </div>
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-white uppercase leading-none mb-1">
                  鼎鈞管理員
                </p>
                <p className="text-[10px] text-[#0ABAB5] font-bold uppercase tracking-tight">
                  首席審計師
                </p>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-[#0ABAB5]/30 overflow-hidden bg-[#0ABAB5]/20 ring-4 ring-[#0ABAB5]/5">
                <img
                  alt="User avatar"
                  className="object-cover w-full h-full"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBEcd_BqzOL-duTXG9M9FmjBIRaexD9-7myQu_sEyaHUcTw1SIaJJlOTcCACU6UDqLBGm5dlSlE5LxhfdfG6DyMMIUWXXvZMdYSGiB6Lwqb_2YfHXI3gCEgIgYINkO6sm-nQ6IUCdiTnruNpVecc84OMpuwVrqIIiUUyVef9ms7Mmfo6MzUjUGIh_lM1PLfPlIdbcOhH6qfeiT7mm8g6faxFMjocMeUEhjCPdL0z7w1FsGNdTEN5OU1zeB-bPoc5Rfh_Xso5cvr3mI"
                />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 max-w-[1600px] mx-auto w-full">
          {/* Service Flow Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Wand2 className="text-[#0ABAB5] w-5 h-5" />
                服務流程與運作原理 How It Works
              </h3>
              <span className="text-[10px] font-bold text-[#0ABAB5] uppercase tracking-[0.2em]">
                Service Journey
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                {
                  step: '01',
                  title: '碳足跡盤查',
                  desc: '收集能源與製程數據，建立企業碳排放基準線。',
                  icon: Leaf,
                },
                {
                  step: '02',
                  title: '5T 可追溯驗證',
                  desc: '透過 Traceable 鏈結技術，確保數據不可篡改且透明。',
                  icon: ShieldCheck,
                  highlight: true,
                },
                {
                  step: '03',
                  title: '熱點分析',
                  desc: '識別排放核心熱點，優化能源配置並降低碳密度。',
                  icon: BarChart3,
                },
                {
                  step: '04',
                  title: 'SBTi 目標設定',
                  desc: '對標科學減碳倡議，制定 1.5°C 減排路徑規劃。',
                  icon: FlagIcon,
                },
                {
                  step: '05',
                  title: 'ESG 永續報告',
                  desc: '生成符合國際標準之報告，強化企業競爭力與永續價值。',
                  icon: Award,
                  accent: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`backdrop-blur-md bg-white/[0.04] p-5 rounded-2xl flex flex-col gap-3 relative overflow-hidden border transition-all ${item.highlight ? 'border-[#0ABAB5]/40' : item.accent ? 'bg-[#0ABAB5]/10 border-[#0ABAB5]/20' : 'border-white/10'}`}
                >
                  <div className="absolute -right-2 -top-2 opacity-5">
                    <item.icon
                      className={`w-16 h-16 ${item.highlight || item.accent ? 'text-[#0ABAB5]' : 'text-white'}`}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#0ABAB5] font-mono tracking-widest leading-none">
                    STEP {item.step}
                  </span>
                  <h4 className="font-bold text-sm text-white">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 leading-relaxed pr-4">{item.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Scopes Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '範疇 1 (Scope 1)',
                sub: '直接排放 (Direct Emissions)',
                desc: '企業擁有或控制的排放源，如工廠製程、鍋爐、公務車燃燒等。',
                value: '3,120.2',
                icon: FactoryIcon,
              },
              {
                title: '範疇 2 (Scope 2)',
                sub: '能源間接排放 (Indirect Emissions)',
                desc: '來自外部購買的電力、蒸汽、熱能或冷能之排放。',
                value: '2,840.4',
                icon: ZapIcon,
              },
              {
                title: '範疇 3 (Scope 3)',
                sub: '其他間接排放 (Value Chain)',
                desc: '價值鏈上下游，包含租賃資產、差旅、廢棄物處理及運輸等。',
                value: '6,490.2',
                icon: Truck,
              },
            ].map((scope, i) => (
              <div
                key={i}
                className="backdrop-blur-xl bg-white/[0.02] p-6 rounded-2xl border border-white/5 relative group hover:bg-white/[0.04] transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <h4 className="font-bold text-sm text-[#0ABAB5]">{scope.title}</h4>
                  <scope.icon className="text-[#0ABAB5]/50 w-5 h-5" />
                </div>
                <p className="text-xs text-white font-bold mb-2">{scope.sub}</p>
                <p className="text-[10px] text-slate-400 mb-6 leading-relaxed line-clamp-2">
                  {scope.desc}
                </p>
                <div className="bg-[#0ABAB5]/5 p-4 rounded-xl border border-[#0ABAB5]/20">
                  <p className="text-[10px] text-[#0ABAB5] font-mono font-black tracking-wider">
                    目前數據：{scope.value} MTCO2e
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: '總排放量 Total Emissions',
                value: '12,450.8',
                unit: 'MTCO2e',
                trend: '+4.2%',
                up: true,
                icon: FactoryIcon,
              },
              {
                label: '範疇 1 (直接)',
                value: '3,120.2',
                unit: '',
                trend: '-1.5%',
                up: false,
                alpha: 0.8,
              },
              {
                label: '範疇 2 (能源)',
                value: '2,840.4',
                unit: '',
                trend: '-12.3%',
                up: false,
                alpha: 0.6,
              },
              {
                label: '範疇 3 (價值鏈)',
                value: '6,490.2',
                unit: '',
                trend: '+2.1%',
                up: true,
                alpha: 0.4,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`backdrop-blur-xl bg-white/[0.02] rounded-2xl p-6 border-l-4 border-l-[#0ABAB5] relative overflow-hidden shadow-lg ${stat.alpha ? `opacity-${Math.round(stat.alpha * 100)}` : ''}`}
              >
                <div className="absolute top-0 right-0 p-4 opacity-5">
                  <stat.icon className="w-16 h-16 text-[#0ABAB5]" />
                </div>
                <p className="text-slate-400 text-xs font-medium mb-1 truncate pr-8">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-black text-white">{stat.value}</p>
                  {stat.unit && (
                    <span className="text-[10px] text-white/30 font-bold">{stat.unit}</span>
                  )}
                </div>
                <div
                  className={`mt-2 flex items-center gap-1 text-xs font-bold uppercase tracking-widest ${stat.up ? 'text-rose-400' : 'text-[#0ABAB5]'}`}
                >
                  {stat.up ? (
                    <TrendingUpIcon className="w-3 h-3" />
                  ) : (
                    <TrendingDownIcon className="w-3 h-3" />
                  )}
                  <span>
                    {stat.trend} {stat.up ? '同比' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Chart and SBTi Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <LayoutGrid className="text-[#0ABAB5] w-5 h-5" />
                  排放強度熱力圖 Emission Intensity Heatmap
                </h3>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    區域: 全球
                  </span>
                  <span className="px-3 py-1 bg-white/5 border border-white/10 rounded text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    年份: 2024
                  </span>
                </div>
              </div>
              <div className="aspect-video lg:h-96 w-full rounded-2xl overflow-hidden relative border border-white/5 bg-background-dark/40 shadow-inner">
                {/* Mock Heatmap with image */}
                <img
                  alt="Heatmap"
                  className="w-full h-full object-cover mix-blend-screen opacity-70 filter saturate-[0.8] brightness-[0.7] sepia-[0.3] hue-rotate-[140deg]"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCntAWC90aHfdbCV0_S6jfvLHNhCNzcJhO8u0t--7Hw8AenWpPJHcZktlY4CyQ-Rl5L7ZpDET6EeWO5WH9Dvury0fGNoFqDQnpMYPblT-YuXfG4eyAfNhGWzsSlywz0cGMWfLzism5tWxxZH_JVG9erAcjC-8ZN-hqvsljBmusiC-mwEb7xy-SbeTwGC5xuYNSWjsdISNYMvQsYI_y3INvFfsgx1tHHDFW__YcxDTe7HWWWYfoUan1PVb95UNw8lFZ2X9nxM0VDLRk"
                />
                <div className="absolute inset-0 bg-[#0ABAB5]/5 pointer-events-none" />
                <div className="absolute bottom-6 right-6 backdrop-blur-md bg-black/40 px-6 py-3 rounded-2xl border border-white/10 shadow-2xl">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-[#0ABAB5] shadow-[0_0_8px_rgba(10,186,181,0.5)]" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        最佳狀態
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-[#0ABAB5]/30" />
                      <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                        中度範圍
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded bg-rose-500/60" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        臨界預警
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <ShieldCheck className="text-[#0ABAB5] w-5 h-5" />
                SBTi 目標追蹤
              </h3>
              <div className="backdrop-blur-xl bg-white/[0.02] rounded-2xl p-8 border border-white/5 space-y-8 shadow-xl">
                <div className="space-y-3">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-white/70">2030 減排目標完成度</span>
                    <span className="text-[#0ABAB5]">64% 已完成</span>
                  </div>
                  <div className="h-2.5 bg-white/5 rounded-full overflow-hidden p-[2px] border border-white/5">
                    <div
                      className="h-full bg-[#0ABAB5] rounded-full shadow-[0_0_10px_rgba(10,186,181,0.5)]"
                      style={{ width: '64%' }}
                    />
                  </div>
                </div>
                <div className="pt-6 border-t border-white/5 space-y-6">
                  {[
                    { label: '目標已驗證 Validated', sub: 'SBTi-CONF-9821', success: true },
                    { label: '符合 1.5°C 減排路徑', sub: '驗證於 2024年1月', success: true },
                    { label: 'Net-Zero 淨零標準', sub: '審核待處理 Q4', success: false },
                  ].map((goal, i) => (
                    <div
                      key={i}
                      className={`flex items-start gap-4 ${goal.success ? 'opacity-100' : 'opacity-40'}`}
                    >
                      {goal.success ? (
                        <CheckCircle2 className="text-[#0ABAB5] w-5 h-5 shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-600 shrink-0" />
                      )}
                      <div>
                        <p className="text-sm font-bold text-white leading-none mb-1">
                          {goal.label}
                        </p>
                        <p className="text-[10px] text-slate-500 italic font-mono">{goal.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Chained Logs Table */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                <Link2 className="text-[#0ABAB5] w-5 h-5" />
                5T 可追溯鏈結日誌 (5T Traceable Chained Logs)
              </h3>
              <button className="text-[10px] font-black text-[#0ABAB5] flex items-center gap-1.5 hover:brightness-125 transition-all bg-[#0ABAB5]/5 px-4 py-2 rounded-xl border border-[#0ABAB5]/20 uppercase tracking-widest">
                <span>查看區塊鏈瀏覽器</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
            <div className="backdrop-blur-xl bg-white/[0.02] rounded-2xl overflow-hidden border border-white/5 shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-white/5 border-b border-white/10 uppercase font-mono">
                    <tr>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500">
                        時間戳記
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500">
                        來源來源
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500">
                        範疇分類
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500">
                        排放強度
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500">
                        5T 驗證雜湊
                      </th>
                      <th className="px-6 py-5 text-[10px] font-black tracking-widest text-slate-500 text-right">
                        狀態
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[
                      {
                        time: '2024-05-24 14:02:11',
                        source: 'SMARTMETER_A29',
                        scope: '範疇 2',
                        value: '412.5 kgCO2e',
                        hash: '0x8a2f...9c1d',
                      },
                      {
                        time: '2024-05-24 13:45:02',
                        source: 'FLEET_TELE_88',
                        scope: '範疇 1',
                        value: '18.2 kgCO2e',
                        hash: '0x3b11...e45a',
                      },
                      {
                        time: '2024-05-24 12:10:55',
                        source: 'ERP_PROCUREMENT_INT',
                        scope: '範疇 3',
                        value: '1,204.0 kgCO2e',
                        hash: '0xf9d2...77bb',
                      },
                    ].map((log, i) => (
                      <tr key={i} className="hover:bg-white/[0.04] transition-colors group">
                        <td className="px-6 py-5 text-xs font-mono text-white/50">{log.time}</td>
                        <td className="px-6 py-5 text-xs font-bold text-white">{log.source}</td>
                        <td className="px-6 py-5">
                          <span className="px-3 py-1 rounded-lg bg-[#0ABAB5]/10 text-[#0ABAB5] text-[10px] font-black uppercase tracking-tight border border-[#0ABAB5]/20">
                            {log.scope}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-xs font-bold text-white">{log.value}</td>
                        <td className="px-6 py-5 font-mono text-[10px] text-slate-500 group-hover:text-[#0ABAB5] transition-colors">
                          {log.hash}
                        </td>
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-1.5 text-[#0ABAB5]">
                            <Link2 className="w-3.5 h-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">
                              已鏈結
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <footer className="p-12 border-t border-white/5 text-center mt-auto relative z-10 bg-black/20 backdrop-blur-md">
          <p className="text-white/20 text-[10px] uppercase font-black tracking-[0.4em]">
            JunAiKey Sustainability Service Ecosystem © 2024
          </p>
        </footer>
      </main>
    </div>
  );
};
