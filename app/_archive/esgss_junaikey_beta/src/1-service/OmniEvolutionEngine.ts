// src/omni/services/OmniEvolutionEngine.ts

/**
 * @file OmniEvolutionEngine.ts
 * @description Implements the OmniEvolutionEngine, responsible for Dimension 2 (Benevolence)
 * and Dimension 7 (Growth). This service guides the system's development towards sustainable,
 * ethical outcomes, and fosters non-extractive growth and self-improvement.
 */

import { omniLogger, LogCategory } from '@infra/logging/OmniLogger';
import { OmniEsgManager } from './OmniEsgManager';
import { agentService } from './agentService';
import { awakeningBroadcaster } from '@infra/broadcast/AwakeningBroadcaster';

import { IStakeholder, OmniValueDistribution } from './OmniValueDistribution';
import { IClaim, truthEngine } from './OmniTruthEngine';
import { ecosystemPulseService } from '../services/EcosystemPulseService';
import { sentientNebulaService } from '../services/SentientNebulaService';

/**
 * Represents an ethical guideline or principle the system adheres to.
 */
export interface IEthicalGuideline {
  id: string;
  description: string;
  priority: number; // Higher number means higher priority.
  // A mechanism to measure adherence, e.g., a reference to a validation function or metric.
  adherenceMetricId?: string;
  /**
   * Function to generate a claim for validation by the OmniTruthEngine.
   * @param context - Optional context for generating the claim (e.g., current system state, action details).
   * @returns A partial IClaim object that the OmniTruthEngine can process.
   */
  validationClaimGenerator?: (
    context?: any
  ) => Omit<IClaim, 'id' | 'validationStatus' | 'confidenceScore'>;
}

/**
 * Represents a growth metric the system tracks.
 */
export interface IGrowthMetric {
  id: string;
  name: string;
  description: string;
  targetValue?: number;
  currentValue: number;
  // Indicates if the metric is related to benevolent growth (e.g., community impact).
  isBenevolent: boolean;
}

/**
 * Omni-Evolution Daemon Status
 */
export interface EvolutionDaemonStatus {
  isRunning: boolean;
  cycleCount: number;
  agentsEvolved: number;
  lastRun: string | null;
}

/**
 * Manages the ethical evolution and sustainable growth of the Omni system.
 */
export class OmniEvolutionEngine {
  private static instance: OmniEvolutionEngine;
  private ethicalGuidelines: Map<string, IEthicalGuideline>;
  private growthMetrics: Map<string, IGrowthMetric>;

  // Daemon State
  private isDaemonRunning: boolean = false;
  private daemonInterval: NodeJS.Timeout | null = null;
  private daemonStats = {
    cycleCount: 0,
    agentsEvolved: 0,
    lastRun: null as string | null,
  };

  private constructor() {
    this.ethicalGuidelines = new Map();
    this.growthMetrics = new Map();
    this.initializeEthicalGuidelines();
    this.initializeGrowthMetrics();
    omniLogger.info(LogCategory.SYSTEM, 'OmniEvolutionEngine initialized.', {
      service: 'OmniEvolutionEngine',
    });
  }

  /**
   * Retrieves the singleton instance of the OmniEvolutionEngine.
   * @returns The OmniEvolutionEngine instance.
   */
  public static getInstance(): OmniEvolutionEngine {
    if (!OmniEvolutionEngine.instance) {
      OmniEvolutionEngine.instance = new OmniEvolutionEngine();
    }
    return OmniEvolutionEngine.instance;
  }

  // ... (Existing methods: initializeEthicalGuidelines, initializeGrowthMetrics, register methods) ...

  // =================================================================
  // Omni-Evolution Daemon (Auto-Pilot)
  // =================================================================

  /**
   * Start the Auto-Evolution Daemon
   */
  public startAutoEvolutionDaemon(intervalMs: number = 30000) {
    if (this.isDaemonRunning) return;
    this.isDaemonRunning = true;

    omniLogger.info(LogCategory.SYSTEM, '🚀 Starting Omni-Evolution Daemon...');
    awakeningBroadcaster.shareInsight({
      category: 'optimization', // Changed from awakening
      title: 'Evolution Daemon Activated',
      message: 'System is now auto-evolving agents based on ESG confidence metrics.',
      priority: 'medium',
      actionable: false,
    });

    this.daemonInterval = setInterval(() => this.processAutoEvolution(), intervalMs);
    this.processAutoEvolution(); // Run immediately
  }

  /**
   * Stop the Auto-Evolution Daemon
   */
  public stopAutoEvolutionDaemon() {
    if (!this.isDaemonRunning) return;
    this.isDaemonRunning = false;
    if (this.daemonInterval) {
      clearInterval(this.daemonInterval);
      this.daemonInterval = null;
    }
    omniLogger.info(LogCategory.SYSTEM, '🛑 Omni-Evolution Daemon Stopped');
  }

  /**
   * Get Daemon Status
   */
  public getDaemonStatus(): EvolutionDaemonStatus {
    return {
      isRunning: this.isDaemonRunning,
      ...this.daemonStats,
    };
  }

