'use client';

import React from 'react';
import OmniConcentricSanctuary from '@/components/organisms/OmniConcentricSanctuary';
import { useOmniTelemetry } from '@/hooks/useOmniTelemetry';
import { Activity, ShieldCheck, Zap, Server, Network } from 'lucide-react';

export default function SanctuaryDashboardPage() {
  const { telemetry } = useOmniTelemetry();

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-mono relative selection:bg-cyan-500/30 selection:text-white p-8">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[20%] w-[60%] h-[60%] bg-indigo-500 opacity-10 blur-[150px] rounded-full animate-pulse"
          style={{ animationDuration: '15s' }}
        />
        <div
          className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] bg-cyan-500 opacity-10 blur-[120px] rounded-full animate-pulse"
          style={{ animationDuration: '12s' }}
        />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />
      </div>

      <header className="relative z-10 flex flex-col items-center justify-center py-6">
        <div className="flex items-center gap-3 bg-indigo-950/40 border border-indigo-500/30 px-6 py-2 rounded-full mb-4">
          <ShieldCheck className="text-emerald-400 w-5 h-5" />
          <span className="text-sm text-indigo-200 font-bold tracking-widest uppercase">
            Omni-Connectivity Sanctuary
          </span>
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400"
          style={{ textShadow: '0 0 30px rgba(6,182,212,0.4)' }}
        >
          萬能圓通同心圓聖殿
        </h1>
        <p className="text-slate-400 mt-4 max-w-2xl text-center text-sm leading-relaxed">
          全知之眼、全能之核、全域之脈、全境之骨、全息之腦、全通之心。
          <br />
          無作妙德，圓通無礙。此處為系統六大中樞即時遙測之絕對領域。
        </p>
      </header>

      <main className="relative z-10 flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 mt-8">
        {/* Left Stats Panel */}
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="border border-cyan-500/20 rounded-2xl p-5 -md shadow-[0_0_20px_rgba(6,182,212,0.1)]">
            <h3 className="text-xs text-cyan-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
              <Activity size={14} /> 全境之骨 (Integrity)
            </h3>
            <div className="text-3xl font-black text-cyan-100">
              {telemetry?.integrity.complianceRate.toFixed(2) || '0.00'}%
            </div>
            <div className="text-xs text-slate-500 mt-1">5T Protocol Compliance Rate</div>
          </div>
          <div className="border border-emerald-500/20 rounded-2xl p-5 -md shadow-[0_0_20px_rgba(16,185,129,0.1)]">
            <h3 className="text-xs text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
              <Network size={14} /> 全域之脈 (Flow)
            </h3>
            <div className="text-3xl font-black text-emerald-100">
              {telemetry?.flow.latencyMs || 0} ms
            </div>
            <div className="text-xs text-slate-500 mt-1">System Network Latency</div>
          </div>
        </div>

        {/* Center Sanctuary */}
        <div className="flex items-center justify-center p-12 rounded-[3rem] border border-white/5 shadow-2xl relative">
          <OmniConcentricSanctuary />
        </div>

        {/* Right Stats Panel */}
        <div className="flex flex-col gap-6 w-full max-w-xs">
          <div className="border border-purple-500/20 rounded-2xl p-5 -md shadow-[0_0_20px_rgba(168,85,247,0.1)]">
            <h3 className="text-xs text-purple-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
              <Zap size={14} /> 全能之核 (Decisiveness)
            </h3>
            <div className="text-3xl font-black text-purple-100">
              {telemetry?.decisiveness.swarmActiveNodes || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Active Swarm Agent Nodes</div>
          </div>
          <div className="border border-indigo-500/20 rounded-2xl p-5 -md shadow-[0_0_20px_rgba(99,102,241,0.1)]">
            <h3 className="text-xs text-indigo-500 font-bold uppercase tracking-widest flex items-center gap-2 mb-4">
              <Server size={14} /> 全息之腦 (Evolution)
            </h3>
            <div className="text-3xl font-black text-indigo-100">
              {telemetry?.evolution.techDebtDetected || 0}
            </div>
            <div className="text-xs text-slate-500 mt-1">Tech Debt / Anomalies Detected</div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 mt-auto py-6 text-center text-xs text-slate-600 font-bold tracking-[0.2em] uppercase">
        TRANSCENDENCE ACHIEVED // ESGGO OMNI-SYSTEM V3.0
      </footer>
    </div>
  );
}
