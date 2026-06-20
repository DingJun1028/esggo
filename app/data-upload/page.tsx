// @ts-nocheck
'use client';

import React, { useState, useCallback } from 'react';

import {
  LucideIcon,
  Upload,
  FileSpreadsheet,
  FileText,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  X,
  Download,
  Eye,
  Trash2,
  RefreshCw,
  TrendingUp,
  BarChart3,
  PieChart,
  Leaf,
  Flame,
  Droplets,
  Factory,
  Truck,
  ArrowRight,
  ShieldCheck,
  Brain,
  Target,
  ChevronRight,
  Info,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniButton } from '@/components/ui/omni/OmniButton';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';

/* ─── Types ─── */
interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  records?: number;
  errors?: string[];
  insights?: DataInsight[];
}

interface DataInsight {
  id: string;
  type: 'hotspot' | 'anomaly' | 'trend' | 'recommendation';
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
  icon: LucideIcon;
  color: string;
  value?: string;
}

interface AnalysisResult {
  totalEmissions: number;
  scope1: number;
  scope2: number;
  scope3: number;
  topEmitters: { name: string; value: number; percentage: number }[];
  trends: { month: string; value: number }[];
  compliance: { framework: string; status: 'pass' | 'fail' | 'pending'; score: number }[];
}

/* ─── Mock Data ─── */
const MOCK_INSIGHTS: DataInsight[] = [
  {
    id: 'ins-001',
    type: 'hotspot',
    title: '物流碳排熱點',
    description: '運輸物流佔總碳排 38%，高於行業平均 15%。建議檢視運輸路線優化與車輛汰換。',
    severity: 'critical',
    icon: Truck,
    color: 'text-rose-600',
    value: '38%',
  },
  {
    id: 'ins-002',
    type: 'anomaly',
    title: '用電量異常',
    description: '12 月份用電量較上月增加 45%，但產量僅增加 10%。建議檢查設備效能。',
    severity: 'warning',
    icon: Zap,
    color: 'text-amber-600',
    value: '+45%',
  },
  {
    id: 'ins-003',
    type: 'trend',
    title: '碳排放下降趨勢',
    description: '過去 6 個月碳排放量持續下降，平均每月減少 3.2%。按此趨勢可提前達成年度目標。',
    severity: 'info',
    icon: TrendingUp,
    color: 'text-emerald-600',
    value: '-3.2%/月',
  },
  {
    id: 'ins-004',
    type: 'recommendation',
    title: '減排建議',
    description: '根據 AI 分析，建議優先改善能源效率（可減排 25%）和導入再生能源（可減排 30%）。',
    severity: 'info',
    icon: Brain,
    color: 'text-violet-600',
  },
  {
    id: 'ins-005',
    type: 'hotspot',
    title: '燃料燃烧排放',
    description: '工廠燃料燃燒佔 Scope 1 排放 62%，建議檢視鍋爐效率與燃料種類。',
    severity: 'warning',
    icon: Flame,
    color: 'text-amber-600',
    value: '62%',
  },
  {
    id: 'ins-006',
    type: 'trend',
    title: '水資源效率提升',
    description: '每單位產值用水量較去年下降 12%，已達業界前 25% 水準。',
    severity: 'info',
    icon: Droplets,
    color: 'text-cyan-600',
    value: '-12%',
  },
];

const MOCK_ANALYSIS: AnalysisResult = {
  totalEmissions: 12847,
  scope1: 4502,
  scope2: 5284,
  scope3: 3061,
  topEmitters: [
    { name: '工廠 A', value: 3400, percentage: 26.5 },
    { name: '物流運輸', value: 2890, percentage: 22.5 },
    { name: '辦公大樓', value: 1560, percentage: 12.1 },
    { name: '數據中心', value: 1240, percentage: 9.7 },
    { name: '供應商 B', value: 980, percentage: 7.6 },
  ],
  trends: [
    { month: '2025-07', value: 1320 },
    { month: '2025-08', value: 1280 },
    { month: '2025-09', value: 1250 },
    { month: '2025-10', value: 1210 },
    { month: '2025-11', value: 1180 },
    { month: '2025-12', value: 1150 },
  ],
  compliance: [
    { framework: 'GRI G4', status: 'pass', score: 87 },
    { framework: 'SASB', status: 'pass', score: 92 },
    { framework: 'TCFD', status: 'pending', score: 68 },
    { framework: 'ISSB', status: 'fail', score: 54 },
  ],
};

