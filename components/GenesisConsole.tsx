'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, Shield, Zap, Activity, Layers, 
  Cpu, MessageSquare, ChevronRight, Play, 
  Pause, RefreshCw, Lock, Globe, Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { BrandStatusDot } from '@/components/brand';

interface LogEntry {
  id: string;
  agent: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'command';
  timestamp: string;
}

export default function GenesisConsole() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLive, setIsLive] = useState(true);
  const [systemHealth, setSystemHealth] = useState(98);
  const [activeMissions, setActiveActiveMissions] = useState(1);

  // Simulate real-time logs from Hermes Bus
  useEffect(() => {
    if (!isLive) return;

    const agents = ['OmniAgent', 'Agent0', 'ESG_Researcher', 'ESG_Auditor', 'Hermes'];
    const messages = [
      'Synchronizing Data Connect truth layers...',
      'Verifying T4 HashLock integrity...',
      'Mapping GRI 302-1 energy metrics...',
      'Publishing event: MISSION_CRITICAL_UPDATE',
      'Agent0 executing low-level DB optimization...',
      'Supreme Commander issuing Genesis Scan command...',
      '5T Protocol Gate: T1 Traceable - PASS',
    ];

    const interval = setInterval(() => {
      const newLog: LogEntry = {
        id: Math.random().toString(36).slice(2, 9),
        agent: agents[Math.floor(Math.random() * agents.length)],
        message: messages[Math.floor(Math.random() * messages.length)],
        type: Math.random() > 0.8 ? 'command' : 'info',
        timestamp: new Date().toLocaleTimeString(),
      };

      setLogs(prev => [newLog, ...prev].slice(0, 50));
      setSystemHealth(h => Math.min(100, Math.max(95, h + (Math.random() - 0.5))));
    }, 2000);

    return () => clearInterval(interval);
  }, [isLive]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-mono p-8 selection:bg-cyan-500/30">
      {/* HUD Header */}
      <header className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Layers size={24} />
          </div>
          <div>
            <h1 className="text-xl font-black text-white tracking-tighter uppercase flex items-center gap-3">
              Genesis Command Console <Badge variant="outline" className="bg-cyan-500/5 text-cyan-400 border-cyan-500/30">v1.0-Alpha</Badge>
            </h1>
            <div className="flex items-center gap-4 mt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <BrandStatusDot status="active" size="sm" pulse /> System Online
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Activity size={10} className="text-emerald-500" /> Health: {systemHealth.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setIsLive(!isLive)}
            className={cn("border border-white/5 rounded-lg text-[10px] font-black uppercase tracking-wider", isLive ? "text-cyan-400" : "text-slate-500")}
          >
            {isLive ? <Pause size={12} className="mr-2" /> : <Play size={12} className="mr-2" />}
            {isLive ? 'Live Feed' : 'Paused'}
          </Button>
          <Button variant="primary" size="sm" className="bg-cyan-600 hover:bg-cyan-500 rounded-lg text-[10px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Zap size={12} className="mr-2" /> Force Recalibrate
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-180px)]">
        {/* Swarm Status */}
        <aside className="col-span-3 space-y-6 overflow-y-auto pr-2">
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                <Cpu size={14} className="text-cyan-400" /> Agent Swarm
              </span>
              <span className="text-[10px] font-bold text-cyan-400/60">4 Active</span>
            </div>
            <CardContent className="p-4 space-y-4">
              {['OmniAgent', 'Agent0', 'ESG_Researcher', 'ESG_Auditor'].map((name, i) => (
                <div key={name} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/5 group hover:border-cyan-500/30 transition-all cursor-crosshair">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-2 h-2 rounded-full", i === 0 ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400')} />
                    <span className="text-[11px] font-bold text-slate-200">{name}</span>
                  </div>
                  <Badge variant="outline" className="text-[8px] opacity-40 group-hover:opacity-100 transition-opacity">
                    {i === 0 ? 'Commander' : 'Executor'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-emerald-400">
                <Shield size={14} /> 5T Integrity Gate
              </span>
            </div>
            <CardContent className="p-4 space-y-2">
              {['T1 Traceable', 'T2 Transparent', 'T3 Tangible', 'T4 Trustworthy', 'T5 Trackable'].map((gate, i) => (
                <div key={gate} className="flex items-center justify-between py-2 border-b border-white/[0.03] last:border-0">
                  <span className="text-[10px] font-bold text-slate-400">{gate}</span>
                  <div className="flex gap-1">
                    {[1,2,3,4].map(dot => (
                      <div key={dot} className={cn("w-1 h-3 rounded-full", dot <= (4-i) ? 'bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,0.5)]' : 'bg-white/10')} />
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </aside>

        {/* Real-time Terminal */}
        <main className="col-span-6 flex flex-col bg-black/40 border border-white/5 rounded-3xl overflow-hidden shadow-2xl relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
          
          <div className="p-5 bg-white/5 border-b border-white/5 flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Terminal size={18} className="text-cyan-400" />
              <span className="text-xs font-black uppercase tracking-[0.2em] text-white">Supreme Command Stream</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[9px] font-black text-red-500 uppercase tracking-tighter">Recording Truth</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
            <AnimatePresence initial={false}>
              {logs.map((log) => (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-4 group"
                >
                  <span className="text-[10px] text-slate-600 font-mono shrink-0 pt-0.5">[{log.timestamp}]</span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "text-[10px] font-black uppercase px-1.5 py-0.5 rounded",
                        log.agent === 'OmniAgent' ? 'bg-cyan-500/10 text-cyan-400' : 'bg-white/5 text-slate-400'
                      )}>
                        {log.agent}
                      </span>
                      {log.type === 'command' && <Zap size={10} className="text-amber-400 animate-pulse" />}
                    </div>
                    <p className={cn(
                      "text-xs leading-relaxed",
                      log.type === 'command' ? 'text-white font-black' : 'text-slate-300'
                    )}>
                      {log.message}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="p-4 bg-white/5 border-t border-white/5 flex items-center gap-4 z-10">
            <ChevronRight size={16} className="text-cyan-400 animate-pulse" />
            <input 
              type="text" 
              placeholder="Direct command to Supreme Commander..."
              className="bg-transparent border-none outline-none text-xs text-white placeholder:text-slate-600 w-full font-bold"
            />
          </div>
        </main>

        {/* Global Insight Layer */}
        <aside className="col-span-3 space-y-6 overflow-y-auto pl-2">
          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-2xl overflow-hidden">
            <div className="p-4 bg-white/5 border-b border-white/5">
              <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-amber-400">
                <Database size={14} /> Data Connect Sync
              </span>
            </div>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <svg className="w-32 h-32 rotate-[-90deg]">
                  <circle cx="64" cy="64" r="60" className="fill-none stroke-white/5" strokeWidth="8" />
                  <circle 
                    cx="64" cy="64" r="60" 
                    className="fill-none stroke-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.5)]" 
                    strokeWidth="8" 
                    strokeDasharray={377}
                    strokeDashoffset={377 * (1 - 0.92)}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-2xl font-black text-white">92%</span>
                  <span className="text-[8px] text-slate-500 uppercase font-black">Coherency</span>
                </div>
              </div>
              <p className="text-[9px] text-slate-500 mt-4 leading-relaxed">
                Relational layers optimized. <br/> Cross-tenant isolation active.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/[0.02] border-white/5 backdrop-blur-3xl rounded-2xl overflow-hidden border-cyan-500/20">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-cyan-400" />
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Global ESG Node</span>
              </div>
              <div className="h-24 bg-cyan-500/5 rounded-xl border border-cyan-500/10 flex items-center justify-center">
                <RefreshCw size={24} className="text-cyan-500/40 animate-spin" />
              </div>
              <p className="text-[10px] font-bold text-slate-400 italic">
                "Autonomous decision engine is predicting 14% compliance improvement by Q3."
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Footer Meta */}
      <footer className="mt-8 flex justify-between items-end border-t border-white/5 pt-6 opacity-40 hover:opacity-100 transition-opacity">
        <div className="text-[9px] font-black text-slate-600 uppercase tracking-[0.4em]">
          OmniCore P0 Genesis Infrastructure // Secure Hash: {Math.random().toString(16).slice(2, 10)}
        </div>
        <div className="flex gap-6">
          <div className="text-right">
            <p className="text-[8px] text-slate-600 uppercase font-black">Hermes Bus Latency</p>
            <p className="text-[10px] text-cyan-400 font-bold">1.2ms</p>
          </div>
          <div className="text-right border-l border-white/10 pl-6">
            <p className="text-[8px] text-slate-600 uppercase font-black">Truth Records Sealed</p>
            <p className="text-[10px] text-emerald-400 font-bold">4.2M</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
