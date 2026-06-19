import React from 'react';
import { motion } from 'framer-motion';

/**
 * 📊 ESG Data Visualization (v2.4.0)
 * --------------------------------------------------
 * "5T Visualization" standards.
 * Focus: Tangible to Trustworthy logic, "4 OKs 1 NOT OK" state machine, liquid chart specs.
 */
export const EsgDataVisualization = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Liquid Gradient */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-40%] right-[-10%] w-[70%] h-[70%] rounded-full bg-[#0df2df]/5 blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-20%] w-[60%] h-[60%] rounded-full bg-cyan-500/5 blur-[130px]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">hub</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase">
                Data Visualization v2.4.0
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="搜尋視覺指標..."
                className="h-10 w-64 bg-white/5 border border-white/10 rounded-full pl-12 pr-6 text-xs font-medium focus:outline-none focus:border-[#0df2df]/40 transition-all"
              />
            </div>
            <button className="h-10 px-6 bg-[#0df2df] text-[#050c0b] rounded-full text-xs font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-lg active:scale-95">
              導出規範
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-24 z-10">
        {/* Hero Section */}
        <div className="space-y-8">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic"
          >
            Truth Discovery Engine
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-7xl md:text-8xl font-black italic tracking-tighter uppercase leading-[0.85]"
          >
            Trust <span className="text-[#0df2df]">Visualization</span>
            <br />
            Logic Gates
          </motion.h1>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-[#0df2df]/30 pl-8">
              5T 視覺化不僅是圖表，它是數據的主權證明。我們將隱晦的 ESG
              數據轉化為可感知、可觸摸的「誠信實體」。這是一場從有形（Tangible）到信賴（Trustworthy）的鍊金術。
            </p>
            <div className="flex gap-10">
              {[
                { label: 'Active Standards', value: '55+' },
                { label: 'Rendering Speed', value: '4ms' },
                { label: 'Data Fidelity', value: '100%' },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-3xl font-black italic text-white">{stat.value}</p>
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* The 5T Logic Pipeline */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            01. 5T 核心視覺管線
          </h2>
          <div className="relative p-1 bg-white/5 border border-white/10 rounded-[3rem] overflow-hidden backdrop-blur-3xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0df2df]/5 to-transparent pointer-events-none" />
            <div className="relative grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-white/10">
              {[
                { t: 'Tangible', ic: 'blur_on', desc: '數據實體化與質感映射', color: '#0df2df' },
                { t: 'Traceable', ic: 'history', desc: '全時序溯源鏈條可視化', color: '#2dd4bf' },
                { t: 'Trackable', ic: 'analytics', desc: '動態溢價與趨勢捕捉', color: '#14b8a6' },
                {
                  t: 'Transparent',
                  ic: 'visibility',
                  desc: '光譜解析度與全透明架構',
                  color: '#0d9488',
                },
                {
                  t: 'Trustworthy',
                  ic: 'verified_user',
                  desc: '最終誠信簽章與主權鎖定',
                  color: '#ffffff',
                },
              ].map((step, i) => (
                <div key={i} className="p-10 space-y-6 hover:bg-[#0df2df]/5 transition-all group">
                  <div className="size-16 rounded-2xl bg-black/20 border border-white/10 flex items-center justify-center group-hover:border-[#0df2df]/50 transition-all">
                    <span
                      className="material-symbols-outlined text-[32px]"
                      style={{ color: step.color }}
                    >
                      {step.ic}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-xl font-black italic tracking-tighter uppercase font-heading">
                      {step.t}
                    </h4>
                    <p className="text-xs text-slate-500 italic leading-relaxed">{step.desc}</p>
                  </div>
                  {i < 4 && (
                    <div className="hidden md:flex absolute right-[-20px] top-1/2 -translate-y-1/2 z-20">
                      <span className="material-symbols-outlined text-white/10 text-4xl">
                        chevron_right
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* State Machine Visualization */}
        <div className="grid lg:grid-cols-2 gap-16">
          <div className="space-y-10">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">
              02. 誠信狀態預檢機
            </h2>
            <p className="text-slate-400 italic leading-relaxed">
              我們定義了「4 OKs 1 NOT OK」的安全過濾機制。當數據通過 Tangible、Traceable、Trackable
              與 Transparent 驗證後，方可進入 Trustworthy 最終鎖定狀態。
            </p>
            <div className="space-y-4">
              {[
                { label: 'Verified Integrity', status: 'OK', color: '#0df2df' },
                { label: 'Temporal Continuity', status: 'OK', color: '#0df2df' },
                { label: 'Schema Alignment', status: 'OK', color: '#0df2df' },
                { label: 'Node Symmetry', status: 'NOT OK', color: '#ff4d4d' },
              ].map((row, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center h-16 px-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`size-3 rounded-full ${row.status === 'OK' ? 'bg-[#0df2df]' : 'bg-[#ff4d4d]'} animate-pulse`}
                    />
                    <span className="text-sm font-black italic tracking-widest uppercase">
                      {row.label}
                    </span>
                  </div>
                  <span className="text-xs font-mono font-bold italic" style={{ color: row.color }}>
                    {row.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-[#0df2df]/5 border border-[#0df2df]/20 rounded-[3rem] p-12 flex flex-col items-center justify-center space-y-12 shadow-3xl overflow-hidden relative group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(13,242,223,0.1)_0%,transparent_70%)]" />
            <motion.div
              animate={{ scale: [1, 1.05, 1], rotate: [0, 5, 0] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="relative size-64 bg-black/40 border border-white/10 rounded-full flex items-center justify-center shadow-2xl backdrop-blur-3xl"
            >
              <span className="material-symbols-outlined text-[#0df2df] text-[100px] drop-shadow-[0_0_40px_rgba(13,242,223,0.8)]">
                security
              </span>
              <div
                className="absolute inset-4 border border-[#0df2df]/20 rounded-full border-dashed animate-spin"
                style={{ animationDuration: '60s' }}
              />
            </motion.div>
            <div className="text-center space-y-2 z-10">
              <h4 className="text-2xl font-black italic tracking-tighter uppercase font-heading">
                Trust Locked
              </h4>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] italic">
                Security Level: 5T Elite Signature Required
              </p>
            </div>
          </div>
        </div>

        {/* Visual Tokens & Rules */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            03. 視覺組件與質感規範
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Liquid Glass Cards',
                desc: '25px Blur / 10% Saturation / 1px Tiffany Border',
                ic: 'dashboard',
              },
              {
                title: 'Neon Pulse Tags',
                desc: 'Interactive state indicators with tiffany-glow effect',
                ic: 'token',
              },
              {
                title: 'Hierarchical Belts',
                desc: 'Journey-based navigation with parallax halo paths',
                ic: 'route',
              },
            ].map((rule, i) => (
              <div
                key={i}
                className="p-8 rounded-[2rem] bg-white/[0.03] border border-white/5 hover:border-[#0df2df]/30 transition-all space-y-6 group"
              >
                <div className="size-14 rounded-xl bg-[#0df2df]/10 flex items-center justify-center text-[#0df2df] group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[28px]">{rule.ic}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black italic tracking-tighter uppercase font-heading">
                    {rule.title}
                  </h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{rule.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-3 opacity-40">
          <span className="material-symbols-outlined text-[16px]">shield</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
            © 2024 ESGss JunAiKey. DATA PRIVACY & TRUTH DEPT.
          </p>
        </div>
        <div className="flex gap-10">
          {['VERIFICATION LOG', 'SYSTEM ARCH', '5T DOCS'].map(l => (
            <a
              key={l}
              className="text-[10px] font-black uppercase tracking-[0.2em] hover:text-[#0df2df] transition-colors cursor-pointer italic"
            >
              {l}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.5); }
            `}</style>
    </div>
  );
};
