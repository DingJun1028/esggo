'use client';

import React, { useState, useEffect } from 'react';
import { useOmniRealtime } from '../../hooks/useOmniRealtime';
import { useOmniResonance } from '../../hooks/useOmniResonance';

export default function OmniSpacePage() {
  const { events, isStreaming, onlineUsers, emitEvent } = useOmniRealtime();
  const { rs, streamStatus, status } = useOmniResonance();
  const [pulseActive, setPulseActive] = useState(false);

  // Trigger pulse effect on resonance state update
  useEffect(() => {
    setPulseActive(true);
    const timer = setTimeout(() => setPulseActive(false), 500);
    return () => clearTimeout(timer);
  }, [rs]);

  const handleManualPulse = () => {
    emitEvent({
      type: 'TRACE',
      payload: `[User Interaction] Manual Resonance Pulse from Frontend.`,
      integrity_hash: '0x00000000000000000'
    });
  };

  const handleRestoration = async (protocol: string, type: 'SEAL' | 'MEMORY' | 'COMPUTE', hash: string) => {
    // 1. Broadcast the trigger event
    emitEvent({ 
      type, 
      payload: `[Omni Restoration] Triggered: ${protocol}...`, 
      integrity_hash: hash 
    });

    try {
      // 2. Call JunAiKey agent (v3 execute API)
      const res = await fetch('/api/agent/v3/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: `執行萬能修復協議：${protocol}。請診斷系統中的亂碼與邏輯斷層，並進行自動修復。` })
      });

      if (!res.body) return;
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        for (const line of lines) {
          if (line.startsWith('data: ') && !line.includes('[DONE]')) {
            try {
              const data = JSON.parse(line.slice(6));
              // 3. Broadcast the agent's progress
              emitEvent({
                type: type,
                payload: `[JunAiKey] ${data.status}: ${data.message}`,
                integrity_hash: data.id || '0xAI'
              });
            } catch (e: any) {
              // ignore parse errors for partial chunks
            }
          }
        }
      }
    } catch (error: any) {
       emitEvent({ type, payload: `[Omni Restoration] Error executing ${protocol}`, integrity_hash: '0xERR' });
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 overflow-hidden flex flex-col font-mono relative selection:bg-cyan-500/30 selection:text-white">
      {/* CSS Background Grid inside page for safe layout */}
      <div 
        className="absolute inset-0 pointer-events-none" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6,182,212,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6,182,212,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px'
        }}
      />

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
        <header className="bg-black/40 backdrop-blur-xl p-6 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <div className="flex items-center gap-4">
            {/* Animated Logo Hexagon */}
            <div className="relative w-12 h-12 flex items-center justify-center bg-cyan-950/40 border border-cyan-500/30 rounded-xl shadow-[0_0_10px_rgba(6,182,212,0.2)]">
              <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              {isStreaming && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping text-cyan-400" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold uppercase tracking-widest">ESG GO</span>
                <span className="text-xs text-slate-500">v2.1-Berkeley (Collaborative)</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-500 mt-1" style={{ textShadow: '0 0 20px rgba(6,182,212,0.3)' }}>
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
                  ? 'border-emerald-500/30 bg-emerald-950/20 text-emerald-400' 
                  : 'border-yellow-500/30 bg-yellow-950/20 text-yellow-400'
              }`} style={{ textShadow: rs >= 0.9 ? '0 0 10px rgba(16,185,129,0.5)' : 'none' }}>
                {status}
              </span>
              <span className="text-[9px] text-slate-500">COLLAB STATE</span>
            </div>
          </div>
        </header>

        {/* Sovereign Bento Grid Layout */}
        <div className="grid grid-cols-12 gap-6 flex-1 min-h-[600px]">
          
          {/* Main Bento Panel: Live Cyber Terminal (8 cols) */}
          <div className="col-span-12 lg:col-span-8 bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col relative overflow-hidden border border-white/5">
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
                <button 
                  onClick={handleManualPulse}
                  className="text-[10px] font-bold px-3 py-1 rounded bg-cyan-600/20 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500/30 transition-all uppercase tracking-wider active:scale-95"
                >
                  [ Trigger Pulse ]
                </button>
                <div className="text-[10px] text-slate-500 flex items-center gap-1.5 bg-black/30 px-3 py-1 rounded-md border border-white/5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  REALTIME CHANNEL
                </div>
              </div>
            </div>
            
            {/* Cyber Terminal Output */}
            <div className="flex-1 overflow-y-auto space-y-3 font-mono text-xs pr-2 max-h-[500px] lg:max-h-none">
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
                  <div key={evt.id} className="p-3.5 rounded-lg bg-black/60 border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col gap-2">
                    <div className="flex flex-wrap justify-between items-center gap-2 text-[10px]">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[9px] font-bold ${typeColor}`}>
                          {tag}
                        </span>
                        <span className="text-slate-400 font-bold">{evt.type} SIGNAL</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-500">
                        <span>{new Date(evt.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                    
                    <div className="text-cyan-100 font-mono text-[11px] leading-relaxed pl-2 border-l-2 border-cyan-800">
                      {evt.payload}
                    </div>
                    
                    <div className="flex justify-between items-center text-[9px] text-slate-500 bg-black/40 px-2 py-1 rounded">
                      <span>USER: {evt.user_email || 'Anonymous'}</span>
                      <span className="truncate max-w-[150px]">SIG: {evt.id.slice(0, 16)}</span>
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
          </div>

          {/* Right Column Panels (4 cols) */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            
            {/* Panel 1: Online Commanders (Presence) */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col border border-white/5">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                ONLINE COMMANDERS ({onlineUsers.length})
              </h3>
              
              <div className="space-y-3">
                {onlineUsers.length === 0 ? (
                  <div className="text-xs text-slate-500">Scanning for presences...</div>
                ) : (
                  onlineUsers.map((u: any, i: number) => (
                    <div key={i} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                      <div className="relative w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500/50 flex justify-center items-center font-bold text-xs">
                        {u.email ? u.email[0].toUpperCase() : 'A'}
                        <span className="absolute bottom-0 right-0 w-2 h-2 bg-emerald-500 rounded-full border border-black" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-200">{u.email || 'Anonymous'}</span>
                        <span className="text-[9px] text-slate-500 font-mono">ID: {u.user_id?.slice(0,8)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Panel 2: System Metric Gauges */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col border border-white/5 flex-1">
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
                    <span className="text-emerald-400 font-mono font-bold" style={{ textShadow: '0 0 8px rgba(16,185,129,0.4)' }}>{streamStatus.ren.toFixed(2)}%</span>
                  </div>
                  <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-600 via-emerald-400 to-cyan-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(streamStatus.ren, 100)}%` }}
                    />
                  </div>
                </div>
                
                {/* Execution: Du */}
                <div className="bg-black/30 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center mb-2 text-xs">
                    <span className="text-slate-400 font-bold">Execution Speed (Du脈)</span>
                    <span className="text-cyan-400 font-mono font-bold" style={{ textShadow: '0 0 8px rgba(6,182,212,0.4)' }}>{streamStatus.du.toFixed(2)}%</span>
                  </div>
                  <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-indigo-400 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(streamStatus.du, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Omni Restoration Protocol */}
            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-6 flex flex-col border border-white/5 border-t-cyan-500/30">
              <h3 className="text-sm font-bold text-slate-200 tracking-wider mb-4 flex items-center gap-2">
                <svg className="w-4 h-4 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                OMNI RESTORATION (萬能修復)
              </h3>
              
              <div className="space-y-3">
                <button 
                  onClick={() => handleRestoration('Chain Validation (鏈式校驗)', 'SEAL', '0xCV01')}
                  className="w-full text-left text-[11px] font-bold px-4 py-2.5 rounded bg-black/40 text-slate-300 border border-emerald-500/20 hover:border-emerald-500/60 hover:bg-emerald-950/30 transition-all group flex justify-between items-center"
                >
                  <span>1. Chain Validation (鏈式校驗)</span>
                  <span className="opacity-0 group-hover:opacity-100 text-emerald-400 transition-opacity">EXECUTE</span>
                </button>
                <button 
                  onClick={() => handleRestoration('Ghost Recomposition (殘影重組)', 'MEMORY', '0xGR02')}
                  className="w-full text-left text-[11px] font-bold px-4 py-2.5 rounded bg-black/40 text-slate-300 border border-purple-500/20 hover:border-purple-500/60 hover:bg-purple-950/30 transition-all group flex justify-between items-center"
                >
                  <span>2. Ghost Recomposition (殘影重組)</span>
                  <span className="opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity">EXECUTE</span>
                </button>
                <button 
                  onClick={() => handleRestoration('Semantic Alignment (語義修正)', 'COMPUTE', '0xSA03')}
                  className="w-full text-left text-[11px] font-bold px-4 py-2.5 rounded bg-black/40 text-slate-300 border border-cyan-500/20 hover:border-cyan-500/60 hover:bg-cyan-950/30 transition-all group flex justify-between items-center"
                >
                  <span>3. Semantic Alignment (語義修正)</span>
                  <span className="opacity-0 group-hover:opacity-100 text-cyan-400 transition-opacity">EXECUTE</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
