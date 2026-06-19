import {
  omniLogger,
  LogCategory,
} from '../../server/services/omni/infrastructure/logging/OmniLogger.js';

export interface ModelUpdate {
  nodeId: string;
  roundId: number;
  weights: number[]; // Simplified model weights
  sampleSize: number;
}

export interface GlobalModel {
  version: string;
  weights: number[];
  roundId: number;
}

export class FederatedLearningBridge {
  private static instance: FederatedLearningBridge;
  private currentRound: number = 1;
  private updatesBuffer: ModelUpdate[] = [];
  private globalModel: GlobalModel = {
    version: 'v1.0.0',
    weights: [0.1, 0.1, 0.1, 0.1, 0.1], // Mock initial weights
    roundId: 1,
  };

  // Threshold for aggregation (e.g., need 3 updates to trigger aggregation)
  private readonly AGGREGATION_THRESHOLD = 3;

  private constructor() {
    omniLogger.info(LogCategory.SYSTEM, '🌐 [FederatedBridge] Learning Bridge Initialized.');
  }

  public static getInstance(): FederatedLearningBridge {
    if (!this.instance) {
      this.instance = new FederatedLearningBridge();
    }
    return this.instance;
  }

  /**
   * Submit a local model update from a node/agent.
   */
  public submitUpdate(update: ModelUpdate): void {
    if (update.roundId !== this.currentRound) {
      omniLogger.warn(
        LogCategory.SYSTEM,
        `[FederatedBridge] Rejected update from Node ${update.nodeId}: Stale round ${update.roundId} (Current: ${this.currentRound})`
      );
      return;
    }

    this.updatesBuffer.push(update);
    omniLogger.info(
      LogCategory.SYSTEM,
      `[FederatedBridge] Received update from ${update.nodeId}. Buffer: ${this.updatesBuffer.length}/${this.AGGREGATION_THRESHOLD}`
    );

    if (this.updatesBuffer.length >= this.AGGREGATION_THRESHOLD) {
      this.aggregateGlobalModel();
    }
  }

  /**
   * Federated Averaging (FedAvg) logic.
   */
  private aggregateGlobalModel(): void {
    omniLogger.info(
      LogCategory.SYSTEM,
      `🌐 [FederatedBridge] Aggregating Global Model for Round ${this.currentRound}...`
    );

    const totalSamples = this.updatesBuffer.reduce((sum, u) => sum + u.sampleSize, 0);
    const newWeights = this.globalModel.weights.map(() => 0);

    // Weighted Average
    this.updatesBuffer.forEach(update => {
      update.weights.forEach((w, i) => {
        newWeights[i] = (newWeights[i] || 0) + w * (update.sampleSize / totalSamples);
      });
    });

    // Update Global Model
    this.currentRound++;
    this.globalModel = {
      version: `v1.${this.currentRound}.0`,
      weights: newWeights,
      roundId: this.currentRound,
    };

    // Clear Buffer
    this.updatesBuffer = [];

    omniLogger.info(
      LogCategory.SYSTEM,
      `✅ [FederatedBridge] Round ${this.currentRound - 1} Complete. New Global Model Version: ${this.globalModel.version}`
    );
    omniLogger.debug(LogCategory.SYSTEM, `New Weights: ${JSON.stringify(newWeights)}`);
  }

  public getGlobalModel(): GlobalModel {
    return this.globalModel;
  }
}

export const federatedLearningBridge = FederatedLearningBridge.getInstance();
