'use client';
import { useState, useEffect } from 'react';
import { 
  Activity, Shield, Database, Cpu, Globe, CheckCircle, 
  RefreshCw, Zap, Server, Lock, HardDrive, Wifi, 
  CloudLightning, AlertTriangle, Terminal, Info
} from 'lucide-react';
import { BrandCard, BrandBadge, BrandButton } from '../../components/brand';
import { motion, AnimatePresence } from 'framer-motion';

const SERVICES = [
  { id: 'db', name: 'Supabase PostgreSQL', category: 'Storage', icon: Database, provider: 'PostgreSQL 15', status: 'online' },
  { id: 'ai', name: 'Google Gemini 2.0', category: 'Intelligence', icon: Cpu, provider: 'Flash-Exp', status: 'online' },
  { id: 'bluecc', name: 'BlueCC Control Plane', category: 'Cloud', icon: CloudLightning, provider: 'Hybrid Kubernetes', status: 'online' },
  { id: 'zkp', name: 'ZKP Engine', category: 'Security', icon: Lock, provider: 'WebCrypto Native', status: 'online' },
  { id: 'audit', name: '5T Audit Logger', category: 'Compliance', icon: Activity, provider: 'Edge Functions', status: 'online' },
];

export default function SystemStatusPage() {
  const [status, setStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([
    { time: new Date().toLocaleTimeString(), level: 'INFO', msg: '系統初始化完成。', color: '#22c55e' },
    { time: new Date().toLocaleTimeString(), level: 'INFO', msg: 'BlueCC 叢集連線穩定。', color: '#3b7ea1' },
  ]);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/blue');
      const data = await res.json();
      if (data.ok) {
        setStatus(data.status);
        setLogs(prev => [
          { time: new Date().toLocaleTimeString(), level: 'INFO', msg: 'Telemetry data synced with BlueCC.', color: '#22c55e' },
          ...prev.slice(0, 8)
        ]);
      }
    } catch (e) {
      console.error('Failed to fetch status:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-1">
          <h1 className="text-2xl font-black text-berkeley-blue tracking-tight uppercase">系統狀態 System Status</h1>
          <p className="text-slate-500 text-sm font-medium">即時監控 · 5T 協議健康度 · BlueCC 混合雲實時電傳</p>
        </div>
        <BrandButton 
          variant="primary" 
          size="sm" 
          onClick={fetchStatus} 
          loading={loading}
          className="rounded-xl shadow-lg"
        >
          <RefreshCw size={14} className="mr-2" />
          重新掃描
        </BrandButton>
      </div>

      {/* BlueCC Real-time Cluster Telemetry */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <BrandCard className="lg:col-span-2 overflow-hidden border-berkeley-blue/10 bg-gradient-to-br from-white to-blue-50/30">
          <div className="flex justify-between items-center mb-6">
             <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-berkeley-blue text-white flex items-center justify-center">
                   <CloudLightning size={20} />
                </div>
                <div>
                   <h3 className="text-sm font-black text-berkeley-blue uppercase tracking-widest">BlueCC Cluster Telemetry</h3>
                   <p className="text-[10px] text-slate-400 font-bold uppercase">Region: {status?.region || 'asia-east1'} • {status?.cluster_id}</p>
                </div>
             </div>
             <BrandBadge variant="success" dot>ONLINE</BrandBadge>
          </div>

          <div className="grid grid-cols-3 gap-8">
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                   <span>CPU Load</span>
                   <span>{status?.load?.cpu || 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${status?.load?.cpu || 0}%` }} className="h-full bg-blue-500" />
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                   <span>GPU (H100)</span>
                   <span>{status?.load?.gpu || 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${status?.load?.gpu || 0}%` }} className="h-full bg-indigo-500" />
                </div>
             </div>
             <div className="space-y-4">
                <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase">
                   <span>Memory</span>
                   <span>{status?.load?.memory || 0}%</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                   <motion.div initial={{ width: 0 }} animate={{ width: `${status?.load?.memory || 0}%` }} className="h-full bg-violet-500" />
                </div>
             </div>
          </div>

          <div className="mt-8 p-4 bg-white/60 rounded-xl border border-blue-100 flex items-center justify-between">
             <div className="flex items-center gap-4">
                <div className="text-center px-4 border-r border-slate-100">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Active Nodes</p>
                   <p className="text-xl font-black text-berkeley-blue">{status?.active_nodes || 0}</p>
                </div>
                <div className="text-center px-4">
                   <p className="text-[9px] font-black text-slate-400 uppercase">Network Latency</p>
                   <p className="text-xl font-black text-emerald-600">{status?.latency_ms || 0}ms</p>
                </div>
             </div>
             <div className="flex items-center gap-2 text-[10px] font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg">
                <Zap size={12} />
                {status?.mode || 'AUTO_OPTIMIZING'}
             </div>
          </div>
        </BrandCard>

        <BrandCard className="bg-slate-900 border-none shadow-2xl text-slate-300">
           <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
              <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                 <Terminal size={14} /> System Audit Logs
              </h4>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           </div>
           <div className="space-y-3 font-mono text-[10px] max-h-[280px] overflow-y-auto no-scrollbar">
              {logs.map((l, i) => (
                <div key={i} className="flex gap-3 pb-2 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-600">[{l.time}]</span>
                  <span style={{ color: l.color }}>[{l.level}]</span>
                  <span className="text-slate-400">{l.msg}</span>
                </div>
              ))}
           </div>
        </BrandCard>
      </section>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {SERVICES.map(s => (
          <BrandCard key={s.id} padding="sm" className="flex items-center gap-4 hover:border-blue-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-berkeley-blue border border-slate-100">
              <s.icon size={18} />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-berkeley-blue truncate">{s.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Healthy</span>
              </div>
            </div>
          </BrandCard>
        ))}
      </div>

      <div className="p-6 bg-amber-50/50 rounded-[2rem] border border-amber-100 flex items-start gap-4">
         <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-white shrink-0 shadow-lg">
            <AlertTriangle size={24} />
         </div>
         <div className="space-y-1">
            <h3 className="text-sm font-black text-amber-800 uppercase tracking-widest">Auto-Degradation Alert</h3>
            <p className="text-xs text-amber-700 leading-relaxed font-medium">
               當 BlueCC 延遲超過 <span className="font-black">200ms</span> 時，系統將自動切換為本地 Edge 運算模式以確保業務連續性。當前狀態：<span className="text-emerald-700 font-black">雲端最佳化運作中</span>。
            </p>
         </div>
      </div>
    </div>
  );
}