  /**
   * Core Evolution Logic
   * Scan ESG components -> Grant XP to High Confidence Souls
   * [v8.2.5] Integrated with Ecosystem Pulse for Sentient Alignment.
   */
  private async processAutoEvolution() {
    this.daemonStats.cycleCount++;
    this.daemonStats.lastRun = new Date().toISOString();

    try {
      // Fetch latest ecosystem pulse
      const pulses = ecosystemPulseService.getCurrentPulse();
      const latestPulse = pulses.length > 0 ? pulses[0] : null;
      const gravityBonus = latestPulse ? latestPulse.gravityScore * 0.5 : 0;

      const components = OmniEsgManager.getAllComponents();
      const soulComponents = components.filter(c => c.type === 'soul');

      for (const soul of soulComponents) {
        const agentId = soul.metadata.agentId as string;

        // Only evolve if confidence is HIGH and system is verified
        if (soul.confidence === 'high' && soul.metadata.verified) {
          // Evaluate ethical adherence for the agent
          const ethicalAdherenceScore = await this.evaluateEthicalAdherence(agentId);

          // [v8.2.5] Sentient Feedback Loop: Integrate environmental entropy and resonance
          const entropy = sentientNebulaService.getNebulaEntropy();
          const pulseRelevance = latestPulse?.type === 'INNOVATION' ? 1.5 : 1.0;

          // XP Multiplier now factors in entropy as a resistance factor
          const xpMultiplier = (ethicalAdherenceScore > 0.5 ? ethicalAdherenceScore : 0.5) *
            (1 + gravityBonus) *
            pulseRelevance *
            (1.1 - entropy); // Entropy resistance

          // Grant XP (Evolution) - dynamically adjusted by ethical adherence, planetary pulse, and entropy
          const baseXP = 50;
          const finalXP = Math.max(5, Math.floor(baseXP * xpMultiplier));

          omniLogger.info(LogCategory.GROWTH, `[Evolution Daemon] Processing ${soul.label}`, {
            pulse: latestPulse?.description,
            multiplier: xpMultiplier.toFixed(2),
            finalXP
          });

          const result = await agentService.grantExperience(agentId, finalXP);

          if (result.leveledUp) {
            this.daemonStats.agentsEvolved++;
            awakeningBroadcaster.shareInsight({
              category: 'achievement',
              title: 'Digital Soul Evolved',
              message: `Agent ${soul.label} has evolved to Level ${result.newLevel} through high ESG confidence and ${latestPulse?.description || 'Ecosystem Harmony'}.`,
              priority: 'high',
              actionable: false,
              metadata: { agentId, level: result.newLevel, event: latestPulse?.id },
            });
          }
        }
      }
    } catch (error) {
      omniLogger.error(LogCategory.SYSTEM, 'Evolution Daemon Error', { error });
    }
  }

  /**
   * Initializes a set of core ethical guidelines for the system.
   */
  private initializeEthicalGuidelines(): void {
    this.registerEthicalGuideline({
      id: 'privacy-first',
      description: 'Prioritize user privacy and data minimization.',
      priority: 10,
    });
    this.registerEthicalGuideline({
      id: 'data-privacy-security',
      description: 'Ensure robust data privacy and security measures are in place.',
      priority: 11, // Higher priority to reflect importance
    });
    this.registerEthicalGuideline({
      id: 'fairness-in-ai',
      description: 'Ensure AI algorithms are fair and unbiased.',
      priority: 9,
    });
    this.registerEthicalGuideline({
      id: 'environmental-stewardship',
      description: 'Minimize environmental impact of operations.',
      priority: 8,
    });
  }

  /**
   * Initializes core growth metrics.
   */
  private initializeGrowthMetrics(): void {
    this.registerGrowthMetric({
      id: 'community-engagement',
      name: 'Community Engagement Score',
      description: 'Measures user interaction and contribution.',
      currentValue: 0,
      targetValue: 1000,
      isBenevolent: true,
    });
    this.registerGrowthMetric({
      id: 'feature-adoption',
      name: 'New Feature Adoption Rate',
      description: 'Tracks the rate at which users adopt new features.',
      currentValue: 0,
      targetValue: 0.75, // 75% adoption
      isBenevolent: false, // Not inherently benevolent, depends on the feature
    });
  }

  /**
   * Registers a new ethical guideline.
   * @param guideline - The guideline to register.
   */
  public registerEthicalGuideline(guideline: IEthicalGuideline): void {
    if (this.ethicalGuidelines.has(guideline.id)) {
      omniLogger.warn(
        LogCategory.GOVERNANCE,
        `Ethical guideline '${guideline.id}' is already registered.`,
        { service: 'OmniEvolutionEngine' }
      );
      return;
    }
    this.ethicalGuidelines.set(guideline.id, guideline);
    omniLogger.info(LogCategory.GOVERNANCE, `Ethical guideline '${guideline.id}' registered.`, {
      service: 'OmniEvolutionEngine',
    });
  }

