import React from 'react';
import { AtomicCard } from '@/lib/design-system/AtomicCard';
import { Shield, Fingerprint, Activity, Clock, FileKey, CheckCircle } from 'lucide-react/icons';

export default function EternalMemoryAuditPage() {
  const auditLogs = [
    { id: 'seal_904fa2', action: 'GRI[302-1] 碳排數值封印', timestamp: '2026-06-02 14:22:30', zkpStatus: 'Verified', hash: '0x8f2a...391c', user: 'SYSTEM_SYNC', risk: 'Low' },
    { id: 'seal_381cb1', action: '跨部門 HR D&I 資料同步', timestamp: '2026-06-02 12:15:05', zkpStatus: 'Verified', hash: '0x32ba...110a', user: 'HR_NODE', risk: 'Low' },
    { id: 'seal_112ef0', action: '董事會決議紀錄上鏈', timestamp: '2026-06-01 18:45:12', zkpStatus: 'Verified', hash: '0x71dc...992f', user: 'GOV_BOARD', risk: 'Medium' },
    { id: 'seal_998ae1', action: '供應商 ESG 評級變更', timestamp: '2026-06-01 09:10:00', zkpStatus: 'Verified', hash: '0x22cc...444d', user: 'SUPPLY_CHAIN', risk: 'High' }
  ];

  return (
    <div className="h-full w-full bg-[#020617] text-slate-200 overflow-y-auto p-8 relative">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-cyan-900/20 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#06b6d4]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-slate-800/50 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Shield className="text-cyan-400" size={32} />
              永恆記憶與防禦展廳
              <span className="text-xs font-mono px-2 py-1 bg-cyan-900/30 text-cyan-400 rounded-full border border-cyan-500/20">
                5T Protocol Active
              </span>
            </h1>
            <p className="text-slate-400 mt-2">Zero-Knowledge Proofs (ZKP) 與密碼學綁定的全局操作軌跡</p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50 flex flex-col items-end">
              <span className="text-xs text-slate-500">今日驗證數 (Pedersen Commitments)</span>
              <span className="text-xl font-bold text-cyan-400">14,295 筆</span>
            </div>
            <div className="px-4 py-2 bg-slate-900/50 rounded-lg border border-slate-700/50 flex flex-col items-end">
              <span className="text-xs text-slate-500">防護層級</span>
              <span className="text-xl font-bold text-emerald-400">OmniCore ZKP</span>
            </div>
          </div>
        </header>

        {/* Audit Trail List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-300 flex items-center gap-2 mb-4">
            <Activity size={20} className="text-slate-400" /> 最新封印軌跡 (Seal Trail)
          </h2>
          
          <div className="grid gap-4">
            {auditLogs.map((log) => (
              <AtomicCard key={log.id} glassIntensity="heavy" padding="sm" className="flex items-center justify-between border-l-4 border-l-cyan-500">
                <div className="flex items-center gap-6">
                  <div className="p-3 bg-slate-800/50 rounded-xl text-cyan-400">
                    <Fingerprint size={24} />
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{log.action}</h3>
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                      <span className="flex items-center gap-1"><Clock size={12} /> {log.timestamp}</span>
                      <span className="flex items-center gap-1"><FileKey size={12} /> {log.user}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div className="flex flex-col items-end">
                    <span className="text-xs text-slate-500">Hash Lock</span>
                    <span className="font-mono text-sm text-slate-300">{log.hash}</span>
                  </div>
                  <div className="px-3 py-1 bg-emerald-950/40 text-emerald-400 text-sm font-medium border border-emerald-500/20 rounded-full flex items-center gap-1">
                    <CheckCircle size={14} /> {log.zkpStatus}
                  </div>
                </div>
              </AtomicCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
