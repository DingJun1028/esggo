import React from 'react';
import {
  Hub,
  Groups,
  Analytics,
  School,
  Settings,
  Notifications,
  Search,
  CheckCircle,
  Sync,
  Description,
  VerifiedUser,
  Payments,
  Add,
  Remove,
  Navigation,
  Public as GlobeIcon,
} from '@mui/icons-material';
import {
  Network,
  Users,
  Activity,
  GraduationCap,
  Settings as SettingsIcon,
  Bell,
  Search as SearchIcon,
  CheckCircle2,
  RefreshCw,
  FileText,
  ShieldCheck,
  Wallet,
  Plus,
  Minus,
  MapPin,
  Globe2,
  Zap,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🌐 Supply Chain Collaboration Platform (Service 5.3)
 * --------------------------------------------------
 * "Global Node Monitoring & 5T Traceability" for DingJun Hong.
 * Features: World Map View, Supplier KPIs, Capacity Building.
 */
export const SupplyChainCollaboration = () => {
  const providers = [
    {
      id: 'S1',
      name: '宏基精密組件 (HK)',
      score: 98.5,
      level: '卓越 A+',
      color: 'text-[#0bda50]',
      bg: 'bg-[#0bda50]/20',
    },
    {
      id: 'S2',
      name: '綠能電子系統 (TW)',
      score: 92.0,
      level: '良好 A',
      color: 'text-[#0ab8b2]',
      bg: 'bg-[#0ab8b2]/20',
    },
    {
      id: 'S3',
      name: '新銳環保包材 (CN)',
      score: 89.7,
      level: '良好 A',
      color: 'text-[#0ab8b2]',
      bg: 'bg-[#0ab8b2]/20',
    },
    {
      id: 'S4',
      name: '博智物流科技 (SG)',
      score: 64.2,
      level: '待改進 C',
      color: 'text-orange-400',
      bg: 'bg-orange-400/20',
    },
  ];

  return (
    <div className="bg-[#0a1212] text-white h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col overflow-hidden">
      {/* Header Area */}
      <header className="z-50 flex items-center justify-between border-b border-[#0ab8b2]/20 bg-[#0a1212]/80 px-10 py-4 backdrop-blur-3xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] shadow-[0_0_15px_rgba(10,184,178,0.2)]">
              <Network size={28} />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black leading-none tracking-tight text-white uppercase">
                供應鏈協作平台 <span className="text-[#0ab8b2]">5.3</span>
              </h1>
              <p className="text-[9px] uppercase tracking-[0.3em] text-[#0ab8b2]/60 font-black mt-1">
                Supply Chain Collaboration Platform
              </p>
            </div>
          </div>
          <nav className="hidden lg:flex items-center gap-10 ml-6">
            {['全球地圖', 'ESG 績效', '能力建設', '數據協議'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all border-b-2 pb-1 ${i === 0 ? 'text-[#0ab8b2] border-[#0ab8b2]' : 'text-white/40 border-transparent hover:text-[#0ab8b2]'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group hidden sm:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0ab8b2]/40 size-4 group-focus-within:text-[#0ab8b2] transition-colors" />
            <input
              className="h-11 w-72 rounded-2xl border border-white/5 bg-[#0ab8b2]/5 pl-12 pr-6 text-xs text-white focus:ring-1 focus:ring-[#0ab8b2]/40 transition-all placeholder:text-[#0ab8b2]/30"
              placeholder="搜尋供應商 Search Vendors..."
              type="text"
            />
          </div>
          <button className="size-11 rounded-2xl bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 text-[#0ab8b2] flex items-center justify-center hover:bg-[#0ab8b2]/20 transition-all active:scale-95 shadow-xl">
            <Bell size={18} />
          </button>
          <div className="size-11 rounded-full border-2 border-[#0ab8b2]/30 p-0.5 overflow-hidden ring-4 ring-[#0ab8b2]/5">
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

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Mini Sidebar */}
        <aside className="w-24 border-r border-white/5 bg-[#0a1212] flex flex-col items-center py-10 gap-10 z-40">
          {[
            { icon: Globe2, active: true },
            { icon: Users },
            { icon: Activity },
            { icon: GraduationCap },
            { icon: SettingsIcon },
          ].map((btn, i) => (
            <button
              key={i}
              className={`group flex flex-col items-center justify-center size-14 rounded-2xl transition-all ${btn.active ? 'bg-[#0ab8b2] text-[#0a1212] shadow-[0_0_20px_rgba(10,184,178,0.4)]' : 'bg-white/5 text-white/30 hover:bg-[#0ab8b2]/10 hover:text-[#0ab8b2]'}`}
            >
              <btn.icon size={24} className="group-hover:scale-110 transition-transform" />
            </button>
          ))}
        </aside>

        {/* Global Map Content Area */}
        <main className="flex-1 relative bg-[#050a0a] overflow-hidden flex flex-col">
          {/* Abstract World Map Graphic Replacement */}
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute inset-x-0 bottom-0 top-0 bg-[radial-gradient(circle_at_center,#0ab8b2_0%,transparent_70%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <GlobeIcon className="size-[800px] text-[#0ab8b2] opacity-20" />
            </div>
          </div>

          {/* Node Overlay Points */}
          {[
            { label: '東亞生產基地', top: '35%', left: '25%', active: true },
            { label: '北美物流中心', top: '45%', right: '20%', active: false },
            { label: '歐洲研發總部', top: '32%', left: '55%', active: true },
          ].map((node, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.2 }}
              style={{ top: node.top, left: node.left, right: node.right }}
              className="absolute group z-10"
            >
              <div className="flex flex-col items-center">
                <div
                  className={`size-4 rounded-full ${node.active ? 'bg-[#0ab8b2] shadow-[0_0_20px_#0ab8b2] animate-pulse' : 'bg-white/20'} border-2 border-white/40`}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 bg-black/80 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-xl text-[10px] font-black text-[#0ab8b2] uppercase tracking-widest shadow-2xl transition-all group-hover:bg-[#0ab8b2] group-hover:text-[#0a1212]"
                >
                  {node.label}
                </motion.div>
              </div>
            </motion.div>
          ))}

          {/* Liquid HUD Overlays */}
          <div className="absolute inset-0 p-12 pointer-events-none flex flex-col justify-between z-20">
            {/* Headline Group */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="pointer-events-auto flex flex-col gap-2 max-w-xl"
            >
              <h2 className="text-5xl font-black text-white tracking-tighter italic">
                全球供應商 ESG 績效概覽
              </h2>
              <p className="text-[#0ab8b2]/80 text-xl font-light tracking-tight flex items-center gap-4">
                實時監測全球{' '}
                <span className="text-white font-black italic underline decoration-[#0ab8b2]/40">
                  1,420
                </span>{' '}
                個供應鏈節點 Dynamic Monitoring
              </p>
            </motion.div>

            <div className="flex flex-1 gap-12 mt-12 overflow-hidden">
              {/* Left Panel: Analytics & Protocols */}
              <div className="flex flex-col gap-8 w-96 pointer-events-auto">
                {/* Performance Stats */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="backdrop-blur-3xl bg-white/[0.03] border border-[#0ab8b2]/30 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden"
                >
                  <h3 className="text-[10px] font-black tracking-[0.3em] uppercase text-[#0ab8b2] mb-8">
                    核心指標數據 Analytics
                  </h3>
                  <div className="space-y-8">
                    {[
                      { label: '卓越績效供應商', val: '128', trend: '+5.2%', up: true },
                      { label: '待優化節點', val: '12', trend: '-1.4%', up: false },
                      { label: '數據同步率', val: '99.8%', check: true },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0"
                      >
                        <div className="space-y-1">
                          <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">
                            {stat.label}
                          </p>
                          <p className="text-4xl font-black text-white tracking-tighter">
                            {stat.val}
                            {stat.check && '%'}
                          </p>
                        </div>
                        {stat.trend && (
                          <span
                            className={`text-[11px] font-black italic ${stat.up ? 'text-emerald-400' : 'text-red-400'}`}
                          >
                            {stat.trend}
                          </span>
                        )}
                        {stat.check && <CheckCircle2 className="text-[#0ab8b2] size-6 mb-1" />}
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Capacity Building */}
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="backdrop-blur-3xl bg-white/[0.03] border-l-4 border-l-[#0ab8b2] border-y border-r border-white/5 p-8 rounded-3xl shadow-2xl space-y-8"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-black tracking-tight text-white flex items-center gap-4 italic">
                      能力建設進度{' '}
                      <span className="text-[#0ab8b2]/40 not-italic font-black text-xs uppercase tracking-widest">
                        CP Build
                      </span>
                    </h3>
                    <GraduationCap className="text-[#0ab8b2] size-6" />
                  </div>
                  <div className="space-y-6">
                    {[
                      { label: '減碳路徑培訓', val: 85 },
                      { label: '人權合規課程', val: 42 },
                    ].map((cap, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex justify-between text-[10px] font-black tracking-[0.1em] uppercase">
                          <span className="text-white/50">{cap.label}</span>
                          <span className="text-[#0ab8b2]">{cap.val}%</span>
                        </div>
                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-[1px]">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${cap.val}%` }}
                            transition={{ duration: 1.5, delay: 0.8 }}
                            className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_15px_rgba(10,184,178,0.5)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full h-14 bg-[#0ab8b2]/10 hover:bg-[#0ab8b2]/20 text-[#0ab8b2] rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-[#0ab8b2]/20 active:scale-95 shadow-xl">
                    進入培訓門戶 Training Portal
                  </button>
                </motion.div>

                {/* Data Protocol Info */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="backdrop-blur-3xl bg-black/40 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group hover:border-[#0ab8b2]/40 transition-colors cursor-pointer"
                >
                  <Zap className="text-[#0ab8b2] size-8 animate-pulse drop-shadow-[0_0_10px_#0ab8b2]" />
                  <div className="space-y-1">
                    <p className="text-xs font-black text-white tracking-tight uppercase">
                      DINGJUN-API-v5.3
                    </p>
                    <p className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                      液態玻璃封裝協議運行中 Active
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Right Panel: Partner List */}
              <div className="flex-1 flex flex-col gap-6 max-w-sm ml-auto pointer-events-auto">
                <div className="flex justify-between items-center px-4">
                  <h3 className="text-xl font-black italic tracking-tighter text-white">
                    頂級合作夥伴{' '}
                    <span className="text-white/20 text-xs not-italic ml-2 uppercase font-black tracking-widest">
                      Top Tier
                    </span>
                  </h3>
                  <button className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ab8b2] hover:underline">
                    查看全部 View All
                  </button>
                </div>

                <div className="space-y-4 overflow-y-auto pr-4 custom-scrollbar">
                  {providers.map((p, idx) => (
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + idx * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="backdrop-blur-3xl bg-white/[0.03] border border-white/5 p-6 rounded-[2rem] flex items-center gap-6 group cursor-pointer hover:border-[#0ab8b2]/40 transition-all shadow-xl"
                    >
                      <div className="size-14 shrink-0 bg-gradient-to-br from-[#0ab8b2]/30 to-transparent border border-[#0ab8b2]/20 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-inner">
                        {p.id}
                      </div>
                      <div className="flex-1 space-y-2">
                        <p className="font-black text-lg text-white group-hover:text-[#0ab8b2] transition-colors tracking-tight">
                          {p.name}
                        </p>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full ${p.bg} ${p.color} border border-current opacity-60 shadow-sm`}
                          >
                            {p.level}
                          </span>
                          <span className="text-[11px] font-black text-white/30 italic">
                            {p.score} 評分
                          </span>
                        </div>
                      </div>
                      <ChevronRight
                        className="text-white/10 group-hover:text-white transition-all group-hover:translate-x-1"
                        size={20}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Controls / Legend */}
            <div className="mt-auto flex items-end justify-between pointer-events-auto">
              <div className="flex flex-col gap-6">
                <div className="backdrop-blur-3xl bg-black/60 px-8 py-4 rounded-[2rem] border border-white/10 flex items-center gap-10 shadow-2xl">
                  {[
                    { label: '卓越績效', color: 'bg-emerald-500' },
                    { label: '良好績效', color: 'bg-[#0ab8b2]' },
                    { label: '需改進', color: 'bg-orange-500' },
                  ].map((l, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-white/40"
                    >
                      <div
                        className={`size-2.5 rounded-full ${l.color} shadow-[0_0_8px_currentColor]`}
                      />
                      <span>{l.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col rounded-2xl bg-black/80 backdrop-blur-3xl border border-white/10 overflow-hidden shadow-2xl">
                  <button className="size-12 flex items-center justify-center border-b border-white/5 hover:bg-[#0ab8b2] hover:text-[#0a1212] transition-all text-white/50">
                    <Plus size={20} />
                  </button>
                  <button className="size-12 flex items-center justify-center hover:bg-[#0ab8b2] hover:text-[#0a1212] transition-all text-white/50">
                    <Minus size={20} />
                  </button>
                </div>
                <button className="size-14 bg-[#0ab8b2] flex items-center justify-center rounded-2xl text-[#0a1212] shadow-[0_0_30px_rgba(10,184,178,0.3)] hover:scale-110 transition-transform active:scale-95 shadow-2xl z-30">
                  <Navigation className="size-6 rotate-45" />
                </button>
              </div>
            </div>
          </div>

          {/* Verification Protocol Modal Simulation Overlay */}
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 z-50 w-[550px]"
          >
            <div className="backdrop-blur-3xl bg-[#0ab8b2]/10 border-2 border-[#0ab8b2]/50 rounded-[2.5rem] p-6 shadow-[0_0_100px_rgba(10,184,178,0.2)] relative overflow-hidden group">
              <div className="absolute top-0 left-0 h-[2.5px] w-full bg-gradient-to-r from-transparent via-[#0ab8b2] to-transparent animate-shimmer" />
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-6">
                  <div className="size-3 rounded-full bg-[#0ab8b2] animate-ping" />
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-white tracking-[0.2em] uppercase italic">
                      實時數據共享鏈路 Active Sync
                    </span>
                    <p className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest opacity-80 leading-none">
                      端對端加密已開啟 E2E Encrypted Protocol v5.4.12
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-white/20">
                  <RefreshCw size={16} className="animate-spin-slow" />
                  <span className="text-[9px] font-black transition-colors group-hover:text-[#0ab8b2]">
                    LOGGING...
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </main>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite linear;
        }
        .animate-spin-slow {
          animation: spin 6s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
