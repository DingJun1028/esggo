import React, { useState, useCallback, useMemo, memo, useEffect } from 'react';
import {
  Plus,
  X,
  Copy,
  Shield,
  Activity,
  Database,
  Lock,
  Monitor,
  Cpu,
  Zap,
  Maximize2,
  Brain,
  Skull,
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button, Card, Badge } from '@/components/ui';
import { agentService, Agent, AgentRole } from '@/services/agentService';
import { omniLogger, LogCategory } from '@/services/omniLogger';

// ==================== 5T Protocol Definitions ====================
// [SHAN_XIANG_5T] Replaces generic logic with specific 5T Protocol
type ProtocolState = 'T1_TRACE' | 'T2_TRACK' | 'T3_TRANS' | 'T4_TANGL' | 'T5_TRUST';

interface ProtocolCheck {
  id: ProtocolState;
  label: string;
  enLabel: string;
  description: string;
  icon: React.ElementType;
  isYes: boolean; // For 3+1 Logic (3 Yes, 1 No/Lock)
}

const SHAN_XIANG_5T: ProtocolCheck[] = [
  {
    id: 'T1_TRACE',
    label: '可溯源',
    enLabel: 'Traceable',
    description: 'Source Logged',
    icon: Database,
    isYes: true,
  },
  {
    id: 'T2_TRACK',
    label: '可追蹤',
    enLabel: 'Trackable',
    description: 'Lifecycle Map',
    icon: Activity,
    isYes: true,
  },
  {
    id: 'T3_TRANS',
    label: '透明化',
    enLabel: 'Transparent',
    description: 'Open Logic',
    icon: Monitor,
    isYes: true,
  },
  {
    id: 'T4_TANGL',
    label: '可感知',
    enLabel: 'Tangible',
    description: 'Visual Proof',
    icon: Zap,
    isYes: true,
  },
  {
    id: 'T5_TRUST',
    label: '信實化',
    enLabel: 'Trustworthy',
    description: 'Hash Locked',
    icon: Lock,
    isYes: false,
  },
];

// ==================== Widget Component (The Agent Clone) ====================
interface OmniWidgetProps {
  agent: Agent;
  onRefresh: () => void;
}

