import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useLanguage } from '../../contexts/LanguageContext'; // Assuming context exists
import {
  reportingService,
  ReportType,
  IGeneratedReport,
  IEvidenceNode,
} from '../../services/reportingService';
import {
  FileText,
  Shield,
  Link,
  Activity,
  CheckCircle,
  Download,
  FileCheck,
  BrainCircuit,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ==================== BILINGUAL TEXT MAPPING ====================
const TEXT = {
  TITLE: { zh: 'ESG 報告與合規套件', en: 'ESG Reporting & Compliance Suite' },
  SUBTITLE: {
    zh: '三可一不可：可追溯、可追蹤、可計算、不可篡改',
    en: "Three Do's One Don't: Traceable, Trackable, Calculable, Immutable",
  },
  STEPS: {
    CONFIG: { zh: '報告設定', en: 'Configuration' },
    GENERATING: { zh: '生成運算', en: 'Processing' },
    EVIDENCE: { zh: '證據鏈驗證', en: 'Evidence Chain' },
    COMPLETE: { zh: '完成產出', en: 'Completion' },
  },
  ACTIONS: {
    START: { zh: '開始生成報告', en: 'Start Generation' },
    NEXT: { zh: '下一步', en: 'Next Step' },
    DOWNLOAD: { zh: '下載報告', en: 'Download Report' },
    VERIFY: { zh: '驗證區塊鏈雜湊', en: 'Verify Blockchain Hash' },
  },
  LABELS: {
    PERIOD: { zh: '報告期間', en: 'Reporting Period' },
    TEMPLATE: { zh: '選擇模板', en: 'Select Template' },
    AI_ENHANCE: { zh: '啟用 AI 深度分析', en: 'Enable AI Deep Analysis' },
    INTEGRITY: { zh: '報告完整性雜湊', en: 'Report Integrity Hash' },
  },
};

const TEMPLATES = [
  {
    id: 'esg-annual',
    name: { zh: 'ESG 年度綜合報告', en: 'ESG Annual Comprehensive Report' },
    icon: '📘',
  },
  {
    id: 'carbon',
    name: { zh: 'ISO 14064 溫室氣體盤查', en: 'ISO 14064 GHG Inventory' },
    icon: 'bf',
  },
  {
    id: 'gri',
    name: { zh: 'GRI 準則永續報告', en: 'GRI Standards Sustainability Report' },
    icon: '🌍',
  },
];

// ==================== COMPONENTS ====================

const EvidenceNode = ({
  node,
  index,
  isZh,
}: {
  node: IEvidenceNode;
  index: number;
  isZh: boolean;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.2 }}
    className="flex items-start gap-4 p-4 bg-white/5 border border-white/10 rounded-xl mb-4 relative overflow-hidden"
  >
    {/* Source Icon */}
    <div
      className={`
            p-3 rounded-lg flex items-center justify-center shrink-0
            ${
              node.sourceType === 'BLOCKCHAIN'
                ? 'bg-purple-500/20 text-purple-400'
                : node.sourceType === 'IOT'
                  ? 'bg-cyan-500/20 text-cyan-400'
                  : 'bg-slate-500/20 text-slate-400'
            }
        `}
    >
      {node.sourceType === 'BLOCKCHAIN' && <Link size={20} />}
      {node.sourceType === 'IOT' && <Activity size={20} />}
      {node.sourceType === 'SYSTEM' && <FileText size={20} />}
    </div>

    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white text-sm">{node.description}</h4>
        {node.verified && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-900/30 px-2 py-0.5 rounded border border-emerald-900">
            <Shield size={10} /> {isZh ? '已驗證' : 'VERIFIED'}
          </span>
        )}
      </div>
      <div className="text-xs text-slate-500 mt-1 font-mono">
        ID: {node.id} | TS: {node.timestamp}
      </div>
      <div className="mt-2 p-2 bg-black/40 rounded text-[10px] text-slate-600 font-mono break-all border border-white/5">
        HASH: {node.rawHash}
      </div>
    </div>

    {/* Connector Line */}
    {index < 2 && <div className="absolute left-[2.25rem] -bottom-6 w-0.5 h-6 bg-white/10 z-0" />}
  </motion.div>
);

