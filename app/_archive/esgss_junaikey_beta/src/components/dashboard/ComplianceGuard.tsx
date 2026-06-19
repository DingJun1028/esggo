import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Activity, RefreshCw, Hexagon, Zap } from 'lucide-react';

interface ComplianceLog {
  id: string;
  message: string;
  type: 'VIOLATION' | 'HEAL' | 'CALIBRATE';
  timestamp: number;
}

export const ComplianceGuard: React.FC = () => {
  const [status, setStatus] = useState<'SECURE' | 'HEALING' | 'VIOLATION'>('SECURE');
  const [logs, setLogs] = useState<ComplianceLog[]>([]);
  const [integrity, setIntegrity] = useState(98.5);

  useEffect(() => {
    // Simple polling for mock data / status
    const interval = setInterval(() => {
      fetch('/api/system/health')
        .then(res => res.json())
        .then(data => {
          if (data.status === 'success') {
            const isHealing = data.health.some(
              (s: any) => s.health === 'RECOVERING' || s.health === 'CRITICAL'
            );
            setStatus(isHealing ? 'HEALING' : 'SECURE');
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const addLog = (message: string, type: ComplianceLog['type']) => {
    const newLog = {
      id: Math.random().toString(36).substr(2, 9),
      message,
      type,
      timestamp: Date.now(),
    };
    setLogs(prev => [newLog, ...prev].slice(0, 5));
  };

  return (
    <div className="mt-8 bg-slate-950/40 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 pointer-events-none" />

      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div
              className={`absolute inset-0 blur-md opacity-20 ${status === 'SECURE' ? 'bg-emerald-400' : 'bg-amber-400'}`}
            />
            <ShieldCheck
              size={20}
              className={`relative ${status === 'SECURE' ? 'text-emerald-400' : 'text-amber-400'}`}
            />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">
            Autonomous Compliance <span className="text-slate-500">Guard</span>
          </span>
        </div>
        <div className="flex items-center gap-2.5 bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">
            Sentinel Active
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 p-8 gap-8">
        {/* Radar/Integrity Section */}
        <div className="relative aspect-square bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center justify-center overflow-hidden shadow-inner group/radar">
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(6,182,212,0.15),_transparent)]" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
              className="w-full h-full border-[0.5px] border-cyan-500/20 rounded-full flex items-center justify-center scale-90"
            >
              <div className="w-1/2 h-px bg-gradient-to-l from-cyan-400/60 to-transparent origin-right" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3/4 h-3/4 border border-white/5 rounded-full" />
              <div className="absolute w-1/2 h-1/2 border border-white/5 rounded-full" />
            </div>
          </div>

          <div className="z-10 text-center">
            <motion.div
              animate={
                status === 'HEALING'
                  ? { scale: [1, 1.15, 1], filter: 'drop-shadow(0 0 15px rgba(245,158,11,0.4))' }
                  : { scale: 1 }
              }
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              <Hexagon
                size={64}
                className={status === 'SECURE' ? 'text-cyan-400' : 'text-amber-400'}
                fill="currentColor"
                fillOpacity={0.05}
                strokeWidth={1}
              />
            </motion.div>
            <div className="mt-4">
              <div className="text-4xl font-black text-white tracking-tighter italic">
                {integrity}
                <span className="text-sm font-normal text-slate-500 ml-1">%</span>
              </div>
              <div className="text-[9px] uppercase tracking-[0.3em] text-cyan-500/50 font-black mt-1">
                System Integrity
              </div>
            </div>
          </div>
        </div>

        {/* Healing Sequence Log */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] uppercase font-black text-slate-500 tracking-[0.2em]">
              Healing Sequence Log
            </span>
            <div className="p-1.5 bg-blue-500/10 rounded-lg">
              <Zap size={12} className="text-blue-400" />
            </div>
          </div>
          <div className="flex-1 space-y-3 max-h-[220px] overflow-y-auto pr-3 custom-scrollbar">
            <AnimatePresence initial={false}>
              {logs.length === 0 ? (
                <div className="h-full flex items-center justify-center border-2 border-dashed border-white/5 rounded-2xl">
                  <div className="text-[10px] text-slate-600 font-black uppercase tracking-widest text-center">
                    No violations detected
                    <br />
                    <span className="text-[8px] font-normal lowercase opacity-50">
                      Current epoch is stable
                    </span>
                  </div>
                </div>
              ) : (
                logs.map(log => (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className={`p-3.5 rounded-2xl border flex gap-3 transition-all ${
                      log.type === 'VIOLATION'
                        ? 'bg-red-500/5 border-red-500/20 text-red-100'
                        : log.type === 'HEAL'
                          ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-100'
                          : 'bg-blue-500/5 border-blue-500/20 text-blue-100'
                    }`}
                  >
                    <div className="mt-1">
                      {log.type === 'VIOLATION' ? (
                        <ShieldAlert size={14} className="text-red-400" />
                      ) : (
                        <RefreshCw size={14} className="text-emerald-400 animate-spin-slow" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            log.type === 'VIOLATION'
                              ? 'bg-red-500 text-white'
                              : log.type === 'HEAL'
                                ? 'bg-emerald-500 text-slate-950'
                                : 'bg-blue-500 text-white'
                          }`}
                        >
                          {log.type}
                        </span>
                        <span className="text-[8px] text-slate-500 font-mono">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-[11px] font-medium leading-relaxed opacity-80">
                        {log.message}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
          <div className="mt-auto h-1.5 bg-slate-900 rounded-full overflow-hidden border border-white/5 shadow-inner">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
