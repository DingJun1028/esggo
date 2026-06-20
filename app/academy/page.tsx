'use client';

import React, { useState } from 'react';
// framer-motion 已移除，改用原生 CSS transition 避免 SSR 崩潰
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
  Filter,
  BarChart3,
  Target,
  Zap,
  Globe,
  ShieldCheck,
  Leaf,
  TrendingUp,
  FileText,
  MessageSquare,
  Download,
  Eye,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';
import { useThemeStore } from '@/lib/theme-store';

/* ─── Types ─── */
interface Course {
  id: string;
  title: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'certification';
  duration: string;
  lessons: number;
  enrolled: number;
  rating: number;
  instructor: string;
  thumbnail: string;
  tags: string[];
  progress?: number;
  completed?: boolean;
  locked?: boolean;
}

interface LearningPath {
  id: string;
  name: string;
  description: string;
  courses: string[];
  totalDuration: string;
  badge: string;
}

/* ─── Mock Data ─── */
const COURSES: Course[] = [
  {
    id: 'course-001',
    title: 'ESG 基礎入門',
    description: '了解 ESG 的核心概念、發展趨勢與國際框架。適合初學者建立完整知識體系。',
    category: 'beginner',
    duration: '4 小時',
    lessons: 12,
    enrolled: 1247,
    rating: 4.8,
    instructor: 'Dr. Chen',
    thumbnail: '🌱',
    tags: ['ESG 基礎', 'GRI 框架', '永續發展'],
    progress: 75,
  },
  {
    id: 'course-002',
    title: '碳盤查實務操作',
    description: '從 Scope 1 到 Scope 3，完整掌握碳盤查的計算方法與數據收集技巧。',
    category: 'intermediate',
    duration: '6 小時',
    lessons: 18,
    enrolled: 856,
    rating: 4.9,
    instructor: 'Prof. Wang',
    thumbnail: '🔢',
    tags: ['碳盤查', 'ISO 14064', '數據管理'],
    progress: 30,
  },
  {
    id: 'course-003',
    title: 'GRI G4 報告撰寫',
    description: '深入學習 GRI G4 標準，掌握永續報告書的撰寫技巧與最佳實踐。',
    category: 'intermediate',
    duration: '8 小時',
    lessons: 24,
    enrolled: 634,
    rating: 4.7,
    instructor: 'Dr. Lin',
    thumbnail: '📊',
    tags: ['GRI', '報告撰寫', 'TCFD'],
  },
  {
    id: 'course-004',
    title: '5T 協議與 ZKP 驗證',
    description: '理解 5T 誠信協議的技術實現，學習零知識證明在 ESG 數據驗證中的應用。',
    category: 'advanced',
    duration: '10 小時',
    lessons: 30,
    enrolled: 312,
    rating: 4.9,
    instructor: 'Dr. Zhang',
    thumbnail: '🛡️',
    tags: ['5T 協議', 'ZKP', '區塊鏈'],
  },
  {
    id: 'course-005',
    title: '供應鏈風險管理',
    description: '使用 War Room 工具進行供應鏈風險分析，制定有效的風險緩解策略。',
    category: 'advanced',
    duration: '6 小時',
    lessons: 15,
    enrolled: 423,
    rating: 4.6,
    instructor: 'Prof. Liu',
    thumbnail: '🔗',
    tags: ['供應鏈', '風險管理', 'PESTEL'],
  },
  {
    id: 'course-006',
    title: '柏克萊 ESG 認證班',
    description: '完成課程後可獲得 Berkeley Haas 與 TSISDA 聯合認證。',
    category: 'certification',
    duration: '40 小時',
    lessons: 120,
    enrolled: 156,
    rating: 5.0,
    instructor: 'Berkeley Faculty',
    thumbnail: '🏆',
    tags: ['認證', 'Berkeley', 'TSISDA'],
    locked: true,
  },
];

const LEARNING_PATHS: LearningPath[] = [
  {
    id: 'path-001',
    name: 'ESG 分析師之路',
    description: '從零開始，成為專業 ESG 分析師',
    courses: ['course-001', 'course-002', 'course-003'],
    totalDuration: '18 小時',
    badge: '📊',
  },
  {
    id: 'path-002',
    name: '碳管理專家',
    description: '專精碳盤查與減排策略',
    courses: ['course-002', 'course-004', 'course-005'],
    totalDuration: '22 小時',
    badge: '🌍',
  },
  {
    id: 'path-003',
    name: '永續報告專家',
    description: '掌握各類永續報告框架',
    courses: ['course-001', 'course-003', 'course-006'],
    totalDuration: '52 小時',
    badge: '📜',
  },
];

