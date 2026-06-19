// src/test/omniTimeSync.test.ts

/**
 * 💡 Test Suite: OmniTimeSync Service Verification
 * --------------------------------------------------
 * [Objective] Ensure the OmniTimeSync service correctly manages time sources
 *             and provides synchronized time, fulfilling Dimension 1 (Time-Sync).
 * [Tool] Vitest
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OmniTimeSync, ITimeSource } from '../omni/services/OmniTimeSync';
import { omniLogger, LogCategory, LogLevel } from '../omni/infrastructure/logging/OmniLogger';

// Mock the omniLogger to prevent actual logging during tests and to spy on its calls
vi.mock('../omni/infrastructure/logging/OmniLogger', () => ({
  omniLogger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    log: vi.fn(),
    // Add other methods if they are called in the service and need mocking
  },
  LogCategory: {
    SYSTEM: 'SYSTEM',
    API: 'API',
    UI: 'UI',
    DATA: 'DATA',
    AUTH: 'AUTH',
    PERFORMANCE: 'PERFORMANCE',
    DEVELOPMENT: 'DEVELOPMENT',
    AI: 'AI',
    LEGION: 'LEGION',
    ESG: 'ESG',
    SEC: 'SEC',
    SECURITY: 'SECURITY',
    AGENT: 'AGENT',
    KNOWLEDGE: 'KNOWLEDGE',
    USER: 'USER',
    INTEGRATION: 'INTEGRATION',
    ACTIVE_AGENT: 'ACTIVE_AGENT',
    GROWTH: 'GROWTH',
    BUSINESS: 'BUSINESS',
    USER_ACTION: 'USER_ACTION',
    INFRASTRUCTURE: 'INFRASTRUCTURE',
    MEMORY: 'MEMORY',
    FINANCE: 'FINANCE',
    GOVERNANCE: 'GOVERNANCE',
    VALIDATION: 'VALIDATION',
  },
  LogLevel: {
    DEBUG: 'DEBUG',
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    CRITICAL: 'CRITICAL',
  },
}));

describe('⏳ OmniTimeSync Service - Dimension 1 (Time-Sync)', () => {
  let omniTimeSync: OmniTimeSync;

  beforeEach(() => {
    // Clear all mocks before each test to ensure test isolation
    vi.clearAllMocks();
    // Re-initialize the service to ensure a clean state for each test
    // We need to bypass the singleton pattern for testing if we want a fresh instance each time
    // For now, we'll just get the existing instance and assume its state is reset by clearAllMocks if needed.
    // A better approach for singletons in tests might involve a reset method or direct constructor call if designed for it.
    omniTimeSync = OmniTimeSync.getInstance();
  });

  it('should initialize and log its startup', () => {
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      'OmniTimeSync initialized.',
      expect.any(Object) // Checking for the metadata object
    );
  });

  it('should register a new time source', () => {
    const sourceName = 'Test Time Source';
    omniTimeSync.registerTimeSource(sourceName, 'online', 'http://test.com');

    const status = omniTimeSync.getStatus();
    expect(status).toHaveLength(3); // Default two plus the new one
    expect(status.some(s => s.name === sourceName)).toBe(true);
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      `Time source '${sourceName}' registered with status: online`,
      expect.any(Object)
    );
  });

  it('should not re-register an existing time source and log a warning', () => {
    const sourceName = 'Market Data Feed'; // This is a default source
    omniTimeSync.registerTimeSource(sourceName, 'online', 'http://market.com');

    // Expect only the initial 2 default sources to be present
    expect(omniTimeSync.getStatus()).toHaveLength(2);
    expect(omniLogger.warn).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      `Time source '${sourceName}' is already registered.`,
      expect.any(Object)
    );
  });

  it('should synchronize a time source and update its lastSync time', async () => {
    vi.useFakeTimers(); // Control time for predictable testing

    const sourceName = 'Test Sync Source';
    omniTimeSync.registerTimeSource(sourceName, 'offline');

    const initialStatus = omniTimeSync.getStatus().find(s => s.name === sourceName);
    expect(initialStatus?.lastSync).toBeNull();
    expect(initialStatus?.status).toBe('offline');

    const mockSyncDate = new Date('2026-01-15T10:00: 00Z);
    vi.setSystemTime(mockSyncDate);

    await omniTimeSync.syncSource(sourceName);

    const updatedStatus = omniTimeSync.getStatus().find(s => s.name === sourceName);
    expect(updatedStatus?.lastSync?.toISOString()).toEqual(mockSyncDate.toISOString());
    expect(updatedStatus?.status).toBe('online');
    expect(omniLogger.info).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      `Successfully synchronized with '${sourceName}'.`,
      expect.objectContaining({ lastSync: mockSyncDate })
    );

    vi.useRealTimers(); // Restore real timers
  });

  it('should log an error if trying to sync a non-existent source', async () => {
    const nonExistentSource = 'NonExistentSource';
    await omniTimeSync.syncSource(nonExistentSource);

    expect(omniLogger.error).toHaveBeenCalledWith(
      LogCategory.SYSTEM,
      `Time source '${nonExistentSource}' not found.`,
      expect.objectContaining({ error: expect.any(Error) }) // Check that an error object is passed
    );
  });

  it('should return the current synchronized time', () => {
    vi.useFakeTimers();
    const mockDate = new Date('2026-01-15T11:00: 00Z);
    vi.setSystemTime(mockDate);

    const syncedTime = omniTimeSync.getSynchronizedTime();
    expect(syncedTime.toISOString()).toEqual(mockDate.toISOString());

    vi.useRealTimers();
  });
});
