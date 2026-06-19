import React, { useState } from 'react';
import {
  Analytics,
  CalendarToday,
  TrendingUp,
  Apps,
  Eco,
  Group,
  CorporateFare,
  Link as LinkIcon,
  SmartToy,
  Bookmark,
  Home,
  Refresh,
  Search as SearchIcon,
  Bookmarks,
  Settings,
  Search,
} from '@mui/icons-material';
import {
  BarChart3,
  Zap,
  Clock,
  ExternalLink,
  Target,
  Share2,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * 📰 Daily Intelligence Mobile (Service 1.3 Mobile)
 * --------------------------------------------------
 * "Context-Aware ESG Briefing" for DingJun Hong.
 * Features: Market Sentiment Pulse, Filterable News Stream, AI Summary Action.
 */
export const DailyIntelligenceMobile = () => {
  const [activeTab, setActiveTab] = useState('ALL');

  const news = [
    {
      title: '台積電加速綠能佈局，目標 2030 年達成 RE100 階段性進展',
      source: '路透社',
      time: '2 小時前',
      category: '環境 (E)',
      sentiment: '正面情緒',
      sentimentColor: 'bg-[#0ab8b2]',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB-KJlc4c39mY_G8YK5dSFp3vJlUrixNZP5Xp7D4lWfgI9h-vEJa8bsd17_IyrDvYtlu9Q4I645kMfEl7OUz0gBVXQ00T2_FjLS4bHd1__5LYLznZAcluiKqrZxJJs4jOx2RjkaqMyqTPtsfpoq5hiP2dQPxbtKGEhndUob1hEBxwLivq4woRiCopK43dyFjTUjU7AfrqA1fdsGyfd3FYOdLkaWwhcMbU58ZxnLGN-IkL_KmfJTQOylVsPtIS4UpLch8iuaPDxtn7k',
    },
    {
      title: '全球 ESG 披露準則更新，企業透明度要求進一步提升',
      source: '經濟日報',
      time: '5 小時前',
      category: '治理 (G)',
      sentiment: '中性情緒',
      sentimentColor: 'bg-white/20',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCKvGsF8k_4hjNS8_1UIEUL590JqG9a3lhIR3DP4Q91MZn5FcBFrCxCbgoaAE7rOKUfTjXUOB4KG3DZYmlyQUYd9C1IHHiA81y3yr6oGxfx0gspVDoIJRTGH_0KBOH8-jUPYwWmVEDiX6btj3f89HrxHefnvFBLDv_III7ArJ_g3_K3eQ_L0VqADVMx5pVYasH1PBOIzAJlamzeZBWSF0ne_GtQJKwMGrG4IEzsli3dQa3TRB4OJ_-zUJdGsXfo5-WGN4uD-DHEWW8',
    },
    {
      title: '供應鏈勞工人權報告發佈，部分電子製造商面臨嚴峻挑戰',
      source: '華爾街日報',
      time: '8 小時前',
      category: '社會 (S)',
      sentiment: '負面情緒',
      sentimentColor: 'bg-rose-500/80',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAND3dRiarA6BDpijpY747XDaoufADjYszR8qCWSZ1xC1RtX-WVCHZ2v_5r0HEpE6DUHITWQ2kdJAwQkSnSbT1qEzfmg4gO4uMwIZCp7jdkLQ2GtVXoTjttSbBOyFz0ClZ859tTGj57i_0hhoNFjgpIEKjWA64L-zlgmyUdRLeaghdLS0SR3X9RsRvw1hjszEt1URFNTDyVpVGsWF52tvqcN32sxp9Qj2ObqJc1Kepwo2Cf3hJxPGk5o99PopTbL_8H2z_CAbgk7kk',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto shadow-2xl overflow-x-hidden">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-1/4 -right-20 size-96 rounded-full bg-[#0ab8b2]/5 blur-[100px]" />
        <div className="absolute bottom-1/4 -left-20 size-96 rounded-full bg-[#0ab8b2]/3 blur-[100px]" />
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#102222]/80 px-6 py-5 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-4">
          <div className="bg-[#0ab8b2] p-2 rounded-xl flex items-center justify-center shadow-lg">
            <Analytics style={{ fontSize: '20px' }} className="text-[#102222] font-black" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-black tracking-tighter uppercase italic leading-none">
              每日智能簡報 1.3
            </h1>
            <p className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest mt-1 opacity-80">
              Intelligence Mobile Hub
            </p>
          </div>
        </div>
        <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors active:scale-90 shadow-xl">
          <CalendarToday style={{ fontSize: '18px' }} />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar py-8 space-y-10">
        {/* Market Sentiment Hero */}
        <section className="px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-3xl bg-white/[0.03] border-l-4 border-l-[#0ab8b2] border-y border-r border-white/10 p-8 rounded-2xl shadow-3xl flex flex-col gap-4 group"
          >
            <div className="flex justify-between items-start">
              <p className="text-white/60 text-sm font-black italic tracking-tight uppercase">
                今日 ESG 市場情緒概覽 Sentiment
              </p>
              <TrendingUp className="text-[#0ab8b2] animate-pulse" />
            </div>
            <div className="flex items-baseline gap-4 mt-2">
              <h2 className="text-4xl font-black italic text-white tracking-tighter italic leading-none">
                偏向正面
              </h2>
              <p className="text-[#0ab8b2] text-xl font-black italic tracking-tighter">+12.4%</p>
            </div>
            <p className="text-white/30 text-[10px] uppercase font-black tracking-widest italic">
              基於 1,240 則即時新聞分析 Intelligence Synthesis
            </p>
          </motion.div>
        </section>

        {/* Categories Chips */}
        <div className="flex gap-4 px-6 overflow-x-auto no-scrollbar">
          {[
            { label: '全部', icon: Apps, id: 'ALL' },
            { label: '環境 (E)', icon: Eco, id: 'E' },
            { label: '社會 (S)', icon: Group, id: 'S' },
            { label: '治理 (G)', icon: CorporateFare, id: 'G' },
          ].map((cat, i) => (
            <button
              key={i}
              onClick={() => setActiveTab(cat.id)}
              className={`flex h-12 shrink-0 items-center justify-center gap-3 rounded-full px-6 transition-all border font-black text-[11px] uppercase tracking-widest ${activeTab === cat.id ? 'bg-[#0ab8b2] text-[#102222] border-[#0ab8b2] shadow-[0_5px_20px_rgba(10,184,178,0.3)]' : 'bg-white/5 text-white/40 border-white/5 hover:text-white'}`}
            >
              <cat.icon style={{ fontSize: '18px' }} />
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* News Feed Stream */}
        <div className="px-6 space-y-8 pb-32">
          {news.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx }}
              className="backdrop-blur-3xl bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden flex flex-col group transition-all shadow-2xl hover:border-[#0ab8b2]/40"
            >
              {/* News Image Background */}
              <div
                className="w-full h-48 bg-center bg-cover relative group-hover:scale-105 transition-transform duration-1000 overflow-hidden"
                style={{ backgroundImage: `url('${item.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute top-4 left-4 flex gap-3 z-10">
                  <span className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-[#0ab8b2] text-[9px] font-black uppercase tracking-widest border border-[#0ab8b2]/30">
                    {item.category}
                  </span>
                  <span
                    className={`px-3 py-1.5 rounded-xl ${item.sentimentColor} text-[#102222] text-[9px] font-black uppercase tracking-widest shadow-xl`}
                  >
                    {item.sentiment}
                  </span>
                </div>
              </div>

              {/* News Content */}
              <div className="p-8 flex flex-col gap-6 relative z-10 transition-all">
                <h3 className="text-xl font-black italic text-white tracking-tight leading-snug group-hover:text-[#0ab8b2] transition-colors">
                  {item.title}
                </h3>

                <div className="flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 text-white/40 text-[9px] font-black uppercase tracking-widest italic">
                    <LinkIcon style={{ fontSize: '14px' }} className="text-[#0ab8b2]/60" />
                    <span>
                      {item.source} · {item.time}
                    </span>
                  </div>
                </div>

                {/* AI Action Buttons */}
                <div className="flex gap-4">
                  <button className="flex-1 bg-[#0ab8b2] hover:bg-[#0ab8b2]/80 text-[#102222] h-14 rounded-2xl font-black text-[11px] uppercase tracking-[.1em] flex items-center justify-center gap-3 shadow-[0_10px_25px_rgba(10,184,178,0.3)] active:scale-95 transition-all">
                    <SmartToy style={{ fontSize: '18px' }} /> 一鍵 AI 摘要 Abstract
                  </button>
                  <button className="size-14 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90">
                    <Bookmark style={{ fontSize: '20px' }} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}

          <button className="w-full py-10 rounded-[2.5rem] bg-white/[0.01] border border-dashed border-white/10 text-white/20 text-[10px] font-black uppercase tracking-[0.5em] hover:bg-white/5 hover:text-white transition-all">
            查看更多情報 Intelligence Sync
          </button>
        </div>
      </main>

      {/* Floating Bottom Navigation (Glassmorphic) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] z-[100]">
        <nav className="backdrop-blur-3xl bg-[#1b2727]/80 h-20 rounded-[2.5rem] flex items-center justify-around px-4 shadow-[0_20px_60px_rgba(0,0,0,0.8)] border border-white/20">
          <button className="flex flex-col items-center gap-1.5 text-[#0ab8b2] scale-110 active:scale-90 transition-all">
            <Home style={{ fontSize: '24px' }} />
            <span className="text-[9px] font-black uppercase tracking-widest">首頁</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-all">
            <Refresh style={{ fontSize: '24px' }} />
            <span className="text-[9px] font-black uppercase tracking-widest">刷新</span>
          </button>

          <div className="relative -top-8">
            <button className="size-16 rounded-full bg-[#0ab8b2] text-[#102222] shadow-[0_10px_30px_rgba(10,184,178,0.5)] flex items-center justify-center border-[5px] border-[#102222] active:scale-90 transition-all hover:scale-110">
              <SearchIcon style={{ fontSize: '32px' }} className="font-bold" />
            </button>
          </div>

          <button className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-all">
            <Bookmarks style={{ fontSize: '24px' }} />
            <span className="text-[9px] font-black uppercase tracking-widest">收藏</span>
          </button>
          <button className="flex flex-col items-center gap-1.5 text-white/40 hover:text-white transition-all">
            <Settings style={{ fontSize: '24px' }} />
            <span className="text-[9px] font-black uppercase tracking-widest">設定</span>
          </button>
        </nav>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
