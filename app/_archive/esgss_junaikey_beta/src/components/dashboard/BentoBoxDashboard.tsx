/**
 * 🍱 Bento Box 高密度儀表板 (Bento Box High-Density Dashboard)
 * --------------------------------------------------
 * [設計] 零滾動 + 高密度核心系統 + 5T 協議可視化
 * [佈局] 12欄 × 6行網格佈局 (Bento Design)
 * [價值] 影響力主權 — 誠信即數位生產力
 *
 * [5T 協議對映]
 * - T1 Traceable (可溯源): 翡翠狀態 (Emerald)
 * - T2 Trackable (可追蹤): 天空狀態 (Sky)
 * - T3 Transparent (可透明驗算): 翡翠狀態 (Emerald)
 * - T4 Tangible (可感知): 蒂芬妮狀態 (Tiffany)
 * - T5 Trustworthy (不可篡改): 數位主權狀態 (Sovereign)
 */

const AGENT_DISPLAY_LIMIT = 4;
const DNA_DEFAULT_VAL = 50;
const HASH_TRUNCATE_LENGTH = 24;
const HASH_START_IDX = 0;
const UUID_TRUNCATE_LENGTH = 8;
const TRACE_ID_TRUNCATE_LENGTH = 12;
const ESG_RATING_THRESHOLD = 800;
const ALIGNMENT_PRECISION = 1;
const DEFAULT_FALLBACK_VAL = 10;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Activity,
  Share2,
  Database,
  Cpu,
  Lock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { sovereignLedger, ImpactSummary } from '../../1-service/SovereignLedger';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../styles/liquid-glass.css';

// ========== 子組件：便當盒卡片 (Bento Card) ==========
interface BentoCardProps {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
  className?: string;
  status?: string;
}

const BentoCard: React.FC<BentoCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  status = 'SENTIENT',
}) => (
  <div
    className={`liquid-glass rounded-2xl p-5 flex flex-col h-full shadow-2xl hover:border-cyan-500/30 transition-all group overflow-hidden relative ${className}`}
  >
    {/* Glassmorphism Flare */}
    <div className="absolute -top-10 -right-10 w-24 h-24 bg-cyan-500/10 blur-3xl rounded-full group-hover:bg-cyan-500/20 transition-all pointer-events-none" />

    <div className="flex justify-between items-center mb-4 relative z-10">
      <div className="flex items-center gap-2.5 text-cyan-400">
        <Icon size={20} className="drop-shadow-[0_0_8px_rgba(13,242,238,0.4)]" />
        <span className="text-[11px] font-black tracking-[0.2em] uppercase">{title}</span>
      </div>
      <span className="text-[9px] px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-bold tracking-widest">
        {status}
      </span>
    </div>
    <div className="flex-1 overflow-hidden relative z-10">{children}</div>
  </div>
);

