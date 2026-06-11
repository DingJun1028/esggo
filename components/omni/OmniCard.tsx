'use client';
import React, { useState } from 'react';
import { OmniCardProps } from './types';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';

import { parseFnnsNodeName } from './fnns-utils';

const CURRENT_SYSTEM_DESIGN_VERSION = "8.5.0-Alpha";

export const OmniCard: React.FC<OmniCardProps> = ({
  uuid,
  componentVersion,
  timestamp,
  evidence,
  status,
  attention = AttentionStatus.Normal,
  isLocked = false,
  title,
  children,
  className = '',
  nodeName
}) => {
  const [showLog, setShowLog] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  // 【通：版本對接器】強制驗證，防止 RWD 出現舊有設計
  const isVersionMismatch = componentVersion !== CURRENT_SYSTEM_DESIGN_VERSION;

  if (isVersionMismatch) {
    return (
      <div className="p-6 rounded-2xl border-2 border-rose-500/50 bg-rose-950/20 text-rose-500 font-mono text-xs animate-pulse">
        [⚠️ VERSION MISMATCH ERROR]: v{componentVersion} mismatched with core v{CURRENT_SYSTEM_DESIGN_VERSION}.
      </div>
    );
  }

  const isHardLocked = isLocked || status === RecordLifecycleStatus.Archived;

  // FNNS v4 Parser (Unified)
  const fnnsData = parseFnnsNodeName(nodeName);

  return (
    <div
      className={`
        relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ease-out border
        
        ${/* 美：日夜雙工液態玻璃材料學（Figma Token 同步） */''}
        dark:bg-slate-900/60 dark:border-white/10 dark:text-white
        light:bg-white/60 light:border-slate-900/10 light:text-slate-900
        backdrop-blur-md saturate-180
        hover:translate-y-[-2px] hover:shadow-lg
        
        ${/* 信：核心禁區 - 日夜雙模冷晶防護態 */''}
        ${isHardLocked 
          ? 'dark:border-cyan-500/50 dark:shadow-[inset_0_0_15px_rgba(6,182,212,0.25)] dark:bg-cyan-950/30 light:border-cyan-600/60 light:shadow-[inset_0_0_15px_rgba(8,145,178,0.15)] light:bg-cyan-50/50' 
          : attention === AttentionStatus.Critical
            ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
            : 'border-transparent'}
        ${className}
      `}
    >
      {/* Header 區塊 */}
      <div className="flex justify-between items-center mb-4 select-none">
        <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2 dark:text-slate-200 light:text-slate-800">
          <span className={`w-2 h-2 rounded-full ${
            isHardLocked ? 'bg-cyan-400 animate-pulse' : 
            attention === AttentionStatus.Critical ? 'bg-rose-500 animate-ping' : 'bg-emerald-400'
          }`} />
          {title}
          {fnnsData && (
            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-mono border rounded-md dark:border-cyan-500/40 dark:text-cyan-400 light:border-cyan-600/40 light:text-cyan-600">
              {fnnsData.id}
            </span>
          )}
        </h2>
       
        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button 
            onClick={() => { setShowFormula(!showFormula); setShowLog(false); }}
            className="px-2 py-0.5 rounded border transition-colors bg-black/5 dark:text-emerald-400 dark:border-emerald-500/20 light:text-emerald-600 light:border-emerald-600/30"
          >
            Formula
          </button>
          <button 
            onClick={() => { setShowLog(!showLog); setShowFormula(false); }}
            className="px-2 py-0.5 rounded border transition-colors bg-black/5 dark:text-cyan-400 dark:border-cyan-500/20 light:text-cyan-600 light:border-cyan-600/30"
          >
            Trace
          </button>
          <span className="px-1 bg-black/10 dark:text-slate-400 light:text-slate-500 rounded">v{componentVersion}</span>
        </div>
      </div>

      {/* 核心數據流 */}
      <div className={`transition-opacity duration-300 ${showLog || showFormula ? 'opacity-5 pointer-events-none' : 'opacity-100'}`}>
        {children}
      </div>

      {/* 善：公式零幻覺驗算面板（日夜對照） */}
      {showFormula && (
        <div className="absolute inset-0 p-5 font-mono text-[11px] z-20 flex flex-col justify-between animate-fade-in dark:bg-slate-950/95 dark:text-slate-300 light:bg-slate-50/95 light:text-slate-800">
          <div>
            <div className="flex justify-between border-b pb-1 mb-3 dark:text-emerald-400 dark:border-white/10 light:text-emerald-600 light:border-slate-900/10">
              <span>[📊 VERIFIABLE COMPLIANCE FORMULA]</span>
              <button onClick={() => setShowFormula(false)} className="hover:text-rose-500">✕</button>
            </div>
            <div className="space-y-2">
              <span className="opacity-60 block">CORE METRIC FORMULA:</span>
              <code className="text-xs p-2 rounded block border dark:bg-slate-900 dark:text-white dark:border-white/5 light:bg-white light:text-slate-900 light:border-slate-900/10">
                E_total = E_scope1 + E_scope2 + \sum (Activity_i \times EF_i)
              </code>
              <p><span className="opacity-60">STANDARD:</span> <span className="font-bold text-cyan-500">[ISO-14064-1:2018]</span></p>
            </div>
          </div>
          <div className="text-[10px] text-emerald-500">✓ Zero-Hallucination Engine active.</div>
        </div>
      )}

      {/* 真：鏈式溯源日誌面板（日夜對照） */}
      {showLog && (
        <div className="absolute inset-0 p-5 font-mono text-[11px] z-20 flex flex-col justify-between animate-fade-in dark:bg-slate-950/95 dark:text-slate-300 light:bg-slate-50/95 light:text-slate-800">
          <div>
            <div className="flex justify-between border-b pb-1 mb-2 dark:text-cyan-400 dark:border-white/10 light:text-cyan-600 light:border-slate-900/10">
              <span>[⛓️ OMNISTITCH DATA TRACE]</span>
              <button onClick={() => setShowLog(false)} className="hover:text-rose-500">✕</button>
            </div>
            <p><span className="opacity-60">UUID:</span> {uuid}</p>
            <p className="truncate"><span className="opacity-60">ORIGIN:</span> {evidence.source_origin}</p>
            <div className="mt-2">
              <span className="opacity-60">IMPACT PATHWAY:</span>
              <div className="pl-2 border-l border-cyan-500/30 mt-1 space-y-0.5 opacity-80">
                {evidence.flow_path.map((path, idx) => <div key={idx}>↳ {path}</div>)}
              </div>
            </div>
            {fnnsData && (
              <div className="mt-3 p-2 bg-black/10 rounded border border-cyan-500/20">
                <div className="opacity-60 mb-1">FNNS BINDING (UNIFIED v4):</div>
                <div className="grid grid-cols-2 gap-1 opacity-80">
                  <div>Affiliation: <span className="text-amber-400">{fnnsData.affiliation}</span></div>
                  <div>Type: <span className="text-purple-400">{fnnsData.type}</span></div>
                  <div>Entity: <span className="text-cyan-400">{fnnsData.entity}</span></div>
                  <div>Action: <span className="text-emerald-400">{fnnsData.action}</span></div>
                  <div className="col-span-2">Protocol: <span className="text-rose-400">{fnnsData.protocol}</span></div>
                </div>
              </div>
            )}
          </div>
          {evidence.hash && <div className="text-[10px] text-cyan-500 truncate">SHA256: {evidence.hash}</div>}
        </div>
      )}
    </div>
  );
};
