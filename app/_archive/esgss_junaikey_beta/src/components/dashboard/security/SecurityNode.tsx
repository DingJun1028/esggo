import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  Lock,
  AlertTriangle,
  Activity,
  Zap,
  Radio,
  Globe,
  Verified,
  AlertOctagon,
} from 'lucide-react';
import { Button, Card, Badge, Progress } from '@/components/ui';
import { omniLogger, LogCategory } from '@/services/omniLogger';

export interface Threat {
  id: number;
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  source: string;
  timestamp: Date;
}

export const SecurityNode: React.FC = () => {
  const [systemIntegrity, setSystemIntegrity] = useState(100);
  const [threats, setThreats] = useState<Threat[]>([]);
  const [activeProtocols, setActiveProtocols] = useState<string[]>([
    'FIREWALL_OMEGA',
    'DEEP_PACKET_STASIS',
  ]);
  const [scanning, setScanning] = useState(false);
  const purgeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Simulated Threat Detection
  useEffect(() => {
    const interval = setInterval(() => {
      const random = Math.random();
      if (random > 0.95) {
        const newThreat: Threat = {
          id: Date.now(),
          type: 'ANOMALY',
          severity: 'LOW',
          source: 'EXTERNAL_NET_7',
          timestamp: new Date(),
        };
        setThreats(prev => [newThreat, ...prev].slice(0, 5));
        setSystemIntegrity(prev => Math.max(90, prev - 2));
        omniLogger.warn(LogCategory.SECURITY, 'Anomaly Detected', newThreat);
      } else if (random < 0.3 && systemIntegrity < 100) {
        setSystemIntegrity(prev => Math.min(100, prev + 1));
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);
    };
  }, [systemIntegrity]);

  const handlePurge = () => {
    setScanning(true);
    omniLogger.info(LogCategory.SECURITY, 'Initiating System Purge Protocol');

    if (purgeTimerRef.current) clearTimeout(purgeTimerRef.current);

    purgeTimerRef.current = setTimeout(() => {
      setThreats([]);
      setSystemIntegrity(100);
      setScanning(false);
      omniLogger.info(LogCategory.SECURITY, 'System Purge Complete. Integrity Restored.');
      purgeTimerRef.current = null;
    }, 2000);
  };

  return (
    <div className="h-full w-full p-4 lg:p-8 flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white flex items-center gap-3 tracking-tight">
            <ShieldCheck className="text-emerald-500" size={32} />
            SECURITY NODE{' '}
            <span className="text-emerald-500 text-sm font-mono bg-emerald-500/10 px-2 py-1 rounded border border-emerald-500/20">
              ACTIVE
            </span>
          </h2>
          <p className="text-gray-500 font-mono text-xs mt-1 tracking-widest uppercase pl-11">
            System Defense & Integrity Monitor
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] text-gray-500 uppercase tracking-widest">Global Status</div>
            <div className="text-emerald-400 font-black tracking-widest">SECURE</div>
          </div>
          <Activity className="text-emerald-500 animate-pulse" size={24} />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
        {/* 1. Shield Visualization (Center Stage) */}
        <div className="lg:col-span-2 relative">
          <Card className="h-full bg-black/40 border-emerald-500/20 backdrop-blur-xl p-8 flex flex-col items-center justify-center relative overflow-hidden group">
            {/* Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

            <div className="relative z-10 text-center">
              <motion.div
                animate={{
                  boxShadow: scanning
                    ? ['0 0 20px #10b981', '0 0 60px #10b981', '0 0 20px #10b981']
                    : '0 0 30px rgba(16,185,129,0.1)',
                }}
                className="w-64 h-64 rounded-full border-4 border-emerald-500/30 flex items-center justify-center bg-black/50 relative"
              >
                <div className="absolute inset-0 rounded-full border border-emerald-500/10 animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-4 rounded-full border border-emerald-500/20 animate-[spin_15s_linear_infinite_reverse]" />

                <div className="flex flex-col items-center">
                  <Shield
                    size={64}
                    className={`text-emerald-500 mb-2 ${scanning ? 'animate-bounce' : ''}`}
                  />
                  <span className="text-5xl font-black text-white tracking-tighter">
                    {systemIntegrity}%
                  </span>
                  <span className="text-[10px] text-emerald-400 uppercase tracking-[0.2em] mt-2">
                    Integrity
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Action Bar */}
            <div className="absolute bottom-8 flex gap-4 z-20">
              <Button
                onClick={handlePurge}
                disabled={scanning}
                className="bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 border border-emerald-500/50 uppercase tracking-widest font-bold backdrop-blur-md"
              >
                {scanning ? <span className="animate-pulse">Purging...</span> : 'System Purge'}
              </Button>
              <Button
                variant="outline"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10 uppercase tracking-widest font-bold"
              >
                Lockdown
              </Button>
            </div>
          </Card>
        </div>

        {/* 2. Side Panel: Threats & Protocols */}
        <div className="flex flex-col gap-6">
          {/* Active Protocols */}
          <Card className="bg-black/40 border-white/10 p-5 backdrop-blur-md">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 flex items-center gap-2">
              <Lock size={14} /> Active Protocols
            </h3>
            <div className="space-y-2">
              {activeProtocols.map(proto => (
                <div
                  key={proto}
                  className="flex items-center justify-between p-2 rounded bg-emerald-900/10 border border-emerald-500/20"
                >
                  <span className="text-[10px] font-mono text-emerald-300 font-bold">{proto}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                </div>
              ))}
            </div>
          </Card>

          {/* Threat Warnings */}
          <Card className="flex-1 bg-red-900/5 border-red-500/10 p-5 backdrop-blur-md overflow-hidden flex flex-col">
            <h3 className="text-xs font-bold text-red-400 uppercase mb-4 flex items-center gap-2">
              <AlertOctagon size={14} /> Detected Threats
            </h3>
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {threats.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center opacity-40 text-gray-500 text-center">
                  <Verified size={32} className="mb-2 text-emerald-500" />
                  <p className="text-[10px] uppercase tracking-widest">No Active Threats</p>
                </div>
              ) : (
                threats.map(threat => (
                  <div
                    key={threat.id}
                    className="p-3 rounded bg-red-900/20 border border-red-500/30 animate-in slide-in-from-right"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-red-300 uppercase">
                        {threat.type}
                      </span>
                      <span className="text-[9px] text-red-400/70 font-mono">
                        {new Date(threat.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="text-[10px] text-gray-400 mt-1 font-mono">
                      Source: {threat.source}
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
