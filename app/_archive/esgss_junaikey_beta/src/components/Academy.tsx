import React, { useState } from 'react';
import { Language } from '@/types';
import { GraduationCap, BookOpen, Video, Award, Clock, Users, Star } from 'lucide-react';

export const Academy: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeCategory, setActiveCategory] = useState('all');

  const courses = [
    {
      id: 1,
      title: isZh ? 'ESG 基礎入門' : 'ESG Fundamentals',
      description: isZh ? '了解 ESG 的核心概念與重要性' : 'Learn core ESG concepts and importance',
      category: 'beginner',
      duration: '2h 30m',
      lessons: 12,
      students: 1547,
      rating: 4.8,
      progress: 65,
      instructor: isZh ? '張教授' : 'Prof. Zhang',
      thumbnail: '📚',
    },
    {
      id: 2,
      title: isZh ? '碳中和策略規劃' : 'Carbon Neutrality Strategy',
      description: isZh ? '制定企業碳中和路線圖' : 'Develop corporate carbon neutrality roadmap',
      category: 'advanced',
      duration: '4h 15m',
      lessons: 18,
      students: 892,
      rating: 4.9,
      progress: 0,
      instructor: isZh ? '李博士' : 'Dr. Li',
      thumbnail: '🌱',
    },
    {
      id: 3,
      title: isZh ? '永續供應鏈管理' : 'Sustainable Supply Chain',
      description: isZh ? '打造綠色供應鏈體系' : 'Build green supply chain systems',
      category: 'intermediate',
      duration: '3h 45m',
      lessons: 15,
      students: 1203,
      rating: 4.7,
      progress: 30,
      instructor: isZh ? '王經理' : 'Manager Wang',
      thumbnail: '🔗',
    },
    {
      id: 4,
      title: isZh ? 'GRI 報告編寫' : 'GRI Reporting Workshop',
      description: isZh ? '掌握 GRI 標準報告撰寫技巧' : 'Master GRI Standards reporting skills',
      category: 'advanced',
      duration: '5h 00m',
      lessons: 20,
      students: 654,
      rating: 4.9,
      progress: 0,
      instructor: isZh ? '陳顧問' : 'Consultant Chen',
      thumbnail: '📊',
    },
    {
      id: 5,
      title: isZh ? 'ESG 數據分析' : 'ESG Data Analytics',
      description: isZh ? '運用數據驅動 ESG 決策' : 'Data-driven ESG decision making',
      category: 'intermediate',
      duration: '3h 20m',
      lessons: 14,
      students: 987,
      rating: 4.8,
      progress: 100,
      instructor: isZh ? '林工程師' : 'Engineer Lin',
      thumbnail: '📈',
    },
    {
      id: 6,
      title: isZh ? '綠色金融概論' : 'Introduction to Green Finance',
      description: isZh ? '探索永續金融工具與市場' : 'Explore sustainable finance tools',
      category: 'beginner',
      duration: '2h 45m',
      lessons: 11,
      students: 1321,
      rating: 4.6,
      progress: 0,
      instructor: isZh ? '劉經理' : 'Manager Liu',
      thumbnail: '💰',
    },
  ];

  const categories = [
    { id: 'all', label: isZh ? '全部課程' : 'All Courses' },
    { id: 'beginner', label: isZh ? '入門' : 'Beginner' },
    { id: 'intermediate', label: isZh ? '進階' : 'Intermediate' },
    { id: 'advanced', label: isZh ? '專業' : 'Advanced' },
  ];

  const achievements = [
    { name: isZh ? 'ESG 新手' : 'ESG Rookie', icon: '🌟', unlocked: true },
    { name: isZh ? '永續實踐者' : 'Sustainability Practitioner', icon: '🎯', unlocked: true },
    { name: isZh ? '碳中和專家' : 'Carbon Neutral Expert', icon: '🏆', unlocked: false },
  ];

  const filteredCourses =
    activeCategory === 'all' ? courses : courses.filter(c => c.category === activeCategory);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex justify-between items-end border-b border-white/10 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-aqua-400 via-sky-200 to-white tracking-tight flex items-center gap-3">
            <GraduationCap className="text-aqua-400 w-8 h-8 drop-shadow-[0_0_15px_rgba(0,255,255,0.8)]" />
            {isZh
              ? '國際柏克萊大學永續人才培力認證課程'
              : 'Berkeley University Sustainability Certification'}
          </h1>
          <p className="text-aqua-500/60 mt-2 text-xs font-mono uppercase tracking-[0.2em]">
            {isZh
              ? 'Berkeley Academy // 全球永續領袖養成基地'
              : 'Berkeley Academy // Global Sustainability Leadership Hub'}
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-aqua-500/10 rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-aqua-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-white">6</div>
              <div className="text-xs text-slate-400">{isZh ? '進行中課程' : 'Active Courses'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-400">12</div>
              <div className="text-xs text-slate-400">
                {isZh ? '獲得證書' : 'Certificates Earned'}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-sky-400">48</div>
              <div className="text-xs text-slate-400">{isZh ? '學習時數' : 'Learning Hours'}</div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/10 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-2xl font-black text-amber-400">85%</div>
              <div className="text-xs text-slate-400">{isZh ? '平均完成度' : 'Avg Completion'}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-xl font-semibold whitespace-nowrap transition-all ${activeCategory === cat.id
                ? 'bg-aqua-500/10 text-aqua-400 border border-aqua-500/30 shadow-[0_0_10px_rgba(0,255,255,0.2)]'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700 hover:border-aqua-500/20'
              }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCourses.map(course => (
          <div
            key={course.id}
            className="bg-slate-900/50 border border-aqua-500/20 rounded-2xl overflow-hidden hover:border-aqua-500/40 hover:shadow-[0_0_20px_rgba(0,255,255,0.1)] transition-all group backdrop-blur-sm"
          >
            <div className="bg-gradient-to-br from-aqua-900/20 to-sky-900/20 p-6 flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500">
              {course.thumbnail}
            </div>

            <div className="p-5">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${course.category === 'beginner'
                      ? 'bg-emerald-500/10 text-emerald-400'
                      : course.category === 'intermediate'
                        ? 'bg-sky-500/10 text-sky-400'
                        : 'bg-purple-500/10 text-purple-400'
                    }`}
                >
                  {course.category === 'beginner'
                    ? isZh
                      ? '入門'
                      : 'Beginner'
                    : course.category === 'intermediate'
                      ? isZh
                        ? '進階'
                        : 'Intermediate'
                      : isZh
                        ? '專業'
                        : 'Advanced'}
                </span>
                <div className="flex items-center gap-1 text-xs text-amber-400">
                  <Star className="w-3 h-3 fill-current" />
                  {course.rating}
                </div>
              </div>

              <h3 className="text-white font-bold mb-2">{course.title}</h3>
              <p className="text-xs text-slate-400 mb-4 line-clamp-2">{course.description}</p>

              <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {course.duration}
                </span>
                <span className="flex items-center gap-1">
                  <Video className="w-3 h-3" />
                  {course.lessons} {isZh ? '課' : 'lessons'}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {course.students}
                </span>
              </div>

              {course.progress > 0 && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{isZh ? '學習進度' : 'Progress'}</span>
                    <span className="text-purple-400 font-bold">{course.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-aqua-500 to-sky-500 rounded-full transition-all shadow-[0_0_5px_rgba(0,255,255,0.5)]"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                className={`w-full py-2 rounded-xl font-semibold text-sm transition-all ${course.progress === 100
                    ? 'bg-sky-600/20 border border-sky-500/30 text-sky-400'
                    : course.progress > 0
                      ? 'bg-aqua-600/20 border border-aqua-500/30 text-aqua-400 shadow-[0_0_10px_rgba(0,255,255,0.1)]'
                      : 'bg-slate-800/50 border border-slate-700 text-slate-300 hover:bg-aqua-500/10 hover:border-aqua-500/20 hover:text-white'
                  }`}
              >
                {course.progress === 100
                  ? isZh
                    ? '✓ 已完成'
                    : '✓ Completed'
                  : course.progress > 0
                    ? isZh
                      ? '繼續學習'
                      : 'Continue'
                    : isZh
                      ? '開始學習'
                      : 'Start Learning'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          {isZh ? '學習成就' : 'Achievements'}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, i) => (
            <div
              key={i}
              className={`text-center p-4 rounded-xl ${achievement.unlocked
                  ? 'bg-gradient-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20'
                  : 'bg-white/5 border border-white/10 opacity-50'
                }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className="text-xs text-white font-semibold">{achievement.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
