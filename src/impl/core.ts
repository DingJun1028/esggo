// src/impl/core.ts
// ------------------------------------------------------------
// Implementation of OmniAgent ecosystem with back‑pressure cloning
// (奇效七：細胞分裂 – 動態代理增殖與熱插拔)
// ------------------------------------------------------------

import * as crypto from "crypto";
import {
  IComponentCore,
  IBusEvent,
  LifecycleStage,
  IOmniAgent,
  IOmniAgentBus,
  IOmniAgentGateway,
  ITimeTravelRegistry,
  IMartialLawEvent,
} from "../types/core-contract";
import { OmniSeed } from "../lib/omni-seed";
import { OmniTag } from "../lib/omni-tag";
import { OmniEvidence } from "./omni-evidence";
import { OmniTime } from "./omni-time";
import { OmniMemory } from "./omni-memory";
import { OmniAPI, OmniBlackboard, OmniHealing, OmniEvolution } from "./omni-helper-modules";

// ---------- 1️⃣ Helper ----------
const now = () => Date.now();
function makeCore<T extends IComponentCore>(c: Omit<T, "timestamp">): T {
  return { ...c, timestamp: now() } as T;
}

// ---------- 2️⃣ Simple TimeTravel Registry ----------
export class TimeTravelRegistry implements ITimeTravelRegistry {
  private store = new Map<string, IBusEvent>();
  async record(event: IBusEvent) {
    this.store.set(event.uuid, { ...event });
  }
  async replay(start: number, end?: number, topic?: string) {
    const out: IBusEvent[] = [];
    for (const ev of Array.from(this.store.values())) {
      if (ev.timestamp < start) continue;
      if (end && ev.timestamp > end) continue;
      if (topic && ev.topic !== topic) continue;
      out.push({ ...ev });
    }
    return out;
  }
  async shadow(event: IBusEvent) {
    // shadow events are just recorded – OAB will pick them up later
    await this.record(event);
  }
}

// ---------- 3️⃣ OmniAgent Implementation ----------
export class OmniAgent implements IOmniAgent {
  private hooks = new Map<LifecycleStage, ((c: { event?: IBusEvent }) => Promise<void>)[]>();

  // IComponentCore fields are provided via constructor core object
  constructor(private readonly core: IComponentCore) {}

  // getters for core fields
  get uuid() { return this.core.uuid; }
  get version() { return this.core.version; }
  get timestamp() { return this.core.timestamp; }
  evidence = this.core.evidence;

  async execute(event: IBusEvent): Promise<void> {
    // Simple placeholder – real business logic goes here
    console.log(`[OA ${this.uuid}] executing event ${event.eventName}`);
    // Trigger EMERGED hook if registered
    const hooks = this.hooks.get("EMERGED");
    if (hooks) {
      for (const h of hooks) await h({ event });
    }
  }

  registerHook(stage: LifecycleStage, hook: (ctx: { event?: IBusEvent }) => Promise<void>) {
    if (!this.hooks.has(stage)) this.hooks.set(stage, []);
    this.hooks.get(stage)!.push(hook);
  }

  async onMartialLaw(): Promise<void> {
    console.warn(`[OA ${this.uuid}] entering read‑only (liquid‑glass) mode`);
    // In a UI environment you would render an overlay here.
  }

  clone(newUuid: string): IOmniAgent {
    // Clone retains the same version but gets a fresh uuid and timestamp.
    const clonedCore: IComponentCore = {
      uuid: newUuid,
      version: this.version,
      timestamp: now(),
      evidence: { ...this.evidence },
    };
    return new OmniAgent(clonedCore);
  }

  // signature field – mirrors core (immutable)
  get signature(): IComponentCore {
    return { ...this.core };
  }
}

// ---------- 4️⃣ OmniAgentBus Implementation ----------
export class OmniAgentBus implements IOmniAgentBus {
  private handlers = new Map<string, ((e: IBusEvent) => Promise<void>)[]>();
  private queues = new Map<string, IBusEvent[]>();

  constructor(
    private readonly registry: ITimeTravelRegistry,
    private readonly ecosystem: OmniCoreEcosystem
  ) {}

