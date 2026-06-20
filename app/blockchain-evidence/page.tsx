'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  Link,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Play,
  Globe,
  Lock,
  Database,
  FileText,
  Copy,
  ExternalLink,
  Zap,
  Award,
  Search,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface BlockRecord {
  id: string;
  blockNumber: number;
  timestamp: string;
  dataHash: string;
  previousHash: string;
  data: string;
  status: 'confirmed' | 'pending';
  confirmations: number;
}

interface AnchoringStep {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  duration: string;
  details: string[];
}

/* ─── Data ─── */
const BLOCKCHAIN_RECORDS: BlockRecord[] = [
  {
    id: 'block-001',
    blockNumber: 18234567,
    timestamp: '2026-01-18T10:30:00+08:00',
    dataHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    previousHash: '0x3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    data: '碳排放數據 Q4 2025',
    status: 'confirmed',
    confirmations: 128,
  },
  {
    id: 'block-002',
    blockNumber: 18234566,
    timestamp: '2026-01-18T10:25:00+08:00',
    dataHash: '0x3a2b1c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    previousHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    data: '供應鏈數據 2025-12',
    status: 'confirmed',
    confirmations: 256,
  },
  {
    id: 'block-003',
    blockNumber: 18234565,
    timestamp: '2026-01-18T10:20:00+08:00',
    dataHash: '0x9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b',
    previousHash: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    data: '水資源數據 2025-12',
    status: 'confirmed',
    confirmations: 512,
  },
  {
    id: 'block-004',
    blockNumber: 18234568,
    timestamp: '2026-01-18T10:35:00+08:00',
    dataHash: '0x5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d',
    previousHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    data: '能源消耗數據 2025-12',
    status: 'pending',
    confirmations: 0,
  },
];

const ANCHORING_STEPS: AnchoringStep[] = [
  {
    id: 'step-01',
    title: '數據雜湊',
    description: '對 ESG 數據執行 SHA-256 雜湊運算',
    icon: Database,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    duration: '0.1s',
    details: ['SHA-256 演算法', '固定 64 字元輸出', '不可逆運算', '唯一性保證'],
  },
  {
    id: 'step-02',
    title: '證明生成',
    description: '使用 zk-SNARK 生成零知識證明',
    icon: Lock,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    duration: '1.2s',
    details: ['zk-SNARK 證明', '288 bytes 固定大小', '不揭露原始數據', '可驗證性'],
  },
  {
    id: 'step-03',
    title: '交易打包',
    description: '將雜湊與證明打包為區塊鏈交易',
    icon: FileText,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    duration: '0.5s',
    details: ['交易建構', 'Gas 費用計算', 'Nonce 設定', '數位簽章'],
  },
  {
    id: 'step-04',
    title: '區塊確認',
    description: '交易被礦工打包進區塊並獲得確認',
    icon: Globe,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    duration: '12s',
    details: ['礦工驗證', '區塊打包', '鏈上廣播', '確認數累積'],
  },
  {
    id: 'step-05',
    title: '錨定完成',
    description: '數據永久記錄在區塊鏈上，不可篡改',
    icon: Link,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    duration: '< 0.1s',
    details: ['永久存儲', '不可篡改', '全球可驗證', '時間戳記'],
  },
];

const BLOCKCHAIN_SPECS = [
  { label: '區塊鏈', value: 'Ethereum L2', description: '低成本高吞吐量' },
  { label: '共識機制', value: 'PoS', description: '權益證明' },
  { label: '區塊時間', value: '~12 秒', description: '平均出塊時間' },
  { label: '最終確認', value: '~15 分鐘', description: '128 個確認數' },
  { label: '雜湊演算法', value: 'SHA-256', description: '美國國家標準' },
  { label: '證明系統', value: 'zk-SNARK', description: '簡潔零知識證明' },
];

