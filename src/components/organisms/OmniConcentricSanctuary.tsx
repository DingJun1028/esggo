'use client';

import React from 'react';
import { useOmniTelemetry } from '@/hooks/useOmniTelemetry';
import { Loader2 } from 'lucide-react';

export default function OmniConcentricSanctuary() {
  const { telemetry, isLoading, isError } = useOmniTelemetry();

  if (isLoading && !telemetry) {
    return (
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
        <span className="ml-3 text-cyan-400 font-mono text-sm">Initializing Oneness Core...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-[500px] h-[500px] flex items-center justify-center">
        <div className="text-red-400 font-mono text-sm text-center">
          [CRITICAL] Telemetry synchronization failed.
          <br />
          Hexa-Core disconnected.
        </div>
      </div>
    );
  }

  const data = telemetry || {
    evolution: { status: 'OPTIMAL', techDebtDetected: 0, rotationSpeed: '40s' },
    integrity: { complianceRate: 100, status: 'VERIFIED', rotationSpeed: '35s' },
    flow: { latencyMs: 0, status: 'SEAMLESS', rotationSpeed: '25s' },
    decisiveness: { swarmActiveNodes: 0, status: 'READY', rotationSpeed: '15s' },
    traceability: { hashLocksCreated: 0, status: 'SECURE', rotationSpeed: '10s' },
    oneness: { state: 'TRANSCENDENCE' },
  };

  return (
    <div className="relative w-[500px] h-[500px] flex items-center justify-center mt-8 group/oneness">
      {/* Outer Circle (全息之腦 - Evolution) */}
      <div
        className="absolute inset-0 border-2 border-indigo-500/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.1)] group/item transition-all hover:border-indigo-500/60 cursor-crosshair"
        style={{ animation: `spin ${data.evolution.rotationSpeed} linear infinite` }}
      >
        <div
          className="absolute top-0 -translate-y-1/2 bg-[#020617] px-2 text-indigo-400 text-xs font-bold tracking-widest border border-indigo-500/30 rounded-full"
          style={{ animation: `spin ${data.evolution.rotationSpeed} linear infinite reverse` }}
        >
          全息之腦 (Evolution)
        </div>
        {/* Tooltip */}
        <div
          className="absolute top-[-40px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-indigo-950 border border-indigo-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-50"
          style={{ animation: `spin ${data.evolution.rotationSpeed} linear infinite reverse` }}
        >
          Telemetry: {data.evolution.techDebtDetected} Tech Debt detected. Status:{' '}
          {data.evolution.status}
        </div>
      </div>

      {/* Layer 2 (全境之骨 - Integrity) */}
      <div
        className="absolute w-[400px] h-[400px] border-2 border-cyan-500/30 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.15)] group/item transition-all hover:border-cyan-500/60 cursor-crosshair"
        style={{ animation: `spin ${data.integrity.rotationSpeed} linear infinite reverse` }}
      >
        <div
          className="absolute left-0 -translate-x-1/2 bg-[#020617] px-2 text-cyan-400 text-xs font-bold tracking-widest border border-cyan-500/30 rounded-full"
          style={{ animation: `spin ${data.integrity.rotationSpeed} linear infinite` }}
        >
          全境之骨 (Integrity)
        </div>
        {/* Tooltip */}
        <div
          className="absolute left-[-180px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-cyan-950 border border-cyan-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-50"
          style={{ animation: `spin ${data.integrity.rotationSpeed} linear infinite` }}
        >
          Telemetry: {data.integrity.complianceRate}% 5T Protocol Compliance. [
          {data.integrity.status}]
        </div>
      </div>

      {/* Layer 3 (全域之脈 - Flow) */}
      <div
        className="absolute w-[300px] h-[300px] border-2 border-emerald-500/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.2)] group/item transition-all hover:border-emerald-500/60 cursor-crosshair"
        style={{ animation: `spin ${data.flow.rotationSpeed} linear infinite` }}
      >
        <div
          className="absolute top-1/4 left-[5%] -translate-x-1/2 bg-[#020617] px-2 text-emerald-400 text-xs font-bold tracking-widest border border-emerald-500/30 rounded-full"
          style={{ animation: `spin ${data.flow.rotationSpeed} linear infinite reverse` }}
        >
          全域之脈
        </div>
        {/* Tooltip */}
        <div
          className="absolute top-0 opacity-0 group-hover/item:opacity-100 transition-opacity bg-emerald-950 border border-emerald-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-50"
          style={{ animation: `spin ${data.flow.rotationSpeed} linear infinite reverse` }}
        >
          Telemetry: {data.flow.latencyMs} ms Latency. Status: {data.flow.status}.
        </div>
      </div>

      {/* Layer 4 (全能之核 - Decisiveness) */}
      <div
        className="absolute w-[200px] h-[200px] border-[3px] border-purple-500/50 rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.3)] group/item transition-all hover:border-purple-500/80 cursor-crosshair"
        style={{ animation: `spin ${data.decisiveness.rotationSpeed} linear infinite reverse` }}
      >
        <div
          className="absolute top-0 -translate-y-1/2 bg-[#020617] px-2 text-purple-400 text-xs font-bold tracking-widest border border-purple-500/30 rounded-full"
          style={{ animation: `spin ${data.decisiveness.rotationSpeed} linear infinite` }}
        >
          全能之核
        </div>
        {/* Tooltip */}
        <div
          className="absolute bottom-[-30px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-purple-950 border border-purple-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-50"
          style={{ animation: `spin ${data.decisiveness.rotationSpeed} linear infinite` }}
        >
          Telemetry: {data.decisiveness.swarmActiveNodes} Swarm Nodes {data.decisiveness.status}.
        </div>
      </div>

      {/* Layer 5 (全知之眼 - Traceability) */}
      <div
        className="absolute w-[120px] h-[120px] border-[4px] border-blue-500/60 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.4)] group/item transition-all hover:border-blue-500/80 cursor-crosshair"
        style={{ animation: `spin ${data.traceability.rotationSpeed} linear infinite` }}
      >
        <div
          className="absolute bottom-0 translate-y-1/2 bg-[#020617] px-2 text-blue-400 text-[10px] font-bold tracking-widest border border-blue-500/30 rounded-full"
          style={{ animation: `spin ${data.traceability.rotationSpeed} linear infinite reverse` }}
        >
          全知之眼
        </div>
        {/* Tooltip */}
        <div
          className="absolute top-[-30px] opacity-0 group-hover/item:opacity-100 transition-opacity bg-blue-950 border border-blue-500 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-50"
          style={{ animation: `spin ${data.traceability.rotationSpeed} linear infinite reverse` }}
        >
          Telemetry: {data.traceability.hashLocksCreated} Hash Locks.
        </div>
      </div>

      {/* Center Core (全通之心 - Oneness) */}
      <div
        className={`absolute w-[60px] h-[60px] bg-gradient-to-br from-white via-indigo-200 to-cyan-200 rounded-full shadow-[0_0_40px_rgba(255,255,255,0.8)] flex items-center justify-center z-10 border border-white/50 cursor-crosshair group/core ${
          data.oneness.state === 'TRANSCENDENCE' ? 'animate-pulse' : ''
        }`}
      >
        <div className="w-[30px] h-[30px] bg-white rounded-full shadow-[inset_0_0_10px_rgba(0,0,0,0.2)]"></div>
        <div className="absolute top-[-40px] opacity-0 group-hover/core:opacity-100 transition-opacity bg-white text-black font-bold text-xs p-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
          {data.oneness.state} ACHIEVED.
        </div>
      </div>
    </div>
  );
}
