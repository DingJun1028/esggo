// src/test/omniTruthEngine.test.ts

/**
 * 💡 Test Suite: OmniTruthEngine Service Verification
 * --------------------------------------------------
 * [Objective] Ensure the OmniTruthEngine service correctly manages claims
 *             and truth sources, verifying data integrity and resisting 'hallucinations',
 *             fulfilling Dimension 4 (Truth).
 * [Tool] Vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniTruthEngine, IClaim, ITruthSource } from '../omni/services/OmniTruthEngine';
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

describe('⚖️ OmniTruthEngine Service - Dimension 4 (Truth)', () => {
  let omniTruthEngine: OmniTruthEngine;

  beforeEach(() => {
    vi.clearAllMocks();
    omniTruthEngine = OmniTruthEngine.getInstance();
  });

  it('should initialize and log its startup', () => {
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      'OmniTruthEngine initialized.',
      expect.any(Object)
    );
  });

  it('should register a new truth source', () => {
    const mockTruthSource: ITruthSource = {
      id: 'external-api',
      name: 'External Fact-Checking API',
      validate: vi.fn(async (claimContent: string) => ({
        isVerified: claimContent === 'External truth',
        confidence: 0.9,
      })),
    };
    omniTruthEngine.registerTruthSource(mockTruthSource);

    // After beforeEach, there's 1 default truth source. Registering adds one more.
    expect(omniTruthEngine['truthSources'].size).toBe(2);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `Truth source '${mockTruthSource.name}' registered.`,
      expect.any(Object)
    );
  });

  it('should not re-register an existing truth source and log a warning', () => {
    const defaultTruthSourceId = 'internal-kb'; // Default source
    const mockTruthSource: ITruthSource = {
      id: defaultTruthSourceId,
      name: 'Internal Knowledge Base',
      validate: vi.fn(),
    };
    omniTruthEngine.registerTruthSource(mockTruthSource);

    expect(omniTruthEngine['truthSources'].size).toBe(1); // Should still be 1 (the default one)
    expect(omniLogger.warn).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `Truth source '${mockTruthSource.name}' is already registered.`,
      expect.any(Object)
    );
  });

  it('should submit a claim and trigger its validation', async () => {
    const claimId = 'test-claim-1';
    const claimContent = 'The sky is blue';
    const sourceId = 'user-input';

    const claim = omniTruthEngine.submitClaim(claimId, claimContent, sourceId);

    expect(claim.id).toBe(claimId);
    expect(claim.content).toBe(claimContent);
    expect(claim.validationStatus).toBe('verified'); // Based on mock internal-kb
    expect(claim.confidenceScore).toBeGreaterThan(0);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `New claim '${claimId}' submitted for validation.`,
      expect.any(Object)
    );
    // Expect validateClaim to have been called internally
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      expect.stringContaining(`Validation complete for claim '${claimId}'.`),
      expect.any(Object)
    );
  });

  it('should correctly validate a known true claim', async () => {
    const claimId = 'true-claim';
    const claimContent = 'The sky is blue';
    omniTruthEngine.submitClaim(claimId, claimContent, 'system');
    await omniTruthEngine.validateClaim(claimId); // Explicitly await for thorough check

    const validatedClaim = omniTruthEngine.getClaim(claimId);
    expect(validatedClaim?.validationStatus).toBe('verified');
    expect(validatedClaim?.confidenceScore).toBeGreaterThan(0.9);
  });

  it('should correctly validate a known false claim', async () => {
    const claimId = 'false-claim';
    const claimContent = 'The earth is flat';
    omniTruthEngine.submitClaim(claimId, claimContent, 'system');
    await omniTruthEngine.validateClaim(claimId); // Explicitly await for thorough check

    const validatedClaim = omniTruthEngine.getClaim(claimId);
    expect(validatedClaim?.validationStatus).toBe('disputed');
    expect(validatedClaim?.confidenceScore).toBeLessThan(0.5);
  });

  it('should log an error if trying to validate a non-existent claim', async () => {
    const nonExistentClaimId = 'non-existent';
    await omniTruthEngine.validateClaim(nonExistentClaimId);

    expect(omniLogger.error).toHaveBeenCalledWith(
      LogCategory.VALIDATION,
      `Claim '${nonExistentClaimId}' not found for validation.`,
      expect.objectContaining({ error: expect.any(Error) })
    );
  });
});
