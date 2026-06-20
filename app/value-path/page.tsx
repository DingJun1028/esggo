// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Circle,
  UserPlus,
  Upload,
  ShieldCheck,
  FileText,
  Award,
  Globe,
  Zap,
  Target,
  BarChart3,
  Users,
  Leaf,
  Building2,
  Clock,
  Star,
  ChevronDown,
  ChevronRight,
  Play,
  Lock,
  Eye,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Badge } from '@/components/ui/v2/Input';
import { Button } from '@/components/ui/v2/Button';

/* ─── Types ─── */
interface JourneyStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  duration: string;
  outcomes: string[];
  metrics: { label: string; value: string; trend?: string }[];
  subSteps: { name: string; description: string; completed: boolean }[];
}

/* ─── Data ─── */
const JOURNEY_STEPS: JourneyStep[] = [
  {
    id: 'step-01',
    phase: 'Phase 1',
    title: '註冊與引導',
    description: '建立帳號、設定組織資訊、完成新手引導',
    icon: UserPlus,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    duration: '5 分鐘',
    outcomes: ['帳號建立完成', '組織資訊設定', '新手引導完成'],
    metrics: [
      { label: '註冊轉化率', value: '85%', trend: '+5%' },
      { label: '引導完成率', value: '92%', trend: '+3%' },
    ],
    subSteps: [
      { name: 'Email / Google SSO 註冊', description: '快速建立帳號', completed: true },
      { name: '組織資訊設定', description: '填寫公司基本資訊、行業類別', completed: true },
      { name: '新手引導', description: '互動式教學，了解系統核心功能', completed: true },
    ],
  },
  {
    id: 'step-02',
    phase: 'Phase 2',
    title: '數據收集',
    description: '上傳 ESG 數據、建立 Evidence Vault、AI 輔助整理',
    icon: Upload,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    duration: '1-2 天',
    outcomes: ['原始數據上傳', 'Evidence Vault 建立', '數據分類完成'],
    metrics: [
      { label: '數據上傳量', value: '2,847 筆', trend: '+12%' },
      { label: 'AI 分類準確率', value: '96%', trend: '+2%' },
    ],
    subSteps: [
      { name: '數據上傳', description: 'OCR 自動識別、Excel 批量導入、API 串接', completed: true },
      { name: 'Evidence Vault 建立', description: '原始數據留存、4T 協議驗證', completed: true },
      { name: 'AI 輔助整理', description: '數據分類、異常偵測、完整性檢查', completed: false },
    ],
  },
  {
    id: 'step-03',
    phase: 'Phase 3',
    title: '5T 驗證',
    description: '執行 5T 協議驗證、ZKP 封印、Hash Lock',
    icon: ShieldCheck,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    duration: '即時',
    outcomes: ['5T 協議通過', 'ZKP 證明生成', 'Hash Lock 完成'],
    metrics: [
      { label: '驗證通過率', value: '98.5%', trend: '+0.3%' },
      { label: '平均驗證時間', value: '2.3 秒', trend: '-0.5s' },
    ],
    subSteps: [
      { name: 'Tangible (真) 驗證', description: '數據具體化檢查', completed: false },
      { name: 'Traceable (善) 驗證', description: '來源可追溯驗證', completed: false },
      { name: 'Trackable (美) 驗證', description: '生命週期追蹤驗證', completed: false },
      { name: 'Transparent (信) 驗證', description: '算法透明驗證', completed: false },
      { name: 'Trustworthy (通) 驗證', description: 'ZKP 封印 + Hash Lock', completed: false },
    ],
  },
  {
    id: 'step-04',
    phase: 'Phase 4',
    title: 'AI 分析與洞察',
    description: 'Gemini 2.0 智能分析、CrewAI 多角度洞察、War Room 風險評估',
    icon: Zap,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    duration: '15-30 分鐘',
    outcomes: ['碳排熱點識別', '風險評估完成', '改進建議生成'],
    metrics: [
      { label: 'AI 分析準確率', value: '94%', trend: '+2%' },
      { label: '風險識別率', value: '89%', trend: '+5%' },
    ],
    subSteps: [
      { name: '自動碳盤查', description: 'Scope 1/2/3 計算、熱點識別', completed: false },
      { name: '合規性檢查', description: 'GRI/SASB/TCFD 框架檢查', completed: false },
      { name: 'AI 智能洞察', description: 'Gemini 2.0 分析、多角度洞察', completed: false },
      { name: 'War Room 風險評估', description: '供應鏈風險掃描、PESTEL 分析', completed: false },
    ],
  },
  {
    id: 'step-05',
    phase: 'Phase 5',
    title: '報告生成',
    description: 'AI 自動撰寫、多框架支持、一鍵導出',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    duration: '15-20 分鐘',
    outcomes: ['報告草稿生成', '人工審核完成', 'PDF/Excel 導出'],
    metrics: [
      { label: '報告生成速度', value: '15 分鐘', trend: '-5min' },
      { label: '用戶滿意度', value: '4.8/5', trend: '+0.2' },
    ],
    subSteps: [
      { name: '選擇報告模板', description: 'GRI/SASB/TCFD/ISSB 框架選擇', completed: false },
      { name: 'AI 自動撰寫', description: 'Gemini 2.0 生成報告草稿', completed: false },
      { name: '人工審核編輯', description: '協作評論、版本控制', completed: false },
      { name: '一鍵導出', description: 'PDF/Excel/HTML 多格式導出', completed: false },
    ],
  },
  {
    id: 'step-06',
    phase: 'Phase 6',
    title: '發布與認證',
    description: 'ZKP 驗證碼生成、柏克萊認證、社群分享',
    icon: Award,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    duration: '5 分鐘',
    outcomes: ['ZKP 驗證碼生成', '柏克萊認證取得', '社群分享完成'],
    metrics: [
      { label: '認證通過率', value: '95%', trend: '+3%' },
      { label: '社群分享率', value: '68%', trend: '+8%' },
    ],
    subSteps: [
      { name: 'ZKP 驗證碼', description: '生成可驗證的數位簽章', completed: false },
      { name: '柏克萊認證', description: '申請 Berkeley Haas 認證', completed: false },
      { name: '社群分享', description: '分享到社群村落、外部平台', completed: false },
      { name: '持續改進', description: '設定下期目標、追蹤進度', completed: false },
    ],
  },
];

