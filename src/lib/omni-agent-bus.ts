import { IBusEvent, OmniAgentBus } from './omni-agent-bus';
import { plantOmniSeed } from '../sonnar/omni-seed';
import { verify5TGate, OmniAgent } from '../omni-agent';
import { createHash } from 'crypto';

/**
 * Enhanced OmniAgentBus with:
 * 1. Time‑Travel / Shadow Capture (Combination 4)
 * 2. Automatic Entropy‑Reduction (Combination 1)
 * 3. Blackboard / Swarm Intelligence (Combination 6)
 * 4. UI‑Feedback Hook for Trust Shield (Combination 2)
 */
class EnhancedOmniAgentBus extends OmniAgentBus {
  // ---- 1. Time‑Travel / Shadow Capture ----
  protected timeLock = false;
  protected shadowChannel = new Map<string, Array<IBusEvent>>();

  // ---- 2. Entropy‑Reduction (event deduplication & batching) ----
  /** Map of event fingerprint -> count in the last window */
  private eventFrequency = new Map<string, number>();
  /** Timestamp of last cleanup (ms) */
  private lastCleanup = Date.now();
  /** How often we clean the frequency map (ms) */
  private readonly CLEAN_INTERVAL = 60_000; // 1 minute
  /** Threshold after which we consider the event “spammy” */
  private readonly SPAM_THRESHOLD = 5;
  /** Batch container for events that will be collapsed */
  private eventBatch = new Map<string, IBusEvent[]>();

  // ---- 3. Blackboard (shared knowledge) ----
  /** Simple key‑value store that any agent can read/write */
  private blackboard = new Map<string, any>();

  // ---- 4. UI‑Feedback hook for Trust Shield ----
  /** Subscribers that want to know when a trust‑shield event occurs */
  private uiFeedbackCallbacks: ((event: IBusEvent) => void)[] = [];

  constructor() {
    super();
    this.registerShadowTesting();
    // start periodic cleanup
    setInterval(() => this.cleanupFrequencyMap(), this.CLEAN_INTERVAL);
  }

  // =============================================================
  // 1. Time‑Travel / Shadow Capture
  // =============================================================
  protected registerShadowTesting(): void {
    this.subscribe('external', (event: IBusEvent) => {
      if (event.payload && 'debug' in event.payload) {
        const { debug } = event.payload as any;
        if (debug.attachShadow) {
          this.createShadowDataTrack(event.uuid, event);
        }
      }
    });
  }

  protected createShadowDataTrack(uuid: string, event: IBusEvent): void {
    const list = this.shadowChannel.get(uuid) ?? [];
    list.push(event);
    this.shadowChannel.set(uuid, list);
  }

  /** Replay a previously recorded shadow track (time‑travel debugging) */
  async replayShadowTrack(uuid: string): Promise<void> {
    if (this.timeLock) return;
    this.timeLock = true;
    const track = this.shadowChannel.get(uuid);
    if (track?.length) {
      console.log(`[TimeTravelBus] Rewinding time for UUID ${uuid} – ${track.length} events`);
    }
    for (const ev of track ?? []) {
      try {
        await this.publish(`time-travel:${uuid}`, {
          ...ev,
          _action: 'TIME_PROGRESS_RECORD',
          timestamp: Date.now() - Math.floor(Math.random() * 3000), // simulate past
        }, { wait: true, delay: 30 });
      } catch (e) {
        console.error('[TimeTravelBus] Replay failed:', e);
      }
    }
    this.timeLock = false;
  }

  // =============================================================
  // 2. Entropy‑Reduction (auto‑deduplication & batching)
  // =============================================================
  /** Generate a stable fingerprint for an event (ignores volatile fields) */
  private eventFingerprint(ev: IBusEvent): string {
    const { source_origin, destination_target, payload, policy_tags } = ev;
    // Use JSON.stringify on the stable parts; timestamp/uuid vary per call → ignore
    return JSON.stringify({ source_origin, destination_target, payload, policy_tags });
  }

  /** Override publish to include deduplication logic */
  publish(topic: string, event: IBusEvent, options: { wait?: boolean; delay?: number } = {}): void {
    // --- Entropy reduction step ---
    const fp = this.eventFingerprint(event);
    const count = (this.eventFrequency.get(fp) ?? 0) + 1;
    this.eventFrequency.set(fp, count);

    // If we are above the spam threshold, batch instead of publishing immediately
    if (count >= this.SPAM_THRESHOLD) {
      const batch = this.eventBatch.get(fp) ?? [];
      batch.push(event);
      this.eventBatch.set(fp, batch);
      console.log(`[EntropyReduce] Event ${fp} reached threshold (${count}); batching.`);
      // Optionally, flush the batch after a short delay or when size hits a limit.
      // For simplicity we flush immediately when batch size reaches 10.
      if (batch.length >= 10) {
        this.flushBatch(fp);
      }
      // Do NOT forward the individual event further.
      return;
    }

    // Normal publishing (if not considered spam)
    super.publish(topic, event, options);
  }

