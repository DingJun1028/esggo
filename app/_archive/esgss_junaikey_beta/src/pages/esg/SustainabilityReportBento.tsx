/**
 * 📊 SustainabilityReportBento - 永續報告中心 (Stitch Bento 一頁式)
 *
 * 使用 Google Stitch Design System + Bento Grid 布局
 * 整合 5T 協議 + Typst 排版 + OCR 上傳 + AI 自動撰寫
 *
 * @version 3.0.0
 * @date 2026-02-19
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Scan,
  Brain,
  Sparkles,
  Download,
  Settings,
  Plus,
  Search,
  Filter,
  RefreshCw,
  ShieldCheck,
  Hash,
  Link2,
  Clock,
  Target,
  Award,
  BarChart3,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  FileCheck,
  Users,
  Globe,
  Leaf,
  Cpu,
  BookOpen,
  PenTool,
  Layers,
  Grid,
  List,
} from 'lucide-react';
import { StitchPageTemplate } from '@/components/layout/StitchPageTemplate';
import { BentoGrid, BentoCard } from '@/components/ui/BentoGrid';
import { ComponentCoreFactory } from '@/services/ceremony/core/IComponentCore';

// ============== 5T Protocol Types ==============

interface ReportSummary {
  id: string;
  title: string;
  year: number;
  framework: string;
  status: 'Draft' | 'Review' | 'Approved' | 'Published' | 'Trustworthy';
  completeness: number;
  score?: number;
  // 5T Protocol
  source_origin: string;
  evidence_hash: string;
  impact_metric: number;
  lifecycle_stage: string;
  evidence_vault_id: string;
}

interface OCRDocument {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'docx';
  uploadTime: string;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedText?: string;
  // 5T Protocol
  source_origin: string;
  evidence_hash: string;
  impact_metric: number;
  lifecycle_stage: string;
  evidence_vault_id: string;
}

interface ChartConfig {
  id: string;
  type: 'line' | 'bar' | 'pie' | 'radar';
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'stable';
  color: string;
}

// ============== Mock Data with 5T ==============

const MOCK_REPORTS: ReportSummary[] = [
  {
    id: 'r1',
    title: '2024 Annual Sustainability Report',
    year: 2024,
    framework: 'GRI Standards',
    status: 'Trustworthy',
    completeness: 100,
    score: 95,
    source_origin: 'User_Generated',
    evidence_hash: 'sha256:a1b2c3d4...',
    impact_metric: 95,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-2024-001',
  },
  {
    id: 'r2',
    title: '2023 ESG Impact Report',
    year: 2023,
    framework: 'GRI/TCFD',
    status: 'Published',
    completeness: 100,
    score: 92,
    source_origin: 'User_Generated',
    evidence_hash: 'sha256:e5f6g7h8...',
    impact_metric: 92,
    lifecycle_stage: 'PUBLISHED',
    evidence_vault_id: 'EV-2023-002',
  },
  {
    id: 'r3',
    title: '2025 Q1 Progress Update',
    year: 2025,
    framework: 'GRI Omni',
    status: 'Draft',
    completeness: 45,
    score: 0,
    source_origin: 'AI_Generated',
    evidence_hash: '',
    impact_metric: 45,
    lifecycle_stage: 'DRAFT',
    evidence_vault_id: '',
  },
  {
    id: 'r4',
    title: '2024 Q3 碳盤查報告',
    year: 2024,
    framework: 'ISO 14064',
    status: 'Trustworthy',
    completeness: 100,
    score: 98,
    source_origin: 'User_Generated',
    evidence_hash: 'sha256:i9j0k1l2...',
    impact_metric: 98,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-2024-003',
  },
  {
    id: 'r5',
    title: '2024 社會責任報告',
    year: 2024,
    framework: 'GRI 403',
    status: 'Review',
    completeness: 78,
    score: 0,
    source_origin: 'AI_Generated',
    evidence_hash: '',
    impact_metric: 78,
    lifecycle_stage: 'REVIEW',
    evidence_vault_id: '',
  },
];

const MOCK_OCR_DOCS: OCRDocument[] = [
  {
    id: 'ocr-1',
    name: '2023碳盤查報告.pdf',
    type: 'pdf',
    uploadTime: '2026-02-07 10:30',
    status: 'completed',
    source_origin: 'User_Upload',
    evidence_hash: 'sha256:x1y2z3...',
    impact_metric: 98,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-OCR-001',
  },
  {
    id: 'ocr-2',
    name: 'GRI對照表.xlsx',
    type: 'docx',
    uploadTime: '2026-02-06 14:20',
    status: 'completed',
    source_origin: 'User_Upload',
    evidence_hash: 'sha256:w4v5u6...',
    impact_metric: 95,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-OCR-002',
  },
  {
    id: 'ocr-3',
    name: '員工滿意度調查.pdf',
    type: 'pdf',
    uploadTime: '2026-02-05 09:15',
    status: 'processing',
    source_origin: 'User_Upload',
    evidence_hash: '',
    impact_metric: 0,
    lifecycle_stage: 'PROCESSING',
    evidence_vault_id: '',
  },
  {
    id: 'ocr-4',
    name: '供應商名單.xlsx',
    type: 'docx',
    uploadTime: '2026-02-04 16:45',
    status: 'completed',
    source_origin: 'User_Upload',
    evidence_hash: 'sha256:m3n4o5p6...',
    impact_metric: 97,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-OCR-003',
  },
  {
    id: 'ocr-5',
    name: '能源使用報告.pdf',
    type: 'pdf',
    uploadTime: '2026-02-03 11:20',
    status: 'completed',
    source_origin: 'User_Upload',
    evidence_hash: 'sha256:q7r8s9t0...',
    impact_metric: 94,
    lifecycle_stage: 'TRUSTWORTHY_SEALED',
    evidence_vault_id: 'EV-OCR-004',
  },
];

const MOCK_CHARTS: ChartConfig[] = [
  { id: 'c1', type: 'bar', title: '碳排放', value: 72, trend: 'down', color: '#22c55e' },
  { id: 'c2', type: 'pie', title: 'GRI完成度', value: 92, color: '#3b82f6' },
  { id: 'c3', type: 'line', title: 'ESG評分', value: 88, trend: 'up', color: '#8b5cf6' },
  { id: 'c4', type: 'radar', title: '永續指標', value: 85, color: '#f59e0b' },
  { id: 'c5', type: 'bar', title: '範疇一二三', value: 68, trend: 'down', color: '#06b6d4' },
  { id: 'c6', type: 'pie', title: '能源結構', value: 78, color: '#10b981' },
  { id: 'c7', type: 'line', title: '廢棄物減量', value: 82, trend: 'up', color: '#f97316' },
  { id: 'c8', type: 'radar', title: '社會影響', value: 90, color: '#ec4899' },
];

// 高密度指標數據
const METRICS_DATA = [
  { label: '碳排放量', value: '12,500', unit: 'tCO2e', trend: -12.5, color: '#22c55e' },
  { label: '再生能源佔比', value: '35', unit: '%', trend: +8.2, color: '#3b82f6' },
  { label: '水回收率', value: '68', unit: '%', trend: +5.1, color: '#06b6d4' },
  { label: '廢棄物減量', value: '23', unit: '%', trend: -3.2, color: '#f59e0b' },
  { label: '員工滿意度', value: '4.5', unit: '/5', trend: +0.2, color: '#8b5cf6' },
  { label: '供應商合規', value: '98', unit: '%', trend: +1.5, color: '#10b981' },
  { label: '女性主管', value: '42', unit: '%', trend: +3.0, color: '#ec4899' },
  { label: '社區投資', value: '2.5', unit: 'M TWD', trend: +15.0, color: '#14b8a6' },
];

// ============== Helper Functions ==============

const generateEvidenceHash = async (data: string): Promise<string> => {
  try {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return 'sha256:' + hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'sha256:error';
  }
};

// ============== Main Component ==============

export const SustainabilityReportBento: React.FC = () => {
  const core = useMemo(() => ComponentCoreFactory.create('SustainabilityReportBento'), []);

  // State
  const [activeSection, setActiveSection] = useState<'overview' | 'reports' | 'ocr' | 'typst'>(
    'overview'
  );
  const [reports] = useState<ReportSummary[]>(MOCK_REPORTS);
  const [ocrDocs, setOcrDocs] = useState<OCRDocument[]>(MOCK_OCR_DOCS);
  const [uploading, setUploading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [aiWriting, setAiWriting] = useState(false);

  // Handlers
  const handleFileUpload = async () => {
    setUploading(true);
    // Simulate upload with 5T
    setTimeout(async () => {
      const newDoc: OCRDocument = {
        id: `ocr-${Date.now()}`,
        name: '新上傳文件.pdf',
        type: 'pdf',
        uploadTime: new Date().toISOString(),
        status: 'processing',
        source_origin: 'User_Upload',
        evidence_hash: '',
        impact_metric: 0,
        lifecycle_stage: 'PROCESSING',
        evidence_vault_id: '',
      };
      setOcrDocs(prev => [newDoc, ...prev]);
      setUploading(false);
    }, 2000);
  };

  const handleTypstExport = async () => {
    setExporting(true);
    try {
      const timestamp = new Date().toISOString();
      const hash = await generateEvidenceHash(`SustainabilityReport_${timestamp}`);

      const response = await fetch('/api/report/typst', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: '2024 Sustainability Report',
          period: '2024',
          _5t_protocol: {
            source_origin: 'SustainabilityReportBento_Export',
            evidence_hash: hash,
            impact_metric: 95,
            lifecycle_stage: 'TRUSTWORTHY_SEALED',
            timestamp,
          },
        }),
      });

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `永續報告書_${hash.substring(7, 15)}.pdf`;
      a.click();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const handleAIWrite = async () => {
    setAiWriting(true);
    setTimeout(() => {
      setAiWriting(false);
    }, 3000);
  };

  // 5T Status Badge
  const get5TStatus = (doc: OCRDocument | ReportSummary) => {
    if (doc.lifecycle_stage === 'TRUSTWORTHY_SEALED') {
      return (
        <span className="flex items-center gap-1 text-xs text-green-400">
          <ShieldCheck className="w-3 h-3" /> 5T封印
        </span>
      );
    }
    if (doc.lifecycle_stage === 'PROCESSING') {
      return (
        <span className="flex items-center gap-1 text-xs text-yellow-400">
          <Clock className="w-3 h-3 animate-spin" /> 處理中
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 text-xs text-slate-400">
        <Clock className="w-3 h-3" /> 草稿
      </span>
    );
  };

  return (
    <StitchPageTemplate
      id="sustainability-report-bento"
      title="永續報告中心"
      subtitle="Sustainability Report Center - 一站式報告書管理"
      breadcrumbs={[
        { label: '首頁', href: '/' },
        { label: '永續報告中心', href: '/esg-report-center' },
      ]}
    >
      <div className="mt-8 space-y-6">
        {/* 🎯 Tab Navigation */}
        <div className="flex items-center gap-2 p-1 bg-slate-800/50 rounded-xl">
          {[
            { id: 'overview', label: '總覽', icon: Grid },
            { id: 'reports', label: '報告書', icon: FileText },
            { id: 'ocr', label: 'OCR解析', icon: Scan },
            { id: 'typst', label: 'Typst排版', icon: BookOpen },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold transition-all ${
                activeSection === tab.id
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 📊 Overview Section - Bento Grid */}
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <BentoGrid className="auto-rows-[140px]">
                {/* 📈 ESG Score - Large Card */}
                <BentoCard
                  colSpan={4}
                  rowSpan={2}
                  className="bg-gradient-to-br from-emerald-500/20 to-green-500/10"
                >
                  <div className="h-full flex flex-col justify-between p-6">
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-400 font-bold">ESG 總評分</span>
                      <Award className="w-6 h-6 text-emerald-400" />
                    </div>
                    <div className="text-5xl font-black text-white">92</div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <TrendingUp className="w-4 h-4" />
                      <span>+5 較去年</span>
                    </div>
                  </div>
                </BentoCard>

                {/* 📄 Reports Count */}
                <BentoCard colSpan={4}>
                  <div className="h-full flex flex-col justify-center p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-blue-400" />
                      <span className="text-slate-400">報告書總數</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{reports.length}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      {reports.filter(r => r.status === 'Trustworthy').length} 已封印
                    </div>
                  </div>
                </BentoCard>

                {/* 🔍 OCR Documents */}
                <BentoCard colSpan={4}>
                  <div className="h-full flex flex-col justify-center p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <Scan className="w-5 h-5 text-purple-400" />
                      <span className="text-slate-400">OCR 文件</span>
                    </div>
                    <div className="text-3xl font-bold text-white">{ocrDocs.length}</div>
                    <div className="text-xs text-slate-500 mt-2">
                      {ocrDocs.filter(d => d.status === 'completed').length} 已完成
                    </div>
                  </div>
                </BentoCard>

                {/* 📊 Quick Charts Row */}
                {MOCK_CHARTS.map(chart => (
                  <BentoCard key={chart.id} colSpan={3}>
                    <div className="h-full flex flex-col justify-center p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-slate-400 text-sm">{chart.title}</span>
                        {chart.trend && (
                          <TrendingUp
                            className={`w-4 h-4 ${chart.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}
                          />
                        )}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: chart.color }}>
                        {chart.value}%
                      </div>
                      <div
                        className="h-1 mt-2 rounded-full"
                        style={{ backgroundColor: chart.color, width: `${chart.value}%` }}
                      />
                    </div>
                  </BentoCard>
                ))}

                {/* ➕ Quick Actions */}
                <BentoCard colSpan={6}>
                  <div className="h-full flex items-center gap-4 p-4">
                    <button
                      onClick={handleFileUpload}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-500/20 text-blue-400 rounded-xl hover:bg-blue-500/30 transition-all"
                    >
                      <Upload className="w-5 h-5" /> 上傳單據
                    </button>
                    <button
                      onClick={handleAIWrite}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-purple-500/20 text-purple-400 rounded-xl hover:bg-purple-500/30 transition-all"
                    >
                      <Brain className="w-5 h-5" /> AI 撰寫
                    </button>
                    <button
                      onClick={handleTypstExport}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-amber-500/20 text-amber-400 rounded-xl hover:bg-amber-500/30 transition-all"
                    >
                      <BookOpen className="w-5 h-5" /> 一鍵排版
                    </button>
                  </div>
                </BentoCard>

                {/* 🛡️ 5T Status */}
                <BentoCard colSpan={6}>
                  <div className="h-full flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <ShieldCheck className="w-8 h-8 text-green-400" />
                      <div>
                        <div className="text-white font-bold">5T 協議保護</div>
                        <div className="text-xs text-slate-400">SHA-256 哈希鎖定</div>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-green-400 text-xs">Tangible</div>
                      </div>
                      <div>
                        <div className="text-green-400 text-xs">Traceable</div>
                      </div>
                      <div>
                        <div className="text-green-400 text-xs">Trackable</div>
                      </div>
                      <div>
                        <div className="text-green-400 text-xs">Trustworthy</div>
                      </div>
                    </div>
                  </div>
                </BentoCard>
              </BentoGrid>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📄 Reports Section */}
        <AnimatePresence>
          {activeSection === 'reports' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">報告書列表</h2>
                <button className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30">
                  <Plus className="w-4 h-4" /> 新建報告
                </button>
              </div>
              <div className="grid gap-4">
                {reports.map(report => (
                  <div key={report.id} className="liquid-glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <FileText className="w-8 h-8 text-blue-400" />
                        <div>
                          <h3 className="text-white font-bold">{report.title}</h3>
                          <p className="text-slate-400 text-sm">
                            {report.framework} • {report.year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {get5TStatus(report)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            report.status === 'Trustworthy'
                              ? 'bg-green-500/20 text-green-400'
                              : report.status === 'Published'
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {report.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span className="text-slate-400">完成度</span>
                          <span className="text-white">{report.completeness}%</span>
                        </div>
                        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                            style={{ width: `${report.completeness}%` }}
                          />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{report.score || '-'}</div>
                        <div className="text-xs text-slate-500">評分</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 🔍 OCR Section */}
        <AnimatePresence>
          {activeSection === 'ocr' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white">OCR 單據解析</h2>
                <button
                  onClick={handleFileUpload}
                  disabled={uploading}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 disabled:opacity-50"
                >
                  <Upload className={`w-4 h-4 ${uploading ? 'animate-spin' : ''}`} />
                  {uploading ? '上傳中...' : '上傳單據'}
                </button>
              </div>
              <div className="grid gap-4">
                {ocrDocs.map(doc => (
                  <div key={doc.id} className="liquid-glass p-6 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Scan className="w-8 h-8 text-purple-400" />
                        <div>
                          <h3 className="text-white font-bold">{doc.name}</h3>
                          <p className="text-slate-400 text-sm">{doc.uploadTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {get5TStatus(doc)}
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                            doc.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : doc.status === 'processing'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-slate-500/20 text-slate-400'
                          }`}
                        >
                          {doc.status === 'processing' && (
                            <RefreshCw className="w-3 h-3 animate-spin" />
                          )}
                          {doc.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 📑 Typst Section */}
        <AnimatePresence>
          {activeSection === 'typst' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="liquid-glass p-8 rounded-3xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-4 bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl">
                    <BookOpen className="w-8 h-8 text-slate-900" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-white">Typst 高品質一鍵排版</h2>
                    <p className="text-slate-400">一鍵將報告書排版成書 • 5T 協議保護</p>
                  </div>
                </div>

                {/* 5T Status */}
                <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                    <span className="text-green-400 font-bold">5T 協議已啟用</span>
                    <span className="text-slate-400">|</span>
                    <span className="text-slate-400 text-sm">輸出將包含 SHA-256 雜湊指紋</span>
                  </div>
                </div>

                {/* Export Options */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <select className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option>A4 紙張</option>
                    <option>A5 紙張</option>
                    <option>Letter</option>
                  </select>
                  <select className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option>精裝</option>
                    <option>平裝</option>
                    <option>騎馬釘</option>
                  </select>
                  <select className="bg-white/10 border border-white/10 rounded-lg px-4 py-3 text-white">
                    <option>PDF 輸出</option>
                    <option>Typst 原始碼</option>
                  </select>
                </div>

                {/* Export Button */}
                <button
                  onClick={handleTypstExport}
                  disabled={exporting}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-500 to-yellow-600 text-slate-900 rounded-xl font-bold text-lg hover:scale-[1.02] transition-all disabled:opacity-50"
                >
                  {exporting ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      正在執行 5T 封印並排版...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-6 h-6" />
                      一鍵排版成書 (含 5T 保護)
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </StitchPageTemplate>
  );
};

export default SustainabilityReportBento;
