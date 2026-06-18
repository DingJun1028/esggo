'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Eye,
  Globe,
  Zap,
  Lock,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Play,
  Target,
  Award,
  FileText,
  RefreshCw,
  ExternalLink,
  Info,
  Star,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';
import { FIVE_T_PROTOCOL, FOUR_PLUS_ONE } from '@/shared/constants/protocol';

/* ─── Types ─── */
interface ProtocolDimension {
  id: string;
  code: string;
  name: string;
  zh: string;
  subtitle: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  checks: string[];
  status: 'pass' | 'fail' | 'pending';
  score: number;
}

/* ─── Data ─── */
const PROTOCOL_DIMENSIONS: ProtocolDimension[] = [
  {
    id: 'dim-01',
    code: 'T1',
    name: 'Tangible',
    zh: '真',
    subtitle: '可感知/具體化',
    description:
      '將抽象的永續願景轉化為具體的指標成果與實作項目。確保「善向」不再是空談，而是可被觀察與衡量的實體影響。',
    icon: Eye,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    checks: ['KPI 具體化檢查', '指標量化驗證', '成果可衡量性評估', '實體影響確認'],
    status: 'pass',
    score: 95,
  },
  {
    id: 'dim-02',
    code: 'T2',
    name: 'Traceable',
    zh: '善',
    subtitle: '可溯源',
    description:
      '鏈式日誌必須包含原始資料來源 (source_origin) 備註。確保每一筆數據都能回溯至其產生的起點。',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    checks: ['來源追溯驗證', '鏈式日誌完整性', 'source_origin 欄位檢查', '數據血緣追蹤'],
    status: 'pass',
    score: 98,
  },
  {
    id: 'dim-03',
    code: 'T3',
    name: 'Trackable',
    zh: '美',
    subtitle: '可追蹤',
    description: '利用生命週期 Hook 即時記錄數據在平台間的流轉路徑。實現數據全生命週期的動態監控。',
    icon: Zap,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    checks: ['生命週期追蹤', '數據流轉記錄', '平台間同步驗證', '動態監控確認'],
    status: 'pass',
    score: 92,
  },
  {
    id: 'dim-04',
    code: 'T4',
    name: 'Transparent',
    zh: '信',
    subtitle: '不可篡改',
    description:
      '數據寫入後即刻執行雜湊鎖定 (Hash Lock) 與 Object.freeze()。確保數據的終極真實性。（嚴禁使用 Immutable）',
    icon: Lock,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    checks: ['Hash Lock 驗證', 'SHA-256 雜湊鎖定', 'Object.freeze() 確認', '不可篡改證明'],
    status: 'pass',
    score: 87,
  },
  {
    id: 'dim-05',
    code: 'T5',
    name: 'Trustworthy',
    zh: '通',
    subtitle: '可透明驗算',
    description:
      '算法公式公開化（如 ISO-14064-1），且必須通過「零幻覺驗證」。消除黑箱，確保計算邏輯的透明度與準確性。',
    icon: ShieldCheck,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    checks: ['算法公式公開', '零幻覺驗證', 'ISO-14064-1 對齊', '計算邏輯透明度'],
    status: 'pass',
    score: 100,
  },
];

const VERIFICATION_PROCESS = [
  {
    step: '01',
    title: '數據提交',
    description: '用戶上傳 ESG 數據',
    duration: '< 1s',
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    step: '02',
    title: 'T1 驗證',
    description: '檢查數據是否具體化',
    duration: '0.3s',
    icon: Eye,
    color: 'text-cyan-600',
  },
  {
    step: '03',
    title: 'T2 驗證',
    description: '檢查來源是否可追溯',
    duration: '0.4s',
    icon: Globe,
    color: 'text-emerald-600',
  },
  {
    step: '04',
    title: 'T3 驗證',
    description: '檢查路徑是否可追蹤',
    duration: '0.3s',
    icon: Zap,
    color: 'text-blue-600',
  },
  {
    step: '05',
    title: 'T4 驗證',
    description: '執行 Hash Lock 封印',
    duration: '0.5s',
    icon: Lock,
    color: 'text-amber-600',
  },
  {
    step: '06',
    title: 'T5 驗證',
    description: '零幻覺驗證',
    duration: '0.5s',
    icon: ShieldCheck,
    color: 'text-violet-600',
  },
  {
    step: '07',
    title: '結果輸出',
    description: '生成驗證報告',
    duration: '< 0.1s',
    icon: Award,
    color: 'text-rose-600',
  },
];

