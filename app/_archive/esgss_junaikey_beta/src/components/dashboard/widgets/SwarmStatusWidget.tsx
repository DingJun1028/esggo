import React, { useEffect, useState } from 'react';
import { Network, Activity, Cpu, Share2, Layers } from 'lucide-react';
import { swarmOrchestrator } from '../../../core/swarm/SwarmOrchestrator';
import { agentService } from '../../../services/agentService';
import { ComponentCoreFactory, IComponentCore } from '@/services/ceremony';
import '../../../styles/liquid-glass.css';

interface SwarmStats {
  activeAgents: number;
  neuralLinks: number;
  memoryCapacity: string;
}

export const SwarmStatusWidget: React.FC = () => {
  const [stats, setStats] = useState<SwarmStats>({
    activeAgents: 0,
    neuralLinks: 0,
    memoryCapacity: 'Loading...',
  });

  // IComponentCore Initialization
  const [core] = useState<IComponentCore>(() =>
    ComponentCoreFactory.create(
      'dashboard/widgets/SwarmStatusWidget.tsx',
      '1.0.0',
      ['Swarm', 'Status', '5T-Protocol']
    )
  );

  useEffect(() => {
    // Poll for Swarm Stats
    const update = () => {
      const current = swarmOrchestrator.getSwarmStats();
      setStats(current);
    };

    update();
    const interval = setInterval(update, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative group overflow-hidden rounded-2xl liquid-glass p-6 transition-all duration-500 hover:border-cyan-500/30 hover:shadow-[0_0_30px_rgba(6,182,212,0.1)]"
      data-uuid={core.uuid}
      data-timestamp={core.timestamp}
      data-5t-protocol="active"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 shadow-[0_0_15px_rgba(6,182,212,0.3)] animate-pulse-slow">
            <Network size={20} className="text-cyan-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400">
              Neural Swarm Status
            </h3>
            <p className="text-[10px] text-cyan-500/60 font-mono tracking-wider">
              HIVE_MIND_CONN_V6.0
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)] animate-pulse"></span>
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Active Agents */}
        <div className="relative bg-white/5 rounded-lg p-4 border border-white/10 overflow-hidden group-hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Cpu size={32} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.activeAgents}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Activity size={10} className="text-cyan-400" />
            Awakened Units
          </div>
        </div>

        {/* Neural Links */}
        <div className="relative bg-white/5 rounded-lg p-4 border border-white/10 overflow-hidden group-hover:bg-white/10 transition-colors">
          <div className="absolute top-0 right-0 p-2 opacity-20">
            <Share2 size={32} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{stats.neuralLinks}</div>
          <div className="text-xs text-gray-400 flex items-center gap-1">
            <Layers size={10} className="text-purple-400" />
            Active Synapses
          </div>
        </div>
      </div>

      {/* Visualization (CSS Art) */}
      <div className="mt-6 relative h-24 w-full bg-black/20 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 grid grid-cols-6 grid-rows-3 opacity-20">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="border-[0.5px] border-cyan-500/30" />
          ))}
        </div>

        {/* Central Node */}
        <div className="relative z-10 h-8 w-8 bg-cyan-500 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.8)] animate-pulse flex items-center justify-center">
          <div className="h-2 w-2 bg-white rounded-full"></div>
        </div>

        {/* Satellite Nodes */}
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_10px_rgba(168,85,247,0.6)]"
            style={{
              transform: `rotate(${i * 120}deg) translate(40px) rotate(-${i * 120}deg)`,
              animation: `orbit 4s infinite linear`,
              animationDelay: `${i * -1.33}s`,
            }}
          />
        ))}
      </div>

      <style>{`
                @keyframes orbit {
                    from { transform: rotate(0deg) translate(40px) rotate(0deg); }
                    to { transform: rotate(360deg) translate(40px) rotate(-360deg); }
                }
            `}</style>
    </div>
  );
};
