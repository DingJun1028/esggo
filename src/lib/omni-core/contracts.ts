/**
 * ==========================================
 * 🛡️ 萬能元件心核與基礎數據契約
 * ==========================================
 */

// 核心識別與數據完整性介面
export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
    evidence: {
    originCause: string;
    processTrace: string[];
    finalEffect: string;
    [key: string]: any;
  };
}

// 數據流轉狀態類型 (用於 Trackable 可追蹤 Hook)
export type LifecycleStage = 
  | 'EMERGED' 
  | 'ROUTING' 
  | 'MUTATED' 
  | 'VERIFIED' 
  | 'REPLAYED' 
  | 'FROZEN';

// 總線事件載荷 (整合 Traceable 溯源起點)
export interface IBusEvent<T = unknown> extends IComponentCore {
  readonly source_origin: string;
  readonly topic: string;
  readonly lifecycle_path: Array<{ stage: LifecycleStage; timestamp: number; node: string }>;
  readonly payload: T;
}

/**
 * ==========================================
 * 🔮 奇效組合介面定義 (OAB / OA / OAG)
 * ==========================================
 */

// 奇效六：全知蜂巢 - 共享黑板架構
export interface IBlackboard {
  getSharedKnowledge(key: string): unknown;
  contribute(key: string, value: unknown, providerUuid: string): void;
}

// OA: 智慧代理核心抽象
export interface IOmniAgent {
  readonly signature: IComponentCore;
  execute(event: IBusEvent): Promise<void>;
  onMartialLaw(reason: string): void;
}

// OAB: 代理數據總線契約 (整合細胞分裂與時空裂縫)
export interface IOmniAgentBus {
  publish(event: IBusEvent): Promise<void>;
  subscribe(topic: string, handler: (event: IBusEvent) => Promise<void>): void;
  replayEvents(startTime: number, endTime: number, topic?: string): Promise<void>;
  monitorBackpressure(topic: string, threshold: number): void;
}

// OAG: 代理安全網關契約 (整合先知預判與混沌自癒)
export interface IOmniAgentGateway {
  ingress(rawRequest: Record<string, unknown>): Promise<IBusEvent>;
  egress(event: IBusEvent): Promise<Record<string, unknown>>;
  predictAndPreFetch(intent: string): Promise<Array<IBusEvent>>;
  injectChaos(event: IBusEvent): IBusEvent;
}

/**
 * ==========================================
 * 🧫 萬能核心系統架構骨架實現
 * ==========================================
 */

export class OmniCoreEcosystem {
  private gateway!: IOmniAgentGateway;
  private bus!: IOmniAgentBus;
  private agents: Map<string, IOmniAgent> = new Map();

  private static hasEvidence(obj: unknown): obj is { evidence: Record<string, unknown> } {
    return typeof obj === 'object' && obj !== null && 'evidence' in obj;
  }

  // 核心禁區：鎖定數據並防止篡改的具體執行常式
  public static lockAndFreeze<T extends object>(obj: T): T {
    if (!OmniCoreEcosystem.hasEvidence(obj)) {
      (obj as { evidence: Record<string, unknown> }).evidence = {};
    }
    (obj as { evidence: Record<string, unknown> }).evidence['hash_lock'] = `0xCELESTIAL_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    return Object.freeze(obj);
  }
}

export type {
  IComponentCore as ComponentCore,
  IBusEvent as BusEvent,
  IOmniAgent as OmniAgent,
  IOmniAgentBus as OmniAgentBus,
  IOmniAgentGateway as OmniAgentGateway,
};