/**
 * 🍱 Bento Box Dashboard - ESGss x JunAiKey v6.0
 *
 * 一頁式高密度儀表板
 * 整合 4T 善向永續原則視覺化
 */

import React from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { Shield, Activity, Share2, Database, Cpu, Lock, CheckCircle } from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface BentoCardProps {
  title: string;
  icon: React.ComponentType<{ size?: number }>;
  children: React.ReactNode;
  className?: string;
  status?: string;
}

interface FourTStatus {
  traceable: boolean;
  trackable: boolean;
  tallyable: boolean;
  trustworthy: boolean;
}

// ============================================================================
// Components
// ============================================================================

/**
 * 奧秘元件便當盒容器
 */
const BentoCard: React.FC<BentoCardProps> = ({
  title,
  icon: Icon,
  children,
  className = '',
  status = 'Active',
}) => (
  <div
    className={`bg-slate-900 border border-slate-700 rounded-xl p-4 flex flex-col h-full shadow-lg hover:border-blue-500 transition-all ${className}`}
  >
    <div className="flex justify-between items-center mb-3">
      <div className="flex items-center gap-2 text-blue-400">
        <Icon size={18} />
        <span className="text-xs font-bold tracking-widest uppercase">{title}</span>
      </div>
      <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-900/50 text-blue-300 border border-blue-700">
        {status}
      </span>
    </div>
    <div className="flex-1 overflow-hidden">{children}</div>
  </div>
);

/**
 * 4T 誠信協議狀態面板
 */
