'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Link,
  Factory,
  Truck,
  Globe,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
  ChevronDown,
  Play,
  Target,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Users,
  Search,
  Filter,
  MapPin,
  Star,
  Zap,
  Clock,
  DollarSign,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface Supplier {
  id: string;
  name: string;
  location: string;
  category: string;
  esgScore: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'pending' | 'suspended';
  co2: number;
  lastAudit: string;
  verified: boolean;
}

interface IntegrationStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  duration: string;
  details: string[];
}

/* ─── Data ─── */
const SUPPLIERS: Supplier[] = [
  {
    id: 'sup-001',
    name: '供應商 A',
    location: '台灣',
    category: '原材料',
    esgScore: 92,
    riskLevel: 'low',
    status: 'active',
    co2: 1250,
    lastAudit: '2026-01-15',
    verified: true,
  },
  {
    id: 'sup-002',
    name: '供應商 B',
    location: '中國',
    category: '製造',
    esgScore: 78,
    riskLevel: 'medium',
    status: 'active',
    co2: 3400,
    lastAudit: '2026-01-10',
    verified: true,
  },
  {
    id: 'sup-003',
    name: '供應商 C',
    location: '越南',
    category: '物流',
    esgScore: 85,
    riskLevel: 'low',
    status: 'active',
    co2: 890,
    lastAudit: '2026-01-18',
    verified: true,
  },
  {
    id: 'sup-004',
    name: '供應商 D',
    location: '印度',
    category: '原材料',
    esgScore: 65,
    riskLevel: 'high',
    status: 'pending',
    co2: 5600,
    lastAudit: '2025-12-20',
    verified: false,
  },
  {
    id: 'sup-005',
    name: '供應商 E',
    location: '日本',
    category: '技術',
    esgScore: 95,
    riskLevel: 'low',
    status: 'active',
    co2: 420,
    lastAudit: '2026-01-12',
    verified: true,
  },
  {
    id: 'sup-006',
    name: '供應商 F',
    location: '韓國',
    category: '製造',
    esgScore: 72,
    riskLevel: 'medium',
    status: 'active',
    co2: 2100,
    lastAudit: '2026-01-08',
    verified: true,
  },
];

const INTEGRATION_STEPS: IntegrationStep[] = [
  {
    id: 'step-01',
    title: '供應商邀請',
    description: '邀請供應商加入 ESGGO 平台',
    icon: Users,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    duration: '1 天',
    details: ['發送邀請郵件', '供應商註冊', '帳號啟用'],
  },
  {
    id: 'step-02',
    title: '數據連接',
    description: '建立與供應商的數據連接',
    icon: Link,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    duration: '2 天',
    details: ['API 連接設定', '數據格式對映', '測試數據傳輸'],
  },
  {
    id: 'step-03',
    title: 'ESG 數據收集',
    description: '自動收集供應商的 ESG 數據',
    icon: BarChart3,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    duration: '3 天',
    details: ['碳排放數據', '能源使用數據', '勞工權益數據', '治理數據'],
  },
  {
    id: 'step-04',
    title: '風險評估',
    description: 'AI 自動評估供應商 ESG 風險',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    duration: '1 天',
    details: ['風險評分', '風險等級分類', '改善建議'],
  },
  {
    id: 'step-05',
    title: '持續監控',
    description: '即時監控供應商 ESG 表現',
    icon: ShieldCheck,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    duration: '持續',
    details: ['即時數據更新', '異常預警', '定期報告'],
  },
];

const RISK_DISTRIBUTION = [
  { level: '低風險', count: 3, percentage: 50, color: 'bg-emerald-500' },
  { level: '中風險', count: 2, percentage: 33, color: 'bg-amber-500' },
  { level: '高風險', count: 1, percentage: 17, color: 'bg-rose-500' },
  { level: '危急', count: 0, percentage: 0, color: 'bg-slate-300' },
];

const CATEGORY_BREAKDOWN = [
  { category: '原材料', count: 2, co2: 6850, icon: '🏭' },
  { category: '製造', count: 2, co2: 5500, icon: '⚙️' },
  { category: '物流', count: 1, co2: 890, icon: '🚚' },
  { category: '技術', count: 1, co2: 420, icon: '💻' },
];

