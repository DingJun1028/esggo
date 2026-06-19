'use client';

import React, { useState } from 'react';
// framer-motion 已移除，改用原生 CSS transition 避免 SSR 崩潰
import { ShieldCheck, CheckCircle2, AlertTriangle, TrendingUp, Activity, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FIVE_T_PROTOCOL, FOUR_PLUS_ONE, type FiveTGateCode } from '@/shared/constants/protocol';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniPremiumCard } from '@/components/ui/omni/OmniPremiumCard';
import { OmniProgressRing } from '@/components/ui/omni/OmniProgressRing';
import Protocol5TStrip from '@/components/omni/Protocol5TStrip';

/* ─── Types ─── */
interface GateStatus {
  gate: FiveTGateCode;
  passed: boolean;
  score: number;
  lastChecked: string;
  evidenceCount: number;
}

interface ComplianceEvent {
  id: string;
  gate: FiveTGateCode;
  action: string;
  entity: string;
  timestamp: string;
  status: 'pass' | 'fail' | 'warning';
}

/* ─── Mock Data ─── */
const GATE_STATUSES: GateStatus[] = [
  {
    gate: 'T1',
    passed: true,
    score: 95,
    lastChecked: '2026-01-18T10:30:00+08:00',
    evidenceCount: 128,
  },
  {
    gate: 'T2',
    passed: true,
    score: 98,
    lastChecked: '2026-01-18T10:25:00+08:00',
    evidenceCount: 256,
  },
  {
    gate: 'T3',
    passed: true,
    score: 92,
    lastChecked: '2026-01-18T10:20:00+08:00',
    evidenceCount: 89,
  },
  {
    gate: 'T4',
    passed: false,
    score: 78,
    lastChecked: '2026-01-18T09:45:00+08:00',
    evidenceCount: 45,
  },
  {
    gate: 'T5',
    passed: true,
    score: 100,
    lastChecked: '2026-01-18T10:00:00+08:00',
    evidenceCount: 312,
  },
];

const COMPLIANCE_EVENTS: ComplianceEvent[] = [
  {
    id: 'evt-001',
    gate: 'T1',
    action: '指標具體化完成',
    entity: 'Scope 1 排放數據',
    timestamp: '2026-01-18T10:30:00+08:00',
    status: 'pass',
  },
  {
    id: 'evt-002',
    gate: 'T2',
    action: '來源驗證通過',
    entity: 'ERP_System_A 數據',
    timestamp: '2026-01-18T10:25:00+08:00',
    status: 'pass',
  },
  {
    id: 'evt-003',
    gate: 'T4',
    action: '綠漂風險警示',
    entity: '供應鏈碳排聲明',
    timestamp: '2026-01-18T09:45:00+08:00',
    status: 'warning',
  },
  {
    id: 'evt-004',
    gate: 'T3',
    action: '生命週期追蹤更新',
    entity: 'Water Usage Report',
    timestamp: '2026-01-18T09:30:00+08:00',
    status: 'pass',
  },
  {
    id: 'evt-005',
    gate: 'T5',
    action: 'Hash Lock 驗證',
    entity: 'GRI Report 2025',
    timestamp: '2026-01-18T10:00:00+08:00',
    status: 'pass',
  },
];

/* ─── Components ─── */

