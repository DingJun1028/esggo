import React, { useState } from 'react';
import {
  Notifications,
  Search,
  Settings,
  Bolt,
  Warning,
  AutoFixHigh,
  NotificationImportant,
  Info,
  Help,
  MenuBook,
  Quiz,
  HeadsetMic,
  SmartToy,
  KeyboardDoubleArrowUp,
  Home,
  Analytics,
  Person,
  ChevronLeft,
  ChevronRight,
} from '@mui/icons-material';
import {
  Zap,
  Target,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  Clock,
  ArrowRight,
  Monitor,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🔔 Help & Notifications Mobile (Mobile Special)
 * --------------------------------------------------
 * "Notifications, Help Center & JunAi Guided Walkthrough"
 * Features: Critical Alerts, One-Click Fixes, FAQ Grid, Interactive Tutorial Overlay.
 */
export const HelpNotificationsMobile = () => {
  const [showGuide, setShowGuide] = useState(true);

  const notifications = [
    {
      type: 'critical',
      title: '碳排放數據異常 Emission Alert',
      desc: '您的工廠 A 區碳排放量已超過預設閾值 15%。',
      time: '2 分鐘前',
      icon: Warning,
      color: 'rose',
    },
    {
      type: 'warning',
      title: '供應鏈合規風險 Compliance',
      desc: '三家二級供應商尚未提交年度社會責任報告。',
      time: '1 小時前',
      icon: NotificationImportant,
      color: 'amber',
    },
    {
      type: 'info',
      title: '週報已生成 Report Ready',
      desc: '您的 ESG 週度摘要報告已完成並可供下載。',
      time: '昨天',
      icon: Info,
      color: 'primary',
    },
  ];

  return (
    <div className="bg-[#102221] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto border-x border-slate-800 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0df2df08,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-[60] backdrop-blur-3xl bg-[#102221]/80 border-b border-white/10 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 text-[#0df2df]">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path
                clipRule="evenodd"
                d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z"
                fill="currentColor"
                fillRule="evenodd"
              />
            </svg>
          </div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic leading-none">
            JunAiKey Hub
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="size-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#0df2df] transition-all">
            <Search style={{ fontSize: '22px' }} />
          </button>
          <button className="size-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#0df2df] transition-all">
            <Settings style={{ fontSize: '22px' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar space-y-10 py-8">
        {/* Page Heading */}
        <section className="px-6 space-y-2">
          <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic leading-tight">
            通知與幫助中心 Help
          </h2>
          <p className="text-[#9cbab7] text-xs font-black uppercase tracking-widest italic opacity-60">
            Management & Tech Support
          </p>
        </section>

        {/* Global Tabs */}
        <div className="px-2 sticky top-[72px] z-40">
          <div className="flex overflow-x-auto no-scrollbar border-b border-white/5 px-6 gap-8 bg-[#102221]/80 backdrop-blur-md">
            {['全部通知 All', '環境 Environment', '社會 Social', '治理 Governance'].map(
              (tab, i) => (
                <button
                  key={i}
                  className={`pb-4 text-[10px] font-black uppercase tracking-widest transition-all ${i === 0 ? 'border-b-2 border-[#0df2df] text-[#0df2df]' : 'text-white/30'}`}
                >
                  {tab.split(' ')[0]}
                </button>
              )
            )}
          </div>
        </div>

        {/* Urgent Notifications */}
        <section className="px-6 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-base font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
              <Bolt className="text-[#0df2df]" /> 智慧通知 Smart Alerts
            </h3>
            <button className="text-[10px] text-[#0df2df] font-black tracking-widest uppercase italic underline">
              全部標記為已讀 Mark All
            </button>
          </div>

          <div className="space-y-5">
            {notifications.map((note, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`backdrop-blur-3xl bg-white/[0.03] rounded-[2rem] p-6 border border-white/10 border-l-[6px] shadow-2xl relative overflow-hidden group active:scale-[0.98] transition-all ${note.type === 'critical' ? 'border-l-rose-500' : note.type === 'warning' ? 'border-l-amber-500' : 'border-l-[#0df2df]'}`}
              >
                <div className="flex gap-6 relative z-10">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${note.type === 'critical' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : note.type === 'warning' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-[#0df2df]/10 text-[#0df2df] border border-[#0df2df]/20'}`}
                  >
                    <note.icon />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-start">
                      <p
                        className={`text-[9px] font-black uppercase tracking-widest italic ${note.type === 'critical' ? 'text-rose-500' : note.type === 'warning' ? 'text-amber-500' : 'text-[#0df2df]'}`}
                      >
                        {note.type}
                      </p>
                      <span className="text-[9px] text-white/20 font-black uppercase tracking-widest">
                        {note.time}
                      </span>
                    </div>
                    <h4 className="text-base font-black italic text-white uppercase tracking-tight group-hover:text-[#0df2df] transition-colors">
                      {note.title}
                    </h4>
                    <p className="text-[11px] text-white/30 font-light italic leading-relaxed tracking-tight">
                      {note.desc}
                    </p>

                    {note.type === 'critical' && (
                      <div className="flex gap-3 pt-2">
                        <button className="flex-1 h-12 bg-[#0df2df] text-[#102221] rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
                          <AutoFixHigh style={{ fontSize: '16px' }} /> 一鍵處理 Fix
                        </button>
                        <button className="h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all">
                          詳情 Info
                        </button>
                      </div>
                    )}
                    {note.type === 'warning' && (
                      <button className="w-full h-12 bg-[#0df2df]/10 border border-[#0df2df]/30 text-[#0df2df] rounded-xl text-[10px] font-black uppercase tracking-widest mt-2 active:scale-95 transition-all">
                        發送提醒 Remind
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Help Center Grid */}
        <section className="px-6 space-y-6 pb-20">
          <h3 className="text-base font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
            <Help className="text-[#0df2df]" /> 幫助中心 Help Desk
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: MenuBook, label: '教學資源 Academy', sub: 'ESG 指標學習' },
              { icon: Quiz, label: '常見問題 FAQ', sub: '快速技術解答' },
            ].map((help, i) => (
              <button
                key={i}
                className="backdrop-blur-3xl bg-white/[0.03] p-6 rounded-[2rem] border border-white/10 flex flex-col gap-3 group hover:bg-[#0df2df]/5 hover:border-[#0df2df]/30 transition-all text-left shadow-xl active:scale-95"
              >
                <help.icon className="text-[#0df2df] group-hover:scale-125 transition-transform" />
                <div>
                  <p className="text-sm font-black italic tracking-tight text-white uppercase">
                    {help.label}
                  </p>
                  <p className="text-[9px] font-medium text-white/20 uppercase tracking-widest mt-1">
                    {help.sub}
                  </p>
                </div>
              </button>
            ))}
          </div>

          <div className="backdrop-blur-3xl bg-gradient-to-br from-[#0df2df]/10 to-transparent p-8 rounded-[2rem] border border-[#0df2df]/20 shadow-2xl flex items-center justify-between group cursor-pointer hover:from-[#0df2df]/20 transition-all">
            <div className="space-y-1">
              <p className="text-lg font-black italic tracking-tighter text-white uppercase">
                聯繫技術支援 Support
              </p>
              <p className="text-[10px] text-white/40 font-black uppercase tracking-widest italic">
                工作日 Mon-Fri 09:00 - 18:00
              </p>
            </div>
            <div className="size-16 rounded-full bg-[#0df2df] flex items-center justify-center text-[#102221] shadow-[0_0_20px_#0df2df40] group-hover:scale-110 transition-transform">
              <HeadsetMic style={{ fontSize: '30px' }} />
            </div>
          </div>
        </section>
      </main>

      {/* Floating AI Action Button */}
      <div className="fixed bottom-32 right-8 flex flex-col items-end gap-3 z-[150]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-[#102221]/90 backdrop-blur-xl border border-[#0df2df]/30 text-[#0df2df] px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-3xl flex items-center gap-3"
        >
          有問題嗎？詢問 JunAi Guide <Sparkles size={14} className="animate-pulse" />
        </motion.div>
        <button
          onClick={() => setShowGuide(true)}
          className="size-18 rounded-full bg-[#0df2df] text-[#102221] shadow-[0_15px_35px_rgba(13,242,223,0.5)] flex items-center justify-center hover:scale-110 active:scale-90 transition-all border-[6px] border-[#102221]"
        >
          <SmartToy style={{ fontSize: '32px' }} />
        </button>
      </div>

      {/* Standard Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#102221]/95 border-t border-white/5 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-3xl">
        {[
          { icon: Home, label: '首頁' },
          { icon: Analytics, label: '數據' },
          { icon: Notifications, label: '通知', active: true },
          { icon: Person, label: '帳戶' },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0df2df] scale-110 active:scale-95' : 'text-white/20 hover:text-white'}`}
          >
            <item.icon
              style={{ fontSize: '26px' }}
              className={item.active ? 'drop-shadow-[0_0_8px_#0df2df]' : ''}
            />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      {/* 🧭 Guided Walkthrough Overlay (JunAi Guide) */}
      <AnimatePresence>
        {showGuide && (
          <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center p-8 pointer-events-none">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#0a1414]/90 backdrop-blur-[6px] pointer-events-auto"
              onClick={() => setShowGuide(false)}
            />

            {/* Highlight Mask (Simulated) */}
            <div className="absolute top-[280px] left-8 right-8 h-56 rounded-[2.5rem] border-[3px] border-[#0df2df] shadow-[0_0_40px_rgba(13,242,223,0.4)] pointer-events-none animate-pulse" />

            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              className="relative w-full max-w-[380px] backdrop-blur-3xl bg-[#1a3a38]/80 border-2 border-[#0df2df]/40 rounded-[3rem] p-10 pointer-events-auto mt-32 shadow-[0_40px_100px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              {/* Decoration Refraction */}
              <div className="absolute -top-10 -left-10 size-40 bg-[#0df2df]/20 rounded-full blur-[60px]" />

              <div className="flex items-center gap-4 mb-6">
                <div className="size-11 rounded-full bg-[#0df2df]/20 flex items-center justify-center border border-[#0df2df]/40">
                  <SmartToy className="text-[#0df2df]" />
                </div>
                <span className="text-[10px] font-black text-[#0df2df] tracking-[0.3em] uppercase italic">
                  JunAi 指導中 Guidance
                </span>
              </div>

              <h4 className="text-2xl font-black italic tracking-tighter text-white uppercase italic mb-4 leading-tight">
                掌握智慧通知系統 Notifications Pro
              </h4>
              <p className="text-[13px] text-white/60 leading-relaxed italic tracking-tight mb-10 text-justify">
                您可以點擊 <span className="text-[#0df2df] font-bold">『一鍵處理 Fix』</span>{' '}
                來快速排除碳排放異常，或是向左滑動通知卡片以進行標記，系統將自動校對數據。
              </p>

              <div className="flex items-center justify-center gap-6 mb-10">
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-2 opacity-30 text-[#0df2df]">
                    <ChevronLeft style={{ fontSize: '18px' }} />
                    <span className="size-2 rounded-full bg-[#0df2df] shadow-[0_0_8px_#0df2df]" />
                    <ChevronRight style={{ fontSize: '18px' }} />
                  </div>
                  <span className="text-[9px] text-white/30 font-black uppercase tracking-widest italic leading-none">
                    左右滑動切換導覽 Swipe Control
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex gap-2">
                  <div className="w-8 h-1.5 rounded-full bg-[#0df2df] shadow-[0_0_8px_#0df2df]" />
                  <div className="w-2.5 h-1.5 rounded-full bg-white/10" />
                  <div className="w-2.5 h-1.5 rounded-full bg-white/10" />
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowGuide(false)}
                    className="px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white/30 hover:text-white transition-all italic"
                  >
                    跳過 Skip
                  </button>
                  <button className="px-8 py-3 bg-[#0df2df] text-[#102221] rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all">
                    下一步 Next
                  </button>
                </div>
              </div>

              {/* Tooltip Arrow */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 size-6 rotate-45 bg-[#1a3a38] border-l-2 border-t-2 border-[#0df2df]/40" />
            </motion.div>

            <div className="absolute bottom-12 flex flex-col items-center gap-3 text-white/20">
              <KeyboardDoubleArrowUp className="animate-bounce" />
              <p className="text-[9px] font-black tracking-[0.4em] uppercase italic">
                滑動以繼續走查教學 Walkthrough
              </p>
            </div>
          </div>
        )}
      </AnimatePresence>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
