'use client';

import React, { useState, useEffect } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Activity, Server, Database, Globe, ShieldCheck, RefreshCw, Cpu, HardDrive, Wifi, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

const SERVICES = [
  { id: 'api-core', name: 'OmniCore API', status: 'Healthy', uptime: '99.99%', latency: '22ms' },
  { id: 'db-supabase', name: 'Supabase Matrix', status: 'Healthy', uptime: '100%', latency: '15ms' },
  { id: 'ai-gateway', name: 'Agent Gateway', status: 'Healthy', uptime: '99.95%', latency: '120ms' },
  { id: 'storage-vault', name: 'Evidence Storage', status: 'Degraded', uptime: '98.4%', latency: '450ms' },
];

export default function SystemStatusPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshStatus = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-7xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="success" icon="🟢">
              VIII. 系統維護與品質
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Activity className="text-cyan-core" /> 系統狀態 System Status
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              底層基礎設施監控。實時觀察資料庫、AI 網關與 5T 封印引擎的健康度與延遲指標。
            </p>
          </div>
          <div className="flex gap-3">
             <UniversalButton variant="secondary" onClick={refreshStatus} className="flex items-center gap-2">
                <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} /> 重新掃描
             </UniversalButton>
          </div>
        </header>

        {/* Global Health Hero */}
        <div className="p-10 bg-emerald-500/10 border border-emerald-500/20 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="flex items-center gap-8">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-4 border-emerald-500/40 flex items-center justify-center text-emerald-400 shadow-[0_0_40px_rgba(16,185,129,0.3)] animate-pulse">
                 <ShieldCheck size={48} />
              </div>
              <div className="space-y-1">
                 <h2 className="text-3xl font-black text-white">All Systems Operational</h2>
                 <p className="text-emerald-400 font-bold uppercase tracking-widest text-xs">目前無已知重大故障發生</p>
              </div>
           </div>
           <div className="flex gap-4">
              <div className="text-center px-6 py-3 bg-black/40 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Global Uptime</p>
                 <p className="text-xl font-black text-white">99.98%</p>
              </div>
              <div className="text-center px-6 py-3 bg-black/40 rounded-2xl border border-white/5">
                 <p className="text-[10px] font-black uppercase text-white/30 tracking-widest mb-1">Incident Free</p>
                 <p className="text-xl font-black text-white">12 Days</p>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <div className="lg:col-span-2 space-y-6">
              <UniversalCard title="核心服務狀態 Services" variant="glow" className="p-0 overflow-hidden">
                 <div className="divide-y divide-white/5">
                    {SERVICES.map((s) => (
                      <div key={s.id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all">
                         <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl border ${s.status === 'Healthy' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-rose-500/10 border-rose-500/30 text-rose-400'}`}>
                               {s.id.includes('db') ? <Database size={20} /> : s.id.includes('ai') ? <Cpu size={20} /> : <Server size={20} />}
                            </div>
                            <div>
                               <h4 className="font-bold text-white/90">{s.name}</h4>
                               <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest">{s.id} • Uptime: {s.uptime}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-6">
                            <div className="text-right hidden md:block">
                               <p className="text-[10px] font-black text-white/20">Latency</p>
                               <p className={`text-sm font-mono font-bold ${s.latency.includes('ms') && parseInt(s.latency) < 100 ? 'text-emerald-400' : 'text-amber-400'}`}>{s.latency}</p>
                            </div>
                            <UniversalBadge variant={s.status === 'Healthy' ? 'success' : 'danger'}>{s.status}</UniversalBadge>
                         </div>
                      </div>
                    ))}
                 </div>
              </UniversalCard>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {[
                   { label: 'CPU Usage', val: '12%', icon: <Cpu size={16} /> },
                   { label: 'RAM Usage', val: '42%', icon: <HardDrive size={16} /> },
                   { label: 'Network', val: 'Strong', icon: <Wifi size={16} /> },
                 ].map((stat, i) => (
                   <div key={i} className="p-6 bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center text-center space-y-2 group hover:border-cyan-500/30 transition-all">
                      <div className="p-3 bg-white/5 rounded-xl text-white/20 group-hover:text-cyan-400 transition-colors">{stat.icon}</div>
                      <p className="text-[10px] font-black uppercase text-white/30 tracking-widest">{stat.label}</p>
                      <p className="text-xl font-black text-white">{stat.val}</p>
                   </div>
                 ))}
              </div>
           </div>

           <div className="space-y-8">
              <UniversalCard title="安全確信地圖 Security" variant="bordered">
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <Lock size={20} className="text-cyan-core" />
                       <p className="text-sm font-bold">SHA-256 Hash Lock</p>
                       <UniversalBadge variant="success" className="ml-auto">Active</UniversalBadge>
                    </div>
                    <div className="flex items-center gap-4">
                       <ShieldCheck size={20} className="text-cyan-core" />
                       <p className="text-sm font-bold">ZKP Zero-Knowledge</p>
                       <UniversalBadge variant="success" className="ml-auto">Active</UniversalBadge>
                    </div>
                    <div className="flex items-center gap-4 opacity-40">
                       <Globe size={20} />
                       <p className="text-sm font-bold">Cross-Region Sync</p>
                       <UniversalBadge variant="secondary" className="ml-auto">Standby</UniversalBadge>
                    </div>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-white/5 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-core/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <h4 className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-4">Last Major Deployment</h4>
                 <p className="text-lg font-black text-white/90">OmniCore v8.5.1-Alpha</p>
                 <p className="text-xs font-mono text-cyan-core/60 mt-2 tracking-widest">COMMIT_ID: 77475ab...</p>
                 <UniversalButton variant="secondary" className="w-full mt-8 text-xs">View Changelog</UniversalButton>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
