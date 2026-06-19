import React, { memo, useMemo } from 'react';
import { Card, Progress, Badge } from '@/components/ui';
import { Cloud, Zap, ShieldCheck, Target, TrendingUp, Info } from 'lucide-react';
import { useCoreSystem } from '@/hooks/useCoreSystem';
import type { Goal, KeyResult } from '@/core/goal/GoalManager';

// ==================== SUB-COMPONENTS ====================

const KeyResultItem = memo<{ kr: KeyResult }>(({ kr }) => {
  return (
    <div className="group/kr flex flex-col gap-1 text-xs">
      <div className="flex justify-between items-center text-slate-400 group-hover/kr:text-indigo-300 transition-colors">
        <span className="truncate">{kr.description}</span>
        <span className="font-mono">
          {Math.round(kr.currentValue)}
          {kr.unit} / {kr.targetValue}
          {kr.unit}
        </span>
      </div>
      <Progress
        value={kr.progress}
        className="h-1 bg-slate-800"
        indicatorClassName="bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]"
      />
    </div>
  );
});

KeyResultItem.displayName = 'KeyResultItem';

const OKRCard = memo<{ goal: Goal }>(({ goal }) => {
  const isCloud = goal.type === 'Cloud';
  const Icon = isCloud ? Cloud : Zap;
  const themeColor = isCloud ? 'text-sky-400' : 'text-purple-400';
  const glowBorder = isCloud
    ? 'hover:border-sky-500/50 hover:shadow-[0_0_20px_rgba(56,189,248,0.1)]'
    : 'hover:border-purple-500/50 hover:shadow-[0_0_20px_rgba(192,132,252,0.1)]';

  return (
    <Card
      className={`p-4 h-full flex flex-col gap-4 border-slate-800/50 bg-slate-900/40 backdrop-blur-xl transition-all duration-500 ${glowBorder}`}
    >
      <header className="flex justify-between items-start">
        <div className="flex gap-3">
          <div className={`p-2 rounded-lg bg-slate-900/80 border border-slate-700 ${themeColor}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
              {goal.description}
            </h4>
            <div className="flex gap-1 mt-1">
              {goal.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="text-[9px] py-0 px-1 border-slate-700 text-slate-500"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-xl font-black font-mono tracking-tighter ${themeColor}`}>
            {Math.round(goal.progress)}%
          </span>
          <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
            Resonance
          </span>
        </div>
      </header>

      <div className="flex-1 space-y-4 py-2">
        {goal.keyResults.map(kr => (
          <KeyResultItem key={kr.id} kr={kr} />
        ))}
      </div>

      <footer className="mt-auto pt-3 border-t border-slate-800 flex justify-between items-center">
        <div className="flex items-center gap-1 text-[10px] text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-500" />
          <span>Protocol Verified</span>
        </div>
        <button
          className="p-1 hover:bg-slate-800 rounded transition-colors"
          title="View Reasoning Chain"
        >
          <Info className="w-3 h-3 text-slate-600" />
        </button>
      </footer>
    </Card>
  );
});

OKRCard.displayName = 'OKRCard';

// ==================== MAIN COMPONENT ====================

export const OKRDashboard = memo(() => {
  const { goals } = useCoreSystem();

  const cloudOKRs = useMemo(() => goals.filter(g => g.type === 'Cloud'), [goals]);
  const pilotOKRs = useMemo(() => goals.filter(g => g.type === 'Pilot'), [goals]);

  return (
    <div className="flex flex-col gap-6 p-1">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-500" />
            STRATEGIC OKR TRACKER
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Bridges the gap between Cloud Infrastructure & AI Pilot performance.
          </p>
        </div>
        <div className="flex gap-4 text-right">
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Quarter
            </span>
            <span className="text-sm text-indigo-400 font-mono font-bold">2026.Q1</span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-slate-500 uppercase font-bold tracking-widest">
              Status
            </span>
            <div className="flex items-center gap-1 text-sm text-emerald-400 font-mono font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              ACTIVE
            </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Render Cloud Objectives */}
        {cloudOKRs.map(goal => (
          <OKRCard key={goal.id} goal={goal} />
        ))}

        {/* Render Pilot Objectives */}
        {pilotOKRs.map(goal => (
          <OKRCard key={goal.id} goal={goal} />
        ))}

        {/* Overview Stats Bento Box */}
        <Card className="p-4 bg-indigo-500/5 border-indigo-500/20 flex flex-col justify-between hover:border-indigo-500/40 transition-all duration-700">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              <h4 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                System Synergy
              </h4>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Cloud Alignment</span>
                <span className="text-sky-400 font-mono font-bold">High</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Pilot Resonance</span>
                <span className="text-purple-400 font-mono font-bold">Sovereign</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Gap Closure</span>
                <span className="text-emerald-400 font-mono font-bold">Accelerating</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-3 rounded bg-indigo-500/10 border border-indigo-500/20">
            <p className="text-[10px] text-indigo-300 leading-relaxed italic">
              "The pilot directs the ship, but the cloud provides the celestial map. Only in synergy
              can the sovereign ritual be complete."
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
});

OKRDashboard.displayName = 'OKRDashboard';
