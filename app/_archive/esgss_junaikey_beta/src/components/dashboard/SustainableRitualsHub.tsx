import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🧘 Sustainable Rituals Hub (v8.4.0)
 * --------------------------------------------------
 * Daily rituals, weekly strategies, and value ladder progress.
 */
export const SustainableRitualsHub = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#3df5e6]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#1a3331,_#102221)]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="text-[#3df5e6] flex items-center justify-center">
              <span className="material-symbols-outlined text-[32px]">eco</span>
            </div>
            <h1 className="text-xl font-black tracking-tighter italic">
              永續儀式中心{' '}
              <span className="text-[#9cbab7] font-normal text-sm ml-2 tracking-widest uppercase">
                Sustainable Rituals Hub
              </span>
            </h1>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            {['儀表板', '每日儀式', '每週戰略', '價值階梯'].map((n, i) => (
              <a
                key={n}
                className={`text-[10px] font-black uppercase tracking-widest italic cursor-pointer transition-colors ${i === 0 ? 'text-[#3df5e6] border-b border-[#3df5e6] pb-1' : 'text-[#9cbab7] hover:text-white'}`}
              >
                {n}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-6">
          <div className="size-10 rounded-full border border-[#3df5e6]/30 overflow-hidden ring-4 ring-[#3df5e6]/5">
            <div className="w-full h-full bg-slate-800" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-12 space-y-12 z-10">
        {/* Profile Header */}
        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col md:flex-row justify-between items-center gap-10 backdrop-blur-3xl">
          <div className="flex items-center gap-8">
            <div className="relative">
              <div className="size-28 rounded-full border-2 border-[#3df5e6] p-1.5 shadow-[0_0_30px_rgba(61,245,230,0.2)]">
                <div className="w-full h-full rounded-full bg-slate-700" />
              </div>
              <div className="absolute bottom-1 right-1 size-6 bg-[#3df5e6] rounded-full border-4 border-[#050c0b] shadow-xl"></div>
            </div>
            <div className="space-y-2">
              <h2 className="text-4xl font-black italic tracking-tighter uppercase leading-none">
                歡迎回來，DingJun Hong
              </h2>
              <div className="flex items-center gap-6">
                <p className="text-[#9cbab7] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
                  <span className="material-symbols-outlined text-sm text-[#3df5e6]">
                    event_available
                  </span>
                  今日進度：已完成 60%
                </p>
                <p className="text-[#9cbab7] text-xs font-black uppercase tracking-[0.2em] flex items-center gap-2 italic">
                  <span className="material-symbols-outlined text-sm text-[#3df5e6]">schedule</span>
                  最後更新：2026年01月26日 12:30
                </p>
              </div>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black italic uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">edit</span>
              編輯個人檔案
            </button>
            <button className="px-8 py-4 bg-[#3df5e6] text-[#050c0b] rounded-2xl font-black italic uppercase tracking-widest text-[10px] shadow-2xl shadow-[#3df5e6]/20 hover:brightness-110 transition-all flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">download</span>
              導出報告
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Daily Rituals */}
          <div className="space-y-8">
            <div className="bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl">
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-[#3df5e6]/5">
                <h3 className="text-sm font-black italic tracking-[0.3em] flex items-center gap-3 uppercase">
                  <span className="material-symbols-outlined text-[#3df5e6]">wb_sunny</span>
                  每日儀式 (15-30 分鐘)
                </h3>
                <span className="text-[9px] bg-[#3df5e6]/20 text-[#3df5e6] px-3 py-1 rounded-full font-black uppercase">
                  2/3 完成
                </span>
              </div>
              <div className="p-8 space-y-4">
                {[
                  { t: 'Bento Dashboard 數據巡檢', d: '查看關鍵 KPI 異常值與警報', checked: true },
                  { t: '數據 OCR 自動化更新', d: '同步昨日工廠產能與能耗報告', checked: true },
                  { t: 'AI 策略對話與反饋', d: '確認今日減碳優化建議', checked: false },
                ].map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-6 p-5 rounded-3xl hover:bg-white/5 cursor-pointer transition-all border border-transparent hover:border-[#3df5e6]/20 group"
                  >
                    <div
                      className={`size-6 rounded-lg border-2 flex items-center justify-center transition-all ${step.checked ? 'bg-[#3df5e6] border-[#3df5e6]' : 'border-slate-700 group-hover:border-[#3df5e6]'}`}
                    >
                      {step.checked && (
                        <span className="material-symbols-outlined text-[#050c0b] text-sm font-bold">
                          check
                        </span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-black italic tracking-tight group-hover:text-[#3df5e6] transition-colors">
                        {step.t}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold italic">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* OCR Action Panel */}
            <div className="bg-[#3df5e6]/5 border-2 border-[#3df5e6]/20 rounded-[3rem] p-10 space-y-6 relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="font-black italic text-xl tracking-tighter uppercase">
                    OCR 數據同步中心
                  </p>
                  <p className="text-slate-500 text-[10px] font-bold italic uppercase leading-relaxed tracking-wider">
                    拖放文件或點擊上傳最新的永續數據。
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#3df5e6] text-[48px] opacity-40 group-hover:opacity-100 transition-opacity">
                  upload_file
                </span>
              </div>
              <div className="border-2 border-dashed border-[#3df5e6]/30 rounded-3xl p-10 flex flex-col items-center justify-center bg-[#050c0b]/40 hover:border-[#3df5e6] transition-all cursor-pointer">
                <button className="bg-[#3df5e6]/10 text-[#3df5e6] px-8 py-3 rounded-2xl text-[10px] font-black italic uppercase tracking-widest border border-[#3df5e6]/20 hover:bg-[#3df5e6] hover:text-[#050c0b] transition-all">
                  上傳文件
                </button>
                <p className="text-slate-600 text-[8px] mt-4 font-mono font-black uppercase tracking-[0.4em]">
                  Supports PDF, JPG, PNG
                </p>
              </div>
            </div>
          </div>

          {/* Weekly Strategic War Room */}
          <div className="lg:col-span-2 space-y-8">
            <div className="flex justify-between items-center px-4">
              <h3 className="text-2xl font-black italic tracking-tighter uppercase flex items-center gap-4">
                <span className="material-symbols-outlined text-[#3df5e6]">query_stats</span>
                每週戰略規劃{' '}
                <span className="text-[#3df5e6]/40 font-mono text-sm ml-2">(2-4 小時)</span>
              </h3>
              <div className="flex gap-4">
                <button className="size-10 bg-white/5 rounded-xl flex items-center justify-center hover:text-[#3df5e6] transition-all backdrop-blur-sm shadow-xl">
                  <span className="material-symbols-outlined text-[20px]">fullscreen</span>
                </button>
                <button className="size-10 bg-white/5 rounded-xl flex items-center justify-center hover:text-[#3df5e6] transition-all backdrop-blur-sm shadow-xl">
                  <span className="material-symbols-outlined text-[20px]">settings</span>
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
              {/* Trend Observer */}
              <div className="bg-white/5 border border-white/10 rounded-[3rem] p-10 flex flex-col space-y-10 backdrop-blur-3xl relative overflow-hidden group">
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <h4 className="text-xl font-black italic tracking-tighter uppercase">
                      War Room 趨勢觀察
                    </h4>
                    <p className="text-slate-500 text-[10px] font-bold italic uppercase tracking-widest pl-4 border-l border-[#3df5e6]/30">
                      碳權價格與能耗趨勢對比
                    </p>
                  </div>
                  <span className="text-[8px] bg-[#3df5e6]/20 text-[#3df5e6] px-3 py-1 rounded-full font-black uppercase animate-pulse">
                    即時數據
                  </span>
                </div>
                <div className="flex-1 flex items-end gap-3 h-48 relative px-4">
                  {[40, 60, 45, 80, 95, 70, 55].map((h, i) => (
                    <div
                      key={i}
                      className={`flex-1 rounded-t-xl transition-all relative group/bar ${i === 4 ? 'bg-[#3df5e6] shadow-[0_0_25px_rgba(61,245,230,0.3)]' : 'bg-slate-800 hover:bg-[#3df5e6]/40'}`}
                      style={{ height: `${h}%` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-[10px] font-mono font-black italic invisible group-hover/bar:visible">
                        W0{i + 1}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-6">
                  {[
                    { l: '能效提升', val: '+12.4%', c: 'text-[#3df5e6]' },
                    { l: '碳足跡', val: '-5.2%', c: 'text-red-400' },
                    { l: '合規率', val: '98%', c: 'text-white' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center space-y-1">
                      <p className="text-[8px] text-slate-600 font-black uppercase tracking-widest italic">
                        {stat.l}
                      </p>
                      <p className={`text-xl font-black italic tracking-tighter ${stat.c}`}>
                        {stat.val}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Agent Insight Card */}
              <div className="bg-gradient-to-br from-[#1c2a29] to-[#050c0b] border border-[#3df5e6]/20 rounded-[3rem] p-10 flex flex-col space-y-8 backdrop-blur-3xl shadow-3xl">
                <div className="flex items-center gap-6">
                  <div className="size-14 rounded-2xl bg-[#3df5e6]/20 flex items-center justify-center text-[#3df5e6] border border-[#3df5e6]/20">
                    <span className="material-symbols-outlined text-[32px]">psychology</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xl font-black italic tracking-tighter uppercase">
                      AI 代理分析報告
                    </h4>
                    <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest">
                      生成於 2 小時前
                    </p>
                  </div>
                </div>
                <div className="space-y-6 flex-1 pr-4 custom-scrollbar overflow-y-auto">
                  <div className="p-6 rounded-3xl bg-[#3df5e6]/5 border-l-4 border-[#3df5e6] space-y-2">
                    <p className="text-[10px] font-black text-[#3df5e6] uppercase tracking-widest italic">
                      關鍵洞察
                    </p>
                    <p className="text-xs text-white/80 leading-relaxed italic">
                      供應鏈端 B 類供應商碳排放超出預期 15%，建議啟動二級審核機制。
                    </p>
                  </div>
                  <div className="p-6 rounded-3xl bg-white/5 border-l-4 border-slate-700 space-y-3">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                      戰略建議
                    </p>
                    <ul className="text-[10px] space-y-3 list-none pl-2 text-slate-400">
                      <li className="flex items-start gap-3">
                        <span className="size-1 rounded-full bg-[#3df5e6] mt-1.5" />
                        重新分配綠色能源憑證比例
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="size-1 rounded-full bg-[#3df5e6] mt-1.5" />
                        優化物流路線以降低 Scope 3 排放
                      </li>
                    </ul>
                  </div>
                </div>
                <button className="w-full py-4 border border-[#3df5e6]/30 rounded-2xl text-[#3df5e6] text-[10px] font-black italic uppercase tracking-widest hover:bg-[#3df5e6]/10 transition-all active:scale-95">
                  查看完整戰略報告
                </button>
              </div>
            </div>

            {/* Value Ladder KPI Tracking */}
            <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 backdrop-blur-3xl shadow-2xl space-y-12">
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <h4 className="text-2xl font-black italic tracking-tighter uppercase">
                    價值階梯 (Value Ladder) KPI 追蹤
                  </h4>
                  <p className="text-slate-500 text-[10px] font-black italic uppercase tracking-widest">
                    從數位化到永續引領的轉型進程
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-[9px] text-[#3df5e6] font-black uppercase tracking-[0.4em] italic mb-1">
                    當前等級
                  </p>
                  <p className="text-4xl font-black text-[#3df5e6] italic tracking-tighter">
                    LEVEL 03
                  </p>
                </div>
              </div>

              <div className="relative pt-12">
                <div className="absolute top-16 left-0 w-full h-1 bg-slate-800 -z-0 rounded-full" />
                <div className="absolute top-16 left-0 w-[60%] h-1 bg-[#3df5e6] -z-0 rounded-full shadow-[0_0_15px_rgba(61,245,230,0.5)]" />
                <div className="grid grid-cols-5 gap-4 relative z-10">
                  {[
                    { l: 'L1', n: '基礎合規', done: true },
                    { l: 'L2', n: '數據透明', done: true },
                    { l: 'L3', n: '策略優化', active: true },
                    { l: 'L4', n: '品牌差異' },
                    { l: 'L5', n: '永續引領' },
                  ].map((lvl, i) => (
                    <div key={i} className="flex flex-col items-center gap-6">
                      {lvl.active ? (
                        <div className="size-12 rounded-full bg-[#3df5e6] flex items-center justify-center shadow-[0_0_30px_rgba(61,245,230,0.6)] border-4 border-[#050c0b] -mt-2">
                          <span className="material-symbols-outlined text-[#050c0b] font-black text-2xl">
                            trending_up
                          </span>
                        </div>
                      ) : (
                        <div
                          className={`size-8 rounded-full flex items-center justify-center transition-all ${lvl.done ? 'bg-[#3df5e6] shadow-[0_0_15px_rgba(61,245,230,0.3)]' : 'bg-slate-800'}`}
                        >
                          {lvl.done && (
                            <span className="material-symbols-outlined text-[#050c0b] text-base font-black">
                              check
                            </span>
                          )}
                          {!lvl.done && <div className="size-1.5 rounded-full bg-slate-700" />}
                        </div>
                      )}
                      <div className="text-center space-y-1">
                        <p
                          className={`text-[10px] font-black italic tracking-widest ${lvl.done || lvl.active ? 'text-[#3df5e6]' : 'text-slate-700'}`}
                        >
                          {lvl.l}
                        </p>
                        <p
                          className={`text-[11px] font-black italic uppercase tracking-tight ${lvl.active ? 'text-white underline underline-offset-8 decoration-2 decoration-[#3df5e6]' : 'text-slate-600'}`}
                        >
                          {lvl.n}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Value Matrix */}
        <div className="pt-20 border-t border-white/5 grid grid-cols-1 md:grid-cols-5 gap-8">
          {[
            { lvl: '等級一', t: '數位基礎設施', d: '完成所有數據點聯網。狀態：100%' },
            { lvl: '等級二', t: '透明度與報告', d: '自動化週報系統生成。狀態：100%' },
            {
              lvl: '等級三',
              t: 'AI 輔助優化',
              d: '透過 AI 減少 10% 能耗。狀態：45%',
              active: true,
            },
            { lvl: '等級四', t: '綠色供應鏈', d: '需先完成等級三目標。鎖定中' },
            { lvl: '等級五', t: '淨零引領者', d: '全價值鏈淨零排放。鎖定中' },
          ].map((step, i) => (
            <div
              key={i}
              className={`p-8 rounded-[2rem] border transition-all ${step.active ? 'bg-[#3df5e6]/5 border-[#3df5e6]/30 shadow-2xl shadow-[#3df5e6]/5' : 'bg-white/[0.02] border-white/5 opacity-40'}`}
            >
              <p className="text-[10px] font-black text-[#3df5e6] uppercase tracking-[0.4em] italic mb-3">
                {step.lvl}
              </p>
              <h5 className="font-black italic text-sm tracking-tight mb-2 uppercase">{step.t}</h5>
              <p className="text-[9px] text-slate-500 font-bold italic leading-relaxed">{step.d}</p>
            </div>
          ))}
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40 backdrop-blur-3xl">
        <p className="text-[10px] font-black italic uppercase tracking-[0.4em]">
          © 2026 Sustainable Rituals Hub. Designed for Transformation Experts.
        </p>
        <div className="flex gap-10">
          <a className="text-[10px] font-black italic uppercase tracking-widest hover:text-[#3df5e6] transition-colors cursor-pointer">
            Privacy Spec
          </a>
          <a className="text-[10px] font-black italic uppercase tracking-widest hover:text-[#3df5e6] transition-colors cursor-pointer">
            Technical Support
          </a>
        </div>
      </footer>

      <style>{`
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.7), 0 30px 60px -30px rgba(0, 242, 223, 0.05); }
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(61, 245, 230, 0.2); border-radius: 10px; }
            `}</style>
    </div>
  );
};
