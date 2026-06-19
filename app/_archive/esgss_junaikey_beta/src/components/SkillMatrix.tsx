import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Badge,
  Button,
  ScrollArea,
  Progress,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui';
import {
  Zap,
  Lock,
  Unlock,
  Target,
  Award,
  Shield,
  Cpu,
  Brain,
  Activity,
  Sparkles,
  ChevronRight,
  Search,
  Filter,
  Infinity,
} from 'lucide-react';
import { SkillNode } from '../types/rpg';
import { useQuantumResonance } from '../hooks/useQuantumResonance';
import { useWorldEvents } from '../hooks/useWorldEvents';
import { useAgentRpg } from '../hooks/useAgentRpg';
import { SKILL_TREE } from '../data/rpg-data';

export const SkillMatrix: React.FC = () => {
  const { profile, unlockSkill } = useAgentRpg();
  const { evolvedSkills } = useQuantumResonance();
  const { events } = useWorldEvents();
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const branches = [
    { id: 'all', name: 'All Branches', icon: Target },
    { id: 'Analysis', name: 'Analysis', icon: Cpu },
    { id: 'Wisdom', name: 'Wisdom', icon: Brain },
    { id: 'Empathy', name: 'Empathy', icon: Activity },
    { id: 'Adaptation', name: 'Adaptation', icon: Shield },
    { id: 'Omni', name: 'Omni-Arts', icon: Infinity },
  ];

  const filteredNodes = SKILL_TREE.nodes.filter(node => {
    const matchesBranch = selectedBranch === 'all' || node.branch === selectedBranch;
    const matchesSearch =
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesBranch && matchesSearch;
  });

  const isUnlocked = (skillId: string) => profile.unlockedSkills.includes(skillId);

  const canUnlock = (node: SkillNode) => {
    if (isUnlocked(node.id)) return false;
    if (profile.availableSkillPoints < node.cost) return false;
    if (node.requirements && !node.requirements.every(req => profile.unlockedSkills.includes(req)))
      return false;
    return true;
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'Legendary':
        return 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10';
      case 'Epic':
        return 'text-purple-400 border-purple-400/50 bg-purple-400/10';
      case 'Rare':
        return 'text-blue-400 border-blue-400/50 bg-blue-400/10';
      case 'Uncommon':
        return 'text-green-400 border-green-400/50 bg-green-400/10';
      case 'Mythic':
        return 'text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 border-purple-400/50 bg-purple-900/20';
      default:
        return 'text-slate-400 border-slate-400/50 bg-slate-400/10';
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-700 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3 text-primary tracking-tight">
            <Award className="w-8 h-8 text-yellow-500" />
            Skill Matrix Core
          </h1>
          <p className="text-slate-400">
            Unlock neural capabilities through evolutionary progression
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-slate-900/80 p-1 rounded-2xl border border-white/5 shadow-2xl backdrop-blur-xl">
        <div className="px-6 py-2 border-r border-white/5">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
            Available Points
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-2xl font-black text-white">{profile.availableSkillPoints}</span>
          </div>
        </div>
        <div className="px-6 py-2">
          <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1">
            Agent Level
          </div>
        </div>
      </div>

      {/* FILTERS & SEARCH */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex flex-wrap gap-2 flex-grow">
          {branches.map(branch => (
            <Button
              key={branch.id}
              variant={selectedBranch === branch.id ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedBranch(branch.id)}
              className={`rounded-full transition-all duration-300 ${
                selectedBranch === branch.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                  : 'hover:bg-white/5 border-white/10'
              }`}
            >
              <branch.icon className="w-4 h-4 mr-2" />
              {branch.name}
            </Button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search matrix..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/50 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      </div>

      {/* SKILL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNodes.map(node => {
          const unlocked = isUnlocked(node.id);
          const canBuy = canUnlock(node);

          return (
            <Card
              key={node.id}
              className={`group relative overflow-hidden transition-all duration-500 border-white/5 ${
                unlocked
                  ? node.rarity === 'Mythic'
                    ? 'bg-purple-950/40 border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.2)]'
                    : 'bg-cyan-950/20 border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.1)]'
                  : 'bg-slate-900/40 opacity-80 hover:opacity-100'
              } ${!unlocked && !canBuy ? 'grayscale-[0.5]' : ''}
                ${unlocked && node.id === 's_omni_genesis' ? 'animate-[pulse_4s_ease-in-out_infinite] shadow-[0_0_100px_rgba(255,255,255,0.6)] border-white/80 bg-black' : ''}`}
            >
              {unlocked && (
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500" />
              )}

              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge variant="outline" className={`text-[10px] ${getRarityColor(node.rarity)}`}>
                    {node.rarity}
                  </Badge>
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">
                    Tier {node.tier}
                  </div>
                  {evolvedSkills && (evolvedSkills as any).id === node.id && (
                    <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50 text-[8px] animate-pulse">
                      EVOLVED
                    </Badge>
                  )}
                  {/* Phase 38 Nexus Resonance */}
                  {events.some(e => e.category === (node as any).branch?.toUpperCase()) && (
                    <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50 text-[8px] animate-bounce">
                      PULSE RESONANCE
                    </Badge>
                  )}
                </div>
                <CardTitle
                  className={`text-lg font-black mt-2 transition-colors ${
                    unlocked ? 'text-cyan-400' : 'text-white group-hover:text-primary'
                  }`}
                >
                  {node.name}
                </CardTitle>
                <CardDescription className="text-xs line-clamp-2 h-8 text-slate-400">
                  {node.description}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Passive Modifiers */}
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(node.modifiers || {}).map(([attr, val]) => (
                    <div
                      key={attr}
                      className="flex items-center gap-1.5 text-[10px] text-slate-500 bg-black/20 p-1.5 rounded-lg border border-white/5"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
                      <span className="capitalize">{attr}:</span>
                      <span className="font-bold text-slate-300">+{val}</span>
                    </div>
                  ))}
                </div>

                {/* Requirements */}
                {node.requirements && node.requirements.length > 0 && !unlocked && (
                  <div className="space-y-1">
                    <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">
                      Requirements
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {node.requirements.map(reqId => {
                        const reqNode = SKILL_TREE.nodes.find(n => n.id === reqId);
                        const reqUnlocked = isUnlocked(reqId);
                        return (
                          <Badge
                            key={reqId}
                            variant="outline"
                            className={`text-[8px] py-0 ${reqUnlocked ? 'text-green-500 border-green-500/20' : 'text-red-500 border-red-500/20'}`}
                          >
                            {reqNode?.name || reqId}
                          </Badge>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="pt-2">
                  <Button
                    className={`w-full h-10 rounded-xl font-bold transition-all duration-300 ${
                      unlocked
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                        : canBuy
                          ? 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20'
                          : 'bg-slate-800 text-slate-500 opacity-50 cursor-not-allowed'
                    }`}
                    disabled={!canBuy || unlocked}
                    onClick={() => unlockSkill(node.id)}
                  >
                    {unlocked ? (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Capability Active
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Unlock for {node.cost} SP
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* EMPTY STATE */}
      {filteredNodes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 border border-dashed border-white/10 rounded-3xl">
          <Search className="w-12 h-12 text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-500">No capabilities found</h3>
          <p className="text-slate-600">Try adjusting your filters or search term</p>
        </div>
      )}
    </div>
  );
};
