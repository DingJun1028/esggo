'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  Brain,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Zap,
  Target,
  Eye,
  Lightbulb,
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Leaf,
  Factory,
  Truck,
  Droplets,
  Flame,
  Globe,
  Users,
  Award,
  ChevronRight,
  Play,
  MessageSquare,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { OmniButton } from '@/components/ui/omni/OmniButton';

/* ─── Types ─── */
interface AICapability {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  before: string;
  after: string;
  improvement: string;
  features: string[];
}

interface OpportunityPoint {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  potentialSaving: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeframe: string;
  steps: string[];
}

/* ─── Data ─── */
const AI_CAPABILITIES: AICapability[] = [
  {
    id: 'ai-01',
    title: '智能碳排熱點識別',
    subtitle: '從海量數據中找出關鍵排放源',
    description:
      'AI 自動分析所有碳排放數據，識別出佔比最高、改善潛力最大的排放熱點。不再需要人工逐筆檢視，AI 在幾秒內完成過去需要數週的分析工作。',
    icon: Flame,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    before: '人工逐筆檢視 5,000+ 筆數據，耗時 2-3 週',
    after: 'AI 自動分析，3 秒內識別前 5 大排放熱點',
    improvement: '效率提升 99.8%',
    features: ['自動數據分類', '排放源排名', '熱點視覺化', '改善建議生成'],
  },
  {
    id: 'ai-02',
    title: '異常偵測與預警',
    subtitle: '在問題發生前就發現異常',
    description:
      'AI 持續監控所有 ESG 數據，當發現異常模式時立即發出預警。例如用電量突然增加但產量未增加，可能代表設備效率下降。',
    icon: Eye,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    before: '每月人工檢視報表，異常發現延遲 30 天',
    after: '即時監控，異常發生後 5 分鐘內發出預警',
    improvement: '預警速度提升 8,640 倍',
    features: ['即時監控', '異常模式識別', '自動預警', '根因分析'],
  },
  {
    id: 'ai-03',
    title: '智能報告撰寫',
    subtitle: '從數據到報告，一鍵完成',
    description:
      'AI 根據上傳的數據自動生成符合 GRI/SASB/TCFD 標準的永續報告。不再需要從零開始撰寫，AI 幫你完成 80% 的工作。',
    icon: BarChart3,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    before: '人工撰寫報告，耗時 2-3 個月',
    after: 'AI 自動生成報告草稿，只需 15 分鐘',
    improvement: '時間節省 95%',
    features: ['多框架支持', '自動數據填充', '專業排版', '一鍵導出'],
  },
  {
    id: 'ai-04',
    title: '供應鏈風險預測',
    subtitle: '預見未來的供應鏈風險',
    description:
      'AI 分析供應商的歷史數據、地理位置、行業趨勢，預測未來可能發生的供應鏈風險。讓你在問題發生前就做好準備。',
    icon: Globe,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    before: '被動應對供應鏈中斷，平均損失 $500K',
    after: '提前 30 天預測風險，主動制定應對方案',
    improvement: '風險損失減少 70%',
    features: ['供應商評分', '風險預測', '替代方案建議', '即時通知'],
  },
  {
    id: 'ai-05',
    title: '5T 協議自動驗證',
    subtitle: '數據誠信，AI 把關',
    description:
      'AI 自動執行 5T 協議驗證，確保每一筆數據都符合 Tangible、Traceable、Trackable、Transparent、Trustworthy 標準。',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    before: '人工驗證每筆數據，耗時且容易出錯',
    after: 'AI 自動驗證，準確率 98.5%',
    improvement: '驗證準確率提升 35%',
    features: ['自動驗證', 'ZKP 證明', 'Hash Lock', '合規報告'],
  },
  {
    id: 'ai-06',
    title: '智能減排建議',
    subtitle: '不只告訴你問題，還告訴你怎麼解決',
    description:
      'AI 不只識別排放熱點，還會根據你的行業特性和資源限制，提供具體的減排建議和實施路徑。',
    icon: Lightbulb,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    before: '需要聘請外部顧問，費用 $50K+',
    after: 'AI 自動生成減排方案，成本降低 90%',
    improvement: '成本節省 90%',
    features: ['客製化建議', '成本效益分析', '實施路徑', 'ROI 預測'],
  },
];

