/**
 * 🧭 引導式撰寫流程組件
 * --------------------------------------------------
 * [功能] 5 步驟引導：準備 → 素材 → 撰寫 → 審核 → 發布
 * [整合] AI 助手、合規檢查、進度追蹤
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Edit3,
  CheckCircle,
  Send,
  ArrowRight,
  ArrowLeft,
  Bot,
  AlertTriangle,
  Sparkles,
  BookOpen,
  Database,
  ShieldCheck,
  ChevronRight,
  Clock,
  Target,
} from 'lucide-react';
import { aiServiceWrapper } from '@/services/AiServiceWrapper';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';
import { v4 as uuidv4 } from 'uuid';
import { useEffect } from 'react';

// ============================================================================
// Types
// ============================================================================

export type WritingStep = '準備' | '素材' | '撰寫' | '審核' | '發布';

export interface StepConfig {
  id: WritingStep;
  label: string;
  icon: React.ReactNode;
  description: string;
  guideQuestions: string[];
  aiPrompts: string[];
}

export interface WritingProgress {
  currentStep: WritingStep;
  completedSteps: WritingStep[];
  stepData: Record<WritingStep, Record<string, unknown>>;
  lastSaved: number;
}

export interface ComplianceCheck {
  standard: string;
  status: 'pass' | 'warning' | 'fail';
  message: string;
  suggestion?: string;
}

// ============================================================================
// Step Configurations
// ============================================================================

const STEPS: StepConfig[] = [
  {
    id: '準備',
    label: '1. 準備階段',
    icon: <Target size={20} />,
    description: '設定報告範圍、目標與時程',
    guideQuestions: [
      '本次報告涵蓋的年度範圍為何？',
      '報告邊界涵蓋哪些營運據點？',
      '主要利害關係人有哪些？',
      '報告依循哪些標準？(GRI/SASB/TCFD)',
    ],
    aiPrompts: ['協助確定報告邊界', '識別重大議題', '規劃時程表'],
  },
  {
    id: '素材',
    label: '2. 素材收集',
    icon: <Database size={20} />,
    description: '收集 ESG 數據與佐證資料',
    guideQuestions: [
      '是否已完成碳盤查（Scope 1/2/3）？',
      '員工相關數據是否已彙整？',
      '治理結構資料是否完整？',
      '有哪些證照或獎項可揭露？',
    ],
    aiPrompts: ['自動辨識缺失數據', '建議資料來源', '數據品質檢查'],
  },
  {
    id: '撰寫',
    label: '3. 撰寫內容',
    icon: <Edit3 size={20} />,
    description: 'AI 輔助報告章節撰寫',
    guideQuestions: [
      '環境面要強調哪些成效？',
      '社會面有何重點揭露？',
      '治理架構如何呈現？',
      '風險管理策略為何？',
    ],
    aiPrompts: ['生成章節草稿', '優化文字表達', '自動產生圖表敘述'],
  },
  {
    id: '審核',
    label: '4. 審核驗證',
    icon: <ShieldCheck size={20} />,
    description: '合規檢查與內部審核',
    guideQuestions: [
      '是否符合 GRI 揭露要求？',
      '數據計算方法是否說明？',
      '是否有第三方驗證？',
      '內部簽核流程是否完成？',
    ],
    aiPrompts: ['自動合規性檢查', '識別揭露缺口', '生成驗證清單'],
  },
  {
    id: '發布',
    label: '5. 發布揭露',
    icon: <Send size={20} />,
    description: '最終發布與區塊鏈存證',
    guideQuestions: [
      '發布格式為何？(PDF/網頁/XBRL)',
      '揭露平台有哪些？(公開網站/交易所)',
      '是否需要區塊鏈存證？',
      '後續更新機制為何？',
    ],
    aiPrompts: ['生成執行摘要', '準備多語言版本', '建立區塊鏈存證'],
  },
];

// ============================================================================
// Main Component
// ============================================================================

interface GuidedWritingFlowProps {
  onComplete?: (data: WritingProgress) => void;
  initialProgress?: WritingProgress;
  companyName?: string;
}

export const GuidedWritingFlow: React.FC<GuidedWritingFlowProps> = ({
  onComplete,
  initialProgress,
  companyName = '貴公司',
}) => {
  const currentStepIndex = Math.max(
    0,
    Math.min(
      initialProgress ? STEPS.findIndex(s => s.id === initialProgress.currentStep) : 0,
      STEPS.length - 1
    )
  );
  const [stepIndex, setStepIndex] = useState(currentStepIndex);
  const [completedSteps, setCompletedSteps] = useState<WritingStep[]>(
    initialProgress?.completedSteps || []
  );
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
  const [complianceResults, setComplianceResults] = useState<ComplianceCheck[]>([]);

  useEffect(() => {
    omniLogger.info(LogCategory.GROWTH, '引導撰寫流程已啟動', {
      companyName,
      source_origin: 'GuidedWritingFlow.mount',
    });
  }, [companyName]);

  // Ensure currentStep is always defined (STEPS is a non-empty constant array)
  const currentStep: StepConfig = STEPS[stepIndex] ?? STEPS[0]!;

  // Navigate steps
  const goNext = () => {
    const trace_id = uuidv4();
    if (stepIndex < STEPS.length - 1) {
      const nextStepId = STEPS[stepIndex + 1]?.id || 'unknown';
      omniLogger.info(LogCategory.GROWTH, `引導撰寫進入下一階段: ${nextStepId}`, {
        trace_id,
        from: currentStep?.id,
        to: nextStepId,
        source_origin: 'GuidedWritingFlow.goNext',
      });
      setCompletedSteps(prev => [...new Set([...prev, currentStep.id])]);
      setStepIndex(prev => prev + 1);
      setAiSuggestion(null);
    } else {
      // Complete
      onComplete?.({
        currentStep: '發布',
        completedSteps: [...completedSteps, '發布'],
        stepData: {} as Record<WritingStep, Record<string, unknown>>,
        lastSaved: Date.now(),
      });
    }
  };

  const goPrev = () => {
    if (stepIndex > 0) {
      setStepIndex(prev => prev - 1);
      setAiSuggestion(null);
    }
  };

  // AI Assistant
  const askAI = async (prompt: string) => {
    setAiLoading(true);
    try {
      const response = await aiServiceWrapper.chat(
        `永續報告撰寫階段：${currentStep.label}\n\n請求：${prompt}\n\n公司：${companyName}`,
        {
          systemPrompt:
            '你是永續報告撰寫專家，熟悉 GRI、SASB、TCFD 標準。提供專業、具體的建議。使用繁體中文回答。',
          temperature: 0.7,
          maxTokens: 500,
        }
      );
      setAiSuggestion(response.data || '暫無建議');
    } catch (error) {
      setAiSuggestion('AI 服務暫時無法連線，請稍後再試。');
    }
    setAiLoading(false);
  };

  // Compliance Check (Mock)
  const runComplianceCheck = () => {
    setComplianceResults([
      { standard: 'GRI 2-1', status: 'pass', message: '組織詳細資料已完整揭露' },
      {
        standard: 'GRI 305-1',
        status: 'warning',
        message: '範疇一排放計算方法建議補充',
        suggestion: '建議說明所使用的排放係數來源',
      },
      { standard: 'TCFD Strategy', status: 'pass', message: '氣候相關策略已說明' },
      {
        standard: 'SASB IF-EU-110a.1',
        status: 'fail',
        message: '淨購買電力未揭露',
        suggestion: '請新增電力採購資訊',
      },
    ]);
  };

  // Progress calculation
  const progressPercent =
    ((currentStepIndex + (completedSteps.includes(currentStep.id) ? 1 : 0)) / STEPS.length) * 100;

  return (
    <div className="frosted-panel rounded-2xl p-6 border border-cyan-500/20 neon-border-cyan animate-in relative overflow-hidden">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 cyber-grid opacity-5 pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <BookOpen size={24} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">引導式報告撰寫引擎</h2>
            <p className="text-sm text-slate-400">{companyName} - 數據匯流中</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-800/50 px-3 py-1.5 rounded-full">
          <Clock size={12} className="text-cyan-400 mr-2" />
          Auto-Sync Active
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative mb-8">
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <div className="flex justify-between mt-3">
          {STEPS.map((step, idx) => (
            <button
              key={step.id}
              onClick={() => setStepIndex(idx)}
              className={`flex flex-col items-center gap-1 transition-all ${
                idx === stepIndex
                  ? 'text-cyan-400 scale-110'
                  : completedSteps.includes(step.id)
                    ? 'text-green-400'
                    : 'text-slate-500'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  idx === stepIndex
                    ? 'border-cyan-400 bg-cyan-400/20'
                    : completedSteps.includes(step.id)
                      ? 'border-green-400 bg-green-400/20'
                      : 'border-slate-600'
                }`}
              >
                {completedSteps.includes(step.id) ? <CheckCircle size={16} /> : step.icon}
              </div>
              <span className="text-xs hidden sm:block">{step.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="min-h-[400px]"
        >
          {/* Step Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400">
              {currentStep.icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{currentStep.label}</h3>
              <p className="text-sm text-slate-400">{currentStep.description}</p>
            </div>
          </div>

          {/* Guide Questions */}
          <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
            <h4 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
              <FileText size={14} />
              引導問題
            </h4>
            <div className="space-y-3">
              {currentStep.guideQuestions.map((q, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <ChevronRight size={16} className="text-cyan-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-slate-300 mb-2">{q}</p>
                    <textarea
                      className="w-full bg-slate-700/50 border border-slate-600 rounded-lg p-2 text-sm text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none"
                      placeholder="請輸入您的回答..."
                      rows={2}
                      value={answers[`${currentStep.id}-${idx}`] || ''}
                      onChange={e =>
                        setAnswers(prev => ({
                          ...prev,
                          [`${currentStep.id}-${idx}`]: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-4 mb-4 border border-purple-500/20">
            <h4 className="text-sm font-medium text-purple-300 mb-3 flex items-center gap-2">
              <Bot size={14} />
              AI 助手
            </h4>
            <div className="flex flex-wrap gap-2 mb-3">
              {currentStep.aiPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => askAI(prompt)}
                  disabled={aiLoading}
                  className="px-3 py-1.5 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 rounded-lg text-sm text-purple-300 flex items-center gap-1.5 transition-all disabled:opacity-50"
                >
                  <Sparkles size={12} />
                  {prompt}
                </button>
              ))}
            </div>
            {aiLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                AI 正在思考中...
              </div>
            )}
            {aiSuggestion && !aiLoading && (
              <div className="bg-slate-800/50 rounded-lg p-3 text-sm text-slate-300">
                {aiSuggestion}
              </div>
            )}
          </div>

          {/* Compliance Check (Audit Step) */}
          {currentStep.id === '審核' && (
            <div className="bg-slate-800/50 rounded-xl p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-medium text-slate-300 flex items-center gap-2">
                  <ShieldCheck size={14} />
                  合規性檢查
                </h4>
                <button
                  onClick={runComplianceCheck}
                  className="px-3 py-1 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg text-xs text-cyan-400 transition-all"
                >
                  執行檢查
                </button>
              </div>
              {complianceResults.length > 0 && (
                <div className="space-y-2">
                  {complianceResults.map((result, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 p-2 rounded-lg ${
                        result.status === 'pass'
                          ? 'bg-green-500/10'
                          : result.status === 'warning'
                            ? 'bg-yellow-500/10'
                            : 'bg-red-500/10'
                      }`}
                    >
                      {result.status === 'pass' ? (
                        <CheckCircle size={14} className="text-green-400 mt-0.5" />
                      ) : result.status === 'warning' ? (
                        <AlertTriangle size={14} className="text-yellow-400 mt-0.5" />
                      ) : (
                        <AlertTriangle size={14} className="text-red-400 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-slate-400">
                            {result.standard}
                          </span>
                          <span className="text-sm text-slate-300">{result.message}</span>
                        </div>
                        {result.suggestion && (
                          <p className="text-xs text-slate-500 mt-1">💡 {result.suggestion}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
        <button
          onClick={goPrev}
          disabled={stepIndex === 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeft size={16} />
          上一步
        </button>
        <button
          onClick={goNext}
          className="flex items-center gap-2 px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium hover:shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          {stepIndex === STEPS.length - 1 ? '完成發布' : '下一步'}
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default GuidedWritingFlow;
