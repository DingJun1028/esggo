// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  FileText,
  Zap,
  Download,
  Eye,
  Share2,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Globe,
  BarChart3,
  PieChart,
  TrendingUp,
  Leaf,
  Users,
  Factory,
  ChevronRight,
  ChevronDown,
  Play,
  Star,
  ArrowRight,
  RefreshCw,
  Settings,
  Plus,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface ReportSection {
  id: string;
  name: string;
  status: 'completed' | 'generating' | 'pending';
  wordCount: number;
  progress: number;
}

interface GRIIndicator {
  id: string;
  code: string;
  title: string;
  status: 'pass' | 'fail' | 'pending';
  score: number;
}

/* ─── Data ─── */
const REPORT_SECTIONS: ReportSection[] = [
  { id: 'sec-01', name: '組織概況', status: 'completed', wordCount: 2500, progress: 100 },
  { id: 'sec-02', name: '重大主題分析', status: 'completed', wordCount: 3200, progress: 100 },
  { id: 'sec-03', name: '經濟面績效', status: 'completed', wordCount: 1800, progress: 100 },
  { id: 'sec-04', name: '環境面績效', status: 'pending', wordCount: 0, progress: 65 },
  { id: 'sec-05', name: '社會面績效', status: 'pending', wordCount: 0, progress: 0 },
  { id: 'sec-06', name: '治理面績效', status: 'pending', wordCount: 0, progress: 0 },
  { id: 'sec-07', name: '附錄與索引', status: 'pending', wordCount: 0, progress: 0 },
];

const GRI_INDICATORS: GRIIndicator[] = [
  { id: 'gri-001', code: 'GRI 2-1', title: '組織詳細資訊', status: 'pass', score: 95 },
  { id: 'gri-002', code: 'GRI 2-2', title: '永續報告書範疇', status: 'pass', score: 92 },
  { id: 'gri-003', code: 'GRI 2-3', title: '報告書期間與頻率', status: 'pass', score: 100 },
  { id: 'gri-004', code: 'GRI 3-1', title: '重大主題界定程序', status: 'pass', score: 88 },
  { id: 'gri-005', code: 'GRI 3-2', title: '重大主題清單', status: 'pass', score: 90 },
  { id: 'gri-006', code: 'GRI 201-1', title: '直接經濟價值創造與分配', status: 'pass', score: 85 },
  { id: 'gri-007', code: 'GRI 302-1', title: '組織內部能源消耗量', status: 'pass', score: 92 },
  { id: 'gri-008', code: 'GRI 305-1', title: '直接溫室氣體排放', status: 'pending', score: 0 },
  { id: 'gri-009', code: 'GRI 305-2', title: '能源間接溫室氣體排放', status: 'pending', score: 0 },
  { id: 'gri-010', code: 'GRI 401-1', title: '新進員工離職率', status: 'pending', score: 0 },
  { id: 'gri-011', code: 'GRI 403-1', title: '職業安全衛生管理系統', status: 'pending', score: 0 },
  { id: 'gri-012', code: 'GRI 413-1', title: '當地社區衝擊評估', status: 'fail', score: 45 },
];

const GENERATION_PIPELINE = [
  {
    id: 'pipe-01',
    name: '數據收集',
    description: '從 Evidence Vault 收集相關數據',
    status: 'completed',
    duration: '2s',
  },
  {
    id: 'pipe-02',
    name: '5T 驗證',
    description: '執行 5T 協議驗證',
    status: 'completed',
    duration: '3s',
  },
  {
    id: 'pipe-03',
    name: 'AI 分析',
    description: 'Gemini 2.0 智能分析',
    status: 'completed',
    duration: '5s',
  },
  {
    id: 'pipe-04',
    name: '內容生成',
    description: '自動撰寫報告內容',
    status: 'processing',
    duration: '8s',
  },
  { id: 'pipe-05', name: '格式排版', description: '專業排版與圖表生成', status: 'pending' },
  { id: 'pipe-06', name: '品質檢查', description: '零幻覺驗證與合規檢查', status: 'pending' },
  { id: 'pipe-07', name: 'Hash Lock', description: '執行 SHA-256 雜湊鎖定', status: 'pending' },
];

