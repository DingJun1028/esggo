import { useState, useEffect, useCallback, useMemo } from 'react';
import { AgentRpgProfile, RpgItem, SkillNode, RpgAttributes } from '../types/rpg';
import { LEVEL_XP_CURVE, RPG_ITEMS, SKILL_TREE, INITIAL_PROFILE } from '../data/rpg-data';
import { OmniTrainingCore, TrainingInput } from '../services/OmniTrainingCore';
import { Agent } from '../types';
import { OMNI_AGENTS } from '../data/omni-agents';
import { useSovereignSession } from './useSovereignSession';
import { useWorldEvents } from './useWorldEvents';
// import { useLegion } from './useLegion';
import { LegionEngine } from '../services/LegionEngine';
import { agentService } from '../services/agentService';
import { omniLogger, LogCategory } from '../services/omniLogger';

export const useAgentRpg = () => {
  const { updateEntropy } = useSovereignSession();
  const { globalModifiers, events } = useWorldEvents();
  // const { legions } = useLegion();
  // In a real app, this would fetch from DB/Context. Using LocalStorage for persistence in Beta.
  const [profile, setProfile] = useState<AgentRpgProfile>(() => {
    const saved = localStorage.getItem('agent_rpg_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem('agent_rpg_profile', JSON.stringify(profile));
  }, [profile]);

  const calculateAttributes = useCallback(() => {
    // Base attributes
    const stats = { ...profile.attributes };

    // 1. Equipment modifiers
    Object.values(profile.equipment).forEach(itemId => {
      if (!itemId) return;
      const item = RPG_ITEMS[itemId];
      if (item && item.modifiers) {
        Object.entries(item.modifiers).forEach(([key, value]) => {
          const k = key as keyof RpgAttributes;
          stats[k] = (stats[k] || 0) + (value || 0);
        });
      }
    });

    // 2. Skill modifiers
    profile.unlockedSkills.forEach(skillId => {
      const skill = SKILL_TREE.nodes.find(n => n.id === skillId);
      if (skill && skill.modifiers) {
        Object.entries(skill.modifiers).forEach(([key, value]) => {
          const k = key as keyof RpgAttributes;
          stats[k] = (stats[k] || 0) + (value || 0);
        });
      }
    });

    // 3. Drift Resonance (Phase 23)
    // High drift values provide a "Resonance" boost to specific stats
    stats.ecoAwareness = (stats.ecoAwareness || 0) * (1 + profile.drift.e / 100);
    stats.ethicalBias = (stats.ethicalBias || 0) * (1 + profile.drift.s / 100);
    stats.computePower = (stats.computePower || 0) * (1 + profile.drift.g / 100);

    // 4. Global Pulse Modifiers (Phase 38)
    stats.computePower += globalModifiers.computePower || 0;
    stats.ecoAwareness = (stats.ecoAwareness || 0) + (globalModifiers.empathyLevel || 0); // Mapping empathy to eco for now
    stats.ethicalBias = (stats.ethicalBias || 0) + (globalModifiers.governanceScore || 0);

    return stats;
  }, [profile, globalModifiers]);

  const activeAttributes = useMemo(() => calculateAttributes(), [calculateAttributes]);

  const gainXp = useCallback((amount: number) => {
    setProfile(prev => {
      let { currentXp, level, nextLevelXp, availableSkillPoints } = prev;
      currentXp += amount;

      // Level up logic
      while (currentXp >= nextLevelXp && level < 20) {
        currentXp -= nextLevelXp;
        level++;
        availableSkillPoints++;
        nextLevelXp = LEVEL_XP_CURVE[level] || 999999;
        // Could also add base stats on level up here
        omniLogger.info(LogCategory.LEGION, `Agent Leveled Up: ${level}`);
      }

      return {
        ...prev,
        level,
        currentXp,
        nextLevelXp,
        availableSkillPoints,
      };
    });
  }, []);

  const equipItem = useCallback(
    (slot: keyof AgentRpgProfile['equipment'], itemId: string) => {
      if (!profile.inventory.includes(itemId)) return;

      setProfile(prev => ({
        ...prev,
        equipment: {
          ...prev.equipment,
          [slot]: itemId,
        },
      }));
    },
    [profile.inventory]
  );

  const unlockSkill = useCallback(
    (skillId: string, options?: { bypassCost?: boolean }) => {
      if (profile.unlockedSkills.includes(skillId)) return;
      if (!options?.bypassCost && profile.availableSkillPoints <= 0) return;

      const skill = SKILL_TREE.nodes.find(n => n.id === skillId);
      if (!skill) return;

      const meetsReq =
        !skill.requirements ||
        skill.requirements.every(req => profile.unlockedSkills.includes(req));

      if (!meetsReq && !options?.bypassCost) {
        omniLogger.warn(LogCategory.UI, `Skill ${skillId} requirements not met.`);
        return;
      }

      setProfile(prev => ({
        ...prev,
        availableSkillPoints: options?.bypassCost
          ? prev.availableSkillPoints
          : prev.availableSkillPoints - skill.cost,
        unlockedSkills: [...prev.unlockedSkills, skillId],
      }));

      omniLogger.info(
        LogCategory.UI,
        `Skill Unlocked: ${skill.name} ${options?.bypassCost ? '(Divine Grant)' : ''}`
      );
    },
    [profile.unlockedSkills, profile.availableSkillPoints]
  );

  const addBadge = useCallback((badge: { id: string; name: string }) => {
    setProfile(prev => {
      if (prev.badges.find(b => b.id === badge.id)) return prev;
      return {
        ...prev,
        badges: [
          ...prev.badges,
          {
            ...badge,
            date: new Date().toISOString().split('T')[0] || '',
            lockedHash: `0x${Math.random().toString(16).slice(2, 10).toUpperCase()} `,
          },
        ],
      };
    });
  }, []);

  const updateAttributes = useCallback((attrs: Partial<RpgAttributes>) => {
    setProfile(prev => ({
      ...prev,
      attributes: { ...prev.attributes, ...attrs },
    }));
  }, []);

  const updateDrift = useCallback((e: number, s: number, g: number) => {
    setProfile(prev => ({
      ...prev,
      drift: {
        e: prev.drift.e + e,
        s: prev.drift.s + s,
        g: prev.drift.g + g,
      },
    }));
  }, []);

  const evolveAgent = useCallback(
    (nextArchetypeId: string) => {
      // Validation logic
      if (profile.level < 5) {
        return { success: false, error: 'Level 5 required for evolution.' };
      }

      const nextArchetype = OMNI_AGENTS.find(a => a.id === nextArchetypeId);
      if (!nextArchetype) {
        return { success: false, error: 'Invalid archetype selection.' };
      }

      // Check drift requirement (30% in matching category)
      const driftMapping: Record<string, keyof AgentRpgProfile['drift']> = {
        E: 'e',
        S: 's',
        G: 'g',
        U: 'e', // Omni can check E or all
      };
      const driftKey = driftMapping[nextArchetype.type];
      const driftValue = driftKey ? profile.drift[driftKey] : 0;

      if (driftValue < 30 && nextArchetype.type !== 'U') {
        return {
          success: false,
          error: `Insufficient ${nextArchetype.type} Alignment (30% required).`,
        };
      }

      setProfile(prev => ({
        ...prev,
        archetypeId: nextArchetypeId,
        evolutionTier: prev.evolutionTier + 1,
        availableSkillPoints: prev.availableSkillPoints + 5, // Evolution bonus
        title: `${nextArchetype.name} (Tier ${prev.evolutionTier + 1})`,
      }));

      omniLogger.info(LogCategory.LEGION, `Agent Evolved to ${nextArchetype.name}`);
      return { success: true };
    },
    [profile.level, profile.drift, profile.evolutionTier]
  );

  const trainAgent = useCallback(
    async (input: TrainingInput, options?: { useAi?: boolean }) => {
      // Mock Agent for service call (derived from profile)
      const mockAgent: Agent = {
        id: profile.id || 'current_agent',
        name: profile.title || 'Active Agent',
        status: 'IDLE',
        lastActive: new Date(),
        role: 'Specialist',
        level: profile.level,
        capabilities: [],
      } as unknown as Agent;

      let result;
      if (options?.useAi) {
        result = await OmniTrainingCore.processSentientTraining(mockAgent, input, events);
      } else {
        result = OmniTrainingCore.processTraining(mockAgent, input, events);
      }

      if (result.success) {
        // Heritage Phase: Apply Synergy Bonus
        // @ts-expect-error: synergyBonus is a dynamic RPG property
        const bonus = input.synergyBonus || 0;
        const finalXp = Math.floor(result.xpGained * (1 + bonus));

        gainXp(finalXp);
        updateDrift(result.drift.e, result.drift.s, result.drift.g);

        // Return modified result for UI
        result.xpGained = finalXp;
      }

      return result;
    },
    [profile, events, gainXp, updateDrift]
  );

  const processChaosInput = useCallback(
    (input: TrainingInput) => {
      // Mock Agent for service call
      const mockAgent: Agent = {
        id: profile.id || 'current_agent',
        name: profile.title || 'Active Agent',
        status: 'IDLE',
        lastActive: new Date(),
        role: 'Specialist',
        level: profile.level,
        capabilities: [],
      } as unknown as Agent;

      const result = OmniTrainingCore.processTraining(
        mockAgent,
        { ...input, type: 'CHAOS' },
        events
      );

      if (result.success) {
        gainXp(result.xpGained);
        updateDrift(result.drift.e, result.drift.s, result.drift.g);
        updateEntropy(0.05); // Chaos training increases entropy significantly

        // Resilience bonus - Chaos training builds toughness
        setProfile(prev => ({
          ...prev,
          attributes: {
            ...prev.attributes,
            resilience: prev.attributes.resilience + (input.complexity || 0.5) * 5,
          },
        }));
      }

      return result;
    },
    [profile, events, gainXp, updateDrift, updateEntropy]
  );

  return {
    profile,
    activeAttributes,
    gainXp,
    equipItem,
    unlockSkill,
    addBadge,
    updateAttributes,
    updateDrift,
    evolveAgent,
    trainAgent,
    processChaosInput,
    inventoryItems: useMemo(
      () => profile.inventory.map(id => RPG_ITEMS[id]).filter((item): item is RpgItem => !!item),
      [profile.inventory]
    ),
  };
};
