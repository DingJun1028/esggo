import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
  Progress,
} from '@/components/ui';
import {
  Flag,
  Users,
  Activity,
  Clock,
  Shield,
  Globe,
  Zap,
  ChevronRight,
  Play,
  Loader2,
  CheckCircle2,
  Lock,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMissionSystem, Mission } from '../../hooks/useMissionSystem';
import { useAgentRpg } from '../../hooks/useAgentRpg';
import { OMNI_AGENTS } from '../../data/omni-agents';
import { ImpactCertificate } from './ImpactCertificate';

export const MissionCenter: React.FC = () => {
  const { profile } = useAgentRpg();
  const {
    activeMissionId,
    missionStartTime,
    party,
    setParty,
    startMission,
    completeMission,
    calculateSynergy,
    availableMissions,
  } = useMissionSystem();

  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastResult, setLastResult] = useState<any>(null);

  const selectedMission = availableMissions.find(m => m.id === selectedMissionId);
  const activeMission = availableMissions.find(m => m.id === activeMissionId);

  // Simulation logic
  useEffect(() => {
    let interval: any;
    if (isExecuting && activeMission) {
      interval = setInterval(() => {
        setProgress(prev => {
          const next = prev + 100 / (activeMission.duration * 10); // 10 updates per second
          if (next >= 100) {
            clearInterval(interval);
            handleMissionComplete();
            return 100;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isExecuting, activeMission]);

  const handleStart = () => {
    if (!selectedMissionId) return;
    startMission(selectedMissionId);
    setIsExecuting(true);
    setProgress(0);
  };

  const handleMissionComplete = () => {
    if (!activeMissionId) return;
    const result = completeMission(activeMissionId);
    setLastResult(result);
    setIsExecuting(false);
  };

  const togglePartyMember = (agentId: string) => {
    if (party.includes(agentId)) {
      setParty((prev: string[]) => prev.filter(id => id !== agentId));
    } else if (party.length < 3) {
      setParty((prev: string[]) => [...prev, agentId]);
    }
  };

  if (lastResult) {
    return (
      <div className="py-12">
        <ImpactCertificate {...lastResult} onClose={() => setLastResult(null)} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <Badge
            variant="outline"
            className="text-[10px] font-bold tracking-widest text-primary border-primary/20 bg-primary/5 px-3 py-0.5 rounded-full mb-2"
          >
            Strategic Command
          </Badge>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <Flag className="w-8 h-8 text-primary" />
            Omni-Mission Center
          </h2>
          <p className="text-slate-400 text-sm">
            Deploy evolved agent clusters to solve global systemic challenges.
          </p>
        </div>

        <div className="flex items-center gap-4 bg-slate-900/50 p-3 rounded-2xl border border-white/5">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-bold uppercase">Impact Authority</div>
            <div className="text-sm font-black text-white">
              Tier {Math.floor(profile.level / 5) + 1}
            </div>
          </div>
          <div className="h-8 w-px bg-white/5" />
          <div className="p-2 bg-primary/10 rounded-xl">
            <Shield className="w-5 h-5 text-primary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* MISSION BOARD */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-slate-950/40 border-white/5 shadow-2xl backdrop-blur-xl h-[650px] flex flex-col overflow-hidden">
            <CardHeader className="border-b border-white/5 bg-white/5">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg font-bold">Active Mission Board</CardTitle>
                  <CardDescription>Available ESG strategic directives</CardDescription>
                </div>
                <Badge variant="secondary" className="bg-slate-800 text-slate-300">
                  {availableMissions.length} Missions Open
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-grow p-0">
              <ScrollArea className="h-full p-6">
                <div className="space-y-4">
                  {availableMissions.map(m => {
                    const isLocked =
                      m.requirements?.minLevel && profile.level < m.requirements.minLevel;
                    const isSelected = selectedMissionId === m.id;

                    return (
                      <motion.div
                        key={m.id}
                        whileHover={!isLocked ? { scale: 1.01, x: 5 } : {}}
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? 'bg-primary/10 border-primary ring-1 ring-primary/30'
                            : isLocked
                              ? 'bg-black/20 border-white/5 opacity-60 cursor-not-allowed'
                              : 'bg-white/5 border-white/10 hover:border-white/20'
                        }`}
                        onClick={() => !isLocked && !isExecuting && setSelectedMissionId(m.id)}
                      >
                        <div className="flex gap-5">
                          <div
                            className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
                              m.type === 'E'
                                ? 'bg-emerald-500/10 text-emerald-500'
                                : m.type === 'S'
                                  ? 'bg-rose-500/10 text-rose-500'
                                  : m.type === 'G'
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : 'bg-amber-500/10 text-amber-500'
                            }`}
                          >
                            {m.type === 'E' ? (
                              <Globe className="w-7 h-7" />
                            ) : m.type === 'S' ? (
                              <Users className="w-7 h-7" />
                            ) : m.type === 'G' ? (
                              <Shield className="w-7 h-7" />
                            ) : (
                              <Sparkles className="w-7 h-7" />
                            )}
                          </div>

                          <div className="flex-grow space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex items-center gap-2">
                                <h3 className="font-black text-white group-hover:text-primary transition-colors">
                                  {m.title}
                                </h3>
                                {isLocked && <Lock className="w-3 h-3 text-slate-600" />}
                              </div>
                              <Badge
                                variant="outline"
                                className="text-[9px] uppercase tracking-tighter border-white/10 text-slate-500"
                              >
                                Diff {m.difficulty}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-1">{m.description}</p>

                            <div className="flex items-center gap-6 pt-1">
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                <Zap className="w-3 h-3 text-yellow-500" />
                                {m.rewards.xp} XP
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                <Activity className="w-3 h-3 text-emerald-500" />
                                {m.rewards.impactScore} Impact
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                                <Clock className="w-3 h-3 text-blue-500" />
                                {m.duration}s
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        {/* PARTY & ACTION PANEL */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-white/10 shadow-2xl relative overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-black flex items-center gap-2 text-primary uppercase tracking-widest">
                <Users className="w-4 h-4" />
                Cluster Assembly
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* SELECTED PARTY */}
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map(i => {
                  const agentId = party[i];
                  const agent = OMNI_AGENTS.find(a => a.id === agentId);
                  return (
                    <div
                      key={i}
                      className={`aspect-square rounded-2xl border-2 border-dashed flex flex-col items-center justify-center p-2 text-center transition-all ${
                        agent ? 'border-primary bg-primary/5' : 'border-white/5 bg-black/20'
                      }`}
                    >
                      {agent ? (
                        <>
                          <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center mb-1 border border-white/10">
                            <Activity className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-[9px] font-bold text-white truncate w-full">
                            {agent.alias}
                          </div>
                        </>
                      ) : (
                        <div className="text-[8px] font-bold text-slate-700 uppercase tracking-tighter">
                          Empty Slot
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AGENT SELECTOR */}
              <div className="space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  Available Archetypes
                </div>
                <ScrollArea className="h-48 border border-white/5 rounded-xl bg-black/20 p-2">
                  <div className="space-y-2">
                    {OMNI_AGENTS.map(a => {
                      const isActive = party.includes(a.id);
                      return (
                        <div
                          key={a.id}
                          className={`p-2 rounded-lg border text-[11px] font-bold cursor-pointer flex justify-between items-center transition-all ${
                            isActive
                              ? 'bg-primary border-primary text-white'
                              : 'bg-white/5 border-white/5 text-slate-400 hover:border-primary/50'
                          }`}
                          onClick={() => !isExecuting && togglePartyMember(a.id)}
                        >
                          <span className="truncate">
                            {a.alias} ({a.type})
                          </span>
                          {isActive && <CheckCircle2 className="w-3 h-3" />}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </div>

              {/* MISSION SUMMARY & SYNERGY */}
              {selectedMission && (
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20 space-y-3 animate-in fade-in zoom-in-95 duration-300">
                  <div className="flex justify-between items-center">
                    <div className="text-[10px] font-bold text-primary uppercase">
                      Cluster Synergy
                    </div>
                    <div className="text-xl font-black text-white">
                      x{calculateSynergy(selectedMissionId!).toFixed(2)}
                    </div>
                  </div>
                  <Progress
                    value={calculateSynergy(selectedMissionId!) * 33.3}
                    className="h-1 bg-white/5"
                  />
                  <p className="text-[10px] text-slate-500 italic">
                    Party synergy amplifies XP and Impact yield.
                  </p>
                </div>
              )}

              {/* EXECUTION BUTTON */}
              <div className="space-y-4">
                <Button
                  className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-lg shadow-xl shadow-primary/20 transition-all active:scale-95 group"
                  disabled={!selectedMissionId || isExecuting}
                  onClick={handleStart}
                >
                  {isExecuting ? (
                    <>
                      <Loader2 className="w-6 h-6 mr-3 animate-spin" />
                      EXECUTING...
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform" />
                      {selectedMissionId ? 'DEPLOY PARTY' : 'SELECT MISSION'}
                    </>
                  )}
                </Button>

                {isExecuting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      <span>Analysis Progress</span>
                      <span className="text-primary">{progress.toFixed(0)}%</span>
                    </div>
                    <Progress value={progress} className="h-1 bg-white/5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="p-4 bg-slate-900/50 border border-white/5 rounded-2xl flex items-start gap-3">
            <AlertCircle className="w-4 h-4 text-cyan-400 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed">
              <span className="text-white font-bold">Pro-tip:</span> Assigning an agent of the same
              type as the mission provides a <span className="text-primary font-bold">+20%</span>{' '}
              synergy bonus.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
