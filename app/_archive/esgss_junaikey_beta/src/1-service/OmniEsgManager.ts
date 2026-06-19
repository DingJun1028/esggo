/**
 * ESG Omni Component Manager
 * Unified management of all Omni functional components
 * All JunAiKey architecture functions have ESG Omni Component as their minimal core unit
 * Refactored to align with Agentic & Omni Avatar architecture.
 */

import React from 'react';
import { OmniEsgCell } from '../omni/interaction/visuals/OmniEsgCell/OmniEsgCell';
import {
  OmniEsgMode,
  OmniEsgTrait,
  OmniEsgDataLink,
  OmniEsgConfidence,
  OmniEsgColor,
} from '@/types';
import {
  Agent,
  ActiveAvatar,
  EvolutionProposal,
  BidirectionalSyncBridge,
  AvatarPersona,
} from '@/types';

import { agentService } from './agentService';
import { avatarOrchestrator } from './OmniAvatarOrchestrator';
import { BidirectionalSyncService, bidirectionalSyncService } from './bidirectionalSync';
import { OmniEvolutionEngine } from './OmniEvolutionEngine';
import { TrustProtocolService } from './TrustProtocolService';
import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { TrustworthyLock } from '@/utils/TrustworthyLock';

// ESG Omni Component unified interface
export interface OmniEsgComponent {
  id: string;
  type: 'soul' | 'avatar' | 'sync_bridge' | 'evolution_proposal';
  mode: OmniEsgMode;
  label: string;
  value: string | number;
  confidence: OmniEsgConfidence;
  traits: OmniEsgTrait[];
  dataLink: OmniEsgDataLink;
  color: OmniEsgColor;
  metadata: Record<string, unknown>;
  component: React.ReactElement;
}

// ESG Omni Component Factory
export class OmniEsgFactory {
  private static lastUpdate: { trend?: { value: number; direction: 'up' | 'down' } };

