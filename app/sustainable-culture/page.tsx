'use client';

import React, { useState } from 'react';

import {
  Heart,
  Users,
  Lightbulb,
  Award,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  Target,
  Globe,
  Leaf,
  Zap,
  Clock,
  Star,
  BarChart3,
  ShieldCheck,
  TrendingUp,
  MessageSquare,
  GraduationCap,
  Recycle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Data ─── */
const CULTURE_ELEMENTS = [
  {
    id: 'elem-01',
    title: '價值觀重塑',
    subtitle: 'Values Reshaping',
    description: '將永續發展理念融入企業核心價值觀，從「獲利至上」轉向「永續共榮」。',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    actions: ['高層承諾宣言', '永續價值觀工作坊', '企業使命更新', '員工價值觀調查'],
    impact: '員工認同度 +45%',
  },
  {
    id: 'elem-02',
    title: '行為改變',
    subtitle: 'Behavior Change',
    description: '通過激勵機制和培訓計劃，改變員工的日常行為，養成永續習慣。',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    actions: ['ESG 培訓計劃', '綠色行為獎勵', '永續 KPI 設定', '部門競賽機制'],
    impact: '員工參與率 95%',
  },
  {
    id: 'elem-03',
    title: '知識傳承',
    subtitle: 'Knowledge Transfer',
    description: '建立永續知識庫，通過培訓和分享，確保永續知識在組織內傳承。',
    icon: GraduationCap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    actions: ['ESG 知識庫建設', '內部講師培養', '跨部門學習社群', '最佳實踐分享'],
    impact: '培訓完成率 100%',
  },
  {
    id: 'elem-04',
    title: '創新文化',
    subtitle: 'Innovation Culture',
    description: '鼓勵員工提出永續創新想法，建立創新實驗機制，推動 ESG 技術創新。',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    actions: ['創新提案機制', 'ESG 黑客松', '創新基金支持', '專利申請輔導'],
    impact: '創新項目 10+',
  },
];

const ENGAGEMENT_STATS = [
  {
    label: '員工參與率',
    value: '95%',
    description: 'ESG 活動參與',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    label: '培訓完成率',
    value: '100%',
    description: 'ESG 培訓',
    icon: GraduationCap,
    color: 'text-violet-600',
  },
  {
    label: '創新提案',
    value: '120+',
    description: '件/年',
    icon: Lightbulb,
    color: 'text-amber-600',
  },
  { label: '滿意度', value: '4.8/5', description: '員工滿意', icon: Star, color: 'text-rose-600' },
];

const CULTURE_ROADMAP = [
  {
    phase: 'Phase 1',
    title: '覺醒期',
    period: 'Month 1-3',
    description: '高層承諾、員工意識覺醒、價值觀重塑',
    status: 'completed',
  },
  {
    phase: 'Phase 2',
    title: '學習期',
    period: 'Month 4-6',
    description: '全面培訓、知識傳承、行為改變',
    status: 'completed',
  },
  {
    phase: 'Phase 3',
    title: '實踐期',
    period: 'Month 7-9',
    description: '創新實踐、流程優化、文化落地',
    status: 'in_progress',
  },
  {
    phase: 'Phase 4',
    title: '成熟期',
    period: 'Month 10-12',
    description: '文化固化、持續改進、對外影響',
    status: 'pending',
  },
];

const EMPLOYEE_QUOTES = [
  {
    quote: '「ESG 已經成為我們日常工作的文化，不只是額外的工作，而是我們做事的方式。」',
    author: '王經理',
    role: '人資部門',
    avatar: '👔',
  },
  {
    quote: '「公司提供的 ESG 培訓讓我對永續發展有了全新的認識，我也開始在生活中實踐。」',
    author: '李工程師',
    role: '技術部門',
    avatar: '🔧',
  },
  {
    quote: '「創新提案機制讓我有機會為公司的永續發展貢獻創意，這種參與感很棒。」',
    author: '張設計師',
    role: '設計部門',
    avatar: '🎨',
  },
];

const GREEN_ACTIONS = [
  { action: '無紙化辦公', impact: '減少紙張使用 80%', icon: '📄' },
  { action: '綠色通勤', impact: '減少碳排 15%', icon: '🚲' },
  { action: '節能減碳', impact: '減少能源消耗 25%', icon: '💡' },
  { action: '垃圾分類', impact: '資源回收率 90%', icon: '♻️' },
  { action: '綠色採購', impact: '環保產品採購 70%', icon: '🛒' },
  { action: '志工活動', impact: '員工參與 85%', icon: '🤝' },
];

function CultureElementCard({
  element,
  index,
}: {
  element: (typeof CULTURE_ELEMENTS)[0];
  index: number;
}) {
  const Icon = element.icon;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn('w-12 h-12 rounded-xl flex items-center justify-center', element.bgColor)}
        >
          <Icon size={24} className={element.color} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#003262]">{element.title}</h3>
          <p className="text-[10px] text-slate-400">{element.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{element.description}</p>
      <div className="space-y-2 mb-4">
        {element.actions.map((action, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
            <span className="text-xs text-slate-600">{action}</span>
          </div>
        ))}
      </div>
      <div className={cn('rounded-lg p-2 text-center', element.bgColor)}>
        <span className={cn('text-sm font-bold', element.color)}>{element.impact}</span>
      </div>
    </div>
  );
}

