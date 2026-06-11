'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { OmniBaseCard } from '@/components/ui/omni/OmniBaseCard';
import { OmniBadge } from '@/components/ui/omni/OmniBadge';
import { 
  Map, Activity, LayoutGrid, Database, ShieldCheck, 
  Server, BrainCircuit, Wind, Network, ExternalLink, Zap
} from 'lucide-react';
import Link from 'next/link';

// Mock Data for the Global Route Map and Module Health Check
const SYSTEM_MODULES = [
  {
    id: 'core-platform',
    name: 'ESGGO Core Platform',
    icon: <LayoutGrid size={20} />,
    status: 'Healthy',
    ping: 12,
    routes: [
      { path: '/', name: 'Landing Page' },
      { path: '/omni-dashboard', name: 'Omni Dashboard' },
      { path: '/omni-blueprint', name: 'WIKI Blueprint' }
    ]
  },
  {
    id: 'omni-agent',
    name: 'OmniAgent Commander',
    icon: <BrainCircuit size={20} />,
    status: 'Healthy',
    ping: 45,
    routes: [
      { path: '/omni-pulse', name: 'Agent Pulse' },
      { path: '/omni-shards', name: 'Memory Shards' }
    ]
  },
  {
    id: 'zkp-vault',
    name: '5T ZKP Vault',
    icon: <ShieldCheck size={20} />,
    status: 'Healthy',
    ping: 8,
    routes: [
      { path: '/api/vault/seal', name: 'ZKP Seal API' },
      { path: '/api/vault/verify', name: 'ZKP Verify API' },
      { path: '/omni-gateway', name: 'Audit Gateway' }
    ]
  },
  {
    id: 'ncbdb',
    name: 'NCBDB Database',
    icon: <Database size={20} />,
    status: 'Warning',
    ping: 120,
    routes: [
      { path: '/api/supabase', name: 'RLS Connection' },
      { path: '/omni-table', name: 'Omni Table UI' }
    ]
  },
  {
    id: 'void-presence',
    name: 'Void-Presence Engine',
    icon: <Wind size={20} />,
    status: 'Healthy',
    ping: 2,
    routes: [
      { path: '/omni-design', name: 'Atomic Library' }
    ]
  }
];

export default function OmniMapPage() {
  const [activeModule, setActiveModule] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // Simulate network scan
  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-void-stark text-slate-200 p-4 md:p-8 selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none mix-blend-screen" />
      <div className="absolute inset-0 cyber-grid opacity-10 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 pb-6 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center border border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.15)] relative group">
              <div className="absolute inset-0 bg-cyan-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Map className="text-cyan-400 relative z-10" size={28} />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <OmniBadge variant="primary" size="sm" icon={<Network size={12}/>}>Global Map</OmniBadge>
                <span className="text-xs font-mono text-slate-500 uppercase tracking-widest">MAP-001</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">系統版圖與健康監控</h1>
              <p className="text-slate-400 font-mono text-sm tracking-widest uppercase mt-2">Global Route Map & Module Health</p>
            </div>
          </div>

          <button 
            onClick={handleScan}
            disabled={isScanning}
            className="px-5 py-2.5 bg-cyan-950/50 hover:bg-cyan-900/50 border border-cyan-700/50 rounded-xl text-sm font-semibold text-cyan-300 transition-all flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.1)]"
          >
            {isScanning ? (
              <Activity className="w-4 h-4 animate-spin text-cyan-400" />
            ) : (
              <Zap className="w-4 h-4 text-cyan-400" />
            )}
            {isScanning ? '掃描中 (Scanning)...' : '深度掃描 (Deep Scan)'}
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Network Map (Left, 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <OmniBaseCard variant="glass" className="p-1 h-full min-h-[500px] flex flex-col">
              <div className="p-4 border-b border-white/5 flex justify-between items-center bg-black/20 rounded-t-2xl">
                <h3 className="text-sm font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
                  <Network size={16} className="text-cyan-400" />
                  系統拓樸網路 (System Topology)
                </h3>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-mono text-emerald-400">連線正常</span>
                </div>
              </div>
              
              <div className="flex-1 p-6 relative overflow-hidden flex flex-wrap gap-6 items-center justify-center">
                {/* Visual Topology Map */}
                {SYSTEM_MODULES.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setActiveModule(activeModule === mod.id ? null : mod.id)}
                    className={`relative cursor-pointer p-6 rounded-2xl border-2 backdrop-blur-md transition-all duration-300 w-48 h-48 flex flex-col items-center justify-center text-center gap-3 ${
                      activeModule === mod.id 
                        ? 'bg-cyan-900/40 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.3)] z-10' 
                        : 'bg-black/40 border-cyan-900/50 hover:border-cyan-500/50 hover:bg-cyan-950/20 z-0'
                    }`}
                  >
                    <div className={`p-4 rounded-full ${
                      mod.status === 'Healthy' ? 'bg-emerald-500/10 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]' : 'bg-amber-500/10 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                    }`}>
                      {mod.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{mod.name}</h4>
                      <div className="mt-1 flex items-center justify-center gap-1 text-[10px] font-mono text-slate-500">
                        <Activity size={10} className={mod.status === 'Healthy' ? 'text-emerald-500' : 'text-amber-500'} />
                        {mod.ping}ms
                      </div>
                    </div>

                    {/* Connecting lines logic would go here in a real canvas implementation */}
                  </motion.div>
                ))}
              </div>
            </OmniBaseCard>
          </div>

          {/* Module Detail / Health Check (Right, 1 col) */}
          <div className="space-y-6">
            <AnimatePresence mode="wait">
              {activeModule ? (
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {SYSTEM_MODULES.filter(m => m.id === activeModule).map(mod => (
                    <OmniBaseCard key={mod.id} variant="glass" className="p-6 h-full flex flex-col">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-cyan-500/20 text-cyan-300 rounded-xl">
                          {mod.icon}
                        </div>
                        <div>
                          <h3 className="font-bold text-lg text-white">{mod.name}</h3>
                          <OmniBadge variant={mod.status === 'Healthy' ? 'success' : 'warning'} size="sm" className="mt-1">
                            {mod.status}
                          </OmniBadge>
                        </div>
                      </div>

                      <div className="space-y-4 flex-1">
                        <div className="p-3 bg-black/30 rounded-lg border border-white/5">
                          <div className="text-xs text-slate-500 mb-1">Latency (Ping)</div>
                          <div className="font-mono text-xl text-cyan-400">{mod.ping} ms</div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">可用路由 (Available Routes)</h4>
                          <div className="space-y-2">
                            {mod.routes.map((route, i) => (
                              <Link key={i} href={route.path} className="group flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-cyan-900/30 border border-transparent hover:border-cyan-500/30 transition-all">
                                <span className="text-sm font-medium text-slate-300 group-hover:text-cyan-200">{route.name}</span>
                                <ExternalLink size={14} className="text-slate-500 group-hover:text-cyan-400" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    </OmniBaseCard>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full"
                >
                  <OmniBaseCard variant="glass" className="p-6 h-full flex flex-col items-center justify-center text-center border-dashed">
                    <Network className="w-12 h-12 text-slate-600 mb-4" />
                    <h3 className="text-lg font-bold text-slate-400">未選擇模組</h3>
                    <p className="text-sm text-slate-500 mt-2">
                      點擊左側網路圖中的節點<br/>以查看詳細健康狀態與可用路由。
                    </p>
                  </OmniBaseCard>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </div>
    </div>
  );
}
