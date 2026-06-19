import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { Language } from '@/types/core';
import { FileText, Download, Calendar, CheckSquare, Sparkles, Eye, Code } from 'lucide-react';
import { LiveRegion } from '../ui/LiveRegion';
import { useAccessibleStatus } from '../../hooks/useAccessibleStatus';
import VerificationBadge from '../Report/VerificationBadge';
import { generateTypstReport } from '../../utils/typstTemplate';
import { ReportService } from '../../services/ReportService';

import { ReportPrepWizard } from '../Report/ReportPrepWizard';

export const ReportGen: React.FC<{ language: Language }> = ({ language }) => {
  const isZh = language === 'zh-TW';
  const [activeMode, setActiveMode] = useState<'wizard' | 'generator'>('wizard'); // Default to Wizard for guidance
  const [selectedTemplate, setSelectedTemplate] = useState('esg-annual');
  const [statusMessage, setStatusMessage] = useState('準備就緒');
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'typst'>('pdf');

  const templates = [
    {
      id: 'esg-annual',
      name: '2024 ESG 永續報告書',
      description: '符合 GRI 準則與 SASB 標準的年度報告完整模板。',
      pages: 120,
      time: 5,
      icon: '📘',
    },
    {
      id: 'carbon-q',
      name: '季度碳盤查報告',
      description: '專注於 ISO 14064-1 溫室氣體盤查數據的季度摘要。',
      pages: 15,
      time: 1,
      icon: '🌿',
    },
    {
      id: 'tcfd-risk',
      name: 'TCFD 氣候風險揭露',
      description: '針對氣候相關財務揭露的專項報告模板。',
      pages: 40,
      time: 3,
      icon: '⛈️',
    },
    {
      id: 'supply-chain',
      name: '供應商稽核摘要',
      description: '供應鏈永續管理與風險評估摘要報告。',
      pages: 25,
      time: 2,
      icon: '🚚',
    },
  ];

  const recentReports = [
    { name: '2024_Q3_ESG_Report_Draft.pdf', date: '2024-10-15', downloads: 12 },
    { name: 'TCFD_Analysis_v2.typ', date: '2024-10-12', downloads: 5 },
    { name: 'Supplier_Audit_2024_A.pdf', date: '2024-09-30', downloads: 34 },
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage(
      isZh ? '正在分析數據並生成報告...' : 'Analyzing data and generating report...'
    );

    try {
      const reportService = new ReportService();
      const report = await reportService.generateReport({
        type:
          selectedTemplate === 'carbon-q'
            ? 'carbon'
            : selectedTemplate === 'tcfd-risk'
              ? 'financial_impact'
              : 'sustainability',
        timeframe: 'yearly',
        format: 'pdf',
        language: isZh ? 'zh-TW' : 'en',
      } as any);

      if (selectedFormat === 'typst') {
        // Download .typ file directly
        const blob = new Blob([report.content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sovereign_Disclosure_${new Date().getFullYear()}.typ`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        // PDF generation via backend
        setStatusMessage(isZh ? '正在編譯 PDF...' : 'Compiling PDF...');
        const response = await fetch('/api/report/typst', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            data: {
              title: report.title,
              content: report.content,
              period: '2025 FY',
            },
          }),
        });

        if (!response.ok) throw new Error('PDF compilation failed');

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Sovereign_Disclosure_${new Date().getFullYear()}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }

      setStatusMessage(isZh ? '報告下載已開始！' : 'Download started!');
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ReportGen] Report generation failed:', { error })
      setStatusMessage(isZh ? '生成失敗，請重試。' : 'Generation failed, please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      {/* ♿ 無障礙：即時狀態區域 */}
      <LiveRegion message={statusMessage} />
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileText className="text-indigo-400 w-6 h-6" />
            {isZh ? 'ESG 報告指揮中心' : 'ESG Report Command Center'}
          </h1>
          <p className="text-slate-400 mt-1 text-sm font-medium">
            {isZh
              ? '從資料蒐集導引到專業報告生成的一站式工作流程'
              : 'End-to-end workflow from guided data collection to professional generation'}
          </p>
        </div>
      </div>

      {/* Mode Toggle */}
      <div className="flex p-1 bg-slate-900 border border-white/10 rounded-xl w-fit">
        <button
          onClick={() => setActiveMode('wizard')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeMode === 'wizard' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <CheckSquare className="w-4 h-4" /> 資料準備 (Data Prep)
        </button>
        <div className="w-px bg-white/10 my-1 mx-1"></div>
        <button
          onClick={() => setActiveMode('generator')}
          className={`px-6 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeMode === 'generator' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
        >
          <Sparkles className="w-4 h-4" /> 報告生成 (Generator)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conditional Rendering based on Mode */}
        {activeMode === 'wizard' ? (
          <div className="lg:col-span-3">
            <ReportPrepWizard />
          </div>
        ) : (
          <>
            {/* Template Selection */}
            <div className="lg:col-span-2 space-y-4">
              <h2 className="text-lg font-bold text-white">
                {isZh ? '選擇報告模板' : 'Select Report Template'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {templates.map(template => (
                  <div
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`bg-slate-900/50 border-2 rounded-2xl p-5 cursor-pointer transition-all ${
                      selectedTemplate === template.id
                        ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                        : 'border-white/5 hover:border-white/10'
                    }`}
                    role="button"
                    tabIndex={0}
                    aria-label={`${isZh ? '選擇' : 'Select'} ${template.name}${isZh ? '模板，約需' : ' template, approximately'} ${template.time} ${isZh ? '分鐘' : 'minutes'}`}
                    onKeyDown={e => {
                      if (e.key === 'Enter' || e.key === ' ') setSelectedTemplate(template.id);
                    }}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-2xl">
                        {template.icon}
                      </div>
                      {selectedTemplate === template.id && (
                        <CheckSquare className="w-5 h-5 text-indigo-400" />
                      )}
                    </div>
                    <h3 className="text-white font-bold mb-1">{template.name}</h3>
                    <p className="text-xs text-slate-400 mb-4">{template.description}</p>
                    <div className="flex gap-4 text-xs text-slate-500">
                      <span>
                        📄 {template.pages} {isZh ? '頁' : 'pages'}
                      </span>
                      <span>
                        ⏱️ {template.time} {isZh ? '分鐘' : 'min'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Generation Settings */}
            <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-fit">
              <h2 className="text-lg font-bold text-white mb-4">
                {isZh ? '生成設定' : 'Generation Settings'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    {isZh ? '報告期間' : 'Reporting Period'}
                  </label>
                  <select className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>2025 {isZh ? '全年' : 'Full Year'}</option>
                    <option>2025 Q4</option>
                    <option>2025 Q3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    {isZh ? '語言' : 'Language'}
                  </label>
                  <select className="w-full bg-slate-800 border border-slate-600 text-white rounded-lg px-4 py-2">
                    <option>{isZh ? '繁體中文' : 'Traditional Chinese'}</option>
                    <option>English</option>
                    <option>{isZh ? '雙語' : 'Bilingual'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-400 mb-2">
                    {isZh ? '格式' : 'Format'}
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedFormat('typst')}
                      className={`border-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedFormat === 'typst'
                          ? 'bg-cyan-600/20 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      Typst (.typ)
                    </button>
                    <button
                      onClick={() => setSelectedFormat('pdf')}
                      className={`border-2 py-2 rounded-lg font-semibold text-sm transition-all ${
                        selectedFormat === 'pdf'
                          ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                          : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                      }`}
                    >
                      PDF (Standard)
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <span className="text-white text-sm">
                    {isZh ? 'AI 優化內容' : 'AI Content Enhancement'}
                  </span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-slate-700 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                <button
                  onClick={handleGenerate}
                  disabled={isGenerating}
                  className={`w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    selectedFormat === 'typst'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white'
                      : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  }`}
                  aria-label={
                    isGenerating
                      ? isZh
                        ? '正在生成報告...'
                        : 'Generating report...'
                      : `${isZh ? '生成' : 'Generate'} ${templates.find(t => t.id === selectedTemplate)?.name}`
                  }
                >
                  {isGenerating ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {isZh ? '生成中...' : 'Generating...'}
                    </>
                  ) : (
                    <>
                      {selectedFormat === 'typst' ? (
                        <Code className="w-5 h-5" />
                      ) : (
                        <Sparkles className="w-5 h-5" />
                      )}
                      {isZh
                        ? selectedFormat === 'typst'
                          ? '下載 Typst 源碼'
                          : '生成 PDF 報告'
                        : selectedFormat === 'typst'
                          ? 'Download .typ Source'
                          : 'Generate PDF'}
                    </>
                  )}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Recent Reports */}
      <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white mb-4">
          {isZh ? '最近生成的報告' : 'Recent Reports'}
        </h2>
        <div className="space-y-3">
          {recentReports.map((report, i) => (
            <div
              key={i}
              className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-white font-semibold">{report.name}</p>
                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                    {/* Access Verification Data safely */}
                    {(report as any).txHash && (
                      <VerificationBadge
                        reportId="mock-id"
                        merkleRoot={(report as any).merkleRoot}
                        timestamp={new Date(report.date)}
                        txHash={(report as any).txHash}
                      />
                    )}
                    <div className="flex items-center gap-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {report.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        {report.downloads} {isZh ? '次下載' : 'downloads'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    {isZh ? '預覽' : 'Preview'}
                  </button>
                  <button className="bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    {isZh ? '下載' : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-indigo-400 mb-1">24</div>
          <div className="text-xs text-slate-400">
            {isZh ? '本月生成報告' : 'Reports This Month'}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-emerald-400 mb-1">156</div>
          <div className="text-xs text-slate-400">{isZh ? '累計報告' : 'Total Reports'}</div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-amber-400 mb-1">4.2</div>
          <div className="text-xs text-slate-400">
            {isZh ? '平均生成時間 (分鐘)' : 'Avg Generation Time (min)'}
          </div>
        </div>
        <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 text-center">
          <div className="text-3xl font-black text-purple-400 mb-1">98%</div>
          <div className="text-xs text-slate-400">{isZh ? '內容準確度' : 'Content Accuracy'}</div>
        </div>
      </div>
    </div>
  );
};