const OmniWidget = memo(({ agent, onRefresh }: OmniWidgetProps) => {
  const { style } = useTheme();
  const roleColor = agentService.getRoleColor(agent.role);

  // Simulate 5T compliance based on agent state
  const status = useMemo(
    () => ({
      T1_TRACE: !!agent.id,
      T2_TRACK: agent.level >= 5,
      T3_TRANS: true, // Algorithms are open
      T4_TANGL: true, // Has visual manifest
      T5_TRUST: true, // Agent core is locked
    }),
    [agent]
  );

  const panelClass =
    style === 'glass'
      ? 'liquid-glass bg-black/40 backdrop-blur-md border-white/10 hover:border-cyan-400/50'
      : 'minimalist-optics bg-white/5 border-white/10 hover:border-blue-500';

  return (
    <div
      className={`${panelClass} p-4 rounded-2xl relative group transition-all duration-500 animate-in zoom-in-50 fade-in fill-mode-both flex flex-col justify-between`}
      style={{ borderColor: `${roleColor}40` }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: roleColor }}
          />
          <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest truncate max-w-[80px]">
            {agent.role}
          </span>
        </div>
        <Badge variant="outline" className="text-[8px] px-1 py-0 border-white/10 text-gray-500">
          LV.{agent.level}
        </Badge>
      </div>

      {/* Agent Identity */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden my-2">
        <div
          className={`absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-${roleColor}/5 opacity-20`}
        />
        <Brain
          className="w-8 h-8 mb-2 transition-transform group-hover:scale-110"
          style={{ color: roleColor }}
        />
        <h3 className="text-sm font-bold text-white text-center leading-tight line-clamp-2">
          {agent.name}
        </h3>
        <p className="text-[10px] text-gray-500 font-mono mt-1">{agent.id.slice(0, 8)}</p>
      </div>

      {/* Experience Bar */}
      <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mb-3">
        <div
          className="h-full transition-all duration-1000 ease-out"
          style={{
            width: `${(agent.experience / agent.nextLevelExp) * 100}%`,
            backgroundColor: roleColor,
          }}
        />
      </div>

      {/* 5T Protocol Matrix */}
      <div className="grid grid-cols-5 gap-1 border-t border-white/5 pt-2">
        {SHAN_XIANG_5T.map((check: any) => {
          const isActive = (status as any)[check.id];
          // Dynamic color logic based on 5T types
          let activeColor = 'bg-gray-700';
          if (isActive) {
            if (check.id === 'T1_TRACE') activeColor = 'bg-emerald-400 shadow-[0_0_5px_emerald]';
            else if (check.id === 'T2_TRACK') activeColor = 'bg-blue-400 shadow-[0_0_5px_blue]';
            else if (check.id === 'T3_TRANS') activeColor = 'bg-cyan-400 shadow-[0_0_5px_cyan]';
            else if (check.id === 'T4_TANGL') activeColor = 'bg-purple-400 shadow-[0_0_5px_purple]';
            else if (check.id === 'T5_TRUST') activeColor = 'bg-rose-500 shadow-[0_0_5px_rose]';
          }

          return (
            <div
              key={check.id}
              className="flex flex-col items-center group/check"
              title={`${check.enLabel}: ${check.description}`}
            >
              <div className={`w-1.5 h-1.5 rounded-full mb-1 transition-all ${activeColor}`} />
              <span
                className={`text-[7px] scale-75 transform uppercase ${isActive ? 'text-gray-300' : 'text-gray-600'}`}
              >
                {check.enLabel.slice(0, 2)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
});
OmniWidget.displayName = 'OmniWidget';

// ==================== Main Instrument Interface ====================
export const OmniInstrument = memo(() => {
  const { style } = useTheme();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isSpawning, setIsSpawning] = useState(false);

  const refreshAgents = useCallback(async () => {
    try {
      const data = await agentService.getAgents();
      setAgents(data);
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Failed to fetch agents', { error });
    }
  }, []);

  useEffect(() => {
    refreshAgents();
    // Set up a "heartbeat" to refresh data occasionally
    const interval = setInterval(refreshAgents, 5000);
    return () => clearInterval(interval);
  }, [refreshAgents]);

  const handleSpawn = useCallback(async () => {
    if (isSpawning) return;
    setIsSpawning(true);
    try {
      const roles: AgentRole[] = ['STRATEGIST', 'EXECUTOR', 'AUDITOR', 'ANALYST'];
      const randomRole = roles[Math.floor(Math.random() * roles.length)] || 'ANALYST';
      const randomNames = ['Nexus', 'Vertex', 'Cipher', 'Echo', 'Flux', 'Vortex', 'Prism', 'Aegis'];
      const name = `Omni-${randomNames[Math.floor(Math.random() * randomNames.length)]}-${Math.floor(Math.random() * 99)}`;

      await agentService.createAgent({
        name,
        role: randomRole,
        status: 'TRAINING',
        description: 'Spawned via Omni-Instrument',
        dna: {
          intelligence: 50,
          creativity: 50,
          empathy: 50,
          resilience: 50,
          precision: 50,
          speed: 50,
        },
        skills: [],
        equipment: {},
        titles: [],
        isAwakened: false,
        avatarHistory: [],
        avatarColor: agentService.getRoleColor(randomRole),
      });
      await refreshAgents();
    } catch (e) {
      omniLogger.error(LogCategory.AGENT, 'Spawn failed', { error: e });
    } finally {
      setIsSpawning(false);
    }
  }, [isSpawning, refreshAgents]);

  return (
    <div className="h-full flex flex-col p-6 overflow-hidden relative">
      {/* Header Area with 4T Totem */}
      <div
        className={`flex justify-between items-end mb-6 shrink-0 z-10 transition-all ${
          style === 'glass'
            ? 'bg-black/20 backdrop-blur-sm p-4 rounded-2xl border border-white/5'
            : ''
        }`}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/5 rounded-xl border border-white/10">
            <Maximize2 className="w-6 h-6 text-gold" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>善向奧秘儀表</span>
              <span className="text-[10px] font-mono text-gold bg-gold/10 px-2 py-0.5 rounded border border-gold/20">
                LIVE LINK
              </span>
            </h1>
            <p className="text-xs text-gray-400 font-mono tracking-wide mt-1">
              CONNECTED SHAN-XIANG NODES:{' '}
              <span className="text-white font-bold">{agents.length}</span> // INTEGRITY:{' '}
              <span className="text-emerald-400">100%</span>
            </p>
          </div>
        </div>

        {/* 5T Principles Visualization */}
        <div className="hidden md:flex gap-4">
          {SHAN_XIANG_5T.map((p: any) => (
            <div
              key={p.id}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10"
            >
              <p.icon className="w-3 h-3 text-gold" />
              <span className="text-[10px] text-gray-300 font-bold uppercase">{p.enLabel}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Smart Grid - Infinite Canvas */}
      <div className="flex-1 overflow-y-auto pr-2 pb-20 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 auto-rows-[200px]">
          {/* The Spawner */}
          <button
            onClick={handleSpawn}
            disabled={isSpawning}
            className={`
                            col-span-1 row-span-1 rounded-2xl border-2 border-dashed border-white/10 
                            flex flex-col items-center justify-center gap-2 group hover:border-gold/50 hover:bg-gold/5 transition-all
                            ${style === 'glass' ? 'backdrop-blur-sm' : ''}
                            ${isSpawning ? 'opacity-50 cursor-wait' : 'cursor-pointer'}
                        `}
          >
            <div
              className={`w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-black transition-all ${isSpawning ? 'animate-spin' : ''}`}
            >
              <Plus className="w-6 h-6" />
            </div>
            <span className="text-xs text-gray-500 font-mono uppercase group-hover:text-gold">
              {isSpawning ? 'AWAKENING...' : '喚醒善向分身 (Spawn)'}
            </span>
          </button>

          {/* Render Real Agents */}
          {agents.map(agent => (
            <OmniWidget key={agent.id} agent={agent} onRefresh={refreshAgents} />
          ))}
        </div>
      </div>

      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full mix-blend-screen animate-pulse"
          style={{ animationDuration: '4s' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-purple-500/5 blur-[120px] rounded-full mix-blend-screen animate-pulse"
          style={{ animationDuration: '7s' }}
        />
      </div>
    </div>
  );
});

export default OmniInstrument;
