import React from 'react';
import {
  VerifiedUser,
  Notifications,
  Menu,
  Check,
  Diamond,
  Shield,
  Eco,
  Visibility,
  ArrowForward,
  Verified,
  MilitaryTech,
  EnergySavingsLeaf,
  VolunteerActivism,
  Lock,
  Home,
  History,
  QrCodeScanner,
} from '@mui/icons-material';
import {
  Fingerprint,
  ShieldCheck,
  Activity,
  Cpu,
  Zap,
  Target,
  Users,
  Globe,
  Sparkles,
  Search,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🆔 Integrity Passport Mobile (Service 3.3 Mobile)
 * --------------------------------------------------
 * "Digital ESG Identity & Blockchain Passport" for DingJun Hong.
 * Features: Trust Score (98.5), 4D Crystals, QR Scan Verification, Polygon Hashing.
 */
export const IntegrityPassportMobile = () => {
  const achievements = [
    { title: '節能淨零先鋒 Pioneer', date: '2024 NOV', icon: EnergySavingsLeaf, active: true },
    { title: '誠信卓越楷模 Model', date: '2024 OCT', icon: VolunteerActivism, active: true },
    { title: '減碳勇者 Hero', date: '未解鎖 Locked', icon: Lock, active: false },
  ];

  return (
    <div className="bg-[#050a0a] text-white min-h-screen font-display selection:bg-[#09b3ae]/30 flex flex-col relative pb-32 max-w-[430px] mx-auto border-x border-slate-800 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] size-80 bg-[#09b3ae]/20 blur-[100px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-20%] size-96 bg-[#81d8d0]/10 blur-[120px] rounded-full" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#050a0a]/60 px-6 py-5 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#09b3ae]/20 border border-[#09b3ae]/30 rounded-xl flex items-center justify-center text-[#09b3ae] shadow-lg">
            <VerifiedUser sx={{ fontSize: '24px', fontWeight: 'bold' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tight leading-none uppercase italic">
              誠信護照 Passport
            </h1>
            <p className="text-[9px] font-black text-white/30 tracking-[0.2em] uppercase mt-1 italic">
              Integrity Passport 3.3
            </p>
          </div>
        </div>
        <div className="flex gap-2.5">
          <button className="size-11 rounded-xl bg-white/5 border border-white/5 hover:bg-[#09b3ae]/20 transition-all flex items-center justify-center">
            <Notifications sx={{ fontSize: '22px' }} className="text-white/60" />
          </button>
          <button className="size-11 rounded-xl bg-white/5 border border-white/5 hover:bg-[#09b3ae]/20 transition-all flex items-center justify-center">
            <Menu sx={{ fontSize: '22px' }} className="text-white/60" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 pt-8">
        {/* Profile Avatar & Header */}
        <section className="text-center space-y-5 px-6 pb-10">
          <div className="relative inline-block">
            <div className="size-32 rounded-full border-2 border-[#09b3ae]/40 p-1.5 bg-gradient-to-tr from-[#09b3ae]/20 to-transparent shadow-[0_0_30px_rgba(9,179,174,0.1)]">
              <div
                className="size-full rounded-full bg-cover bg-center ring-4 ring-black/40 border border-white/10"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
                }}
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-1 right-1 bg-[#09b3ae] text-[#050a0a] size-8 rounded-full flex items-center justify-center border-[5px] border-[#050a0a] shadow-xl"
            >
              <Check sx={{ fontSize: '18px', fontWeight: 'black' }} />
            </motion.div>
          </div>

          <div className="space-y-2">
            <h2 className="text-4xl font-black tracking-tighter text-white italic">
              洪鼎鈞 DingJun
            </h2>
            <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-[#09b3ae]/10 border border-[#09b3ae]/20 rounded-full shadow-inner">
              <span className="size-1.5 bg-[#09b3ae] rounded-full animate-pulse shadow-[0_0_8px_#09b3ae]" />
              <span className="text-[#09b3ae] text-[10px] font-black tracking-[0.1em] uppercase">
                個人 ESG 數位身份認證 Verified Identity
              </span>
            </div>
          </div>
        </section>

        {/* Blockchain Identity Card */}
        <section className="px-5 pb-12">
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="backdrop-blur-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/20 rounded-[3rem] p-10 relative overflow-hidden shadow-3xl group"
          >
            {/* Internal Refraction Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,#09b3ae20,transparent_50%),radial-gradient(circle_at_80%_70%,#81d8d015,transparent_50%)]" />
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />

            <div className="relative z-10 space-y-10">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-[#09b3ae] uppercase tracking-[0.3em] italic">
                    Blockchain Identity
                  </p>
                  <h3 className="text-xl font-black italic tracking-tighter text-white uppercase leading-tight">
                    四維結晶：
                    <br />
                    誠信、責任、永續、透明
                  </h3>
                </div>
                <div className="text-right flex flex-col items-end">
                  <p className="text-[9px] text-white/30 font-black uppercase tracking-tight italic">
                    Trust Score
                  </p>
                  <p className="text-5xl font-black text-[#09b3ae] italic tracking-tighter leading-none mt-2 drop-shadow-[0_0_10px_rgba(9,179,174,0.5)]">
                    98.5
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-3 bg-black/40 backdrop-blur-3xl rounded-[2rem] p-6 border border-white/10 shadow-inner">
                {[
                  { icon: Diamond, label: '誠信' },
                  { icon: Shield, label: '責任' },
                  { icon: Eco, label: '永續' },
                  { icon: Visibility, label: '透明' },
                ].map((crystal, cIdx) => (
                  <div key={cIdx} className="flex flex-col items-center gap-3 group/item">
                    <div className="size-11 rounded-2xl bg-[#09b3ae]/10 flex items-center justify-center text-[#09b3ae] border border-[#09b3ae]/20 group-hover/item:scale-110 transition-transform">
                      <crystal.icon sx={{ fontSize: '20px' }} />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-white/40 italic">
                      {crystal.label}
                    </span>
                  </div>
                ))}
              </div>

              <button className="w-full h-18 bg-[#09b3ae] text-[#050a0a] font-black rounded-3xl flex items-center justify-center gap-4 shadow-[0_15px_30px_rgba(9,179,174,0.3)] hover:brightness-110 active:scale-95 transition-all text-sm uppercase tracking-[0.2em]">
                <span>查看鏈上詳細數據 On-Chain Data</span>
                <ArrowForward sx={{ fontSize: '20px' }} />
              </button>
            </div>
          </motion.div>
        </section>

        {/* QR Scan Verification */}
        <section className="px-6 py-12 flex flex-col items-center space-y-10 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent">
          <div className="space-y-2 text-center">
            <h3 className="text-[11px] font-black text-white/30 tracking-[0.3em] uppercase italic">
              區塊鏈即時掃描驗證 REAL-TIME SCAN
            </h3>
            <p className="text-[9px] text-[#09b3ae] font-black uppercase tracking-widest italic animate-pulse">
              Scanning Secure Nodes...
            </p>
          </div>

          <div className="relative p-2.5 group">
            <div className="absolute -inset-2 bg-gradient-to-tr from-[#09b3ae] via-[#81d8d0] to-[#09b3ae] opacity-20 blur-2xl rounded-[3rem]" />
            <div className="absolute inset-0 border-2 border-[#09b3ae]/30 rounded-[2.5rem] shadow-[0_0_40px_rgba(9,179,174,0.3)]" />

            <div className="relative bg-white p-6 rounded-[2.2rem] overflow-hidden shadow-inner">
              <div
                className="size-52 bg-cover bg-center grayscale contrast-125"
                style={{
                  backgroundImage:
                    "url('https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ESGssPassport:DingJunHong')",
                }}
              />
              {/* Laser Scan Line Effect */}
              <motion.div
                animate={{ top: ['0%', '100%', '0%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-[#09b3ae] blur-sm z-20"
              />
            </div>

            {/* Corner Brackets */}
            <div className="absolute top-0 left-0 size-12 border-t-[5px] border-l-[5px] border-[#09b3ae] rounded-tl-[2rem]" />
            <div className="absolute top-0 right-0 size-12 border-t-[5px] border-r-[5px] border-[#09b3ae] rounded-tr-[2rem]" />
            <div className="absolute bottom-0 left-0 size-12 border-b-[5px] border-l-[5px] border-[#09b3ae] rounded-bl-[2rem]" />
            <div className="absolute bottom-0 right-0 size-12 border-b-[5px] border-r-[5px] border-[#09b3ae] rounded-br-[2rem]" />
          </div>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-3 px-6 py-2.5 bg-white/5 rounded-full border border-white/10 shadow-inner">
              <Verified className="text-[#09b3ae]" sx={{ fontSize: '18px' }} />
              <span className="text-[10px] font-black tracking-tight uppercase italic text-[#09b3ae]">
                數據已存證於 Polygon Mainnet
              </span>
            </div>
            <p className="text-[9px] text-white/20 font-mono tracking-tight uppercase">
              HASH: 0x8a2f...99d12 • 2024-11-20 14:30:05
            </p>
          </div>
        </section>

        {/* Digital Achievements */}
        <section className="px-6 pb-20 space-y-8">
          <div className="flex justify-between items-center px-2">
            <h3 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <MilitaryTech className="text-[#09b3ae]" /> 數位榮譽成就 Awards
            </h3>
            <button className="text-[10px] text-[#09b3ae] font-black border border-[#09b3ae]/30 px-5 py-1.5 rounded-full uppercase tracking-widest bg-[#09b3ae]/10 active:scale-95 transition-all">
              探索全部 Browse
            </button>
          </div>

          <div className="flex gap-6 overflow-x-auto no-scrollbar px-2 pb-6">
            {achievements.map((badge, bIdx) => (
              <motion.div
                key={bIdx}
                whileHover={{ y: -10 }}
                className={`flex-shrink-0 w-40 backdrop-blur-3xl p-8 rounded-[3rem] border flex flex-col items-center text-center gap-5 shadow-2xl transition-all ${badge.active ? 'bg-white/[0.03] border-[#09b3ae]/20' : 'bg-black/20 border-white/5 opacity-40 grayscale italic border-dashed'}`}
              >
                <div
                  className={`size-20 rounded-full flex items-center justify-center transition-all ${badge.active ? 'bg-[#09b3ae]/10 ring-8 ring-[#09b3ae]/5' : 'bg-white/5'}`}
                >
                  <badge.icon
                    sx={{ fontSize: '40px' }}
                    className={
                      badge.active
                        ? 'text-[#09b3ae] drop-shadow-[0_0_8px_#09b3ae]'
                        : 'text-white/20'
                    }
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-black italic tracking-tight uppercase text-white leading-tight">
                    {badge.title}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-[#09b3ae]/40">
                    {badge.date}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Floating Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#050a0a]/85 border-t border-white/5 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-3xl">
        <button className="flex flex-col items-center gap-1.5 text-[#09b3ae] scale-110 active:scale-95 transition-all group">
          <Home style={{ fontSize: '30px' }} className="drop-shadow-[0_0_8px_#09b3ae]" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            首頁 Home
          </span>
        </button>

        {/* Center High-Impact Scanner Button */}
        <div className="relative -top-10">
          <div className="absolute inset-0 bg-[#09b3ae] blur-2xl opacity-20 animate-pulse" />
          <button className="size-20 bg-[#09b3ae] rounded-full shadow-[0_20px_50px_rgba(9,179,174,0.4)] flex items-center justify-center text-[#050a0a] border-[8px] border-[#050a0a] active:scale-90 transition-all hover:scale-110 relative z-10">
            <QrCodeScanner sx={{ fontSize: '36px' }} className="font-bold" />
          </button>
        </div>

        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95 group">
          <History style={{ fontSize: '30px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            紀錄 Log
          </span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Public Sans', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
