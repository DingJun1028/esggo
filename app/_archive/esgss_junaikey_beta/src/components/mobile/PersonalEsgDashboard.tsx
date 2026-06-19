import React, { useState } from 'react';
import {
  Notifications,
  Verified,
  LocationOn,
  TrackChanges,
  Monitor,
  Visibility,
  Autorenew,
  School,
  AccountBalanceWallet,
  Home,
  Hub,
  AccountBalance,
  MenuBook,
  Person,
  Info,
} from '@mui/icons-material';
import {
  Zap,
  Target,
  ShieldCheck,
  Activity,
  Cpu,
  Star,
  TrendingUp,
  Award,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 👤 Personal ESG Dashboard (Optimized Mobile)
 * --------------------------------------------------
 * "Advanced Personal ESG Score & 5T Identity"
 * Features: Circular 850 Score, 5T Tracker Cards, Weekly Transformer Chart, Achievement Badges.
 */
export const PersonalEsgDashboard = () => {
  const [timeframe, setTimeframe] = useState('week');

  const statusIndicators = [
    {
      label: 'Target (目標)',
      sub: '年度減碳目標達成率',
      val: '92%',
      icon: TrackChanges,
      progress: 92,
    },
    { label: 'Track (追蹤)', sub: '每日碳足跡紀錄狀態', val: '連續 14 天', icon: Monitor },
    {
      label: 'Transparency (透明)',
      sub: '數據驗證可信度指標',
      val: '極高 High',
      icon: Visibility,
      badge: true,
    },
  ];

  return (
    <div className="bg-[#0a1414] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0df2df08,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#0a1414]/90 border-b border-[#0df2df]/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 text-[#0df2df] drop-shadow-[0_0_8px_rgba(13,242,223,0.6)]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tight leading-none uppercase italic">
            ESGss <span className="text-[#0df2df]/90 font-medium">JunAiKey</span>
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="size-11 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:bg-[#0df2df]/20 transition-all active:scale-95">
            <Notifications sx={{ fontSize: '24px' }} className="text-white/60" />
          </button>
          <div className="size-11 rounded-full border-2 border-[#0df2df]/40 p-0.5 active:scale-95 transition-all">
            <div
              className="size-full rounded-full bg-cover bg-center border border-white/10"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 py-10 px-6">
        {/* Profile Card Overlay */}
        <section className="flex items-center gap-8">
          <div className="relative">
            <div className="size-24 p-1 rounded-full bg-gradient-to-tr from-[#0df2df]/40 to-transparent shadow-[0_0_20px_rgba(13,242,223,0.1)]">
              <div
                className="size-full rounded-full bg-cover bg-center border-2 border-[#0df2df]/20 ring-4 ring-black/40"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
                }}
              />
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute bottom-1 right-1 size-8 bg-[#0df2df] rounded-full flex items-center justify-center border-4 border-[#0a1414] shadow-xl text-[#0a1414] font-black"
            >
              <Verified sx={{ fontSize: '18px' }} />
            </motion.div>
          </div>
          <div className="flex flex-col space-y-1">
            <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">
              洪鼎鈞 DingJun
            </h2>
            <p className="text-[#0df2df] font-black text-[10px] uppercase tracking-[0.2em] italic">
              進階貢獻者 Adv Contributor • Level 42
            </p>
            <div className="flex items-center gap-2 mt-2 text-white/30 text-[10px] font-black uppercase tracking-widest italic">
              <LocationOn sx={{ fontSize: '14px' }} className="text-[#0df2df]" /> 台北, 台灣 Taipei,
              TW
            </div>
          </div>
        </section>

        {/* Circular ESG Score Monitor */}
        <section className="backdrop-blur-3xl bg-white/[0.03] border border-[#0df2df]/20 rounded-[3rem] p-10 relative overflow-hidden shadow-3xl group">
          <div className="absolute -top-12 -right-12 size-60 bg-[#0df2df]/5 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000" />

          <div className="flex flex-col items-center py-2 space-y-8">
            <div className="relative size-52 flex items-center justify-center">
              <svg className="size-full transform -rotate-90">
                <circle
                  cx="104"
                  cy="104"
                  r="95"
                  fill="none"
                  stroke="rgba(13, 242, 223, 0.05)"
                  strokeWidth="12"
                />
                <motion.circle
                  initial={{ strokeDashoffset: 596.9 }}
                  animate={{ strokeDashoffset: 89.5 }}
                  cx="104"
                  cy="104"
                  r="95"
                  fill="none"
                  stroke="#0df2df"
                  strokeWidth="12"
                  strokeDasharray="596.9"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_rgba(13,242,223,0.6)]"
                  transition={{ duration: 2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-6xl font-black italic tracking-tighter text-white">850</span>
                <span className="text-[10px] text-[#0df2df]/60 font-black uppercase tracking-[0.4em] mt-2 italic">
                  ESG Score
                </span>
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-[#0df2df]/70 text-xs font-black uppercase tracking-[0.2em] italic">
                全球排名前 5% World Top
              </p>
              <p className="text-2xl font-black italic text-white uppercase italic tracking-tighter leading-tight">
                核心 ESG 綜合指標 Composite
              </p>
            </div>
          </div>

          <button className="w-full mt-10 py-5 bg-[#0df2df] text-[#0a1414] rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-[0_15px_40px_rgba(13,242,223,0.3)] active:scale-95 transition-all">
            查看詳細分析報告 View Analytics
          </button>
        </section>

        {/* Timeframe Switcher */}
        <div className="bg-black/40 rounded-2xl p-1.5 flex h-14 border border-white/5 shadow-inner">
          {['日 Day', '週 Week', '月 Month'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf.toLowerCase().split(' ')[0])}
              className={`flex-1 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${timeframe === tf.toLowerCase().split(' ')[0] ? 'bg-[#0a1414] text-[#0df2df] shadow-2xl scale-105' : 'text-white/20 hover:text-white'}`}
            >
              {tf.split(' ')[0]}
            </button>
          ))}
        </div>

        {/* 5T Status Indicators Grid */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic">
              5T 狀態指標 5T Markers
            </h2>
            <Info className="text-white/20 size-5" />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {statusIndicators.map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                className="backdrop-blur-3xl bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 flex items-center justify-between group cursor-pointer shadow-xl hover:bg-white/[0.06] transition-all"
              >
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-[1.5rem] bg-[#0df2df]/5 flex items-center justify-center text-[#0df2df] border border-[#0df2df]/20 shadow-inner group-hover:scale-110 transition-transform">
                    <item.icon sx={{ fontSize: '32px' }} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black italic text-white leading-tight uppercase tracking-tight">
                      {item.label}
                    </p>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">
                      {item.sub}
                    </p>
                  </div>
                </div>
                <div className="text-right space-y-2 flex flex-col items-end">
                  {item.badge ? (
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[#0df2df]/10 rounded-full border border-[#0df2df]/20 shadow-inner">
                      <Verified sx={{ fontSize: '14px' }} className="text-[#0df2df]" />
                      <span className="text-[#0df2df] font-black text-[10px] uppercase italic">
                        極高 HIGH
                      </span>
                    </div>
                  ) : (
                    <>
                      <p className="text-[#0df2df] font-black italic text-2xl tracking-tighter">
                        {item.val}
                      </p>
                      {item.progress && (
                        <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="bg-[#0df2df] h-full shadow-[0_0_10px_#0df2df]"
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </motion.div>
            ))}

            {/* Transformation Special Chart Card */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="backdrop-blur-3xl bg-white/[0.03] rounded-[3rem] p-10 border border-white/5 shadow-xl space-y-10 group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="size-16 rounded-[1.5rem] bg-[#0df2df]/5 flex items-center justify-center text-[#0df2df] border border-[#0df2df]/30 shadow-inner">
                    <Autorenew
                      sx={{ fontSize: '32px' }}
                      className="group-hover:rotate-180 transition-transform duration-1000"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-lg font-black italic text-white leading-tight uppercase tracking-tight">
                      Transformation (轉型)
                    </p>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic">
                      個人數位轉型增長值 Growth
                    </p>
                  </div>
                </div>
                <span className="text-[#0df2df] text-lg font-black italic">+12% UP</span>
              </div>

              <div className="h-20 flex items-end gap-3 px-2 group/chart">
                {[30, 45, 35, 60, 80, 100].map((h, hi) => (
                  <motion.div
                    key={hi}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: hi * 0.1, duration: 1 }}
                    className={`flex-1 rounded-t-xl transition-all duration-500 hover:brightness-125 ${hi === 5 ? 'bg-[#0df2df] shadow-[0_0_15px_rgba(13,242,223,0.5)]' : 'bg-white/5 group-hover/chart:bg-[#0df2df]/20'}`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Achievement Quick Links Grid */}
        <section className="grid grid-cols-2 gap-5 pb-12">
          <button className="backdrop-blur-3xl bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between items-center text-center gap-5 hover:bg-[#0df2df]/5 hover:border-[#0df2df]/30 transition-all active:scale-95 shadow-xl group">
            <div className="size-16 rounded-2xl bg-[#0df2df]/10 flex items-center justify-center text-[#0df2df] border border-[#0df2df]/20 group-hover:scale-110 transition-transform">
              <School sx={{ fontSize: '36px' }} />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter text-lg uppercase">
                學院課程 Academy
              </p>
              <p className="text-[#0df2df]/70 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                解鎖 3 個新勳章 Badges
              </p>
            </div>
          </button>
          <button className="backdrop-blur-3xl bg-white/[0.03] p-8 rounded-[2.5rem] border border-white/5 flex flex-col justify-between items-center text-center gap-5 hover:bg-[#0df2df]/5 hover:border-[#0df2df]/30 transition-all active:scale-95 shadow-xl group">
            <div className="size-16 rounded-2xl bg-[#0df2df]/10 flex items-center justify-center text-[#0df2df] border border-[#0df2df]/20 group-hover:scale-110 transition-transform">
              <AccountBalanceWallet sx={{ fontSize: '36px' }} />
            </div>
            <div>
              <p className="text-white font-black italic tracking-tighter text-lg uppercase">
                ESG 收益 Rewards
              </p>
              <p className="text-[#0df2df]/70 text-[10px] font-black uppercase tracking-widest mt-1 italic">
                累積 1,240 積分 Points
              </p>
            </div>
          </button>
        </section>
      </main>

      {/* Optimized Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#0a1414]/95 border-t border-white/5 px-8 flex items-center justify-around z-50 rounded-t-[2.5rem] shadow-3xl">
        {[
          { icon: Home, label: '首頁' },
          { icon: Hub, label: '智能情報' },
          { icon: AccountBalance, label: '金庫' },
          { icon: MenuBook, label: '學院' },
          { icon: Person, label: '個人', active: true },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0df2df] scale-110 active:scale-95' : 'text-white/20 hover:text-white'}`}
          >
            <span className="relative">
              <item.icon
                style={{ fontSize: '28px' }}
                className={item.active ? 'drop-shadow-[0_0_8px_#0df2df] fill-current' : ''}
              />
              {item.active && (
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 size-1.5 bg-[#0df2df] rounded-full shadow-[0_0_8px_#0df2df]" />
              )}
            </span>
            <span className="text-[10px] font-black uppercase tracking-tight leading-none mt-1">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
