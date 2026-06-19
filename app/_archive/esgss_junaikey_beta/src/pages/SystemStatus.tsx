import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Network,
  Search,
  Settings,
  Bell,
  UserCheck,
  Gauge,
  Timer,
  Cpu,
  Shield,
  ZoomIn,
  RefreshCw,
  LogIn,
  Filter,
  Lock,
  Terminal,
  Activity,
  Database,
  Brain,
  AlertCircle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * 📊 Data Flow Monitor (8.0)
 * --------------------------------------------------
 * God-mode monitoring for the Liquid Glass Ecosystem.
 * Visualizes 5T Protocol execution and shard health.
 */
import { useSystemMetrics } from '@/hooks/useSystemMetrics';
import { Zap } from 'lucide-react';
import { junAiKeyClient } from '@/services/api/JunAiKey.Client';
import { Toaster, toast } from 'sonner';

const GlobalHealingButton = () => {
  const [isAwakening, setIsAwakening] = useState(false);

  const handleAwaken = async () => {
    setIsAwakening(true);
    const success = await junAiKeyClient.awakenEternal();
    setIsAwakening(false);

    if (success) {
      toast.success('OmniPriest Eternal Awakening Activated!', {
        description: 'Global Healing Mode: Token limits removed.',
        duration: 5000,
      });
    } else {
      toast.error('Awakening Failed', {
        description: 'The grid rejected the connection.',
      });
    }
  };

  useEffect(() => {
    // [USER REQUEST] Auto-activate Eternal Awakening in Developer Mode
    if (import.meta.env.DEV) {
      handleAwaken();
    }
  }, []);

  return (
    <button
      onClick={handleAwaken}
      disabled={isAwakening}
      className={`
        relative overflow-hidden group px-6 py-2 rounded-full font-bold text-sm transition-all duration-500
        ${isAwakening ? 'bg-amber-100 text-amber-600' : 'bg-slate-900 text-white hover:bg-[#09abb3]'}
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
      <span className="relative flex items-center gap-2">
        <Zap className={`w-4 h-4 ${isAwakening ? 'animate-pulse' : ''}`} />
        {isAwakening ? 'Awakening...' : 'Eternal Awakening'}
      </span>
    </button>
  );
};

const SystemStatus = () => {
  const { throughput, latency, aiStatus, logs, cacheHitRate } =
    useSystemMetrics(3000);
  const [cpuLoad, setCpuLoad] = useState(32);

  useEffect(() => {
    // Keep CPU load simulated as it represents local client load
    const interval = setInterval(() => {
      setCpuLoad(prev => Math.min(100, Math.max(10, prev + (Math.random() * 4 - 2))));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#f8fdfe] text-slate-900 min-h-screen font-sans selection:bg-[#09abb3]/20">
      <Toaster position="top-right" richColors />
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-cyan-100/50 bg-white/70 backdrop-blur-xl px-6 py-4 lg:px-10">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-8">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4 text-[#09abb3]">
              <div className="size-8 flex items-center justify-center bg-[#09abb3]/20 rounded-lg">
                <Network className="w-5 h-5" />
              </div>
              <h2 className="text-slate-900 text-lg md:text-2xl font-black tracking-tight-extreme text-nowrap">
                DingJun <span className="text-[#09abb3] font-black">8.0</span>
              </h2>
            </div>
          </div>
          <div className="flex flex-1 justify-end gap-4 items-center">
            <div className="relative max-w-xs w-full hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#09abb3]/60 w-5 h-5" />
              <input
                className="w-full bg-slate-100/50 border border-cyan-100 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#09abb3]/20 text-slate-800 placeholder:text-slate-400"
                placeholder="搜尋架構節點 (Architecture Nodes)..."
              />
            </div>
            <div className="flex gap-2 text-slate-600">
              <button className="p-2 bg-white hover:bg-slate-50 rounded-xl border border-cyan-100 transition-all shadow-sm">
                <Settings className="w-5 h-5" />
              </button>
              <button className="p-2 bg-white hover:bg-slate-50 rounded-xl border border-cyan-100 transition-all shadow-sm relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 size-2 bg-[#09abb3] rounded-full border-2 border-white"></span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] mx-auto p-6 lg:p-10 space-y-8">
        {/* Page Heading */}
        <div className="flex flex-wrap justify-between items-end gap-6">
          <div className="space-y-1">
            <h1 className="text-slate-900 text-fluid-4xl font-black tracking-tight-extreme uppercase leading-[0.85] mb-2">
              資料流監測器{' '}
              <span className="text-sm md:text-xl font-bold text-slate-400 font-mono ml-2 tracking-widest opacity-50 block md:inline mt-1 md:mt-0">
                DATA FLOW MONITOR
              </span>
            </h1>
            <p className="text-[#09abb3] text-lg flex items-center gap-2 font-medium">
              <UserCheck className="w-5 h-5" />
              上帝模式：高端液態玻璃生態系統監控
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-cyan-100 rounded-full text-[#09abb3] text-sm font-bold shadow-sm">
              <span className="size-2 bg-[#09abb3] rounded-full animate-pulse"></span>
              系統狀態：正常運行 (Active)
            </div>
            <div className="text-slate-400 text-sm font-medium">
              最後同步：{new Date().toLocaleTimeString()}
            </div>
            <GlobalHealingButton />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              label: '數據吞吐量 (Throughput)',
              value: `${throughput.toFixed(1)} GB/s`,
              icon: Activity,
              trend: '+12.4%',
              trendColor: 'text-emerald-500',
            },
            {
              label: '介面延遲 (API Latency)',
              value: `${latency.toFixed(0)}ms`,
              icon: Timer,
              trend: '-2%',
              trendColor: 'text-rose-500',
            },
            {
              label: '處理器負載 (CPU Load)',
              value: `${cpuLoad.toFixed(0)}%`,
              icon: Cpu,
              trend: '-5%',
              trendColor: 'text-rose-500',
            },
            {
              label: '加密健康度 (Encryption)',
              value: 'AES-256',
              icon: Shield,
              trend: '量子級防禦',
              trendColor: 'text-cyan-500',
            },
            {
              label: 'MCP 快取命中率',
              value: `${cacheHitRate}%`,
              icon: Brain,
              trend: '用戶端 (Client)',
              trendColor: 'text-[#09abb3]',
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="backdrop-blur-xl bg-white/60 p-5 rounded-2xl border border-cyan-100 shadow-lg shadow-cyan-900/5 hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="size-10 flex items-center justify-center bg-cyan-50 rounded-xl group-hover:bg-[#09abb3] transition-colors">
                  <stat.icon className="text-[#09abb3] w-5 h-5 group-hover:text-white" />
                </div>
                <span
                  className={`text-[10px] font-black px-2 py-1 rounded-full bg-slate-50 ${stat.trendColor} opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <p className="text-slate-900 text-fluid-xl font-black tracking-tighter">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Main Flow Map Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 backdrop-blur-xl bg-white/80 rounded-3xl p-6 md:p-8 overflow-hidden relative border border-cyan-100 shadow-2xl shadow-cyan-900/5">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 md:mb-10 gap-4">
              <h2 className="text-slate-900 text-2xl md:text-3xl font-black tracking-tight-extreme uppercase">
                系統架構流轉圖{' '}
                <span className="text-xs md:text-sm font-bold text-slate-300 ml-2 tracking-widest opacity-60">
                  FLOW MAP
                </span>
              </h2>
              <div className="flex gap-2">
                <button className="text-[#09abb3] hover:bg-[#09abb3]/10 p-2 rounded-lg transition-colors">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <button className="text-[#09abb3] hover:bg-[#09abb3]/10 p-2 rounded-lg transition-colors">
                  <RefreshCw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="relative space-y-12">
              {/* Source Node */}
              <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                <div className="size-16 rounded-3xl bg-cyan-50 border border-cyan-200 flex items-center justify-center text-[#09abb3] shadow-[0_10px_20px_rgba(9,171,179,0.1)]">
                  <LogIn className="w-8 h-8" />
                </div>
                <div className="backdrop-blur-xl bg-slate-50/50 p-5 rounded-2xl border border-cyan-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-900 font-black">來源數據攝取 (Origin Ingestion)</p>
                      <p className="text-slate-500 text-sm">IoT, Webhooks, 舊有資料庫</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#09abb3] font-mono font-black text-lg">4.2M</p>
                      <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">
                        系統健康
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow Line */}
              <div className="absolute left-8 top-16 w-0.5 h-12 bg-gradient-to-b from-[#09abb3] to-[#09abb3]/20"></div>

              {/* Logic Node */}
              <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                <div className="size-16 rounded-3xl bg-white border border-cyan-100 flex items-center justify-center text-[#09abb3] shadow-lg">
                  <Filter className="w-8 h-8" />
                </div>
                <div className="backdrop-blur-xl bg-cyan-50/30 p-5 rounded-2xl border border-[#09abb3]/20 relative">
                  <div className="absolute -top-3 right-6 px-3 py-1 bg-[#09abb3] text-white text-[10px] font-black rounded-full uppercase tracking-tighter">
                    即時處理中 (Active)
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-900 font-black">5T 邏輯門處理系統</p>
                      <p className="text-slate-500 text-sm">數據驗證與格式化轉換</p>
                    </div>
                    <div className="flex gap-1">
                      <span className="size-2 bg-[#09abb3] rounded-full animate-pulse"></span>
                      <span className="size-2 bg-[#09abb3] rounded-full animate-pulse delay-100"></span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flow Line */}
              <div className="absolute left-8 top-44 w-0.5 h-12 bg-gradient-to-b from-[#09abb3]/20 to-[#09abb3]"></div>

              {/* Vault Node */}
              <div className="grid grid-cols-[80px_1fr] gap-6 items-center">
                <div className="size-16 rounded-3xl bg-[#09abb3] border-2 border-white flex items-center justify-center text-white shadow-[0_10px_25px_rgba(9,171,179,0.3)]">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="backdrop-blur-xl bg-slate-50/50 p-5 rounded-2xl border border-cyan-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-slate-900 font-black">不可篡改保險庫 (Vault Storage)</p>
                      <p className="text-slate-500 text-sm">AES-256 量子級安全機制</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 font-mono text-[10px] font-bold italic tracking-wider uppercase opacity-50">
                        Shard-Alpha-9
                      </p>
                      <p
                        className="text-emerald-500 text-[10px] font-black uppercase tracking-widest"
                      >
                        已同步 (Synced)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Panels */}
          <div className="space-y-6">
            {/* Lifecycle Triggers */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-cyan-100 shadow-xl">
              <h3 className="text-slate-900 text-lg font-black mb-6 flex items-center gap-2">
                <Activity className="text-[#09abb3] w-5 h-5" />
                生命週期掛鉤 (Lifecycle Hooks)
              </h3>
              <div className="space-y-4 font-mono text-xs">
                {[
                  {
                    hook: 'onBeforeIngest',
                    status: 'SUCCESS',
                    color: 'text-emerald-600 bg-emerald-50',
                  },
                  {
                    hook: 'onLogicGatePass',
                    status: 'SUCCESS',
                    color: 'text-emerald-600 bg-emerald-50',
                  },
                  {
                    hook: 'onVaultCommit',
                    status: 'PENDING',
                    color: 'text-[#09abb3] bg-cyan-50 animate-pulse',
                  },
                ].map(hook => (
                  <div
                    key={hook.hook}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white border border-cyan-50"
                  >
                    <div className="flex items-center gap-3">
                      <Terminal className="text-[#09abb3] w-4 h-4" />
                      <span className="text-slate-700 font-bold">{hook.hook}</span>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-black ${hook.color}`}
                    >
                      {hook.status === 'SUCCESS'
                        ? '成功'
                        : hook.status === 'PENDING'
                          ? '處理中'
                          : hook.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Encryption Ledger */}
            <div className="backdrop-blur-xl bg-white/60 rounded-3xl p-6 border border-cyan-100 shadow-xl">
              <h3 className="text-slate-900 text-lg font-black mb-6">數據加密帳本 (Ledger)</h3>
              <div className="grid grid-cols-4 gap-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className={`aspect-square rounded-2xl flex items-center justify-center border-2 transition-all ${i === 6 ? 'bg-rose-50 border-rose-100' : 'bg-cyan-50 border-cyan-100 hover:border-[#09abb3]/40'}`}
                  >
                    {i === 6 ? (
                      <AlertCircle className="text-rose-500 w-4 h-4" />
                    ) : (
                      <UserCheck className="text-[#09abb3] w-4 h-4" />
                    )}
                  </div>
                ))}
              </div>
              <p className="text-slate-400 text-[10px] mt-6 font-bold uppercase tracking-widest text-center">
                總分片數量: 12 正常運行 / 1 警報中 (Alert)
              </p>
            </div>

            {/* API Health */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-cyan-50 to-white rounded-3xl p-6 border border-cyan-100 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-slate-900 text-lg font-black">API 健康狀態</h3>
                <span
                  className={`${aiStatus === 'active' ? 'text-emerald-600' : 'text-rose-600'} text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded-full`}
                >
                  {aiStatus === 'active' ? '正常連線 (Active)' : aiStatus}
                </span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">REST v2.4</span>
                  <span className="text-emerald-500">4ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-[#09abb3] to-cyan-400 h-full rounded-full w-[95%]"></div>
                </div>
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-500">gRPC Core</span>
                  <span className="text-emerald-500">2ms</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                  <div className="bg-gradient-to-r from-[#09abb3] to-cyan-400 h-full rounded-full w-[98%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="backdrop-blur-xl bg-white/40 rounded-3xl overflow-hidden border border-cyan-100 shadow-2xl shadow-cyan-900/5">
          <div className="bg-cyan-50/50 px-8 py-4 border-b border-cyan-100 flex justify-between items-center">
            <span className="text-slate-900 text-xs font-black tracking-widest uppercase">
              系統安全紀錄日誌 (Security Logs)
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-[#09abb3] text-[10px] font-black border border-cyan-100 shadow-sm">
              即時更新已連線
            </span>
          </div>
          <div className="p-6 h-48 overflow-y-auto font-mono text-[11px] space-y-2 custom-scrollbar bg-slate-50/20">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-4 items-center">
                <span className="text-slate-400 text-[10px]">[{log.time}]</span>
                <span
                  className={`px-1.5 py-0.5 rounded text-[9px] font-black ${log.type === 'WARN'
                    ? 'text-rose-600 bg-rose-50'
                    : log.type === 'AUTH'
                      ? 'text-emerald-600 bg-emerald-50'
                      : 'text-[#09abb3] bg-cyan-50'
                    }`}
                >
                  {log.type}
                </span>
                <span className="text-slate-600 font-medium">{log.msg}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-[1440px] mx-auto mt-8 pb-12 px-10 text-center text-slate-500 text-xs font-mono">
        <Link to="/" className="hover:text-[#09abb3] transition-colors">
          返回儀表板 (Return to Dashboard)
        </Link>
        <span className="mx-4">|</span>
        <span>系統狀態一切正常 (Systems Nominal)</span>
        <span className="mx-4">|</span>
        <span>版本位階 Epoch 8.0.0</span>
      </footer>
    </div>
  );
};

export default SystemStatus;