  async publish(event: IBusEvent) {
    await this.registry.record(event);
    const topic = event.topic ?? "*";
    if (!this.queues.has(topic)) this.queues.set(topic, []);
    this.queues.get(topic)!.push(event);
    const hs = this.handlers.get(topic) ?? [];
    for (const h of hs) await h(event);
    await this.monitorBackpressure(topic, 1000);
  }

  subscribe(topic: string, handler: (event: IBusEvent) => Promise<void>) {
    if (!this.handlers.has(topic)) this.handlers.set(topic, []);
    this.handlers.get(topic)!.push(handler);
  }

  async monitorBackpressure(topic: string, threshold: number) {
    const q = this.queues.get(topic) ?? [];
    if (topic === "data.clean" && q.length > threshold) {
      await this.ecosystem.cloneAgentForTopic(topic);
    }
    if (q.length === 0) {
      await this.ecosystem.cleanupClonesForTopic(topic);
    }
  }

  async cloneAgentIfNeeded(topic: string, threshold: number) {
    // Alias for monitorBackpressure (kept for interface compliance)
    await this.monitorBackpressure(topic, threshold);
  }

  async replayEvents(startTime: number, endTime?: number, topic?: string) {
    await this.registry.replay(startTime, endTime, topic);
  }

  async shadowTestIngress(event: IBusEvent) {
    const shadow = makeCore<IBusEvent>({
      ...event,
      version: "shadow-test",
    });
    await this.publish(shadow);
  }
}

// ---------- 5️⃣ OmniAgentGateway (simplified) ----------
export class OmniAgentGateway implements IOmniAgentGateway {
  private martial = false;
  private reason = "";
  private core: IComponentCore;

  constructor(private readonly bus: IOmniAgentBus, core?: IComponentCore) {
    this.core = core ?? { uuid: crypto.randomUUID(), version: "1.0.0", timestamp: Date.now(), evidence: {} };
  }

  // IComponentCore getters
  get uuid() { return this.core.uuid; }
  get version() { return this.core.version; }
  get timestamp() { return this.core.timestamp; }
  get evidence() { return this.core.evidence; }

  async ingress(event: IBusEvent) {
    const valid = !!event.hashLock && !!event.evidence?.hash;
    if (!valid) {
      this.onMartialLaw("evidence mismatch");
      const ml: IMartialLawEvent = makeCore<IMartialLawEvent>({
        uuid: crypto.randomUUID(),
        version: "1.0.0",
        reason: "evidence mismatch",
        source: "OAG",
        relatedEvent: event,
        evidence: {},
      });
      await this.bus.publish({
        uuid: ml.uuid,
        version: ml.version,
        eventName: "sys.martial_law",
        payload: ml,
        stage: "EMERGED",
        source_origin: "gateway",
        evidence: ml.evidence,
        timestamp: ml.timestamp,
        topic: "system",
        lifecycle_path: [],
        hashLock: undefined,
      } as IBusEvent);
      return Object.freeze(event);
    }
    const locked = Object.freeze({ ...event, hashLock: crypto.randomUUID() });
    return locked as IBusEvent;
  }

  // egress implementation with validation & freeze
  async egress(event: IBusEvent) {
    const valid = !!event.hashLock && !!event.evidence?.hash;
    if (!valid) {
      this.onMartialLaw("egress evidence mismatch");
      const ml: IMartialLawEvent = makeCore<IMartialLawEvent>({
        uuid: crypto.randomUUID(),
        version: "1.0.0",
        reason: "egress evidence mismatch",
        source: "OAG",
        relatedEvent: event,
        evidence: {},
      });
      await this.bus.publish({
        uuid: ml.uuid,
        version: ml.version,
        eventName: "sys.martial_law",
        payload: ml,
        stage: "EMERGED",
        source_origin: "gateway",
        evidence: ml.evidence,
        timestamp: ml.timestamp,
        topic: "system",
        lifecycle_path: [],
        hashLock: undefined,
      } as IBusEvent);
      return Object.freeze(event);
    }
    return Object.freeze({ ...event, hashLock: crypto.randomUUID() }) as IBusEvent;
  }

