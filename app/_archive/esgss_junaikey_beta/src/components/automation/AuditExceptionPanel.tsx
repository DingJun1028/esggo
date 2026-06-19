import React from 'react';
import { AlertTriangle, RefreshCw, Edit3, ArrowRight, Activity } from 'lucide-react';

/**
 * 💡 奧秘 UI 元件：稽核異常診斷面板
 * --------------------------------------------------
 * [協議] 🟠 可驗算 (Calculable) 異常處理
 */
interface AuditExceptionProps {
  indicator: string; // 例如: GRI 305-1
  expectedValue: number; // 系統根據公式算出的正確值
  aiValue: number; // AI 在敘事中寫入的數值
  unit: string;
  formula: string; // 使用的計算公式
  sourceRef: string; // 原始數據引用路徑
  onResolve?: (action: 'auto' | 'manual') => void;
}

export const AuditExceptionPanel: React.FC<AuditExceptionProps> = ({
  indicator,
  expectedValue,
  aiValue,
  unit,
  formula,
  sourceRef,
  onResolve,
}) => {
  const delta = (((aiValue - expectedValue) / expectedValue) * 100).toFixed(2);
  const isHighDelta = Math.abs(parseFloat(delta)) > 5;

  return (
    <div className="bg-slate-900/90 border-2 border-red-500/30 rounded-2xl p-6 backdrop-blur-xl shadow-2xl max-w-2xl w-full overflow-hidden relative">
      {/* 裝飾性背景效果 */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl -mr-16 -mt-16"></div>

      {/* 異常標頭 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-red-500/20 p-3 rounded-2xl border border-red-500/40">
          <AlertTriangle className="text-red-500" size={28} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xl font-black text-slate-100 italic tracking-tighter">
              AUDIT EXCEPTION
            </h4>
            <span className="bg-red-500/20 text-red-400 text-[10px] px-2 py-0.5 rounded-full font-bold border border-red-500/20 underline decoration-red-500/40">
              CALCULATION_BREACH
            </span>
          </div>
          <p className="text-sm text-slate-500 font-mono mt-0.5">
            {indicator} | {sourceRef}
          </p>
        </div>
      </div>

      {/* 數據對比網格 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="relative group">
          <div className="absolute inset-0 bg-emerald-500/10 rounded-2xl blur-xl group-hover:bg-emerald-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-slate-800/50 p-5 rounded-2xl border border-slate-700/50 hover:border-emerald-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                系統真理值 (Truth)
              </span>
              <Activity size={12} className="text-emerald-500" />
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-mono font-black text-emerald-400 tracking-tighter">
                {expectedValue}
              </div>
              <span className="text-xs text-emerald-500/70 font-bold">{unit}</span>
            </div>
            <div className="mt-4 p-2 bg-slate-900/50 rounded-lg text-[10px] text-slate-500 font-mono leading-relaxed border border-slate-800">
              Logic: {formula}
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-xl group-hover:bg-red-500/20 transition-all opacity-0 group-hover:opacity-100"></div>
          <div className="relative bg-slate-800/50 p-5 rounded-2xl border border-red-900/20 hover:border-red-500/30 transition-all">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                AI 生成幻覺 (Delta)
              </span>
              <span
                className={`text-[10px] font-black px-1.5 py-0.5 rounded ${isHighDelta ? 'bg-red-500 text-white' : 'bg-orange-500/20 text-orange-400'}`}
              >
                {delta}%
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <div className="text-3xl font-mono font-black text-red-500 tracking-tighter">
                {aiValue}
              </div>
              <span className="text-xs text-red-500/70 font-bold">{unit}</span>
            </div>
            <div className="mt-4 flex flex-col gap-1">
              <div className="h-1 w-full bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-500 animate-pulse"
                  style={{ width: `${Math.min(Math.abs(parseFloat(delta)), 100)}%` }}
                ></div>
              </div>
              <span className="text-[9px] text-red-400 italic font-medium">
                Critical verification failure detected.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 自癒行動區域 */}
      <div className="space-y-3">
        <button
          onClick={() => onResolve?.('auto')}
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-3 transition-all shadow-[0_4px_20px_rgba(16,185,129,0.25)] group"
        >
          <RefreshCw
            size={18}
            className="group-hover:rotate-180 transition-transform duration-500"
          />
          一鍵自癒：強制同步真理值並修正敘事
          <ArrowRight
            size={14}
            className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
          />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onResolve?.('manual')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-all"
          >
            <Edit3 size={14} /> 進入 LangGraph 手動干預
          </button>
          <button className="bg-slate-800/50 text-slate-500 py-3 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border border-slate-700/50 cursor-not-allowed">
            暫時忽略 (Risk+1)
          </button>
        </div>
      </div>
    </div>
  );
};
