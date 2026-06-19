import keccak256 from 'keccak256';
import { v4 as uuidv4 } from 'uuid';
import { LogCategory, omniLogger } from '@/utils/OmniLogger.js';
import { sovereignVaultService } from './SovereignVaultService.js';
import { omniOrchestrator, type ResonanceSignal } from '../1-service/OmniOrchestrator.js';

export interface ResonanceMetaspace {
  nodeId: string;
  resonanceLevel: number;
  lastPulse: string;
  signature: string;
}

/**
 * Omni Swarm Interface
 * Orchestrates cross-node resonance and decentralized audit trails.
 * Enhanced with Wu-Tong Zi-Tong resonance signal protocol.
 */
export class OmniSwarmInterface {
  private static instance: OmniSwarmInterface;
  private knownNodes: Map<string, ResonanceMetaspace> = new Map();

  private constructor() {
    this.initializeSimulatedNetwork();
  }

  public static getInstance(): OmniSwarmInterface {
    if (!OmniSwarmInterface.instance) {
      OmniSwarmInterface.instance = new OmniSwarmInterface();
    }
    return OmniSwarmInterface.instance;
  }

  private initializeSimulatedNetwork() {
    const nodes = [
      { id: 'Apple-Cupertino-Sovereign', resonance: 0.98 },
      { id: 'TSMC-Hsinchu-Sovereign', resonance: 0.99 },
      { id: 'Google-MountainView-Sovereign', resonance: 0.97 },
      { id: 'NVIDIA-SantaClara-Sovereign', resonance: 0.992 },
    ];

    nodes.forEach(n => {
      this.knownNodes.set(n.id, {
        nodeId: n.id,
        resonanceLevel: n.resonance,
        lastPulse: new Date().toISOString(),
        signature: `swarm-sig-${uuidv4().substring(0, 8)}`,
      });
    });
  }

  /**
   * 比較本地主權與全域基準
   */
  public async computeResonanceParity(): Promise<number> {
    omniLogger.info(LogCategory.AI, 'Computing Global Resonance Parity...');

    const localMetrics = sovereignVaultService.getLedgerStatus();
    // 假設本地共鳴由 ledger 狀態決定 (實驗性)
    const localResonance = Math.min(1.0, 0.9 + localMetrics.total_packets * 0.01);

    const globalTotal = Array.from(this.knownNodes.values()).reduce(
      (acc, n) => acc + n.resonanceLevel,
      0
    );
    const globalAvg = globalTotal / this.knownNodes.size;

    const parity = localResonance / globalAvg;
    omniLogger.info(LogCategory.AI, 'Resonance Parity computed', {
      parity,
      localResonance,
      globalAvg,
    });

    return parity;
  }

  public getKnownNodes(): ResonanceMetaspace[] {
    return Array.from(this.knownNodes.values());
  }

  /**
   * 發送共鳴信號到群體網路 (Send Resonance Signal to Swarm)
   * Implements Wu-Tong communication protocol
   */
  public sendResonanceSignal(
    payload: unknown,
    frequency: number = 0.5,
    propagationMode: 'broadcast' | 'targeted' | 'emergent' = 'broadcast',
    targetNode?: string
  ): string {
    const signal: Omit<ResonanceSignal, 'id' | 'timestamp'> = {
      sourceService: 'OmniSwarmInterface',
      targetService: targetNode,
      frequency,
      payload,
      propagationMode,
      resonancePattern: this.generateResonancePattern(payload),
    };

    const signalId = omniOrchestrator.sendResonanceSignal(signal);

    omniLogger.info(LogCategory.SYSTEM, 'Resonance signal sent to swarm', {
      signalId,
      mode: propagationMode,
      frequency,
      targetNode,
    });

    return signalId;
  }

  /**
   * 生成共鳴模式 (Generate Resonance Pattern)
   * Creates a unique pattern identifier for signal matching
   */
  private generateResonancePattern(payload: unknown): string {
    const payloadStr = JSON.stringify(payload);
    const hash = keccak256(payloadStr).toString('hex');
    return `resonance-${hash.substring(0, 16)}`;
  }

  /**
   * 廣播系統事件 (Broadcast System Event)
   * High-frequency broadcast for critical system events
   */
  public broadcastSystemEvent(event: {
    type: string;
    data: unknown;
    priority: 'low' | 'medium' | 'high' | 'critical';
  }): string {
    const frequencyMap = {
      low: 0.25,
      medium: 0.5,
      high: 0.75,
      critical: 1.0,
    };

    return this.sendResonanceSignal(event, frequencyMap[event.priority], 'broadcast');
  }

  /**
   * 定向通信 (Targeted Communication)
   * Send signal to specific node with natural response option
   */
  public sendToNode(nodeId: string, message: unknown, urgent: boolean = false): string {
    return this.sendResonanceSignal(message, urgent ? 0.9 : 0.5, 'targeted', nodeId);
  }

  /**
   * 湧現式路由 (Emergent Routing)
   * Let the signal find its own path based on resonance
   */
  public emergentBroadcast(insight: unknown): string {
    return this.sendResonanceSignal(insight, 0.6, 'emergent');
  }
}

export const omniSwarmInterface = OmniSwarmInterface.getInstance();
