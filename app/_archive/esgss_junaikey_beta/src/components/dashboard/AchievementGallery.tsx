import React, { useState } from 'react';
import {
  Trophy,
  Leaf,
  Users2 as Users,
  History as HistoryIcon,
  CheckCircle2,
  Lock as LockIcon,
  Info as InfoIcon,
  Zap,
  ShieldCheck,
  Waves,
  Search as SearchIcon,
  Gem,
  Award,
  Star as StarIcon,
  ShieldAlert,
  CloudMoon,
  Shield,
  Heart,
  Trees,
  Scale,
  RotateCw,
  ChevronRight,
  ArrowRight,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 🏆 Achievement Gallery (Final Premium Version)
 * --------------------------------------------------
 * "Sustainability Medal Gallery" design for 洪鼎竣 (DingJun Hong).
 * Features categorized medals, liquid glass hover panels, and XP sphere integration.
 */
export const AchievementGallery = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const medals = [
    {
      id: 'm1',
      name: '碳中和專家',
      enName: 'Carbon Neutral Master',
      category: 'environmental',
      icon: CloudMoon, // Representing CO2/Carbon
      desc: '表彰在組織內部成功推動並達成年度碳中和轉型計畫之傑出貢獻。',
      date: '2023.08.15',
      earned: true,
      color: '#0de7f2',
    },
    {
      id: 'm2',
      name: '5T 守護者',
      enName: '5T Guardian',
      category: 'governance',
      icon: ShieldCheck,
      desc: '維護生態系統的五大透明度指標 (5T)，確保永續數據的真實與完整性。',
      date: '2023.05.20',
      earned: true,
      color: '#0de7f2',
    },
    {
      id: 'm3',
      name: '社區療癒者',
      enName: 'Community Healer',
      category: 'social',
      icon: Heart,
      desc: '致力於社區發展與弱勢關懷，成功建立具備韌性與共榮感的在地網路。',
      date: '2023.03.12',
      earned: true,
      color: '#0de7f2',
    },
    {
      id: 'm4',
      name: '綠色足跡領袖',
      enName: 'Green Footprint Leader',
      category: 'environmental',
      icon: Trees,
      desc: '引導團隊在日常運作中全面導入減塑與節能措施，顯著降低環境負擔。',
      date: '2022.11.30',
      earned: true,
      color: '#0de7f2',
    },
    {
      id: 'm5',
      name: '透明治理先鋒',
      enName: 'Governance Pioneer',
      category: 'governance',
      icon: Scale,
      desc: '致力於推動透明化治理流程，確保數據的每一層級都具備高度公信力。',
      date: '2022.09.15',
      earned: true,
      color: '#0de7f2',
    },
    {
      id: 'm6',
      name: '循環經濟推手',
      enName: 'Circular Expert',
      category: 'environmental',
      icon: RotateCw,
      desc: '在資源循環利用與廢棄物減量中展現卓越領導力，優化生命週期價值。',
      date: '2022.07.01',
      earned: true,
      color: '#0de7f2',
    },
    { name: '???', date: '尚未解鎖', earned: false },
    { name: '???', date: '尚未解鎖', earned: false },
  ];

  const filteredMedals = medals.filter(m => {
    if (activeTab === 'all') return true;
    return m.category === activeTab;
  });

  return (
    <div className="bg-[#102122] text-white min-h-screen font-display selection:bg-[#0de7f2]/20 overflow-x-hidden">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[10%] left-[5%] size-96 bg-[#0de7f2]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] size-[500px] bg-[#0de7f2]/10 rounded-full blur-[150px]" />
        <div className="absolute top-[40%] right-[20%] size-64 bg-[#0de7f2]/5 rounded-full blur-[100px]" />
      </div>

      <div className="relative flex flex-col min-h-screen">
        {/* Main Header / Profile Header */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-[#102122]/80 backdrop-blur-md px-6 md:px-20 lg:px-40 py-4">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between">
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-3 text-[#0de7f2]">
                <Award className="w-8 h-8" />
                <h2 className="text-xl font-bold tracking-tight">
                  JunAiKey <span className="text-white/80 font-medium tracking-normal">ESGss</span>
                </h2>
              </div>
              <nav className="hidden md:flex items-center gap-8">
                <a
                  className="text-[#0de7f2] hover:text-[#0de7f2] transition-colors text-sm font-bold"
                  href="#"
                >
                  成就畫廊
                </a>
                <a
                  className="text-white/40 hover:text-[#0de7f2] transition-colors text-sm font-bold"
                  href="#"
                >
                  永續報告
                </a>
                <a
                  className="text-white/40 hover:text-[#0de7f2] transition-colors text-sm font-bold"
                  href="#"
                >
                  個人專區
                </a>
              </nav>
            </div>
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-2 gap-3 group focus-within:border-[#0de7f2]/50 transition-all">
                <SearchIcon className="text-[#0de7f2] w-4 h-4" />
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="bg-transparent border-none focus:ring-0 text-sm text-white placeholder:text-white/30 w-32 lg:w-48 outline-none"
                  placeholder="搜尋成就..."
                  type="text"
                />
              </div>
              <div className="size-10 rounded-full border-2 border-[#0de7f2]/50 p-0.5 overflow-hidden">
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

        <main className="flex-1 px-6 md:px-20 lg:px-40 py-12">
          <div className="mx-auto max-w-[1200px]">
            {/* Profile Summary Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-12 backdrop-blur-3xl bg-white/[0.03] border border-[#0de7f2]/30 rounded-[2.5rem] p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#0de7f2]/10 via-transparent to-transparent opacity-40" />

              <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
                <div className="relative group">
                  <div className="absolute inset-0 bg-[#0de7f2]/20 blur-3xl rounded-full scale-110 group-hover:scale-125 transition-transform duration-700" />
                  <div className="relative size-40 rounded-full border-4 border-[#0de7f2]/30 p-1.5 shadow-2xl">
                    <div
                      className="size-full rounded-full bg-cover bg-center shadow-inner"
                      style={{
                        backgroundImage:
                          "url('https://lh3.googleusercontent.com/a/ACg8ocL_U0YV6m_XzW_G_y_W_s_x_x_x=s192-c')",
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-[#0de7f2] text-[#102122] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em] shadow-lg">
                    Elite
                  </div>
                </div>

                <div className="text-center md:text-left space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
                    洪鼎竣{' '}
                    <span className="text-[#0de7f2]/60 font-medium text-2xl ml-3 tracking-normal">
                      DingJun Hong
                    </span>
                  </h1>
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 text-white/50">
                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      <StarIcon className="text-[#0de7f2] w-4 h-4" /> 永續專家
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      <ShieldCheck className="text-[#0de7f2] w-4 h-4" /> 12,500 P 成就點數
                    </span>
                    <span className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
                      <Award className="text-[#0de7f2] w-4 h-4" /> 已解鎖 12 枚勳章
                    </span>
                  </div>
                </div>
              </div>

              <button className="relative z-10 bg-[#0de7f2]/10 hover:bg-[#0de7f2]/20 border border-[#0de7f2]/30 text-[#0de7f2] px-10 py-4 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all shadow-xl active:scale-95">
                編輯個人檔案
              </button>
            </motion.div>

            {/* Tabs & Section Header */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-black text-white flex items-center gap-5 tracking-tight">
                  <Gem className="text-[#0de7f2] size-10" />
                  永續成就勳章畫廊
                </h2>
                <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-[0.2em]">
                  <HistoryIcon className="size-4" />
                  最近更新：2023年10月24日
                </div>
              </div>

              <div className="flex border-b border-white/5 gap-10 overflow-x-auto no-scrollbar pb-1">
                {[
                  { id: 'all', label: '全部勳章 (12)' },
                  { id: 'environmental', label: '環境保護 Environmental (5)' },
                  { id: 'social', label: '社會責任 Social (4)' },
                  { id: 'governance', label: '公司治理 Governance (3)' },
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-5 px-1 text-sm font-black uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-[#0de7f2]' : 'text-white/40 hover:text-white/70'}`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="tabLine"
                        className="absolute bottom-0 left-0 right-0 h-1 bg-[#0de7f2] shadow-[0_0_10px_#0de7f2]"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Medal Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatePresence mode="popLayout">
                {filteredMedals.map((medal, i) => (
                  <motion.div
                    key={medal.id || i}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    className={`group relative backdrop-blur-3xl bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-10 flex flex-col items-center transition-all duration-700 ${medal.earned ? 'hover:-translate-y-3 hover:bg-white/[0.05] hover:border-[#0de7f2]/40 shadow-xl cursor-pointer' : 'opacity-40 grayscale pointer-events-none'}`}
                  >
                    {/* Ripple Background on Hover */}
                    <div className="absolute inset-x-8 inset-y-12 bg-[#0de7f2]/10 blur-[80px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

                    <div className="relative size-48 mb-10 flex items-center justify-center">
                      <div
                        className={`absolute inset-0 rounded-full border-2 border-dashed ${medal.earned ? 'border-[#0de7f2]/20 animate-[spin_15s_linear_infinite]' : 'border-white/5'}`}
                      />

                      <div className="size-32 rounded-full flex items-center justify-center relative overflow-hidden group-hover:scale-110 transition-transform duration-700">
                        {medal.earned ? (
                          <>
                            <div className="absolute inset-0 bg-radial-gradient(circle at center, #0de7f2 0%, #089199 60%, transparent 100%) opacity-80 blur-sm" />
                            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/glass.png')] mix-blend-overlay" />
                            {medal.icon && (
                              <medal.icon className="text-white size-16 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)] relative z-10" />
                            )}
                          </>
                        ) : (
                          <div className="size-full bg-white/5 flex items-center justify-center">
                            <LockIcon className="text-white/20 size-12" />
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-center relative z-10 transition-colors">
                      <h3
                        className={`text-xl font-black mb-2 ${medal.earned ? 'text-white group-hover:text-[#0de7f2]' : 'text-white/20'}`}
                      >
                        {medal.name}
                      </h3>
                      <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.3em] font-mono">
                        {medal.enName || 'UNDISCOVERED'}
                      </p>
                    </div>

                    {/* Hover Reveal Definition Panel */}
                    {medal.earned && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileHover={{ opacity: 1, y: -5 }}
                        className="absolute inset-x-0 -bottom-8 opacity-0 group-hover:opacity-100 transition-all duration-500 z-30 px-6"
                      >
                        <div className="backdrop-blur-3xl bg-[#102122]/95 border border-[#0de7f2]/50 rounded-[1.5rem] p-6 text-center shadow-2xl">
                          <p className="text-[#0de7f2] text-[10px] font-black uppercase tracking-[0.3em] mb-4 border-b border-[#0de7f2]/20 pb-2">
                            服務定義 Service Definition
                          </p>
                          <p className="text-white text-xs leading-relaxed font-light mb-4 px-2">
                            {medal.desc}
                          </p>
                          <div className="flex items-center justify-center gap-2 pt-2 border-t border-white/5">
                            <p className="text-white/30 text-[9px] font-black uppercase tracking-widest">
                              達成日期: {medal.date}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>

        <footer className="mt-auto px-10 py-16 border-t border-white/5 bg-[#0a1515]">
          <div className="mx-auto max-w-[1200px] flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-4 text-white/30 text-[10px] font-black tracking-widest uppercase">
              <ShieldCheck className="w-4 h-4 text-[#0de7f2]/40" />
              <span>
                © 2024 ESGss JunAiKey Ecosystem for DingJun Hong. 數位資產受加密技術保護。
              </span>
            </div>
            <div className="flex items-center gap-10">
              <a
                className="text-white/20 hover:text-[#0de7f2] transition-colors text-[10px] font-black uppercase tracking-widest"
                href="#"
              >
                隱私權條款
              </a>
              <a
                className="text-white/20 hover:text-[#0de7f2] transition-colors text-[10px] font-black uppercase tracking-widest"
                href="#"
              >
                服務規範
              </a>
              <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981] animate-pulse" />
              <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">
                系統狀態 STABLE
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};