  async secureForward(event: IBusEvent): Promise<IBusEvent> {
    const locked = Object.freeze({ ...event, hashLock: crypto.randomUUID() });
    return locked as IBusEvent;
  }

  async predictAndPreFetch(intent: string): Promise<Array<IBusEvent>> {
    const apiKey = process.env.NVAPI_KEY;
    if (!apiKey) {
      console.warn('[OAG] NVIDIA API key not set – returning empty predictions');
      return [];
    }
    // Build request payload – forward intent as prompt.
    const payload = JSON.stringify({ prompt: intent });
    // Use curl to call NVIDIA API (placeholder endpoint). Adjust URL & headers as needed.
    const curlCmd = `curl -s -X POST https://api.nvidia.com/v1/predict \
      -H "Authorization: Bearer ${apiKey}" \
      -H "Content-Type: application/json" \
      -d '${payload}'`;
    const { execSync } = await import('node:child_process');
    let output: string;
    try {
      output = execSync(curlCmd, { encoding: 'utf8' });
    } catch (e) {
      console.error('[OAG] NVIDIA API call failed', e);
      return [];
    }
    let resultArray: unknown[] = [];
    try {
      const parsed = JSON.parse(output);
      // Assume API returns an array of predicted events under `predictions`.
      resultArray = parsed.predictions ?? [];
    } catch (e) {
      console.error('[OAG] Failed to parse NVIDIA response', e);
      return [];
    }
    // Transform each prediction into IBusEvent objects.
    const events: IBusEvent[] = resultArray.map((p, _idx) =>
      makeCore<IBusEvent>({
        uuid: crypto.randomUUID(),
        version: '1.0.0',
        eventName: 'nvidia.prediction',
        payload: p,
        stage: 'EMERGED',
        source_origin: 'nvidia',
        topic: 'prediction',
        evidence: {},
        lifecycle_path: [],
        hashLock: crypto.randomUUID(),
      })
    );
    // Write raw predictions to secret vault (JSON file).
    try {
      const fs = await import('node:fs');
      const vaultPath = `${process.cwd()}/secrets/nvidia_predictions.json`;
      await fs.promises.mkdir(`${process.cwd()}/secrets`, { recursive: true });
      await fs.promises.writeFile(vaultPath, JSON.stringify(resultArray, null, 2), 'utf8');
      console.info(`[OAG] Saved ${events.length} NVIDIA predictions to secret vault`);
    } catch (e) {
      console.warn('[OAG] Could not write to secret vault', e);
    }
    return events;
  }

  injectChaos(event: IBusEvent): IBusEvent {
    const mutated = { ...event, chaos: true, injectedAt: Date.now() } as IBusEvent;
    console.warn(`[OAG] Chaos injected into event ${event.uuid}`);
    return mutated as IBusEvent;
  }

  onMartialLaw(reason: string) {
    this.martial = true;
    this.reason = reason;
    console.warn(`[OAG] MARTIAL LAW ACTIVATED – ${reason}`);
  }

  liftMartialLaw() {
    this.martial = false;
    this.reason = "";
    console.info("[OAG] MARTIAL LAW LIFTED");
  }

  isUnderMartialLaw() { return this.martial; }
}

// ---------- 6️⃣ Ecosystem – wires everything together ----------
export class OmniCoreEcosystem {
  public readonly registry = new TimeTravelRegistry();
  public readonly bus: OmniAgentBus;
  public readonly gateway: OmniAgentGateway;
  public readonly time = new OmniTime();
  public readonly evidence = new OmniEvidence('[ISO-14064-1]');
  public readonly memory = new OmniMemory();
  public readonly api = new OmniAPI();
  public readonly blackboard = new OmniBlackboard();
  public readonly healing = new OmniHealing();
  public readonly evolution = new OmniEvolution();
  public readonly seed = new OmniSeed();

  // Map of all agents (including clones) – key is uuid
  private agents = new Map<string, IOmniAgent>();
  // Track clones per topic for cleanup
  private clonesPerTopic = new Map<string, Set<string>>();

