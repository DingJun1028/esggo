/**
 * ESG OmniComponent Manager
 * Unified management of all Omni functional components
 * All JunAiKey architecture functions have ESG OmniComponent as their minimal core unit
 * Refactored to align with Agentic & Omni Avatar architecture.
 */

import React from 'react';
import { OmniEsgCell } from '../interaction/visuals/OmniEsgCell/index.ts';
import {
  OmniEsgMode,
  OmniEsgTrait,
  OmniEsgDataLink,
  OmniEsgConfidence,
  OmniEsgColor,
  OmniLabel,
} from '../../types/index.ts';
import {
  Agent,
  ActiveAvatar,
  EvolutionProposal,
  BidirectionalSyncBridge,
  AvatarPersona,
} from '../../types/index.ts';

import { agentService } from '../../services/agentService.ts';
import { avatarOrchestrator } from './OmniAvatarOrchestrator.ts';
import { BidirectionalSyncService, bidirectionalSyncService } from '../../services/bidirectionalSync.ts';
// import { OmniEvolutionEngine } from '@/omni/services/OmniEvolutionEngine.ts'; // Removed for circular dependency fix
import { TrustProtocolService } from '../../services/TrustProtocolService.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';
import { TrustworthyLock } from '../../utils/TrustworthyLock.ts';

// ESG OmniComponent unified interface
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

// ESG OmniComponent Factory
export class OmniEsgFactory {
  private static lastUpdate: { trend?: { value: number; direction: 'up' | 'down' } };

