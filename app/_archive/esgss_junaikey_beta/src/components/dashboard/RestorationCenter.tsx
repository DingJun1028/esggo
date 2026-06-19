import React from 'react';
import {
  ShieldCheck,
  Leaf,
  Activity,
  Search,
  Bell,
  UserCircle,
  UserCheck,
  Shield,
  Network,
  Eye,
  RotateCcw,
  Download,
  Plus,
  Minus,
  Navigation,
  Layers,
  TrendingUp,
  Cloud,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🧪 Restoration Center (Service 3.2)
 * --------------------------------------------------
 * "Impact Restoration Laboratory" with Liquid Glass simulation.
 * Includes 5T Verification sidebar and real-time environment metrics.
 */
export const RestorationCenter = () => {
  return (
    <div className="bg-[#102222] text-white h-screen flex flex-col font-display selection:bg-[#0df2eb]/20 overflow-hidden">
      {/* Top Navigation */}
      <header className="flex items-center justify-between border-b border-[#283939] px-8 py-4 bg-[#102222]/80 backdrop-blur-md relative z-50">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-4 text-[#0df2eb]">
            <div className="size-9 bg-[#0df2eb]/10 p-1.5 rounded-xl border border-[#0df2eb]/20 shadow-[0_0_15px_rgba(13,242,235,0.2)]">
              <svg fill="currentColor" viewBox="0 0 48 48">
                <path d="M47.2426 24L24 47.2426L0.757355 24L24 0.757355L47.2426 24ZM12.2426 21H35.7574L24 9.24264L12.2426 21Z" />
              </svg>
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-lg font-black leading-none tracking-tight">
                ESGss JunAiKey
              </h2>
              <span className="text-[9px] text-[#0df2eb] tracking-[0.3em] font-black uppercase mt-1">
                High-End Ecosystem
              </span>
            </div>
          </div>
          <nav className="hidden xl:flex items-center gap-8">
            <a
              className="text-[#0df2eb] text-sm font-black border-b-2 border-[#0df2eb] pb-1"
              href="#"
            >
              影響修復實驗室
            </a>
            <a
              className="text-white/50 hover:text-white text-sm font-bold transition-colors"
              href="#"
            >
              5T 認證中心
            </a>
            <a
              className="text-white/50 hover:text-white text-sm font-bold transition-colors"
              href="#"
            >
              數據矩陣
            </a>
          </nav>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-3 group focus-within:border-[#0df2eb]/50 transition-all">
            <Search className="text-[#9cbab9] w-4 h-4" />
            <input
              className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-[#9cbab9]/40 w-48 outline-none"
              placeholder="搜尋修復座標 Search..."
            />
          </div>
          <div className="flex gap-3">
            <button className="p-2.5 rounded-xl bg-white/5 hover:bg-[#0df2eb]/20 transition-all border border-white/5 text-white/60">
              <Bell className="w-5 h-5" />
            </button>
            <div className="size-10 rounded-full border border-[#0df2eb]/50 p-0.5 overflow-hidden">
              <div
                className="size-full rounded-full bg-cover bg-center"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s96-c')",
                }}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: 5T Verification */}
        <aside className="w-80 border-r border-[#283939] bg-[#102222] p-8 flex flex-col justify-between relative overflow-y-auto">
          <div className="space-y-10">
            <div className="space-y-1">
              <h1 className="text-[#0df2eb] text-2xl font-black tracking-tighter">
                5T Truth-Beauty
              </h1>
              <p className="text-[#9cbab9] text-xs font-bold uppercase tracking-widest opacity-60">
                Blockchain Verification
              </p>
            </div>

            <div className="space-y-4">
              {[
                { label: '真實 (Truth)', desc: '數據源已核實', icon: ShieldCheck, active: true },
                { label: '信任 (Trust)', desc: '多節點共識共管', icon: Shield },
                { label: '溯源 (Traceability)', desc: '完整生態鏈記錄', icon: Network },
                { label: '透明 (Transparency)', desc: '實時數據公開鏈', icon: Eye },
                { label: '變革 (Transformation)', desc: '永續生態模式轉型', icon: RotateCcw },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all border ${item.active ? 'bg-[#0df2eb] text-[#102222] border-[#0df2eb] shadow-[0_0_20px_rgba(13,242,235,0.4)]' : 'bg-white/5 text-white/70 border-white/5 hover:border-[#0df2eb]/40 group'}`}
                >
                  <item.icon
                    className={`w-5 h-5 ${item.active ? 'text-[#102222]' : 'group-hover:text-[#0df2eb]'}`}
                  />
                  <div className="flex flex-col">
                    <p
                      className={`text-sm font-black tracking-tight ${item.active ? 'text-[#102122]' : 'text-white'}`}
                    >
                      {item.label}
                    </p>
                    <span
                      className={`text-[10px] font-bold ${item.active ? 'text-[#102122]/70' : 'text-[#9cbab9]'}`}
                    >
                      {item.desc}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-2xl bg-[#0df2eb]/5 border border-[#0df2eb]/20 space-y-4">
              <p className="text-[#0df2eb] text-[10px] font-black uppercase tracking-[0.2em]">
                區塊鏈存證編號 Blockchain ID
              </p>
              <p className="text-white/60 font-mono text-[10px] break-all leading-relaxed bg-black/20 p-3 rounded-lg border border-white/5">
                0x8aF744c688887b1e...E92d41bC15c5
              </p>
              <div className="flex justify-between items-center text-[10px] font-bold text-[#9cbab9] tracking-wider">
                <span>同步時間</span>
                <span>2024-11-24 14:20</span>
              </div>
            </div>
          </div>

          <button className="mt-10 flex w-full bg-[#0df2eb] text-[#102222] h-14 rounded-2xl items-center justify-center font-black uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-xl">
            驗證憑證 Verify Certificate
          </button>
        </aside>

        {/* Main Simulation Viewport */}
        <main className="flex-1 relative bg-[#0c1818] p-6 flex flex-col">
          {/* Simulation Header Overlay */}
          <div className="absolute top-10 left-10 z-20 pointer-events-none">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-4">
                <div className="px-3 py-1 bg-[#0df2eb] text-[#102222] text-[10px] font-black rounded-lg shadow-sm animate-pulse tracking-widest">
                  LIVE
                </div>
                <h1 className="text-white text-5xl font-black tracking-tighter drop-shadow-2xl">
                  2.3 影響修復實驗室
                </h1>
              </div>
              <p className="text-[#9cbab9] text-lg font-light tracking-tight">
                實時液態玻璃環境模擬與修復進度可視化
              </p>
            </div>
          </div>

          {/* HUD Viewport */}
          <div className="flex-1 relative rounded-[2.5rem] overflow-hidden border border-[#283939] shadow-inner">
            <div
              className="absolute inset-0 bg-cover bg-center grayscale opacity-20 mix-blend-screen mix-blend-overlay scale-110"
              style={{ backgroundImage: "url('https://placeholder.pics/svg/800')" }}
            />

            {/* Simulation Markers Overlay */}
            <div className="absolute inset-0">
              {/* Marker A */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute top-[35%] left-[40%] flex flex-col items-center group cursor-pointer"
              >
                <div className="size-8 rounded-full bg-[#0df2eb] shadow-[0_0_30px_#0df2eb] animate-pulse flex items-center justify-center border-2 border-white">
                  <div className="size-2 rounded-full bg-[#102222]" />
                </div>
                <div className="mt-4 backdrop-blur-3xl bg-[#102222]/80 border border-[#0df2eb]/40 px-5 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                  <span className="text-[#0df2eb] text-[10px] font-black tracking-widest uppercase">
                    區域 A: 珊瑚礁修復
                  </span>
                  <p className="text-white text-lg font-black mt-1">進度: 92.4%</p>
                </div>
              </motion.div>

              {/* Marker B */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="absolute bottom-[35%] right-[35%] flex flex-col items-center group cursor-pointer"
              >
                <div className="size-6 rounded-full bg-[#0df2eb]/40 shadow-[0_0_15px_#0df2eb]/40 flex items-center justify-center border border-[#0df2eb]">
                  <div className="size-2 rounded-full bg-[#0df2eb]" />
                </div>
                <div className="mt-4 backdrop-blur-3xl bg-[#102222]/80 border border-[#0df2eb]/40 px-5 py-3 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0 text-right">
                  <span className="text-[#0df2eb] text-[10px] font-black tracking-widest uppercase">
                    區域 B: 濕地重建
                  </span>
                  <p className="text-white text-lg font-black mt-1">進度: 45.1%</p>
                </div>
              </motion.div>
            </div>

            {/* Viewport Control HUD */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4">
              <div className="flex flex-col bg-[#1b2727]/90 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl ring-1 ring-[#0df2eb]/10">
                <button className="p-4 text-white hover:bg-[#0df2eb] hover:text-[#102222] transition-all">
                  <Plus className="size-6" />
                </button>
                <div className="h-px bg-white/5 w-full" />
                <button className="p-4 text-white hover:bg-[#0df2eb] hover:text-[#102222] transition-all">
                  <Minus className="size-6" />
                </button>
              </div>
              <button className="p-4 bg-[#1b2727]/90 backdrop-blur-2xl rounded-2xl text-white hover:bg-[#0df2eb] hover:text-[#102222] transition-all border border-white/10 shadow-xl">
                <Navigation className="size-6" />
              </button>
              <button className="p-4 bg-[#1b2727]/90 backdrop-blur-2xl rounded-2xl text-white hover:bg-[#0df2eb] hover:text-[#102222] transition-all border border-white/10 shadow-xl">
                <Layers className="size-6" />
              </button>
            </div>

            {/* Metrics Footer Overlay */}
            <div className="absolute bottom-10 left-10 right-10 flex gap-6 items-stretch">
              {[
                {
                  label: '修復總進度 Progress',
                  value: '87.5%',
                  trend: '+2.3%',
                  color: '#0df2eb',
                  icon: TrendingUp,
                },
                {
                  label: '生態多樣性指數 Bio-Index',
                  value: '0.92',
                  trend: '+0.05',
                  color: '#10b981',
                  icon: Leaf,
                },
                {
                  label: '預估碳抵消 Offset (tCO2e)',
                  value: '12,450',
                  trend: '-1.2%',
                  color: '#ef4444',
                  icon: Cloud,
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="flex-1 backdrop-blur-3xl bg-[#102222]/80 border-l-4 border-white/5 rounded-2xl p-6 shadow-2xl relative group overflow-hidden"
                  style={{ borderLeftColor: metric.color }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent" />
                  <div className="flex justify-between items-start mb-4 relative z-10">
                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.2em]">
                      {metric.label}
                    </p>
                    <metric.icon
                      className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity"
                      style={{ color: metric.color }}
                    />
                  </div>
                  <div className="flex items-baseline gap-3 relative z-10 font-black">
                    <p className="text-white text-3xl tracking-tighter">{metric.value}</p>
                    <p className="text-xs tracking-tight" style={{ color: metric.color }}>
                      {metric.trend}
                    </p>
                  </div>
                  <div className="w-full bg-white/5 h-1 rounded-full mt-6 overflow-hidden relative z-10">
                    <div
                      className="h-full bg-white opacity-20"
                      style={{ width: '87.5%', backgroundColor: metric.color }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-center pl-4">
                <button className="bg-[#0df2eb]/10 hover:bg-[#0df2eb]/20 transition-all text-[#0df2eb] px-10 py-6 rounded-[2rem] flex items-center gap-4 border border-[#0df2eb]/30 shadow-2xl group active:scale-95">
                  <Download className="size-7 group-hover:translate-y-1 transition-transform" />
                  <span className="font-black text-sm tracking-[0.2em] uppercase">
                    匯出報告 Export
                  </span>
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
