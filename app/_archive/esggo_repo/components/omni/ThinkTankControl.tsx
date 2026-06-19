'use client';

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Brain, Zap, Activity, Shield, Radio, RefreshCw,
  CheckCircle2, AlertTriangle, XCircle, Play, Clock,
  Database, ArrowRight, Loader2, Wifi, WifiOff,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useOmniAgentStream, type StreamEvent, type MissionProgress } from '@/lib/hooks/useOmniAgentStream';

/* ─── Mission Definitions ─── */
const MISSIONS = [
  { id: 'SYNC_OMNIBLUE_OMNITABLE', label: 'OmniBlue → OmniTable', labelZh: '藍碳同步', icon: Database, color: '#06b6d4' },
  { id: 'EVIDENCE_AUDIT', label: 'Evidence Audit', labelZh: '實證驗證', icon: Shield, color: '#10b981' },
  { id: 'PILOT_REPORT', label: 'SustainWrite Pilot', labelZh: '自主撰寫', icon: Brain, color: '#8b5cf6' },
  { id: 'TRANSFER_TO_NCBDB', label: 'NCBDB Migration', labelZh: '資料遷移', icon: ArrowRight, color: '#f59e0b' },
] as const;

/* ─── Sub-components ─── */

function ConnectionBadge({ connected, error, onReconnect }: { connected: boolean; error: string | null; onReconnect: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        'flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border',
        connected
          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
          : 'bg-red-500/10 text-red-400 border-red-500/20'
      )}>
        {connected ? <Wifi size={10} /> : <WifiOff size={10} />}
        {connected ? 'Live' : 'Offline'}
      </div>
      {!connected && (
        <button onClick={onReconnect} className="p-1 rounded hover:bg-white/5 text-slate-400">
          <RefreshCw size={12} />
        </button>
      )}
    </div>
  );
}

