'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Star,
  Zap,
  ShieldCheck,
  FileText,
  Award,
  Users,
  Target,
  ChevronRight,
  Play,
  MessageSquare,
  BarChart3,
  Globe,
  Lock,
  DollarSign,
  LineChart,
  Heart,
  Rocket,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface ValueTier {
  id: string;
  level: number;
  name: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  benefits: string[];
  metrics: { label: string; value: string }[];
  cta: string;
  userCount: string;
}

/* ─── Data ─── */
const VALUE_TIERS: ValueTier[] = [
  {
    id: 'tier-01',
    level: 1,
    name: '免費探索者',
    subtitle: 'Free Explorer',
    description: '開始你的 ESG 之旅，免費體驗平台核心功能。',
    icon: Target,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    benefits: ['基礎數據上傳', 'AI 初步分析', '社區存取', '基礎報告模板'],
    metrics: [
      { label: '月費', value: '免費' },
      { label: '數據上限', value: '100 筆' },
    ],
    cta: '免費開始',
    userCount: '1,200+',
  },
  {
    id: 'tier-02',
    level: 2,
    name: '專業用戶',
    subtitle: 'Professional',
    description: '進階功能協助你完成 ESG 報告與驗證。',
    icon: TrendingUp,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    benefits: ['無限數據上傳', '5T 協議驗證', 'GRI 報告生成', 'AI 智能洞察', '電子郵件支援'],
    metrics: [
      { label: '月費', value: '$299' },
      { label: '數據上限', value: '無限' },
    ],
    cta: '升級專業版',
    userCount: '850+',
  },
  {
    id: 'tier-03',
    level: 3,
    name: '企業用戶',
    subtitle: 'Enterprise',
    description: '完整功能滿足企業級 ESG 管理需求。',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    benefits: ['ZKP 證明生成', '區塊鏈錨定', '多框架報告', 'API 存取', '專屬客戶經理'],
    metrics: [
      { label: '月費', value: '$999' },
      { label: '用戶數', value: '10+' },
    ],
    cta: '升級企業版',
    userCount: '320+',
  },
  {
    id: 'tier-04',
    level: 4,
    name: '戰略夥伴',
    subtitle: 'Strategic Partner',
    description: '最高等級，享有所有功能與優先支援。',
    icon: Award,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    benefits: ['所有企業功能', '白標解決方案', '客製化開發', '優先技術支援', '投資對接'],
    metrics: [
      { label: '月費', value: '定制' },
      { label: '支援', value: '24/7' },
    ],
    cta: '聯繫銷售',
    userCount: '50+',
  },
];

const VALUE_FLOW = [
  {
    step: '01',
    title: '註冊帳號',
    desc: '免費註冊，開始 ESG 之旅',
    icon: Users,
    color: 'text-slate-600',
  },
  {
    step: '02',
    title: '上傳數據',
    desc: '上傳 ESG 數據，AI 自動分析',
    icon: BarChart3,
    color: 'text-blue-600',
  },
  {
    step: '03',
    title: '5T 驗證',
    desc: '自動執行 5T 協議驗證',
    icon: ShieldCheck,
    color: 'text-emerald-600',
  },
  {
    step: '04',
    title: '生成報告',
    desc: 'AI 自動生成 GRI 報告',
    icon: FileText,
    color: 'text-violet-600',
  },
  { step: '05', title: 'ZKP 證明', desc: '生成零知識證明', icon: Lock, color: 'text-amber-600' },
  {
    step: '06',
    title: '區塊鏈錨定',
    desc: '數據上鏈，不可篡改',
    icon: Globe,
    color: 'text-cyan-600',
  },
  {
    step: '07',
    title: '獲得投資',
    desc: '可信的 ESG 數據吸引投資人',
    icon: DollarSign,
    color: 'text-rose-600',
  },
];

