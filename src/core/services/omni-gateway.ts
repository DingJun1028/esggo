import { IBusEvent } from '../../lib/omni-core/contracts';
import { createHash } from 'crypto';
import { enhancedOmniBus } from '../../lib/omni-agent-bus';
import { monitorBackpressure, shadowTestIngress, predictAndPreFetch, injectChaos, lifecycleCleanup } from '../../lib/omni-agent-bus';

/**
 * Simplified OmniAgentGateway – only demonstrates integration with Dynamic Entropy Gating.
 * The original complex gateway logic (validate5TGate, UI feedback, ecosystem wiring) is omitted
 * for this exercise, focusing on the four core functions.
 */
export async function secureForward(event: IBusEvent): Promise<{ status: string; hashLock: string }> {
  // Basic hash‑lock for immutability & traceability
  const hashLock = createHash('sha256').update(JSON.stringify(event)).digest('hex');
  // Publish the event (including hashLock) to the bus
  enhancedOmniBus.publish('external-forward', { ...event, hashLock });
  return { status: 'routed', hashLock };
}

// Re‑export the Dynamic Entropy Gating utilities for external callers
export const monitorBackpressureWrapper = monitorBackpressure;
export const shadowTestIngressWrapper = shadowTestIngress;
export const predictAndPreFetchWrapper = predictAndPreFetch;
export const injectChaosWrapper = injectChaos;
export const lifecycleCleanupWrapper = lifecycleCleanup;