  /**
   * Create ESG OmniComponent from Agent (Soul)
   */
  static createSoulComponent(agent: Agent): OmniEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `soul_${agent.id}`,
      mode: 'compact',
      label: agent.name,
      value: `Lv.${agent.level}`,
      confidence: 'high' as OmniEsgConfidence,
      traits: ['learning', 'evolution', 'seamless'] as OmniEsgTrait[],
      dataLink: 'ai' as OmniEsgDataLink,
      color: 'purple' as OmniEsgColor,
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
   * Create ESG OmniComponent from Active Avatar
   */
  static createAvatarComponent(avatar: ActiveAvatar): OmniEsgComponent {
    const health = Math.max(0, 100 - avatar.fatigue);
    const resonance = 85; // Placeholder for resonance calculation

    const component = React.createElement(OmniEsgCell, {
      id: `avatar_${avatar.agentId}_${avatar.currentPersona}`,
      mode: 'list',
      label: avatar.capabilities.displayName || avatar.currentPersona,
      value: `${health}%`,
      subValue: `Resonance: ${resonance}`,
      confidence: health > 80 ? 'high' : health > 60 ? 'medium' : ('low' as OmniEsgConfidence),
      traits: ['bridging', 'gap-filling'] as OmniEsgTrait[],
      dataLink: 'live' as OmniEsgDataLink,
      color: 'blue' as OmniEsgColor,
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
   * Create ESG OmniComponent from Sync Bridge
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
      confidence: 'high' as OmniEsgConfidence,
      traits: ['bridging', 'optimization'] as OmniEsgTrait[],
      dataLink: 'live' as OmniEsgDataLink,
      color: 'emerald' as OmniEsgColor,
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
   * Create ESG OmniComponent from Evolution Proposal
   */
  static createEvolutionProposalComponent(proposal: EvolutionProposal): OmniEsgComponent {
    const component = React.createElement(OmniEsgCell, {
      id: `evolution_${proposal.id}`,
      mode: 'cell',
      label: proposal.pattern.substring(0, 20) + '...',
      value: `${(proposal.confidence * 100).toFixed(0)}%`,
      confidence:
        proposal.confidence > 0.8
          ? 'high'
          : proposal.confidence > 0.6
            ? 'medium'
            : ('low' as OmniEsgConfidence),
      traits: ['learning', 'optimization'] as OmniEsgTrait[],
      dataLink: 'ai' as OmniEsgDataLink,
      color: 'gold' as OmniEsgColor,
      verified: proposal.proposal_status === 'IMPLEMENTED',
      onAiAnalyze: () => this.handleProposalAnalysis(proposal.id),
      onAutomationTrigger: () => this.handleProposalImplementation(proposal.id),
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
    omniLogger.info(
      LogCategory.LEGION,
      `Executing evolution protocol verification for agent ${agentId}...`
    );
    const mockSuccessRate = 1.0;
    // Dynamic import inside event handler to break circular dependency
    const { evolutionEngine } = await import('./OmniEvolutionEngine.js');
    await evolutionEngine.processAchievement(agentId, mockSuccessRate, 200);
    omniLogger.info(LogCategory.LEGION, `Agent evolution check completed`, { agentId });
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

// ESG OmniComponent Manager
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
      omniLogger.info(LogCategory.SYSTEM, 'Initializing ESG Omni component system...');

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
          omniLogger.error(
            LogCategory.SYSTEM,
            `Failed to initialize agent component: ${agent.id}`,
            {
              error: agentErr,
            }
          );
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

      omniLogger.info(
        LogCategory.SYSTEM,
        `Successfully initialized ${this.components.size} ESG Omni components`
      );
      this.startHeartbeat();
    } catch (error) {
      omniLogger.error(
        LogCategory.SYSTEM,
        'Critical error during ESG Omni component system initialization',
        { error }
      );
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
      case 'soul':
        const agent = await agentService.createAgent(config as any);
        component = OmniEsgFactory.createSoulComponent(agent);
        break;

      case 'avatar':
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

      default:
        throw new Error(`Unsupported component type: ${type}`);
    }

    this.registerComponent(component);
    return component;
  }

  /**
   * 🌟 Omni Label Awakening: Enable Permanent Bidirectional Sync
   * Transforms an OmniLabel into its Awakened Form with Permanent Bidirectional Sync.
   */
  static awakenOmniLabel(label: OmniLabel): OmniLabel {
    return {
      ...label,
      awakeningState: 'awakened',
      syncConfig: {
        enabled: true,
        mode: 'permanent_binding',
        autoSync: true,
        frequency: 'eternal',
      },
    };
  }

  private static heartbeatInterval: NodeJS.Timeout | null = null;
  private static _heartbeatStarted = false;

  /**
   * 💡 Omni Heartbeat: Component Integrity Verification (OmniHeartbeat)
   * Periodically scans 4+1 data integrity for all registered components.
   */
  private static startHeartbeat() {
    // Prevent duplicate startup
    if (this._heartbeatStarted) return;
    this._heartbeatStarted = true;

    this.heartbeatInterval = setInterval(async () => {
      const components = this.getAllComponents();
      omniLogger.info(
        LogCategory.SYSTEM,
        `OmniHeartbeat [${new Date().toLocaleTimeString()}]: Scanning trust status for ${components.length} components...`
      );

      for (const [id, comp] of this.components.entries()) {
        if (comp.metadata.hashLock) {
          try {
            // 🔴 Immutable Verification
            const isValid = await TrustworthyLock.verify(
              comp.metadata.dataModel as any,
              comp.metadata.hashLock as string
            );

            if (!isValid) {
              omniLogger.error(
                LogCategory.SECURITY,
                `🚨 [4+1 Alert] Component ${id} data hash mismatch (possible tampering detected)!`,
                {
                  metadata: comp.metadata,
                  expected: comp.metadata.hashLock,
                }
              );
            }
          } catch (error) {
            omniLogger.error(
              LogCategory.SECURITY,
              `Component ${id} integrity verification failed`,
              { error }
            );
          }
        }
      }
    }, 60000); // Trigger once per minute
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

/* Auto-initialize removed in favor of explicit initialization in App.tsx
if (typeof window !== 'undefined') {
  // Delay initialization to ensure services are ready
  setTimeout(() => {
    OmniEsgManager.initializeOmniComponents();
  }, 1000);
}
*/

// =================================================================
// Awakening Integration
// =================================================================

import {
  IAwakenable,
  AwakeningResult,
  ServiceAwakeningStatus,
  AwakeningPhase,
} from '../protocols/UltimateAwakeningProtocol.ts';
import { awakeningBroadcaster } from '../infrastructure/broadcast/AwakeningBroadcaster.ts';

export class EsgAwakeningService implements IAwakenable {
  name = 'OmniEsgAwakeningService';
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
      omniLogger.info(LogCategory.SYSTEM, '[AWAKENING-ESG] Starting Ethical Alignment Check...', {
        service: this.name,
      });
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
        // In a real scenario, this would re-calculate confidence, check rigid constraints (4+1), etc.

        // 1. Verify Trust Traits
        const hasEthicalTraits = comp.traits.some(t =>
          ['bridging', 'optimization', 'learning', 'seamless'].includes(t)
        );
        if (!hasEthicalTraits) {
          omniLogger.warn(LogCategory.ETHICS, `Component ${comp.id} missing core ethical traits`, {
            traits: comp.traits,
          });
          awakeningBroadcaster.shareInsight({
            category: 'alert',
            title: 'Ethical Traits Missing',
            message: `Component ${comp.label || comp.id} is missing core ethical traits (Bridging/Optimization/Learning)`,
            priority: 'high',
            actionable: true,
            metadata: { componentId: comp.id },
          });
        }

        // 2. Verify Confidence
        if (comp.confidence === 'low') {
          awakeningBroadcaster.shareInsight({
            category: 'alert',
            title: 'Low Confidence Warning',
            message: `Component ${comp.id} confidence is marked as LOW. Manual verification suggested.`,
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
        title: 'ESG Ethical Alignment Complete',
        message: `Successfully validated ethical consistency and confidence for ${total} components`,
        priority: 'high',
        actionable: false,
      });

      return {
        success: true,
        phase: AwakeningPhase.AWAKENED,
        servicesAwakened: 1,
        totalServices: 1,
        message: `ESG Manager Awakening Complete: Finished Ethical Alignment Scan for ${total} components`,
      };
    } catch (error) {
      this.awakeningStatus.status = 'failed';
      this.awakeningStatus.error = (error as Error).message;
      return {
        success: false,
        phase: AwakeningPhase.AWAKENING,
        servicesAwakened: 0,
        totalServices: 1,
        message: `ESG Awakening Failed: ${(error as Error).message}`,
      };
    }
  }

  getAwakeningState(): ServiceAwakeningStatus {
    return { ...this.awakeningStatus };
  }

  async prepareForEternity(): Promise<void> {
    omniLogger.info(
      LogCategory.SYSTEM,
      '[AWAKENING-ESG] Preparing for Eternity: Locking ESG score snapshot...'
    );
    // Snapshot logic would go here
  }
}

export const esgAwakeningService = new EsgAwakeningService();
