// src/omni/services/OmniValueDistribution.ts

/**
 * @file OmniValueDistribution.ts
 * @description Implements the OmniValueDistribution service, responsible for Dimension 5 (Sharing).
 * This service models and facilitates the equitable distribution of value, insight, and data
 * among stakeholders in the system's ecosystem.
 */

import { omniLogger, LogCategory } from '@/omni/infrastructure/logging/OmniLogger.ts';

/**
 * Represents a stakeholder in the ecosystem.
 */
export interface IStakeholder {
  id: string;
  name: string;
  type: 'user' | 'developer' | 'investor' | 'community';
  // A measure of the stakeholder's contribution or stake.
  contributionScore: number;
}

/**
 * Represents a unit of value to be distributed.
 */
export interface IValueUnit {
  id: string;
  description: string;
  // The total amount of value to be distributed.
  amount: number;
  unit: 'points' | 'credits' | 'tokens';
  source: string; // e.g., 'revenue_share', 'data_contribution_reward'
}

/**
 * Manages the equitable distribution of value to stakeholders.
 */
export class OmniValueDistribution {
  private static instance: OmniValueDistribution;
  private stakeholders: Map<string, IStakeholder>;

  private constructor() {
    this.stakeholders = new Map();
    this.initializeStakeholders();
    omniLogger.info(LogCategory.SYSTEM, 'OmniValueDistribution initialized.', {
      service: 'OmniValueDistribution',
    });
  }

  /**
   * Retrieves the singleton instance of the OmniValueDistribution service.
   * @returns The OmniValueDistribution instance.
   */
  public static getInstance(): OmniValueDistribution {
    if (!OmniValueDistribution.instance) {
      OmniValueDistribution.instance = new OmniValueDistribution();
    }
    return OmniValueDistribution.instance;
  }

  /**
   * Initializes a set of default stakeholders.
   * In a real system, this would be managed via a user/entity management service.
   */
  private initializeStakeholders(): void {
    this.registerStakeholder('user-001', 'Alice', 'user', 100);
    this.registerStakeholder('dev-001', 'Bob', 'developer', 500);
    this.registerStakeholder('community-fund', 'Community Fund', 'community', 1000);
  }

  /**
   * Registers a new stakeholder or updates an existing one.
   * @param id - Unique ID for the stakeholder.
   * @param name - Name of the stakeholder.
   * @param type - Type of stakeholder.
   * @param contributionScore - Initial contribution score.
   */
  public registerStakeholder(
    id: string,
    name: string,
    type: IStakeholder['type'],
    contributionScore: number
  ): void {
    const stakeholder: IStakeholder = { id, name, type, contributionScore };
    this.stakeholders.set(id, stakeholder);
    omniLogger.info(LogCategory.BUSINESS, `Stakeholder '${name}' registered.`, {
      service: 'OmniValueDistribution',
      stakeholder,
    });
  }

  /**
   * Updates a stakeholder's contribution score.
   * @param id - The ID of the stakeholder to update.
   * @param scoreChange - The amount to add or subtract from the score.
   */
  public updateContribution(id: string, scoreChange: number): void {
    const stakeholder = this.stakeholders.get(id);
    if (stakeholder) {
      stakeholder.contributionScore += scoreChange;
      this.stakeholders.set(id, stakeholder);
      omniLogger.info(
        LogCategory.BUSINESS,
        `Contribution score for '${stakeholder.name}' updated by ${scoreChange}.`,
        { service: 'OmniValueDistribution', newScore: stakeholder.contributionScore }
      );
    } else {
      omniLogger.warn(
        LogCategory.BUSINESS,
        `Attempted to update contribution for non-existent stakeholder '${id}'.`,
        { service: 'OmniValueDistribution' }
      );
    }
  }

  /**
   * Distributes a unit of value among all registered stakeholders based on their contribution scores.
   * @param valueUnit - The unit of value to be distributed.
   * @returns A map showing the distribution amount for each stakeholder ID.
   */
  public distributeValue(valueUnit: IValueUnit): Map<string, number> {
    const distributionPlan = new Map<string, number>();
    let totalContribution = 0;

    for (const stakeholder of this.stakeholders.values()) {
      totalContribution += stakeholder.contributionScore;
    }

    if (totalContribution === 0) {
      omniLogger.warn(
        LogCategory.BUSINESS,
        'Total contribution is zero. Cannot distribute value.',
        { service: 'OmniValueDistribution', valueUnit }
      );
      return distributionPlan;
    }

    omniLogger.info(
      LogCategory.BUSINESS,
      `Distributing ${valueUnit.amount} ${valueUnit.unit} from ${valueUnit.source} across ${this.stakeholders.size} stakeholders.`,
      { service: 'OmniValueDistribution' }
    );

    for (const stakeholder of this.stakeholders.values()) {
      const share = (stakeholder.contributionScore / totalContribution) * valueUnit.amount;
      distributionPlan.set(stakeholder.id, share);
      omniLogger.debug(
        LogCategory.BUSINESS,
        `Stakeholder '${stakeholder.name}' allocated ${share.toFixed(4)} ${valueUnit.unit}`,
        { service: 'OmniValueDistribution' }
      );
      // In a real system, this would trigger a transaction or update a ledger.
    }

    omniLogger.info(LogCategory.BUSINESS, 'Value distribution complete.', {
      service: 'OmniValueDistribution',
      distributionPlan,
    });
    return distributionPlan;
  }

  /**
   * Retrieves all registered stakeholders.
   * @returns An array of stakeholders.
   */
  public getStakeholders(): IStakeholder[] {
    return Array.from(this.stakeholders.values());
  }
}

// Export a singleton instance
export const valueDistributor = OmniValueDistribution.getInstance();
