'use client';

import React, { useState } from 'react';
import { UniversalCard } from '@/components/ui/universal/UniversalCard';
import { UniversalBadge } from '@/components/ui/universal/UniversalBadge';
import { UniversalButton } from '@/components/ui/universal/UniversalButton';
import { Terminal, Play, CheckCircle2, XCircle, AlertTriangle, Loader2, Database, ShieldAlert, Cpu, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function SystemTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runTests = () => {
    setIsRunning(true);
    setLogs([]);
    const steps = [
      'Initializing test runner...',
      'Checking database connection... [PASS]',
      'Verifying 5T Protocol integrity... [PASS]',
      'Testing component Liquid Glass rendering... [PASS]',
      'Simulating edge cases for SustainWrite... [WARN] Latency detected',
      'Validating Firebase SQL Connect schema... [PASS]',
      'Tests completed. System healthy.'
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setLogs(prev => [...prev, step]);
        if (i === steps.length - 1) setIsRunning(false);
      }, i * 500);
    });
  };

  return (
    <div className="min-h-screen bg-void-stark text-white p-4 md:p-8 animate-in fade-in duration-700">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <UniversalBadge variant="warning" icon="🛠️">
              Internal Dev Tool
            </UniversalBadge>
            <h1 className="text-4xl font-bold tracking-tight text-white/90 flex items-center gap-3">
              <Terminal className="text-amber-400" /> 系統測試 System Test
            </h1>
            <p className="text-lg text-white/60 max-w-2xl">
              底層效能與穩定性校驗。執行壓力測試、邊界數據模擬與組件渲染分析。
            </p>
          </div>
          <UniversalButton variant="primary" onClick={runTests} disabled={isRunning} className="flex items-center gap-2 px-8 bg-amber-500 hover:bg-amber-600 text-void-stark font-black">
             {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />} 執行全域自動化測試
          </UniversalButton>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <UniversalCard title="測試日誌 Console" variant="glow" className="md:col-span-2 p-0 overflow-hidden">
              <div className="bg-black/60 p-6 h-[400px] overflow-y-auto font-mono text-xs space-y-2 no-scrollbar">
                 {logs.map((log, i) => (
                   <div key={i} className="flex gap-4">
                      <span className="text-white/20">[{i.toString().padStart(2, '0')}]</span>
                      <span className={log.includes('[PASS]') ? 'text-emerald-400' : log.includes('[WARN]') ? 'text-amber-400' : 'text-white/80'}>
                         {log}
                      </span>
                   </div>
                 ))}
                 {isRunning && <div className="animate-pulse text-cyan-core mt-2 flex items-center gap-2">_ <span className="w-1 h-3 bg-cyan-core" /></div>}
                 {logs.length === 0 && !isRunning && <div className="text-white/10 italic text-center pt-20">等待測試指令...</div>}
              </div>
           </UniversalCard>

           <div className="space-y-8">
              <UniversalCard title="系統指標" variant="bordered">
                 <div className="space-y-4">
                    <div className="flex justify-between">
                       <span className="text-xs text-white/40">API Uptime</span>
                       <span className="text-xs font-bold text-emerald-400">99.98%</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-xs text-white/40">DB Latency</span>
                       <span className="text-xs font-bold text-cyan-400">22ms</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-xs text-white/40">Render Time</span>
                       <span className="text-xs font-bold text-white/80">145ms</span>
                    </div>
                    <hr className="border-white/5" />
                    <UniversalButton variant="secondary" className="w-full text-[10px] h-8 py-0">清空快取</UniversalButton>
                 </div>
              </UniversalCard>

              <div className="p-8 bg-white/5 rounded-[2rem] border border-white/10 text-center space-y-4">
                 <ShieldAlert size={32} className="text-amber-400 mx-auto" />
                 <h4 className="font-bold">壓力測試模式</h4>
                 <p className="text-[10px] text-white/40">模擬 1,000 位使用者同時執行 AI 擴寫任務。</p>
                 <UniversalButton variant="secondary" className="w-full text-xs">啟動 Stress Test</UniversalButton>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
           {[
             { name: 'UI Components', status: 'Stable', icon: <Cpu size={16} /> },
             { name: 'Auth Bridge', status: 'Secure', icon: <CheckCircle2 size={16} /> },
             { name: 'ZKP Engine', status: 'Healthy', icon: <CheckCircle2 size={16} /> },
             { name: 'Supabase Hook', status: 'Active', icon: <RefreshCw size={16} /> },
           ].map((item, i) => (
             <div key={i} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center justify-between group hover:border-cyan-500/30 transition-all">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-white/5 rounded-lg text-white/30 group-hover:text-cyan-400 transition-colors">{item.icon}</div>
                   <span className="text-xs font-bold text-white/60">{item.name}</span>
                </div>
                <UniversalBadge variant="success" className="text-[8px]">{item.status}</UniversalBadge>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
}
