/**
 * ESG Omni Component Manager
 * Unified management of all Omni functional components
 * All JunAiKey architecture functions have ESG Omni Component as their minimal core unit
 */

import React from 'react';
import { OmniEsgCell } from '../components/OmniEsgCell';
import { OmniEsgMode, OmniEsgTrait, OmniEsgDataLink, OmniEsgConfidence, OmniEsgColor } from '../types';
import { SoulManager } from './soulManager';
import { AvatarOrchestrator } from './avatarOrchestrator';
import { BidirectionalSyncService } from './bidirectionalSync';
import { EvolutionProposal, AgentSoul5D, SoulAvatar, BidirectionalSyncBridge } from '../types';

// ESG Omni Component unified interface
export interface UniversalEsgComponent {
  id: string;
  type: 'soul' | 'avatar' | 'sync_bridge' | 'evolution_proposal';
  mode: OmniEsgMode;
  label: string;
  value: any;
  confidence: OmniEsgConfidence;
  traits: OmniEsgTrait[];
  dataLink: OmniEsgDataLink;
  color: OmniEsgColor;
  metadata: Record<string, any>;
  component: React.ReactElement;
}

// ESG Omni Component Factory
export class UniversalEsgFactory {
  /**
   * 從靈魂創建ESG萬能元件
   */
  static createSoulComponent(soul: AgentSoul5D): UniversalEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `soul_${soul.id}`,
      mode: 'card' as OmniEsgMode,
      label: soul.name,
      value: soul.version,
      confidence: 'high' as OmniEsgConfidence,
      traits: ['learning', 'evolution', 'seamless'] as OmniEsgTrait[],
      dataLink: 'ai' as OmniEsgDataLink,
      color: 'purple' as OmniEsgColor,
      tags: soul.tags,
      verified: true,
      onAiAnalyze: () => this.handleSoulAnalysis(soul.id),
      onAutomationTrigger: () => this.handleSoulEvolution(soul.id)
    });

    return {
      id: `universal_soul_${soul.id}`,
      type: 'soul',
      mode: 'card',
      label: soul.name,
      value: soul.version,
      confidence: 'high',
      traits: ['learning', 'evolution', 'seamless'],
      dataLink: 'ai',
      color: 'purple',
      metadata: {
        soulId: soul.id,
        archetype: soul.essence.archetype,
        resonanceScore: soul.resonance.resonanceScore,
        evolutionProposals: soul.evolutionProposals.length
      },
      component
    };
  }

  /**
   * 從化身創建ESG萬能元件
   */
  static createAvatarComponent(avatar: SoulAvatar): UniversalEsgComponent {
    const session = AvatarOrchestrator.getAvatarStatus(avatar.id);
    const health = session?.health || 100;
    const resonance = session?.resonance || 50;

    const component = React.createElement(OmniEsgCell, {
      id: `avatar_${avatar.id}`,
      mode: 'list' as OmniEsgMode,
      label: avatar.personaMask.name || '化身實體',
      value: `${health}%`,
      subValue: `共鳴: ${resonance}`,
      confidence: health > 80 ? 'high' : health > 60 ? 'medium' : 'low' as OmniEsgConfidence,
      traits: ['bridging', 'gap-filling'] as OmniEsgTrait[],
      dataLink: 'live' as OmniEsgDataLink,
      color: 'blue' as OmniEsgColor,
      trend: health > 80 ? { value: 5, direction: 'up' as const } : undefined,
      verified: true,
      onAiAnalyze: () => this.handleAvatarAnalysis(avatar.id),
      onAutomationTrigger: () => this.handleAvatarDissolution(avatar.id)
    });

    return {
      id: `universal_avatar_${avatar.id}`,
      type: 'avatar',
      mode: 'list',
      label: avatar.personaMask.name || '化身實體',
      value: health,
      confidence: health > 80 ? 'high' : health > 60 ? 'medium' : 'low',
      traits: ['bridging', 'gap-filling'],
      dataLink: 'live',
      color: 'blue',
      metadata: {
        avatarId: avatar.id,
        soulId: avatar.baseAgentId,
        lifetime: avatar.lifetime,
        entropy: session?.session?.entropy || 0
      },
      component
    };
  }

  /**
   * 從同步橋接器創建ESG萬能元件
   */
  static createSyncBridgeComponent(bridge: BidirectionalSyncBridge): UniversalEsgComponent {
    const health = BidirectionalSyncService.getSyncHealth();
    const bridgeHealth = health.bridges.find(b => b.id === bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge');

    const component = React.createElement(OmniEsgCell, {
      id: `sync_${bridge.sourceSystem}_${bridge.targetSystem}`,
      mode: 'compact' as OmniEsgMode,
      label: `${bridge.sourceSystem} ↔ ${bridge.targetSystem}`,
      value: `${bridgeHealth?.successRate || 100}%`,
      confidence: 'high' as OmniEsgConfidence,
      traits: ['bridging', 'optimization'] as OmniEsgTrait[],
      dataLink: 'live' as OmniEsgDataLink,
      color: 'emerald' as OmniEsgColor,
      verified: true,
      onAiAnalyze: () => this.handleBridgeAnalysis(bridge),
      onAutomationTrigger: () => this.handleBridgeSync(bridge)
    });

    return {
      id: `universal_sync_${bridge.sourceSystem}_${bridge.targetSystem}`,
      type: 'sync_bridge',
      mode: 'compact',
      label: `${bridge.sourceSystem} ↔ ${bridge.targetSystem}`,
      value: bridgeHealth?.successRate || 100,
      confidence: 'high',
      traits: ['bridging', 'optimization'],
      dataLink: 'live',
      color: 'emerald',
      metadata: {
        sourceSystem: bridge.sourceSystem,
        targetSystem: bridge.targetSystem,
        lastSync: bridge.healthMetrics.lastSync,
        latency: bridge.healthMetrics.latency
      },
      component
    };
  }

  /**
   * 從進化建議創建ESG萬能元件
   */
  static createEvolutionProposalComponent(proposal: EvolutionProposal): UniversalEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `evolution_${proposal.id}`,
      mode: 'cell' as OmniEsgMode,
      label: proposal.pattern.substring(0, 20) + '...',
      value: `${proposal.confidence * 100}%`,
      confidence: proposal.confidence > 0.8 ? 'high' : proposal.confidence > 0.6 ? 'medium' : 'low' as OmniEsgConfidence,
      traits: ['learning', 'optimization'] as OmniEsgTrait[],
      dataLink: 'ai' as OmniEsgDataLink,
      color: 'gold' as OmniEsgColor,
      verified: proposal.status === 'IMPLEMENTED',
      onAiAnalyze: () => this.handleProposalAnalysis(proposal.id),
      onAutomationTrigger: () => this.handleProposalImplementation(proposal.id)
    });

    return {
      id: `universal_evolution_${proposal.id}`,
      type: 'evolution_proposal',
      mode: 'cell',
      label: proposal.pattern.substring(0, 20) + '...',
      value: proposal.confidence,
      confidence: proposal.confidence > 0.8 ? 'high' : proposal.confidence > 0.6 ? 'medium' : 'low',
      traits: ['learning', 'optimization'],
      dataLink: 'ai',
      color: 'gold',
      metadata: {
        proposalId: proposal.id,
        status: proposal.status,
        skillName: proposal.suggestedSkill?.name,
        createdAt: proposal.createdAt
      },
      component
    };
  }

  // 事件處理方法
  private static async handleSoulAnalysis(soulId: string) {
    const proposals = await SoulManager.analyzeSoulPatterns(soulId);
    console.log(`靈魂 ${soulId} 分析完成，生成 ${proposals.length} 個進化建議`);
  }

  private static async handleSoulEvolution(soulId: string) {
    const protocol = SoulManager.createEvolutionProtocol({
      targetAgent: soulId,
      optimization: { performanceTarget: 25, compressionTarget: 30, simplicityScore: 85 },
      expansion: { newFeatures: ['智慧ESG分析'], resilienceImprovements: ['錯誤恢復'] },
      integration: { modularCompliance: true, standardInterfaces: ['REST'] },
      innovation: { paradigmShifts: ['從合規到價值創造'], adaptiveCapabilities: ['自適應學習'] }
    });

    await SoulManager.executeEvolutionProtocol(soulId);
    console.log(`靈魂 ${soulId} 進化協議已啟動`);
  }

  private static async handleAvatarAnalysis(avatarId: string) {
    const status = AvatarOrchestrator.getAvatarStatus(avatarId);
    console.log(`化身 ${avatarId} 狀態:`, status);
  }

  private static async handleAvatarDissolution(avatarId: string) {
    await AvatarOrchestrator.dissolveAvatar(avatarId);
    console.log(`化身 ${avatarId} 已解散`);
  }

  private static async handleBridgeAnalysis(bridge: BidirectionalSyncBridge) {
    const health = BidirectionalSyncService.getSyncHealth();
    const bridgeHealth = health.bridges.find(b =>
      b.id === bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge'
    );
    console.log(`橋接器分析:`, bridgeHealth);
  }

  private static async handleBridgeSync(bridge: BidirectionalSyncBridge) {
    const bridgeId = bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge';
    await BidirectionalSyncService.executeBridgeSync(bridgeId);
    console.log(`橋接器 ${bridgeId} 同步已執行`);
  }

  private static async handleProposalAnalysis(proposalId: string) {
    console.log(`分析進化建議 ${proposalId}`);
  }

  private static async handleProposalImplementation(proposalId: string) {
    // 這裡需要找到對應的靈魂ID並應用建議
    // 這是一個簡化的實現
    console.log(`實施進化建議 ${proposalId}`);
  }
}

