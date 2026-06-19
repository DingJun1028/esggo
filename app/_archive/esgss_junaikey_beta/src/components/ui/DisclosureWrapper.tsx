/**
 * 💡 揭示包裝組件：DisclosureWrapper
 * --------------------------------------------------
 * [作用] 為任何 UI 組件注入「揭示皆是」的 4T 懸浮視窗
 * [UX] Hover 觸發信任揭示
 */

import React from 'react';
import { IComponentCore } from '../../types/core';

interface DisclosureWrapperProps {
  data: IComponentCore;
  children: React.ReactNode;
  className?: string; // Allow custom styling
}

export const DisclosureWrapper: React.FC<DisclosureWrapperProps> = ({
  data,
  children,
  className = '',
}) => {
  // No longer an array, direct access to the 5T evidence object
  const evidence = data.evidence;

  return (
    <div
      className={`group relative border-l-4 border-emerald-500 pl-2 transition-all hover:bg-slate-900/30 rounded ${className}`}
    >
      {/* 數據主體 */}
      <div className="relative">{children}</div>

      {/* 5T 懸浮揭示層 (Hidden by default, shown on hover) */}
      <div className="hidden group-hover:block absolute top-0 left-full ml-4 p-4 bg-slate-950 text-white rounded-lg shadow-2xl z-50 min-w-[300px] border border-slate-700 backdrop-blur-md">
        <h4 className="text-amber-400 font-bold mb-2 flex items-center gap-2">
          <span>🏛️</span> 5T Sentinel Evidence
        </h4>

        <div className="text-xs space-y-2 opacity-90 font-mono">
          {/* T1: Traceable */}
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">UUID</span>
            <span className="text-emerald-300">{data.uuid.slice(0, 8)}...</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Source</span>
            <span className="text-blue-300">{evidence.traceable?.source_origin || 'Internal'}</span>
          </div>

          {/* T2: Trackable */}
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Verified</span>
            <span className="text-purple-300">{new Date(data.timestamp).toLocaleTimeString()}</span>
          </div>

          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Lifecycle</span>
            <span className="text-cyan-300">{(evidence.trackable?.lifecycle_hooks || []).length} Hooks</span>
          </div>

          {/* T3: Transparent */}
          <div className="flex justify-between border-b border-slate-800 pb-1">
            <span className="text-slate-400">Formula</span>
            <span className="text-amber-300 truncate max-w-[150px]">{evidence.transparent?.formula || 'N/A'}</span>
          </div>

          {/* T5: Hash Lock */}
          <div className="mt-2 text-[10px] break-all text-slate-500">
            🔒 Lock: {evidence.trustworthy?.hash_lock || 'Unsealed'}
          </div>
        </div>

        {/* Visual Decoration */}
        <div className="absolute -left-2 top-4 w-2 h-2 bg-slate-950 border-t border-l border-slate-700 rotate-45"></div>
      </div>
    </div>
  );
};