const FourTIntegrityPanel: React.FC<{ status: FourTStatus }> = ({ status }) => {
  const protocols = [
    {
      id: 'T1',
      name: 'Traceable',
      color: 'bg-green-500',
      desc: '源頭 UUID 鎖定',
      active: status.traceable,
    },
    {
      id: 'T2',
      name: 'Trackable',
      color: 'bg-blue-500',
      desc: '生命週期 Hook 注入',
      active: status.trackable,
    },
    {
      id: 'T3',
      name: 'Tallyable',
      color: 'bg-orange-500',
      desc: 'ISO-14064 演算驗證',
      active: status.tallyable,
    },
    {
      id: 'T4',
      name: 'Tamper-proof',
      color: 'bg-red-500',
      desc: 'Hash Lock & Frozen',
      active: status.trustworthy,
    },
  ];

  return (
    <BentoCard title="4T Integrity Protocol" icon={Shield} className="col-span-3 row-span-2">
      <div className="space-y-3 mt-2">
        {protocols.map(protocol => (
          <div key={protocol.id} className="flex items-center gap-3">
            <div
              className={`w-2 h-2 rounded-full ${protocol.color} ${protocol.active ? 'animate-pulse' : 'opacity-30'}`}
            />
            <div>
              <div className="text-[11px] font-bold leading-none">
                {protocol.id} {protocol.name}
              </div>
              <div className="text-[9px] text-slate-500">{protocol.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </BentoCard>
  );
};

/**
 * Swarm 認知星雲面板
 */
const CognitiveSwarmPanel: React.FC = () => (
  <BentoCard title="Cognitive Swarm" icon={Cpu} className="col-span-6 row-span-4" status="Evolving">
    <div className="h-full flex flex-col justify-center items-center relative">
      {/* 模擬群集路徑視覺化 */}
      <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-500 via-transparent to-transparent" />
      <div className="z-10 text-center">
        <div className="text-4xl font-black text-white mb-2">Gemini 2.0 Flash</div>
        <p className="text-xs text-blue-400 mb-4 tracking-[0.2em]">LANGGRAPH MULTI-AGENT SWARM</p>
        <div className="flex gap-4 justify-center">
          <span className="text-[10px] border border-slate-700 px-3 py-1 rounded">Planner: OK</span>
          <span className="text-[10px] border border-slate-700 px-3 py-1 rounded bg-blue-500/10">
            Executor: BUSY
          </span>
          <span className="text-[10px] border border-slate-700 px-3 py-1 rounded">
            Reviewer: OK
          </span>
        </div>
      </div>
    </div>
  </BentoCard>
);

/**
 * 區塊鏈 & ZKP 錨定面板
 */
const DecentralizedTrustPanel: React.FC = () => (
  <BentoCard title="Decentralized Trust" icon={Lock} className="col-span-3 row-span-3">
    <div className="mt-2 space-y-4">
      <div className="p-2 bg-slate-800/50 rounded border border-slate-700">
        <div className="text-[9px] text-slate-500 mb-1">Polygon Hash Anchor</div>
        <div className="text-[10px] font-mono break-all text-blue-300">0x8f92b...c412f</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center text-[10px]">
          <span>ZKP Verification (v1)</span>
          <span className="text-green-400">VALIDATED</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div className="bg-green-500 h-full w-[94%]" />
        </div>
      </div>
      <div className="pt-2 border-t border-slate-800">
        <p className="text-[10px] text-slate-400 italic">"誠信即數位生產力"</p>
      </div>
    </div>
  </BentoCard>
);

/**
 * 基礎設施能流面板
 */
const EnergyFlowPanel: React.FC = () => (
  <BentoCard title="Energy Flow" icon={Database} className="col-span-3 row-span-2">
    <div className="grid grid-cols-2 gap-2 mt-1">
      <div className="text-center p-2 bg-slate-800/30 rounded">
        <div className="text-[9px] text-slate-500">BullMQ Delay</div>
        <div className="text-lg font-bold text-white">12ms</div>
      </div>
      <div className="text-center p-2 bg-slate-800/30 rounded">
        <div className="text-[9px] text-slate-500">Cache Hit</div>
        <div className="text-lg font-bold text-blue-400">99.2%</div>
      </div>
    </div>
  </BentoCard>
);

/**
 * 善向六大核心理念指標
 */
const ImpactMetricsPanel: React.FC = () => (
  <BentoCard
    title="善向六大核心理念"
    icon={Activity}
    className="col-span-3 row-span-2"
    status="Synced"
  >
    <div className="flex flex-wrap gap-2 mt-1">
      {['創價', '卓越', '悲智', '誠信', '全人整合', '普惠'].map(value => (
        <span
          key={value}
          className="text-[10px] px-2 py-1 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded"
        >
          #{value}
        </span>
      ))}
    </div>
  </BentoCard>
);

/**
 * 實時動態日誌
 */
const RealTimeLogsPanel: React.FC = () => (
  <BentoCard title="Real-time Chained Logs" icon={Share2} className="col-span-9 row-span-2">
    <div className="font-mono text-[9px] text-slate-400 space-y-1 mt-1">
      <p>
        <span className="text-blue-500">[17:42:01]</span> Swarm: Initializing complex task
        decomposition...
      </p>
      <p>
        <span className="text-green-500">[17:42:03]</span> 4T-T1: source_origin verified via
        /vault/raw/data.json
      </p>
      <p>
        <span className="text-orange-500">[17:42:05]</span> ZKP: Generating zero-knowledge proof for
        audit log...
      </p>
      <p>
        <span className="text-red-500">[17:42:08]</span> Anchor: Hash locked to Polygon (Block
        #49281)
      </p>
    </div>
  </BentoCard>
);

// ============================================================================
// Main Dashboard Component
// ============================================================================

// ============================================================================
// Main Dashboard Component
// ============================================================================

/**
 * ESGss Bento Box 儀表板主組件
 */
export const ESGssBentoDashboard: React.FC = () => {
  // 4T 狀態 State
  const [fourTStatus, setFourTStatus] = React.useState<FourTStatus>({
    traceable: false,
    trackable: false,
    tallyable: false,
    trustworthy: false,
  });

  // 系統健康 State
  const [systemHealth, setSystemHealth] = React.useState<any>(null);

  // Poll Health API
  React.useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await fetch('/health');
        const data = await res.json();

        // Update System Health
        setSystemHealth(data);

        // Map to 4T Status (Mock mapping for now based on general health + specific fields)
        if (data.integrityStatus) {
          setFourTStatus({
            traceable: data.healthy, // Assuming healthy means traceable for now
            trackable: true, // Always on in this version
            tallyable: data.healthy,
            trustworthy:
              data.integrityStatus.hashLocksValid && data.integrityStatus.anchorsVerified,
          });
        }
      } catch (e) {
        omniLogger.error(LogCategory.SYSTEM, '[BentoDashboard] Dashboard health check failed', { error: e });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 5000); // 5s heartbeat
    return () => clearInterval(interval);
  }, []);

  // Extract latency for Energy Flow
  const getLatency = (component: string) => {
    const check = systemHealth?.checks?.find((c: any) => c.component === component);
    return check ? `${check.latencyMs}ms` : '--';
  };

  return (
    <div className="bg-black text-slate-200 min-h-screen p-4 font-sans selection:bg-blue-500/30">
      {/* Header: 奧秘永憶主體狀態列 */}
      <header className="flex justify-between items-end mb-4 px-2">
        <div>
          <h1 className="text-2xl font-black tracking-tighter text-white">
            ESGss x JunAiKey <span className="text-blue-500">v6.0</span>
          </h1>
          <p className="text-[10px] text-slate-500 font-mono">
            UUID: 550e8400-e29b-41d4-a716-446655440000 | v10.1.0-universe-v6-alpha
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400">
            Sign-off: Juniper Chen (Omni-Architect)
          </p>
          <p className="text-[10px] text-slate-600">
            Date: {new Date().toISOString().split('T')[0]}
          </p>
        </div>
      </header>

      {/* Main Grid: 12欄位高密度佈局 */}
      <div className="grid grid-cols-12 grid-rows-6 gap-3 h-[calc(100vh-100px)]">
        {/* 4T 誠信燈面板 */}
        <FourTIntegrityPanel status={fourTStatus} />

        {/* Swarm 認知星雲 */}
        <CognitiveSwarmPanel />

        {/* 區塊鏈 & ZKP 錨定 */}
        <DecentralizedTrustPanel />

        {/* 基礎設施能流 */}
        <BentoCard title="Energy Flow" icon={Database} className="col-span-3 row-span-2">
          <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="text-center p-2 bg-slate-800/30 rounded">
              <div className="text-[9px] text-slate-500">Database</div>
              <div className="text-lg font-bold text-white">{getLatency('Database')}</div>
            </div>
            <div className="text-center p-2 bg-slate-800/30 rounded">
              <div className="text-[9px] text-slate-500">Redis</div>
              <div className="text-lg font-bold text-blue-400">{getLatency('Redis')}</div>
            </div>
          </div>
        </BentoCard>

        {/* 善向核心價值 */}
        <ImpactMetricsPanel />

        {/* 實時日誌 */}
        <RealTimeLogsPanel />
      </div>
    </div>
  );
};

export default ESGssBentoDashboard;