const CATEGORY_CONFIG = {
  beginner: { label: '初級', color: 'bg-emerald-50 text-emerald-600', icon: '🌱' },
  intermediate: { label: '中級', color: 'bg-blue-50 text-blue-600', icon: '📈' },
  advanced: { label: '高級', color: 'bg-violet-50 text-violet-600', icon: '🚀' },
  certification: { label: '認證', color: 'bg-amber-50 text-amber-600', icon: '🏆' },
};

/* ─── Components ─── */

function CourseCard({ course }: { course: Course }) {
  const catConfig = CATEGORY_CONFIG[course.category];
  const { omniTheme } = useThemeStore();

  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
      className={cn(
        'rounded-2xl border overflow-hidden hover:shadow-lg transition-all cursor-pointer group relative',
        course.locked ? 'opacity-75' : '',
        omniTheme === 'omnicore'
          ? 'bg-[var(--theme-surface)] border-[var(--theme-border)] shadow-[0_0_15px_rgba(0,0,0,0.3)]'
          : 'bg-white border-slate-100',
        course.locked && omniTheme !== 'omnicore' && 'border-slate-200'
      )}
    >
      {/* Thumbnail */}
      <div
        className={cn(
          'h-32 flex items-center justify-center text-5xl relative',
          course.locked 
            ? (omniTheme === 'omnicore' ? 'bg-white/5' : 'bg-slate-100')
            : (omniTheme === 'omnicore' ? 'bg-gradient-to-br from-cyan-900/30 to-blue-900/30' : 'bg-gradient-to-br from-cyan-50 to-blue-50')
        )}
      >
        {course.thumbnail}
        {course.locked && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <Lock size={32} className="text-slate-400" />
          </div>
        )}
        {course.completed && (
          <div className="absolute top-2 right-2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
            <CheckCircle2 size={16} className="text-white" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <Badge variant="secondary" size="xs">
            {catConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className={cn("text-sm font-bold mb-1 line-clamp-1", omniTheme === 'omnicore' ? 'text-cyan-400' : 'text-[#003262]')}>{course.title}</h3>
        <p className={cn("text-[10px] line-clamp-2 mb-3", omniTheme === 'omnicore' ? 'text-[var(--theme-text-muted)]' : 'text-slate-400')}>{course.description}</p>

        {/* Progress */}
        {course.progress !== undefined && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-[10px] mb-1">
              <span className="text-slate-400">進度</span>
              <span className="font-mono font-bold text-[#003262]">{course.progress}%</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              {/* 使用原生 div 取代 motion.div，避免 SSR 崩潰 */}
              <div
                style={{ width: `${course.progress}%`, transition: 'width 0.8s ease' }}
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
              />
            </div>
          </div>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[10px] text-slate-400">
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
            <span className="font-bold text-slate-600">{course.rating}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {course.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function LearningPathCard({ path }: { path: LearningPath }) {
  const { omniTheme } = useThemeStore();

  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
      className={cn(
        "rounded-xl border p-4 hover:shadow-md transition-all cursor-pointer",
        omniTheme === 'omnicore'
          ? 'bg-[var(--theme-surface)] border-[var(--theme-border)] shadow-[0_0_15px_rgba(0,0,0,0.3)]'
          : 'bg-white border-slate-100'
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center text-2xl">
          {path.badge}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={cn("text-sm font-bold", omniTheme === 'omnicore' ? 'text-cyan-400' : 'text-[#003262]')}>{path.name}</h4>
          <p className={cn("text-[10px]", omniTheme === 'omnicore' ? 'text-[var(--theme-text-muted)]' : 'text-slate-400')}>{path.description}</p>
        </div>
        <ChevronRight size={16} className="text-slate-300" />
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>{path.courses.length} 門課程</span>
        <span className="flex items-center gap-1">
          <Clock size={10} />
          {path.totalDuration}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AcademyPage() {
  const { omniTheme } = useThemeStore();
  const [activeTab, setActiveTab] = useState<'courses' | 'paths' | 'my-learning'>('courses');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCourses = COURSES.filter((course) => {
    if (filterCategory !== 'all' && course.category !== filterCategory) return false;
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false;
    return true;
  });

  const myCourses = COURSES.filter((c) => c.progress !== undefined);
  const completedCourses = COURSES.filter((c) => c.completed);

  return (
    <div className={cn(
      "min-h-screen p-4 md:p-8 transition-colors duration-500",
      omniTheme === 'omnicore' ? 'bg-[var(--theme-base)] text-[var(--theme-text)]' : 'bg-[#F8FAFC]'
    )}>
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className={cn(
          "rounded-2xl border p-6 relative overflow-hidden transition-colors",
          omniTheme === 'omnicore' 
            ? 'bg-[var(--theme-surface)] border-[var(--theme-border)] shadow-[0_0_25px_rgba(0,0,0,0.5)]' 
            : 'bg-white border-slate-100'
        )}>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl breathing-glow-emerald" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg breathing-glow-emerald">
                <GraduationCap size={28} className="text-white" />
              </div>
              <div>
                <h1 className={cn("text-2xl font-black tracking-tight", omniTheme === 'omnicore' ? 'text-cyan-400 drop-shadow-[0_0_10px_rgba(99,166,176,0.8)]' : 'text-[#003262]')}>善向永續學院</h1>
                <p className={cn("text-xs font-mono mt-0.5", omniTheme === 'omnicore' ? 'text-[var(--theme-text-muted)]' : 'text-slate-400')}>
                  Academy · 互動學習 · 柏克萊認證
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">{myCourses.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">進行中</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-emerald-600">{completedCourses.length}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">已完成</p>
              </div>
              <div className="w-px h-10 bg-slate-100" />
              <div className="text-right">
                <p className="text-2xl font-black text-[#003262]">Lv.8</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">學習等級</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'courses' as const, label: '全部課程', icon: BookOpen, count: COURSES.length },
            { id: 'paths' as const, label: '學習路徑', icon: Target, count: LEARNING_PATHS.length },
            { id: 'my-learning' as const, label: '我的學習', icon: Award, count: myCourses.length },
          ].map((tab) => (
              <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? (omniTheme === 'omnicore' ? 'bg-cyan-900 text-cyan-50 shadow-[0_0_15px_rgba(99,166,176,0.6)]' : 'bg-[#003262] text-white shadow-md')
                  : (omniTheme === 'omnicore' ? 'bg-[var(--theme-surface)] text-[var(--theme-text-muted)] border-[var(--theme-border)] hover:bg-white/5' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50')
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              <span
                className={cn(
                  'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'courses' && (
          <div className="space-y-4">
            {/* Search & Filter */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜尋課程或標籤..."
                  className={cn(
                    "w-full pl-9 pr-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/30 transition-colors",
                    omniTheme === 'omnicore' 
                      ? 'bg-[var(--theme-surface)] border-[var(--theme-border)] text-white placeholder-slate-500' 
                      : 'bg-white border-slate-200 text-slate-900'
                  )}
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
                    onClick={() => setFilterCategory(cat.id)}
                    className={cn(
                      'px-3 py-1.5 rounded-lg text-xs font-bold transition-all',
                      filterCategory === cat.id
                        ? 'bg-[#003262] text-white'
                        : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                    )}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Course Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>

            {filteredCourses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen size={48} className="mx-auto mb-4 text-slate-200" />
                <p className="text-sm text-slate-400">沒有找到符合條件的課程</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'paths' && (
          <div className="space-y-4">
            <div>
              <h3 className={cn("text-base font-bold mb-1", omniTheme === 'omnicore' ? 'text-cyan-400' : 'text-[#003262]')}>學習路徑</h3>
              <p className={cn("text-xs", omniTheme === 'omnicore' ? 'text-[var(--theme-text-muted)]' : 'text-slate-400')}>按照推薦路徑學習，獲得專業認證</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {LEARNING_PATHS.map((path) => (
                <LearningPathCard key={path.id} path={path} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'my-learning' && (
          <div className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-cyan-50 rounded-lg">
                    <BarChart3 size={16} className="text-cyan-600" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#003262]">{myCourses.length}</p>
                    <p className="text-[10px] text-slate-400">進行中課程</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <Award size={16} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#003262]">{completedCourses.length}</p>
                    <p className="text-[10px] text-slate-400">已完成課程</p>
                  </div>
                </div>
              </Card>
              <Card className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-amber-50 rounded-lg">
                    <Zap size={16} className="text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xl font-black text-[#003262]">1,250</p>
                    <p className="text-[10px] text-slate-400">學習積分</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* My Courses */}
            <div>
              <h3 className="text-base font-bold text-[#003262] mb-4">進行中的課程</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
