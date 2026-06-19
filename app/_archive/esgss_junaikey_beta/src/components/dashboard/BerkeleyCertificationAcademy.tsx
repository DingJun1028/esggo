import React from 'react';
import {
  School,
  VerifiedUser,
  WorkspacePremium,
  Bolt,
  TrendingUp,
  Stars,
  Map,
  AutoAwesome,
  ZoomIn,
  ZoomOut,
  FilterCenterFocus,
  LockOpen,
  EnergySavingsLeaf,
  Lock,
  Search,
  HowToReg,
  MenuBook,
  EditNote,
  Verified,
  Login,
  Info,
} from '@mui/icons-material';
import {
  GraduationCap,
  ShieldCheck,
  Award,
  Zap,
  Activity,
  Star,
  Navigation,
  Sparkles,
  Library,
  BookOpen,
  FileEdit,
  CheckCircle,
  Search as SearchIcon,
  Crown,
  Lock as LockIcon,
  Unlock,
  ChevronRight,
  Map as MapIcon,
  Layers,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🎓 Berkeley Certification Academy (Service 5.2)
 * --------------------------------------------------
 * "Knowledge Constellation & ESG Mastery" for DingJun Hong.
 * Features: Interactive Node Map, Mastery XP, Certification Workflow.
 */
export const BerkeleyCertificationAcademy = () => {
  const courses = [
    {
      title: 'GRI/SASB Reporting Expert',
      desc: 'In-depth exploration of Global Reporting Initiative standards, mastering advanced techniques for CSR reporting.',
      level: 'Level 3',
      progress: 85,
      workflow: [
        { label: 'Register', active: true, icon: HowToReg },
        { label: 'Study', active: true, icon: MenuBook },
        { label: 'Exam', active: false, icon: EditNote },
        { label: 'Certify', active: false, icon: WorkspacePremium },
      ],
    },
    {
      title: 'TCFD Climate Risk Disclosure',
      desc: 'Analyze climate change impact on financial performance, apply TCFD framework to investment portfolios.',
      level: 'Advanced',
      progress: 0,
      workflow: [
        { label: 'Register', active: true, icon: HowToReg },
        { label: 'Study', active: false, icon: MenuBook },
        { label: 'Exam', active: false, icon: EditNote },
        { label: 'Certify', active: false, icon: WorkspacePremium },
      ],
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 overflow-x-hidden">
      {/* Background Constellation Effect */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,#1a3a3a_0%,#102222_100%)]">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(#0ab8b2 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-3xl bg-[#102222]/80 border-b border-white/10">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#0ab8b2]">
            <div className="size-10 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 rounded-2xl flex items-center justify-center shadow-lg">
              <School fontSize="large" />
            </div>
            <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none">
              Berkeley Academy
            </h1>
          </div>
          <nav className="hidden xl:flex items-center gap-9">
            {['Home', 'Constellation', 'Course Catalog', 'Progress', 'Verification'].map(
              (link, i) => (
                <a
                  key={i}
                  className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${i === 0 ? 'text-[#0ab8b2] border-b-2 border-[#0ab8b2] pb-1' : 'text-white/40 hover:text-white'}`}
                  href="#"
                >
                  {link}
                </a>
              )
            )}
          </nav>
        </div>

        <div className="flex items-center gap-10">
          <div className="relative group hidden lg:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ab8b2]/40 size-4 group-focus-within:text-[#0ab8b2] transition-colors" />
            <input
              className="bg-[#1b2727] border-white/5 border rounded-2xl pl-12 pr-6 py-2.5 text-xs w-72 outline-none focus:ring-1 focus:ring-[#0ab8b2] text-white"
              placeholder="搜尋 ESG 認證 Search Certs..."
            />
          </div>
          <button className="bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#102222] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center gap-3 transition-all active:scale-95">
            <Login fontSize="small" /> Login
          </button>
          <div className="size-11 rounded-full border-2 border-[#0ab8b2]/40 p-0.5 overflow-hidden ring-4 ring-[#0ab8b2]/5">
            <div
              className="size-full rounded-full bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-10 py-12 flex flex-col gap-16">
        {/* Page Heading & Navigation */}
        <div className="flex flex-wrap justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 shadow-lg">
              <ShieldCheck className="text-[#0ab8b2] size-4" />
              <span className="text-[10px] font-black tracking-[0.3em] text-[#0ab8b2] uppercase">
                JunAiKey Ecosystem Portal
              </span>
            </div>
            <h2 className="text-6xl font-black tracking-tighter text-white">
              5.2 Berkeley Academy
            </h2>
            <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-3xl">
              ESGss{' '}
              <span className="text-white font-medium not-italic">
                High-End Liquid Glass Ecosystem
              </span>{' '}
              - Global Leader in ESG Professional Training
            </p>
          </motion.div>

          <div className="flex gap-4">
            <button className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 px-8 py-5 rounded-[2rem] flex items-center gap-4 hover:bg-white/10 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95 shadow-2xl">
              <MapIcon size={18} /> 查看全景導航 Map
            </button>
            <button className="bg-[#0ab8b2]/10 text-[#0ab8b2] border border-[#0ab8b2]/30 px-8 py-5 rounded-[2rem] flex items-center gap-4 hover:bg-[#0ab8b2]/20 transition-all font-black text-[10px] uppercase tracking-widest active:scale-95 shadow-2xl">
              <Award size={18} /> 我的證書 My Certs (3)
            </button>
          </div>
        </div>

        {/* Real-time Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { label: '當前掌握值 (Mastery XP)', val: '12,850', trend: '+1,240', icon: Zap },
            { label: '學習路徑完成度 Progress', val: '78%', progress: 78, icon: Activity },
            { label: '全球排名 (Global Rank)', val: '#242', trend: 'Top 1%', icon: Star },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-3xl bg-white/[0.03] border-l-8 border-l-[#0ab8b2] border-y border-r border-white/5 p-12 rounded-[2.5rem] flex items-center gap-10 group shadow-2xl"
            >
              <div className="size-20 rounded-[2rem] bg-[#0ab8b2]/10 flex items-center justify-center text-[#0ab8b2] shadow-inner group-hover:scale-110 transition-transform">
                <stat.icon size={36} />
              </div>
              <div className="flex-1 space-y-2">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <p className="text-5xl font-black text-white tracking-tighter italic">{stat.val}</p>
                {stat.trend && (
                  <span className="text-[#0ab8b2] text-[11px] font-black tracking-widest uppercase italic">
                    {stat.trend}
                  </span>
                )}
                {stat.progress !== undefined && (
                  <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-2 p-[1px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.progress}%` }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_15px_#0ab8b2]"
                    />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Knowledge Constellation Map Section */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-10"
        >
          <div className="flex items-center justify-between px-6">
            <h3 className="text-3xl font-black tracking-tighter text-white italic flex items-center gap-6">
              <Sparkles className="text-[#0ab8b2] size-8" />
              Knowledge Constellation: ESG Core Modules{' '}
              <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest">
                Knowledge Constellation
              </span>
            </h3>
            <div className="flex gap-4">
              {[ZoomIn, ZoomOut, FilterCenterFocus].map((Icon, i) => (
                <button
                  key={i}
                  className="size-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#0ab8b2]/10 hover:text-[#0ab8b2] transition-all shadow-xl active:scale-95"
                >
                  <Icon fontSize="small" />
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full h-[650px] rounded-[4rem] overflow-hidden bg-[#0d1818] border-2 border-white/5 shadow-[0_0_80px_rgba(10,184,178,0.05)] ring-1 ring-white/10">
            {/* Dot Grid Background */}
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#0ab8b2 1.5px, transparent 1.5px)',
                backgroundSize: '60px 60px',
              }}
            />

            {/* Interactive Nodes */}
            <AnimatePresence>
              {/* Node 1: Foundation */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[20%] left-[20%] group cursor-pointer z-10"
              >
                <div className="absolute -inset-10 bg-[#0ab8b2]/10 blur-[40px] rounded-full group-hover:bg-[#0ab8b2]/30 transition-all" />
                <div className="relative size-16 rounded-[1.5rem] bg-[#0ab8b2] flex items-center justify-center text-[#102222] shadow-[0_0_30px_rgba(10,184,178,0.6)] rotate-12 group-hover:rotate-0 transition-transform">
                  <LockOpen fontSize="large" />
                </div>
                <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 backdrop-blur-3xl bg-white/[0.05] border border-white/10 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#0ab8b2] shadow-2xl transition-all group-hover:bg-[#0ab8b2] group-hover:text-[#102222]">
                  ESG 基礎概論 (100%)
                </div>
              </motion.div>

              {/* Node 2: Master (Active) */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group cursor-pointer z-20"
              >
                <div className="absolute -inset-24 bg-[#0ab8b2]/20 blur-[60px] rounded-full animate-pulse-slow pointer-events-none" />
                <div className="relative size-32 rounded-[3rem] bg-[#0ab8b2] flex items-center justify-center text-[#102222] shadow-[0_0_60px_rgba(10,184,178,0.8)] border-[6px] border-white/20 transition-all hover:scale-110">
                  <EnergySavingsLeaf style={{ fontSize: '64px' }} />
                </div>
                <div className="absolute top-full mt-10 left-1/2 -translate-x-1/2 backdrop-blur-3xl bg-white/[0.1] border border-[#0ab8b2]/40 p-8 rounded-3xl text-center shadow-3xl w-72 backdrop-hue-rotate-30">
                  <p className="text-xl font-black italic text-white tracking-tight mb-2 uppercase">
                    碳中和策略大師 Master
                  </p>
                  <div className="space-y-3">
                    <p className="text-[#0ab8b2] group-hover:text-white transition-colors text-[10px] font-black tracking-widest uppercase">
                      研習中 Active Learning (45%)
                    </p>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
                        className="h-full bg-[#0ab8b2] shadow-[0_0_10px_#0ab8b2]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Node 3: Locked */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="absolute bottom-[20%] right-[20%] group cursor-not-allowed z-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-60 transition-all"
              >
                <div className="size-16 rounded-[1.5rem] bg-[#3b5453] border border-white/20 flex items-center justify-center text-white/50 shadow-inner -rotate-12 group-hover:rotate-0 transition-transform">
                  <Lock fontSize="large" />
                </div>
                <div className="absolute top-full mt-8 left-1/2 -translate-x-1/2 backdrop-blur-3xl bg-white/[0.05] border border-white/5 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white/30 whitespace-nowrap">
                  永續金融體系 (未解鎖 Locked)
                </div>
              </motion.div>

              {/* SVG Connections */}
              <svg className="absolute inset-0 size-full pointer-events-none">
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                  x1="25%"
                  y1="25%"
                  x2="50%"
                  y2="50%"
                  stroke="#0ab8b2"
                  strokeWidth="2"
                  strokeDasharray="10 5"
                  className="opacity-40"
                />
                <motion.line
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2, delay: 0.5 }}
                  x1="50%"
                  y1="50%"
                  x2="75%"
                  y2="75%"
                  stroke="#0ab8b2"
                  strokeWidth="1"
                  className="opacity-20"
                />
              </svg>
            </AnimatePresence>

            {/* Sidebar Inspector Search */}
            <div className="absolute top-10 left-10 w-96 z-30">
              <div className="backdrop-blur-3xl bg-[#0a1414]/80 border border-white/10 rounded-3xl p-4 shadow-3xl">
                <div className="relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#0ab8b2] size-5" />
                  <input
                    className="w-full h-14 bg-transparent rounded-2xl pl-16 pr-8 text-sm font-black text-white outline-none placeholder:text-white/20"
                    placeholder="搜尋 ESG 模組 Search Modules..."
                  />
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Featured Courses Matrix */}
        <section className="space-y-12">
          <div className="flex items-center gap-10 px-6">
            <h3 className="text-[26px] font-black italic tracking-tighter text-white">
              精選 ESG 認證課程{' '}
              <span className="text-[#0ab8b2]/20 not-italic font-black text-xs ml-4 uppercase tracking-[0.3em]">
                Featured Academics
              </span>
            </h3>
            <div className="h-px flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {courses.map((course, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="backdrop-blur-3xl bg-white/[0.02] border border-white/10 rounded-[3rem] overflow-hidden group hover:border-[#0ab8b2]/50 transition-all duration-500 shadow-2xl flex flex-col"
              >
                {/* Banner Area */}
                <div className="h-64 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-[#102222] via-transparent to-transparent z-10" />
                  <div className="absolute inset-0 bg-[#0ab8b2]/5 group-hover:bg-[#0ab8b2]/15 transition-all" />
                  <div className="absolute bottom-8 left-8 z-20">
                    <span className="bg-[#0ab8b2] text-[#102222] text-[10px] font-black px-5 py-2 rounded-xl uppercase tracking-widest shadow-2xl ring-4 ring-[#0ab8b2]/10">
                      {course.level}
                    </span>
                  </div>
                  <Library className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-40 text-[#0ab8b2] opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700" />
                </div>

                {/* Course Content */}
                <div className="p-10 space-y-8 flex-1 flex flex-col">
                  <div className="space-y-4">
                    <h4 className="text-3xl font-black text-white tracking-tighter group-hover:text-[#0ab8b2] transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-white/40 text-base font-light leading-relaxed tracking-tight">
                      {course.desc}
                    </p>
                  </div>

                  <div className="space-y-10 pt-4 flex-1">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <span className="text-white/30">學習進度 Progress</span>
                        <span className="text-[#0ab8b2] italic">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${course.progress}%` }}
                          className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_10px_#0ab8b2]"
                        />
                      </div>
                    </div>

                    {/* Learning Workflow Visualizer */}
                    <div className="space-y-6 pt-6 border-t border-white/5">
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-4">
                        Learning Workflow Path
                      </p>
                      <div className="flex justify-between items-center relative gap-4">
                        <div className="absolute top-5 left-8 right-8 h-[1px] bg-white/5 -z-10" />
                        {course.workflow.map((step, idx) => (
                          <div
                            key={idx}
                            className={`flex flex-col items-center gap-3 transition-opacity duration-500 ${step.active ? 'opacity-100' : 'opacity-30 grayscale'}`}
                          >
                            <div
                              className={`size-10 rounded-2xl flex items-center justify-center transition-all ${step.active ? 'bg-[#0ab8b2] text-[#102222] shadow-[0_0_15px_rgba(10,184,178,0.4)]' : 'bg-white/5 border border-white/10 text-white/40'}`}
                            >
                              <step.icon fontSize="small" />
                            </div>
                            <span className="text-[9px] font-black tracking-widest">
                              {step.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    className={`w-full h-16 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[10px] transition-all active:scale-95 shadow-2xl mt-8 ${course.progress > 0 ? 'bg-[#0ab8b2] text-[#102222] hover:brightness-110' : 'bg-white/5 text-white/40 border border-white/10 hover:bg-white/10'}`}
                  >
                    {course.progress > 0 ? '繼續學習 Continue Learning' : '開始報名 (1200 XP)'}
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Locked Professional Card */}
            <div className="backdrop-blur-3xl bg-white/[0.01] border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center gap-8 relative opacity-40 group">
              <div className="size-32 rounded-full bg-white/5 flex items-center justify-center text-[#0ab8b2] shadow-inner mb-4">
                <Lock
                  fontSize="large"
                  className="opacity-30 group-hover:scale-125 transition-transform duration-700"
                />
              </div>
              <div className="text-center space-y-4">
                <h4 className="text-2xl font-black text-white/50 tracking-tighter uppercase italic">
                  循環經濟與永續供應鏈
                </h4>
                <p className="text-[10px] font-black text-[#0ab8b2] uppercase tracking-[0.3em]">
                  達成 Mastery LV.5 解鎖 Locked
                </p>
              </div>
              <div className="w-full flex items-center gap-4 text-white/10 pt-8 border-t border-white/5">
                <Info fontSize="small" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  需要先修：ESG 基礎概論 Required Foundation
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Master Path Footer Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="backdrop-blur-3xl bg-gradient-to-br from-[#0ab8b2]/10 to-transparent border border-[#0ab8b2]/30 rounded-[4rem] p-20 relative overflow-hidden shadow-3xl group"
        >
          <div className="absolute -top-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity">
            <Verified style={{ fontSize: '320px' }} className="text-[#0ab8b2]" />
          </div>

          <div className="flex flex-col xl:flex-row items-center gap-20 relative z-10">
            <div className="space-y-10 max-w-2xl">
              <div className="space-y-4">
                <h3 className="text-6xl font-black tracking-tighter text-white uppercase italic">
                  Path to Berkeley Mastery
                </h3>
                <p className="text-white/50 text-2xl font-light italic leading-relaxed tracking-tight">
                  Complete all core modules and pass the simulations to earn a global ESG
                  professional certification issued by{' '}
                  <span className="text-[#0ab8b2] font-black not-italic underline decoration-[#0ab8b2]/30">
                    Berkeley Academy & DingJun Hong
                  </span>
                  .
                </p>
              </div>
              <button className="h-24 bg-[#0ab8b2] text-[#102222] px-16 rounded-[2.5rem] font-black italic text-xl uppercase tracking-tighter shadow-[0_20px_60px_rgba(10,184,178,0.4)] hover:translate-y-[-5px] transition-all active:scale-95 group-hover:ring-4 ring-[#0ab8b2]/20">
                Start Certification Journey
              </button>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-8 w-full max-w-3xl">
              {[
                {
                  step: 'Step 1',
                  label: 'Full Enrollment',
                  en: 'Full Enroll',
                  desc: 'JAK-Core v2.4',
                },
                {
                  step: 'Step 2',
                  label: '50+ Hours Study',
                  en: 'Study Case',
                  desc: 'Global Metrics',
                },
                { step: 'Step 3', label: 'Live Evaluation', en: 'Live Eval', desc: 'AI Simulated' },
                {
                  step: 'Step 4',
                  label: 'Official Certification',
                  en: 'Official Cert',
                  desc: 'Verified Ledger',
                  active: true,
                },
              ].map((s, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-[2.5rem] flex flex-col items-center gap-3 transition-all ${s.active ? 'bg-[#0ab8b2] text-[#102222] shadow-2xl scale-105' : 'bg-white/5 border border-white/10 hover:bg-white/10'}`}
                >
                  <p
                    className={`text-2xl font-black italic tracking-tighter uppercase ${s.active ? 'text-[#102222]' : 'text-[#0ab8b2]'}`}
                  >
                    {s.step}
                  </p>
                  <div className="text-center group-hover:scale-105 transition-transform">
                    <h5 className="font-black text-lg tracking-tight uppercase leading-none mb-1">
                      {s.label}
                    </h5>
                    <p
                      className={`text-[10px] font-black uppercase tracking-widest ${s.active ? 'text-[#102222]/60' : 'text-white/20'}`}
                    >
                      {s.en}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="mt-32 pt-20 border-t border-white/5 px-20 pb-20 text-center space-y-8">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
          © 2024 Berkeley Certification Academy & DingJun Hong ESGss JunAiKey. All Rights Reserved.
        </p>
        <div className="flex justify-center gap-12">
          {['Privacy', 'Service Agreement', 'Contact Support'].map((f, i) => (
            <a
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.2em] text-white/10 hover:text-[#0ab8b2] transition-colors"
              href="#"
            >
              {f}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.1); }
        }
        custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        custom-scrollbar::-webkit-scrollbar-track {
          background: #0a1414;
        }
        custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0ab8b2;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
