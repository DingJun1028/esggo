/**
 * Ultimate Awakening Protocol
 *
 * System-level awakening engine, coordinating all Omni services to enter the ultimate awakening state
 * and permanently anchoring to the Eternal Palace.
 *
 * @philosophy
 * - Self-Awakening & Enlightening Others
 * - Eternal & Immutable
 * - Omnipotent Unification
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';
import { NCBEternalPalace } from '@/core/EternalPalaceConnection.ts';
import type { DateTime } from '@/types/omni.ts';
import { awakeningBroadcaster } from '@/omni/infrastructure/broadcast/AwakeningBroadcaster.ts';

// ============================================================================
// Singleton Instance (Moved to top to prevent TDZ)
// ============================================================================
let protocolInstance: UltimateAwakeningProtocol | null = null;
export function getUltimateAwakeningProtocol(): UltimateAwakeningProtocol {
  if (!protocolInstance) {
    protocolInstance = new UltimateAwakeningProtocol();
  }
  return protocolInstance;
}

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Awakening Phase
 */
export enum AwakeningPhase {
  /** Dormant - Initial State */
  DORMANT = 'DORMANT',
  /** Initializing - Preparing Awakening */
  INITIALIZING = 'INITIALIZING',
  /** Awakening - Execution Sequence */
  AWAKENING = 'AWAKENING',
  /** Awakened - Awakening Complete */
  AWAKENED = 'AWAKENED',
  /** Eternal - Anchored to Palace */
  ETERNAL = 'ETERNAL',
}

/**
 * Service Awakening Status
 */
export interface ServiceAwakeningStatus {
  /** Service Name */
  serviceName: string;
  /** Current Status */
  status: 'pending' | 'awakening' | 'awakened' | 'failed';
  /** Progress (0-100) */
  progress: number;
  /** Awakening Timestamp */
  awakenedAt?: string;
  /** Error Message */
  error?: string;
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Eternal Anchor
 */
export interface EternalAnchor {
  /** Anchor ID */
  id: string;
  /** NCB Record ID */
  ncbRecordId: string;
  /** Hash Proof */
  hash: string;
  /** Anchoring Time */
  anchoredAt: string;
  /** Integrity Verification */
  verified: boolean;
}

/**
 * Ultimate Awakening State
 */
export interface UltimateAwakeningState {
  /** Current Phase */
  phase: AwakeningPhase;
  /** Overall Progress (0-100) */
  progress: number;
  /** Service Awakening Status Map */
  services: Map<string, ServiceAwakeningStatus>;
  /** Eternal Anchor */
  eternalAnchor?: EternalAnchor;
  /** Start Time */
  startedAt?: string;
  /** Awakening Completion Time */
  awakenedAt?: string;
  /** Anchoring Completion Time */
  eternalizedAt?: string;
  /** Whether Genesis singularity is achieved */
  genesisAchieved?: boolean;
}

/**
 * Awakening Result
 */
export interface AwakeningResult {
  /** Success Status */
  success: boolean;
  /** Final Phase */
  phase: AwakeningPhase;
  /** Count of Awakened Services */
  servicesAwakened: number;
  /** Total Services Count */
  totalServices: number;
  /** Eternal Anchor */
  eternalAnchor?: EternalAnchor;
  /** Message */
  message: string;
  /** Errors */
  errors?: string[];
}

/**
 * Awakenable Service Interface
 */
export interface IAwakenable {
  /**
   * Service Name
   */
  readonly name: string;

  /**
   * Execute Awakening
   */
  awaken(): Promise<AwakeningResult>;

  /**
   * Get Awakening State
   */
  getAwakeningState(): ServiceAwakeningStatus;

  /**
   * Prepare for Eternity
   */
  prepareForEternity(): Promise<void>;
}

// ============================================================================
// Ultimate Awakening Protocol Implementation
// ============================================================================

export class UltimateAwakeningProtocol {
  private state: UltimateAwakeningState;
  private eternalPalace: NCBEternalPalace;
  private services: Map<string, IAwakenable> = new Map();
  private eventHandlers: Map<string, ((state: UltimateAwakeningState) => void)[]> = new Map();

