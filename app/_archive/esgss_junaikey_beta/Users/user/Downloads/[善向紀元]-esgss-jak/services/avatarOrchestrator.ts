/**
 * JunAiKey 千面化身編排器
 * 實現代理的動態角色切換和狀態隔離
 */

import {
  SoulAvatar,
  AgentSoul5D,
  SoulDimension,
  PersonaConfig
} from '../types';
import { SoulManager } from './soulManager';

export class AvatarOrchestrator {
  private static activeAvatars: Map<string, SoulAvatar> = new Map();
  private static avatarSessions: Map<string, AvatarSession> = new Map();

  /**
   * 化身會話數據結構
   */
  private static AvatarSession = class {
    avatarId: string;
    soulId: string;
    personaOverride: Record<string, any>;
    capabilityMask: Set<string>;
    sessionMemory: Map<string, any>;
    createdAt: number;
    lastActivity: number;
    entropy: number;

    constructor(avatarId: string, soulId: string) {
      this.avatarId = avatarId;
      this.soulId = soulId;
      this.personaOverride = {};
      this.capabilityMask = new Set();
      this.sessionMemory = new Map();
      this.createdAt = Date.now();
      this.lastActivity = Date.now();
      this.entropy = 0;
    }
  };

  /**
   * 顯現化身 - 從靈魂創建動態化身
   */
  static async manifestAvatar(
    soulId: string,
    personaMask: Record<string, any> = {},
    capabilityFilter: string[] = [],
    contextOverride?: Record<string, any>
  ): Promise<SoulAvatar> {
    const soul = SoulManager.getSoul(soulId);
    if (!soul) {
      throw new Error(`靈魂 ${soulId} 不存在`);
    }

    // 創建化身
    const avatar = await SoulManager.manifestAvatar(soulId, personaMask, capabilityFilter);

    // 如果有上下文覆蓋，應用它
    if (contextOverride) {
      avatar.contextOverride = contextOverride;
    }

    // 創建會話
    const session = new this.AvatarSession(avatar.id, soulId);
    session.personaOverride = personaMask;
    session.capabilityMask = new Set(capabilityFilter);

    this.activeAvatars.set(avatar.id, avatar);
    this.avatarSessions.set(avatar.id, session);

    console.log(`🌟 化身 ${avatar.id} 顯現 - 基於靈魂 ${soulId}`);
    return avatar;
  }

  /**
   * 切換化身角色 - JIT多態性
   */
  static async switchAvatarPersona(
    avatarId: string,
    newPersonaMask: Record<string, any>,
    capabilityAdjustments: { add?: string[]; remove?: string[] } = {}
  ): Promise<void> {
    const avatar = this.activeAvatars.get(avatarId);
    const session = this.avatarSessions.get(avatarId);

    if (!avatar || !session) {
      throw new Error(`化身 ${avatarId} 不存在或未激活`);
    }

    // 應用新的角色面具
    Object.assign(avatar.personaMask, newPersonaMask);
    Object.assign(session.personaOverride, newPersonaMask);

    // 調整能力過濾器
    if (capabilityAdjustments.add) {
      capabilityAdjustments.add.forEach(cap => session.capabilityMask.add(cap));
    }
    if (capabilityAdjustments.remove) {
      capabilityAdjustments.remove.forEach(cap => session.capabilityMask.delete(cap));
    }

    // 更新能力過濾器
    avatar.capabilityFilter = Array.from(session.capabilityMask);

    session.lastActivity = Date.now();
    console.log(`🔄 化身 ${avatarId} 角色切換完成`);
  }