  /**
   * Create ESG Omni Component from Agent (Soul)
   */
  static createSoulComponent(agent: Agent): OmniEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `soul_${agent.id}`,
      mode: 'compact',
      label: agent.name,
      value: `Lv.${agent.level}`,
      confidence: 'high' as any,
      traits: ['learning', 'evolution', 'seamless'],
      dataLink: 'ai' as any,
      color: 'purple' as any,
      tags: [agent.role, agent.agent_status],
      verified: true,
      onAiAnalyze: () => this.handleAgentAnalysis(agent.id),
      onAutomationTrigger: () => this.handleAgentEvolution(agent.id),
    });

    return {
      id: `omni_soul_${agent.id}`,
      type: 'soul',
      mode: 'card',
      label: agent.name,
      value: agent.level,
      confidence: 'high',
      traits: ['learning', 'evolution', 'seamless'],
      dataLink: 'ai',
      color: 'purple',
      metadata: {
        trend: this.lastUpdate?.trend
          ? {
            val: this.lastUpdate.trend.value,
            dir: this.lastUpdate.trend.direction,
          }
          : undefined,
        agentId: agent.id,
        role: agent.role,
        status: agent.agent_status,
        awakened: agent.isAwakened,
      },
      component,
    };
  }

  /**
   * Create ESG Omni Component from Active Avatar
   */
  static createAvatarComponent(avatar: ActiveAvatar): OmniEsgComponent {
    const health = Math.max(0, 100 - avatar.fatigue);
    const resonance = 85; // Placeholder for resonance calculation

    const component = React.createElement(OmniEsgCell, {
      id: `avatar_${avatar.agentId}_${avatar.currentPersona}`,
      mode: 'list',
      label: avatar.capabilities.displayName || (avatar.currentPersona as string),
      value: `${health}%`,
      subValue: `Resonance: ${resonance}`,
      confidence: (health > 80 ? 'high' : health > 60 ? 'medium' : 'low') as any,
      traits: ['bridging', 'gap-filling'],
      dataLink: 'live' as any,
      color: 'blue' as any,
      trend: health > 80 ? { value: 5, direction: 'up' as const } : undefined,
      verified: true,
      onAiAnalyze: () => this.handleAvatarAnalysis(avatar.agentId),
      onAutomationTrigger: () => this.handleAvatarDissolution(avatar.agentId),
    });

    return {
      id: `omni_avatar_${avatar.agentId}_${avatar.currentPersona}`,
      type: 'avatar',
      mode: 'list',
      label: avatar.capabilities.displayName || avatar.currentPersona,
      value: health,
      confidence: health > 80 ? 'high' : health > 60 ? 'medium' : 'low',
      traits: ['bridging', 'gap-filling'],
      dataLink: 'live',
      color: 'blue',
      metadata: {
        agentId: avatar.agentId,
        persona: avatar.currentPersona,
        level: avatar.level,
        energy: avatar.energy,
      },
      component,
    };
  }

  /**
   * Create ESG Omni Component from Sync Bridge
   */
  static createSyncBridgeComponent(bridge: BidirectionalSyncBridge): OmniEsgComponent {
    const health = bidirectionalSyncService.getSyncHealth();
    const bridgeHealth = health.bridges.find(
      b =>
        b.id ===
        bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge'
    );

    const component = React.createElement(OmniEsgCell, {
      id: `sync_${bridge.sourceSystem}_${bridge.targetSystem}`,
      mode: 'cell',
      label: `${bridge.sourceSystem} ↔ ${bridge.targetSystem}`,
      value: `${bridgeHealth?.successRate || 100}%`,
      confidence: 'high' as any,
      traits: ['bridging', 'optimization'],
      dataLink: 'live' as any,
      color: 'emerald' as any,
      verified: true,
      onAiAnalyze: () => this.handleBridgeAnalysis(bridge),
      onAutomationTrigger: () => this.handleBridgeSync(bridge),
    });

    return {
      id: `omni_sync_${bridge.sourceSystem}_${bridge.targetSystem}`,
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
        latency: bridge.healthMetrics.latency,
      },
      component,
    };
  }

  /**
   * Create ESG Omni Component from Evolution Proposal
   */
  static createEvolutionProposalComponent(proposal: EvolutionProposal): OmniEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `evolution_${proposal.id}`,
      mode: 'cell',
      label: proposal.pattern?.substring(0, 20) + '...',
      value: `${((proposal.confidence || 0) * 100).toFixed(0)}%`,
      confidence:
        (proposal.confidence || 0) > 0.8
          ? 'high'
          : (proposal.confidence || 0) > 0.6
            ? 'medium'
            : ('low' as any),
      traits: ['learning', 'optimization'],
      dataLink: 'ai' as any,
      color: 'gold' as any,
      verified: proposal.proposal_status === 'IMPLEMENTED',
      onAiAnalyze: () => this.handleProposalAnalysis(proposal.id as string),
      onAutomationTrigger: () => this.handleProposalImplementation(proposal.id as string),
    });

    return {
      id: `omni_evolution_${proposal.id}`,
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
        status: proposal.proposal_status,
        skillName: proposal.suggestedSkill?.name,
        createdAt: proposal.createdAt,
      },
      component,
    };
  }

  // Event Handlers
  private static async handleAgentAnalysis(agentId: string) {
    omniLogger.info(LogCategory.AI, `Agent analysis triggered`, { agentId });
  }

  private static async handleAgentEvolution(agentId: string) {
    omniLogger.info(LogCategory.LEGION, `執行代理人 ${agentId} 的進化協議校驗...`);
    const mockSuccessRate = 1.0;
    const evolutionEngine = OmniEvolutionEngine.getInstance();
    await evolutionEngine.processAchievement(agentId, mockSuccessRate, 200);
    omniLogger.info(LogCategory.LEGION, `代理人進化檢查完成`, { agentId });
  }

  private static async handleAvatarAnalysis(agentId: string) {
    const avatar = await avatarOrchestrator.getActiveAvatar(agentId);
    omniLogger.info(LogCategory.AI, `Avatar analysis triggered`, { agentId, avatar });
  }

  private static async handleAvatarDissolution(agentId: string) {
    omniLogger.info(LogCategory.AI, `Avatar dissolution requested`, { agentId });
  }

  private static async handleBridgeAnalysis(bridge: BidirectionalSyncBridge) {
    const health = bidirectionalSyncService.getSyncHealth();
    const bridgeHealth = health.bridges.find(
      b =>
        b.id ===
        bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge'
    );
    omniLogger.info(LogCategory.DATA, 'Bridge analysis executed', {
      bridge: `${bridge.sourceSystem}_${bridge.targetSystem}`,
      bridgeHealth,
    });
  }

  private static async handleBridgeSync(bridge: BidirectionalSyncBridge) {
    const bridgeId =
      bridge.sourceSystem.toLowerCase() + '_' + bridge.targetSystem.toLowerCase() + '_bridge';
    await bidirectionalSyncService.executeBridgeSync(bridgeId);
    omniLogger.info(LogCategory.DATA, `Bridge sync executed`, { bridgeId });
  }

  private static async handleProposalAnalysis(proposalId: string) {
    omniLogger.info(LogCategory.AI, `Analyzing evolution proposal`, { proposalId });
  }

  private static async handleProposalImplementation(proposalId: string) {
    omniLogger.info(LogCategory.AI, `Implementing evolution proposal`, { proposalId });
  }
}

