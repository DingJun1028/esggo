'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  FileText,
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  Play,
  Star,
  Target,
  BarChart3,
  Globe,
  Lock,
  Users,
  Building2,
  DollarSign,
  LineChart,
  Rocket,
  Clock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface LevelData {
  id: string;
  level: number;
  name: string;
  subtitle: string;
  period: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  features: {
    title: string;
    description: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    color: string;
  }[];
  metrics: { label: string; value: string; trend?: string }[];
  outcomes: string[];
}

/* ─── Data ─── */
const LEVELS: LevelData[] = [
  {
    id: 'level-2',
    level: 2,
    name: '專業增值',
    subtitle: 'Professional Value',
    period: 'Day 15-30',
    description:
      '在效率提升的基礎上，用戶開始體驗專業級的 ESG 報告生成與合規性保證，ESG 評級顯著提升。',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: [
      {
        title: '專業報告生成',
        description: 'AI 自動生成符合 GRI/SASB/TCFD 標準的專業 ESG 報告',
        icon: FileText,
        color: 'text-blue-600',
      },
      {
        title: '合規性保證',
        description: '自動檢查合規性，確保符合國際標準與監管要求',
        icon: ShieldCheck,
        color: 'text-emerald-600',
      },
      {
        title: '提升 ESG 評級',
        description: '通過數據優化與報告改善，提升企業 ESG 評級',
        icon: Award,
        color: 'text-amber-600',
      },
    ],
    metrics: [
      { label: '報告合規率', value: '98%', trend: '+15%' },
      { label: 'ESG 評級提升', value: '+2 級', trend: 'BBB→AA' },
      { label: '審計通過率', value: '100%', trend: '+25%' },
    ],
    outcomes: ['專業 ESG 報告生成', '多框架合規性保證', 'ESG 評級顯著提升', '審計一次通過'],
  },
  {
    id: 'level-3',
    level: 3,
    name: '信任建立',
    subtitle: 'Trust Building',
    period: 'Month 2',
    description: '通過 ZKP 證明與區塊鏈錨定，建立不可篡改的數據信任體系，獲得投資人認可。',
    icon: Lock,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    features: [
      {
        title: 'ZKP 證明生成',
        description: '零知識證明技術確保數據隱私與真實性',
        icon: Lock,
        color: 'text-violet-600',
      },
      {
        title: '區塊鏈錨定',
        description: '數據上鏈，確保不可篡改',
        icon: Globe,
        color: 'text-cyan-600',
      },
      {
        title: '投資人信任',
        description: '可信的 ESG 數據吸引投資人認可',
        icon: Users,
        color: 'text-rose-600',
      },
    ],
    metrics: [
      { label: '投資人信任度', value: '95%', trend: '+30%' },
      { label: '募資成功率', value: '+40%', trend: '顯著提升' },
      { label: '數據可信度', value: '98.5%', trend: '+23%' },
    ],
    outcomes: ['ZKP 證明生成', '區塊鏈錨定完成', '投資人信任建立', '募資成功率提升'],
  },
];

const LEVEL_2_MILESTONES = [
  {
    day: 'Day 15',
    title: '報告草稿生成',
    description: 'AI 自動生成 GRI 報告草稿',
    completed: true,
  },
  { day: 'Day 18', title: '合規性檢查', description: '自動檢查報告合規性', completed: true },
  { day: 'Day 20', title: '4T 驗證通過', description: '數據通過 5T 協議驗證', completed: true },
  { day: 'Day 22', title: '報告審核完成', description: '人工審核並微調報告', completed: true },
  {
    day: 'Day 25',
    title: 'ESG 評級提升',
    description: 'ESG 評級從 BBB 提升至 AA',
    completed: true,
  },
  {
    day: 'Day 30',
    title: '專業報告發布',
    description: '發布符合國際標準的專業 ESG 報告',
    completed: true,
  },
];

const LEVEL_3_MILESTONES = [
  { day: 'Week 5', title: 'ZKP 證明生成', description: '生成零知識證明', completed: true },
  { day: 'Week 6', title: '區塊鏈錨定', description: '數據上鏈，不可篡改', completed: true },
  { day: 'Week 7', title: '投資人驗證', description: '投資人驗證數據真實性', completed: true },
  { day: 'Week 8', title: '信任建立完成', description: '建立完整的數據信任體系', completed: true },
];

