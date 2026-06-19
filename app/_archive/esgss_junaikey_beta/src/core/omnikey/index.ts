/**
 * Jun.AI.Key - 奧秘元鑰系統
 * 統一入口點，整合所有核心模組
 */

import { MemoryPalace } from './MemoryPalace';
import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger';

import { NavigationAgent, Task, ExecutionResult, AgentRegistry } from './NavigationAgent';
import { AuthorityForge, AuthorityKey } from './AuthorityForge';
import { RuneEngrafter, Rune, EngraftedRune } from './RuneEngrafter';
import { OmniKeyCore, MysticCycle, CycleResult, MysticForm } from './OmniKeyCore';
import { SystemDiagnostics, SystemHealth } from '../diagnostics/SystemDiagnostics';
import { GoalManager, Goal } from '../goal/GoalManager';

export { MemoryPalace };
export { NavigationAgent, type Task, type ExecutionResult };
export { AuthorityForge, type AuthorityKey };
export { RuneEngrafter, type Rune, type EngraftedRune };
export { OmniKeyCore, type MysticCycle, type CycleResult, MysticForm };
export { SystemDiagnostics, type SystemHealth };
export { GoalManager, type Goal };

/**
 * Jun.AI.Key 主系統類
 * 提供統一的API接口
 */
export class JunAIKey {
  private memoryPalace: MemoryPalace;
  private navigationAgent: NavigationAgent;
  private authorityForge: AuthorityForge;
  private runeEngrafter: RuneEngrafter;
  private omniKeyCore: OmniKeyCore;

  constructor(userId: string) {
    // 初始化核心模組
    this.memoryPalace = new MemoryPalace();
    this.navigationAgent = new NavigationAgent(this.memoryPalace, new AgentRegistry());
    this.authorityForge = new AuthorityForge(this.memoryPalace);
    this.runeEngrafter = new RuneEngrafter();
    this.omniKeyCore = new OmniKeyCore(
      this.memoryPalace,
      this.navigationAgent,
      this.authorityForge,
      this.runeEngrafter
    );

    omniLogger.info(LogCategory.SYSTEM, '[index] 🔑 Jun.AI.Key 系統初始化完成');
  }

  get diagnostics() {
    return this.omniKeyCore.diagnostics;
  }

  get goals() {
    return this.omniKeyCore.goals;
  }

  /**
   * 啟動奧秘元鑰循環
   */
  async activate(trigger: string, context?: Record<string, any>): Promise<string> {
    const userId = 'default-user'; // 在實際實現中應從認證系統獲取
    return await this.omniKeyCore.initiateCycle(userId, trigger, context);
  }

  /**
   * 檢查循環狀態
   */
  getCycleStatus(cycleId: string) {
    return this.omniKeyCore.getCycleStatus(cycleId);
  }

  /**
   * 獲取活躍循環
   */
  getActiveCycles(userId?: string) {
    return this.omniKeyCore.getActiveCycles(userId);
  }

  /**
   * 記憶存儲
   */
  async storeMemory(
    content: string,
    type: string,
    context: string,
    tags: string[] = [],
    userId?: string
  ) {
    const targetUserId = userId || 'default-user';
    return await this.memoryPalace.store({
      type: type as any,
      content,
      context,
      tags,
      vectors: [], // 應生成真實向量
      userId: targetUserId,
      connections: [],
      confidence: 1.0,
    });
  }

  /**
   * 記憶檢索
   */
  async retrieveMemory(query: string, userId?: string) {
    const targetUserId = userId || 'default-user';
    return await this.memoryPalace.retrieve({
      userId: targetUserId,
      query,
      limit: 5,
    });
  }

  /**
   * 執行任務
   */
  async executeTask(
    description: string,
    type: 'analysis' | 'creation' | 'automation' | 'learning' | 'execution' = 'execution'
  ) {
    const task = await this.navigationAgent.createTask(description, type);
    return await this.navigationAgent.executeTask(task);
  }

  /**
   * 獲取權能鑰匙
   */
  getAuthorityKeys(userId?: string) {
    const targetUserId = userId || 'default-user';
    return this.authorityForge.getAuthorityKeys(targetUserId);
  }

  /**
   * 鍛造權能鑰匙
   */
  async forgeAuthorityKey(pattern: string, userId?: string) {
    const targetUserId = userId || 'default-user';
    return await this.authorityForge.forgeManualKey(targetUserId, pattern);
  }

  /**
   * 註冊符文
   */
  registerRune(
    rune: Omit<import('./RuneEngrafter').Rune, 'id' | 'engraveDate' | 'usageCount' | 'successRate'>
  ) {
    return this.runeEngrafter.registerRune(rune);
  }

  /**
   * 嵌合符文
   */
  async engraftRune(runeId: string, customConfig: Record<string, any>, userId?: string) {
    const targetUserId = userId || 'default-user';
    return await this.runeEngrafter.engraftRune(targetUserId, runeId, customConfig);
  }

  /**
   * 執行符文
   */
  async executeRune(engraftedRuneId: string, parameters: Record<string, any>) {
    return await this.runeEngrafter.executeRune(engraftedRuneId, parameters);
  }

  /**
   * 獲取嵌合符文
   */
  getEngraftedRunes(userId?: string) {
    const targetUserId = userId || 'default-user';
    return this.runeEngrafter.getEngraftedRunes(targetUserId);
  }

  /**
   * 系統狀態
   */
  getSystemStatus() {
    return {
      memoryNodes: 'unknown', // 應從 MemoryPalace 獲取
      activeCycles: this.omniKeyCore.getActiveCycles().length,
      authorityKeys: this.authorityForge.getAuthorityKeys('default-user').length,
      engraftedRunes: this.runeEngrafter.getEngraftedRunes('default-user').length,
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 系統重置 (開發用)
   */
  async reset() {
    omniLogger.info(LogCategory.SYSTEM, '[index] 🔄 重置 Jun.AI.Key 系統');
    // 在實際實現中會清空所有數據
  }
}

/**
 * 預設實例 (單例模式)
 */
let defaultInstance: JunAIKey | null = null;

export function getJunAIKey(): JunAIKey {
  if (!defaultInstance) {
    defaultInstance = new JunAIKey('default-user');
  }
  return defaultInstance;
}

/**
 * 快速啟動函數
 */
export async function quickActivate(
  trigger: string,
  context?: Record<string, any>
): Promise<string> {
  const junAIKey = getJunAIKey();
  return await junAIKey.activate(trigger, context);
}
