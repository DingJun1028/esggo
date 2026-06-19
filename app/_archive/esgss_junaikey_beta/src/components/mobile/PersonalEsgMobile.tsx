import React from 'react';
import {
  Notifications,
  Verified,
  LocationOn,
  Info,
  TrackChanges,
  Monitor,
  Visibility,
  Autorenew,
  School,
  AccountBalanceWallet,
  Home,
  Hub as HubIcon,
  AccountBalance,
  MenuBook,
  Person,
} from '@mui/icons-material';
import {
  Bell,
  ShieldCheck,
  MapPin,
  Activity,
  Target,
  Zap,
  Award,
  LineChart,
  Search,
  Sparkles,
  RefreshCw,
  Bookmark,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📱 Personal ESG Mobile Dashboard (Service 1.1 Mobile)
 * --------------------------------------------------
 * "Quick-Access ESG Score & 5T Metrics" for DingJun Hong.
 * Optimized for 430px - 480px mobile viewports.
 */
export const PersonalEsgMobile = () => {
  return (
    <div className="bg-[#111817] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-24 max-w-[480px] mx-auto shadow-2xl overflow-x-hidden">
      {/* Liquid Glass Background Accents */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 size-96 rounded-full bg-[#0df2df]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 size-96 rounded-full bg-[#0df2df]/3 blur-[100px]" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#1b2726]/60 border-b border-[#283938] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-7 text-[#0df2df]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                fill="currentColor"
                fillRule="evenodd"
              ></path>
            </svg>
          </div>
          <h1 className="text-white text-base font-black tracking-tighter uppercase italic">
            ESGss JunAiKey
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button className="size-10 flex items-center justify-center rounded-xl bg-[#283938] text-white/60 hover:text-[#0df2df] transition-colors active:scale-90 shadow-lg">
            <Notifications fontSize="small" />
          </button>
          <div
            className="size-10 rounded-full border-2 border-[#0df2df]/30 bg-center bg-cover shadow-inner ring-2 ring-[#0df2df]/5"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
            }}
          />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-8 space-y-10">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-5"
        >
          <div className="relative">
            <div className="size-20 rounded-full border-2 border-[#0df2df] p-1 bg-gradient-to-br from-[#0df2df]/20 to-transparent">
              <div
                className="size-full rounded-full bg-cover bg-center shadow-inner"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                }}
              />
            </div>
            <div className="absolute -bottom-1 -right-1 size-6 bg-[#0df2df] rounded-full flex items-center justify-center border-2 border-[#111817] shadow-xl">
              <Verified
                className="text-[#111817] translate-y-[-0.5px]"
                style={{ fontSize: '14px' }}
              />
            </div>
          </div>
          <div className="flex flex-col">
            <h2 className="text-white text-2xl font-black tracking-tight italic">洪鼎鈞</h2>
            <p className="text-[#0df2df] text-[11px] font-black uppercase tracking-widest mt-1">
              進階貢獻者 • Level 42
            </p>
            <div className="flex items-center gap-2 mt-2 text-[#9cbab7] text-[10px] font-bold uppercase tracking-widest">
              <LocationOn style={{ fontSize: '12px' }} className="text-[#0df2df]/60" />
              <span>台北, 台灣</span>
            </div>
          </div>
        </motion.div>

        {/* Global ESG Score Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="backdrop-blur-3xl bg-[#1b2726]/60 border border-[#0df2df]/30 rounded-[2.5rem] p-10 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
        >
          {/* Abstract Circle Decoration */}
          <div className="absolute top-0 right-0 opacity-10 pointer-events-none -translate-y-8 translate-x-8">
            <svg height="200" width="200" viewBox="0 0 100 100">
              <circle cx="100" cy="0" r="80" fill="none" stroke="#0df2df" strokeWidth="2" />
              <circle cx="100" cy="0" r="60" fill="none" stroke="#0df2df" strokeWidth="1" />
            </svg>
          </div>

          <div className="flex flex-col items-center py-6 space-y-8">
            <div className="relative size-48 flex items-center justify-center">
              {/* Progress Ring */}
              <svg className="size-full transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="84"
                  fill="transparent"
                  stroke="rgba(13, 242, 223, 0.05)"
                  strokeWidth="8"
                />
                <motion.circle
                  initial={{ strokeDashoffset: 528 }}
                  animate={{ strokeDashoffset: 132 }}
                  transition={{ duration: 2, ease: 'easeOut' }}
                  cx="96"
                  cy="96"
                  r="84"
                  fill="transparent"
                  stroke="#0df2df"
                  strokeWidth="8"
                  strokeDasharray="528"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_rgba(13,242,223,0.6)]"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-5xl font-black text-white tracking-tighter italic">850</span>
                <span className="text-[10px] text-[#0df2df] font-black uppercase tracking-[0.3em] mt-1">
                  ESG Score
                </span>
              </div>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[#9cbab7] text-xs font-black uppercase tracking-widest italic opacity-60">
                全球排名前 5% Ranking
              </p>
              <p className="text-white text-xl font-black italic tracking-tight uppercase">
                核心 ESG 總分 Dashboard
              </p>
            </div>

            <button className="w-full bg-[#0df2df] hover:bg-[#0df2df]/80 transition-all text-[#111817] py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(13,242,223,0.3)] active:scale-95">
              查看詳細分析報告 Full Report
            </button>
          </div>
        </motion.div>

        {/* Timeframe Selector */}
        <div className="flex h-14 items-center justify-center rounded-[1.5rem] bg-[#283938]/30 border border-white/5 p-1.5 backdrop-blur-3xl shadow-inner">
          {['日', '週', '月'].map((label, idx) => (
            <button
              key={idx}
              className={`flex-1 h-full rounded-2xl flex items-center justify-center text-[11px] font-black uppercase tracking-widest transition-all ${idx === 1 ? 'bg-[#0a1617] text-[#0df2df] shadow-lg border border-[#0df2df]/20' : 'text-[#9cbab7] hover:text-white'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 5T Status Metrics */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-white text-xl font-black italic tracking-tighter uppercase italic">
              5T 狀態指標 Monitoring
            </h3>
            <Info className="text-white/20 size-4 hover:text-[#0df2df] transition-colors cursor-pointer" />
          </div>

          <div className="grid grid-cols-1 gap-5">
            {[
              {
                label: 'Target (目標)',
                sub: '年度減碳目標達成率',
                val: '92%',
                icon: TrackChanges,
                progress: 92,
              },
              {
                label: 'Track (追蹤)',
                sub: '每日碳足跡紀錄狀態',
                val: '連續 14 天',
                icon: Monitor,
              },
              {
                label: 'Transparency (透明)',
                sub: '數據驗證可信度指標',
                val: '極高',
                icon: Visibility,
                verified: true,
              },
              {
                label: 'Transformation (轉型)',
                sub: '企業轉型效率增速',
                val: '+12%',
                icon: Autorenew,
                chart: true,
              },
            ].map((metric, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * i }}
                className="backdrop-blur-3xl bg-[#1b2726]/40 border border-white/10 p-6 rounded-[2rem] flex flex-col gap-6 group hover:border-[#0df2df]/40 transition-all shadow-xl"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-5">
                    <div className="size-12 rounded-2xl bg-[#0df2df]/10 border border-[#0df2df]/30 flex items-center justify-center text-[#0df2df] shadow-inner group-hover:scale-110 transition-transform">
                      <metric.icon fontSize="small" />
                    </div>
                    <div className="flex flex-col">
                      <p className="text-white font-black text-sm italic uppercase tracking-tight">
                        {metric.label}
                      </p>
                      <p className="text-[#9cbab7] text-[10px] font-black uppercase tracking-widest mt-0.5 opacity-60">
                        {metric.sub}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[#0df2df] font-black text-xl italic tracking-tighter flex items-center gap-2 justify-end">
                      {metric.verified && <Verified className="size-4" />}
                      {metric.val}
                    </p>
                  </div>
                </div>

                {metric.progress && (
                  <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: '92%' }}
                      className="h-full bg-[#0df2df] rounded-full shadow-[0_0_10px_#0df2df]"
                    />
                  </div>
                )}

                {metric.chart && (
                  <div className="w-full h-16 flex items-end gap-2 px-2 pb-2">
                    {[30, 45, 35, 60, 80, 100].map((h, j) => (
                      <motion.div
                        key={j}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${h}%` }}
                        className={`flex-1 rounded-t-lg transition-all duration-700 ${j === 5 ? 'bg-[#0df2df]' : 'bg-[#0df2df]/20 group-hover:bg-[#0df2df]/40'}`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Action Bento Grid */}
        <div className="grid grid-cols-2 gap-6">
          {[
            { label: '學院課程 Academy', sub: '解鎖 3 個新勳章', icon: School },
            { label: 'ESG 收益 Wallet', sub: '累積 1,240 積分', icon: AccountBalanceWallet },
          ].map((action, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.05, borderColor: '#0df2df/50' }}
              className="backdrop-blur-3xl bg-[#1b2726]/40 border border-white/5 p-8 rounded-[2.5rem] aspect-square flex flex-col justify-between shadow-2xl transition-all cursor-pointer group"
            >
              <div className="size-14 rounded-2xl bg-[#0df2df]/10 border border-[#0df2df]/20 flex items-center justify-center text-[#0df2df] group-hover:rotate-12 transition-transform shadow-inner">
                <action.icon fontSize="large" />
              </div>
              <div className="space-y-1">
                <p className="text-white font-black text-sm italic tracking-tight uppercase leading-none">
                  {action.label}
                </p>
                <p className="text-[#9cbab7] text-[10px] font-black uppercase tracking-widest opacity-60">
                  {action.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating System Bottom Nav */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] h-24 backdrop-blur-3xl bg-[#1b2726]/80 border-t border-[#283938] flex items-center justify-around px-4 z-[100] rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        {[
          { icon: Home, label: '首頁', active: true },
          { icon: HubIcon, label: '智能' },
          { icon: AccountBalance, label: '治理' },
          { icon: MenuBook, label: '學院' },
          { icon: Person, label: '個人' },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0df2df] scale-110' : 'text-[#9cbab7] hover:text-white'}`}
          >
            <item.icon
              style={{ fontSize: '24px' }}
              className={item.active ? 'drop-shadow-[0_0_8px_rgba(13,242,223,0.5)]' : ''}
            />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* Root Telemetry Label */}
      <div className="fixed bottom-32 right-6 pointer-events-none opacity-10">
        <p className="text-[8px] font-mono text-white tracking-[0.4em] uppercase font-black italic">
          ESGSS-P-MOBILE-V1.0.1
        </p>
      </div>

      <style>{`
        .animate-wave-slow { animation: wave 10s infinite linear; }
        @keyframes wave { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};