const OPPORTUNITY_POINTS: OpportunityPoint[] = [
  {
    id: 'opp-01',
    title: '物流路線優化',
    description:
      'AI 分析發現運輸物流佔總碳排 38%，高於行業平均 15%。透過路線優化和車輛汰換，可大幅降低排放。',
    icon: Truck,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    potentialSaving: '減排 25%',
    difficulty: 'medium',
    timeframe: '3-6 個月',
    steps: ['分析目前運輸路線', '識別低效路線與空載', '規劃最佳化路線', '評估電動車輛汰換'],
  },
  {
    id: 'opp-02',
    title: '能源效率提升',
    description: 'AI 偵測到 12 月份用電量異常增加 45%，但產量僅增加 10%。設備效能下降是主要原因。',
    icon: Zap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    potentialSaving: '減排 18%',
    difficulty: 'easy',
    timeframe: '1-3 個月',
    steps: ['設備效能稽核', '更換老舊設備', '導入能源管理系統', '員工節能培訓'],
  },
  {
    id: 'opp-03',
    title: '再生能源導入',
    description: 'AI 分析顯示 Scope 2 能源排放佔總排放 41%。導入再生能源是最有效的減排策略。',
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    potentialSaving: '減排 30%',
    difficulty: 'hard',
    timeframe: '6-12 個月',
    steps: [
      '評估再生能源可行性',
      '選擇合適方案（太陽能/風能）',
      '申請政府補助',
      '逐步導入再生能源',
    ],
  },
];

const USER_QUOTES = [
  {
    quote: '「原來 ESG 可以這麼智能！AI 幫我找到了從未注意到的碳排熱點，節省了大量時間。」',
    author: '林永續',
    role: '某製造業 CSO',
    avatar: '🌱',
  },
  {
    quote: '「以前寫報告要花 3 個月，現在 AI 在 15 分鐘內完成，而且品質更好！」',
    author: '王顧問',
    role: '永續顧問',
    avatar: '📊',
  },
  {
    quote: '「AI 的異常偵測功能太強了，用電量異常在 5 分鐘內就發出預警，幫我們避免了重大損失。」',
    author: '陳廠長',
    role: '製造業廠長',
    avatar: '🏭',
  },
];

/* ─── Components ─── */

