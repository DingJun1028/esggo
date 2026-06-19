import React, { memo, useCallback, useMemo } from 'react';
import { Agent, agentService } from '@/services/agentService';
import { Badge, Button } from '@/components/ui';
import { Skeleton } from '@/components/ui/Skeleton';
import { Power, User, Crown, TrendingUp, Zap, ShieldCheck, Fingerprint } from 'lucide-react';
import { Language } from '@/types/core';

// ==================== TYPE DEFINITIONS ====================
interface AgentListProps {
  readonly agents: Agent[];
  readonly selectedId?: string;
  readonly onSelect: (agent: Agent) => void;
  readonly onViewDetails?: (agent: Agent) => void;
  readonly onCreateNew?: () => void;
  readonly onAwaken?: (agent: Agent) => void;
  readonly isLoading?: boolean;
  readonly language?: Language;
}

// ==================== SUB-COMPONENTS ====================
interface NewAgentCardProps {
  readonly onClick?: () => void;
  readonly language?: Language;
}

const NewAgentCard = memo<NewAgentCardProps>(({ onClick, language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  return (
    <button
      onClick={onClick}
      className="border border-dashed border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center text-gray-600 hover:text-cyan-500 hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all cursor-pointer min-h-[220px] group focus:outline-none focus:ring-2 focus:ring-cyan-500"
      aria-label={isZh ? '初始化新代理' : 'Initialize new agent'}
    >
      <div
        className="w-12 h-12 rounded-full bg-gray-900 group-hover:bg-cyan-500/20 flex items-center justify-center mb-3 transition-colors duration-300"
        aria-hidden="true"
      >
        <User size={24} className="group-hover:text-cyan-500 transition-colors" />
      </div>
      <span className="text-sm font-mono font-bold uppercase tracking-wide">
        {isZh ? '初始化新代理' : 'Initialize New Agent'}
      </span>
      <span className="text-xs text-gray-500 mt-1">{isZh ? '創世紀協議' : 'Genesis Protocol'}</span>
    </button>
  );
});

NewAgentCard.displayName = 'NewAgentCard';

interface AgentCardProps {
  readonly agent: Agent;
  readonly isSelected: boolean;
  readonly onSelect: () => void;
  readonly onViewDetails?: () => void;
  readonly onAwaken?: () => void;
  readonly language?: Language;
}

const AgentCard = memo<AgentCardProps>(
  ({ agent, isSelected, onSelect, onViewDetails, onAwaken, language = 'zh-TW' }) => {
    const isZh = language === 'zh-TW';
    const roleColor = useMemo(() => agentService.getRoleColor(agent.role), [agent.role]);
    const xpPercent = useMemo(
      () => (agent.experience / agent.nextLevelExp) * 100,
      [agent.experience, agent.nextLevelExp]
    );

    const roleIcon = useMemo(() => {
      switch (agent.role) {
        case 'STRATEGIST':
          return <Crown size={18} />;
        case 'EXECUTOR':
          return <Zap size={18} />;
        case 'ANALYST':
          return <TrendingUp size={18} />;
        case 'AUDITOR':
          return <Power size={18} />;
        default:
          return <User size={18} />;
      }
    }, [agent.role]);

    const handleDetailsClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetails?.();
      },
      [onViewDetails]
    );

    const handleAwakenClick = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        onAwaken?.();
      },
      [onAwaken]
    );

    return (
      <article
        onClick={onSelect}
        className={`
                relative p-5 rounded-xl border transition-all cursor-pointer group overflow-hidden flex flex-col justify-between
                ${isSelected
            ? 'bg-[#1A1A1A] border-cyan-500/50 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
            : 'bg-[#0E0E0E] border-gray-800 hover:border-gray-600 hover:bg-[#151515]'
          }
            `}
        style={{ minHeight: '220px' }}
        role="button"
        tabIndex={0}
        aria-label={`Agent ${agent.name}, Level ${agent.level} ${agent.role}`}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelect();
          }
        }}
      >
        <div
          className={`absolute top-3 right-3 w-2 h-2 rounded-full ${agent.agent_status === 'ACTIVE'
            ? 'bg-emerald-500 animate-pulse shadow-[0_0_8px_#10B981]'
            : 'bg-gray-700'
            }`}
          aria-label={`Status: ${agent.agent_status}`}
        />

        {agent.isCrystallized && (
          <div className="absolute top-3 left-3 flex items-center gap-1 bg-aqua-500/20 text-aqua-400 border border-aqua-500/30 px-1.5 py-0.5 rounded text-[8px] font-bold tracking-tighter uppercase z-10 backdrop-blur-sm shadow-[0_0_10px_rgba(0,255,255,0.2)]">
            <ShieldCheck size={10} />
            {isZh ? '5T 晶化' : '5T Sealed'}
          </div>
        )}

        <div>
          <header className="flex items-start gap-3 mb-4">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-inner border"
              style={{
                backgroundColor: `${roleColor}15`,
                color: roleColor,
                borderColor: `${roleColor}30`,
              }}
              aria-hidden="true"
            >
              {roleIcon}
            </div>
            <div className="flex-1 min-w-0">
              <h4
                className={`text-sm font-bold truncate ${isSelected ? 'text-white' : 'text-gray-200'}`}
              >
                {agent.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 h-4 border-gray-700 text-gray-400"
                >
                  LV. {agent.level}
                </Badge>
                <span className="text-[10px] text-gray-500 font-mono tracking-wider">
                  {agent.role}
                </span>
              </div>
            </div>
          </header>

          <div className="space-y-3 mb-4">
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-gray-500 font-mono">
                <span>EXP</span>
                <span>
                  {agent.experience} / {agent.nextLevelExp}
                </span>
              </div>
              <div
                className="h-1 bg-gray-800 rounded-full overflow-hidden"
                role="progressbar"
                aria-valuenow={xpPercent}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%`, backgroundColor: roleColor }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="bg-gray-900/50 rounded p-1.5 flex items-center justify-between border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase">INT</span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {agent.dna.intelligence}
                </span>
              </div>
              <div className="bg-gray-900/50 rounded p-1.5 flex items-center justify-between border border-gray-800">
                <span className="text-[9px] text-gray-500 uppercase">SPD</span>
                <span className="text-xs font-mono font-bold text-yellow-400">
                  {agent.dna.speed}
                </span>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto pt-3 border-t border-gray-800 flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-[10px] text-gray-400 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            onClick={handleDetailsClick}
            aria-label={isZh ? `查看 ${agent.name} 詳情` : `View details of ${agent.name}`}
          >
            {isZh ? '詳情' : 'Details'}
          </Button>

          {!agent.isAwakened && (
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-[10px] text-purple-400 hover:text-white hover:bg-purple-500/20 focus:outline-none focus:ring-2 focus:ring-purple-500 ml-2 border border-purple-500/30"
              onClick={handleAwakenClick}
              aria-label={isZh ? `覺醒 ${agent.name}` : `Awaken ${agent.name}`}
            >
              <Zap size={10} className="mr-1" />
              {isZh ? '覺醒' : 'Awaken'}
            </Button>
          )}
        </footer>
      </article>
    );
  }
);

AgentCard.displayName = 'AgentCard';

// ==================== MAIN COMPONENT ====================
export const AgentList = memo<AgentListProps>(
  ({
    agents,
    selectedId,
    onSelect,
    onViewDetails,
    onCreateNew,
    onAwaken,
    isLoading,
    language = 'zh-TW',
  }) => {
    const isZh = language === 'zh-TW';
    const agentCards = useMemo(
      () =>
        agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            isSelected={selectedId === agent.id}
            onSelect={() => onSelect(agent)}
            onViewDetails={onViewDetails ? () => onViewDetails(agent) : undefined}
            onAwaken={onAwaken ? () => onAwaken(agent) : undefined}
            language={language}
          />
        )),
      [agents, selectedId, onSelect, onViewDetails, onAwaken, language]
    );

    if (isLoading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="min-h-[220px] p-5 rounded-xl border border-gray-800 bg-[#0E0E0E]"
            >
              <div className="flex items-center gap-3 mb-4">
                <Skeleton className="w-10 h-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
              <div className="space-y-3 mb-4">
                <Skeleton className="h-1 w-full rounded-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-10"
        role="list"
        aria-label={isZh ? '代理列表' : 'Agent list'}
      >
        <NewAgentCard onClick={onCreateNew} language={language} />
        {agentCards}
      </div>
    );
  }
);

AgentList.displayName = 'AgentList';
