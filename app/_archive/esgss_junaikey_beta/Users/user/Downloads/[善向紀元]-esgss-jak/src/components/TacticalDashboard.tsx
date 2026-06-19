// src/components/TacticalDashboard.tsx

import React, { useState } from 'react';
import { useUniversalHistory } from '../store/useUniversalHistory';
import { EvolutionAdvisor, EvolutionReport } from '../services/evolutionAdvisor';
import { OmniEsgCell } from './OmniEsgCell';
import { ShieldCheck, Zap, Activity, Database, Sparkles, BrainCircuit, AlertTriangle, CheckCircle } from './icons';

export const TacticalDashboard = () => {
  const { stats, logs } = useUniversalHistory();
  const [report, setReport] = useState<EvolutionReport | null>(null);
  const [isConsulting, setIsConsulting] = useState(false);

  // 執行諮詢
  const handleConsult = async () => {
    setIsConsulting(true);
    try {
      const result = await EvolutionAdvisor.consult();
      setReport(result);
    } catch (e) {
      alert("系統數據不足，無法進行分析");
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="p-6 bg-slate-950/80 rounded-3xl border border-slate-800 backdrop-blur-xl shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BrainCircuit className="text-celestial-purple" />
          戰術儀表板 (Tactical View)
        </h2>

        {/* ✨ 召喚按鈕 */}
        <button
          onClick={handleConsult}
          disabled={isConsulting}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all
            ${isConsulting
              ? 'bg-slate-800 text-slate-400 cursor-wait'
              : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-[0_0_20px_rgba(129,140,248,0.5)] hover:scale-105'}
          `}
        >
          {isConsulting ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin" />
              正在通靈架構師...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              生成進化報告
            </>
          )}
        </button>
      </div>

      {/* 1. 核心指標矩陣 (Meta-Metrics) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

        {/* 免疫系統攔截數 */}
        <OmniEsgCell
          mode="card"
          label="Entropy Interceptions"
          value={stats.totalHeals}
          subValue="Threats Neutralized"
          icon={ShieldCheck}
          color="gold" // 金色代表防禦
          traits={['optimization', 'evolution']} // 啟用呼吸燈特效
          trend={{ value: 12, direction: 'up' }} // 模擬數據
          confidence="high"
          verified={true}
        />

        {/* 自動化執行數 */}
        <OmniEsgCell
          mode="card"
          label="Neural Synapses"
          value={stats.totalAutomations}
          subValue="Actions Dispatched"
          icon={Zap}
          color="purple" // 紫色代表自動化
          traits={['bridging', 'performance']}
          dataLink="live"
        />

        {/* 智庫容量 */}
        <OmniEsgCell
          mode="card"
          label="Knowledge Fragments"
          value={logs.length}
          subValue="Events Memorized"
          icon={Database}
          color="emerald"
          traits={['learning']} // 啟用學習圖標
        />
      </div>

      {/* ✨ 進化報告展示區 (Report Manifestation) */}
      {report && (
        <div className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700 rounded-2xl p-6 relative overflow-hidden group">

            {/* 背景光效 */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-3xl rounded-full pointer-events-none" />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                    Seraphim Evolution Report
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">
                    Generated at {new Date(report.generatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-xs text-slate-500 uppercase tracking-widest">Health Score</span>
                  <span className={`text-3xl font-black font-mono ${
                    report.healthScore > 80 ? 'text-emerald-400' :
                    report.healthScore > 50 ? 'text-amber-400' : 'text-red-400'
                  }`}>
                    {report.healthScore}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-black/30 rounded-xl mb-6 border-l-4 border-purple-500 text-slate-300 italic">
                "{report.summary}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 脆弱點分析 */}
                <div>
                  <h4 className="text-xs font-bold text-red-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3" /> Detected Weakness
                  </h4>
                  <ul className="space-y-2">
                    {report.weakPoints.map((point, i) => (
                      <li key={i} className="text-sm text-slate-400 flex items-start gap-2 bg-red-500/5 p-2 rounded">
                        <span className="text-red-500/50">•</span> {point}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 戰略建議 */}
                <div>
                  <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle className="w-3 h-3" /> Strategic Optimization
                  </h4>
                  <ul className="space-y-2">
                    {report.strategicAdvice.map((advice, i) => (
                      <li key={i} className="text-sm text-slate-300 flex items-start gap-2 bg-emerald-500/5 p-2 rounded hover:bg-emerald-500/10 transition-colors cursor-pointer">
                        <span className="text-emerald-500">→</span> {advice}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. 實時神經流 (Live Neural Stream) */}
      <div className="bg-black/40 rounded-xl p-4 border border-white/5 h-64 overflow-y-auto font-mono text-xs">
        <h3 className="text-gray-400 mb-3 sticky top-0 bg-black/80 p-1 backdrop-blur">
          &gt;&gt; SYSTEM_EVENT_STREAM
        </h3>

        {logs.length === 0 && (
          <div className="text-gray-600 italic text-center mt-10">System Quiet. No Entropy Detected.</div>
        )}

        {logs.map((log) => (
          <div key={log.id} className="mb-2 border-l-2 border-gray-700 pl-3 py-1 hover:bg-white/5 transition-colors">
            <div className="flex justify-between text-gray-500">
              <span>[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`font-bold ${
                log.type === 'IMMUNITY_HEAL' ? 'text-amber-400' :
                log.type === 'AUTOMATION_TRIGGER' ? 'text-purple-400' : 'text-blue-400'
              }`}>
                {log.type}
              </span>
            </div>
            <div className="text-gray-300 mt-0.5">
              Source: <span className="text-white">{log.sourceLabel}</span>
            </div>
            <div className="text-gray-500 mt-0.5 truncate">
              {JSON.stringify(log.payload)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};