import { useState, useCallback, useMemo } from 'react';
import { useAgentRpg } from './useAgentRpg';
import { useSovereignSession } from './useSovereignSession';
import { OMNI_AGENTS } from '../data/omni-agents';

export interface SwarmMember {
  agentId: string;
  bioId: string;
  type: 'E' | 'S' | 'G' | 'U';
  archetypeId: string;
  syncLevel: number; // 0-1
}

export const useSwarmEngine = () => {
  const { updateEntropy } = useSovereignSession();
  const [activeSwarm, setActiveSwarm] = useState<SwarmMember[]>([]);

  const calculateSwarmResonance = useCallback((members: SwarmMember[]) => {
    if (members.length < 2) return 1.0;

    let baseResonance = 1.0;
    const types = members.map(m => m.type);
    const uniqueTypes = new Set(types);

    // Participation Bonus
    baseResonance += members.length * 0.05;

    // Type Harmony Bonus
    if (uniqueTypes.has('U')) baseResonance += 0.2; // Omni agent synergy

    // Diversity vs Specialization
    if (uniqueTypes.size === 1) baseResonance += 0.15; // Specialist squad
    if (uniqueTypes.size >= 3) baseResonance += 0.25; // Balanced squad

    // Bio-Digital Alignment (Deterministic synergy based on Bio-ID bits)
    // In a real app, this would be more complex
    members.forEach(m => {
      if (m.bioId.includes('A') || m.bioId.includes('F')) baseResonance += 0.02;
    });

    return Math.min(3.5, baseResonance);
  }, []);

  const addToSwarm = useCallback((agent: any, bioId: string) => {
    setActiveSwarm(prev => {
      if (prev.find(m => m.agentId === agent.id)) return prev;
      if (prev.length >= 5) return prev; // Max swarm size

      const member: SwarmMember = {
        agentId: agent.id,
        bioId,
        type: agent.type,
        archetypeId: agent.archetypeId,
        syncLevel: 0.5 + Math.random() * 0.5,
      };
      return [...prev, member];
    });
  }, []);

  const removeFromSwarm = useCallback((agentId: string) => {
    setActiveSwarm(prev => prev.filter(m => m.agentId !== agentId));
  }, []);

  const swarmResonance = useMemo(
    () => calculateSwarmResonance(activeSwarm),
    [activeSwarm, calculateSwarmResonance]
  );

  const executeSwarmAction = useCallback(
    (complexity: number) => {
      const entropyReduction = swarmResonance * 0.05;
      updateEntropy(-entropyReduction); // Swarm synchronization mitigates entropy
      return {
        success: true,
        synergy: swarmResonance,
        entropyMitigated: entropyReduction,
        timestamp: new Date().toISOString(),
      };
    },
    [swarmResonance, updateEntropy]
  );

  return {
    activeSwarm,
    swarmResonance,
    addToSwarm,
    removeFromSwarm,
    executeSwarmAction,
    clearSwarm: () => setActiveSwarm([]),
  };
};
