import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Star, Award, Book, Lightbulb, PlayCircle, Map, Sparkles, Activity } from 'lucide-react';
import { OmniBoundary } from '../ui';

export const Academy: React.FC = () => {
  const courses = [
    { id: 'c1', title: 'ESG 永續核心基礎 (Fundamentals)', xp: 500, progress: 100, status: '已完成' },
    {
      id: 'c2',
      title: '大師級碳盤查實務 (Masterclass)',
      xp: 1200,
      progress: 45,
      status: '學習中',
    },
    { id: 'c3', title: '循環經濟設計思考 (Circular)', xp: 800, progress: 0, status: '未解鎖' },
  ];

  return (
    <div className="h-full w-full bg-[#050c0c] text-white overflow-hidden flex flex-col relative">
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none" />

      {/* Header Context */}
      <div className="p-8 pb-0 z-10">
        <div className="flex justify-between items-end mb-8 border-b border-amber-500/10 pb-6">
          <div className="space-y-1">
            <h2 className="text-3xl font-black text-amber-100 flex items-center gap-3 tracking-tighter">
              <GraduationCap className="text-amber-400" size={36} />
              善向永續學院 (Goodward Academy)
            </h2>
            <p className="text-amber-400/50 font-mono text-[10px] tracking-[0.2em] uppercase">
              EMPOWERING CORPORATE SOVEREIGNTY THROUGH KNOWLEDGE / 知識賦能
            </p>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-1">
              目前累積經驗值 (TOTAL XP)
            </div>
            <div className="text-4xl font-black text-cyan-400 tracking-tighter">1,750</div>
          </div>
        </div>
      </div>

      {/* Main Content - Star Map Style */}
      <div className="flex-1 relative overflow-y-auto p-8 pt-0 custom-scrollbar">
        {/* Hero Banner: Immersive Portal */}
        <div className="rounded-[2.5rem] bg-gradient-to-br from-amber-900/40 via-slate-900 to-[#050c0c] border border-amber-500/20 p-10 mb-12 relative overflow-hidden group">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-amber-500/10 blur-[120px] rounded-full group-hover:bg-amber-500/20 transition-all duration-1000" />
          <div className="absolute left-10 top-10 text-amber-500/10 scale-[5] -z-10 rotate-12">
            <Map size={100} />
          </div>

          <div className="relative z-10 max-w-2xl">
            <div className="flex items-center gap-2 text-amber-400 font-black text-xs mb-4 tracking-widest">
              <Sparkles className="animate-pulse" size={16} /> 精選課程 (FEATURED)
            </div>
            <h3 className="text-4xl font-black mb-6 tracking-tight">邁向淨零路徑：戰略與執行方案</h3>
            <p className="text-slate-400 mb-8 leading-relaxed italic text-sm">
              「學習如何遵循 SBTi 標準建立脫碳藍圖。從零開始，將抽象的ESG 目標轉化為可執行的階段性計畫。」
            </p>
            <button className="bg-amber-500 hover:bg-amber-400 hover:scale-105 active:scale-95 text-black font-black px-10 py-4 rounded-full flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <PlayCircle size={24} /> 繼續學習 (Resume)
            </button>
          </div>
        </div>

        {/* Course Grid: Milestone Nodes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {courses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className={`p-8 rounded-3xl border ${course.status === '未解鎖'
                ? 'border-white/5 bg-white/2 opacity-40 grayscale'
                : 'border-white/10 bg-[#0a0f0f]/60 hover:border-cyan-500/40 hover:bg-slate-900/80'
                } transition-all relative overflow-hidden group cursor-pointer`}
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-4 rounded-2xl ${course.status === '已完成' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'}`}
                >
                  {course.status === '已完成' ? <Award size={24} /> : <Book size={24} />}
                </div>
                <div className="text-[10px] font-mono text-slate-500 font-bold bg-white/5 px-3 py-1 rounded-full">
                  XP +{course.xp}
                </div>
              </div>

              <h4 className="text-xl font-black mb-6 tracking-tight group-hover:text-cyan-400 transition-colors">
                {course.title}
              </h4>

              {/* Progress Bar */}
              <div className="space-y-3">
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${course.status === '已完成' ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' : 'bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    transition={{ duration: 1.5, ease: "circOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>{course.status}</span>
                  <span className={course.status === '已完成' ? 'text-emerald-400' : 'text-cyan-400'}>
                    {course.progress}%
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Knowledge Star Map Visualization (OmniBrain) */}
        <div className="p-10 rounded-[3rem] bg-gradient-to-b from-slate-900/50 to-transparent border border-white/5 relative min-h-[500px] overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <Lightbulb className="text-amber-400" size={24} />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">認知知識星圖 (Knowledge Star Map)</h3>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">
                  Live Neural Growth Mapping // 實時神經增長映射
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
              <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Active Correlating</span>
            </div>
          </div>

          <div className="relative h-[350px] w-full border border-white/5 rounded-[2rem] bg-black/40 overflow-hidden flex items-center justify-center">
            {/* Star Field Effect */}
            <div className="absolute inset-0 bg-[url('/stars-pattern.svg')] opacity-20" />

            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
              <line x1="30%" y1="50%" x2="50%" y2="30%" stroke="cyan" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50%" y1="30%" x2="70%" y2="50%" stroke="cyan" strokeWidth="0.5" strokeDasharray="4 4" />
              <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="amber" strokeWidth="0.5" strokeDasharray="4 4" />
            </svg>

            <div className="relative z-10 flex items-center justify-around w-full max-w-4xl">
              <motion.div
                className="group flex flex-col items-center gap-3"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="size-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Book className="text-cyan-400" size={24} />
                </div>
                <div className="text-[10px] text-cyan-400 font-black uppercase">課程項目 (Course)</div>
                <div className="text-sm font-bold">碳管理實務</div>
              </motion.div>

              <motion.div
                className="group flex flex-col items-center gap-4"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="size-28 rounded-full bg-amber-500/20 border-2 border-amber-500 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(245,158,11,0.2)] backdrop-blur-xl group-hover:shadow-[0_0_60px_rgba(245,158,11,0.4)] transition-all">
                  <Star className="fill-amber-400 text-amber-400 mb-1" size={24} />
                  <div className="text-[9px] font-black text-amber-200 uppercase tracking-tighter">核心概念</div>
                  <div className="text-lg font-black text-white">碳排放</div>
                </div>
              </motion.div>

              <motion.div
                className="group flex flex-col items-center gap-3"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              >
                <div className="size-16 rounded-2xl bg-rose-500/10 border border-rose-500/40 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
                  <Activity className="text-rose-400" size={24} />
                </div>
                <div className="text-[10px] text-rose-400 font-black uppercase">市場動態 (Market)</div>
                <div className="text-sm font-bold">碳稅政策</div>
              </motion.div>
            </div>
          </div>

          <div className="mt-8 text-center space-y-2">
            <p className="text-slate-400 text-sm italic font-medium">
              「OmniBrain 正將您的學習路徑與即時市場因素進行交叉關聯，校準您的專業定位。」
            </p>
            <p className="text-[9px] text-slate-600 font-mono tracking-widest uppercase">
              Neuro-Sync Protocol v8.2 Activated
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
