'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Zap,
  Clock,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  Star,
  Download,
  Eye,
  Share2,
  ShieldCheck,
  Brain,
  BarChart3,
  PieChart,
  Target,
  Award,
  ChevronRight,
  ChevronDown,
  Play,
  Sparkles,
  Lightbulb,
  Users,
  MessageSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBaseCard';

/* ─── Types ─── */
interface ReportStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  details: string[];
  completed: boolean;
}

interface ReportTemplate {
  id: string;
  name: string;
  framework: string;
  description: string;
  sections: string[];
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}

/* ─── Data ─── */
const REPORT_STEPS: ReportStep[] = [
  {
    id: 'step-01',
    title: '選擇報告模板',
    description: '選擇適合的報告框架',
    duration: '1 分鐘',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    details: ['GRI G4 完整報告', 'SASB 行業報告', 'TCFD 氣候報告', 'ISSB 永續報告'],
    completed: true,
  },
  {
    id: 'step-02',
    title: 'AI 數據分析',
    description: 'AI 自動分析上傳的數據',
    duration: '3 分鐘',
    icon: Brain,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    details: ['碳排放計算', '數據品質檢查', '異常值識別', '趨勢分析'],
    completed: true,
  },
  {
    id: 'step-03',
    title: '5T 協議驗證',
    description: '自動執行數據誠信驗證',
    duration: '2 分鐘',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    details: [
      'Tangible (真) 驗證',
      'Traceable (善) 驗證',
      'Trackable (美) 驗證',
      'Transparent (信) 驗證',
      'Trustworthy (通) 驗證',
    ],
    completed: true,
  },
  {
    id: 'step-04',
    title: 'AI 內容生成',
    description: 'AI 自動撰寫報告內容',
    duration: '5 分鐘',
    icon: Sparkles,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    details: ['自動撰寫各章節', '數據圖表生成', '合規性檢查', '專業排版'],
    completed: true,
  },
  {
    id: 'step-05',
    title: '人工審核編輯',
    description: '用戶審核並微調報告內容',
    duration: '3 分鐘',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    details: ['內容審核', '數據確認', '格式調整', '最終定稿'],
    completed: false,
  },
  {
    id: 'step-06',
    title: '一鍵導出發布',
    description: '導出報告並分享',
    duration: '1 分鐘',
    icon: Download,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    details: ['PDF 導出', 'Excel 導出', 'HTML 線上版', '社群分享'],
    completed: false,
  },
];

const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-001',
    name: 'GRI G4 完整報告',
    framework: 'GRI',
    description: '全球報告倡議組織 G4 標準',
    sections: ['組織概況', '重大主題', '經濟面', '環境面', '社會面'],
    icon: FileText,
    color: 'text-emerald-600',
  },
  {
    id: 'tpl-002',
    name: 'SASB 行業報告',
    framework: 'SASB',
    description: '永續會計準則委員會',
    sections: ['行業指標', '財務影響', '風險管理'],
    icon: BarChart3,
    color: 'text-blue-600',
  },
  {
    id: 'tpl-003',
    name: 'TCFD 氣候報告',
    framework: 'TCFD',
    description: '氣候相關財務揭露',
    sections: ['治理', '策略', '風險管理', '指標與目標'],
    icon: TrendingUp,
    color: 'text-amber-600',
  },
  {
    id: 'tpl-004',
    name: 'ISSB 永續報告',
    framework: 'ISSB',
    description: '國際永續準則委員會',
    sections: ['一般要求', '氣候相關', '其他永續議題'],
    icon: Award,
    color: 'text-violet-600',
  },
];

const USER_STORY = {
  quote:
    '「我花了 3 個月寫的報告，AI 在 15 分鐘內完成了，而且品質更好！這完全改變了我對 ESG 報告的看法。」',
  author: '王顧問',
  role: '永續顧問',
  avatar: '📊',
  before: { time: '3 個月', cost: '$15,000', quality: '75/100' },
  after: { time: '15 分鐘', cost: '$500', quality: '92/100' },
};

const IMPACT_METRICS = [
  {
    label: '時間節省',
    value: '99%',
    description: '從 3 個月縮短到 15 分鐘',
    icon: Clock,
    color: 'text-cyan-600',
  },
  {
    label: '成本降低',
    value: '97%',
    description: '從 $15,000 降低到 $500',
    icon: TrendingUp,
    color: 'text-emerald-600',
  },
  {
    label: '品質提升',
    value: '+23%',
    description: 'AI 分析更全面準確',
    icon: Star,
    color: 'text-amber-600',
  },
  {
    label: '用戶滿意度',
    value: '4.8/5',
    description: '基於 856 份評價',
    icon: Users,
    color: 'text-rose-600',
  },
];

/* ─── Components ─── */

function StepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: ReportStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="relative"
    >
      {/* Timeline Line */}
      {index < REPORT_STEPS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-violet-200 z-0" />
      )}

      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-2xl border p-4 text-left hover:shadow-md transition-all',
            isExpanded ? 'border-blue-200 shadow-md' : 'border-slate-100'
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
              {step.completed && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-white" />
                </span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-[10px] font-bold text-slate-400">步驟 {index + 1}</span>
                <span className="text-[10px] text-slate-300">·</span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock size={10} />
                  {step.duration}
                </span>
              </div>
              <h3 className="text-sm font-bold text-[#003262]">{step.title}</h3>
              <p className="text-[11px] text-slate-400">{step.description}</p>
            </div>
            {isExpanded ? (
              <ChevronDown size={14} className="text-slate-400 shrink-0" />
            ) : (
              <ChevronRight size={14} className="text-slate-400 shrink-0" />
            )}
          </div>
        </button>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 p-4 -mt-2">
                <div className="space-y-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2
                        size={12}
                        className={step.completed ? 'text-emerald-500' : 'text-slate-300'}
                      />
                      <span
                        className={cn(
                          'text-xs',
                          step.completed ? 'text-slate-600' : 'text-slate-400'
                        )}
                      >
                        {detail}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function TemplateCard({ template }: { template: ReportTemplate }) {
  const Icon = template.icon;
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
          <Icon size={18} className={template.color} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-[#003262]">{template.name}</h4>
          <OmniBadge variant="secondary" size="xs">
            {template.framework}
          </OmniBadge>
        </div>
      </div>
      <p className="text-[10px] text-slate-400 mb-3">{template.description}</p>
      <div className="flex flex-wrap gap-1">
        {template.sections.map((section) => (
          <span
            key={section}
            className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded"
          >
            {section}
          </span>
        ))}
      </div>
    </motion.div>
  );
}

/* ─── Main Page ─── */
export default function ReportGenerationPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-01');
  const [activeTab, setActiveTab] = useState<'steps' | 'templates' | 'impact'>('steps');

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg breathing-glow">
                <FileText size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">首次報告生成</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Aha Moment · Day 15 · 15 分鐘完成報告
                </p>
              </div>
            </div>
            <blockquote className="text-lg text-slate-600 italic border-l-4 border-blue-400 pl-4 mb-4">
              「我花了 3 個月寫的報告，AI 在 15 分鐘內完成了，而且品質更好！」
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

        {/* ─── Before/After Comparison ─── */}
        <OmniBaseCard className="p-6">
          <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
            <Zap size={16} className="text-amber-500" />
            使用前 vs 使用後
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-slate-50 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                  <Clock size={16} className="text-slate-500" />
                </div>
                <h4 className="text-sm font-bold text-slate-600">Before</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">撰寫時間</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">外包成本</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">報告品質</span>
                  <span className="text-sm font-black text-slate-600">
                    {USER_STORY.before.quality}
                  </span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 size={16} className="text-emerald-600" />
                </div>
                <h4 className="text-sm font-bold text-emerald-700">After</h4>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">撰寫時間</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.time}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">使用成本</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.cost}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-emerald-600">報告品質</span>
                  <span className="text-sm font-black text-emerald-700">
                    {USER_STORY.after.quality}
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
              label: '生成步驟',
              icon: ChevronRight,
              count: REPORT_STEPS.length,
            },
            {
              id: 'templates' as const,
              label: '報告模板',
              icon: FileText,
              count: REPORT_TEMPLATES.length,
            },
            { id: 'impact' as const, label: '用戶影響', icon: Users },
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
        {activeTab === 'steps' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">報告生成 6 步驟</h2>
              <p className="text-xs text-slate-400">從選擇模板到導出發布，只需 15 分鐘</p>
            </div>
            <div className="space-y-3">
              {REPORT_STEPS.map((step, i) => (
                <StepCard
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

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">報告模板</h2>
              <p className="text-xs text-slate-400">選擇適合的報告框架，AI 自動生成內容</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {REPORT_TEMPLATES.map((template) => (
                <TemplateCard key={template.id} template={template} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#003262] mb-1">用戶影響</h2>
              <p className="text-xs text-slate-400">報告生成功能如何改變用戶的工作方式</p>
            </div>

            {/* Impact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <OmniBaseCard className="p-5">
                <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                  <Lightbulb size={14} className="text-amber-500" />
                  效率提升
                </h3>
                <ul className="space-y-2">
                  {[
                    '報告撰寫時間從 3 個月縮短到 15 分鐘',
                    'AI 自動完成 80% 的內容撰寫',
                    '數據分析自動化，不再需要人工計算',
                    '一鍵生成多格式報告',
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
                  <TrendingUp size={14} className="text-emerald-500" />
                  品質提升
                </h3>
                <ul className="space-y-2">
                  {[
                    'AI 分析更全面，遺漏率降低 90%',
                    '自動合規性檢查，確保符合標準',
                    '數據準確性提升至 98.5%',
                    '專業排版與視覺化圖表',
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
                  <Target size={14} className="text-blue-500" />
                  成本節省
                </h3>
                <ul className="space-y-2">
                  {[
                    '外包成本從 $15,000 降低到 $500',
                    '內部人力需求減少 70%',
                    '不再需要聘請外部顧問',
                    '報告更新成本降低 95%',
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
                  <Users size={14} className="text-violet-500" />
                  用戶回饋
                </h3>
                <div className="space-y-3">
                  {[
                    { quote: '「這完全改變了我對 ESG 報告的看法！」', author: '王顧問' },
                    { quote: '「終於可以把時間花在真正重要的事情上。」', author: '李永續' },
                    { quote: '「AI 生成的報告比我自己寫的還好。」', author: '張分析師' },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-xs text-slate-600 italic mb-1">"{item.quote}"</p>
                      <p className="text-[10px] text-slate-400">— {item.author}</p>
                    </div>
                  ))}
                </div>
              </OmniBaseCard>
            </div>
          </div>
        )}

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗 15 分鐘生成報告？</h3>
          <p className="text-xs text-slate-400 mb-4">上傳您的數據，讓 AI 為您生成專業永續報告</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<FileText size={16} />}
              className="bg-[#003262] hover:bg-[#002244] text-white"
            >
              開始生成報告
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
