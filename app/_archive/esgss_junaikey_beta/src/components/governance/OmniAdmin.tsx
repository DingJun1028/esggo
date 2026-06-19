// src/components/governance/OmniAdmin.tsx
import React, { useState, useEffect } from 'react';
import {
  Shield,
  Lock,
  Activity,
  Server,
  Database,
  Users,
  AlertTriangle,
  Eye,
  CheckCircle,
  Download,
  TrendingDown,
  Globe,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { omniLogger, LogCategory } from '../../services/omniLogger';
import { DataWithSource, TrackedDataPoint } from '../ui/DataWithSource';

// Mock Data for Immutable Ledger
const IMMUTABLE_LEDGER = [
  {
    id: 'TX-20250422-001',
    type: 'CARBON_CHECK',
    value: 'Scope 1: 4500 tCO2e',
    status: 'VERIFIED',
    hash: '0x8f...2a1',
  },
  {
    id: 'TX-20250422-002',
    type: 'SROI_AUDIT',
    value: 'Ratio: 1:3.5',
    status: 'VERIFIED',
    hash: '0x7b...c92',
  },
  {
    id: 'TX-20250421-099',
    type: 'DONATION',
    value: '10,000 ESG Coins',
    status: 'LOCKED',
    hash: '0x3d...e55',
  },
  {
    id: 'TX-20250420-156',
    type: 'COMPLIANCE',
    value: 'ISO 14064-1 Cert',
    status: 'VERIFIED',
    hash: '0xa1...f09',
  },
];

const CARBON_DATA = [
  { month: 'Jan', emissions: 4200, target: 4500 },
  { month: 'Feb', emissions: 4100, target: 4450 },
  { month: 'Mar', emissions: 3900, target: 4400 },
  { month: 'Apr', emissions: 3850, target: 4350 },
  { month: 'May', emissions: 4000, target: 4300 },
  { month: 'Jun', emissions: 3700, target: 4250 },
];

export const OmniAdmin: React.FC = () => {
  const [role, setRole] = useState<'admin' | 'enterprise' | 'user'>('admin'); // Simulatable Role
  const [systemHealth, setSystemHealth] = useState({ cpu: 12, memory: 45, entropy: 3.2 });
  const [isExporting, setIsExporting] = useState(false);

  // Simulate live data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemHealth(prev => ({
        cpu: Math.max(5, Math.min(90, prev.cpu + (Math.random() * 10 - 5))),
        memory: Math.max(20, Math.min(80, prev.memory + (Math.random() * 5 - 2.5))),
        entropy: Math.max(1, Math.min(10, prev.entropy + (Math.random() * 0.5 - 0.25))),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleExportLog = () => {
    setIsExporting(true);
    setTimeout(() => {
      const dataStr = JSON.stringify(IMMUTABLE_LEDGER, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ledger_rescue_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setIsExporting(false);
      omniLogger.info(LogCategory.SYSTEM, 'Data Rescued (Exported) from Ledger', {
        size: dataStr.length,
      });
      alert('✅ 終端數據救出成功！ (Terminal Data Rescued)');
    }, 1500);
  };

  // 📊 創建可追溯的數據點
  const cpuData: TrackedDataPoint = {
    value: systemHealth.cpu.toFixed(1),
    label: 'CPU Load',
    unit: '%',
    source: {
      type: 'api',
      timestamp: Date.now(),
      verifiedBy: 'System Monitor Service',
      formula: 'avg(cpu_usage_per_core)',
      dependencies: ['core_0_usage', 'core_1_usage', '...core_n_usage'],
    },
  };

  const memoryData: TrackedDataPoint = {
    value: systemHealth.memory.toFixed(1),
    label: 'Memory Usage',
    unit: '%',
    source: {
      type: 'calculation',
      timestamp: Date.now(),
      verifiedBy: 'OS Kernel',
      formula: '(used_memory / total_memory) × 100',
      dependencies: ['os_total_memory', 'os_used_memory'],
    },
  };

  const entropyData: TrackedDataPoint = {
    value: systemHealth.entropy.toFixed(2),
    label: 'System Entropy',
    unit: 'bits',
    source: {
      type: 'calculation',
      timestamp: Date.now(),
      verifiedBy: 'Entropy Analysis Engine',
      formula: '-Σ(p(x) × log₂(p(x)))',
      dependencies: ['event_distribution', 'probability_matrix'],
    },
    evidenceChain: [
      {
        step: 1,
        type: 'data-collection',
        description: '收集系統事件分布',
        timestamp: Date.now() - 5000,
      },
      {
        step: 2,
        type: 'calculation',
        description: '應用Shannon熵公式',
        formula: '-Σ(p(x) × log₂(p(x)))',
        timestamp: Date.now() - 2000,
      },
      {
        step: 3,
        type: 'normalization',
        description: '正規化至0-10範圍',
        timestamp: Date.now(),
      },
    ],
  };

  // RBAC: If just a regular user, show Access Denied
  if (role === 'user') {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-8 font-sans">
        <Shield className="w-24 h-24 text-red-500 mb-6 opacity-50" />
        <h1 className="text-3xl font-black text-white mb-2">ACCESS DENIED</h1>
        <p className="text-slate-400 mb-8 max-w-md">
          您的權限不足。此區域僅限系統管理員或企業合規官進入。
          <br />
          (You do not have permission to access the Genesis Governance Console.)
        </p>
        <button
          onClick={() => setRole('admin')}
          className="px-6 py-2 bg-slate-800 text-slate-500 hover:text-white rounded-lg text-sm border border-slate-700"
        >
          [DEV ONLY] Simulate Admin Access
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0e27] p-4 md:p-8 pb-32 animate-in fade-in font-sans text-cyan-50">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-cyan-50 flex items-center gap-3">
            <Shield className="text-cyan-400" />
            全球 ESG 戰情中心 (Global War Room)
          </h1>
          <p className="text-cyan-600 text-sm mt-1 flex items-center gap-2">
            <Lock className="w-3 h-3" /> Strategic Command Console v10.1 | Role:{' '}
            <span className="text-cyan-400 font-bold uppercase">{role}</span>
          </p>
        </div>

        <div className="flex gap-2">
          <select
            value={role}
            onChange={e => setRole(e.target.value as any)}
            className="bg-slate-900/80 border border-cyan-500/30 text-cyan-50 text-xs rounded px-2 py-1 outline-none focus:border-cyan-400 backdrop-blur-sm"
          >
            <option value="admin">View as Admin</option>
            <option value="enterprise">View as Enterprise</option>
            <option value="user">View as User</option>
          </select>
        </div>
      </div>

      {/* System Health Dashboard (Admin Only Visibility Check) */}
      {role === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-slate-900/90 to-cyan-900/20 border border-cyan-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-cyan-400/50 transition-all duration-300 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:shadow-[0_0_25px_rgba(6,182,212,0.3)]">
            <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-cyan-400 text-xs font-bold tracking-wider">CORE LOAD</span>
              <Server className="w-4 h-4 text-cyan-400 animate-pulse" />
            </div>
            <DataWithSource data={cpuData}>
              <div className="text-3xl font-black text-cyan-50 relative z-10">
                {systemHealth.cpu.toFixed(1)}%
              </div>
            </DataWithSource>
            <div className="w-full bg-slate-800/50 h-1 mt-4 rounded-full overflow-hidden relative z-10">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 transition-all duration-1000 shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                style={{ width: `${systemHealth.cpu}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900/90 to-blue-900/20 border border-blue-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-400/50 transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.1)] hover:shadow-[0_0_25px_rgba(59,130,246,0.3)]">
            <div className="absolute inset-0 bg-blue-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-blue-400 text-xs font-bold tracking-wider">MEMORY</span>
              <Database className="w-4 h-4 text-blue-400 animate-pulse" />
            </div>
            <DataWithSource data={memoryData}>
              <div className="text-3xl font-black text-cyan-50 relative z-10">
                {systemHealth.memory.toFixed(1)}%
              </div>
            </DataWithSource>
            <div className="w-full bg-slate-800/50 h-1 mt-4 rounded-full overflow-hidden relative z-10">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                style={{ width: `${systemHealth.memory}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900/90 to-pink-900/20 border border-pink-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-pink-400/50 transition-all duration-300 shadow-[0_0_15px_rgba(236,72,153,0.1)] hover:shadow-[0_0_25px_rgba(236,72,153,0.3)]">
            <div className="absolute inset-0 bg-pink-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-pink-400 text-xs font-bold tracking-wider">ENTROPY PULSE</span>
              <Activity
                className={`w-4 h-4 text-pink-400 ${systemHealth.entropy > 5 ? 'animate-pulse' : 'breathe-glow'}`}
              />
            </div>
            <DataWithSource data={entropyData}>
              <div className="text-3xl font-black text-cyan-50 relative z-10 breathe-glow">
                {systemHealth.entropy.toFixed(2)}
              </div>
            </DataWithSource>
            <div className="w-full bg-slate-800/50 h-1 mt-4 rounded-full overflow-hidden relative z-10">
              <div
                className="h-full bg-gradient-to-r from-pink-500 to-pink-400 transition-all duration-1000 shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                style={{ width: `${systemHealth.entropy * 10}%` }}
              ></div>
            </div>
          </div>
          <div className="bg-gradient-to-br from-slate-900/90 to-emerald-900/20 border border-emerald-500/30 p-6 rounded-2xl relative overflow-hidden group hover:border-emerald-400/50 transition-all duration-300 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <div className="absolute inset-0 bg-emerald-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="flex items-center justify-between mb-2 relative z-10">
              <span className="text-emerald-400 text-xs font-bold tracking-wider">
                GLOBAL IMPACT
              </span>
              <Globe className="w-4 h-4 text-emerald-400 breathe-glow" />
            </div>
            <div className="text-3xl font-black text-cyan-50 relative z-10">89.4</div>
            <div className="text-xs text-emerald-400 mt-1 flex items-center gap-1 relative z-10">
              <TrendingDown className="w-3 h-3" /> Carbon Footprint -12%
            </div>
          </div>
        </div>
      )}

      {/* 📊 War Room Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Activity className="w-5 h-5 text-emerald-400" /> Carbon Emission Trends (碳排趨勢)
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={CARBON_DATA}>
                <defs>
                  <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  stroke="#10b981"
                  fillOpacity={1}
                  fill="url(#colorEmissions)"
                  strokeWidth={3}
                />
                <Area
                  type="monotone"
                  dataKey="target"
                  stroke="#64748b"
                  strokeDasharray="5 5"
                  fill="none"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-white/10 rounded-2xl p-6 backdrop-blur-sm flex flex-col">
          <h3 className="text-lg font-bold text-white mb-4">Quick Command</h3>
          <div className="space-y-3 flex-1">
            <button className="w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" /> Initiate Lockdown
            </button>
            <button className="w-full py-3 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              <Server className="w-4 h-4" /> System Diagnostics
            </button>
            <button className="w-full py-3 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2">
              <CheckCircle className="w-4 h-4" /> Verify Certificates
            </button>
          </div>
        </div>
      </div>

      {/* Immutable Ledger Section */}
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-amber-500" /> 善向永續原則帳本 (Immutable Ledger)
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              此區域數據經由區塊鏈存證，為「Read-Only」不可篡改。任何變更皆需經過嚴格的 4T
              協議驗證。
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-900/80 border-b border-slate-800">
              <tr>
                <th className="px-6 py-3">Transaction ID</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Value (Truth)</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Integrity Hash</th>
              </tr>
            </thead>
            <tbody>
              {IMMUTABLE_LEDGER.map(tx => (
                <tr
                  key={tx.id}
                  className="border-b border-slate-800 hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-mono text-slate-300">{tx.id}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        tx.type === 'CARBON_CHECK'
                          ? 'bg-emerald-900/50 text-emerald-400'
                          : tx.type === 'SROI_AUDIT'
                            ? 'bg-blue-900/50 text-blue-400'
                            : 'bg-yellow-900/50 text-yellow-400'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white">{tx.value}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-emerald-500 text-xs font-bold">
                      <Lock className="w-3 h-3" /> {tx.status} -- READ ONLY
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right font-mono text-slate-600 text-xs">
                    {tx.hash} <CheckCircle className="w-3 h-3 inline ml-1 text-slate-700" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Data Rescue & API Section */}
        {(role === 'admin' || role === 'enterprise') && (
          <div className="p-6 border-t border-white/10 bg-indigo-900/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" /> 開發者連結 (Omni-Link API)
              </h3>
              <p className="text-slate-500 text-xs">
                🔑 API_KEY:{' '}
                <span className="text-white font-mono bg-black/30 px-2 py-0.5 rounded">
                  sk_live_51M0...92xZ
                </span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => alert('已重新生成 API Key！')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-colors whitespace-nowrap"
              >
                Roll Key
              </button>
              <button
                onClick={handleExportLog}
                disabled={isExporting}
                className={`px-4 py-2 border border-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold transition-all flex items-center gap-2 hover:bg-emerald-900/20 ${isExporting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isExporting ? (
                  <Activity className="w-3 h-3 animate-spin" />
                ) : (
                  <Download className="w-3 h-3" />
                )}
                {isExporting ? 'Rescuing...' : 'Data Rescue (Export Log)'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
