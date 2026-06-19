import React from 'react';
import { motion } from 'framer-motion';

/**
 * 💎 5T Verified & Locked (v1.0.0)
 * --------------------------------------------------
 * Final success confirmation screen for JunAiKey.
 * Focus: Tiffany Glass Cube, Signature Overlay, Zero-Hallucination Status.
 */
export const VerifiedLockedSuccess = () => {
  return (
    <div className="bg-[#0a1413] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Background Refraction Effect */}
      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <svg
          fill="none"
          height="100%"
          viewBox="0 0 800 450"
          width="100%"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="400"
            cy="225"
            r="200"
            stroke="#0df2df"
            strokeDasharray="10 10"
            strokeWidth="0.5"
          />
          <g opacity="0.5">
            <circle cx="100" cy="100" fill="#0df2df" r="2" />
            <line stroke="#0df2df" strokeWidth="0.5" x1="100" x2="320" y1="100" y2="180" />
            <circle cx="700" cy="100" fill="#0df2df" r="2" />
            <line stroke="#0df2df" strokeWidth="0.5" x1="700" x2="480" y1="100" y2="180" />
          </g>
        </svg>
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#0a1413]/80 backdrop-blur-md">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="size-8 bg-[#0df2df]/20 rounded-lg flex items-center justify-center border border-[#0df2df]/30">
              <svg
                className="text-[#0df2df] size-5"
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
            <h2 className="text-lg font-bold tracking-tight italic">
              ESGss <span className="text-[#0df2df]">JunAiKey</span>
            </h2>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {['服務概覽', '驗證紀錄', '安全中心'].map(item => (
              <a
                key={item}
                className="text-sm font-medium hover:text-[#0df2df] transition-colors cursor-pointer italic font-black uppercase tracking-widest"
              >
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {['settings', 'notifications'].map((icon, idx) => (
              <button
                key={idx}
                className="size-10 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 group"
              >
                <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                  {icon}
                </span>
              </button>
            ))}
            <div className="h-8 w-[1px] bg-white/10 mx-1" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-black italic tracking-tight uppercase">DingJun Hong</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none">
                  Premium User
                </p>
              </div>
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-[#0df2df]/30 shadow-lg"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-6 py-16 flex flex-col items-center space-y-12 z-10">
        {/* Headline Section */}
        <div className="text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic"
          >
            <span className="material-symbols-outlined text-[14px]">verified</span>
            SECURE PROTOCOL V5.0
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-white tracking-tighter text-5xl md:text-7xl font-black italic leading-tight uppercase"
          >
            5T 驗證成功：
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0df2df] to-white/40">
              資產已鎖定
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-400 text-lg font-medium max-w-2xl mx-auto italic tracking-tight leading-relaxed text-justify"
          >
            ESGss JunAiKey: 全系統 5T 狀態最終檢查與資產鎖定。24 個服務節點已完整封裝。
          </motion.p>
        </div>

        {/* Central Asset Packaging Visual */}
        <div className="relative w-full max-w-4xl aspect-[16/9] flex items-center justify-center">
          <motion.div
            initial={{ rotate: 12, scale: 0.8, opacity: 0 }}
            animate={{ rotate: 6, scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            className="relative z-10 w-64 h-64 md:w-80 md:h-80 box-border"
          >
            <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-[#0df2df]/40 via-[#0df2df]/10 to-white/5 backdrop-blur-[40px] border border-white/30 shadow-[inset_0_0_50px_rgba(13,242,223,0.3),0_50px_100px_rgba(0,0,0,0.6)] flex flex-col items-center justify-center overflow-hidden">
              {/* Inner Core Icon */}
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <span
                  className="material-symbols-outlined text-[#0df2df]"
                  style={{
                    fontSize: '120px',
                    filter: 'drop-shadow(0 0 30px rgba(13,242,223,0.8))',
                  }}
                >
                  security
                </span>
              </motion.div>

              {/* Signature Overlay */}
              <div className="absolute bottom-12 w-full text-center">
                <p
                  className="text-[#0df2df]/80 text-3xl md:text-4xl tracking-widest px-4 italic font-black"
                  style={{ fontFamily: 'Brush Script MT, cursive' }}
                >
                  DingJun Hong
                </p>
                <div className="mt-2 h-[1px] w-32 mx-auto bg-gradient-to-r from-transparent via-[#0df2df]/50 to-transparent" />
              </div>

              {/* Subtle Scanlines */}
              <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,#0df2df_3px)]" />
            </div>

            {/* Peripheral Node Indicator */}
            <div className="absolute -top-6 -right-6 bg-[#0df2df] text-[#0a1413] px-5 py-2 rounded-xl text-xs font-black tracking-[0.3em] uppercase italic shadow-2xl">
              Locked
            </div>
          </motion.div>
        </div>

        {/* Stats Grid */}
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: 'verified_user',
              label: '驗證狀態',
              title: '5T 零幻覺通過',
              sub: 'AI Hallucination Filter: Active',
            },
            {
              icon: 'hub',
              label: '服務節點',
              title: '24 / 24 已鎖定',
              sub: 'Node Convergence: 100%',
            },
            {
              icon: 'fingerprint',
              label: '數位簽章',
              title: '丁俊洪 授權完成',
              sub: 'Timestamp: 2023-10-24 14:30',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="bg-[#0df2df]/5 backdrop-blur-xl border border-[#0df2df]/20 rounded-3xl p-8 flex flex-col gap-3 shadow-xl hover:bg-[#0df2df]/10 transition-all border-l-4 border-l-[#0df2df]"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#0df2df] text-[22px]">
                  {stat.icon}
                </span>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] italic">
                  {stat.label}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-white text-xl font-black italic tracking-tight">{stat.title}</p>
                <p className="text-[#0df2df]/60 text-[9px] font-bold uppercase tracking-widest">
                  {stat.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Success Message Banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-4xl bg-[#0df2df]/5 border border-[#0df2df]/10 rounded-2xl py-8 px-10 text-center shadow-inner"
        >
          <p className="text-[#0df2df] font-bold italic tracking-tight leading-relaxed">
            所有 <span className="text-white uppercase font-black">24 項</span> 服務設計規範已通過{' '}
            <span className="text-white font-black">5T 零幻覺驗證</span>
            。資產現在已被完整封裝，可安全提取。
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-8 w-full max-w-xl pb-10">
          <button className="flex-1 group relative overflow-hidden flex items-center justify-center gap-4 h-16 bg-[#0df2df] text-[#0a1413] rounded-2xl font-black italic uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-[0_20px_40px_rgba(13,242,223,0.3)]">
            <span className="material-symbols-outlined">description</span>
            生成最終校驗報告
          </button>
          <button className="flex-1 flex items-center justify-center gap-4 h-16 bg-white/5 border border-[#0df2df]/40 text-white rounded-2xl font-black italic uppercase tracking-widest backdrop-blur-md transition-all hover:bg-[#0df2df]/10 hover:scale-105 active:scale-95">
            <span className="material-symbols-outlined">cloud_download</span>
            進入下載中心
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-[1280px] mx-auto px-6 py-12 border-t border-white/5 bg-black/5 z-10 backdrop-blur-3xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 opacity-40">
            <span className="material-symbols-outlined text-sm">copyright</span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic">
              2024 ESGss JunAiKey. Powered by 5T Zero-Hallucination Engine.
            </span>
          </div>
          <div className="flex gap-10">
            {['隱私權政策', '服務條款', '聯絡支援'].map(item => (
              <a
                key={item}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-[#0df2df] transition-colors cursor-pointer italic"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
