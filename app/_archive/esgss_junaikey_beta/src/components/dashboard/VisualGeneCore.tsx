import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🧬 Visual Gene Core (v1.0)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" Aesthetic Manual.
 * Focus: Lexend Typography, Core Colors, 5T Logic Gates.
 */
export const VisualGeneCore = () => {
  return (
    <div className="bg-[#051a19] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Liquid Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0df2df]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#22d3ee]/5 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#051a19]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30">
              <svg
                className="text-[#0df2df] size-6"
                fill="none"
                viewBox="0 0 48 48"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase">
                Visual Gene Core v1.0
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-24 z-10">
        {/* Intro Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <span className="px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic">
              The Designer's Bible
            </span>
            <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
              Visual <span className="text-[#0df2df]">Gene</span>
              <br />
              Manifesto
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-[#0df2df]/30 pl-6">
              JunAiKey 的視覺基因基於「液態玻璃」與「誠信光谱」。我們不僅在設計
              UI，更在定義信任的厚度與誠信的波長。
            </p>
            <div className="flex gap-4">
              <button className="h-14 px-8 bg-[#0df2df] text-[#051a19] rounded-2xl font-black italic uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(13,242,223,0.3)]">
                下載基因圖譜
              </button>
              <button className="h-14 px-8 bg-white/5 border border-white/10 text-white rounded-2xl font-black italic uppercase tracking-widest hover:bg-white/10 transition-all">
                核心色標
              </button>
            </div>
          </div>
          <div className="relative aspect-square flex items-center justify-center">
            <div className="absolute inset-0 bg-[#0df2df]/5 rounded-full blur-[100px] animate-pulse" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
              className="relative size-[400px] border border-white/10 rounded-full flex items-center justify-center"
            >
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 p-4"
                  style={{ transform: `rotate(${i * 30}deg)` }}
                >
                  <div className="size-2 bg-[#0df2df] rounded-full shadow-[0_0_10px_#0df2df]" />
                </div>
              ))}
              <div className="absolute inset-20 border border-[#0df2df]/20 rounded-full border-dashed" />
              <span className="material-symbols-outlined text-[120px] text-[#0df2df]/80 animate-pulse">
                auto_awesome
              </span>
            </motion.div>
          </div>
        </div>

        {/* Typography & Colors */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            01. 基因組成：文字與色彩
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 space-y-8">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#0df2df]">
                Lexend Typography
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-5xl font-black tracking-tighter uppercase italic">
                    The Future is Truth
                  </p>
                  <p className="text-xs text-slate-500 font-mono italic">
                    Lexend Black Italic / -0.05 tracking
                  </p>
                </div>
                <div className="h-px bg-white/5" />
                <div className="space-y-3">
                  <p className="text-slate-400 leading-relaxed italic">
                    文字不僅是訊息，更是視覺的錨點。Lexend 的幾何純粹性完美契合了 5T 的結構化誠信。
                  </p>
                  <div className="flex gap-4">
                    {['800', '600', '400'].map(w => (
                      <span key={w} className={`text-sm font-[${w}] text-[#0df2df]`}>
                        ABC {w}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-10 space-y-8">
              <h3 className="text-xl font-bold uppercase tracking-widest text-[#0df2df]">
                Liquid Spectrum
              </h3>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { color: '#0df2df', label: 'Primary Tiffany', code: 'HSL 174, 90%, 50%' },
                  { color: '#22d3ee', label: 'Cyan Flow', code: 'HSL 188, 86%, 53%' },
                  { color: '#ffffff', label: 'Pure Integrity', code: 'HSL 0, 0%, 100%' },
                  { color: '#051a19', label: 'Deep Void', code: 'HSL 174, 60%, 8%' },
                ].map((c, i) => (
                  <div key={i} className="space-y-3">
                    <div
                      className="h-20 rounded-2xl shadow-xl"
                      style={{ backgroundColor: c.color }}
                    />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider">{c.label}</p>
                      <p className="text-[10px] text-slate-500 font-mono">{c.code}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 5T Iconography Concepts */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            02. 5T 語意化圖標規範
          </h2>
          <p className="text-slate-400 italic">
            我們使用 Material Symbols Outlined 作為基礎，並賦予其 5T 層級的視覺權重。
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: 'hub',
                label: 'Service Hub',
                desc: '節點聚合與服務分發',
                weight: 'Fill@0, Wght@300',
              },
              {
                icon: 'account_tree',
                label: 'Logic Flow',
                desc: '5T 數據流向與關聯',
                weight: 'Fill@0, Wght@400',
              },
              {
                icon: 'terminal',
                label: 'Core Engine',
                desc: '系統開發與底層接口',
                weight: 'Fill@1, Wght@600',
              },
              {
                icon: 'storage',
                label: 'Trust Vault',
                desc: '資產鎖定與誠信存證',
                weight: 'Fill@0, Wght@500',
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8 flex flex-col items-center text-center gap-6 hover:bg-[#0df2df]/5 transition-all group"
              >
                <div className="size-20 bg-black/20 rounded-3xl flex items-center justify-center border border-white/10 group-hover:border-[#0df2df]/30 group-hover:scale-110 transition-all">
                  <span className="material-symbols-outlined text-[#0df2df] text-[36px]">
                    {item.icon}
                  </span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black italic tracking-widest uppercase">{item.label}</h4>
                  <p className="text-xs text-slate-500 italic">{item.desc}</p>
                  <div className="h-px w-8 mx-auto bg-white/10 mt-4" />
                  <p className="text-[9px] text-[#0df2df]/60 font-mono font-bold uppercase tracking-tighter">
                    {item.weight}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* UI Components Teaser */}
        <div className="bg-gradient-to-r from-[#0df2df]/10 to-transparent border border-white/5 rounded-3xl p-12">
          <div className="flex flex-wrap justify-between items-center gap-12">
            <div className="space-y-6 max-w-xl">
              <h3 className="text-3xl font-black italic tracking-tighter uppercase">
                03. 組件庫預覽
              </h3>
              <p className="text-slate-400 italic leading-relaxed">
                從按鈕到卡片，每一個組件都注入了「液態玻璃」的靈魂。不僅是美學，更是功能性的精準表達。
              </p>
              <button className="flex items-center gap-3 text-[#0df2df] font-black italic uppercase tracking-widest group">
                前往組件實驗室
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">
                  arrow_forward
                </span>
              </button>
            </div>
            <div className="flex-1 min-w-[300px] flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-[#0df2df]/20 blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-white/5 border border-white/10 p-1 rounded-3xl backdrop-blur-3xl">
                  <div className="bg-[#051a19] rounded-2xl p-8 space-y-6 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="size-3 rounded-full bg-red-400" />
                      <div className="size-3 rounded-full bg-yellow-400" />
                      <div className="size-3 rounded-full bg-green-400" />
                    </div>
                    <div className="space-y-4">
                      <div className="h-4 w-32 bg-white/10 rounded-full" />
                      <div className="h-4 w-48 bg-white/10 rounded-full" />
                      <div className="h-32 w-full bg-[#0df2df]/5 border border-[#0df2df]/20 rounded-xl flex items-center justify-center">
                        <span className="material-symbols-outlined text-[#0df2df]/40 text-[48px]">
                          deployed_code
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-slate-500">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[14px]">info</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
            © 2024 ESGss JunAiKey. DESIGN GENETICS DEPARTMENT.
          </p>
        </div>
        <div className="flex gap-12">
          {['BRAND MANUAL', 'COLOR SPEC', 'ASSET PACK'].map(link => (
            <a
              key={link}
              className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-[#0df2df] transition-colors cursor-pointer italic"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
            `}</style>
    </div>
  );
};
