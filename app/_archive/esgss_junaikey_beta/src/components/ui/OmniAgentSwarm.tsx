import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Agent } from '@/types/agency';
import { agentService } from '@/services/agentService';
import { Sparkles, Shield, Sword, Eye, Zap, Brain, Activity } from 'lucide-react';

interface OmniAgentSwarmProps {
  isUltimateActive?: boolean;
  language?: 'zh-TW' | 'en' | 'en-US';
}

export const OmniAgentSwarm: React.FC<OmniAgentSwarmProps> = ({
  isUltimateActive,
  language = 'zh-TW',
}) => {
  const [agents, setAgents] = useState<Agent[]>([]);

  useEffect(() => {
    // In a real app, subscribe to updates
    agentService.getAgents().then(setAgents);
  }, []);

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'GUARDIAN':
        return <Shield size={12} />;
      case 'WARRIOR':
        return <Sword size={12} />;
      case 'ORACLE':
        return <Eye size={12} />;
      case 'STRATEGIST':
        return <Brain size={12} />;
      default:
        return <Zap size={12} />;
    }
  };

  // Generate some mock extra agents if list is small to show "Thousand Faces" effect
  const displayAgents = React.useMemo(() => {
    if (agents.length > 10) return agents;
    return [
      ...agents,
      ...Array.from({ length: 12 - agents.length }).map((_, i) => ({
        ...agents[0],
        id: `sim-agent-${i}`,
        name: `Agent Unit ${800 + i}`,
        role: ['GUARDIAN', 'ORACLE', 'STRATEGIST'][i % 3] as any,
        level: 5 + i,
      })),
    ];
  }, [agents]);

  return (
    <div
      className={`rounded-xl p-4 transition-all duration-500 ${isUltimateActive ? 'bg-aqua-900/10 border border-aqua-500/30' : 'bg-slate-900/50 border border-white/5'}`}
    >
      <div className="flex justify-between items-center mb-3">
        <h4
          className={`text-sm font-bold flex items-center gap-2 ${isUltimateActive ? 'text-aqua-400' : 'text-slate-300'}`}
        >
          <Activity size={14} />
          {language === 'zh-TW' ? '代理矩陣' : 'Agent Matrix'}
          <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full font-mono">
            {displayAgents.length} ACTIVE
          </span>
        </h4>
        {isUltimateActive && (
          <div className="flex items-center gap-1 text-[10px] text-aqua-500 font-mono animate-pulse">
            SYNC 100%
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
        {displayAgents.map((agent, index) => (
          <motion.div
            key={agent.id}
            initial={{ scale: 0 }}
            animate={{
              scale: 1,
              borderColor: isUltimateActive ? '#00FFFF' : 'rgba(255,255,255,0.1)',
              boxShadow: isUltimateActive
                ? `0 0 ${5 + Math.random() * 10}px rgba(0,255,255, 0.4)`
                : 'none',
            }}
            transition={{ delay: index * 0.05 }}
            className={`
                group relative aspect-square rounded-lg flex items-center justify-center
                border border-white/10 bg-black/40 cursor-pointer overflow-hidden
            `}
          >
            {/* Awakening Aura */}
            {isUltimateActive && (
              <div
                className="absolute inset-0 bg-aqua-500/20 animate-pulse"
                style={{ animationDelay: `${index * 0.1}s` }}
              />
            )}

            <div
              className={`z-10 text-slate-300 group-hover:text-white transition-colors duration-300 ${isUltimateActive ? 'text-aqua-200' : ''}`}
            >
              {getRoleIcon(agent.role)}
            </div>

            {/* Level Badge */}
            <div className="absolute bottom-0 right-0 text-[8px] font-mono bg-black/80 px-1 text-slate-400">
              L{agent.level}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-max max-w-[150px] p-2 bg-slate-900/95 border border-white/10 rounded-lg text-xs z-50 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
              <div className="font-bold text-white mb-0.5">{agent.name}</div>
              <div className="text-slate-400 flex justify-between gap-4">
                <span>{agent.role}</span>
                <span className="text-emerald-400">Lv.{agent.level}</span>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Add Button Placeholder - Only plain mode */}
        {!isUltimateActive && (
          <div className="aspect-square rounded-lg flex items-center justify-center border border-dashed border-white/10 text-slate-600 hover:text-slate-400 hover:border-white/30 cursor-pointer transition-all">
            +
          </div>
        )}
      </div>
    </div>
  );
};
