import React from 'react';
import {
  Diamond,
  Dashboard,
  GridView,
  AccountTree,
  Monitor,
  VerifiedUser,
  Settings,
  Notifications,
  Add,
  Download,
  Lock,
  TaskAlt,
  Search,
  Verified,
  PendingActions,
  AssignmentTurnedIn,
  Engineering,
  HistoryEdu,
  MoreVert,
} from '@mui/icons-material';
import {
  Box,
  LayoutGrid,
  GitBranch,
  Activity,
  ShieldCheck,
  Settings as SettingsIcon,
  Bell,
  Plus,
  Download as DownloadIcon,
  Lock as LockIcon,
  CheckCircle2,
  ShieldAlert,
  Clock,
  ClipboardCheck,
  Cpu,
  CheckCircle,
  MoreHorizontal,
  ChevronRight,
  Zap,
  Star,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useMissionStore } from '@/store/useMissionStore';
import { useNavigate } from 'react-router-dom';
import { MissionType } from '@/types/agency';

/**
 * 🛰️ Mission Matrix (Service 4.2)
 * --------------------------------------------------
 * "High-Efficiency Task Execution & 5T Audit System" for DingJun Hong.
 * Features: 3D Quadrant Grid, 5T Audit Workflow, Real-time Locked Rate.
 */
