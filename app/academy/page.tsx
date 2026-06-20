// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge, SectionHeader } from '@/components/ui/v2/Input';
import { Progress } from '@/components/ui/v2/Progress';
import {
  GraduationCap,
  BookOpen,
  Play,
  Clock,
  Users,
  Star,
  Award,
  CheckCircle2,
  Lock,
  ChevronRight,
  Search,
  Target,
} from 'lucide-react';

const COURSES = [
  {
    id: 'c1',
    title: 'ESG 基礎入門',
    desc: '了解 ESG 的核心概念、發展趨勢與國際框架。',
    category: 'beginner',
    duration: '4 小時',
    lessons: 12,
    enrolled: 1247,
    rating: 4.8,
    instructor: 'Dr. Chen',
    thumbnail: '🌱',
    tags: ['ESG 基礎', 'GRI 框架'],
    progress: 75,
  },
  {
    id: 'c2',
    title: '碳盤查實務操作',
    desc: '從 Scope 1 到 Scope 3，完整掌握碳盤查的計算方法。',
    category: 'intermediate',
    duration: '6 小時',
    lessons: 18,
    enrolled: 856,
    rating: 4.9,
    instructor: 'Prof. Wang',
    thumbnail: '🔢',
    tags: ['碳盤查', 'ISO 14064'],
    progress: 30,
  },
  {
    id: 'c3',
    title: 'GRI G4 報告撰寫',
    desc: '深入學習 GRI G4 標準，掌握永續報告書的撰寫技巧。',
    category: 'intermediate',
    duration: '8 小時',
    lessons: 24,
    enrolled: 634,
    rating: 4.7,
    instructor: 'Dr. Lin',
    thumbnail: '📊',
    tags: ['GRI', '報告撰寫'],
  },
  {
    id: 'c4',
    title: '5T 協議與 ZKP 驗證',
    desc: '理解 5T 誠信協議的技術實現，學習零知識證明應用。',
    category: 'advanced',
    duration: '10 小時',
    lessons: 30,
    enrolled: 312,
    rating: 4.9,
    instructor: 'Dr. Zhang',
    thumbnail: '🛡️',
    tags: ['5T 協議', 'ZKP'],
  },
  {
    id: 'c5',
    title: '供應鏈風險管理',
    desc: '使用 War Room 工具進行供應鏈風險分析。',
    category: 'advanced',
    duration: '6 小時',
    lessons: 15,
    enrolled: 423,
    rating: 4.6,
    instructor: 'Prof. Liu',
    thumbnail: '🔗',
    tags: ['供應鏈', '風險管理'],
  },
  {
    id: 'c6',
    title: '柏克萊 ESG 認證班',
    desc: '完成課程後可獲得 Berkeley Haas 與 TSISDA 聯合認證。',
    category: 'certification',
    duration: '40 小時',
    lessons: 120,
    enrolled: 156,
    rating: 5.0,
    instructor: 'Berkeley Faculty',
    thumbnail: '🏆',
    tags: ['認證', 'Berkeley'],
    locked: true,
  },
];

const PATHS = [
  {
    id: 'p1',
    name: 'ESG 分析師之路',
    desc: '從零開始，成為專業 ESG 分析師',
    courses: 3,
    duration: '18 小時',
    badge: '📊',
  },
  {
    id: 'p2',
    name: '碳管理專家',
    desc: '專精碳盤查與減排策略',
    courses: 3,
    duration: '22 小時',
    badge: '🌍',
  },
  {
    id: 'p3',
    name: '永續報告專家',
    desc: '掌握各類永續報告框架',
    courses: 3,
    duration: '52 小時',
    badge: '📜',
  },
];

const CAT_CFG: Record<string, { label: string; color: string }> = {
  beginner: { label: '初級', color: 'bg-blue-50 text-blue-700' },
  intermediate: { label: '中級', color: 'bg-amber-50 text-amber-700' },
  advanced: { label: '高級', color: 'bg-neutral-100 text-neutral-700' },
  certification: { label: '認證', color: 'bg-amber-400 text-white' },
};