export const ESGReportGenFull = () => {
  const { language } = useLanguage();
  const isZh = language === 'zh-TW';

  // State
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [config, setConfig] = useState({
    period: '2025-Q4',
    templateId: 'esg-annual',
    aiEnhanced: true,
  });
  const [report, setReport] = useState<IGeneratedReport | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleGenerate = async () => {
    setIsProcessing(true);
    try {
      const result = await reportingService.generateReport({
        ...config,
        language: isZh ? 'zh-TW' : 'en-US',
      });
      setReport(result);
      setStep(2); // Go to Evidence
    } catch (e) {
      omniLogger.error(LogCategory.SYSTEM, '[ESGReportGenFull] Error', { error: e });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col p-6 text-white overflow-hidden relative">
      {/* Header */}
      <div className="mb-8 text-center shrink-0">
        <h2 className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
          {isZh ? TEXT.TITLE.zh : TEXT.TITLE.en}
        </h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-slate-400 text-sm font-mono">
          <Shield size={14} className="text-emerald-500" />
          {isZh ? TEXT.SUBTITLE.zh : TEXT.SUBTITLE.en}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex gap-8 min-h-0">
        {/* Left Panel: Controls / Wizard */}
        <div className="w-1/3 bg-slate-900/50 border border-white/10 rounded-2xl p-6 flex flex-col">
          {/* Stepper */}
          <div className="flex items-center justify-between mb-8 px-2 relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/10 -z-10" />
            {[1, 2, 3].map(s => (
              <div
                key={s}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all
                                    ${step >= s ? 'bg-emerald-500 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' : 'bg-slate-800 text-slate-500 border border-slate-700'}
                                `}
              >
                {s}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6 animate-in slide-in-from-left duration-300">
              <div>
                <label className="block text-sm font-bold text-emerald-400 mb-2">
                  {isZh ? TEXT.LABELS.TEMPLATE.zh : TEXT.LABELS.TEMPLATE.en}
                </label>
                <div className="space-y-2">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setConfig({ ...config, templateId: t.id })}
                      className={`w-full p-3 rounded-xl border flex items-center gap-3 transition-all text-left
                                                ${config.templateId === t.id ? 'bg-emerald-900/20 border-emerald-500 ml-2' : 'bg-slate-800/50 border-white/5 hover:bg-slate-800'}
                                            `}
                    >
                      <span className="text-2xl">{t.icon}</span>
                      <span className="text-sm font-medium">{isZh ? t.name.zh : t.name.en}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-emerald-400 mb-2">
                  {isZh ? TEXT.LABELS.PERIOD.zh : TEXT.LABELS.PERIOD.en}
                </label>
                <select
                  className="w-full bg-black/40 border border-white/10 rounded-lg p-2 text-sm focus:border-emerald-500 outline-none"
                  value={config.period}
                  onChange={e => setConfig({ ...config, period: e.target.value })}
                >
                  <option value="2025-FY">2025 Full Year</option>
                  <option value="2025-Q4">2025 Q4</option>
                  <option value="2025-Q3">2025 Q3</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 bg-indigo-900/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <BrainCircuit className="text-indigo-400" size={18} />
                  <span className="text-sm text-indigo-100">
                    {isZh ? TEXT.LABELS.AI_ENHANCE.zh : TEXT.LABELS.AI_ENHANCE.en}
                  </span>
                </div>
                <div
                  className={`w-10 h-6 rounded-full p-1 transition-colors cursor-pointer ${config.aiEnhanced ? 'bg-indigo-500' : 'bg-slate-700'}`}
                  onClick={() => setConfig({ ...config, aiEnhanced: !config.aiEnhanced })}
                >
                  <div
                    className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${config.aiEnhanced ? 'translate-x-4' : ''}`}
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isProcessing}
                className="w-full py-4 mt-auto bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? <Activity className="animate-spin" /> : <FileCheck />}
                {isProcessing
                  ? isZh
                    ? TEXT.STEPS.GENERATING.zh
                    : TEXT.STEPS.GENERATING.en
                  : isZh
                    ? TEXT.ACTIONS.START.zh
                    : TEXT.ACTIONS.START.en}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right duration-300 h-full flex flex-col">
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/30">
                  <CheckCircle className="w-10 h-10 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {isZh ? '報告已生成' : 'Report Generated'}
                </h3>
                <p className="text-xs text-slate-400 font-mono">{report?.generatedAt}</p>
              </div>

              <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                <label className="block text-xs font-mono text-slate-500 mb-1">
                  {isZh ? TEXT.LABELS.INTEGRITY.zh : TEXT.LABELS.INTEGRITY.en}
                </label>
                <div className="flex items-center gap-2">
                  <code className="text-xs text-emerald-400 break-all">
                    {report?.integrityHash}
                  </code>
                  <Shield size={14} className="text-emerald-500 shrink-0" />
                </div>
              </div>

              <button
                onClick={() => setStep(3)}
                className="w-full py-4 mt-auto border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                {isZh ? '查看完整報告' : 'View Full Report'}
              </button>
            </div>
          )}
        </div>

        {/* Right Panel: Visualization / Evidence Chain */}
        <div className="flex-1 bg-black/60 border border-white/10 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
          {/* Background Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px]" />

          {step === 1 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <div className="w-32 h-32 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4">
                <FileText size={48} className="opacity-20" />
              </div>
              <p>{isZh ? '等待設定參數...' : 'Waiting for configuration...'}</p>
            </div>
          )}

          {step === 2 && report && (
            <div className="relative h-full overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Link className="text-emerald-400" />
                  {isZh ? TEXT.STEPS.EVIDENCE.zh : TEXT.STEPS.EVIDENCE.en}
                </h3>
                <span className="text-xs px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400">
                  {report.evidenceChain.length} Nodes
                </span>
              </div>

              <div className="relative pl-4 border-l border-white/10 ml-2">
                {report.evidenceChain.map((node, i) => (
                  <EvidenceNode key={node.id} node={node} index={i} isZh={isZh} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
