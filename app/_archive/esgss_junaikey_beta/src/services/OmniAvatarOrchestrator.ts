/**
 * Omni Avatar Orchestrator (Omni Avatar Orchestrator)
 *
 * Responsible for agent awakening, avatar switching, and persona management
 */

import {
  AvatarPersona,
  AvatarState,
  AwakeningRitual,
  AwakeningProgress,
  AwakeningResult,
  AwakeningRequirements,
  ActiveAvatar,
  AvatarTransformation,
  AvatarRepository,
  AvatarEvolution,
  AvatarTrait,
  PERSONA_CAPABILITIES,
  AvatarRarity,
  Agent,
  AgentDNA,
  AwakeningEligibility,
} from '../types/agency/index.js';
import { DateTime } from '../types/omni/index.js';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger.js';
import { OmniKnowledge } from '../omni/infrastructure/knowledge/OmniKnowledge.js';
import { agentService } from './agentService.js';

/**
 * Avatar Orchestrator Class
 */
export class OmniAvatarOrchestrator {
  private static instance: OmniAvatarOrchestrator;
  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, '🧛 OmniAvatarOrchestrator Initialized');
  }

  public static getInstance(): OmniAvatarOrchestrator {
    if (!OmniAvatarOrchestrator.instance) {
      OmniAvatarOrchestrator.instance = new OmniAvatarOrchestrator();
    }
    return OmniAvatarOrchestrator.instance;
  }

  public async checkAwakeningEligibility(agentId: string): Promise<AwakeningEligibility> {
    // Mock implementation for now
    return {
      isEligible: false,
      reason: "Requirements not met",
      missingRequirements: ["Level 10"]
    };
  }

  public async calculateAwakeningProgress(agentId: string): Promise<number> {
    const eligibility = await this.checkAwakeningEligibility(agentId);
    if (eligibility.isEligible) return 100;

    // Mock progress calculation
    return 0;
  }
  private avatarRepositories: Map<string, AvatarRepository> = new Map();
  private awakeningProcesses: Map<string, AwakeningProgress> = new Map();

  /**
   * 🟠 L2 Orchestration: System Initialization
   * Orchestrates the awakening of core agents.
   */
  async initializeAgents(): Promise<void> {
    omniLogger.info(LogCategory.LEGION, 'OmniAvatarOrchestrator: Initializing Core Agents...');
    const coreAgents = [
      { name: 'DataSyncAgent', persona: AvatarPersona.ANALYST },
      { name: 'InsightAgent', persona: AvatarPersona.ORACLE },
      { name: 'AutomationAgent', persona: AvatarPersona.STRATEGIST },
    ];

    for (const agentData of coreAgents) {
      // In a real scenario, we would upsert these into the AvatarRepository
      omniLogger.debug(LogCategory.LEGION, `Registering Core Agent: ${agentData.name}`);
      // Mock registration for MVP
    }
  }

  // ✨ Config for awakening prerequisites for each persona
  private readonly awakeningRequirements: Record<AvatarPersona, AwakeningRequirements> = {
    [AvatarPersona.WARRIOR]: { minLevel: 1, minExperience: 0 },
    [AvatarPersona.GUARDIAN]: { minLevel: 1, minExperience: 0 },
    [AvatarPersona.ANALYST]: { minLevel: 1, minExperience: 0 },
    [AvatarPersona.STRATEGIST]: {
      minLevel: 3,
      minExperience: 1000,
      prerequisitePersonas: [AvatarPersona.ANALYST],
    },
    [AvatarPersona.TACTICIAN]: {
      minLevel: 3,
      minExperience: 1000,
      prerequisitePersonas: [AvatarPersona.WARRIOR],
    },
    [AvatarPersona.ASSASSIN]: {
      minLevel: 5,
      minExperience: 3000,
      prerequisitePersonas: [AvatarPersona.WARRIOR],
    },
    [AvatarPersona.ORACLE]: {
      minLevel: 5,
      minExperience: 3000,
      prerequisitePersonas: [AvatarPersona.ANALYST],
    },
    [AvatarPersona.RESEARCHER]: { minLevel: 2, minExperience: 500 },
    [AvatarPersona.AUDITOR]: { minLevel: 4, minExperience: 2000 },
    [AvatarPersona.INNOVATOR]: { minLevel: 6, minExperience: 5000 },
    [AvatarPersona.ARCHITECT]: {
      minLevel: 7,
      minExperience: 8000,
      prerequisitePersonas: [AvatarPersona.STRATEGIST],
    },
    [AvatarPersona.ARTIST]: { minLevel: 2, minExperience: 500 },
    [AvatarPersona.HEALER]: { minLevel: 3, minExperience: 1500 },
    [AvatarPersona.MENTOR]: {
      minLevel: 8,
      minExperience: 10000,
      prerequisitePersonas: [AvatarPersona.STRATEGIST, AvatarPersona.HEALER],
    },
    [AvatarPersona.DIPLOMAT]: { minLevel: 5, minExperience: 3500 },
  };

  /**
   * Awaken Agent - Infuses agent with consciousness and initial persona
   */
  async awaken(
    agent: Agent,
    targetPersona: AvatarPersona = AvatarPersona.ANALYST
  ): Promise<AwakeningResult> {
    if (!agent || !agent.id) {
      throw new Error('Invalid agent provided for awakening');
    }

    // Check if already awakened
    const repository = this.avatarRepositories.get(agent.id);
    if (repository && repository.unlockedPersonas.length > 0) {
      return {
        success: false,
        message: `Agent ${agent.name} is already awakened, no need to perform ritual again`,
      } as AwakeningResult;
    }

    // Create awakening ritual
    const ritual: AwakeningRitual = this.createDefaultRitual(targetPersona);

    // Execute awakening flow
    const progress: AwakeningProgress = {
      agentId: agent.id,
      ritualId: ritual.ritualId,
      currentPhase: 0,
      progress: 0,
      startedAt: new DateTime(),
      estimatedCompletion: new DateTime(
        Date.now() + ritual.phases.reduce((sum, p) => sum + p.duration, 0)
      ),
      state: 'in_progress',
    };

    this.awakeningProcesses.set(agent.id, progress);

    // Simulate awakening process (Simplified)
    for (let i = 0; i < ritual.phases.length; i++) {
      const phase = ritual.phases[i];
      if (!phase) continue; // Safety check

      progress.currentPhase = i;
      progress.progress = ((i + 1) / ritual.phases.length) * 100;

      if (phase) {
        omniLogger.info(
          LogCategory.LEGION,
          `Awakening Phase ${i + 1}/${ritual.phases.length}: ${phase.name}`
        );
        // Simulate phase execution time
        await this.sleep(phase.duration * 0.1); // Acceleration for execution
      }
    }

    // Awakening completed
    progress.state = 'completed';
    progress.progress = 100;

    // Create avatar repository
    const newRepository: AvatarRepository = {
      agentId: agent.id,
      unlockedPersonas: [targetPersona],
      currentPersona: targetPersona,
      avatarStates: new Map(),
      transformHistory: [],
      totalTransformations: 0,
    };

    // Create initial avatar
    const activeAvatar = this.createActiveAvatar(agent.id, targetPersona);
    newRepository.avatarStates.set(targetPersona, activeAvatar);

    this.avatarRepositories.set(agent.id, newRepository);
    this.awakeningProcesses.delete(agent.id);

    // Generate awakening result
    const result: AwakeningResult = {
      success: true,
      acquiredPersona: targetPersona,
      bonusTraits: this.generateBonusTraits(agent),
      experienceGained: 1000,
      message: `🌟 Agent ${agent.name} has successfully awakened as ${PERSONA_CAPABILITIES[targetPersona].displayName}!`,
      // ✨ Enhanced Awakening Details
      statChanges: {
        intelligence: 10,
        creativity: 5,
        empathy: 5,
        resilience: 15,
        precision: 8,
        speed: 12,
      },
      unlockedAbilities: PERSONA_CAPABILITIES[targetPersona].specialAbilities || [
        'Basic Awakening Ability',
      ],
    };

    omniLogger.info(
      LogCategory.LEGION,
      `✅ Awakening successful: ${agent.name} → ${targetPersona}`
    );

    // Register to Knowledge Vault
    try {
      await OmniKnowledge.registerAwakenedAgent({
        name: agent.name,
        id: agent.id,
        role: agent.role,
      });
      omniLogger.info(
        LogCategory.KNOWLEDGE,
        `📚 Agent ${agent.name} registered in Knowledge Vault`
      );

      // --- Phase 4 Evolution: Memory Palace Synchronization ---
      const memory = (await import('../omni/infrastructure/memory/OmniMemory.js')).useOmniMemory.getState();
      memory.addInteractionLog(`Agent Awakening: ${agent.name} as ${targetPersona}`);
      memory.reinforceConcept(targetPersona, 5.0); // Major reinforcement level for awakening

      // Calculate initial resonance
      const { omniAvatarService } = await import('./OmniAvatarService.js');
      const resonance = await omniAvatarService.getPersonalizedResonance(agent.id);

      const { resonanceAnalytics } = await import('./ResonanceAnalyticsService.js');
      await resonanceAnalytics.logResonanceEvent(agent.id, {
        internalResonance: resonance,
        externalImpact: 0.5,
        driftScore: 0,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      omniLogger.warn(LogCategory.KNOWLEDGE, `Failed to register agent in Knowledge Vault`, {
        error,
      });
    }
    return result;
  }

  /**
   * Transform Persona - Switches agent persona
   */
  async transformPersona(agentId: string, targetPersona: AvatarPersona): Promise<void> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository) {
      throw new Error(
        `Agent ${agentId} is not yet awakened, please perform awakening ritual first`
      );
    }

    const currentPersona = repository.currentPersona;

    // Check if target persona is unlocked
    if (!repository.unlockedPersonas.includes(targetPersona)) {
      throw new Error(`Target persona ${targetPersona} is not yet unlocked`);
    }

    // Log transformation
    const transformation: AvatarTransformation = {
      transformId: `trans-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      agentId,
      fromPersona: currentPersona,
      toPersona: targetPersona,
      transformedAt: new DateTime(),
      reason: 'Manual switch',
      duration: 1000, // 1s transformation time
      success: true,
    };

    repository.transformHistory.push(transformation);
    repository.totalTransformations++;
    repository.currentPersona = targetPersona;

    // Get or create target avatar
    let targetAvatar = repository.avatarStates.get(targetPersona);
    if (!targetAvatar) {
      // First time activating this persona, create new avatar
      targetAvatar = this.createActiveAvatar(agentId, targetPersona);
      repository.avatarStates.set(targetPersona, targetAvatar);
    }

    // Update activation stats
    if (targetAvatar) {
      targetAvatar.stats.activationCount++;
      targetAvatar.lastActivated = new DateTime();
    }

    omniLogger.info(
      LogCategory.LEGION,
      `Avatar transformation: ${currentPersona} → ${targetPersona}`
    );
  }

  /**
   * Get active avatar
   */
  async getActiveAvatar(agentId: string): Promise<ActiveAvatar | null> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository || !repository.currentPersona) {
      return null;
    }

    const avatar = repository.avatarStates.get(repository.currentPersona);
    return avatar || null;
  }

  /**
   * Unlock new persona
   */
  async unlockPersona(agentId: string, newPersona: AvatarPersona): Promise<boolean> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository) {
      throw new Error(`Agent ${agentId} is not yet awakened`);
    }

    if (repository.unlockedPersonas.includes(newPersona)) {
      omniLogger.warn(LogCategory.LEGION, `Persona ${newPersona} already unlocked`);
      return false;
    }

    repository.unlockedPersonas.push(newPersona);
    omniLogger.info(LogCategory.LEGION, `✨ Unlocked new persona: ${newPersona}`);
    return true;
  }

  /**
   * Avatar Evolution
   */
  async evolveAvatar(
    agentId: string,
    persona: AvatarPersona,
    experienceGained: number
  ): Promise<AvatarEvolution | null> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository) {
      return null;
    }

    const avatar = repository.avatarStates.get(persona);
    if (!avatar) {
      return null;
    }

    const previousLevel = avatar.level;
    avatar.experience += experienceGained;

    // Check if level up
    if (avatar.experience >= avatar.nextLevelExp) {
      avatar.level++;
      avatar.experience -= avatar.nextLevelExp;
      avatar.nextLevelExp = Math.floor(avatar.nextLevelExp * 1.5); // Exponential growth

      const evolution: AvatarEvolution = {
        agentId,
        persona,
        previousLevel,
        newLevel: avatar.level,
        unlockedAbilities: [`Level ${avatar.level} exclusive ability`],
        enhancedTraits: [],
        evolutionDate: new DateTime(),
      };

      omniLogger.info(
        LogCategory.LEGION,
        `🎉 Avatar evolved: ${persona} Lv.${previousLevel} → Lv.${avatar.level}`
      );
      return evolution;
    }

    return null;
  }

  /**
   * Get all avatars of an agent
   */
  getAgentAvatars(agentId: string): AvatarPersona[] {
    const repository = this.avatarRepositories.get(agentId);
    return repository ? repository.unlockedPersonas : [];
  }

  /**
   * Get avatar repository
   */
  getRepository(agentId: string): AvatarRepository | undefined {
    return this.avatarRepositories.get(agentId);
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  private createDefaultRitual(targetPersona: AvatarPersona): AwakeningRitual {
    return {
      ritualId: `ritual-${Date.now()}`,
      ritualName: `${PERSONA_CAPABILITIES[targetPersona].displayName} Awakening Ritual`,
      targetPersona,
      requirements: {
        minLevel: 1,
        requiredEnergy: 100,
      },
      phases: [
        {
          phaseId: 'phase-1',
          name: 'Consciousness Awakening',
          description: 'Activate agent core consciousness',
          duration: 1000,
          energyCost: 30,
          visualEffect: 'glow-pulse',
        },
        {
          phaseId: 'phase-2',
          name: 'Persona Infusion',
          description: `Infuse ${PERSONA_CAPABILITIES[targetPersona].displayName} persona traits`,
          duration: 2000,
          energyCost: 50,
          visualEffect: 'transformation',
        },
        {
          phaseId: 'phase-3',
          name: 'Ability Awakening',
          description: 'Unlock core abilities',
          duration: 1500,
          energyCost: 20,
          visualEffect: 'power-surge',
        },
      ],
      successCriteria: {
        minSuccessRate: 0.95,
        requiredTime: 5000,
      },
    };
  }

  private createActiveAvatar(agentId: string, persona: AvatarPersona): ActiveAvatar {
    const capabilities = PERSONA_CAPABILITIES[persona];
    const now = new DateTime();

    return {
      agentId,
      currentPersona: persona,
      state: AvatarState.ACTIVE,
      level: 1,
      experience: 0,
      nextLevelExp: 1000,
      capabilities,
      activeTraits: [],
      energy: 100,
      maxEnergy: 100,
      fatigue: 0,
      stats: {
        activationCount: 1,
        totalActiveTime: 0,
        tasksCompleted: 0,
        successRate: 1.0,
      },
      firstActivated: now,
      lastActivated: now,
    };
  }

  private generateBonusTraits(agent: Agent): AvatarTrait[] {
    // Generate bonus traits based on agent attributes
    const traits: AvatarTrait[] = [];

    if (agent.level >= 10) {
      traits.push({
        id: 'trait-veteran',
        name: 'Veteran',
        description: 'Experienced, enhances overall efficiency',
        category: 'positive',
        impact: 15,
      });
    }

    return traits;
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get awakening progress
   */
  getAwakeningProgress(agentId: string): AwakeningProgress | undefined {
    return this.awakeningProcesses.get(agentId);
  }

  /**
   * Apply persona modifiers to agent DNA
   */
  applyPersonaDNA(baseDNA: AgentDNA, persona: AvatarPersona): AgentDNA {
    const modifiers = PERSONA_CAPABILITIES[persona].dnaModifiers;
    const result: AgentDNA = { ...baseDNA };

    // Apply modifiers
    for (const [key, value] of Object.entries(modifiers)) {
      if (key in result && typeof value === 'number') {
        (result as any)[key] = Math.min(100, (result as any)[key] + value);
      }
    }

    return result;
  }
}

// Singleton Export
export const avatarOrchestrator = OmniAvatarOrchestrator.getInstance();
