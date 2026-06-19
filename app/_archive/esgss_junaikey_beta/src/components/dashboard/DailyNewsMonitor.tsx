import React, { useState } from 'react';
import {
  Newspaper,
  Terminal,
  HealthAndSafety,
  Sync,
  TrendingUp,
  Public,
  MonitorHeart,
  Sensors,
  Campaign,
  Hub,
  Code,
  Security,
  Search,
  FilterAlt,
  Download,
  MoreVert,
  ChevronRight,
  ArrowUpward,
} from '@mui/icons-material';
import {
  Newspaper as NewsIcon,
  Activity,
  Activity as PulseIcon,
  Cpu,
  Globe,
  ShieldCheck,
  Search as SearchIcon,
  Zap,
  Bell,
  Clock,
  BarChart3,
  Code2,
  Layers,
  Database,
  Wifi,
  MessageSquare,
  Share2,
  ExternalLink,
  Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📰 Daily News & Architecture Monitor (Service 0.1)
 * --------------------------------------------------
 * "The Intelligence Pulse of JunAiKey" for DingJun Hong.
 * Features: ESG/AI News Stream, Architecture Health Monitor, Protocol Stability Node.
 */
export const DailyNewsMonitor = () => {
  const [activeCategory, setActiveCategory] = useState('ALL');

  const newsItems = [
    {
      type: 'ESG TREND',
      title: '歐盟 CSRD 新規正式啟動：企業供應鏈數據透明度邁向「5T」標準',
      date: '10:42 AM',
      desc: '隨著法規收緊，企業需建立更強大的實體化 (Tangible) 與可溯源 (Traceable) 數據鏈...',
      impact: 'HIGH',
      tags: ['CSRD', 'Regulation'],
    },
    {
      type: 'AI INNOVATION',
      title: 'JunAi-Core 3.5 部署：實現大型語言模型對 ESG 雜湊鎖定數據的零時差解析',
      date: '09:15 AM',
      desc: '新型態協調器 (Coordinator) 能有效降低 5T 協議中的核驗延遲至 12ms 以下...',
      impact: 'CRITICAL',
      tags: ['JunAi-Core', 'LLM'],
    },
    {
      type: 'CAPITAL FLOW',
      title: '全球綠色主權基金宣佈擴大對「低碳數位孿生」項目的投資規模',
      date: 'Yesterday',
      desc: '投資者正尋求具備 SSOT (單一事實來源) 的 ESG ROI 報告，以降低洗綠風險...',
      impact: 'STABLE',
      tags: ['Investment', 'AUM'],
    },
  ];

  return (
    <div className="bg-[#051414] text-white min-h-screen font-display selection:bg-[#0ABAB5]/20 overflow-x-hidden">
      {/* Background Intelligence Filaments */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute inset-0 bg-[#051414]" />
        <div className="absolute top-0 right-0 size-[800px] bg-[#0ABAB5]/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 left-0 size-[600px] bg-emerald-500/5 rounded-full blur-[140px]" />
        {/* Synthetic Grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'linear-gradient(#0ABAB5 1px, transparent 1px), linear-gradient(90deg, #0ABAB5 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-6 backdrop-blur-3xl bg-[#051414]/70 border-b border-white/5">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 text-[#0ABAB5]">
            <div className="size-10 bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 rounded-2xl flex items-center justify-center shadow-lg">
              <Newspaper fontSize="medium" />
            </div>
            <h1 className="text-white text-xl font-black tracking-tighter uppercase leading-none italic">
              JunAiKey Pulse
            </h1>
          </div>
          <nav className="hidden lg:flex items-center gap-10">
            {['情報流 Intelligence', '架構監控 Monitor', '安全審核 Audit'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 ${i === 0 ? 'text-[#0ABAB5] border-b-2 border-[#0ABAB5] pb-1' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="relative group hidden md:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 size-4 group-focus-within:text-[#0ABAB5] transition-colors" />
            <input
              className="w-80 bg-white/[0.03] border border-white/10 rounded-2xl py-3 pl-12 pr-6 text-xs font-black outline-none focus:ring-1 focus:ring-[#0ABAB5] placeholder:text-white/20 shadow-inner"
              placeholder="搜尋情報或架構節點 Search Intelligence..."
            />
          </div>
          <button className="relative size-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/40 hover:text-[#0ABAB5] transition-all">
            <Bell size={20} />
            <span className="absolute top-2 right-2 size-2 bg-[#0ABAB5] rounded-full animate-ping" />
          </button>
          <div className="size-11 rounded-full border-2 border-[#0ABAB5]/30 p-1 overflow-hidden ring-4 ring-[#0ABAB5]/5">
            <div
              className="size-full rounded-full bg-cover bg-center shadow-inner"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
              }}
            />
          </div>
        </div>
      </header>

      <main className="max-w-[1700px] mx-auto px-10 py-12 flex flex-col gap-16">
        {/* Page Hero & Status Pulse */}
        <div className="flex flex-wrap justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 shadow-lg">
              <MonitorHeart className="text-[#0ABAB5] size-4" />
              <span className="text-[10px] font-black tracking-[0.4em] text-[#0ABAB5] uppercase">
                Service 0.1 Awareness Space
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white italic">
              每日情報與架構監測
            </h1>
            <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-4xl">
              DingJun Hong{' '}
              <span className="text-white font-medium not-italic underline decoration-[#0ABAB5]/30">
                全局感知空間
              </span>{' '}
              - 實時追蹤 ESG 趨勢與架構穩定性 Pulse of Operations
            </p>
          </motion.div>

          <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-10 rounded-[3rem] flex items-center gap-10 shadow-2xl group">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-black text-white/20 uppercase tracking-[.4em]">
                系統總體健康度
              </span>
              <h4 className="text-3xl font-black italic text-[#0ABAB5] tracking-tighter leading-none">
                STABLE 100%
              </h4>
            </div>
            <div className="relative size-16 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-[#0ABAB5] rounded-full"
              />
              <PulseIcon size={32} className="text-[#0ABAB5] relative z-10" />
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Section: Intelligence Stream */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="flex items-center justify-between px-6">
              <div className="flex items-center gap-6">
                <NewsIcon className="text-[#0ABAB5] size-8" />
                <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic">
                  實時情報流{' '}
                  <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest ml-4">
                    Intelligence Stream
                  </span>
                </h2>
              </div>
              <div className="flex gap-4">
                {['ALL', 'ESG', 'AI', 'CAPITAL'].map((cat, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-xl text-[9px] font-black transition-all border ${activeCategory === cat ? 'bg-[#0ABAB5] text-[#050d0d] border-[#0ABAB5] shadow-xl scale-105' : 'bg-white/5 text-white/30 border-white/5 hover:text-white'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-8">
              {newsItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 10, borderColor: '#0ABAB5/40' }}
                  className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl transition-all cursor-pointer"
                >
                  <div className="absolute -right-10 -top-10 size-40 bg-[#0ABAB5]/5 rounded-full blur-[60px] group-hover:bg-[#0ABAB5]/10 transition-all" />

                  <div className="flex justify-between items-start mb-8 relative z-10">
                    <div className="flex items-center gap-4">
                      <span className="bg-[#0ABAB5]/10 border border-[#0ABAB5]/20 text-[#0ABAB5] px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">
                        {item.type}
                      </span>
                      <span className="text-white/20 text-[10px] font-black uppercase tracking-widest italic">
                        {item.date}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 px-3 py-1 rounded-md text-[8px] font-black uppercase tracking-widest ${item.impact === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : 'bg-[#0ABAB5]/10 text-[#0ABAB5]'}`}
                    >
                      <Zap size={10} /> IMPACT: {item.impact}
                    </div>
                  </div>

                  <div className="space-y-4 relative z-10">
                    <h3 className="text-3xl font-black italic text-white tracking-tighter leading-tight group-hover:text-[#0ABAB5] transition-colors">
                      {item.title}
                    </h3>
                    <p className="text-[#9cbab9] text-lg font-light italic leading-relaxed tracking-tight line-clamp-2">
                      {item.desc}
                    </p>
                  </div>

                  <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between relative z-10">
                    <div className="flex gap-3">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-black text-white/20 uppercase tracking-widest border border-white/5 px-3 py-1 rounded-lg"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-5">
                      <Share2
                        size={16}
                        className="text-white/10 hover:text-white transition-colors"
                      />
                      <ExternalLink
                        size={16}
                        className="text-[#0ABAB5] hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              <button className="w-full py-10 rounded-[3rem] bg-white/[0.01] border border-dashed border-white/10 text-white/20 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/5 hover:text-white transition-all">
                加載更多歷史情報 Load Legacy Intelligence
              </button>
            </div>
          </div>

          {/* Right Section: Architecture Health Monitor */}
          <div className="lg:col-span-4 flex flex-col gap-12">
            <div className="flex items-center gap-6 px-4">
              <Terminal className="text-[#0ABAB5] size-8" />
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase italic leading-none">
                架構健康指標{' '}
                <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest block mt-2 ml-1">
                  Architecture Health
                </span>
              </h2>
            </div>

            <div className="space-y-10">
              {/* 4+1 State Machine Widget */}
              <motion.div
                whileHover={{ y: -5 }}
                className="backdrop-blur-3xl bg-gradient-to-br from-[#0ABAB5]/15 to-transparent border border-[#0ABAB5]/30 rounded-[3.5rem] p-12 space-y-10 shadow-3xl relative overflow-hidden group"
              >
                <div className="absolute -right-6 -top-6 size-32 bg-[#0ABAB5]/10 blur-3xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <h4 className="text-xl font-black italic tracking-tighter text-white">
                    4+1 狀態機同步 Sync Status
                  </h4>
                  <Sync className="text-[#0ABAB5] animate-spin-slow" />
                </div>
                <div className="space-y-6">
                  {[
                    {
                      label: 'GRID Node (Service 4.x)',
                      status: 'ACTIVE',
                      color: 'text-emerald-400',
                    },
                    { label: 'TREE Node (Service 1.x)', status: 'LOCKED', color: 'text-[#0ABAB5]' },
                    {
                      label: 'API Node (System Interface)',
                      status: 'LIVE',
                      color: 'text-emerald-400',
                    },
                    {
                      label: 'SEC Node (Security Layer)',
                      status: 'FROZEN',
                      color: 'text-blue-400',
                    },
                  ].map((node, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5 group/node hover:bg-[#0ABAB5]/10 transition-all"
                    >
                      <span className="text-[10px] font-black uppercase tracking-widest text-white/40 group-hover/node:text-white">
                        {node.label}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-md bg-black/40 ${node.color}`}
                      >
                        {node.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#0ABAB5]">
                    Coordination Hub (+1)
                  </p>
                  <div className="flex gap-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div
                        key={i}
                        className="size-1.5 rounded-full bg-[#0ABAB5] animate-pulse"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Protocol Pulse Real-time Telemetry */}
              <div className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[3.5rem] p-12 space-y-10 shadow-2xl">
                <div className="flex justify-between items-center">
                  <h4 className="text-xl font-black italic tracking-tighter text-white uppercase italic">
                    協議穩定脈搏 Pulse
                  </h4>
                  <Sensors className="text-[#0ABAB5]/40 size-5" />
                </div>
                <div className="space-y-12">
                  {[
                    { label: '核驗處理速度 Latency', val: '12ms', progress: 95 },
                    { label: '數據完整性校驗 Logic Integrity', val: '100%', progress: 100 },
                    { label: '冷存儲同步比例 Archival Sync', val: '88.4%', progress: 88 },
                  ].map((tele, i) => (
                    <div key={i} className="space-y-4">
                      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                        <span className="text-white/30">{tele.label}</span>
                        <span className="text-[#0ABAB5] italic">{tele.val}</span>
                      </div>
                      <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden p-[1px]">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${tele.progress}%` }}
                          className="h-full bg-[#0ABAB5]/60 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <button className="w-full h-16 bg-white/5 hover:bg-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center justify-center gap-4 group">
                  <Activity
                    size={16}
                    className="text-[#0ABAB5] group-hover:scale-125 transition-transform"
                  />
                  完整遙測報告 Telemetry Report
                </button>
              </div>

              {/* Campaign / Announcement Widget */}
              <div className="backdrop-blur-3xl bg-emerald-500/10 border-2 border-emerald-500/20 rounded-[3.5rem] p-10 flex flex-col gap-6 relative overflow-hidden group hover:border-emerald-500/40 transition-all shadow-3xl">
                <div className="absolute -right-8 -top-8 size-32 bg-emerald-500/10 blur-3xl" />
                <div className="flex items-center gap-4 text-emerald-400">
                  <Campaign fontSize="medium" className="animate-bounce" />
                  <span className="text-[10px] font-black uppercase tracking-[0.3em]">
                    Ecological Alert
                  </span>
                </div>
                <p className="text-white text-base font-black italic tracking-tight italic text-justify leading-relaxed">
                  「ESGss 透明度走查」計畫將於明日 09:00 進行全域自檢。所有 5T
                  數據將自動進入『雜湊鎖定』狀態，持續時間預計 45 分鐘。
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-emerald-500/10">
                  <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest underline cursor-pointer">
                    了解更多詳述 Details
                  </span>
                  <Clock size={14} className="text-emerald-400 opacity-40" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Monitor Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-12 pb-24">
          {[
            { label: '活躍節點 Active Nodes', val: '2,840', icon: Hub, color: 'text-[#0ABAB5]' },
            {
              label: '安全審計覆蓋 Audit Area',
              val: '100%',
              icon: ShieldCheck,
              color: 'text-emerald-400',
            },
            {
              label: '全球影響力擴散 Reach',
              val: '89.4M',
              icon: Globe,
              color: 'text-[#0ABAB5]/60',
            },
            { label: '區塊鏈交易雜湊 Hashes', val: '128k', icon: Code, color: 'text-[#0ABAB5]/30' },
          ].map((mon, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1 + i * 0.1 }}
              className={`backdrop-blur-3xl p-10 rounded-[3rem] border-t-8 ${mon.color.replace('text-', 'border-t-')} bg-white/[0.03] border-x border-b border-white/5 space-y-4 hover:translate-y-[-10px] transition-all cursor-pointer shadow-3xl`}
            >
              <div className="flex justify-between items-center text-white/20">
                <p className="text-[10px] font-black uppercase tracking-[0.4em]">{mon.label}</p>
                <mon.icon fontSize="small" className={mon.color} />
              </div>
              <p className="text-5xl font-black text-white italic tracking-tighter leading-none">
                {mon.val}
              </p>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="mt-40 border-t border-white/5 p-20 text-center space-y-12 backdrop-blur-3xl bg-black/40 relative z-10">
        <div className="flex justify-center gap-20 opacity-20 group hover:opacity-100 transition-opacity">
          {['REUTER_INTEL', 'JUN_CORE_OS', '5T_ENFORCED', 'SSOT_STABLE'].map((badge, i) => (
            <span
              key={i}
              className="text-white text-xs font-black italic tracking-widest uppercase hover:text-[#0ABAB5] transition-colors cursor-default"
            >
              {badge}
            </span>
          ))}
        </div>
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 italic">
          © 2024 ESGss JunAiKey • DingJun Hong • Global Intelligence & Architecture Monitor v0.1
          ALPHA
        </p>
        <div className="flex justify-center gap-12 text-[#0ABAB5]/20 text-[9px] font-black uppercase tracking-widest font-mono">
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            系統日誌 Logs
          </a>
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            感知策略 Strategy
          </a>
          <a href="#" className="hover:text-[#0ABAB5] transition-colors">
            隱私邊界 Safety
          </a>
        </div>
      </footer>

      <style>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0ABAB520;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
