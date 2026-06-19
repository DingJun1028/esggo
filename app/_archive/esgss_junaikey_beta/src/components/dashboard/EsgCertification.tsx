import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎓 ESG Certification Center (v8.4.0)
 * --------------------------------------------------
 * 5T Practical Certification & Evidence Vault.
 */
export const EsgCertification = () => {
  return (
    <div className="bg-[#050c0c] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0ab8b2] rounded-full blur-[120px]" />
        <div className="w-full h-full bg-[radial-gradient(#283939_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0c]/60 backdrop-blur-xl px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#0ab8b2]/20 rounded-xl flex items-center justify-center border border-[#0ab8b2]/30 shadow-[0_0_15px_rgba(10,184,178,0.2)]">
            <span className="material-symbols-outlined text-[#0ab8b2]" style={{ fontSize: '24px' }}>
              verified
            </span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight italic">
              InfoOne <span className="text-[#0ab8b2]/60 font-normal">永續知識服務平台</span>
            </h2>
            <p className="text-[10px] text-slate-600 font-black uppercase tracking-[0.4em] italic mb-1">
              Certification Center v8.4
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex items-center gap-8">
            {['首頁', '我的課程', '認證中心'].map(n => (
              <a
                key={n}
                className="text-[10px] font-black uppercase tracking-widest italic hover:text-[#0ab8b2] transition-colors cursor-pointer"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="size-10 rounded-full border-2 border-[#0ab8b2]/50 overflow-hidden ring-4 ring-[#0ab8b2]/5">
            <div className="w-full h-full bg-slate-800" />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1200px] w-full mx-auto px-12 py-16 space-y-20 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] text-[10px] font-black tracking-[0.3em] uppercase italic">
              Official Credential
            </div>
            <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
              5T 實作認證證書
            </h1>
            <p className="text-slate-500 text-xl font-medium italic border-l-2 border-[#0ab8b2]/30 pl-8">
              5T Practical Certification |{' '}
              <span className="text-white font-black italic">學員：DingJun Hong</span>
            </p>
          </div>
          <div className="flex gap-4">
            <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl font-black italic uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">share</span>
              分享成就
            </button>
            <button className="px-8 py-4 bg-[#0ab8b2] text-[#050c0c] rounded-2xl font-black italic uppercase tracking-widest text-[10px] shadow-2xl shadow-[#0ab8b2]/20 hover:brightness-110 transition-all flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">download</span>
              下載 PDF 證書
            </button>
          </div>
        </div>

        {/* Digital Certificate Viewer */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative liquid-glass-border rounded-[4rem] p-16 md:p-24 overflow-hidden shadow-3xl flex flex-col items-center text-center space-y-12"
        >
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0ab8b2] rounded-full blur-[150px] -translate-y-1/2 translate-x-1/2" />
          </div>

          <div className="size-32 rounded-full border-2 border-dashed border-[#0ab8b2] flex items-center justify-center p-4 relative">
            <div className="absolute inset-0 bg-[#0ab8b2]/10 rounded-full blur-2xl animate-pulse" />
            <span className="material-symbols-outlined text-[#0ab8b2] text-[64px] relative z-10">
              verified
            </span>
          </div>

          <div className="space-y-4">
            <p className="text-[#0ab8b2] text-xs font-black tracking-[0.6em] uppercase italic">
              InfoOne Sustainable Excellence
            </p>
            <h2 className="text-6xl font-black italic tracking-tighter uppercase shimmer-text">
              5T 驗證合格標章
            </h2>
            <p className="text-slate-500 text-sm font-medium italic max-w-2xl mx-auto leading-relaxed">
              茲證明該學員已成功完成 30
              天數位轉型旅程，並通過核心實作評鑑，具備企業級數位轉型之關鍵技術與執行能力。
            </p>
          </div>

          <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-[3rem] p-16 grid grid-cols-1 md:grid-cols-2 gap-12 text-left backdrop-blur-xl">
            {[
              { l: '學員姓名 Name', v: 'DingJun Hong', big: true },
              { l: '證書編號 Credential ID', v: '5T-2023-INFO-8829', mono: true },
              { l: '頒發日期 Issued Date', v: '2026.01.26' },
              { l: '認證級別 Level', v: 'Mastery Professional', highlight: true },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <p className="text-[9px] text-slate-600 font-black uppercase tracking-widest italic">
                  {item.l}
                </p>
                <p
                  className={`italic font-black tracking-tight ${item.big ? 'text-4xl' : item.mono ? 'font-mono text-sm text-[#0ab8b2]' : item.highlight ? 'text-xl text-[#0ab8b2]' : 'text-xl'}`}
                >
                  {item.v}
                </p>
              </div>
            ))}
          </div>

          <div className="px-8 py-3 bg-black/40 rounded-full border border-white/10 flex items-center gap-4 text-[10px] font-mono text-slate-500 italic">
            <span className="material-symbols-outlined text-sm text-[#0ab8b2]">lock</span>
            Blockchain Verified: 0x8f2a...f9e2
          </div>
        </motion.div>

        {/* Evidence Vault */}
        <section className="space-y-12">
          <div className="flex items-center justify-between px-6 border-l-4 border-[#0ab8b2]">
            <div className="space-y-2">
              <h2 className="text-3xl font-black italic tracking-tighter uppercase">
                數位證據保險箱 <span className="text-[#0ab8b2]/40">(Evidence Vault)</span>
              </h2>
              <p className="text-slate-500 text-sm font-medium italic">
                以下為 30 天數位轉型旅程中累積的不可竄改實踐紀錄
              </p>
            </div>
            <div className="hidden lg:block px-6 py-2 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 rounded-full text-[10px] text-[#0ab8b2] font-black italic tracking-widest uppercase">
              每一項成就都是不可竄改的真理
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                t: '數據驅動決策模型',
                d: '完成基於企業核心業務的數據流建模，實現實時戰略監控與預測能力。',
                date: '2026-01-02',
              },
              {
                t: '敏捷架構實作紀錄',
                d: '建立跨部門敏捷協作架構，優化 35% 數位流程冗餘度，大幅提升運營效率。',
                date: '2026-01-15',
              },
              {
                t: '永續數位化指標',
                d: '導入數位減碳追蹤系統，將 ESG 指標無縫整合至業務執行環節。',
                date: '2026-01-26',
              },
            ].map((ev, i) => (
              <div
                key={i}
                className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 hover:border-[#0ab8b2]/30 transition-all group flex flex-col space-y-6"
              >
                <div className="size-16 rounded-2xl bg-[#0ab8b2]/10 flex items-center justify-center text-[#0ab8b2] group-hover:bg-[#0ab8b2] group-hover:text-[#050c0c] transition-all">
                  <span className="material-symbols-outlined text-[32px]">analytics</span>
                </div>
                <h3 className="text-xl font-black italic tracking-tight uppercase leading-tight group-hover:text-[#0ab8b2] transition-colors">
                  {ev.t}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed italic">{ev.d}</p>
                <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[9px] font-mono text-slate-600 italic">LOG: {ev.date}</span>
                  <div className="flex items-center gap-2 text-[#0ab8b2] text-[10px] font-black italic uppercase">
                    <span className="material-symbols-outlined text-sm">verified</span>
                    驗證通過
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <style>{`
                .liquid-glass-border { background: rgba(16, 34, 34, 0.6); backdrop-filter: blur(20px); border: 2px solid rgba(10, 184, 178, 0.2); }
                .shimmer-text { background: linear-gradient(90deg, #fff, #0ab8b2, #fff); background-size: 200% auto; -webkit-background-clip: text; -webkit-text-fill-color: transparent; animation: shimmer 3s linear infinite; }
                @keyframes shimmer { to { background-position: 200% center; } }
                .shadow-3xl { box-shadow: 0 60px 120px -30px rgba(0, 0, 0, 0.8), 0 40px 80px -40px rgba(10, 184, 178, 0.1); }
            `}</style>
    </div>
  );
};