export default function AcademyPage() {
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'my-learning'>('courses');
  const [filterCat, setFilterCat] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = COURSES.filter((c) => {
    if (filterCat !== 'all' && c.category !== filterCat) return false;
    if (
      searchQuery &&
      !c.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !c.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false;
    return true;
  });
  const myCourses = COURSES.filter((c) => c.progress !== undefined);

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <header className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-700 flex items-center justify-center shadow-lg">
              <GraduationCap size={28} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-neutral-900 tracking-tight">善向永續學院</h1>
              <p className="text-xs text-neutral-400 font-mono mt-0.5">
                Academy · 互動學習 · 柏克萊認證
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-2xl font-black text-neutral-900">{myCourses.length}</p>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">進行中</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-right">
              <p className="text-2xl font-black text-amber-500">0</p>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">已完成</p>
            </div>
            <div className="w-px h-8 bg-neutral-200" />
            <div className="text-right">
              <p className="text-2xl font-black text-neutral-900">Lv.8</p>
              <p className="text-[10px] text-neutral-400 font-bold uppercase">學習等級</p>
            </div>
          </div>
        </header>

        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'courses' as const, label: '全部課程', icon: BookOpen, count: COURSES.length },
            { id: 'paths' as const, label: '學習路徑', icon: Target, count: PATHS.length },
            { id: 'my-learning' as const, label: '我的學習', icon: Award, count: myCourses.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id
                  ? 'bg-neutral-900 text-white shadow-md'
                  : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
              <span
                className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white'
                    : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'courses' && (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="搜尋課程或標籤..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 border border-neutral-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-neutral-200"
                />
              </div>
              <div className="flex gap-2">
                {[
                  { id: 'all', label: '全部' },
                  { id: 'beginner', label: '初級' },
                  { id: 'intermediate', label: '中級' },
                  { id: 'advanced', label: '高級' },
                  { id: 'certification', label: '認證' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCat(cat.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      filterCat === cat.id
                        ? 'bg-neutral-900 text-white'
                        : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-50'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((course) => {
                const cat = CAT_CFG[course.category] || CAT_CFG.beginner;
                return (
                  <Card
                    key={course.id}
                    variant="default"
                    padding="none"
                    hover
                    className={`overflow-hidden ${course.locked ? 'opacity-70' : ''}`}
                  >
                    <div
                      className={`h-28 flex items-center justify-center text-4xl relative ${
                        course.locked ? 'bg-neutral-100' : 'bg-neutral-50'
                      }`}
                    >
                      {course.thumbnail}
                      {course.locked && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <Lock size={24} className="text-neutral-400" />
                        </div>
                      )}
                      <div className="absolute top-2 left-2">
                        <Badge
                          variant={
                            course.category === 'beginner'
                              ? 'info'
                              : course.category === 'certification'
                              ? 'warning'
                              : 'neutral'
                          }
                          size="sm"
                        >
                          {cat.label}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-sm font-bold text-neutral-900 mb-1">{course.title}</h3>
                      <p className="text-[10px] text-neutral-400 line-clamp-2 mb-3">
                        {course.desc}
                      </p>
                      {course.progress !== undefined && (
                        <div className="mb-3">
                          <div className="flex items-center justify-between text-[10px] mb-1">
                            <span className="text-neutral-400">進度</span>
                            <span className="font-mono font-bold text-neutral-900">
                              {course.progress}%
                            </span>
                          </div>
                          <Progress value={course.progress} size="xs" color="auto" />
                        </div>
                      )}
                      <div className="flex items-center justify-between text-[10px] text-neutral-400">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center gap-0.5">
                            <Clock size={10} />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-0.5">
                            <Play size={10} />
                            {course.lessons} 課
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={10} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold text-neutral-600">{course.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'paths' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {PATHS.map((path) => (
              <Card key={path.id} variant="default" padding="md" hover>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-2xl">
                    {path.badge}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-neutral-900">{path.name}</h4>
                    <p className="text-[10px] text-neutral-400">{path.desc}</p>
                  </div>
                  <ChevronRight size={16} className="text-neutral-300" />
                </div>
                <div className="flex items-center justify-between text-[10px] text-neutral-400">
                  <span>{path.courses} 門課程</span>
                  <span className="flex items-center gap-1">
                    <Clock size={10} />
                    {path.duration}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {activeTab === 'my-learning' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {myCourses.map((course) => (
              <Card key={course.id} variant="default" padding="md" hover>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-xl">
                    {course.thumbnail}
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-neutral-900">{course.title}</h4>
                    <p className="text-[10px] text-neutral-400">{course.instructor}</p>
                  </div>
                </div>
                <Progress value={course.progress || 0} size="sm" color="auto" />
                <p className="text-[10px] text-neutral-400 mt-2 text-right">
                  {course.progress}% 完成
                </p>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
