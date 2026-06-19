import React from 'react';
import { motion } from 'framer-motion';

/**
 * 🛠️ Tech Pillars Showcase (v8.4.0)
 * --------------------------------------------------
 * OCR, 4T Protocol, and ZKP Visualization.
 */
export const TechPillarsShowcase = () => {
  return (
    <div className="bg-[#050c0c] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,rgba(10,184,178,0.1),transparent)]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0c]/60 backdrop-blur-xl px-12 h-20 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#0ab8b2]/20 rounded-xl flex items-center justify-center border border-[#0ab8b2]/30">
            <span className="material-symbols-outlined text-[#0ab8b2] text-[24px]">terminal</span>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tight italic">
              技術解密 <span className="text-[#0ab8b2]">Tech Pillars</span>
            </h2>
            <p className="text-[10px] text-[#0ab8b2]/60 tracking-[0.4em] font-black uppercase italic">
              Pillar Showcase v8.4
            </p>
          </div>
        </div>
        <div className="flex items-center gap-8">
          <nav className="hidden md:flex gap-8">
            {['技術概覽', '實戰價值', '轉型手冊'].map(n => (
              <a
                key={n}
                className="text-[10px] font-black uppercase tracking-widest italic hover:text-[#0ab8b2] transition-colors cursor-pointer"
              >
                {n}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <div className="text-right">
              <p className="text-[10px] font-black text-[#0ab8b2] uppercase italic leading-none">
                DingJun Hong
              </p>
              <p className="text-[8px] text-slate-600 font-bold uppercase tracking-widest mt-1">
                System Admin
              </p>
            </div>
            <div className="size-10 rounded-full bg-[#0ab8b2]/20 border border-[#0ab8b2]/30 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#0ab8b2]">account_circle</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-12 py-16 space-y-20 z-10">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-2xl">
            <h1 className="text-7xl font-black tracking-tighter italic uppercase leading-[0.9]">
              數位轉型
              <br />
              <span className="text-[#0ab8b2]">技術解密看板</span>
            </h1>
            <p className="text-slate-400 text-xl font-medium italic border-l-2 border-[#0ab8b2]/30 pl-8 leading-relaxed">
              探索 OCR、4T 協議與 ZKP 如何轉化為企業核心生產力，實現無紙化與信任自動化。
            </p>
          </div>
          <button className="bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#050c0c] px-10 py-5 rounded-2xl font-black italic uppercase tracking-widest shadow-2xl shadow-[#0ab8b2]/20 flex items-center gap-3 active:scale-95 transition-all">
            <span className="material-symbols-outlined">auto_stories</span>
            導引手冊下載
          </button>
        </div>

        {/* Automation Flow Visualization */}
        <div className="relative bg-white/[0.02] border border-white/10 rounded-[4rem] p-16 overflow-hidden group hover:border-[#0ab8b2]/30 transition-all">
          <div
            className="absolute inset-0 opacity-10 pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, #0ab8b2 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />
          <div className="relative z-10 flex flex-col items-center gap-16">
            <h3 className="text-[10px] font-black text-[#0ab8b2] tracking-[0.6em] uppercase italic">
              數據自動化流轉示範流程
            </h3>
            <div className="w-full flex flex-col lg:flex-row items-center justify-between gap-8 relative px-10">
              {[
                { t: 'OCR 識別', icon: 'document_scanner', d: '發票/單據秒級轉化' },
                { t: '4T 協議驗證', icon: 'verified_user', d: '可追溯性與誠信架構' },
                { t: '區塊鏈鎖定', icon: 'link', d: '不可篡改存證完成', main: true },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                    <div
                      className={`size-24 rounded-3xl flex items-center justify-center transition-all ${step.main ? 'bg-[#0ab8b2] text-[#050c0c] shadow-[0_0_50px_rgba(10,184,178,0.4)]' : 'bg-[#0ab8b2]/10 border border-[#0ab8b2]/30 text-[#0ab8b2] group-hover:scale-110'}`}
                    >
                      <span className="material-symbols-outlined text-[48px]">{step.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-black italic text-lg tracking-tight uppercase">
                        {step.t}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-bold italic mt-1">{step.d}</p>
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="hidden lg:block h-px flex-1 bg-gradient-to-r from-[#0ab8b2]/40 to-transparent" />
                  )}
                </React.Fragment>
              ))}
            </div>
            <div className="mt-8 px-8 py-3 bg-[#0ab8b2]/10 rounded-full border border-[#0ab8b2]/20">
              <p className="text-[10px] font-black text-slate-400 italic">
                <span className="text-[#0ab8b2] font-black mr-2">動態監控:</span> 當前處理速率 1,240
                筆/小時 | 安全等級：軍事級 ZKP 驗證中
              </p>
            </div>
          </div>
        </div>

        {/* Tech Pillars Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              t: 'OCR 與 AI 自動化',
              desc: '融合深度學習模型，精準識別各類複雜表單、手寫文字與發票資訊。',
              val: '將紙本數據秒級轉化為結構化資訊，減少 95% 手工錄入錯誤。',
              ic: 'psychology',
              badge: 'ACTIVE',
            },
            {
              t: '4T 協議與區塊鏈',
              desc: 'Traceability, Transparency, Trust, Timeliness。構建多方信任的數據流轉標準。',
              val: '確保每一筆交易具備可追溯性，打造無須信任中介的自動化協作流程。',
              ic: 'hub',
              badge: 'CORE PROTOCOL',
              highlight: true,
            },
            {
              t: 'ZKP 零知識證明',
              desc: '在不洩漏任何敏感原始數據的前提下，完成身份或內容的數學驗證。',
              val: '既滿足法規合規，又保護商業機密，實現數據「可用不可見」。',
              ic: 'enhanced_encryption',
              badge: 'ENCRYPTED',
            },
          ].map((p, i) => (
            <div
              key={i}
              className={`p-12 rounded-[3.5rem] border ${p.highlight ? 'bg-[#0ab8b2]/5 border-[#0ab8b2]/40 shadow-2xl' : 'bg-white/[0.02] border-white/5'} flex flex-col space-y-8 group transition-all hover:-translate-y-2`}
            >
              <div className="flex justify-between items-start">
                <div className="size-16 rounded-2xl bg-[#0ab8b2]/20 flex items-center justify-center text-[#0ab8b2] group-hover:bg-[#0ab8b2] group-hover:text-[#050c0c] transition-all">
                  <span className="material-symbols-outlined text-[32px]">{p.ic}</span>
                </div>
                <span className="text-[8px] font-black px-2 py-0.5 border border-white/10 rounded uppercase tracking-widest text-slate-500">
                  {p.badge}
                </span>
              </div>
              <h3 className="text-2xl font-black italic tracking-tighter uppercase">{p.t}</h3>
              <p className="text-sm text-slate-400 italic leading-relaxed">{p.desc}</p>
              <div className="bg-white/5 p-6 rounded-3xl border border-white/5">
                <p className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-[0.2em] italic mb-2">
                  實戰價值：誠信架構
                </p>
                <p className="text-[11px] text-white/60 italic leading-relaxed">{p.val}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Case Study / Video Preview */}
        <div className="grid lg:grid-cols-2 gap-20 items-center py-20">
          <div className="space-y-10">
            <h2 className="text-5xl font-black italic tracking-tighter uppercase">
              如何將技術
              <br />
              轉化為生產力？
            </h2>
            <p className="text-slate-500 text-lg leading-relaxed italic">
              觀看實戰案例影片，了解傳統企業如何透過三大支柱將處理成本降低
              60%，並將合規風險降至趨近於零。
            </p>
            <div className="space-y-6">
              {[
                { t: '自動化審核工作流', d: '縮短審批週期，從數天降至數分鐘。' },
                { t: '跨部門信任橋接', d: '4T 協議讓財務、物流、供應鏈數據無縫對接。' },
              ].map((item, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <span className="material-symbols-outlined text-[#0ab8b2] mt-1">
                    check_circle
                  </span>
                  <div>
                    <h4 className="font-black italic text-lg tracking-tight uppercase">{item.t}</h4>
                    <p className="text-sm text-slate-500 italic mt-1">{item.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-2 bg-gradient-to-br from-[#0ab8b2]/40 to-transparent rounded-[3rem] shadow-3xl">
            <div className="relative aspect-video bg-[#050c0c] rounded-[2.8rem] overflow-hidden group cursor-pointer border border-[#0ab8b2]/20">
              <div className="absolute inset-0 bg-slate-900 opacity-60 group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="size-20 bg-[#0ab8b2] text-[#050c0c] rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[40px] font-black">
                    play_arrow
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