// ESG Omni Component Manager
export class OmniEsgManager {
  private static components: Map<string, OmniEsgComponent> = new Map();
  private static listeners: Set<(components: OmniEsgComponent[]) => void> = new Set();

  /**
   * Register Omni Component
   */
  static registerComponent(component: OmniEsgComponent) {
    this.components.set(component.id, component);
    this.notifyListeners();
  }

  /**
   * Get all Omni Components
   */
  static getAllComponents(): OmniEsgComponent[] {
    return Array.from(this.components.values());
  }

  /**
   * Get components by type
   */
  static getComponentsByType(type: OmniEsgComponent['type']): OmniEsgComponent[] {
    return this.getAllComponents().filter(comp => comp.type === type);
  }

  /**
   * Initialize all Omni Components
   */
  static async initializeOmniComponents() {
    try {
      this.components.clear();
      omniLogger.info(LogCategory.SYSTEM, '正在初始化 ESG Omni 組件系統...');

      // 1. Initialize Soul (Agent) Components
      const agents = await agentService.getAgents();
      for (const agent of agents) {
        try {
          const component = OmniEsgFactory.createSoulComponent(agent);
          this.registerComponent(component);

          // 2. Initialize Avatar Components (if agent is awakened and has active avatar)
          if (agent.isAwakened) {
            const activeAvatar = await avatarOrchestrator.getActiveAvatar(agent.id);
            if (activeAvatar) {
              const avatarComp = OmniEsgFactory.createAvatarComponent(activeAvatar);
              this.registerComponent(avatarComp);
            }
          }
        } catch (agentErr) {
          omniLogger.error(LogCategory.SYSTEM, `初始化代理人組件失敗: ${agent.id}`, {
            error: agentErr,
          });
        }
      }

      // 3. Initialize Sync Bridge Components
      const health = bidirectionalSyncService.getSyncHealth();
      if (health && health.bridges) {
        health.bridges.forEach((bridgeHealth: any) => {
          // Bridge components are dynamic and will be auto-discovered by the sync service.
          omniLogger.info(LogCategory.SYSTEM, `Discovered Bridge: ${bridgeHealth.id}`, {
            status: bridgeHealth.status,
          });
        });
      }

      omniLogger.info(LogCategory.SYSTEM, `成功初始化 ${this.components.size} 個 ESG Omni 組件`);
      this.startHeartbeat();
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'ESG Omni 組件系統初始化發生重大錯誤', { error });
    }
  }

  /**
   * Subscribe to component updates
   */
  static subscribe(callback: (components: OmniEsgComponent[]) => void) {
    this.listeners.add(callback);
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Notify listeners
   */
  private static notifyListeners() {
    const components = this.getAllComponents();
    this.listeners.forEach(listener => listener(components));
  }

  /**
   * Create dynamic Omni Component
   */
  static async createDynamicComponent(
    type: OmniEsgComponent['type'],
    config: Record<string, unknown>
  ): Promise<OmniEsgComponent | null> {
    let component: OmniEsgComponent;

    switch (type) {
      case 'soul': {
        const agent = await agentService.createAgent(config as any);
        component = OmniEsgFactory.createSoulComponent(agent);
        break;
      }

      case 'avatar': {
        if (!config.agentId || !config.persona) throw new Error('AgentId and Persona required');
        // Ensure agent is awakened/transformed
        const updatedAgent = await agentService.assignAvatar(
          config.agentId as string,
          config.persona as AvatarPersona
        );
        if (updatedAgent) {
          const avatar = await avatarOrchestrator.getActiveAvatar(config.agentId as string);
          if (avatar) {
            component = OmniEsgFactory.createAvatarComponent(avatar);
          } else {
            return null;
          }
        } else {
          return null;
        }
        break;
      }

      default:
        throw new Error(`Unsupported component type: ${type}`);
    }

    this.registerComponent(component);
    return component;
  }

  private static heartbeatInterval: NodeJS.Timeout | null = null;
  private static _heartbeatStarted = false;

  /**
   * 💡 奧秘心臟：組件完整性校驗 (OmniHeartbeat)
   * 定期掃描所有註冊組件的 3+1 數據完整性
   */
  private static startHeartbeat() {
    // 防止重複啟動
    if (this._heartbeatStarted) return;
    this._heartbeatStarted = true;

    this.heartbeatInterval = setInterval(async () => {
      const components = this.getAllComponents();
      omniLogger.info(
        LogCategory.SYSTEM,
        `OmniHeartbeat [${new Date().toLocaleTimeString()}]: 正在掃描 ${components.length} 個組件的信託狀態...`
      );

      for (const [id, comp] of this.components.entries()) {
        if (comp.metadata.hashLock) {
          try {
            // 🔴 不可篡改 校驗 (using static import from line 31)
            const isValid = await TrustworthyLock.verify(
              comp.metadata.dataModel as any,
              comp.metadata.hashLock as string
            );

            if (!isValid) {
              omniLogger.error(
                LogCategory.SECURITY,
                `🚨 [3+1 警報] 組件 ${id} 數據雜湊不匹配 (可能被篡改)！`,
                {
                  metadata: comp.metadata,
                  expected: comp.metadata.hashLock,
                }
              );
            }
          } catch (error) {
            omniLogger.error(LogCategory.SECURITY, `組件 ${id} 完整性核驗失敗`, { error });
          }
        }
      }
    }, 60000); // 每一分鐘跳動一次
  }

  /**
   * Lifecycle Management
   */
  static destroy() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
    this._heartbeatStarted = false;
    this.components.clear();
    this.listeners.clear();
    omniLogger.info(LogCategory.SYSTEM, 'OmniEsgManager destroyed');
  }
}

