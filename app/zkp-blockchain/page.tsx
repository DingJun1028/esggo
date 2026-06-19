'use client';

import React, { useState, useEffect } from 'react';

import {
  LucideIcon,
  Lock,
  ShieldCheck,
  Zap,
  CheckCircle2,
  Clock,
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
  Copy,
  Eye,
  Database,
  Link,
  Cpu,
  Fingerprint,
  Key,
  Hash,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface ZKPStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  status: 'completed' | 'processing' | 'pending';
  duration: string;
  details: string[];
}

interface BlockchainRecord {
  id: string;
  hash: string;
  timestamp: string;
  block: number;
  data: string;
  status: 'confirmed' | 'pending';
}

/* ─── Data ─── */
const ZKP_STEPS: ZKPStep[] = [
  {
    id: 'zkp-01',
    title: '數據預處理',
    description: '將原始數據轉換為零知識證明所需的格式',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    status: 'completed',
    duration: '0.3s',
    details: ['數據標準化', '格式轉換', '完整性檢查', '隱私數據脫敏'],
  },
  {
    id: 'zkp-02',
    title: '電路編譯',
    description: '將驗證邏輯編譯為算術電路',
    icon: Cpu,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    status: 'completed',
    duration: '0.5s',
    details: ['邏輯電路生成', '約束條件設定', '電路優化', '驗證金鑰生成'],
  },
  {
    id: 'zkp-03',
    title: '證明生成',
    description: '使用 zk-SNARK 生成零知識證明',
    icon: Key,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    status: 'completed',
    duration: '1.2s',
    details: ['zk-SNARK 證明計算', '證明壓縮', '驗證參數綁定', '證明有效性檢查'],
  },
  {
    id: 'zkp-04',
    title: '證明驗證',
    description: '驗證零知識證明的有效性',
    icon: ShieldCheck,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    status: 'completed',
    duration: '0.2s',
    details: ['證明解密驗證', '邏輯正確性檢查', '數據完整性確認', '驗證結果輸出'],
  },
  {
    id: 'zkp-05',
    title: '區塊鏈錨定',
    description: '將證明寫入區塊鏈，確保不可篡改',
    icon: Link,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    status: 'completed',
    duration: '0.8s',
    details: ['交易打包', '區塊確認', '鏈上存儲', '錨定完成通知'],
  },
];

const BLOCKCHAIN_RECORDS: BlockchainRecord[] = [
  {
    id: 'rec-001',
    hash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    timestamp: '2026-01-18T10:30:00+08:00',
    block: 18234567,
    data: '碳排放數據 Q4 2025',
    status: 'confirmed',
  },
  {
    id: 'rec-002',
    hash: '0x3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    timestamp: '2026-01-18T10:25:00+08:00',
    block: 18234566,
    data: '供應鏈數據 2025-12',
    status: 'confirmed',
  },
  {
    id: 'rec-003',
    hash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    timestamp: '2026-01-18T10:20:00+08:00',
    block: 18234565,
    data: '水資源數據 2025-12',
    status: 'confirmed',
  },
  {
    id: 'rec-004',
    hash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    timestamp: '2026-01-18T10:35:00+08:00',
    block: 18234568,
    data: '能源消耗數據 2025-12',
    status: 'pending',
  },
];

const ZKP_TECH_SPECS = [
  { label: '證明系統', value: 'zk-SNARK', description: '簡潔非交互式零知識證明' },
  { label: '曲線', value: 'BN254', description: '配對友好橢圓曲線' },
  { label: '證明大小', value: '288 bytes', description: '固定大小，與數據量無關' },
  { label: '驗證時間', value: '< 10ms', description: '常數時間驗證' },
  { label: '區塊鏈', value: 'Ethereum L2', description: '低成本高吞吐量' },
  { label: '加密強度', value: '128-bit', description: '軍事級加密安全' },
];

const USER_STORY = {
  quote:
    '「ZKP 證明讓我們的數據在不揭露商業機密的情況下，向投資者證明了數據的真實性。這是革命性的！」',
  author: '李技術長',
  role: '某科技公司 CTO',
  avatar: '🔐',
};

const IMPACT_METRICS = [
  {
    label: '證明生成',
    value: '2.3s',
    description: '從數據到 ZKP 證明',
    icon: Zap,
    color: 'text-cyan-600',
  },
  {
    label: '驗證時間',
    value: '<10ms',
    description: '常數時間驗證',
    icon: Clock,
    color: 'text-emerald-600',
  },
  {
    label: '證明大小',
    value: '288B',
    description: '固定大小',
    icon: FileText,
    color: 'text-violet-600',
  },
  {
    label: '不可篡改',
    value: '100%',
    description: '區塊鏈錨定',
    icon: Lock,
    color: 'text-amber-600',
  },
];

/* ─── Components ─── */

function ZKPStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: ZKPStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;

  return (
    <div
      className="relative"
    >
      {index < ZKP_STEPS.length - 1 && (
        <div className="absolute left-6 top-16 bottom-0 w-0.5 bg-gradient-to-b from-violet-200 to-cyan-200 z-0" />
      )}

      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-2xl border p-4 text-left hover:shadow-md transition-all',
            isExpanded ? 'border-violet-200 shadow-md' : 'border-slate-100'
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

        
          {isExpanded && (
            <div
              className="overflow-hidden"
            >
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

function BlockchainRecordRow({ record }: { record: BlockchainRecord }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(record.hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'flex items-center gap-3 py-3 border-b border-slate-50 last:border-0',
        record.status === 'pending' && 'opacity-60'
      )}
    >
      <div
        className={cn(
          'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
          record.status === 'confirmed' ? 'bg-emerald-50' : 'bg-amber-50'
        )}
      >
        {record.status === 'confirmed' ? (
          <CheckCircle2 size={14} className="text-emerald-500" />
        ) : (
          <RefreshCw size={14} className="text-amber-500 animate-spin" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <code className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded truncate max-w-[200px]">
            {record.hash.slice(0, 20)}...{record.hash.slice(-8)}
          </code>
          <button
            onClick={handleCopy}
            className="p-0.5 hover:bg-slate-50 rounded transition-colors"
          >
            {copied ? (
              <CheckCircle2 size={10} className="text-emerald-500" />
            ) : (
              <Copy size={10} className="text-slate-400" />
            )}
          </button>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span>Block #{record.block.toLocaleString()}</span>
          <span>·</span>
          <span>{record.data}</span>
        </div>
      </div>
      <span className="text-[10px] text-slate-400 shrink-0">
        {new Date(record.timestamp).toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })}
      </span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function ZKPBlockchainPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('zkp-01');
  const [activeTab, setActiveTab] = useState<'steps' | 'blockchain' | 'specs'>('steps');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1000px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg breathing-glow">
                <Lock size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">ZKP 證明生成</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Zero-Knowledge Proof · 區塊鏈錨定 · 不可篡改
                </p>
              </div>
            </div>
            <blockquote className="text-lg text-slate-600 italic border-l-4 border-violet-400 pl-4 mb-4">
              「ZKP
              證明讓我們的數據在不揭露商業機密的情況下，向投資者證明了數據的真實性。這是革命性的！」
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

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              {[
                { id: 'steps' as const, label: 'ZKP 流程', icon: Zap, count: ZKP_STEPS.length },
                {
                  id: 'blockchain' as const,
                  label: '區塊鏈記錄',
                  icon: Link,
                  count: BLOCKCHAIN_RECORDS.length,
                },
                {
                  id: 'specs' as const,
                  label: '技術規格',
                  icon: Cpu,
                  count: ZKP_TECH_SPECS.length,
                },
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
                        activeTab === tab.id
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-500'
                      )}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <OmniBaseCard className="p-5">
              {activeTab === 'steps' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-violet-500" />
                    ZKP 證明生成流程
                  </h3>
                  <div className="space-y-3">
                    {ZKP_STEPS.map((step, i) => (
                      <ZKPStepCard
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

              {activeTab === 'blockchain' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <Link size={14} className="text-cyan-500" />
                    區塊鏈錨定記錄
                  </h3>
                  <div className="divide-y divide-slate-50">
                    {BLOCKCHAIN_RECORDS.map((record) => (
                      <BlockchainRecordRow key={record.id} record={record} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'specs' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <Cpu size={14} className="text-violet-500" />
                    技術規格
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {ZKP_TECH_SPECS.map((spec) => (
                      <div key={spec.label} className="bg-slate-50 rounded-lg p-3">
                        <p className="text-[10px] text-slate-400 font-medium">{spec.label}</p>
                        <p className="text-sm font-black text-[#003262] mt-0.5">{spec.value}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{spec.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </OmniBaseCard>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Generate Button */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">快速操作</h3>
              <OmniButton
                variant="primary"
                size="md"
                icon={
                  isGenerating ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )
                }
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-violet-600 hover:bg-violet-700 text-white"
              >
                {isGenerating ? '生成中...' : '生成 ZKP 證明'}
              </OmniButton>
            </OmniBaseCard>

            {/* Current Proof */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Fingerprint size={14} className="text-violet-500" />
                當前證明
              </h3>
              <div className="bg-slate-900 rounded-lg p-3 font-mono text-[10px] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">✓</span>
                  <span className="text-slate-400">Status:</span>
                  <span className="text-emerald-400">Valid</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Proof:</span>
                  <span className="text-cyan-400 break-all">0x7f83...9069</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Block:</span>
                  <span className="text-amber-400">#18,234,567</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-violet-400">2.3s</span>
                </div>
              </div>
            </OmniBaseCard>

            {/* Security Level */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                安全等級
              </h3>
              <div className="space-y-2">
                {[
                  { label: '加密強度', value: '128-bit', percentage: 95 },
                  { label: '證明完整性', value: '100%', percentage: 100 },
                  { label: '區塊鏈確認', value: '6/6', percentage: 100 },
                  { label: '隱私保護', value: 'Zero-Knowledge', percentage: 100 },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] text-slate-500">{item.label}</span>
                      <span className="text-[10px] font-bold text-[#003262]">{item.value}</span>
                    </div>
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </OmniBaseCard>
          </div>
        </div>

        {/* ─── CTA ─── */}
        <OmniBaseCard className="p-6 text-center">
          <h3 className="text-lg font-bold text-[#003262] mb-2">準備體驗 ZKP 證明？</h3>
          <p className="text-xs text-slate-400 mb-4">上傳您的數據，生成不可篡改的零知識證明</p>
          <div className="flex items-center justify-center gap-3">
            <OmniButton
              variant="primary"
              size="md"
              icon={<Lock size={16} />}
              className="bg-violet-600 hover:bg-violet-700 text-white"
            >
              開始生成
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