/* ─── Components ─── */

function FileUploadZone({
  onFilesSelected,
  isProcessing,
}: {
  onFilesSelected: (files: File[]) => void;
  isProcessing: boolean;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer',
        isDragging
          ? 'border-cyan-400 bg-cyan-50'
          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50',
        isProcessing && 'opacity-50 pointer-events-none'
      )}
    >
      <input
        type="file"
        multiple
        accept=".xlsx,.xls,.csv,.json,.xml"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        disabled={isProcessing}
      />
      <Upload
        size={40}
        className={cn('mx-auto mb-4', isDragging ? 'text-cyan-500' : 'text-slate-300')}
      />
      <h3 className="text-base font-bold text-[#003262] mb-1">拖放檔案至此處上傳</h3>
      <p className="text-xs text-slate-400 mb-3">或點擊選擇檔案</p>
      <div className="flex items-center justify-center gap-2 flex-wrap">
        {['Excel (.xlsx)', 'CSV', 'JSON', 'XML'].map((format) => (
          <span
            key={format}
            className="text-[10px] px-2 py-0.5 bg-slate-50 text-slate-400 rounded-full"
          >
            {format}
          </span>
        ))}
      </div>
    </div>
  );
}

function FileUploadCard({ file, onRemove }: { file: UploadedFile; onRemove: () => void }) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  const statusConfig = {
    uploading: {
      label: '上傳中',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      icon: Loader2,
      spinner: true,
    },
    processing: {
      label: 'AI 分析中',
      color: 'text-violet-600',
      bg: 'bg-violet-50',
      icon: Brain,
      spinner: true,
    },
    completed: {
      label: '完成',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      icon: CheckCircle2,
      spinner: false,
    },
    error: {
      label: '錯誤',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      icon: AlertTriangle,
      spinner: false,
    },
  };
  const config = statusConfig[file.status];
  const StatusIcon = config.icon;

  return (
    <div
      layout
      className={cn(
        'bg-white rounded-xl border p-4 transition-all',
        file.status === 'error' ? 'border-rose-200' : 'border-slate-100'
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center">
          {file.type.includes('csv') ? (
            <FileText size={18} className="text-emerald-600" />
          ) : (
            <FileSpreadsheet size={18} className="text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <p className="text-sm font-medium text-[#003262] truncate">{file.name}</p>
            <span
              className={cn(
                'text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-1',
                config.bg,
                config.color
              )}
            >
              <StatusIcon size={8} className={config.spinner ? 'animate-spin' : ''} />
              {config.label}
            </span>
          </div>
          <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
        </div>
        {file.status === 'completed' && (
          <div className="flex items-center gap-1">
            <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <Eye size={14} className="text-slate-400" />
            </button>
            <button className="p-1.5 hover:bg-slate-50 rounded-lg transition-colors">
              <Download size={14} className="text-slate-400" />
            </button>
          </div>
        )}
        <button onClick={onRemove} className="p-1 hover:bg-slate-50 rounded-lg transition-colors">
          <X size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Progress Bar */}
      {(file.status === 'uploading' || file.status === 'processing') && (
        <div className="mt-3 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            animate={{ width: `${file.progress}%` }}
            className={cn(
              'h-full rounded-full',
              file.status === 'uploading' ? 'bg-blue-500' : 'bg-violet-500'
            )}
          />
        </div>
      )}

      {/* Records */}
      {file.records !== undefined && (
        <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-400">
          <span>{file.records.toLocaleString()} 筆記錄</span>
          {file.errors && file.errors.length > 0 && (
            <span className="text-rose-500">{file.errors.length} 個錯誤</span>
          )}
        </div>
      )}

      {/* Errors */}
      {file.errors && file.errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {file.errors.map((error, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[10px] text-rose-500">
              <AlertTriangle size={10} />
              {error}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InsightCard({ insight }: { insight: DataInsight }) {
  const Icon = insight.icon;
  const severityConfig = {
    info: { border: 'border-slate-100', bg: 'bg-slate-50' },
    warning: { border: 'border-amber-200', bg: 'bg-amber-50/50' },
    critical: { border: 'border-rose-200', bg: 'bg-rose-50/50' },
  };
  const sc = severityConfig[insight.severity];

  return (
    <div
      className={cn('bg-white rounded-xl border p-4 hover:shadow-md transition-all', sc.border)}
    >
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg shrink-0', sc.bg)}>
          <Icon size={16} className={insight.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-bold text-[#003262]">{insight.title}</h4>
            {insight.value && (
              <span className={cn('text-sm font-black', insight.color)}>{insight.value}</span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 leading-relaxed">{insight.description}</p>
        </div>
      </div>
    </div>
  );
}

function EmissionsChart({ data }: { data: AnalysisResult }) {
  const maxEmission = Math.max(...data.trends.map((t) => t.value));

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-1 h-32">
        {data.trends.map((trend, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div
              animate={{ height: `${(trend.value / maxEmission) * 100}%` }}
              className="w-full bg-gradient-to-t from-cyan-500 to-cyan-400 rounded-t-md min-h-[4px]"
            />
            <span className="text-[8px] text-slate-400">{trend.month.slice(5)}</span>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between text-[10px] text-slate-400">
        <span>2025-07</span>
        <span>月度碳排放趨勢 (tCO₂e)</span>
        <span>2025-12</span>
      </div>
    </div>
  );
}

function ScopeBreakdown({ data }: { data: AnalysisResult }) {
  const scopes = [
    { label: 'Scope 1', value: data.scope1, color: 'bg-rose-500', textColor: 'text-rose-600' },
    { label: 'Scope 2', value: data.scope2, color: 'bg-amber-500', textColor: 'text-amber-600' },
    { label: 'Scope 3', value: data.scope3, color: 'bg-cyan-500', textColor: 'text-cyan-600' },
  ];
  const total = data.totalEmissions;

  return (
    <div className="space-y-3">
      {/* Stacked Bar */}
      <div className="h-6 rounded-full overflow-hidden flex bg-slate-100">
        {scopes.map((scope) => (
          <div
            key={scope.label}
            animate={{ width: `${(scope.value / total) * 100}%` }}
            className={cn('h-full', scope.color)}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center justify-between">
        {scopes.map((scope) => (
          <div key={scope.label} className="flex items-center gap-2">
            <div className={cn('w-3 h-3 rounded-full', scope.color)} />
            <span className="text-xs text-slate-600">{scope.label}</span>
            <span className={cn('text-xs font-mono font-bold', scope.textColor)}>
              {((scope.value / total) * 100).toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Main Page ─── */
export default function DataUploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'results'>('upload');

  const handleFilesSelected = useCallback((selectedFiles: File[]) => {
    const newFiles: UploadedFile[] = selectedFiles.map((f) => ({
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      name: f.name,
      size: f.size,
      type: f.type,
      status: 'uploading' as const,
      progress: 0,
    }));

    setFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      const interval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) => {
            if (f.id !== file.id) return f;
            const newProgress = Math.min(f.progress + Math.random() * 20, 100);
            if (newProgress >= 100) {
              clearInterval(interval);
              return { ...f, progress: 100, status: 'processing' as const };
            }
            return { ...f, progress: newProgress };
          })
        );
      }, 300);

      // After upload completes, start processing
      setTimeout(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id ? { ...f, status: 'processing' as const, progress: 0 } : f
          )
        );

        // Simulate AI processing
        const processInterval = setInterval(() => {
          setFiles((prev) =>
            prev.map((f) => {
              if (f.id !== file.id) return f;
              const newProgress = Math.min(f.progress + Math.random() * 15, 100);
              if (newProgress >= 100) {
                clearInterval(processInterval);
                return {
                  ...f,
                  progress: 100,
                  status: 'completed' as const,
                  records: Math.floor(Math.random() * 500) + 100,
                  insights: MOCK_INSIGHTS.slice(0, Math.floor(Math.random() * 3) + 2),
                };
              }
              return { ...f, progress: newProgress };
            })
          );
        }, 400);
      }, 1500);
    });
  }, []);

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleStartAnalysis = () => {
    setIsAnalyzing(true);
    setActiveTab('results');
    setTimeout(() => setIsAnalyzing(false), 2000);
  };

  const completedFiles = files.filter((f) => f.status === 'completed');
  const allInsights = completedFiles.flatMap((f) => f.insights || []);
  const totalRecords = completedFiles.reduce((sum, f) => sum + (f.records || 0), 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <header className="bg-white rounded-2xl border border-slate-100 p-6 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-50 rounded-full blur-3xl breathing-glow" />
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                <Upload size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                  數據上傳與 AI 分析
                </h1>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Upload & Analyze · 智能數據處理 · 自動洞察生成
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {files.length > 0 && (
                <>
                  <div className="text-right">
                    <p className="text-lg font-black text-[#003262]">{files.length}</p>
                    <p className="text-[9px] text-slate-400">已上傳</p>
                  </div>
                  <div className="w-px h-8 bg-slate-100" />
                  <div className="text-right">
                    <p className="text-lg font-black text-emerald-600">{completedFiles.length}</p>
                    <p className="text-[9px] text-slate-400">已完成</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'upload' as const, label: '數據上傳', icon: Upload },
            {
              id: 'results' as const,
              label: 'AI 分析結果',
              icon: Brain,
              disabled: completedFiles.length === 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              disabled={tab.disabled}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : tab.disabled
                  ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Upload Tab ─── */}
        {activeTab === 'upload' && (
          <div className="space-y-6">
            {/* Upload Zone */}
            <FileUploadZone onFilesSelected={handleFilesSelected} isProcessing={isAnalyzing} />

            {/* Uploaded Files */}
            {files.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-[#003262]">已上傳檔案</h3>
                  {completedFiles.length > 0 && (
                    <OmniButton
                      variant="primary"
                      size="sm"
                      icon={<Brain size={14} />}
                      onClick={handleStartAnalysis}
                      className="bg-[#003262] hover:bg-[#002244] text-white"
                    >
                      開始 AI 分析
                    </OmniButton>
                  )}
                </div>
                
                  {files.map((file) => (
                    <FileUploadCard
                      key={file.id}
                      file={file}
                      onRemove={() => handleRemoveFile(file.id)}
                    />
                  ))}
                
              </div>
            )}

            {/* Upload Tips */}
            <OmniBaseCard className="p-5">
              <h3 className="text-sm font-bold text-[#003262] mb-3 flex items-center gap-2">
                <Info size={14} className="text-cyan-500" />
                上傳建議
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  {
                    title: '支援格式',
                    desc: 'Excel (.xlsx)、CSV、JSON、XML',
                    icon: FileText,
                    color: 'text-blue-600',
                  },
                  {
                    title: 'AI 自動識別',
                    desc: '系統自動識別數據類型與欄位對應',
                    icon: Brain,
                    color: 'text-violet-600',
                  },
                  {
                    title: '5T 驗證',
                    desc: '上傳後自動執行 5T 協議驗證',
                    icon: ShieldCheck,
                    color: 'text-emerald-600',
                  },
                ].map((tip) => {
                  const Icon = tip.icon;
                  return (
                    <div
                      key={tip.title}
                      className="flex items-start gap-2 p-3 bg-slate-50 rounded-lg"
                    >
                      <Icon size={14} className={cn('mt-0.5 shrink-0', tip.color)} />
                      <div>
                        <p className="text-xs font-medium text-[#003262]">{tip.title}</p>
                        <p className="text-[10px] text-slate-400">{tip.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </OmniBaseCard>
          </div>
        )}

        {/* ─── Results Tab ─── */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {isAnalyzing ? (
              <OmniBaseCard className="p-12 text-center">
                <Loader2 size={48} className="text-cyan-500 animate-spin mx-auto mb-4" />
                <h3 className="text-lg font-bold text-[#003262] mb-2">AI 正在分析您的數據...</h3>
                <p className="text-xs text-slate-400">
                  Gemini 2.0 正在處理 {totalRecords.toLocaleString()} 筆記錄
                </p>
              </OmniBaseCard>
            ) : (
              <>
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    {
                      label: '總碳排放',
                      value: `${MOCK_ANALYSIS.totalEmissions.toLocaleString()}`,
                      unit: 'tCO₂e',
                      icon: Factory,
                      color: 'text-rose-600',
                      trend: '-5.2%',
                    },
                    {
                      label: '數據筆數',
                      value: totalRecords.toLocaleString(),
                      unit: '筆',
                      icon: FileText,
                      color: 'text-blue-600',
                    },
                    {
                      label: 'AI 洞察',
                      value: String(allInsights.length),
                      unit: '項',
                      icon: Brain,
                      color: 'text-violet-600',
                    },
                    {
                      label: '合規評分',
                      value: '87',
                      unit: '/100',
                      icon: ShieldCheck,
                      color: 'text-emerald-600',
                      trend: '+3%',
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
                            <span
                              className={cn(
                                'text-[10px] font-bold',
                                stat.trend.startsWith('-') ? 'text-emerald-600' : 'text-rose-600'
                              )}
                            >
                              {stat.trend}
                            </span>
                          )}
                        </div>
                        <p className="text-xl font-black text-[#003262]">
                          {stat.value}
                          <span className="text-sm text-slate-400 ml-1">{stat.unit}</span>
                        </p>
                        <p className="text-[10px] text-slate-400 font-medium">{stat.label}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <BarChart3 size={14} className="text-cyan-500" />
                      碳排放趨勢
                    </h3>
                    <EmissionsChart data={MOCK_ANALYSIS} />
                  </OmniBaseCard>

                  <OmniBaseCard className="p-5">
                    <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                      <PieChart size={14} className="text-violet-500" />
                      排放源分類
                    </h3>
                    <ScopeBreakdown data={MOCK_ANALYSIS} />
                  </OmniBaseCard>
                </div>

                {/* Top Emitters */}
                <OmniBaseCard className="p-5">
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Flame size={14} className="text-rose-500" />
                    主要排放源
                  </h3>
                  <div className="space-y-3">
                    {MOCK_ANALYSIS.topEmitters.map((emitter, i) => (
                      <div key={emitter.name} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-4">{i + 1}</span>
                        <span className="text-xs text-slate-600 w-24 truncate">{emitter.name}</span>
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            animate={{ width: `${emitter.percentage}%` }}
                            className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-500"
                          />
                        </div>
                        <span className="text-xs font-mono font-bold text-[#003262] w-20 text-right">
                          {emitter.value.toLocaleString()} t
                        </span>
                        <span className="text-[10px] text-slate-400 w-12 text-right">
                          {emitter.percentage}%
                        </span>
                      </div>
                    ))}
                  </div>
                </OmniBaseCard>

                {/* AI Insights */}
                <div>
                  <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <Brain size={16} className="text-violet-500" />
                    AI 智能洞察
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {allInsights.map((insight) => (
                      <InsightCard key={insight.id} insight={insight} />
                    ))}
                  </div>
                </div>

                {/* Compliance */}
                <OmniBaseCard className="p-5">
                  <h3 className="text-sm font-bold text-[#003262] mb-4 flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    合規性檢查
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {MOCK_ANALYSIS.compliance.map((item) => (
                      <div
                        key={item.framework}
                        className={cn(
                          'text-center p-3 rounded-xl border',
                          item.status === 'pass'
                            ? 'border-emerald-200 bg-emerald-50/50'
                            : item.status === 'fail'
                            ? 'border-rose-200 bg-rose-50/50'
                            : 'border-amber-200 bg-amber-50/50'
                        )}
                      >
                        <p className="text-sm font-bold text-[#003262]">{item.framework}</p>
                        <p className="text-xl font-black text-[#003262] mt-1">{item.score}</p>
                        <OmniBadge
                          variant={
                            item.status === 'pass'
                              ? 'success'
                              : item.status === 'fail'
                              ? 'error'
                              : 'warning'
                          }
                          size="xs"
                        >
                          {item.status === 'pass'
                            ? '通過'
                            : item.status === 'fail'
                            ? '未通過'
                            : '待補強'}
                        </OmniBadge>
                      </div>
                    ))}
                  </div>
                </OmniBaseCard>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <OmniButton
                    variant="outline"
                    size="sm"
                    icon={<Upload size={14} />}
                    onClick={() => setActiveTab('upload')}
                  >
                    上傳更多數據
                  </OmniButton>
                  <div className="flex items-center gap-2">
                    <OmniButton variant="outline" size="sm" icon={<Download size={14} />}>
                      下載報告
                    </OmniButton>
                    <OmniButton
                      variant="primary"
                      size="sm"
                      icon={<FileText size={14} />}
                      className="bg-[#003262] hover:bg-[#002244] text-white"
                    >
                      生成完整報告
                    </OmniButton>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
