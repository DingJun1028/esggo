import { useState, useCallback, useEffect } from 'react';
import { LegionEngine, Legion, LegionMission } from '../services/LegionEngine';
import { OMNI_AGENTS } from '../data/omni-agents';

export const useLegion = () => {
  const [legions, setLegions] = useState<Legion[]>(() => {
    const saved = localStorage.getItem('omni_legions');
    return saved ? JSON.parse(saved) : [];
  });

  const [activeMissions, setActiveMissions] = useState<LegionMission[]>(() => {
    const saved = localStorage.getItem('omni_legion_missions');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('omni_legions', JSON.stringify(legions));
    localStorage.setItem('omni_legion_missions', JSON.stringify(activeMissions));
  }, [legions, activeMissions]);

  const formLegion = useCallback(
    (
      commanderId: string,
      name: string,
      agentIds: string[],
      synergyType: 'E' | 'S' | 'G' | 'OMNI'
    ) => {
      const newLegion: Legion = {
        id: `LGN-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
        name,
        commanderId,
        agentIds,
        synergyType,
        totalPower: 0, // Will be calculated next
      };

      // Use full OMNI_AGENTS for power calculation
      const commanderAgent = OMNI_AGENTS.find(a => a.id === commanderId) || {
        id: commanderId,
        name: 'Commander',
        attributes: { strength: 50, intelligence: 50, agility: 50 },
      };
      newLegion.totalPower = LegionEngine.calculatePower(newLegion, [
        ...OMNI_AGENTS,
        commanderAgent as any,
      ]);

      setLegions(prev => [...prev, newLegion]);
      return newLegion;
    },
    []
  );

  const assignMission = useCallback((legionId: string, mission: Partial<LegionMission>) => {
    const newMission: LegionMission = {
      id: `OP-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      name: mission.name || 'Macro Directive',
      description: mission.description || '',
      targetTheater: mission.targetTheater || 'ENVIRONMENT',
      requiredPower: mission.requiredPower || 500,
      currentProgress: 0,
      assignedLegionId: legionId,
      status: 'ACTIVE',
      startedAt: Date.now(),
      estimatedDuration: 12,
    };

    setActiveMissions(prev => [...prev, newMission]);
    setLegions(prev =>
      prev.map(l => (l.id === legionId ? { ...l, activeMissionId: newMission.id } : l))
    );
  }, []);

  // Tick simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveMissions(prev =>
        prev.map(mission => {
          if (mission.status !== 'ACTIVE') return mission;
          const legion = legions.find(l => l.id === mission.assignedLegionId);
          if (!legion) return mission;
          return LegionEngine.processMissionTick(mission, legion.totalPower);
        })
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [legions]);

  return {
    legions,
    activeMissions,
    formLegion,
    assignMission,
  };
};