function GateCard({ status, index }: { status: GateStatus; index: number }) {
  const gate = FIVE_T_PROTOCOL[status.gate];
  const isPassed = status.passed;

  // 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰
  return (
    <div
      style={{ transition: 'all 0.4s ease' }}
    >
      <OmniPremiumCard
        className={cn(
          'p-5 h-full flex flex-col justify-between',
          !isPassed && 'border-amber-200 bg-amber-50/50'
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={cn(
                  'w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-sm',
                  gate.bgColor
                )}
              >
                {gate.zh}
              </div>
              {isPassed && (
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </span>
              )}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#003262]">{gate.title}</h3>
              <p className="text-[10px] text-slate-400 font-mono">{gate.shortDesc}</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-slate-500 leading-relaxed my-4 flex-grow">{gate.fullDesc}</p>

        <div className="flex items-end justify-between mt-auto">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-cyan-500" />
              <span className="text-xs text-slate-400 font-medium">證據數量</span>
              <span className="text-sm font-mono font-black text-[#003262] bg-slate-100 px-2 py-0.5 rounded-md">
                {status.evidenceCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {isPassed ? (
                <CheckCircle2 size={14} className="text-emerald-500" />
              ) : (
                <AlertTriangle size={14} className="text-amber-500" />
              )}
              <span className="text-xs font-bold" style={{ color: isPassed ? '#10b981' : '#f59e0b' }}>
                {isPassed ? '門徑安全 (Secured)' : '需改善 (Warning)'}
              </span>
            </div>
          </div>
          
          <div className="-mb-2 -mr-2">
            <OmniProgressRing 
              percentage={status.score} 
              size={80} 
              color={isPassed ? '#10b981' : '#f59e0b'} 
            />
          </div>
        </div>
      </OmniPremiumCard>
    </div>
  );
}

function EventRow({ event }: { event: ComplianceEvent }) {
  const gate = FIVE_T_PROTOCOL[event.gate];
  const statusConfig = {
    pass: { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', label: '通過' },
    fail: { icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-50', label: '失敗' },
    warning: { icon: AlertTriangle, color: 'text-amber-500', bg: 'bg-amber-50', label: '警示' },
  };
  const sc = statusConfig[event.status];
  const StatusIcon = sc.icon;

  return (
    <div className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0">
      <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', sc.bg)}>
        <StatusIcon size={14} className={sc.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded', sc.bg, sc.color)}>
            {gate.code}
          </span>
          <span className="text-xs font-medium text-[#003262] truncate">{event.action}</span>
        </div>
        <p className="text-[10px] text-slate-400 mt-0.5 truncate">{event.entity}</p>
      </div>
      <span className="text-[10px] text-slate-400 font-mono shrink-0">
        {new Date(event.timestamp).toLocaleTimeString('zh-TW', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        })}
      </span>
    </div>
  );
}

/* ─── Main Page ─── */
export default function FiveTDashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | '4plus1'>('overview');

  const overallScore = Math.round(GATE_STATUSES.reduce((sum, s) => sum + s.score, 0) / 5);
  const passedGates = GATE_STATUSES.filter((s) => s.passed).length;
  const totalEvidence = GATE_STATUSES.reduce((sum, s) => sum + s.evidenceCount, 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* ─── Header ─── */}
        <OmniPremiumCard className="p-6 md:p-8" interactive={false}>
          {/* Background Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-50/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#FDB515]/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg breathing-glow">
                    <ShieldCheck size={28} className="text-white" />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-[#003262] tracking-tight">
                    5T 信任儀表板
                  </h1>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    5T Trust Dashboard · 真善美信通
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-2xl font-black text-[#003262]">{overallScore}%</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">整體信任分數</p>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="text-right">
                  <p className="text-2xl font-black text-emerald-600">{passedGates}/5</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">門徑通過</p>
                </div>
                <div className="w-px h-10 bg-slate-100" />
                <div className="text-right">
                  <p className="text-2xl font-black text-[#003262]">{totalEvidence}</p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">證據總數</p>
                </div>
              </div>
            </div>

            {/* 5T Strip */}
            <div className="mt-6 max-w-lg">
              <Protocol5TStrip
                status={
                  GATE_STATUSES.map((s) => s.passed) as [
                    boolean,
                    boolean,
                    boolean,
                    boolean,
                    boolean
                  ]
                }
                showLabels
                size="lg"
              />
            </div>
          </div>
        </OmniPremiumCard>

        {/* ─── Tab Navigation ─── */}
        <div className="flex gap-2">
          {[
            { id: 'overview' as const, label: '門徑概覽', icon: ShieldCheck },
            { id: 'events' as const, label: '合規事件', icon: Activity },
            { id: '4plus1' as const, label: '4可1不可', icon: CheckCircle2 },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all',
                activeTab === tab.id
                  ? 'bg-[#003262] text-white shadow-md'
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              )}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Content ─── */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {GATE_STATUSES.map((status, i) => (
              <GateCard key={status.gate} status={status} index={i} />
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <OmniBaseCard className="p-5">
            <h3 className="text-base font-bold text-[#003262] mb-4 flex items-center gap-2">
              <Activity size={16} className="text-cyan-500" />
              即時合規事件時間軸
            </h3>
            <div className="divide-y divide-slate-50">
              {COMPLIANCE_EVENTS.map((event) => (
                <EventRow key={event.id} event={event} />
              ))}
            </div>
          </OmniBaseCard>
        )}

        {activeTab === '4plus1' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.entries(FOUR_PLUS_ONE).map(([key, value], i) => {
              const gateStatus = GATE_STATUSES[i];
              const isPassed = gateStatus?.passed ?? false;
              const gate = FIVE_T_PROTOCOL[gateStatus?.gate ?? 'T1'];
              return (
                /* 使用原生 div + CSS transition 取代 motion.div，避免 SSR 崩潰 */
                <div
                  key={key}
                  style={{ transition: 'all 0.4s ease' }}
                  className={cn(
                    'bg-white rounded-2xl border p-5 text-center relative overflow-hidden',
                    isPassed ? 'border-slate-100' : 'border-amber-200 bg-amber-50/30'
                  )}
                >
                  {/* Breathing Glow */}
                  {isPassed && (
                    <div
                      className={cn(
                        'absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20 blur-xl',
                        gate.bgColor,
                        'breathing-glow'
                      )}
                    />
                  )}

                  <div className="relative z-10">
                    <div
                      className={cn(
                        'w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 text-white font-black',
                        isPassed ? gate.bgColor : 'bg-slate-300',
                        isPassed && 'breathing-glow'
                      )}
                    >
                      {gate.zh}
                    </div>
                    <h3 className="text-sm font-bold text-[#003262] mb-1">{value.label}</h3>
                    <p className="text-[10px] text-slate-400">{value.question}</p>
                    <div
                      className={cn(
                        'mt-3 text-xs font-bold px-2 py-1 rounded-full inline-block',
                        isPassed ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                      )}
                    >
                      {isPassed ? '✓ 已通過' : '⚠ 待改善'}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ─── Footer ─── */}
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-400">
            5T 誠信協議 · 真善美信通 · Truth · Goodness · Beauty · Trust · Transferful
          </p>
        </div>
      </div>
    </div>
  );
}
