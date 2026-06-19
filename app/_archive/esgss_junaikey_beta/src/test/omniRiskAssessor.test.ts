// src/test/omniRiskAssessor.test.ts

/**
 * 💡 Test Suite: OmniRiskAssessor Service Verification
 * --------------------------------------------------
 * [Objective] Ensure the OmniRiskAssessor service correctly identifies, registers,
 *             and assesses risks, fulfilling Dimension 3 (Entropy).
 * [Tool] Vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniRiskAssessor, IRisk } from '../omni/services/OmniRiskAssessor';
import { omniLogger, LogCategory } from '../omni/infrastructure/logging/OmniLogger';

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
    VALIDATION: 'VALIDATION',
  },
}));

describe('☢️ OmniRiskAssessor Service - Dimension 3 (Entropy)', () => {
  let omniRiskAssessor: OmniRiskAssessor;

  beforeEach(() => {
    vi.clearAllMocks();
    omniRiskAssessor = OmniRiskAssessor.getInstance();
  });

  it('should initialize and log its startup', () => {
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      'OmniRiskAssessor initialized.',
      expect.any(Object)
    );
  });

  it('should register a new risk', () => {
    const newRisk: IRisk = {
      id: 'network-outage',
      description: 'Loss of external network connectivity.',
      probability: 0.02,
      impact: 0.95,
      score: 0.02 * 0.95,
      category: 'operational',
      mitigationStatus: 'identified',
    };
    omniRiskAssessor.registerRisk(
      newRisk.id,
      newRisk.description,
      newRisk.probability,
      newRisk.impact,
      newRisk.category
    );

    const allRisks = omniRiskAssessor.getAllRisks();
    // Default risks + new one
    expect(allRisks).toHaveLength(4);
    expect(allRisks.some(r => r.id === newRisk.id)).toBe(true);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      expect.stringContaining(
        `Risk '${newRisk.id}' registered with score ${newRisk.score.toFixed(3)}`
      ),
      expect.any(Object)
    );
  });

  it('should calculate system entropy score correctly', () => {
    // Initial risks + any registered in beforeEach
    const initialEntropy = omniRiskAssessor.getSystemEntropyScore();
    expect(initialEntropy).toBeGreaterThan(0);

    omniRiskAssessor.registerRisk(
      'high-severity-bug',
      'A critical bug in core logic causes data corruption.',
      0.01,
      1.0,
      'operational'
    );
    const newEntropy = omniRiskAssessor.getSystemEntropyScore();
    expect(newEntropy).toBeGreaterThan(initialEntropy);
    expect(omniLogger.debug).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      expect.stringContaining('Calculated system entropy score:'),
      expect.any(Object)
    );
  });

  it('should update mitigation status of an existing risk', () => {
    const riskId = 'ai-hallucination'; // Default risk
    omniRiskAssessor.updateMitigationStatus(riskId, 'mitigated');

    const updatedRisk = omniRiskAssessor.getAllRisks().find(r => r.id === riskId);
    expect(updatedRisk?.mitigationStatus).toBe('mitigated');
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `Updated mitigation status for risk '${riskId}' to 'mitigated'.`,
      expect.any(Object)
    );
  });

  it('should log a warning if trying to update status for a non-existent risk', () => {
    const nonExistentRiskId = 'non-existent-risk';
    omniRiskAssessor.updateMitigationStatus(nonExistentRiskId, 'mitigated');

    expect(omniLogger.warn).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `Attempted to update status for non-existent risk '${nonExistentRiskId}'.`,
      expect.any(Object)
    );
  });

  it('should return all identified risks', () => {
    const allRisks = omniRiskAssessor.getAllRisks();
    expect(allRisks).toHaveLength(3); // Expecting 3 default risks
    expect(allRisks[0]).toHaveProperty('id');
    expect(allRisks[0]).toHaveProperty('description');
  });
});
