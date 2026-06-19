import React from 'react';
import {
  VerifiedUser,
  Notifications,
  Settings,
  TrendingUp,
  Gavel,
  Error as ErrorIcon,
  MilitaryTech,
  Stars,
  Check,
  ChevronRight,
  Warning,
  Add,
} from '@mui/icons-material';
import {
  ShieldCheck,
  Activity,
  BrainCircuit,
  Zap,
  Verified,
  AlertTriangle,
  Clock,
  Users,
  Home,
  LayoutDashboard,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * ⚖️ Compliance & Decision Mobile (Service 3.4 & 3.5 Mobile)
 * --------------------------------------------------
 * "Governance Decision Center & Risk Monitoring" for DingJun Hong.
 * Features: Board Snapshot (98.5), Top 3 KPIs, 5T Verified Risk Feed, Decision Checklist.
 */
export const ComplianceDecisionMobile = () => {
  return (
    <div className="bg-[#0a0f0e] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-32 max-w-[430px] mx-auto border-x border-slate-800 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0df2df08,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#0a0f0e]/80 border-b border-[#0df2df]/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 rounded-full bg-[#0df2df]/10 flex items-center justify-center border border-[#0df2df]/30 shadow-[0_0_15px_rgba(13,242,223,0.3)]">
            <VerifiedUser className="text-[#0df2df]" style={{ fontSize: '24px' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-sm font-black tracking-tighter uppercase italic leading-none">
              治理決策中心 Hub
            </h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="size-2 rounded-full bg-[#0df2df] animate-pulse" />
              <p className="text-[10px] text-[#0df2df]/70 font-black uppercase tracking-widest leading-none">
                Live Monitoring
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center dark:hover:bg-[#0df2df]/20 transition-all border border-white/5">
            <Notifications style={{ fontSize: '20px' }} className="text-white/60" />
          </button>
          <button className="size-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/5 overflow-hidden">
            <div
              className="size-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s128-c')",
              }}
            />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 py-8">
        {/* Board Snapshot Header */}
        <section className="px-6 space-y-4">
          <div className="flex items-end justify-between px-2">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] italic">
              Board Snapshot
            </p>
            <p className="text-[9px] text-white/20 font-mono tracking-widest uppercase">
              Sync: 1s AGO
            </p>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-3xl bg-white/[0.03] border border-[#0df2df]/20 rounded-[2.5rem] p-8 relative overflow-hidden shadow-3xl"
          >
            <div className="absolute -right-10 -top-10 size-40 bg-[#0df2df]/10 rounded-full blur-[60px]" />
            <div className="flex items-center justify-between relative z-10">
              <div className="space-y-1">
                <h2 className="text-5xl font-black italic tracking-tighter text-[#0df2df] drop-shadow-[0_0_8px_rgba(13,242,223,0.5)]">
                  98.5
                </h2>
                <p className="text-sm font-black text-white/40 uppercase tracking-widest italic">
                  當前治理評分 Score
                </p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-emerald-400 font-black italic text-sm">
                  <TrendingUp fontSize="small" /> +1.2%
                </div>
                <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mt-1">
                  較上月同期 M-o-M
                </p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Top 3 KPIs */}
        <section className="px-6 space-y-6">
          <h3 className="text-base font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
            <span className="w-1.5 h-4 bg-[#0df2df] rounded-full" /> 核心指標 Top 3 KPIs
          </h3>
          <div className="grid grid-cols-1 gap-4">
            {/* KPI 1 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-[#0df2df]/5 flex items-center justify-center border border-[#0df2df]/20 shadow-inner">
                  <Gavel className="text-[#0df2df]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                    合規達成率 Compliance
                  </p>
                  <p className="text-2xl font-black italic text-white tracking-tighter">94.2%</p>
                </div>
              </div>
              <div className="w-24 h-12 opacity-40">
                <svg className="w-full h-full" viewBox="0 0 100 40">
                  <path
                    d="M0 35 Q 25 35, 30 20 T 60 25 T 100 5"
                    fill="none"
                    stroke="#0df2df"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </motion.div>
            {/* KPI 2 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 flex items-center justify-between shadow-xl border-l-4 border-l-rose-500"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-rose-500/10 flex items-center justify-center border border-rose-500/20 shadow-inner">
                  <ErrorIcon className="text-rose-500" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                    重大風險計數 Risks
                  </p>
                  <p className="text-2xl font-black italic text-white tracking-tighter">03</p>
                </div>
              </div>
              <button className="px-4 py-1.5 rounded-full bg-rose-500/10 text-rose-500 text-[10px] font-black uppercase tracking-widest border border-rose-500/20 active:scale-95">
                需要介入 Action
              </button>
            </motion.div>
            {/* KPI 3 */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 rounded-[1.5rem] p-5 flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-5">
                <div className="size-14 rounded-2xl bg-[#0df2df]/5 flex items-center justify-center border border-[#0df2df]/20 shadow-inner">
                  <MilitaryTech className="text-[#0df2df]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">
                    ESG 信譽等級 Class
                  </p>
                  <p className="text-2xl font-black italic text-white tracking-tighter">AAA</p>
                </div>
              </div>
              <Stars className="text-[#0df2df] drop-shadow-[0_0_8px_#0df2df]" />
            </motion.div>
          </div>
        </section>

        {/* Risk Feed with 5T */}
        <section className="px-6 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <span className="w-1.5 h-4 bg-[#0df2df] rounded-full" /> 即時合規風險預警 Alerts
            </h3>
            <button className="text-[10px] text-[#0df2df] font-black tracking-[0.2em] uppercase underline decoration-[#0df2df]/20">
              查看全部 Full Feed
            </button>
          </div>
          <div className="space-y-6">
            {/* Risk Item 1 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="backdrop-blur-3xl bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/10 border-l-[6px] border-l-rose-500 shadow-2xl group active:scale-[0.98] transition-all"
            >
              <div className="p-8 space-y-5">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-rose-500/10 text-rose-500 text-[9px] font-black uppercase tracking-widest border border-rose-500/20 rounded-md">
                    高風險 HIGH
                  </span>
                  <div className="flex items-center gap-2 bg-[#0df2df]/20 px-3 py-1.5 rounded-full border border-[#0df2df]/40 shadow-inner">
                    <span className="text-[8px] font-black text-[#0df2df] italic tracking-widest leading-none">
                      5T VERIFIED
                    </span>
                    <Verified className="text-[#0df2df] size-3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black italic text-lg leading-tight uppercase group-hover:text-rose-500 transition-colors">
                    供應鏈勞動合規性異常 Audit Failure
                  </h4>
                  <p className="text-white/40 text-xs font-light italic leading-relaxed tracking-tight line-clamp-2">
                    偵測到第三級供應商在 ESG 勞動審計中出現關鍵性不合規指標，可能影響 5T
                    透明度認證...
                  </p>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <div className="flex -space-x-3">
                    <div
                      className="size-8 rounded-full border-2 border-[#0a0f0e] bg-slate-700 bg-cover"
                      style={{ backgroundImage: "url('https://i.pravatar.cc/100?u=1')" }}
                    />
                    <div
                      className="size-8 rounded-full border-2 border-[#0a0f0e] bg-slate-600 bg-cover"
                      style={{ backgroundImage: "url('https://i.pravatar.cc/100?u=2')" }}
                    />
                  </div>
                  <button className="bg-[#0df2df] text-[#0a0f0e] text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl shadow-[0_10px_20px_rgba(13,242,223,0.3)] active:scale-95 transition-all">
                    立即處置 Action
                  </button>
                </div>
              </div>
            </motion.div>
            {/* Risk Item 2 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="backdrop-blur-3xl bg-white/[0.03] rounded-[2rem] overflow-hidden border border-white/10 border-l-[6px] border-l-amber-500 shadow-2xl group active:scale-[0.98] transition-all"
            >
              <div className="p-8 space-y-5">
                <div className="flex justify-between items-start">
                  <span className="px-3 py-1 bg-amber-500/10 text-amber-500 text-[9px] font-black uppercase tracking-widest border border-amber-500/20 rounded-md">
                    中風險 MEDIUM
                  </span>
                  <div className="flex items-center gap-2 bg-[#0df2df]/20 px-3 py-1.5 rounded-full border border-[#0df2df]/40 shadow-inner">
                    <span className="text-[8px] font-black text-[#0df2df] italic tracking-widest leading-none">
                      5T VERIFIED
                    </span>
                    <Verified className="text-[#0df2df] size-3" />
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-black italic text-lg leading-tight uppercase group-hover:text-amber-500 transition-colors">
                    碳交易價格波動預警 Market Volatility
                  </h4>
                  <p className="text-white/40 text-xs font-light italic leading-relaxed tracking-tight line-clamp-2">
                    歐盟碳配額市場價格波動超過設定閾值，建議調整對沖策略以維護財務穩健...
                  </p>
                </div>
                <div className="flex items-center justify-between pt-5 border-t border-white/5">
                  <div className="text-[10px] text-white/20 font-black uppercase tracking-widest">
                    預計影響 Impact: -1.2M USD
                  </div>
                  <button className="bg-white/5 text-white/40 text-[10px] font-black uppercase tracking-widest px-6 py-2.5 rounded-xl border border-white/10 hover:text-white transition-all active:scale-95">
                    查看報告 Report
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Decisions Checklist */}
        <section className="px-6 space-y-6">
          <h3 className="text-base font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
            <span className="w-1.5 h-4 bg-[#0df2df] rounded-full" /> 待辦決策事項 Actions
          </h3>
          <div className="space-y-4 pb-20">
            {[
              { title: 'Q3 治理報告簽核 Board Approval', sub: '截止日期：今日 18:00', done: true },
              {
                title: '風險政策更新審閱 Policy Review',
                sub: '待董事會確認 Pending Board',
                done: false,
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ x: 10 }}
                className={`flex items-center gap-5 p-6 rounded-[1.5rem] border border-white/10 transition-all ${item.done ? 'bg-[#0df2df]/5 border-[#0df2df]/20' : 'bg-white/[0.03] group hover:bg-white/[0.06]'}`}
              >
                <div
                  className={`size-8 rounded-lg border-2 flex items-center justify-center transition-all ${item.done ? 'bg-[#0df2df] border-[#0df2df]' : 'border-white/20 group-hover:border-[#0df2df]'}`}
                >
                  {item.done && (
                    <Check className="text-[#0a0f0e] font-black" style={{ fontSize: '18px' }} />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-black italic tracking-tight uppercase text-white leading-tight">
                    {item.title}
                  </p>
                  <p className="text-[10px] text-white/30 font-black uppercase tracking-widest italic mt-1">
                    {item.sub}
                  </p>
                </div>
                <ChevronRight className="text-white/10" />
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      {/* Premium Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#0a0f0e]/95 border-t border-white/5 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <button className="flex flex-col items-center gap-1.5 text-[#0df2df] scale-110 active:scale-95 transition-all">
          <LayoutDashboard style={{ fontSize: '26px' }} className="drop-shadow-[0_0_8px_#0df2df]" />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            控制台
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <ShieldCheck style={{ fontSize: '26px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            風險測
          </span>
        </button>

        {/* Master Center Button */}
        <div className="relative -top-10">
          <button className="size-16 bg-[#0df2df] rounded-full shadow-[0_10px_35px_rgba(13,242,223,0.5)] flex items-center justify-center text-[#0a0f0e] border-[5px] border-[#0a0f0e] active:scale-90 transition-all hover:scale-110">
            <Add style={{ fontSize: '32px' }} className="font-bold" />
          </button>
        </div>

        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <Description style={{ fontSize: '26px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            報告
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <Settings style={{ fontSize: '26px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            設定
          </span>
        </button>
      </nav>

      {/* System Telemetry Sync Label */}
      <div className="fixed bottom-32 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-[#0a0f0e]/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 pointer-events-none opacity-40 shadow-2xl z-40">
        <div className="size-1 rounded-full bg-[#0df2df] animate-pulse" />
        <span className="text-[8px] font-mono text-[#0df2df] tracking-widest uppercase font-black italic">
          SECURE SYNC: STABLE 100%
        </span>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
