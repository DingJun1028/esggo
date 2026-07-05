import { IBusEvent, ComponentCore } from '@/lib/omni-core/contracts';
import { verify5TGate } from '@/lib/omni-agent';
import { createHash } from 'crypto';
import { enhancedOmniBus } from '@/lib/omni-agent-bus';
import { OmniCoreEcosystem } from '@/lib/omni-core/ecosystem';

/**
 * OmniAgentGateway – Security & Compliance Enforcement Layer
 * Integrates with Time‑Travel Bus for full traceability.
 */
class OmniAgentGateway {
  private bus = enhancedOmniBus;

  /** Handle external requests with full security stack */
  async secureForward(event: IBusEvent): Promise<any> {
    console.log(`[ OAG ] Securing external request: ${event.source_origin} → ${event.destination_target}`);

    // 1. Validate 5T Gates
    const validation = verify5TGate(
      event.gate ?? 'traceable',
      event.payload ? String(event.payload) : '',
      event.hash || ''
    );

    if (!validation.passed) {
      throw new Error(`5T_GATE_VALIDATION_FAILED: ${validation.issues.join(' | ')}`);
    }

    // 2. Hash Lock
    const hashLock = this.applyHashLock(event);

    // 3. Publish to external target via OAB
    this.bus.publish('external-forward', {
      ...event,
      hashLock,
      policy_tags: [...(event.policy_tags || []), 'trust-shield'],
    });

    // 4. Trigger UI feedback (combo 2)
    this.triggerUIFeedback(event, hashLock);

    return { status: 'routed', hashLock };
  }

  private applyHashLock(event: IBusEvent): string {
    return createHash('sha256')
      .update(JSON.stringify(event))
      .digest('hex');
  }

  private triggerUIFeedback(event: IBusEvent, hashLock: string): void {
    this.bus.subscribeToUIFeedback((_ev) => {
      console.log(`[ OAG UI ] Trust shield unlocked for ${event.uuid}`);
    });
  }
}

/** Create the gateway instance */
const gateway = new OmniAgentGateway();

/** Wire gateway, bus, and agents into the core ecosystem */
export const omniEcosystem = new OmniCoreEcosystem(gateway, enhancedOmniBus);

/** For backward compatibility, also export the gateway directly */
export const omniGateway = gateway;