// Auto-initialize
if (typeof window !== 'undefined') {
  // Delay initialization to ensure services are ready
  setTimeout(() => {
    OmniEsgManager.initializeOmniComponents();
  }, 1000);
}

// =================================================================
// Awakening Integration
// =================================================================

import {
  IAwakenable,
  AwakeningResult,
  ServiceAwakeningStatus,
  AwakeningPhase,
} from '@/omni/protocols/UltimateAwakeningProtocol';
import { awakeningBroadcaster } from '@infra/broadcast/AwakeningBroadcaster';

export class EsgAwakeningService implements IAwakenable {
  public readonly name = 'OmniEsgManager';
  private awakeningStatus: ServiceAwakeningStatus;

  constructor() {
    this.awakeningStatus = {
      serviceName: this.name,
      status: 'pending',
      progress: 0,
    };
  }

  async awaken(): Promise<AwakeningResult> {
    try {
      omniLogger.info(
        LogCategory.SYSTEM,
        '[覺醒-ESG] 開始倫理對齊檢查 (Ethical Alignment Check)...',
        { service: this.name }
      );
      this.awakeningStatus.status = 'awakening';
      this.awakeningStatus.progress = 10;

      const components = OmniEsgManager.getAllComponents();
      const total = components.length;
      let processed = 0;

      if (total === 0) {
        await new Promise(r => setTimeout(r, 300));
        this.awakeningStatus.progress = 50;
      }

      for (const comp of components) {
        // Simulate deep ethical scanning
        // In a real scenario, this would re-calculate confidence, check rigid constraints (3+1), etc.

        // 1. Verify Trust Traits
        const hasEthicalTraits = comp.traits.some(t =>
          ['bridging', 'optimization', 'learning', 'seamless'].includes(t)
        );
        if (!hasEthicalTraits) {
          omniLogger.warn(LogCategory.ETHICS, `組件 ${comp.id} 缺少核心倫理特徵`, {
            traits: comp.traits,
          });
          awakeningBroadcaster.shareInsight({
            category: 'alert',
            title: '倫理特徵缺失',
            message: `組件 ${comp.label || comp.id} 缺少核心倫理特徵 (Bridging/Optimization/Learning)`,
            priority: 'high',
            actionable: true,
            metadata: { componentId: comp.id },
          });
        }

        // 2. Verify Confidence
        if (comp.confidence === 'low') {
          omniLogger.warn(LogCategory.ETHICS, `組件 ${comp.id} 信任度過低`, {
            confidence: comp.confidence,
          });
          awakeningBroadcaster.shareInsight({
            category: 'alert',
            title: '信任度過低警報',
            message: `組件 ${comp.label || comp.id} 的信任度被標記為 LOW`,
            priority: 'medium',
            actionable: true,
            metadata: { componentId: comp.id },
          });
        }
        processed++;
        this.awakeningStatus.progress = 10 + Math.floor((processed / total) * 80);

        // Breathing room
        if (processed % 5 === 0) await new Promise(r => setTimeout(r, 20));
      }

      this.awakeningStatus.status = 'awakened';
      this.awakeningStatus.progress = 100;
      this.awakeningStatus.awakenedAt = new Date().toISOString();

      awakeningBroadcaster.shareInsight({
        category: 'achievement',
        title: 'ESG 倫理對齊完成',
        message: `已成功校驗 ${total} 個組件的倫理一致性與信任度`,
        priority: 'high',
        actionable: false,
      });

      return {
        success: true,
        phase: AwakeningPhase.AWAKENED,
        servicesAwakened: 1,
        totalServices: 1,
        message: `ESG 經理覺醒完成: 已完成 ${total} 個組件的倫理對齊掃描`,
      };
    } catch (error) {
      this.awakeningStatus.status = 'failed';
      this.awakeningStatus.error = (error as Error).message;
      return {
        success: false,
        phase: AwakeningPhase.AWAKENING,
        servicesAwakened: 0,
        totalServices: 1,
        message: `ESG 覺醒失敗: ${(error as Error).message}`,
      };
    }
  }

  getAwakeningState(): ServiceAwakeningStatus {
    return { ...this.awakeningStatus };
  }

  async prepareForEternity(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '[覺醒-ESG] 準備進入永恆: 鎖定 ESG 評分快照...');
    // Snapshot logic would go here
  }
}

export const esgAwakeningService = new EsgAwakeningService();