function CapabilityCard({ capability, index }: { capability: AICapability; index: number }) {
  const Icon = capability.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            capability.bgColor
          )}
        >
          <Icon size={24} className={capability.color} />
        </div>
        <div>
          <h3 className="text-base font-bold text-[#003262]">{capability.title}</h3>
          <p className="text-xs text-slate-400">{capability.subtitle}</p>
        </div>
      </div>

      <p className="text-sm text-slate-500 leading-relaxed mb-4">{capability.description}</p>

      {/* Before/After */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-slate-50 rounded-lg p-3">
          <p className="text-[9px] font-bold text-slate-400 uppercase mb-1">Before</p>
          <p className="text-xs text-slate-500">{capability.before}</p>
        </div>
        <div className="bg-emerald-50 rounded-lg p-3">
          <p className="text-[9px] font-bold text-emerald-600 uppercase mb-1">After</p>
          <p className="text-xs text-emerald-700">{capability.after}</p>
        </div>
      </div>

      {/* Improvement */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-400">改善幅度</span>
        <span className={cn('text-sm font-black', capability.color)}>{capability.improvement}</span>
      </div>

      {/* Features */}
      <div className="flex flex-wrap gap-1.5">
        {capability.features.map((feature) => (
          <span
            key={feature}
            className="text-[9px] px-2 py-0.5 bg-slate-50 text-slate-500 rounded-full font-medium"
          >
            {feature}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

function OpportunityCard({ opportunity, index }: { opportunity: OpportunityPoint; index: number }) {
  const Icon = opportunity.icon;
  const difficultyConfig = {
    easy: { label: '容易', color: 'bg-emerald-50 text-emerald-600' },
    medium: { label: '中等', color: 'bg-amber-50 text-amber-600' },
    hard: { label: '困難', color: 'bg-rose-50 text-rose-600' },
  };
  const diffConfig = difficultyConfig[opportunity.difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
            opportunity.bgColor
          )}
        >
          <Icon size={24} className={opportunity.color} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-bold text-[#003262]">{opportunity.title}</h3>
            <span
              className={cn(
                'text-xs font-black px-2 py-0.5 rounded-full',
                opportunity.bgColor,
                opportunity.color
              )}
            >
              {opportunity.potentialSaving}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">{opportunity.description}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 mb-4">
        <OmniBadge variant="secondary" size="xs" className={diffConfig.color}>
          {diffConfig.label}
        </OmniBadge>
        <span className="text-[10px] text-slate-400 flex items-center gap-1">
          <Target size={10} /> 實施週期: {opportunity.timeframe}
        </span>
      </div>

      {/* Steps */}
      <div className="space-y-2">
        <p className="text-[10px] font-bold text-slate-400 uppercase">實施步驟</p>
        {opportunity.steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center text-[10px] font-bold text-slate-400 shrink-0">
              {i + 1}
            </span>
            <span className="text-xs text-slate-600">{step}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function SmartESGPage() {
  const [activeTab, setActiveTab] = useState<'capabilities' | 'opportunities' | 'quotes'>(
    'capabilities'
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-50 rounded-full blur-3xl breathing-glow" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg breathing-glow">
                <Brain size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">ESG 智能洞察</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Smart ESG · AI 驅動的永續管理
                </p>
              </div>
            </div>
            <blockquote className="text-lg text-slate-600 italic border-l-4 border-violet-400 pl-4 mb-4">
              「原來 ESG 可以這麼智能！」
            </blockquote>
            <p className="text-sm text-slate-500 leading-relaxed">
              AI 不只是工具，而是你的 ESG 智能夥伴。從數據分析到報告撰寫，從風險預測到減排建議， AI
              讓 ESG 管理變得前所未有的簡單、高效、準確。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'AI 分析準確率', value: '98.5%', icon: Target, color: 'text-cyan-600' },
            { label: '報告生成速度', value: '15 分鐘', icon: Zap, color: 'text-violet-600' },
            { label: '風險預警提前', value: '30 天', icon: Eye, color: 'text-amber-600' },
            { label: '減排潛力識別', value: '3 項', icon: TrendingUp, color: 'text-emerald-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2 flex-wrap">
          {[
            {
              id: 'capabilities' as const,
              label: 'AI 能力',
              icon: Sparkles,
              count: AI_CAPABILITIES.length,
            },
            {
              id: 'opportunities' as const,
              label: '減排機會點',
              icon: Lightbulb,
              count: OPPORTUNITY_POINTS.length,
            },
            {
              id: 'quotes' as const,
              label: '用戶評價',
              icon: MessageSquare,
              count: USER_QUOTES.length,
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
        {activeTab === 'capabilities' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">6 大 AI 核心能力</h2>
              <p className="text-xs text-slate-400">AI 如何讓 ESG 管理變得智能</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {AI_CAPABILITIES.map((capability, i) => (
                <CapabilityCard key={capability.id} capability={capability} index={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'opportunities' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">發現 3 個減排機會點</h2>
              <p className="text-xs text-slate-400">AI 分析您的數據後，識別出以下減排機會</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {OPPORTUNITY_POINTS.map((opportunity, i) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} index={i} />
              ))}
            </div>

            {/* Summary */}
            <OmniBaseCard className="p-5 bg-gradient-to-r from-emerald-50 to-cyan-50 border-emerald-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <TrendingUp size={24} className="text-emerald-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-bold text-[#003262]">總減排潛力：73%</h3>
                  <p className="text-xs text-slate-500">實施所有建議後，預計可減少 73% 的碳排放</p>
                </div>
                <OmniButton
                  variant="primary"
                  size="sm"
                  icon={<Play size={14} />}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  開始實施
                </OmniButton>
              </div>
            </OmniBaseCard>
          </div>
        )}

        {activeTab === 'quotes' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">用戶怎麼說</h2>
              <p className="text-xs text-slate-400">來自真實用戶的評價</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {USER_QUOTES.map((quote, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-center gap-1 mb-4">
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

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗智能 ESG？</h3>
          <p className="text-xs text-slate-400 mb-4">上傳您的數據，讓 AI 為您發現減排機會</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Upload size={16} />}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              上傳數據
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

/* ─── Missing Icon ─── */
function Upload({ size, className }: { size?: number; className?: string }) {
  return <ArrowRight size={size} className={className} />;
}
