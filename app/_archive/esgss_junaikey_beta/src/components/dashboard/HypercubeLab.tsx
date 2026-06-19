import React from 'react';
import { motion } from 'framer-motion';
import {
  Box,
  Layers,
  Cpu,
  Zap,
  Activity,
  Search,
  Workflow,
  ShieldCheck,
  Globe,
  Database,
} from 'lucide-react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';

const data = [
  { subject: 'Intelligence', A: 120, B: 110, fullMark: 150 },
  { subject: 'Persistence', A: 98, B: 130, fullMark: 150 },
  { subject: 'Security', A: 86, B: 130, fullMark: 150 },
  { subject: 'Evolution', A: 99, B: 100, fullMark: 150 },
  { subject: 'Unity', A: 85, B: 90, fullMark: 150 },
  { subject: 'Speed', A: 65, B: 85, fullMark: 150 },
];

const entropyData = [
  { name: '00:00', value: 400 },
  { name: '04:00', value: 300 },
  { name: '08:00', value: 600 },
  { name: '12:00', value: 800 },
  { name: '16:00', value: 500 },
  { name: '20:00', value: 900 },
  { name: '23:59', value: 700 },
];

export const HypercubeLab: React.FC = () => {
  const [pulseValue, setPulseValue] = React.useState(1204.5);

  // 💓 Extreme Refinement: Sentient Heartbeat Simulation
  React.useEffect(() => {
    const interval = setInterval(() => {
      setPulseValue(prev => +(prev + (Math.random() - 0.5) * 5).toFixed(1));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 h-full bg-slate-950 text-slate-200 overflow-y-auto custom-scrollbar">
      <header className="mb-12">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500/10 rounded-2xl border border-blue-500/20">
            <Box className="w-8 h-8 text-blue-400" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
              Hypercube Evolution Lab
            </h1>
            <p className="text-slate-400 font-mono text-sm tracking-widest uppercase">
              Omni-Intelligence Hub • Systemic Multi-Dimensional Analysis
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Radar: Multi-Dimensional Resonance */}
        <div className="lg:col-span-2 bg-slate-900/50 border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-100 transition-opacity">
            <Workflow className="w-12 h-12 text-blue-500 animate-pulse" />
          </div>
          <h2 className="text-xl font-bold text-white mb-8 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Systemic Resonance Matrix
          </h2>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} axisLine={false} />
                <Radar
                  name="Current"
                  dataKey="A"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.3}
                />
                <Radar
                  name="Projected"
                  dataKey="B"
                  stroke="#8b5cf6"
                  fill="#8b5cf6"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stats Column */}
        <div className="space-y-8">
          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-tighter">
                Throughput
              </span>
              <Cpu className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {pulseValue} <span className="text-sm font-normal text-slate-500">TPS</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-emerald-500"
                initial={{ width: 0 }}
                animate={{ width: `${(pulseValue / 1600) * 100}%` }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 hover:border-purple-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-tighter">
                Latency
              </span>
              <Zap className="w-4 h-4 text-indigo-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              12 <span className="text-sm font-normal text-slate-500">ms</span>
            </div>
            <div className="flex gap-1 h-4 items-end">
              {[4, 7, 2, 8, 5, 9, 3, 6, 8, 4, 7, 5].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-indigo-500/40 rounded-t-sm"
                  animate={{ height: [`${h * 10}%`, `${(10 - h) * 10}%`, `${h * 10}%`] }}
                  transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>

          <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-6 hover:border-cyan-500/30 transition-all">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400 text-xs font-mono uppercase tracking-tighter">
                Uptime
              </span>
              <Activity className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-3xl font-bold text-white mb-1">99.998%</div>
            <p className="text-slate-500 text-[10px] font-mono">STABLE OPS SINCE EPOCH</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-12">
        {/* Entropy Chart */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-400" />
            Neural Entropy Stream
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={entropyData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 10 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#3b82f6"
                  fillOpacity={1}
                  fill="url(#colorValue)"
                  strokeWidth={3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Global Nodes */}
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Globe className="w-5 h-5 text-purple-400" />
            Hypercube Distributed Nodes
          </h3>
          <div className="space-y-6">
            {[
              { id: 'CX-7', status: 'Sovereign', load: 88, color: 'text-blue-400' },
              { id: 'VT-2', status: 'Synthesizing', load: 42, color: 'text-indigo-400' },
              { id: 'OG-9', status: 'Stable', load: 12, color: 'text-emerald-400' },
              { id: 'AX-1', status: 'Locked', load: 100, color: 'text-red-400' },
            ].map(node => (
              <div
                key={node.id}
                className="flex items-center justify-between p-4 bg-slate-800/20 rounded-2xl border border-white/5"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full bg-current ${node.color} animate-pulse`} />
                  <div>
                    <div className="text-sm font-bold text-white">{node.id}</div>
                    <div className="text-[10px] text-slate-500 uppercase">{node.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-slate-400">{node.load}%</div>
                  <div className="w-24 h-1 bg-slate-700 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${node.load}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Center Linkage */}
      <footer className="mt-8 border-t border-white/5 pt-12 text-center pb-12">
        <h3 className="text-2xl font-bold text-white mb-6">Quantum Seamless Transition</h3>
        <div className="flex flex-wrap justify-center gap-6">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-xl shadow-blue-900/40 transition-all active:scale-95 flex items-center gap-3">
            <Search className="w-5 h-5" />
            Intelligence Scan
          </button>
          <button className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white border border-white/10 rounded-2xl font-bold transition-all active:scale-95 flex items-center gap-3">
            <ShieldCheck className="w-5 h-5" />
            Action Protocol
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HypercubeLab;
