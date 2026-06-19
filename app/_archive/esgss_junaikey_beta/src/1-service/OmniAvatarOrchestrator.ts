/**
 * 奧秘化身編排器 (Omni Avatar Orchestrator)
 *
 * 負責代理覺醒、化身切換和人格管理
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
} from '@/types';
import { DateTime } from '@/types';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { serviceRegistry } from './ServiceRegistry';
import { OmniKnowledge } from '@infra/knowledge/OmniKnowledge';

/**
 * 化身編排器類
 */
export class OmniAvatarOrchestrator {
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

  // ✨ 新增：各人格的覺醒前置條件配置
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
   * 覺醒代理 - 賦予代理意識與初始人格
   */
  async awaken(
    agent: Agent,
    targetPersona: AvatarPersona = AvatarPersona.ANALYST
  ): Promise<AwakeningResult> {
    if (!agent || !agent.id) {
      throw new Error('Invalid agent provided for awakening');
    }

    // 檢查是否已覺醒
    const repository = this.avatarRepositories.get(agent.id);
    if (repository && repository.unlockedPersonas.length > 0) {
      return {
        success: false,
        message: `代理 ${agent.name} 已覺醒，無需再次執行覺醒儀式`,
      } as AwakeningResult;
    }

    // 創建覺醒儀式
    const ritual: AwakeningRitual = this.createDefaultRitual(targetPersona);

    // 執行覺醒流程
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

    // 模擬覺醒過程（簡化版）
    for (let i = 0; i < ritual.phases.length; i++) {
      const phase = ritual.phases[i];
      if (!phase) continue; // 安全檢查

      progress.currentPhase = i;
      progress.progress = ((i + 1) / ritual.phases.length) * 100;

      if (phase) {
        omniLogger.info(
          LogCategory.LEGION,
          `覺醒階段 ${i + 1}/${ritual.phases.length}: ${phase.name}`
        );
        // 模擬階段執行時間
        await this.sleep(phase.duration * 0.1); // 實際執行時加速
      }
    }

    // 覺醒完成
    progress.state = 'completed';
    progress.progress = 100;

    // 創建化身倉庫
    const newRepository: AvatarRepository = {
      agentId: agent.id,
      unlockedPersonas: [targetPersona],
      currentPersona: targetPersona,
      avatarStates: new Map(),
      transformHistory: [],
      totalTransformations: 0,
    };

    // 創建初始化身
    const activeAvatar = this.createActiveAvatar(agent.id, targetPersona);
    newRepository.avatarStates.set(targetPersona, activeAvatar);

    this.avatarRepositories.set(agent.id, newRepository);
    this.awakeningProcesses.delete(agent.id);

    // 生成覺醒結果
    const result: AwakeningResult = {
      success: true,
      acquiredPersona: targetPersona,
      bonusTraits: this.generateBonusTraits(agent),
      experienceGained: 1000,
      message: `🌟 代理 ${agent.name} 已成功覺醒為 ${PERSONA_CAPABILITIES[targetPersona].displayName}！`,
      // ✨ Enhanced Awakening Details
      statChanges: {
        intelligence: 10,
        creativity: 5,
        empathy: 5,
        resilience: 15,
        precision: 8,
        speed: 12,
      },
      unlockedAbilities: PERSONA_CAPABILITIES[targetPersona].specialAbilities || ['基礎覺醒能力'],
    };

    omniLogger.info(LogCategory.LEGION, `✅ 覺醒成功: ${agent.name} → ${targetPersona}`);

    // 註冊至奧秘智庫 (Knowledge Vault)
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
    } catch (error) {
      omniLogger.warn(LogCategory.KNOWLEDGE, `Failed to register agent in Knowledge Vault`, {
        error,
      });
    }
    return result;
  }

  /**
   * 轉換化身 - 切換代理人格
   */
  async transformPersona(agentId: string, targetPersona: AvatarPersona): Promise<void> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository) {
      throw new Error(`代理 ${agentId} 尚未覺醒，請先執行覺醒儀式`);
    }

    const currentPersona = repository.currentPersona;

    // 檢查是否已解鎖目標人格
    if (!repository.unlockedPersonas.includes(targetPersona)) {
      throw new Error(`目標人格 ${targetPersona} 尚未解鎖`);
    }

    // 記錄轉換
    const transformation: AvatarTransformation = {
      transformId: `trans - ${Date.now()} -${Math.random().toString(36).slice(2, 9)} `,
      agentId,
      fromPersona: currentPersona,
      toPersona: targetPersona,
      transformedAt: new DateTime(),
      reason: '手動切換',
      duration: 1000, // 1秒轉換時間
      success: true,
    };

    repository.transformHistory.push(transformation);
    repository.totalTransformations++;
    repository.currentPersona = targetPersona;

    // 獲取或創建目標化身
    let targetAvatar = repository.avatarStates.get(targetPersona);
    if (!targetAvatar) {
      // 首次激活此人格，創建新化身
      targetAvatar = this.createActiveAvatar(agentId, targetPersona);
      repository.avatarStates.set(targetPersona, targetAvatar);
    }

    // 更新激活統計
    if (targetAvatar) {
      targetAvatar.stats.activationCount++;
      targetAvatar.lastActivated = new DateTime();
    }

    omniLogger.info(LogCategory.LEGION, `化身轉換: ${currentPersona} → ${targetPersona}`);
  }

  /**
   * 獲取活躍化身
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
   * 解鎖新化身
   */
  async unlockPersona(agentId: string, newPersona: AvatarPersona): Promise<boolean> {
    const repository = this.avatarRepositories.get(agentId);
    if (!repository) {
      throw new Error(`代理 ${agentId} 尚未覺醒`);
    }

    if (repository.unlockedPersonas.includes(newPersona)) {
      omniLogger.warn(LogCategory.LEGION, `人格 ${newPersona} 已解鎖`);
      return false;
    }

    repository.unlockedPersonas.push(newPersona);
    omniLogger.info(LogCategory.LEGION, `✨ 解鎖新人格: ${newPersona} `);
    return true;
  }

  /**
   * 化身進化
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

    // 檢查是否升級
    if (avatar.experience >= avatar.nextLevelExp) {
      avatar.level++;
      avatar.experience -= avatar.nextLevelExp;
      avatar.nextLevelExp = Math.floor(avatar.nextLevelExp * 1.5); // 指數增長

      const evolution: AvatarEvolution = {
        agentId,
        persona,
        previousLevel,
        newLevel: avatar.level,
        unlockedAbilities: [`等級 ${avatar.level} 專屬能力`],
        enhancedTraits: [],
        evolutionDate: new DateTime(),
      };

      omniLogger.info(
        LogCategory.LEGION,
        `🎉 化身進化: ${persona} Lv.${previousLevel} → Lv.${avatar.level}`
      );
      return evolution;
    }

    return null;
  }

  /**
   * 獲取代理所有化身
   */
  getAgentAvatars(agentId: string): AvatarPersona[] {
    const repository = this.avatarRepositories.get(agentId);
    return repository ? repository.unlockedPersonas : [];
  }

  /**
   * 獲取化身倉庫
   */
  getRepository(agentId: string): AvatarRepository | undefined {
    return this.avatarRepositories.get(agentId);
  }

  // ============================================================================
  // 私有輔助方法
  // ============================================================================

  private createDefaultRitual(targetPersona: AvatarPersona): AwakeningRitual {
    return {
      ritualId: `ritual-${Date.now()}`,
      ritualName: `${PERSONA_CAPABILITIES[targetPersona].displayName} 覺醒儀式`,
      targetPersona,
      requirements: {
        minLevel: 1,
        requiredEnergy: 100,
      },
      phases: [
        {
          phaseId: 'phase-1',
          name: '意識喚醒',
          description: '激活代理核心意識',
          duration: 1000,
          energyCost: 30,
          visualEffect: 'glow-pulse',
        },
        {
          phaseId: 'phase-2',
          name: '人格注入',
          description: `注入 ${PERSONA_CAPABILITIES[targetPersona].displayName} 人格特質`,
          duration: 2000,
          energyCost: 50,
          visualEffect: 'transformation',
        },
        {
          phaseId: 'phase-3',
          name: '能力覺醒',
          description: '解鎖核心能力',
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
    // 基於代理屬性生成獎勵特質
    const traits: AvatarTrait[] = [];

    if (agent.level >= 10) {
      traits.push({
        id: 'trait-veteran',
        name: '老兵',
        description: '經驗豐富，提升整體效率',
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
   * 獲取覺醒進度
   */
  getAwakeningProgress(agentId: string): AwakeningProgress | undefined {
    return this.awakeningProcesses.get(agentId);
  }

  /**
   * 應用人格修飾符到代理DNA
   */
  applyPersonaDNA(baseDNA: AgentDNA, persona: AvatarPersona): AgentDNA {
    const modifiers = PERSONA_CAPABILITIES[persona].dnaModifiers;
    const result: AgentDNA = { ...baseDNA };

    // 應用修飾符
    for (const [key, value] of Object.entries(modifiers)) {
      if (key in result && typeof value === 'number') {
        (result as any)[key] = Math.min(100, (result as any)[key] + value);
      }
    }

    return result;
  }
  /**
   * 銷毀編排器 (Lifecycle)
   */
  destroy(): void {
    this.avatarRepositories.clear();
    this.awakeningProcesses.clear();
    omniLogger.info(LogCategory.SYSTEM, 'OmniAvatarOrchestrator destroyed');
  }
}

// 單例導出
export const avatarOrchestrator = new OmniAvatarOrchestrator();
