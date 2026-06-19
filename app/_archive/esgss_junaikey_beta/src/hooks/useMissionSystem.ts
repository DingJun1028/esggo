import { useState, useCallback, useEffect } from 'react';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { useAgentRpg } from './useAgentRpg';
import { useSovereignSession } from './useSovereignSession';
import { OMNI_AGENTS } from '../data/omni-agents';

export interface Mission {
  id: string;
  title: string;
  description: string;
  type: 'E' | 'S' | 'G' | 'Hybrid';
  difficulty: number; // 1-10
  duration: number; // in seconds for simulation
  rewards: {
    xp: number;
    sp?: number;
    impactScore: number;
  };
  requirements?: {
    minLevel?: number;
    requiredTypes?: ('E' | 'S' | 'G')[];
  };
}

export interface MissionRecord {
  id: string;
  missionId: string;
  title: string;
  type: 'E' | 'S' | 'G' | 'Hybrid';
  xpGained: number;
  impactGained: number;
  synergy: number;
  timestamp: string;
  certificateId: string;
  bioId?: string;
  // Phase 42: Harmonization Logs
  validationMode?: 'QUANTUM' | 'SWARM' | 'STANDARD';
  bioVerified?: boolean;
}

export const AVAILABLE_MISSIONS: Mission[] = [
  {
    id: 'm_01',
    title: '淨零轉型盤查',
    description: '為全球製造中心執行全面的碳足跡盤查。',
    type: 'E',
    difficulty: 3,
    duration: 10,
    rewards: { xp: 200, impactScore: 45 },
  },
  {
    id: 'm_02',
    title: '供應鏈道德掃描',
    description: '偵測並緩解第三層供應商的勞工權益風險。',
    type: 'S',
    difficulty: 4,
    duration: 15,
    rewards: { xp: 350, impactScore: 60 },
  },
  {
    id: 'm_03',
    title: '全球合規同步',
    description: '使企業治理與歐盟最新永續報告指令 (CSRD) 接軌。',
    type: 'G',
    difficulty: 5,
    duration: 20,
    rewards: { xp: 500, impactScore: 80 },
  },
  {
    id: 'm_04',
    title: '深度脫碳策略',
    description: '為重工業部門制定數據驅動的絕對零排路徑。',
    type: 'Hybrid',
    difficulty: 8,
    duration: 45,
    rewards: { xp: 1200, sp: 1, impactScore: 150 },
    requirements: { minLevel: 10, requiredTypes: ['E', 'G'] },
  },
];

export const useMissionSystem = () => {
  const { profile, gainXp } = useAgentRpg();
  const { generateBioID, updateEntropy } = useSovereignSession();
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [missionStartTime, setMissionStartTime] = useState<number | null>(null);
  const [party, setParty] = useState<string[]>([]);
  const [history, setHistory] = useState<MissionRecord[]>(() => {
    const saved = localStorage.getItem('omni_mission_history');
    return saved ? JSON.parse(saved) : [];
  });

  const startMission = (missionId: string) => {
    const mission = AVAILABLE_MISSIONS.find(m => m.id === missionId);
    if (!mission) return;

    // Check level requirement
    if (mission.requirements?.minLevel && profile.level < mission.requirements.minLevel) {
      omniLogger.error(LogCategory.SYSTEM, '[useMissionSystem] Level too low');
      return;
    }

    setActiveMissionId(missionId);
    setMissionStartTime(Date.now());
  };

  const calculateSynergy = useCallback(
    (missionId: string) => {
      const mission = AVAILABLE_MISSIONS.find(m => m.id === missionId);
      if (!mission) return 0;

      let bonus = 1.0;

      // Check if agents in party match mission type
      party.forEach(agentId => {
        const agent = OMNI_AGENTS.find(a => a.id === agentId);
        if (!agent) return;

        if (mission.type === 'Hybrid') {
          // Hybrid missions get bonus from any specialized type or Omni
          if (agent.type !== 'U') bonus += 0.15;
          if (agent.type === 'U') bonus += 0.25;
        } else if (agent.type === mission.type) {
          bonus += 0.2; // 20% bonus for matching type
        } else if (agent.type === 'U') {
          bonus += 0.1; // 10% bonus for omni
        }
      });

      // Add Resonance bonus from the main agent profile
      const driftMapping: Record<string, number> = {
        E: profile.drift.e,
        S: profile.drift.s,
        G: profile.drift.g,
      };

      if (mission.type !== 'Hybrid') {
        const driftVal = driftMapping[mission.type] || 0;
        bonus += driftVal / 200; // Max 0.5 bonus at 100% drift
      }

      return Math.min(bonus, 3.0); // Cap at 3x synergy
    },
    [party, profile]
  );

  const completeMission = (missionId: string) => {
    const mission = AVAILABLE_MISSIONS.find(m => m.id === missionId);
    if (!mission) return null;

    const synergy = calculateSynergy(missionId);
    const finalXp = Math.round(mission.rewards.xp * synergy);
    const finalImpact = Math.round(mission.rewards.impactScore * synergy);

    gainXp(finalXp);
    updateEntropy(0.01); // Minimal entropy increase for successful action

    const record: MissionRecord = {
      id: Math.random().toString(36).substr(2, 9),
      missionId: mission.id,
      title: mission.title,
      type: mission.type,
      xpGained: finalXp,
      impactGained: finalImpact,
      synergy,
      timestamp: new Date().toISOString(),
      certificateId: `IMPACT-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      bioId: generateBioID(profile),
    };

    const newHistory = [record, ...history];
    setHistory(newHistory);
    localStorage.setItem('omni_mission_history', JSON.stringify(newHistory));

    setActiveMissionId(null);
    setMissionStartTime(null);

    return {
      ...record,
      missionTitle: mission.title, // For backward compatibility if needed
    };
  };

  return {
    activeMissionId,
    missionStartTime,
    party,
    history,
    setParty,
    startMission,
    completeMission,
    calculateSynergy,
    availableMissions: AVAILABLE_MISSIONS,
  };
};
