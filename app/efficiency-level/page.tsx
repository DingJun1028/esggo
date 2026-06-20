'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  Zap,
  Clock,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  BarChart3,
  FileText,
  Upload,
  Brain,
  ShieldCheck,
  Target,
  Star,
  Play,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface EfficiencyMetric {
  id: string;
  title: string;
  before: string;
  after: string;
  improvement: string;
  icon: LucideIcon;
  color: string;
}

interface DayMilestone {
  day: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  completed: boolean;
}

/* ─── Data ─── */
const EFFICIENCY_METRICS: EfficiencyMetric[] = [
  {
    id: 'metric-01',
    title: '數據收集時間',
    before: '3 天',
    after: '30 分鐘',
    improvement: '98%',
    icon: Upload,
    color: 'text-blue-600',
  },
  {
    id: 'metric-02',
    title: '數據分析時間',
    before: '2 天',
    after: '5 分鐘',
    improvement: '99%',
    icon: Brain,
    color: 'text-violet-600',
  },
  {
    id: 'metric-03',
    title: '報告撰寫時間',
    before: '2 週',
    after: '15 分鐘',
    improvement: '99%',
    icon: FileText,
    color: 'text-emerald-600',
  },
  {
    id: 'metric-04',
    title: '驗證流程時間',
    before: '1 週',
    after: '2.3 秒',
    improvement: '99.9%',
    icon: ShieldCheck,
    color: 'text-amber-600',
  },
];

const DAY_MILESTONES: DayMilestone[] = [
  {
    day: 'Day 1',
    title: '註冊與設定',
    description: '完成帳號註冊、組織資訊設定、新手引導',
    icon: Target,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    completed: true,
  },
  {
    day: 'Day 2',
    title: '數據上傳',
    description: '上傳 ESG 數據，AI 自動識別與分類',
    icon: Upload,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    completed: true,
  },
  {
    day: 'Day 3',
    title: '首次 AI 洞察',
    description: 'AI 自動分析數據，發現碳排熱點',
    icon: Brain,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    completed: true,
  },
  {
    day: 'Day 5',
    title: '數據整理完成',
    description: 'AI 完成數據分類、異常偵測、完整性檢查',
    icon: CheckCircle2,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    completed: true,
  },
  {
    day: 'Day 7',
    title: '5T 驗證通過',
    description: '數據通過 5T 協議驗證，獲得 Trustworthy 認證',
    icon: ShieldCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    completed: true,
  },
  {
    day: 'Day 10',
    title: '報告草稿生成',
    description: 'AI 自動生成 GRI 報告草稿',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    completed: true,
  },
  {
    day: 'Day 12',
    title: '報告審核完成',
    description: '人工審核並微調報告內容',
    icon: Star,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    completed: true,
  },
  {
    day: 'Day 14',
    title: '報告發布',
    description: '一鍵導出報告，完成首次 ESG 報告發布',
    icon: TrendingUp,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    completed: true,
  },
];

const TIME_SAVINGS = [
  { task: '數據收集', traditional: '3 天', esggo: '30 分鐘', saved: '2.9 天' },
  { task: '數據分析', traditional: '2 天', esggo: '5 分鐘', saved: '2 天' },
  { task: '報告撰寫', traditional: '2 週', esggo: '15 分鐘', saved: '13.7 天' },
  { task: '驗證流程', traditional: '1 週', esggo: '2.3 秒', saved: '7 天' },
  { task: '總計', traditional: '4 週', esggo: '14 天', saved: '80 hrs' },
];

const USER_QUOTES = [
  {
    quote: '「原本要花 2 週收集數據，現在 30 分鐘就搞定了！」',
    author: '王顧問',
    role: '永續顧問',
    avatar: '📊',
  },
  {
    quote: '「AI 自動分析幫我找到了從未注意到的碳排熱點。」',
    author: '林永續',
    role: '製造業 CSO',
    avatar: '🌱',
  },
  {
    quote: '「14 天完成過去 4 週的工作，效率提升太驚人了！」',
    author: '陳廠長',
    role: '製造業廠長',
    avatar: '🏭',
  },
];

/* ─── Components ─── */

function MetricCard({ metric, index }: { metric: EfficiencyMetric; index: number }) {
  const Icon = metric.icon;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center',
            `bg-${metric.color.split('-')[1]}-50`
          )}
        >
          <Icon size={20} className={metric.color} />
        </div>
        <h3 className="text-sm font-bold text-[#003262]">{metric.title}</h3>
      </div>
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-slate-400 mb-0.5">Before</p>
          <p className="text-sm font-black text-slate-500">{metric.before}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-emerald-600 mb-0.5">After</p>
          <p className="text-sm font-black text-emerald-700">{metric.after}</p>
        </div>
        <div className="bg-blue-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-blue-600 mb-0.5">節省</p>
          <p className="text-sm font-black text-blue-700">{metric.improvement}</p>
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({ milestone, index }: { milestone: DayMilestone; index: number }) {
  const Icon = milestone.icon;
  return (
    <div
      className="flex items-start gap-4"
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full flex items-center justify-center',
            milestone.bgColor
          )}
        >
          <Icon size={18} className={milestone.color} />
        </div>
        {index < DAY_MILESTONES.length - 1 && <div className="w-0.5 h-12 bg-slate-200 mt-2" />}
      </div>
      <div
        className={cn(
          'flex-1 bg-white rounded-xl border p-4 transition-all',
          milestone.completed ? 'border-slate-100' : 'border-slate-200 opacity-60'
        )}
      >
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-bold text-slate-400">{milestone.day}</span>
          {milestone.completed && <CheckCircle2 size={14} className="text-emerald-500" />}
        </div>
        <h4 className="text-sm font-bold text-[#003262] mb-0.5">{milestone.title}</h4>
        <p className="text-[11px] text-slate-400">{milestone.description}</p>
      </div>
    </div>
  );
}