  /**
   * 執行化身交互 - 共鳴處理
   */
  static async executeAvatarInteraction(
    avatarId: string,
    interaction: {
      type: 'QUERY' | 'COMMAND' | 'LEARNING' | 'REFLECTION';
      payload: any;
      context?: Record<string, any>;
    }
  ): Promise<any> {
    const avatar = this.activeAvatars.get(avatarId);
    const session = this.avatarSessions.get(avatarId);

    if (!avatar || !session) {
      throw new Error(`化身 ${avatarId} 未激活`);
    }

    const soul = SoulManager.getSoul(avatar.baseAgentId);
    if (!soul) {
      throw new Error(`基礎靈魂 ${avatar.baseAgentId} 不存在`);
    }

    session.lastActivity = Date.now();

    try {
      // 應用角色面具和能力過濾
      const effectivePersona = this.applyPersonaMask(soul.essence, avatar.personaMask);
      const effectiveCapabilities = this.filterCapabilities(soul.authority.skills, avatar.capabilityFilter);

      // 執行交互邏輯
      const result = await this.processInteraction(
        interaction,
        effectivePersona,
        effectiveCapabilities,
        soul,
        session
      );

      // 更新會話熵值
      session.entropy = this.calculateEntropy(session);

      // 記錄到共鳴數據
      this.recordResonance(soul, avatar, interaction, result);

      return result;

    } catch (error) {
      // 增加熵值表示混亂
      session.entropy += 10;
      throw error;
    }
  }

  /**
   * 解散化身 - 熵減回歸
   */
  static async dissolveAvatar(avatarId: string): Promise<void> {
    const avatar = this.activeAvatars.get(avatarId);
    const session = this.avatarSessions.get(avatarId);

    if (!avatar || !session) {
      return; // 已經解散
    }

    // 執行熵減 - 將會話經驗寫回靈魂
    await this.performEntropyReduction(avatar.baseAgentId, session);

    // 清理資源
    await SoulManager.dissolveAvatar(avatar.baseAgentId, avatarId);

    this.activeAvatars.delete(avatarId);
    this.avatarSessions.delete(avatarId);

    console.log(`💫 化身 ${avatarId} 解散回歸 - 經驗已沉澱到靈魂`);
  }

  /**
   * 批量管理化身生命週期
   */
  static async manageAvatarLifecycle(): Promise<void> {
    const now = Date.now();
    const avatarsToDissolve: string[] = [];

    // 檢查過期的化身
    for (const [avatarId, avatar] of this.activeAvatars) {
      const session = this.avatarSessions.get(avatarId);
      if (!session) continue;

      const age = now - session.createdAt;
      const idleTime = now - session.lastActivity;

      // 生命週期到期或長時間閒置
      if (age > avatar.lifetime || idleTime > 3600000) { // 1小時閒置
        avatarsToDissolve.push(avatarId);
      }
    }

    // 批量解散
    for (const avatarId of avatarsToDissolve) {
      await this.dissolveAvatar(avatarId);
    }

    if (avatarsToDissolve.length > 0) {
      console.log(`🧹 清理了 ${avatarsToDissolve.length} 個過期化身`);
    }
  }

  /**
   * 獲取化身狀態
   */
  static getAvatarStatus(avatarId: string): {
    avatar: SoulAvatar;
    session: any;
    soul: AgentSoul5D;
    health: number;
    resonance: number;
  } | null {
    const avatar = this.activeAvatars.get(avatarId);
    const session = this.avatarSessions.get(avatarId);

    if (!avatar || !session) return null;

    const soul = SoulManager.getSoul(avatar.baseAgentId);
    if (!soul) return null;

    return {
      avatar,
      session: {
        personaOverride: session.personaOverride,
        capabilityMask: Array.from(session.capabilityMask),
        lastActivity: session.lastActivity,
        entropy: session.entropy
      },
      soul,
      health: Math.max(0, 100 - session.entropy),
      resonance: soul.resonance.resonanceScore
    };
  }

