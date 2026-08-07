/**
 * OmniAgentBus — 共用型別 (對齊 oa-framework / omni-agent, 不依賴未 build 的 workspace 包)
 * 目的: 讓 OA 萬能分身的「圓通」骨幹獨立可驗證
 */
export type SubFrameId =
  | 'adk' | 'genkit' | 'agent0' | 'crewai'
  | 'agentreach' | 'deerflow' | 'tencent-mem';

export interface IComponentCore {
  readonly uuid: string;
  readonly version: string;
  readonly timestamp: number;
  evidence: Record<string, unknown>;
}

export interface OATaskResult {
  uuid: string;
  version: string;
  timestamp: number;
  subFrame: SubFrameId;
  output: string;
  t5: {
    traceable: boolean;
    trackable: boolean;
    tangible: boolean;
    transparent: boolean;
    trustworthy: boolean;
  };
  hashLock: string;
  evidence?: Record<string, unknown>;
}

export interface BusMessage<T = unknown> {
  id: string;
  topic: string;
  source: string;
  timestamp: number;
  payload: T;
  /** 5T 閘門標記: 通過為 true */
  passedGate?: boolean;
}

export type BusHandler<T = unknown> = (msg: BusMessage<T>) => void | Promise<void>;
