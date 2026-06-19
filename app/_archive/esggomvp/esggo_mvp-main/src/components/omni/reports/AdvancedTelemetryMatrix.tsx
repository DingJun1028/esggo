"use client";

import React from "react";
import { motion } from "framer-motion";
import { IComponentCore } from "@/core/IComponentCore";
import { OmniBadge } from "../UI/OmniBadge";
import { Shield, Database, Clock, Fingerprint, FileSearch } from "lucide-react";

/**
 * AdvancedTelemetryMatrix - ESG GO Sustainability Edition
 * 高級遙測矩陣：用於展示 IComponentCore 的溯源數據與 5T 狀態。
 * 特點：極高易讀性、啞光質感、數據純粹感。
 */

interface AdvancedTelemetryMatrixProps {
  core: IComponentCore;
}

export const AdvancedTelemetryMatrix: React.FC<AdvancedTelemetryMatrixProps> = ({ core }) => {
  return (
    <div className="w-full space-y-4">
      {/* Header Info */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[var(--theme-surface-2)] rounded-md border border-[var(--theme-glass-border)]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-[var(--theme-primary-muted)] rounded-md text-[var(--theme-primary)]">
            <Shield size={20} />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-tighter text-[var(--theme-text-muted)]">
                Core Signature
            </div>
            <div className="text-sm font-mono font-bold text-[var(--theme-text-main)] truncate max-w-[200px]">
              {core.uuid}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
            <OmniBadge label={`v${core.version}`} type="muted" />
            <OmniBadge label={core.status} type={core.status === 'Trustworthy' ? 'gold' : 'accent'} />
        </div>
      </div>

      {/* Internal Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <TelemetryItem 
            icon={<Clock size={14} />} 
            label="Inscribed Time" 
            value={new Date(core.timestamp).toLocaleString()} 
        />
        <TelemetryItem 
            icon={<Fingerprint size={14} />} 
            label="Hash Lock" 
            value={core.hash_lock || "PENDING SEAL"} 
        />
        <TelemetryItem 
            icon={<Database size={14} />} 
            label="Evidence Count" 
            value={`${core.evidence?.length || 0} Atoms`} 
        />
        <TelemetryItem 
            icon={<FileSearch size={14} />} 
            label="Compliance" 
            value="ISO-14064-1" 
        />
      </div>

      {/* Evidence Snapshot */}
      <div className="p-4 bg-[var(--theme-bg)] border border-[var(--theme-glass-border)] rounded-md shadow-sm">
        <div className="text-[10px] font-black uppercase tracking-widest text-[var(--theme-text-muted)] mb-3">
            Evidence Manifest (Top Atoms)
        </div>
        <div className="space-y-2">
            {(core.evidence || []).slice(0, 3).map((atom: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-2 text-[11px] font-medium bg-[var(--theme-surface)] border-l-2 border-[var(--theme-primary)] rounded-r-sm">
                    <span className="text-[var(--theme-text-sub)] truncate max-w-[70%]">
                        {JSON.stringify(atom)}
                    </span>
                    <span className="text-[var(--theme-primary)] font-bold uppercase">Verified</span>
                </div>
            ))}
            {(!core.evidence || core.evidence.length === 0) && (
                <div className="text-center py-4 text-xs text-slate-400 italic">
                    No evidence atoms attached to this core.
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

const TelemetryItem = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="p-3 bg-[var(--theme-surface)] border border-[var(--theme-glass-border)] rounded-md">
    <div className="flex items-center gap-2 mb-1.5 text-[var(--theme-text-muted)]">
      {icon}
      <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-xs font-bold text-[var(--theme-text-main)] truncate">
      {value}
    </div>
  </div>
);
