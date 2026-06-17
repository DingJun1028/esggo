'use client';

import React, { useEffect, useState } from 'react';
import { OmniUltimateMatrix } from '@/components/omni/OmniUltimateMatrix';
import { MATRIX_ROUTES } from '@/lib/omni-core/matrix-store';

interface MatrixStats {
  totalComponents: number;
  registeredComponents: number;
  lastUpdated: string;
}

export default function UltimateMatrixPage() {
  const [stats, setStats] = useState<MatrixStats>({
    totalComponents: MATRIX_ROUTES.length,
    registeredComponents: 55,
    lastUpdated: '2026-06-14',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/matrix')
      .then((r) => r.json())
      .then((data) => {
        if (data.components) {
          setStats({
            totalComponents: data.components.length,
            registeredComponents: data.components.filter((c: any) => c.registered).length,
            lastUpdated: data.components[0]?.lastUpdated || stats.lastUpdated,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-8 w-full bg-[#020617] text-slate-200 relative overflow-hidden">
      {/* Background glow for Matrix Page */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />

      <div className="max-w-7xl mx-auto space-y-10 relative z-10">
        <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              <span className="text-xs font-mono font-black tracking-[0.2em] text-cyan-400 uppercase">
                Omni Component Center
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-4">
              萬能元件。終極矩陀
            </h1>
            <p className="text-slate-400 mt-3 text-sm max-w-xl">
              OmniCore Governance Architecture. 全局檢視與驗證系統中每一個功能設施的 5T
              合規性與架構定位，確保常青演進。
            </p>
          </div>
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-3 bg-black/40 border border-white/10 px-4 py-2 rounded-lg backdrop-blur-md">
              <span className="text-xs text-slate-400 font-mono">
                {stats.totalComponents} Components
              </span>
              <span className="text-xl font-bold text-cyan-400">
                {loading ? 'Loading...' : `${stats.registeredComponents} Registered`}
              </span>
            </div>
          </div>
        </header>

        <OmniUltimateMatrix />
      </div>
    </div>
  );
}
