'use client';
import { useState, useEffect } from 'react';
import { Activity, Shield, Database, Cpu, Globe, CheckCircle, RefreshCw, Zap, Server, Lock, HardDrive, Wifi } from 'lucide-react';

const SERVICES = [
  { id: 'db', name: 'Supabase PostgreSQL', category: 'Storage', icon: Database, provider: 'PostgreSQL 15', status: 'online' },
  { id: 'ai', name: 'Google Gemini 2.0', category: 'Intelligence', icon: Cpu, provider: 'Flash-Exp', status: 'online' },
  { id: 'zkp', name: 'ZKP Engine', category: 'Security', icon: Lock, provider: 'WebCrypto Native', status: 'online' },
  { id: 'audit', name: '5T Audit Logger', category: 'Compliance', icon: Activity, provider: 'Edge Functions', status: 'online' },
  { id: 'vault', name: 'Evidence Vault', category: 'Storage', icon: HardDrive, provider: 'Supabase Storage', status: 'online' },
  { id: 'realtime', name: 'Realtime Sync', category: 'Network', icon: Wifi, provider: 'Supabase Realtime', status: 'online' },
];

const LOGS = [
  { time: '14:32:18', level: 'INFO', msg: '5T_GATE: New evidence sealed. UUID: a3f7...', color: '#22c55e' },
  { time: '14:31:55', level: 'INFO', msg: 'ZKP_ENGINE: Proof generated for GRI 305-1.', color: '#3b7ea1' },
  { time: '14:31:22', level: 'WARN', msg: 'RATE_LIMIT: High API call frequency detected.', color: '#f59e0b' },
  { time: '14:30:40', level: 'INFO', msg: 'AUTH_SERVICE: User session extended.', color: '#22c55e' },
  { time: '14:30:01', level: 'INFO', msg: 'GEMINI_API: GRI chapter draft generated.', color: '#3b7ea1' },
];

export default function SystemStatusPage() {
  const [latency, setLatency] = useState(28);
  const [refreshing, setRefreshing] = useState(false);
  const [tps, setTps] = useState([40, 60, 35, 80, 45, 90, 55, 70, 30, 85, 50, 95, 60, 40]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLatency(Math.floor(Math.random() * 30) + 15);
      setTps(Array.from({ length: 14 }, () => Math.floor(Math.random() * 70) + 25));
      setRefreshing(false);
    }, 1500);
  };

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#003262', margin: 0 }}>系統狀態 System Status</h1>
          <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>即時監控 · 5T 協議健康度 · API 延遲診斷</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', background: '#003262', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}
        >
          <RefreshCw size={14} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
          刷新狀態
        </button>
      </div>

      {/* KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: '平均延遲', value: `${latency}ms`, color: '#22c55e', icon: Zap },
          { label: '系統可用率', value: '99.98%', color: '#003262', icon: Globe },
          { label: '數據完整性', value: '100%', color: '#8b5cf6', icon: Shield },
          { label: '已刻印聖璽', value: '1,247', color: '#f59e0b', icon: HardDrive },
        ].map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>{s.label}</span>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Services */}
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Server size={18} /> 服務節點狀態
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {SERVICES.map(s => (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.08)' }}>
                  <s.icon size={18} color="#003262" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b' }}>{s.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>{s.category} · {s.provider}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', fontWeight: '600', color: '#22c55e' }}>
                  <CheckCircle size={14} />
                  正常
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TPS Chart + Logs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#003262', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={18} /> 實時資料流量 (TPS)
            </h3>
            <div style={{ height: '120px', display: 'flex', alignItems: 'flex-end', gap: '4px', paddingBottom: '8px' }}>
              {tps.map((h, i) => (
                <div key={i} style={{ flex: 1, height: `${h}%`, background: 'linear-gradient(to top, #003262, #3b7ea1)', borderRadius: '2px 2px 0 0', opacity: 0.6 + (h / 200) }} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontFamily: 'monospace' }}>
              <span>60s ago</span><span>30s ago</span><span>Now</span>
            </div>
          </div>

          <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '20px', flex: 1 }}>
            <h4 style={{ color: '#94a3b8', fontSize: '11px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.1em' }}>系統日誌</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {LOGS.map((l, i) => (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: '11px', borderBottom: '1px solid #1e293b', paddingBottom: '6px', color: '#94a3b8' }}>
                  <span style={{ color: '#475569' }}>[{l.time}] </span>
                  <span style={{ color: l.color }}>[{l.level}] </span>
                  <span>{l.msg}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}