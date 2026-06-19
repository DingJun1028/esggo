import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🛡️ Data Validation Portal (v8.4.0)
 * --------------------------------------------------
 * 5T Validation Matrix & Zero-Hallucination Engine.
 */
export const DataValidationPortal = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_#1a3331,_#102221)]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl px-8 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30 ring-4 ring-[#0df2df]/5">
            <span className="material-symbols-outlined text-[#0df2df] text-[24px]">
              verified_user
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight italic">
              InfoOne <span className="text-[#0df2df]">永續知識服務平台</span>
            </h2>
            <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase italic">
              Validation Portal v8.4
            </p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <button className="btn-cosmic px-6 py-2 text-xs">導出稽核軌跡</button>
          <div className="size-10 rounded-full bg-slate-800 border border-[#0df2df]/30" />
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-12 space-y-12 z-10">
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="space-y-2">
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-tight">
              5T 數據驗證
              <br />
              <span className="text-[#0df2df]">與零幻覺驗算</span>
            </h1>
            <div className="flex items-center gap-3">
              <span className="flex h-2 w-2 rounded-full bg-[#0df2df] animate-pulse" />
              <p className="text-[#0df2df]/70 text-sm font-bold uppercase tracking-widest italic">
                當前標準：ISO-14064-1 組織溫室氣體排放核算
              </p>
            </div>
          </div>
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black italic uppercase tracking-widest hover:border-[#0df2df]/40 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">sync</span>
            更新數據源
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              label: '活動數據 (AD)',
              value: '45,000',
              unit: 'kWh',
              delta: '+0.0%',
              icon: 'bolt',
              sub: 'VERIFIED SOURCE',
            },
            {
              label: '排放係數 (EF)',
              value: '0.495',
              unit: 'kgCO2e/度',
              delta: '-2.1%',
              icon: 'factory',
              sub: 'LATEST DB V2.4',
            },
            {
              label: '全球暖化潛勢 (GWP)',
              value: '1.00',
              unit: 'CO2',
              delta: 'AR6',
              icon: 'public',
              sub: 'STANDARD',
            },
          ].map((s, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-3xl p-10 relative overflow-hidden group hover:border-[#0df2df]/30 transition-all"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-6xl text-[#0df2df]">{s.icon}</span>
              </div>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] italic">
                {s.label}
              </p>
              <p className="text-4xl font-black italic tracking-tighter mt-4 text-[#0df2df]">
                {s.value} <span className="text-sm font-normal text-slate-500">{s.unit}</span>
              </p>
              <div className="flex items-center gap-3 mt-4">
                <span
                  className={`text-[10px] font-bold ${s.delta.startsWith('+') ? 'text-emerald-400' : 'text-orange-400'}`}
                >
                  {s.delta}
                </span>
                <span className="text-[8px] text-slate-600 font-black uppercase tracking-widest italic">
                  {s.sub}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 5T Validation Matrix */}
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">
              5T 檢驗指標狀態{' '}
              <span className="text-[#0df2df]/40 font-mono text-sm ml-4">VALIDATION MATRIX</span>
            </h2>
            <div className="h-px w-full bg-gradient-to-r from-[#0df2df]/20 to-transparent" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                t: 'Traceable',
                d: '憑證 ID: #INV-2023-9901 已鏈結。',
                active: true,
                ic: 'account_tree',
              },
              {
                t: 'Transparent',
                d: '計算邏輯公開。執行點：A2 Node。',
                active: true,
                ic: 'visibility',
              },
              {
                t: 'Trustworthy',
                d: '第三方係數庫交叉比對中。',
                active: false,
                ic: 'verified_user',
              },
              { t: 'Timely', d: '數據更新頻率：每 15 分鐘。', active: true, ic: 'update' },
              { t: 'Total', d: '範疇三邊界定義確認中。', active: false, ic: 'all_out' },
            ].map((m, i) => (
              <div
                key={i}
                className={`p-8 rounded-3xl border ${m.active ? 'bg-[#0df2df]/5 border-[#0df2df]/30' : 'bg-white/5 border-white/10 opacity-50'} space-y-4`}
              >
                <div className="flex justify-between items-center">
                  <span
                    className={`material-symbols-outlined ${m.active ? 'text-[#0df2df]' : 'text-slate-500'}`}
                  >
                    {m.ic}
                  </span>
                  {m.active && (
                    <span className="text-[8px] bg-[#0df2df] text-[#050c0b] px-2 py-0.5 rounded font-black">
                      VALIDATED
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-black italic tracking-widest uppercase">{m.t}</h3>
                <p className="text-[10px] text-slate-400 leading-relaxed italic">{m.d}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Engine & Logic */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col space-y-10 relative overflow-hidden backdrop-blur-3xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <span className="text-[10px] font-black text-[#0df2df] tracking-[0.4em] uppercase italic">
                Zero Hallucination Engine
              </span>
              <span className="text-[8px] text-slate-600 font-mono">ISO-14064:2018 CALCULATOR</span>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-8">
              <div className="flex items-center gap-6 w-full">
                {['AD', 'EF', 'GWP'].map((p, i) => (
                  <React.Fragment key={i}>
                    <div className="flex-1 p-6 rounded-2xl bg-[#050c0b] border border-[#0df2df]/20 text-center">
                      <p className="text-[8px] text-[#0df2df]/40 font-black uppercase tracking-widest">
                        {p}
                      </p>
                      <p className="text-xl font-bold italic mt-2">
                        {i === 0 ? '45,000' : i === 1 ? '0.495' : '1.00'}
                      </p>
                    </div>
                    {i < 2 && <span className="text-[#0df2df] font-black text-2xl">{'×'}</span>}
                  </React.Fragment>
                ))}
              </div>
              <span className="material-symbols-outlined text-[#0df2df] text-4xl animate-bounce">
                expand_more
              </span>
              <div className="w-full p-10 rounded-[2.5rem] bg-[#0df2df]/10 border-2 border-[#0df2df] border-dashed flex flex-col items-center shadow-[0_0_50px_rgba(13,242,223,0.1)]">
                <p className="text-[10px] text-[#0df2df] font-black uppercase tracking-[0.4em] mb-4 italic">
                  Validated Emission Result
                </p>
                <p className="text-6xl font-black italic tracking-tighter">
                  22,275.00{' '}
                  <span className="text-xl font-medium text-white/40 uppercase">kgCO2e</span>
                </p>
              </div>
              <p className="text-[10px] text-slate-500 italic text-center max-w-sm">
                {'「此演算由確定性算法生成，非 AI 生成預測，確保數據零幻覺 (Zero Hallucination)」'}
              </p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-12 flex flex-col space-y-8 relative overflow-hidden backdrop-blur-3xl">
            <div className="flex justify-between items-center border-b border-white/5 pb-6">
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0df2df] text-sm">
                  enhanced_encryption
                </span>
                <span className="text-[10px] font-black text-[#0df2df] tracking-[0.4em] uppercase italic">
                  Evidence Vault
                </span>
              </div>
              <span className="text-[8px] text-slate-600 font-mono">CHAIN LOG: LIVE</span>
            </div>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {[
                {
                  time: '14:22:01',
                  msg: '[憑證鏈結] 成功與 Q3_Elec.pdf 關聯',
                  hash: '0x82f...a9c2',
                  status: 'primary',
                },
                {
                  time: '14:21:45',
                  msg: '[係數驗證] 符合 2023 能源署公告值',
                  hash: 'SOURCE: MOEA.GOV',
                  status: 'primary',
                },
                {
                  time: '14:20:12',
                  msg: '[異常檢測] 高於去年同期 12%',
                  hash: 'FLAG: SEASONAL_OUTLIER',
                  status: 'orange',
                },
                {
                  time: '14:18:30',
                  msg: '[系統日誌] 主管發起自動驗算',
                  hash: 'SESSION: #8892-AD30',
                  status: 'primary',
                },
              ].map((log, i) => (
                <div
                  key={i}
                  className={`p-5 rounded-2xl bg-white/5 border-l-4 ${log.status === 'primary' ? 'border-[#0df2df]' : 'border-orange-500'} flex gap-6`}
                >
                  <span className="text-[9px] font-mono text-slate-600 pt-1">{log.time}</span>
                  <div className="space-y-1">
                    <p className="text-xs font-bold italic">{log.msg}</p>
                    <p className="text-[8px] font-mono text-slate-500">{log.hash}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="text-[#0df2df] text-[10px] font-black italic uppercase tracking-widest hover:underline pt-4">
              查看完整鏈式稽核日誌 (Audit Ledger)
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
