import React from 'react';
import {
  Key,
  GraduationCap,
  Network,
  FileText,
  Activity,
  ShieldCheck,
  BarChart3,
  Shield,
  Layers,
  Link2,
  CheckCircle2,
  Navigation,
  Eye,
  GitBranch,
  RotateCcw,
  CheckCircle,
  Lightbulb,
  ExternalLink,
  Bot,
  HelpCircle,
  Play,
  Zap,
  Star,
  Clock,
  ArrowUpRight,
  Download,
  Heart,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 📊 Personal ESG Dashboard (Service 1.1)
 * --------------------------------------------------
 * "Walkthrough Optimized Version" for DingJun Hong.
 * Features: 5T Logic Gateway, Service Workflow, Learning Focus, Stats.
 */
export const PersonalEsgDashboard = () => {
  const steps = [
    {
      label: 'Step 01: 數據導入與清洗',
      desc: '上傳原始能耗清單與 ESG 相關合約數據，系統進行格式自動驗證。',
      status: 'COMPLETE',
      active: false,
    },
    {
      label: 'Step 02: 5T 邏輯建模',
      desc: 'AI 根據數據屬性，自動對接 5T 邏輯門進行數位孿生建模。',
      status: 'PROCESSING...',
      active: true,
    },
    {
      label: 'Step 03: 區塊鏈雜湊存證',
      desc: '將數據指紋提交至 JunAi-Chain，生成全球唯一識別雜湊值。',
      status: 'PENDING',
      active: false,
      opacity: 'opacity-60',
    },
    {
      label: 'Step 04: 自動化永續報告生成',
      desc: '符合國際標準 (GRI, SASB, TCFD) 的即時視覺化報告輸出。',
      status: '',
      active: false,
      opacity: 'opacity-40',
    },
  ];

  const logicDoors = [
    {
      id: 1,
      label: '實體化 (Tangible)',
      desc: '將碳權或綠色資產轉化為唯一且可識別的數位憑證。',
      status: 'SYNCED',
      icon: Layers,
    },
    {
      id: 2,
      label: '可溯源 (Traceable)',
      desc: '完整記錄供應鏈每一環節，確保每一筆數據來源真實可靠。',
      status: '128 VERIFIED',
      icon: Link2,
      border: 'border-l-2 border-l-[#0ABAB5]/30',
    },
    {
      id: 3,
      label: '可信賴 (Trustworthy)',
      desc: '透過區塊鏈雜湊鎖定，達成數據不可篡改性與時間戳認證。',
      status: 'HASH-LOCKED',
      icon: ShieldCheck,
      active: true,
    },
    {
      id: 4,
      label: '可追蹤 (Trackable)',
      desc: '全天候監控碳排放與能耗趨勢，精準掌握 ESG 動態表現。',
      status: 'REAL-TIME STREAM',
      icon: Navigation,
      border: 'border-r-2 border-r-[#0ABAB5]/30',
    },
    {
      id: 5,
      label: '透明化 (Transparent)',
      desc: '向利害關係人公開透明審計接口，建立市場與公眾信任。',
      status: 'AUDIT READY',
      icon: Eye,
    },
  ];

  return (
    <div className="bg-[#050d0d] text-white h-screen font-display selection:bg-[#0ABAB5]/20 flex overflow-hidden">
      {/* Background Refraction Effects */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_50%_-20%,#0a2e2d_0%,#050d0d_100%)]">
        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#0ABAB5]/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0ABAB5]/10 rounded-full blur-[120px]" />
      </div>

      {/* Side Navigation Sidebar */}
      <aside className="w-80 border-r border-[#0ABAB5]/15 flex flex-col bg-gradient-to-b from-[#051414]/80 to-[#050d0d]/95 backdrop-blur-3xl z-40 p-10 justify-between">
        <div className="space-y-12">
          {/* Logo */}
          <div className="flex items-center gap-5">
            <div className="size-12 bg-[#0ABAB5]/20 border border-[#0ABAB5]/40 rounded-2xl flex items-center justify-center shadow-lg">
              <Key className="text-[#0ABAB5]" size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black tracking-tighter text-white leading-none uppercase">
                JunAiKey
              </h1>
              <p className="text-[#0ABAB5] text-[9px] uppercase font-black tracking-[0.3em] mt-1">
                Sustainability Core
              </p>
            </div>
          </div>

          <nav className="space-y-3">
            {[
              { label: '教學型儀表板', icon: GraduationCap, active: true },
              { label: '5T 邏輯架構', icon: Network },
              { label: '服務導引手冊', icon: FileText },
              { label: '即時數據串流', icon: Activity },
              { label: '數位憑證驗證', icon: ShieldCheck },
            ].map((item, i) => (
              <a
                key={i}
                className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all border ${item.active ? 'bg-[#0ABAB5] text-[#050d0d] font-black border-[#0ABAB5]/40 shadow-[0_0_20px_rgba(10,186,181,0.3)]' : 'text-white/40 border-transparent hover:text-white hover:bg-white/5 group'}`}
                href="#"
              >
                <item.icon
                  size={20}
                  className={item.active ? '' : 'group-hover:text-[#0ABAB5] transition-colors'}
                />
                <span className="text-[13px] font-black tracking-tight">{item.label}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="space-y-6">
          <div className="backdrop-blur-3xl bg-[#0ABAB5]/5 border border-[#0ABAB5]/20 rounded-2xl p-6 shadow-xl">
            <p className="text-[10px] text-[#0ABAB5] font-black uppercase tracking-widest mb-4">
              學習進度 Education Track
            </p>
            <div className="flex items-center gap-4">
              <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.5 }}
                  className="h-full bg-[#0ABAB5] rounded-full shadow-[0_0_10px_#0ABAB5]"
                />
              </div>
              <span className="text-[10px] text-white/40 font-mono font-black">72%</span>
            </div>
          </div>
          <p className="text-center text-[9px] text-white/20 tracking-[0.4em] uppercase font-black">
            System v2.4.0 Optimized
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto scroll-smooth relative">
        {/* Top Header Navbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-3xl bg-[#050d0d]/70 border-b border-white/10">
          <div className="flex items-center gap-10">
            <h2 className="text-xl font-black text-white flex items-center gap-4 tracking-tighter italic">
              <BarChart3 className="text-[#0ABAB5] size-6" />
              1.1 個人ESG儀表板{' '}
              <span className="text-white/40 not-italic font-black text-xs ml-4 uppercase tracking-widest">
                (走查優化版)
              </span>
            </h2>
            <div className="h-6 w-px bg-white/10" />
            <nav className="hidden lg:flex items-center gap-9">
              {['服務概覽', '5T 邏輯解析', '操作引導'].map((link, i) => (
                <a
                  key={i}
                  className={`text-[11px] font-black uppercase tracking-[0.2em] transition-colors ${i === 0 ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5] pb-1' : 'text-white/40 hover:text-white'}`}
                  href="#"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end gap-1 group cursor-pointer">
              <div className="flex items-center justify-end gap-3">
                <span className="text-[9px] font-black text-[#0ABAB5] bg-[#0ABAB5]/10 px-3 py-1 rounded-lg border border-[#0ABAB5]/20 shadow-inner">
                  誠信護照 SYNCED
                </span>
                <span className="text-sm font-black text-white group-hover:text-[#0ABAB5] transition-colors">
                  DingJun Hong
                </span>
              </div>
              <span className="text-[9px] text-white/30 font-mono tracking-tighter uppercase font-black">
                ID: JUN-ESG-2024-8149
              </span>
            </div>
            <div className="relative group">
              <div className="size-11 rounded-full border-2 border-[#0ABAB5]/40 p-1 bg-[#050d0d] ring-4 ring-[#0ABAB5]/5 group-hover:ring-[#0ABAB5]/10 transition-all">
                <div
                  className="size-full rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage:
                      "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 size-5 bg-[#0ABAB5] rounded-full border-2 border-[#050d0d] flex items-center justify-center shadow-lg">
                <CheckCircle className="text-[#050d0d] size-3" />
              </div>
            </div>
          </div>
        </header>

        {/* Content Body */}
        <div className="max-w-[1500px] mx-auto p-12 space-y-16">
          {/* Welcome Hero Section */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="backdrop-blur-3xl bg-white/[0.04] rounded-[4rem] p-16 border border-[#0ABAB5]/20 shadow-3xl relative overflow-hidden group"
          >
            <div className="absolute -right-20 -top-20 size-[500px] bg-[#0ABAB5]/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center relative z-10">
              <div className="space-y-10">
                <div className="inline-flex items-center gap-4 px-6 py-2 rounded-full bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 shadow-xl">
                  <span className="text-[10px] font-black tracking-[0.4em] text-[#0ABAB5] uppercase">
                    Service Introduction
                  </span>
                </div>
                <h1 className="text-6xl font-black text-white tracking-tighter leading-none italic">
                  歡迎使用{' '}
                  <span className="text-[#0ABAB5] not-italic drop-shadow-[0_0_20px_rgba(10,186,181,0.5)]">
                    JunAiKey
                  </span>
                  <br />
                  ESG 數位轉型服務系統
                </h1>
                <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-2xl">
                  丁俊洪 您好，這是專為您打造的{' '}
                  <span className="text-white font-medium not-italic">教育導向 ESG 儀表板</span>
                  。我們將複雜的永續數據轉化為可視覺化的「5T
                  邏輯鏈結」，幫助您從資產實體性出發，構建透明且可追溯的綠色價值體系。
                </p>
                <div className="flex gap-6">
                  <button className="bg-[#0ABAB5] text-[#050d0d] px-10 py-5 rounded-[2rem] font-black italic text-sm hover:translate-y-[-5px] transition-all shadow-[0_20px_50px_rgba(10,186,181,0.3)] flex items-center gap-4 active:scale-95 group">
                    <Play className="group-hover:translate-x-1 transition-transform" /> 開始引導教學
                    Guided Tour
                  </button>
                  <button className="bg-white/5 border border-white/10 px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-4 active:scale-95 shadow-2xl">
                    <Download size={18} /> 服務手冊 Manual
                  </button>
                </div>
              </div>

              {/* Visual Representation */}
              <div className="flex justify-center flex-1">
                <div className="size-96 rounded-full border-2 border-[#0ABAB5]/20 flex items-center justify-center relative shadow-[inset_0_0_50px_rgba(10,186,181,0.1)]">
                  <div className="absolute inset-0 animate-pulse bg-[#0ABAB5]/5 rounded-full" />
                  <div className="size-72 rounded-full border-2 border-[#0ABAB5]/40 flex flex-col items-center justify-center text-center p-10 bg-[#0ABAB5]/5 backdrop-blur-2xl shadow-3xl">
                    <Heart className="text-[#0ABAB5] size-20 mb-4 drop-shadow-[0_0_20px_#0ABAB5]" />
                    <p className="text-[#0ABAB5] font-black text-2xl italic tracking-tighter uppercase">
                      核心價值
                    </p>
                    <p className="text-[10px] text-white/30 mt-2 uppercase font-black tracking-[0.3em]">
                      Trust & Transparency
                    </p>
                  </div>

                  {/* Floating Tags */}
                  {[
                    { label: 'TANGIBLE 實體化', pos: 'top-0 -translate-y-1/2' },
                    {
                      label: 'TRACEABLE 可溯源',
                      pos: 'right-0 translate-x-1/2 top-1/2 -translate-y-1/2',
                    },
                    { label: 'TRANSPARENT 透明化', pos: 'bottom-0 translate-y-1/2' },
                  ].map((tag, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.2 }}
                      className={`absolute ${tag.pos} bg-[#050d0d] border-2 border-[#0ABAB5]/40 px-6 py-2 rounded-full text-[10px] font-black text-[#0ABAB5] shadow-3xl uppercase tracking-widest whitespace-nowrap`}
                    >
                      {tag.label}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* 5T Logic Gateway Section */}
          <section className="space-y-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between"
            >
              <div className="space-y-3">
                <h2 className="text-4xl font-black italic tracking-tighter text-white">
                  5T 邏輯門解析{' '}
                  <span className="text-[#0ABAB5]/30 not-italic font-black text-xs uppercase tracking-widest ml-10 border-l border-white/20 pl-10">
                    5T Logic Architecture
                  </span>
                </h2>
                <p className="text-[#9cbab9] text-xl font-light italic tracking-tight italic leading-relaxed">
                  理解數據背後的永續邏輯，是轉型的關鍵第一步
                </p>
              </div>
              <div className="flex items-center gap-4 text-[10px] font-black italic text-[#0ABAB5] bg-[#0ABAB5]/5 px-6 py-3 rounded-full border-2 border-[#0ABAB5]/20 shadow-xl uppercase tracking-widest">
                <span className="size-2 rounded-full bg-[#0ABAB5] animate-ping" />
                LIVE NODES: 2,840 ACTIVE
              </div>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative isolate">
              {/* Connection Line */}
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#0ABAB5]/30 to-transparent -z-10 hidden lg:block" />

              {logicDoors.map((door, i) => (
                <motion.div
                  key={door.id}
                  whileHover={{ y: -10 }}
                  className={`backdrop-blur-3xl bg-white/[0.03] rounded-[2.5rem] p-10 border border-white/10 relative group cursor-help transition-all shadow-2xl ${door.active ? 'border-[#0ABAB5]/40 bg-[#0ABAB5]/10' : ''} ${door.border || ''}`}
                >
                  <div
                    className={`size-16 rounded-2xl flex items-center justify-center transition-all mb-8 shadow-xl ${door.active ? 'bg-[#0ABAB5] text-[#050d0d] shadow-[0_0_30px_rgba(10,186,181,0.5)]' : 'bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 text-[#0ABAB5]'}`}
                  >
                    <door.icon className="group-hover:scale-110 transition-transform" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-black text-xl italic text-white tracking-tighter group-hover:text-[#0ABAB5] transition-colors uppercase">
                      {door.label}
                    </h4>
                    <p className="text-white/40 text-xs font-light leading-relaxed tracking-tight group-hover:text-white/60 transition-colors">
                      {door.desc}
                    </p>
                  </div>
                  <div className="pt-8 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span
                      className={`text-[9px] font-black tracking-[0.2em] italic uppercase ${door.active ? 'text-white' : 'text-[#0ABAB5]'}`}
                    >
                      {door.status}
                    </span>
                    <HelpCircle className="text-white/10 size-4" />
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Workflow & Sidebar Widgets */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Service Workflow Tracker */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 backdrop-blur-3xl bg-white/[0.03] rounded-[3.5rem] p-16 border border-white/10 shadow-3xl"
            >
              <div className="flex items-center justify-between mb-16 px-6">
                <div className="flex items-center gap-6">
                  <div className="size-14 bg-[#0ABAB5]/20 border border-[#0ABAB5]/40 rounded-3xl flex items-center justify-center shadow-xl">
                    <Network className="text-[#0ABAB5] size-6" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black italic tracking-tighter text-white">
                      服務執行流程{' '}
                      <span className="text-white/20 not-italic font-black text-[11px] ml-4 uppercase tracking-widest">
                        Service Workflow Path
                      </span>
                    </h3>
                    <p className="text-xs text-white/30 font-black uppercase tracking-widest">
                      丁俊洪 專屬數據處理管道 Personalized Track
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-[#0ABAB5] border border-transparent hover:border-[#0ABAB5]/30 hover:bg-[#0ABAB5]/10 px-6 py-3 rounded-2xl transition-all shadow-xl">
                  <RotateCcw size={16} /> 重置導引 Reset
                </button>
              </div>

              <div className="space-y-12 relative px-4">
                <div className="absolute left-6 top-4 bottom-4 w-px bg-white/5" />
                {steps.map((step, i) => (
                  <div
                    key={i}
                    className={`relative pl-20 group transition-all ${step.opacity || ''}`}
                  >
                    <div
                      className={`absolute left-4 top-1.5 size-4 rounded-full border-4 border-[#050d0d] transition-all group-hover:scale-125 shadow-2xl ${step.active || step.status === 'COMPLETE' ? 'bg-[#0ABAB5] shadow-[0_0_15px_#0ABAB5]' : 'bg-white/10'}`}
                    />
                    <div
                      className={`flex flex-col md:flex-row gap-8 md:items-center justify-between p-10 rounded-[2.5rem] transition-all ${step.active ? 'bg-[#0ABAB5]/10 border-2 border-[#0ABAB5]/40 shadow-xl' : 'hover:bg-white/5 border border-transparent'}`}
                    >
                      <div className="space-y-2">
                        <h5
                          className={`font-black uppercase tracking-[0.2em] italic text-base ${step.active || step.status === 'COMPLETE' ? 'text-[#0ABAB5]' : 'text-white/40'}`}
                        >
                          {step.label}
                        </h5>
                        <p className="text-[#9cbab9] text-sm font-light italic leading-relaxed tracking-tight max-w-xl">
                          {step.desc}
                        </p>
                      </div>
                      {step.status && (
                        <div
                          className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 border ${step.status === 'COMPLETE' ? 'bg-white/10 border-white/20 text-[#0ABAB5]' : 'bg-[#0ABAB5]/20 text-[#0ABAB5] border-[#0ABAB5]/40 animate-pulse'}`}
                        >
                          {step.status === 'COMPLETE' ? (
                            <CheckCircle size={14} />
                          ) : (
                            <Zap size={14} />
                          )}{' '}
                          {step.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Sidebar Widgets Column */}
            <div className="flex flex-col gap-10">
              {/* Learning Focus Widget */}
              <motion.div
                whileHover={{ y: -5 }}
                className="backdrop-blur-3xl bg-gradient-to-br from-[#0ABAB5]/15 to-transparent border border-[#0ABAB5]/30 rounded-[3rem] p-12 space-y-8 shadow-3xl relative overflow-hidden group"
              >
                <div className="absolute -right-6 -top-6 size-32 bg-[#0ABAB5]/10 blur-3xl pointer-events-none" />
                <div className="flex items-center gap-5">
                  <div className="size-12 rounded-2xl bg-[#0ABAB5] flex items-center justify-center text-[#050d0d] shadow-xl">
                    <Lightbulb size={24} />
                  </div>
                  <h4 className="font-black text-xl italic tracking-tighter text-white">
                    今日學習焦點 Focus
                  </h4>
                </div>
                <p className="text-white/60 text-base font-light italic leading-relaxed tracking-tight italic">
                  丁君，在 5T 邏輯中，
                  <span className="text-white font-black not-italic border-b border-[#0ABAB5]">
                    「實體化 (Tangible)」
                  </span>{' '}
                  是數位轉型的基石。只有將抽象的碳排放數據與現實世界的具體設備連結，ESG
                  數據才具有實質的法律與金融意義。
                </p>
                <button className="w-full h-16 bg-[#0ABAB5]/10 hover:bg-[#0ABAB5]/20 rounded-2xl text-[10px] font-black uppercase tracking-widest text-[#0ABAB5] border border-[#0ABAB5]/30 transition-all flex items-center justify-center gap-4 active:scale-95 shadow-xl">
                  查看業界案例研究 Insight <ExternalLink size={16} />
                </button>
              </motion.div>

              {/* System Health Widget */}
              <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl">
                <h4 className="text-xl font-black italic tracking-tighter text-white flex justify-between items-center group">
                  系統監控狀態{' '}
                  <span className="text-[9px] text-[#0ABAB5] bg-[#0ABAB5]/10 border border-[#0ABAB5]/40 px-4 py-1.5 rounded-lg uppercase font-black tracking-widest shadow-xl">
                    Online Live
                  </span>
                </h4>
                <div className="space-y-10">
                  {[
                    { label: '數據同步新鮮度 Freshness', val: '2 mins ago', progress: 100 },
                    { label: '節點存取完整性 Integrity', val: '99.98%', progress: 99 },
                  ].map((m, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/30">{m.label}</span>
                        <span className="text-[#0ABAB5] italic">{m.val}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${m.progress}%` }}
                          className="h-full bg-[#0ABAB5]/60 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-4 border-t border-white/5">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/30">
                      誠信認證狀態 Audit
                    </span>
                    <span className="text-emerald-400 font-black text-xs italic flex items-center gap-3">
                      <CheckCircle size={16} /> 已通過年度驗證 VERIFIED
                    </span>
                  </div>
                </div>
              </div>

              {/* Bot Support Widget */}
              <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[3rem] p-10 relative overflow-hidden group hover:border-[#0ABAB5]/40 transition-all shadow-xl cursor-all-scroll">
                <div className="absolute -right-8 -bottom-8 opacity-5 group-hover:opacity-20 transition-all group-hover:scale-110">
                  <Bot size={120} className="text-[#0ABAB5]" />
                </div>
                <div className="relative z-10 space-y-4">
                  <h4 className="text-lg font-black italic tracking-tighter text-white">
                    需要 ESG 專業解析？ Support
                  </h4>
                  <p className="text-[11px] text-white/30 font-black uppercase tracking-tight leading-relaxed">
                    我們的 AI 顧問 24/7 在線為您解析複雜法規與數據邏輯。 Expert Guidance Available.
                  </p>
                  <button className="w-full h-14 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center justify-center gap-4 transition-all shadow-xl">
                    <Bot size={16} /> 呼叫 AI 助理 Launch AI
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics Footer Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                label: 'ESG 綜合評分 Score',
                val: '84.2',
                trend: '+2.4% ↑',
                color: 'text-[#0ABAB5]',
              },
              {
                label: '實體資產同步 Assets',
                val: '88.5%',
                trend: 'STABLE',
                color: 'text-[#0ABAB5]/60',
              },
              {
                label: '碳追蹤排放量 Carbon',
                val: '1.2t',
                trend: 'CO2e',
                unit: true,
                color: 'text-[#0ABAB5]/40',
              },
              {
                label: '透明度審核 Audit',
                val: '99.9%',
                trend: 'VERIFIED',
                color: 'text-[#0ABAB5]/20',
              },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className={`backdrop-blur-3xl p-10 rounded-[3rem] border-l-8 ${stat.color} border-y border-r border-white/5 space-y-4 shadow-3xl hover:translate-y-[-5px] transition-all group cursor-pointer`}
              >
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <div className="flex items-end gap-5">
                  <span className="text-5xl font-black text-white tracking-tighter leading-none">
                    {stat.val}
                  </span>
                  <span
                    className={`text-[11px] font-black uppercase tracking-widest mb-1 italic ${stat.color}`}
                  >
                    {stat.trend}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <footer className="mt-32 p-16 border-t border-white/5 text-center relative z-10 space-y-4">
          <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 italic">
            JunAiKey Sustainability Service Ecosystem © 2024
          </p>
          <p className="text-[9px] font-black text-white/10 uppercase tracking-[0.2em]">
            All rights reserved for DingJun Hong. Powered by Blockchain & AI Core v2.4.0
          </p>
        </footer>

        {/* Floating Help Assistance */}
        <div className="fixed bottom-12 right-12 z-50">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="size-20 rounded-full bg-[#0ABAB5] text-[#050d0d] flex items-center justify-center shadow-[0_0_50px_rgba(10,186,181,0.5)] border-4 border-white/20 active:scale-95 transition-all group relative help-float"
          >
            <HelpCircle size={32} />
            <div className="absolute right-24 top-1/2 -translate-y-1/2 bg-[#0ABAB5] text-[#050d0d] px-8 py-3 rounded-2xl text-[10px] font-black italic tracking-tighter uppercase whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-3xl border border-white/20">
              即時教學小助手 Guided Assistance Live
            </div>
          </motion.button>
        </div>
      </main>

      <style>{`
        .help-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0); }
          50% { transform: translateY(-15px) rotate(2deg); }
        }
        .animate-pulse-slow {
          animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};
