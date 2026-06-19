import React from 'react';
import { ShieldCheck, Database, Calculator, Lock, Activity } from 'lucide-react';

/**
 * 💡 奧秘 UI 元件：4+1 協議動態稽核進度條
 * --------------------------------------------------
 * [協議] 視覺化 4+1 數位信託門戶
 */
interface AuditProgressBarProps {
  uuid: string;
  version: string;
  progress: number; // 0 - 100
  status: {
    traceable: 'pending' | 'active' | 'success' | 'error';
    trackable: 'pending' | 'active' | 'success' | 'error';
    calculable: 'pending' | 'active' | 'success' | 'error';
    immutable: 'pending' | 'active' | 'success' | 'error';
  };
  currentTask: string;
}

export const AuditProgressBar: React.FC<AuditProgressBarProps> = ({
  uuid,
  version,
  progress,
  status,
  currentTask,
}) => {
  return (
    <div className="bg-slate-900 text-slate-100 p-6 rounded-xl border border-slate-800 shadow-2xl max-w-2xl w-full">
      {/* 標頭：心核識別資訊 */}
      <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-3">
        <div>
          <h3 className="text-lg font-bold tracking-tight flex items-center gap-2">
            <Activity size={18} className="text-emerald-400" />
            AI 永續合規稽核引擎
          </h3>
          <p className="text-xs text-slate-500 font-mono">
            UUID: {uuid} | Ver: {version}
          </p>
        </div>
        <div className="text-right">
          <span className="text-2xl font-black text-emerald-400 font-mono">{progress}%</span>
        </div>
      </div>

      {/* 主進度條 */}
      <div className="w-full bg-slate-800 h-2 rounded-full mb-8 overflow-hidden">
        <div
          className="bg-gradient-to-r from-emerald-500 to-blue-600 h-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 4+1 協議狀態閘 */}
      <div className="grid grid-cols-4 gap-4">
        <StatusGate
          icon={<Database size={20} />}
          label="可溯源"
          state={status.traceable}
          sub="Source Origin"
        />
        <StatusGate
          icon={<ShieldCheck size={20} />}
          label="可追蹤"
          state={status.trackable}
          sub="Chain Logs"
        />
        <StatusGate
          icon={<Calculator size={20} />}
          label="可驗算"
          state={status.calculable}
          sub="Math Verify"
        />
        <StatusGate
          icon={<Lock size={20} />}
          label="不可篡改"
          state={status.immutable}
          sub="Hash Lock"
        />
      </div>

      {/* 當前任務提示 */}
      <div className="mt-6 bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 flex justify-between items-center">
        <p className="text-xs text-slate-400">
          當前節點:{' '}
          <span className="text-slate-200 uppercase font-bold tracking-widest ml-1">
            {currentTask}
          </span>
        </p>
        <div className="flex gap-1">
          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping"></span>
          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-75"></span>
          <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping delay-150"></span>
        </div>
      </div>
    </div>
  );
};

interface StatusGateProps {
  icon: React.ReactNode;
  label: string;
  state: 'pending' | 'active' | 'success' | 'error';
  sub: string;
}

const StatusGate: React.FC<StatusGateProps> = ({ icon, label, state, sub }) => {
  const colors = {
    success: 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400',
    active: 'border-blue-500/50 bg-blue-500/10 text-blue-400 animate-pulse',
    error: 'border-red-500/50 bg-red-500/10 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]',
    pending: 'border-slate-800 bg-slate-900/50 text-slate-600',
  };

  const statusIcons = {
    success: (
      <div className="absolute -top-1 -right-1 bg-emerald-500 text-slate-900 rounded-full p-0.5">
        <ShieldCheck size={10} />
      </div>
    ),
    error: (
      <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 font-bold text-[8px]">
        !
      </div>
    ),
    active: null,
    pending: null,
  };

  return (
    <div
      className={`relative flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${colors[state]}`}
    >
      {statusIcons[state]}
      <div className="mb-2 opacity-80">{icon}</div>
      <span className="text-xs font-bold leading-tight">{label}</span>
      <span className="text-[9px] opacity-40 mt-1 font-mono uppercase tracking-tighter">{sub}</span>
    </div>
  );
};