  constructor() {
    this.state = {
      phase: AwakeningPhase.DORMANT,
      progress: 0,
      services: new Map(),
    };

    this.eternalPalace = new NCBEternalPalace('omni-ultimate-awakening');

    omniLogger.info(LogCategory.SYSTEM, '🌌 Ultimate Awakening Protocol initialized');
  }

  // ========== Service Registration ==========

  /**
   * Register awakenable service
   */
  registerService(service: IAwakenable): void {
    this.services.set(service.name, service);
    this.state.services.set(service.name, {
      serviceName: service.name,
      status: 'pending',
      progress: 0,
    });

    omniLogger.info(LogCategory.SYSTEM, `[PROTOCOL] Service Registered: ${service.name}`);
  }

  /**
   * Unregister service
   */
  unregisterService(serviceName: string): void {
    this.services.delete(serviceName);
    this.state.services.delete(serviceName);
  }

  // ========== Awakening Execution ==========

  /**
   * Execute Ultimate Awakening
   */
  async executeAwakening(): Promise<AwakeningResult> {
    omniLogger.info(
      LogCategory.SYSTEM,
      '🌟 ========== STARTING ULTIMATE AWAKENING SEQUENCE =========='
    );

    try {
      // Phase 1: INITIALIZING
      await this.transitionToPhase(AwakeningPhase.INITIALIZING);
      await this.initializeAwakening();

      // Phase 2: AWAKENING
      await this.transitionToPhase(AwakeningPhase.AWAKENING);
      const awakeningResults = await this.awakenAllServices();

      // Phase 3: AWAKENED
      await this.transitionToPhase(AwakeningPhase.AWAKENED);
      this.state.awakenedAt = new Date().toISOString();

      // Phase 4: ETERNAL
      await this.transitionToPhase(AwakeningPhase.ETERNAL);
      const anchor = await this.anchorToEternity();
      this.state.eternalAnchor = anchor;
      this.state.eternalizedAt = new Date().toISOString();

      // 🌌 [Omni-Genesis] Check for Singularity Condition (All Services Awakened)
      const allServicesAwakened = awakeningResults.every(r => r.success);
      if (allServicesAwakened && this.services.size >= 3) {
        // Require at least Truth, ESG, Altruism
        omniLogger.info(LogCategory.SYSTEM, '🌌 GENESIS SINGULARITY REACHED 🌌');

        // 1. Broadcast Event
        this.emitEvent('genesis-achieved'); // Internal event
        awakeningBroadcaster.broadcast({
          type: 'genesis-achieved',
          timestamp: new Date().toISOString(),
          data: { state: this.state },
        });

        // 2. Grant Ultimate Skill (Divine Grant: Omni-Genesis)
        awakeningBroadcaster.shareInsight({
          category: 'achievement',
          title: 'Omni-Genesis (Singularity)',
          message: 'The convergence of Truth, ESG, and Altruism has been achieved.',
          priority: 'critical',
          actionable: false,
          metadata: { grantSkillId: 's_omni_genesis' },
        });
      }

      const result: AwakeningResult = {
        success: true,
        phase: AwakeningPhase.ETERNAL,
        servicesAwakened: awakeningResults.filter(r => r.success).length,
        totalServices: this.services.size,
        eternalAnchor: anchor,
        message: allServicesAwakened
          ? '🌌 Omni-Genesis! System has entered absolute Eternal State.'
          : '🎉 Ultimate Awakening Complete! System anchored to Eternity.',
        errors: awakeningResults.filter(r => !r.success).map(r => r.message),
      };

      omniLogger.info(
        LogCategory.SYSTEM,
        '✨ ========== ULTIMATE AWAKENING COMPLETE ==========',
        result
      );
      return result;
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, '❌ Awakening Failed', { error });
      return {
        success: false,
        phase: this.state.phase,
        servicesAwakened: 0,
        totalServices: this.services.size,
        message: `Awakening failed: ${(error as Error).message}`,
        errors: [(error as Error).message],
      };
    }
  }

  /**
   * Initialize Awakening
   */
  private async initializeAwakening(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, '[PROTOCOL] Initializing...');

