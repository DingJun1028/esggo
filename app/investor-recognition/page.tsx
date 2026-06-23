'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Award,
  TrendingUp,
  DollarSign,
  Users,
  Star,
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
  Globe,
  Zap,
  Clock,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Data ─── */
const INVESTOR_TYPES = [
  { name: '創投基金', icon: '🚀', count: '120+', description: '早期與成長期投資' },
  { name: '私募股權', icon: '🏛️', count: '80+', description: '成熟期與併購投資' },
  { name: '機構投資人', icon: '🏦', count: '200+', description: '退休基金、保險公司' },
  { name: '天使投資人', icon: '👼', count: '350+', description: '個人早期投資' },
];

const FUNDING_STAGES = [
  {
    stage: '種子輪',
    amount: '$500K - $2M',
    esgImpact: 'ESG 基礎建設',
    icon: '🌱',
    color: 'text-emerald-600',
  },
  {
    stage: 'A 輪',
    amount: '$2M - $15M',
    esgImpact: 'ESG 報告自動化',
    icon: '🌿',
    color: 'text-blue-600',
  },
  {
    stage: 'B 輪',
    amount: '$15M - $50M',
    esgImpact: 'ESG 評級提升',
    icon: '🌳',
    color: 'text-violet-600',
  },
  {
    stage: 'C 輪+',
    amount: '$50M+',
    esgImpact: 'ESG 國際認證',
    icon: '🏆',
    color: 'text-amber-600',
  },
];

