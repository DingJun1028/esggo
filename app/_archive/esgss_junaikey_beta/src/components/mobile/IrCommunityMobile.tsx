import React from 'react';
import {
  Hub,
  Person,
  Settings,
  TrendingUp,
  Forum,
  ShowChart,
  Description,
  Event,
  Groups,
  Dashboard,
  Analytics,
  Public,
  Mail,
} from '@mui/icons-material';
import {
  BarChart3,
  Zap,
  Target,
  ShieldCheck,
  Users,
  Globe,
  Heart,
  MessageCircle,
  Share2,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * 🤝 IR & Community Mobile (Service 5.4 & 5.5 Mobile)
 * --------------------------------------------------
 * "IR Summary & Impact Feed" for DingJun Hong.
 * Features: Investor Metrics Tiles, Glass Connect Button, Community Impact Feed.
 */
export const IrCommunityMobile = () => {
  const feedItems = [
    {
      title: '啟動綠能合作夥伴計劃',
      desc: '與 5 家在地能源公司達成減碳協議，預計提升能源效能 20%...',
      time: '2小時前',
      tag: '永續發展',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjNoTuK1aOOUIzLs2NZkaoEk1_aq0o8cx03TIhzjFDKbUqBpHjIzPm5jwzJLpAZpzr3AcuPKGvrcpOKrYXPdu7UedAVVRsgYmeesI-qmMc34fr4PERTjvPeKdESM5bRA7ZxzLbu0UQMZrcYmpGyO9jPzujQnkFtupweFgBbahEm56jzhlPnQNVcX78dOSGC1XZIbzHOtftoJmlp21q1wwUZQ2Yx0zbSlOsjIEVcNWCOSDD0Q2INN5LAl3PMHUq3Zpif9d_wnE3iyk',
    },
    {
      title: '偏鄉學校科技教育支援',
      desc: '捐贈 50 台筆電並啟動為期三個月的編程課程，賦能下一代數位人才...',
      time: '昨日',
      tag: '社會責任',
      img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA45_racDp0r0RfKHriymv4JYUXlQj-MFIZvcm6OSHI9DNstRia4jmC2t1gYpfkQdKddw9CHLYiVkgiv1xP21SHPdafLDe0cmNOqCTKutIMCYqqV9ttwFQ-qBqlXGuieZL68WlToeI0SGgJ3XSvBnn3kXno91KD0FkxXJWXcYbmXFfeYmvL_dnLlAqFrjfonqytkM6cgnLzBe39HutBmXqNmyS2NHQoRu0E9PcI5A1YuFv3MYJ0bRg-Saj8ZkX2n0fxJFt5EAJ90ac',
    },
  ];

  return (
    <div className="bg-[#102222] text-white min-h-screen font-display selection:bg-[#0ab8b2]/20 flex flex-col relative pb-32 max-w-[480px] mx-auto shadow-2xl overflow-x-hidden border-x border-white/5">
      {/* Background Refraction Pulse */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(circle_at_top_right,#0ab8b208,transparent_50%)]" />

      {/* Header Navigation */}
      <header className="sticky top-0 z-50 backdrop-blur-3xl bg-[#111818]/80 border-b border-[#283939] px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-9 bg-[#0ab8b2] rounded-xl flex items-center justify-center text-[#111818] shadow-lg">
            <Hub style={{ fontSize: '20px' }} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-black tracking-tighter uppercase italic leading-none">
              5.4 & 5.5 關係與社群
            </h1>
            <p className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest mt-1 opacity-80 italic">
              IR & Community Hub
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all text-white/60">
            <Person style={{ fontSize: '22px' }} />
          </button>
          <button className="size-11 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 active:scale-95 transition-all text-white/60">
            <Settings style={{ fontSize: '22px' }} />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto no-scrollbar py-8 px-6 space-y-10">
        {/* IR Summary Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-black italic tracking-tighter text-white uppercase italic px-2">
            投資人摘要 IR Summary
          </h2>

          <div className="grid grid-cols-2 gap-4">
            {[
              { label: '市值 Market Cap', val: '$1.2B', trend: '+2.1%', positive: true },
              { label: 'ESG 評級 Rating', val: 'AAA', sub: '產業領先', highlight: true },
            ].map((stat, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.02 }}
                className="backdrop-blur-3xl bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 shadow-xl space-y-3"
              >
                <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">
                  {stat.label}
                </p>
                <p
                  className={`text-3xl font-black italic tracking-tighter ${stat.highlight ? 'text-[#0ab8b2]' : 'text-white'}`}
                >
                  {stat.val}
                </p>
                {stat.trend && (
                  <div className="flex items-center gap-2 text-emerald-400 font-black italic text-[10px] bg-emerald-500/10 w-fit px-3 py-1 rounded-full">
                    <TrendingUp style={{ fontSize: '14px' }} /> {stat.trend}
                  </div>
                )}
                {stat.sub && (
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-widest italic">
                    {stat.sub}
                  </p>
                )}
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.01 }}
              className="col-span-2 backdrop-blur-3xl bg-white/[0.03] p-8 rounded-[2rem] border border-white/5 shadow-xl flex justify-between items-center"
            >
              <div className="space-y-2">
                <p className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">
                  投資回報率 ROI
                </p>
                <p className="text-4xl font-black italic text-[#0ab8b2] tracking-tighter">+12.5%</p>
              </div>
              <div className="h-16 w-32 relative overflow-hidden bg-[#0ab8b2]/5 rounded-2xl border border-[#0ab8b2]/20 flex items-center justify-center group/chart">
                <div className="absolute inset-0 bg-gradient-to-t from-[#0ab8b2]/10 to-transparent animate-pulse" />
                <ShowChart className="text-[#0ab8b2] size-10 drop-shadow-[0_0_8px_#0ab8b2] group-hover:scale-125 transition-transform" />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Connect Action */}
        <button className="w-full h-20 bg-[#0ab8b2]/10 hover:bg-[#0ab8b2]/20 backdrop-blur-3xl border border-[#0ab8b2]/30 rounded-[2rem] flex items-center justify-center gap-5 text-[#0ab8b2] font-black uppercase text-sm tracking-[0.2em] transition-all active:scale-95 shadow-2xl group">
          <Forum className="group-hover:rotate-12 transition-transform" />
          <span>聯繫我們 Connect</span>
        </button>

        {/* Impact Feed */}
        <section className="space-y-6">
          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase italic px-2">
            社群影響力動態 Impact Feed
          </h3>
          <div className="space-y-5">
            {feedItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                className="flex gap-6 p-6 rounded-[2.5rem] bg-white/[0.03] border border-transparent hover:border-white/10 transition-all cursor-pointer group shadow-xl"
              >
                <div className="size-20 rounded-2xl overflow-hidden shrink-0 shadow-lg group-hover:scale-105 transition-transform">
                  <img className="size-full object-cover" src={item.img} alt="impact" />
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-white text-base font-black italic tracking-tight uppercase group-hover:text-[#0ab8b2] transition-colors">
                    {item.title}
                  </h4>
                  <p className="text-white/30 text-[11px] font-light italic leading-relaxed tracking-tight line-clamp-2">
                    {item.desc}
                  </p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-[9px] text-[#0ab8b2] font-black uppercase tracking-widest italic">
                      {item.time}
                    </span>
                    <div className="size-1 rounded-full bg-white/10" />
                    <span className="text-[9px] text-white/30 font-black uppercase tracking-widest italic">
                      {item.tag}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Links */}
        <section className="space-y-6 pb-12">
          <h3 className="text-xl font-black italic tracking-tighter text-white uppercase italic px-2">
            快速連結 Links
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Description, label: '財務報告 Reports' },
              { icon: Event, label: '會議日程 Events' },
              { icon: Groups, label: '社區論壇 Forums', full: true },
            ].map((link, i) => (
              <button
                key={i}
                className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[2rem] border border-white/5 bg-white/[0.03] hover:bg-white/[0.06] hover:border-[#0ab8b2]/30 transition-all active:scale-95 shadow-xl ${link.full ? 'col-span-2 flex-row py-6' : ''}`}
              >
                <link.icon className="text-[#0ab8b2] size-8" />
                <span className="text-[10px] font-black uppercase tracking-widest text-white/60">
                  {link.label}
                </span>
              </button>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation Dock */}
      <nav className="fixed bottom-0 left-0 right-0 h-24 backdrop-blur-3xl bg-[#111818]/95 border-t border-white/5 px-10 flex items-center justify-between z-50 rounded-t-[2.5rem] shadow-3xl">
        {[
          { icon: Dashboard, label: '概覽' },
          { icon: Analytics, label: '數據' },
          { icon: Public, label: '動態', active: true },
          { icon: Mail, label: '通知' },
        ].map((item, i) => (
          <button
            key={i}
            className={`flex flex-col items-center gap-1.5 transition-all ${item.active ? 'text-[#0ab8b2] scale-110 active:scale-95' : 'text-white/20 hover:text-white'}`}
          >
            <item.icon
              style={{ fontSize: '26px' }}
              className={item.active ? 'drop-shadow-[0_0_8px_#0ab8b2]' : ''}
            />
            <span className="text-[10px] font-black uppercase tracking-widest leading-none">
              {item.label}
            </span>
          </button>
        ))}
      </nav>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .font-display { font-family: 'Space Grotesk', 'Noto Sans TC', sans-serif; }
      `}</style>
    </div>
  );
};