const VALUE_METRICS = [
  {
    label: '時間節省',
    value: '70%',
    description: '相較於傳統 ESG 報告流程',
    icon: Clock,
    color: 'text-cyan-600',
  },
  {
    label: '成本降低',
    value: '60%',
    description: '減少人工數據收集與審核成本',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
  {
    label: '數據準確率',
    value: '98.5%',
    description: '5T 協議 + AI 驗證',
    icon: Target,
    color: 'text-amber-600',
  },
  {
    label: '用戶滿意度',
    value: '4.8/5',
    description: '基於 1,247 份用戶評價',
    icon: Star,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function JourneyStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: JourneyStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;
  const completedSubSteps = step.subSteps.filter((s) => s.completed).length;
  const progress = Math.round((completedSubSteps / step.subSteps.length) * 100);

  return (
    <div
      className="relative"
    >
      {/* Timeline Line */}
      {index < JOURNEY_STEPS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-slate-100 z-0" />
      )}

      <div className="relative z-10">
        {/* Header */}
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-2xl border p-5 text-left hover:shadow-lg transition-all',
            isExpanded ? 'border-cyan-200 shadow-md' : 'border-slate-100'
          )}
        >
          <div className="flex items-center gap-4">
            {/* Step Number & Icon */}
            <div
              className={cn(
                'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                step.bgColor
              )}
            >
              <Icon size={24} className={step.color} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase">{step.phase}</span>
                <span className="text-[10px] text-slate-300">·</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {step.duration}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#003262]">{step.title}</h3>
              <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
            </div>

            {/* Progress */}
            <div className="text-right shrink-0">
              <p className="text-lg font-black text-[#003262]">{progress}%</p>
              <p className="text-[9px] text-slate-400">
                {completedSubSteps}/{step.subSteps.length} 步驟
              </p>
            </div>

            {isExpanded ? (
              <ChevronDown size={16} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronRight size={16} className="text-slate-400 shrink-0" />
            )}
          </div>

          {/* Progress Bar */}
          <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div
              animate={{ width: `${progress}%` }}
              className={cn('h-full rounded-full', step.color.replace('text-', 'bg-'))}
            />
          </div>
        </button>

        {/* Expanded Content */}
        
          {isExpanded && (
            <div
              className="overflow-hidden"
            >
              <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 p-5 -mt-2 space-y-4">
                {/* Sub Steps */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-2">執行步驟</h4>
                  <div className="space-y-2">
                    {step.subSteps.map((sub, i) => (
                      <div key={i} className="flex items-center gap-2">
                        {sub.completed ? (
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                        ) : (
                          <Circle size={14} className="text-slate-300 shrink-0" />
                        )}
                        <span
                          className={cn(
                            'text-xs',
                            sub.completed ? 'text-slate-600' : 'text-slate-400'
                          )}
                        >
                          {sub.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Outcomes */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-2">預期成果</h4>
                  <div className="flex flex-wrap gap-2">
                    {step.outcomes.map((outcome) => (
                      <span
                        key={outcome}
                        className="text-[10px] px-2 py-1 bg-emerald-50 text-emerald-600 rounded-full font-medium"
                      >
                        ✓ {outcome}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="text-xs font-bold text-slate-600 mb-2">關鍵指標</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {step.metrics.map((metric) => (
                      <div key={metric.label} className="bg-slate-50 rounded-lg p-2">
                        <p className="text-sm font-black text-[#003262]">{metric.value}</p>
                        <p className="text-[9px] text-slate-400">{metric.label}</p>
                        {metric.trend && (
                          <span
                            className={cn(
                              'text-[9px] font-bold',
                              metric.trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-600'
                            )}
                          >
                            {metric.trend}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ValuePathPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-01');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <TrendingUp size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">價值實現路徑</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Value Path · 從註冊到認證的完整旅程
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              透過 ESGGO 的 6 階段價值實現路徑，企業可以快速完成 ESG 數據收集、5T 驗證、AI
              分析到報告生成的完整流程。 每個階段都有明確的執行步驟、預期成果與關鍵指標。
            </p>
          </div>
        </header>

        {/* ─── Value Metrics ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {VALUE_METRICS.map((metric, i) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center hover:shadow-md transition-all"
              >
                <Icon size={24} className={cn('mx-auto mb-2', metric.color)} />
                <p className="text-2xl font-black text-[#003262]">{metric.value}</p>
                <p className="text-xs text-slate-500 font-medium">{metric.label}</p>
                <p className="text-[9px] text-slate-400 mt-0.5">{metric.description}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Journey Steps ─── */}
        <div>
          <h2 className="text-lg font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Target size={18} className="text-cyan-500" />
            價值實現 6 步驟
          </h2>
          <div className="space-y-4">
            {JOURNEY_STEPS.map((step, i) => (
              <JourneyStepCard
                key={step.id}
                step={step}
                index={i}
                isExpanded={expandedStep === step.id}
                onToggle={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
              />
            ))}
          </div>
        </div>

        {/* ─── CTA ─── */}
        <Card className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備開始您的 ESG 之旅？</h3>
          <p className="text-xs text-slate-400 mb-4">
            註冊即可獲得 14 天免費試用，體驗完整價值實現路徑
          </p>
          <div className="flex items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              icon={<UserPlus size={16} />}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              立即註冊
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
