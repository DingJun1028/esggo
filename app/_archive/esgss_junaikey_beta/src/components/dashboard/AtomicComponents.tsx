import React from 'react';
import { motion } from 'framer-motion';

/**
 * ⚛️ Atomic Components (v1.0.4)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" Core Library.
 * Focus: Buttons, Inputs, 5T Tags, Navigation, Micro-interactions.
 */
export const AtomicComponents = () => {
  return (
    <div className="bg-[#051110] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Liquid Noise */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_70%_30%,rgba(13,242,223,0.15)_0%,transparent_50%)]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#051110]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30 ring-4 ring-[#0df2df]/5">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">diamond</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase">
                Atomic Components v1.0.4
              </p>
            </div>
          </div>
          <button className="h-10 px-8 bg-white/5 border border-white/10 rounded-full text-[10px] font-black italic uppercase tracking-widest hover:bg-[#0df2df]/10 transition-all flex items-center gap-3 group">
            <span className="material-symbols-outlined text-[16px] group-hover:scale-125 transition-transform">
              download
            </span>
            Export Library
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-24 z-10">
        {/* Hero Section */}
        <div className="max-w-4xl space-y-8">
          <span className="px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic">
            Precision & Elegance
          </span>
          <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
            Design <span className="text-[#0df2df]">Atoms</span> &<br />
            Molecular UI
          </h1>
          <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-[#0df2df]/30 pl-8">
            每一個原子組件都承載著系統的完整誠信。我們不只是在打造按鈕與輸入框，我們是在構建用戶與真實誠信（Truth）互動的觸點。
          </p>
        </div>

        {/* Component Categories */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Buttons & Actions */}
          <div className="space-y-10 group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#0df2df] text-[28px]">
                smart_button
              </span>
              <h2 className="text-2xl font-black italic tracking-tight uppercase">
                01. 按鈕與交互動作
              </h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 space-y-12 backdrop-blur-3xl shadow-2xl transition-all group-hover:border-[#0df2df]/20">
              <div className="space-y-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  Primary Actions / Liquid Flow
                </p>
                <div className="flex flex-wrap gap-6">
                  <button className="h-14 px-10 bg-[#0df2df] text-[#051110] rounded-2xl font-black italic uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(13,242,223,0.3)]">
                    實體化驗證
                  </button>
                  <button className="h-14 px-10 bg-white/5 border border-white/10 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-3 group">
                    探索更多
                    <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  Micro-Interaction / Icon Buttons
                </p>
                <div className="flex gap-4">
                  {[
                    { ic: 'search', label: 'Search' },
                    { ic: 'edit_sqare', label: 'Edit' },
                    { ic: 'download', label: 'Save' },
                  ].map((btn, i) => (
                    <button
                      key={i}
                      className="size-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0df2df]/20 hover:border-[#0df2df]/40 transition-all group"
                    >
                      <span className="material-symbols-outlined text-white group-hover:text-[#0df2df] group-hover:scale-110 transition-all">
                        {btn.ic}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Form Controls */}
          <div className="space-y-10 group">
            <div className="flex items-center gap-4">
              <span className="material-symbols-outlined text-[#0df2df] text-[28px]">label</span>
              <h2 className="text-2xl font-black italic tracking-tight uppercase">
                02. 輸入與表單控制
              </h2>
            </div>
            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-12 space-y-10 backdrop-blur-3xl shadow-2xl transition-all group-hover:border-[#0df2df]/20">
              <div className="space-y-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  Standard Input / 1px Glass Border
                </p>
                <div className="relative group/input">
                  <span className="material-symbols-outlined absolute left-6 top-1/2 -translate-y-1/2 text-[#0df2df] text-xl opacity-40 group-focus-within/input:opacity-100 transition-opacity">
                    fingerprint
                  </span>
                  <input
                    type="text"
                    placeholder="輸入存證哈希值..."
                    className="w-full h-16 bg-white/[0.03] border border-white/10 rounded-2xl pl-16 pr-8 text-sm font-medium italic focus:outline-none focus:border-[#0df2df]/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">
                  5T Badge System
                </p>
                <div className="flex flex-wrap gap-3">
                  {['Tangible', 'Traceable', 'Trackable', 'Transparent', 'Trustworthy'].map(
                    (t, i) => (
                      <span
                        key={i}
                        className="px-4 py-1.5 h-8 bg-[#0df2df]/10 border border-[#0df2df]/20 rounded-full text-[9px] font-black italic uppercase tracking-tighter text-[#0df2df] flex items-center gap-2"
                      >
                        <span className="size-1.5 rounded-full bg-[#0df2df] animate-pulse" />
                        {t}
                      </span>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Animation & States */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            03. 狀態反饋與微動態設計
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Interactive Focus',
                ic: 'animation',
                desc: '觸發時的蒂芬尼藍光暈與尺寸補償 (Box-shadow Scale)',
              },
              {
                title: 'Loading Logic',
                ic: 'sync_alt',
                desc: '循環液態漸變路徑，模擬數據的真實流動性',
              },
              {
                title: 'Status Lockdown',
                ic: 'lock',
                desc: '從解鎖到鎖定的動態插畫轉換 (Morphing Animation)',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-[2rem] p-8 space-y-6 hover:bg-[#0df2df]/5 hover:border-[#0df2df]/20 transition-all group"
              >
                <div className="size-16 bg-black/40 rounded-2xl border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#0df2df] text-[32px]">
                    {card.ic}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-lg font-black italic tracking-tighter uppercase font-heading">
                    {card.title}
                  </h4>
                  <p className="text-xs text-slate-500 italic leading-relaxed">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex justify-between items-center opacity-40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[14px]">palette</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
            System Components Ver. 1.0.4 Rev A
          </p>
        </div>
        <div className="flex gap-12 font-black text-[10px] uppercase tracking-widest italic">
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Accessibility</a>
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Figma Library</a>
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
            `}</style>
    </div>
  );
};