/* ─── Components ─── */

function SectionRow({ section }: { section: ReportSection }) {
  const statusConfig = {
    completed: {
      label: '已完成',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: CheckCircle2,
    },
    generating: { label: '生成中', color: 'text-blue-600', bg: 'bg-blue-50', icon: RefreshCw },
    pending: { label: '等待中', color: 'text-slate-400', bg: 'bg-slate-50', icon: Clock },
  };
  const config = statusConfig[section.status];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div
        className={cn('w-8 h-8 rounded-lg flex items-center justify-center shrink-0', config.bg)}
      >
        <StatusIcon size={14} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm font-medium text-[#003262]">{section.name}</span>
          <div className="flex items-center gap-2">
            {section.wordCount > 0 && (
              <span className="text-[10px] text-slate-400">
                {section.wordCount.toLocaleString()} 字
              </span>
            )}
            <span
              className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', config.bg, config.color)}
            >
              {config.label}
            </span>
          </div>
        </div>
        {section.status !== 'pending' && (
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              animate={{ width: `${section.progress}%` }}
              className={cn(
                'h-full rounded-full',
                section.status === 'completed' ? 'bg-emerald-500' : 'bg-blue-500'
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function GRIIndicatorRow({ indicator }: { indicator: GRIIndicator }) {
  const statusConfig = {
    pass: {
      label: '通過',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      barColor: 'bg-emerald-500',
    },
    fail: { label: '未通過', color: 'text-rose-600', bg: 'bg-rose-50', barColor: 'bg-rose-500' },
    pending: {
      label: '待補強',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      barColor: 'bg-amber-500',
    },
    generating: {
      label: '生成中',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      barColor: 'bg-blue-500',
    },
  };
  const config = statusConfig[indicator.status];

  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-slate-50 last:border-0">
      <code className="text-[10px] font-mono text-cyan-600 bg-cyan-50 px-1.5 py-0.5 rounded w-20 shrink-0">
        {indicator.code}
      </code>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-xs text-slate-600 truncate">{indicator.title}</span>
          <span
            className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', config.bg, config.color)}
          >
            {config.label}
          </span>
        </div>
        {indicator.score > 0 && (
          <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={cn('h-full rounded-full', config.barColor)}
              style={{ width: `${indicator.score}%` }}
            />
          </div>
        )}
      </div>
      {indicator.score > 0 && (
        <span className="text-xs font-mono font-bold text-[#003262] w-10 text-right">
          {indicator.score}
        </span>
      )}
    </div>
  );
}

function PipelineStep({ step, index }: { step: (typeof GENERATION_PIPELINE)[0]; index: number }) {
  const statusConfig = {
    completed: { color: 'text-emerald-500', bg: 'bg-emerald-50', icon: CheckCircle2 },
    processing: { color: 'text-blue-500', bg: 'bg-blue-50', icon: RefreshCw },
    pending: { color: 'text-slate-400', bg: 'bg-slate-50', icon: Clock },
  };
  const config = statusConfig[step.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <div className="flex items-center gap-3">
      <div
        className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', config.bg)}
      >
        <StatusIcon size={14} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={cn(
              'text-xs font-medium',
              step.status === 'pending' ? 'text-slate-400' : 'text-[#003262]'
            )}
          >
            {step.name}
          </span>
          {step.duration && (
            <span className="text-[9px] text-slate-300 font-mono">{step.duration}</span>
          )}
        </div>
        <p className="text-[10px] text-slate-400">{step.description}</p>
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function OneClickReportPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [activeTab, setActiveTab] = useState<'sections' | 'gri' | 'pipeline'>('sections');

  const completedSections = REPORT_SECTIONS.filter((s) => s.status === 'completed').length;
  const totalWordCount = REPORT_SECTIONS.reduce((sum, s) => sum + s.wordCount, 0);
  const griPassCount = GRI_INDICATORS.filter((g) => g.status === 'pass').length;
  const griAvgScore = Math.round(
    GRI_INDICATORS.filter((g) => g.score > 0).reduce((sum, g) => sum + g.score, 0) /
      GRI_INDICATORS.filter((g) => g.score > 0).length
  );

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => setIsGenerating(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1200px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-50 rounded-full blur-3xl breathing-glow-emerald" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg breathing-glow-emerald">
                <Zap size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">一鍵生成報告</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  One-Click Report · 符合 GRI 標準
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <OmniButton
                variant="outline"
                size="sm"
                icon={<Eye size={14} />}
                onClick={() => setShowPreview(true)}
              >
                預覽報告
              </OmniButton>
              <OmniButton
                variant="primary"
                size="sm"
                icon={<Zap size={14} />}
                onClick={handleGenerate}
                disabled={isGenerating}
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {isGenerating ? (
                  <RefreshCw size={14} className="animate-spin" />
                ) : (
                  <Zap size={14} />
                )}
                {isGenerating ? '生成中...' : '一鍵生成'}
              </OmniButton>
            </div>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '報告章節',
              value: `${completedSections}/${REPORT_SECTIONS.length}`,
              icon: FileText,
              color: 'text-blue-600',
            },
            {
              label: '總字數',
              value: totalWordCount.toLocaleString(),
              icon: BarChart3,
              color: 'text-violet-600',
            },
            {
              label: 'GRI 通過',
              value: `${griPassCount}/${GRI_INDICATORS.length}`,
              icon: ShieldCheck,
              color: 'text-emerald-600',
            },
            { label: '合規評分', value: `${griAvgScore}/100`, icon: Star, color: 'text-amber-600' },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-100 p-4 text-center"
              >
                <Icon size={18} className={cn('mx-auto mb-2', stat.color)} />
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Main Content ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Report Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-2">
              {[
                {
                  id: 'sections' as const,
                  label: '報告章節',
                  icon: FileText,
                  count: REPORT_SECTIONS.length,
                },
                {
                  id: 'gri' as const,
                  label: 'GRI 指標',
                  icon: Globe,
                  count: GRI_INDICATORS.length,
                },
                {
                  id: 'pipeline' as const,
                  label: '生成流程',
                  icon: Zap,
                  count: GENERATION_PIPELINE.length,
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
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <OmniBaseCard className="p-5">
              {activeTab === 'sections' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <FileText size={14} className="text-blue-500" />
                    報告章節進度
                  </h3>
                  <div className="divide-y divide-slate-50">
                    {REPORT_SECTIONS.map((section) => (
                      <SectionRow key={section.id} section={section} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'gri' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <Globe size={14} className="text-emerald-500" />
                    GRI G4 合規指標
                  </h3>
                  <div className="divide-y divide-slate-50">
                    {GRI_INDICATORS.map((indicator) => (
                      <GRIIndicatorRow key={indicator.id} indicator={indicator} />
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div>
                  <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    生成流程
                  </h3>
                  <div className="space-y-3">
                    {GENERATION_PIPELINE.map((step, i) => (
                      <PipelineStep key={step.id} step={step} index={i} />
                    ))}
                  </div>
                </div>
              )}
            </OmniBaseCard>
          </div>

          {/* Right: Actions & Preview */}
          <div className="space-y-4">
            {/* Quick Actions */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3">快速操作</h3>
              <div className="space-y-2">
                {[
                  { label: '下載 PDF', icon: Download, color: 'text-rose-600' },
                  { label: '下載 Excel', icon: BarChart3, color: 'text-emerald-600' },
                  { label: '分享報告', icon: Share2, color: 'text-blue-600' },
                  { label: '設定排程', icon: Clock, color: 'text-amber-600' },
                ].map((action) => (
                  <button
                    key={action.label}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left hover:bg-slate-50 transition-colors"
                  >
                    <action.icon size={14} className={action.color} />
                    <span className="text-xs font-medium text-slate-600">{action.label}</span>
                  </button>
                ))}
              </div>
            </OmniBaseCard>

            {/* Report Preview */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Eye size={14} className="text-cyan-500" />
                報告預覽
              </h3>
              <div className="bg-slate-50 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                {isGenerating ? (
                  <div className="text-center">
                    <RefreshCw size={32} className="text-emerald-500 animate-spin mx-auto mb-2" />
                    <p className="text-xs text-slate-500">AI 正在生成報告...</p>
                  </div>
                ) : (
                  <div className="text-center">
                    <FileText size={32} className="text-slate-200 mx-auto mb-2" />
                    <p className="text-xs text-slate-400">點擊「一鍵生成」開始</p>
                  </div>
                )}
              </div>
            </OmniBaseCard>

            {/* GRI Score */}
            <OmniBaseCard className="p-4">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <ShieldCheck size={14} className="text-emerald-500" />
                GRI 合規評分
              </h3>
              <div className="text-center mb-3">
                <p className="text-3xl font-black text-[#003262]">{griAvgScore}</p>
                <p className="text-[10px] text-slate-400">/ 100 分</p>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <p className="text-sm font-black text-emerald-600">{griPassCount}</p>
                  <p className="text-[9px] text-slate-400">通過</p>
                </div>
                <div className="p-2 bg-amber-50 rounded-lg">
                  <p className="text-sm font-black text-amber-600">
                    {GRI_INDICATORS.filter((g) => g.status === 'pending').length}
                  </p>
                  <p className="text-[9px] text-slate-400">待補強</p>
                </div>
                <div className="p-2 bg-rose-50 rounded-lg">
                  <p className="text-sm font-black text-rose-600">
                    {GRI_INDICATORS.filter((g) => g.status === 'fail').length}
                  </p>
                  <p className="text-[9px] text-slate-400">未通過</p>
                </div>
              </div>
            </OmniBaseCard>
          </div>
        </div>

        {/* ─── Preview Modal ─── */}
        
          {showPreview && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
              onClick={() => setShowPreview(false)}
            >
              <div
                className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#003262]">報告預覽</h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="p-1 hover:bg-slate-50 rounded-lg transition-colors"
                  >
                    <X size={18} className="text-slate-400" />
                  </button>
                </div>
                <div className="bg-slate-50 rounded-xl p-8 min-h-[400px]">
                  <div className="max-w-2xl mx-auto space-y-6">
                    <div className="text-center border-b border-slate-200 pb-6">
                      <h1 className="text-2xl font-black text-[#003262] mb-2">
                        2025 年度永續報告書
                      </h1>
                      <p className="text-sm text-slate-500">符合 GRI G4 標準</p>
                      <p className="text-xs text-slate-400 mt-1">
                        報告期間：2025 年 1 月 1 日至 12 月 31 日
                      </p>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#003262] mb-3">關於本報告</h2>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        本報告依據全球報告倡議組織（GRI）G4
                        標準編製，涵蓋本公司在經濟、環境、社會及治理面向的永續績效。 報告內容經過 5T
                        協議驗證，確保數據的真實性、可追溯性、可追蹤性、透明性與可信性。
                      </p>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-[#003262] mb-3">環境面績效亮點</h2>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-black text-emerald-600">-5.2%</p>
                          <p className="text-xs text-slate-500">碳排放較去年</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-black text-cyan-600">92.5%</p>
                          <p className="text-xs text-slate-500">能源效率</p>
                        </div>
                        <div className="bg-white rounded-lg p-4 text-center">
                          <p className="text-2xl font-black text-blue-600">-12%</p>
                          <p className="text-xs text-slate-500">用水量較去年</p>
                        </div>
                      </div>
                    </div>
                    <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-200">
                      <p>本報告由 ESGGO 平台 AI 自動生成，符合 GRI G4 標準</p>
                      <p className="mt-1">5T 協議驗證通過 · Hash Lock: 0xabc123...</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        
      </div>
    </div>
  );
}
