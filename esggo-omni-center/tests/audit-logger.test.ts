/**
 * AuditLogger Full-Volume Persistence Tests
 *
 * Verifies AuditLogger honors the "full-volume" invariant:
 *   - Default mode: no truncation, all entries kept
 *   - Explicit maxEntries (>0): ring-buffer truncation
 *   - Sink receives every entry regardless of mode
 */

import { describe, it, expect } from 'vitest';
import { AuditLogger } from '../src/agents/complete-delegation/autonomous-decision-engine';

describe('AuditLogger full-volume persistence', () => {
  it('default mode keeps all entries (no truncation)', async () => {
    const logger = new AuditLogger();
    const N = 1500;
    for (let i = 0; i < N; i++) {
      await logger.log({ type: 'TEST', timestamp: Date.now(), i });
    }
    // Default maxEntries=0 means no limit -- all 1500 retained
    expect(logger.size).toBe(N);
    expect(logger.getLogs().length).toBe(N);
    expect(logger.getLogs('TEST').length).toBe(N);
  });

  it('truncates only when maxEntries (>0) is explicitly set', async () => {
    const logger = new AuditLogger(undefined, { maxEntries: 10 });
    for (let i = 0; i < 25; i++) {
      await logger.log({ type: 'TEST', timestamp: Date.now(), i });
    }
    // Ring buffer keeps newest 10: i = 15..24
    expect(logger.size).toBe(10);
    expect(logger.getLogs()[0]).toMatchObject({ i: 15 });
    expect(logger.getLogs()[9]).toMatchObject({ i: 24 });
  });

  it('forwards every entry to the sink (full-volume persistence)', async () => {
    const received: Array<{ type: string; i: number }> = [];
    const logger = new AuditLogger((e) => {
      received.push(e as { type: string; i: number });
    });
    for (let i = 0; i < 5; i++) {
      await logger.log({ type: 'TEST', timestamp: Date.now(), i });
    }
    // Every entry forwarded to sink, even in full-volume mode
    expect(received.length).toBe(5);
  });
});
