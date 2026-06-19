/**
 * Reports Dashboard - 報告儀表板
 * Anti-gravity Design System
 * 
 * 功能：
 * - 報告列表
 * - 報告生成
 * - 報告下載
 * - 報告預覽
 * - 報告統計
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UUIDDisplay } from '@/components/ui/UUIDDisplay';
import { AntiGravityCard, AntiGravityGrid } from '@/components/layout/AntiGravityLayout';

// 報告類型
interface Report {
  id: string;
  name: string;
  type: 'esg' | 'financial' | 'operational' | 'compliance' | 'custom';
  status: 'generating' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
  author: string;
  size: string;
  format: 'pdf' | 'excel' | 'word';
  description: string;
}

// 報告模板類型
interface ReportTemplate {
  id: string;
  name: string;
  type: 'esg' | 'financial' | 'operational' | 'compliance' | 'custom';
  description: string;
  icon: string;
  color: string;
}

// 報告統計類型
interface ReportStats {
  total: number;
  completed: number;
  generating: number;
  failed: number;
  totalSize: string;
}

// 模擬報告數據
const mockReports: Report[] = [
  {
    id: '1',
    name: '2024 年度 ESG 報告',
    type: 'esg',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7),
    author: '張三',
    size: '2.5 MB',
    format: 'pdf',
    description: '2024 年度環境、社會和治理報告',
  },
  {
    id: '2',
    name: 'Q4 財務報告',
    type: 'financial',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
    author: '李四',
    size: '1.8 MB',
    format: 'excel',
    description: '2024 年第四季度財務報告',
  },
  {
    id: '3',
    name: '運營效率分析報告',
    type: 'operational',
    status: 'generating',
    createdAt: new Date(Date.now() - 1000 * 60 * 30),
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
    author: '王五',
    size: '-',
    format: 'pdf',
    description: '運營效率分析和改進建議',
  },
  {
    id: '4',
    name: '合規性審計報告',
    type: 'compliance',
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 60),
    author: '趙六',
    size: '3.2 MB',
    format: 'pdf',
    description: '年度合規性審計報告',
  },
  {
    id: '5',
    name: '自定義數據分析報告',
    type: 'custom',
    status: 'failed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 90),
    author: '孫七',
    size: '-',
    format: 'excel',
    description: '自定義數據分析報告',
  },
];

// 報告模板
const reportTemplates: ReportTemplate[] = [
  {
    id: 'esg',
    name: 'ESG 報告',
    type: 'esg',
    description: '環境、社會和治理報告模板',
    icon: '🌱',
    color: '#4CAF50',
  },
  {
    id: 'financial',
    name: '財務報告',
    type: 'financial',
    description: '財務報告模板',
    icon: '💰',
    color: '#FF9800',
  },
  {
    id: 'operational',
    name: '運營報告',
    type: 'operational',
    description: '運營效率分析報告模板',
    icon: '⚙️',
    color: '#2196F3',
  },
  {
    id: 'compliance',
    name: '合規報告',
    type: 'compliance',
    description: '合規性審計報告模板',
    icon: '📋',
    color: '#9C27B0',
  },
  {
    id: 'custom',
    name: '自定義報告',
    type: 'custom',
    description: '自定義報告模板',
    icon: '📊',
    color: '#607D8B',
  },
];

// 報告統計
const reportStats: ReportStats = {
  total: 5,
  completed: 3,
  generating: 1,
  failed: 1,
  totalSize: '7.5 MB',
};

// 獲取報告類型圖標
const getReportTypeIcon = (type: Report['type']) => {
  switch (type) {
    case 'esg':
      return '🌱';
    case 'financial':
      return '💰';
    case 'operational':
      return '⚙️';
    case 'compliance':
      return '📋';
    case 'custom':
      return '📊';
    default:
      return '📄';
  }
};

// 獲取報告狀態顏色
const getReportStatusColor = (status: Report['status']) => {
  switch (status) {
    case 'completed':
      return 'text-green-400 bg-green-400/10';
    case 'generating':
      return 'text-blue-400 bg-blue-400/10';
    case 'failed':
      return 'text-red-400 bg-red-400/10';
    default:
      return 'text-white/60 bg-white/10';
  }
};

// 獲取報告狀態文本
const getReportStatusText = (status: Report['status'], language: 'zh-TW' | 'en') => {
  switch (status) {
    case 'completed':
      return language === 'zh-TW' ? '已完成' : 'Completed';
    case 'generating':
      return language === 'zh-TW' ? '生成中' : 'Generating';
    case 'failed':
      return language === 'zh-TW' ? '失敗' : 'Failed';
    default:
      return language === 'zh-TW' ? '未知' : 'Unknown';
  }
};

// 獲取格式圖標
const getFormatIcon = (format: Report['format']) => {
  switch (format) {
    case 'pdf':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      );
    case 'excel':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="16" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    case 'word':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <line x1="10" y1="9" x2="8" y2="9" />
        </svg>
      );
    default:
      return null;
  }
};

// 格式化時間
const formatDate = (date: Date, language: 'zh-TW' | 'en') => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };
  return date.toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : 'en-US', options);
};

// 主組件
const ReportsDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [language, setLanguage] = useState<'zh-TW' | 'en'>('zh-TW');
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 創建報告
  const handleCreateReport = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCreateModal(true);
  };

  // 下載報告
  const handleDownloadReport = (reportId: string) => {
    const report = reports.find((r) => r.id === reportId);
    if (report && report.status === 'completed') {
      alert(language === 'zh-TW' ? `正在下載：${report.name}` : `Downloading: ${report.name}`);
    }
  };

  // 刪除報告
  const handleDeleteReport = (reportId: string) => {
    if (confirm(language === 'zh-TW' ? '確定要刪除此報告嗎？' : 'Are you sure you want to delete this report?')) {
      setReports((prev) => prev.filter((r) => r.id !== reportId));
    }
  };

  // 重新生成報告
  const handleRegenerateReport = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId ? { ...r, status: 'generating' as const } : r
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/start')}
                className="p-2 hover:bg-white/10 rounded-lg transition-all"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/80"
                >
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {language === 'zh-TW' ? '報告中心' : 'Reports Center'}
                </h1>
                <p className="text-sm text-white/60">
                  {language === 'zh-TW' ? '管理和生成各類報告' : 'Manage and generate various reports'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 bg-[#9C27B0] hover:bg-[#9C27B0]/80 text-white rounded-lg font-medium transition-all">
                {language === 'zh-TW' ? '創建報告' : 'Create Report'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* UUID Display */}
        <div className="mb-8">
          <UUIDDisplay
            uuid="550e8400-e29b-41d4-a716-446655440000"
            mode="full"
            showLabel={true}
            language={language}
          />
        </div>

        {/* Stats Grid */}
        <AntiGravityGrid columns={4} gap={4} className="mb-8">
          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-purple-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-400">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '總報告數' : 'Total Reports'}</span>
            </div>
            <div className="text-3xl font-bold text-white">{reportStats.total}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '已完成' : 'Completed'}</span>
            </div>
            <div className="text-3xl font-bold text-green-400">{reportStats.completed}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '生成中' : 'Generating'}</span>
            </div>
            <div className="text-3xl font-bold text-blue-400">{reportStats.generating}</div>
          </div>

          <div className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-400/20 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-400">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
              <span className="text-sm text-white/60">{language === 'zh-TW' ? '失敗' : 'Failed'}</span>
            </div>
            <div className="text-3xl font-bold text-red-400">{reportStats.failed}</div>
          </div>
        </AntiGravityGrid>

        {/* Report Templates */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'zh-TW' ? '報告模板' : 'Report Templates'}
          </h2>
          <AntiGravityGrid columns={5} gap={4}>
            {reportTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleCreateReport(template.id)}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#9C27B0]/50 transition-all group"
              >
                <div className="text-4xl mb-3">{template.icon}</div>
                <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                <p className="text-sm text-white/60">{template.description}</p>
              </button>
            ))}
          </AntiGravityGrid>
        </div>

        {/* Reports List */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">
            {language === 'zh-TW' ? '報告列表' : 'Reports List'}
          </h2>
          <div className="space-y-3">
            {reports.map((report) => (
              <div
                key={report.id}
                className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-white/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getReportTypeIcon(report.type)}</div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{report.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getReportStatusColor(report.status)}`}>
                          {getReportStatusText(report.status, language)}
                        </span>
                      </div>
                      <p className="text-sm text-white/60 mb-2">{report.description}</p>
                      <div className="flex items-center gap-4 text-sm text-white/40">
                        <span>{language === 'zh-TW' ? '作者：' : 'Author: '}{report.author}</span>
                        <span>{formatDate(report.createdAt, language)}</span>
                        <span className="flex items-center gap-1">
                          {getFormatIcon(report.format)}
                          {report.format.toUpperCase()}
                        </span>
                        <span>{report.size}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {report.status === 'completed' && (
                      <button
                        onClick={() => handleDownloadReport(report.id)}
                        className="p-2 hover:bg-white/10 text-white/80 rounded-lg transition-all"
                        title={language === 'zh-TW' ? '下載' : 'Download'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    )}
                    {report.status === 'failed' && (
                      <button
                        onClick={() => handleRegenerateReport(report.id)}
                        className="p-2 hover:bg-white/10 text-white/80 rounded-lg transition-all"
                        title={language === 'zh-TW' ? '重新生成' : 'Regenerate'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="23 4 23 10 17 10" />
                          <polyline points="1 20 1 14 7 14" />
                          <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                        </svg>
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteReport(report.id)}
                      className="p-2 hover:bg-red-400/20 text-red-400 rounded-lg transition-all"
                      title={language === 'zh-TW' ? '刪除' : 'Delete'}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ReportsDashboard;