const ROI_DATA = [
  {
    metric: '時間節省',
    value: '80 hrs',
    description: '每份報告',
    icon: LineChart,
    color: 'text-cyan-600',
  },
  {
    metric: '成本降低',
    value: '97%',
    description: 'vs 傳統外包',
    icon: DollarSign,
    color: 'text-emerald-600',
  },
  {
    metric: '募資成功率',
    value: '+40%',
    description: '平均提升',
    icon: TrendingUp,
    color: 'text-blue-600',
  },
  {
    metric: '投資人信任',
    value: '95%',
    description: '使用後提升',
    icon: Heart,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function TierCard({ tier, index }: { tier: ValueTier; index: number }) {
  const Icon = tier.icon;
  const isPopular = tier.level === 2;

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-lg',
        tier.borderColor,
        isPopular && 'ring-2 ring-blue-500 ring-offset-2'
      )}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold px-3 py-0.5 bg-blue-500 text-white rounded-full">
            最受歡迎
          </span>
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', tier.bgColor)}>
          <Icon size={24} className={tier.color} />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[#003262]">{tier.name}</h3>
          <p className="text-[10px] text-slate-400">{tier.subtitle}</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed mb-4">{tier.description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tier.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[9px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>

      {/* Benefits */}
      <div className="space-y-2 mb-4">
        {tier.benefits.map((benefit, i) => (
          <div key={i} className="flex items-center gap-2">
            <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
            <span className="text-xs text-slate-600">{benefit}</span>
          </div>
        ))}
      </div>

      {/* User Count */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-[10px] text-slate-400">{tier.userCount} 用戶</span>
        <Button
          variant={isPopular ? 'primary' : 'outline'}
          size="sm"
          className={isPopular ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
        >
          {tier.cta}
        </Button>
      </div>
    </div>
  );
}

function FlowStep({ step, index }: { step: (typeof VALUE_FLOW)[0]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200'
          )}
        >
          <Icon size={16} className={step.color} />
        </div>
        {index < VALUE_FLOW.length - 1 && <div className="w-0.5 h-6 bg-slate-200 mt-2" />}
      </div>
      <div className="pt-2">
        <h4 className="text-sm font-bold text-[#003262]">{step.title}</h4>
        <p className="text-[11px] text-slate-400">{step.desc}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ValueLadderPage() {
  const [activeTab, setActiveTab] = useState<'tiers' | 'flow' | 'roi'>('tiers');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg breathing-glow-amber">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">價值階梯</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Value Ladder · 從免費到戰略夥伴
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              ESGGO 的價值階梯設計讓用戶從免費探索開始，逐步升級到專業、企業、戰略夥伴等級。
              每個等級都提供更多的功能與價值，協助企業實現 ESG 目標並獲得投資人信任。
            </p>
          </div>
        </header>

        {/* ─── ROI Summary ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {ROI_DATA.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.metric}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', item.color)} />
                <p className="text-xl font-black text-[#003262]">{item.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{item.metric}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">{item.description}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'tiers' as const, label: '價值等級', icon: Award, count: VALUE_TIERS.length },
            { id: 'flow' as const, label: '價值流程', icon: Rocket, count: VALUE_FLOW.length },
            { id: 'roi' as const, label: 'ROI 分析', icon: LineChart },
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
        {activeTab === 'tiers' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">四個價值等級</h2>
              <p className="text-xs text-slate-400">從免費探索到戰略夥伴，每個等級都有獨特價值</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {VALUE_TIERS.map((tier, i) => (
                <TierCard key={tier.id} tier={tier} index={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'flow' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">價值實現流程</h2>
              <p className="text-xs text-slate-400">從註冊到獲得投資人的完整價值鏈</p>
            </div>
            <Card className="p-6">
              <div className="space-y-2">
                {VALUE_FLOW.map((step, i) => (
                  <FlowStep key={i} step={step} index={i} />
                ))}
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'roi' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">ROI 分析</h2>
              <p className="text-xs text-slate-400">使用 ESGGO 的投資回報分析</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                  <DollarSign size={14} className="text-emerald-500" />
                  成本比較
                </h3>
                <div className="space-y-4">
                  {[
                    { label: '傳統外包', cost: '$15,000', time: '3 個月', quality: '75/100' },
                    { label: 'ESGGO 專業版', cost: '$299/月', time: '15 分鐘', quality: '92/100' },
                    { label: 'ESGGO 企業版', cost: '$999/月', time: '15 分鐘', quality: '98/100' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-[#003262]">{item.label}</span>
                        <span className="text-sm font-black text-emerald-600">{item.cost}</span>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-slate-400">
                        <span>時間: {item.time}</span>
                        <span>品質: {item.quality}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                  <TrendingUp size={14} className="text-blue-500" />
                  價值增長
                </h3>
                <div className="space-y-4">
                  {[
                    { label: 'ESG 評級提升', from: 'BBB', to: 'AA', impact: '+15% 估值' },
                    { label: '募資成功率', from: '40%', to: '80%', impact: '+40%' },
                    { label: '盡調時間', from: '3 個月', to: '2 週', impact: '-60%' },
                    { label: '投資人信任', from: '65%', to: '95%', impact: '+30%' },
                  ].map((item) => (
                    <div key={item.label} className="bg-slate-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium text-slate-600">{item.label}</span>
                        <span className="text-[10px] font-bold text-emerald-600">
                          {item.impact}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-400">{item.from}</span>
                        <ArrowRight size={12} className="text-slate-300" />
                        <span className="font-bold text-[#003262]">{item.to}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* ─── CTA ─── */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備開始你的價值階梯？</h3>
          <p className="text-xs text-slate-400 mb-4">從免費開始，逐步升級，實現 ESG 目標</p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<Rocket size={16} />}
              className="bg-amber-600 hover:bg-amber-700 text-white"
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
