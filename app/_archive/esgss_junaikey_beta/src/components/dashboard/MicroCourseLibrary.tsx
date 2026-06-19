import React, { useState } from 'react';
import { motion } from 'framer-motion';

/**
 * 🎓 微課程沉澱庫 (Micro Course Library)
 * --------------------------------------------------
 * 遵從 "Tiffany Blue Liquid Glass" 美學規範。
 * 核心功能：沉澱講座、專家點評、5T 認證進度。
 */
export const MicroCourseLibrary = () => {
  const [activeTab, setActiveTab] = useState('全部課程');

  const courses = [
    {
      id: 1,
      title: '企業碳盤查：從觀念到實作的第一步',
      level: 'T1 LEVEL',
      duration: '12 分鐘',
      desc: '解析 ISO 14064-1 基礎架構，協助企業快速上手碳排放量化流程。',
      image:
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426',
      students: 8,
    },
    {
      id: 2,
      title: 'ESG 永續報告書編撰實戰專題',
      level: 'T2 LEVEL',
      duration: '18 分鐘',
      desc: 'GRI 準則 2021 更新重點解析，掌握編撰永續報告書的核心技術。',
      image:
        'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=2301',
      students: 12,
    },
    {
      id: 3,
      title: '供應鏈減碳：數據驅動的決策工具',
      level: 'T3 LEVEL',
      duration: '15 分鐘',
      desc: '運用數位平台進行供應鏈碳排管理，實現真正的環境淨零目標。',
      image:
        'https://images.unsplash.com/photo-1551288049-bbdac8626ad1?auto=format&fit=crop&q=80&w=2340',
      students: 5,
    },
  ];

  const mentorFeedback = [
    {
      id: 1,
      name: '林大衛 老師',
      title: 'ESG 策略資深顧問',
      quote:
        '「在 T1 課程中提到碳盤查的『邊、源、算、報』四字訣非常精彩，學員應該更專注在範疇三數據的精準度優化上。」',
      avatar: 'https://i.pravatar.cc/150?u=mentor1',
    },
    {
      id: 2,
      name: '陳雅婷 老師',
      title: '企業永續報告編撰專家',
      quote:
        '「實戰專題中關於利害關係人溝通的案例解析非常到位，這正是許多初次編撰報告的企業最容易忽略的痛點。」',
      avatar: 'https://i.pravatar.cc/150?u=mentor2',
    },
  ];

  return (
    <div className="bg-[#051110] text-white min-h-screen font-display selection:bg-[#0df2df]/20 flex flex-col relative overflow-hidden">
      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-20">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-[#0df2df]/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[120px]" />
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-[#051110]/60 backdrop-blur-xl">
        <div className="max-w-[1400px] mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30 ring-4 ring-[#0df2df]/5">
              <span className="material-symbols-outlined text-[#0df2df] text-[24px]">school</span>
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight italic">
                ESGss <span className="text-[#0df2df]">JunAiKey</span>
              </h2>
              <p className="text-[10px] text-[#0df2df]/60 tracking-[0.4em] font-black uppercase italic">
                Micro Course Library v1.0
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-[1400px] w-full mx-auto px-8 py-16 space-y-16 z-10">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div className="space-y-6 max-w-2xl">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0df2df]/10 border border-[#0df2df]/20 w-fit">
              <span className="material-symbols-outlined text-[#0df2df] text-xs">auto_awesome</span>
              <span className="text-[#0df2df] text-[10px] font-black tracking-widest uppercase italic">
                錄製即產出 成果展示
              </span>
            </div>
            <h1 className="text-6xl font-black italic tracking-tighter uppercase leading-[0.9]">
              學院沉澱：
              <br />
              <span className="text-[#0df2df]">5T 認證</span>微課程庫
            </h1>
            <p className="text-slate-400 text-lg italic border-l-2 border-[#0df2df]/30 pl-8">
              系統化沉澱每一場講座精華，將實戰經驗轉化為可隨時複習的微課程素材。
            </p>
          </div>
          <button className="h-14 px-8 bg-[#0df2df] text-[#051110] rounded-2xl font-black italic uppercase tracking-widest hover:scale-105 transition-all shadow-[0_20px_40px_rgba(13,242,223,0.3)] active:scale-95 flex items-center gap-3">
            <span className="material-symbols-outlined">analytics</span>
            查看認證進度
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {[
            '全部課程',
            'T1 基礎導入',
            'T2 策略實踐',
            'T3 數據查證',
            'T4 永續管理',
            'T5 專家顧問',
          ].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`h-12 px-8 rounded-xl font-black italic uppercase tracking-widest transition-all whitespace-nowrap ${
                activeTab === tab
                  ? 'bg-[#0df2df] text-[#051110]'
                  : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <motion.div
              key={course.id}
              whileHover={{ y: -10 }}
              className="bg-white/[0.03] border border-white/10 rounded-[2.5rem] overflow-hidden group flex flex-col backdrop-blur-3xl"
            >
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-[#051110]/80 to-transparent z-10" />
                <div className="absolute top-6 right-6 z-20 px-3 py-1 rounded-full bg-[#0df2df] text-[#051110] text-[9px] font-black tracking-widest shadow-xl">
                  {course.level}
                </div>
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <div className="p-8 flex flex-col flex-1 gap-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0df2df] text-xs">schedule</span>
                  <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest italic">
                    {course.duration} 課程
                  </span>
                </div>
                <h4 className="text-xl font-black italic tracking-tighter uppercase leading-tight group-hover:text-[#0df2df] transition-colors">
                  {course.title}
                </h4>
                <p className="text-xs text-slate-500 italic leading-relaxed line-clamp-2">
                  {course.desc}
                </p>
                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="size-8 rounded-full border-2 border-[#051110] bg-slate-800"
                      />
                    ))}
                    <div className="size-8 rounded-full border-2 border-[#051110] bg-white/10 flex items-center justify-center text-[10px] font-bold">
                      +{course.students}
                    </div>
                  </div>
                  <button className="text-[#0df2df] text-xs font-black italic uppercase tracking-widest flex items-center gap-2 group/btn">
                    開始學習
                    <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mentor Feedback */}
        <div className="space-y-10 py-12">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-[#0df2df] text-[32px]">psychology</span>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase">業師回饋點評</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent" />
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            {mentorFeedback.map(feedback => (
              <div
                key={feedback.id}
                className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 border-l-4 border-l-[#0df2df] relative group hover:bg-[#0df2df]/5 transition-all"
              >
                <span className="material-symbols-outlined absolute right-8 top-8 text-[#0df2df]/10 text-[64px] group-hover:opacity-30 transition-opacity">
                  format_quote
                </span>
                <div className="flex items-center gap-6 mb-6">
                  <div className="size-14 rounded-full border-2 border-[#0df2df]/30 overflow-hidden">
                    <img
                      src={feedback.avatar}
                      alt={feedback.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-lg font-black italic uppercase tracking-tight">
                      {feedback.name}
                    </h5>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                      {feedback.title}
                    </p>
                  </div>
                </div>
                <p className="text-slate-300 italic leading-relaxed relative z-10">
                  {feedback.quote}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="max-w-[1400px] w-full mx-auto px-8 py-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 opacity-40">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined">verified</span>
          <p className="text-[10px] font-black uppercase tracking-[0.4em] italic">
            © 2024 ESGss JunAiKey Academia. 5T CERTIFIED.
          </p>
        </div>
        <div className="flex gap-10 text-[10px] font-black uppercase tracking-[0.2em] italic">
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Learning Progress</a>
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">
            Certification Path
          </a>
          <a className="hover:text-[#0df2df] transition-colors cursor-pointer">Mentor Portal</a>
        </div>
      </footer>

      <style>{`
                .font-display { font-family: 'Lexend', 'Manrope', 'Noto Sans TC', sans-serif; }
                .scrollbar-hide::-webkit-scrollbar { display: none; }
                .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
    </div>
  );
};
