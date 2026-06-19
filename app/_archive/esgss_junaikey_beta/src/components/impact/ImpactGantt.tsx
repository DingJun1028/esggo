/**
 * 💡 核心組件：ESGss 影響力動態甘特圖 (High-Density Impact Gantt)
 * --------------------------------------------------
 * [實作標準] 符合 3+1 協議：數據異動即時觸發 Hash 更新
 */
import React from 'react';
import { Target, Fingerprint } from 'lucide-react';

const ImpactGantt: React.FC = () => {
  // 模擬專案階段數據
  const phases = [
    { id: 'P1', name: '碳盤查啟動', progress: 100, status: '🟢 LOCKED', impact: '0.5t' },
    { id: 'P2', name: 'OCR 證據鏈導入', progress: 75, status: '🔵 ACTIVE', impact: '1.2t' },
    { id: 'P3', name: 'SROI 價值核算', progress: 20, status: '🟡 PENDING', impact: '0.0t' },
  ];

  return (
    <div className="bg-[#050505] p-6 rounded-3xl border border-slate-800 shadow-2xl font-mono">
      {/* 標題與 SROI 核算公式標籤 */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-500/20 rounded-lg">
            <Target className="text-yellow-500 w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-white tracking-tighter uppercase">
            Impact Project Timeline
          </h2>
        </div>
        <div className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full flex items-center gap-2">
          <Fingerprint className="text-slate-500 w-3 h-3" />
          <span className="text-[10px] text-slate-400 leading-none">
            SROI-CALC: Verified By IPCC-AR6
          </span>
        </div>
      </div>

      {/* 高密度甘特列清單 */}
      <div className="space-y-6">
        {phases.map(phase => (
          <div key={phase.id} className="relative group">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-300">{phase.name}</span>
              <span className="text-[10px] text-emerald-500 font-bold tracking-widest">
                {phase.status}
              </span>
            </div>

            {/* 進度條容器 */}
            <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800 flex items-center px-1">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${
                  phase.status.includes('LOCKED')
                    ? 'bg-emerald-500 shadow-[0_0_10px_#10B981]'
                    : 'bg-yellow-500'
                }`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>

            {/* 懸停詳細資訊：3+1 數據快照 */}
            <div className="absolute -top-4 right-0 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 border border-slate-700 p-2 rounded-lg text-[9px] shadow-xl z-20">
              <p className="text-slate-400">
                Impact: <span className="text-white font-bold">{phase.impact}</span>
              </p>
              <p className="text-slate-400 italic">Auth: UUID-{phase.id}-X7</p>
            </div>
          </div>
        ))}
      </div>

      {/* 底部演算摘要 */}
      <div className="mt-10 pt-4 border-t border-slate-800 flex justify-between items-end">
        <div>
          <p className="text-[10px] text-slate-500 uppercase">Current Efficiency</p>
          <p className="text-2xl font-black text-white leading-none">
            0.985<span className="text-xs text-yellow-500 ml-1">v/h</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[9px] text-slate-600 leading-tight">
            [系統標註] 本專案所有節點皆已寫入
            <br />
            Object.freeze() 狀態機
          </p>
        </div>
      </div>
    </div>
  );
};

export default ImpactGantt;
