'use client';

import React, { useState } from 'react';

import {
  ShieldCheck,
  TrendingUp,
  Eye,
  Lock,
  Award,
  Users,
  Star,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  PieChart,
  Target,
  Globe,
  FileText,
  ChevronRight,
  Play,
  MessageSquare,
  Building2,
  DollarSign,
  LineChart,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Data ─── */
const TRUST_PILLARS = [
  {
    id: 'pillar-01',
    title: '數據可信度',
    subtitle: '5T 協議驗證',
    description:
      '通過 Tangible、Traceable、Trackable、Transparent、Trustworthy 五維度驗證，確保每一筆 ESG 數據的真實性與完整性。',
    icon: ShieldCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    metrics: [
      { label: '驗證通過率', value: '98.5%' },
      { label: '數據準確率', value: '99.2%' },
    ],
  },
  {
    id: 'pillar-02',
    title: '技術安全性',
    subtitle: 'ZKP + 區塊鏈',
    description:
      '零知識證明技術確保數據隱私，區塊鏈錨定確保不可篡改。投資人可以在不看到商業機密的情況下驗證數據真實性。',
    icon: Lock,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    metrics: [
      { label: '證明生成', value: '2.3s' },
      { label: '區塊鏈確認', value: '100%' },
    ],
  },
  {
    id: 'pillar-03',
    title: '合規透明度',
    subtitle: '多框架對齊',
    description: '自動對齊 GRI、SASB、TCFD、ISSB 等國際標準，確保報告符合投資人與監管機構的要求。',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    metrics: [
      { label: '框架覆蓋', value: '4/4' },
      { label: '合規評分', value: '87/100' },
    ],
  },
  {
    id: 'pillar-04',
    title: '即時可審計',
    subtitle: '透明數據溯源',
    description: '每一筆數據都有完整的溯源鏈，投資人可以隨時審計數據來源與計算過程。',
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    metrics: [
      { label: '溯源覆蓋', value: '100%' },
      { label: '審計響應', value: '< 1hr' },
    ],
  },
];

const INVESTOR_BENEFITS = [
  {
    title: '降低投資風險',
    desc: '經過驗證的 ESG 數據降低了資訊不對稱風險，投資決策更有依據。',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
  {
    title: '提升估值',
    desc: '高 ESG 評級的企業通常享有更高的市場估值，平均溢價 10-15%。',
    icon: DollarSign,
    color: 'text-blue-600',
  },
  {
    title: '加速募資',
    desc: '可信的 ESG 數據讓募資流程更順暢，平均縮短 30% 的盡職調查時間。',
    icon: LineChart,
    color: 'text-violet-600',
  },
  {
    title: '品牌信任',
    desc: '透明的 ESG 報告增強了企業品牌形象，提升投資人長期持有信心。',
    icon: Star,
    color: 'text-amber-600',
  },
];

const CASE_STUDIES = [
  {
    company: '綠色科技 A',
    industry: '製造業',
    result: '募資成功率 +40%',
    description:
      '通過 ESGGO 的 5T 驗證與 ZKP 證明，成功向國際投資人展示可信的 ESG 數據，募資成功率提升 40%。',
    metrics: [
      { label: 'ESG 評級', value: 'AA' },
      { label: '募資額', value: '$50M' },
      { label: '投資人', value: '12 家' },
    ],
    avatar: '🏭',
  },
  {
    company: '永續金融 B',
    industry: '金融業',
    result: '估值提升 15%',
    description:
      '使用 ESGGO 生成符合 TCFD 標準的氣候風險報告，ESG 評級從 BBB 提升至 AA，估值提升 15%。',
    metrics: [
      { label: 'ESG 評級', value: 'AA' },
      { label: '估值提升', value: '+15%' },
      { label: '報告時間', value: '15 min' },
    ],
    avatar: '🏦',
  },
  {
    company: '清潔能源 C',
    industry: '能源業',
    result: '盡調時間 -60%',
    description: '區塊鏈錨定的 ESG 數據讓盡職調查時間從 3 個月縮短到 2 週，大幅提升募資效率。',
    metrics: [
      { label: '盡調時間', value: '-60%' },
      { label: '數據驗證', value: '100%' },
      { label: '投資人滿意', value: '4.8/5' },
    ],
    avatar: '⚡',
  },
];

const INVESTOR_QUOTES = [
  {
    quote:
      '「ESGGO 的 ZKP 證明讓我們能夠在不揭露商業機密的情況下驗證數據真實性，這大大提升了我們的投資信心。」',
    author: '王投資總監',
    role: '某創投基金',
    avatar: '💼',
  },
  {
    quote: '「5T 驗證通過的數據讓我們可以放心投資，不再需要花費大量時間進行數據驗證。」',
    author: '李分析師',
    role: '投資銀行 ESG 部門',
    avatar: '📊',
  },
  {
    quote: '「區塊鏈錨定的 ESG 數據是募資過程中的遊戲規則改變者，大幅縮短了盡職調查時間。」',
    author: '張合夥人',
    role: '私募股權基金',
    avatar: '🏛️',
  },
];

const IMPACT_METRICS = [
  {
    label: '投資人信任度',
    value: '95%',
    description: '使用 ESGGO 後提升',
    icon: ShieldCheck,
    color: 'text-cyan-600',
  },
  {
    label: '募資成功率',
    value: '+40%',
    description: '平均提升幅度',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
  {
    label: '盡調時間',
    value: '-60%',
    description: '平均縮短比例',
    icon: Clock,
    color: 'text-violet-600',
  },
  {
    label: '估值溢價',
    value: '+15%',
    description: 'ESG 評級提升後',
    icon: DollarSign,
    color: 'text-amber-600',
  },
];

/* ─── Components ─── */

function PillarCard({ pillar, index }: { pillar: (typeof TRUST_PILLARS)[0]; index: number }) {
  const Icon = pillar.icon;
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            pillar.bgColor
          )}
        >
          <Icon size={24} className={pillar.color} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#003262]">{pillar.title}</h3>
          <p className="text-xs text-slate-400">{pillar.subtitle}</p>
        </div>
      </div>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">{pillar.description}</p>
      <div className="grid grid-cols-2 gap-2">
        {pillar.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[9px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CaseStudyCard({ study, index }: { study: (typeof CASE_STUDIES)[0]; index: number }) {
  return (
    <div
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{study.avatar}</span>
        <div>
          <h4 className="text-sm font-bold text-[#003262]">{study.company}</h4>
          <p className="text-[10px] text-slate-400">{study.industry}</p>
        </div>
        <div className="ml-auto">
          <Badge variant="success" size="sm">
            {study.result}
          </Badge>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">{study.description}</p>
      <div className="grid grid-cols-3 gap-2">
        {study.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[9px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function InvestorTrustPage() {
  const [activeTab, setActiveTab] = useState<'pillars' | 'cases' | 'quotes'>('pillars');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl breathing-glow-emerald" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg breathing-glow-emerald">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                  獲得投資人信任
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Investor Trust · 5T 驗證 · ZKP 證明 · 區塊鏈錨定
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              在 ESG 投資時代，投資人的信任是企業成功的關鍵。ESGGO 通過 5T
              協議驗證、零知識證明和區塊鏈錨定， 為企業建立不可篡改的 ESG
              數據信任體系，讓投資人放心投資。
            </p>
          </div>
        </header>

        {/* ─── Impact Metrics ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACT_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', metric.color)} />
                <p className="text-xl font-black text-[#003262]">{metric.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{metric.label}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">{metric.description}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Trust Pillars ─── */}
        <div>
          <h2 className="text-lg font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Target size={18} className="text-emerald-500" />
            四大信任支柱
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TRUST_PILLARS.map((pillar, i) => (
              <PillarCard key={pillar.id} pillar={pillar} index={i} />
            ))}
          </div>
        </div>

        {/* ─── Investor Benefits ─── */}
        <Card className="p-6">
          <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-emerald-500" />
            投資人核心效益
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {INVESTOR_BENEFITS.map((benefit, i) => {
              const Icon = benefit.icon;
              return (
                <div
                  key={benefit.title}
                  className="bg-slate-50 rounded-xl p-4"
                >
                  <Icon size={20} className={cn('mb-2', benefit.color)} />
                  <h4 className="text-sm font-bold text-[#003262] mb-1">{benefit.title}</h4>
                  <p className="text-[11px] text-slate-500 leading-relaxed">{benefit.desc}</p>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'pillars' as const, label: '成功案例', icon: Award, count: CASE_STUDIES.length },
            {
              id: 'cases' as const,
              label: '投資人評價',
              icon: MessageSquare,
              count: INVESTOR_QUOTES.length,
            },
            { id: 'quotes' as const, label: '信任流程', icon: ShieldCheck },
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

        {/* ─── Tab Content ─── */}
        {activeTab === 'pillars' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">成功案例</h2>
              <p className="text-xs text-slate-400">企業如何通過 ESGGO 獲得投資人信任</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {CASE_STUDIES.map((study, i) => (
                <CaseStudyCard key={study.company} study={study} index={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'cases' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">投資人評價</h2>
              <p className="text-xs text-slate-400">來自投資人的真實回饋</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INVESTOR_QUOTES.map((quote, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} size={14} className="text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">
                    "{quote.quote}"
                  </p>
                  <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                    <span className="text-2xl">{quote.avatar}</span>
                    <div>
                      <p className="text-sm font-bold text-[#003262]">{quote.author}</p>
                      <p className="text-[10px] text-slate-400">{quote.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">信任建立流程</h2>
              <p className="text-xs text-slate-400">從數據上傳到投資人信任的完整流程</p>
            </div>
            <Card className="p-6">
              <div className="space-y-6">
                {[
                  {
                    step: '01',
                    title: '數據上傳',
                    desc: '企業上傳 ESG 數據至 ESGGO 平台',
                    icon: FileText,
                    color: 'text-blue-600',
                  },
                  {
                    step: '02',
                    title: '5T 驗證',
                    desc: 'AI 自動執行五維度協議驗證',
                    icon: ShieldCheck,
                    color: 'text-cyan-600',
                  },
                  {
                    step: '03',
                    title: 'ZKP 證明',
                    desc: '生成零知識證明，保護商業機密',
                    icon: Lock,
                    color: 'text-violet-600',
                  },
                  {
                    step: '04',
                    title: '區塊鏈錨定',
                    desc: '將證明寫入區塊鏈，確保不可篡改',
                    icon: Globe,
                    color: 'text-emerald-600',
                  },
                  {
                    step: '05',
                    title: '投資人驗證',
                    desc: '投資人可隨時驗證數據真實性',
                    icon: Eye,
                    color: 'text-amber-600',
                  },
                  {
                    step: '06',
                    title: '信任建立',
                    desc: '透明的數據流程建立長期信任',
                    icon: Award,
                    color: 'text-rose-600',
                  },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={cn(
                          'w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center'
                        )}
                      >
                        <item.icon size={18} className={item.color} />
                      </div>
                      {i < 5 && <div className="w-0.5 h-8 bg-slate-200 mt-2" />}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-bold text-[#003262]">{item.title}</h4>
                      <p className="text-xs text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ─── CTA ─── */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備建立投資人信任？</h3>
          <p className="text-xs text-slate-400 mb-4">
            使用 ESGGO 的 5T 驗證與 ZKP 證明，讓投資人放心投資
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<ShieldCheck size={16} />}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              開始建立信任
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

/* ─── Missing Icon ─── */
function Clock({ size, className }: { size?: number; className?: string }) {
  return <CheckCircle2 size={size} className={className} />;
}