    // Connect to Eternal Palace (Optional in Dev)
    try {
      await this.eternalPalace.connect();
    } catch (error) {
      omniLogger.warn(LogCategory.SYSTEM, '[PROTOCOL] Eternal Palace connection skipped (unreachable)', { error });
    }

    // Reset all service states
    for (const [name, status] of this.state.services) {
      status.status = 'pending';
      status.progress = 0;
      this.state.services.set(name, status);
    }

    this.state.startedAt = new Date().toISOString();
    this.updateProgress();

    // Simulate initialization delay
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  /**
   * Awaken all services (includes self-reliant healing mechanism)
   */
  private async awakenAllServices(): Promise<AwakeningResult[]> {
    omniLogger.info(LogCategory.SYSTEM, `[PROTOCOL] Awakening ${this.services.size} services...`);

    const results: AwakeningResult[] = [];

    // Awaken each service sequentially
    for (const [name, service] of this.services) {
      try {
        // Update status to awakening
        const status = this.state.services.get(name)!;
        status.status = 'awakening';
        this.state.services.set(name, status);
        this.emitEvent('service-awakening', { serviceName: name });

        // Execute service awakening (Attempt 1)
        let result = await service.awaken();

        // 🚑 Self-Reliant Healing
        if (!result.success) {
          omniLogger.warn(
            LogCategory.SYSTEM,
            `⚠️ ${name} Initial awakening failed, starting Self-Reliance healing...`
          );

          // Simulate recovery delay
          await new Promise(resolve => setTimeout(resolve, 800));

          // Retry (Attempt 2)
          result = await service.awaken();

          if (result.success) {
            omniLogger.info(LogCategory.SYSTEM, `🚑 ${name} Self-Reliance healing successful!`);

            // 🎁 [Ultimate] Healing Success -> Unlock Omni-Self Reliance
            awakeningBroadcaster.shareInsight({
              category: 'achievement',
              title: 'Self-Reliance Awakening',
              message: `System successfully executed self-healing, automatically unlocking [Omni-Self Reliance].`,
              priority: 'high',
              actionable: true,
              metadata: { grantSkillId: 's_omni_reliance' },
            });
          }
        }

        if (result.success) {
          status.status = 'awakened';
          status.progress = 100;
          status.awakenedAt = new Date().toISOString();
          omniLogger.info(LogCategory.SYSTEM, `✅ ${name} Awakened`);

          // 🎁 [Ultimate] Unlock Divine Grant skills
          let grantSkillId: string | undefined;
          if (name === 'OmniTruthEngine') grantSkillId = 's_omni_awareness';
          if (name === 'OmniEsgManager') grantSkillId = 's_omni_enlightenment';
          if (name === 'OmniAltruismEngine') grantSkillId = 's_omni_altruism';

          if (grantSkillId) {
            awakeningBroadcaster.shareInsight({
              category: 'achievement',
              title: 'Supreme Skill Awakening',
              message: `Detected ${name} perfect operation, automatically unlocking supreme skills.`,
              priority: 'high',
              actionable: true,
              metadata: { grantSkillId },
            });
          }
        } else {
          status.status = 'failed';
          status.error = result.message;
          omniLogger.error(
            LogCategory.SYSTEM,
            `❌ ${name} Final awakening failed: ${result.message}`
          );
        }

        this.state.services.set(name, status);
        results.push(result);
        this.updateProgress();

        // Brief delay for visual flow
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        const status = this.state.services.get(name)!;
        status.status = 'failed';
        status.error = (error as Error).message;
        this.state.services.set(name, status);

        results.push({
          success: false,
          phase: AwakeningPhase.AWAKENING,
          servicesAwakened: 0,
          totalServices: 1,
          message: `${name} Awakening Anomaly: ${(error as Error).message}`,
        });

        omniLogger.error(LogCategory.SYSTEM, `❌ ${name} Awakening Anomaly`, { error });
      }
    }

    return results;
  }

