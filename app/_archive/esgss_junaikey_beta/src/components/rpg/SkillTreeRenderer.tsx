import React from 'react';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { SKILL_TREE } from '../../data/rpg-data';
import { SkillNode } from '../../types/rpg';
import { Lock, Check, Star } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '../../components/ui';

export const SkillTreeRenderer: React.FC = () => {
  const { profile, unlockSkill } = useAgentRpg();

  // Map x,y coords to visual layout
  // Center is 0,0
  const BOX_SIZE = 80;
  const GAP = 40;

  const getRarityColor = (rarity: SkillNode['rarity']) => {
    switch (rarity) {
      case 'Common':
        return 'border-slate-500 text-slate-400';
      case 'Uncommon':
        return 'border-emerald-500 text-emerald-400';
      case 'Rare':
        return 'border-blue-500 text-blue-400';
      case 'Epic':
        return 'border-purple-500 text-purple-400';
      case 'Legendary':
        return 'border-amber-500 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
      case 'Mythic':
        return 'border-fuchsia-500 text-fuchsia-400 shadow-[0_0_25px_rgba(217,70,239,0.6)] animate-pulse';
      default:
        return 'border-slate-500 text-slate-400';
    }
  };

  const renderNode = (node: SkillNode) => {
    const isUnlocked = profile.unlockedSkills.includes(node.id);
    const canUnlock =
      !isUnlocked &&
      profile.availableSkillPoints >= node.cost &&
      (!node.requirements || node.requirements.every(req => profile.unlockedSkills.includes(req)));

    // Adjusted Center for larger tree
    const centerX = 400; // Wider canvas
    const centerY = 400; // Taller canvas
    const left = centerX + node.position.x * (BOX_SIZE + GAP);
    const top = centerY + node.position.y * (BOX_SIZE + GAP);

    const rarityStyle = getRarityColor(node.rarity);

    return (
      <TooltipProvider key={node.id}>
        <Tooltip>
          <TooltipTrigger
            onClick={() => canUnlock && unlockSkill(node.id)}
            className={`
                        absolute w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-110 z-10
                        ${
                          isUnlocked
                            ? `bg-slate-900/80 ${rarityStyle} opacity-100`
                            : canUnlock
                              ? `bg-slate-800 ${rarityStyle} animate-pulse`
                              : 'bg-slate-950 border-slate-800 text-slate-700 opacity-50 grayscale'
                        }
                    `}
            style={{ left, top }}
          >
            {isUnlocked ? <Check size={24} /> : canUnlock ? <Star size={24} /> : <Lock size={24} />}
            <span className="text-[9px] uppercase font-bold mt-1 text-center px-1 leading-tight">
              {node.name}
            </span>
          </TooltipTrigger>
          <TooltipContent className="bg-slate-900 border-slate-700 text-slate-200 w-64 p-3 shadow-xl">
            <div
              className={`font-bold mb-1 text-sm ${node.rarity === 'Legendary' || node.rarity === 'Mythic' ? 'text-amber-400' : 'text-white'}`}
            >
              {node.name}{' '}
              <span className="text-[10px] opacity-70 ml-2 border border-slate-600 px-1 rounded">
                {node.rarity}
              </span>
            </div>
            <div className="text-xs text-slate-400 mb-2 italic">{node.description}</div>
            <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800 pt-2">
              <div className="flex flex-col">
                <span className="text-slate-500">Cost</span>
                <span className={canUnlock ? 'text-amber-400 font-bold' : 'text-slate-300'}>
                  {node.cost} SP
                </span>
              </div>
              {node.modifiers && (
                <div className="flex flex-col">
                  <span className="text-slate-500">Stats</span>
                  {Object.entries(node.modifiers).map(([key, val]) => (
                    <span key={key} className="text-emerald-400 capitalize">
                      +{val} {key}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  };

  return (
    <div className="relative w-full h-[800px] bg-slate-950 rounded-lg border border-slate-800 overflow-hidden shadow-inner cursor-move bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <div className="absolute top-4 left-4 z-20">
        <div className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-1">
          Neural Skill Matrix
        </div>
        <div className="text-2xl font-black text-slate-700 tracking-tighter">
          OMNI<span className="text-emerald-500">MIND</span>
        </div>
      </div>

      {/* Render Edges */}
      <svg className="absolute inset-0 pointer-events-none w-full h-full opacity-40">
        <defs>
          <linearGradient id="edge-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
        </defs>
        {SKILL_TREE.edges.map((edge, i) => {
          const source = SKILL_TREE.nodes.find(n => n.id === edge.source);
          const target = SKILL_TREE.nodes.find(n => n.id === edge.target);
          if (!source || !target) return null;

          const cx = 400;
          const cy = 400;
          const off = 40; // Half box size
          const x1 = cx + source.position.x * 120 + off;
          const y1 = cy + source.position.y * 120 + off;
          const x2 = cx + target.position.x * 120 + off;
          const y2 = cy + target.position.y * 120 + off;

          const isTargetUnlocked = profile.unlockedSkills.includes(edge.target);

          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={isTargetUnlocked ? '#10b981' : '#334155'}
              strokeWidth={isTargetUnlocked ? '3' : '1'}
              className="transition-all duration-1000"
            />
          );
        })}
      </svg>

      {SKILL_TREE.nodes.map(renderNode)}
    </div>
  );
};
