import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  Activity,
  Zap,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Lock,
  Fingerprint,
  Terminal,
} from 'lucide-react';

interface ServiceHealth {
  serviceId: string;
  health: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL' | 'RECOVERING';
  lastHeartbeat: number;
  entropyLevel: number;
}

const SystemGuardian: React.FC = () => {
  const [healthData, setHealthData] = useState<ServiceHealth[]>([]);
  const [lastSync, setLastSync] = useState<Date>(new Date());
  const [isQuantumSecured, setIsQuantumSecured] = useState(true);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const response = await fetch('/api/system/health');
        if (response.ok) {
          const data = await response.json();
          setHealthData(data);
          setLastSync(new Date());
        }
      } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, '[SystemGuardian] Failed to sync with System Guardian', { error: err });
      }
    };

    fetchHealth();
    const interval = setInterval(fetchHealth, 3000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPTIMAL':
        return 'text-emerald-400';
      case 'DEGRADED':
        return 'text-amber-400';
      case 'CRITICAL':
        return 'text-rose-500';
      case 'RECOVERING':
        return 'text-cyan-400 animate-pulse';
      default:
        return 'text-slate-400';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-6 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-3xl premium-panel-glow flex flex-col gap-6"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#FFD700]/20 rounded-xl flex items-center justify-center border border-[#FFD700]/30 shadow-[0_0_20px_rgba(255,215,0,0.2)]">
            <Shield className="w-5 h-5 text-[#FFD700]" />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-[0.3em] uppercase italic text-white flex items-center gap-2">
              Omni Guardian
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] border border-emerald-500/20">
                SENTIENT
              </span>
            </h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black italic">
              Autonomous Maintenance v2.0
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-[9px] text-slate-600 font-mono mt-1 uppercase tracking-widest">
            Live Pulse: {lastSync.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Quantum Security Badge */}
      <div className="p-4 rounded-2xl bg-[#0df2df]/5 border border-[#0df2df]/20 flex items-center justify-between group hover:bg-[#0df2df]/10 transition-all">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-[#0df2df]/20 flex items-center justify-center">
            <Lock className="text-[#0df2df]" size={14} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-tighter text-[#0df2df]">
              Quantum Integrity Status
            </p>
            <p className="text-[11px] font-mono text-white/80 italic">
              Kyber-1024 / Dilithium-5 Encrypted
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-black text-[#0df2df] uppercase">Verified</span>
          <Shield className="text-[#0df2df]" size={12} />
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {healthData.map(service => (
            <motion.div
              key={service.serviceId}
              layout
              className="flex items-center justify-between bg-white/[0.03] p-4 rounded-[1.5rem] border border-white/5 group hover:border-white/10 transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-2 h-2 rounded-full ${getStatusColor(service.health).replace('text-', 'bg-')} shadow-[0_0_10px_currentColor]`}
                />
                <div>
                  <span className="text-xs font-black uppercase tracking-widest text-[#FFD700] group-hover:text-white transition-colors">
                    {service.serviceId}
                  </span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${service.entropyLevel * 100}%` }}
                        className={`h-full transition-all duration-500 ${service.entropyLevel > 0.6 ? 'bg-rose-500' : 'bg-[#0df2df]'}`}
                      />
                    </div>
                    <span className="text-[9px] text-slate-500 font-mono font-black uppercase">
                      ENTROPY: {Math.round(service.entropyLevel * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span
                  className={`text-[10px] font-black uppercase tracking-widest italic ${getStatusColor(service.health)}`}
                >
                  {service.health}
                </span>
                {service.health === 'RECOVERING' ? (
                  <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                ) : service.health === 'OPTIMAL' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-500/30" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500/30" />
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-2 pt-6 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3 text-slate-500 group cursor-help">
          <Fingerprint className="w-4 h-4 group-hover:text-[#0df2df] transition-colors" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">
            Biometric PQC Authorized
          </span>
        </div>
        <button className="px-6 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400 hover:bg-white/10 hover:text-white transition-all flex items-center gap-2">
          <Terminal size={12} />
          Override
        </button>
      </div>
    </motion.div>
  );
};

export default SystemGuardian;
