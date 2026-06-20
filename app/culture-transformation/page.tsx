'use client';

import React, { useState } from 'react';

import {
  Heart,
  Users,
  Award,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  Target,
  Globe,
  Leaf,
  Zap,
  Clock,
  MessageSquare,
  Building2,
  GraduationCap,
  Star,
  BarChart3,
  ShieldCheck,
  Lightbulb,
  Recycle,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Data ─── */
const CULTURE_PILLARS = [
  {
    id: 'pillar-01',
    title: '組織覺醒',
    subtitle: 'Organizational Awakening',
    description: '從高層到基層，全員理解 ESG 的重要性，將永續發展融入企業 DNA。',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    benefits: ['高層承諾與支持', '全員 ESG 意識提升', '永續文化融入企業價值觀', '跨部門協作機制'],
    metrics: [
      { label: '員工參與率', value: '95%' },
      { label: 'ESG 培訓完成', value: '100%' },
    ],
  },
  {
    id: 'pillar-02',
    title: '影響力擴大',
    subtitle: 'Impact Amplification',
    description: '將 ESG 影響力擴展到供應鏈、產業和社會，成為永續發展的領導者。',
    icon: Globe,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    benefits: ['供應鏈 ESG 提升', '行業標準制定參與', '社會影響力投資', '國際合作項目'],
    metrics: [
      { label: '供應鏈影響', value: '500+' },
      { label: '行業標準', value: '5 項' },
    ],
  },
  {
    id: 'pillar-03',
    title: '持續創新',
    subtitle: 'Continuous Innovation',
    description: '持續創新 ESG 實踐，探索新的永續發展模式與技術。',
    icon: Recycle,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    benefits: ['ESG 技術創新', '循環經濟實踐', '碳中和路徑探索', '永續產品開發'],
    metrics: [
      { label: '創新項目', value: '10+' },
      { label: '專利申請', value: '3 項' },
    ],
  },
  {
    id: 'pillar-04',
    title: '價值共創',
    subtitle: 'Value Co-creation',
    description: '與所有利益相關者共同創造永續價值，實現共享繁榮。',
    icon: Heart,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    benefits: ['利益相關者參與', '共享價值創造', '社區發展支持', '員工福祉提升'],
    metrics: [
      { label: '利益相關者', value: '100+' },
      { label: '社區項目', value: '15 個' },
    ],
  },
];

const YEAR_1_MILESTONES = [
  {
    month: 'Month 4',
    title: 'ESG 培訓啟動',
    description: '全員 ESG 意識培訓開始',
    completed: true,
  },
  { month: 'Month 5', title: '文化融入', description: 'ESG 價值觀融入企業文化', completed: true },
  {
    month: 'Month 6',
    title: '供應鏈影響',
    description: '供應商 ESG 提升計劃啟動',
    completed: true,
  },
  {
    month: 'Month 7',
    title: '行業標準參與',
    description: '參與行業 ESG 標準制定',
    completed: true,
  },
  { month: 'Month 8', title: '創新項目啟動', description: 'ESG 技術創新項目啟動', completed: true },
  { month: 'Month 9', title: '社區項目', description: '社區永續發展項目啟動', completed: true },
  { month: 'Month 10', title: '國際合作', description: '國際 ESG 合作項目啟動', completed: true },
  { month: 'Month 11', title: '成果發表', description: 'ESG 文化轉型成果發表', completed: true },
  { month: 'Month 12', title: 'Level 5 完成', description: '完成文化轉型等級', completed: true },
];

const CULTURE_STATS = [
  {
    label: '員工參與率',
    value: '95%',
    description: 'ESG 培訓完成',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    label: '供應鏈影響',
    value: '500+',
    description: '家供應商',
    icon: Globe,
    color: 'text-emerald-600',
  },
  {
    label: '創新項目',
    value: '10+',
    description: '項 ESG 創新',
    icon: Lightbulb,
    color: 'text-amber-600',
  },
  {
    label: '社區項目',
    value: '15',
    description: '個社區項目',
    icon: Heart,
    color: 'text-rose-600',
  },
];

const ALL_LEVELS_SUMMARY = [
  { level: 'L1', name: '效率提升', period: 'Day 1-14', status: 'completed', key: '節省 80 小時' },
  {
    level: 'L2',
    name: '專業增值',
    period: 'Day 15-30',
    status: 'completed',
    key: 'ESG 評級 +2 級',
  },
  { level: 'L3', name: '信任建立', period: 'Month 2', status: 'completed', key: '投資人信任 95%' },
  { level: 'L4', name: '生態協同', period: 'Month 3+', status: 'completed', key: '供應鏈 500+' },
  { level: 'L5', name: '文化轉型', period: 'Year 1+', status: 'in_progress', key: '組織覺醒' },
];

const STAKEHOLDER_IMPACT = [
  { group: '員工', impact: 'ESG 意識提升 95%', icon: '👥', color: 'text-blue-600' },
  { group: '供應商', impact: 'ESG 評分平均 +15%', icon: '🏭', color: 'text-emerald-600' },
  { group: '投資人', impact: '信任度 95%', icon: '💼', color: 'text-violet-600' },
  { group: '社區', impact: '15 個社區項目', icon: '🏘️', color: 'text-amber-600' },
  { group: '產業', impact: '5 項行業標準', icon: '🏢', color: 'text-rose-600' },
];

/* ─── Components ─── */

function PillarCard({ pillar, index }: { pillar: (typeof CULTURE_PILLARS)[0]; index: number }) {
  const Icon = pillar.icon;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn('w-12 h-12 rounded-xl flex items-center justify-center', pillar.bgColor)}
        >
          <Icon size={24} className={pillar.color} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#003262]">{pillar.title}</h3>
          <p className="text-[10px] text-slate-400">{pillar.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{pillar.description}</p>
      <div className="space-y-2 mb-4">
        {pillar.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span className="text-xs text-slate-600">{benefit}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {pillar.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[8px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: (typeof YEAR_1_MILESTONES)[0];
  index: number;
}) {
  return (
    <div
      className="flex items-start gap-3"
    >
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-8 h-8 rounded-full flex items-center justify-center',
            milestone.completed ? 'bg-emerald-50' : 'bg-slate-100'
          )}
        >
          {milestone.completed ? (
            <CheckCircle2 size={14} className="text-emerald-500" />
          ) : (
            <Clock size={14} className="text-slate-400" />
          )}
        </div>
        {index < YEAR_1_MILESTONES.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
      </div>
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold text-slate-400">{milestone.month}</span>
        </div>
        <h4 className="text-xs font-bold text-[#003262]">{milestone.title}</h4>
        <p className="text-[10px] text-slate-400">{milestone.description}</p>
      </div>
    </div>
  );
}

function LevelSummaryCard({
  level,
  isActive,
}: {
  level: (typeof ALL_LEVELS_SUMMARY)[0];
  isActive: boolean;
}) {
  return (
    <div
      className={cn(
        'p-3 rounded-xl border transition-all',
        isActive ? 'border-amber-300 bg-amber-50 shadow-md' : 'border-slate-100 bg-white'
      )}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'text-xs font-black px-1.5 py-0.5 rounded',
              level.status === 'completed'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            )}
          >
            {level.level}
          </span>
          <span className="text-xs font-bold text-[#003262]">{level.name}</span>
        </div>
        {level.status === 'completed' && <CheckCircle2 size={12} className="text-emerald-500" />}
        {level.status === 'in_progress' && (
          <Zap size={12} className="text-amber-500 animate-pulse" />
        )}
      </div>
      <p className="text-[9px] text-slate-400">{level.period}</p>
      <p className="text-[10px] text-slate-600 font-medium mt-1">{level.key}</p>
    </div>
  );
}