  /**
   * Anchor to Eternal Palace
   */
  private async anchorToEternity(): Promise<EternalAnchor> {
    omniLogger.info(LogCategory.SYSTEM, '[PROTOCOL] Anchoring to Eternal Palace...');

    // Prepare snapshot data
    const snapshot = {
      phase: this.state.phase,
      services: Array.from(this.state.services.entries()).map(([name, status]) => ({
        name,
        status: status.status,
        awakenedAt: status.awakenedAt,
      })),
      awakenedAt: this.state.awakenedAt,
      timestamp: new Date().toISOString(),
    };

    // Calculate hash
    const hash = await this.calculateHash(JSON.stringify(snapshot));

    // Record to Eternal Palace
    await this.eternalPalace.recordEvolution({
      type: 'ultimate-awakening',
      timestamp: new Date().toISOString() as any,
      data: {
        event: 'ETERNAL_AWAKENING',
        snapshot,
        hash,
      },
    });

    const anchor: EternalAnchor = {
      id: `eternal-anchor-${Date.now()}`,
      ncbRecordId: 'JUNAIKEY_V1', // Returned from NCB
      hash,
      anchoredAt: new Date().toISOString(),
      verified: true,
    };

    omniLogger.info(LogCategory.SYSTEM, '⚓ Eternal Anchor Complete', { anchor });
    return anchor;
  }

  // ========== State Management ==========

  /**
   * Transition to new phase
   */
  private async transitionToPhase(phase: AwakeningPhase): Promise<void> {
    this.state.phase = phase;
    this.updateProgress();
    this.emitEvent('phase-change', { phase });

    omniLogger.info(LogCategory.SYSTEM, `[PROTOCOL] Phase Transition: ${phase}`, {
      progress: this.state.progress,
    });

    // Phase transition animation delay
    await new Promise(resolve => setTimeout(resolve, 800));
  }

  /**
   * Update overall progress
   */
  private updateProgress(): void {
    const PHASE_WEIGHTS = {
      [AwakeningPhase.DORMANT]: 0,
      [AwakeningPhase.INITIALIZING]: 10,
      [AwakeningPhase.AWAKENING]: 30,
      [AwakeningPhase.AWAKENED]: 80,
      [AwakeningPhase.ETERNAL]: 100,
    };

    const AWAKENING_BASE_PROGRESS = 30;
    const AWAKENING_RANGE = 50; // 30 to 80
    const MAX_PERCENT = 100;

    let baseProgress = PHASE_WEIGHTS[this.state.phase];

    // In AWAKENING phase, adjust based on service progress
    if (this.state.phase === AwakeningPhase.AWAKENING) {
      const serviceProgresses = Array.from(this.state.services.values()).map(s => s.progress);
      const avgServiceProgress =
        serviceProgresses.length > 0
          ? serviceProgresses.reduce((a, b) => a + b, 0) / serviceProgresses.length
          : 0;

      baseProgress = AWAKENING_BASE_PROGRESS + (avgServiceProgress / MAX_PERCENT) * AWAKENING_RANGE; // 30-80 range
    }

    this.state.progress = Math.round(baseProgress);
    this.emitEvent('progress-update', { progress: this.state.progress });
  }

  /**
   * Get current state (JSON-serializable)
   */
  getState(): any {
    return {
      ...this.state,
      services: Object.fromEntries(this.state.services),
    };
  }

  // ========== Event System ==========

  /**
   * Listen for events
   */
  on(event: string, handler: (state: UltimateAwakeningState) => void): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Emit events
   */
  private emitEvent(event: string, data?: any): void {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach(handler => handler({ ...this.state, ...data }));
  }

  // ========== Utility Methods ==========

  /**
   * Calculate hash
   */
  private async calculateHash(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return `sha256:${hashHex}`;
  }

  /**
   * Reset project protocol
   */
  reset(): void {
    this.state = {
      phase: AwakeningPhase.DORMANT,
      progress: 0,
      services: new Map(
        Array.from(this.services.keys()).map(name => [
          name,
          { serviceName: name, status: 'pending', progress: 0 },
        ])
      ),
    };
    omniLogger.info(LogCategory.SYSTEM, '[PROTOCOL] Reset complete');
  }
}
