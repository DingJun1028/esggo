'use client';

import React, { useState } from 'react';

import {
  Globe,
  Zap,
  Award,
  Users,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  Target,
  ShieldCheck,
  FileText,
  BarChart3,
  LineChart,
  Building2,
  Leaf,
  DollarSign,
  TrendingUp,
  Clock,
  MessageSquare,
  Link,
  Factory,
  Truck,
  Recycle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Data ─── */
const ECOSYSTEM_FEATURES = [
  {
    id: 'eco-01',
    title: '供應鏈整合',
    subtitle: 'Supply Chain Integration',
    description: '將 ESG 數據管理擴展到整個供應鏈，實現供應商數據的自動收集、驗證與追蹤。',
    icon: Link,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    benefits: [
      '供應商 ESG 數據自動收集',
      '供應鏈風險即時監控',
      '供應商評級與排名',
      '供應鏈碳足跡追蹤',
    ],
    metrics: [
      { label: '供應商覆蓋', value: '500+' },
      { label: '數據透明度', value: '95%' },
    ],
  },
  {
    id: 'eco-02',
    title: '碳交易平台',
    subtitle: 'Carbon Trading Platform',
    description: '整合碳交易市場，讓企業能夠直接購買或出售碳配額，實現碳資產管理。',
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    benefits: ['碳配額即時交易', '碳價格趨勢分析', '碳資產組合管理', '碳抵消項目投資'],
    metrics: [
      { label: '交易量', value: '$10M+' },
      { label: '碳減排', value: '25%' },
    ],
  },
  {
    id: 'eco-03',
    title: '國際認證',
    subtitle: 'International Certification',
    description: '獲得國際認可的 ESG 認證，包括 ISO 14064、SBTi、CDP 等，提升企業國際競爭力。',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    benefits: ['ISO 14064 認證', 'SBTi 科學基礎目標', 'CDP 碳揭露', 'UN SDG 對齊'],
    metrics: [
      { label: '認證數量', value: '4+' },
      { label: '國際認可', value: '100%' },
    ],
  },
  {
    id: 'eco-04',
    title: '生態系統協作',
    subtitle: 'Ecosystem Collaboration',
    description: '與政府、NGO、學術機構合作，共同推動永續發展生態系統。',
    icon: Globe,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    benefits: ['政府政策對接', 'NGO 合作項目', '學術研究支持', '產業標準制定'],
    metrics: [
      { label: '合作夥伴', value: '50+' },
      { label: '生態覆蓋', value: '100%' },
    ],
  },
];

const MONTH_3_MILESTONES = [
  {
    week: 'Week 9',
    title: '供應鏈整合啟動',
    description: '開始整合供應商 ESG 數據',
    completed: true,
  },
  {
    week: 'Week 10',
    title: '碳交易帳戶開通',
    description: '開通碳交易帳戶，開始碳資產管理',
    completed: true,
  },
  {
    week: 'Week 11',
    title: '國際認證申請',
    description: '提交 ISO 14064 與 SBTi 認證申請',
    completed: true,
  },
  {
    week: 'Week 12',
    title: '生態系統對接',
    description: '與政府、NGO、學術機構建立合作',
    completed: true,
  },
  { week: 'Week 13', title: '碳交易首次成交', description: '完成首次碳配額交易', completed: true },
  { week: 'Week 14', title: '國際認證通過', description: '獲得國際 ESG 認證', completed: true },
  {
    week: 'Week 15',
    title: '生態協同完成',
    description: '建立完整的 ESG 生態系統',
    completed: true,
  },
  { week: 'Week 16', title: 'Level 4 完成', description: '達到生態協同等級', completed: true },
];

const ECOSYSTEM_STATS = [
  {
    label: '供應鏈覆蓋',
    value: '500+',
    description: '供應商',
    icon: Factory,
    color: 'text-blue-600',
  },
  {
    label: '碳交易額',
    value: '$10M+',
    description: '月度交易',
    icon: DollarSign,
    color: 'text-emerald-600',
  },
  { label: '國際認證', value: '4+', description: '項認證', icon: Award, color: 'text-amber-600' },
  {
    label: '生態夥伴',
    value: '50+',
    description: '個合作夥伴',
    icon: Users,
    color: 'text-violet-600',
  },
];

const ALL_LEVELS_COMPARISON = [
  { metric: '效率', level1: '✓', level2: '✓', level3: '✓', level4: '✓' },
  { metric: '報告', level1: '基礎', level2: '專業', level3: '國際', level4: '生態' },
  { metric: '信任', level1: '內部', level2: '審計', level3: '區塊鏈', level4: '全球' },
  { metric: '供應鏈', level1: '—', level2: '—', level3: '部分', level4: '完整' },
  { metric: '碳交易', level1: '—', level2: '—', level3: '—', level4: '✓' },
  { metric: '國際認證', level1: '—', level2: '—', level3: '部分', level4: '完整' },
  { metric: '生態協作', level1: '—', level2: '—', level3: '—', level4: '✓' },
];

const PARTNER_LOGOS = [
  { name: 'ISO', type: '認證機構', icon: '🏅' },
  { name: 'SBTi', type: '科學基礎目標', icon: '🎯' },
  { name: 'CDP', type: '碳揭露', icon: '🌍' },
  { name: 'UN SDG', type: '聯合國永續目標', icon: '🇺🇳' },
  { name: 'GRI', type: '報告標準', icon: '📊' },
  { name: 'TCFD', type: '氣候揭露', icon: '🌡️' },
];

/* ─── Components ─── */

function FeatureCard({
  feature,
  index,
}: {
  feature: (typeof ECOSYSTEM_FEATURES)[0];
  index: number;
}) {
  const Icon = feature.icon;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={cn('w-12 h-12 rounded-xl flex items-center justify-center', feature.bgColor)}
        >
          <Icon size={24} className={feature.color} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#003262]">{feature.title}</h3>
          <p className="text-[10px] text-slate-400">{feature.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{feature.description}</p>
      <div className="space-y-2 mb-4">
        {feature.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span className="text-xs text-slate-600">{benefit}</span>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-2">
        {feature.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[9px] text-slate-400">{metric.label}</p>
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
  milestone: (typeof MONTH_3_MILESTONES)[0];
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
        {index < MONTH_3_MILESTONES.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
      </div>
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold text-slate-400">{milestone.week}</span>
        </div>
        <h4 className="text-xs font-bold text-[#003262]">{milestone.title}</h4>
        <p className="text-[10px] text-slate-400">{milestone.description}</p>
      </div>
    </div>
  );
}

function ComparisonRow({ data }: { data: (typeof ALL_LEVELS_COMPARISON)[0] }) {
  return (
    <div className="grid grid-cols-5 gap-2 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-600 font-medium">{data.metric}</span>
      {[data.level1, data.level2, data.level3, data.level4].map((val, i) => (
        <div key={i} className="text-center">
          <span
            className={cn(
              'text-xs font-bold px-2 py-0.5 rounded',
              val === '✓'
                ? 'bg-emerald-50 text-emerald-600'
                : val === '—'
                ? 'bg-slate-50 text-slate-400'
                : val === '基礎'
                ? 'bg-slate-100 text-slate-500'
                : val === '專業'
                ? 'bg-blue-50 text-blue-600'
                : val === '國際'
                ? 'bg-violet-50 text-violet-600'
                : val === '生態'
                ? 'bg-emerald-50 text-emerald-600'
                : val === '內部'
                ? 'bg-slate-100 text-slate-500'
                : val === '審計'
                ? 'bg-blue-50 text-blue-600'
                : val === '區塊鏈'
                ? 'bg-cyan-50 text-cyan-600'
                : val === '全球'
                ? 'bg-violet-50 text-violet-600'
                : val === '部分'
                ? 'bg-amber-50 text-amber-600'
                : val === '完整'
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-slate-100 text-slate-500'
            )}
          >
            {val}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ─── Main Page ─── */
export default function EcosystemLevelPage() {
  const [activeTab, setActiveTab] = useState<'features' | 'timeline' | 'comparison'>('features');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl breathing-glow-emerald" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg breathing-glow-emerald">
                <Globe size={28} className="text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                    Level 4: 生態協同
                  </h1>
                  <OmniBadge variant="success" size="sm">
                    Month 3+
                  </OmniBadge>
                </div>
                <p className="text-xs text-slate-400 font-mono">
                  Ecosystem Collaboration · 供應鏈整合 · 碳交易 · 國際認證
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              在 Level 4，企業從單點 ESG
              管理擴展到整個生態系統。通過供應鏈整合、碳交易平台和國際認證， 企業不僅提升了自身的
              ESG 表現，更帶動了整個產業鏈的永續發展。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ECOSYSTEM_STATS.map((stat, i) => {
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
              id: 'features' as const,
              label: '生態功能',
              icon: Globe,
              count: ECOSYSTEM_FEATURES.length,
            },
            {
              id: 'timeline' as const,
              label: 'Month 3 里程碑',
              icon: Clock,
              count: MONTH_3_MILESTONES.length,
            },
            { id: 'comparison' as const, label: '等級比較', icon: BarChart3 },
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
            
              {activeTab === 'features' && (
                <div
                  key="features"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">生態系統功能</h2>
                    <p className="text-xs text-slate-400">Level 4 的四大核心功能</p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ECOSYSTEM_FEATURES.map((feature, i) => (
                      <FeatureCard key={feature.id} feature={feature} index={i} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div
                  key="timeline"
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Clock size={14} className="text-emerald-500" />
                      Month 3 里程碑
                    </h3>
                    <div className="space-y-2">
                      {MONTH_3_MILESTONES.map((milestone, i) => (
                        <MilestoneItem key={i} milestone={milestone} index={i} />
                      ))}
                    </div>
                  </OmniBaseCard>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div
                  key="comparison"
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <BarChart3 size={14} className="text-blue-500" />
                      全等級比較
                    </h3>
                    <div className="space-y-1">
                      <div className="grid grid-cols-5 gap-2 pb-2 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400">功能</span>
                        <span className="text-[10px] font-bold text-slate-400 text-center">L1</span>
                        <span className="text-[10px] font-bold text-blue-600 text-center">L2</span>
                        <span className="text-[10px] font-bold text-violet-600 text-center">
                          L3
                        </span>
                        <span className="text-[10px] font-bold text-emerald-600 text-center">
                          L4
                        </span>
                      </div>
                      {ALL_LEVELS_COMPARISON.map((data, i) => (
                        <ComparisonRow key={i} data={data} />
                      ))}
                    </div>
                  </OmniBaseCard>
                </div>
              )}
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Partner Logos */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">合作夥伴</h3>
              <div className="grid grid-cols-3 gap-2">
                {PARTNER_LOGOS.map((partner) => (
                  <div key={partner.name} className="text-center p-2 bg-slate-50 rounded-lg">
                    <span className="text-xl">{partner.icon}</span>
                    <p className="text-[10px] font-bold text-[#003262] mt-1">{partner.name}</p>
                    <p className="text-[8px] text-slate-400">{partner.type}</p>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            {/* Level Progress */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">等級進度</h3>
              <div className="space-y-3">
                {[
                  { level: 'L1', name: '效率提升', progress: 100, color: 'bg-blue-500' },
                  { level: 'L2', name: '專業增值', progress: 100, color: 'bg-violet-500' },
                  { level: 'L3', name: '信任建立', progress: 100, color: 'bg-cyan-500' },
                  { level: 'L4', name: '生態協同', progress: 60, color: 'bg-emerald-500' },
                ].map((item) => (
                  <div key={item.level}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium text-slate-600">
                        {item.level}: {item.name}
                      </span>
                      <span className="text-[10px] font-bold text-slate-400">{item.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn('h-full rounded-full', item.color)}
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            {/* CTA */}
            <OmniBaseCard className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">升級到 Level 4</h3>
              <p className="text-[11px] text-slate-500 mb-3">
                整合供應鏈、開始碳交易、獲得國際認證
              </p>
              <OmniButton
                variant="primary"
                size="sm"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                開始升級
              </OmniButton>
            </OmniBaseCard>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備建立 ESG 生態系統？</h3>
          <p className="text-xs text-slate-400 mb-4">從 Level 1 開始，逐步升級到生態協同</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Globe size={16} />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              開始生態協同
            </OmniButton>
            <OmniButton variant="outline" size="md" icon={<Play size={16} />}>
              觀看演示
            </OmniButton>
          </div>
        </OmniBaseCard>
      </div>
    </div>
  );
}
