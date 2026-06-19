// src/test/omniEvolutionEngine.test.ts

/**
 * 💡 Test Suite: OmniEvolutionEngine Service Verification
 * --------------------------------------------------
 * [Objective] Ensure the OmniEvolutionEngine service correctly manages ethical guidelines
 *             and growth metrics, fulfilling Dimension 2 (Benevolence) and Dimension 7 (Growth).
 * [Tool] Vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  OmniEvolutionEngine,
  IEthicalGuideline,
  IGrowthMetric,
} from '../omni/services/OmniEvolutionEngine';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';
import { OmniValueDistribution } from '../omni/services/OmniValueDistribution'; // Import for mocking

// Mock the omniLogger to prevent actual logging during tests and to spy on its calls
vi.mock('../omni/infrastructure/logging/OmniLogger', () => ({
  omniLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
    GOVERNANCE: 'GOVERNANCE',
    GROWTH: 'GROWTH',
    BUSINESS: 'BUSINESS',
  },
}));

// Mock OmniValueDistribution as it's a dependency for OmniEvolutionEngine's updateGrowthMetric
vi.mock('../omni/services/OmniValueDistribution', () => ({
  OmniValueDistribution: {
    getInstance: vi.fn().mockReturnValue({
      distributeValue: vi.fn(),
    }),
  },
}));

describe('🌱 OmniEvolutionEngine Service - Dimension 2 (Benevolence) & 7 (Growth)', () => {
  let omniEvolutionEngine: OmniEvolutionEngine;
  let mockValueDistributor: OmniValueDistribution;

  beforeEach(() => {
    vi.clearAllMocks();
    omniEvolutionEngine = OmniEvolutionEngine.getInstance();
    mockValueDistributor = OmniValueDistribution.getInstance() as OmniValueDistribution;
  });

  it('should initialize and log its startup', () => {
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      'OmniEvolutionEngine initialized.',
      expect.any(Object)
    );
  });

  it('should register a new ethical guideline', () => {
    const guideline: IEthicalGuideline = {
      id: 'data-security',
      description: 'Protect all sensitive data from unauthorized access.',
      priority: 10,
    };
    omniEvolutionEngine.registerEthicalGuideline(guideline);

    const guidelines = omniEvolutionEngine.getEthicalGuidelines();
    expect(guidelines).toHaveLength(4); // 3 defaults + new one
    expect(guidelines.some(g => g.id === 'data-security')).toBe(true);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.GOVERNANCE,
      `Ethical guideline '${guideline.id}' registered.`,
      expect.any(Object)
    );
  });

  it('should not re-register an existing ethical guideline and log a warning', () => {
    const guideline: IEthicalGuideline = {
      id: 'privacy-first', // Default guideline
      description: 'Updated description.',
      priority: 10,
    };
    omniEvolutionEngine.registerEthicalGuideline(guideline);

    expect(omniEvolutionEngine.getEthicalGuidelines()).toHaveLength(3); // Should still be 3 default
    expect(omniLogger.warn).toHaveBeenCalledWith(
      LogCategory.GOVERNANCE,
      `Ethical guideline '${guideline.id}' is already registered.`,
      expect.any(Object)
    );
  });

  it('should register a new growth metric', () => {
    const metric: IGrowthMetric = {
      id: 'user-retention',
      name: 'User Retention Rate',
      description: 'Percentage of users returning over time.',
      currentValue: 0.8,
      targetValue: 0.9,
      isBenevolent: false,
    };
    omniEvolutionEngine.registerGrowthMetric(metric);

    const metrics = omniEvolutionEngine.getGrowthMetrics();
    expect(metrics).toHaveLength(3); // 2 defaults + new one
    expect(metrics.some(m => m.id === 'user-retention')).toBe(true);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.GROWTH,
      `Growth metric '${metric.id}' registered.`,
      expect.any(Object)
    );
  });

  it('should update a growth metric', () => {
    const metricId = 'feature-adoption'; // Default metric
    const newValue = 0.85;
    omniEvolutionEngine.updateGrowthMetric(metricId, newValue);

    const updatedMetric = omniEvolutionEngine.getGrowthMetrics().find(m => m.id === metricId);
    expect(updatedMetric?.currentValue).toBe(newValue);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.GROWTH,
      `Growth metric '${updatedMetric?.name}' updated to ${newValue}.`,
      expect.any(Object)
    );
  });

  it('should trigger value distribution if benevolent growth metric reaches target', () => {
    const metricId = 'community-engagement'; // Default benevolent metric
    const targetValue = 1000;

    // Simulate reaching target
    omniEvolutionEngine.updateGrowthMetric(metricId, targetValue);

    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.GROWTH,
      `Benevolent growth metric 'Community Engagement Score' reached target! Triggering value distribution.`,
      expect.any(Object)
    );
    expect(mockValueDistributor.distributeValue).toHaveBeenCalledTimes(1);
    expect(mockValueDistributor.distributeValue).toHaveBeenCalledWith(
      expect.objectContaining({
        description: expect.stringContaining('Community Engagement Score target achievement'),
        amount: 100,
        unit: 'credits',
      })
    );
  });

  it('should log an error if evaluating a non-existent ethical guideline', async () => {
    const nonExistentId = 'non-existent-guideline';
    const score = await omniEvolutionEngine.evaluateEthicalAdherence(nonExistentId);

    expect(score).toBe(0);
    expect(omniLogger.error).toHaveBeenCalledWith(
      LogCategory.GOVERNANCE,
      `Ethical guideline '${nonExistentId}' not found for evaluation.`,
      expect.objectContaining({ error: expect.any(Error) })
    );
  });

  it('should simulate ethical adherence evaluation', async () => {
    const guidelineId = 'privacy-first';
    const score = await omniEvolutionEngine.evaluateEthicalAdherence(guidelineId);

    expect(score).toBeGreaterThanOrEqual(0);
    expect(score).toBeLessThanOrEqual(1);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.GOVERNANCE,
      `Adherence for '${guidelineId}' evaluated: ${score.toFixed(2)}.`,
      expect.objectContaining({ adherenceScore: score })
    );
  });
});