// ESG Omni Component Manager
export class UniversalEsgManager {
  private static components: Map<string, UniversalEsgComponent> = new Map();
  private static listeners: Set<(components: UniversalEsgComponent[]) => void> = new Set();

  /**
   * Register Omni Component
   */
  static registerComponent(component: UniversalEsgComponent) {
    this.components.set(component.id, component);
    this.notifyListeners();
  }

  /**
   * Get all Omni Components
   */
  static getAllComponents(): UniversalEsgComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by type
   */
  static getComponentsByType(type: UniversalEsgComponent['type']): UniversalEsgComponent[] {
    return this.getAllComponents().filter(comp => comp.type === type);
  }

  /**
   * Initialize all Omni Components
   */
  static async initializeUniversalComponents() {
    // 初始化ESG靈魂元件
    const souls = SoulManager.getAllSouls();
    souls.forEach(soul => {
      const component = UniversalEsgFactory.createSoulComponent(soul);
      this.registerComponent(component);
    });

    // 初始化活動化身元件
    const activeAvatars = AvatarOrchestrator.getActiveAvatars();
    activeAvatars.forEach(avatarData => {
      // 這裡需要從avatarData構造完整的SoulAvatar對象
      // 簡化實現
    });

    // 初始化同步橋接器元件
    const health = BidirectionalSyncService.getSyncHealth();
    health.bridges.forEach(bridgeData => {
      // 創建橋接器元件
    });

    console.log(`Initialized ${this.components.size} ESG Omni Components`);
  }

  /**
   * 訂閱元件變化
   */
  static subscribe(callback: (components: UniversalEsgComponent[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  /**
   * 通知監聽器
   */
  private static notifyListeners() {
    const components = this.getAllComponents();
    this.listeners.forEach(listener => listener(components));
  }

  /**
   * Create dynamic Omni Component
   */
  static async createDynamicComponent(
    type: UniversalEsgComponent['type'],
    config: any
  ): Promise<UniversalEsgComponent> {
    let component: UniversalEsgComponent;

    switch (type) {
      case 'soul':
        const soul = await SoulManager.createSoul(config);
        component = UniversalEsgFactory.createSoulComponent(soul);
        break;

      case 'avatar':
        const avatar = await AvatarOrchestrator.manifestAvatar(
          config.soulId,
          config.personaMask,
          config.capabilityFilter
        );
        component = UniversalEsgFactory.createAvatarComponent(avatar);
        break;

      default:
        throw new Error(`不支援的元件類型: ${type}`);
    }

    this.registerComponent(component);
    return component;
  }
}

// 自動初始化
if (typeof window !== 'undefined') {
  // 延遲初始化以確保所有服務都已載入
  setTimeout(() => {
    UniversalEsgManager.initializeUniversalComponents();
  }, 1000);
}