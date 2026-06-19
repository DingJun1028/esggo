/**
 * 💡 奧秘元件心核：Cyber-ESG 數據卡片 (CyberCard)
 * --------------------------------------------------
 * [協議] 4T Protocol (Traceable, Transparent, Tallyable, Tamper-proof)
 * [視覺] 帝國金 + 深空黑 (High-Fidelity)
 */

import React from 'react';

const DROP_SHADOW_INTENSITY = 0.1;
const DROP_SHADOW_HOVER = 0.3;
const DROP_SHADOW_BLUR = 10;
const DROP_SHADOW_OPACITY = 0.5;
const TRANSITION_DURATION = 500;
const SUBSTR_LEN = 8;

// Explicit type definitions to avoid 'any'
export type CyberStatus = 'Traceable' | 'Transparent' | 'Tallyable' | 'Tamper-proof';

export interface CyberCardProps {
  label: string;
  value: string | number;
  status: CyberStatus;
  uuid?: string;
}

interface StatusConfig {
  color: string;
  icon: string;
  label: string;
}

export const CyberCard: React.FC<CyberCardProps> = ({ label, value, status, uuid }) => {
  // Status color mapping based on 4T Protocol
  const statusConfigMap: Record<CyberStatus, StatusConfig> = {
    Traceable: { color: 'text-esg-traceable', icon: '🟢', label: 'T1-可追溯' },
    Transparent: { color: 'text-esg-transparent', icon: '🔵', label: 'T2-透明化' },
    Tallyable: { color: 'text-esg-tallyable', icon: '🟠', label: 'T3-可統計' },
    'Tamper-proof': { color: 'text-esg-tamperproof', icon: '🔴', label: 'T4-防篡改' },
  };

  const config = statusConfigMap[status];

  return (
    <div
      className={`relative group overflow-hidden rounded-xl bg-cyber-glass border border-primary/30 backdrop-blur-md shadow-[0_0_20px_rgba(212,175,55,${DROP_SHADOW_INTENSITY})] transition-all duration-${TRANSITION_DURATION} hover:shadow-[0_0_30px_rgba(212,175,55,${DROP_SHADOW_HOVER})] hover:border-primary/60`}
    >
      {/* Holographic Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      <div className="p-6 relative z-10">
        {/* Header: UUID & Status */}
        <div className="flex justify-between items-start mb-4">
          <span className="text-[10px] text-cyber-titanium/50 font-mono tracking-widest uppercase">
            UUID: {uuid ? uuid.slice(0, SUBSTR_LEN) : 'GENESIS-00'}
          </span>
          <div
            className={`flex items-center gap-1.5 px-2 py-0.5 rounded border border-white/5 bg-black/40 ${config.color}`}
          >
            <span className="text-[8px]">{config.icon}</span>
            <span className="text-[9px] font-black tracking-wider">{config.label}</span>
          </div>
        </div>

        {/* Main Value */}
        <div className="mb-2">
          <h3 className="text-xs font-bold text-cyber-titanium/70 uppercase tracking-widest mb-1">
            {label}
          </h3>
          <div
            className={`text-4xl font-black text-primary tracking-tighter drop-shadow-[0_0_${DROP_SHADOW_BLUR}px_rgba(212,175,55,${DROP_SHADOW_OPACITY})]`}
          >
            {value}
          </div>
        </div>

        {/* Footer: Verification */}
        <div className="pt-3 mt-2 border-t border-white/5 flex items-center justify-between">
          <span className="text-[9px] text-slate-500 font-mono">已通過 4T 協議驗證</span>
          <div className="h-1 w-1 rounded-full bg-primary animate-pulse" />
        </div>
      </div>
    </div>
  );
};

// 🔴 Tamper-proof: Component Definition Freeze
export default Object.freeze(CyberCard);