const COMPARISON_DATA = [
  { metric: '報告品質', level1: '基礎', level2: '專業', level3: '國際級' },
  { metric: '合規性', level1: '部分', level2: '完整', level3: '全面' },
  { metric: '數據信任', level1: '內部', level2: '審計', level3: '區塊鏈' },
  { metric: 'ESG 評級', level1: 'CCC', level2: 'AA', level3: 'AAA' },
  { metric: '投資人信心', level1: '低', level2: '中', level3: '高' },
  { metric: '募資能力', level1: '有限', level2: '提升', level3: '強勁' },
];

/* ─── Components ─── */

function LevelCard({ level, index }: { level: LevelData; index: number }) {
  const Icon = level.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className={cn(
        'bg-white rounded-2xl border-2 p-6 hover:shadow-lg transition-all',
        level.borderColor
      )}
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', level.bgColor)}>
          <Icon size={24} className={level.color} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#003262]">{level.name}</h3>
            <OmniBadge variant="primary" size="xs">
              Level {level.level}
            </OmniBadge>
          </div>
          <p className="text-[10px] text-slate-400">
            {level.subtitle} · {level.period}
          </p>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed mb-4">{level.description}</p>

      {/* Features */}
      <div className="space-y-3 mb-4">
        {level.features.map((feature, i) => {
          const FeatureIcon = feature.icon;
          return (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
              <FeatureIcon size={16} className={cn('mt-0.5 shrink-0', feature.color)} />
              <div>
                <p className="text-xs font-bold text-[#003262]">{feature.title}</p>
                <p className="text-[10px] text-slate-400">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {level.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[8px] text-slate-400">{metric.label}</p>
            {metric.trend && (
              <p className="text-[8px] text-emerald-600 font-bold">{metric.trend}</p>
            )}
          </div>
        ))}
      </div>

      {/* Outcomes */}
      <div className="flex flex-wrap gap-1">
        {level.outcomes.map((outcome) => (
          <span
            key={outcome}
            className="text-[9px] px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded font-medium"
          >
            ✓ {outcome}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function MilestoneItem({
  milestone,
  index,
}: {
  milestone: (typeof LEVEL_2_MILESTONES)[0];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.08 }}
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
        {index < LEVEL_2_MILESTONES.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-1" />}
      </div>
      <div className="pt-1">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-[10px] font-bold text-slate-400">{milestone.day}</span>
        </div>
        <h4 className="text-xs font-bold text-[#003262]">{milestone.title}</h4>
        <p className="text-[10px] text-slate-400">{milestone.description}</p>
      </div>
    </motion.div>
  );
}

function ComparisonRow({ data }: { data: (typeof COMPARISON_DATA)[0] }) {
  return (
    <div className="grid grid-cols-4 gap-2 py-2 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-600 font-medium">{data.metric}</span>
      <div className="text-center">
        <span
          className={cn(
            'text-xs font-bold px-2 py-0.5 rounded',
            data.level1 === '基礎'
              ? 'bg-slate-100 text-slate-500'
              : data.level1 === '部分'
              ? 'bg-amber-50 text-amber-600'
              : data.level1 === '內部'
              ? 'bg-blue-50 text-blue-600'
              : data.level1 === 'CCC'
              ? 'bg-rose-50 text-rose-600'
              : data.level1 === '低'
              ? 'bg-rose-50 text-rose-600'
              : data.level1 === '有限'
              ? 'bg-amber-50 text-amber-600'
              : 'bg-slate-100 text-slate-500'
          )}
        >
          {data.level1}
        </span>
      </div>
      <div className="text-center">
        <span
          className={cn(
            'text-xs font-bold px-2 py-0.5 rounded',
            data.level2 === '專業'
              ? 'bg-blue-50 text-blue-600'
              : data.level2 === '完整'
              ? 'bg-emerald-50 text-emerald-600'
              : data.level2 === '審計'
              ? 'bg-violet-50 text-violet-600'
              : data.level2 === 'AA'
              ? 'bg-emerald-50 text-emerald-600'
              : data.level2 === '中'
              ? 'bg-amber-50 text-amber-600'
              : data.level2 === '提升'
              ? 'bg-blue-50 text-blue-600'
              : 'bg-slate-100 text-slate-500'
          )}
        >
          {data.level2}
        </span>
      </div>
      <div className="text-center">
        <span
          className={cn(
            'text-xs font-bold px-2 py-0.5 rounded',
            data.level3 === '國際級'
              ? 'bg-violet-50 text-violet-600'
              : data.level3 === '全面'
              ? 'bg-emerald-50 text-emerald-600'
              : data.level3 === '區塊鏈'
              ? 'bg-cyan-50 text-cyan-600'
              : data.level3 === 'AAA'
              ? 'bg-amber-50 text-amber-600'
              : data.level3 === '高'
              ? 'bg-emerald-50 text-emerald-600'
              : data.level3 === '強勁'
              ? 'bg-rose-50 text-rose-600'
              : 'bg-slate-100 text-slate-500'
          )}
        >
          {data.level3}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ValueLevelsPage() {
  const [activeLevel, setActiveLevel] = useState<'level2' | 'level3'>('level2');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center shadow-lg breathing-glow">
                <Rocket size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                  Level 2 & 3 價值階梯
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Professional Value & Trust Building · Day 15 - Month 2
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              從效率提升走向專業增值與信任建立。Level 2 聚焦專業報告生成與合規性保證， Level 3 通過
              ZKP 證明與區塊鏈錨定建立不可篡改的數據信任體系。
            </p>
          </div>
        </header>

        {/* ─── Level Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {LEVELS.map((level, i) => (
            <LevelCard key={level.id} level={level} index={i} />
          ))}
        </div>

        {/* ─── Level Selector ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'level2' as const,
              label: 'Level 2: 專業增值',
              icon: TrendingUp,
              period: 'Day 15-30',
            },
            { id: 'level3' as const, label: 'Level 3: 信任建立', icon: Lock, period: 'Month 2' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveLevel(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeLevel === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
              <span
                className={cn(
                  'text-[10px] px-1.5 py-0.5 rounded',
                  activeLevel === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                )}
              >
                {tab.period}
              </span>
            </button>
          ))}
        </div>

        {/* ─── Level Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OmniBaseCard className="p-5">
              {activeLevel === 'level2' ? (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <TrendingUp size={14} className="text-blue-500" />
                    Level 2 里程碑 (Day 15-30)
                  </h3>
                  <div className="space-y-2">
                    {LEVEL_2_MILESTONES.map((milestone, i) => (
                      <MilestoneItem key={i} milestone={milestone} index={i} />
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Lock size={14} className="text-violet-500" />
                    Level 3 里程碑 (Month 2)
                  </h3>
                  <div className="space-y-2">
                    {LEVEL_3_MILESTONES.map((milestone, i) => (
                      <MilestoneItem key={i} milestone={milestone} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </OmniBaseCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Level Comparison */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">等級比較</h3>
              <div className="space-y-1">
                <div className="grid grid-cols-4 gap-2 pb-2 border-b border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400">指標</span>
                  <span className="text-[10px] font-bold text-slate-400 text-center">L1</span>
                  <span className="text-[10px] font-bold text-blue-600 text-center">L2</span>
                  <span className="text-[10px] font-bold text-violet-600 text-center">L3</span>
                </div>
                {COMPARISON_DATA.map((data, i) => (
                  <ComparisonRow key={i} data={data} />
                ))}
              </div>
            </OmniBaseCard>

            {/* Next Level */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">下一等級</h3>
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="flex items-center gap-2 mb-2">
                  <Rocket size={16} className="text-amber-600" />
                  <span className="text-sm font-bold text-amber-700">Level 4: 生態擴展</span>
                </div>
                <p className="text-[11px] text-slate-500 mb-3">供應鏈整合、碳交易、國際認證</p>
                <OmniButton
                  variant="outline"
                  size="sm"
                  className="w-full border-amber-300 text-amber-700 hover:bg-amber-100"
                >
                  了解更多
                </OmniButton>
              </div>
            </OmniBaseCard>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備升級到更高價值等級？</h3>
          <p className="text-xs text-slate-400 mb-4">從效率提升開始，逐步建立專業增值與信任體系</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Rocket size={16} />}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              開始升級
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
