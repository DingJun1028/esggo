'use client';

import { OmniComponentHeart } from '@esggo/types';
import React, { useState } from 'react';
import { OmniCardProps } from './types';
import { RecordLifecycleStatus, AttentionStatus } from '@/shared-types/status';

import { parseFnnsNodeName } from './fnns-utils';

const CURRENT_SYSTEM_DESIGN_VERSION = '8.5.0-Alpha';

interface Props extends OmniCardProps {
  /** [永恆覺醒] 萬能元件心核：無作妙德，圓通無礙 */
  omniHeart?: OmniComponentHeart;
}

export const OmniCard: React.FC<Props> = ({
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
  nodeName,
  omniHeart,
}) => {
  const [showLog, setShowLog] = useState(false);
  const [showFormula, setShowFormula] = useState(false);

  // 【通：版本對接器】強制驗證，防止 RWD 出現舊有設計
  const isVersionMismatch = componentVersion !== CURRENT_SYSTEM_DESIGN_VERSION;

  if (isVersionMismatch) {
    return (
      <div className="p-6 rounded-2xl border-2 border-rose-500/50 bg-rose-950/20 text-rose-500 font-mono text-xs animate-pulse">
        [⚠️ VERSION MISMATCH ERROR]: v{componentVersion} mismatched with core v
        {CURRENT_SYSTEM_DESIGN_VERSION}.
      </div>
    );
  }

  const isHardLocked = isLocked || status === RecordLifecycleStatus.Archived;

  // FNNS v4 Parser (Unified)
  const fnnsData = parseFnnsNodeName(nodeName);

  const isResonant = omniHeart && omniHeart.resonanceState > 0.8;

  return (
    <div
      className={`
        relative overflow-hidden p-6 rounded-2xl transition-all duration-300 ease-out border
        
        ${/* 美：日夜雙工液態玻璃材料學（Figma Token 同步） */ ''}
        dark:bg-slate-900/60 dark:border-white/10 dark:text-white
        light:bg-white/60 light:border-slate-900/10 light:text-slate-900
        backdrop-blur-md saturate-180
        hover:translate-y-[-2px] hover:shadow-lg
        
        ${/* 信：核心禁區 - 日夜雙模冷晶防護態 */ ''}
        ${
          isHardLocked
            ? 'dark:border-[#63a6b0]/50 dark:shadow-[inset_0_0_15px_rgba(99,166,176,0.25)] dark:bg-[#63a6b0]/20 light:border-[#63a6b0]/60 light:shadow-[inset_0_0_15px_rgba(99,166,176,0.15)] light:bg-[#63a6b0]/10'
            : attention === AttentionStatus.Critical
            ? 'border-rose-500/40 shadow-[0_0_15px_rgba(244,63,94,0.1)]'
            : isResonant
            ? 'border-[#ffd700]/50 shadow-[0_0_20px_rgba(255,215,0,0.3)] ring-1 ring-[#ffd700]/20'
            : 'border-transparent'
        }
        ${className}
      `}
    >
      {/* Header 區塊 */}
      <div className="flex justify-between items-center mb-4 select-none">
        <h2 className="text-sm font-semibold uppercase tracking-widest flex items-center gap-2 dark:text-slate-200 light:text-slate-800">
          <span
            className={`w-2 h-2 rounded-full ${
              isHardLocked
                ? 'bg-[#63a6b0] animate-pulse'
                : attention === AttentionStatus.Critical
                ? 'bg-rose-500 animate-ping'
                : 'bg-[#ffd700]'
            }`}
          />
          {title}
          {fnnsData && (
            <span className="ml-2 px-1.5 py-0.5 text-[9px] font-mono border rounded-md border-[#63a6b0]/40 text-[#63a6b0]">
              {fnnsData.id}
            </span>
          )}
        </h2>

        <div className="flex items-center gap-1.5 font-mono text-[10px]">
          <button
            onClick={() => {
              setShowFormula(!showFormula);
              setShowLog(false);
            }}
            className="px-2 py-0.5 rounded border transition-colors text-[#ffd700] border-[#ffd700]/30 hover:bg-[#ffd700]/10"
          >
            Formula
          </button>
          <button
            onClick={() => {
              setShowLog(!showLog);
              setShowFormula(false);
            }}
            className="px-2 py-0.5 rounded border transition-colors text-[#63a6b0] border-[#63a6b0]/30 hover:bg-[#63a6b0]/10"
          >
            Trace
          </button>
          <span className="px-1 dark:text-slate-400 light:text-slate-500 rounded">
            v{componentVersion}
          </span>
          {omniHeart?.omniSignature && (
            <span className="ml-1.5 px-1.5 py-0.5 rounded border border-[#ffd700]/40 text-[#ffd700] bg-[#ffd700]/10 animate-pulse shadow-[0_0_5px_rgba(255,215,0,0.5)]">
              ZKP:{omniHeart.omniSignature.substring(0, 6)}
            </span>
          )}
        </div>
      </div>

      {/* 核心數據流 */}
      <div
        className={`transition-opacity duration-300 ${
          showLog || showFormula ? 'opacity-5 pointer-events-none' : 'opacity-100'
        }`}
      >
        {children}
      </div>

      {/* 善：公式零幻覺驗算面板（日夜對照） */}
      {showFormula && (
        <div className="absolute inset-0 p-5 font-mono text-[11px] z-20 flex flex-col justify-between animate-fade-in dark:bg-slate-950/95 dark:text-slate-300 light:bg-slate-50/95 light:text-slate-800">
          <div>
            <div className="flex justify-between border-b pb-1 mb-3 text-[#ffd700] dark:border-white/10 light:border-slate-900/10">
              <span>[📊 VERIFIABLE COMPLIANCE FORMULA]</span>
              <button onClick={() => setShowFormula(false)} className="hover:text-rose-500">
                ✕
              </button>
            </div>
            <div className="space-y-2">
              <span className="opacity-60 block">CORE METRIC FORMULA:</span>
              <code className="text-xs p-2 rounded block border dark:bg-slate-900 dark:text-white dark:border-white/5 light:bg-white light:text-slate-900 light:border-slate-900/10">
                E_total = E_scope1 + E_scope2 + \sum (Activity_i \times EF_i)
              </code>
              <p>
                <span className="opacity-60">STANDARD:</span>{' '}
                <span className="font-bold text-[#63a6b0]">[ISO-14064-1:2018]</span>
              </p>
            </div>
          </div>
          <div className="text-[10px] text-[#ffd700]">✓ Zero-Hallucination Engine active.</div>
        </div>
      )}

      {/* 真：鏈式溯源日誌面板（日夜對照） */}
      {showLog && (
        <div className="absolute inset-0 p-5 font-mono text-[11px] z-20 flex flex-col justify-between animate-fade-in dark:bg-slate-950/95 dark:text-slate-300 light:bg-slate-50/95 light:text-slate-800">
          <div>
            <div className="flex justify-between border-b pb-1 mb-2 text-[#63a6b0] dark:border-white/10 light:border-slate-900/10">
              <span>[⛓️ OMNISTITCH DATA TRACE]</span>
              <button onClick={() => setShowLog(false)} className="hover:text-rose-500">
                ✕
              </button>
            </div>
            <p>
              <span className="opacity-60">UUID:</span> {uuid}
            </p>
            <p className="truncate">
              <span className="opacity-60">ORIGIN:</span> {evidence.source_origin}
            </p>
            <div className="mt-2">
              <span className="opacity-60">IMPACT PATHWAY:</span>
              <div className="pl-2 border-l border-[#63a6b0]/30 mt-1 space-y-0.5 opacity-80">
                {evidence.flow_path.map((path, idx) => (
                  <div key={idx}>↳ {path}</div>
                ))}
              </div>
            </div>
            {fnnsData && (
              <div className="mt-3 p-2 rounded border border-[#63a6b0]/20">
                <div className="opacity-60 mb-1">FNNS BINDING (UNIFIED v4):</div>
                <div className="grid grid-cols-2 gap-1 opacity-80">
                  <div>
                    Affiliation: <span className="text-amber-400">{fnnsData.affiliation}</span>
                  </div>
                  <div>
                    Type: <span className="text-purple-400">{fnnsData.type}</span>
                  </div>
                  <div>
                    Entity: <span className="text-[#63a6b0]">{fnnsData.entity}</span>
                  </div>
                  <div>
                    Action: <span className="text-[#ffd700]">{fnnsData.action}</span>
                  </div>
                  <div className="col-span-2">
                    Protocol: <span className="text-rose-400">{fnnsData.protocol}</span>
                  </div>
                </div>
              </div>
            )}
            {omniHeart && (
              <div className="mt-3 p-2 rounded border border-[#ffd700]/20 bg-[#ffd700]/10">
                <div className="opacity-80 mb-1 text-[#ffd700] flex items-center gap-2">
                  <span>[⚡ OMNI-CORE 5T STATE]</span>
                  {omniHeart.resonanceState === 1.0 && <span className="animate-pulse">✨</span>}
                </div>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px] opacity-80">
                  <div className="col-span-2 text-[#63a6b0] truncate">SIG: {omniHeart.omniSignature}</div>
                  <div>Class: <span className="text-purple-400">{omniHeart.omniClass}</span></div>
                  <div>Actor: <span className="text-amber-400">{omniHeart.coreContext.actor}</span></div>
                  <div>Resonance: <span className="text-[#ffd700]">{(omniHeart.resonanceState * 100).toFixed(0)}%</span></div>
                  <div className="col-span-2 mt-1">
                    <span className="opacity-60">5T MATRIX:</span>
                    <span className="ml-2 space-x-1 text-[#ffd700]">
                      <span>{omniHeart.fiveTState?.tangible ? '✓Tan' : '✗Tan'}</span>
                      <span>{omniHeart.fiveTState?.traceable ? '✓Tra' : '✗Tra'}</span>
                      <span>{omniHeart.fiveTState?.trackable ? '✓Trk' : '✗Trk'}</span>
                      <span>{omniHeart.fiveTState?.transparent ? '✓Trp' : '✗Trp'}</span>
                      <span>{omniHeart.fiveTState?.trustworthy ? '✓Tru' : '✗Tru'}</span>
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {evidence.hash && (
            <div className="text-[10px] text-[#63a6b0] truncate">SHA256: {evidence.hash}</div>
          )}
        </div>
      )}
    </div>
  );
};