const TRUST_FEATURES = [
  {
    title: '不可篡改',
    description: '一旦寫入區塊鏈，數據無法被修改或刪除',
    icon: Lock,
    color: 'text-rose-600',
  },
  {
    title: '全球可驗證',
    description: '任何人都可以獨立驗證數據的真實性',
    icon: Globe,
    color: 'text-blue-600',
  },
  {
    title: '時間戳記',
    description: '每筆記錄都有精確的時間戳記，證明數據存在時間',
    icon: Clock,
    color: 'text-amber-600',
  },
  {
    title: '去中心化',
    description: '數據存儲在全球多個節點，無單點故障',
    icon: Database,
    color: 'text-emerald-600',
  },
];

/* ─── Components ─── */

function BlockRecordCard({ record }: { record: BlockRecord }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(record.dataHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        'bg-white rounded-xl border p-4 transition-all',
        record.status === 'confirmed' ? 'border-slate-100' : 'border-amber-200 bg-amber-50/30'
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
            record.status === 'confirmed' ? 'bg-emerald-50' : 'bg-amber-50'
          )}
        >
          {record.status === 'confirmed' ? (
            <CheckCircle2 size={18} className="text-emerald-500" />
          ) : (
            <Clock size={18} className="text-amber-500 animate-pulse" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#003262]">
                Block #{record.blockNumber.toLocaleString()}
              </span>
              <Badge variant={record.status === 'confirmed' ? 'success' : 'warning'} size="xs">
                {record.status === 'confirmed' ? '已確認' : '確認中'}
              </Badge>
            </div>
            <span className="text-[10px] text-slate-400">
              {new Date(record.timestamp).toLocaleString('zh-TW', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              })}
            </span>
          </div>
          <p className="text-xs text-slate-600 mb-2">{record.data}</p>
          <div className="bg-slate-50 rounded-lg p-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 shrink-0 w-14">Data Hash</span>
              <code className="text-[9px] font-mono text-cyan-600 truncate flex-1">
                {record.dataHash}
              </code>
              <button
                onClick={handleCopy}
                className="p-0.5 hover:bg-slate-100 rounded transition-colors shrink-0"
              >
                {copied ? (
                  <CheckCircle2 size={10} className="text-emerald-500" />
                ) : (
                  <Copy size={10} className="text-slate-400" />
                )}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[9px] text-slate-400 shrink-0 w-14">Prev Hash</span>
              <code className="text-[9px] font-mono text-slate-400 truncate flex-1">
                {record.previousHash.slice(0, 30)}...
              </code>
            </div>
          </div>
          {record.status === 'confirmed' && (
            <div className="mt-2 flex items-center gap-1">
              <CheckCircle2 size={10} className="text-emerald-500" />
              <span className="text-[9px] text-emerald-600 font-medium">
                {record.confirmations} 個確認
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function AnchoringStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: AnchoringStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;
  return (
    <div className="relative">
      {index < ANCHORING_STEPS.length - 1 && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-200 z-0" />
      )}
      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-xl border p-4 text-left hover:shadow-md transition-all',
            isExpanded ? 'border-cyan-200 shadow-md' : 'border-slate-100'
          )}
        >
          <div className="flex items-center gap-3">
            <div
              className={cn(
                'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
                step.bgColor
              )}
            >
              <Icon size={18} className={step.color} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-bold text-[#003262]">{step.title}</span>
                <span className="text-[9px] text-slate-400">{step.duration}</span>
              </div>
              <p className="text-[10px] text-slate-400 line-clamp-1">{step.description}</p>
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
              <div className="bg-white rounded-b-xl border border-t-0 border-slate-100 p-4 -mt-2">
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
                <div className="grid grid-cols-2 gap-2">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                      <span className="text-[10px] text-slate-600">{detail}</span>
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
export default function BlockchainEvidencePage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-01');
  const [activeTab, setActiveTab] = useState<'blocks' | 'process' | 'specs'>('blocks');

  const confirmedCount = BLOCKCHAIN_RECORDS.filter((r) => r.status === 'confirmed').length;
  const totalConfirmations = BLOCKCHAIN_RECORDS.reduce((sum, r) => sum + r.confirmations, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <Link size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">區塊鏈佐證</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Blockchain Evidence · 不可篡改 · 全球可驗證
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              通過區塊鏈技術，ESG
              數據被永久記錄在去中心化的分散式帳本上。每一筆數據都有唯一的雜湊值，
              並與前一筆數據形成鏈式結構，確保數據的不可篡改性與可追溯性。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '已確認區塊',
              value: confirmedCount,
              icon: CheckCircle2,
              color: 'text-emerald-600',
            },
            {
              label: '總確認數',
              value: totalConfirmations.toLocaleString(),
              icon: ShieldCheck,
              color: 'text-cyan-600',
            },
            { label: '區塊高度', value: '18,234,567', icon: Globe, color: 'text-blue-600' },
            { label: '平均出塊', value: '~12s', icon: Clock, color: 'text-amber-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={20} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'blocks' as const,
              label: '區塊記錄',
              icon: Database,
              count: BLOCKCHAIN_RECORDS.length,
            },
            {
              id: 'process' as const,
              label: '錨定流程',
              icon: Link,
              count: ANCHORING_STEPS.length,
            },
            {
              id: 'specs' as const,
              label: '技術規格',
              icon: Globe,
              count: BLOCKCHAIN_SPECS.length,
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
            
              {activeTab === 'blocks' && (
                <div
                  key="blocks"
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-bold text-[#003262] mb-1">區塊記錄</h2>
                      <p className="text-xs text-slate-400">所有已錨定的 ESG 數據區塊</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Search size={14} className="text-slate-400" />
                      <input
                        type="text"
                        placeholder="搜尋雜湊值..."
                        className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-40"
                      />
                    </div>
                  </div>
                  {BLOCKCHAIN_RECORDS.map((record) => (
                    <BlockRecordCard key={record.id} record={record} />
                  ))}
                </div>
              )}

              {activeTab === 'process' && (
                <div
                  key="process"
                >
                  <Card className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Link size={14} className="text-cyan-500" />
                      區塊鏈錨定流程
                    </h3>
                    <div className="space-y-3">
                      {ANCHORING_STEPS.map((step, i) => (
                        <AnchoringStepCard
                          key={step.id}
                          step={step}
                          index={i}
                          isExpanded={expandedStep === step.id}
                          onToggle={() =>
                            setExpandedStep(expandedStep === step.id ? null : step.id)
                          }
                        />
                      ))}
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-500">總處理時間</span>
                        <span className="text-sm font-black text-[#003262]">~15 秒</span>
                      </div>
                    </div>
                  </Card>
                </div>
              )}

              {activeTab === 'specs' && (
                <div
                  key="specs"
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-lg font-bold text-[#003262] mb-1">技術規格</h2>
                    <p className="text-xs text-slate-400">區塊鏈佐證的技術參數</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {BLOCKCHAIN_SPECS.map((spec) => (
                      <Card key={spec.label} className="p-4 text-center">
                        <p className="text-[10px] text-slate-400 font-medium">{spec.label}</p>
                        <p className="text-lg font-black text-[#003262] mt-1">{spec.value}</p>
                        <p className="text-[9px] text-slate-400 mt-0.5">{spec.description}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Trust Features */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">信任特性</h3>
              <div className="space-y-3">
                {TRUST_FEATURES.map((feature) => {
                  const Icon = feature.icon;
                  return (
                    <div key={feature.title} className="flex items-start gap-2">
                      <Icon size={14} className={cn('mt-0.5 shrink-0', feature.color)} />
                      <div>
                        <p className="text-xs font-medium text-[#003262]">{feature.title}</p>
                        <p className="text-[10px] text-slate-400">{feature.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Verify Button */}
            <Card className="p-4 bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">驗證區塊鏈記錄</h3>
              <p className="text-[11px] text-slate-500 mb-3">輸入雜湊值驗證數據是否在區塊鏈上</p>
              <input
                type="text"
                placeholder="0x..."
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono mb-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
              />
              <Button
                variant="primary"
                size="sm"
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                驗證
              </Button>
            </Card>

            {/* Explorer Link */}
            <Card className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">區塊鏈瀏覽器</h3>
              <p className="text-[11px] text-slate-400 mb-3">在區塊鏈瀏覽器上查看完整交易記錄</p>
              <a
                href="#"
                className="flex items-center gap-2 text-xs text-cyan-600 hover:text-cyan-800 font-medium"
              >
                <ExternalLink size={12} />在 Etherscan 上查看
              </a>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
