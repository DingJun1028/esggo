import React, { useState } from 'react';
import {
  ArrowBack,
  Notifications,
  CheckCircle,
  PlayCircle,
  Lock,
  WorkspacePremium,
  TrendingFlat,
  Search,
  Tune,
  PrecisionManufacturing,
  LocalShipping,
  Eco,
  School,
  Hub,
  Analytics,
  AccountCircle,
  Add,
} from '@mui/icons-material';
import {
  BookOpen,
  Video,
  Star,
  ShieldCheck,
  Zap,
  Target,
  Users,
  Search as SearchIcon,
  Filter,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🎓 Academy & Supply Chain Mobile (Service 5.2 & 5.3 Mobile)
 * --------------------------------------------------
 * "Certification Academy & Supplier Ecosystem" for DingJun Hong.
 * Features: Learning Journey Stepper, Video Preview Carousel, Supplier Trust Score Directory.
 */
export const AcademySupplyMobile = () => {
  const [activeTab, setActiveTab] = useState<'academy' | 'supply'>('academy');

  const academySteps = [
    { title: '課程導入 Orientation', status: 'Completed', val: 100, active: false, done: true },
    {
      title: 'ESG 準則概論 Principles',
      status: 'Processing',
      val: 60,
      active: true,
      done: false,
      desc: '進行中 - 模組 3/5',
    },
    {
      title: '實作工作坊 Workshop',
      status: 'Locked',
      val: 0,
      active: false,
      done: false,
      locked: true,
    },
    {
      title: '伯克利認證考試 Certification',
      status: 'Final',
      val: 0,
      active: false,
      done: false,
      final: true,
    },
  ];

  const suppliers = [
    {
      name: '鼎峻精機 DingJun Mech',
      tags: ['已認證 Certified', 'ESG 評級 A'],
      score: 94,
      icon: PrecisionManufacturing,
    },
    {
      name: '宏觀物流運輸 HongGuan Logi',
      tags: ['評核中 Assessing', 'ESG 評級 B+'],
      score: 82,
      icon: LocalShipping,
    },
    {
      name: '綠能封裝科技 Green Pack',
      tags: ['已認證 Certified', 'ESG 評級 AA'],
      score: 97,
      icon: Eco,
    },
  ];

  return (
    <div className="bg-[#102221] text-white min-h-screen font-display selection:bg-[#09aa9c]/20 flex flex-col relative pb-32 max-w-[430px] mx-auto border-x border-slate-800 shadow-2xl overflow-x-hidden">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#09aa9c08,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#102221]/80 border-b border-white/5 px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button className="size-11 flex items-center justify-center rounded-full bg-white/5 border border-white/5 active:scale-90 transition-all">
            <ArrowBack style={{ fontSize: '20px' }} className="text-white/60" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none text-white">
              學院與供應鏈 Suite
            </h1>
            <p className="text-[9px] text-[#09aa9c] font-black uppercase tracking-widest mt-1 opacity-80 italic">
              Academy & Supply Chain
            </p>
          </div>
        </div>
        <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/5 active:scale-95 transition-all text-white/60">
          <Notifications style={{ fontSize: '20px' }} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar py-8">
        {/* Segmented Switcher */}
        <div className="px-6 mb-10">
          <div className="bg-black/40 rounded-[1.5rem] p-1.5 flex h-16 shadow-inner border border-white/5">
            {[
              { id: 'academy', label: '5.2 認證學院 Academy' },
              { id: 'supply', label: '5.3 供應鏈平台 Supply' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 rounded-[1.2rem] text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-[#09aa9c] text-[#102221] shadow-2xl scale-105' : 'text-white/30 hover:text-white'}`}
              >
                {tab.label.split(' ')[0]} {tab.label.split(' ')[2]}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'academy' ? (
            <motion.div
              key="academy"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-12"
            >
              {/* 5.2 ACADEMY SECTION */}
              <section className="space-y-8 px-6">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
                    <School className="text-[#09aa9c]" /> 學習歷程 Journey
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#09aa9c] font-black uppercase tracking-widest italic">
                      Live Progress
                    </span>
                  </div>
                </div>

                <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] p-10 space-y-2 shadow-3xl">
                  <div className="relative">
                    {academySteps.map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                        {/* Stepper Vertical Line */}
                        <div className="flex flex-col items-center">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className={`size-8 rounded-full flex items-center justify-center z-10 border-4 border-[#102221] shadow-xl ${step.done ? 'bg-[#09aa9c]' : step.active ? 'bg-[#102221] border-[#09aa9c] animate-pulse' : 'bg-white/5 border-white/10 text-white/20'}`}
                          >
                            {step.done ? (
                              <CheckCircle
                                style={{ fontSize: '18px' }}
                                className="text-[#102221]"
                              />
                            ) : step.active ? (
                              <PlayCircle style={{ fontSize: '18px' }} className="text-[#09aa9c]" />
                            ) : step.locked ? (
                              <Lock style={{ fontSize: '14px' }} />
                            ) : (
                              <WorkspacePremium style={{ fontSize: '16px' }} />
                            )}
                          </motion.div>
                          {i < academySteps.length - 1 && (
                            <div
                              className={`w-1 h-14 -my-0.5 rounded-full ${step.done ? 'bg-[#09aa9c] shadow-[0_0_8px_#09aa9c]' : 'bg-white/10'}`}
                            />
                          )}
                        </div>
                        <div className="flex-1 pb-10">
                          <h4
                            className={`text-lg font-black tracking-tight italic uppercase ${step.done ? 'text-white' : step.active ? 'text-[#09aa9c]' : 'text-white/20'}`}
                          >
                            {step.title}
                          </h4>
                          <p
                            className={`text-[10px] font-black uppercase tracking-widest italic mt-1 ${step.done ? 'text-[#09aa9c]' : step.active ? 'text-white/40' : 'text-white/10'}`}
                          >
                            {step.status} {step.val > 0 && `(${step.val}%)`}{' '}
                            {step.desc && `— ${step.desc}`}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Video Previews */}
              <section className="space-y-6">
                <div className="flex items-center justify-between px-8">
                  <h3 className="text-xl font-black italic tracking-tighter text-white uppercase italic">
                    教育短片預覽 Previews
                  </h3>
                  <button className="text-[10px] text-[#09aa9c] font-black tracking-widest uppercase underline">
                    查看全部 View All
                  </button>
                </div>
                <div className="flex gap-6 overflow-x-auto px-8 no-scrollbar pb-6 group">
                  {[
                    {
                      title: '碳足跡計算基礎 Carbon 101',
                      dur: '4:20',
                      level: '基礎課程 Basic',
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAoMePa8qZyghHhDLWxtUJAI65dw3Ixz-7LpvNUP__vxdTu44pP2PW68ksRRPqifLEki376JHimRTxzSxoXjpIvHFlogk3ZDYz7VnYCXcOjUOzVrdQknIc9OkGnNWfi2MSCXTor8cV1jxcgMW6nNrWUNT412SXr9Qk3uYMjAxqlddXKfXJ9segP18iEpCgB3BzyafpfoQaJrgaDp0Qk1mQdmLDxfZfN1Ic9iI5Tz9_5TAvv_YFGuX2RrPGpQiHd5ErheoeTHwEddRY',
                    },
                    {
                      title: '再生能源導入策略 Energy+',
                      dur: '8:15',
                      level: '進階實務 Advanced',
                      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcRWzJJpRj9I1lI7-qwBRwKwBGsbPe2JRHRTrh6GOwl4TbDh7QK9xyXXT5ZJTkYHfsMXddaJTd_EJyHPX3Z7MjEp_HBN1D_XK4vh-L0npfYCLaPx0gPJHVdZ_7gNrWsjZNNG5X3yjtAmq0-u-P2gLlNx0A6dD21ek86RrrFI6PD1AirEQLkt5vehzUDsTY9vZZSNoaHDFUnEh1nbWW3PjSyI2KiKpguHxzxWyQU9gLIQQxaSDT5vyEHA2H-lDIh_yQS9Sxwcl9YqI',
                    },
                  ].map((vid, idx) => (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -5 }}
                      className="min-w-[300px] aspect-video rounded-3xl relative overflow-hidden shadow-2xl border border-white/10 group/vid"
                    >
                      <img
                        className="size-full object-cover transition-transform duration-1000 group-hover/vid:scale-110"
                        src={vid.img}
                        alt="video"
                      />
                      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center opacity-100 group-hover/vid:bg-black/20 transition-all">
                        <PlayCircle className="text-white size-14 drop-shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-transform group-hover/vid:scale-125" />
                      </div>
                      <div className="absolute bottom-0 inset-x-0 backdrop-blur-3xl bg-black/60 p-5 border-t border-white/10 space-y-1">
                        <p className="text-white text-base font-black italic tracking-tighter uppercase">
                          {vid.title}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-white/40 text-[9px] font-black uppercase tracking-widest">
                            {vid.dur} • {vid.level}
                          </p>
                          <Star className="text-[#09aa9c]" size={12} />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </section>

              <div className="px-8 pb-10">
                <button className="w-full h-20 bg-[#09aa9c] text-[#102221] rounded-3xl font-black uppercase text-[12px] tracking-[0.2em] shadow-[0_20px_50px_rgba(9,170,156,0.3)] flex items-center justify-center gap-4 active:scale-95 transition-all group">
                  <span>開始今日課程 Start Lesson</span>
                  <TrendingFlat className="group-hover:translate-x-3 transition-transform duration-500" />
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="supply"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-10"
            >
              {/* 5.3 SUPPLY CHAIN SECTION */}
              <section className="px-6 space-y-8">
                <div className="flex items-center justify-between px-2">
                  <h2 className="text-xl font-black italic tracking-tighter text-white uppercase italic flex items-center gap-3">
                    <Hub className="text-[#09aa9c]" /> 供應商生態系統 Ecosystem
                  </h2>
                  <span className="bg-[#09aa9c]/10 text-[#09aa9c] px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#09aa9c]/30 italic">
                    共 128 家 Total
                  </span>
                </div>

                {/* Search & Filter Bar */}
                <div className="flex gap-4 px-2">
                  <div className="relative flex-1 group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-white/30 text-xl group-focus-within:text-[#09aa9c] transition-colors" />
                    <input
                      className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-5 pl-14 text-sm font-black uppercase tracking-widest placeholder-white/20 focus:outline-none focus:border-[#09aa9c]/50 focus:bg-white/[0.05] transition-all"
                      placeholder="搜尋供應商 Search..."
                      type="text"
                    />
                  </div>
                  <button className="size-16 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/10 text-white/40 hover:text-[#09aa9c] hover:border-[#09aa9c]/40 transition-all active:scale-90">
                    <Tune />
                  </button>
                </div>

                {/* Supplier List */}
                <div className="space-y-4 px-2">
                  {suppliers.map((sup, sidx) => (
                    <motion.div
                      key={sidx}
                      whileHover={{ x: 10 }}
                      className="backdrop-blur-3xl bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 flex items-center justify-between group cursor-pointer shadow-xl hover:bg-white/[0.06] transition-all"
                    >
                      <div className="flex items-center gap-6">
                        <div className="size-14 rounded-2xl bg-[#09aa9c]/10 flex items-center justify-center text-[#09aa9c] border border-[#09aa9c]/20 shadow-inner group-hover:scale-110 transition-transform">
                          <sup.icon style={{ fontSize: '32px' }} />
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-black italic tracking-tighter text-white text-lg uppercase">
                            {sup.name}
                          </h4>
                          <div className="flex gap-3">
                            {sup.tags.map((tag, tidx) => (
                              <span
                                key={tidx}
                                className={`text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-md ${tidx === 1 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-white/5 text-white/30'}`}
                              >
                                {tag.split(' ')[0]}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-right space-y-1">
                        <div className="text-[#09aa9c] text-3xl font-black italic tracking-tighter leading-none">
                          {sup.score}
                        </div>
                        <div className="text-[8px] text-white/20 font-black uppercase tracking-[0.2em] italic">
                          信任分數 TRUST
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="pt-4 px-2 pb-10">
                  <button className="w-full bg-white/5 border border-white/10 h-16 rounded-[1.5rem] font-black text-[#09aa9c] uppercase text-[10px] tracking-widest flex items-center justify-center gap-4 hover:bg-white/10 transition-all active:scale-95 group">
                    <Add /> 新增供應商申請 New Application{' '}
                    <ArrowRight
                      className="group-hover:translate-x-2 transition-transform"
                      size={14}
                    />
                  </button>
                </div>
              </section>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Standard Bottom Navigation for Hierarchy */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#102221]/95 border-t border-white/5 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-3xl">
        <button
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${activeTab === 'academy' ? 'text-[#09aa9c] scale-110' : 'text-white/20 hover:text-white'}`}
        >
          <School
            style={{ fontSize: '26px' }}
            className={activeTab === 'academy' ? 'drop-shadow-[0_0_8px_#09aa9c]' : ''}
          />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            學院
          </span>
        </button>
        <button
          className={`flex flex-col items-center gap-1.5 transition-all active:scale-95 ${activeTab === 'supply' ? 'text-[#09aa9c] scale-110' : 'text-white/20 hover:text-white'}`}
        >
          <Hub
            style={{ fontSize: '26px' }}
            className={activeTab === 'supply' ? 'drop-shadow-[0_0_8px_#09aa9c]' : ''}
          />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            供應鏈
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <Analytics style={{ fontSize: '26px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            報告
          </span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-white/20 hover:text-white transition-all active:scale-95">
          <AccountCircle style={{ fontSize: '26px' }} />
          <span className="text-[10px] font-black uppercase tracking-widest leading-none">
            我的
          </span>
        </button>
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