export const MissionMatrix = () => {
  const navigate = useNavigate();
  const { activeMissions, missionProgress } = useMissionStore();
  const missions = Array.from(activeMissions.values());

  const researchMissions = missions.filter(m => m.type === MissionType.RESEARCH);
  const otherMissions = missions.filter(m => m.type !== MissionType.RESEARCH);
  return (
    <div className="bg-[#102222] text-white h-screen font-display selection:bg-aqua-500/20 flex overflow-hidden">
      {/* Side Navigation Sidebar */}
      <aside className="w-80 border-r border-white/10 flex flex-col bg-[#102222]/80 backdrop-blur-3xl z-40">
        <div className="p-10 border-b border-white/10 flex items-center gap-6">
          <div className="size-10 bg-aqua-500 rounded-2xl flex items-center justify-center text-[#102222] shadow-[0_0_20px_rgba(0,255,255,0.4)] cursor-pointer hover:bg-aqua-500/80" onClick={() => navigate('/')}>
            <Diamond fontSize="medium" />
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white uppercase cursor-pointer" onClick={() => navigate('/')}>JunAiKey</h2>
        </div>

        <nav className="flex-1 p-8 flex flex-col gap-6">
          <div className="px-4 py-2 text-[10px] font-black text-aqua-400 uppercase tracking-[0.4em] opacity-60">
            核心導航 Core
          </div>
          <div className="space-y-3">
            {[
              { label: '總覽面板', icon: Dashboard, en: 'Overview' },
              { label: '任務矩陣', icon: GridView, en: 'Matrix', active: true },
              { label: '流程追踪', icon: AccountTree, en: 'Tree' },
              { label: '數據中心', icon: Monitor, en: 'Metrics' },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className={`flex items-center gap-5 px-6 py-4 rounded-2xl transition-all border ${item.active ? 'bg-aqua-500/20 text-aqua-400 border-aqua-500/30 shadow-lg' : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'}`}
              >
                <item.icon sx={{ fontSize: 20 }} />
                <div className="flex flex-col">
                  <span className="text-[13px] font-black tracking-tight">{item.label}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                    {item.en}
                  </span>
                </div>
              </a>
            ))}
          </div>

          <div className="mt-10 px-4 py-2 text-[10px] font-black text-aqua-400 uppercase tracking-[0.4em] opacity-60">
            系統管理 Admin
          </div>
          <div className="space-y-3">
            {[
              { label: '核驗報告', icon: VerifiedUser, en: 'Reports' },
              { label: '系統設置', icon: Settings, en: 'Settings' },
            ].map((item, i) => (
              <a
                key={i}
                href="#"
                className="flex items-center gap-5 px-6 py-4 text-white/40 hover:text-white transition-colors group"
              >
                <item.icon
                  sx={{ fontSize: 20 }}
                  className="group-hover:text-aqua-400 transition-colors"
                />
                <div className="flex flex-col">
                  <span className="text-[13px] font-black tracking-tight">{item.label}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest opacity-60">
                    {item.en}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </nav>

        <div className="p-8 mt-auto border-t border-white/5">
          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-6 rounded-[2rem] flex items-center gap-5 shadow-2xl">
            <div className="size-12 rounded-full border-2 border-aqua-500/40 p-0.5 ring-4 ring-aqua-500/5">
              <div
                className="size-full rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                }}
              />
            </div>
            <div className="flex flex-col">
              <p className="text-sm font-black text-white tracking-tight">DingJun Hong</p>
              <p className="text-[9px] text-aqua-400 font-black uppercase tracking-widest opacity-70">
                生態系統負責人 Leader
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto flex flex-col relative">
        {/* Abstract Background Particles */}
        <div className="absolute inset-0 pointer-events-none -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(0,255,255,0.15),transparent_50%),radial-gradient(ellipse_at_bottom_left,#0f172a,transparent_50%)]" />

        {/* Top Header Navbar */}
        <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-3xl bg-[#102222]/60 border-b border-white/10">
          <div className="flex items-center gap-10">
            <div className="relative group">
              <div className="absolute -inset-1 bg-aqua-500/20 rounded-2xl blur-lg transition-all group-focus-within:bg-aqua-500/40" />
              <div className="relative bg-slate-900 border border-white/10 rounded-2xl flex items-center px-6 py-3 w-96 shadow-2xl">
                <Search className="text-aqua-500/40 size-4 mr-4" />
                <input
                  className="bg-transparent text-white outline-none text-xs w-full placeholder:text-white/20"
                  placeholder="搜尋任務或 5T 狀態 Search Missions..."
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="size-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-aqua-400 transition-all active:scale-95">
              <Bell size={20} />
            </button>
            <button className="bg-aqua-500 hover:bg-aqua-500/80 text-slate-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-3 active:scale-95 transition-all">
              <Plus size={16} /> 新增任務 New Mission
            </button>
          </div>
        </header>

        <div className="px-10 py-12 space-y-12">
          {/* Page Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-end"
          >
            <div className="space-y-4">
              <h1 className="text-6xl font-black tracking-tighter text-white flex items-center gap-6 italic">
                4.2 任務矩陣{' '}
                <span className="text-aqua-500/30 not-italic font-black text-2xl uppercase tracking-widest ml-6">
                  Mission Matrix
                </span>
              </h1>
              <p className="text-aqua-100/60 text-2xl font-light italic leading-relaxed tracking-tight">
                高效率任務執行與{' '}
                <span className="text-white font-medium not-italic">5T 常態化核驗系統</span>{' '}
                運算心核 (Operational Core)
              </p>
            </div>
            <button className="flex items-center gap-4 px-10 py-5 bg-white/[0.03] border border-white/10 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all shadow-2xl active:scale-95">
              <DownloadIcon size={18} /> 導出數據報告 Export
            </button>
          </motion.div>

          {/* Stats Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                label: '5T 狀態鎖定率',
                val: '94.2%',
                trend: '+2.5%',
                up: true,
                icon: LockIcon,
                active: true,
              },
              { label: '任務達成率', val: '88.5%', trend: '-1.2%', up: false, icon: CheckCircle2 },
              {
                label: '核驗通過數',
                val: '1,280',
                trend: '+15%',
                up: true,
                icon: ShieldCheck,
                active: true,
              },
              { label: '待執行任務', val: '12', trend: '穩定 Stable', icon: Clock },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i }}
                className={`backdrop-blur-3xl p-10 rounded-[2.5rem] border-l-8 ${stat.active ? 'border-l-aqua-500 bg-white/[0.03]' : 'border-l-white/10 bg-white/[0.01]'} border-y border-r border-white/5 space-y-8 shadow-2xl group hover:border-l-aqua-500 transition-all`}
              >
                <div className="flex justify-between items-start">
                  <p className="text-white/30 text-[9px] font-black uppercase tracking-[0.3em]">
                    {stat.label}
                  </p>
                  <stat.icon
                    className={`text-aqua-400 opacity-40 group-hover:opacity-100 transition-opacity`}
                    size={20}
                  />
                </div>
                <div className="space-y-3">
                  <p className="text-5xl font-black text-white tracking-tighter">{stat.val}</p>
                  <div
                    className={`text-[10px] font-black italic uppercase tracking-widest flex items-center gap-2 ${stat.up ? 'text-emerald-400' : stat.up === false ? 'text-rose-400' : 'text-white/20'}`}
                  >
                    {stat.trend}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Workflow Interactive Step Bar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-3xl bg-white/[0.02] border border-aqua-500/20 rounded-[3rem] p-12 relative overflow-hidden shadow-3xl"
          >
            <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-aqua-500/50 to-transparent" />
            <div className="flex flex-col lg:flex-row justify-between items-center relative z-10 gap-16 lg:gap-8">
              {[
                { label: '任務指派', sub: '系統自動化分配', icon: ClipboardCheck, active: true },
                { label: '執行中', sub: '高效率開發矩陣', icon: Cpu, active: true },
                { label: '常態化核驗', sub: 'JunAiKey AI 核驗', icon: ShieldCheck, current: true },
                { label: '5T 鎖定', sub: '區塊鏈永久存證', icon: LockIcon, locked: true },
              ].map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex items-center gap-8 flex-1 group">
                    <div
                      className={`size-16 rounded-full flex items-center justify-center transition-all shadow-2xl ${step.current ? 'bg-aqua-500 text-slate-900 scale-110' : step.active ? 'bg-aqua-500/20 border border-aqua-500/40 text-aqua-400' : 'bg-white/5 border border-white/10 text-white/20'}`}
                    >
                      <step.icon size={28} className={step.current ? 'animate-pulse' : ''} />
                    </div>
                    <div className="space-y-1">
                      <p
                        className={`text-lg font-black tracking-tight ${step.current ? 'text-aqua-400' : step.active ? 'text-white' : 'text-white/20'}`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
                        {step.sub}
                      </p>
                    </div>
                  </div>
                  {i < 3 && (
                    <div className="hidden lg:block h-[1px] w-20 border-t border-dashed border-aqua-500/30" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* 3D Matrix Visualization Area */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12">
            {/* Quadrant 1: Urgent & Important */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                <span className="size-3 rounded-full bg-rose-500 animate-pulse shadow-[0_0_15px_#f43f5e]" />
                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                  緊急 & 重要 · 急迫{' '}
                  <span className="text-white/20 not-italic font-black text-[10px] ml-4 uppercase tracking-[0.2em]">
                    緊急核驗池 (Urgent Audit Pool)
                  </span>
                </h3>
              </div>
              <div className="backdrop-blur-3xl bg-gradient-to-br from-rose-500/10 to-transparent border border-rose-500/20 p-8 rounded-[3rem] space-y-6 shadow-2xl">
                {[
                  ...otherMissions.map(m => ({
                    title: m.name,
                    tag: '執行中 (Executing)',
                    progress: `${missionProgress.get(m.missionId)?.completionRate || 0}%`,
                    id: m.missionId
                  })),
                  {
                    title: '流體玻璃材質著色器優化',
                    tag: '執行中 (Executing)',
                    users: [3],
                    lead: 'Andy W.',
                    progress: '進度 75%',
                  },
                ].map((card, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-3xl bg-white/[0.04] border border-white/10 p-8 rounded-[2rem] hover:border-aqua-500/40 transition-all cursor-pointer shadow-xl relative group"
                  >
                    <div className="flex justify-between items-start mb-6">
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${card.tag === '5T Pending' ? 'bg-rose-500/10 text-rose-500' : 'bg-aqua-500/10 text-aqua-400'}`}
                      >
                        {card.tag}
                      </span>
                      <MoreHorizontal className="text-white/20 group-hover:text-white transition-colors" />
                    </div>
                    <h4 className="text-xl font-black italic text-white tracking-tight leading-none mb-8">
                      {card.title}
                    </h4>
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex -space-x-3">
                        {[1, 2].map(u => (
                          <div
                            key={u}
                            className="size-8 rounded-full border-2 border-[#0f172a] bg-cover bg-center"
                            style={{
                              backgroundImage: `url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')`,
                            }}
                          />
                        ))}
                        {('lead' in card && typeof card.lead === 'string') && (
                          <span className="text-[10px] font-black text-white/30 ml-6 self-center uppercase tracking-widest leading-none">
                            Lead: {card.lead}
                          </span>
                        )}
                      </div>
                      <div
                        className={`text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-xl bg-aqua-500/10 text-aqua-400 border border-aqua-500/30 shadow-inner`}
                      >
                        {String(('status' in card ? card.status : card.progress) || '')}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Quadrant 2: 5T Normalization Audit */}
            <div className="space-y-8">
              <div className="flex items-center gap-4 px-4">
                <span className="size-3 rounded-full bg-aqua-500 shadow-[0_0_15px_rgba(0,255,255,1)]" />
                <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                  5T 常態化核驗 · 隊列{' '}
                  <span className="text-white/20 not-italic font-black text-[10px] ml-4 uppercase tracking-[0.2em]">
                    核驗隊列 (Audit Queue)
                  </span>
                </h3>
              </div>
              <div className="backdrop-blur-3xl bg-gradient-to-br from-aqua-500/10 to-transparent border border-aqua-500/20 p-8 rounded-[3rem] space-y-6 shadow-2xl">
                {researchMissions.map((m, i) => (
                  <motion.div
                    key={m.missionId}
                    whileHover={{ scale: 1.02 }}
                    className="backdrop-blur-3xl bg-aqua-500/05 border-2 border-aqua-500/40 p-8 rounded-[2rem] relative overflow-hidden group hover:bg-aqua-500/10 transition-all cursor-pointer"
                    onClick={() => navigate('/integrity-passport')}
                  >
                    <div className="absolute top-0 right-0 p-6">
                      <Verified className="text-aqua-500 size-6 animate-pulse" />
                    </div>
                    <div className="mb-6">
                      <span className="text-[9px] font-black bg-aqua-500 text-slate-900 px-4 py-1.5 rounded-lg uppercase tracking-[0.3em] shadow-lg">
                        {missionProgress.get(m.missionId)?.mission_status === 'completed' ? '已鎖定 (LOCKED)' : '等待封印 (Awaiting Sealing)'}
                      </span>
                    </div>
                    <h4 className="text-2xl font-black italic text-white tracking-tighter leading-none mb-8">
                      {m.name}
                    </h4>
                    <div className="flex items-center justify-between border-t border-white/5 pt-6">
                      <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-aqua-400">
                        <HistoryEdu fontSize="small" /> 核驗進階引導: {m.priority.toUpperCase()}
                      </div>
                      <span className="text-[10px] font-mono font-black text-aqua-500/60 bg-black/40 px-3 py-1 rounded-md">
                        ID: {m.missionId.split('-')[1]}
                      </span>
                    </div>
                  </motion.div>
                ))}

                {!researchMissions.length && (
                  <div className="backdrop-blur-3xl bg-white/[0.04] border border-white/5 p-8 rounded-[2rem] space-y-6 opacity-40">
                    <h4 className="text-xl font-black italic text-white tracking-tight leading-none text-center">
                      暫無核驗中任務 No Audits in Queue
                    </h4>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quadrant 3: Completed & Locked 5T Archive */}
          <div className="space-y-8 mt-12">
            <div className="flex items-center gap-4 px-4">
              <span className="size-3 rounded-full bg-slate-600" />
              <h3 className="text-2xl font-black italic tracking-tighter text-white uppercase">
                已完成 · 5T 鎖定存檔{' '}
                <span className="text-white/20 not-italic font-black text-[10px] ml-4 uppercase tracking-[0.2em]">
                  不可篡改帳本 (Immutable Ledger)
                </span>
              </h3>
            </div>
            <div className="backdrop-blur-3xl bg-white/[0.02] border border-white/5 p-10 rounded-[3.5rem] shadow-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[
                  { label: 'UI 元件庫 V1.2 發布', date: '2023.10.24 鎖定' },
                  { label: '多維度數據可視化引擎', date: '2023.10.21 鎖定' },
                  { label: 'Tiffany Blue 材質庫擴充', date: '2023.10.18 鎖定' },
                ].map((arch, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 flex flex-col gap-5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer group shadow-xl"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-black text-aqua-400 tracking-[0.3em] uppercase">
                        安全鎖定 (LOCKED SECURE)
                      </span>
                      <Lock fontSize="small" className="text-aqua-400" />
                    </div>
                    <p className="text-lg font-black italic text-white tracking-tighter leading-tight group-hover:text-aqua-400 transition-colors">
                      {arch.label}
                    </p>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">
                      {arch.date}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-20 py-12 px-10 border-t border-white/5 opacity-30 text-center">
          <p className="text-[9px] font-black uppercase tracking-[0.5em] text-white italic">
            © 2024 ESGss JunAiKey • DingJun Hong • Mission Matrix Operating OS v4.2
          </p>
        </footer>
      </main>
    </div>
  );
};
