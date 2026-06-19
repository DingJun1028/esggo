'use client';

import React, { useState, useEffect } from 'react';
import { useOmniStream } from '../../src/client/hooks/useOmniStream';
import { useOmniResonance } from '../../src/client/hooks/useOmniResonance';

export default function OmniSpacePage() {
  const { events, isStreaming } = useOmniStream();
  const { rs, streamStatus, status } = useOmniResonance();
  const [pulseActive, setPulseActive] = useState(false);

  // Trigger pulse effect on resonance state update
  useEffect(() => {
    setPulseActive(true);
    const timer = setTimeout(() => setPulseActive(false), 500);
    return () => clearTimeout(timer);
  }, [rs]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden flex flex-col font-mono relative cyber-grid selection:bg-cyan-500/30 selection:text-white">
      {/* Background Hologram Effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Neon Orb top left */}
        <div className="absolute top-[-25%] left-[-15%] w-[60%] h-[60%] bg-cyan-500 opacity-20 blur-[130px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Neon Orb bottom right */}
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-emerald-500 opacity-15 blur-[110px] rounded-full mix-blend-screen animate-pulse" style={{ animationDuration: '10s' }} />
        {/* High-tech grid scan line */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(255,255,255,0)_95%,rgba(6,182,212,0.015)_95%)] bg-[length:100%_40px] pointer-events-none" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col p-4 md:p-8 max-w-7xl mx-auto w-full gap-6">
        
        {/* Sovereign Cyber Header */}
        <header className="glass-cyber p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-cyan-500/10">
          <div className="flex items-center gap-4">
            {/* Animated Logo Hexagon */}
            <div className="relative w-12 h-12 flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30 rounded-xl glow-border-cyan">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {isStreaming && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full radar-pulse text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest">ESG GO</span>
                <span className="text-xs text-slate-500">v2.1-Berkeley</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 text-glow-cyan mt-1">
                OMNICORE RESONATOR
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-6 bg-black/40 px-6 py-4 rounded-xl border border-white/5">
            {/* Dynamic Circular Resonance Ring */}
            <div className="relative w-12 h-12">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="24" cy="24" r="20" className="stroke-slate-800" strokeWidth="3" fill="transparent" />
                <circle 
                  cx="24" 
                  cy="24" 
                  r="20" 
                  className="stroke-cyan-500 transition-all duration-1000" 
                  strokeWidth="3" 
                  fill="transparent" 
                  strokeDasharray="125.6" 
                  strokeDashoffset={125.6 - (125.6 * rs)}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-cyan-400">
                {Math.round(rs * 100)}%
              </div>
            </div>

            <div className="text-left">
              <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Resonance Index (Rs)</div>
              <div className={`text-xl font-bold font-mono transition-colors duration-300 ${pulseActive ? 'text-cyan-300 scale-105' : 'text-cyan-400'}`}>
                {rs.toFixed(6)}
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border uppercase tracking-wider ${
                rs >= 0.9 
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400 text-glow-emerald' 
                  : 'border-yellow-500/30 bg-yellow-950/20 text-yellow-400'
              }`}>
                {status}
              </span>
              <span className="text-[9px] text-slate-500">SEALED STATE</span>
            </div>
          </div>
        </header>

        {/* Sovereign Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-[600px]">
          
          {/* Main Bento Panel: Live Cyber Terminal (8 cols) */}
          <div className="col-span-12 lg:col-span-8 glass-cyber p-6 flex flex-col relative overflow-hidden border border-white/5">
            {/* Subtle light scan line */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30 animate-pulse" />
            
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/5">
              <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2.5 tracking-wider">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                LIVE CORE TELEMETRY STREAM
              </h2>
              
              <div className="flex items-center gap-3">
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-md border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  SSL ACTIVE
                </div>
                <span className={`text-[10px] font-bold px-3 py-1 rounded border font-mono tracking-wider transition-colors ${
                  isStreaming 
                    ? 'border-cyan-500/30 bg-cyan-950/20 text-cyan-400' 
                    : 'border-slate-800 bg-slate-900 text-slate-500'
                }`}>
                  {isStreaming ? '• STREAMING ACTIVE' : '■ IDLE'}
                </span>
              </div>
            </div>
            
            {/* Cyber Terminal Output */}
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 scrollbar-dark max-h-[500px] lg:max-h-none">
              {events.map((evt) => {
                let typeColor = 'text-cyan-400 border-cyan-500/20 bg-cyan-950/20';
                let tag = 'TRC';
                if (evt.type === 'COMPUTE') {
                  typeColor = 'text-purple-400 border-purple-500/20 bg-purple-950/20';
                  tag = 'CMP';
                } else if (evt.type === 'SEAL') {
                  typeColor = 'text-emerald-400 border-emerald-500/20 bg-emerald-950/20';
                  tag = 'SEL';
                } else if (evt.type === 'MEMORY') {
                  typeColor = 'text-amber-400 border-amber-500/20 bg-amber-950/20';
                  tag = 'MEM';
                }

                return (
                  <div key={evt.id} className="p-3.5 rounded-lg bg-black/40 border border-white/5 hover:border-cyan-500/20 transition-all hover:bg-black/60 flex flex-col gap-2">
                    <div className="flex flex-wrap justify-between items-center gap-2 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${typeColor}`}>
                          {tag}
                        </span>
                        <span className="text-slate-400 font-bold">{evt.type} RESOURCE NODE</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>{new Date(evt.timestamp).toISOString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-slate-300 font-mono text-[11px] leading-relaxed pl-1 border-l-2 border-slate-800">
                      {evt.payload}
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-600 bg-black/20 px-2 py-1 rounded">
                      <span className="truncate max-w-[250px]">SIG_KEY: sha256:{evt.id.replace(/-/g, '').slice(0, 16)}</span>
                      <span>ORIGIN: OMNICORE-01</span>
                    </div>
                  </div>
                );
              })}
              
              {events.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 py-24 gap-3">
                  <svg className="w-8 h-8 text-slate-700 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Awaiting network resonance telemetry signals...</span>
                </div>
              )}
            </div>
            
            {/* Terminal Prompt Footer */}
            <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-500">
              <div className="flex items-center gap-2">
                <span className="text-cyan-500 animate-pulse font-bold">&gt;_</span>
                <span>SYSTEM_STREAM: CONNECTED TO OMNI_HERMES_V14</span>
              </div>
              <div>
                <span>BUFFER: 50/50 CAP</span>
              </div>
            </div>
          </div>

          {/* Right Column Panels (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Panel 1: System Telemetry & Flow (Ren / Du) */}
            <div className="glass-cyber p-6 flex flex-col border border-white/5">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider mb-6 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                </svg>
                SYSTEM METRIC GAUGES
              </h3>
              
              <div className="space-y-6">
                {/* Memory Flow: Ren */}
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-slate-400 font-bold">Memory Flow (Ren脈)</span>
                    <span className="text-emerald-400 font-mono text-glow-emerald font-bold">{streamStatus.ren.toFixed(2)}%</span>
                  </div>
                  <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5 flow-progress-beam">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(streamStatus.ren, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 mt-2">
                    <span>COGNITIVE LOCK: ON</span>
                    <span>INTEGRITY WEIGHT: 1.0</span>
                  </div>
                </div>
                
                {/* Execution: Du */}
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-slate-400 font-bold">Execution Speed (Du脈)</span>
                    <span className="text-cyan-400 font-mono text-glow-cyan font-bold">{streamStatus.du.toFixed(2)}%</span>
                  </div>
                  <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5 flow-progress-beam">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(streamStatus.du, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[9px] text-slate-500 mt-2">
                    <span>COMPUTE FREQ: 4.8GHz</span>
                    <span>QUEUE: HEALTHY</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 2: 5T Protocol Gateways */}
            <div className="glass-cyber p-6 flex flex-col flex-1 border border-white/5">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                5T CRYPTO-GATEWAYS
              </h3>
              
              <div className="flex-1 flex flex-col justify-between gap-3 text-xs">
                {/* 1. Truth */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-cyan-400">Traceable (真)</span>
                    <span className="text-[9px] text-slate-500">HEX ID: 0x8a92f0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-1 bg-cyan-500 rounded" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-950/40 text-cyan-400 border border-cyan-500/20 font-mono">100%</span>
                  </div>
                </div>

                {/* 2. Goodness */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-emerald-400">Transparent (善)</span>
                    <span className="text-[9px] text-slate-500">HEX ID: 0x3d7b42</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-1 bg-emerald-500 rounded" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-950/40 text-emerald-400 border border-emerald-500/20 font-mono">100%</span>
                  </div>
                </div>

                {/* 3. Beauty */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-pink-400">Tangible (美)</span>
                    <span className="text-[9px] text-slate-500">HEX ID: 0xe5fa11</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-1 bg-pink-500 rounded" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-950/40 text-pink-400 border border-pink-500/20 font-mono">100%</span>
                  </div>
                </div>

                {/* 4. Trust */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-amber-400">Trustworthy (信)</span>
                    <span className="text-[9px] text-slate-500">HEX ID: 0x9c412d</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-1 bg-amber-500 rounded" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-950/40 text-amber-400 border border-amber-500/20 font-mono">92%</span>
                  </div>
                </div>

                {/* 5. Transferful */}
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-black/20 border border-white/5 hover:border-cyan-500/10 transition-colors">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-bold text-indigo-400">Trackable (通)</span>
                    <span className="text-[9px] text-slate-500">HEX ID: 0x221fb0</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-1 bg-indigo-500 rounded" />
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-950/40 text-indigo-400 border border-indigo-500/20 font-mono">88%</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
