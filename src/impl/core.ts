// src/impl/core.ts
// ------------------------------------------------------------
// Implementation of OmniAgent ecosystem with back‑pressure cloning
// (奇效七：細胞分裂 – 動態代理增殖與熱插拔)
// ------------------------------------------------------------

import {
  IComponentCore,
  IBusEvent,
  LifecycleStage,
  ITaskSpec,
  ITaskResult,
  IOmniAgent,
  IOmniAgentBus,
  IOmniAgentGateway,
  ITimeTravelRegistry,
  IMartialLawEvent,
} from "../types/core-contract";

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
    for (const ev of this.store.values()) {
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
  // Queue per topic – each entry is an IBusEvent awaiting processing
  private queues = new Map<string, IBusEvent[]>();

  // Keep reference to ecosystem for cloning & cleanup
  constructor(
    private readonly registry: ITimeTravelRegistry,
    private readonly ecosystem: OmniCoreEcosystem
  ) {}

  /** Publish an event – store in registry, push to topic queue and run handlers */
  async publish(event: IBusEvent) {
    // Persist for time‑travel / replay
    await this.registry.record(event);

    const topic = event.topic ?? "*";
    if (!this.queues.has(topic)) this.queues.set(topic, []);
    this.queues.get(topic)!.push(event);

    // Run any subscribed handlers for this topic (fire‑and‑forget)
    const hs = this.handlers.get(topic) ?? [];
    for (const h of hs) await h(event);

    // After push, check back‑pressure for the topic
    await this.monitorBackpressure(topic, 1000);
  }

  subscribe(topic: string, handler: (event: IBusEvent) => Promise<void>) {
    if (!this.handlers.has(topic)) this.handlers.set(topic, []);
    this.handlers.get(topic)!.push(handler);
  }

  /** Back‑pressure monitoring – clone a new OA when queue exceeds threshold */
  async monitorBackpressure(topic: string, threshold: number) {
    const q = this.queues.get(topic) ?? [];
    if (q.length > threshold) {
      // Clone the first registered agent (or any base agent) via ecosystem
      await this.ecosystem.cloneAgentForTopic(topic);
    }
    // If queue becomes empty, clean up cloned agents for this topic
    if (q.length === 0) {
      await this.ecosystem.cleanupClonesForTopic(topic);
    }
  }

  async replayEvents(startTime: number, endTime?: number, topic?: string) {
    return this.registry.replay(startTime, endTime, topic);
  }

  async shadowTestIngress(event: IBusEvent) {
    const shadow = makeCore<IBusEvent>({
      ...event,
      version: "shadow-test",
    });
    await this.publish(shadow);
  }

  // The following two methods are required by the contract but are
  // delegated to the ecosystem – they remain no‑ops here.
  async cloneAgentIfNeeded(_: string, __: number) {}

  async monitorBackpressure(topic: string, threshold: number) {}
}

// ---------- 5️⃣ OmniAgentGateway (simplified) ----------
export class OmniAgentGateway implements IOmniAgentGateway {
  private martial = false;
  private reason = "";

  constructor(private readonly bus: IOmniAgentBus) {}

  async ingress(event: IBusEvent) {
    const valid = !!event.hashLock && !!event.evidence?.hash;
    if (!valid) {
      this.onMartialLaw("evidence mismatch");
      // Broadcast martial‑law event via bus
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
      });
      return Object.freeze(event);
    }
    // Apply Hash Lock & freeze before forwarding
    const locked = Object.freeze({ ...event, hashLock: crypto.randomUUID() });
    return locked;
  }

  async secureForward(event: IBusEvent) {
    const locked = Object.freeze({ ...event, hashLock: crypto.randomUUID() });
    // Simulate external forwarding – replace with real HTTP/DB call
    return { status: "forwarded", hash: locked.hashLock };
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
  isUnderMartialLaw() {
    return this.martial;
  }
}

// ---------- 6️⃣ Ecosystem – wires everything together ----------
export class OmniCoreEcosystem {
  public readonly registry = new TimeTravelRegistry();
  public readonly bus: OmniAgentBus;
  public readonly gateway: OmniAgentGateway;

  // Map of all agents (including clones) – key is uuid
  private agents = new Map<string, IOmniAgent>();
  // Track clones per topic for cleanup
  private clonesPerTopic = new Map<string, Set<string>>();

  constructor() {
    this.bus = new OmniAgentBus(this.registry, this);
    this.gateway = new OmniAgentGateway(this.bus);
  }

  /** Register a base agent (usually the first OA) */
  registerAgent(agent: IOmniAgent) {
    this.agents.set(agent.uuid, agent);
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

    console.info(`[Ecosystem] Cloned OA ${base.uuid} → ${clone.uuid} for topic "${topic}"`);
    // Optionally, you could auto‑subscribe the clone to the same topic handlers
  }

  /** Cleanup cloned agents when the queue for a topic becomes empty */
  async cleanupClonesForTopic(topic: string) {
    const cloneIds = this.clonesPerTopic.get(topic);
    if (!cloneIds) return;
    for (const uid of cloneIds) {
      const agent = this.agents.get(uid);
      if (agent) {
        // Freeze to lock state before removal – mimics hot‑plug removal
        Object.freeze(agent);
        this.agents.delete(uid);
        console.info(`[Ecosystem] Removed cloned OA ${uid} for topic "${topic}"`);
      }
    }
    this.clonesPerTopic.delete(topic);
  }

  /** Static helper used by OAB to apply Hash Lock & freeze */
  public static lockAndFreeze<T extends object>(obj: T): T {
    (obj as any).evidence = (obj as any).evidence || {};
    (obj as any).evidence["hash_lock"] = `0xCELESTIAL_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    return Object.freeze(obj);
  }
}

// ------------------------------------------------------------
// Example bootstrap – can be removed in production
// ------------------------------------------------------------
const ecosystem = new OmniCoreEcosystem();
// Create an initial OA instance and register it
const rootAgent = new OmniAgent(
  makeCore<IComponentCore>({ uuid: crypto.randomUUID(), version: "1.0.0", evidence: {} })
);
ecosystem.registerAgent(rootAgent);

// Example: publish some events to trigger back‑pressure cloning
(async () => {
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
      })
    );
  }
  // After processing you could clear the queue manually for demo purposes
})();
