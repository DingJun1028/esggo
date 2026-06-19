import React, { useState } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Button,
  Badge,
  ScrollArea,
} from '@/components/ui';
import { GOLDEN_ALLIANCE_MISSIONS, GoldenMission } from '@/data/golden-alliance-missions';
import { Sword, Trophy, Lock, AlertCircle } from 'lucide-react';
import { MissionScenarioPlayer } from './MissionScenarioPlayer';
import { CombatDecisionInterface } from './CombatDecisionInterface';
import { useAgentRpg } from '@/hooks/useAgentRpg';
import { useSovereignSystem } from '@/contexts/SovereignContext';
import { OmniSustainableGrowth } from '@/services/OmniSustainableGrowth';

const DRIFT_VALUE = 5;
const XP_MULTIPLIER = 100;
const SUBSTRING_LIMIT = 16;

interface SovereignAllianceMissionsProps {
  mentorIdFilter?: string; // Optional: Show only missions for a specific mentor
  onClose?: () => void;
}

export const SovereignAllianceMissions: React.FC<SovereignAllianceMissionsProps> = ({
  mentorIdFilter,
  onClose,
}) => {
  const [activeMission, setActiveMission] = useState<GoldenMission | null>(null);
  const [isPlayingScenario, setIsPlayingScenario] = useState(false);
  const [activeBossId, setActiveBossId] = useState<string | null>(null);
  const { gainXp, addBadge, unlockSkill, updateDrift } = useAgentRpg();
  const { recordImpact } = useSovereignSystem();

  const filteredMissions = mentorIdFilter
    ? GOLDEN_ALLIANCE_MISSIONS.filter(m => m.mentorId === mentorIdFilter)
    : GOLDEN_ALLIANCE_MISSIONS;

  const handleStartMission = (mission: GoldenMission) => {
    if (mission.scenarioId) {
      if (mission.scenarioId.startsWith('BOSS:')) {
        const parts = mission.scenarioId.split(':');
        const bossKey = parts[1];
        if (bossKey) {
          setActiveBossId(bossKey);
        }
      } else {
        setIsPlayingScenario(true);
      }
    } else {
      omniLogger.info(LogCategory.SYSTEM, '[SovereignAllianceMissions] Info', { data: `Starting mission: ${mission.title}` });
      alert(
        `Mission Started: ${mission.title}\nObjective: ${mission.objectives[0]}\n(Scenario Content Coming Soon)`
      );
    }
  };

  const handleScenarioComplete = (success: boolean) => {
    setIsPlayingScenario(false);
    if (success && activeMission) {
      alert(`MISSION ACCOMPLISHED! Rewards claimed: ${activeMission.rewards.itk} ITK`);

      // 1. Process Impact through Growth Engine
      const growthResult = OmniSustainableGrowth.processMissionImpact(
        activeMission.id,
        activeMission.rewards.itk
      );

      // 2. Award RPG Progress
      gainXp(growthResult.xpEarned);

      if (activeMission.rewards.badge) {
        addBadge({
          id: activeMission.id,
          name: activeMission.rewards.badge,
        });
      }

      // 3. Record to Impact Ledger
      recordImpact({
        type: activeMission.id.includes('carbon')
          ? 'ENVIRONMENTAL'
          : activeMission.id.includes('social')
            ? 'SOCIAL'
            : 'GOVERNANCE',
        description: `Mission: ${activeMission.title}`,
        metric: `${
          growthResult.metrics.carbonReduction > 0
            ? `-${growthResult.metrics.carbonReduction}t CO2e`
            : growthResult.metrics.communityImpact > 0
              ? `+${growthResult.metrics.communityImpact} Impact`
              : `+${(growthResult.metrics.transparencyBoost * 100).toFixed(0)}% Trust`
        }`,
      });

      // 4. Update Archetype Drift
      const driftE = activeMission.id.includes('carbon') ? DRIFT_VALUE : 0;
      const driftS = activeMission.id.includes('social') ? DRIFT_VALUE : 0;
      const driftG = !driftE && !driftS ? DRIFT_VALUE : 0;
      updateDrift(driftE, driftS, driftG);

      // 5. Handle Trait Unlocks
      growthResult.traitsUnlocked.forEach(trait => {
        alert(`REGENERATIVE TRAIT UNLOCKED: ${trait.name}`);
      });
    } else if (!success) {
      alert('Mission Failed. Try again.');
    }
  };

  return (
    <Card className="w-full h-full bg-slate-950 border-slate-800 flex flex-col">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl text-primary flex items-center gap-2">
              <Trophy className="text-primary" /> Sovereign Alliance Missions
            </CardTitle>
            <CardDescription className="text-slate-400">
              Prove your worth to the Legendary Mentors. Reduce Entropy. Earn Omni Cards.
            </CardDescription>
          </div>
          {onClose && (
            <Button variant="ghost" onClick={onClose} className="text-slate-400 hover:text-white">
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex overflow-hidden">
        {/* Mission List */}
        <ScrollArea className="w-1/3 border-r border-slate-800 p-4">
          <div className="space-y-3">
            {filteredMissions.map(mission => (
              <div
                key={mission.id}
                onClick={() => setActiveMission(mission)}
                className={`
                                    p-4 rounded-lg cursor-pointer transition-all border
                                    ${
                                      activeMission?.id === mission.id
                                        ? 'bg-sky-950/30 border-primary/50'
                                        : 'bg-slate-900 border-slate-800 hover:border-slate-600'
                                    }
                                `}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4
                    className={`font-bold ${activeMission?.id === mission.id ? 'text-primary' : 'text-slate-200'}`}
                  >
                    {mission.title}
                  </h4>
                  {mission.difficulty === 'Legendary' && (
                    <Badge className="bg-purple-900 text-purple-300 border-purple-500/50">
                      LEGEND
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{mission.description}</p>
              </div>
            ))}
            {filteredMissions.length === 0 && (
              <div className="text-center text-slate-500 py-10">
                No specific missions available for this mentor yet.
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Mission Details */}
        <div className="flex-1 p-6 flex flex-col">
          {activeMission ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="border-primary text-primary">
                    ID: {activeMission.id}
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-800">
                    Monitor: {activeMission.mentorId}
                  </Badge>
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">{activeMission.title}</h2>
                <p className="text-slate-300 text-lg leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                  &quot;{activeMission.description}&quot;
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-400 uppercase text-sm flex items-center gap-2">
                    <AlertCircle size={16} /> Objectives
                  </h3>
                  <ul className="space-y-2">
                    {activeMission.objectives.map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-2 text-slate-300 bg-slate-900 p-2 rounded"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-slate-400 uppercase text-sm flex items-center gap-2">
                    <Trophy size={16} /> Rewards
                  </h3>
                  <div className="bg-sky-950/20 p-4 rounded-xl border border-primary/20 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Impact Tokens</span>
                      <span className="text-primary font-mono font-bold text-xl">
                        {activeMission.rewards.itk} ITK
                      </span>
                    </div>
                    {activeMission.rewards.cardUuid && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Omni Card</span>
                        <Badge className="bg-purple-900 text-purple-200 border-purple-500">
                          {activeMission.rewards.cardUuid}
                        </Badge>
                      </div>
                    )}
                    {activeMission.rewards.badge && (
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400">Honor Badge</span>
                        <span className="text-emerald-400 font-bold">
                          {activeMission.rewards.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-auto pt-6">
                <Button
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/80 text-black shadow-[0_0_20px_rgba(13,242,238,0.3)]"
                  onClick={() => handleStartMission(activeMission)}
                >
                  <Sword className="mr-2" /> ACCEPT CHALLENGE
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <Lock size={48} className="mb-4 opacity-30" />
              <p>Select a Mission to inspect Protocol Requirements</p>
            </div>
          )}
        </div>
      </CardContent>
      {isPlayingScenario && activeMission?.scenarioId && (
        <MissionScenarioPlayer
          scenarioId={activeMission.scenarioId}
          onComplete={handleScenarioComplete}
          onClose={() => setIsPlayingScenario(false)}
        />
      )}
      {activeBossId && (
        <CombatDecisionInterface
          bossId={activeBossId}
          onVictory={() => {
            handleScenarioComplete(true);
            setActiveBossId(null);
          }}
          onDefeat={() => {
            handleScenarioComplete(false);
            setActiveBossId(null);
          }}
          onClose={() => setActiveBossId(null)}
        />
      )}
    </Card>
  );
};