const INTEGRATION_STATS = [
  {
    label: '供應商數量',
    value: '500+',
    description: '已整合',
    icon: Factory,
    color: 'text-blue-600',
  },
  {
    label: '數據透明度',
    value: '95%',
    description: '即時可見',
    icon: BarChart3,
    color: 'text-emerald-600',
  },
  {
    label: '風險降低',
    value: '-40%',
    description: '供應鏈風險',
    icon: ShieldCheck,
    color: 'text-cyan-600',
  },
  {
    label: '碳排追蹤',
    value: '100%',
    description: '覆蓋率',
    icon: Globe,
    color: 'text-violet-600',
  },
];

/* ─── Components ─── */

function SupplierCard({ supplier }: { supplier: Supplier }) {
  const riskConfig = {
    low: { label: '低風險', color: 'bg-emerald-50 text-emerald-600' },
    medium: { label: '中風險', color: 'bg-amber-50 text-amber-600' },
    high: { label: '高風險', color: 'bg-rose-50 text-rose-600' },
    critical: { label: '危急', color: 'bg-rose-100 text-rose-700' },
  };
  const risk = riskConfig[supplier.riskLevel];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
            <Factory size={18} className="text-slate-500" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[#003262]">{supplier.name}</h4>
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin size={10} className="text-slate-400" />
              <span className="text-[10px] text-slate-400">{supplier.location}</span>
              <span className="text-[10px] text-slate-300">·</span>
              <span className="text-[10px] text-slate-400">{supplier.category}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {supplier.verified && <CheckCircle2 size={14} className="text-emerald-500" />}
          <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', risk.color)}>
            {risk.label}
          </span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-[#003262]">{supplier.esgScore}</p>
          <p className="text-[8px] text-slate-400">ESG 評分</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-[#003262]">{supplier.co2.toLocaleString()}</p>
          <p className="text-[8px] text-slate-400">tCO₂e</p>
        </div>
        <div className="bg-slate-50 rounded-lg p-2 text-center">
          <p className="text-sm font-black text-[#003262]">{supplier.lastAudit.slice(5)}</p>
          <p className="text-[8px] text-slate-400">最後稽核</p>
        </div>
      </div>
    </motion.div>
  );
}

function IntegrationStepCard({
  step,
  index,
  isExpanded,
  onToggle,
}: {
  step: IntegrationStep;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const Icon = step.icon;
  return (
    <div className="relative">
      {index < INTEGRATION_STEPS.length - 1 && (
        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-slate-200 z-0" />
      )}
      <div className="relative z-10">
        <button
          onClick={onToggle}
          className={cn(
            'w-full bg-white rounded-xl border p-4 text-left hover:shadow-md transition-all',
            isExpanded ? 'border-blue-200 shadow-md' : 'border-slate-100'
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
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-white rounded-b-xl border border-t-0 border-slate-100 p-4 -mt-2">
                <p className="text-xs text-slate-500 leading-relaxed mb-3">{step.description}</p>
                <div className="space-y-1.5">
                  {step.details.map((detail, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 size={10} className="text-emerald-500 shrink-0" />
                      <span className="text-[10px] text-slate-600">{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function SupplyChainIntegrationPage() {
  const [expandedStep, setExpandedStep] = useState<string | null>('step-01');
  const [activeTab, setActiveTab] = useState<'suppliers' | 'integration' | 'risk'>('suppliers');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSuppliers = SUPPLIERS.filter(
    (s) =>
      !searchQuery ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalCo2 = SUPPLIERS.reduce((sum, s) => sum + s.co2, 0);
  const avgScore = Math.round(SUPPLIERS.reduce((sum, s) => sum + s.esgScore, 0) / SUPPLIERS.length);
  const verifiedCount = SUPPLIERS.filter((s) => s.verified).length;

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg breathing-glow">
                <Link size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">供應鏈整合</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Supply Chain Integration · ESG 數據透明化
                </p>
              </div>
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">
              將 ESG 數據管理擴展到整個供應鏈，實現供應商數據的自動收集、驗證與追蹤。 透過 AI
              風險評估與即時監控，降低供應鏈風險，提升整體 ESG 表現。
            </p>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {INTEGRATION_STATS.map((stat, i) => {
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
                <p className="text-[9px] text-slate-300 mt-0.5">{stat.description}</p>
              </motion.div>
            );
          })}
        </div>

        {/* ─── Summary Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <OmniBaseCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Factory size={18} className="text-blue-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">{SUPPLIERS.length}</p>
                <p className="text-[10px] text-slate-400">供應商總數</p>
              </div>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <Star size={18} className="text-emerald-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">{avgScore}</p>
                <p className="text-[10px] text-slate-400">平均 ESG 評分</p>
              </div>
            </div>
          </OmniBaseCard>
          <OmniBaseCard className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 rounded-lg">
                <Globe size={18} className="text-violet-600" />
              </div>
              <div>
                <p className="text-lg font-black text-[#003262]">{totalCo2.toLocaleString()}</p>
                <p className="text-[10px] text-slate-400">總碳排放 (tCO₂e)</p>
              </div>
            </div>
          </OmniBaseCard>
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            {
              id: 'suppliers' as const,
              label: '供應商列表',
              icon: Factory,
              count: SUPPLIERS.length,
            },
            {
              id: 'integration' as const,
              label: '整合流程',
              icon: Link,
              count: INTEGRATION_STEPS.length,
            },
            {
              id: 'risk' as const,
              label: '風險分析',
              icon: AlertTriangle,
              count: RISK_DISTRIBUTION.length,
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
              {activeTab === 'suppliers' && (
                <motion.div
                  key="suppliers"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold text-[#003262]">供應商列表</h2>
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="搜尋供應商..."
                          className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30 w-40"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredSuppliers.map((supplier) => (
                      <SupplierCard key={supplier.id} supplier={supplier} />
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'integration' && (
                <motion.div
                  key="integration"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <Link size={14} className="text-blue-500" />
                      供應鏈整合流程
                    </h3>
                    <div className="space-y-3">
                      {INTEGRATION_STEPS.map((step, i) => (
                        <IntegrationStepCard
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
                  </OmniBaseCard>
                </motion.div>
              )}

              {activeTab === 'risk' && (
                <motion.div
                  key="risk"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-4"
                >
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <AlertTriangle size={14} className="text-amber-500" />
                      風險分佈
                    </h3>
                    <div className="space-y-3">
                      {RISK_DISTRIBUTION.map((risk) => (
                        <div key={risk.level} className="flex items-center gap-3">
                          <span className="text-xs text-slate-600 w-16">{risk.level}</span>
                          <div className="flex-1 h-4 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${risk.percentage}%` }}
                              transition={{ duration: 0.8 }}
                              className={cn('h-full rounded-full', risk.color)}
                            />
                          </div>
                          <span className="text-xs font-bold text-[#003262] w-12 text-right">
                            {risk.count} 家
                          </span>
                          <span className="text-[10px] text-slate-400 w-12 text-right">
                            {risk.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  </OmniBaseCard>

                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <BarChart3 size={14} className="text-violet-500" />
                      類別分析
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {CATEGORY_BREAKDOWN.map((cat) => (
                        <div key={cat.category} className="bg-slate-50 rounded-lg p-3">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-lg">{cat.icon}</span>
                            <span className="text-xs font-bold text-[#003262]">{cat.category}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-slate-400">{cat.count} 家供應商</span>
                            <span className="font-bold text-[#003262]">
                              {cat.co2.toLocaleString()} t
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </OmniBaseCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-4">
            {/* Verified Suppliers */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">驗證狀態</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">已驗證</span>
                  <span className="text-sm font-bold text-emerald-600">
                    {verifiedCount}/{SUPPLIERS.length}
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(verifiedCount / SUPPLIERS.length) * 100}%` }}
                  />
                </div>
              </div>
            </OmniBaseCard>

            {/* Top Performers */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">表現最佳</h3>
              <div className="space-y-2">
                {[...SUPPLIERS]
                  .sort((a, b) => b.esgScore - a.esgScore)
                  .slice(0, 3)
                  .map((supplier, i) => (
                    <div
                      key={supplier.id}
                      className="flex items-center gap-2 p-2 bg-slate-50 rounded-lg"
                    >
                      <span
                        className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white',
                          i === 0 ? 'bg-amber-500' : i === 1 ? 'bg-slate-400' : 'bg-amber-700'
                        )}
                      >
                        {i + 1}
                      </span>
                      <span className="text-xs text-slate-600 flex-1">{supplier.name}</span>
                      <span className="text-xs font-bold text-[#003262]">{supplier.esgScore}</span>
                    </div>
                  ))}
              </div>
            </OmniBaseCard>

            {/* CTA */}
            <OmniBaseCard className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <h3 className="text-sm font-bold text-[#003262] mb-2">開始整合供應鏈</h3>
              <p className="text-[11px] text-slate-500 mb-3">邀請供應商加入，實現 ESG 數據透明化</p>
              <OmniButton
                variant="primary"
                size="sm"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                邀請供應商
              </OmniButton>
            </OmniBaseCard>
          </div>
        </div>
      </div>
    </div>
  );
}