function SavingsRow({ item, isTotal }: { item: (typeof TIME_SAVINGS)[0]; isTotal: boolean }) {
  return (
    <div
      className={cn(
        'flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0',
        isTotal && 'bg-emerald-50 -mx-4 px-4 rounded-lg border-0 mt-2'
      )}
    >
      <span
        className={cn(
          'text-xs font-medium',
          isTotal ? 'text-emerald-700 font-bold' : 'text-slate-600'
        )}
      >
        {item.task}
      </span>
      <div className="flex items-center gap-4">
        <span
          className={cn(
            'text-xs font-mono',
            isTotal ? 'text-emerald-600 font-bold' : 'text-slate-400'
          )}
        >
          {item.traditional}
        </span>
        <ArrowRight size={12} className="text-slate-300" />
        <span
          className={cn(
            'text-xs font-mono',
            isTotal ? 'text-emerald-600 font-bold' : 'text-[#003262]'
          )}
        >
          {item.esggo}
        </span>
        <span
          className={cn(
            'text-xs font-mono font-bold w-16 text-right',
            isTotal ? 'text-emerald-700' : 'text-blue-600'
          )}
        >
          {item.saved}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function EfficiencyLevelPage() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'timeline' | 'savings'>('metrics');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg breathing-glow">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                    Level 1: 效率提升
                  </h1>
                  <Badge variant="primary" size="sm">
                    Day 1-14
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Efficiency Boost · 從 4 週縮短到 14 天
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              在 Level 1，用戶體驗到最直觀的價值——效率的飛躍式提升。 透過 AI
              自動化數據收集、分析與報告生成，原本需要 4 週的工作在 14 天內完成，節省 80 小時人工。
            </p>
          </div>
        </header>

        {/* ─── Key Metrics ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {EFFICIENCY_METRICS.map((metric, i) => (
            <MetricCard key={metric.id} metric={metric} index={i} />
          ))}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'metrics' as const,
              label: '效率指標',
              icon: TrendingUp,
              count: EFFICIENCY_METRICS.length,
            },
            {
              id: 'timeline' as const,
              label: '14 天里程碑',
              icon: Clock,
              count: DAY_MILESTONES.length,
            },
            {
              id: 'savings' as const,
              label: '時間節省',
              icon: BarChart3,
              count: TIME_SAVINGS.length,
            },
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
            <Card className="p-5">
              {activeTab === 'metrics' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-blue-500" />
                    效率提升指標
                  </h3>
                  <div className="space-y-4">
                    {EFFICIENCY_METRICS.map((metric) => {
                      const Icon = metric.icon;
                      return (
                        <div key={metric.id} className="bg-slate-50 rounded-xl p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <Icon size={18} className={metric.color} />
                            <h4 className="text-sm font-bold text-[#003262]">{metric.title}</h4>
                            <span className="ml-auto text-sm font-black text-emerald-600">
                              {metric.improvement}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 bg-white rounded-lg p-2 text-center">
                              <p className="text-[9px] text-slate-400">Before</p>
                              <p className="text-sm font-black text-slate-500">{metric.before}</p>
                            </div>
                            <ArrowRight size={16} className="text-slate-300 shrink-0" />
                            <div className="flex-1 bg-emerald-50 rounded-lg p-2 text-center">
                              <p className="text-[9px] text-emerald-600">After</p>
                              <p className="text-sm font-black text-emerald-700">{metric.after}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Clock size={14} className="text-violet-500" />
                    14 天里程碑
                  </h3>
                  <div className="space-y-2">
                    {DAY_MILESTONES.map((milestone, i) => (
                      <MilestoneCard key={i} milestone={milestone} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'savings' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <BarChart3 size={14} className="text-emerald-500" />
                    時間節省明細
                  </h3>
                  <div className="px-4">
                    {TIME_SAVINGS.map((item, i) => (
                      <SavingsRow key={i} item={item} isTotal={i === TIME_SAVINGS.length - 1} />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Total Savings */}
            <Card className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="text-center">
                <Clock size={32} className="mx-auto mb-2 text-blue-600" />
                <p className="text-3xl font-black text-[#003262]">80 hrs</p>
                <p className="text-xs text-slate-500 font-medium">總節省時間</p>
                <p className="text-[10px] text-slate-400 mt-1">相當於 2 週工作日</p>
              </div>
            </Card>

            {/* User Quotes */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">用戶回饋</h3>
              <div className="space-y-3">
                {USER_QUOTES.map((quote, i) => (
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
            </Card>

            {/* Next Level */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">下一等級</h3>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Level 2: 信任建立</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">
                  5T 驗證通過、ZKP 證明生成、區塊鏈錨定
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  了解更多
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗效率提升？</h3>
          <p className="text-xs text-slate-400 mb-4">註冊即可在 14 天內完成過去 4 週的工作</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Zap size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              免費開始
            </Button>
            <Button variant="outline" size="md" icon={<Play size={16} />}>
              觀看演示
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
