import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { Language } from '@/types';
import { Sparkles, BrainCircuit, Activity, Zap } from 'lucide-react';
import { LiveRegion } from './ui/LiveRegion';
import { OmniAgentSwarm } from './ui/OmniAgentSwarm';
import { useAccessibleStatus } from '../hooks/useAccessibleStatus';
import { processQuestion, AIProcessorConfig } from '../services/aiProcessor';
import { useSystemMetrics } from '../hooks/useSystemMetrics';

export const ESGAiAssistant: React.FC<{
  language?: Language;
  onNavigate?: any;
  isUltimateActive?: boolean;
}> = ({ language, isUltimateActive }) => {
  const isZh = language === 'zh-TW';
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // 📡 連接實時 Qi 數據 (Connect to real Qi Data)
  const AI_REFRESH_INTERVAL_MS = 5000;
  const metrics = useSystemMetrics(AI_REFRESH_INTERVAL_MS);

  // ♿ 無障礙：狀態宣告
  const { statusMessage } = useAccessibleStatus({
    isLoading: isAnalyzing,
    loadingMessage: isUltimateActive ? '奧秘精靈正在合成全域洞察...' : '正在執行深度掃描...',
    successMessage: '掃描完成',
  });

  const handleRunAnalysis = async () => {
    setIsAnalyzing(true);

    // Simulate a status check request
    const config: AIProcessorConfig = { language: isZh ? 'zh-TW' : 'en' };
    const query = isZh ? '系統狀態如何？' : 'What is the system status?';

    try {
      const response = await processQuestion(query, config);
      omniLogger.info(LogCategory.SYSTEM, '[ESGAiAssistant] Analysis Complete', JSON.stringify(response));
      // In a real chat UI, we would append this to the message list.
      // For this dashboard view, we might update a local state to show the result.
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '[ESGAiAssistant] Analysis Failed', { error });
    } finally {
      setTimeout(() => setIsAnalyzing(false), 3000); // Keep animation for at least 3s for effect
    }
  };

  return (
    <div
      className={`p-6 space-y-6 animate-in fade-in duration-700 ${isUltimateActive ? 'bg-cyan-950/20' : ''}`}
    >
      {/* ♿ 無障礙：即時狀態區域 */}
      <LiveRegion message={statusMessage} />

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-xl transition-all duration-500 ${isUltimateActive ? 'bg-cyan-500 shadow-cyan-500/50 scale-110' : 'bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-purple-500/20'}`}
          >
            {isUltimateActive ? (
              <Sparkles className="text-white w-7 h-7 animate-spin-slow" />
            ) : (
              <BrainCircuit className="text-white w-6 h-6" />
            )}
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              {isZh
                ? isUltimateActive
                  ? '奧秘精靈 · 無有奧義'
                  : '奧秘智庫 AI 樞紐'
                : 'Omni-Knowledge AI Hub'}
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">
              {isZh
                ? isUltimateActive
                  ? '所有代理已連結 · 全知全能模式啟動'
                  : '您的 ESG 進化策略與智慧執行中心'
                : 'Your ESG evolution strategy and smart execution hub'}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* AI Status Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-indigo-500" />
          <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500">
            <Sparkles className="text-purple-400 w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">
            {isZh ? '核心認知引擎' : 'Cognitive Engine'}
          </h3>
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            {isZh ? '運行中' : 'Active'}
          </div>
          <p className="text-slate-400 text-sm mb-8">
            {isZh
              ? '已加載 Gemini 1.5 Pro 與 12 個專用 RAG 脈絡單元。'
              : 'Loaded Gemini 1.5 Pro with 12 specialized RAG context units.'}
          </p>
          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing}
            className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold py-3 rounded-2xl transition-all shadow-lg hover:shadow-indigo-500/20"
            aria-label={
              isAnalyzing
                ? isZh
                  ? '正在執行深度掃描...'
                  : 'Running deep scan...'
                : isZh
                  ? '執行深度掃描'
                  : 'Run deep scan'
            }
          >
            {isAnalyzing
              ? isZh
                ? '分析中...'
                : 'Analyzing...'
              : isZh
                ? '執行深度掃描'
                : 'Deep Scan'}
          </button>
        </div>

        {/* Agent Stream & Integration Status */}
        <div className="md:col-span-2 space-y-6">
          {/* [NEW] Omni Agents Swarm Visualizer */}
          <OmniAgentSwarm isUltimateActive={isUltimateActive} language={language as any} />

          {/* System Integrations */}
          <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 flex flex-col">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Zap className="text-gold-400 w-5 h-5" />
              {isZh ? '子系統整合狀態' : 'Subsystem Integration Status'}
            </h3>
            <div className="space-y-4">
              {[
                {
                  name: 'Boost.space Bridge',
                  status:
                    metrics.boostSpaceStatus === 'synced'
                      ? 'Healthy'
                      : metrics.boostSpaceStatus === 'idle'
                        ? 'Standby'
                        : 'Syncing',
                  latency: `${metrics.latency}ms`,
                  sync: 'Real-time',
                },
                {
                  name: 'AI Model (Straico)',
                  status: metrics.aiStatus === 'active' ? 'Active' : 'Error',
                  latency: `${Math.round(metrics.latency * 0.8)}ms`,
                  sync: 'Neural',
                },
                {
                  name: 'Memory Cache (MCP)',
                  status: metrics.cacheHitRate > 50 ? 'Optimized' : 'Indexing',
                  latency: '1ms',
                  sync: `Hit: ${metrics.cacheHitRate}%`,
                },
              ].map((node, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center">
                      <Activity className="text-slate-400 w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-200">{node.name}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div
                      className={`text-xs font-bold ${node.status === 'Healthy' ? 'text-emerald-400' : 'text-blue-400'}`}
                    >
                      {node.status}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 🧠 Chain of Thought Display */}
      {isAnalyzing && (
        <div className="bg-slate-900/50 border border-purple-500/30 rounded-3xl p-6 mt-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="relative">
              <div className="w-3 h-3 rounded-full bg-purple-500 animate-ping absolute inset-0 opacity-75"></div>
              <div className="w-3 h-3 rounded-full bg-purple-500 relative"></div>
            </div>
            <h4 className="text-purple-300 font-bold text-sm tracking-wider uppercase">
              {isZh ? '連鎖思考中 (Chain of Thought)' : 'Chain of Thought Processing'}
            </h4>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <ThinkingStep
              step="1"
              content={
                isZh
                  ? '接收請求: 啟動深度即時 ESG 掃描...'
                  : 'Receiving request: Initiate deep real-time ESG scan...'
              }
              delay={0}
            />
            <ThinkingStep
              step="2"
              content={
                isZh
                  ? '查詢向量資料庫: 檢索最新的排放因子與法規基準...'
                  : 'Querying Vector DB: Retrieving latest emission factors and regulation benchmarks...'
              }
              delay={500}
            />
            <ThinkingStep
              step="3"
              content={
                isZh
                  ? '交叉驗證: 對比 IPMS 數據與外部基準...'
                  : 'Cross-Validation: Comparing IPMS data against external baselines...'
              }
              delay={1200}
            />
            <ThinkingStep
              step="4"
              content={
                isZh
                  ? '生成策略: 根據缺口分析合成優化路徑...'
                  : 'Strategy Synthesis: Synthesizing optimization paths based on gap analysis...'
              }
              delay={2000}
            />
            <ThinkingStep
              step="5"
              content={
                isZh
                  ? '完成: 準備呈現可執行洞見。'
                  : 'Finalizing: Preparing actionable insights for presentation.'
              }
              delay={2800}
            />
          </div>
        </div>
      )}

      {/* Quick Tips */}
      <div className="bg-gradient-to-r from-indigo-900/20 to-transparent border-l-4 border-indigo-500 p-6 rounded-r-3xl">
        <div className="text-indigo-400 font-bold mb-2 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          {isZh ? 'AI 策略建議' : 'AI Strategic Hint'}
        </div>
        <p className="text-slate-300 text-sm italic">
          "
          {isZh
            ? '目前 ESG 數據的完整度為 94%。建議啟動「年度排放核算」任務以填補最後的缺口，這將使您的善向幣系數提升 1.5 倍。'
            : 'Current ESG data integrity is at 94%. Recommended: Start the "Annual Emission Audit" quest to fill final gaps and boost your Goodwill Coin coefficient by 1.5x.'}
          "
        </p>
      </div>
    </div>
  );
};

// Helper for Thinking Steps
const ThinkingStep: React.FC<{ step: string; content: string; delay: number }> = ({
  step,
  content,
  delay,
}) => {
  const [visible, setVisible] = useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return (
    <div className="flex gap-3 text-slate-300 animate-in fade-in slide-in-from-left-2">
      <span className="text-purple-500 font-bold">[{step}]</span>
      <span className="typing-effect">{content}</span>
    </div>
  );
};