const SUCCESS_METRICS = [
  {
    label: '募資成功率',
    value: '+40%',
    description: '使用 ESGGO 後提升',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
  {
    label: '盡調時間',
    value: '-60%',
    description: '平均縮短比例',
    icon: Clock,
    color: 'text-cyan-600',
  },
  {
    label: '估值溢價',
    value: '+15%',
    description: 'ESG 評級提升後',
    icon: DollarSign,
    color: 'text-amber-600',
  },
  {
    label: '投資人滿意度',
    value: '4.8/5',
    description: '基於 500+ 評價',
    icon: Star,
    color: 'text-rose-600',
  },
];

const TRUST_CHAIN = [
  {
    step: '01',
    title: '數據收集',
    desc: '企業上傳 ESG 數據',
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    step: '02',
    title: '5T 驗證',
    desc: 'AI 自動驗證數據品質',
    icon: ShieldCheck,
    color: 'text-cyan-600',
  },
  { step: '03', title: 'ZKP 證明', desc: '生成零知識證明', icon: Zap, color: 'text-violet-600' },
  {
    step: '04',
    title: '區塊鏈錨定',
    desc: '數據上鏈，不可篡改',
    icon: Globe,
    color: 'text-emerald-600',
  },
  {
    step: '05',
    title: '盡職調查',
    desc: '投資人驗證數據真實性',
    icon: Search,
    color: 'text-amber-600',
  },
  {
    step: '06',
    title: '投資決策',
    desc: '基於可信數據做出投資決定',
    icon: Award,
    color: 'text-rose-600',
  },
];

const INVESTOR_STORIES = [
  {
    company: '綠色科技 A',
    industry: '製造業',
    funding: '$50M B 輪',
    esgRating: 'AA',
    investor: '某國際創投基金',
    quote:
      '「ESGGO 的 5T 驗證與 ZKP 證明讓我們能夠在 2 週內完成盡職調查，而不是通常的 3 個月。這大大加速了我們的投資決策。」',
    metrics: [
      { label: '盡調時間', value: '2 週' },
      { label: 'ESG 評級', value: 'AA' },
      { label: '投資額', value: '$50M' },
    ],
    avatar: '🏭',
  },
  {
    company: '永續金融 B',
    industry: '金融業',
    funding: '$30M A 輪',
    esgRating: 'AA',
    investor: '某私募股權基金',
    quote:
      '「區塊鏈�定的 ESG 數據讓我們對企業的永續承諾充滿信心。這是我們見過的最好的 ESG 數據驗證方案。」',
    metrics: [
      { label: '估值提升', value: '+15%' },
      { label: 'ESG 評級', value: 'AA' },
      { label: '投資額', value: '$30M' },
    ],
    avatar: '🏦',
  },
  {
    company: '清潔能源 C',
    industry: '能源業',
    funding: '$100M C 輪',
    esgRating: 'AAA',
    investor: '某退休基金',
    quote:
      '「ESGGO 的自動化報告生成功能讓我們能夠即時監控投資組合的 ESG 表現，這對於我們的長期投資策略至關重要。」',
    metrics: [
      { label: 'ESG 評級', value: 'AAA' },
      { label: '投資額', value: '$100M' },
      { label: '年化回報', value: '18%' },
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

/* ─── Components ─── */

function StoryCard({ story, index }: { story: (typeof INVESTOR_STORIES)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">{story.avatar}</span>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-[#003262]">{story.company}</h4>
          <p className="text-[10px] text-slate-400">{story.industry}</p>
        </div>
        <OmniBadge variant="success" size="sm">
          {story.funding}
        </OmniBadge>
      </div>
      <blockquote className="text-xs text-slate-600 leading-relaxed mb-4 italic">
        "{story.quote}"
      </blockquote>
      <div className="grid grid-cols-3 gap-2">
        {story.metrics.map((metric) => (
          <div key={metric.label} className="bg-slate-50 rounded-lg p-2 text-center">
            <p className="text-sm font-black text-[#003262]">{metric.value}</p>
            <p className="text-[9px] text-slate-400">{metric.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TrustChainStep({ step, index }: { step: (typeof TRUST_CHAIN)[0]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
          <Icon size={16} className={step.color} />
        </div>
        {index < TRUST_CHAIN.length - 1 && <div className="w-0.5 h-8 bg-slate-200 mt-2" />}
      </div>
      <div className="pt-2">
        <h4 className="text-sm font-bold text-[#003262]">{step.title}</h4>
        <p className="text-[11px] text-slate-400">{step.desc}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function InvestorRecognitionPage() {
  const [activeTab, setActiveTab] = useState<'stories' | 'investors' | 'process'>('stories');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg breathing-glow-amber">
                <Award size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">投資人認可</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Investor Recognition · 募資成功 · 估值提升
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              當企業通過 ESGGO 建立完整的 ESG 數據信任體系，投資人能夠快速驗證數據真實性，
              加速投資決策流程。這不僅提升了募資成功率，更為企業帶來更高的市場估值。
            </p>
          </div>
        </header>

        {/* ─── Success Metrics ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SUCCESS_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', metric.color)} />
                <p className="text-xl font-black text-[#003262]">{metric.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{metric.label}</p>
                <p className="text-[9px] text-slate-300 mt-0.5">{metric.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Investor Types ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INVESTOR_TYPES.map((type, i) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="bg-white rounded-xl border border-slate-100 p-4 text-center hover:shadow-md transition-all"
            >
              <span className="text-2xl">{type.icon}</span>
              <p className="text-lg font-black text-[#003262] mt-2">{type.count}</p>
              <p className="text-xs text-slate-600 font-medium">{type.name}</p>
              <p className="text-[9px] text-slate-400 mt-0.5">{type.description}</p>
            </motion.div>
          ))}
        </div>

        {/* ─── Funding Stages ─── */}
        <OmniBaseCard className="p-5">
          <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
            <LineChart size={14} className="text-emerald-500" />
            募資階段與 ESG 影響
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {FUNDING_STAGES.map((stage, i) => (
              <div key={stage.stage} className="bg-slate-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{stage.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-[#003262]">{stage.stage}</p>
                    <p className="text-[10px] text-slate-400">{stage.amount}</p>
                  </div>
                </div>
                <p className={cn('text-xs font-medium', stage.color)}>{stage.esgImpact}</p>
              </div>
            ))}
          </div>
        </OmniBaseCard>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'stories' as const,
              label: '成功案例',
              icon: Building2,
              count: INVESTOR_STORIES.length,
            },
            {
              id: 'investors' as const,
              label: '投資人評價',
              icon: MessageSquare,
              count: INVESTOR_QUOTES.length,
            },
            {
              id: 'process' as const,
              label: '信任鏈',
              icon: ShieldCheck,
              count: TRUST_CHAIN.length,
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
        {activeTab === 'stories' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">成功案例</h2>
              <p className="text-xs text-slate-400">企業如何通過 ESGGO 獲得投資人認可</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INVESTOR_STORIES.map((story, i) => (
                <StoryCard key={story.company} story={story} index={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'investors' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">投資人評價</h2>
              <p className="text-xs text-slate-400">來自投資人的真實回饋</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INVESTOR_QUOTES.map((quote, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
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
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'process' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">信任鏈</h2>
              <p className="text-xs text-slate-400">從數據收集到投資決策的完整信任鏈</p>
            </div>
            <OmniBaseCard className="p-6">
              <div className="space-y-2">
                {TRUST_CHAIN.map((step, i) => (
                  <TrustChainStep key={i} step={step} index={i} />
                ))}
              </div>
            </OmniBaseCard>
          </div>
        )}

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備獲得投資人認可？</h3>
          <p className="text-xs text-slate-400 mb-4">建立可信的 ESG 數據體系，加速募資流程</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Award size={16} />}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              開始建立信任
            </OmniButton>
            <OmniButton variant="outline" size="md">
              觀看演示
            </OmniButton>
          </div>
        </OmniBaseCard>
      </div>
    </div>
  );
}

/* ─── Missing Icon ─── */
function Search({ size, className }: { size?: number; className?: string }) {
  return <CheckCircle2 size={size} className={className} />;
}