  /** Flush a batched event stream as a single meta‑event */
  private flushBatch(fingerprint: string): void {
    const batch = this.eventBatch.get(fingerprint) ?? [];
    if (batch.length === 0) return;
    // Create a summary event
    const first = batch[0];
    const summary: IBusEvent = {
      ...first,
      payload: {
        batchSize: batch.length,
        batchIds: batch.map(b => b.uuid),
        // you could merge payloads here if needed
        originalPayloads: batch.map(b => b.payload),
      },
      // Mark it as a batched event so downstream knows it's condensed
      _action: 'BATCHED_EVENT',
    };
    // Clear batch
    this.eventBatch.delete(fingerprint);
    // Publish the summarized event
    super.publish('batched', summary);
    console.log(`[EntropyReduce] Flushed batch of ${batch.length} events as one meta‑event.`);
  }

  /** Periodically clean the frequency map to avoid unlimited growth */
  private cleanupFrequencyMap(): void {
    const now = Date.now();
    if (now - this.lastCleanup < this.CLEAN_INTERVAL) return;
    this.eventFrequency.clear();
    this.lastCleanup = now;
    console.log('[EntropyReset] Frequency map cleared.');
  }

  // =============================================================
  // 3. Blackboard (shared knowledge) – simple K/V store
  // =============================================================
  /** Write a value to the blackboard (any agent can call) */
  blackboardWrite(key: string, value: any): void {
    this.blackboard.set(key, value);
    // Optionally publish a blackboard update event for interested agents
    this.publish('blackboard-update', {
      source_origin: 'Blackboard',
      destination_target: '*',
      uuid: crypto.randomUUID(),
      version: '1.0.0',
      timestamp: Date.now(),
      payload: { key, value },
      policy_tags: ['blackboard'],
    });
  }

  /** Read a value from the blackboard */
  blackboardRead<T>(key: string): T | undefined {
    return this.blackboard.get(key) as T | undefined;
  }

  /** Listen for blackboard changes */
  onBlackboardChange(callback: (key: string, value: any) => void): () => void {
    const handler = (event: IBusEvent) => {
      if (event.policy_tags?.includes('blackboard')) {
        const { key, value } = event.payload as { key: string; value: any };
        callback(key, value);
      }
    };
    this.subscribe('blackboard-update', handler);
    return () => this.unsubscribe('blackboard-update', handler);
  }

  // =============================================================
  // 4. UI‑Feedback hook for Trust Shield – simple callback list
  // =============================================================
  subscribeToUIFeedback(cb: (event: IBusEvent) => void): () => void {
    this.uiFeedbackCallbacks.push(cb);
    return () => {
      const idx = this.uiFeedbackCallbacks.indexOf(cb);
      if (idx >= 0) this.uiFeedbackCallbacks.splice(idx, 1);
    };
  }

  private triggerUIFeedback(event: IBusEvent): void {
    for (const cb of this.uiFeedbackCallbacks) {
      try {
        cb(event);
      } catch (e) {
        console.warn('[UIFeedback] Callback threw:', e);
      }
    }
  }

  // Override publish to also fire UI feedback when a trust‑shield event occurs
  publish(topic: string, event: IBusEvent, options: { wait?: boolean; delay?: number } = {}): void {
    // First run the entropy‑reduction logic (as defined above)
    const fp = this.eventFingerprint(event);
    const count = (this.eventFrequency.get(fp) ?? 0) + 1;
    this.eventFrequency.set(fp, count);

    if (count >= this.SPAM_THRESHOLD) {
      const batch = this.eventBatch.get(fp) ?? [];
      batch.push(event);
      this.eventBatch.set(fp, batch);
      if (batch.length >= 10) this.flushBatch(fp);
      return; // suppress individual publish
    }

    // Normal publish path
    super.publish(topic, event, options);
    if (event.policy_tags?.includes('trust-shield')) {
      this.triggerUIFeedback(event);
    }
  }

  // Helper to unsubscribe (needed for clean‑up)
  unsubscribe(topic: string, callback: Function): void {
    const list = this._events[topic] as Function[] | undefined;
    if (Array.isArray(list)) {
      const idx = list.indexOf(callback);
      if (idx >= 0) list.splice(idx, 1);
    }
  }
}

// Export a singleton instance
export const enhancedOmniBus = new EnhancedOmniAgentBus();