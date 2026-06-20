// @ts-nocheck
'use client';

import React, { useState } from 'react';

import {
  LucideIcon,
  FileText,
  Download,
  Eye,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  RefreshCw,
  Settings,
  Filter,
  Search,
  Plus,
  Trash2,
  Copy,
  Share2,
  Lock,
  Globe,
  TrendingUp,
  ShieldCheck,
  Zap,
  ChevronRight,
  BarChart3,
  PieChart,
  FileCheck,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/v2/Card';
import { Button } from '@/components/ui/v2/Button';
import { Badge } from '@/components/ui/v2/Input';

/* ─── Types ─── */
interface ReportTemplate {
  id: string;
  name: string;
  framework: 'GRI' | 'SASB' | 'TCFD' | 'ISSB' | 'Custom';
  description: string;
  icon: LucideIcon;
  color: string;
  sections: string[];
  estimatedTime: string;
}

interface ReportProject {
  id: string;
  name: string;
  framework: string;
  status: 'draft' | 'generating' | 'review' | 'completed' | 'error';
  progress: number;
  createdAt: string;
  updatedAt: string;
  author: string;
  sections: { name: string; status: 'pending' | 'generating' | 'completed'; wordCount: number }[];
}

interface GenerationStep {
  id: string;
  name: string;
  description: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  duration?: string;
}

/* ─── Mock Data ─── */
const REPORT_TEMPLATES: ReportTemplate[] = [
  {
    id: 'tpl-001',
    name: 'GRI G4 完整報告',
    framework: 'GRI',
    description: '全球報告倡議組織 G4 標準完整永續報告書',
    icon: Globe,
    color: 'text-emerald-600',
    sections: ['組織概況', '重大主題', '經濟面', '環境面', '社會面', '治理面'],
    estimatedTime: '15-20 分鐘',
  },
  {
    id: 'tpl-002',
    name: 'SASB 行業報告',
    framework: 'SASB',
    description: '永續會計準則委員會行業特定報告',
    icon: BarChart3,
    color: 'text-blue-600',
    sections: ['行業指標', '財務影響', '風險管理', '績效數據'],
    estimatedTime: '10-15 分鐘',
  },
  {
    id: 'tpl-003',
    name: 'TCFD 氣候報告',
    framework: 'TCFD',
    description: '氣候相關財務揭露工作小組報告',
    icon: TrendingUp,
    color: 'text-amber-600',
    sections: ['治理', '策略', '風險管理', '指標與目標'],
    estimatedTime: '8-12 分鐘',
  },
  {
    id: 'tpl-004',
    name: 'ISSB 永續報告',
    framework: 'ISSB',
    description: '國際永續準則委員會報告',
    icon: ShieldCheck,
    color: 'text-violet-600',
    sections: ['一般要求', '氣候相關', '其他永續議題'],
    estimatedTime: '12-18 分鐘',
  },
];

const REPORT_PROJECTS: ReportProject[] = [
  {
    id: 'rep-001',
    name: '2025 年度永續報告',
    framework: 'GRI G4',
    status: 'completed',
    progress: 100,
    createdAt: '2026-01-10',
    updatedAt: '2026-01-18',
    author: 'ESG Team',
    sections: [
      { name: '組織概況', status: 'completed', wordCount: 2500 },
      { name: '重大主題', status: 'completed', wordCount: 3200 },
      { name: '環境面', status: 'completed', wordCount: 4100 },
      { name: '社會面', status: 'completed', wordCount: 3800 },
    ],
  },
  {
    id: 'rep-002',
    name: 'Q4 氣候風險報告',
    framework: 'TCFD',
    status: 'generating',
    progress: 65,
    createdAt: '2026-01-15',
    updatedAt: '2026-01-18',
    author: 'CSO Office',
    sections: [
      { name: '治理', status: 'completed', wordCount: 1800 },
      { name: '策略', status: 'generating', wordCount: 0 },
      { name: '風險管理', status: 'pending', wordCount: 0 },
      { name: '指標與目標', status: 'pending', wordCount: 0 },
    ],
  },
  {
    id: 'rep-003',
    name: 'SASB 行業對比報告',
    framework: 'SASB',
    status: 'draft',
    progress: 20,
    createdAt: '2026-01-17',
    updatedAt: '2026-01-17',
    author: 'Analyst',
    sections: [
      { name: '行業指標', status: 'completed', wordCount: 1200 },
      { name: '財務影響', status: 'pending', wordCount: 0 },
      { name: '風險管理', status: 'pending', wordCount: 0 },
      { name: '績效數據', status: 'pending', wordCount: 0 },
    ],
  },
];

const GENERATION_STEPS: GenerationStep[] = [
  {
    id: 'step-001',
    name: '數據收集',
    description: '從 Evidence Vault 收集相關數據',
    status: 'completed',
    duration: '2s',
  },
  {
    id: 'step-002',
    name: '5T 驗證',
    description: '執行 5T 協議驗證',
    status: 'completed',
    duration: '3s',
  },
  {
    id: 'step-003',
    name: 'AI 分析',
    description: 'Gemini 2.0 智能分析',
    status: 'processing',
    duration: '5s',
  },
  { id: 'step-004', name: '內容生成', description: '自動撰寫報告內容', status: 'pending' },
  { id: 'step-005', name: '格式排版', description: '專業排版與圖表生成', status: 'pending' },
  { id: 'step-006', name: '品質檢查', description: '零幻覺驗證與合規檢查', status: 'pending' },
  { id: 'step-007', name: 'Hash Lock', description: '執行 SHA-256 雜湊鎖定', status: 'pending' },
];

/* ─── Components ─── */

function TemplateCard({ template, onSelect }: { template: ReportTemplate; onSelect: () => void }) {
  const Icon = template.icon;
  return (
    <div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg transition-all cursor-pointer group"
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={cn('p-3 rounded-xl bg-slate-50 group-hover:scale-110 transition-transform')}
        >
          <Icon size={20} className={template.color} />
        </div>
        <Badge variant="secondary" size="xs">
          {template.framework}
        </Badge>
      </div>
      <h3 className="text-base font-bold text-[#003262] mb-1">{template.name}</h3>
      <p className="text-xs text-slate-400 mb-3 line-clamp-2">{template.description}</p>
      <div className="flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-1 text-slate-400">
          <Clock size={10} />
          {template.estimatedTime}
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <FileText size={10} />
          {template.sections.length} 章節
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-slate-50 flex flex-wrap gap-1">
        {template.sections.slice(0, 3).map((section) => (
          <span
            key={section}
            className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded"
          >
            {section}
          </span>
        ))}
        {template.sections.length > 3 && (
          <span className="text-[9px] px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded">
            +{template.sections.length - 3}
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: ReportProject }) {
  const statusConfig = {
    draft: { label: '草稿', color: 'bg-slate-100 text-slate-500', icon: FileText },
    generating: { label: '生成中', color: 'bg-blue-50 text-blue-600', icon: Loader2 },
    review: { label: '審核中', color: 'bg-amber-50 text-amber-600', icon: Eye },
    completed: { label: '已完成', color: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
    error: { label: '錯誤', color: 'bg-rose-50 text-rose-600', icon: AlertTriangle },
  };
  const config = statusConfig[project.status];
  const StatusIcon = config.icon;

  return (
    <div
      whileHover={{ y: -2 }}
      className="bg-white rounded-xl border border-slate-100 p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-bold text-[#003262] truncate">{project.name}</h4>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {project.framework} · {project.author}
          </p>
        </div>
        <div
          className={cn(
            'flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold',
            config.color
          )}
        >
          <StatusIcon size={10} className={project.status === 'generating' ? 'animate-spin' : ''} />
          {config.label}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-[10px] mb-1">
          <span className="text-slate-400">進度</span>
          <span className="font-mono font-bold text-[#003262]">{project.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            animate={{ width: `${project.progress}%` }}
            className={cn(
              'h-full rounded-full',
              project.status === 'completed'
                ? 'bg-emerald-500'
                : project.status === 'generating'
                ? 'bg-blue-500'
                : project.status === 'error'
                ? 'bg-rose-500'
                : 'bg-slate-300'
            )}
          />
        </div>
      </div>

      {/* Sections */}
      <div className="flex flex-wrap gap-1.5">
        {project.sections.map((section) => (
          <div
            key={section.name}
            className={cn(
              'flex items-center gap-1 px-2 py-0.5 rounded text-[9px]',
              section.status === 'completed'
                ? 'bg-emerald-50 text-emerald-600'
                : section.status === 'generating'
                ? 'bg-blue-50 text-blue-600'
                : 'bg-slate-50 text-slate-400'
            )}
          >
            {section.status === 'completed' && <CheckCircle2 size={8} />}
            {section.status === 'generating' && <Loader2 size={8} className="animate-spin" />}
            {section.name}
            {section.wordCount > 0 && <span className="opacity-60">({section.wordCount})</span>}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-3 pt-2 border-t border-slate-50 flex items-center justify-between">
        <span className="text-[9px] text-slate-300">更新: {project.updatedAt}</span>
        <div className="flex items-center gap-1">
          {project.status === 'completed' && (
            <>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <Eye size={12} className="text-slate-400" />
              </button>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <Download size={12} className="text-slate-400" />
              </button>
              <button className="p-1 hover:bg-slate-50 rounded transition-colors">
                <Share2 size={12} className="text-slate-400" />
              </button>
            </>
          )}
          {project.status === 'generating' && (
            <button className="p-1 hover:bg-slate-50 rounded transition-colors">
              <RefreshCw size={12} className="text-slate-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function GenerationPanel({ steps }: { steps: GenerationStep[] }) {
  return (
    <Card className="p-5">
      <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
        <Sparkles size={16} className="text-amber-500" />
        生成進度
      </h3>
      <div className="space-y-3">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-center gap-3">
            <div
              className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center shrink-0',
                step.status === 'completed'
                  ? 'bg-emerald-50'
                  : step.status === 'processing'
                  ? 'bg-blue-50'
                  : step.status === 'error'
                  ? 'bg-rose-50'
                  : 'bg-slate-50'
              )}
            >
              {step.status === 'completed' ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : step.status === 'processing' ? (
                <Loader2 size={16} className="text-blue-500 animate-spin" />
              ) : step.status === 'error' ? (
                <AlertTriangle size={16} className="text-rose-500" />
              ) : (
                <span className="text-[10px] font-bold text-slate-400">{i + 1}</span>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h4
                  className={cn(
                    'text-xs font-bold',
                    step.status === 'completed'
                      ? 'text-emerald-600'
                      : step.status === 'processing'
                      ? 'text-blue-600'
                      : step.status === 'error'
                      ? 'text-rose-600'
                      : 'text-slate-400'
                  )}
                >
                  {step.name}
                </h4>
                {step.duration && (
                  <span className="text-[9px] text-slate-300 font-mono">{step.duration}</span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ─── Main Page ─── */
export default function ReportBuilderPage() {
  const [activeTab, setActiveTab] = useState<'templates' | 'projects' | 'generate'>('templates');
  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    setActiveTab('generate');
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 10000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-50 rounded-full blur-3xl breathing-glow-amber" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                <FileText size={24} className="text-amber-600" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">報告生成</h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Report Builder · AI 自動撰寫 · 一鍵導出
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" icon={<History size={14} />}>
                歷史記錄
              </Button>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                className="bg-[#003262] hover:bg-[#002244] text-white"
              >
                新增報告
              </Button>
            </div>
          </div>
        </header>

        {/* ─── Stats ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            {
              label: '已完成報告',
              value: '12',
              icon: CheckCircle2,
              color: 'text-emerald-600',
              trend: '+3',
            },
            { label: '生成中', value: '2', icon: Loader2, color: 'text-blue-600', trend: '' },
            {
              label: '總字數',
              value: '45.2K',
              icon: FileText,
              color: 'text-violet-600',
              trend: '+8.5K',
            },
            {
              label: '5T 驗證率',
              value: '98%',
              icon: ShieldCheck,
              color: 'text-cyan-600',
              trend: '+2%',
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white rounded-xl border border-slate-100 p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon size={16} className={stat.color} />
                  {stat.trend && (
                    <span className="text-[10px] font-bold text-emerald-600">{stat.trend}</span>
                  )}
                </div>
                <p className="text-xl font-black text-[#003262]">{stat.value}</p>
                <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'templates' as const, label: '報告模板', icon: FileCheck },
            { id: 'projects' as const, label: '我的報告', icon: FileText },
            { id: 'generate' as const, label: '生成進度', icon: Sparkles },
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
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'templates' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#003262]">選擇報告模板</h3>
                <p className="text-xs text-slate-400">選擇適合的框架模板，AI 將自動生成專業報告</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search
                    size={14}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="搜尋模板..."
                    className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-cyan-500/30"
                  />
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {REPORT_TEMPLATES.map((template) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  onSelect={() => setSelectedTemplate(template)}
                />
              ))}
            </div>

            {selectedTemplate && (
              <div
                className="mt-6 bg-white rounded-2xl border border-slate-100 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('p-2 rounded-lg bg-slate-50')}>
                      <selectedTemplate.icon size={20} className={selectedTemplate.color} />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-[#003262]">
                        {selectedTemplate.name}
                      </h4>
                      <p className="text-xs text-slate-400">{selectedTemplate.description}</p>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    size="md"
                    icon={<Sparkles size={14} />}
                    onClick={handleGenerate}
                    className="bg-[#003262] hover:bg-[#002244] text-white"
                  >
                    開始生成
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {selectedTemplate.sections.map((section) => (
                    <div
                      key={section}
                      className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-lg"
                    >
                      <CheckCircle2 size={12} className="text-slate-300" />
                      <span className="text-xs text-slate-600">{section}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#003262]">我的報告</h3>
              <div className="flex items-center gap-2">
                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Filter size={14} className="text-slate-400" />
                </button>
                <button className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <Search size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {REPORT_PROJECTS.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'generate' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="p-5">
                <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                  <FileText size={16} className="text-amber-500" />
                  {selectedTemplate?.name || '報告預覽'}
                </h3>
                <div className="bg-slate-50 rounded-xl p-8 min-h-[400px] flex items-center justify-center">
                  {isGenerating ? (
                    <div className="text-center">
                      <Loader2 size={48} className="text-cyan-500 animate-spin mx-auto mb-4" />
                      <p className="text-sm font-bold text-[#003262]">AI 正在生成報告...</p>
                      <p className="text-xs text-slate-400 mt-1">
                        預計完成時間: {selectedTemplate?.estimatedTime}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center">
                      <FileText size={48} className="text-slate-200 mx-auto mb-4" />
                      <p className="text-sm text-slate-400">選擇模板並點擊「開始生成」</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>
            <div>
              <GenerationPanel steps={GENERATION_STEPS} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── Missing Icon Component ─── */
function History({ size, className }: { size?: number; className?: string }) {
  return <Clock size={size} className={className} />;
}
