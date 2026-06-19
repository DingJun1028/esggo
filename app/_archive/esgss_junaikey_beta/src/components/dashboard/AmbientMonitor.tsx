import React, { useState, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Droplet, Thermometer, Truck, ShieldCheck, Activity, Cpu, Lock } from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from 'recharts';

interface Measurement {
  type: string;
  value: number;
  unit: string;
  timestamp: number;
  sensorId: string;
}

const AmbientMonitor: React.FC = () => {
  const [flux, setFlux] = useState<Measurement[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [quantumSecurity, setQuantumSecurity] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/ambient/flux');
        const data = await res.json();
        setFlux(data);

        // Update history for chart
        const newPoint = {
          time: new Date().toLocaleTimeString(),
          val: data[0]?.value || 0,
          type: data[0]?.type || 'N/A',
        };
        setHistory(prev => [...prev.slice(-19), newPoint]);
      } catch (err) {
        omniLogger.error(LogCategory.SYSTEM, '[AmbientMonitor] Failed to fetch ambient flux:', { error: err });
      }
    };

    const interval = setInterval(fetchData, 5000);
    fetchData(); // Initial fetch

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Electricity':
        return <Zap className="text-yellow-400" size={16} />;
      case 'Water':
        return <Droplet className="text-blue-400" size={16} />;
      case 'HVAC':
        return <Thermometer className="text-orange-400" size={16} />;
      case 'Logistics':
        return <Truck className="text-purple-400" size={16} />;
      default:
        return <Activity className="text-emerald-400" size={16} />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 lg:p-8 rounded-[2.5rem] bg-black/40 border border-white/5 backdrop-blur-3xl premium-panel-glow flex flex-col gap-6"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="size-10 bg-[#0df2df]/20 rounded-xl flex items-center justify-center border border-[#0df2df]/30">
            <Cpu className="text-[#0df2df]" size={20} />
          </div>
          <div>
            <h3 className="text-sm font-black tracking-[0.3em] uppercase italic">
              Ambient AI Flux
            </h3>
            <p className="text-[10px] text-slate-500 font-mono">Q2 2027 SENTIENT INGESTION</p>
          </div>
        </div>

        <div
          className={`px-4 py-1.5 rounded-full border flex items-center gap-2 transition-all ${
            quantumSecurity
              ? 'bg-[#0df2df]/10 border-[#0df2df]/30 text-[#0df2df]'
              : 'bg-red-500/10 border-red-500/30 text-red-500'
          }`}
        >
          <Lock size={12} className={quantumSecurity ? 'animate-pulse' : ''} />
          <span className="text-[10px] font-black uppercase tracking-widest italic">
            {quantumSecurity ? 'Quantum Secured' : 'Security Breach'}
          </span>
        </div>
      </div>

      {/* Live Stream Panel */}
      <div className="grid grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {flux.map(m => (
            <motion.div
              key={m.sensorId + m.timestamp}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col gap-2 relative overflow-hidden group hover:border-[#0df2df]/30 transition-all"
            >
              <div className="flex items-center justify-between text-[10px] text-slate-500 font-black uppercase tracking-tighter">
                <span className="flex items-center gap-2">
                  {getIcon(m.type)}
                  {m.type}
                </span>
                <span className="font-mono opacity-40">{m.sensorId}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black italic tracking-tighter text-white">
                  {m.value.toFixed(2)}
                </span>
                <span className="text-[10px] text-slate-500 uppercase font-black">{m.unit}</span>
              </div>
              <div className="absolute top-0 right-0 p-1 opacity-20 group-hover:opacity-100 transition-opacity">
                <div className="size-1 rounded-full bg-[#0df2df] animate-ping" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Trend Chart */}
      <div className="h-32 w-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={history}>
            <defs>
              <linearGradient id="fluxGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0df2df" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#0df2df" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="val"
              stroke="#0df2df"
              fill="url(#fluxGrad)"
              strokeWidth={2}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[9px] font-black text-slate-600 uppercase tracking-widest italic">
        <div className="flex items-center gap-2">
          <Activity size={10} className="animate-pulse" />
          <span>Real-time Spatial Ingestion Active</span>
        </div>
        <span>Next Inbound Sweep in 5s...</span>
      </div>
    </motion.div>
  );
};

export default AmbientMonitor;