const FOUR_PLUS_ONE_DATA = [
  { key: 'truth', label: '可感知', question: '指標是否已具體化？', passed: true },
  { key: 'goodness', label: '可溯源', question: '來源是否已標註？', passed: true },
  { key: 'beauty', label: '可追蹤', question: '路徑是否已紀錄？', passed: true },
  { key: 'trust', label: '不可篡改', question: '雜湊鎖定是否已完成？', passed: true },
  { key: 'transferful', label: '可透明驗算', question: '公式是否已公開且通過驗證？', passed: true },
];

const COMPLIANCE_FRAMEWORKS = [
  { name: 'GRI G4', status: 'aligned', score: 87, description: '全球報告倡議組織' },
  { name: 'SASB', status: 'aligned', score: 92, description: '永續會計準則委員會' },
  { name: 'TCFD', status: 'aligned', score: 78, description: '氣候相關財務揭露' },
  { name: 'ISSB', status: 'pending', score: 65, description: '國際永續準則委員會' },
];

/* ─── Components ─── */

function DimensionCard({
  dimension,
  index,
  isExpanded,
  onToggle,
}: {
  dimension: ProtocolDimension;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = dimension.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-lg transition-all"
    >
      <button onClick={onToggle} className="w-full p-5 text-left">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              'w-14 h-14 rounded-xl flex items-center justify-center shrink-0',
              dimension.bgColor
            )}
          >
            <Icon size={24} className={dimension.color} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-400">{dimension.code}</span>
              <h3 className="text-base font-bold text-[#003262]">{dimension.name}</h3>
              <span className="text-sm font-bold text-slate-400">({dimension.zh})</span>
            </div>
            <p className="text-xs text-slate-400">{dimension.subtitle}</p>
          </div>
          <div className="text-right shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-[#003262]">{dimension.score}</span>
              <OmniBadge
                variant={
                  dimension.status === 'pass'
                    ? 'success'
                    : dimension.status === 'fail'
                    ? 'error'
                    : 'warning'
                }
                size="xs"
              >
                {dimension.status === 'pass'
                  ? '通過'
                  : dimension.status === 'fail'
                  ? '未通過'
                  : '待補強'}
              </OmniBadge>
            </div>
          </div>
          {isExpanded ? (
            <ChevronDown size={16} className="text-slate-400 shrink-0" />
          ) : (
            <ChevronRight size={16} className="text-slate-400 shrink-0" />
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
            <div className="px-5 pb-5 border-t border-slate-50 pt-4">
              <p className="text-sm text-slate-500 leading-relaxed mb-4">{dimension.description}</p>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase">驗證項目</p>
                {dimension.checks.map((check, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span className="text-xs text-slate-600">{check}</span>
                  </div>
                ))}
              </div>
              {/* Score Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] text-slate-400">評分</span>
                  <span className="text-[10px] font-bold text-[#003262]">
                    {dimension.score}/100
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${dimension.score}%` }}
                    transition={{ duration: 0.8 }}
                    className={cn('h-full rounded-full', dimension.color.replace('text-', 'bg-'))}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProcessStep({ step, index }: { step: (typeof VERIFICATION_PROCESS)[0]; index: number }) {
  const Icon = step.icon;
  return (
    <div className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center border border-slate-200">
          <Icon size={16} className={step.color} />
        </div>
        {index < VERIFICATION_PROCESS.length - 1 && <div className="w-0.5 h-6 bg-slate-200 mt-2" />}
      </div>
      <div className="pt-2">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-xs font-bold text-[#003262]">{step.title}</span>
          <span className="text-[9px] text-slate-400">{step.duration}</span>
        </div>
        <p className="text-[10px] text-slate-400">{step.description}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FourTProtocolPage() {
  const [expandedDim, setExpandedDim] = useState<string | null>('dim-01');
  const [activeTab, setActiveTab] = useState<'dimensions' | 'process' | 'compliance'>('dimensions');

  const overallScore = Math.round(PROTOCOL_DIMENSIONS.reduce((sum, d) => sum + d.score, 0) / 5);
  const passedCount = PROTOCOL_DIMENSIONS.filter((d) => d.status === 'pass').length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <ShieldCheck size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">4T 協議驗證</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  4T Protocol Verification · 真善美信通
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              ESGGO 的 4T 協議（真善美信通）是數據誠信的核心框架。通過
              Tangible（真）、Traceable（善）、Trackable（美）、Transparent（信）、Trustworthy（通）
              五維度驗證，確保每一筆 ESG
              數據的真實性、可追溯性、可追蹤性、不可篡改性和可透明驗算性。
            </p>
            {/* 5T Strip */}
            <div className="max-w-md">
              <Protocol5TStrip status={[true, true, true, true, true]} showLabels size="lg" />
            </div>
          </div>
        </header>

        {/* ─── Overall Score ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '整體評分',
              value: `${overallScore}/100`,
              icon: Award,
              color: 'text-cyan-600',
            },
            {
              label: '通過維度',
              value: `${passedCount}/5`,
              icon: CheckCircle2,
              color: 'text-emerald-600',
            },
            { label: '驗證速度', value: '2.3s', icon: Zap, color: 'text-violet-600' },
            { label: '合規框架', value: '4/4', icon: Globe, color: 'text-amber-600' },
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
        <div className="flex gap-2">
          {[
            {
              id: 'dimensions' as const,
              label: '五維度驗證',
              icon: ShieldCheck,
              count: PROTOCOL_DIMENSIONS.length,
            },
            {
              id: 'process' as const,
              label: '驗證流程',
              icon: Zap,
              count: VERIFICATION_PROCESS.length,
            },
            {
              id: 'compliance' as const,
              label: '合規框架',
              icon: Globe,
              count: COMPLIANCE_FRAMEWORKS.length,
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
            <AnimatePresence mode="wait">
              {activeTab === 'dimensions' && (
                <motion.div
                  key="dimensions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">五維度驗證</h2>
                    <p className="text-xs text-slate-400">每個維度都有獨立的驗證邏輯與評分</p>
                  </div>
                  {PROTOCOL_DIMENSIONS.map((dim, i) => (
                    <DimensionCard
                      key={dim.id}
                      dimension={dim}
                      index={i}
                      isExpanded={expandedDim === dim.id}
                      onToggle={() => setExpandedDim(expandedDim === dim.id ? null : dim.id)}
                    />
                  ))}
                </motion.div>
              )}

              {activeTab === 'process' && (
                <motion.div
                  key="process"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Zap size={14} className="text-cyan-500" />
                      驗證流程
                    </h3>
                    <div className="space-y-2">
                      {VERIFICATION_PROCESS.map((step, i) => (
                        <ProcessStep key={i} step={step} index={i} />
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">總處理時間</span>
                        <span className="text-sm font-black text-[#003262]">2.3 秒</span>
                      </div>
                    </div>
                  </OmniBaseCard>
                </motion.div>
              )}

              {activeTab === 'compliance' && (
                <motion.div
                  key="compliance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">合規框架對齊</h2>
                    <p className="text-xs text-slate-400">4T 協議與國際 ESG 框架的對齊狀態</p>
                  </div>
                  {COMPLIANCE_FRAMEWORKS.map((framework, i) => (
                    <OmniBaseCard key={framework.name} className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h4 className="text-sm font-bold text-[#003262]">{framework.name}</h4>
                          <p className="text-[10px] text-slate-400">{framework.description}</p>
                        </div>
                        <OmniBadge
                          variant={framework.status === 'aligned' ? 'success' : 'warning'}
                          size="sm"
                        >
                          {framework.status === 'aligned' ? '已對齊' : '進行中'}
                        </OmniBadge>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${framework.score}%` }}
                            transition={{ duration: 0.8 }}
                            className={cn(
                              'h-full rounded-full',
                              framework.score >= 80
                                ? 'bg-emerald-500'
                                : framework.score >= 60
                                ? 'bg-amber-500'
                                : 'bg-rose-500'
                            )}
                          />
                        </div>
                        <span className="text-sm font-black text-[#003262] w-12 text-right">
                          {framework.score}%
                        </span>
                      </div>
                    </OmniBaseCard>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* 4+1 State */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Target size={14} className="text-emerald-500" />
                4可1不可狀態
              </h3>
              <div className="space-y-2">
                {FOUR_PLUS_ONE_DATA.map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                  >
                    {item.passed ? (
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-300 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <span className="text-xs font-medium text-slate-600">{item.label}</span>
                      <p className="text-[9px] text-slate-400 truncate">{item.question}</p>
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>

            {/* Quick Info */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Info size={14} className="text-blue-500" />
                快速資訊
              </h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">驗證協議</span>
                  <span className="font-bold text-[#003262]">4T (真善美信通)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">證明類型</span>
                  <span className="font-bold text-[#003262]">zk-SNARK</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">雜湊算法</span>
                  <span className="font-bold text-[#003262]">SHA-256</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">區塊鏈</span>
                  <span className="font-bold text-[#003262]">Ethereum L2</span>
                </div>
              </div>
            </OmniBaseCard>

            {/* CTA */}
            <OmniBaseCard className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">開始 4T 驗證</h3>
              <p className="text-[11px] text-slate-500 mb-3">
                上傳您的 ESG 數據，體驗 4T 協議自動驗證
              </p>
              <OmniButton
                variant="primary"
                size="sm"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                開始驗證
              </OmniButton>
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
