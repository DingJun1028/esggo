import React, { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  Progress,
} from '@/components/ui';
import {
  Zap,
  Target,
  Activity,
  Brain,
  Shield,
  Sparkles,
  ChevronRight,
  ArrowUpCircle,
  Fingerprint,
  Dna,
  AlertCircle,
  Lock,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { OMNI_AGENTS } from '../../data/omni-agents';
import { EVOLUTION_THRESHOLDS } from '@/core/genesis/LogicGates';

import type { Language } from '@/types';

export interface ArchetypeForgeProps {
  language?: Language;
}

export const ArchetypeForge: React.FC<ArchetypeForgeProps> = ({ language = 'zh-TW' }) => {
  const isZh = language === 'zh-TW';
  const { profile, evolveAgent } = useAgentRpg();
  const [selectedArchetype, setSelectedArchetype] = useState<string | null>(null);
  const [evolutionResult, setEvolutionResult] = useState<{
    success: boolean;
    error?: string;
  } | null>(null);

  const candidates = useMemo(() => {
    // Omni agents are always candidates or based on highest drift
    const omni = OMNI_AGENTS.filter(a => a.type === 'U' && a.id !== profile.archetypeId);

    // Specialized agents based on drift thresholds (>20% to show, >30% to select)
    const specialized = OMNI_AGENTS.filter(a => {
      if (a.type === 'U') return false;
      if (a.id === profile.archetypeId) return false;

      const driftKey = a.type.toLowerCase() as keyof typeof profile.drift;
      return profile.drift[driftKey] > 15; // Show if > 15% visibility threshold
    });

    return [...specialized, ...omni];
  }, [profile]);

  const handleEvolve = () => {
    if (!selectedArchetype) return;
    const result = evolveAgent(selectedArchetype);
    setEvolutionResult(result);
    if (result.success) {
      setSelectedArchetype(null);
    }
  };

  const currentArchetype = OMNI_AGENTS.find(a => a.id === profile.archetypeId);

  return (
    <div className="space-y-8 p-6 animate-in fade-in slide-in-from-bottom-5 duration-1000">
      {/* HEADER */}
      <div className="text-center space-y-2">
        <Badge
          variant="outline"
          className="bg-primary/5 text-primary border-primary/20 px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase"
        >
          Evolution Chamber
        </Badge>
        <h2 className="text-4xl font-black text-white tracking-tighter">
          {isZh ? '原型進化' : 'Archetype Evolution'}
        </h2>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          {isZh
            ? '將您的代理人神經結構重塑為專業的 ESG 原型。'
            : "Reshape your agent's neural architecture into a specialized ESG archetype."}
        </p>
      </div>

      {/* CURRENT STATUS */}
      <div className="flex justify-center items-center gap-8 py-4">
        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Current State
          </div>
          <div className="w-24 h-24 rounded-full bg-slate-900 border-2 border-slate-800 flex items-center justify-center relative overflow-hidden group">
            <motion.div
              className="absolute inset-0 bg-primary/20"
              animate={{ opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <Fingerprint className="w-10 h-10 text-slate-500 group-hover:scale-110 transition-transform" />
          </div>
          <div className="mt-2 font-bold text-white text-xs">
            {isZh ? currentArchetype?.alias || '學徒' : currentArchetype?.name || 'Apprentice'}
          </div>
        </div>

        <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ChevronRight className="w-8 h-8 text-slate-700" />
        </motion.div>

        <div className="text-center">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">
            Evolution Goal
          </div>
          <div
            className={`w-24 h-24 rounded-full bg-slate-900 border-2 ${selectedArchetype ? 'border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'border-slate-800 border-dashed'} flex items-center justify-center relative overflow-hidden`}
          >
            {selectedArchetype ? (
              <>
                <motion.div
                  className="absolute inset-0 bg-primary/40"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                />
                <Sparkles className="w-10 h-10 text-white relative z-10" />
              </>
            ) : (
              <Target className="w-10 h-10 text-slate-700" />
            )}
          </div>
          <div className="mt-2 font-bold text-slate-400 text-xs text-center">
            {selectedArchetype
              ? (() => {
                  const a = OMNI_AGENTS.find(a => a.id === selectedArchetype);
                  return isZh ? a?.alias : a?.name;
                })()
              : isZh
                ? '未選擇'
                : 'Unselected'}
          </div>
        </div>
      </div>

      {/* ERROR DISPLAY */}
      <AnimatePresence>
        {evolutionResult && !evolutionResult.success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-sm font-bold"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            {evolutionResult.error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* CANDIDATES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {candidates.map(a => {
          const driftMapping: Record<string, keyof typeof profile.drift> = {
            E: 'e',
            S: 's',
            G: 'g',
            U: 'e',
          };
          const driftKey = driftMapping[a.type];
          const driftVal = driftKey ? profile.drift[driftKey] : 0;

          // Logic Gate Check: XP & Drift
          // We assume Tier 1 to 2 for now as the logic gate
          const tierGate = EVOLUTION_THRESHOLDS.TIER_1_TO_2;
          const isXpEligible = profile.xp >= tierGate.XP_REQUIRED;
          const isDriftEligible = driftVal >= 30 || a.type === 'U';
          const isEligible = isXpEligible && isDriftEligible;

          return (
            <Card
              key={a.id}
              className={`relative overflow-hidden cursor-pointer transition-all duration-300 border-white/5 ${
                selectedArchetype === a.id
                  ? 'bg-primary/10 border-primary ring-1 ring-primary/50'
                  : 'bg-slate-900/40 hover:bg-slate-900/60'
              }`}
              onClick={() => {
                if (isEligible) {
                  setSelectedArchetype(a.id);
                  setEvolutionResult(null);
                }
              }}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <Badge
                    variant="outline"
                    className={`text-[9px] uppercase tracking-tighter ${
                      a.type === 'E'
                        ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5'
                        : a.type === 'S'
                          ? 'text-rose-400 border-rose-500/20 bg-rose-500/5'
                          : a.type === 'G'
                            ? 'text-blue-400 border-blue-500/20 bg-blue-500/5'
                            : 'text-amber-400 border-amber-500/20 bg-amber-500/5'
                    }`}
                  >
                    {a.type === 'E'
                      ? 'Environmental'
                      : a.type === 'S'
                        ? 'Social'
                        : a.type === 'G'
                          ? 'Governance'
                          : 'Omni'}
                  </Badge>
                  {!isEligible && <Lock className="w-3.5 h-3.5 text-slate-600" />}
                </div>
                <CardTitle className="text-xl font-black text-white mt-1 opacity-90">
                  {isZh ? a.alias : a.name}
                </CardTitle>
                <CardDescription className="text-xs text-slate-500 line-clamp-2">
                  {isZh ? a.description['zh-TW'] : a.description['en-US']}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Drift Alignment</span>
                    <span className={driftVal >= 30 ? 'text-green-500' : 'text-slate-400'}>
                      {driftVal.toFixed(0)} / 30%
                    </span>
                  </div>
                  <Progress
                    value={Math.min((driftVal / 30) * 100, 100)}
                    className="h-1 bg-white/5"
                  />
                </div>

                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Logic Gate (XP)</span>
                    <span className={isXpEligible ? 'text-green-500' : 'text-amber-500'}>
                      {profile.xp} / {tierGate.XP_REQUIRED}
                    </span>
                  </div>
                  <Progress
                    value={Math.min((profile.xp / tierGate.XP_REQUIRED) * 100, 100)}
                    className={`h-1 ${isXpEligible ? 'bg-green-500/20' : 'bg-amber-500/20'}`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="text-[9px] text-slate-500 font-bold uppercase">
                      Core Ability
                    </div>
                    <div className="text-[10px] font-bold text-white truncate">
                      {isZh ? a.coreAbility['zh-TW'] : a.coreAbility['en-US']}
                    </div>
                  </div>
                  <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                    <div className="text-[9px] text-slate-500 font-bold uppercase">Application</div>
                    <div className="text-[10px] font-bold text-white truncate">
                      {isZh ? a.application['zh-TW'] : a.application['en-US']}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ACTION FOOTER */}
      <div className="flex flex-col items-center gap-4 pt-4">
        <Button
          size="lg"
          disabled={!selectedArchetype}
          onClick={handleEvolve}
          className="w-full max-w-sm h-14 rounded-2xl font-black text-lg bg-primary hover:bg-primary/90 text-white shadow-2xl shadow-primary/20 transition-all active:scale-95 group"
        >
          <ArrowUpCircle className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform" />
          {isZh ? '啟動進化' : 'INITIATE EVOLUTION'}
        </Button>
        <div className="flex items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
          <div className="flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-primary" />
            Genetic Rewrite
          </div>
          <div className="w-1 h-1 rounded-full bg-slate-800" />
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-yellow-500" />
            +5 SP Bonus
          </div>
        </div>
      </div>
    </div>
  );
};

const LockIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