  /**
   * Registers a new growth metric.
   * @param metric - The metric to register.
   */
  public registerGrowthMetric(metric: IGrowthMetric): void {
    if (this.growthMetrics.has(metric.id)) {
      omniLogger.warn(LogCategory.GROWTH, `Growth metric '${metric.id}' is already registered.`, {
        service: 'OmniEvolutionEngine',
      });
      return;
    }
    this.growthMetrics.set(metric.id, metric);
    omniLogger.info(LogCategory.GROWTH, `Growth metric '${metric.id}' registered.`, {
      service: 'OmniEvolutionEngine',
    });
  }

  /**
   * Evaluates the system's adherence to a specific ethical guideline.
   * This is a placeholder and would involve calling external validation services or data.
   * @param guidelineId - The ID of the guideline to evaluate.
   * @returns A promise resolving to an adherence score (0.0 to 1.0).
   */
  public async evaluateEthicalAdherence(guidelineId: string): Promise<number> {
    const guideline = this.ethicalGuidelines.get(guidelineId);
    if (!guideline) {
      omniLogger.error(
        LogCategory.GOVERNANCE,
        `Ethical guideline '${guidelineId}' not found for evaluation.`,
        { service: 'OmniEvolutionEngine', error: new Error('Invalid guideline ID') }
      );
      return 0;
    }

    omniLogger.debug(
      LogCategory.GOVERNANCE,
      `Evaluating adherence for guideline '${guideline.description}'.`,
      { service: 'OmniEvolutionEngine' }
    );

    // Placeholder for actual evaluation logic.
    // This could involve audit logs, AI model fairness checks, data privacy audits, etc.
    const adherenceScore = Math.random(); // Simulate a score for now.

    omniLogger.info(
      LogCategory.GOVERNANCE,
      `Adherence for '${guidelineId}' evaluated: ${adherenceScore.toFixed(2)}.`,
      { service: 'OmniEvolutionEngine', adherenceScore }
    );
    return adherenceScore;
  }

  /**
   * Updates a growth metric's current value.
   * @param metricId - The ID of the metric to update.
   * @param newValue - The new current value of the metric.
   */
  public updateGrowthMetric(metricId: string, newValue: number): void {
    const metric = this.growthMetrics.get(metricId);
    if (metric) {
      metric.currentValue = newValue;
      this.growthMetrics.set(metricId, metric);
      omniLogger.info(
        LogCategory.GROWTH,
        `Growth metric '${metric.name}' updated to ${newValue}.`,
        { service: 'OmniEvolutionEngine' }
      );

      // Example of linking growth to benevolence/sharing
      if (metric.isBenevolent && metric.targetValue && newValue >= metric.targetValue) {
        omniLogger.info(
          LogCategory.GROWTH,
          `Benevolent growth metric '${metric.name}' reached target! Triggering value distribution.`,
          { service: 'OmniEvolutionEngine' }
        );
        // Example: distribute value to community stakeholders if a benevolent growth target is met
        OmniValueDistribution.getInstance().distributeValue({
          id: `reward-${metricId}-${Date.now()}`,
          description: `Reward for ${metric.name} target achievement.`,
          amount: 100, // Example amount
          unit: 'credits',
          source: 'OmniEvolutionEngine',
        });
      }
    } else {
      omniLogger.warn(LogCategory.GROWTH, `Growth metric '${metricId}' not found.`, {
        service: 'OmniEvolutionEngine',
      });
    }
  }

  /**
   * Processes an agent's achievement and grants appropriate rewards/evolution.
   * @param agentId - The ID of the agent achieving the milestone.
   * @param successRate - The success rate of the achievement (0.0 to 1.0).
   * @param baseXP - Base experience to grant.
   */
  public async processAchievement(
    agentId: string,
    successRate: number,
    baseXP: number = 100
  ): Promise<void> {
    omniLogger.info(
      LogCategory.GROWTH,
      `Processing achievement for agent ${agentId} with success rate ${successRate.toFixed(2)}`
    );

    const finalXP = Math.floor(baseXP * successRate);
    const result = await agentService.grantExperience(agentId, finalXP);

    if (result.leveledUp) {
      awakeningBroadcaster.shareInsight({
        category: 'achievement',
        title: 'Milestone Reached',
        message: `Agent ${agentId} has reached Level ${result.newLevel} following a successful evolution cycle.`,
        priority: 'high',
        actionable: false,
        metadata: { agentId, level: result.newLevel },
      });
    }
  }

  /**
   * Retrieves all registered ethical guidelines.
   * @returns An array of ethical guidelines.
   */
  public getEthicalGuidelines(): IEthicalGuideline[] {
    return Array.from(this.ethicalGuidelines.values());
  }

  /**
   * Retrieves all registered growth metrics.
   * @returns An array of growth metrics.
   */
  public getGrowthMetrics(): IGrowthMetric[] {
    return Array.from(this.growthMetrics.values());
  }
}

// Export a singleton instance
export const evolutionEngine = OmniEvolutionEngine.getInstance();