/* ─── Main Page ─── */
export default function CultureTransformationPage() {
  const [activeTab, setActiveTab] = useState<'pillars' | 'timeline' | 'stakeholders'>('pillars');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg breathing-glow-amber">
                <Heart size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                    Level 5: 文化轉型
                  </h1>
                  <Badge variant="warning" size="sm">
                    Year 1+
                  </Badge>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Culture Transformation · 組織覺醒 · 影響力擴大
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              在 Level 5，ESG 不再只是工具或流程，而是深入企業 DNA 的文化轉型。
              從組織覺醒到影響力擴大，企業成為永續發展的領導者，帶動整個產業和社會的永續轉型。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CULTURE_STATS.map((stat, i) => {
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

        {/* ─── Level Progress ─── */}
        <Card className="p-5">
          <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Target size={14} className="text-amber-500" />
            價值階梯進度
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {ALL_LEVELS_SUMMARY.map((level) => (
              <LevelSummaryCard key={level.level} level={level} isActive={level.level === 'L5'} />
            ))}
          </div>
        </Card>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'pillars' as const,
              label: '文化支柱',
              icon: Heart,
              count: CULTURE_PILLARS.length,
            },
            {
              id: 'timeline' as const,
              title: 'Year 1 里程碑',
              icon: Clock,
              count: YEAR_1_MILESTONES.length,
            },
            {
              id: 'stakeholders' as const,
              label: '利益相關者',
              icon: Users,
              count: STAKEHOLDER_IMPACT.length,
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
              {'count' in tab && tab.count !== undefined && (
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
            
              {activeTab === 'pillars' && (
                <div
                  key="pillars"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">四大文化支柱</h2>
                    <p className="text-xs text-slate-400">支撐 ESG 文化轉型的核心支柱</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {CULTURE_PILLARS.map((pillar, i) => (
                      <PillarCard key={pillar.id} pillar={pillar} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div
                  key="timeline"
                >
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Clock size={14} className="text-amber-500" />
                      Year 1 里程碑
                    </h3>
                    <div className="space-y-2">
                      {YEAR_1_MILESTONES.map((milestone, i) => (
                        <MilestoneItem key={i} milestone={milestone} index={i} />
                      ))}
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'stakeholders' && (
                <div
                  key="stakeholders"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">利益相關者影響</h2>
                    <p className="text-xs text-slate-400">ESG 文化轉型對各利益相關者的影響</p>
                  </div>
                  {STAKEHOLDER_IMPACT.map((item, i) => (
                    <Card key={i} className="p-4">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{item.icon}</span>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-[#003262]">{item.group}</h4>
                          <p className={cn('text-lg font-black', item.color)}>{item.impact}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Culture Score */}
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <div className="text-center">
                <Heart size={32} className="mx-auto mb-2 text-amber-600" />
                <p className="text-3xl font-black text-[#003262]">92</p>
                <p className="text-xs text-slate-500 font-medium">文化轉型評分</p>
                <p className="text-[9px] text-slate-400 mt-1">基於 4 大支柱綜合評估</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">快速操作</h3>
              <div className="space-y-2">
                {[
                  { label: '啟動 ESG 培訓', icon: GraduationCap },
                  { label: '邀請合作夥伴', icon: Users },
                  { label: '查看文化報告', icon: BarChart3 },
                  { label: '設定創新項目', icon: Lightbulb },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left hover:bg-slate-50 transition-colors"
                  >
                    <action.icon size={14} className="text-slate-400" />
                    <span className="text-xs font-medium text-slate-600">{action.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* CTA */}
            <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">開始文化轉型</h3>
              <p className="text-[11px] text-slate-500 mb-3">
                將 ESG 融入企業 DNA，成為永續發展領導者
              </p>
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              >
                開始轉型
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
