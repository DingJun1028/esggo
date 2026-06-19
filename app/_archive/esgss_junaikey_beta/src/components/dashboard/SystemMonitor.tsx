import React, { memo, useMemo, useCallback, useState, useEffect } from 'react';
import { Card, Button, Progress, Badge } from '@/components/ui';
import {
  Activity,
  Cpu,
  Server,
  ShieldCheck,
  ShieldAlert,
  Sparkles,
  Terminal,
  RefreshCw,
  Zap,
  Bug,
  Network,
} from 'lucide-react';
import { useCoreSystem } from '@/hooks/useCoreSystem';
import { useTheme } from '@/contexts/ThemeContext';

// ==================== CONSTANTS ====================
const ISSUE_TRANSLATIONS: Record<string, string> = {
  'High CPU Usage': '高 CPU 使用率警告',
  'High Memory Usage': '高記憶體使用率警告',
  'Network Latency High': '網絡延遲過高',
  'System Entropy Critical': '系統熵值危急',
};

const ENTROPY_THRESHOLD = 50;

// ==================== SUB-COMPONENTS ====================
const HolographicMetric = memo<{
  label: string;
  value: string;
  icon: React.ElementType;
  color: string;
}>(({ label, value, icon: Icon, color }) => {
  const { style } = useTheme();
  return (
    <div
      className={`relative p-4 rounded-xl border flex flex-col items-center justify-center overflow-hidden group ${
        style === 'glass'
          ? 'bg-black/40 border-white/10'
          : 'bg-white/5 border-white/10 hover:border-blue-500/30'
      }`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br from-transparent to-${color}-500/10 opacity-0 group-hover:opacity-100 transition-opacity`}
      />
      <div className={`p-3 rounded-full bg-${color}-500/10 mb-2 relative z-10`}>
        <Icon className={`w-6 h-6 text-${color}-400`} />
      </div>
      <span className="text-xs text-gray-400 uppercase tracking-widest relative z-10">{label}</span>
      <span className={`text-2xl font-mono font-bold text-${color}-400 relative z-10`}>
        {value}
      </span>
      <div
        className={`absolute bottom-0 left-0 h-1 bg-${color}-500 transition-all duration-1000`}
        style={{ width: value.includes('%') ? value : '100%' }}
      />
    </div>
  );
});

const ConsoleLog = memo<{ logs: string[] }>(({ logs }) => {
  return (
    <div className="bg-black/80 font-mono text-xs p-4 rounded-xl border border-white/10 h-full overflow-y-auto custom-scrollbar shadow-inner">
      {logs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-gray-600 gap-2">
          <Terminal size={24} />
          <span>NO ANOMALIES DETECTED</span>
        </div>
      ) : (
        <ul className="space-y-1">
          {logs.map((log, i) => (
            <li key={i} className="flex gap-2 text-green-400/80">
              <span className="text-gray-600">[{new Date().toLocaleTimeString()}]</span>
              <span>{log}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
});

// ==================== MAIN COMPONENT ====================
export const SystemMonitor = memo(() => {
  const { health, actions } = useCoreSystem();
  const { style } = useTheme();
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanning, setIsScanning] = useState(false);

  const handleDeepScan = useCallback(() => {
    setIsScanning(true);
    actions.triggerRescan();
    // Simulate visual scan progress
    let p = 0;
    const interval = setInterval(() => {
      p += 5;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setIsScanning(false);
        setScanProgress(0);
      }
    }, 100);
  }, [actions]);

  const metrics = useMemo(() => {
    if (!health) return null;
    const isHealthy = health.status === 'healthy';
    const entropyPercent = health.entropy * 100;
    return {
      isHealthy,
      entropyPercent,
      entropyColor: entropyPercent > ENTROPY_THRESHOLD ? 'rose' : 'emerald',
      cpu: health.resources.cpu,
      memory: health.resources.memory,
      uptime: '99.99%', // Simulation
      latency: '14ms', // Simulation
    };
  }, [health]);

  if (!metrics)
    return (
      <div className="p-8 text-center text-gray-500 animate-pulse">
        Initializing Holographic Link...
      </div>
    );

  const containerClass =
    style === 'glass'
      ? 'liquid-glass bg-black/40 backdrop-blur-md border-white/10'
      : 'minimalist-optics bg-white/5 border-white/10';

  return (
    <div className="h-full w-full p-4 grid grid-cols-12 gap-4 auto-rows-min overflow-hidden">
      {/* Header Status Bar (Top) */}
      <div
        className={`col-span-12 ${containerClass} rounded-2xl p-4 flex items-center justify-between`}
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
            <Activity className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">SYSTEM MONITOR</h1>
            <p className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
              CORE VERSION 6.0{' '}
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div
            className={`px-4 py-2 rounded-lg border flex items-center gap-2 ${
              metrics.isHealthy
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {metrics.isHealthy ? <ShieldCheck size={18} /> : <ShieldAlert size={18} />}
            <span className="text-xs font-bold uppercase">
              {metrics.isHealthy ? 'SYSTEM SECURE' : 'SECURITY ALERT'}
            </span>
          </div>
        </div>
      </div>

      {/* Metrics Grid (Middle Left) */}
      <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        <HolographicMetric label="CPU LOAD" value={`${metrics.cpu}%`} icon={Cpu} color="cyan" />
        <HolographicMetric
          label="MEMORY"
          value={`${metrics.memory}%`}
          icon={Server}
          color="purple"
        />
        <HolographicMetric
          label="ENTROPY"
          value={`${metrics.entropyPercent.toFixed(1)}%`}
          icon={Sparkles}
          color={metrics.entropyColor}
        />
        <HolographicMetric label="LATENCY" value={metrics.latency} icon={Network} color="indigo" />
      </div>

      {/* Action Panel (Middle Right) */}
      <div
        className={`col-span-12 lg:col-span-4 ${containerClass} rounded-2xl p-6 flex flex-col justify-center gap-4`}
      >
        <div className="flex justify-between items-center text-xs font-bold uppercase text-gray-400">
          <span>Diagnostic Routines</span>
          {isScanning && <span className="text-cyan-400 animate-pulse">Running...</span>}
        </div>

        <Button
          onClick={handleDeepScan}
          disabled={isScanning}
          className="w-full h-12 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center gap-2 group"
        >
          <RefreshCw className={`w-5 h-5 ${isScanning ? 'animate-spin' : ''}`} />
          DEEP SYSTEM SCAN
        </Button>

        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-500 uppercase">
            <span>Scan Integrity</span>
            <span>{scanProgress}%</span>
          </div>
          <Progress
            value={scanProgress}
            className="h-1 bg-white/5"
            indicatorClassName="bg-cyan-400 shadow-[0_0_10px_cyan]"
          />
        </div>
      </div>

      {/* Console / Logs (Bottom) */}
      <div
        className={`col-span-12 ${containerClass} rounded-2xl p-1 overflow-hidden h-48 lg:h-auto lg:flex-1 min-h-[200px]`}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-black/20 border-b border-white/5">
          <Terminal size={14} className="text-gray-500" />
          <span className="text-xs font-mono text-gray-400">SYSTEM_LOGS_STREAM</span>
        </div>
        <ConsoleLog logs={health?.issues?.map(i => ISSUE_TRANSLATIONS[i] || i) || []} />
      </div>
    </div>
  );
});
SystemMonitor.displayName = 'SystemMonitor';
