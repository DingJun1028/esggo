import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import {
  Shield,
  Brain,
  Zap,
  Eye,
  Sparkles,
  Heart,
  BookOpen,
  Search,
  Globe,
  Gavel,
  Scale,
  Lock,
  Leaf,
  Recycle,
  Wind,
  TrendingUp,
  Users as UsersIcon,
} from 'lucide-react';
import { OMNI_AGENTS, OmniAgentProfile } from '../data/omni-agents';
import { Language } from '@/types';

// Map OMNI_AGENTS types to Icons
const TYPE_ICONS: Record<string, React.ElementType> = {
  E: Leaf,
  S: Heart,
  G: Scale,
  U: Globe,
};

const AGENT_ICONS: Record<string, React.ElementType> = {
  agt_e_01: Search, // Carbon Hunter
  agt_e_02: Zap, // Green Energy
  agt_e_03: Recycle, // Circular
  agt_e_04: Wind, // Water

  agt_s_01: Heart, // Empathy
  agt_s_02: UsersIcon, // Diversity
  agt_s_03: Shield, // Safety
  agt_s_04: BookOpen, // Talent

  agt_g_01: Gavel, // Compliance
  agt_g_02: Search, // Prosecutor
  agt_g_03: Eye, // Prophet

  agt_u_01: Brain, // Architect
  agt_u_02: Sparkles, // Entropy
  agt_u_03: TrendingUp, // Value
  agt_u_04: Lock, // Digital Twin
};

interface OmniAvatarGalleryProps {
  onSelectPersona?: (personaId: string) => void;
  isLoading?: boolean;
  language?: Language;
}

export const OmniAvatarGallery: React.FC<OmniAvatarGalleryProps> = ({
  onSelectPersona,
  isLoading,
  language = 'zh-TW',
}) => {
  const isZh = language === 'zh-TW';
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [hoveredAgentId, setHoveredAgentId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 text-center text-slate-500">
        {isZh ? '矩陣加載中...' : 'Matrix Loading...'}
      </div>
    );
  }

  const handleSelect = (agent: OmniAgentProfile) => {
    setSelectedAgentId(agent.id);
    onSelectPersona?.(agent.id);
  };

  return (
    <ErrorBoundary componentName="OmniAvatarGallery">
      <div className="omni-avatar-gallery p-6 h-full overflow-y-auto">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-amber-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
            {isZh ? '奧秘精靈' : 'Omni Sprites'}
          </h2>
          <p className="text-slate-400 mt-2 font-mono text-sm">
            {isZh
              ? '選擇一個要實例化為您的數位雙生的人格。'
              : 'Select a persona to instantiate as your digital twin.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {OMNI_AGENTS.map(agent => {
            const Icon = AGENT_ICONS[agent.id] || Sparkles;
            const isSelected = selectedAgentId === agent.id;
            const isHovered = hoveredAgentId === agent.id;

            // Color mapping
            let borderColor = 'border-slate-700';
            let glowColor = 'shadow-slate-500/0';
            if (agent.type === 'E') {
              borderColor = 'border-emerald-500/50';
              glowColor = 'shadow-emerald-500/20';
            }
            if (agent.type === 'S') {
              borderColor = 'border-rose-500/50';
              glowColor = 'shadow-rose-500/20';
            }
            if (agent.type === 'G') {
              borderColor = 'border-blue-500/50';
              glowColor = 'shadow-blue-500/20';
            }
            if (agent.type === 'U') {
              borderColor = 'border-amber-500/50';
              glowColor = 'shadow-amber-500/20';
            }

            if (isSelected) {
              borderColor = 'border-white';
              glowColor = 'shadow-cyan-500/50';
            }

            return (
              <motion.div
                key={agent.id}
                onMouseEnter={() => setHoveredAgentId(agent.id)}
                onMouseLeave={() => setHoveredAgentId(null)}
                onClick={() => handleSelect(agent)}
                className={`
                                    relative p-4 rounded-xl border-2 cursor-pointer
                                    bg-slate-900/80 backdrop-blur-sm transition-all duration-300
                                    ${borderColor} shadow-lg ${isSelected ? glowColor : ''}
                                `}
              >
                <div className="absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {agent.type}-TYPE
                </div>

                <div className="flex justify-center mb-4 mt-2">
                  <div
                    className={`
                                            w-12 h-12 rounded-full flex items-center justify-center
                                            bg-slate-800 border border-slate-600
                                            ${isHovered ? 'animate-pulse' : ''}
                                        `}
                  >
                    <Icon className={`w-6 h-6 text-${agent.color}-400`} />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-center text-slate-100 mb-1">
                  {isZh ? agent.alias : agent.name}
                </h3>
                <div className="text-xs text-center text-slate-500 mb-3 font-mono">
                  {isZh ? agent.name : agent.alias}
                </div>

                <div className="space-y-2 border-t border-slate-800 pt-3">
                  <div className="text-[10px] text-slate-400">
                    <span className="text-cyan-500 font-bold">
                      {isZh ? '核心能力: ' : 'Core: '}
                    </span>
                    {isZh ? agent.coreAbility['zh-TW'] : agent.coreAbility['en-US']}
                  </div>
                  <div className="text-[10px] text-slate-400 line-clamp-2">
                    <span className="text-amber-500 font-bold">{isZh ? '應用: ' : 'App: '}</span>
                    {isZh ? agent.application['zh-TW'] : agent.application['en-US']}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </ErrorBoundary>
  );
};