  /**
   * 獲取所有活動化身
   */
  static getActiveAvatars(): Array<{
    id: string;
    soulId: string;
    persona: string;
    capabilities: number;
    entropy: number;
    age: number;
  }> {
    return Array.from(this.activeAvatars.entries()).map(([id, avatar]) => {
      const session = this.avatarSessions.get(id);
      return {
        id,
        soulId: avatar.baseAgentId,
        persona: Object.keys(avatar.personaMask).join(', ') || '原始形態',
        capabilities: avatar.capabilityFilter.length,
        entropy: session?.entropy || 0,
        age: Date.now() - (session?.createdAt || Date.now())
      };
    });
  }

  // 私有輔助方法

  private static applyPersonaMask(baseEssence: any, mask: Record<string, any>): any {
    // 深度合併角色面具
    return {
      ...baseEssence,
      ...mask,
      // 保留核心身份但允許覆蓋
      name: mask.name || baseEssence.name,
      archetype: mask.archetype || baseEssence.archetype
    };
  }

  private static filterCapabilities(skills: any[], filters: string[]): any[] {
    if (filters.length === 0) return skills;

    return skills.filter(skill =>
      filters.some(filter =>
        skill.name.toLowerCase().includes(filter.toLowerCase()) ||
        skill.type.toLowerCase().includes(filter.toLowerCase())
      )
    );
  }

  private static async processInteraction(
    interaction: any,
    persona: any,
    capabilities: any[],
    soul: AgentSoul5D,
    session: any
  ): Promise<any> {
    // 模擬AI交互處理
    // 這裡應該整合實際的AI服務調用

    const response = {
      avatarId: session.avatarId,
      interactionType: interaction.type,
      persona: persona.name,
      capabilitiesUsed: capabilities.length,
      entropyDelta: Math.random() * 5,
      timestamp: Date.now(),
      content: `化身 ${persona.name} 處理了 ${interaction.type} 請求`
    };

    // 存儲到會話記憶
    session.sessionMemory.set(`interaction_${Date.now()}`, {
      input: interaction,
      output: response,
      persona,
      capabilities
    });

    return response;
  }

  private static calculateEntropy(session: any): number {
    let entropy = 0;

    // 基於會話年齡
    const age = Date.now() - session.createdAt;
    entropy += Math.min(50, age / 100000); // 每10秒+0.1熵

    // 基於記憶大小
    entropy += Math.min(30, session.sessionMemory.size * 2);

    // 基於活動頻率
    const activityDensity = session.sessionMemory.size / Math.max(1, age / 60000); // 每分鐘
    entropy += Math.min(20, activityDensity * 5);

    return Math.min(100, entropy);
  }

  private static recordResonance(
    soul: AgentSoul5D,
    avatar: SoulAvatar,
    interaction: any,
    result: any
  ): void {
    soul.resonance.interactionCount++;
    soul.resonance.avatarId = avatar.id;

    // 記錄熵變化
    const entropyDelta = result.entropyDelta || 0;
    soul.resonance.entropyHistory.push(entropyDelta);

    // 保持歷史記錄在合理大小
    if (soul.resonance.entropyHistory.length > 100) {
      soul.resonance.entropyHistory = soul.resonance.entropyHistory.slice(-100);
    }

    // 記錄進化日誌
    soul.resonance.evolutionLog.push({
      timestamp: Date.now(),
      action: interaction.type,
      entropyDelta
    });
  }

  private static async performEntropyReduction(soulId: string, session: any): Promise<void> {
    // 將會話記憶沉澱為靈魂知識
    const memoryArray = Array.from(session.sessionMemory.values());

    if (memoryArray.length > 0) {
      // 這裡可以實現更複雜的知識萃取邏輯
      console.log(`📚 從會話萃取 ${memoryArray.length} 條經驗寫入靈魂 ${soulId}`);
    }
  }

  // 初始化生命週期管理器
  static startLifecycleManager(): void {
    // 每5分鐘檢查一次
    setInterval(() => {
      this.manageAvatarLifecycle();
    }, 300000);
  }
}

// 啟動生命週期管理器
AvatarOrchestrator.startLifecycleManager();