function RoadmapPhase({ phase, index }: { phase: (typeof CULTURE_ROADMAP)[0]; index: number }) {
  const statusConfig = {
    completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    in_progress: { label: '進行中', color: 'bg-amber-50 text-amber-600', icon: Zap },
    pending: { label: '待開始', color: 'bg-slate-50 text-slate-400', icon: Clock },
  };
  const config = statusConfig[phase.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <div
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            config.color.split(' ')[0]
          )}
        >
          <StatusIcon size={18} className={config.color.split(' ')[1]} />
        </div>
        {index < CULTURE_ROADMAP.length - 1 && <div className="w-0.5 h-12 bg-slate-200 mt-2" />}
      </div>
      <div className="flex-1 pb-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-slate-400">{phase.phase}</span>
          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', config.color)}>
            {config.label}
          </span>
        </div>
        <h4 className="text-sm font-bold text-[#003262] mb-0.5">{phase.title}</h4>
        <p className="text-[10px] text-slate-400 mb-1">{phase.period}</p>
        <p className="text-xs text-slate-500">{phase.description}</p>
      </div>
    </div>
  );
}

export default function SustainableCulturePage() {
  const [activeTab, setActiveTab] = useState<'elements' | 'roadmap' | 'actions'>('elements');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-rose-50 rounded-full blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center shadow-lg">
                <Heart size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">永續文化</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Sustainable Culture · 組織覺醒 · 行為改變
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              永續文化是企業 ESG 轉型的最高境界。當永續理念深入企業 DNA，
              成為每個員工的自覺行為，企業才能真正實現永續發展目標。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ENGAGEMENT_STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">{stat.description}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'elements' as const,
              label: '文化要素',
              icon: Heart,
              count: CULTURE_ELEMENTS.length,
            },
            {
              id: 'roadmap' as const,
              label: '轉型路線圖',
              icon: Target,
              count: CULTURE_ROADMAP.length,
            },
            { id: 'actions' as const, label: '綠色行動', icon: Leaf, count: GREEN_ACTIONS.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center',
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  )}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            
              {activeTab === 'elements' && (
                <div
                  key="elements"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">四大文化要素</h2>
                    <p className="text-xs text-slate-400">建立永續文化的核心要素</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CULTURE_ELEMENTS.map((element, i) => (
                      <CultureElementCard key={element.id} element={element} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'roadmap' && (
                <div
                  key="roadmap"
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Target size={14} className="text-rose-500" />
                      文化轉型路線圖
                    </h3>
                    <div className="space-y-2">
                      {CULTURE_ROADMAP.map((phase, i) => (
                        <RoadmapPhase key={i} phase={phase} index={i} />
                      ))}
                    </div>
                  </OmniBaseCard>
                </div>
              )}

              {activeTab === 'actions' && (
                <div
                  key="actions"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">綠色行動</h2>
                    <p className="text-xs text-slate-400">員工日常永續行動與影響</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GREEN_ACTIONS.map((action, i) => (
                      <OmniBaseCard key={i} className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{action.icon}</span>
                          <div>
                            <h4 className="text-sm font-bold text-[#003262]">{action.action}</h4>
                            <p className="text-xs text-emerald-600 font-medium">{action.impact}</p>
                          </div>
                        </div>
                      </OmniBaseCard>
                    ))}
                  </div>
                </div>
              )}
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Culture Score */}
            <OmniBaseCard className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <div className="text-center">
                <Heart size={32} className="mx-auto mb-2 text-rose-600" />
                <p className="text-3xl font-black text-[#003262]">92</p>
                <p className="text-xs text-slate-500 font-medium">永續文化評分</p>
                <p className="text-[9px] text-slate-400 mt-1">基於 4 大要素綜合評估</p>
              </div>
            </OmniBaseCard>

            {/* Employee Quotes */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">員工心聲</h3>
              <div className="space-y-3">
                {EMPLOYEE_QUOTES.map((quote, i) => (
                  <div key={i} className="bg-slate-50 rounded-lg p-3">
                    <p className="text-[11px] text-slate-600 italic mb-2">"{quote.quote}"</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{quote.avatar}</span>
                      <div>
                        <p className="text-[10px] font-medium text-[#003262]">{quote.author}</p>
                        <p className="text-[9px] text-slate-400">{quote.role}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            {/* CTA */}
            <OmniBaseCard className="p-4 bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">建立永續文化</h3>
              <p className="text-[11px] text-slate-500 mb-3">
                從價值觀重塑開始，打造永續發展企業文化
              </p>
              <OmniButton
                variant="primary"
                size="sm"
                className="w-full bg-rose-600 hover:bg-rose-700 text-white"
              >
                開始文化轉型
              </OmniButton>
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
