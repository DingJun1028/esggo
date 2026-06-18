'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LucideIcon,
  Zap,
  Upload,
  FileSpreadsheet,
  Brain,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Play,
  BarChart3,
  RefreshCw,
  Database,
  Filter,
  AlertTriangle,
  TrendingUp,
  Target,
  Cpu,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface ProcessingStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  duration: string;
  details: string[];
  status: 'completed' | 'processing' | 'pending';
}

interface DataQualityMetric {
  id: string;
  label: string;
  value: number;
  target: number;
  color: string;
}

/* ─── Data ─── */
const PROCESSING_STEPS: ProcessingStep[] = [
  {
    id: 'step-01',
    title: '數據接收',
    description: '自動接收上傳的 ESG 數據檔案',
    icon: Upload,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    duration: '< 1s',
    status: 'completed',
    details: ['支援 Excel/CSV/JSON/XML', '自動格式識別', '批次處理', '即時回饋'],
  },
  {
    id: 'step-02',
    title: '數據清洗',
    description: '自動清理數據中的錯誤與不一致',
    icon: Filter,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    duration: '2s',
    status: 'completed',
    details: ['空值處理', '格式標準化', '重複數據移除', '異常值標記'],
  },
  {
    id: 'step-03',
    title: '智能分類',
    description: 'AI 自動將數據分類到對應的 ESG 維度',
    icon: Brain,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    duration: '3s',
    status: 'completed',
    details: ['碳排放數據分類', '能源數據分類', '水資源數據分類', '社會面數據分類'],
  },
  {
    id: 'step-04',
    title: '異常偵測',
    description: 'AI 偵測數據中的異常模式與潛在問題',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    duration: '2s',
    status: 'completed',
    details: ['統計異常偵測', '趨勢異常偵測', '關聯性分析', '風險預警'],
  },
  {
    id: 'step-05',
    title: '數據驗證',
    description: '執行 5T 協議驗證數據品質',
    icon: ShieldCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    duration: '2.3s',
    status: 'completed',
    details: ['Tangible 驗證', 'Traceable 驗證', 'Trackable 驗證', 'Transparent 驗證'],
  },
  {
    id: 'step-06',
    title: '洞察生成',
    description: 'AI 自動生成數據洞察與建議',
    icon: TrendingUp,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    duration: '5s',
    status: 'completed',
    details: ['碳排熱點識別', '趨勢分析', '同業比較', '減排建議'],
  },
];

const DATA_QUALITY_METRICS: DataQualityMetric[] = [
  { id: 'quality-01', label: '數據完整性', value: 98.5, target: 95, color: 'bg-emerald-500' },
  { id: 'quality-02', label: '數據準確性', value: 99.2, target: 98, color: 'bg-blue-500' },
  { id: 'quality-03', label: '數據一致性', value: 97.8, target: 95, color: 'bg-violet-500' },
  { id: 'quality-04', label: '數據時效性', value: 100, target: 99, color: 'bg-amber-500' },
];

const PROCESSING_STATS = [
  { label: '處理速度', value: '10,000 筆/秒', icon: Zap, color: 'text-cyan-600' },
  { label: '準確率', value: '99.2%', icon: Target, color: 'text-emerald-600' },
  { label: '自動化率', value: '95%', icon: Cpu, color: 'text-violet-600' },
  { label: '支援格式', value: '4 種', icon: Layers, color: 'text-amber-600' },
];

const SUPPORTED_FORMATS = [
  { format: 'Excel (.xlsx)', description: '支援多工作表、公式計算', icon: '📊', supported: true },
  { format: 'CSV', description: '逗號分隔值檔案', icon: '📄', supported: true },
  { format: 'JSON', description: 'JavaScript 物件表示法', icon: '🔧', supported: true },
  { format: 'XML', description: '可擴展標記語言', icon: '📋', supported: true },
  { format: 'API', description: '即時 API 數據串接', icon: '🔌', supported: true },
  { format: 'OCR', description: '圖片/PDF 文字識別', icon: '📷', supported: true },
];

/* ─── Components ─── */

function ProcessingStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: ProcessingStep;
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
      {index < PROCESSING_STEPS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 to-emerald-200 z-0" />
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
                <span className="text-[10px] text-slate-400">{step.duration}</span>
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

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-b-2xl border border-t-0 border-slate-100 p-4 -mt-2">
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                      <span className="text-[11px] text-slate-600">{detail}</span>
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

function QualityBar({ metric }: { metric: DataQualityMetric }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-xs text-slate-600">{metric.label}</span>
        <span className="text-xs font-bold text-[#003262]">{metric.value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${metric.value}%` }}
          transition={{ duration: 0.8 }}
          className={cn('h-full rounded-full', metric.color)}
        />
      </div>
      <div className="flex items-center justify-between text-[9px] text-slate-400">
        <span>目標: {metric.target}%</span>
        <span className={metric.value >= metric.target ? 'text-emerald-600' : 'text-amber-600'}>
          {metric.value >= metric.target ? '✓ 達標' : '未達標'}
        </span>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function AutoDataProcessingPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-01');
  const [activeTab, setActiveTab] = useState<'pipeline' | 'quality' | 'formats'>('pipeline');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStartProcessing = () => {
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg breathing-glow">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                  自動化數據處理
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Automated Data Processing · AI 驅動 · 全流程自動化
                </p>
              </div>
            </div>
            <OmniButton
              variant="primary"
              size="md"
              icon={
                isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Play size={14} />
              }
              onClick={handleStartProcessing}
              disabled={isProcessing}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              {isProcessing ? '處理中...' : '開始處理'}
            </OmniButton>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {PROCESSING_STATS.map((stat, i) => {
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
        <div className="flex gap-2">
          {[
            {
              id: 'pipeline' as const,
              label: '處理流程',
              icon: Zap,
              count: PROCESSING_STEPS.length,
            },
            {
              id: 'quality' as const,
              label: '數據品質',
              icon: Target,
              count: DATA_QUALITY_METRICS.length,
            },
            {
              id: 'formats' as const,
              label: '支援格式',
              icon: FileSpreadsheet,
              count: SUPPORTED_FORMATS.length,
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <OmniBaseCard className="p-5">
              {activeTab === 'pipeline' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Zap size={14} className="text-violet-500" />
                    自動化處理流程
                  </h3>
                  <div className="space-y-3">
                    {PROCESSING_STEPS.map((step, i) => (
                      <ProcessingStepCard
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

              {activeTab === 'quality' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Target size={14} className="text-emerald-500" />
                    數據品質指標
                  </h3>
                  <div className="space-y-4">
                    {DATA_QUALITY_METRICS.map((metric) => (
                      <QualityBar key={metric.id} metric={metric} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'formats' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <FileSpreadsheet size={14} className="text-blue-500" />
                    支援的數據格式
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {SUPPORTED_FORMATS.map((format) => (
                      <div
                        key={format.format}
                        className="bg-slate-50 rounded-xl p-4 flex items-center gap-3"
                      >
                        <span className="text-2xl">{format.icon}</span>
                        <div>
                          <p className="text-sm font-bold text-[#003262]">{format.format}</p>
                          <p className="text-[10px] text-slate-400">{format.description}</p>
                        </div>
                        {format.supported && (
                          <CheckCircle2 size={14} className="text-emerald-500 ml-auto shrink-0" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </OmniBaseCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Processing Status */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Database size={14} className="text-blue-500" />
                處理狀態
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">已處理</span>
                  <span className="text-sm font-bold text-[#003262]">12,847 筆</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">成功率</span>
                  <span className="text-sm font-bold text-emerald-600">99.2%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">平均處理時間</span>
                  <span className="text-sm font-bold text-[#003262]">2.3 秒</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">異常數據</span>
                  <span className="text-sm font-bold text-amber-600">23 筆</span>
                </div>
              </div>
            </OmniBaseCard>

            {/* Data Sources */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Layers size={14} className="text-violet-500" />
                數據來源
              </h3>
              <div className="space-y-2">
                {[
                  { name: 'ERP 系統', count: '5,200 筆', color: 'bg-blue-500' },
                  { name: 'IoT 感測器', count: '3,800 筆', color: 'bg-emerald-500' },
                  { name: '人工上傳', count: '2,100 筆', color: 'bg-amber-500' },
                  { name: 'API 串接', count: '1,747 筆', color: 'bg-violet-500' },
                ].map((source) => (
                  <div key={source.name} className="flex items-center gap-2">
                    <div className={cn('w-2 h-2 rounded-full', source.color)} />
                    <span className="text-xs text-slate-600 flex-1">{source.name}</span>
                    <span className="text-xs font-mono text-slate-400">{source.count}</span>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            {/* Quick Actions */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">快速操作</h3>
              <div className="space-y-2">
                {[
                  { label: '上傳數據', icon: Upload },
                  { label: '查看報告', icon: BarChart3 },
                  { label: '設定排程', icon: Clock },
                  { label: '匯出數據', icon: FileSpreadsheet },
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
            </OmniBaseCard>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗自動化數據處理？</h3>
          <p className="text-xs text-slate-400 mb-4">上傳您的數據，讓 AI 自動處理、分析與驗證</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Upload size={16} />}
              className="bg-violet-600 hover:bg-violet-700 text-white"
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