// ========== 核心組件 (Main Component) ==========
export const BentoBoxDashboard: React.FC = () => {
  const [ledgerData, setLedgerData] = useState<any[]>([]);
  const [summary, setSummary] = useState<ImpactSummary>({
    totalPoints: 0,
    totalMissions: 0,
    verifiedTrustworthyCount: 0,
  });

  const [fiveTStatus, setFiveTStatus] = useState({
    t1: false,
    t2: false,
    t3: false,
    t4: false,
    t5: false,
  });

  // IComponentCore Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/BentoBoxDashboard.tsx',
      '1.0.0',
      ['BentoBox', 'Dashboard', 'HighDensity']
    )
  );

  // 訂閱主權帳本與 Omni Core 數據流
  useEffect(() => {
    // 1. 訂閱帳本變更
    const subscription = sovereignLedger.getLedgerObservable().subscribe(entries => {
      setLedgerData(entries);
      setSummary(sovereignLedger.getImpactSummary());

      // 更新最近一筆數據的 5T 狀態
      if (entries.length > 0) {
        const latest = entries[entries.length - 1];
        if (latest) {
          setFiveTStatus({
            t1: !!latest.evidence?.traceable?.source_origin, // Traceable
            t2: !!latest.evidence?.trackable?.lifecycle_hooks?.length, // Trackable
            t3: !!latest.evidence?.transparent?.formula, // Transparent
            t4: !!latest.evidence?.tangible?.metric, // Tangible
            t5: latest.status === 'Trustworthy', // Trustworthy
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div
      className="bg-[#020617] text-slate-200 min-h-screen p-6 font-sans selection:bg-cyan-500/30"
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      {/* Header: System Identity Bar */}
      <header className="flex justify-between items-end mb-6 px-4">
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-1 bg-cyan-500 h-8 rounded-full shadow-[0_0_15px_rgba(13,242,238,0.6)]" />
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">
                IMPACT NEXUS <span className="text-cyan-400">v10.0-OMNI</span>
              </h1>
              <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">
                UUID:{' '}
                {core.uuid}
                {/* OMNI_CRYSTAL_ACTIVE */}
              </p>
            </div>
          </motion.div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-primary/80 tracking-widest">
            SIGN-OFF: JUNIPER CHEN (OMNI-ARCHITECT)
          </p>
          <p className="text-[10px] text-slate-600 font-mono uppercase">
            Temporal Anchor: {new Date().toISOString().split('T')[0]}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-12 grid-rows-6 gap-4 h-[calc(100vh-140px)]">
        {/* 5T Integrity Gate Panel */}
        <BentoCard title="5T INTEGRITY PROTOCOL" icon={Shield} className="col-span-3 row-span-3">
          <div className="space-y-4 mt-2">
            {[
              {
                id: 'T1',
                name: 'Traceable',
                color: 'bg-emerald-500',
                desc: '可溯源 (Provenance)',
                active: fiveTStatus.t1,
              },
              {
                id: 'T2',
                name: 'Trackable',
                color: 'bg-sky-500',
                desc: '可追蹤 (Lifecycle)',
                active: fiveTStatus.t2,
              },
              {
                id: 'T3',
                name: 'Transparent',
                color: 'bg-primary',
                desc: '可透明驗算 (Logic)',
                active: fiveTStatus.t3,
              },
              {
                id: 'T4',
                name: 'Tangible',
                color: 'bg-purple-500',
                desc: '可感知 (Manifest)',
                active: fiveTStatus.t4,
              },
              {
                id: 'T5',
                name: 'Trustworthy',
                color: 'bg-rose-500',
                desc: '不可篡改 (Omni-Locked)',
                active: fiveTStatus.t5,
              },
            ].map(t => (
              <div key={t.id} className="flex items-center gap-4 group/item">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${t.color} ${t.active ? 'animate-pulse shadow-[0_0_10px_currentColor]' : 'opacity-20'}`}
                />
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-0.5">
                    <div className="text-[12px] font-black tracking-wider uppercase text-slate-200">
                      {t.id} {t.name}
                    </div>
                    {t.active ? (
                      <CheckCircle size={12} className="text-primary" />
                    ) : (
                      <AlertCircle size={12} className="text-rose-500" />
                    )}
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 pt-4 border-t border-slate-800">
            {Object.values(fiveTStatus).every(Boolean) ? (
              <div className="p-2.5 rounded-xl bg-primary/5 border border-primary/20 text-primary font-black tracking-widest text-[10px] flex items-center justify-center gap-2">
                <Lock size={12} /> OMNI-CRYSTAL VERIFIED
              </div>
            ) : (
              <span className="text-rose-400 flex items-center justify-center gap-1 text-[10px] font-bold">
                <AlertCircle size={12} /> WAITING_FOR_DATA
              </span>
            )}
          </div>
        </BentoCard>

        {/* Cognitive Nebula: Omni Agent Sector (Living Dashboard) */}
        <BentoCard
          title="OMNI AGENT SECTOR"
          icon={Cpu}
          className="col-span-6 row-span-4"
          status="AWAKENING"
        >
          <div className="h-full flex flex-col relative overflow-hidden">
            {/* Agents Data Grid */}
            <div className="grid grid-cols-2 gap-4 p-4 z-10 h-full overflow-y-auto custom-scrollbar">
              {ledgerData
                .filter(e => e.label === 'InfoOneAgent')
                .slice(-AGENT_DISPLAY_LIMIT)
                .map((agentEntry, idx) => {
                  const agent = (agentEntry.data || {}) as any;
                  return (
                    <motion.div
                      key={agentEntry.uuid || idx}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-slate-900/80 border border-slate-700/50 rounded-xl p-4 flex flex-col gap-3 hover:border-primary/50 transition-all group"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center font-black text-lg text-slate-400 group-hover:text-primary group-hover:border-primary transition-all">
                            {agent.name?.charAt(0) || 'A'}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white group-hover:text-primary transition-colors">
                              {agent.type || agent.name || 'Unknown Agent'}
                            </div>
                            <div className="text-[10px] text-slate-500 font-mono">
                              LV.{agent.level || 0} | {agent.role || 'GHOST'}
                            </div>
                          </div>
                        </div>
                        <div
                          className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${agent.agent_status === 'AWAKENED'
                              ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20 animate-pulse'
                              : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                        >
                          {agent.agent_status || 'DORMANT'}
                        </div>
                      </div>

                      {/* DNA Stats Mini-Viz */}
                      <div className="flex gap-1 mt-1">
                        {['INT', 'CRE', 'EMP'].map((stat, i) => {
                          const dnaValues = agent.dna ? Object.values(agent.dna) : [];
                          return (
                            <div
                              key={stat}
                              className="flex-1 bg-slate-950 h-1 rounded-full overflow-hidden"
                            >
                              <div
                                className={`h-full ${i === 0 ? 'bg-sky-500' : i === 1 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                style={{
                                  width: `${dnaValues[i] !== undefined ? (dnaValues[i] as number) : DNA_DEFAULT_VAL}%`,
                                }}
                              />
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono truncate">
                        TraceID:{' '}
                        {agent.traceId?.substring(HASH_START_IDX, TRACE_ID_TRUNCATE_LENGTH)}...
                      </div>
                    </motion.div>
                  );
                })}

              {ledgerData.filter(e => e.label === 'InfoOneAgent').length === 0 && (
                <div className="col-span-2 flex flex-col items-center justify-center text-slate-600 h-40 border border-dashed border-slate-800 rounded-xl">
                  <Cpu size={32} className="mb-2 opacity-20" />
                  <span className="text-xs font-bold tracking-widest uppercase opacity-50">
                    Waiting for Agent Signal...
                  </span>
                </div>
              )}
            </div>
          </div>
        </BentoCard>

        {/* Decentralized Trust & Anchor Monitoring */}
        <BentoCard
          title="SOVEREIGN TRUST"
          icon={Lock}
          className="col-span-3 row-span-3"
          status="ANCHORED"
        >
          <div className="mt-4 space-y-6">
            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 group-hover:border-primary/30 transition-all">
              <div className="text-[9px] text-primary/60 font-black tracking-widest mb-1.5 uppercase">
                Omni Crystal Anchor
              </div>
              <div className="text-[11px] font-mono break-all text-slate-300 leading-relaxed tracking-wider">
                {ledgerData.length > 0
                  ? ledgerData[ledgerData.length - 1]?.evidence?.trustworthy?.hash_lock?.substring(
                    HASH_START_IDX,
                    HASH_TRUNCATE_LENGTH
                  ) + '...'
                  : '0X...PENDING'}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center text-[11px] font-bold tracking-widest">
                <span className="text-slate-400">OMNI VALIDATION</span>
                <span className="text-emerald-400 flex items-center gap-1.5">
                  <Zap size={10} className="fill-current" /> VALIDATED
                </span>
              </div>
              <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: ledgerData.length > 0 ? '100%' : '10%' }}
                  transition={{ duration: 2 }}
                  className="bg-gradient-to-r from-emerald-500 to-primary h-full shadow-[0_0_10px_rgba(13,242,238,0.4)]"
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                信賴保護：Omni Trinity 狀態已確認，奧秘元素已結晶化。
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 mt-auto">
              <p className="text-[10px] text-primary italic font-serif opacity-80">
                &quot;誠信即數位生產力&quot;
              </p>
              <p className="text-[9px] text-slate-600 mt-1.5 font-bold tracking-widest uppercase">
                — T-SENTIENT EXECUTION UNIT
              </p>
            </div>
          </div>
        </BentoCard>

        {/* Infrastructure & Energy Metering */}
        <BentoCard title="QUANTUM FLOW" icon={Database} className="col-span-3 row-span-2">
          <div className="grid grid-cols-2 gap-3 mt-2">
            <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">
                Queue Latency
              </div>
              <div className="text-xl font-black text-white">12ms</div>
            </div>
            <div className="text-center p-3 bg-slate-900/50 rounded-xl border border-slate-800">
              <div className="text-[9px] text-slate-500 font-bold uppercase mb-1">
                Crystal Nodes
              </div>
              <div className="text-xl font-black text-primary">{ledgerData.length}</div>
            </div>
            <div className="text-center p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl col-span-2">
              <div className="text-[9px] text-emerald-500/60 font-black uppercase mb-1">
                Sovereign Cluster Status
              </div>
              <div className="text-sm font-black text-emerald-400 tracking-widest">
                OMNI_SYNC_ACTIVE
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Real-time Impact Metrics */}
        <BentoCard
          title="IMPACT ANALYTICS"
          icon={TrendingUp}
          className="col-span-3 row-span-3"
          status="LIVE_FEED"
        >
          <div className="space-y-4 mt-3">
            {[
              {
                label: 'ESG RATING',
                value: summary.totalPoints > ESG_RATING_THRESHOLD ? 'A+' : 'A',
                color: 'text-emerald-400',
              },
              {
                label: 'TOTAL MISSIONS',
                value: summary.totalMissions.toLocaleString(),
                color: 'text-primary',
              },
              {
                label: 'TRUSTWORTHY LINKS',
                value: summary.verifiedTrustworthyCount.toLocaleString(),
                color: 'text-purple-400',
              },
            ].map(metric => (
              <div
                key={metric.label}
                className="flex justify-between items-center bg-slate-900/40 p-3 rounded-xl border border-slate-800/50"
              >
                <span className="text-[10px] font-black text-slate-400 tracking-widest">
                  {metric.label}
                </span>
                <span className={`text-sm font-black ${metric.color}`}>{metric.value}</span>
              </div>
            ))}
            <div className="pt-4 border-t border-slate-800">
              <div className="text-[9px] text-slate-500 font-black tracking-widest uppercase mb-1.5">
                Alignment Score
              </div>
              <div className="text-3xl font-black text-white flex items-end gap-1">
                {((summary.verifiedTrustworthyCount / (ledgerData.length || 1)) * 100).toFixed(1)}
                <span className="text-sm text-slate-400 pb-1">%</span>
              </div>
            </div>
          </div>
        </BentoCard>

        {/* Traceable Logs: Sentient Audit Trail */}
        <BentoCard
          title="SENTIENT AUDIT TRAIL"
          icon={Share2}
          className="col-span-9 row-span-2"
          status="REAL-TIME"
        >
          <div className="font-mono text-[10px] text-slate-400 space-y-1.5 mt-2 bg-black/40 p-4 rounded-xl border border-slate-800/60 custom-scrollbar overflow-y-auto max-h-[120px] flex flex-col-reverse">
            {ledgerData.length === 0 && (
              <p className="flex gap-3 text-slate-600">
                <span>[SYSTEM] No transactions recorded yet. Waiting for Sovereign Impact...</span>
              </p>
            )}
            {ledgerData.map((entry, idx) => (
              <p key={entry.uuid || idx} className="flex gap-3">
                <span className="text-primary font-bold">[{new Date().toLocaleTimeString()}]</span>
                <span
                  className={
                    entry.status === 'Trustworthy'
                      ? 'text-emerald-500 uppercase'
                      : 'text-slate-300 uppercase'
                  }
                >
                  {entry.status === 'Trustworthy' ? 'OMNI-CRYSTAL:' : 'PENDING:'}
                </span>
                {entry.label || 'Sentient Asset'} -{' '}
                {entry.status === 'Trustworthy'
                  ? entry.evidence?.trustworthy?.hash_lock?.substring(
                    HASH_START_IDX,
                    HASH_TRUNCATE_LENGTH
                  )
                  : entry.evidence?.traceable?.source_origin || 'Omni Source'}{' '}
                (UUID: {entry.uuid?.substring(HASH_START_IDX, UUID_TRUNCATE_LENGTH)}...)
              </p>
            ))}
          </div>
        </BentoCard>
      </div>
    </div>
  );
};

export default BentoBoxDashboard;
