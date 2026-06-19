import React from 'react';
import {
  Code,
  VerifiedUser,
  Dataset,
  Bolt,
  Lock,
  Tune,
  RocketLaunch,
  Terminal,
  ArrowForwardIos,
  Sync,
  Hub,
  GridView,
  AccountTree,
  Api,
  Security,
  Policy,
  SyncAlt,
} from '@mui/icons-material';
import {
  Cpu,
  ShieldCheck,
  Database as DatabaseIcon,
  Zap,
  Lock as LockIcon,
  Terminal as TerminalIcon,
  Code2,
  Activity,
  Fingerprint,
  RefreshCw,
  Settings2,
  Box,
  Hexagon,
  CheckCircle2,
  ChevronRight,
  ClipboardCode,
  Globe,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🛠️ 5T Protocol Core Stabilization (Service 5.1)
 * --------------------------------------------------
 * "Real-time Monitoring of 4+1 State Machines & SSOT Core Contracts" for DingJun Hong.
 * Features: Type Safety Monitor, SSOT Terminal, 4+1 Core State, Immutability Locks.
 */
export const ProtocolCoreStabilization = () => {
  return (
    <div className="bg-[#102122] text-white min-h-screen font-display selection:bg-[#09abb3]/30 overflow-x-hidden">
      {/* Background Radial Gradient */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_left,#1a2e2f_0%,#102122_100%)]">
        <div className="absolute top-0 right-0 size-[800px] bg-[#09abb3]/5 rounded-full blur-[150px]" />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-3xl bg-[#102122]/70 border-b border-white/5 border-l border-white/5 border-r border-white/5 rounded-b-[2rem] mx-4 shadow-2xl">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 text-[#09abb3]">
            <div className="size-10 bg-[#09abb3]/10 border border-[#09abb3]/20 rounded-2xl flex items-center justify-center shadow-lg">
              <Code fontSize="large" className="font-light" />
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-lg font-black tracking-tighter leading-none uppercase">
                ESGss JunAiKey
              </h2>
              <span className="text-[10px] text-[#09abb3]/70 font-black uppercase tracking-[0.3em] mt-1">
                Stabilization Suite
              </span>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            {['總覽儀表板', '架構協議', '資料模式', '監控日誌'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 ${i === 1 ? 'text-[#09abb3] border-b-2 border-[#09abb3] pb-1' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="group relative hidden lg:block">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm">
              search
            </span>
            <input
              className="w-80 bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-6 text-xs font-black outline-none focus:ring-1 focus:ring-[#09abb3] focus:border-[#09abb3] placeholder:text-white/20 transition-all shadow-inner"
              placeholder="搜尋核心架構參數 Search Protocol..."
            />
          </div>
          <button className="flex items-center gap-3 bg-[#09abb3]/20 hover:bg-[#09abb3]/30 border border-[#09abb3]/40 px-8 py-3 rounded-full text-[#09abb3] text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 shadow-xl">
            <RocketLaunch fontSize="small" /> 部署協議佈建 Deploy
          </button>
          <div className="size-11 rounded-full border-2 border-[#09abb3]/30 p-0.5 overflow-hidden ring-4 ring-[#09abb3]/5">
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
        {/* Page Heading & Metadata */}
        <div className="flex flex-wrap justify-between items-end gap-10 px-4">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-5">
              <h1 className="text-6xl font-black tracking-tighter text-white italic">
                5.1 5T 協議核心穩定化
              </h1>
              <span className="bg-[#09abb3]/10 border border-[#09abb3]/30 text-[#09abb3] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest shadow-inner h-fit self-center">
                走查優化版 v1.0.42
              </span>
            </div>
            <p className="text-white/50 text-2xl font-light leading-relaxed tracking-tight italic">
              ESGss JunAiKey: 即時監控
              <span className="text-white font-medium not-italic">「4+1」狀態機運作</span> 與{' '}
              <span className="text-[#09abb3] font-black underline decoration-[#09abb3]/20">
                SSOT 核心合約穩定性
              </span>
            </p>
          </motion.div>

          <button className="flex items-center gap-4 px-10 py-4 bg-white/[0.03] border border-white/10 rounded-2xl hover:bg-white/10 transition-all text-[11px] font-black uppercase tracking-widest shadow-3xl active:scale-95">
            <Tune fontSize="small" className="text-[#09abb3]" /> 協議細節設定 Config
          </button>
        </div>

        {/* Real-time Stability Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              label: '類型安全性 Safety',
              val: '100%',
              trend: '+0.4% 提升',
              icon: VerifiedUser,
              color: '#09abb3',
              active: true,
            },
            {
              label: '架構完整性 Integrity',
              val: 'VALID',
              tag: 'SSOT',
              icon: Dataset,
              color: '#09abb3',
            },
            {
              label: '同步延遲率 Latency',
              val: '12ms',
              trend: '-2ms 優化',
              icon: Bolt,
              color: '#fa5c38',
            },
            {
              label: '不可篡改鎖定 Locked',
              val: 'ACTIVE',
              icon: Lock,
              status: 'Object.freeze()',
              color: '#09abb3',
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] relative overflow-hidden group hover:border-[#09abb3]/40 transition-all shadow-2xl"
            >
              <div
                className={`absolute -right-10 -top-10 size-40 bg-[${stat.color}]/5 rounded-full blur-[60px] group-hover:bg-[${stat.color}]/10 transition-all`}
              />
              <div className="flex justify-between items-start mb-8 relative z-10">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <stat.icon className="text-[#09abb3] drop-shadow-[0_0_5px_rgba(9,171,179,0.4)]" />
              </div>
              <div className="flex items-baseline gap-4 relative z-10">
                <p className="text-5xl font-black text-white tracking-tighter italic">{stat.val}</p>
                {stat.trend && (
                  <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest italic">
                    {stat.trend}
                  </span>
                )}
                {stat.tag && (
                  <span className="bg-[#09abb3]/10 border border-[#09abb3]/30 text-[#09abb3] px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest shadow-inner ml-2">
                    {stat.tag}
                  </span>
                )}
              </div>
              {stat.status ? (
                <div className="mt-8 flex items-center gap-3 text-[#09abb3] text-[10px] font-black tracking-widest uppercase italic">
                  <span className="size-2 rounded-full bg-[#09abb3] animate-pulse" />
                  {stat.status} 已啟用 Active
                </div>
              ) : (
                <div className="mt-8 h-1.5 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="h-full bg-[#09abb3] rounded-full shadow-[0_0_15px_#09abb3]"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Main Operational Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: SSOT Terminal Console */}
          <div className="lg:col-span-7 flex flex-col gap-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="backdrop-blur-3xl bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden flex flex-col h-[650px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10"
            >
              {/* Terminal Bar */}
              <div className="bg-[#102122]/80 px-8 py-5 flex items-center justify-between border-b border-white/5 shadow-xl">
                <div className="flex gap-3">
                  <div className="size-3 rounded-full bg-rose-500/20 border border-rose-500/50" />
                  <div className="size-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                  <div className="size-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="flex items-center gap-4 text-white/30 text-[11px] font-black font-mono tracking-tighter uppercase">
                  <Terminal className="size-4" />
                  SSOT_Terminal — type-check --watch
                </div>
                <div className="bg-[#09abb3]/10 border border-[#09abb3]/30 text-[#09abb3] px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                  v1.0.4 CORE
                </div>
              </div>

              {/* Console Output */}
              <div className="p-12 font-mono text-sm overflow-y-auto selection:bg-[#09abb3]/30 space-y-6 leading-loose custom-scrollbar">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center gap-4 text-[#09abb3]/80"
                >
                  <ChevronRight size={14} className="animate-pulse" />
                  <span className="font-bold">
                    Initializing ESGss 5T Logic Validation Engine...
                  </span>
                </motion.div>

                <div className="space-y-4">
                  <p className="text-white/40 italic">
                    [10:42:01]{' '}
                    <span className="bg-emerald-500/10 text-emerald-400 px-3 py-0.5 rounded-lg text-[10px] font-black tracking-widest border border-emerald-500/30">
                      SUCCESS
                    </span>{' '}
                    Found <span className="text-white font-black">0 errors</span> in 142
                    architecture files.
                  </p>
                  <p className="text-white/40 italic">
                    [10:42:05] <span className="text-[#09abb3] font-black">INFO</span> 不可篡改鎖定:
                    Applying{' '}
                    <span className="bg-[#09abb3]/10 text-[#09abb3] px-2 py-0.5 rounded font-mono">
                      Object.freeze()
                    </span>{' '}
                    to <span className="text-white">SSOT_Contract</span>
                  </p>
                </div>

                {/* Code Snippet */}
                <div className="bg-black/60 p-10 rounded-[2.5rem] border border-white/10 relative group shadow-inner isolate">
                  <div className="absolute top-6 right-8 opacity-20 group-hover:opacity-100 transition-opacity flex items-center gap-4">
                    <span className="text-[9px] font-black uppercase tracking-[.3em] text-white/40">
                      Read-Only
                    </span>
                    <ClipboardCode
                      size={16}
                      className="text-[#09abb3] cursor-pointer hover:scale-110 transition-all"
                    />
                  </div>
                  <pre className="text-white/80 overflow-x-auto">
                    <code className="text-[13px] leading-relaxed">
                      {`const SSOT_Contract = Object.freeze({
    id: "5T-CORE-001",
    protocol: "JunAiKey",
    stability: 1.0,
    validation: () => true,
    metadata: {
        type: "High-end Liquid Glass",
        state: "Frozen",
        sealed: Date.now()
    }
});`}
                    </code>
                  </pre>
                  <div className="absolute -inset-1 bg-gradient-to-br from-[#09abb3]/10 to-transparent -z-10 rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div className="space-y-3 pt-6">
                  <div className="flex items-center gap-4 text-[#09abb3]/60 text-xs font-black uppercase tracking-[0.2em]">
                    <RefreshCw size={14} className="animate-spin-slow" />
                    監測狀態轉換中... Monitoring state transitions...
                  </div>
                  <div className="space-y-1">
                    <p className="text-white/10 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                      <CheckCircle2 size={12} className="text-emerald-400/40" /> 驗證 4+1
                      協調節點完整性 Coordination Nodes... [OK]
                    </p>
                    <p className="text-white/10 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                      <CheckCircle2 size={12} className="text-emerald-400/40" /> 檢查資料模式映射
                      Mapping JSON Interface... [OK]
                    </p>
                    <p className="text-white/10 text-[11px] font-black uppercase tracking-widest flex items-center gap-4">
                      <LockIcon size={12} className="text-[#09abb3]/40" /> 鎖定 ESGss 全域狀態
                      Global State Root... [LOCKED]
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: 4+1 State Machine Visualizer */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Coordination Core Diagram */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-12 flex flex-col gap-10 shadow-3xl relative overflow-hidden group h-fit"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="text-2xl font-black italic tracking-tighter text-white flex items-center gap-4">
                    <Hub className="text-[#09abb3] size-7" />
                    4+1 狀態機核心{' '}
                    <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest ml-4">
                      Coordination Architecture
                    </span>
                  </h3>
                  <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.3em]">
                    DingJun Operational Hub v1.2
                  </p>
                </div>
                <span className="bg-[#09abb3] text-[#102122] px-4 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-widest shadow-xl">
                  SSOT Active
                </span>
              </div>

              {/* Central Diagram */}
              <div className="relative h-64 flex items-center justify-center isolate">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#09abb320_0%,transparent_70%)] blur-3xl opacity-40 group-hover:opacity-100 transition-all pointer-events-none" />

                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10 size-28 rounded-full bg-[#102122] border-4 border-[#09abb3]/60 flex items-center justify-center shadow-[0_0_50px_rgba(9,171,179,0.3)] ring-1 ring-[#09abb3]/20"
                >
                  <div className="text-center">
                    <p className="text-[#09abb3] font-black text-xs leading-none tracking-tighter uppercase">
                      CORE
                    </p>
                    <p className="text-white text-[9px] font-black opacity-40 uppercase tracking-widest mt-1">
                      COORD
                    </p>
                  </div>
                </motion.div>

                {/* Satellite Nodes */}
                {[
                  { label: 'GRID', icon: GridView, pos: 'top-0 -translate-y-4' },
                  { label: 'TREE', icon: AccountTree, pos: 'bottom-0 translate-y-4' },
                  { label: 'API', icon: Api, pos: 'left-0 -translate-x-4' },
                  { label: 'SEC', icon: Security, pos: 'right-0 translate-x-4' },
                ].map((node, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.1, rotate: idx % 2 === 0 ? 5 : -5 }}
                    className={`absolute ${node.pos} size-16 rounded-2xl bg-[#102122] border border-[#09abb3]/30 flex items-center justify-center text-[#09abb3] shadow-2xl transition-all cursor-pointer hover:bg-[#09abb3]/10 hover:border-[#09abb3] group/node active:scale-95`}
                  >
                    <node.icon
                      className="group-hover/node:scale-110 transition-transform"
                      fontSize="medium"
                    />
                    <div className="absolute -top-10 opacity-0 group-hover/node:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest shadow-xl pointer-events-none">
                      {node.label} NODE
                    </div>
                  </motion.div>
                ))}

                {/* Connecting Lines (SVG) */}
                <svg className="absolute inset-0 size-full pointer-events-none opacity-20">
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="20%"
                    stroke="#09abb3"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="50%"
                    y2="80%"
                    stroke="#09abb3"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="20%"
                    y2="50%"
                    stroke="#09abb3"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                  <line
                    x1="50%"
                    y1="50%"
                    x2="80%"
                    y2="50%"
                    stroke="#09abb3"
                    strokeWidth="1"
                    strokeDasharray="4 2"
                  />
                </svg>
              </div>

              {/* Status Summary Pods */}
              <div className="grid grid-cols-2 gap-6">
                <div className="backdrop-blur-3xl bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex flex-col gap-2 hover:bg-white/10 transition-all group/item">
                  <span className="text-[9px] font-black text-white/30 tracking-widest uppercase">
                    邏輯狀態驗證 Logic Audit
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black italic tracking-tight text-white group-hover/item:text-emerald-400 transition-colors">
                      4 個已通過 Verified
                    </span>
                    <CheckCircle2 size={16} className="text-emerald-400" />
                  </div>
                </div>
                <div className="backdrop-blur-3xl bg-white/[0.03] p-6 rounded-3xl border border-white/5 flex flex-col gap-2 hover:bg-white/10 transition-all group/item">
                  <span className="text-[9px] font-black text-white/30 tracking-widest uppercase">
                    協調中心狀態 Status
                  </span>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black italic tracking-tight text-[#09abb3]">
                      運作中 ACTIVE (+1)
                    </span>
                    <Sync fontSize="small" className="text-[#09abb3] animate-spin-slow" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* SSOT Global View Card */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative rounded-[3.5rem] aspect-[16/8] overflow-hidden group cursor-pointer border border-[#09abb3]/20 shadow-3xl flex flex-col"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBgcp7xYqxGnlpSZSy5fPJiQxZ4Wd3bUfFtPUQ3V6L6jfr3hJU9LDt7xpr1r7LBroOvxQ6zkK4WsygaYlC6SEtxqewiONUrvkI14PvgmeoHivM6Vy-vgCQmtcVSIblodLuO3T8AftYnvOaovbY7-eMIP6Ceb-O8PfoFYNsJcjXfH71UsRu6JWE3AJsQ_vNHdZM6VyqahHDNU87CS1dTwvYEI6Ytk0GsP2GM7mhT9ourNSwDwuQIpcy1g1pF6zyVPQjIsUxF6kIGXD0')",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#102122] via-[#102122]/40 to-transparent" />
              <div className="absolute inset-0 p-12 flex flex-col justify-end gap-2 relative z-10 transition-all group-hover:translate-x-4">
                <span className="text-[10px] font-black text-[#09abb3] uppercase tracking-[0.5em] mb-2">
                  Omni-Visualization
                </span>
                <div className="flex items-center justify-between w-full pr-12">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black italic text-white tracking-tighter leading-none">
                      SSOT 架構全視圖 Full Tree
                    </h3>
                    <p className="text-white/40 text-[10px] font-black uppercase tracking-widest mt-1">
                      點擊展開全域原始碼與元件樹狀系統 Source Map
                    </p>
                  </div>
                  <div className="size-16 rounded-full bg-[#09abb3]/20 border border-[#09abb3]/40 flex items-center justify-center text-[#09abb3] group-hover:bg-[#09abb3] group-hover:text-[#102122] transition-all shadow-2xl active:scale-90">
                    <ArrowForwardIos
                      fontSize="small"
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Verification Summary Footer Widgets */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pt-16 border-t border-white/5 pb-24">
          {[
            { label: 'DingJun 協議版本', sub: 'Runtime Stability: V5.1 Production', icon: Policy },
            {
              label: '信任驗證機制 Trust',
              sub: '硬核狀態鎖定 (Hard-Locked Object)',
              icon: Security,
            },
            {
              label: '資料架構同步 Schema',
              sub: '上次同步: 2 分鐘前 (系統自動更新)',
              icon: SyncAlt,
            },
          ].map((widget, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex items-center gap-8 group hover:border-[#09abb3]/50 transition-all shadow-2xl"
            >
              <div className="size-16 rounded-[2rem] bg-[#09abb3]/10 border border-[#09abb3]/20 flex items-center justify-center text-[#09abb3] shadow-inner group-hover:scale-110 transition-transform">
                <widget.icon fontSize="large" className="font-light" />
              </div>
              <div className="space-y-1">
                <p className="text-white text-xl font-black italic tracking-tighter uppercase">
                  {widget.label}
                </p>
                <p className="text-white/30 text-[10px] font-black uppercase tracking-widest leading-none">
                  {widget.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      {/* Floating System Fingerprint */}
      <div className="fixed bottom-10 right-12 pointer-events-none opacity-20 z-50">
        <p className="text-[9px] font-mono text-white tracking-[0.5em] uppercase font-black italic">
          ESGss-5T-STABILIZATION-V1.0.42-SSOT-STABLE
        </p>
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(9, 171, 179, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
