/**
 * Awakening Service Adapters
 *
 * Adapts existing Omni services into awakenable services.
 */

import type {
  IAwakenable,
  ServiceAwakeningStatus,
  AwakeningResult,
} from '../protocols/UltimateAwakeningProtocol.ts';
import { AwakeningPhase } from '../protocols/UltimateAwakeningProtocol.ts';
import { omniLogger, LogCategory } from '../infrastructure/logging/OmniLogger.ts';

/**
 * Base Awakening Adapter
 * Provides a default implementation for services that do not support the awakening interface.
 */
export class BaseAwakeningAdapter implements IAwakenable {
  protected status: ServiceAwakeningStatus;

  constructor(
    public readonly name: string,
    private awakeningLogic?: () => Promise<void>
  ) {
    this.status = {
      serviceName: name,
      status: 'pending',
      progress: 0,
    };
  }

  async awaken(): Promise<AwakeningResult> {
    try {
      omniLogger.info(
        LogCategory.SYSTEM,
        `[AWAKENING] ${this.name} starting awakening sequence...`
      );

      this.status.status = 'awakening';
      this.status.progress = 30;

      // Execute custom awakening logic
      if (this.awakeningLogic) {
        await this.awakeningLogic();
      } else {
        // Default awakening logic
        await this.defaultAwakeningSequence();
      }

      this.status.status = 'awakened';
      this.status.progress = 100;
      this.status.awakenedAt = new Date().toISOString();

      omniLogger.info(LogCategory.SYSTEM, `[AWAKENING] ✅ ${this.name} Awakening Complete`);

      return {
        success: true,
        phase: AwakeningPhase.AWAKENED,
        servicesAwakened: 1,
        totalServices: 1,
        message: `${this.name} successfully awakened`,
      };
    } catch (error) {
      this.status.status = 'failed';
      this.status.error = (error as Error).message;

      omniLogger.error(LogCategory.SYSTEM, `[AWAKENING] ❌ ${this.name} Awakening Failed`, {
        error,
      });

      return {
        success: false,
        phase: AwakeningPhase.AWAKENING,
        servicesAwakened: 0,
        totalServices: 1,
        message: `${this.name} Awakening Failed: ${(error as Error).message}`,
      };
    }
  }

  getAwakeningState(): ServiceAwakeningStatus {
    return { ...this.status };
  }

  async prepareForEternity(): Promise<void> {
    omniLogger.info(LogCategory.SYSTEM, `[AWAKENING] ${this.name} preparing for Eternal State...`);
    // Default implementation: no special preparation
  }

  /**
   * Default Awakening Sequence
   */
  protected async defaultAwakeningSequence(): Promise<void> {
    // Simulate awakening progress
    for (let i = 30; i <= 90; i += 20) {
      this.status.progress = i;
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }
}