function MissionCard({ mission, progress, onLaunch, isLoading }: {
  mission: typeof MISSIONS[number];
  progress?: MissionProgress;
  onLaunch: () => void;
  isLoading: boolean;
}) {
  const Icon = mission.icon;
  const status = progress?.status;

  return (
    <motion.div whileHover={{ scale: 1.01 }} className="relative">
      <Card className="bg-white/[0.02] border-white/5 backdrop-blur-xl rounded-2xl overflow-hidden group hover:border-white/10 transition-all">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${mission.color}15`, border: `1px solid ${mission.color}30` }}>
                <Icon size={16} style={{ color: mission.color }} />
              </div>
              <div>
                <p className="text-[11px] font-bold text-white">{mission.label}</p>
                <p className="text-[9px] text-slate-500">{mission.labelZh}</p>
              </div>
            </div>
            {status && (
              <Badge variant="outline" className={cn('text-[8px]',
                status === 'running' && 'text-cyan-400 border-cyan-500/30',
                status === 'complete' && 'text-emerald-400 border-emerald-500/30',
                status === 'error' && 'text-red-400 border-red-500/30',
              )}>
                {status === 'running' && <Loader2 size={8} className="mr-1 animate-spin" />}
                {status === 'complete' && <CheckCircle2 size={8} className="mr-1" />}
                {status === 'error' && <XCircle size={8} className="mr-1" />}
                {status}
              </Badge>
            )}
          </div>

          {/* Progress bar */}
          {status === 'running' && (
            <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-3">
              <motion.div
                className="h-full rounded-full"
                style={{ background: mission.color }}
                animate={{ width: ['5%', '70%', '90%'] }}
                transition={{ duration: 8, ease: 'easeInOut' }}
              />
            </div>
          )}

          {progress?.totalProcessed !== undefined && status === 'complete' && (
            <p className="text-[10px] text-emerald-400 mb-3">✓ Processed {progress.totalProcessed} items</p>
          )}

          {progress?.error && (
            <p className="text-[10px] text-red-400 mb-3 truncate">⚠ {progress.error}</p>
          )}

          <Button
            variant="ghost"
            size="sm"
            onClick={onLaunch}
            disabled={isLoading || status === 'running'}
            className="w-full text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:border-white/10 h-8"
          >
            {isLoading || status === 'running' ? (
              <><Loader2 size={10} className="mr-1.5 animate-spin" /> Executing...</>
            ) : (
              <><Play size={10} className="mr-1.5" /> Launch Mission</>
            )}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function EventLog({ events }: { events: StreamEvent[] }) {
  const typeColors: Record<string, string> = {
    MISSION_START: 'text-cyan-400',
    MISSION_COMPLETE: 'text-emerald-400',
    AGENT_TASK: 'text-slate-300',
    AGENT_ERROR: 'text-red-400',
    '5T_SEAL': 'text-amber-400',
    COMMAND_ISSUED: 'text-purple-400',
    SCHEDULE_TRIGGERED: 'text-blue-400',
    SCHEDULE_COMPLETE: 'text-emerald-400',
  };

  const typeIcons: Record<string, React.ReactNode> = {
    MISSION_START: <Zap size={10} className="text-cyan-400" />,
    MISSION_COMPLETE: <CheckCircle2 size={10} className="text-emerald-400" />,
    AGENT_TASK: <Activity size={10} className="text-slate-400" />,
    AGENT_ERROR: <AlertTriangle size={10} className="text-red-400" />,
    '5T_SEAL': <Shield size={10} className="text-amber-400" />,
    COMMAND_ISSUED: <Radio size={10} className="text-purple-400" />,
  };

  return (
    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
      <AnimatePresence initial={false}>
        {events.slice(0, 30).map(evt => (
          <motion.div
            key={evt.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 py-2 border-b border-white/[0.03] last:border-0"
          >
            <span className="text-[9px] text-slate-600 font-mono shrink-0 pt-0.5 w-16">
              {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
            <div className="shrink-0 pt-0.5">{typeIcons[evt.event] || <Activity size={10} className="text-slate-500" />}</div>
            <div className="min-w-0">
              <span className={cn('text-[10px] font-bold', typeColors[evt.event] || 'text-slate-400')}>
                {evt.event}
              </span>
              <p className="text-[10px] text-slate-500 truncate">
                {JSON.stringify(evt.payload).substring(0, 120)}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      {events.length === 0 && (
        <p className="text-[10px] text-slate-600 text-center py-8">Awaiting events from OmniAgent Bus...</p>
      )}
    </div>
  );
}

function HITLReviewPanel({ lastSeal }: { lastSeal: StreamEvent | null }) {
  const [reviewStatus, setReviewStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitReview = useCallback(async (decision: 'approved' | 'rejected') => {
    if (!lastSeal) return;
    setIsSubmitting(true);
    try {
      await fetch('/api/omni-agent-api/hitl-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sealId: lastSeal.id,
          gate: String(lastSeal.payload.gate || 'T4'),
          resource: String(lastSeal.payload.chapter || lastSeal.payload.resource || 'N/A'),
          hash: String(lastSeal.payload.hash || lastSeal.payload.zkp_hash || ''),
          decision,
        }),
      });
      setReviewStatus(decision);
    } catch (err) {
      console.error('HITL review submission failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [lastSeal]);

  if (!lastSeal) {
    return (
      <div className="text-center py-8">
        <Shield size={24} className="text-slate-700 mx-auto mb-3" />
        <p className="text-[10px] text-slate-600">No seals pending review</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
        <div className="flex items-center gap-2 mb-2">
          <Shield size={12} className="text-amber-400" />
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">5T Seal Review</span>
        </div>
        <div className="space-y-1.5 text-[10px]">
          <p className="text-slate-300">Gate: <span className="text-white font-bold">{String(lastSeal.payload.gate)}</span></p>
          <p className="text-slate-300">Resource: <span className="text-white font-bold">{String(lastSeal.payload.chapter || lastSeal.payload.resource || 'N/A')}</span></p>
          <p className="text-slate-400 font-mono text-[9px] truncate">Hash: {String(lastSeal.payload.hash || lastSeal.payload.zkp_hash || '—')}</p>
        </div>
      </div>

      {reviewStatus === 'pending' ? (
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => submitReview('approved')}
            disabled={isSubmitting}
            className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-[10px] font-bold h-8"
          >
            {isSubmitting ? <Loader2 size={10} className="mr-1 animate-spin" /> : <CheckCircle2 size={10} className="mr-1" />}
            Approve
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => submitReview('rejected')}
            disabled={isSubmitting}
            className="flex-1 border border-red-500/20 text-red-400 text-[10px] font-bold h-8"
          >
            {isSubmitting ? <Loader2 size={10} className="mr-1 animate-spin" /> : <XCircle size={10} className="mr-1" />}
            Reject
          </Button>
        </div>
      ) : (
        <Badge variant="outline" className={cn('w-full justify-center py-1.5',
          reviewStatus === 'approved' ? 'text-emerald-400 border-emerald-500/30' : 'text-red-400 border-red-500/30'
        )}>
          {reviewStatus === 'approved' ? '✓ Approved & Persisted' : '✗ Rejected & Logged'}
        </Badge>
      )}
    </div>
  );
}

/* ─── Main Component ─── */

export default function ThinkTankControl() {
  const { events, isConnected, connectionError, activeMissions, lastSeal, reconnect, clearEvents } = useOmniAgentStream();
  const [loadingMission, setLoadingMission] = useState<string | null>(null);

  const launchMission = useCallback(async (missionId: string) => {
    setLoadingMission(missionId);
    try {
      await fetch('/api/omni-agent-api/command', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: missionId }),
      });
    } catch (err) {
      console.error('Mission launch failed:', err);
    } finally {
      setLoadingMission(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans p-6 lg:p-8">
      {/* Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 border border-cyan-500/20 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.15)]">
            <Brain size={22} className="text-cyan-400" />
          </div>
          <div>
            <h1 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              萬能智庫 Mission Control
              <Badge variant="outline" className="bg-cyan-500/5 text-cyan-400 border-cyan-500/30 text-[8px]">LIVE</Badge>
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-[0.15em] font-bold mt-0.5">
              Omnipotent Think Tank • Real-Time Agent Orchestration
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConnectionBadge connected={isConnected} error={connectionError} onReconnect={reconnect} />
          <Button variant="ghost" size="sm" onClick={clearEvents} className="text-[9px] font-bold uppercase border border-white/5 h-7">
            Clear Log
          </Button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Mission Launcher — 4 cols */}
        <div className="lg:col-span-4 space-y-4">
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
            <Zap size={10} className="text-cyan-400" /> Mission Launcher
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
            {MISSIONS.map(m => (
              <MissionCard
                key={m.id}
                mission={m}
                progress={activeMissions.find(p => p.mission === m.label || p.mission === m.id.replace(/_/g, ' ').replace('SYNC OMNIBLUE OMNITABLE', 'OmniBlue to OmniTable Sync'))}
                onLaunch={() => launchMission(m.id)}
                isLoading={loadingMission === m.id}
              />
            ))}
          </div>
        </div>

        {/* Event Stream — 5 cols */}
        <div className="lg:col-span-5">
          <Card className="bg-black/40 border-white/5 rounded-2xl overflow-hidden h-full">
            <div className="p-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
              <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Radio size={10} className="text-cyan-400" /> OmniAgent Event Stream
              </p>
              <span className="text-[9px] text-slate-600">{events.length} events</span>
            </div>
            <CardContent className="p-4">
              <EventLog events={events} />
            </CardContent>
          </Card>
        </div>

        {/* HITL + Stats — 3 cols */}
        <div className="lg:col-span-3 space-y-4">
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/[0.02] border-b border-white/5">
              <p className="text-[9px] font-black text-amber-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <Shield size={10} /> 審查聖殿 HITL Review
              </p>
            </div>
            <CardContent className="p-4">
              <HITLReviewPanel lastSeal={lastSeal} />
            </CardContent>
          </Card>

          {/* System Stats */}
          <Card className="bg-white/[0.02] border-white/5 rounded-2xl overflow-hidden">
            <CardContent className="p-5 space-y-3">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                <Activity size={10} className="text-emerald-400" /> System Vitals
              </p>
              {[
                { label: 'Missions Completed', value: activeMissions.filter(m => m.status === 'complete').length, color: 'text-emerald-400' },
                { label: 'Active Missions', value: activeMissions.filter(m => m.status === 'running').length, color: 'text-cyan-400' },
                { label: 'Total Events', value: events.length, color: 'text-slate-300' },
                { label: '5T Seals', value: events.filter(e => e.event === '5T_SEAL').length, color: 'text-amber-400' },
              ].map(s => (
                <div key={s.label} className="flex items-center justify-between py-1.5 border-b border-white/[0.03] last:border-0">
                  <span className="text-[10px] text-slate-500">{s.label}</span>
                  <span className={cn('text-sm font-bold', s.color)}>{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
