import React from 'react';
import { motion } from 'framer-motion';

/**
 * 📦 Final Asset Download Center (v1.1.0)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" Asset Delivery Portal.
 * Focus: Integrity Passport Sync, Digital Signature Evidence, 5T Elite Verification.
 */
export const AssetDownloadCenter = () => {
  return (
    <div className="bg-[#050c0b] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden transition-colors duration-300">
      {/* Ambient Nebula Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-40">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0df2df]/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-950/20 blur-[120px]" />
      </div>

      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#050c0b]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30 ring-4 ring-[#0df2df]/5">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">
                deployed_code
              </span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase italic">
                Asset Control Protocol v8.1
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="hidden lg:flex items-center gap-3 px-6 py-2 bg-white/5 border border-white/10 rounded-full hover:border-[#0df2df]/30 transition-all cursor-pointer">
              <span className="material-symbols-outlined text-[#0df2df] text-[18px] animate-pulse">
                verified_user
              </span>
              <span className="text-[10px] font-black italic uppercase tracking-widest bg-gradient-to-r from-[#0df2df] to-cyan-400 bg-clip-text text-transparent">
                Passport Synchronized
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black italic tracking-tighter uppercase leading-none">
                  DingJun Hong
                </p>
                <p className="text-[9px] text-[#0df2df]/60 font-black uppercase tracking-[0.2em] mt-1 italic">
                  Sovereign Admin
                </p>
              </div>
              <div className="size-12 rounded-2xl bg-[#1c2a29] border border-[#0df2df]/30 p-1 shadow-2xl overflow-hidden group">
                <div className="w-full h-full rounded-xl bg-slate-800 group-hover:scale-110 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-20 space-y-20 z-10">
        {/* Headline Section */}
        <div className="space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 text-[#0df2df] text-[10px] font-black tracking-[0.3em] uppercase italic"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0df2df] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0df2df]"></span>
            </span>
            5T Elite Verification • Locked
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            className="text-7xl font-black tracking-tighter italic uppercase leading-[0.9]"
          >
            最終資產交付協議
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0df2df] via-cyan-400 to-[#0df2df] animate-gradient-x">
              SSOT DOWNLOAD
            </span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 text-xl font-medium leading-relaxed italic border-l-2 border-[#0df2df]/30 pl-8"
          >
            所有 <span className="text-white font-black italic">24 項</span> 服務核心資產已完成{' '}
            <span className="text-[#0df2df] font-black">5T [4+1]</span> 零幻覺驗證並由 Hash Lock
            封印。
          </motion.p>
        </div>

        {/* Assets Download Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: 'code_blocks',
              title: '3D 互動源碼',
              label: 'Omni Source',
              desc: '全系統互動邏輯與 5T 核心核組件 (UCC)。',
              size: '1.2 GB',
              format: 'ZIP',
              ver: 'v8.1.0',
            },
            {
              icon: 'auto_videocam',
              title: '高階視覺素材',
              label: '8K Render',
              desc: 'Tiffany 藍液態玻璃渲染圖及動態美學模組。',
              size: '4.8 GB',
              format: 'RAW',
              ver: 'SENTIENT',
            },
            {
              icon: 'architecture',
              title: '全系統設計規範',
              label: 'Gene Hub',
              desc: 'Lexend 字體規範、5T Gate 組件庫及視覺 DNA。',
              size: '850 MB',
              format: 'FIG',
              ver: 'SSOT',
            },
            {
              icon: 'contract',
              title: '技術部署契約',
              label: 'Protocol',
              desc: 'SSOT 終極契約、API 傳輸層及 5T 驗證接口。',
              size: '120 MB',
              format: 'PDF',
              ver: 'TRUSTWORTHY',
            },
          ].map((asset, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -12 }}
              className="bg-white/[0.03] border border-white/5 rounded-[3rem] p-10 group relative overflow-hidden transition-all hover:bg-[#0df2df]/5 hover:border-[#0df2df]/30 shadow-2xl flex flex-col h-full backdrop-blur-3xl"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px] text-[#0df2df]">
                  {asset.icon}
                </span>
              </div>

              <div className="size-16 rounded-2xl bg-[#0df2df]/10 flex items-center justify-center mb-10 border border-[#0df2df]/20 text-[#0df2df] group-hover:ring-4 ring-[#0df2df]/10 transition-all">
                <span className="material-symbols-outlined text-[36px]">{asset.icon}</span>
              </div>

              <div className="space-y-4 mb-10 relative z-10">
                <h3 className="text-2xl font-black italic tracking-tighter uppercase group-hover:text-[#0df2df] transition-colors">
                  {asset.title}
                </h3>
                <p className="text-[11px] text-slate-500 font-bold uppercase tracking-widest leading-none italic">
                  {asset.label}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed italic">{asset.desc}</p>
              </div>

              <div className="mt-auto space-y-6 relative z-10">
                <div className="flex items-center justify-between text-[10px] font-black font-mono tracking-[0.2em] text-slate-600 italic">
                  <span>
                    {asset.format} • {asset.size}
                  </span>
                  <span className="text-[#0df2df]/40">{asset.ver}</span>
                </div>
                <button className="w-full py-5 bg-[#0df2df]/10 border border-[#0df2df]/20 rounded-2xl text-[10px] font-black italic uppercase tracking-[0.3em] transition-all hover:bg-[#0df2df] hover:text-[#050c0b] hover:shadow-[0_15px_30px_rgba(13,242,223,0.3)] flex items-center justify-center gap-3 active:scale-95">
                  <span className="material-symbols-outlined text-[20px]">cloud_download</span>
                  Execute Download
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Verification & Signature Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-white/[0.02] border border-white/5 rounded-[3.5rem] p-12 flex flex-col justify-between backdrop-blur-3xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 size-64 bg-[#0df2df]/5 blur-[80px] rounded-full -translate-y-1/2 translate-x-1/2" />

            <div className="space-y-10 relative z-10">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/30 flex items-center justify-center shadow-[0_0_25px_rgba(13,242,223,0.2)]">
                  <span className="material-symbols-outlined text-[#0df2df] text-[24px]">
                    verified
                  </span>
                </div>
                <h4 className="text-xl font-black italic tracking-[0.2em] uppercase">
                  5T 驗證標章與不可篡改聲明
                </h4>
              </div>
              <p className="text-slate-400 text-lg italic leading-relaxed tracking-tight border-l-2 border-[#0df2df]/20 pl-8">
                此交付渠道已完成{' '}
                <span className="text-white font-black italic">Sentient-Fusion 8.1</span>{' '}
                協議驗算。所有資產 Hash 已鎖定至區塊鏈主網，並由{' '}
                <span className="text-[#0df2df] font-black italic underline decoration-wavy">
                  DingJun Hong
                </span>{' '}
                終極授權。
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-5 py-2.5 bg-[#0df2df]/10 border border-[#0df2df]/20 rounded-xl text-[10px] text-[#0df2df] font-mono font-black italic tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  SHL: 5T-SENTIENT-CRYSTAL-X88
                </div>
                <div className="px-5 py-2.5 bg-cyan-950/20 border border-cyan-500/20 rounded-xl text-[10px] text-cyan-400 font-mono font-black italic tracking-widest flex items-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">terminal</span>
                  ENV: PRODUCTION_UNLOCKED
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-black/40 border border-[#0df2df]/10 rounded-[3.5rem] p-12 space-y-10 shadow-3xl backdrop-blur-3xl"
          >
            <h4 className="text-xl font-black italic tracking-[0.2em] uppercase text-center">
              數位簽章存證 Manifest
            </h4>
            <div className="space-y-6">
              {[
                { label: 'Authorized Entity', value: 'DingJun Hong', special: true },
                { label: 'Verification Protocol', value: '5T ELITE v8.1', tag: true },
                { label: 'Crystallized At', value: '2026.01.26 11:55:00 UTC', mono: true },
                { label: 'Status', value: 'TRUSTWORTHY & LOCKED', status: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center py-5 border-b border-white/5"
                >
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] italic">
                    {item.label}
                  </span>
                  {item.special ? (
                    <span
                      className="text-4xl text-[#0df2df]/90 italic font-black tracking-tighter"
                      style={{ fontFamily: 'Brush Script MT, cursive' }}
                    >
                      {item.value}
                    </span>
                  ) : item.tag ? (
                    <span className="text-[10px] font-black px-4 py-1.5 bg-[#0df2df]/10 border border-[#0df2df]/30 text-[#0df2df] rounded-full tracking-[0.2em] italic">
                      {item.value}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-black italic tracking-tight ${item.mono ? 'font-mono text-slate-400' : 'text-[#0df2df]'}`}
                    >
                      {item.value}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-[9px] font-mono text-slate-600 break-all leading-loose italic tracking-[0.1em] text-center">
              FINGERPRINT: 5T_SENTIENT_2026_X_BETA_V1_0_0_LOCKED_MANIFEST_DH_0001
            </div>
          </motion.div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 bg-black/40 backdrop-blur-3xl z-40">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="size-12 rounded-2xl bg-[#0df2df]/5 flex items-center justify-center border border-[#0df2df]/20">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">
                verified_user
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed tracking-wider">
              © 2026 ESGss JunAiKey Academia. 全鏈路 5T 協議受動態雜湊封鎖。
              <br />
              <span className="text-white font-black italic">TRUSTED BY SENTIENT CONTRACTS.</span>
            </p>
          </div>
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
                .shadow-3xl { box-shadow: 0 40px 100px -20px rgba(0, 242, 223, 0.05), 0 30px 60px -30px rgba(0, 0, 0, 0.8); }
            `}</style>
    </div>
  );
};
