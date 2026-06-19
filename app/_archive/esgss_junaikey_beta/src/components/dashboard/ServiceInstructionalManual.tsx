import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🎓 Service & Instructional Manual (v2.4.0)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" Service Standards.
 * Focus: Journey Belt, Halo Guidance, AI Assistant, Gestures.
 */
export const ServiceInstructionalManual = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_40%,rgba(13,242,223,0.2)_0%,transparent_50%)]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30 ring-4 ring-[#0df2df]/5">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">school</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase">
                Service Manual v2.4.0
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-24 z-10">
        {/* Hero section */}
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          <div className="space-y-8">
            <span className="px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic">
              The Art of Guidance
            </span>
            <h1 className="text-7xl font-black italic tracking-tighter uppercase leading-[0.9]">
              Service <span className="text-[#0df2df]">Journey</span>
              <br />& Protocol
            </h1>
            <p className="text-slate-400 text-lg leading-relaxed italic border-l-2 border-[#0df2df]/30 pl-8">
              引導不應是干擾，而應是與數據共舞的旋律。在 JunAiKey，我們定義了 Service Journey Belt
              與 Halo Guidance，確保用戶在 5T 的宇宙中永不迷航。
            </p>
          </div>
          <div className="bg-[#0df2df]/5 border border-[#0df2df]/20 rounded-[3rem] p-12 space-y-8 relative overflow-hidden group">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.4)_0%,transparent_60%)] pointer-events-none" />
            <h3 className="text-xl font-bold italic tracking-widest uppercase text-[#0df2df] relative underline decoration-4 underline-offset-8">
              Core Service Pillars
            </h3>
            <div className="grid grid-cols-2 gap-8 relative">
              {[
                { ic: 'route', t: 'Journey Belt', d: '線性交互流向規範' },
                { ic: 'blur_circular', t: 'Halo Path', d: '非同步反饋與光暈引導' },
                { ic: 'chat_bubble', t: 'Sentient Assist', d: '感知式 AI 校研對話' },
                { ic: 'gesture', t: 'Natural Motion', d: '本能式手勢與微動態' },
              ].map((p, i) => (
                <div key={i} className="space-y-2 group/pillar">
                  <span className="material-symbols-outlined text-[#0df2df]/80 group-hover/pillar:text-[#0df2df] transition-colors">
                    {p.ic}
                  </span>
                  <h5 className="font-black text-sm italic tracking-tight">{p.t}</h5>
                  <p className="text-[10px] text-slate-500 italic">{p.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 30-Day Learning Blueprint (New v8.4.0) */}
        <div className="space-y-16 py-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase">
              30-Day <span className="text-[#0df2df]">ESG Blueprint</span>
            </h2>
            <p className="text-slate-500 text-sm font-black tracking-[0.2em] italic uppercase">
              數位轉型導引手冊：從數據盤查到文化覺醒
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                day: 'Day 0',
                title: '啟程與引導',
                icon: 'flag',
                color: 'slate-400',
                desc: '4T 協議認知、SSOT 環境建置。',
              },
              {
                day: 'Day 1-7',
                title: '數據證據庫',
                icon: 'evidence_base',
                color: 'cyan-400',
                desc: 'OCR 自動識別、區塊鏈數據錨定。',
              },
              {
                day: 'Day 8-14',
                title: 'AI 智慧計算',
                icon: 'psychology',
                color: '#0df2df',
                desc: 'Scope 1/2/3 自動化、合規診斷。',
              },
              {
                day: 'Day 15-30',
                title: '信任與報告',
                icon: 'verified',
                color: 'white',
                desc: 'ZKP 驗證碼、一鍵生成合規報告。',
              },
            ].map((phase, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-6 relative overflow-hidden group cursor-pointer hover:border-[#0df2df]/40 transition-all"
              >
                <div className="size-12 rounded-xl bg-[#0df2df]/10 flex items-center justify-center border border-[#0df2df]/20 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[#0df2df]">{phase.icon}</span>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-[#0df2df] uppercase tracking-widest">
                    {phase.day}
                  </p>
                  <h3 className="text-xl font-black italic tracking-tighter">{phase.title}</h3>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed italic">{phase.desc}</p>
                <div className="absolute top-4 right-6 text-[40px] font-black opacity-[0.03] italic group-hover:opacity-[0.08] transition-opacity">
                  0{i + 1}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Journey Belt Section */}
        <div className="space-y-12">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase">
            01. Service Journey Belt (UX Flow)
          </h2>
          <div className="relative p-12 bg-white/[0.02] border border-white/10 rounded-[4rem] group hover:border-[#0df2df]/30 transition-all">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12 relative z-10">
              {[
                { t: 'Discovery', ic: 'search' },
                { t: 'Verification', ic: 'analytics' },
                { t: 'Hardening', ic: 'lock' },
                { ic: 'auto_awesome', main: true },
                { t: 'Lockdown', ic: 'policy' },
                { t: 'Asset Delivery', ic: 'download' },
                { t: 'Refinement', ic: 'auto_fix_high' },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  {step.main ? (
                    <div className="relative">
                      <div className="absolute inset-[-40px] bg-[#0df2df]/20 rounded-full blur-[40px] animate-pulse" />
                      <div className="size-24 bg-[#0df2df] text-[#050c0b] rounded-full flex items-center justify-center shadow-[0_0_30px_#0df2df] ring-8 ring-[#0df2df]/10 relative z-10">
                        <span className="material-symbols-outlined text-[48px] font-black">
                          {step.ic}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 group/step">
                      <div className="size-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/step:bg-[#0df2df]/20 transition-all">
                        <span className="material-symbols-outlined text-white/40 group-hover/step:text-[#0df2df] transition-colors">
                          {step.ic}
                        </span>
                      </div>
                      <span className="text-[10px] font-black italic tracking-widest uppercase opacity-40 group-hover/step:opacity-100">
                        {step.t}
                      </span>
                    </div>
                  )}
                  {i < 6 && <div className="hidden md:block h-px w-8 bg-white/10" />}
                </React.Fragment>
              ))}
            </div>
            {/* Background Parallax Path */}
            <div className="absolute inset-x-20 top-1/2 h-px bg-gradient-to-r from-transparent via-[#0df2df]/20 to-transparent -translate-y-1/2 blur-[1px] pointer-events-none" />
          </div>
        </div>

        {/* 30-Day Learning Path Section */}
        <div className="space-y-12">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase font-heading text-center">
            30-Day ESG Transformation Journey
          </h2>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              {
                day: 'Day 01-05',
                title: '數據感測基礎',
                desc: '建立能耗與排放的實體化感測模型。',
                active: true,
              },
              {
                day: 'Day 06-12',
                title: '5T 邏輯建模',
                desc: '將業務流程映射至 5T [4+1] 狀態機。',
                active: true,
              },
              {
                day: 'Day 13-18',
                title: '區塊鏈存證實踐',
                desc: '執行數據雜湊鎖定與鏈上驗證流程。',
                active: false,
              },
              {
                day: 'Day 19-25',
                title: 'AI 策略優化',
                desc: '利用導師 AI 進行減碳情境模擬分析。',
                active: false,
              },
              {
                day: 'Day 26-30',
                title: '最終認證審核',
                desc: '完成年度永續報告書與 5T 實作認證。',
                active: false,
              },
            ].map((p, i) => (
              <div
                key={i}
                className={`p-8 rounded-[2.5rem] border ${p.active ? 'bg-[#0df2df]/10 border-[#0df2df]/40 shadow-2xl shadow-[#0df2df]/10' : 'bg-white/5 border-white/10 opacity-40'} flex flex-col gap-4`}
              >
                <span className="text-[10px] font-black text-[#0df2df] uppercase tracking-widest">
                  {p.day}
                </span>
                <h4 className="font-black italic text-lg uppercase tracking-tight">{p.title}</h4>
                <p className="text-[10px] text-slate-500 italic leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center opacity-40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-[14px]">settings</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
            System Protocols Ver. 2.4.0 Final
          </p>
        </div>
        <div className="flex gap-12 font-black text-[10px] uppercase tracking-widest italic">
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Deployment Spec</a>
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Validation API</a>
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
                .shadow-3xl { box-shadow: 0 50px 100px -20px rgba(0, 0, 0, 0.5), 0 30px 60px -30px rgba(0, 0, 0, 0.5); }
            `}</style>
    </div>
  );
};
