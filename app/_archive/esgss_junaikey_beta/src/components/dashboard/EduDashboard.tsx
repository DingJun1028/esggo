import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  Key,
  School,
  Hub,
  Description,
  Monitoring,
  VerifiedUser,
  MenuBook,
  PlayCircle,
  ShieldWithHeart,
  Layers,
  Link as LinkIcon,
  Verified,
  Route,
  Visibility,
  AccountTree,
  Lightbulb,
  SupportAgent,
  TrendingUp,
  Activity,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🎓 My ESG Dashboard (1.1) - Education-Oriented Service Portal
 * --------------------------------------------------
 * Entry point for new users to learn the 5T Logic and ESG workflow.
 * Features a guiding tone and visual 5T architecture.
 */
export const EduDashboard = () => {
  const { profile } = useAuth();
  const isZh = true; // Defaulting to Zh for this specific layout

  return (
    <div className="bg-[#050d0d] text-white min-h-screen font-display overflow-x-hidden relative selection:bg-[#0ABAB5]/30">
      {/* Background Glows */}
      <div className="fixed top-[-5%] left-[-5%] w-[50%] h-[50%] bg-[#0ABAB5]/5 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#0ABAB5]/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_-20%,_#0a2e2d_0%,_#050d0d_100%)] -z-20" />

      <main className="flex-1 overflow-y-auto scroll-smooth">
        {/* Header */}
        <header className="sticky top-0 z-30 backdrop-blur-md bg-[#050d0d]/60 border-b border-white/5 px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <h2 className="text-lg font-bold flex items-center gap-2 uppercase tracking-tight">
              <MenuBook className="text-[#0ABAB5] w-5 h-5" />
              1.1 個人ESG儀表板 (教學型服務導向)
            </h2>
            <div className="h-4 w-px bg-white/10 hidden md:block" />
            <div className="hidden lg:flex gap-6 text-sm text-white/60">
              <a
                className="hover:text-[#0ABAB5] transition-colors text-white font-medium border-b-2 border-[#0ABAB5] pb-4 -mb-[18px]"
                href="#"
              >
                服務概覽
              </a>
              <a className="hover:text-[#0ABAB5] transition-colors" href="#">
                5T 邏輯解析
              </a>
              <a className="hover:text-[#0ABAB5] transition-colors" href="#">
                操作引導
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white/5 rounded-full pl-2 pr-4 py-1 border border-white/10">
              <div
                className="w-8 h-8 rounded-full bg-cover bg-center border border-[#0ABAB5]/40"
                style={{
                  backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuDdkmUJEj75FAwy5PCCpnK2ghFTO7TdV3GBEPi5HYcCFH9NAMigqu_wvLSrmAoiVuXEl5WS8hBByoFAnHwtK8oSkmqnn6G6trpkmfpuc5isUN1NI_B9hqwv3seINAtA_pq_YNx786pWvq20xnlY_tD6Eth5MaivRvfvFuSa2jYENb-JAjwuYuvTRDh1_UZyCzJjgtUDMolYR62-Q-U6JQr2kawHnqY2-bR353q1rfeKbHj5rd2DgI_3MyvhcO-bjt4V0YhWBHtB5Gg')`,
                }}
              />
              <span className="text-sm font-bold truncate max-w-[100px]">
                {profile?.displayName || 'DingJun Hong'}
              </span>
            </div>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto relative z-10 space-y-10">
          {/* Welcome Hero Section */}
          <section className="backdrop-blur-2xl bg-white/[0.04] rounded-3xl p-10 relative overflow-hidden group border border-[#0ABAB5]/20 shadow-2xl">
            <div className="absolute -right-20 -top-20 w-96 h-96 bg-[#0ABAB5]/10 rounded-full blur-[100px]" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-[#0ABAB5]/20 text-[#0ABAB5] text-[10px] font-bold rounded-full tracking-widest uppercase">
                    Service Introduction
                  </span>
                </div>
                <h1 className="text-4xl font-black mb-6 leading-tight">
                  歡迎使用{' '}
                  <span className="text-[#0ABAB5] brightness-125 [text-shadow:0_0_15px_rgba(10,186,181,0.6)]">
                    JunAiKey
                  </span>
                  <br />
                  ESG 數位轉型服務系統
                </h1>
                <p className="text-white/70 text-lg leading-relaxed mb-8">
                  這是一個專為您打造的教育導向 ESG
                  儀表板。我們將複雜的永續數據，轉化為易於理解的「5T
                  邏輯鏈結」，幫助您從資產實體性出發，構建透明且可追蹤的綠色價值體系。
                </p>
                <div className="flex gap-4">
                  <button className="bg-[#0ABAB5] text-[#050d0d] px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(10,186,181,0.4)] transition-all flex items-center gap-2">
                    <PlayCircle className="w-5 h-5" />
                    開始引導教學
                  </button>
                  <button className="bg-white/5 border border-white/10 px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition-all">
                    系統手冊下載
                  </button>
                </div>
              </div>
              <div className="relative flex justify-center">
                <div className="w-72 h-72 rounded-full border-2 border-[#0ABAB5]/30 flex items-center justify-center relative">
                  <motion.div
                    animate={{ opacity: [0.05, 0.1, 0.05] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute inset-0 bg-[#0ABAB5]/5 rounded-full"
                  />
                  <div className="w-60 h-60 rounded-full border border-[#0ABAB5]/40 flex flex-col items-center justify-center text-center p-6 backdrop-blur-sm bg-white/5">
                    <ShieldWithHeart className="text-[#0ABAB5] w-12 h-12 mb-2" />
                    <p className="text-[#0ABAB5] font-bold">核心價值</p>
                    <p className="text-[10px] text-white/50 mt-1 uppercase tracking-widest leading-none">
                      Trust & Transparency
                    </p>
                  </div>
                  <div className="absolute -top-4 bg-[#050d0d] border border-[#0ABAB5]/40 p-2 rounded-lg text-[10px] font-bold text-[#0ABAB5] shadow-xl">
                    TANGIBLE
                  </div>
                  <div className="absolute -right-8 top-1/2 bg-[#050d0d] border border-[#0ABAB5]/40 p-2 rounded-lg text-[10px] font-bold text-[#0ABAB5] shadow-xl">
                    TRACEABLE
                  </div>
                  <div className="absolute -bottom-4 bg-[#050d0d] border border-[#0ABAB5]/40 p-2 rounded-lg text-[10px] font-bold text-[#0ABAB5] shadow-xl">
                    TRANSPARENT
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 5T Logic Cards Section */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  5T 邏輯門解析{' '}
                  <span className="text-[#0ABAB5] font-mono text-lg ml-2">
                    / 5T Logic Architecture
                  </span>
                </h2>
                <p className="text-white/50 text-sm mt-1">理解數據背後的永續邏輯，是轉型的第一步</p>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-[#0ABAB5]">
                <span className="w-2 h-2 rounded-full bg-[#0ABAB5] animate-pulse" />
                LIVE NODES ACTIVE
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#0ABAB5]/50 to-transparent opacity-20 hidden md:block" />
              {[
                {
                  name: '1. 實體化 (Tangible)',
                  desc: '將碳權或綠色資產轉化為可識別的數位憑證。',
                  icon: Layers,
                  status: 'STATUS: SYNCED',
                },
                {
                  name: '2. 可溯源 (Traceable)',
                  desc: '記錄供應鏈每一環節，確保數據來源真實可靠。',
                  icon: LinkIcon,
                  status: 'NODES: 128',
                },
                {
                  name: '3. 可信賴 (Trustworthy)',
                  desc: '透過區塊鏈雜湊鎖定，達成數據不可篡改性。',
                  icon: Verified,
                  status: 'HASH-LOCKED',
                  active: true,
                },
                {
                  name: '4. 可追蹤 (Trackable)',
                  desc: '全天候監控碳排放與能耗趨勢，精準掌握動態掌握動態。',
                  icon: Route,
                  status: 'REAL-TIME',
                },
                {
                  name: '5. 透明化 (Transparent)',
                  desc: '公開、透明的審計接口，建立市場與公眾信任。',
                  icon: Visibility,
                  status: 'AUDIT READY',
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`backdrop-blur-xl bg-white/[0.04] rounded-2xl p-6 relative group border transition-all cursor-help ${item.active ? 'border-[#0ABAB5]/60 bg-[#0ABAB5]/5 shadow-[0_0_15px_rgba(10,186,181,0.2)]' : 'border-white/10 hover:border-[#0ABAB5]/50 hover:bg-[#0ABAB5]/5'}`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${item.active ? 'bg-[#0ABAB5] text-[#050d0d]' : 'bg-[#0ABAB5]/20 text-[#0ABAB5]'}`}
                  >
                    <item.icon className="w-5 h-5 font-bold" />
                  </div>
                  <h4 className="font-bold text-white mb-2 text-sm">{item.name}</h4>
                  <p className="text-[11px] text-white/60 leading-relaxed mb-4">{item.desc}</p>
                  <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-[#0ABAB5] tracking-widest">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow & Side Panel Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 backdrop-blur-xl bg-white/[0.02] border border-white/5 rounded-2xl p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-[#0ABAB5]/20 rounded-lg">
                  <AccountTree className="text-[#0ABAB5] w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    服務執行流程{' '}
                    <span className="text-xs text-white/40 ml-2 font-normal uppercase tracking-widest">
                      Service Workflow
                    </span>
                  </h3>
                </div>
              </div>
              <div className="space-y-8 relative">
                <div className="absolute left-4 top-2 bottom-2 w-[1px] bg-white/10" />
                {[
                  {
                    step: '01',
                    title: '數據導入與清洗',
                    desc: '上傳原始能耗清單與 ESG 相關合約數據，系統進行格式驗證。',
                    status: 'COMPLETE',
                    active: true,
                  },
                  {
                    step: '02',
                    title: '5T 邏輯建模',
                    desc: 'AI 根據數據屬性，自動對接 5T 邏輯門進行數位孿生建模。',
                    status: 'PROCESSING...',
                    active: true,
                    processing: true,
                  },
                  {
                    step: '03',
                    title: '區塊鏈雜湊存證',
                    desc: '將數據指紋提交至 JunAi-Chain，生成全網唯一識別雜湊值。',
                    status: 'PENDING',
                  },
                  {
                    step: '04',
                    title: '自動化永續報告生成',
                    desc: '符合國際標準 (GRI, SASB) 的即時視覺化報告輸出。',
                  },
                ].map((item, i) => (
                  <div key={i} className="relative pl-12">
                    <div
                      className={`absolute left-2 top-0 w-4 h-4 rounded-full border-4 border-[#050d0d] transition-all ${item.active ? 'bg-[#0ABAB5] shadow-[0_0_10px_#0ABAB5]' : 'bg-white/10'}`}
                    />
                    <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
                      <div className={item.active ? '' : 'opacity-40'}>
                        <h5 className="font-bold text-[#0ABAB5] text-sm uppercase tracking-wider mb-1">
                          Step {item.step}: {item.title}
                        </h5>
                        <p className="text-sm text-white/70">{item.desc}</p>
                      </div>
                      {item.status && (
                        <div
                          className={`px-3 py-1 rounded-md border text-[10px] font-mono shrink-0 transition-all ${item.processing ? 'bg-[#0ABAB5]/20 text-[#0ABAB5] border-[#0ABAB5]/30 animate-pulse' : 'bg-white/5 text-white/60 border-white/10'}`}
                        >
                          {item.status}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {/* Learning Sidebar Widget */}
              <div className="backdrop-blur-xl bg-gradient-to-br from-[#0ABAB5]/10 to-transparent border border-[#0ABAB5]/20 rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-2 mb-4">
                  <Lightbulb className="text-[#0ABAB5] w-5 h-5" />
                  <h4 className="font-bold">今日學習焦點</h4>
                </div>
                <p className="text-xs text-white/70 leading-relaxed">
                  丁君，您知道嗎？在 5T 邏輯中，<b>「實體化 (Tangible)」</b>{' '}
                  是最關鍵的第一步。只有將虛擬的碳權與現實世界的特定森林或設備對接，ESG
                  數據才具有實質法律意義。
                </p>
                <button className="mt-4 w-full py-2 bg-[#0ABAB5]/20 hover:bg-[#0ABAB5]/30 rounded-lg text-xs font-bold text-[#0ABAB5] border border-[#0ABAB5]/30 transition-all">
                  查看案例研究
                </button>
              </div>

              {/* Status Sidebar Widget */}
              <div className="backdrop-blur-xl bg-white/[0.03] border border-white/5 rounded-2xl p-6 shadow-xl">
                <h4 className="font-bold mb-4 flex items-center justify-between">
                  系統狀態
                  <span className="text-[10px] text-[#0ABAB5] bg-[#0ABAB5]/10 px-2 py-0.5 rounded font-mono">
                    ONLINE
                  </span>
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">數據新鮮度</span>
                    <span className="font-mono text-white/80">2 mins ago</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">節點完整性</span>
                    <span className="font-mono text-[#0ABAB5]">99.98%</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/50">認證狀態</span>
                    <span className="text-emerald-400 font-bold">已驗證</span>
                  </div>
                </div>
              </div>

              {/* Support Sidebar Widget */}
              <div className="backdrop-blur-xl bg-white/[0.03] rounded-2xl p-6 border border-white/5 relative overflow-hidden group shadow-xl">
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:rotate-12 transition-transform">
                  <SupportAgent className="w-16 h-16 text-white" />
                </div>
                <h4 className="font-bold text-sm mb-2">需要協助嗎？</h4>
                <p className="text-[11px] text-white/50 mb-4">
                  我們的 AI 顧問 24/7 在線為您解析 ESG 複雜數據。
                </p>
                <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10 transition-all">
                  呼叫 AI 助理
                </button>
              </div>
            </div>
          </div>

          {/* Key Indicators Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: 'ESG 綜合評分',
                value: '84.2',
                trend: '+2.4%',
                sub: '↑',
                color: 'border-l-[#0ABAB5]',
              },
              {
                label: '實體資產同步',
                value: '88.5%',
                trend: 'STABLE',
                sub: '',
                color: 'border-l-[#0ABAB5]/60',
              },
              {
                label: '碳追蹤排放量',
                value: '1.2t',
                trend: 'CO2e',
                sub: '',
                color: 'border-l-[#0ABAB5]/40',
              },
              {
                label: '透明度審核',
                value: '99.9%',
                trend: 'VERIFIED',
                sub: '',
                color: 'border-l-[#0ABAB5]/20',
              },
            ].map((stat, i) => (
              <div
                key={i}
                className={`backdrop-blur-xl bg-white/[0.04] rounded-2xl p-6 border-l-4 ${stat.color} shadow-lg hover:bg-white/[0.06] transition-all`}
              >
                <p className="text-white/50 text-[10px] uppercase font-bold tracking-widest mb-1">
                  {stat.label}
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-black text-white">{stat.value}</span>
                  <span className="text-[#0ABAB5] text-xs font-bold mb-1">
                    {stat.trend} {stat.sub}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="p-8 border-t border-white/5 text-center mt-12 mb-8 relative z-10">
          <p className="text-white/30 text-[10px] uppercase tracking-[0.3em]">
            JunAiKey Sustainability Service Ecosystem © 2024
          </p>
        </footer>
      </main>
    </div>
  );
};
