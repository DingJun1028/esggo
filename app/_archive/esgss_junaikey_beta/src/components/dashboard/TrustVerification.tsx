import React from 'react';
import {
  ShieldCheck,
  BarChart3,
  Lock,
  Settings,
  RotateCw,
  CheckCircle2,
  Search,
  FileCheck,
  ShieldAlert,
  Lightbulb,
  Binary,
  FileText,
  Fingerprint,
  Fingerprint as FingerprintIcon,
  ShieldCheck as ShieldIcon,
  Search as SearchIcon,
  Trophy,
  History,
  Activity,
  Zap,
  Cpu,
  RefreshCcw,
  Unplug,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { LogicGateController } from './LogicGateController';

/**
 * 🛡️ Trust Verification Module (5T Verification)
 * --------------------------------------------------
 * "Tiffany Blue Liquid Glass" aesthetic with central Hash Locking.
 * Implements "5 Can" (TruthGoodBeauty 5T) logic.
 */
export const TrustVerification = () => {
  return (
    <div className="bg-[#0a1111] text-white min-h-screen font-display selection:bg-[#09abb3]/20 overflow-x-hidden">
      <div className="layout-container flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full">
        {/* Left Sidebar Navigation */}
        <aside className="w-full lg:w-72 flex flex-col justify-between p-8 border-r border-[#09abb3]/10 bg-[#0a1111]/50 backdrop-blur-md">
          <div className="flex flex-col gap-8">
            <div className="flex flex-col">
              <h1 className="text-2xl font-black text-[#09abb3] tracking-tight">JunAiKey</h1>
              <p className="text-[#9cb8ba] text-[10px] font-black uppercase tracking-[0.3em] opacity-60">
                Trustworthy Pillar
              </p>
            </div>

            <nav className="flex flex-col gap-3">
              <div className="flex items-center gap-4 px-5 py-4 rounded-2xl bg-[#09abb3]/10 text-[#09abb3] border border-[#09abb3]/20 shadow-lg shadow-[#09abb3]/5 cursor-default">
                <ShieldIcon className="w-5 h-5" />
                <p className="text-sm font-black tracking-tight">5T 驗證 (5T Auth)</p>
              </div>
              {[
                { label: '數據追蹤 Tracking', icon: Activity },
                { label: '加密管理 Encryption', icon: Lock },
                { label: '系統設置 Systems', icon: Settings },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl hover:bg-[#09abb3]/5 transition-all cursor-pointer text-[#9cb8ba] hover:text-[#09abb3] group"
                >
                  <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <p className="text-sm font-bold tracking-tight">{item.label}</p>
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-12 p-5 rounded-[1.5rem] backdrop-blur-xl bg-[#09abb3]/5 border border-[#09abb3]/10 relative group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#09abb3]/10 to-transparent opacity-50" />
            <p className="text-[10px] text-[#09abb3] font-black mb-2 uppercase tracking-widest relative z-10">
              節點狀態 Node Status
            </p>
            <div className="flex items-center gap-3 relative z-10">
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-xs font-bold opacity-80 uppercase tracking-tighter">
                Sovereign Running ...
              </span>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <section className="flex-1 flex flex-col overflow-y-auto">
          {/* Page Heading */}
          <div className="flex flex-wrap justify-between items-end gap-6 p-10">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl md:text-5xl font-black leading-tight tracking-tighter">
                5T 驗證動態反饋
              </h2>
              <p className="text-[#9cb8ba] text-lg font-light">
                Tiffany Blue 液態玻璃生態系統 -{' '}
                <span className="text-[#09abb3] font-bold">實時信任驗證流程</span>
              </p>
            </div>
            <button className="flex items-center gap-2 group cursor-pointer justify-center rounded-2xl h-14 px-8 bg-[#09abb3]/10 border border-[#09abb3]/20 text-[#09abb3] hover:bg-[#09abb3]/20 transition-all font-black text-xs uppercase tracking-widest">
              <RefreshCcw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
              <span>重播動畫 Re-Verify</span>
            </button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 pb-6">
            {[
              { label: '液態折射率 (RI)', value: '1.45 RI', trend: '+0.02%', positive: true },
              { label: '哈希強度 (SHA-256)', value: 'Optimized', trend: '+12.4%', positive: true },
              {
                label: '驗證進度 (5T)',
                value: '99.9%',
                trend: 'LOCKED',
                positive: true,
                highlight: true,
              },
            ].map((stat, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-[2rem] p-8 border border-[#09abb3]/20 bg-[#0a1111]/40 backdrop-blur-xl relative group hover:border-[#09abb3]/40 transition-all inset-shadow-sm"
              >
                <p className="text-[#9cb8ba] text-[10px] font-black uppercase tracking-[0.2em]">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-3">
                  <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                  <p
                    className={`text-xs font-black uppercase tracking-widest ${stat.highlight ? 'text-[#09abb3] bg-[#09abb3]/10 px-3 py-1 rounded-full' : 'text-emerald-500'}`}
                  >
                    {stat.trend}
                  </p>
                </div>
                <div className="absolute right-6 top-6 opacity-5 group-hover:opacity-20 transition-opacity">
                  <Fingerprint className="w-12 h-12 text-[#09abb3]" />
                </div>
              </div>
            ))}
          </div>

          {/* Main Visualization */}
          <div className="px-10 py-6 flex-1 min-h-[600px] relative">
            <div className="relative h-full w-full rounded-[3rem] overflow-hidden bg-slate-900/40 border border-[#09abb3]/30 flex items-center justify-center shadow-2xl">
              {/* Abstract Background Texture */}
              <div className="absolute inset-0 opacity-20 mix-blend-screen pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#09abb3]/20 via-[#0a1111]/80 to-[#09abb3]/10" />
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#09abb3" strokeWidth="0.05" />
                  <circle cx="50" cy="50" r="30" fill="none" stroke="#09abb3" strokeWidth="0.05" />
                  <path d="M0,50 L100,50 M50,0 L50,100" stroke="#09abb3" strokeWidth="0.05" />
                </svg>
              </div>

              {/* The Central "Data Block" */}
              <div className="relative z-10 flex flex-col items-center">
                <motion.div
                  animate={{ rotate: 0 }}
                  initial={{ rotate: 12 }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  className="size-72 md:size-96 backdrop-blur-3xl bg-gradient-to-br from-[#09abb3]/20 to-[#09abb3]/5 rounded-[3rem] flex items-center justify-center border border-[#09abb3]/40 shadow-[0_0_50px_rgba(9,171,179,0.3)] relative group cursor-pointer"
                >
                  <div className="absolute inset-0 border-[8px] border-[#09abb3]/30 rounded-[3rem] animate-pulse pointer-events-none" />
                  <div className="flex flex-col items-center gap-6 text-[#09abb3]">
                    <ShieldCheck className="w-24 h-24 md:w-32 md:h-32 drop-shadow-[0_0_15px_rgba(9,171,179,0.6)]" />
                    <div className="text-center space-y-2">
                      <p className="text-[10px] font-mono font-black opacity-60 tracking-[0.2em] uppercase">
                        HASH: 0x8A2B...F9E2
                      </p>
                      <p className="text-2xl md:text-3xl font-black tracking-tighter text-white">
                        HASH-LOCKED
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Status Indicator */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="mt-10 px-8 py-3 rounded-full bg-[#09abb3]/20 border border-[#09abb3]/40 backdrop-blur-2xl flex items-center gap-4 shadow-xl"
                >
                  <RefreshCcw className="text-[#09abb3] w-4 h-4 animate-spin-slow" />
                  <span className="text-xs font-black text-[#09abb3] tracking-[0.2em] uppercase">
                    實時信任驗證：已達成最高安全級別
                  </span>
                </motion.div>
              </div>

              {/* Logic Gate Controller Integration */}
              <div className="absolute top-12 left-12 w-[380px] hidden xl:block z-50">
                <LogicGateController />
              </div>

              {/* Educational Overlays: "5T Core" (Global View) */}
              <div className="absolute top-12 right-12 flex flex-col gap-4 max-w-xs xl:max-w-sm">
                {[
                  {
                    label: '可感知 (Tangible)',
                    desc: '願景轉化為具體指標: Impact_Metric',
                    icon: ShieldIcon,
                  },
                  {
                    label: '可溯源 (Traceable)',
                    desc: '鏈式日誌包含原始來源備註',
                    icon: SearchIcon,
                  },
                  {
                    label: '可追蹤 (Trackable)',
                    desc: '即時記錄 All-in-One 流轉路徑',
                    icon: History,
                  },
                  {
                    label: '可透明驗算 (Transparent)',
                    desc: '公式公開且通過零幻覺驗證',
                    icon: FileCheck,
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1 }}
                    className="p-5 rounded-[1.5rem] bg-black/40 backdrop-blur-2xl border border-white/5 border-l-4 border-l-[#09abb3]/60 flex items-start gap-4 hover:bg-black/60 transition-all cursor-default group"
                  >
                    <item.icon className="text-[#09abb3] w-5 h-5 shrink-0 mt-1" />
                    <div className="space-y-1">
                      <p className="text-xs font-black text-white tracking-tight">{item.label}</p>
                      <p className="text-[9px] text-slate-400 font-medium leading-relaxed uppercase tracking-tighter opacity-80">
                        {item.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }}
                  className="p-6 rounded-[2rem] bg-[#09abb3]/20 backdrop-blur-3xl border border-[#09abb3]/50 flex items-start gap-4 shadow-[0_0_30px_rgba(9,171,179,0.2)] group"
                >
                  <ShieldAlert className="text-white w-7 h-7 shrink-0 mt-1 animate-pulse" />
                  <div className="space-y-1">
                    <p className="text-base font-black text-white tracking-tighter leading-none">
                      不可篡改 (Trustworthy)
                    </p>
                    <p className="text-[10px] text-[#09abb3] font-bold opacity-90 leading-relaxed uppercase">
                      雜湊鎖定與 Object.freeze() 已完成
                    </p>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Footer Education UI */}
          <div className="px-10 pb-10 pt-4">
            <div className="w-full p-8 rounded-[2.5rem] bg-[#09abb3]/5 border border-[#09abb3]/20 backdrop-blur-md flex flex-col xl:flex-row items-center justify-between gap-8 shadow-inner">
              <div className="flex items-center gap-6">
                <div className="size-16 rounded-full bg-[#09abb3] flex items-center justify-center text-white shrink-0 shadow-lg shadow-[#09abb3]/20">
                  <Lightbulb className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h4 className="text-xl font-black text-white tracking-tight leading-none">
                    教育提示：什麼是 5T 驗證？ (Trustworthy Protocol)
                  </h4>
                  <p className="text-sm text-[#9cb8ba] max-w-2xl font-light">
                    5T 是鼎駿紅 (DingJun Hong)
                    液態玻璃生態的核心信任支柱，確保每一滴數據在液體折射與加密過程中都具備唯一性與不可竄改性。
                    <br />
                    <span className="text-[#09abb3]/60 italic text-xs font-mono font-bold mt-2 block">
                      Protocol: Tangible • Traceable • Trackable • Transparent • Trustworthy
                    </span>
                  </p>
                </div>
              </div>
              <div className="flex gap-4 shrink-0">
                <button className="px-8 py-3.5 rounded-2xl border border-[#09abb3]/30 text-[#09abb3] font-black text-xs uppercase tracking-widest hover:bg-[#09abb3]/5 transition-all">
                  深入了解
                </button>
                <button className="px-8 py-3.5 rounded-2xl bg-[#09abb3] text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-[#09abb3]/20 hover:brightness-110 active:scale-95 transition-all">
                  查看白皮書
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
