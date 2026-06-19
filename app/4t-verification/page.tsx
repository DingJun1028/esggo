'use client';

import React, { useState } from 'react';
// framer-motion 已移除，改用原生 CSS transition 避免 SSR 崩潰
import {
  LucideIcon,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Eye,
  Zap,
  Clock,
  Star,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Play,
  Target,
  Award,
  Globe,
  FileText,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface VerificationStep {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status: 'completed' | 'processing' | 'pending';
  details: string[];
}

interface TrustIndicator {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  color: string;
}

/* ─── Data ─── */
const VERIFICATION_STEPS: VerificationStep[] = [
  {
    id: 'verify-01',
    title: 'Tangible (真)',
    subtitle: '可感知/具體化',
    description:
      '將抽象的永續願景轉化為具體的指標成果與實作項目。確保「善向」不再是空談，而是可被觀察與衡量的實體影響。',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    status: 'completed',
    details: ['KPI 具體化檢查', '指標量化驗證', '成果可衡量性評估', '實體影響確認'],
  },
  {
    id: 'verify-02',
    title: 'Traceable (善)',
    subtitle: '可溯源',
    description:
      '鏈式日誌必須包含原始資料來源 (source_origin) 備註。確保每一筆數據都能回溯至其產生的起點。',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    status: 'completed',
    details: ['來源追溯驗證', '鏈式日誌完整性', 'source_origin 欄位檢查', '數據血緣追蹤'],
  },
  {
    id: 'verify-03',
    title: 'Trackable (美)',
    subtitle: '可追蹤',
    description: '利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。實現數據全生命週期的動態監控。',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'completed',
    details: ['生命週期追蹤', '數據流轉記錄', '平台間同步驗證', '動態監控確認'],
  },
  {
    id: 'verify-04',
    title: 'Transparent (信)',
    subtitle: '不可篡改',
    description:
      '數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。確保數據的終極真實性。',
    icon: Lock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    status: 'completed',
    details: ['Hash Lock 驗證', 'SHA-256 雜湊鎖定', 'Object.freeze() 確認', '不可篡改證明'],
  },
  {
    id: 'verify-05',
    title: 'Trustworthy (通)',
    subtitle: '可透明驗算',
    description:
      '算法公式公開化（如 ISO-14064-1），且必須通過「零幻覺驗證」。消除黑箱，確保計算邏輯的透明度與準確性。',
    icon: ShieldCheck,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    status: 'completed',
    details: ['算法公式公開', '零幻覺驗證', 'ISO-14064-1 對齊', '計算邏輯透明度'],
  },
];

const TRUST_INDICATORS: TrustIndicator[] = [
  {
    id: 'ind-01',
    label: '數據可信度',
    value: '98.5%',
    icon: ShieldCheck,
    color: 'text-emerald-600',
  },
  { id: 'ind-02', label: '驗證速度', value: '2.3 秒', icon: Zap, color: 'text-cyan-600' },
  { id: 'ind-03', label: 'Hash Lock', value: 'SHA-256', icon: Lock, color: 'text-amber-600' },
  { id: 'ind-04', label: 'ZKP 證明', value: '已生成', icon: Award, color: 'text-violet-600' },
];

const USER_STORY = {
  quote:
    '「看到那個綠色的 Trustworthy 標誌，我知道我們的數據現在是真正可信的。這對於我們向投資者和客戶展示 ESG 數據至關重要。」',
  author: '張財務長',
  role: '某金融業 CFO',
  avatar: '💼',
  before: { trust: '65%', verification: '人工', time: '2 週' },
  after: { trust: '98.5%', verification: 'AI 自動', time: '2.3 秒' },
};

const IMPACT_METRICS = [
  {
    label: '信任度提升',
    value: '+52%',
    description: '從 65% 提升到 98.5%',
    icon: ShieldCheck,
    color: 'text-emerald-600',
  },
  {
    label: '驗證速度',
    value: '2.3 秒',
    description: '從 2 週縮短到 2.3 秒',
    icon: Zap,
    color: 'text-cyan-600',
  },
  {
    label: '審計通過率',
    value: '100%',
    description: '外部審計一次通過',
    icon: CheckCircle2,
    color: 'text-amber-600',
  },
  {
    label: '付費轉化',
    value: '+45%',
    description: '信任度提升帶動轉化',
    icon: Star,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function VerificationStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: VerificationStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;

  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
      className="relative"
    >
      {/* Timeline Line */}
      {index < VERIFICATION_STEPS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-cyan-200 to-violet-200 z-0" />
      )}

      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-2xl border p-4 text-left hover:shadow-md transition-all',
            isExpanded ? 'border-cyan-200 shadow-md' : 'border-slate-100'
          )}
        >
          <div className="flex items-center gap-4">
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0 relative',
                step.bgColor
              )}
            >
              <Icon size={20} className={step.color} />
              {step.status === 'completed' && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm font-bold text-[#003262]">{step.title}</span>
                <span className="text-[10px] text-slate-400">·</span>
                <span className="text-[10px] text-slate-400">{step.subtitle}</span>
              </div>
              <p className="text-[11px] text-slate-400 line-clamp-1">{step.description}</p>
            </div>
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
            )}
          </div>
        </button>

        {/* 使用條件渲染取代 AnimatePresence，避免 SSR 崩潰 */}
        {isExpanded && (
          <div className="overflow-hidden" style={{ transition: 'all 0.3s ease' }}>
            <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 p-4 -mt-2">
              <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
              <div className="space-y-1.5">
                {step.details.map((detail, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-slate-600">{detail}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FourTVerificationPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('verify-01');
  const [activeTab, setActiveTab] = useState<'steps' | 'indicators' | 'impact'>('steps');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">4T 驗證通過</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Aha Moment · Day 20 · 數據獲得「不可篡改」認證
                </p>
              </div>
            </div>
            <blockquote className="text-lg text-slate-600 italic border-l-4 border-cyan-400 pl-4 mb-4">
              「看到那個綠色的 Trustworthy 標誌，我知道我們的數據現在是真正可信的。」
            </blockquote>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{USER_STORY.avatar}</span>
              <div>
                <p className="text-sm font-bold text-[#003262]">{USER_STORY.author}</p>
                <p className="text-[10px] text-slate-400">{USER_STORY.role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* ─── Impact Metrics ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {IMPACT_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              /* 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰 */
              <div
                key={metric.label}
                style={{ transition: 'all 0.4s ease' }}
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

        {/* ─── Before/After Comparison ─── */}
        <OmniBaseCard className="p-6">
          <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            使用前 vs 使用後
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-600">Before</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">數據可信度</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.trust}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">驗證方式</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.verification}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">驗證時間</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.time}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-emerald-700">After</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">數據可信度</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.trust}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">驗證方式</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.verification}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">驗證時間</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.time}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </OmniBaseCard>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'steps' as const,
              label: '驗證步驟',
              icon: ShieldCheck,
              count: VERIFICATION_STEPS.length,
            },
            {
              id: 'indicators' as const,
              label: '信任指標',
              icon: Award,
              count: TRUST_INDICATORS.length,
            },
            { id: 'impact' as const, label: '用戶影響', icon: Star },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={14} />
              {tab.label}
              {tab.count !== undefined && (
                <span
                  className={cn(
                    'w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center',
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
        {activeTab === 'steps' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">5T 協議驗證</h2>
              <p className="text-xs text-slate-400">
                每個維度都通過 AI 自動驗證，確保數據的完整性與可信度
              </p>
            </div>
            <div className="space-y-3">
              {VERIFICATION_STEPS.map((step, i) => (
                <VerificationStepCard
                  key={step.id}
                  step={step}
                  index={i}
                  isExpanded={expandedStep === step.id}
                  onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'indicators' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">信任指標</h2>
              <p className="text-xs text-slate-400">4T 驗證通過後的關鍵指標</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {TRUST_INDICATORS.map((indicator) => {
                const Icon = indicator.icon;
                return (
                  <OmniBaseCard key={indicator.id} className="p-4 text-center">
                    <Icon size={24} className={cn('mx-auto mb-2', indicator.color)} />
                    <p className="text-xl font-black text-[#003262]">{indicator.value}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{indicator.label}</p>
                  </OmniBaseCard>
                );
              })}
            </div>

            {/* Hash Lock Visualization */}
            <OmniBaseCard className="p-5">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Lock size={14} className="text-amber-500" />
                Hash Lock 封印狀態
              </h3>
              <div className="bg-slate-900 rounded-lg p-4 font-mono text-xs">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">Hash Lock:</span>
                  <span className="text-emerald-400">
                    0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">Algorithm:</span>
                  <span className="text-cyan-400">SHA-256</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">Timestamp:</span>
                  <span className="text-amber-400">2026-01-18T10:30:00+08:00</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400">Trustworthy (通)</span>
                </div>
              </div>
            </OmniBaseCard>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">用戶影響</h2>
              <p className="text-xs text-slate-400">4T 驗證通過如何改變用戶的工作方式</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-emerald-500" />
                  信任度提升
                </h3>
                <ul className="space-y-2">
                  {[
                    '數據可信度從 65% 提升到 98.5%',
                    '外部審計通過率 100%',
                    '投資者信心大幅提升',
                    '客戶滿意度顯著提高',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OmniBaseCard>

              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                  <Zap size={14} className="text-cyan-500" />
                  效率提升
                </h3>
                <ul className="space-y-2">
                  {[
                    '驗證時間從 2 週縮短到 2.3 秒',
                    '自動化驗證取代人工檢查',
                    '即時驗證結果通知',
                    '批次處理大量數據',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OmniBaseCard>

              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                  <Award size={14} className="text-amber-500" />
                  商業價值
                </h3>
                <ul className="space-y-2">
                  {[
                    '付費轉化率提升 45%',
                    '用戶留存率提升 32%',
                    '品牌信任度大幅提升',
                    '競爭優勢明顯增強',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OmniBaseCard>

              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                  <FileText size={14} className="text-violet-500" />
                  合規效益
                </h3>
                <ul className="space-y-2">
                  {[
                    '符合 GRI/SASB/TCFD 標準',
                    '通過 ISO 14064-1 驗證',
                    '滿足金管會永續報告要求',
                    '國際投資者認可',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-slate-600">
                      <CheckCircle2 size={12} className="text-emerald-500 mt-0.5 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </OmniBaseCard>
            </div>
          </div>
        )}

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗 4T 驗證？</h3>
          <p className="text-xs text-slate-400 mb-4">上傳您的數據，讓 AI 自動執行 5T 協議驗證</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<ShieldCheck size={16} />}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              開始驗證
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
