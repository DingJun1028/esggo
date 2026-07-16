import { randomUUID } from 'crypto';
import { secureForward } from '../../core/services/omni-gateway';
import type { IBusEvent } from '../../lib/omni-agent-bus';
import { getDefaultJournal } from './journal';

export async function publishDelegationEvent(
  type: string,
  topic: string,
  payload: Record<string, unknown>,
  source: string
): Promise<{ status: string; hashLock: string }> {
  const now = Date.now();
  const event: IBusEvent = {
    event: type,
    ts: now,
    uuid: randomUUID(),
    version: '1.0.0',
    payload,
    source_origin: source,
    topic,
    lifecycle_path: [{ stage: 'EMERGED', timestamp: now, node: 'complete-delegation' }],
  };

  try {
    const { hashLock } = await secureForward(event);
    try {
      const journalId = getDefaultJournal().append({
        kind: 'event',
        type,
        delegationId: (payload.delegationId as string) ?? '',
        topic,
        hashLock,
        ts: now,
        source,
        payload: { type, ...payload },
      });
      event.journalId = journalId;
    } catch {
      /* best-effort */
    }
    return { status: 'ok', hashLock };
  } catch (err) {
    console.error('[delegation-events] publish failed:', err);
    return { status: 'error', hashLock: '' };
  }
}
