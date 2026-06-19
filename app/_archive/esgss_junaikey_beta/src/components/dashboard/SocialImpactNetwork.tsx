import React from 'react';
import {
  Hub,
  Search,
  AddCircle,
  Analytics,
  Diversity3,
  RocketLaunch,
  Handshake,
  VerifiedUser,
  Share, // Fixed: ShareReviews not exported from @mui/icons-material
  MyLocation,
  Add,
  Remove,
} from '@mui/icons-material';
import {
  Network as NetworkIcon,
  Users,
  Zap,
  Activity,
  Globe,
  ShieldCheck,
  ArrowUpRight,
  Plus,
  Search as SearchIcon,
  Handshake as HandshakeIcon,
  Share2,
  Target,
  MousePointer2,
  Lock,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🌐 Social Impact Network (Service 5.5)
 * --------------------------------------------------
 * "Collective Impact & Ecosystem Collaboration" for DingJun Hong.
 * Features: Interactive Network Graph, Active Projects, Impact Metrics.
 */
export const SocialImpactNetwork = () => {
  const activeProjects = [
    {
      title: '綠色供應鏈透明度計畫',
      status: '進行中',
      partner: '全球永續聯盟',
      progress: 65,
      color: 'bg-emerald-500',
    },
    {
      title: '零碳排建築材料研發',
      status: '規劃中',
      partner: '北歐建築實驗室',
      progress: 25,
      color: 'bg-blue-500',
    },
    {
      title: '海洋微塑料清理技術',
      status: '關鍵節點',
      partner: 'OceanClean NGO',
      progress: 88,
      color: 'bg-[#0ab8b2]',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 overflow-x-hidden">
      {/* Abstract Grid Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_center,#1a3a3a_0%,#102222_100%)]">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'radial-gradient(#0ab8b2 1.5px, transparent 1.5px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      {/* Top Header Navigation */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-10 py-5 backdrop-blur-3xl bg-[#102222]/80 border-b border-[#283939] shadow-2xl">
        <div className="flex items-center gap-12">
          <div className="flex items-center gap-4 text-[#0ab8b2]">
            <div className="size-10 bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 rounded-2xl flex items-center justify-center shadow-lg">
              <NetworkIcon className="size-6" />
            </div>
            <h2 className="text-white text-xl font-black tracking-tighter uppercase leading-none italic">
              JunAiKey Portal
            </h2>
          </div>
          <nav className="hidden md:flex items-center gap-10">
            {['影響力圖譜', '協作計畫', '教育中心'].map((link, i) => (
              <a
                key={i}
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:scale-105 ${i === 0 ? 'text-[#0ab8b2] border-b-2 border-[#0ab8b2] pb-1' : 'text-white/40 hover:text-white'}`}
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-8">
          <div className="group relative hidden lg:block">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9cbab9] size-4 group-focus-within:text-[#0ab8b2] transition-colors" />
            <input
              className="w-80 bg-white/[0.03] border border-[#283939] rounded-2xl py-3 pl-12 pr-6 text-xs font-black outline-none focus:ring-1 focus:ring-[#0ab8b2] placeholder:text-[#9cbab9] transition-all shadow-inner"
              placeholder="搜尋領袖或節點 Search nodes..."
            />
          </div>
          <button className="bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#102222] px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95">
            個人設定 Profile
          </button>
          <div className="size-11 rounded-full border-2 border-[#0ab8b2]/30 p-1 overflow-hidden ring-4 ring-[#0ab8b2]/5">
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
        {/* Page Heading & Action */}
        <div className="flex flex-wrap justify-between items-end gap-10">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#0ab8b2]/10 border border-[#0ab8b2]/20 shadow-lg">
              <Hub className="text-[#0ab8b2] size-4" />
              <span className="text-[10px] font-black tracking-[0.4em] text-[#0ab8b2] uppercase">
                Service 5.5 Ecosystem
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-white italic">
              社群影響力網絡 Impact
            </h1>
            <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight max-w-3xl">
              鼎鈞泓與全球{' '}
              <span className="text-white font-medium not-italic underline decoration-[#0ab8b2]/30">
                ESG 領袖
              </span>{' '}
              的連動生態系統 Synergy Platform
            </p>
          </motion.div>

          <button className="flex items-center gap-4 px-10 py-5 bg-[#283939] hover:bg-[#344a4a] border border-[#0ab8b2]/30 rounded-[2rem] text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-2xl active:scale-95 group">
            <AddCircle className="group-hover:rotate-90 transition-transform" /> 啟動新協作 New
            Synergy
          </button>
        </div>

        {/* Collective Impact Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            {
              label: '集體影響力指數 Impact Index',
              val: '89.4M',
              trend: '+12.5%',
              color: '#0ab8b2',
              icon: Analytics,
            },
            { label: '活躍協作專案 Active Projects', val: '12', trend: '+2 NEW', icon: Diversity3 },
            {
              label: '社群擴散力 Reach Rate',
              val: '+240%',
              trend: '+15% YEAR',
              icon: RocketLaunch,
            },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-[#3b5453] p-12 rounded-[3rem] relative overflow-hidden group hover:border-[#0ab8b2]/40 transition-all shadow-3xl"
            >
              <div className="absolute top-0 right-0 p-10 opacity-10 group-hover:opacity-100 group-hover:bg-[#0ab8b2]/5 transition-all rounded-bl-[4rem]">
                <stat.icon style={{ fontSize: '48px' }} className="text-[#0ab8b2]" />
              </div>
              <div className="space-y-6 relative z-10">
                <p className="text-white/30 text-[10px] font-black uppercase tracking-[0.4em]">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-4">
                  <p className="text-6xl font-black text-white tracking-tighter italic">
                    {stat.val}
                  </p>
                  <p className="text-emerald-400 text-[11px] font-black tracking-widest uppercase italic">
                    {stat.trend}
                  </p>
                </div>
                <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px] mt-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '85%' }}
                    transition={{ duration: 2 }}
                    className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_15px_#0ab8b2]"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Interactive Network Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Visualizer Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-8 backdrop-blur-3xl bg-[#0d1414] border-2 border-[#283939] rounded-[4rem] overflow-hidden relative h-[750px] shadow-[0_40px_100px_rgba(0,0,0,0.5)] group"
          >
            {/* Live Tag */}
            <div className="absolute top-10 left-10 z-30">
              <div className="px-6 py-2 bg-[#0ab8b2]/20 border border-[#0ab8b2]/40 rounded-full flex items-center gap-3 shadow-xl">
                <span className="size-2 rounded-full bg-[#0ab8b2] animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0ab8b2]">
                  Live Visualizer Network
                </span>
              </div>
            </div>

            {/* Network Graph Rendering (Simulated with Background & SVG) */}
            <div
              className="absolute inset-0 bg-cover bg-center brightness-[0.3] contrast-[1.2] grayscale group-hover:brightness-[0.4] transition-all duration-1000"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDrIFqN39I9ScTQfKTMq84xL0hoowRLBYGV_Y97eNLgrwKCHs6KhymwY1uCmru95aEQVgTi6EzEWyDM3f6sTry9cFO0nJpXEmpTLf4oad8gsiHm5lYF_N1cf4DpJlExr-utFQLA-lk9Mfzeh6c3bYwoMGADZucUz3HXiUxhopeWEa_9iW_pexubU8GUkFGTJ5yGxr2OzUXuP_NE8D7o_2-AaAhjug9pcoNrkzAFDB0Af0Mno40QPym14bITUzLDMWjyzGF-DaWFd5M')",
              }}
            />

            {/* Central Hub Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-6 z-20">
              <motion.div
                animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="size-32 rounded-full border-4 border-[#0ab8b2] bg-gradient-to-br from-[#0ab8b2]/40 to-transparent flex items-center justify-center backdrop-blur-3xl shadow-[0_0_80px_rgba(10,184,178,0.5)] group/hub transition-all cursor-pointer ring-8 ring-[#0ab8b2]/10"
              >
                <div className="text-center">
                  <p className="text-white font-black text-xs italic tracking-tighter uppercase leading-none">
                    鼎鈞泓 Hub
                  </p>
                  <p className="text-[#0ab8b2] text-[8px] font-black uppercase tracking-widest mt-1">
                    Central Core
                  </p>
                </div>
              </motion.div>
              <span className="bg-[#0ab8b2] text-[#102222] px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-2xl">
                HUB CENTRAL TERMINAL
              </span>
            </div>

            {/* Map Controls */}
            <div className="absolute bottom-10 right-10 flex flex-col gap-4 z-30">
              <div className="flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-3xl backdrop-blur-3xl">
                <button className="size-14 bg-white/[0.05] hover:bg-[#0ab8b2]/20 border-b border-white/10 flex items-center justify-center transition-all active:scale-90">
                  <Add fontSize="small" />
                </button>
                <button className="size-14 bg-white/[0.05] hover:bg-[#0ab8b2]/20 flex items-center justify-center transition-all active:scale-90">
                  <Remove fontSize="small" />
                </button>
              </div>
              <button className="size-14 rounded-2xl bg-[#0ab8b2] text-[#102222] flex items-center justify-center shadow-3xl hover:scale-110 active:scale-90 transition-all">
                <MyLocation fontSize="small" />
              </button>
            </div>

            {/* Connection Filaments SVG */}
            <svg className="absolute inset-0 size-full pointer-events-none opacity-40">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="transparent" />
                  <stop offset="50%" stopColor="#0ab8b2" />
                  <stop offset="100%" stopColor="transparent" />
                </linearGradient>
              </defs>
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3, repeat: Infinity }}
                x1="20%"
                y1="20%"
                x2="50%"
                y2="50%"
                stroke="url(#lineGrad)"
                strokeWidth="1"
                strokeDasharray="10 5"
              />
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                x1="80%"
                y1="30%"
                x2="50%"
                y2="50%"
                stroke="url(#lineGrad)"
                strokeWidth="1.5"
              />
              <motion.line
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 0.5 }}
                x1="30%"
                y1="80%"
                x2="50%"
                y2="50%"
                stroke="url(#lineGrad)"
                strokeWidth="1"
              />
            </svg>
          </motion.div>

          {/* Collaboration Sidebar */}
          <div className="lg:col-span-4 flex flex-col gap-10">
            <div className="flex items-center gap-6 px-4">
              <Handshake className="text-[#0ab8b2] size-8" />
              <h2 className="text-3xl font-black italic tracking-tighter text-white uppercase">
                當前活躍協作計畫{' '}
                <span className="text-white/20 not-italic font-black text-xs uppercase tracking-widest block mt-1 italic">
                  Active Collaborations Hub
                </span>
              </h2>
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-4 h-[600px]">
              {activeProjects.map((project, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ x: 10, borderColor: '#0ab8b250' }}
                  className="backdrop-blur-3xl bg-white/[0.03] border border-[#283939] p-8 rounded-[2.5rem] transition-all cursor-pointer shadow-xl group hover:bg-[#0ab8b2]/5"
                >
                  <div className="flex justify-between items-start mb-6">
                    <h3 className="text-xl font-black italic text-white tracking-tight group-hover:text-[#0ab8b2] transition-colors">
                      {project.title}
                    </h3>
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg ${project.status === '進行中' ? 'bg-[#0ab8b2]/20 text-[#0ab8b2]' : 'bg-white/5 text-white/40 border border-white/10'}`}
                    >
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-5 mb-8">
                    <div className="flex -space-x-3">
                      <div
                        className={`size-8 rounded-full border-2 border-[#102222] ${project.color} flex items-center justify-center text-[9px] font-black`}
                      >
                        ESG
                      </div>
                      <div className="size-8 rounded-full border-2 border-[#102222] bg-white/10" />
                    </div>
                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest italic flex items-center gap-3">
                      <HandshakeIcon size={14} className="opacity-40" /> 協作方: {project.partner}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[.3em] italic text-white/20">
                      <span>Progress Pipeline</span>
                      <span className="text-[#0ab8b2]">{project.progress}% SYNCED</span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden p-[1px]">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${project.progress}%` }}
                        className="h-full bg-[#0ab8b2] rounded-full shadow-[0_0_10px_#0ab8b2]"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}

              {/* Empty / More Placeholder */}
              <div className="p-8 rounded-[2.5rem] bg-white/[0.01] border border-white/5 flex flex-col items-center justify-center gap-4 group hover:bg-white/5 transition-all cursor-pointer">
                <Plus className="text-white/10 group-hover:text-[#0ab8b2] group-hover:rotate-90 transition-all size-10" />
                <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                  探尋更多潛在連接 Discover More
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Magnification Section */}
        <section className="backdrop-blur-3xl bg-gradient-to-r from-[#1a2e2e] to-[#102222] border border-[#283939] rounded-[4rem] p-20 shadow-3xl overflow-hidden group">
          <div className="flex flex-col lg:flex-row gap-24 items-center relative z-10">
            <div className="lg:w-1/2 space-y-10">
              <div className="space-y-4">
                <h2 className="text-5xl font-black italic tracking-tighter text-white uppercase italic leading-none">
                  社群參與如何放大
                  <br />
                  個人影響力？ Magnitude
                </h2>
                <p className="text-[#9cbab9] text-2xl font-light italic leading-relaxed tracking-tight italic">
                  在{' '}
                  <span className="text-[#0ab8b2] font-black not-italic underline decoration-[#0ab8b2]/20">
                    JunAiKey
                  </span>{' '}
                  生態系統中，影響力並非線性增長。當您與其他 ESG
                  領袖建立連接時，資源、數據與知識的共享會產生「液態玻璃效應」——資訊在節點間無阻礙流動，使單一行動的社會價值成倍擴散。
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="flex flex-col gap-4 group/item">
                  <div className="flex items-center gap-4">
                    <VerifiedUser className="text-[#0ab8b2] size-6 group-hover/item:scale-110 transition-transform" />
                    <h4 className="text-lg font-black italic tracking-tight text-white uppercase italic">
                      數據互信機制 Trust
                    </h4>
                  </div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-tight italic">
                    利用區塊鏈節點確保 ESG 報告的不可篡改與透明度。 Integrity Protocol.
                  </p>
                </div>
                <div className="flex flex-col gap-4 group/item">
                  <div className="flex items-center gap-4">
                    <Share className="text-[#0ab8b2] size-6 group-hover/item:scale-110 transition-transform" />
                    <h4 className="text-lg font-black italic tracking-tight text-white uppercase italic">
                      資源共享池 Pool
                    </h4>
                  </div>
                  <p className="text-white/40 text-[11px] font-black uppercase tracking-tight italic">
                    集結中堅企業力量，降低碳捕捉與能源轉型的研發成本。 Collective CAPEX.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 grid grid-cols-2 gap-10 w-full max-w-2xl translate-z-0">
              {[
                { val: '3.5x', label: '協作加速率 Acceleration', active: true },
                { val: '10k+', label: '連動節點數 Global Nodes' },
                { val: '92%', label: '政策響應率 Compliance' },
                { val: '24h', label: '即時響應速度 Response', active: true },
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -10, rotate: i % 2 === 0 ? 2 : -2 }}
                  className={`aspect-square backdrop-blur-3xl rounded-[3rem] flex flex-col items-center justify-center p-12 text-center border shadow-3xl ${metric.active ? 'border-b-8 border-b-[#0ab8b2] bg-[#0ab8b2]/5 border-t-white/10' : 'border-t-8 border-t-[#0ab8b2]/40 bg-white/[0.02] border-b-white/5'}`}
                >
                  <span
                    className={`text-6xl font-black italic tracking-tighter mb-4 ${metric.active ? 'text-[#0ab8b2]' : 'text-white/40'}`}
                  >
                    {metric.val}
                  </span>
                  <p className="text-white text-[10px] font-black uppercase tracking-[0.3em] leading-tight italic">
                    {metric.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-40 border-t border-[#283939] p-20 text-center space-y-8 backdrop-blur-3xl bg-black/20">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/30 italic">
          © 2024 ESGss JunAiKey. All Rights Reserved. 鼎鈞泓：驅動永續影響力的未來引擎 Engine of
          Impact
        </p>
        <div className="flex justify-center gap-16">
          {['隱私權', '服務協議', '全球節點'].map((link, i) => (
            <a
              key={i}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-white/10 hover:text-[#0ab8b2] transition-colors"
              href="#"
            >
              {link}
            </a>
          ))}
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #0ab8b240;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
};
