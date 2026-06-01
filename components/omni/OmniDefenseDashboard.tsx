'use client';

import React from 'react';
import { useColorDropStream } from '@/lib/hooks/useColorDropStream';
import { OmniZKPBadge } from './OmniZKPBadge';
import { motion } from 'framer-motion';
import { Activity, Shield, Database, FastForward } from 'lucide-react';

export function OmniDefenseDashboard() {
  const { events, isLive, metrics, getVisualState, triggerForensicReplay, core } = useColorDropStream();

  return (
    <div className="w-full max-w-5xl mx-auto p-6 space-y-8 bg-[#020617] min-h-screen text-slate-200 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-cyan-500/20 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent flex items-center gap-2">
            <Shield className="w-6 h-6 text-cyan-400" />
            實時防禦監測儀表板 (Omni Defense)
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-mono">
            System V{core.version} | 5T Protocol Active | UUID: {core.uuid.substring(0,8)}...
          </p>
        </div>
        <OmniZKPBadge />
      </div>

      {/* Metrics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard 
          title="ZKP 合規率" 
          value={`${metrics.zkpSuccessRate}%`} 
          icon={<Shield className="w-5 h-5 text-purple-400" />} 
          glow="shadow-[0_0_15px_rgba(167,139,250,0.15)]"
        />
        <MetricCard 
          title="系統降熵指標 (ΔS)" 
          value={`${metrics.entropyReduction}%`} 
          icon={<Activity className="w-5 h-5 text-emerald-400" />} 
          glow="shadow-[0_0_15px_rgba(16,185,129,0.15)]"
        />
        <MetricCard 
          title="已防護事件總數" 
          value={metrics.totalCount} 
          icon={<Database className="w-5 h-5 text-cyan-400" />} 
          glow="shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        />
      </div>

      {/* Replay Controls */}
      <div className="flex justify-end">
        <button 
          onClick={() => triggerForensicReplay(2)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-600 rounded-lg text-sm transition-all text-cyan-100 hover:text-cyan-300 hover:border-cyan-500/50 shadow-md"
        >
          <FastForward className="w-4 h-4" />
          啟動時光倒流 (2x 重放)
        </button>
      </div>

      {/* Event Stream Log */}
      <div className="bg-slate-900/50 rounded-xl border border-slate-800 p-4 backdrop-blur-xl h-[400px] overflow-y-auto custom-scrollbar relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
        <div className="sticky top-0 bg-slate-900/90 pb-2 mb-4 border-b border-slate-800 z-10 flex justify-between items-center backdrop-blur-md pt-2 px-2 rounded-t-lg">
          <h2 className="text-lg font-semibold text-slate-300">數據流轉日誌 (Audit Trail)</h2>
          <span className={`text-xs px-2 py-1 rounded-full border ${isLive ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30' : 'bg-red-500/10 text-red-300 border-red-500/30'}`}>
            {isLive ? '● 串流連線中' : '○ 連線中斷'}
          </span>
        </div>

        <div className="space-y-3 flex flex-col-reverse px-2">
          {events.map((evt) => {
            const vs = getVisualState(evt.event_type);
            const borderColor = vs.borderColor?.replace('border-', '') || 'rgba(255,255,255,0.1)';
            return (
              <motion.div 
                key={evt.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="p-3 rounded-lg border backdrop-blur-md flex flex-col gap-2"
                style={{ backgroundColor: vs.bgColor, borderColor: borderColor }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white bg-black/40 px-2 py-1 rounded shadow-sm">
                      {vs.label}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{new Date(evt.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">ID: {evt.id.substring(0,8)}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-1">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">來源 (Origin)</p>
                    <p className="text-sm text-slate-200 font-mono mt-1">{evt.source_origin}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider">ZKP 封印雜湊</p>
                    <p className="text-sm text-cyan-300 font-mono truncate mt-1">{evt.payload?.zkp_hash}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
          {events.length === 0 && (
            <div className="text-center text-slate-500 py-10 flex flex-col items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
              <p>等待 RLS 數據水合或即時事件流入...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, glow }: { title: string, value: string | number, icon: React.ReactNode, glow: string }) {
  return (
    <div className={`p-5 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center gap-4 transition-all hover:bg-slate-800/50 ${glow}`}>
      <div className="p-3 rounded-lg bg-black/40 border border-slate-700/50">
        {icon}
      </div>
      <div>
        <h3 className="text-sm text-slate-400 font-medium tracking-wide">{title}</h3>
        <p className="text-2xl font-bold text-slate-100 font-mono mt-1">{value}</p>
      </div>
    </div>
  );
}