  constructor(opts?: {
    time?: OmniTime;
    evidence?: OmniEvidence;
    memory?: OmniMemory;
    api?: OmniAPI;
    blackboard?: OmniBlackboard;
    healing?: OmniHealing;
    evolution?: OmniEvolution;
    seed?: OmniSeed;
  }) {
    this.time = opts?.time ?? this.time;
    this.evidence = opts?.evidence ?? this.evidence;
    this.memory = opts?.memory ?? this.memory;
    this.api = opts?.api ?? this.api;
    this.blackboard = opts?.blackboard ?? this.blackboard;
    this.healing = opts?.healing ?? this.healing;
    this.evolution = opts?.evolution ?? this.evolution;
    this.seed = opts?.seed ?? this.seed;

    this.bus = new OmniAgentBus(this.registry, this);
    this.gateway = new OmniAgentGateway(this.bus);
  }

  /** Register a base agent (usually the first OA) */
  registerAgent(agent: IOmniAgent) {
    this.agents.set(agent.uuid, agent);
  }

  /** Static helper used by OAB to apply Hash Lock & freeze */
  public static lockAndFreeze<T extends IComponentCore>(obj: T): T {
    obj.evidence = obj.evidence || {};
    obj.evidence['hash_lock'] = `0xCELESTIAL_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    return Object.freeze(obj);
  }

  /** Clone an existing agent for a given topic */
  async cloneAgentForTopic(topic: string) {
    // Pick any existing agent as a template – here we simply take the first one.
    const base = this.agents.values().next().value as IOmniAgent;
    if (!base) return;
    const newUuid = crypto.randomUUID();
    const clone = base.clone(newUuid);
    this.agents.set(clone.uuid, clone);

    // Track clone under the topic for later cleanup
    if (!this.clonesPerTopic.has(topic)) this.clonesPerTopic.set(topic, new Set());
    this.clonesPerTopic.get(topic)!.add(clone.uuid);

    console.info(`[Ecosystem] Cloned OA ${base.uuid} -> ${clone.uuid} for topic "${topic}"`);
    // Register lifecycle hook to clean up when clone reaches FROZEN stage
    clone.registerHook("FROZEN", async () => {
      await this.cleanupClonesForTopic(topic);
    });
  }

  /** Cleanup cloned agents when the queue for a topic becomes empty */
  async cleanupClonesForTopic(topic: string) {
    const cloneIds = this.clonesPerTopic.get(topic);
    if (!cloneIds) return;
    cloneIds.forEach(uid => {
      const agent = this.agents.get(uid);
      if (agent) {
        // Freeze to lock state before removal – mimics hot-plug removal
        Object.freeze(agent);
        this.agents.delete(uid);
        console.info(`[Ecosystem] Removed cloned OA ${uid} for topic "${topic}"`);
      }
    });
    this.clonesPerTopic.delete(topic);
  }
}

// ------------------------------------------------------------
// Example bootstrap – only runs in non‑production environments
// ------------------------------------------------------------
if (process.env.NODE_ENV !== "production" && process.env.NODE_ENV !== "test") {
  const ecosystem = new OmniCoreEcosystem();
  // Create an initial OA instance and register it
  const rootAgent = new OmniAgent(
    makeCore<IComponentCore>({ uuid: crypto.randomUUID(), version: "1.0.0", evidence: {} })
  );
  ecosystem.registerAgent(rootAgent);

  // Example: publish some events to trigger back‑pressure cloning
  (async () => {
    // Example: publish some events to trigger back‑pressure cloning
    for (let i = 0; i < 1100; i++) {
      await ecosystem.bus.publish(
        makeCore<IBusEvent>({
          uuid: crypto.randomUUID(),
          version: "1.0.0",
          eventName: "data.clean",
          payload: { index: i },
          stage: "EMERGED",
          source_origin: "demo",
          topic: "data.clean",
          evidence: {},
          lifecycle_path: [],
        })
      );
    }
    // After processing you could clear the queue manually for demo purposes
  })();
}

